/**
 * 
 */
package com.digitnexus.core.web.ui.config.dataobject;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.util.LinkedHashMap;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.i18n.I18NUtil;

/**
 * @author Santanu
 */
@SuppressWarnings("rawtypes")
public class ColumnMetaData implements Comparable<ColumnMetaData> {
	
	private static Logger logger = LoggerFactory.getLogger(ColumnMetaData.class);
	
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
	//this is the order in which the columns are arranged
	//columns are sorted based on this in TableMetaData Object
	private int order;
	//key of the internationalized display name
	private String displayKey;
	//internationalized display name
	private String displayName;
	//this is the width of the column in %
	private String sizePercentage;
	//a int value of the string above
	private int sizePercentAsInt;
	//whether this column will be hidden in UI
	private boolean hidden;
	//whether sorting is allowed on this column
	private boolean sortable;
	//this is for UI side data type definition
	private String dataType;
	//this is for the display compoenent to be shown in the ui
	private String displayType;
	//this makes sense when data type is reference. this is the property
	//of the reference that is to be displayed in the UI
	private String referenceProperty;
	//if this column comes in the associated property selection list
	private boolean associatedListProperty;
	//for some fields the value may be represented by icons. this is to hold such value vs icon map
	private LinkedHashMap<String, String> imageMap;	
	
	/**
	 * 
	 */
	public ColumnMetaData() {
		imageMap = new LinkedHashMap<String, String>();
	}

	/**
	 * This is a copy constructor used for cloning this object
	 * @param anotherMetaData
	 */
	public ColumnMetaData(ColumnMetaData anotherMetaData) {
		this.entityClass = anotherMetaData.entityClass;
		this.propertyJavaType = anotherMetaData.propertyJavaType;
		this.propertyDescriptor = anotherMetaData.propertyDescriptor;
		this.referencePropertyDescriptor = anotherMetaData.referencePropertyDescriptor;
		this.name = anotherMetaData.name;
		this.order = anotherMetaData.order;
		this.hidden = anotherMetaData.hidden;
		this.sortable = anotherMetaData.sortable;
		this.sizePercentage = anotherMetaData.sizePercentage;
		this.displayKey = anotherMetaData.displayKey;
		this.dataType = anotherMetaData.dataType;
		this.displayType = anotherMetaData.displayType;
		this.imageMap = new LinkedHashMap<String, String>(anotherMetaData.imageMap);
		this.referenceProperty = anotherMetaData.referenceProperty;
		this.associatedListProperty = anotherMetaData.associatedListProperty;
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
	public ColumnMetaData entityClass(Class entityClass) {
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
	public ColumnMetaData propertyJavaType(Class propertyJavaType) {
		this.propertyJavaType = propertyJavaType;
		return this;
	}

	public String getName() {
		return name;
	}
	
	public ColumnMetaData name(String name) {
		this.name = name;
		ensurePropertyDescriptorCreated();
		return this;
	}

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
	
	public ColumnMetaData displayKey(String displayKey) {
		this.displayKey = displayKey;
		return this;
	}

	public String getSizePercentage() {
		return sizePercentage;
	}

	public int getSizePercentAsInt() {
		return sizePercentAsInt;
	}

	public ColumnMetaData sizePercentage(int sizePercentAsInt) {
		this.sizePercentAsInt = sizePercentAsInt;
		if (sizePercentAsInt > 0) {
			this.sizePercentage = sizePercentAsInt + "%";
		}
		return this;
	}

	public int getOrder() {
		return order;
	}

	public ColumnMetaData order(int order) {
		this.order = order;
		return this;
	}

	public boolean isHidden() {
		return hidden;
	}

	public ColumnMetaData hidden(boolean hidden) {
		this.hidden = hidden;
		return this;
	}
	
	/**
	 * @return the sortable
	 */
	public boolean isSortable() {
		return sortable;
	}

	/**
	 * @param sortable the sortable to set
	 */
	public ColumnMetaData sortable(boolean sortable) {
		this.sortable = sortable;
		return this;
	}

	public String getDataType() {
		return dataType;
	}

	public ColumnMetaData dataType(String dataType) {
		this.dataType = dataType;
		return this;
	}
	
	public String getDisplayType() {
		return displayType;
	}

	public ColumnMetaData displayType(String displayType) {
		this.displayType = displayType;
		return this;
	}

	/**
	 * @param imageMap the imageMap to set
	 */
	public ColumnMetaData imageMap(LinkedHashMap<String, String> imageMap) {
		if (imageMap == null) {
			this.imageMap.clear();
		} else {
			this.imageMap.putAll(imageMap);
		}
		return this;
	}
	/**
	 * @return the imageMap
	 */
	public LinkedHashMap<String, String> getImageMap() {
		return imageMap;
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
	public ColumnMetaData referenceProperty(String referenceProperty) {
		this.referenceProperty = referenceProperty;
		ensureReferencePropertyDescriptorCreated();
		return this;
	}

	/**
	 * @return the associatedListProperty
	 */
	public boolean isAssociatedListProperty() {
		return associatedListProperty;
	}

	/**
	 * @param associatedListProperty the associatedListProperty to set
	 */
	public ColumnMetaData associatedListProperty(boolean associatedListProperty) {
		this.associatedListProperty = associatedListProperty;
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
		try {
			this.propertyDescriptor
				= new PropertyDescriptor(name, entityClass, getBooleanAccessorName(name), null);
		} catch (IntrospectionException e) {
			logger.warn("Failed to create property derscriptor for property " + name + " of class " + entityClass.getName(), e);
		}
	}
	
	private void ensureReferencePropertyDescriptorCreated() {
		if (referencePropertyDescriptor != null || StringUtils.isBlank(referenceProperty)) {
			return;
		}
		try {
			this.referencePropertyDescriptor
				= new PropertyDescriptor(referenceProperty, propertyJavaType, getBooleanAccessorName(referenceProperty), null);
		} catch (IntrospectionException e) {
			logger.warn("Failed to create property derscriptor for property " + referenceProperty + " of class " + propertyJavaType.getName(), e);
		}
	}
	
	private String getBooleanAccessorName(String propertyName) {
		return "is" + propertyName.substring(0, 1).toUpperCase(java.util.Locale.ENGLISH) + propertyName.substring(1);
	}
	
	@Override
	public int compareTo(ColumnMetaData o) {
		int thisVal = this.order;
		int anotherVal = o.order;
		return (thisVal<anotherVal ? -1 : (thisVal==anotherVal ? 0 : 1));
	}
}
