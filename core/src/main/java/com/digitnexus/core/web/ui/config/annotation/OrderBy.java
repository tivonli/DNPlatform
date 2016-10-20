package com.digitnexus.core.web.ui.config.annotation;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

@Target({ })
@Retention(RUNTIME)
public @interface OrderBy {
	
	/**
	 * Name of the field on which sorting is done
	 * @return
	 */
	String name();
	
	/**
	 * Ascending or descending
	 * @return
	 */
	boolean ascending() default true;

}
