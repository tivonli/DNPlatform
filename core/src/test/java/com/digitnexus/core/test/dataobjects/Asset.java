package com.digitnexus.core.test.dataobjects;

import java.io.InputStream;
import java.io.Reader;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.Attachment;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * @author Adi
 */
@Entity(name="TestAsset")
@Table(name = "ASSET_TEST", uniqueConstraints = { @UniqueConstraint(columnNames = { "guid" }) })
@SequenceGenerator(name = "ASSET_TEST_SEQ", sequenceName = "ASSET_TEST_SEQ_DB")

@NamedQueries({@NamedQuery(name="FIND_BY_GUID",query="from TestAsset where guid=?"),
	@NamedQuery(name="FIND_BY_GUID_NAMED_PRAM",query="from TestAsset where guid=:guid"),
	@NamedQuery(name="FIND_BY_NAME",query="from TestAsset where name=?"),
	@NamedQuery(name="FIND_BY_NAME_NAMED_PRAM",query="from TestAsset where name=:name")})
@View
public class Asset extends DataObject {

	private static final long	serialVersionUID	= 1L;
	private long				id;
	private String				name;
	private String				guid;
	private String				attachmentDescription;
	private InputStream			attachment1;
	private Reader				attachment2;
	private char[]				attachment3;
	

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ASSET_TEST_SEQ")
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "guid",nullable=false)
	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}

	@Column(name = "name")
	@EditViewField(order=10)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the attachmentDescription
	 */
	@Column(name = "attachmentDesc")
	@EditViewField(order=20)
	public String getAttachmentDescription() {
		return attachmentDescription;
	}

	/**
	 * @param attachmentDescription the attachmentDescription to set
	 */
	public void setAttachmentDescription(String attachmentDescription) {
		this.attachmentDescription = attachmentDescription;
	}

	/**
	 * @return the attachment1
	 */
	@Transient
	@Attachment(descriptionField="attachmentDescription")
	public InputStream getAttachment1() {
		return attachment1;
	}

	/**
	 * @param attachment1 the attachment1 to set
	 */
	public void setAttachment1(InputStream attachment1) {
		this.attachment1 = attachment1;
	}

	/**
	 * @return the attachment2
	 */
	@Transient
	public Reader getAttachment2() {
		return attachment2;
	}

	/**
	 * @param attachment2 the attachment2 to set
	 */
	public void setAttachment2(Reader attachment2) {
		this.attachment2 = attachment2;
	}

	/**
	 * @return the attachment3
	 */
	@Transient
	public char[] getAttachment3() {
		return attachment3;
	}

	/**
	 * @param attachment3 the attachment3 to set
	 */
	public void setAttachment3(char[] attachment3) {
		this.attachment3 = attachment3;
	}
}
