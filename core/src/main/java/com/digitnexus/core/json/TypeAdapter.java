/**
 * 
 */
package com.digitnexus.core.json;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import org.apache.commons.beanutils.DynaBean;

import net.sf.ezmorph.ObjectMorpher;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonBeanProcessor;
import net.sf.json.processors.JsonValueProcessor;

/**
 * @author Santanu
 *
 */
public abstract class TypeAdapter<T> implements JsonBeanProcessor, JsonValueProcessor, ObjectMorpher {
	
	/* (non-Javadoc)
	 * @see net.sf.ezmorph.Morpher#morphsTo()
	 */
	@SuppressWarnings("unchecked")
	@Override
	public Class<T> morphsTo() {
		//we find out the generic class for this implementation
		//the type argument is the output class for the morpher
		Type genericSuperClass = this.getClass().getGenericSuperclass();
		if (genericSuperClass instanceof ParameterizedType) {
			Type[] paramterTypes = ((ParameterizedType)genericSuperClass).getActualTypeArguments();
			if (paramterTypes.length != 0) {
				return (Class<T>)paramterTypes[0];
			}
		}
		//not sure if this should have been done here!
		return (Class<T>)Object.class;
	}
	
	/* (non-Javadoc)
	 * @see net.sf.ezmorph.ObjectMorpher#morph(java.lang.Object)
	 */
	@Override
	public Object morph(Object value) {
		return processJson(value);
	}
	
	/**
	 * Process the Json value and create the java object
	 * @param value
	 * @return
	 */
	public abstract T processJson(Object value);
	
	/*
	 * (non-Javadoc)
	 * @see net.sf.json.processors.JsonValueProcessor#processArrayValue(java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public Object processArrayValue(Object value, JsonConfig jsonConfig) {
		// Dont think this is useful for our case, most of the time
		return null;
	}
	
	/* (non-Javadoc)
	 * @see net.sf.ezmorph.Morpher#supports(java.lang.Class)
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public boolean supports(Class clazz) {
		return DynaBean.class.isAssignableFrom(clazz) || String.class.isAssignableFrom(clazz);
	}

}
