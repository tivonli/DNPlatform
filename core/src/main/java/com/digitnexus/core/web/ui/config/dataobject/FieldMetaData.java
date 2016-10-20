/**
 * 
 */
package com.digitnexus.core.web.ui.config.dataobject;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.util.LinkedHashMap;

import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.web.exception.EditViewConfigurationException;




/**
 * @author Santanu
 *
 */
@SuppressWarnings("rawtypes")
public class FieldMetaData implements Comparable<FieldMetaData> {
	//java class of the encapsulating entity
	private transient Class entityClass;
	//Java class type for the property
	private transient Class propertyJavaType;
	//property descriptor of this property
	private transient PropertyDescriptor propertyDescriptor;
	//property descriptor for the reference property
	private transient PropertyDescriptor referencePropertyDescriptor;	
	//name of the field
	private String name;
	//the order of the element in the edit area
	private int order;
	//key of the internationalized display name of this field
	private String displayKey;
	//internationalized display name
	private String displayName;	
	//whether this element is hidden
	private boolean hidden;
	//whether this element can be updated once the object is created
	private boolean updatable=true;
	//marks this field as read only (or editable)
	private boolean readOnly;
	//type of data - should be from a pre-defined list
	private String dataType;
	//ui-type like dropdown,checbox,radio,text etc - should be from a pre-defined list
	private String displayType;
	//length of the field - matters for numeric and string type fields
	private int length=-1;
	//marks this field as required or not
	private boolean mandatory;
	
	private String range;
	// default value for element
	private String defaultValue;
	// list of data which will be used to render dropdown, checkbox and radio element
	private LinkedHashMap<String, String> values; // this should hold list of {value:'innerValue',displayValue:'display name'}
	//for some fields the value may be represented by icons. this is to hold such value vs icon map
	private LinkedHashMap<String, String> imageMap;
	//marks the field with specific validation type
	private String validation;
	//this makes sense when data type is reference. this is the property
	//of the reference that is to be displayed in the UI
	private String referenceProperty;	
	//this is for showing association list in the edit view area
	private ListViewMetaData associationListMeta;
	//Indicates whether the association object can be created from parent edit view or not. 
	//This is applicable to only association. It will be true if reference property do not have list view
	//configured
	private boolean allowCreateFromParent=false;
	//Name of the collection reference class
	private String collectionReferenceEntity;
	//for filtering data in association view
	private long associationSearchCriteriaId;
	//marks if this field actually holds an attached document
	private boolean attachment;
	
	//show attachemnt when add 
	private boolean showAdd;
	private boolean editDisplay;
	//if this is an attachment then the type 
	//(one or more of com.digitnexus.core.web.ui.config.annotation.AttachmentType)
	private String[] attachmentType;
	//the field which actually holds the attachment 
	private FieldMetaData attachmentField;
	//if the field may contain a collection of attachments
	private boolean allowMultipleAttachments;
	
	private boolean flexField;

	private CompareMeta compareMeta; 
	
	private UomMeta uomMeta;
	
	private AlphanumericMeta alphanumericMeta;

	private String fieldGroupName;
	
	public FieldMetaData() {
		values = new LinkedHashMap<String, String>();
		imageMap = new LinkedHashMap<String, String>();
	}
	/**
	 * Copy constructor used for cloning.
	 * @param field
	 */
	public FieldMetaData(FieldMetaData field) {
		this.entityClass = field.entityClass;
		this.propertyJavaType = field.propertyJavaType;	
		this.propertyDescriptor = field.propertyDescriptor;		
		this.name = field.name;
		this.dataType = field.dataType;
		this.displayType = field.displayType;
		this.displayKey = field.displayKey;
		this.hidden = field.hidden;
		this.readOnly = field.readOnly;
		this.updatable = field.updatable;
		this.order = field.order;
		this.length = field.length;
		this.mandatory = field.mandatory;
		this.compareMeta = field.compareMeta;
		this.uomMeta = field.uomMeta;
		this.alphanumericMeta = field.alphanumericMeta;
		this.range=field.range;
		this.validation = field.validation;
		this.referenceProperty = field.referenceProperty;
		this.values = new LinkedHashMap<String, String>(field.values);
		this.imageMap = new LinkedHashMap<String, String>(field.imageMap);
		if (field.associationListMeta != null) {
			this.associationListMeta = new ListViewMetaData(field.associationListMeta);
		}
		this.allowCreateFromParent = field.allowCreateFromParent;
		this.collectionReferenceEntity = field.collectionReferenceEntity;
		this.associationSearchCriteriaId = field.associationSearchCriteriaId;
		this.attachment = field.attachment;
		this.showAdd=field.showAdd;
		this.attachmentType = field.attachmentType;
		this.editDisplay = field.editDisplay;
		this.allowMultipleAttachments = field.allowMultipleAttachments;
		this.flexField=field.flexField;
		if (field.attachmentField == field) {
			this.attachmentField = this;
		} else if (field.attachmentField != null) {
			this.attachmentField = new FieldMetaData(field.attachmentField);
		}
		this.fieldGroupName=field.fieldGroupName;
		
	}
	
