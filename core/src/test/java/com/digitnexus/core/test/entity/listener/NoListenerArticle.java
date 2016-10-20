package com.digitnexus.core.test.entity.listener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.digitnexus.core.domain.DataObject;

@Entity
@Table(name = "TEST_NO_LISTENER")
@SequenceGenerator(name = "TEST_NO_LISTENER_SEQ", sequenceName = "TEST_NO_LISTENER_SEQ_DB")
public class NoListenerArticle extends DataObject {
	private static final long	serialVersionUID	= 1L;
	
	private long	id;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "TEST_NO_LISTENER_SEQ")
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

}
