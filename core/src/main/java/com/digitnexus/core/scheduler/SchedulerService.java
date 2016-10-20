package com.digitnexus.core.scheduler;

import java.util.Date;

public interface SchedulerService {
	public Date scheduleJob(JobSchedule jobSchedule);
	
	public void resumeJob(String jobName, String jobGroup);

	boolean existsJob(String jobName, String jobGroup);
}
