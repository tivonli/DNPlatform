package com.digitnexus.core.scheduler;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

public abstract class MessageSchedulerBean implements InitializingBean {
	@Autowired
	private SchedulerService	schedulerService;
	@Autowired
	private TransactionTemplate	transactionTemplate;

	@Override
	public void afterPropertiesSet() throws Exception {
		//schedule the job in a transaction...better to follow the transaction semantics
				TransactionTemplate currentTransactionTemplate = new TransactionTemplate();
				currentTransactionTemplate.setTransactionManager(transactionTemplate.getTransactionManager());
				//make it a new transaction always
				currentTransactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
				//now do the actual work
				currentTransactionTemplate.execute(new TransactionCallbackWithoutResult() {
					@Override
					protected void doInTransactionWithoutResult(TransactionStatus status) {
						//well, does the job exist? if not then only schedule one
						if (!schedulerService.existsJob(getJobName(), null)) {
							//create the schedule object with all required properties
							JobSchedule jobSchedule = new JobSchedule();
							jobSchedule.setName(getJobName());
							jobSchedule.setJobClass(getJobClass());
							jobSchedule.setRepeatCount(getRepeatCount());
							//lets make it run every ten seconds
							jobSchedule.setRepeatInterval(getRepeatInterval());
							//schedule it
							schedulerService.scheduleJob(jobSchedule);
						} else {
							//there exists a job. resume that
							schedulerService.resumeJob(getJobName(), null);
						}
					}
				});

	}
	
	/**
	 * 
	 * @return
	 */
	protected abstract Class<? extends QuartzJobBean> getJobClass();
	
	/**
	 * 
	 * @return
	 */
	protected abstract String getJobName();
	
	/**
	 * 
	 * @return
	 */
	protected abstract int getRepeatCount();
	
	/**
	 * 
	 * @return
	 */
	protected abstract long getRepeatInterval();

}
