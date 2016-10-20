/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id;

import java.io.Serializable;
import java.util.Properties;

import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.dialect.Dialect;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.id.Configurable;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.type.Type;


/**
 * POJO ID generator for hibernate
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2012-03-18
 * @since 1.5.0
 */
public class PojoIdGeneratorHibernate implements IdentifierGenerator,
        Configurable {

	private String item;

	// digit length
	private int length = 19;

	private String first;

	private String second;

	private String third;

	private String separator;

//	private PojoIdGenerator generator;

	@Override
	public Serializable generate(SessionImplementor session, Object object)
	        throws HibernateException {
//		LocalIdInfo info = new LocalIdInfo();
//		info.setClientID(CommonConstants.COMPANY_NAME);
//		info.setIdType(IDType.POJO.ordinal());
//		info.setItem(item);
//		info.setEndId(IdGenerateUtil.calculateEndId(length));
//
//		if (generator == null) {
//			Object temp = ServiceLocator.getService("pojoIdGenerator");
//			generator = (PojoIdGenerator) temp;
//		}
//		long id = generator.getSingleId(info);
		
		long id = IdGenerateUtil.generateNumberId(item, length);

		if ("".equals(first) && "".equals(second) && "".equals(third)) {
			return id;
		} else {
			return IdGenerateUtil.generateStrId(object, item, length, separator, first, second, third);
//			return IdGenerateUtil.generateStrId(object, length, separator, item, first, second,
//			        third);
		}
	}

	@Override
	public void configure(Type type, Properties params, Dialect d)
	        throws MappingException {
		String strLength = params.getProperty("length");
		if (strLength != null) {
			length = new Integer(strLength);
		}

		item = params.getProperty("item");
		if (item == null) {
			item = params.getProperty("entity_name");
		}

		separator = params.getProperty("separator");
		if (separator == null) {
			separator = "";
		}

		first = params.getProperty("first");
		if (first == null) {
			first = "";
		}

		second = params.getProperty("second");
		if (second == null) {
			second = "";
		}

		third = params.getProperty("third");
		if (third == null) {
			third = "";
		}

	}

}
