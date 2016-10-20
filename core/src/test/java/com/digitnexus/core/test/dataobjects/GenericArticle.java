package com.digitnexus.core.test.dataobjects;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * Article to test all data types. Used for testing web rest services
 * 
 * @author adi
 * 
 */
@Entity
@Table(name = "test_gen_article")
@SequenceGenerator(name = "test__gen_article_seq", sequenceName = "test_gen_article_seq_db")
@View
public class GenericArticle extends DataObject {
	private static final long	serialVersionUID	= 1L;
	
	private long		id;
	private String		name;
	private Integer		intWrapper		= new Integer(1);
	private int			intPrimitive	= 1;
	private BigInteger	bitInteger		= new BigInteger("1");
	private long		longPrimitive	= 1;
	private Long		longWrapper		= 1l;
	private float		floatPrimitive	= 1.1f;
	private Float		floatWrapper	= 1.1f;
	private double		doublePrimitive	= 1.1;
	private Double		doubleWrapper	= 1.1;
	private BigDecimal	bigDecimal		= new BigDecimal("1.1");
	private boolean		booleanPrimitive;
	private Boolean		booleanWrapper	= new Boolean(false);
	private Date		date			= new Date();

	public GenericArticle(){
		
	}
	
    public GenericArticle(String name){
		this.name=name;
	}
    
    @Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "test__gen_article_seq")
	@Column(name = "id")
    @ListViewColumn(order=1)
    @EditViewField(order=1)
    @SearchColumn(order=1)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
    
	@Column(name = "name",unique=true,nullable=false)
	@ListViewColumn(order=2)
	@EditViewField(order=2)
	@SearchColumn(order=2)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
    
	@Column(name = "int_wrapper")
	@ListViewColumn(order=10)
	@EditViewField(order=10)
	@SearchColumn(order=10)
	public Integer getIntWrapper() {
		return intWrapper;
	}
    
	
	public void setIntWrapper(Integer intWrapper) {
		this.intWrapper = intWrapper;
	}
    
	@Column(name = "int_primitive")
	@ListViewColumn(order=11)
	@EditViewField(order=11)
	@SearchColumn(order=11)
	public int getIntPrimitive() {
		return intPrimitive;
	}

	public void setIntPrimitive(int intPrimitive) {
		this.intPrimitive = intPrimitive;
	}
    
	@Column(name = "big_integer")
	@ListViewColumn(order=12)
	@EditViewField(order=12)
	@SearchColumn(order=12)
	public BigInteger getBitInteger() {
		return bitInteger;
	}

	public void setBitInteger(BigInteger bitInteger) {
		this.bitInteger = bitInteger;
	}
    
	@Column(name = "long_primitive")
	@ListViewColumn(order=20)
	@EditViewField(order=20)
	@SearchColumn(order=20)
	public long getLongPrimitive() {
		return longPrimitive;
	}

	public void setLongPrimitive(long longPrimitive) {
		this.longPrimitive = longPrimitive;
	}
    
	@Column(name = "long_wrapper")
	@ListViewColumn(order=21)
	@EditViewField(order=21)
	@SearchColumn(order=21)
	public Long getLongWrapper() {
		return longWrapper;
	}

	public void setLongWrapper(Long longWrapper) {
		this.longWrapper = longWrapper;
	}
    
	@Column(name = "float_primitive")
	@ListViewColumn(order=30)
	@EditViewField(order=30)
	@SearchColumn(order=30)
	public float getFloatPrimitive() {
		return floatPrimitive;
	}

	public void setFloatPrimitive(float floatPrimitive) {
		this.floatPrimitive = floatPrimitive;
	}
    
	@Column(name = "float_wrapper")
	@ListViewColumn(order=31)
	@EditViewField(order=31)
	@SearchColumn(order=31)
	public Float getFloatWrapper() {
		return floatWrapper;
	}

	public void setFloatWrapper(Float floatWrapper) {
		this.floatWrapper = floatWrapper;
	}
    
	@Column(name = "double_primitive")
	@ListViewColumn(order=32)
	@EditViewField(order=32)
	@SearchColumn(order=32)
	public double getDoublePrimitive() {
		return doublePrimitive;
	}

	public void setDoublePrimitive(double doublePrimitive) {
		this.doublePrimitive = doublePrimitive;
	}
    
	@Column(name = "double_wrapper")
	@ListViewColumn(order=33)
	@EditViewField(order=33)
	@SearchColumn(order=33)
	public Double getDoubleWrapper() {
		return doubleWrapper;
	}

	public void setDoubleWrapper(Double doubleWrapper) {
		this.doubleWrapper = doubleWrapper;
	}
    
	@Column(name = "big_decimal")
	@ListViewColumn(order=34)
	@EditViewField(order=34)
	@SearchColumn(order=34)
	public BigDecimal getBigDecimal() {
		return bigDecimal;
	}
    
	
	public void setBigDecimal(BigDecimal bigDecimal) {
		this.bigDecimal = bigDecimal;
	}
    
	@Column(name = "boolean_primitive")
	@ListViewColumn(order=40)
	@EditViewField(order=40)
	@SearchColumn(order=40)
	public boolean isBooleanPrimitive() {
		return booleanPrimitive;
	}

	public void setBooleanPrimitive(boolean booleanPrimitive) {
		this.booleanPrimitive = booleanPrimitive;
	}
    
	@Column(name = "boolean_wrapper")
	@ListViewColumn(order=41)
	@EditViewField(order=41)
	@SearchColumn(order=41)
	public Boolean getBooleanWrapper() {
		return booleanWrapper;
	}

	public void setBooleanWrapper(Boolean booleanWrapper) {
		this.booleanWrapper = booleanWrapper;
	}
    
	@Column(name = "date_column")
	@ListViewColumn(order=50)
	@EditViewField(order=50)
	@SearchColumn(order=50)
	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}
