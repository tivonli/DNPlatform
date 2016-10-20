package com.digitnexus.core.util;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.*;
import java.util.*;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * format different data type 
 * @author medea.Yang
 *
 */
public class DataTypeFormatUtil {

	/**
	 * 
	 * @param data
	 * @param type
	 * @return
	 */
	public static String formatData(Object data, String type) {
		return formatData(data, type, Locale.getDefault());
	}
	
	/**
	 * format the data type that defined in class DataType
	 * @param data
	 * @param type
	 * @param locale
	 * @return
	 */
	public static String formatData(Object data, String type, Locale locale) {

		if (data == null || type == null || locale == null)
			return "";

		if (Integer.TYPE.equals(data.getClass()) || Integer.class.equals(data.getClass())) {
			return formatInteger(data, locale);
		} else if (Long.TYPE.equals(data.getClass()) || Long.class.equals(data.getClass())) {
			return formatInteger(data, locale);
		} else if (type.equals(DataType.INTEGER.toString()) || type.equals(DataType.LONG.toString())
				|| type.equals(DataType.BIG_INTEGER.toString())) {
			return formatBigInteger(data, locale);
		} else if (type.equals(DataType.FLOAT.toString()) || type.equals(DataType.DOUBLE.toString())
				|| type.equals(DataType.BIG_DECIMAL.toString())) {
			return formatDecimal(data, locale);
		} else if (type.equals(DataType.DATE.toString())) {
			return formatDate(data, locale);
		} else if (type.equals(DataType.DATETIME.toString())) {
			return formatDateTime(data, locale);
		} else {
			return data.toString();
		}
	}
	
	/**
	 * format the Integer
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatInteger(Object data, Locale locale) {
		BigInteger value = new BigInteger(data.toString());
		NumberFormat df = NumberFormat.getInstance(locale);
		return df.format(value);
	}
	
	/**
	 * format the Integer
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatBigInteger(Object data, Locale locale) {
		BigInteger value = new BigInteger(data.toString());
		NumberFormat df = NumberFormat.getInstance(locale);
		return df.format(value);
	}
	
	/**
	 * format the data with decimal
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDecimal(Object data, Locale locale) {
		BigDecimal value = new BigDecimal(data.toString());
		NumberFormat df = NumberFormat.getInstance(locale);
		return df.format(value);
	}
	
	/**
	 * format the date
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDate(Object data, Locale locale){
		Timestamp time = (Timestamp)data;
		DateTimeFormatter formatter = DateTimeFormat.longDate().withLocale(locale);
		String date = formatter.print(time.getTime());
		return date;
	}	
	
	/**
	 * format the dateTime
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDateTime(Object data, Locale locale){
		Timestamp time = (Timestamp)data;
		DateTimeFormatter formatter = DateTimeFormat.longDateTime().withLocale(locale);
		String dateTime = formatter.print(time.getTime());
		return dateTime;
	}
	
	
	/**
	 * convert the value to the defined type format
	 * @param value
	 * @param dataType
	 * @return
	 * @throws ParseException 
	 */
	public static Object convertToDefinedType(String value, Class javaType, DataType dataType) throws ParseException {
		Object convertedValue = value;
		if (value != null && dataType != null) {
			switch (dataType) {
			case INTEGER:
				convertedValue = NumberFormat.getInstance(Locale.getDefault()).parse(value);
				return ((Number)convertedValue).intValue();
			case LONG:
				convertedValue = NumberFormat.getInstance(Locale.getDefault()).parse(value);
				return ((Number)convertedValue).longValue();
			case FLOAT:
				convertedValue = NumberFormat.getInstance(Locale.getDefault()).parse(value);
				return ((Number)convertedValue).floatValue();
			case DOUBLE:
				convertedValue = NumberFormat.getInstance(Locale.getDefault()).parse(value);
				return ((Number)convertedValue).doubleValue();
			case BOOLEAN:
				convertedValue = Boolean.parseBoolean(value);
				break;
			case STRING:
				break;
			case COMPONENT:
				convertedValue = JsonUtil.toObject(value, javaType);
			}
		}
		
		return convertedValue;
	}
}
