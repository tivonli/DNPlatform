/**
 * 
 */
package com.digitnexus.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * This object captures the child role for which a permission has
 * been assigned to a role
 * 
 * @author Santanu
 */
@Entity
@Table(name="role_permission_associations")
public class RolePermissionAssociationDetail extends DataObject {
	private static final long serialVersionUID = 4762952979110802165L;
	private long id;
	//the role for which a permission is assigned
	private Role role;
	//the "transitive" permission which is assigned
	private Permission permission;
	//the child role because of which this permission is assigned
	private Role childRole;
	
	/**
	 * 
	 */
	public RolePermissionAssociationDetail() {
	}
	/**
	 * @param role
	 * @param childRole
	 * @param permission
	 */
	public RolePermissionAssociationDetail(Role role, Role childRole, Permission permission) {
		this.role = role;
		this.childRole = childRole;
		this.permission = permission;
	}
	/**
	 * @return the id
	 */
	@Id 
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name = "id")
	public long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(long id) {
		this.id = id;
	}
	/**
	 * @return the role
	 */
	@ManyToOne
	@JoinColumn(name="role_id")
	public Role getRole() {
		return role;
	}
	/**
	 * @param role the role to set
	 */
	public void setRole(Role role) {
		this.role = role;
	}
	/**
	 * @return the permission
	 */
	@ManyToOne
	@JoinColumn(name="permission_id")
	public Permission getPermission() {
		return permission;
	}
	/**
	 * @param permission the permission to set
	 */
	public void setPermission(Permission permission) {
		this.permission = permission;
	}
	/**
	 * @return the childRole
	 */
	@ManyToOne
	@JoinColumn(name="child_role_id")
	public Role getChildRole() {
		return childRole;
	}
	/**
	 * @param childRole the childRole to set
	 */
	public void setChildRole(Role childRole) {
		this.childRole = childRole;
	}
}
