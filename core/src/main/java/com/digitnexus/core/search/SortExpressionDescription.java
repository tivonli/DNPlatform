package com.digitnexus.core.search;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

/**
 * 
 * @author Santanu
 */
@Entity
@Table(name = "sort_expressions")
public class SortExpressionDescription {
	private long id;
	private String name;
	private boolean ascending;
	
	
	public SortExpressionDescription(){
		
	}
	
	/**
	 * @param name
	 * @param order
	 */
	public SortExpressionDescription(String name, boolean ascending) {
		this.name = name;
		this.ascending = ascending;
	}
	
	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name="id")
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}

	/**
	 * @return the name
	 */
	
	@Column(name="name",nullable=false)
	public String getName() {
		return name;
	}
	
	public void setName(String name){
		this.name=name;
	}
	
	
	/**
	 * @return the ascending
	 */
	@Column(name = "ascending")
	@Type(type = "yes_no")
	public boolean isAscending() {
		return ascending;
	}
	
	public void setAscending(boolean ascending){
		this.ascending=ascending;
	}
}