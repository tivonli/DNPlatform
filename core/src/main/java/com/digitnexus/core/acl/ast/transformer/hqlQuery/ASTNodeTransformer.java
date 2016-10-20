/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.hqlQuery;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.dao.query.Condition;
import com.digitnexus.core.dao.query.HQLQuery;

/**
 * @author Santanu
 *
 */
public interface ASTNodeTransformer {
	
	/**
	 * 
	 * @param astNode
	 * @param formToAdaptIn
	 * @return
	 */
	public Condition transform(ASTNode astNode, HQLQuery formToAdaptIn);
}
