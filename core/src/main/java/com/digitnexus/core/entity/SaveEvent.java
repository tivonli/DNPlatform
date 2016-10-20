package com.digitnexus.core.entity;

public abstract class SaveEvent<T> extends EntityEvent<T> {
	private boolean newObject;

	public SaveEvent(T entity, EntityEvent<T> entityEvent,boolean newObject) {
		super(entity, entityEvent);
		this.newObject=newObject;
	}
	

	public SaveEvent(T entity, boolean newObject) {
		super(entity);
		this.newObject=newObject;
	}
	
	
	
	public boolean isNewObject() {
		return newObject;
	}

}
