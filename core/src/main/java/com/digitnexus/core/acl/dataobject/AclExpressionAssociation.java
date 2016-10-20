/**
 * 
 */
package com.digitnexus.core.acl.dataobject;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;

import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

import javax.validation.constraints.NotNull;
/**
 * @author Santanu
 *
 */
@Entity
@Table(name="acl_expr_association")
@View
public class AclExpressionAssociation extends DataObject {

	private static final long serialVersionUID = 7633062903223551473L;
	
	private long id;
	private String resource;
	private AclExpression aclExpression;
	private Role role;
	private Permission permission;
	/**
	 * @return the id
	 */
	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name="id")
	@ListViewColumn(order=1,widthPercentage=15)
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
	 * @return the resource
	 */
	@Column(name="resource_name", nullable=false)
	public String getResource() {
		return resource;
	}
	/**
	 * @param resource the resource to set
	 */
	public void setResource(String resource) {
		this.resource = resource;
	}
	/**
	 * @return the aclExpression
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="expression_id", nullable=false)
	public AclExpression getAclExpression() {
		return aclExpression;
	}
	/**
	 * @param aclExpression the aclExpression to set
	 */
	public void setAclExpression(AclExpression aclExpression) {
		this.aclExpression = aclExpression;
	}
	/**
	 * @return the role
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="role_id")
	@ListViewColumn(order=2,widthPercentage=15,referenceProperty="name",associationListProperty=true)
	@EditViewField(order=1, referenceProperty="name")
	@NotNull
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
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="permission_id")
	@ListViewColumn(order=3,widthPercentage=15,referenceProperty="name",associationListProperty=true)
	@EditViewField(order=2,referenceProperty="name")
	@NotNull
	public Permission getPermission() {
		return permission;
	}
	/**
	 * @param permission the permission to set
	 */
	public void setPermission(Permission permission) {
		this.permission = permission;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof AclExpressionAssociation) {
			AclExpressionAssociation other = (AclExpressionAssociation)obj;
			EqualsBuilder equals = new EqualsBuilder()
										.append(role, other.role)
										.append(permission, other.permission)
										.append(aclExpression, other.aclExpression);
			return equals.isEquals();
		}
		
		return false;
	}
}
