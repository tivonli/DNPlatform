package com.digitnexus.core.test.dataobjects;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotEmpty;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.FlexField;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldConfig;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldDescriminator;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldConfig.FlexConfigList;


@Entity(name="TestProductMaster")
@Table(name = "test_product_masters")
@View(comments=true)
public class ProductMaster extends DataObject {
	public static final String	CHEMICAL_PRODUCT	= "chemical_product";
	public static final String	SCM_PRODUCT			= "scm_product";
	public static final String	BATCH_NO			= "batchNo";
	public static final String	MAKE				= "make";
	public static final String	SKU					= "sku";

	/**
	 * 
	 */
	private static final long	serialVersionUID	= 7914992127259895854L;

	private String				id;

	private Category			category;

	private String				name;

	private Uom					uom;
	
    private Map<String, String>	flexFields			= new HashMap<String, String>();
	
	private String configDescriminator;

	@Id
	@GenericGenerator(name = "idGenerator", strategy = "assigned")
	@GeneratedValue(generator = "idGenerator")
	@Column(name = "id")
	@ListViewColumn(order=1,widthPercentage=20)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false)
	@ListViewColumn(order = 2, widthPercentage = 20, associationListProperty = true)
	@EditViewField(order = 2)
	@SearchColumn(order = 0, basic = true)
	@NotEmpty
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne
	@JoinColumn(name = "category_name")
	@ListViewColumn(order = 3, widthPercentage = 15, referenceProperty = "name",associationListProperty=true)
	@EditViewField(order = 3)
	@SearchColumn(order = 3, dataType = DataType.REFERENCE, displayType = DisplayType.SELECT, basic = true)
	@NotNull
	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	@ManyToOne
	@JoinColumn(name = "uom")
	@ListViewColumn(order = 4, widthPercentage = 15, referenceProperty = "name",associationListProperty=true)
	@EditViewField(order = 4)
	@SearchColumn(order = 3, dataType = DataType.REFERENCE, displayType = DisplayType.SELECT, basic = true)
	@NotNull
	public Uom getUom() {
		return uom;
	}

	public void setUom(Uom uom) {
		this.uom = uom;
	}
	
    
	@Column(name = "config_descriminator")
	@ListViewColumn(order = 5, widthPercentage = 20, hidden=true)
	@EditViewField(order = 5,hidden=true)
	@FlexFieldDescriminator
	public String getConfigDescriminator() {
		return configDescriminator;
	}

	public void setConfigDescriminator(String configDescriminator) {
		this.configDescriminator = configDescriminator;
	}
	
	@FlexConfigList(value = {
			@FlexFieldConfig(name = CHEMICAL_PRODUCT, fields = {
					@FlexField(name = BATCH_NO, editViewField = @EditViewField(order = 10, dataType = DataType.LONG)),
					@FlexField(name = MAKE, editViewField = @EditViewField(order = 11, dataType = DataType.STRING)) }),
			@FlexFieldConfig(name = SCM_PRODUCT, fields = { @FlexField(name = SKU, editViewField = @EditViewField(order = 10, dataType = DataType.STRING)) })

	})
	@ElementCollection(fetch = FetchType.EAGER)
	@EditViewField(order=6,hidden=true)
	public Map<String, String> getFlexFields() {
		return flexFields;
	}

	public void setFlexFields(Map<String, String> flexFields) {
		this.flexFields = flexFields;
	}


}
