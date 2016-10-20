package com.digitnexus.core.search.dao;

import java.util.List;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.search.SearchCriteria;

public interface SearchCriteriaDao extends BaseDao {
	SearchCriteria find(String entityName,String name);
	
	List<SearchCriteria> findByEntityName(String entityName);

}
