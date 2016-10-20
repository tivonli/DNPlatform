package com.digitnexus.core.search;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang.StringUtils;
import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;

/**
 * Filter expression as passed by the search GET request is captured using this object
 * 
 * @author Santanu
 */
@Entity
@Table(name="filter_expressions")
public class FilterExpressionDescription {
	private long id;
	//name of the field
	private String name;
	//only value for single value query, lower value for double value query like between
	//array of values for the case of in queries
	private Object lowerLimit;
	//relevant for between queries
	private Object upperLimit;
	private SearchOperator searchOperator;
	private DataType dataType;
	@SuppressWarnings("rawtypes")
	private Class javaType;
	
	//String representation of upper and lower limit to store in db
	private String  lowerLimitValue;
	private String  upperLimitValue;
	//This is just for jibx
	@SuppressWarnings("unused")
	private String  operator;
		
	public FilterExpressionDescription(){
		
	}
	
	/**
	 * @param name name of the field
	 * @param lowerLimit this can be String or String array. this will be converted to relevant object based on DataType
	 * @param upperLimit this typically should be String
	 * @param dataType dataType of the field as configured
	 * @param javaType Actual Java class of the value.Can be Null for generic types
	 */
	@SuppressWarnings("rawtypes")
	public FilterExpressionDescription(String name, Object lowerLimit, Object upperLimit, SearchOperator searchOperator, DataType dataType, Class javaType) {
		this.name = name;
		this.dataType = dataType;
		this.javaType=javaType;
		this.lowerLimit = converDataType(lowerLimit, dataType);
		this.upperLimit = converDataType(upperLimit, dataType);
		this.searchOperator = searchOperator;
		
	}
	
	/**
	 * @param name name of the field
	 * @param lowerLimit this can be String or String array. this will be converted to relevant object based on DataType
	 * @param upperLimit this typically should be String
	 * @param dataType dataType of the field as configured
	 */
	public FilterExpressionDescription(String name, Object lowerLimit, Object upperLimit, SearchOperator searchOperator, DataType dataType) {
		this(name,lowerLimit,upperLimit,searchOperator,dataType,null);
	}
	@Id
	@Column(name="id")
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
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
	

	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return the dataType
	 */
	@Transient
	public DataType getDataType() {
		return dataType;
	}
	
	public void setDataType(DataType dataType){
		this.dataType=dataType;
	}
	/**
	 * @return the lowerLimit
	 */
	@Transient
	public Object getLowerLimit() {
		return lowerLimit;
	}
	
	public void setLowerLimit(Object lowerLimit){
		this.lowerLimit=lowerLimit;
	}
	/**
	 * @return the upperLimit
	 */
	@Transient
	public Object getUpperLimit() {
		return upperLimit;
	}
	
	public void setUpperLimit(Object upperLimit){
		this.upperLimit=upperLimit;
	}
	/**
	 * @return the searchOperator
	 */
	@Column(name = "search_operator", nullable = false)
	@Enumerated(EnumType.STRING)
	public SearchOperator getSearchOperator() {
		return searchOperator;
	}

	public void setSearchOperator(SearchOperator searchOperator) {
		this.searchOperator = searchOperator;
	}
	
	
	public Object converDataType(Object value, DataType dataType) {
		if (value instanceof String) {
			return converDataType((String)value, dataType);
		} else if (value instanceof String[]) {
			String[] values = (String[]) value;
			Object[] objValues = new Object[values.length];
			for (int i = 0; i < values.length; i++) {
				objValues[i] = converDataType(values[i], dataType);
			}
			return objValues;
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	public Object converDataType(String value, DataType dataType) {
		//two valid cases where we do not want to convert the value
		//actually for ENUM, I do not know what to do
		switch (dataType) {
		case REFERENCE:
			return value;
		case ENUMERATION:
			if(javaType!=null && Enum.class.isAssignableFrom(javaType)){
				if(StringUtils.isEmpty(value)){
					return null;
				}else{
					return Enum.valueOf(javaType, value);
				}
			}else{
				return javaType;
			}
			
		}
		Object result = DataFormatUtil.parse(value, null, dataType);
		return result;
	}
    
	@Column(name="lower_limit")
	public String getLowerLimitValue() {
		return lowerLimitValue;
	}

	public void setLowerLimitValue(String lowerLimitValue) {
		this.lowerLimitValue = lowerLimitValue;
	}
	
	@Column(name="upper_limit")
	public String getUpperLimitValue() {
		return upperLimitValue;
	}

	public void setUpperLimitValue(String upperLimitValue) {
		this.upperLimitValue = upperLimitValue;
	}
    
	/**
	 * This is for jibx
	 * @param operator
	 */
	public void setOperator(String operator) {
		setSearchOperator(SearchOperator.valueOf(operator));
	}

	@SuppressWarnings("rawtypes")
	public void setJavaType(Class javaType) {
		this.javaType = javaType;
	}
}