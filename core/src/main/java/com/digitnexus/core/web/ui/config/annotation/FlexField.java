package com.digitnexus.core.web.ui.config.annotation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Annotation;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 * Configuration for each field in flex fields
 * @author adi
 *
 */
@Target({ })
@Retention(RUNTIME)
public @interface FlexField {
	/**
	 * *Defines name of the flex field. Make sure the name adheres to property naming convention. For display name,
	 * 'fully qualified name of entity'+'name of the field which holds flex fields map''.'+name property should be present in properties files
	 * @return
	 */
	String name();
	
	/**
	 * Array of validation related annotation class names from org.hibernate.validator.constraints and javax.validation.constraints
	 * packages
	 * @return
	 */
	Class<? extends Annotation>[] validations() default {};
	
	/**
	 * Edit View configuration for the field
	 * @return
	 */
	EditViewField editViewField();
}
