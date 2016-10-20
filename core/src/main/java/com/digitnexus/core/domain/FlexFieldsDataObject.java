package com.digitnexus.core.domain;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;

import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldDescriminator;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;

public class FlexFieldsDataObject extends DataObject {
	public static final String	DESCRIMINATOR_PROPERTY_NAME	= "flexConfigDescriminator";
	public static final String	FLEXFIELDS_PROPERTY_NAME	= "flexFields";

	private static final long	serialVersionUID			= -6540269418314081202L;

	private String				flexConfigDescriminator;
	private Map<String, String>	flexFields;

	@Column(name = "config_descriminator")
	@ElementCollection(fetch = FetchType.EAGER)
	@EditViewField(order=100,hidden=true)
	public Map<String, String> getFlexFields() {
		return flexFields;
	}

	public void setFlexFields(Map<String, String> flexFields) {
		this.flexFields = flexFields;
	}

	@FlexFieldDescriminator
	@ListViewColumn(order = 100, widthPercentage = 20, hidden=true)
	@EditViewField(order = 101,hidden=true)
	public String getFlexConfigDescriminator() {
		return flexConfigDescriminator;
	}

	public void setFlexConfigDescriminator(String flexConfigDescriminator) {
		this.flexConfigDescriminator = flexConfigDescriminator;
	}

}
