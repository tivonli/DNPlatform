package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marker annotation on method to indicate the field is used for storing flexfields config name
 * @author adi
 *
 */

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface FlexFieldDescriminator {

}
