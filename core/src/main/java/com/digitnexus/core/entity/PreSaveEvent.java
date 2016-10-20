package com.digitnexus.core.entity;

public class PreSaveEvent<T> extends SaveEvent<T> {

	public PreSaveEvent(T entity, EntityEvent<T> entityEvent, boolean newObject) {
		super(entity, entityEvent, newObject);
	}

	public PreSaveEvent(T entity, boolean newObject) {
		super(entity, newObject);
	}

}
