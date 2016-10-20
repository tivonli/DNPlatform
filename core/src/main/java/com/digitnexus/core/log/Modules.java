package com.digitnexus.core.log;

import java.util.ArrayList;
import java.util.List;

public enum Modules {
	autoid, admin, bi, discovery, application, other;

	private static List<String> modulesList = new ArrayList<String>();

	public static List<String> listModules() {
		if (modulesList.size() == 0) {
			for (Modules c : Modules.values()) {
				modulesList.add(c.name());
			}
			for (CommonModules c : CommonModules.values()) {
				modulesList.add("common." + c.name());
			}
			for (CoreModules c : CoreModules.values()) {
				modulesList.add("core." + c.name());
			}
		}

		return modulesList;
	}

//	public static Modules asEnum(String value) {
//		try {
//			return valueOf(value);
//		} catch (Exception e) {
//			throw new IllegalArgumentException("Unknown message Modules: "
//			        + value, e);
//		}
//	}
}
