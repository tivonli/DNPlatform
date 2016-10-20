package com.digitnexus.core.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * util class for decode and encode
 * 
 * @author Tivon Li
 * @Date: 2011-9-30
 */
@SuppressWarnings("restriction")
public class DecodeUtil {
	private static final Logger	log	= LoggerFactory.getLogger(DecodeUtil.class);

	public static String urlDecode(String msg, String encoding)
			throws UnsupportedEncodingException {
		if (msg == null || "".equals(msg.trim())) {
			return "";
		}
		return URLDecoder.decode(msg, encoding);
	}

	public static String urlEncode(String msg, String encoding)
			throws UnsupportedEncodingException {
		log.debug(System.getProperty("file.encoding"));
		if (msg == null || "".equals(msg.trim())) {
			return "";
		}
		return URLEncoder.encode(msg, encoding);
	}

	/**
	 * Use BASE64 to encode the bytes array
	 * 
	 * @param s
	 *            bytes array to be encoded
	 * @return base64 string
	 */
	public static String base64Encode(byte[] s) {
		if (s == null || s.length == 0) {
			return "";
		}

		return (new BASE64Encoder()).encode(s).replaceAll("\r", "").replaceAll("\n", "");
	}

	/**
	 * use BASE64 to decode the string
	 * 
	 * @param s
	 *            base64 String
	 * @return bytes array
	 */
	public static byte[] base64Decode(String s) {
		byte[] result = {};
		if (s == null || "".equals(s.trim())) {
			return result;
		}
		BASE64Decoder decoder = new BASE64Decoder();
		try {
			result = decoder.decodeBuffer(s);
		} catch (Exception e) {
			log.error("error when decode this string：" + s, e);
		}
		return result;
	}
}
