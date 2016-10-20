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
 * This object captures the child role for which a menu has
 * been assigned to a role
 * 
 * @author Santanu
 */
@Entity
@Table(name="comm_role_menu_associations")
public class RoleMenuAssociationDetail extends DataObject {
	private static final long serialVersionUID = 4762952979110802165L;
	private long id;
	//the role for which a menu is assigned
	private Role role;
	//the "transitive" menu which is assigned
	private Menu menu;
	//the child role because of which this menu is assigned
	private Role childRole;
	
	/**
	 * 
	 */
	public RoleMenuAssociationDetail() {
	}
	/**
	 * @param role
	 * @param childRole
	 * @param permission
	 */
	public RoleMenuAssociationDetail(Role role, Role childRole, Menu menu) {
		this.role = role;
		this.childRole = childRole;
		this.menu = menu;
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
	@JoinColumn(name="menu_id")
	public Menu getMenu() {
		return menu;
	}
	/**
	 * @param permission the permission to set
	 */
	public void setMenu(Menu menu) {
		this.menu = menu;
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
