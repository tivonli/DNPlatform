package com.digitnexus.core.email.service;

import java.util.Locale;
import java.util.Map;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.email.scheduler.EmailSendJob;

public interface EmailService {
	/**
	 * Try to send mail immediately. Any errors in sending mail will be propagated to calling method
	 * @param email
	 */
	public void sendEmail(Email email);
	
	/**
	 * Saves mail to db. The time of sending mail depends on scheduling of {@link EmailSendJob}. Use this method if 
	 * send mail only the transaction succeeds and does not care when it is sent
	 * @param email
	 */
	public void publishEmail(Email email);
	
	/**
	 * Mail will be send immediately after transaction succeeds.If there is any failure in sending the mail at this point, 'publishEmail' method will be called.
	 * Use this method if email send should not interrupt the transaction and  mail should be immediately sent as soon as transaction is complete
	 * @param email
	 */
	public void sendMailAfterTransaction(Email email);
	
	/**
	 * Populates email content from given freemarker template name
	 * @param email
	 * @param templateName
	 * @param templateModel
	 */
	public void populateBodyFromTemplate(Email email,String templateName,Map<String, Object> templateModel);
	
	/**
	 * Populates email content from given freemarker template name
	 * @param email
	 * @param templateName
	 * @param templateModel
	 * @param locale
	 */
	public void populateBodyFromTemplate(Email email,String templateName,Map<String, Object> templateModel,Locale locale);
}
