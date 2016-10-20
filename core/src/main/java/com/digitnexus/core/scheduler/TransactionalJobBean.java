package com.digitnexus.core.scheduler;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import com.digitnexus.core.spring.ServiceLocator;

public abstract class TransactionalJobBean extends QuartzJobBean {
	private final Logger logger=LoggerFactory.getLogger(getClass());
	
	private TransactionTemplate transactionTemplate;

	@Override
	protected void executeInternal(final JobExecutionContext context) throws JobExecutionException {
		TransactionTemplate transactionTemplate=getTransactionTemplate();
		//Can be null if the job is triggered before application context is properly initialized
		if(transactionTemplate!=null){
			//transaction template we will use for the current transaction
    		TransactionTemplate currentTransactionTemplate = new  TransactionTemplate();
    		//set the transaction manager from the common one
    		currentTransactionTemplate.setTransactionManager(transactionTemplate.getTransactionManager());
    		//and is propagation required
    		currentTransactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
    		//then execute...
    		currentTransactionTemplate.execute(new TransactionCallbackWithoutResult(){
    			public void doInTransactionWithoutResult(TransactionStatus status){
    				try {
    				  doExecuteInternal(context);
    				} catch (JobExecutionException e) {
    					logger.error("Error executing job,"+context.getJobDetail().getJobClass().getName(),e);
    				}
    			}
    			
    		});
		}

	}
	
	protected abstract void doExecuteInternal(JobExecutionContext context) throws JobExecutionException;

	public TransactionTemplate getTransactionTemplate() {
		if(transactionTemplate==null){
			transactionTemplate=ServiceLocator.getService(TransactionTemplate.class);
		}
		return transactionTemplate;
	}

}
