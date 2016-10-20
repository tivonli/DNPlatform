package com.digitnexus.core.id;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.digitnexus.core.domain.DataObject;

@Entity
@Table(name = "UT_DOMAIN")
public class UnitTestDomain extends DataObject{

    private static final long serialVersionUID = 1L;

	private String id;
	
	private String name;

	@Id
	@Column(name = "id", length = 128)
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate", parameters = {
			@Parameter(name = "separator", value = "-"),
			@Parameter(name = "first", value = "DN"),
			@Parameter(name = "second", value = "${sys.date}"),
			@Parameter(name = "third", value = "${name}"),
			@Parameter(name = "length", value = "8") })
	@GeneratedValue(generator = "idGenerator")
	public String getId() {
    	return id;
    }

	public void setId(String id) {
    	this.id = id;
    }

	@Id
	@Column(name = "name", length = 64)
	public String getName() {
    	return name;
    }

	public void setName(String name) {
    	this.name = name;
    }
}
