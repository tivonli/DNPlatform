package com.digitnexus.core.entity.listener;

import org.springframework.context.ApplicationListener;

import com.digitnexus.core.entity.EntityEvent;

/**
 * Marker interface every entity event listener should extend
 * @author adi
 * @param <T>
 *
 */
public interface EntityEventListener<T> extends ApplicationListener<EntityEvent<T>>{
}
