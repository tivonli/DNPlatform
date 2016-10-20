/**
 * 
 */
package com.digitnexus.core.json;


/**
 * @author Santanu
 *
 */
class PrimitiveLongTypeAdapter extends LongTypeAdapter {
	
	public static PrimitiveLongTypeAdapter INSTANCE = new PrimitiveLongTypeAdapter();

	@Override
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Class morphsTo() {
		return Long.TYPE;
	}
}
