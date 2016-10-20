package com.digitnexus.core.test.dataobjects;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.digitnexus.core.domain.DataObject;

/**
 * @author Adi
 */
@Entity @Table(name = "ASSETLOCATION_TEST")
@SequenceGenerator(name="ASSETLOCATION_TEST_SEQ",sequenceName="ASSETLOCATION_TEST_SEQ_DB")
public class AssetLocation extends DataObject {

	private static final long		serialVersionUID		= 1L;
	private long id;
	private Date timestamp;
	private Asset asset;
	private String typecode;
	private String statusCode;


	@Id
	@Column(name = "id")
    @GeneratedValue(strategy=GenerationType.SEQUENCE,generator="ASSETLOCATION_TEST_SEQ")
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "timestamp")
	public Date getTimestamp() {
		return this.timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}


	@OneToOne @JoinColumn(name="asset_id")
	public Asset getAsset() {
		return this.asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	@Column(name="typecode")
    public String getTypecode() {
		return this.typecode;
	}

	public void setTypecode(String typecode) {
		this.typecode = typecode;
	}

	@Column(name="status_code")
	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	
	

}
