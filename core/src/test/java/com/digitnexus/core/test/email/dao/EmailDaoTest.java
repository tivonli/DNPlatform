package com.digitnexus.core.test.email.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.dao.EmailDao;
import com.digitnexus.core.email.scheduler.EmailMessageScheduler;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * @author adi
 */
public class EmailDaoTest extends BaseTransactionalTest {
	@Autowired
	private EmailDao emailDao;
	@Autowired
	private EmailMessageScheduler emailMessageScheduler;
	@Autowired
	private EntityService entityService;
	
	
	@Test(groups = { "unit" })
	public void findEmailMsgsByMaxAttempt(){
		Email email=getEmail();
		entityService.saveOrUpdate(email);
		List<Email> emails=emailDao.findEmailMsgsByMaxAttempt();
		Assert.assertEquals(emails.size(), 1);
		Assert.assertEquals(emails.get(0), email);
		
		Email otherEmail=getEmail();
		otherEmail.setLoopCounter(emailMessageScheduler.getMaxAttemptCount());
		entityService.saveOrUpdate(otherEmail);
		emails=emailDao.findEmailMsgsByMaxAttempt();
		Assert.assertEquals(emails.size(), 1);
		Assert.assertEquals(emails.get(0), email);
	}


	private Email getEmail() {
		Email email=new Email();
		email.setTo("to@test.com");
		email.setFrom("from@test.com");
		email.setSubject("Test Subject");
		email.setBody("Body");
		email.setInlineHtml(true);
		email.setHost("smpt.test.com");
		email.setSent(false);
		return email;
	}

}
