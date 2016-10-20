/**
 * 
 */
package com.digitnexus.core.json;

import java.sql.Timestamp;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.commons.beanutils.DynaBean;

import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * @author Santanu
 *
 */
public class TimestampTypeAdapter extends TypeAdapter<Timestamp> {
	
	public static TimestampTypeAdapter INSTANCE = new TimestampTypeAdapter();

	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonBeanProcessor#processBean(java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public JSONObject processBean(Object bean, JsonConfig jsonConfig) {
		if (bean instanceof Timestamp) {
			JSONObject json = new JSONObject();
			json.element("timestamp", DataFormatUtil.formatDateTime((Timestamp)bean));
			return json;
		}
		return new JSONObject(true);
	}

	/* (non-Javadoc)
	 * @see net.sf.json.processors.JsonValueProcessor#processObjectValue(java.lang.String, java.lang.Object, net.sf.json.JsonConfig)
	 */
	@Override
	public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
		if (value instanceof Timestamp) {
			return DataFormatUtil.formatDateTime((Timestamp)value);
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.web.json.TypeAdapter#processJson(java.lang.Object)
	 */
	@Override
	public Timestamp processJson(Object value) {
		String json = null;
		if (value instanceof DynaBean) {
			json = (String)((DynaBean)value).get("timestamp");
		} else if (value instanceof String) {
			json = (String)value;
		} else {
			return null;
		}
		return (Timestamp) DataFormatUtil.parse(json, Timestamp.class, DataType.DATETIME);
	}

}
