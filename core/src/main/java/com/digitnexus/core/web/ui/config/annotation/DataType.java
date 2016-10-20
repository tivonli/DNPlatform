/**
 * 
 */
package com.digitnexus.core.web.ui.config.annotation;

import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;


/**
 * Supported data type in list and edit view
 * @author Santanu
 */
public enum DataType {
	STRING,
	INTEGER,
	LONG,
	BIG_INTEGER,
	FLOAT,
	DOUBLE,
	BIG_DECIMAL,
	ENUMERATION,
	DATE,
	DATETIME,
	BOOLEAN,
	COMPONENT, //this means encapsulated object
	REFERENCE, //this means relationship
	IMAGE,
	STREAM, //any type of stream, typically attachment, data base type may be blob for RDBMS
	BLOB,
	CLOB,
	UNDEFINED,
	COLLECTION,
	MAP,
	TIMESTAMP;
	
	@SuppressWarnings("rawtypes")
	public static DataType dataTypeForJavaType(Class javaType) {
		if (Boolean.TYPE.equals(javaType) || Boolean.class.equals(javaType)) {
			return DataType.BOOLEAN;
		} else if (Integer.TYPE.equals(javaType) || Integer.class.equals(javaType)) {
			return DataType.INTEGER;
		} else if (Long.TYPE.equals(javaType) || Long.class.equals(javaType)) {
			return DataType.LONG;
		} else if (Float.TYPE.equals(javaType) || Float.class.equals(javaType)) {
			return DataType.FLOAT;
		} else if (Double.TYPE.equals(javaType) || Double.class.equals(javaType)) {
			return DataType.DOUBLE;
		} else if (BigInteger.class.equals(javaType)) {
			return DataType.BIG_INTEGER;
		} else if (BigDecimal.class.equals(javaType)) {
			return DataType.BIG_DECIMAL;
		} else if (Date.class.isAssignableFrom(javaType)) {
			return DataType.DATE;
		} else if (String.class.equals(javaType)) {
			return DataType.STRING;
		} else if (javaType.isEnum()){
			return DataType.ENUMERATION;
		} else if (Map.class.isAssignableFrom(javaType)){
			return DataType.MAP;
		} else if (InputStream.class.isAssignableFrom(javaType)
				|| Reader.class.isAssignableFrom(javaType)){
			return DataType.STREAM;
		}
		
		return DataType.UNDEFINED;
	}
	
	/**
	 * 
	 * @param dataType
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Class javaTypeForDataType(DataType dataType) {
		Class returnType = null;
		switch (dataType) {
		case STRING:
			returnType = String.class;
			break;
		case INTEGER:
			returnType = Integer.class;
			break;
		case LONG:
			returnType = Long.class;
			break;
		case DOUBLE:
			returnType = Double.class;
			break;
		case FLOAT:
			returnType = Float.class;
			break;
		case BIG_INTEGER:
			returnType = BigInteger.class;
			break;
		case BIG_DECIMAL:
			returnType = BigDecimal.class;
			break;
		case BOOLEAN:
			returnType = Boolean.class;
			break;
		case DATE:
			returnType = Date.class;
			break;
		case DATETIME:
		case TIMESTAMP:
			returnType = Timestamp.class;
			break;
		case BLOB:
			returnType = Blob.class;
			break;
		case CLOB:
			returnType = Clob.class;
			break;
		case IMAGE:
			returnType = Blob.class;
			break;
		case COMPONENT:
		case REFERENCE:
		case ENUMERATION:
			returnType = Object.class;
			break;
		}
		return returnType;
	}
}
