package com.digitnexus.core.spring;

import org.springframework.beans.factory.config.BeanPostProcessor;

/**
 * Convenient class to avoid implementing default methods of BeanPostProcessor
 * @author Adi
 *
 */
public abstract class AbstractBeanPostProcessor implements BeanPostProcessor {

	@Override
	public Object postProcessBeforeInitialization(Object bean, String beanName) {
		return bean;
	}

	@Override
	public Object postProcessAfterInitialization(Object bean, String beanName) {
		return bean;
	}

}
