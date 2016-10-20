package com.digitnexus.core.web.ui.config.dataobject;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author yanghuan-dn
 *
 */
public class SearchMetaData {
	@SuppressWarnings("rawtypes")
	private Class entityClass;
	private String name;
	private String displayKey;
	//list of column this table is going to display
	private List<ItemMetaData> fields = new ArrayList<ItemMetaData>();
	
	public SearchMetaData(){
		
	}
	
	public SearchMetaData(String name, @SuppressWarnings("rawtypes") Class entityClass, String displayKey) {
		this.name = name;
		this.entityClass = entityClass;
		this.displayKey = displayKey;
	}
	
	public SearchMetaData(SearchMetaData anotherSearchMeta) {
		this.name = anotherSearchMeta.name;
		this.entityClass = anotherSearchMeta.entityClass;
		this.displayKey = anotherSearchMeta.displayKey;		
		for (ItemMetaData column:anotherSearchMeta.fields) {
			fields.add(new ItemMetaData(column));
		}
	}

	@SuppressWarnings("rawtypes")
	public Class getEntityClass() {
		return entityClass;
	}

	@SuppressWarnings("rawtypes")
	public void setEntityClass(Class entityClass) {
		this.entityClass = entityClass;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayKey() {
		return displayKey;
	}

	public void setDisplayKey(String displayKey) {
		this.displayKey = displayKey;
	}

	public List<ItemMetaData> getFields() {
		return fields;
	}

	public void setFields(List<ItemMetaData> fields) {
		this.fields = fields;
	}
	
	public void addFields(ItemMetaData field) {
		if (fields == null) {
			fields = new ArrayList<ItemMetaData>();
		}
		fields.add(field);
	}
}
