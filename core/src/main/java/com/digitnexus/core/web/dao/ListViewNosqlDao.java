/**
 * 
 */
package com.digitnexus.core.web.dao;

import java.util.List;

import com.digitnexus.core.nosql.dao.BaseNosqlDao;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 *
 */
public interface ListViewNosqlDao extends BaseNosqlDao {
	
	/**
	 * 
	 * @param listMetaData
	 * @return
	 */
	public <T> List<T> getDataForListView(ListViewMetaData listMetaData);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @param startIndex
	 * @param maxResults
	 * @return
	 */
	public <T> List<T> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @return
	 */
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria);

}
