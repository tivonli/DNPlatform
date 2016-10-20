/**
 * 
 */
package com.digitnexus.core.domain;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import javax.persistence.Version;
import javax.xml.bind.annotation.XmlTransient;

/**
 * @author adi Base object for
 */
@MappedSuperclass
public class DataObject implements Serializable {

	private static final long serialVersionUID = 1L;

	private String clientID;
	private String createdBy;
	private Date createdDate = new Date();
	private String updatedBy = createdBy;
	private Date updatedDate = createdDate;

	private long lockVersion = -1;

	@Column(name = "clientID", nullable = false)
	@XmlTransient
	public String getClientID() {
		return clientID;
	}

	public void setClientID(String clientID) {
		this.clientID = clientID;
	}

	@Column(name = "created_by", length = 20)
	@XmlTransient
	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	@Column(name = "created_date")
	@XmlTransient
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "updated_by")
	@XmlTransient
	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	@Column(name = "updated_date")
	@XmlTransient
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Version
	@Column(name = "lock_version", length = 19)
	@XmlTransient
	public long getLockVersion() {
		return lockVersion;
	}

	public void setLockVersion(long lockVersion) {
		this.lockVersion = lockVersion;
	}

	@Transient
	public boolean isTransient() {
		return (getLockVersion() == -1);
	}

}
