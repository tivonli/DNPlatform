/**
 * 
 */
package com.digitnexus.core.json;

import java.util.Date;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.beanutils.DynaBean;

import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * @author Santanu
 *
 */
public class DateTypeAdapter extends TypeAdapter<Date> {
	
	public static DateTypeAdapter INSTANCE = new DateTypeAdapter();
	
	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonBeanProcessor#processBean(java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public JSONObject processBean(Object bean, JsonConfig jsonConfig) {
		if (bean instanceof Date) {
			JSONObject json = new JSONObject();
			json.element("date", DataFormatUtil.formatDate((Date)bean));
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
		if (value instanceof Date) {
			return DataFormatUtil.formatDate((Date)value);
		}
		return null;
	}
	
	/* (non-Javadoc)
	 * @see org.santanu.json.TypeAdapter#processJson(java.lang.Object)
	 */
	@Override
	public Date processJson(Object value) {
		String json = null;
		if (value instanceof DynaBean) {
			json = (String)((DynaBean)value).get("date");
		} else if (value instanceof String) {
			json = (String)value;
		} else {
			return null;
		}
		return (Date) DataFormatUtil.parse(json, Date.class, DataType.DATE);
	}

}
