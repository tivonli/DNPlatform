/**
 * 
 */
package com.digitnexus.core.nosql.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark that a document is persisted in the file store (GridFS)
 * @author Santanu
 */
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE })
public @interface FileStoreDocument {
	/**
	 * Optionally provides the bucket where this document should go to
	 * @return the name of the bucket
	 */
	public String bucket() default "";
}
