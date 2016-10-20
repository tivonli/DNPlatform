package com.digitnexus.core.audit.mdm.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

@Entity
@Table(name = "MDM_ReceiveRecord")
@View
public class ReceiveRecord {
	private long id;
	private String code;
	private int revision;
	private String entityName;
	private String subscriber;
	private ChangeType changeType;
	private RecordStatus status = RecordStatus.RECEIVED;
	@Id
	@Column(name = "id", length = 20)
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@ListViewColumn(order=1,widthPercentage=15)
	@SearchColumn(order = 1)
	public String getEntityName() {
		return entityName;
	}

	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}
	@ListViewColumn(order=2,widthPercentage=15)
	@SearchColumn(order = 2)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	@ListViewColumn(order=4,widthPercentage=15)
	@SearchColumn(order = 4)
	public int getRevision() {
		return revision;
	}

	public void setRevision(int revision) {
		this.revision = revision;
	}

	
	@ListViewColumn(order=5,widthPercentage=15)
	@SearchColumn(order = 5)
	public String getSubscriber() {
		return subscriber;
	}

	public void setSubscriber(String subscriber) {
		this.subscriber = subscriber;
	}
	@ListViewColumn(order=6,widthPercentage=15)
	@SearchColumn(order = 6)
	@Enumerated(EnumType.STRING)
	public ChangeType getChangeType() {
		return changeType;
	}

	public void setChangeType(ChangeType changeType) {
		this.changeType = changeType;
	}
	@Enumerated(EnumType.STRING)
	@ListViewColumn(order=7,widthPercentage=15)
	@SearchColumn(order = 7)
	public RecordStatus getStatus() {
		return status;
	}

	public void setStatus(RecordStatus status) {
		this.status = status;
	}
	
	
}
