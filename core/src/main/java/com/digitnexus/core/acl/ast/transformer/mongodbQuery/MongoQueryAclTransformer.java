/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.mongodbQuery;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer;

/**
 * @author Santanu
 *
 */
public class MongoQueryAclTransformer implements AclExpressionTransformer<Query> {

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer#transform(com.digitnexus.core.acl.ast.ASTNode, java.lang.Object)
	 */
	@Override
	public Query transform(ASTNode astNode, Query parameter) {
		Query query = parameter;
		//typically the passed parameter is a HQLQuery object to which we 
		//need to add a criteria, else we fail
		if (query == null) {
			throw new NullPointerException("HQLQuery object needs to be instantiated to transform ASTNode");
		}
		
		Criteria criteria = AclTransformationUtil.transformAcl(astNode, query);
		query.addCriteria(criteria);
		
		return query;
	}

}
