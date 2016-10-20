/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.mongodbQuery;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.digitnexus.core.acl.ast.ASTNode;

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
	static Criteria transformAcl(ASTNode astNode, Query formToAdaptIn) {
		ASTNodeMongoQueryTransformer transformer = ASTNodeMongoQueryTransformers.getRegisteredTransformer(astNode);
		return transformer.transform(astNode, formToAdaptIn);
	}
}
