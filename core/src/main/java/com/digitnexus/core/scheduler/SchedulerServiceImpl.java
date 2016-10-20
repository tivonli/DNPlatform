/**
 * 
 */
package com.digitnexus.core.scheduler;

import java.util.Date;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang.StringUtils;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.scheduling.SchedulingException;
import org.springframework.stereotype.Service;

/**
 * @author Adi
 * 
 */
@Service
public class SchedulerServiceImpl implements SchedulerService {

	@Inject
	@Named("schedulerFactoryBean")
	private Scheduler scheduler;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.scheduler.SchedulerService#scheduleJob(com.digitnexus
	 * .core.scheduler.JobSchedule)
	 */
	@Override
	public Date scheduleJob(JobSchedule jobSchedule) {
		try {
			// create the job detail object
			JobDetail jobDetail = createJobDetail(jobSchedule);
			// create the simple trigger
			Trigger trigger = createSimpleTrigger(jobSchedule);
			// schedule the job
			return scheduler.scheduleJob(jobDetail, trigger);
		} catch (SchedulerException e) {
			throw new SchedulingException("Failed while scheduling job", e);
		}
	}

	@Override
	public void resumeJob(String jobName, String jobGroup) {
		try {
			// if the group is null then assume default group
			if (StringUtils.isBlank(jobGroup)) {
				jobGroup = Scheduler.DEFAULT_GROUP;
			}
			// ask the scheduler to resume the job
			// scheduler.resumeJob(jobName,jobGroup);
			scheduler.resumeJob(JobKey.jobKey(jobName, jobGroup));
		} catch (SchedulerException e) {
			throw new SchedulingException("Failed to pause job " + jobName, e);
		}

	}

	@Override
	public boolean existsJob(String jobName, String jobGroup) {
		try {
			// if the job detail identified by the job name and id is not null
			// then we assume that to exist

			return (scheduler.getJobDetail(JobKey.jobKey(jobName, jobGroup)) != null);
		} catch (SchedulerException e) {
			throw new SchedulingException("Failed check existance of job "
			        + jobName, e);
		}
	}

	private JobDetail createJobDetail(JobSchedule jobSchedule) {
		JobDetail jobDetail = JobBuilder.newJob(jobSchedule.getJobClass())
		        .withIdentity(jobSchedule.getName())
		        .usingJobData(new JobDataMap(jobSchedule.getJobDataMap()))
		        .build();

		// JobDetail jobDetail = new JobDetail();
		// jobDetail.setName(jobSchedule.getName());
		// jobDetail.setJobClass(jobSchedule.getJobClass());
		// jobDetail.setJobDataMap(new JobDataMap(jobSchedule.getJobDataMap()));
		return jobDetail;
	}

	private Trigger createSimpleTrigger(JobSchedule jobSchedule) {
		String triggerName = StringUtils.isBlank(jobSchedule.getTriggerName()) ? jobSchedule
		        .getName() + "Trigger"
		        : jobSchedule.getTriggerName();
		int count = jobSchedule.getRepeatCount();
		Trigger trigger = null;
		if (count < 0) {
			trigger = TriggerBuilder.newTrigger()
			        .withIdentity(triggerName)
			        .startAt(jobSchedule.getStartTime())
			        .withPriority(jobSchedule.getPriority())
			        // .forJob(createJobDetail(jobSchedule))
			        .withSchedule(
			                SimpleScheduleBuilder
			                        .simpleSchedule()
			                        .withIntervalInMilliseconds(
			                                jobSchedule.getRepeatInterval())
			                        .repeatForever()).build();
		} else {
			trigger = TriggerBuilder
			        .newTrigger()
			        .withIdentity(triggerName)
			        .startAt(jobSchedule.getStartTime())
			        .withPriority(jobSchedule.getPriority())
			        // .forJob(createJobDetail(jobSchedule))
			        .withSchedule(
			                SimpleScheduleBuilder.repeatSecondlyForTotalCount(
			                        count,
			                        (int) jobSchedule.getRepeatInterval() / 1000))
			        .build();
		}
		// SimpleTrigger trigger = new SimpleTrigger();
		// trigger.setName(StringUtils.isBlank(jobSchedule.getTriggerName()) ?
		// jobSchedule
		// .getName() + "Trigger"
		// : jobSchedule.getTriggerName());
		// trigger.setPriority(jobSchedule.getPriority());
		// trigger.setStartTime(jobSchedule.getStartTime());
		// trigger.setRepeatCount(jobSchedule.getRepeatCount());
		// trigger.setRepeatInterval(jobSchedule.getRepeatInterval());
		return trigger;
	}
}
