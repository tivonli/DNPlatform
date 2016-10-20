package com.digitnexus.core.test.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.service.EmailService;
import com.digitnexus.core.test.BaseTest;
import com.dumbster.smtp.SimpleSmtpServer;

public class EmailServiceTest   extends BaseTest{
	
	@Autowired
	private EmailService emailService;
	@Autowired
	private SimpleSmtpServer emailServer;
		
	
	@Test(groups = { "unit" })
	public void sendEmail(){
		int emailCount=emailServer.getReceivedEmailSize();
		emailService.sendEmail(getEmail());
		Assert.assertEquals(emailServer.getReceivedEmailSize(), emailCount+1);
	}
	
	@Test(groups = { "unit" })
	public void publishEmail(){
		Email email=getEmail();
		emailService.publishEmail(email);
		Assert.assertTrue(email.getId()>0);
	}
	
	@Test(groups = { "unit" })
	public void sendMailAfterTransaction(){
		Email email=getEmail();
		emailService.sendMailAfterTransaction(email);
		//TODO:How do we test this?
		//Simulating after commit scenario
		/*int numberOfMails=baseDao.getAll(Email.class).size();
		
		TransactionSynchronizationAdaptor<Email> transactionSynchronizationAdaptor=(TransactionSynchronizationAdaptor<Email>) emailService;
		transactionSynchronizationAdaptor.afterCommit();
		Assert.assertEquals(baseDao.getAll(Email.class).size(),numberOfMails+1);*/
	}
	
	private Email getEmail(){
		Email email = new Email();
		email.setTo("autoidtestadmin@digitnexus.com");
		email.setSubject("test");
		email.setBody("test");
		return email;
	}
}
