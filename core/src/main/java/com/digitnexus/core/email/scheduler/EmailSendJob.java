/**
 * 
 */
package com.digitnexus.core.email.scheduler;

import java.util.ArrayList;
import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.dao.EmailDao;
import com.digitnexus.core.email.service.EmailService;
import com.digitnexus.core.scheduler.TransactionalJobBean;
import com.digitnexus.core.spring.ServiceLocator;

/**
 * @author Adi
 * 
 */
public class EmailSendJob extends TransactionalJobBean {
	private static final Logger					LOGGER					= LoggerFactory.getLogger(EmailSendJob.class);
	private static final EmailDao				emailDao				= ServiceLocator.getService(EmailDao.class);
	private static final EmailMessageScheduler	emailMessageScheduler	= ServiceLocator.getService(EmailMessageScheduler.class);
	private static final EmailService			emailService			= ServiceLocator.getService(EmailService.class);

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.scheduler.TransactionalJobBean#doExecuteInternal(
	 * org.quartz.JobExecutionContext)
	 */
	@Override
	public void doExecuteInternal(JobExecutionContext context) throws JobExecutionException {
		List<Email> emails = emailDao.findEmailMsgsByMaxAttempt();
		List<Email> failedMessages = new ArrayList<Email>();

		if (!emails.isEmpty()) {
			List<Email> deleteMsgList = new ArrayList<Email>();
			for (Email msg : emails) {
				try {
					//Send individual email message
					emailService.sendEmail(msg);
					//add the message to a list to be deleted
					deleteMsgList.add(msg);
				} catch (Throwable t) { 
					LOGGER.warn("Error sending mail", t);
					// Update number of attempts to send particular
					msg.setLoopCounter(msg.getLoopCounter() + 1); 
					if (msg.getLoopCounter() == emailMessageScheduler.getMaxAttemptCount()) {
						deleteMsgList.add(msg);
					} else {
						failedMessages.add(msg);
					}
				}
			}

			if (!deleteMsgList.isEmpty()) {
				emailDao.deleteAll(deleteMsgList);
			}

			if (!failedMessages.isEmpty()) {
				emailDao.saveOrUpdateAll(failedMessages);
			}
		}

	}

}
