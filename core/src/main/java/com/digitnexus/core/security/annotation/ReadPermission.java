package com.digitnexus.core.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.digitnexus.core.domain.ResourceType;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface ReadPermission {
	String resource() default "";
	ResourceType resourceType() default ResourceType.ENTITY;
}
