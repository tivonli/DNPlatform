package com.digitnexus.core.test.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.digitnexus.core.domain.DataObject;

/**
 * Entity which does not extend {@link DataObject}, used for testing
 * 'isTransient'
 * 
 * @author adi
 * 
 */
@Entity
@Table(name = "TEST_NON_DATAOBJECT")
@SequenceGenerator(name = "TEST_NON_DATAOBJECT_SEQ", sequenceName = "TEST_NON_DATAOBJECT_SEQ_DB")
public class NonDataObject {
	private long id;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TEST_NON_DATAOBJECT_SEQ")
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
