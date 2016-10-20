package com.digitnexus.core.entity;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationEvent;

/**
 * 
 * @author adi Event fired by EntityService during operations like save, update
 *         and delete on any entity/article/domain object. EntityService will
 *         set the entity as 'entity' of the Event.Respective listeners of
 *         operation can modify the source and can pass attributes to other
 *         listeners by adding to 'attributes' of this class.
 * @param <T>
 */
public abstract class EntityEvent<T> extends ApplicationEvent{
	private static final long	serialVersionUID	= 1L;
	private T					entity;
	private Map<Object, Object>	attributes	= new HashMap<Object, Object>();

	public EntityEvent(T entity) {
		super(entity);
		this.entity = entity;
	}
	
	public EntityEvent(T entity,EntityEvent<T> entityEvent) {
		this(entity);
		this.attributes=entityEvent.attributes;
	}

	public T getEntity() {
		return entity;
	}

	public Object addAttribute(Object key, Object value) {
		return attributes.put(key, value);
	}

	public Object getAttribute(Object key) {
		return attributes.get(key);
	}
}
