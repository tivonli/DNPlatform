/**
 * 
 */
package com.digitnexus.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * @author Adi
 * Represents permission object
 */
@Entity
@Table(name = "permissions", uniqueConstraints = { @UniqueConstraint(columnNames = { "user_operation", "protected_resource" }) })
@NamedQueries(value = {
		@NamedQuery(name = Permission.FIND_SECURED_RESOURCE,
				query = "select distinct resource from Permission"),
		@NamedQuery(name = Permission.FIND_BY_RESOURCE_OPERATION,
				query = "from Permission where resource = ? and userOperation = ?"),
		@NamedQuery(name = Permission.FIND_BY_NAME,
				query = "from Permission where name = ?")

})
@View(createFromParent=false,readOnly=true)
public class Permission extends DataObject {
	private static final long	serialVersionUID			= 1L;
	public static final String	FIND_SECURED_RESOURCE		= "permission.findSecuredResource";
	public static final String	FIND_BY_RESOURCE_OPERATION	= "permission.findByResourceAndOperation";
	public static final String	FIND_BY_NAME				= "permission.findByName";
	private String				name;
	private String				displayName;
	private String				description;
	private UserOperation		userOperation;
	private String				resource;
	private ResourceType		resourceType				= ResourceType.ENTITY;

	public Permission() {

	}

	@Id
	@Column(name = "name")
	@ListViewColumn(order=0,associationListProperty=true)
	@EditViewField(order=0)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "description")
	@ListViewColumn(order=1,associationListProperty=true)
	@EditViewField(order=1)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;

	}

	@Column(name = "user_operation", nullable = false)
	@Enumerated(EnumType.ORDINAL)
	@ListViewColumn(order=2,associationListProperty=true)
	@EditViewField(order=2)
	public UserOperation getUserOperation() {
		return userOperation;
	}

	public void setUserOperation(UserOperation userOperation) {
		this.userOperation = userOperation;
	}

	//'resource' is reserved or key word in oracle
	@Column(name = "protected_resource", nullable = false)
	@ListViewColumn(order=3,associationListProperty=true)
	@EditViewField(order=3)
	public String getResource() {
		return resource;
	}

	public void setResource(String resource) {
		this.resource = resource;
	}

	@Column(name = "resource_type", nullable = false)
	@Enumerated(EnumType.STRING)
	@ListViewColumn(order=4,associationListProperty=true)
	@EditViewField(order=4)
	public ResourceType getResourceType() {
		return resourceType;
	}

	public void setResourceType(ResourceType resourceType) {
		this.resourceType = resourceType;
	}

	@Column(name = "display_name")
	@ListViewColumn(order=5,associationListProperty=true)
	@EditViewField(order=5)
	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	@Override
	public String toString() {
		return getUserOperation().toString() + ":" + getResource();
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof Permission)) {
			return false;
		}

		return name.equals(((Permission) obj).name);
	}

	@Override
	public int hashCode() {
		return name.hashCode();
	}

}
