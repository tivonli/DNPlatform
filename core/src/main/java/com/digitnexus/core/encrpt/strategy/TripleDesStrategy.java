package com.digitnexus.core.encrpt.strategy;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import net.sf.ehcache.Element;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.CoreConstants;
import com.digitnexus.core.cache.EhcacheClient;
import com.digitnexus.core.encrpt.EncryptUtil;
import com.digitnexus.core.exception.DigitNexusRuntimeException;

public class TripleDesStrategy {
	private final Logger	log	= LoggerFactory.getLogger(getClass());

	private static final String DES3_ALGORITHM = "DESede/CBC/PKCS5Padding";

	private static final byte[] INIT_IV_VALUE = {1,2,3,4,5,6,7,8};

	private static final IvParameterSpec iv = new IvParameterSpec(INIT_IV_VALUE);


	/**
	 * decrypt method
	 * 
	 * @param source
	 *            the byte arrays to be decrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the decrypt byte arrays
	 */
	public byte[] decrypt(byte[] source, String keyFileName) {
		byte[] result = {};
		Cipher cipher = null;

//		Security.addProvider(new com.sun.crypto.provider.SunJCE());
		
		try {
			cipher = Cipher.getInstance(DES3_ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
//			log.error("not supported algorithm：" + DES3_ALGORITHM, e);
			throw new DigitNexusRuntimeException("not supported algorithm：" + DES3_ALGORITHM, e);
//			return result;
		} catch (NoSuchPaddingException e) {
			throw new DigitNexusRuntimeException("not support padding：" + DES3_ALGORITHM, e);
//			return result;
		}

		SecretKey key = getKey(keyFileName);
		if (key == null) {
			return result;
		}
		try {

			cipher.init(Cipher.DECRYPT_MODE, key, iv);
		} catch (InvalidKeyException e) {
			throw new DigitNexusRuntimeException(
					"Not valid Key（not valid encoding、wrong size、uninitialize etc.）",
					e);
//			return result;
		} catch (InvalidAlgorithmParameterException e) {
			throw new DigitNexusRuntimeException("not valid algorithm parameter", e);
//			return result;
		}
		// do decrypt
		try {
			result = cipher.doFinal(source);
		} catch (Exception e) {
			throw new DigitNexusRuntimeException("decrypt fail", e);
		}

		return result;
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
	public String decrypt(String text, String keyFileName) {
		return new String(decrypt(EncryptUtil.hex2byte(text), keyFileName));
	}

	/**
	 * encrypt method
	 * 
	 * @param source
	 *            the bytes to be encrypt
	 * @param keyFileName
	 * 				the SecurityKey filename
	 * 
	 * @return the encrypt byte arrays
	 */
	public byte[] encrypt(byte[] source, String keyFileName) {
		byte[] result = {};
		Cipher cipher = null;
//		Security.addProvider(new com.sun.crypto.provider.SunJCE());

		try {
			cipher = Cipher.getInstance(DES3_ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
			throw new DigitNexusRuntimeException("not supported algorithm：" + DES3_ALGORITHM, e);
//			return result;
		} catch (NoSuchPaddingException e) {
			throw new DigitNexusRuntimeException("not support padding：" + DES3_ALGORITHM, e);
//			return result;
		}

		SecretKey key = getKey(keyFileName);
		if (key == null) {
			return result;
		}
		try {
			cipher.init(Cipher.ENCRYPT_MODE, key, iv);
		} catch (InvalidKeyException e) {
			throw new DigitNexusRuntimeException(
					"Not valid Key（not valid encoding、wrong size、uninitialize etc.）",
					e);
//			return result;
		} catch (InvalidAlgorithmParameterException e) {
			throw new DigitNexusRuntimeException("not valid algorithm parameter", e);
//			return result;
		}
		// do encrypt
		try {
			result = cipher.doFinal(source);
		} catch (Exception e) {
			throw new DigitNexusRuntimeException("encrypt fail", e);
		}

		return result;
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
	public String encrypt(String text, String keyFileName) {
		return EncryptUtil.byte2hex(encrypt(text.getBytes(), keyFileName));
	}

	private SecretKey getKey(String keyFileName) {
		SecretKey key = null;
		if (keyFileName == null || "".equals(keyFileName)) {
			keyFileName = CoreConstants.DEFAULT_TRIPLE_DES_KEY_FILE;
		}
		Element cachekey = EhcacheClient.getCache("securityKey").get(keyFileName);
		if (cachekey == null) {
			ObjectInputStream in = null;
			// 3des key size is 24 bytes
			byte[] keybytes = new byte[24];  
			try {
				in = new ObjectInputStream(this.getClass().getResourceAsStream("/encrypt/" + keyFileName));	
				int byteread = 0;
				while ((byteread = in.read(keybytes)) != -1){  
					System.out.write(keybytes, 0, byteread);  
					}
			} catch (FileNotFoundException e) {
				throw new DigitNexusRuntimeException("security key not found", e);
			} catch (IOException e) {
				throw new DigitNexusRuntimeException("", e);
			} finally {
				if (in != null) {
					try {
						in.close();
					} catch (IOException e) {
						log.error("",e);
					}
				}
			}
	
			 key = new SecretKeySpec(keybytes,  "DESede");
			 EhcacheClient.getCache("securityKey").put(new Element(keyFileName, key));
		} else {
			key = (SecretKey) cachekey.getObjectValue();
		}
		return key;
	}
}
