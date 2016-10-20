/**
 * 
 */
package com.digitnexus.core.nosql.spring.config;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.BeanDefinitionStoreException;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser;
import org.springframework.beans.factory.xml.ParserContext;
import org.w3c.dom.Element;

/**
 * @author Santanu
 *
 */
public class MappingContextParser extends AbstractSingleBeanDefinitionParser {

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser#getBeanClass(org.w3c.dom.Element)
	 */
	@Override
	protected Class<?> getBeanClass(Element element) {
		return MongoMappingContextFactory.class;
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser#getBeanClassName(org.w3c.dom.Element)
	 */
	@Override
	protected String getBeanClassName(Element element) {
		return MongoMappingContextFactory.class.getName();
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.xml.AbstractBeanDefinitionParser#resolveId(org.w3c.dom.Element, org.springframework.beans.factory.support.AbstractBeanDefinition, org.springframework.beans.factory.xml.ParserContext)
	 */
	@Override
	protected String resolveId(Element element, AbstractBeanDefinition definition, ParserContext parserContext)
			throws BeanDefinitionStoreException {
		if (!element.hasAttribute(ID_ATTRIBUTE)) {
			return "mongoMappingContext";
		}
		return super.resolveId(element, definition, parserContext);
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.xml.AbstractSingleBeanDefinitionParser#doParse(org.w3c.dom.Element, org.springframework.beans.factory.support.BeanDefinitionBuilder)
	 */
	@Override
	protected void doParse(Element element, BeanDefinitionBuilder builder) {
		String basePackage = element.getAttribute("base-package");
		if (StringUtils.isNotBlank(basePackage)) {
			builder.addPropertyValue("basePackage", basePackage);
		}
		
		//TODO add support for custom converters
	}
}
