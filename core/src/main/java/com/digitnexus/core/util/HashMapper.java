package com.digitnexus.core.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.jibx.runtime.IAliasable;
import org.jibx.runtime.IMarshallable;
import org.jibx.runtime.IMarshaller;
import org.jibx.runtime.IMarshallingContext;
import org.jibx.runtime.IUnmarshaller;
import org.jibx.runtime.IUnmarshallingContext;
import org.jibx.runtime.JiBXException;
import org.jibx.runtime.impl.MarshallingContext;
import org.jibx.runtime.impl.UnmarshallingContext;

/**
 * This particular implementation handles one particular form of hashmaps, with
 * string keys and values of an object type with a mapping definition within the
 * JiBX binding file.
 * 
 * @author Carter
 * 
 */
public class HashMapper implements IMarshaller, IUnmarshaller, IAliasable {

//	private static final String SIZE_ATTRIBUTE_NAME = "size";
	private static final String ENTRY_ELEMENT_NAME = "entry";
	private static final String KEY_ATTRIBUTE_NAME = "key";
//	private static final int DEFAULT_SIZE = 10;

	private String uri;
	private int index;
	private String name;

	public HashMapper() {
		uri = null;
		index = 0;
		name = "hashmap";
	}

	public HashMapper(String uri, int index, String name) {
		this.uri = uri;
		this.index = index;
		this.name = name;
	}

	@Override
	public boolean isPresent(IUnmarshallingContext ctx) throws JiBXException {
		return ctx.isAt(uri, name);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Object unmarshal(Object obj, IUnmarshallingContext ctx)
			throws JiBXException {
		// make sure we're at the appropriate start tag
		UnmarshallingContext mctx = (UnmarshallingContext) ctx;
		if (!mctx.isAt(uri, name)) {
			mctx.throwStartTagNameError(uri, name);
		}

		// create new hashmap if needed
//		int size = mctx.attributeInt(uri, SIZE_ATTRIBUTE_NAME, DEFAULT_SIZE);
//		HashMap map = (HashMap) obj;
//		if (map == null) {
//			map = new HashMap(size);
//		}
		HashMap map = (HashMap) obj;
		if(map == null){
			map = new HashMap();
		}

		// process all entries present in document
		mctx.parsePastStartTag(uri, name);
		while (mctx.isAt(uri, ENTRY_ELEMENT_NAME)) {
			Object key = mctx.attributeText(uri, KEY_ATTRIBUTE_NAME, null);
			mctx.parsePastStartTag(uri, ENTRY_ELEMENT_NAME);
			Object value = mctx.unmarshalElement();
			map.put(key, value);
			mctx.parsePastEndTag(uri, ENTRY_ELEMENT_NAME);
		}
		mctx.parsePastEndTag(uri, name);
		return map;
	}

	@Override
	public boolean isExtension(String mapname) {
		// TODO Auto-generated method stub
		return false;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public void marshal(Object obj, IMarshallingContext ctx)
			throws JiBXException {
		if (!(obj instanceof HashMap)) {
			throw new JiBXException("Invalid object type for marshaller");
		} else if (!(ctx instanceof MarshallingContext)) {
			throw new JiBXException("Invalid object type for marshaller");
		} else {

			MarshallingContext mctx = (MarshallingContext) ctx;
			HashMap map = (HashMap) obj;
			mctx.startTagAttributes(index, name).closeStartContent();
//					.attribute(index, SIZE_ATTRIBUTE_NAME, map.size())
//					.closeStartContent();

			Iterator iter = map.entrySet().iterator();
			while (iter.hasNext()) {
				Map.Entry entry = (Map.Entry) iter.next();
				mctx.startTagAttributes(index, ENTRY_ELEMENT_NAME);
				if (entry.getKey() != null) {
					mctx.attribute(index, KEY_ATTRIBUTE_NAME, entry.getKey()
							.toString());
				}
				mctx.closeStartContent();
				if (entry.getValue() instanceof IMarshallable) {
					((IMarshallable) entry.getValue()).marshal(ctx);
					mctx.endTag(index, ENTRY_ELEMENT_NAME);
				} else {
					throw new JiBXException("Mapped value is not marshallable");
				}
			}

			mctx.endTag(index, name);
		}
	}
}
