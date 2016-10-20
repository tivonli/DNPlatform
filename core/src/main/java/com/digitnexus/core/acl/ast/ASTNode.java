/**
 * 
 */
package com.digitnexus.core.acl.ast;

import com.digitnexus.core.acl.grammar.AclDslToken;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.util.SecurityUtil;

/**
 * @author Santanu
 */
public class ASTNode {
    private String data;
    private ASTNode left;
    private ASTNode right;
    private ASTNode parent;
    /**
     * @param data
     * @return
     */
    public static ASTNode create(String data) {
    	ASTNode node = new ASTNode();
    	node.data(data);
    	return node;
    }
	/**
	 * @return the data
	 */
	public String getData() {
		if (AclDslToken.PARSED_CURRENT_USER_ID_TOKEN.equals(data)) {
			//this means the data is actually the current user name 
			User currentUser = SecurityUtil.getCurrentUser();
			if (currentUser != null) {
				return currentUser.getUsername();
			}
		}
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public ASTNode data(String data) {
		this.data = data;
		return this;
	}
	/**
	 * @return the left
	 */
	public ASTNode getLeft() {
		return left;
	}
	/**
	 * @param left the left to set
	 */
	public ASTNode left(ASTNode left) {
		this.left = left;
		if (left != null)
			left.parent = this;

		return this;
	}
	/**
	 * @param left the left to set
	 */
	public ASTNode left(String data) {
		this.left = ASTNode.create(data);
		if (left != null)
			left.parent = this;

		return this;
	}
	/**
	 * @return the right
	 */
	public ASTNode getRight() {
		return right;
	}
	/**
	 * @param right the right to set
	 */
	public ASTNode right(ASTNode right) {
		this.right = right;
		if (right != null)
			right.parent = this;
		
		return this;
	}
	/**
	 * @param right the right to set
	 */
	public ASTNode right(String data) {
		this.right = ASTNode.create(data);
		if (right != null)
			right.parent = this;
		
		return this;
	}
	/**
	 * @return the parent
	 */
	public ASTNode getParent() {
		return parent;
	}
	
	public void addChild(ASTNode child) {
	   	if (getLeft() == null) {
    		left(child);
    	} else {
    		right(child);
    	}
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		String str = "";
		if (data != null) {
			str = data;
		}
		if (left != null) {
			str += " [Left: " + left.toString() + "]";
		}
		if (right != null) {
			str += " [Right: " + right.toString() + "]";
		}
		return str;
	}
	
	protected boolean isLeft() {
		if (parent != null) {
			return parent.getLeft() == this;
		}
		return false; 
	}
}
