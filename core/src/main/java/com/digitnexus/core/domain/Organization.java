package com.digitnexus.core.domain;

import java.util.LinkedHashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.stereotype.Component;

import com.digitnexus.core.web.ui.config.annotation.Alphanumeric;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

@Entity
@Table(name = "organizations")
@View
@XmlRootElement(name = "org")
//@XmlType(propOrder = { "id","name", "code", "points" })
@Component
public class Organization  extends DataObject{

	private static final long serialVersionUID = -5318370349582342588L;
	private String id;
	private String name;
	private String code;
	
	private String points;
	
	//fields to support organisation hierarchy
	private Set<Organization> subOrganizations = new LinkedHashSet<Organization>();
	private Organization parentOrganization;
	
	@Id 
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name="id")
	@EditViewField(order=1)
	@ListViewColumn(order=1,widthPercentage=15)
	@NotEmpty
	public String getId() {
		return id;
	}
	
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false)
	@ListViewColumn(order = 2, widthPercentage = 15,associationListProperty=true)
	@EditViewField(order = 2)
	@SearchColumn(order = 2, basic = true)
	@Length(max=64)
	@NotEmpty
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "code", nullable = false,unique=true)
	@ListViewColumn(order = 3, widthPercentage = 15,associationListProperty=true)
	@EditViewField(order = 3)
	@SearchColumn(order = 3, basic = true)
	@NotEmpty
	@Alphanumeric(name="alphanumeric")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
    
	@Column(name = "points")
	@EditViewField(order=10, displayType=DisplayType.POINT,imageMap={"default:skins/common/images/map/add_point1.png"})
	@ListViewColumn(order=10,widthPercentage=15,display=DisplayType.POINT)
	@SearchColumn(order=10, basic = true, displayType=DisplayType.POINT)
	public String getPoints() {
		return points;
	}

	public void setPoints(String points) {
		this.points = points;
	}

	/**
	 * @return the subOrganizations
	 */
	@OneToMany(fetch=FetchType.EAGER, cascade=CascadeType.ALL)
	@Fetch(FetchMode.JOIN)
	@JoinColumn(name="parent_id")
	public Set<Organization> getSubOrganizations() {
		if (subOrganizations == null) {
			subOrganizations = new LinkedHashSet<Organization>();
		}
		return subOrganizations;
	}

	/**
	 * @param subOrganizations the subOrganizations to set
	 */
	public void setSubOrganizations(Set<Organization> subOrganizations) {
		this.subOrganizations = subOrganizations;
	}

	/**
	 * @return the parentOrganization
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="parent_id")
	@EditViewField(order=2,displayType=DisplayType.ARTICLE_DROPDOWN)
	@SearchColumn(order = 3)
	public Organization getParentOrganization() {
		return parentOrganization;
	}

	/**
	 * @param parentOrganization the parentOrganization to set
	 */
	public void setParentOrganization(Organization parentOrganization) {
		this.parentOrganization = parentOrganization;
	}
	
	/**
	 * Establish a parent-child relationship between the passed organization
	 * and this organization
	 * 
	 * @param subOrganization
	 */
	public void addSubOrganization(Organization subOrganization) {
		getSubOrganizations().add(subOrganization);
		subOrganization.setParentOrganization(this);
	}
}
