/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.beanutils.BeanUtils;

import com.digitnexus.core.id.business.PojoIdGenerateServiceImpl;
import com.digitnexus.core.id.domain.IdHeader;
import com.digitnexus.core.id.domain.PojoId;
import com.digitnexus.core.spring.ServiceLocator;

/**
 * util class for generate id
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2012-03-18
 * @since 1.5.0
 */
public class IdGenerateUtil {

	private static final String VARIABLE_DATE = "${sys.date}";

	private static final String DATE_FORMAT = "yyyyMMdd";

	private static final String VARIABLE_DATETIME = "${sys.datetime}";

	private static final String DATETIME_FORMAT = "yyyyMMddHHmmss";

	/**
	 * generate id of long type
	 * 
	 * @param item
	 *            which item this id belong to
	 * @return
	 */
	public static long generateNumberId(String item) {
		return generateNumberId(item,
		        19 - (IdHeader.DEFAULT_MAX_SERVER_NO + "").length());
	}

	/**
	 * generate id of long type
	 * 
	 * @param item
	 *            which item this id belong to
	 * @param length
	 *            the character number of the digit id String
	 * @return
	 */
	public static long generateNumberId(String item, int length) {
		PojoId info = new PojoId();
		info.setLength(length);
		info.setItem(item);
		info.setMaxId(calculateMaxId(length));
		long id = ServiceLocator.getService(PojoIdGenerateServiceImpl.class)
		        .generateId(info);

		return id;
	}

	/**
	 * generate id of String type
	 * 
	 * @param item
	 *            which item this id belong to
	 * @param digitLength
	 *            the character number of the digit id String, 0 means no limit
	 * @param separator
	 *            the symbol connect the prefix and the id body and the sufix
	 *            into a entire id String
	 * @param values
	 *            the value of each segment of the id
	 * @return
	 */
	public static String generateStrId(String item, int digitLength,
	        String separator, String... values) {
		return generateStrId(null, item, digitLength, separator, values);
	}

	/**
	 * generate id of String type
	 * 
	 * @param obj
	 *            the entity or top level collection for which the id is being
	 *            generated, only when it's necessary to get value from this
	 *            entity to generate id was this param needed
	 * @param item
	 *            which item this id belong to
	 * @param digitLength
	 *            the character number of the digit id String
	 * @param separator
	 *            the symbol connect the prefix and the id body and the sufix
	 *            into a entire id String
	 * @param values
	 *            the value of each segment of the id
	 * @return
	 */
	public static String generateStrId(Object obj, String item,
	        int digitLength, String separator, String... values) {
		StringBuilder buider = new StringBuilder();
		for (String value : values) {
			if (value != null && !"".equals(value.trim())) {
				buider.append(filter(value, obj));
				buider.append(separator);
			}
		}

		long id = generateNumberId(item, digitLength);

		buider.append(toFixedWidthId(id, digitLength));

		return buider.toString();
	}

	/**
	 * convert the id into fixed length Sting format
	 * 
	 * @param id
	 *            the digit id get from the id management
	 * @param length
	 *            the character number of the target id String
	 * @return the id in fixed length Sting format
	 */
	public static String toFixedWidthId(long id, int length) {
		String strId = id + "";
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < length - strId.length(); i++) {
			builder.append('0');
		}
		builder.append(id);

		return builder.toString();
	}
	
	/**
	 * calculate the max id number
	 * 
	 * @param length
	 *            the character number of the id body
	 * 
	 * @return the max id number
	 */
	public static long calculateMaxId(int length) {
		int serverNoLength = (IdHeader.DEFAULT_MAX_SERVER_NO + "").length();
		if (length < 4) {
			throw new IDException(
			        "the digit length of the id must greater than "
			                + serverNoLength);
		}
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < length - serverNoLength; i++) {
			builder.append('9');
		}

		return new Long(builder.toString());
	}

	private static String filter(String value, Object object) {
		if (VARIABLE_DATE.equals(value)) {
			SimpleDateFormat df = new SimpleDateFormat(DATE_FORMAT);
			value = df.format(new Date());
		} else if (VARIABLE_DATETIME.equals(value)) {
			SimpleDateFormat df = new SimpleDateFormat(DATETIME_FORMAT);
			value = df.format(new Date());
		} else if (value.startsWith("${") && value.endsWith("}")) {
			String expression = value.substring(2, value.length() - 1);
			try {
				value = BeanUtils.getProperty(object, expression);
			} catch (Exception e) {
				throw new IDException("fail to get value from this field: "
				        + expression, e);
			}
			// Serializable compiled = MVEL.compileExpression(expression);
			// value = (String) MVEL.executeExpression(compiled, object);
		}
		return value;
	}
}
