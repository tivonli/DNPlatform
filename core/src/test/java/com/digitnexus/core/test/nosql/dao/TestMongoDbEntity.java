/**
 * 
 */
package com.digitnexus.core.test.nosql.dao;

import java.util.Date;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author Santanu
 *
 */
@Document(collection="TestEntity") 
public class TestMongoDbEntity {
	@Id
	private String id;
	private String stringProperty;
	private Long longProperty;
	private Date dateProperty;
	private Double doubleProperty;
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
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof TestMongoDbEntity) {
			TestMongoDbEntity another = (TestMongoDbEntity)obj;
			EqualsBuilder equalsBuilder = new EqualsBuilder()
				.append(stringProperty, another.stringProperty)
				.append(dateProperty, another.dateProperty)
				.append(doubleProperty, another.doubleProperty)
				.append(longProperty, another.longProperty);
			return equalsBuilder.isEquals();
		}
		return false;
	}
}
