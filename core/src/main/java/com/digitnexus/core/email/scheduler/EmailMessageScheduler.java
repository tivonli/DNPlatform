package com.digitnexus.core.email.scheduler;

import org.quartz.SimpleTrigger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import com.digitnexus.core.scheduler.MessageSchedulerBean;

@Component
public class EmailMessageScheduler extends MessageSchedulerBean {

	// name of the email message transmission job
	private static final String EMAIL_MESSAGE_RECEIVE_JOB_NAME = "EmailMessageSend";
	
	// transmission job interval in milliseconds maxProcessCounter
	@Value("${email.repeatInterval}")
	private long jobIntervalMillis;
    
	@Value("${email.numberOfRetries}")
	private int maxAttemptCount;

	@Override
	protected Class<? extends QuartzJobBean> getJobClass() {
		return EmailSendJob.class;
	}

	@Override
	protected String getJobName() {
		return EMAIL_MESSAGE_RECEIVE_JOB_NAME;
	}

	@Override
	protected int getRepeatCount() {
		return SimpleTrigger.REPEAT_INDEFINITELY;
	}

	@Override
	protected long getRepeatInterval() {
//		this.jobIntervalMillis = ConfigUtil.getConfig().getLong("email.repeatInterval", 600000);
		return jobIntervalMillis;
	}

//	public void setReceiveJobIntervalMillis(long jobIntervalMilliSeconds) {
//		this.jobIntervalMillis = jobIntervalMilliSeconds;
//	}

	public int getMaxAttemptCount() {
//		this.maxAttemptCount = ConfigUtil.getConfig().getInt("email.repeatInterval", 3);
		return maxAttemptCount;
	}

//	public void setMaxAttemptCount(int maxAttemptCount) {
//		this.maxAttemptCount = maxAttemptCount;
//	}

}
