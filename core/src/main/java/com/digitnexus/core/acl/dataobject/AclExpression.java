/**
 * 
 */
package com.digitnexus.core.acl.dataobject;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.View;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;

/**
 * @author Santanu
 *
 */
@Entity
@Table(name="acl_expression", uniqueConstraints={@UniqueConstraint(columnNames={"expression_name"})})
@View(layoutColumns=1)
public class AclExpression extends DataObject {

	private static final long serialVersionUID = -8470376957530851358L;

	private long id;
	private String name;
	private String expression;
	private String description;
	/**
	 * @return the id
	 */
	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name="id")
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
	 * @return the name
	 */
	@NotNull
	@Column(name="expression_name")
	@ListViewColumn(order=0)
	@EditViewField(order = 0)
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the expression
	 */
	@NotNull
	@Column(name="expression", length=2048)
	@ListViewColumn(order=2)
	@EditViewField(order = 2)
	public String getExpression() {
		return expression;
	}
	/**
	 * @param expression the expression to set
	 */
	public void setExpression(String expression) {
		this.expression = expression;
	}
	/**
	 * @return the description
	 */
	@Column(name="description", length=1024)
	@ListViewColumn(order=1)
	@EditViewField(order = 1)
	@NotNull
	public String getDescription() {
		return description;
	}
	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof AclExpression) {
			AclExpression another = (AclExpression)obj;
			return name.equals(another.name);
		}
		return false;
	}
	
	@Override
	public int hashCode() {
		return name.hashCode();
	}
}
