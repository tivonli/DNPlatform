package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.i18n.I18NUtil;

public class FieldGroupMeta implements Comparable<FieldGroupMeta>{
	private String name;
	private boolean hidden;
	private int order;
	private String displayName;
	private String fieldGroupType;
	
	public FieldGroupMeta(){}
	
	public FieldGroupMeta(String name,boolean hidden){
		this.name = name;
		this.hidden = hidden;
		this.order = 0;
	}
	
	public FieldGroupMeta(String name,boolean hidden,int order){
		this.name = name;
		this.hidden = hidden;
		this.order = order;
	}
	
	public FieldGroupMeta(String name,boolean hidden,int order,String fieldGroupType){
		this.name = name;
		this.hidden = hidden;
		this.order = order;
		this.fieldGroupType = fieldGroupType;
	}
	
	public String getName(){
		return name;
	}
	
	public boolean isHidden(){
		return hidden;
	}
	
	public int getOrder(){
		return order;
	}
	
	public String getDisplayName(){
		displayName = I18NUtil.getMessage(getName(), null,  getName());
		return displayName;
	}
	
	public String getFieldGroupType(){
		return fieldGroupType;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof FieldGroupMeta){
			FieldGroupMeta objs = (FieldGroupMeta)obj;
			boolean name = objs.name.toUpperCase().equals(this.name.toUpperCase());
			boolean fieldGroupType = objs.fieldGroupType.toUpperCase().equals(this.fieldGroupType.toUpperCase());
			return name && fieldGroupType;
		}else{
			return super.equals(obj);
		}
	}

	@Override
	public int compareTo(FieldGroupMeta o) {
		int thisOrder = this.order;
		int anotherOrder = o.order;
		return (thisOrder<anotherOrder ? -1 : (thisOrder==anotherOrder ? 0 : 1));
	}
}
