/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.hqlQuery;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer;
import com.digitnexus.core.dao.query.HQLQuery;

/**
 * @author Santanu
 *
 */
public class HQLQueryAclTransformer implements AclExpressionTransformer<HQLQuery> {

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer#transform(com.digitnexus.core.acl.ast.ASTNode, java.lang.Object)
	 */
	@Override
	public HQLQuery transform(ASTNode astNode, HQLQuery parameter) {
		HQLQuery query = parameter;
		//typically the passed parameter is a HQLQuery object to which we 
		//need to add a criteria, else we fail
		if (query == null) {
			throw new NullPointerException("HQLQuery object needs to be instantiated to transform ASTNode");
		}
		
		AclTransformationUtil.transformAcl(astNode, query);
		
		return query;
	}

}
