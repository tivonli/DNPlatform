package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a field in a data object as editable in the auto generated
 * edit view.  
 * 
 * @author Santanu
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EditViewField {
	/**
	 * Internationalized display key. By default we can take the 
	 * key following some convention.
	 * 
	 * @return
	 */
	String displayKey() default "";
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
	 * Defines the order in which the columns will appear 
	 * in the list view
	 *  
	 * @return
	 */
	int order();
	
	/**
	 * Marks the field as hidden in the edit view UI
	 * @return
	 */
	boolean hidden() default false;
	/**
	 * Marks the field as read only in the edit view UI
	 * @return
	 */
	boolean readOnly() default false;

	/**
	 * Static value allowed for a select or radio. Should not 
	 * be useful for any other case. An example of configured 
	 * values are {"key1:value1", "key2:value2"} 
	 * @return
	 */
	String[] values() default {};
	/**
	 * Map of actual value vs. image icon url. Relevant for cases
	 * with display type as icon. An example of this is
	 * {"fieldValue1:image/image1.jpeg", "fieldValue2:image/image2.jpeg"}
	 * @return
	 */
	String[] imageMap() default {};
	/**
	 * Makes sense if the data type is reference. This refers to the 
	 * property of the other side of the relation that is to be shown in the UI
	 * @return
	 */
	String referenceProperty() default "";
	
	/**
	 * Marks the field as updatable in Edit view UI.
	 * Use this in case of methods which do not have hibernate annotation indicating update
	 * @return
	 */
	boolean updatable() default true;
	
	
	/**
	 * The name of filter specified in searchConfig.xml. 
	 * Used for filtering data in association list view
	 * @return
	 */
	String searchCriteriaName() default "";

	/*
	 * whether to display in editview
	 */
	boolean editDisplay() default true;
	
	/**
	 * Mark the field is belong to which group, group name ,order, displayName ,Hidden
	 * @return FieldGroup
	 * */
	FieldGroup fieldGroup() default @FieldGroup();
}
