package com.digitnexus.core.entity;

public class DeleteEvent<T> extends EntityEvent<T> {

	public DeleteEvent(T entity) {
		super(entity);
	}

	public DeleteEvent(T entity, EntityEvent<T> entityEvent) {
		super(entity, entityEvent);
	}

}
