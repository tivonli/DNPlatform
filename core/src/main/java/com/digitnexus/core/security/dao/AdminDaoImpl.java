package com.digitnexus.core.security.dao;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;

/**
 * 
 * @author Adi
 *
 */
@Repository
public class AdminDaoImpl extends BaseDaoImpl implements AdminDao {

	@SuppressWarnings("unchecked")
	@Override
	public Set<String> getSecuredResources() {
		//Converting results to Set so that contains calls are faster
		Set<String> resources = new HashSet<String>();
		resources.addAll(getCachedNamedQuery(Permission.FIND_SECURED_RESOURCE).list());
		return resources;
	}

	@Override
	public Permission getPermission(String resource, UserOperation userOperation) {
		return (Permission) getCachedNamedQuery(Permission.FIND_BY_RESOURCE_OPERATION).setString(0, resource).setParameter(1, userOperation)
				.uniqueResult();
	}

	@Override
	public Role getRoleByName(String roleName) {
		return (Role) getCachedNamedQuery(Role.FIND_BY_NAME).setString(0, roleName).uniqueResult();
	}

	@Override
	public Permission getPermissionByName(String permissionName) {
		return (Permission) getCachedNamedQuery(Permission.FIND_BY_NAME).setString(0, permissionName).uniqueResult();
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.security.dao.AdminDao#getOrganizationByCode(java.lang.String)
	 */
	public Organization getOrganizationByCode(String code) {
		return (Organization) createCachableQuery("from Organization where code = ?").setString(0, code).uniqueResult();
	}

	@Override
	public boolean isSubOrganization(Organization root, Organization sub) {
		//oracle's native grammar
		/*Object result = getSession().createSQLQuery("select * from organizations where id =:subId start with parent_id = :rootId connect by prior id = parent_id")
		.setParameter("rootId", root.getId())
		.setParameter("subId", sub.getId()).uniqueResult();	
		return result==null?false:true*/	
		Set<String> orgIds = new HashSet<String>();
		boolean bIsSub= this.isSubWithDeathLoopCheck(root, sub,orgIds);
		return bIsSub;
	}
	private boolean isSubWithDeathLoopCheck(Organization root, Organization sub,Set<String> orgIds){
		boolean bIsSub= false;
		if(root.getId().equals(sub.getId())){
			return false;
		}
		for(Organization org:root.getSubOrganizations()){
			if(orgIds.contains(org.getId())){
				throw new IllegalArgumentException("Death Loop in organization tree. Error organization:"+org.getId());
			}
			if(sub.getId().equals(org.getId())){
				bIsSub = true;
				break;
			} else {
				orgIds.add(root.getId());
				orgIds.add(org.getId());
				bIsSub = this.isSubWithDeathLoopCheck(org, sub,orgIds);
				if(bIsSub){
					break;
				}
			}
		}
		return bIsSub;
	}
}
