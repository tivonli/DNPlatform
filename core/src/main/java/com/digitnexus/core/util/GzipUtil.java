package com.digitnexus.core.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.util.DecodeUtil;

/**
 * util class for using gzip
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date: 2011-9-30
 * @since 1.3.0
 */
public class GzipUtil {
	private static final Logger	log	= LoggerFactory.getLogger(GzipUtil.class);

	/**
	 * compress the text using gzip algorithm
	 * 
	 * @param text
	 *            should be a base64 encode string
	 * @return the plain text String
	 * @throws IOException 
	 */
	public static String unzip(String text) throws IOException{
		log.debug("gzip message length is " + text.length());
		// OutputStream out = null;
		InputStream in = null;
		byte[] source = DecodeUtil.base64Decode(text);
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			byte[] tempbytes = new byte[source.length];
			int byteread = 0;
			in = new GZIPInputStream(new ByteArrayInputStream(source));
			while ((byteread = in.read(tempbytes)) != -1) {
				out.write(tempbytes, 0, byteread);
			}
		} catch (IOException e) {
			throw e;
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					log.error("", e);
				}
			}
			// no need to close ByteArrayOutputStream, and close not work, see
			// jdk
		}

		log.debug("unzip message length is " + out.toString().length());
		return out.toString();
	}

	/**
	 * uncompress the text using gzip algorithm
	 * 
	 * @param text
	 *            the plain text
	 * @return the base64 encoded String after compress
	 * @throws IOException 
	 */
	public static String zip(String text) throws IOException {
		log.debug("unzip message length is " + text.length());
		String result = null;
		GZIPOutputStream out = null;
		InputStream in = null;
		ByteArrayOutputStream resultStream = new ByteArrayOutputStream();
		try {
			out = new GZIPOutputStream(resultStream);
			byte[] tempbytes = new byte[text.length()];
			int byteread = 0;
			in = new ByteArrayInputStream(text.getBytes());
			while ((byteread = in.read(tempbytes)) != -1) {
				out.write(tempbytes, 0, byteread);
			}

		} catch (IOException e) {
			throw e;
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					log.error("", e);
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					log.error("", e);
				}
			}
			// no need to close ByteArrayOutputStream, and close not work, see
			// jdk
		}
		result = DecodeUtil.base64Encode(resultStream.toByteArray()).replaceAll("\r\n", "");
		log.debug("gzip message length is " + result.length());
		return result;
	}
}
