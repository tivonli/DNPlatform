package com.digitnexus.core.email.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Queue;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.dao.EmailDao;
import com.digitnexus.core.freemarker.FreemarkerService;
import com.digitnexus.core.tx.TransactionSynchronizationAdaptor;


@Service
public class EmailServiceImpl extends TransactionSynchronizationAdaptor<Email> implements EmailService {
	private final Logger	logger	= LoggerFactory.getLogger(getClass());
	@Autowired
	private TransactionTemplate	transactionTemplate;
	@Autowired
	private EmailDao			emailDao;
	@Autowired
	private JavaMailSender		javaMailSender;
	@Autowired
	private FreemarkerService	freemarkerService;

	@Value("${email.from}")
	private String				from;

	@Override
	public void sendEmail(final Email email) {
		javaMailSender.send(new MimeMessagePreparator() {
			public void prepare(MimeMessage mimeMessage) throws MessagingException {
				MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true);
				if (StringUtils.isBlank(email.getFrom())) {
					message.setFrom(from);
				} else {
					message.setFrom(email.getFrom());
				}
				message.setTo(email.getTo());
				message.setSubject(email.getSubject());
				mimeMessage.setContent(email.getBody(), "text/html;charset=utf-8");
				if (email.getAttachment() != null) {
					message.addAttachment(email.getAttachmentName(), new ByteArrayResource(email.getAttachment()));
				}
			}

		});

	}

	@Override
	public void publishEmail(Email email) {
		emailDao.save(email);

	}

	@Override
	public void doAfterCommit(Queue<Email> allQueuedMessage) {
		//Save messages and continue so that transaction will not be blocked if email server is down
		final List<Email> emailMessages = new ArrayList<Email>(allQueuedMessage.size());
		emailMessages.addAll(allQueuedMessage);
	

		if (!emailMessages.isEmpty()) {
			transactionTemplate.execute(new TransactionCallbackWithoutResult() {
				@Override
				protected void doInTransactionWithoutResult(TransactionStatus status) {
					emailDao.saveOrUpdateAll(emailMessages);

				}
			});
		}
	}

	@Override
	public void sendMailAfterTransaction(Email email) {
		getQueue().push(email);
	}

	@Override
	public void populateBodyFromTemplate(Email email, String templateName, Map<String, Object> templateModel) {
		email.setBody(freemarkerService.processTemplateIntoString(templateName, templateModel));
	}

	@Override
	public void populateBodyFromTemplate(Email email, String templateName, Map<String, Object> templateModel, Locale locale) {
		email.setBody(freemarkerService.processTemplateIntoString(templateName, templateModel,locale));
		
	}

}
