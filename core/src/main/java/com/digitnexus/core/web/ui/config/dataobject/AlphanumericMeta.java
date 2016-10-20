package com.digitnexus.core.web.ui.config.dataobject;

import com.digitnexus.core.web.ui.config.annotation.Compare;


/**
 * Represent values from {@link Compare} annotation
 * @author Xing
 *
 */
public class AlphanumericMeta{	

	private String name;	
	
	public AlphanumericMeta(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
}
