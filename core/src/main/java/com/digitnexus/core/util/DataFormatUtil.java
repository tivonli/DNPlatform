package com.digitnexus.core.util;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Date;
import java.util.Locale;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * format different data type 
 * @author medea.Yang
 *
 */
public class DataFormatUtil {
	private static final Logger logger=LoggerFactory.getLogger(DataFormatUtil.class);

	private static ThreadLocal<ParseContext> parseContextThreadLocal = new ThreadLocal<ParseContext>() {

		/* (non-Javadoc)
		 * @see java.lang.ThreadLocal#initialValue()
		 */
		@Override
		protected ParseContext initialValue() {
			return new ParseContext();
		}
	};
	
	/**
	 * format the Number
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatNumber(Number data) {
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return data.toString();
			}
			NumberFormat df = NumberFormat.getInstance(locale);
			return df.format(data);
		} finally {
			clearContext();
		}
	}
	
	/**
	 * format the Integer
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatInteger(Integer data) {
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return data.toString();
			}
			NumberFormat df = NumberFormat.getInstance(locale);
			return df.format(data);
		} finally {
			clearContext();
		}
	}
	
	/**
	 * format the Integer
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatBigInteger(BigInteger data) {
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return data.toString();
			}
			NumberFormat df = NumberFormat.getInstance(locale);
			return df.format(data);
		} finally {
			clearContext();
		}
	}
	
	/**
	 * format the data with decimal
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDecimal(Double data) {
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return data.toString();
			}
			NumberFormat df = NumberFormat.getInstance(locale);
			return df.format(data);
		} finally {
			clearContext();
		}
	}
	
	/**
	 * format the date
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDate(Date date){
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return Long.toString(date.getTime());
			}
			DateTimeFormatter formatter = DateTimeFormat.shortDate().withLocale(locale);
			return formatter.print(date.getTime());
		} finally {
			clearContext();
		}
	}	
	
	/**
	 * format the dateTime
	 * @param data
	 * @param locale
	 * @return
	 */
	public static String formatDateTime(Object data){
		try {
			Timestamp time = (Timestamp)data;
			Locale locale = getLocale();
			if (locale == null) {
				return Long.toString(time.getTime());
			}
			DateTimeFormatter formatter = DateTimeFormat.shortDateTime().withLocale(locale);
			String dateTime = formatter.print(time.getTime());
			return dateTime;
		} finally {
			clearContext();
		}
	}
	
	public static Long parseLong(String value) {
		try {
			Locale locale = getLocale();
			if (locale == null) {
				return Long.parseLong(value);
			}
			return NumberFormat.getInstance(locale).parse(value).longValue();
		} catch (ParseException ignored) {
			logger.error("",ignored);
		} finally {
			clearContext();
		}
		return null;
	}
	
	/**
	 * convert the value to the defined type format
	 * @param value
	 * @param dataType
	 * @return
	 * @throws ParseException 
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Object parse(String value, Class javaType, DataType dataType) {
		try {
			Object convertedValue = value;
			if (value != null && dataType != null) {
				Locale locale = getLocale();
				switch (dataType) {
				case INTEGER:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Integer.parseInt(value);
					}
					return ((Number)convertedValue).intValue();
				case LONG:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Long.parseLong(value);
					}
					return ((Number)convertedValue).longValue();
				case BIG_INTEGER:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Long.parseLong(value);
					}
					return new BigInteger(Long.toString(((Number)convertedValue).longValue()));
				case FLOAT:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Float.parseFloat(value);
					}
					return ((Number)convertedValue).floatValue();
				case DOUBLE:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Double.parseDouble(value);
					}
					return ((Number)convertedValue).doubleValue();
				case BIG_DECIMAL:
					if (locale != null) {
						convertedValue = NumberFormat.getInstance(locale).parse(value);
					} else {
						convertedValue = Double.parseDouble(value);
					}
					return new BigDecimal(((Number)convertedValue).doubleValue());
				case BOOLEAN:
					convertedValue = Boolean.parseBoolean(value);
					break;
				case STRING:
					break;
				case DATE:
					if (locale != null) {
						DateTimeFormatter formatter = DateTimeFormat.shortDate().withLocale(locale);
						convertedValue = new Date(formatter.parseMillis(value));
					} else {
						convertedValue = new Date(Long.parseLong(value));
					}
					break;
				case DATETIME:
					if (locale != null) {
						DateTimeFormatter timestampformatter = DateTimeFormat.shortDateTime().withLocale(locale);
						convertedValue = new Timestamp(timestampformatter.parseMillis(value));
					} else {
						convertedValue = new Timestamp(Long.parseLong(value));
					}
					break;
				default:
					convertedValue = JsonUtil.toObject(value, javaType);
				}
			}
			
			return convertedValue;
		} catch (ParseException ignored) {
			logger.error("",ignored);
		} catch (IllegalArgumentException ignore) {
			logger.error("",ignore);
		} finally {
			clearContext();
		}
		return null;
	}
	
	@SuppressWarnings("rawtypes")
	public static Object localeIndependentParse(String value, Class javaType, DataType dataType) {
		try {
			setLocaleIndependentContext();
			return parse(value, javaType, dataType);
		} finally {
			clearContext();
		}
	}
	
	public static String toLocaleIndependentJson(Object obj) {
		if (obj == null) {
			return null;
		}
		try {
			setLocaleIndependentContext();
			DataType dataType = DataType.dataTypeForJavaType(obj.getClass());
			switch (dataType) {
			case INTEGER:
				return obj.toString();
			case LONG:
				return obj.toString();
			case BIG_INTEGER:
				return obj.toString();
			case FLOAT:
				return obj.toString();
			case DOUBLE:
				return obj.toString();
			case BIG_DECIMAL:
				return obj.toString();
			case BOOLEAN:
				return obj.toString();
			case STRING:
				return obj.toString();
			case DATE:
				return obj.toString();
			case DATETIME:
				return obj.toString();
			default:
				return JsonUtil.toJson(obj);
			}
		} finally {
			clearContext();
		}
	}
	
	private static void setLocaleIndependentContext() {
		ParseContext context = new ParseContext();
		context.setLocale(null);
		parseContextThreadLocal.set(context);
	}
	
	private static void clearContext() {
		parseContextThreadLocal.remove();
	}
	
	private static Locale getLocale() {
		return parseContextThreadLocal.get().getLocale();
	}
	
	private static Locale getCurrentLocale() {
		User currentUser = SecurityUtil.getCurrentUser();
		if (currentUser != null) {
			return currentUser.getLocale();
		}
		return I18NUtil.DEFAULT_LOCALE;
	}
	
	private static class ParseContext {
		private Locale locale = DataFormatUtil.getCurrentLocale();

		/**
		 * @return the locale
		 */
		public Locale getLocale() {
			return locale;
		}

		/**
		 * @param locale the locale to set
		 */
		public void setLocale(Locale locale) {
			this.locale = locale;
		}
	}
}
