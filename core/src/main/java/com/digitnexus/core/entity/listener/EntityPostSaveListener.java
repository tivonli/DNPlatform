package com.digitnexus.core.entity.listener;

import org.springframework.context.ApplicationListener;

import com.digitnexus.core.entity.PostSaveEvent;

public interface EntityPostSaveListener<T> extends ApplicationListener<PostSaveEvent<T>>{
  
}
