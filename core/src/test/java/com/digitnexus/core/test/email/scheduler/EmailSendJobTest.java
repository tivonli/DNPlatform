package com.digitnexus.core.test.email.scheduler;

import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.scheduler.EmailSendJob;
import com.digitnexus.core.email.service.EmailService;
import com.digitnexus.core.test.dao.BaseDaoTest;

public class EmailSendJobTest extends BaseDaoTest {
	@Autowired
	private EmailService emailService;
	@Autowired
	private BaseDao baseDao;
	
	@Test(groups = { "unit" })
	public void doExecuteInternal() throws JobExecutionException{
		Email email = new Email();
		email.setTo("autoidtestadmin@digitnexus.com");
		email.setSubject("test");
		email.setBody("test");
		
		emailService.publishEmail(email);
		
		Assert.assertFalse(baseDao.getAll(Email.class).isEmpty());
		
		EmailSendJob emailSendJob=new EmailSendJob();
		emailSendJob.doExecuteInternal(null);
		
		
		Assert.assertTrue(baseDao.getAll(Email.class).isEmpty());
		
	}
}
