package com.digitnexus.core.id.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "COMM_POJO_ID")
@org.hibernate.annotations.Table(appliesTo = "COMM_POJO_ID", comment = "POJO ID")
public class PojoId extends BaseId{
	 private static final long serialVersionUID = 1L;
	 
	 private int length;

	 @Transient
	public int getLength() {
    	return length;
    }

	public void setLength(int length) {
    	this.length = length;
    }
	 
}
