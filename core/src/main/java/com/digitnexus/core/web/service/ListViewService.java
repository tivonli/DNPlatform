/**
 * 
 */
package com.digitnexus.core.web.service;

import javax.ws.rs.core.UriInfo;


/**
 * @author Santanu
 */
public interface ListViewService {
	
	/**
	 * 
	 * @param groupName
	 * @return
	 */
	public String getListMetaSummaryResponse(String groupName);
		
	/**
	 * 
	 * @param articleName
	 * @param parentArticleName
	 * @return
	 */
	public String getListMetaDataResponse(String articleName,String parentArticleName);
	
	/**
	 * 
	 * @param articleName
	 * @param pageIndex
	 * @return
	 */
	public String getListDataResponse(String articleName, int pageIndex);
	
	/**
	 * 
	 * @param articleName
	 * @param jsonData
	 * @return
	 */
	public String getListDataCount(String articleName, UriInfo ui);
	
	/**
	 * 
	 * @param articleName
	 * @param ui
	 * @return
	 */
	public String getListDataResponse(String articleName, UriInfo uriInfo, Integer pageIndex, Integer pageSize);
	
	/**
	 * 
	 * @param articleName
	 * @param associationPropertyName
	 * @return
	 */
	public String getEditViewAssociationListDataCount(String articleName, String associationPropertyName,UriInfo uriInfo);
	
    /**
     * 
     * @param articleName
     * @param associationPropertyName
     * @param pageIndex
     * @param pageSize
     * @return
     */
	public String getEditViewAssociationListDataResponse(String articleName, String associationPropertyName, UriInfo uriInfo, Integer pageIndex, Integer pageSize);
	
	/**
	 * 
	 * @param articleName
	 * @param associationPropertyName
	 * @return
	 */
	public String getSearchViewAssociationListDataCount(String articleName, String associationPropertyName);
	
    /**
     * 
     * @param articleName
     * @param associationPropertyName
     * @param pageIndex
     * @param pageSize
     * @return
     */
	public String getSearchViewAssociationListDataResponse(String articleName, String associationPropertyName, UriInfo uriInfo, Integer pageIndex, Integer pageSize);
	
	/**
	 * 
	 * @param articleName
	 * @param uriInfo
	 * @return
	 */
	public String getListViewAssociationListDataCount(String articleName, UriInfo uriInfo);
	
	/**
	 * 
	 * @param articleName
	 * @param uriInfo
	 * @param pageIndex
	 * @param pageSize
	 * @return
	 */
	public String getListViewAssociationListDataResponse(String articleName, UriInfo uriInfo, Integer pageIndex, Integer pageSize);
 
}
