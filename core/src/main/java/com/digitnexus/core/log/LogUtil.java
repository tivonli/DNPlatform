/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.log;

import com.digitnexus.core.util.TransformUtil;

/**
 * Util class for formating log
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2012-11-20
 * @since 1.6.0
 */
public class LogUtil {

	public static final String SPLITTER = " -_- ";

	/**
	 * format the error log
	 * 
	 * @param param
	 *            the request parameter. do not include the import info such as
	 *            password.
	 * @return formated String
	 */
	public static String format(Object... param) {
		return format("", "", param);
	}

	/**
	 * format the error log
	 * 
	 * @param description
	 *            for error
	 * @param param
	 *            the request parameter. do not include the import info such as
	 *            password.
	 * @return formated String
	 */
	public static String format(String errorDesc, Object... param) {
		return format("", errorDesc, param);
	}

	/**
	 * format the error log
	 * 
	 * @param the
	 *            id of this message
	 * @param description
	 *            for error
	 * @param param
	 *            the request parameter. do not include the import info such as
	 *            password.
	 * @return formated String
	 */
	public static String format(String messageId, String errorDesc,
	        Object... param) {
		return new StringBuilder().append(messageId == null ? "" : messageId)
		        .append(SPLITTER).append(errorDesc == null ? "" : errorDesc)
		        .append(SPLITTER).append(TransformUtil.object2String(param))
		        .append(SPLITTER).toString();
	}

	/**
	 * get match module by the callerClassName.
	 * 
	 * @param callerClassName
	 *            the callerClassName or a String contain the callerClassName
	 * @return  related module
	 */
	public static String getModuleNameByClassName(String callerClassName) {
		boolean isInternalModule = false;
		if (callerClassName.indexOf("com.digitnexus") > -1) {
			isInternalModule = true;
		}
		
		for (String name : Modules.listModules()) {
			if (callerClassName.indexOf("." + name.toLowerCase() + ".") > -1) {
				return name;
			}
		}

		if (isInternalModule) {
			return Modules.application.name();
		} else {
			return Modules.other.name();
		}
	}

}
