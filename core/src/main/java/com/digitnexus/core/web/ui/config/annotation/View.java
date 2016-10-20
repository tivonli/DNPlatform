/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation marks an entity as UI entity.
 * 
 * @author Santanu
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface View {
	/**
	 * Internationalized display key. By default we can take the 
	 * key following some convention.
	 * 
	 * @return
	 */
	String displayKey() default "";
	
	/**
	 * The group name decides the hierarchy where this article 
	 * type will appear
	 *  
	 * @return
	 */
	String group() default "";
	
	/**
	 * Indicates whether this entity can be created from parent view. Applies to associations
	 * @return
	 */
	boolean createFromParent() default false;
	
	/**
	 * Number of columns used in edit view to to display elements
	 */
	
	int layoutColumns() default 3;
	
	/**
	 * Default columns on which 
	 * @return
	 */
	OrderBy[] orderBy() default { };
	
	/**
	 * add the comments to article, will display the edit view and detail view
	 * Default comments is false;
	 * */
	boolean comments() default false;
	
	/**
	 * Indicates that this element is readOnly and not supposed to be edited by User
	 * @return
	 */
	boolean readOnly() default false;
	
}
