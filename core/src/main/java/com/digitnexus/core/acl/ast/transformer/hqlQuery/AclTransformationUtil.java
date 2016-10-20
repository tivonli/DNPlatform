/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.hqlQuery;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.dao.query.Condition;
import com.digitnexus.core.dao.query.HQLQuery;

/**
 * Just and utility to avoid code duplication is different classes
 * @author Santanu
 */
class AclTransformationUtil {
	
	/**
	 * Pass the call to the relevant transformer registered
	 * @param astNode
	 * @param formToAdaptIn
	 * @return
	 */
	static Condition transformAcl(ASTNode astNode, HQLQuery formToAdaptIn) {
		ASTNodeTransformer transformer = ASTNodeTransformers.getRegisteredTransformer(astNode);
		return transformer.transform(astNode, formToAdaptIn);
	}
}
