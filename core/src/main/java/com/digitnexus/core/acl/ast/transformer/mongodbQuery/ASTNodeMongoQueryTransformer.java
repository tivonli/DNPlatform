/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.mongodbQuery;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.digitnexus.core.acl.ast.ASTNode;

/**
 * @author Santanu
 *
 */
public interface ASTNodeMongoQueryTransformer {
	
	/**
	 * 
	 * @param astNode
	 * @param formToAdaptIn
	 * @return
	 */
	public Criteria transform(ASTNode astNode, Query formToAdaptIn);
}
