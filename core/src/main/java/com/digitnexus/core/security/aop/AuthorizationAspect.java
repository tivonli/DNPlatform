package com.digitnexus.core.security.aop;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.persistence.Entity;

import org.apache.commons.lang.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.security.annotation.CreateEditEntityPermission;
import com.digitnexus.core.security.annotation.CreatePermission;
import com.digitnexus.core.security.annotation.DeletePermission;
import com.digitnexus.core.security.annotation.EditPermission;
import com.digitnexus.core.security.annotation.ReadPermission;
import com.digitnexus.core.security.annotation.SecuredResource;
import com.digitnexus.core.security.util.SecurityUtil;

/**
 * Advices any method which has permission related to permissions. Special handling for generic methods operating on entities
 * @author Adi
 *
 */
@Aspect
@Component
public class AuthorizationAspect {
	@Inject
	@Named("baseDao")
	private BaseDao baseDao;
	
	private static final Set<String> systemResources;
	
	static{
		Set<String> sysResource=new HashSet<String>();
		sysResource.add("com.digitnexus.core.domain.Role");
		sysResource.add("com.digitnexus.core.domain.Permission");
		sysResource.add(User.class.getName());
		systemResources=Collections.unmodifiableSet(sysResource);
	}
	

	@Before(value = "@annotation(readPermission)", argNames = "readPermission")
	public void checkReadAccess(JoinPoint joinPoint, ReadPermission readPermission) {
		checkAccess(UserOperation.READ, joinPoint, readPermission.resource());
	}

	@Before(value = "@annotation(editPermission)", argNames = "editPermission")
	public void checkEditAccess(JoinPoint joinPoint, EditPermission editPermission) {
		checkAccess(UserOperation.EDIT, joinPoint, editPermission.resource());
	}

	@Before(value = "@annotation(createPermission)", argNames = "createPermission")
	public void checkCreateAccess(JoinPoint joinPoint, CreatePermission createPermission) {
		checkAccess(UserOperation.CREATE, joinPoint, createPermission.resource());
	}

	@Before(value = "@annotation(deletePermission)", argNames = "deletePermission")
	public void checkDeleteAccess(JoinPoint joinPoint, DeletePermission deletePermission) {
		checkAccess(UserOperation.DELETE, joinPoint, deletePermission.resource());
	}
	
	@Before(value = "@annotation(createEditPermission)", argNames = "createEditPermission")
	public void checkCreateEditAccess(JoinPoint joinPoint, CreateEditEntityPermission createEditPermission) {
		int argumentIndex=getSecuredAnnotatedArgumentIndex(joinPoint);
		if(argumentIndex!=-1){
			Object argument = joinPoint.getArgs()[argumentIndex];
			//Check if it have JPA entity annotation
			if(argument.getClass().getAnnotation(Entity.class)!=null){
				//Determine user operation
				if(baseDao.isTransient(argument)){
					checkAccess(UserOperation.CREATE, joinPoint, argument.getClass().getName());
				}else{
					checkAccess(UserOperation.EDIT, joinPoint, argument.getClass().getName());
				}
				
				return;
			}
		}
		//This should never happen in production scenarios
		throw new AccessDeniedException("Unable to determine resource");
	}

	private void checkAccess(UserOperation userOperation, JoinPoint joinPoint, String resource) {
		if (StringUtils.isEmpty(resource)) {
			int argumentIndex = getSecuredAnnotatedArgumentIndex(joinPoint);
			if (argumentIndex != -1) {
				Object argument = joinPoint.getArgs()[argumentIndex];
				resource=findResourceName(argument);
			}
		}

		if (StringUtils.isEmpty(resource)) {
			//This should never happen in production scenarios
			throw new AccessDeniedException("Unable to determine resource");
		}
		
		if (!SecurityUtil.isPermissionDefined(resource, userOperation)) {
			return;
		}

		//Check if the user is admin and resource is system resource. Hardcoded access
		//to system resources for admin
		if (SecurityUtil.isAdmin() && systemResources.contains(resource)) {
			return;
		}

		if (!SecurityUtil.hasPermission(userOperation, resource)) {
			//TODO:I18n
			throw new AccessDeniedException("Access Denied");
		}
	}

	@SuppressWarnings("rawtypes")
	private String findResourceName(Object argument) {
		if(argument instanceof Class){
			return ((Class)argument).getName();
		}else{
			return argument.getClass().getName();
		}
	}

	private int getSecuredAnnotatedArgumentIndex(JoinPoint joinPoint) {
		//This is the case for methods where actual entity class is not know. For example get in BaseDao
		MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
		joinPoint.getArgs();
		String methodName = methodSignature.getMethod().getName();
		//Check if any arguments have SecuredResource Annotation
		for (Method method : joinPoint.getTarget().getClass().getMethods()) {
			if (method.getName().equals(methodName)) {
				Annotation[][] parameterAnnotations = method.getParameterAnnotations();
				int i = 0;
				for (Annotation[] annotations : parameterAnnotations) {
					for (Annotation annotation : annotations) {
						if (annotation instanceof SecuredResource) {
							return i;
						}
					}

					i++;
				}
			}
		}

		return -1;
	}
}
