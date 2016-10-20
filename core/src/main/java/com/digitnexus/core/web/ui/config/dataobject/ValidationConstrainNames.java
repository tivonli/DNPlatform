package com.digitnexus.core.web.ui.config.dataobject;

/**
 * Names of special validations like email, url etc. The names are same as those used by jquery validate plugin,
 * so that UI code can directly add them as class names. Even if we don't use jquery validate plugin, we make this as
 * standard validation names in our platform
 * 
 * @author Adi
 *
 */
public interface ValidationConstrainNames {
	String	EMAIL	= "email";
	String	URL		= "url";

}
