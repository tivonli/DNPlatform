package com.digitnexus.core.id.domain;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.domain.DataObject;

@Entity
@Table(name = "COMM_ID_HEADER")
@org.hibernate.annotations.Table(appliesTo = "COMM_ID_HEADER", comment = "ID header info")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class IdHeader extends DataObject {
	private static final long serialVersionUID = 1L;
	
	public static final int DEFAULT_MAX_SERVER_NO = 900;
	
	public static final int SERVER_NO_BIT_LENGTH = 10;

	private String id;

	// data center no
	// private int dcno;

	private int serverNo;

	private String mac;

	@Id
	@Column(name = "id")
	@GenericGenerator(name = "idGenerator", strategy = "assigned")
	@GeneratedValue(generator = "idGenerator")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	// @Column(name = "dcno", length=1)
	// @ListViewColumn(order = 10, widthPercentage = 20)
	// @EditViewField(order = 10, dataType = DataType.INTEGER)
	// public int getDcno() {
	// return dcno;
	// }
	//
	// public void setDcno(int dcno) {
	// this.dcno = dcno;
	// }

	@Column(name = "server_no", length = 3)
	public int getServerNo() {
		return serverNo;
	}

	public void setServerNo(int serverNo) {
		this.serverNo = serverNo;
	}

	@Column(name = "mac", length = 32)
	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

}