	/**
	 * @return the entityClass
	 */
	public Class getEntityClass() {
		return entityClass;
	}
	/**
	 * @param entityClass the entityClass to set
	 */
	public FieldMetaData entityClass(Class entityClass) {
		this.entityClass = entityClass;
		return this;
	}
	/**
	 * @return the propertyJavaType
	 */
	public Class getPropertyJavaType() {
		return propertyJavaType;
	}
	/**
	 * @param propertyJavaType the propertyJavaType to set
	 */
	public FieldMetaData propertyJavaType(Class propertyJavaType) {
		this.propertyJavaType = propertyJavaType;
		return this;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public FieldMetaData name(String name) {
		this.name = name;
		ensurePropertyDescriptorCreated();
		return this;
	}
	/**
	 * @return the order
	 */
	public int getOrder() {
		return order;
	}
	/**
	 * @param order the order to set
	 */
	public FieldMetaData order(int order) {
		this.order = order;
		return this;
	}
	/**
	 * @return the displayKey
	 */
	public String getDisplayKey() {
		if (StringUtils.isBlank(displayKey)) {
			displayKey = entityClass.getName() + "." + name;
		}
		return displayKey;
	}
	/**
	 * @return the displayName
	 */
	public String getDisplayName() {
		if (StringUtils.isBlank(displayName)) {
			displayName = I18NUtil.getMessage(getDisplayKey(), null, StringUtils.capitalize(name));
		}
		return displayName;
	}
	/**
	 * @param displayKey the displayKey to set
	 */
	public FieldMetaData displayKey(String displayKey) {
		this.displayKey = displayKey;
		return this;
	}
	/**
	 * @return the hidden
	 */
	public boolean isHidden() {
		return hidden;
	}
	/**
	 * @param hidden the hidden to set
	 */
	public FieldMetaData hidden(boolean hidden) {
		this.hidden = hidden;
		return this;
	}
	/**
	 * @return whether can be updated 
	 */
	public boolean isUpdatable() {
		return updatable;
	}
	/**
	 * @param updatable
	 * @return
	 */
	public FieldMetaData updatable(boolean updatable) {
		this.updatable = updatable;
		return this;
	}
	/**
	 * @return the readOnly
	 */
	public boolean isReadOnly() {
		return readOnly;
	}
	/**
	 * @param readOnly the readOnly to set
	 */
	public FieldMetaData readOnly(boolean readOnly) {
		this.readOnly = readOnly;
		return this;
	}
	/**
	 * @return the dataType
	 */
	public String getDataType() {
		return dataType;
	}
	/**
	 * @param dataType the dataType to set
	 */
	public FieldMetaData dataType(String dataType) {
		this.dataType = dataType;
		return this;
	}
	/**
	 * @return the length
	 */
	public int getLength() {
		return length;
	}
	/**
	 * @param length the length to set
	 */
	public FieldMetaData length(int length) {
		this.length = length;
		return this;
	}
	/**
	 * @return the mandatory
	 */
	public boolean isMandatory() {
		return mandatory;
	}
	/**
	 * @param mandatory the mandatory to set
	 */
	public FieldMetaData mandatory(boolean mandatory) {
		this.mandatory = mandatory;
		return this;
	}	
	
	public String getRange(){
		return range;
	}
	
	public FieldMetaData range(long max,long min){
		this.range = max+","+min;
		return this;
	}
	
	public FieldMetaData compare(CompareMeta compareMeta){
		this.compareMeta=compareMeta;
		return this;
	}
	
	public CompareMeta getCompareMeta(){
		return this.compareMeta;
	}
	
	public FieldMetaData uom(UomMeta uomMeta){
		this.uomMeta = uomMeta;
		return this;
	}
	
	public UomMeta getUomMeta(){
		return this.uomMeta;
	}
	
	
	public FieldMetaData alphanumeric(AlphanumericMeta alphanumericMeta){
		this.alphanumericMeta = alphanumericMeta;
		return this;
	}
	
	public AlphanumericMeta getAlphanumericMeta(){
		return this.alphanumericMeta;
	}
	
	
	
	/**
	 * @return the validation
	 */
	public String getValidation() {
		return validation;
	}
	/**
	 * @param validation the validation to set
	 */
	public FieldMetaData validation(String validation) {
		this.validation = validation;
		return this;
	}	

	/**
	 * @param uiType the uiType to set
	 */
	public FieldMetaData displayType(String displayType) {
		this.displayType = displayType;
		return this;
	}
	/**
	 * @return the uiType
	 */
	public String getDisplayType() {
		return displayType;
	}
	/**
	 * @return the referenceProperty
	 */
	public String getReferenceProperty() {
		return referenceProperty;
	}

	/**
	 * @param referenceProperty the referenceProperty to set
	 */
	public FieldMetaData referenceProperty(String referenceProperty) {
		this.referenceProperty = referenceProperty;
		ensureReferencePropertyDescriptorCreated();
		return this;
	}
	/**
	 * @param defaultValue the defaultValue to set
	 */
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
	/**
	 * @return the defaultValue
	 */
	public String getDefaultValue() {
		return defaultValue;
	}
	/**
	 * @return the associationListMeta
	 */
	public ListViewMetaData getAssociationListMeta() {
		return associationListMeta;
	}
	/**
	 * @param associationListMeta the associationListMeta to set
	 */
	public FieldMetaData associationListMeta(ListViewMetaData associationListMeta) {
		if (associationListMeta != null) {
			//this makes sense only if the data type is reference
			this.associationListMeta = new ListViewMetaData(associationListMeta);
			this.associationListMeta.setParentField(this);
		} else {
			this.associationListMeta = null;
		}
		return this;
	}
	/**
	 * @param values the values to set
	 */
	public FieldMetaData values(LinkedHashMap<String, String> values) {
		if (values == null) {
			this.values.clear();
		} else {
			this.values.putAll(values);
		}
		return this;
	}
	/**
	 * @return the values
	 */
	public LinkedHashMap<String, String> getValues() {
		return values;
	}
	
	/**
	 * @param imageMap the imageMap to set
	 */
	public FieldMetaData imageMap(LinkedHashMap<String, String> imageMap) {
		if (imageMap == null) {
			this.imageMap.clear();
		} else {
			this.imageMap.putAll(imageMap);
		}
		return this;
	}
	
	public FieldMetaData allowCreateFromParent(boolean allowCreateFromParent){
		this.allowCreateFromParent=allowCreateFromParent;
		return this;
	}
	
	public FieldMetaData collectionReferenceEntity(String collectionReferenceEntity){
		this.collectionReferenceEntity=collectionReferenceEntity;
		return this;
	}
	
	public FieldMetaData associationSearchCriteriaId(long associationSearchCriteriaId){
		this.associationSearchCriteriaId=associationSearchCriteriaId;
		return this;
	}
	
	/**
	 * @return the imageMap
	 */
	public LinkedHashMap<String, String> getImageMap() {
		return imageMap;
	}
	
	public boolean isEditDisplay(){
		return editDisplay;
	}
	public FieldMetaData editDisplay(boolean editDisplay){
		this.editDisplay = editDisplay;
		return this;
	}
	
	/**
	 * @return the attachment
	 */
	public boolean isAttachment() {
		return attachment;
	}
	/**
	 * @param attachment the attachment to set
	 */
	public FieldMetaData attachment(boolean attachment) {
		this.attachment = attachment;
		return this;
	}
	
	public FieldMetaData showAdd(boolean showAdd) {
		this.showAdd = showAdd;
		return this;
	}
	
	public boolean isShowAdd() {
		return showAdd;
	} 
	/**
	 * @return the attachmentType
	 */
	public String[] getAttachmentType() {
		return attachmentType;
	}
	/**
	 * @param attachmentType the attachmentType to set
	 */
	public FieldMetaData attachmentType(String[] attachmentType) {
		this.attachmentType = attachmentType;
		return this;
	}
	/**
	 * @return the attachmentField
	 */
	public FieldMetaData getAttachmentField() {
		return attachmentField;
	}
	/**
	 * @param attachmentField the attachmentField to set
	 */
	public FieldMetaData attachmentField(FieldMetaData attachmentField) {
		this.attachmentField = attachmentField;
		return this;
	}
	/**
	 * @return the allowMultipleAttachments
	 */
	public boolean isAllowMultipleAttachments() {
		return allowMultipleAttachments;
	}
	/**
	 * @param allowMultipleAttachments the allowMultipleAttachments to set
	 */
	public FieldMetaData allowMultipleAttachments(boolean allowMultipleAttachments) {
		this.allowMultipleAttachments = allowMultipleAttachments;
		return this;
	}
	
	public PropertyDescriptor getPropertyDescriptor() {
		ensurePropertyDescriptorCreated();
		return propertyDescriptor;
	}
	
	public PropertyDescriptor getReferencePropertyDescriptor() {
		ensureReferencePropertyDescriptorCreated();
		return referencePropertyDescriptor;
	}
	
	private void ensurePropertyDescriptorCreated() {
		if (propertyDescriptor != null) {
			return;
		}
		
		//May be flex field or some other field which can not have property descriptor
		if(isFlexField() || name.contains(".")){
			return;
		}
		
		try {
			if (readOnly) {
				this.propertyDescriptor
				    = new PropertyDescriptor(name, entityClass, getBooleanAccessorName(name), null);
			} else {
				this.propertyDescriptor
					= new PropertyDescriptor(name, entityClass);
			}
		} catch (IntrospectionException e) {
			throw new EditViewConfigurationException("Exception while introspection of property " + getName() + " of class "  + entityClass.getName(), e);
		}
	}
	
	private void ensureReferencePropertyDescriptorCreated() {
		if (referencePropertyDescriptor != null || StringUtils.isBlank(referenceProperty)) {
			return;
		}
			if (readOnly) {
				try {
					//in case readonly there is no chance of edit
					this.referencePropertyDescriptor
					    = new PropertyDescriptor(referenceProperty, propertyJavaType, getBooleanAccessorName(referenceProperty), null);
				} catch (IntrospectionException e) {
					throw new EditViewConfigurationException("Exception while introspection of property " 
										+ referenceProperty + " of class "  + propertyJavaType.getName(), e);
				}
			} else {
				try {
					//otherwise also there is no good chance of edit, still we look for the setter once, if not found we settle for getter
					this.referencePropertyDescriptor
					    = new PropertyDescriptor(referenceProperty, propertyJavaType);
				} catch (IntrospectionException e) {
					try {
						//we do not mind to have a readonly field being referenced. so to have a setter is not mandatory
						this.referencePropertyDescriptor
						= new PropertyDescriptor(referenceProperty, propertyJavaType, getBooleanAccessorName(referenceProperty), null);
					} catch (IntrospectionException e1) {
						throw new EditViewConfigurationException("Exception while introspection of property " 
											+ referenceProperty + " of class "  + propertyJavaType.getName(), e);
					}
				}
			}
	}
	
	
	
	
	@Override
	public int compareTo(FieldMetaData o) {
		int thisVal = this.order;
		int anotherVal = o.order;
		return (thisVal<anotherVal ? -1 : (thisVal==anotherVal ? 0 : 1));
	}
	public boolean isAllowCreateFromParent() {
		return allowCreateFromParent;
	}
	public String getCollectionReferenceEntity() {
		return collectionReferenceEntity;
	}
	
	private String getBooleanAccessorName(String propertyName) {
		return "is" + propertyName.substring(0, 1).toUpperCase(java.util.Locale.ENGLISH) + propertyName.substring(1);
	}
	public long getAssociationSearchCriteriaId() {
		return associationSearchCriteriaId;
	}
	public boolean isFlexField() {
		return flexField;
	}
	public void setFlexField(boolean flexField) {
		this.flexField = flexField;
	}
	
	public String getFieldGroupName(){
		return fieldGroupName;
	}
	
	public FieldMetaData fieldGroupName(String fieldGroupName){
		this.fieldGroupName = fieldGroupName;
		return this;
	}
}
