package com.digitnexus.core.search.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.dao.SearchCriteriaDao;

/**
 * 
 * @author adi
 *
 */
@Service
@Transactional(propagation=Propagation.REQUIRED)
public class SearchCriteriaService {
	@Autowired
	private SearchCriteriaDao searchDao;
	
	/**
	 * saves each configuration or merge  existing record with new record if a record is present with same unqiue values
	 * @param searchCriterias
	 */
	public void saveCriteriaConfig(List<SearchCriteria> searchCriterias){
		
		List<SearchCriteria> searchCriteriasCopy=new ArrayList<SearchCriteria>(searchCriterias);
				
		for(SearchCriteria searchCriteria:searchCriterias){
			if(searchCriteria.getId()<=0){
				SearchCriteria existingCriteria=searchDao.find(searchCriteria.getEntityName(), searchCriteria.getName());
				if(existingCriteria!=null){
					//Update existing criteria
					replaceValues(existingCriteria,searchCriteria);
					searchCriteriasCopy.remove(searchCriteria);
					searchCriteriasCopy.add(existingCriteria);
				}
			}
		}
				
		searchDao.saveOrUpdateAll(searchCriteriasCopy);
	
	}
	
	private void replaceValues(SearchCriteria existingCriteria, SearchCriteria searchCriteria) {
		existingCriteria.setDefaultCriteria(searchCriteria.isDefaultCriteria());
		existingCriteria.setDisplayKey(searchCriteria.getDisplayKey());
		existingCriteria.setVisible(searchCriteria.isVisible());
		
		existingCriteria.getFilterExpressions().clear();
		searchDao.flush();
		existingCriteria.getFilterExpressions().addAll(searchCriteria.getFilterExpressions());
		
		existingCriteria.getSortExpressions().clear();
		searchDao.flush();
		existingCriteria.getSortExpressions().addAll(searchCriteria.getSortExpressions());
	}

	public List<SearchCriteria> getByEntityName(String entityName){
		return searchDao.findByEntityName(entityName);
	}
	
	public SearchCriteria getSearchCriteria(String entityName,String name){
		return searchDao.find(entityName, name);
	}
	
	public SearchCriteria getSearchCriteria(long id){
		return searchDao.get(SearchCriteria.class, id);
	}


}
