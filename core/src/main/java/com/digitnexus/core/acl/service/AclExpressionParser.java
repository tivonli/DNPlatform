/**
 * 
 */
package com.digitnexus.core.acl.service;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.dataobject.AclExpression;

/**
 * @author Santanu
 *
 */
public interface AclExpressionParser {
	
	/**
	 * 
	 * @param expression
	 * @return
	 */
	public ASTNode parseAclExpression(AclExpression expression); 
}
