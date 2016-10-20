package com.digitnexus.core.entity;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;


public class ValidateEvent<T> extends EntityEvent<T> {
	private static final long	serialVersionUID	= 1L;
	
	private boolean						newObject;
	private boolean						delete;
	private SetMultimap<String, String>	messagesByField;

	public ValidateEvent(T entity) {
		super(entity);
		messagesByField=HashMultimap.create();
	}

	public ValidateEvent(T entity, EntityEvent<T> entityEvent) {
		super(entity, entityEvent);
		messagesByField=HashMultimap.create();
	}
	
	public ValidateEvent(T entity, EntityEvent<T> entityEvent,SetMultimap<String, String>	messagesByField) {
		super(entity, entityEvent);
		this.messagesByField=messagesByField;
	}
	
	

	public boolean isNewObject() {
		return newObject;
	}

	public boolean isValid() {
		return messagesByField.isEmpty();
	}

	public boolean isDelete() {
		return delete;
	}

	public ValidateEvent<T> setDelete(boolean delete) {
		this.delete = delete;
		return this;
	}

	public ValidateEvent<T> setNewObject(boolean newObject) {
		this.newObject = newObject;
		return this;
	}
	
	public void addMessage(String message){
		//General message not specific to any field
		addMessage("all", message);	
	}
	
	public void addMessage(String fieldName,String message){
		assert message!=null;
		messagesByField.put(fieldName, message);
	}

	public SetMultimap<String, String> getMessagesByField() {
		return messagesByField;
	}
}
