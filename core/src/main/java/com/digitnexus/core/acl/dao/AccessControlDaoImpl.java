/**
 * 
 */
package com.digitnexus.core.acl.dao;

import java.util.Collections;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.security.util.SecurityUtil;

/**
 * @author Santanu
 */
@Repository
public class AccessControlDaoImpl extends BaseDaoImpl implements AccessControlDao {

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.dao.AccessControlDao#findAclExpressionsForCurrentUser(java.lang.String, java.lang.String, 
	 * 																					  com.digitnexus.core.domain.UserOperation)
	 */
	@Override
	public List<AclExpression> findAclExpressionsForCurrentUser(String secureResourceName, String primaryResourceName, UserOperation operation) {
		User user = SecurityUtil.getCurrentUser();
		if (user != null && CollectionUtils.isNotEmpty(user.getRoles())) {
			String query = "select expr.aclExpression from AclExpressionAssociation expr where expr.resource = :SECURE_RESOURCE and expr.role in (:ROLE_LIST) " +
					"and expr.permission.resource = :RESOURCE and expr.permission.userOperation = :OPERATION";
			return findByNamedParameters(query, new String[]{"SECURE_RESOURCE", "ROLE_LIST", "RESOURCE", "OPERATION"}, 
					new Object[]{secureResourceName, user.getRoles(), primaryResourceName, operation});
		}
		
		return Collections.emptyList();
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.dao.AccessControlDao#findAclExpressionByName(java.lang.String)
	 */
	@Override
	public AclExpression findAclExpressionByName(String expressionName) {
		String query = "from AclExpression expr where expr.name = ?";
		return findUnique(query, expressionName);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.dao.AccessControlDao#findAclExpressionsForRoleAndPermission(com.digitnexus.core.domain.Role, com.digitnexus.core.domain.Permission)
	 */
	@Override
	public List<AclExpressionAssociation> findAclExpressionsForRoleAndPermission(String resource, Role role, Permission permission) {
		String query = "from AclExpressionAssociation expr where expr.resource = ? and expr.role = ? and expr.permission = ?";
		return find(query, resource, role, permission);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.dao.AccessControlDao#findAclExpressionAssociations(long)
	 */
	@Override
	public List<AclExpressionAssociation> findAclExpressionAssociations(long aclExpressionId) {
		String query = "from AclExpressionAssociation expr where expr.aclExpression.id = ?";
		return find(query, aclExpressionId);
	}
}
