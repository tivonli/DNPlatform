/**
 * 
 */
package com.digitnexus.core.acl.grammar;

import com.digitnexus.core.domain.User;

/**
 * Few constants which are either used in the ACL DSL or used for
 * parsing ACL DSL
 * @author Santanu
 */
public interface AclDslToken {
	//The ones those start with DSL_ are tokens supported in DSL
	//The ones those start with PARSED_ are tokens used while parsing/processing
	String DSL_CURRENT_USER = "this_user";
	String DSL_CURRENT_USER_NAME = "this_user.username";
	
	String PARSED_CURRENT_USER = User.class.getSimpleName();
	String PARSED_CURRENT_USER_ID_PROPERTY = "username";
	String PARSED_CURRENT_USER_ID_TOKEN = "_user.id_";
}
