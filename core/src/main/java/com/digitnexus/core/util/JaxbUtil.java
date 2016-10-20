package com.digitnexus.core.util;

import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamResult;

/**
 * A util class for covert message between xml string and java object
 * 
 * @author Tivon Li
 * @Date: 2011-9-30
 */
public class JaxbUtil {
//	private final Logger	log	= LoggerFactory.getLogger(getClass());
	
	private JaxbUtil(){
		
	}

	@SuppressWarnings("rawtypes")
	public static Object unmarshal(String message, Class objClass) throws Exception {
		JAXBContext jc = JAXBContext.newInstance(objClass);
		Unmarshaller unmarshaller = jc.createUnmarshaller();
		StringReader source = new StringReader(message);
		Object obj = unmarshaller.unmarshal(source);
		if (obj instanceof JAXBElement) {
			return ((JAXBElement) obj).getValue();
		} else {
			return obj;
		}
	}

	@SuppressWarnings("rawtypes")
	public static String marshal(Object object, Class objClass) throws Exception {
		JAXBContext jc = JAXBContext.newInstance(objClass);
		Marshaller marshaller = jc.createMarshaller();
		StringWriter writer = new StringWriter();
		marshaller.marshal(object, new StreamResult(writer));
		return writer.toString();
	}
}
