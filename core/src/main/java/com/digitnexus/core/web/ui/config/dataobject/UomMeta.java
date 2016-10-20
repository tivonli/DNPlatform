package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.web.ui.config.annotation.Compare;


/**
 * Represent values from {@link Compare} annotation
 * @author Xing
 *
 */
public class UomMeta{	

	private String name;	
	
	public UomMeta(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
}
