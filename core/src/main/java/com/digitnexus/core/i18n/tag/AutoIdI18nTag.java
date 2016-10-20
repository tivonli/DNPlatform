package com.digitnexus.core.i18n.tag;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;

import com.digitnexus.core.i18n.I18NUtil;

public class AutoIdI18nTag extends SimpleTagSupport {

	private String				key;

	public void doTag() throws JspException, IOException {
		getJspContext().getOut().write(I18NUtil.getMessage(getKey()));
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}