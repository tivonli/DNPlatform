package com.digitnexus.core.test.dataobjects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.web.ui.config.annotation.Compare;
import com.digitnexus.core.web.ui.config.annotation.CompareType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

@Entity(name="TestProduct")
@Table(name = "test_products")
@View(comments=true)
public class Product extends DataObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 280444412831366962L;
	
	private String id;
	private String name;
	private ProductMaster productMaster;

	private Organization manufacturer;

	private String tag1;
	private String tag2;
	private String tag3;
	private String physicaltag;
	
	@Transient
	private String categroyName;

	@Id
	@Column(name = "id", length = 20)
	@GenericGenerator(name = "idGenerator", strategy = "assigned")
	@GeneratedValue(generator = "idGenerator")
	@ListViewColumn(order=0,widthPercentage=20)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "name",nullable=false)
	@ListViewColumn(order=1,widthPercentage=20, referenceProperty="name",associationListProperty=true)
	@EditViewField(order=1)
	@SearchColumn(order = 0,basic=true)
	@NotNull
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(optional = false)
	@JoinColumn(name = "product_master_id", nullable = false)
	@ListViewColumn(order=2,widthPercentage=20, referenceProperty="name",associationListProperty=true)
	@EditViewField(order=1)
	@SearchColumn(order = 1, basic = true)
	@NotNull
	public ProductMaster getProductMaster() {
		return productMaster;
	}

	public void setProductMaster(ProductMaster productMaster) {
		this.productMaster = productMaster;
	}

	@ManyToOne(optional = false)
	@JoinColumn(name = "manufacturer_id", nullable = false)
	@ListViewColumn(order=4, widthPercentage = 15, referenceProperty="name",associationListProperty=true)
	@EditViewField(order=2)
	@SearchColumn(order = 2)
	@NotNull
	public Organization getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(Organization manufacturer) {
		this.manufacturer = manufacturer;
	}

	@Column(name = "tag1")
	@EditViewField(order=3)
	@NotNull
	@Compare(type=CompareType.NOTEQUAL,targets={"tag2","tag3"})
	public String getTag1() {
		return tag1;
	}

	public void setTag1(String tag1) {
		this.tag1 = tag1;
	}

	@Column(name = "tag2")
	@EditViewField(order=4)
	@Compare(type=CompareType.NOTEQUAL,targets={"tag1","tag3"})
	public String getTag2() {
		return tag2;
	}

	public void setTag2(String tag2) {
		this.tag2 = tag2;
	}

	@Column(name = "tag3")
	@EditViewField(order=5)
	@Compare(type=CompareType.NOTEQUAL,targets={"tag1","tag2"})
	public String getTag3() {
		return tag3;
	}

	public void setTag3(String tag3) {
		this.tag3 = tag3;
	}

	@Column(name = "physicaltag")
	@EditViewField(order=5)
	@Compare(type=CompareType.NOTEQUAL,targets={"tag1","tag2","tag3"})
	public String getPhysicaltag() {
		return physicaltag;
	}

	public void setPhysicaltag(String physicaltag) {
		this.physicaltag = physicaltag;
	}

	@ListViewColumn(order=3,widthPercentage=15,sortable=false)
	@Transient
	public String getCategroyName() {
		return this.productMaster.getCategory().getName();
	}

	public void setCategroyName(String categroyName) {
		this.categroyName = categroyName;
	}
}
