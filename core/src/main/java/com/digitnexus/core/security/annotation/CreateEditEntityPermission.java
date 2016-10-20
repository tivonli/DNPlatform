package com.digitnexus.core.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Use this for methods either create or update a entity.For example saveOrUpdate in EntityService. Actual user operation and resource is resolved based on state
 * of SecuredResource annotation.This should be used only on persistable entities
 * @author Adi
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Inherited
public @interface CreateEditEntityPermission {
}
