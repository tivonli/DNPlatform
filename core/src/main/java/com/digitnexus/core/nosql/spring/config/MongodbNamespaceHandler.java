/**
 * 
 */
package com.digitnexus.core.nosql.spring.config;

import org.springframework.beans.factory.xml.NamespaceHandlerSupport;

/**
 * @author Santanu
 */
public class MongodbNamespaceHandler extends NamespaceHandlerSupport {

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.xml.NamespaceHandler#init()
	 */
	@Override
	public void init() {
		registerBeanDefinitionParser("mongo-mapping-context", new MappingContextParser());
	}

}
