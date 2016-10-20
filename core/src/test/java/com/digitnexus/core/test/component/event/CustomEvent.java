package com.digitnexus.core.test.component.event;

import org.springframework.context.ApplicationEvent;

public class CustomEvent extends ApplicationEvent {

	private static final long	serialVersionUID	= 1L;
	private boolean consumed;

	public CustomEvent(Object source) {
		super(source);
	}

	public boolean isConsumed() {
		return consumed;
	}

	public void setConsumed(boolean consumed) {
		this.consumed = consumed;
	}

}
