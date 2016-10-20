/**
 * 
 */
package com.digitnexus.core.test.nosql.attachment;

import java.io.InputStream;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.digitnexus.core.web.ui.config.annotation.Attachment;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * @author Santanu
 *
 */
@Document
@View
public class TestAttachmentEntity {
	@Id
	private String id;
	private String stringProperty;
	private int integerProperty;
	private Date dateProperty;
	private InputStream attachment;
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the stringProperty
	 */
	public String getStringProperty() {
		return stringProperty;
	}
	/**
	 * @param stringProperty the stringProperty to set
	 */
	public void setStringProperty(String stringProperty) {
		this.stringProperty = stringProperty;
	}
	/**
	 * @return the integerProperty
	 */
	public int getIntegerProperty() {
		return integerProperty;
	}
	/**
	 * @param integerProperty the integerProperty to set
	 */
	public void setIntegerProperty(int integerProperty) {
		this.integerProperty = integerProperty;
	}
	/**
	 * @return the dateProperty
	 */
	public Date getDateProperty() {
		return dateProperty;
	}
	/**
	 * @param dateProperty the dateProperty to set
	 */
	public void setDateProperty(Date dateProperty) {
		this.dateProperty = dateProperty;
	}
	/**
	 * @return the attachment
	 */
	@Attachment
	public InputStream getAttachment() {
		return attachment;
	}
	/**
	 * @param attachment the attachment to set
	 */
	public void setAttachment(InputStream attachment) {
		this.attachment = attachment;
	}
}
