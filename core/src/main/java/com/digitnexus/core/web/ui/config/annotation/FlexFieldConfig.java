/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Indicates the map in entity contains flex field. Several flex field configurations can be defined
 * for a single map.
 * @author adi
 */
@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface FlexFieldConfig {
	
	/**
	 * Defines name of the flex fields config. Make sure the name adheres to property naming convention. For display name,
	 * 'fully qualified name of entity'+'.'+name property should be present in properties files
	 * @return
	 */
	String name();
	
	
	/**
	 * Flex fields
	 * @see FlexField
	 * @return
	 */
	FlexField[] fields();
	
	
	/**
	 * 
	 * Allows to specify multiple flex field configuration on the map.
	 * @see FlexFieldConfig
	 *
	 */
	@Target({ElementType.TYPE,ElementType.METHOD})
	@Retention(RetentionPolicy.RUNTIME)
	@interface FlexConfigList {
		FlexFieldConfig[] value();
	}

}
