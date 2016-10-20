package com.digitnexus.core.json;
import net.sf.json.processors.DefaultValueProcessor;
public class NumberClassProcessor implements DefaultValueProcessor {
	public static NumberClassProcessor INSTANCE = new NumberClassProcessor();
	@Override
	public Object getDefaultValue(Class arg0) {
		return null;
	}

}
