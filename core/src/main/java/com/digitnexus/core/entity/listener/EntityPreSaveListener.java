package com.digitnexus.core.entity.listener;

import org.springframework.context.ApplicationListener;

import com.digitnexus.core.entity.PreSaveEvent;

public interface EntityPreSaveListener<T> extends ApplicationListener<PreSaveEvent<T>>{
}
