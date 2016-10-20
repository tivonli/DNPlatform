package com.digitnexus.core.test.dataobjects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotEmpty;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * unit of measure
 * @author Pony
 *
 */
@Entity(name="TestUom")
@Table(name="test_uom")
@View(comments=true)
public class Uom extends DataObject {
	
	private static final long serialVersionUID = 1281422022271203192L;

	private String name;
	
	private String i18nName;

	@Id
	@Column(name="name")
	@ListViewColumn(order=1, associationListProperty=true)
	@EditViewField(order=1)
	@SearchColumn(order=1)
	@NotEmpty
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "i18n_name",nullable=false)
	@ListViewColumn(order=2,widthPercentage=20,associationListProperty=true)
	@EditViewField(order=2)
	@SearchColumn(order=2)
	@NotEmpty
	public String getI18nName() {
		return i18nName;
	}

	public void setI18nName(String i18nName) {
		this.i18nName = i18nName;
	}
	
	
}
