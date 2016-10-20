/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 
 * @author Santanu
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Attachment {
	/**
	 * 
	 * @return
	 */
	String descriptionField() default "";
	
	
	//show the field when add,also edit,it's use only in the map layer mananger,the upload img will split into small tile
	//default the attachment field only show in edit,but in map layer it will show in the add 	
	boolean showAdd() default false;
	
	/**
	 * 
	 * @return
	 */
	AttachmentType[] type() default {AttachmentType.ANY};
}
