/**
 * 
 */
package com.digitnexus.core.acl.service;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.domain.UserOperation;

/**
 * @author Santanu
 *
 */
public interface AclService {
	
	/**
	 * 
	 * @param uriInfo
	 * @return
	 */
	public String getAclListDataCount(@Context UriInfo uriInfo);
	
	/**
	 * 
	 * @param uriInfo
	 * @param pageIndex
	 * @param pageSize
	 * @return
	 */
	public String getAclListData(UriInfo uriInfo, Integer pageIndex, Integer pageSize);
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public String getAclEditData(String id);
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public String getAclAssignments(String id);
	
	/**
	 * Saves the AclExpression associations passed through the json string. 
	 * It creates a new association if none exists, otherwise ignores that.
	 * 
	 * @param id the id of the {@link AclExpression} to which the associations are related
	 * @param jsonString json string containing the data for the {@link AclExpressionAssociation} objects
	 */
	public void saveAclAssignments(String id, String jsonString);
	
	/**
	 * 
	 * @param secureResourceName
	 * @param primaryResourceName
	 * @param operation
	 * @param query
	 * @return
	 */
	public <T> T applyAclExpression(String secureResourceName, String primaryResourceName, UserOperation operation, T query);
}
