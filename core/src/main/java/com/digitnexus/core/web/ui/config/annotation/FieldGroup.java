package com.digitnexus.core.web.ui.config.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldGroup {
	String name() default "";
	boolean hidden() default false;
	int order() default -1;
	FieldGroupType type() default FieldGroupType.UNDEFINED;
}
