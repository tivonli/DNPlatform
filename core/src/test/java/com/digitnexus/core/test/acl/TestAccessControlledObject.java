/**
 * 
 */
package com.digitnexus.core.test.acl;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.digitnexus.core.domain.DataObject;

/**
 * @author Santanu
 *
 */
@Entity
@Table(name="UNITTEST_ACL_ENTITY")
public class TestAccessControlledObject extends DataObject {

	private static final long serialVersionUID = -3924640751072872011L;
	
	private String id;
	private String stringProperty;
	private Long longProperty;
	private Double doubleProperty;
	private Date dateProperty;
	private Set<TestAccessControlledChildObject> children = new HashSet<TestAccessControlledChildObject>();
	
	/**
	 * @return the id
	 */
	@Id
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
	@Column(name="str_property")
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
	@Column(name="long_property")
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
	@Column(name="dbl_property")
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
	@Column(name="date_property")
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
	 * @return the children
	 */
	@OneToMany
	@JoinColumn(name="parent_id")
	public Set<TestAccessControlledChildObject> getChildren() {
		return children;
	}
	/**
	 * @param children the children to set
	 */
	public void setChildren(Set<TestAccessControlledChildObject> children) {
		this.children = children;
	}
}
