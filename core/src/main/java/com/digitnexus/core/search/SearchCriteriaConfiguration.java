package com.digitnexus.core.search;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Used only for mapping to root of search criteria configuration
 * @author adi
 *
 */
public class SearchCriteriaConfiguration {
	private List<SearchCriteria> searchCriteria=new ArrayList<SearchCriteria>();

	public List<SearchCriteria> getSearchCriteria() {
		return searchCriteria;
	}

	public void setSearchCriteria(List<SearchCriteria> searchCriteria) {
		this.searchCriteria = searchCriteria;
	}
	
	public void addSearchCriteria(SearchCriteria searchCriteria){
		this.searchCriteria.add(searchCriteria);
	}
	
	public Iterator<SearchCriteria> getSearchCriteriaIterator(){
		return searchCriteria.iterator();
	}

}
