package com.digitnexus.core.event;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.SmartApplicationListener;

public abstract class AbstractContextRefreshListener implements SmartApplicationListener {
	@Override
	public boolean supportsEventType(Class<? extends ApplicationEvent> eventType) {
		return ContextRefreshedEvent.class.isAssignableFrom(eventType);
	}

	@Override
	public boolean supportsSourceType(Class<?> sourceType) {
		return true;
	}

}
