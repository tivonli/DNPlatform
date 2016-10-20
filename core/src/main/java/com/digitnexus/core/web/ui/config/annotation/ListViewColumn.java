/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Declares a field in the entity to be displayed in the list view.
 * 
 * @author Santanu
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ListViewColumn {
	/**
	 * Internationalized display key. By default we can take the 
	 * key following some convention.
	 * 
	 * @return
	 */
	String displayKey() default "";
	/**
	 * Defines the order in which the columns will appear 
	 * in the list view
	 *  
	 * @return
	 */
	int order();
	
	/**
	 * Indicates the width of the field in % value. If not 
	 * indicated then gets calculated based on the database
	 * column size. 
	 *  
	 * @return
	 */
	int widthPercentage() default -1;
	
	/**
	 * Marks the field as hidden in the list view UI
	 * @return
	 */
	boolean hidden() default false;
	
	/**
	 * Makes the field sortable or not
	 * @return
	 */
	boolean sortable() default true;
	
	/**
	 * Defines the data type for UI
	 * @return
	 */
	DataType dataType() default DataType.UNDEFINED;
	
	/**
	 * Defines the display type for this field. If not
	 * defined, it will be guessed using the data type
	 * @return
	 */
	DisplayType display() default DisplayType.UNDEFINED;
	
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
	//we need to display a list for an entity type from the edit view if this entity
	//class is referred from that class. we will maintain a different list view meta
	//information for such cases.
	/**
	 * Designates if this property should appear in the list shown from the edit
	 * view for selecting a association property
	 * @return
	 */
	boolean associationListProperty() default false;
}
