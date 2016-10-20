package com.digitnexus.core.web.service;

import com.digitnexus.core.i18n.I18NUtil;

class EditMetaNotFoundException extends Exception {
	
	private static final String ERROR_KEY="error.editMetaNotFound";

	private static final long	serialVersionUID	= 5256233853821955519L;

	private EditMetaNotFoundException(String message) {
		super(message);
	}
	
	public static EditMetaNotFoundException withArticleName(String articleName){
		return new EditMetaNotFoundException(I18NUtil.getMessage(ERROR_KEY, articleName));
	}
}
