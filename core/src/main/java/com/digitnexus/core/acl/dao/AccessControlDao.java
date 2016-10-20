package com.digitnexus.core.acl.dao;

import java.util.List;

import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;

/**
 * 
 * @author Santanu
 */
public interface AccessControlDao extends BaseDao {
	
	/**
	 * 
	 * @param expressionName
	 * @return
	 */
	public AclExpression findAclExpressionByName(String expressionName);
	
	/**
	 * 
	 * @param secureResourceName
	 * @param primaryResourceName
	 * @param operation
	 * @return
	 */
	public List<AclExpression> findAclExpressionsForCurrentUser(String secureResourceName, String primaryResourceName, UserOperation operation);
	
	/**
	 * Could have taken more granular parameters, but that might be a problem if {@link Organization}
	 * becomes a consideration at any point of time
	 * @param resource
	 * @param role
	 * @param permission
	 * @return
	 */
	public List<AclExpressionAssociation> findAclExpressionsForRoleAndPermission(String resource, Role role, Permission permission);
	
	/**
	 * Finds the expression associations for the {@link AclExpression}s identified by the id passed 
	 * @param aclExpressionId the id of the {@link AclExpression} for which the associations are to be find
	 * @return {@link List} containing {@link AclExpressionAssociation}s for the acl expression identified by the id
	 */
	public List<AclExpressionAssociation> findAclExpressionAssociations(long aclExpressionId);
}
