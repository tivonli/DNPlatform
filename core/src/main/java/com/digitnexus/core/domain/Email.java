package com.digitnexus.core.domain;

import java.io.IOException;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.SQLException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.io.IOUtils;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.exception.DigitNexusRuntimeException;
import com.digitnexus.core.util.HibernateUtil;


@Entity
@Table(name = "EMAIL")
public class Email extends DataObject {
	private static transient final Logger LOGGER=LoggerFactory.getLogger(Email.class);

	private static final long	serialVersionUID	= 1L;
	private long				id;
	private String				to;
	private String				from;
	private String				subject;
	private String				body;
	private boolean				inlineHtml;
	private String				host;
	private byte[]				attachment;
	private String				attachmentName;
	private boolean				sent;
	private int					loopCounter;
	private Blob				attachmentAsBlob;
	private Clob                bodyAsClob;

	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "to_address",nullable=false)
	public String getTo() {
		return to;
	}
   
	public Email setTo(String to) {
		this.to = to;
		return this;
	}
    
	@Column(name = "from_address")
	public String getFrom() {
		return from;
	}

	public Email setFrom(String from) {
		this.from = from;
		return this;
	}
    
	@Column(name = "subject",nullable=false)
	public String getSubject() {
		return subject;
	}

	public Email setSubject(String subject) {
		this.subject = subject;
		return this;
	}
    
	@Transient
	public String getBody() {
		return body;
	}

	public Email setBody(String body) {
		this.body = body;
		return this;
	}

	@Column(name = "inline_html")
	@Type(type = "yes_no")
	public boolean isInlineHtml() {
		return inlineHtml;
	}

	public Email setInlineHtml(boolean inlineHtml) {
		this.inlineHtml = inlineHtml;
		return this;
	}

	@Column(name = "host")
	public String getHost() {
		return host;
	}

	public Email setHost(String host) {
		this.host = host;
		return this;
	}

	@Transient
	public byte[] getAttachment() {
		return attachment;
	}

	public Email setAttachment(byte[] attachment) {
		this.attachment = attachment;
		return this;
	}

	@Column(name = "attachment_name")
	public String getAttachmentName() {
		return attachmentName;
	}

	public Email setAttachmentName(String attachmentName) {
		this.attachmentName = attachmentName;
		return this;
	}

	@Column(name = "loop_counter")
	public int getLoopCounter() {
		return loopCounter;
	}

	public Email setLoopCounter(int loopCounter) {
		this.loopCounter = loopCounter;
		return this;
	}

	
	@Column(name = "attachment")
	public Blob getAttachmentAsBlob() {
		if (attachment != null) {
			attachmentAsBlob = HibernateUtil.createBlob(attachment);
		}
		return attachmentAsBlob;
	}

	public Email setAttachmentAsBlob(Blob attachmentAsBlob) {
		this.attachmentAsBlob = attachmentAsBlob;
		try {
			if (attachmentAsBlob != null) {
				attachment = IOUtils.toByteArray(attachmentAsBlob.getBinaryStream());
			}
		} catch (SQLException e) {
			LOGGER.error("Error converting attachment blob to bytes", e);
			throw new DigitNexusRuntimeException(e);
		} catch (IOException e) {
			LOGGER.error("Error converting attachment blob to bytes", e);
			throw new DigitNexusRuntimeException(e);
		}
		return this;
	}
    
	@Column(name = "sent")
	@Type(type = "yes_no")
	public boolean isSent() {
		return sent;
	}

	public Email setSent(boolean sent) {
		this.sent = sent;
		return this;
	}
	
	@Column(name = "body",nullable=false)
	public Clob getBodyAsClob() {
		bodyAsClob=HibernateUtil.createClob(body);
		return bodyAsClob;
	}

	public void setBodyAsClob(Clob bodyAsClob) {
		this.bodyAsClob = bodyAsClob;
		try {
			body=IOUtils.toString(bodyAsClob.getCharacterStream());
		} catch (IOException e) {
			LOGGER.error("Error converting body clob to String", e);
			throw new DigitNexusRuntimeException(e);
		} catch (SQLException e) {
			LOGGER.error("Error converting body clob to String", e);
			throw new DigitNexusRuntimeException(e);
		}
	}

}
