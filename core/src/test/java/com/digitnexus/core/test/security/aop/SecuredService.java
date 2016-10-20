package com.digitnexus.core.test.security.aop;

import com.digitnexus.core.domain.Permission;





/**
 * Dummy service used for testing permissions
 * @author Adi
 *
 */

public interface SecuredService {

	
	public void checkRead(SecuredEntity securedEntity);
    
	
	public void checkCreate(SecuredEntity securedEntity);

	
	public void checkEdit(SecuredEntity securedEntity);

	
	public void checkDelete(SecuredEntity securedEntity);
	
	public void checkReadWithoutResource(String test,SecuredEntity securedEntity);
	
	public void checkReadWithoutResourceClass(Class<?> entityType, SecuredEntity securedEntity);
	
	public void checkCreateEditEntity(Permission permission);

}
