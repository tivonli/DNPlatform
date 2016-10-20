/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer;

import com.digitnexus.core.acl.ast.ASTNode;

/**
 * @author Santanu
 *
 */
public interface AclExpressionTransformer<T> {
	
	/**
	 * 
	 * @param astNode
	 * @param parameter
	 */
	public T transform(ASTNode astNode, T parameter);
}
