package com.digitnexus.core.entity;

public class PostSaveEvent<T> extends SaveEvent<T> {

	public PostSaveEvent(T entity, EntityEvent<T> entityEvent, boolean newObject) {
		super(entity, entityEvent, newObject);
	}
}
