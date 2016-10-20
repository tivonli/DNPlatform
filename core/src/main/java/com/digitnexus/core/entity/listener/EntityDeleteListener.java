package com.digitnexus.core.entity.listener;

import org.springframework.context.ApplicationListener;

import com.digitnexus.core.entity.DeleteEvent;



public interface EntityDeleteListener<T> extends ApplicationListener<DeleteEvent<T>>{
  
}
