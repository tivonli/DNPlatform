package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.search.SearchCriteria;

public class SearchCriteriaMeta {
	private long	id;
	private String	displayName;
	private boolean defaultCriteria;
	private boolean visible;
	
	
	public SearchCriteriaMeta(){
		
	}
	
    public SearchCriteriaMeta(SearchCriteria searchCriteria){
    	this.id=searchCriteria.getId();
    	this.displayName=searchCriteria.getDisplayName();
    	this.defaultCriteria=searchCriteria.isDefaultCriteria();
    	this.visible=searchCriteria.isVisible();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public boolean isDefaultCriteria() {
		return defaultCriteria;
	}

	public void setDefaultCriteria(boolean defaultCriteria) {
		this.defaultCriteria = defaultCriteria;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}


}
