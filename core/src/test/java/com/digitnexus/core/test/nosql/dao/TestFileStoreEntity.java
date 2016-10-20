/**
 * 
 */
package com.digitnexus.core.test.nosql.dao;

import java.util.Date;

import com.digitnexus.core.nosql.domain.FileStoreArticle;

/**
 * @author Santanu
 *
 */
public class TestFileStoreEntity extends FileStoreArticle {
	private String stringProperty;
	private int integerProperty;
	private Date dateProperty;
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
	 * @return the integerProperty
	 */
	public int getIntegerProperty() {
		return integerProperty;
	}
	/**
	 * @param integerProperty the integerProperty to set
	 */
	public void setIntegerProperty(int integerProperty) {
		this.integerProperty = integerProperty;
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
