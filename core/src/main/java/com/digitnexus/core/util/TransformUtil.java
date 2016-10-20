package com.digitnexus.core.util;

import java.util.Collection;

import com.digitnexus.core.json.JsonUtil;

public class TransformUtil {
	@SuppressWarnings("unchecked")
	public static String object2String(Object body) {
		String strBody = "";
		if (body == null) {
			return null;
		} else if (body instanceof String) {
			strBody = body.toString();
		} else if (body instanceof Collection) {
			strBody = JsonUtil.toJson((Collection<Object>) body);
		} else if (body instanceof Object[]) {
			
			Object[] bodys = (Object[]) body;
			StringBuilder builder = new StringBuilder("[");
			for (int i = 0; i < bodys.length; i++) {
				if (i !=0) {
					builder.append(", ");
				}
				builder.append(object2String(bodys[i]));
			}
			builder.append("]");
			strBody = builder.toString();
		} else {
			strBody = JsonUtil.toJson(body, true);
		}

		return strBody;
	}
	
//	@SuppressWarnings("unchecked")
//    public static <T> T string2object(String body, Class<T> entityClass) {
//		T t = null;
//		if (t instanceof String) {
//			return t = (T)body;
//		} else if (t instanceof Collection) {
//			t = (T)JsonUtil.toList(body, entityClass);
//		} 
//		else if (t instanceof Object[]) {
////TODO			not support
//		} else {
//			t = (T)JsonUtil.toObject(body, entityClass);
//		}
//
//		return t;
//	}
}
