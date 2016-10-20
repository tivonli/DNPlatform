package com.digitnexus.core.audit.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.envers.DefaultTrackingModifiedEntitiesRevisionEntity;
import org.hibernate.envers.RevisionEntity;

@Entity
@Table(name = "REVISIONS")
@RevisionEntity(CustomEnversListener.class)
public class CustomRevisionEntity extends
		DefaultTrackingModifiedEntitiesRevisionEntity implements Serializable {
	private static final long serialVersionUID = -1255842407304508513L;

	private String username;

	private String version;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

}
