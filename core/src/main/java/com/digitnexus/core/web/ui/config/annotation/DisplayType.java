/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

/**
 * @author Santanu
 */
public enum DisplayType {
	//this is for string and numeric data
	TEXTFIELD,
	//this is for string and clob data
	TEXTAREA,
	//date data has its special calendar component 
	DATE,
	//for timestamp
	DATETIME,
	//for time hh:mm
	TIME,
	//drop down select options for single select
	//this can be used for boolean, static set of 
	//options or selecting other articles
	SELECT,
	//multi select - do not have a use case yet - 
	//may be associating with multiple article
	MULTI_SELECT,
	//this is a custom component to select an article 
	ARTICLE_SELECT,
	//this is a custom component to select an article 
	ARTICLE_DROPDOWN,
	//check box - for boolean maybe!
	CHECKBOX,
	//radio button for boolean or static set of options
	RADIO,
	//icon - for image data and other binary data
	ICON,
	//for edit view this should have an upload option associated
	ICON_UPLOAD,
	//instead of an icon show a relevant text with upload
	TEXT_UPLOAD,
	//this is just an upload option
	UPLOAD,
	//url - to refer to other object from a list
	//can be used for binary data as well
	URL,
	//image can support display image work together with the dataType REFERENCE//
	IMAGE,
	//to get a point from map
	POINT,
	//to get a polyline from map
	POLYLINE,
	//to get a polygone from map
	POLYGON,	
	COLOR,
	//as a default option for guessing based on data type
	UNDEFINED,
	//escapes a string for insertion into HTML
	HTML,
	//to refer to a dialog from a list
	POPUP,
	//for edit view 
	ARRAY
}
