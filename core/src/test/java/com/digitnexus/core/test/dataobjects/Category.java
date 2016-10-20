package com.digitnexus.core.test.dataobjects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotEmpty;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;
@Entity(name="TestCategory")
@Table(name="test_categories")
@View(comments=true)
public class Category extends DataObject {
	private static final long	serialVersionUID	= 1L;
	private String				name;
	private String				description;
	private String code;
	
	
	public Category(){
	
	
	}
	
	
	public Category(String name, String description, String code) {
		super();
		this.name = name;
		this.description = description;
		this.code = code;
	}

	@Id
	@Column(name="category_name")
	@ListViewColumn(order=1, associationListProperty=true)
	@EditViewField(order=1)
	@NotEmpty
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;

	}

	@Column(name = "code", nullable = false,unique=true)
	@ListViewColumn(order = 0, widthPercentage = 15,associationListProperty=true)
	@EditViewField(order = 0)
	@SearchColumn(order = 0, basic = true)
	@NotEmpty
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	@Column(name="category_description",nullable=false)
	@ListViewColumn(order=4)
	@EditViewField(order=4,displayType=DisplayType.TEXTAREA)
	@NotEmpty
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;

	}
}
