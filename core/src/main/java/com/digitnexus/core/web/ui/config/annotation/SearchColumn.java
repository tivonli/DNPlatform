package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * declare the search configuration for the data
 * @author yanghuan-dn
 *
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface SearchColumn {
	/**
	 * Internationalized display key. By default we can take the 
	 * key following some convention.
	 * 
	 * @return
	 */
	String displayKey() default "";
	/**
	 * Defines the order in which the columns will appear 
	 * in the search view
	 *  
	 * @return
	 */
	int order();
	/**
	 * Defines the data type of this field. This will be derived 
	 * automatically if not specified from the type of the field.
	 * 
	 * @return
	 */
	DataType dataType() default DataType.UNDEFINED;
	/**
	 * Defines the display type for this field. This will be derived
	 * if not specified
	 * 
	 * @return
	 */
	DisplayType displayType() default DisplayType.UNDEFINED;
		
	/**
	 * Static value allowed for a select search rule. 
	 * An example of configured 
	 * values are {"key1:value1", "key2:value2"} 
	 * @return
	 */
	String[] criteria() default {};
	
	/**
	 * Static value allowed for a select or radio. Should not 
	 * be useful for any other case. An example of configured 
	 * values are {"key1:value1", "key2:value2"} 
	 * @return
	 */
	String[] values() default {};
	
	/**
	 * Makes sense if the data type is reference. This refers to the 
	 * property of the other side of the relation that is to be shown in the UI
	 * @return
	 */
	String referenceProperty() default "";
	
	/**
	 * mark the field which will appear in the basic search
	 * if it's true, will appear in both basic and advanced search
	 * if it's false, will only appear in advanced search
	 * @return
	 */
	boolean basic() default false;
	
	/**
	 * mark the the field which will appear in the pop up window
	 * it's true , will appear in the list View and pop up window
	 * it's false , just will appear in the list view.
	 * @return 
	 * */
	boolean inPopupWindow() default false;
}
