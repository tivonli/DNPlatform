/**
 * 
 */
package com.digitnexus.core.web.dao;

import java.io.Serializable;
import java.util.List;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 *
 */
public interface ListViewDao extends BaseDao {
	
	/**
	 * 
	 * @param listMetaData
	 * @return
	 */
	public List<Object> getDataForListView(ListViewMetaData listMetaData);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @param startIndex
	 * @param maxResults
	 * @return
	 */
	public List<Object> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @return
	 */
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria);
	
	/**
	 * Loads an object eagerly. The related objects get loaded. However the collections does not get loaded
	 * and they still remain lazy.
	 * 
	 * @param editMetaData
	 * @param id
	 * @return
	 */
	public Object getObjectEagerly(EditViewMetaData editMetaData, Serializable id);

	/**
	 * Verifies whether the object identified by the id passed is editable by the 
	 * current user
	 * 
	 * @param editMetaData edit view meta data for the object type for which the 
	 * 					   edit permission is to be checked
	 * @param id id of the object for which the edit permission to be checked
	 * @return true if the object is editable by the user, false otherwise
	 */
	public boolean isEditable(EditViewMetaData editMetaData, Serializable id);
	
	/**
	 * Verifies whether the object identified by the id passed can be deleted
	 * by the current user
	 * 
	 * @param listMetaData list view meta data for the object type for which the 
	 * 					   delete permission is to be checked
	 * @param id id of the object for which the edit permission to be checked
	 * @return true if the object can be deleted by the user, false otherwise
	 */
	public boolean isDeletable(ListViewMetaData listMetaData, Serializable id);
	
	/**
	 * Verifies whether the object identified by the id passed can be deleted
	 * by the current user
	 * 
	 * @param editMetaData edit view meta data for the object type for which the 
	 * 					   delete permission is to be checked
	 * @param id id of the object for which the edit permission to be checked
	 * @return true if the object can be deleted by the user, false otherwise
	 */
	public boolean isDeletable(EditViewMetaData editMetaData, Serializable id);
	
	/**
	 * 
	 * @param listMetaData
	 * @param sourceMetaData
	 * @param associationName
	 * @param idValue
	 * @param searchCriteria
	 * @param startIndex
	 * @param maxResults
	 * @return
	 */
	public List<Object> getAssociationDataForListView(ListViewMetaData listMetaData,ListViewMetaData sourceMetaData,String associationName,String idValue,SearchCriteria searchCriteria, int startIndex, int maxResults);

	/**
	 * 
	 * @param listMetaData
	 * @param sourceMetaData
	 * @param associationName
	 * @param idValue
	 * @param searchCriteria
	 * @return
	 */
	public long getCountForAssociationListView(ListViewMetaData listMetaData,ListViewMetaData sourceMetaData,String associationName,String idValue,SearchCriteria searchCriteria);


}
