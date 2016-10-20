package com.digitnexus.core.security.service;

import java.util.List;
import java.util.Set;

import com.digitnexus.core.domain.Menu;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;

public interface AdminService {
	Set<String> getSecuredResources();
	
	boolean isPermissionDefined(String resource,UserOperation userOperation);
	
	Role getRoleByName(String roleName);
	
	public List<Menu> getAllMenus();
	
	Permission getPermissionByName(String permissionName);

}
