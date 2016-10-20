package com.digitnexus.core.web.service;

import com.digitnexus.core.i18n.I18NUtil;

public class StaleDataException extends RuntimeException {
	
	private static final long	serialVersionUID	= 1139859840568169611L;

	public StaleDataException(){
		super(I18NUtil.getMessage("error_stale_data"));
	}

}
