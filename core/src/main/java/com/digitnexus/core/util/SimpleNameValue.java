package com.digitnexus.core.util;

public class SimpleNameValue {
	private Object name;
	private Object value;
	
	public SimpleNameValue(){}
	
	public SimpleNameValue(Object name,Object value){
		this.name = name;
		this.value = value;
	}
	
	public Object getName() {
		return name;
	}
	public void setName(Object name) {
		this.name = name;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
}
