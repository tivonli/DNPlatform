/**
 * 
 */
package com.digitnexus.core.web.ui.config.dataobject;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author Santanu
 */
public class ListViewData {
	private Map<String, Object> data = new LinkedHashMap<String, Object>();

	public Map<String, Object> getData() {
		if (data == null) {
			data = new LinkedHashMap<String, Object>();
		}
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}
	
	public void addFieldData(String property, Object value) {
		getData().put(property, value);
	}
}
