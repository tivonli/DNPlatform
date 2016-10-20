package com.digitnexus.core.event;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.SimpleApplicationEventMulticaster;
import org.springframework.context.event.SmartApplicationListener;
import org.springframework.core.GenericTypeResolver;
import org.springframework.stereotype.Service;

import com.digitnexus.core.entity.EntityEvent;
import com.digitnexus.core.entity.listener.AbstractEntityEventListener;
import com.digitnexus.core.entity.listener.EntityDeleteListener;
import com.digitnexus.core.entity.listener.EntityPostSaveListener;
import com.digitnexus.core.entity.listener.EntityPreSaveListener;
import com.digitnexus.core.entity.listener.EntityValidateListener;

@Service("applicationEventMulticaster")
public class EventMulticaster extends SimpleApplicationEventMulticaster {
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected boolean supportsEvent(ApplicationListener listener, Class<? extends ApplicationEvent> eventType, Class sourceType) {
		boolean supportEvent = super.supportsEvent(listener, eventType, sourceType);
		if (supportEvent && EntityEvent.class.isAssignableFrom(eventType)) {
			Class listenerType = null;
			if (listener instanceof EntityPreSaveListener) {
				listenerType = EntityPreSaveListener.class;
			} else if (listener instanceof EntityPostSaveListener) {
				listenerType = EntityPostSaveListener.class;
			} else if (listener instanceof EntityValidateListener) {
				listenerType = EntityValidateListener.class;
			} else if (listener instanceof EntityDeleteListener) {
				listenerType = EntityDeleteListener.class;
			}else if(listener instanceof AbstractEntityEventListener) {
				listenerType = AbstractEntityEventListener.class;
			} else if (listener instanceof SmartApplicationListener) {
				//this means this is already verified with the listener
				return true;
			} else {
				return false;
			}
			Class typeArg = GenericTypeResolver.resolveTypeArgument(listener.getClass(),listenerType);
			return typeArg.isAssignableFrom(sourceType);
			
		}
		return supportEvent;
	}
}
