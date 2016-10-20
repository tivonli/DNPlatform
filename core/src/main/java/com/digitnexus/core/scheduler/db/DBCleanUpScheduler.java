package com.digitnexus.core.scheduler.db;

import org.quartz.SimpleTrigger;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import com.digitnexus.core.scheduler.MessageSchedulerBean;

@Component
public class DBCleanUpScheduler extends MessageSchedulerBean {

	@Override
	protected Class<? extends QuartzJobBean> getJobClass() {
		return DBCleanUpJob.class;
	}

	@Override
	protected String getJobName() {
		return "DB Clean up Job";
	}

	@Override
	protected int getRepeatCount() {
		return SimpleTrigger.REPEAT_INDEFINITELY;
	}

	@Override
	protected long getRepeatInterval() {
		//Every 5 minutes
		return  300000;
	}

}
