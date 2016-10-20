package com.digitnexus.core.id.domain;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.exception.DigitNexusRuntimeException;

@MappedSuperclass
public abstract class BaseId extends DataObject implements Cloneable {
	private static final long serialVersionUID = 1L;

	private String id;

	private String item;

	private long nextId;

	private long maxId;

	private boolean isUseup;

	private IdHeader header;

	private long quantity;

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

	@Column(name = "item", length = 96)
	public String getItem() {
		return item;
	}

	public void setItem(String item) {
		this.item = item;
	}

	@Column(name = "next_id", length = 15)
	public long getNextId() {
		return nextId;
	}

	public void setNextId(long nextId) {
		this.nextId = nextId;
	}

	@Column(name = "max_id", length = 15)
	public long getMaxId() {
		return maxId;
	}

	public void setMaxId(long maxId) {
		this.maxId = maxId;
	}

	@Column(name = "is_useup", length = 1)
	public boolean isUseup() {
		return isUseup;
	}

	public void setUseup(boolean isUseup) {
		this.isUseup = isUseup;
	}

	@ManyToOne(optional = false, cascade = { CascadeType.PERSIST,
			CascadeType.MERGE })
	@JoinColumn(name = "header_id", nullable = false)
	public IdHeader getHeader() {
		return header;
	}

	public void setHeader(IdHeader header) {
		this.header = header;
	}

	@Transient
	public long getQuantity() {
		return quantity;
	}

	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}
	
    public BaseId clone() {
        try {
	        return (BaseId)super.clone();
        } catch (CloneNotSupportedException e) {
	        throw new DigitNexusRuntimeException(e);
        }
    }
}
