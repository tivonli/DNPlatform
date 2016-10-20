/**
 * 
 */
package com.digitnexus.core.web.ui.config.dataobject;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.i18n.I18NUtil;

/**
 * @author Santanu
 *
 */
public class EditViewMetaData {
	@SuppressWarnings("rawtypes")
	private transient Class entityClass;
	private String name;
	//datasource detail, this will tell which db to look at for this object
	private String dataSourceName;
	private DataSourceType dataSourceType;
	//display related information about this class
	private String displayKey;
	private String displayName;
	
	private FieldMetaData idField;
	// This property will hold number of columns which we need to render form . 
	private int columnLayout=3;
	
	private boolean comments = false;
	private List<FieldMetaData> fields = new ArrayList<FieldMetaData>();
	//Edit permission for user
	private boolean editPermission=true;
	private String  flexConfigDescriminatorProperty;
	private String  flexFieldsProperty;
	//List of flex field configurations for the entity represented by this list view meta
	private List<FlexFieldConfigMeta>  flexConfigMetas=new ArrayList<FlexFieldConfigMeta>();
	//To prevent concurrent edits
	private FieldMetaData  versionProperty;
	//Indicates whether entity can be created or updated by user at all
	private boolean readOnly=false;
	//to show the fieldset in the html
	private List<FieldGroupMeta> fieldGroupMetas = new ArrayList<FieldGroupMeta>();
	
	public EditViewMetaData(){
		
	}
		
	/**
	 * Copy constructor used for cloning.
	 * @param anotherEditViewMeta
	 */
	public EditViewMetaData(EditViewMetaData anotherEditViewMeta) {
		this.name = anotherEditViewMeta.name;
		this.entityClass = anotherEditViewMeta.entityClass;
		this.dataSourceName = anotherEditViewMeta.dataSourceName;
		this.dataSourceType = anotherEditViewMeta.dataSourceType;
		this.displayKey = anotherEditViewMeta.displayKey;
		this.columnLayout=anotherEditViewMeta.columnLayout;
		this.comments = anotherEditViewMeta.comments;
		if (anotherEditViewMeta.idField != null) {
			this.idField = new FieldMetaData(anotherEditViewMeta.idField);
		}
		for (FieldMetaData field:anotherEditViewMeta.fields) {
			fields.add(new FieldMetaData(field));
		}
		this.flexConfigDescriminatorProperty=anotherEditViewMeta.flexConfigDescriminatorProperty;
		this.flexFieldsProperty=anotherEditViewMeta.flexFieldsProperty;
		this.flexConfigMetas=anotherEditViewMeta.flexConfigMetas;
		this.versionProperty=anotherEditViewMeta.versionProperty;
		this.readOnly=anotherEditViewMeta.readOnly;
		this.fieldGroupMetas=anotherEditViewMeta.fieldGroupMetas;
	}
	
	public EditViewMetaData(String name, @SuppressWarnings("rawtypes") Class entityClass, String displayKey) {
		this.name = name;
		this.entityClass = entityClass;
		this.displayKey = displayKey;
	}
	@SuppressWarnings("rawtypes")
	public Class getEntityClass() {
		return entityClass;
	}
	public void setEntityClass(@SuppressWarnings("rawtypes") Class entityClass) {
		this.entityClass = entityClass;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the dataSourceName
	 */
	public String getDataSourceName() {
		return dataSourceName;
	}
	/**
	 * @param dataSourceName the dataSourceName to set
	 */
	public void setDataSourceName(String dataSourceName) {
		this.dataSourceName = dataSourceName;
	}
	/**
	 * @return the dataSourceType
	 */
	public DataSourceType getDataSourceType() {
		return dataSourceType;
	}
	/**
	 * @param dataSourceType the dataSourceType to set
	 */
	public void setDataSourceType(DataSourceType dataSourceType) {
		this.dataSourceType = dataSourceType;
	}
	/**
	 * @return the display key for this class
	 */
	public String getDisplayKey() {
		if (StringUtils.isBlank(displayKey)) {
			displayKey = entityClass.getName();
		}
		return displayKey;
	}
	public void setDisplayKey(String displayKey) {
		this.displayKey = displayKey;
	}
	
	/**
	 * @return the displayName
	 */
	public String getDisplayName() {
		if (StringUtils.isBlank(displayName)) {
			displayName = I18NUtil.getMessage(getDisplayKey(), null,  StringUtils.capitalize(name.substring(name.lastIndexOf(".") + 1)));
		}
		return displayName;
	}
	
	public FieldMetaData getIdField() {
		return idField;
	}
	
	public void setIdField(FieldMetaData idField) {
		this.idField = idField;
	}
	
	public List<FieldMetaData> getFields() {
		return fields;
	}
	
	public void setFields(List<FieldMetaData> fields) {
		this.fields = fields;
	}
	
	public void addField(FieldMetaData field) {
		if (fields == null) {
			fields = new ArrayList<FieldMetaData>();
		}
		fields.add(field);
	}

	public FieldMetaData getField(String fieldName) {
		for (FieldMetaData field:fields) {
			if (field.getName().equals(fieldName)) {
				return field;
			}
		}
		return null;
	}
	
	/**
	 * @param columnLayout the columnLayout to set
	 */
	public void setColumnLayout(int columnLayout) {
		if(columnLayout<1){
			//Ignore it
			return;
		}
		this.columnLayout = columnLayout;
	}

	/**
	 * @return the columnLayout
	 */
	public int getColumnLayout() {
		return columnLayout;
	}

	public boolean isComments() {
		return comments;
	}

	public void setComments(boolean comments) {
		this.comments = comments;
	}
	
	public boolean isEditPermission() {
		return editPermission;
	}

	public void setEditPermission(boolean editPermission) {
		this.editPermission = editPermission;
	}

	public String getFlexFieldsProperty() {
		return flexFieldsProperty;
	}

	public void setFlexFieldsProperty(String flexFieldsProperty) {
		this.flexFieldsProperty = flexFieldsProperty;
	}

	public String getFlexConfigDescriminatorProperty() {
		return flexConfigDescriminatorProperty;
	}

	public void setFlexConfigDescriminatorProperty(String flexConfigDescriminatorProperty) {
		this.flexConfigDescriminatorProperty = flexConfigDescriminatorProperty;
	}

	public List<FlexFieldConfigMeta> getFlexConfigMetas() {
		return flexConfigMetas;
	}

	public void setFlexConfigMetas(List<FlexFieldConfigMeta> flexConfigMetas) {
		this.flexConfigMetas = flexConfigMetas;
	}

	public FieldMetaData getVersionProperty() {
		return versionProperty;
	}

	public void setVersionProperty(FieldMetaData versionProperty) {
		this.versionProperty = versionProperty;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}
	
	public List<FieldGroupMeta> getFieldGroupMetas() {
		return fieldGroupMetas;
	}

	public void setFieldGroupMetas(List<FieldGroupMeta> fieldGroupMetas) {
		this.fieldGroupMetas = fieldGroupMetas;
	}
	
}
