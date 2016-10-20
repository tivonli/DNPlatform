package com.digitnexus.core.audit.mdm.domain;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;

@MappedSuperclass
@Audited
public  class MasterDataObject extends DataObject {

	private static final long serialVersionUID = 3915980693347222561L;
	
	/**
	 * primary key
	 */
	private String code;
	/**
	 * common id
	 */
	private Organization level;


	@Column(name = "code", nullable = false,unique=true)
	@ListViewColumn(order = 3, widthPercentage = 15,associationListProperty=true)
	@EditViewField(order = 3)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@ManyToOne(optional = false)
	@JoinColumn(name = "level_org_id", nullable = false)
	@ListViewColumn(order=2, widthPercentage = 15, referenceProperty="name",associationListProperty=true)
	@EditViewField(order=2,displayType=DisplayType.ARTICLE_DROPDOWN)
	@SearchColumn(order = 3)
	@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
	public Organization getLevel() {
		return level;
	}

	public void setLevel(Organization level) {
		this.level = level;
	}
		
	
}

