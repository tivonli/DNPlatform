package com.digitnexus.core.audit.mdm.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.UnhandledException;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.envers.RevisionType;

import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

@Entity
@Table(name = "MDM_SYNCRECORD")
@View
public class SyncRecord {
	private long id;
	private String entityName;
	private Class entityClass;
	// type of the task triggering object
	// type of the id field
	private String entityIdType;
	// id of the task triggering object
	private String entityIdString;
	private int revId;
	private MasterDataType type;
	private String updateBy;
	private Organization level;
	private MasterDataObject revisionData;
	private RevisionType revisionType;
	private RecordStatus status = RecordStatus.INITIAL;
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

	@Transient
	public Class getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class entityClass) {
		this.entityClass = entityClass;
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
	public int getRevId() {
		return revId;
	}

	public void setRevId(int revId) {
		this.revId = revId;
	}

	@Transient
	@SuppressWarnings("rawtypes")
	public Serializable getEntityId() {
		if (StringUtils.isNotBlank(entityIdType)
				&& StringUtils.isNotBlank(entityIdString)) {
			try {
				Class idType = Class.forName(entityIdType);
				return (Serializable) DataFormatUtil.localeIndependentParse(
						entityIdString, idType,
						DataType.dataTypeForJavaType(idType));
			} catch (ClassNotFoundException e) {
				throw new UnhandledException(e);
			}
		}
		return null;

	}

	/**
	 * @param initiatorId
	 */
	public void setEntityId(Serializable initiatorId) {
		if (initiatorId != null) {
			setEntityIdType(initiatorId.getClass().getName());
			setEntityIdString(DataFormatUtil
					.toLocaleIndependentJson(initiatorId));
		} else {
			setEntityIdType(null);
			setEntityIdString(null);
		}
	}
	@ListViewColumn(order=3,widthPercentage=15)
	@SearchColumn(order = 3)
	public String getEntityIdType() {
		return entityIdType;
	}

	public void setEntityIdType(String entityIdType) {
		this.entityIdType = entityIdType;
	}
	@ListViewColumn(order=4,widthPercentage=15)
	@SearchColumn(order = 4)
	public String getEntityIdString() {
		return entityIdString;
	}

	public void setEntityIdString(String entityIdString) {
		this.entityIdString = entityIdString;
	}

	@ListViewColumn(order=5,widthPercentage=15)
	@SearchColumn(order = 5)
	@Enumerated(EnumType.STRING)
	public MasterDataType getType() {
		return type;
	}

	public void setType(MasterDataType type) {
		this.type = type;
	}
	@ListViewColumn(order=6,widthPercentage=15)
	@SearchColumn(order = 6)
	public String getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}
	@ListViewColumn(order=5,widthPercentage=15)
	@SearchColumn(order = 5)
	@Enumerated(EnumType.STRING)
	public RevisionType getRevisionType() {
		return revisionType;
	}

	public void setRevisionType(RevisionType revisionType) {
		this.revisionType = revisionType;
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

	@Transient
	public Organization getLevel() {
		return level;
	}

	public void setLevel(Organization level) {
		this.level = level;
	}
	@Transient
	public MasterDataObject getRevisionData() {
		return revisionData;
	}

	public void setRevisionData(MasterDataObject revisionData) {
		this.revisionData = revisionData;
	}

}
