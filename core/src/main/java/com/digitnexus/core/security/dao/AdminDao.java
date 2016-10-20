package com.digitnexus.core.security.dao;

import java.util.Set;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;

public interface AdminDao extends BaseDao {
	
	/**
	 * 
	 * @return Set of resource for which permissions are defined
	 */
	Set<String> getSecuredResources();
	
	Permission getPermission(String resource,UserOperation userOperation);
	
	Role getRoleByName(String roleName);
	
	Permission getPermissionByName(String permissionName);

	/**
	 * Finds an {@link Organization} by the {@link Organization} code
	 * @param code
	 * @return
	 */
	public Organization getOrganizationByCode(String code);
	/**
	 * 
	 * @param root
	 * @param sub
	 * @return if sub is sub-organization of root
	 */
	public boolean isSubOrganization(Organization root, Organization sub);
}
