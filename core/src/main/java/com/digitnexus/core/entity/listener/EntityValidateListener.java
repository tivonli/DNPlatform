package com.digitnexus.core.entity.listener;

import org.springframework.context.ApplicationListener;

import com.digitnexus.core.entity.ValidateEvent;

public interface EntityValidateListener<T> extends ApplicationListener<ValidateEvent<T>> {
   
}
