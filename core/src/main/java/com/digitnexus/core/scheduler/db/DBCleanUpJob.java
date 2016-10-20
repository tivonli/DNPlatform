package com.digitnexus.core.scheduler.db;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.digitnexus.core.scheduler.TransactionalJobBean;

/**
 * Job used for deleting unnecessary or expired records from db
 * @author Adi
 *
 */
public class DBCleanUpJob extends TransactionalJobBean {
	

	@Override
	protected void doExecuteInternal(JobExecutionContext context) throws JobExecutionException {
		// TODO Auto-generated method stub

	}

}
