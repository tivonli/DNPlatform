/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.util.List;

import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * Adds some more method on top of the {@link ArticlePersister} which are specific to
 * UI operations
 * 
 * @author Santanu
 */
public interface UiOperationArticlePersister extends ArticlePersister {

	/**
	 * Finds a list of object based on the criteria passed
	 * 
	 * @param metaData the {@link ListViewMetaData} defined for the class to be queried
	 * @param criteria to filter the searched set
	 * @return list of objects matching the criteria
	 */
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria);
	
	/**
	 * Finds a list of objects for paginated view
	 * 
	 * @param metaData the {@link ListViewMetaData} defined for the class to be queried
	 * @param criteria to filter the searched set
	 * @param startIndex the start index for the search result
	 * @param maxResults maximum number of results per page
	 * @return list of objects matching the criteria
	 */
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria, int startIndex, int maxResults);
	
	/**
	 * Counts the number of records based on the {@link SearchCriteria} passed
	 * 
	 * @param metaData the {@link ListViewMetaData} defined for the class to be queried
	 * @param criteria
	 * @return the count of objects that matches the criteria
	 */
	public long count(ListViewMetaData metaData, SearchCriteria criteria);
	
	/**
	 * The objects identified by the id is loaded along with the relationships
	 * @param editMetaData
	 * @param id
	 * @return
	 */
	public <T> T loadEagerly(EditViewMetaData editMetaData, Serializable id);
}
