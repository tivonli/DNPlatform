package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.web.ui.config.annotation.OrderBy;

/**
 * Represent values from {@link OrderBy} annotation
 * @author adi
 *
 */
public class OrderByMeta{
	
	private String name;
	private boolean ascending;
	
	public OrderByMeta(String name, boolean ascending) {
		this.name = name;
		this.ascending = ascending;
	}

	public String getName() {
		return name;
	}

	public boolean isAscending() {
		return ascending;
	}
	
}
