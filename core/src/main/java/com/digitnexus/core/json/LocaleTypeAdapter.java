/**
 * 
 */
package com.digitnexus.core.json;

import java.util.Locale;
import java.util.StringTokenizer;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.beanutils.DynaBean;

/**
 * @author Santanu
 *
 */
class LocaleTypeAdapter extends TypeAdapter<Locale> {
	
	public static LocaleTypeAdapter INSTANCE = new LocaleTypeAdapter();

	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonBeanProcessor#processBean(java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public JSONObject processBean(Object bean, JsonConfig jsonConfig) {
		if (bean instanceof Locale) {
			JSONObject json = new JSONObject();
			json.element("locale", bean.toString());
			return json;
		}
		return new JSONObject(true);
	}

	/*
	 * (non-Javadoc)
	 * @see net.sf.json.processors.JsonValueProcessor#processObjectValue(java.lang.String, java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
		if (value instanceof Locale) {
			return value.toString();
		}
		return null;
	}
	
	/*
	 * (non-Javadoc)
	 * @see org.santanu.json.TypeAdapter#processJson(java.lang.Object)
	 */
	@Override
	public Locale processJson(Object value) {
		String json = null;
		if (value instanceof DynaBean) {
			json = (String)((DynaBean)value).get("locale");
		} else if (value instanceof String) {
			json = (String)value;
		} else {
			return null;
		}
	    StringTokenizer tokenizer = new StringTokenizer(json, "_");
	    String language = null;
	    String country = null;
	    String variant = null;
	    if (tokenizer.hasMoreElements()) {
	      language = tokenizer.nextToken();
	    }
	    if (tokenizer.hasMoreElements()) {
	      country = tokenizer.nextToken();
	    }
	    if (tokenizer.hasMoreElements()) {
	      variant = tokenizer.nextToken();
	    }
	    if (country == null && variant == null) {
	      return new Locale(language);
	    } else if (variant == null) {
	      return new Locale(language, country);
	    } else {
	      return new Locale(language, country, variant);
	    }
	}

}
