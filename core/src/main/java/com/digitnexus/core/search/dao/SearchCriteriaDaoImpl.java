/**
 * 
 */
package com.digitnexus.core.search.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.search.SearchCriteria;

/**
 * @author adi
 *
 */
@Repository
public class SearchCriteriaDaoImpl extends BaseDaoImpl implements SearchCriteriaDao {

	@Override
	public SearchCriteria find(String entityName, String name) {
			return (SearchCriteria) getNamedQuery(SearchCriteria.FIND_BY_ENTITY_NAME_AND_NAME).setCacheable(true)
					.setString(0, entityName).setString(1, name).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SearchCriteria> findByEntityName(String entityName) {
		return getNamedQuery(SearchCriteria.FIND_BY_ENTITY_NAME).setCacheable(true).setString(0, entityName).list();
	}

}
