/**
 * 
 */
package com.digitnexus.core.json;

import com.digitnexus.core.util.DataFormatUtil;


/**
 * @author Santanu
 *
 */
class LongTypeAdapter extends NumberTypeAdapter<Long> {
	
	public static LongTypeAdapter INSTANCE = new LongTypeAdapter();

	/* (non-Javadoc)
	 * @see org.santanu.json.TypeAdapter#processJson(java.lang.Object)
	 */
	@Override
	public Long processJson(Object value) {
		if (value instanceof String) {
			return DataFormatUtil.parseLong((String)value);
		} else if (value instanceof Number) {
			return ((Number) value).longValue();
		}
		return null;
	}

}
