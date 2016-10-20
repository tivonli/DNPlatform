package com.digitnexus.core.util;

import java.io.InputStream;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;

import org.jibx.runtime.BindingDirectory;
import org.jibx.runtime.IBindingFactory;
import org.jibx.runtime.IMarshallingContext;
import org.jibx.runtime.IUnmarshallingContext;
import org.jibx.runtime.JiBXException;


/**
 * 
 * @author adi
 *
 */
public class JibxUtils {
	
	private JibxUtils(){
		
	}

    /**
     * Returns a mapped object from the xml string and type passed
     * 
     * @param xml
     * @param clazz
     * @return an Object of class clazz that has been created from xml.
     */
    public static final <T> T parseObjectFromXML(String xml, Class<T> clazz) {
        return parseObjectFromXML(new StringReader(xml), clazz);
    }
    
    @SuppressWarnings("unchecked")
    public static final <T> T parseObjectFromXMLStream(InputStream in, Class<T> clazz){
    	try {
    		IBindingFactory bfact = BindingDirectory.getFactory(clazz);  
    		IUnmarshallingContext uctx = bfact.createUnmarshallingContext();  
    		return (T) uctx.unmarshalDocument(in, null);
    	} catch (JiBXException e) {
    		throw new RuntimeException(e);
    	}
    }
    
   /* Not used anywhere. If you require this in future, uncomment and write tests for this
    * public static final void saveObjectToXML(OutputStream out, Object object){
    	try {
    		IBindingFactory bfact = BindingDirectory.getFactory(object.getClass());  
    		IMarshallingContext mctx = bfact.createMarshallingContext();
    		mctx.setIndent(2);
    	    mctx.marshalDocument(object, "UTF-8", null, out);
    		return;
    	} catch (JiBXException e) {
    		throw new RuntimeException(e);
    	}
    }*/
    /* Not used anywhere. If you require this in future, uncomment and write tests for this
    public static final String toXML(Object xmlObject) {
        try {
            IBindingFactory bfact = BindingDirectory.getFactory(xmlObject.getClass().getSimpleName(), xmlObject.getClass());
            IMarshallingContext mctx = bfact.createMarshallingContext();
            StringWriter out = new StringWriter();
            mctx.marshalDocument(xmlObject, "UTF-8", Boolean.TRUE, out);
            String xml = out.toString();

            return xml;
        } catch (JiBXException e) {
            throw new RuntimeException(e);
        }

    }*/
    
    private static <T> T parseObjectFromXML(Reader reader, Class<T> c) {
        try {
            IBindingFactory bfact = BindingDirectory.getFactory(c);
            return unmarshallObject(c, reader, bfact);
        } catch (JiBXException e) {
            throw new RuntimeException(e);
        }
    }

    @SuppressWarnings("unchecked")
	private static <T> T unmarshallObject(Class<T> clazz, Reader reader, IBindingFactory factory) {
        try {
            IUnmarshallingContext uctx = factory.createUnmarshallingContext();
            /*
             * This may throw a ClassCastException, so capture it
             */
            return (T) uctx.unmarshalDocument(reader);
        } catch (JiBXException e) {

            throw new RuntimeException(e);
        } catch (ClassCastException e) {
            throw new RuntimeException(e);
        }
    }
    
//    @SuppressWarnings("rawtypes")
	public static <T> String marshal(Object object, Class<T> c)
			throws Exception {
		IBindingFactory factory = null;
		StringWriter writer = null;
		String result = null;
		try {
			factory = BindingDirectory.getFactory(c);
			IMarshallingContext mctx = factory.createMarshallingContext();
			writer = new StringWriter();
			mctx.setIndent(2);
			mctx.marshalDocument(object, "utf-8", null, writer);
			result = writer.toString();
			return result;
		} catch (JiBXException e) {
			throw e;
		} finally {
			if (writer != null) {
				writer.close();
			}
		}
	}

}
