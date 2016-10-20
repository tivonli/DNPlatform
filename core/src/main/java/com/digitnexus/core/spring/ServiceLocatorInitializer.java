package com.digitnexus.core.spring;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @author adi
 * To set {@link ApplicationContext} to {@link ServiceLocator} once application context is initialized
 */
@Component
public class ServiceLocatorInitializer implements ApplicationContextAware {

	/* (non-Javadoc)
	 * @see org.springframework.context.ApplicationContextAware#setApplicationContext(org.springframework.context.ApplicationContext)
	 */
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		ServiceLocator.setApplicationContext(applicationContext);

	}

}
