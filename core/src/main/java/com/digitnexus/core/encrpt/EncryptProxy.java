package com.digitnexus.core.encrpt;

import com.digitnexus.core.encrpt.strategy.MessageDigestStrategy;
import com.digitnexus.core.encrpt.strategy.TripleDesStrategy;
import com.digitnexus.core.util.DecodeUtil;

public class EncryptProxy {

	private static final MessageDigestStrategy digestStrategy = new MessageDigestStrategy();
	
	private static final TripleDesStrategy tripleDesStrategy = new TripleDesStrategy();
	
	public static String md5Encrypt(String text) {
		return EncryptUtil.byte2hex(md5Encrypt(text.getBytes()));
	}

	public static byte[] md5Encrypt(byte[] text) {
		return digestStrategy.encrypt(text, "MD5");
	}

	public static String sha1Encrypt(String text) {
		return EncryptUtil.byte2hex(sha1Encrypt(text.getBytes()));
	}

	public static byte[] sha1Encrypt(byte[] text) {
		return digestStrategy.encrypt(text, "SHA1");
	}
	
	public static String sha256Encrypt(String text) {
		return EncryptUtil.byte2hex(sha256Encrypt(text.getBytes()));
	}

	public static byte[] sha256Encrypt(byte[] text) {
		return digestStrategy.encrypt(text, "SHA-256");
	}

	/**
	 * use 3DES algorithm to encrypt string
	 * 
	 * @param text
	 *            the string to encrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the encrypt hex string
	 */
	public static String tripleDesEncrypt(String text, String keyFileName) {
		return DecodeUtil.base64Encode(tripleDesEncrypt(text.getBytes(), keyFileName));
	}

	/**
	 * use 3DES algorithm to encrypt bytes
	 * 
	 * @param text
	 *            the bytes to encrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the encrypt bytes
	 */
	public static byte[] tripleDesEncrypt(byte[] text, String keyFileName) {
		// String fileName = new StringBuffer(keyFile).append("_").append(
		// EncryptConstants.DES3_ALGORITHM).append("_UNIQUE_KEY_FILE").toString();
		return tripleDesStrategy.encrypt(text, keyFileName);
	}

	/**
	 * use 3DES algorithm to decrypt string
	 * 
	 * @param text
	 *            the string to decrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the decrypt hex string
	 */
	public static String tripleDesDecrypt(String text, String keyFileName) {
		return new String(tripleDesDecrypt(DecodeUtil.base64Decode(text), keyFileName));
	}

	/**
	 * use 3DES algorithm to decrypt bytes
	 * 
	 * @param text
	 *            the bytes to decrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the decrypt bytes
	 */
	public static byte[] tripleDesDecrypt(byte[] text, String keyFileName) {
		// String fileName = new StringBuffer(keyFile).append("_").append(
		// EncryptConstants.DES3_ALGORITHM).append("_UNIQUE_KEY_FILE").toString();
		return tripleDesStrategy.decrypt(text, keyFileName);
	}

}
