package com.digitnexus.core.web.ui.config.dataobject;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.util.LinkedHashMap;

import org.apache.commons.lang.StringUtils;

@SuppressWarnings("rawtypes")
public class ItemMetaData implements Comparable<ItemMetaData> {
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
	//the order of the element in the search area
	private int order;
	//key of the internationalized display name of this field
	private String displayKey;
	//type of data - should be from a pre-defined list
	private String dataType;
	//ui-type like dropdown,checbox,radio,text etc - should be from a pre-defined list
	private String displayType;
	//length of the field - matters for numeric and string type fields
	private int length;
	//list of data which will be used to render dropdown
	private LinkedHashMap<String, String> criteria;
	//list of data which will be used to render dropdown
	private LinkedHashMap<String, String> values;	
	//this makes sense when data type is reference. this is the property
	//of the reference that is to be displayed in the UI
	private String referenceProperty;	
	//this is for showing association list in the search view area
	private ListViewMetaData associationListMeta;
	//mark the field will appear in basic search
	private boolean basic;
	//mark the field will appear in popup window
	private boolean inPopupWindow;
	/**
	 * constructor
	 */
	public ItemMetaData(){		
		criteria = new LinkedHashMap<String, String>();
		values = new LinkedHashMap<String, String>();
	}
	
	/**
	 * Copy constructor used for cloning.
	 * @param field
	 */
	public ItemMetaData(ItemMetaData field) {
		this.entityClass = field.entityClass;
		this.propertyJavaType = field.propertyJavaType;	
		this.propertyDescriptor = field.propertyDescriptor;	
		this.name = field.name;
		this.order = field.order;
		this.displayKey = field.displayKey;
		this.dataType = field.dataType;
		this.displayType = field.displayType;	
		this.length = field.length;
		this.criteria = new LinkedHashMap<String, String>(field.criteria);
		this.values = new LinkedHashMap<String, String>(field.values);
		this.referenceProperty = field.referenceProperty;
		this.basic = field.basic;
		this.inPopupWindow = field.inPopupWindow;
		if (field.associationListMeta != null) {
			this.associationListMeta = new ListViewMetaData(field.associationListMeta);
		}
	}

	public Class getEntityClass() {
		return entityClass;
	}

	public ItemMetaData entityClass(Class entityClass) {
		this.entityClass = entityClass;
		return this;
	}
	
	public Class getPropertyJavaType() {
		return propertyJavaType;
	}

	public ItemMetaData propertyJavaType(Class propertyJavaType) {
		this.propertyJavaType = propertyJavaType;
		return this;
	}
	
	public String getName() {
		return name;
	}

	public ItemMetaData name(String name) {
		this.name = name;
		return this;
	}

	public int getOrder() {
		return order;
	}

	public ItemMetaData order(int order) {
		this.order = order;
		return this;
	}

	public String getDisplayKey() {
		return displayKey;
	}

	public ItemMetaData displayKey(String displayKey) {
		this.displayKey = displayKey;
		return this;
	}

	public String getDataType() {
		return dataType;
	}

	public ItemMetaData dataType(String dataType) {
		this.dataType = dataType;
		return this;
	}

	public String getDisplayType() {
		return displayType;
	}

	public ItemMetaData displayType(String displayType) {
		this.displayType = displayType;
		return this;
	}

	public int getLength() {
		return length;
	}

	public ItemMetaData length(int length) {
		this.length = length;
		return this;
	}

	public LinkedHashMap<String, String> getCriteria() {
		return criteria;
	}
	
	public ItemMetaData criteria(LinkedHashMap<String, String> criteria) {
		if (criteria == null) {
			this.criteria.clear();
		} else {
			this.criteria.putAll(criteria);
		}
		return this;
	}
	
	public LinkedHashMap<String, String> getValues() {
		return values;
	}
	
	public ItemMetaData values(LinkedHashMap<String, String> values) {
		if (values == null) {
			this.values.clear();
		} else {
			this.values.putAll(values);
		}
		return this;
	}
	
	public String getReferenceProperty() {
		return referenceProperty;
	}

	public ItemMetaData referenceProperty(String referenceProperty) {
		this.referenceProperty = referenceProperty;
		ensureReferencePropertyDescriptorCreated();
		return this;
	}
	
	public ListViewMetaData getAssociationListMeta() {
		return associationListMeta;
	}

	public ItemMetaData associationListMeta(ListViewMetaData associationListMeta) {
		//this makes sense only if the data type is reference
		this.associationListMeta = associationListMeta;
		return this;
	}
	
	public boolean getBasic() {
		return basic;
	}

	public ItemMetaData basic(boolean basic) {
		this.basic = basic;
		return this;
	}
	
	public boolean getInPopupWindow(){
		return inPopupWindow;
	}
	
	public ItemMetaData inPopupWindow(boolean inPopupWindow){
		this.inPopupWindow = inPopupWindow;
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
			throw new RuntimeException("Exception while introspection of property " + getName() + " of class "  + entityClass.getName(), e);
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
			throw new RuntimeException("Exception while introspection of property " + referenceProperty + " of class "  + propertyJavaType.getName(), e);
		}
	}
	
	@Override
	public int compareTo(ItemMetaData o) {
		int thisVal = this.order;
		int anotherVal = o.order;
		return (thisVal<anotherVal ? -1 : (thisVal==anotherVal ? 0 : 1));
	}
	
	private String getBooleanAccessorName(String propertyName) {
		return "is" + propertyName.substring(0, 1).toUpperCase(java.util.Locale.ENGLISH) + propertyName.substring(1);
	}
}
