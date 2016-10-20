package com.digitnexus.core.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.ApplicationEventMulticaster;
import org.springframework.stereotype.Service;

@Service
public class EventAPI {
	@Autowired
	private ApplicationEventMulticaster eventMultiCaster;

	public void publishEvent(ApplicationEvent event) {
		eventMultiCaster.multicastEvent(event);
	}

}
