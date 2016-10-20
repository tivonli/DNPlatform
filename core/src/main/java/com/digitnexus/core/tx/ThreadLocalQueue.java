package com.digitnexus.core.tx;

import java.util.LinkedList;
import java.util.Queue;
/**
 * Wrapper over Queue which manages Queue in thread local variables. 
 * @author Adi. 
 *
 * @param <T>
 */
public class ThreadLocalQueue<T>{
	private ThreadLocal<Queue<T>> threadLocalQueue=new ThreadLocal<Queue<T>>();
	
	public boolean push(T object) {
		return getQueue().offer(object);
	}
	
	public T poll() {
		return getQueue().poll();
	}
	
	public Queue<T> getAllQueuedMessage() {
		return getQueue();
	}
	
	public void clearQueue() {
		getQueue().clear();
	}
	
	private Queue<T> getQueue() {
		Queue<T> dataQueue = threadLocalQueue.get();
		if (dataQueue == null) {
			dataQueue = new LinkedList<T>();
			threadLocalQueue.set(dataQueue);
		}
		return dataQueue;
	}
}
