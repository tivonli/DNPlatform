package com.digitnexus.core.domain;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.persistence.Cacheable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.NotEmpty;

import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

@Entity
@Table(name = "roles", uniqueConstraints = { @UniqueConstraint(columnNames = { "name" }) })
@SequenceGenerator(name = "ROLE_SEQ", sequenceName = "ROLE_SEQ_DB")
@NamedQueries(value = { @NamedQuery(name = Role.FIND_BY_NAME, query = "from Role where name=?")})
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@View
public class Role extends DataObject {
	private static final long serialVersionUID = 1L;
	public static final String FIND_BY_NAME = "Role.roleByName";
	private long id;
	private String name;
	private Set<Permission> permissions = new HashSet<Permission>();
	private Set<User> users = new HashSet<User>();
	private Set<Menu> menus = new HashSet<Menu>();
	private Set<RolePermissionAssociationDetail> permissionAssociationDetails = new HashSet<RolePermissionAssociationDetail>();
	private Set<RoleMenuAssociationDetail> menuAssociationDetails = new HashSet<RoleMenuAssociationDetail>();

	//fields to support role hierarchy
	private Set<Role> subRoles = new LinkedHashSet<Role>();
	private Role parentRole;
	private Organization organization;
	
	public Role() {
	}

	public Role(String name) {
		this.name = name;
	}

	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name = "id")
	@ListViewColumn(order = 0, widthPercentage = 25)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false)
	@ListViewColumn(order = 1, widthPercentage = 75, associationListProperty = true)
	@EditViewField(order = 1)
	@SearchColumn(order = 1, basic = true)
	@NotEmpty
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToMany(fetch = FetchType.EAGER)
	@Fetch(FetchMode.JOIN)
	@JoinTable(name = "roles_permissions")
	@EditViewField(order = 1, dataType = DataType.COLLECTION, referenceProperty = "displayName", displayType = DisplayType.MULTI_SELECT)
	public Set<Permission> getPermissions() {
		return permissions;
	}

	public void setPermissions(Set<Permission> permissions) {
		this.permissions = permissions;
	}

	public void addPermission(Permission permission) {
		permissions.add(permission);
	}
	
	@ManyToMany(fetch = FetchType.EAGER)
	@Fetch(FetchMode.JOIN)
	@JoinTable(name = "comm_roles_menus")
//	@EditViewField(order = 1, dataType = DataType.COLLECTION, referenceProperty = "name", displayType = DisplayType.MULTI_SELECT)
	public Set<Menu> getMenus() {
		return menus;
	}

	public void setMenus(Set<Menu> menus) {
		this.menus = menus;
	}
	
	public void addMenus(Menu menu) {
		menus.add(menu);
	}
	
	/**
	 * @return the permissionAssociationDetails
	 */
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="role_id")
	public Set<RolePermissionAssociationDetail> getPermissionAssociationDetails() {
		return permissionAssociationDetails;
	}

	/**
	 * @param permissionAssociationDetails the permissionAssociationDetails to set
	 */
	public void setPermissionAssociationDetails(
			Set<RolePermissionAssociationDetail> permissionAssociationDetails) {
		this.permissionAssociationDetails = permissionAssociationDetails;
	}
	
	/**
	 * @param permissionAssociationDetail
	 */
	public void addPermissionAssociationDetail(RolePermissionAssociationDetail permissionAssociationDetail) {
		this.permissionAssociationDetails.add(permissionAssociationDetail);
	}
	
	/**
	 * @return the menuAssociationDetails
	 */
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="role_id")
	public Set<RoleMenuAssociationDetail> getMenuAssociationDetails() {
		return menuAssociationDetails;
	}

	/**
	 * @param menuAssociationDetails the menuAssociationDetails to set
	 */
	public void setMenuAssociationDetails(
			Set<RoleMenuAssociationDetail> menuAssociationDetails) {
		this.menuAssociationDetails = menuAssociationDetails;
	}
	
	/**
	 * @param menuAssociationDetail
	 */
	public void addMenuAssociationDetail(RoleMenuAssociationDetail menuAssociationDetail) {
		this.menuAssociationDetails.add(menuAssociationDetail);
	}

	@ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
	@Fetch(FetchMode.JOIN)
//	@EditViewField(order = 2, dataType = DataType.COLLECTION, referenceProperty = "username", displayType = DisplayType.MULTI_SELECT)
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	/**
	 * @return the subRoles
	 */
	@OneToMany(fetch=FetchType.EAGER, cascade=CascadeType.ALL)
	@Fetch(FetchMode.JOIN)
	@JoinColumn(name="parent_id")	
	@EditViewField(order = 4,readOnly=true,displayType=DisplayType.ARRAY, referenceProperty = "name")
	public Set<Role> getSubRoles() {
		if (subRoles == null) {
			subRoles = new LinkedHashSet<Role>();
		}
		return subRoles;
	}

	/**
	 * @param subRoles the subRoles to set
	 */
	public void setSubRoles(Set<Role> subRoles) {
		this.subRoles = subRoles;
	}

	/**
	 * @return the parentRole
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@Fetch(FetchMode.JOIN)
	@JoinColumn(name="parent_id")
	@EditViewField(order = 3,displayType=DisplayType.ARTICLE_DROPDOWN,referenceProperty="name")
	public Role getParentRole() {
		return parentRole;
	}

	/**
	 * @param parentRole the parentRole to set
	 */
	public void setParentRole(Role parentRole) {
		this.parentRole = parentRole;
	}
	
	/**
	 * 
	 * @param role
	 */
	public void addSubRole(Role role) {
		getSubRoles().add(role);
		role.setParentRole(this);
	}

	/**
	 * @return the organization
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="org_id")
	public Organization getOrganization() {
		return organization;
	}

	/**
	 * @param organization the organization to set
	 */
	public void setOrganization(Organization organization) {
		this.organization = organization;
	}
	
	@Override
	public boolean equals(Object obj) {
		// name is unique

		if (obj instanceof Role) {
			Role other = (Role) obj;
			// This null check can fail only when object is partial,
			// usually when data is json from web client
			if ((this.getName() != null) && (other.getName() != null)) {
				return this.getName().equals(other.getName()) && this.getId() == other.getId();
			}

			return this.getId() == other.getId();
		}
		return false;
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).append(this.getName()).hashCode();
	}

}
