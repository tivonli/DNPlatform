/**
 * 
 */
package com.digitnexus.core.json;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

/**
 * 
 * @author Santanu
 */
public class FlexibleObject {
	private Object wrapped;
	private Set<String> excludedProperties = new HashSet<String>();
	private Map<String, Object> additionalProperties = new HashMap<String, Object>();
	
	/**
	 * @param wrapped
	 */
	public FlexibleObject(Object wrapped) {
		this.wrapped = wrapped;
	}
	
	/**
	 * @return the wrapped
	 */
	public Object getWrappedObject() {
		return wrapped;
	}

	/**
	 * @return the excludedProperties
	 */
	public Set<String> getExcludedProperties() {
		return excludedProperties;
	}

	/**
	 * @return the additionalProperties
	 */
	public Map<String, Object> getAdditionalProperties() {
		return additionalProperties;
	}

	public FlexibleObject exclude(String propertyName) {
		excludedProperties.add(propertyName);
		return this;
	}
	
	public FlexibleObject addProperty(String propertyName, Object value) {
		if (StringUtils.isNotBlank(propertyName)) {
			additionalProperties.put(propertyName, value);
		}
		
		return this;
	}
}
