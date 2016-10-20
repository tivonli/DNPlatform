package com.digitnexus.core.web.ui.config.dataobject;

/**
 * Meta information related to flex field configurations
 * 
 * @author adi
 * 
 */
public class FlexFieldConfigMeta implements Comparable<FlexFieldConfigMeta>{
	//Key from editView meta cache
	public String	name;
	public String	displayName;
	//name from FlexFieldConfig annotation
	public String   configDescriminator;

	public FlexFieldConfigMeta(String name, String displayName,String   configDescriminator) {
		this.name = name;
		this.displayName = displayName;
		this.configDescriminator=configDescriminator;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getConfigDescriminator() {
		return configDescriminator;
	}

	public void setConfigDescriminator(String configDescriminator) {
		this.configDescriminator = configDescriminator;
	}

	@Override
	public int compareTo(FlexFieldConfigMeta other) {
		return this.displayName.compareTo(other.displayName);
	}

}
