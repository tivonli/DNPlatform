package com.digitnexus.core.scheduler;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.quartz.Job;
import org.quartz.Trigger;

public class JobSchedule {
	
	
	private String name;
    private Class<? extends Job> jobClass;
    private Map<String, Serializable> jobDataMap = new HashMap<String, Serializable>();
    
    private String triggerName;
    private int priority = Trigger.DEFAULT_PRIORITY;
    private Date startTime = new Date();
    private long repeatInterval = 3600000;
    private int repeatCount;
    private String cronExpression;
    
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the triggerName
	 */
	public String getTriggerName() {
		return triggerName;
	}
	/**
	 * @param triggerName the triggerName to set
	 */
	public void setTriggerName(String triggerName) {
		this.triggerName = triggerName;
	}
	/**
	 * @return the jobClass
	 */
	public Class<? extends Job> getJobClass() {
		return jobClass;
	}
	/**
	 * @param jobClass the jobClass to set
	 */
	public void setJobClass(Class<? extends Job> jobClass) {
		this.jobClass = jobClass;
	}
	/**
	 * @return the jobDataMap
	 */
	public Map<String, Serializable> getJobDataMap() {
		return jobDataMap;
	}
	/**
	 * @param jobDataMap the jobDataMap to set
	 */
	public void setJobDataMap(Map<String, Serializable> jobDataMap) {
		this.jobDataMap = jobDataMap;
	}
	/**
	 * @return the priority
	 */
	public int getPriority() {
		return priority;
	}
	/**
	 * @param priority the priority to set
	 */
	public void setPriority(int priority) {
		this.priority = priority;
	}
	/**
	 * @return the startTime
	 */
	public Date getStartTime() {
		return startTime;
	}
	/**
	 * @param startTime the startTime to set
	 */
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	/**
	 * @return the repeatInterval
	 */
	public long getRepeatInterval() {
		return repeatInterval;
	}
	/**
	 * @param repeatInterval the repeatInterval to set in milliseconds
	 */
	public void setRepeatInterval(long repeatInterval) {
		this.repeatInterval = repeatInterval;
	}
	/**
	 * @return the repeatCount
	 */
	public int getRepeatCount() {
		return repeatCount;
	}
	/**
	 * @param repeatCount the repeatCount to set
	 */
	public void setRepeatCount(int repeatCount) {
		this.repeatCount = repeatCount;
	}
	/**
	 * @return the cronExpression
	 */
	public String getCronExpression() {
		return cronExpression;
	}
	/**
	 * @param cronExpression the cronExpression to set
	 */
	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}
}
