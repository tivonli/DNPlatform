/**
 * 
 */
package com.digitnexus.core.test.component.event;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * Listener used for testing
 * @author Adi
 * 
 */
@Component
public class CustomEventListener implements ApplicationListener<CustomEvent> {

	@Override
	public void onApplicationEvent(CustomEvent event) {
		event.setConsumed(true);	
		
	}

}
