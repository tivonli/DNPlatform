package com.digitnexus.core.tx;

import java.util.LinkedList;
import java.util.Queue;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;

/**
 * Simple {@link TransactionSynchronization} adapter containing empty method
 * implementations, for easier overriding of single methods to provide
 * implementations to manage data in queue and give call back with data so that
 * subclasses do not need to take care of managing data and can concentrate on
 * what to do with data If this implementation does not satisfy your needs check
 * {@link TransactionSynchronizationAdapter}
 * 
 * <p>
 * Also implements the {@link Ordered} interface to enable the execution order
 * of synchronizations to be controlled declaratively. The default
 * {@link #getOrder() order} is {@link Ordered#LOWEST_PRECEDENCE}, indicating
 * late execution; return a lower value for earlier execution.
 * 
 * It takes care of registering with {@link TransactionSynchronizationRegistry}
 */
public abstract class TransactionSynchronizationAdaptor<T> extends TransactionSynchronizationAdapter implements InitializingBean{
	private ThreadLocalQueue<T>	threadLocalQueue	= new ThreadLocalQueue<T>();
	private Queue<Queue<T>>		suspendedDataQueues	= new LinkedList<Queue<T>>();
	@Autowired
	private TransactionSynchronizationRegistry transactionSynchronizationRegistry;
	

	@Override
	public int getOrder() {
		return Ordered.LOWEST_PRECEDENCE;
	}

	@Override
	public void suspend() {
		// we are about to suspend the transaction. so we get the current
		// data
		Queue<T> dataQueue = threadLocalQueue.getAllQueuedMessage();
		if (dataQueue != null && !dataQueue.isEmpty()) {
			// then put it in the local queue
			suspendedDataQueues.offer(new LinkedList<T>(dataQueue));
			// and clear the actual one so that some other transaction does not
			// clear that
			threadLocalQueue.clearQueue();
		}

	}

	@Override
	public void resume() {
		// put all the suspended data back to the queue
		Queue<T> dataQueue = suspendedDataQueues.poll();
		// need to work only if we had something while suspending
		if (dataQueue != null && !dataQueue.isEmpty()) {
			// clear whatever is there now
			threadLocalQueue.clearQueue();
			// then put what was before suspension
			threadLocalQueue.getAllQueuedMessage().addAll(dataQueue);
		}

	}

	@Override
	public void afterCommit() {
		if(!threadLocalQueue.getAllQueuedMessage().isEmpty()){
			doAfterCommit(threadLocalQueue.getAllQueuedMessage());
		}

	}
	

	public abstract void doAfterCommit(Queue<T> allQueuedMessage);

	@Override
	public void afterCompletion(int status) {
		//We don't care about the status, just clear the queue
		threadLocalQueue.clearQueue();
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		transactionSynchronizationRegistry.addTransactionSyncronization(this);
		
	}

	protected ThreadLocalQueue<T> getQueue() {
		return threadLocalQueue;
	}

}
