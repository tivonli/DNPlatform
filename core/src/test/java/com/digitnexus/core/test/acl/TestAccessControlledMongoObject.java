/**
 * 
 */
package com.digitnexus.core.test.acl;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import com.digitnexus.core.domain.DataObject;

/**
 * @author Santanu
 *
 */
@Document
public class TestAccessControlledMongoObject extends DataObject {

	private static final long serialVersionUID = -3924640751072872011L;
	
	private String id;
	private String stringProperty;
	private Long longProperty;
	private Double doubleProperty;
	private Date dateProperty;
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the stringProperty
	 */
	public String getStringProperty() {
		return stringProperty;
	}
	/**
	 * @param stringProperty the stringProperty to set
	 */
	public void setStringProperty(String stringProperty) {
		this.stringProperty = stringProperty;
	}
	/**
	 * @return the longProperty
	 */
	public Long getLongProperty() {
		return longProperty;
	}
	/**
	 * @param longProperty the longProperty to set
	 */
	public void setLongProperty(Long longProperty) {
		this.longProperty = longProperty;
	}
	/**
	 * @return the doubleProperty
	 */
	public Double getDoubleProperty() {
		return doubleProperty;
	}
	/**
	 * @param doubleProperty the doubleProperty to set
	 */
	public void setDoubleProperty(Double doubleProperty) {
		this.doubleProperty = doubleProperty;
	}
	/**
	 * @return the dateProperty
	 */
	public Date getDateProperty() {
		return dateProperty;
	}
	/**
	 * @param dateProperty the dateProperty to set
	 */
	public void setDateProperty(Date dateProperty) {
		this.dateProperty = dateProperty;
	}
}
