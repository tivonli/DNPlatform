/**
 * 
 */
package com.digitnexus.core.json;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import com.digitnexus.core.util.DataFormatUtil;

/**
 * @author Santanu
 *
 */
public abstract class NumberTypeAdapter<T extends Number> extends TypeAdapter<T> {

	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonBeanProcessor#processBean(java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public JSONObject processBean(Object bean, JsonConfig jsonConfig) {
		// This is not relevant for numeric values
		return new JSONObject(true);
	}

	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonValueProcessor#processObjectValue(java.lang.String, java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
		if (value instanceof Number) {
			return DataFormatUtil.formatNumber((Number)value);
		}
		return null;
	}
	
	/* (non-Javadoc)
	 * @see net.sf.ezmorph.Morpher#supports(java.lang.Class)
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public boolean supports(Class clazz) {
		return Number.class.isAssignableFrom(clazz) || String.class.isAssignableFrom(clazz);
	}
}
