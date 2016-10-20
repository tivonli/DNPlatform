package com.digitnexus.core.encrpt;

import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.security.Security;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class EncryptUtil {
	/** rsa key size */
	private static final int KEYSIZE_RSA = 512;

	/** 3DES key size */
	private static final int KEYSIZE_3DES = 168;

	private static final char hexDigits[] = { '0', '1', '2', '3', '4', '5',
			'6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	/**
	 * change the hex string into bytes array
	 * 
	 * @param b
	 *            hex string to be changed
	 * @return bytes array
	 */
	public static byte[] hex2byte(String s) {
		byte[] b = s.getBytes();
		byte[] b2 = new byte[b.length / 2];

		for (int n = 0; n < b.length; n += 2) {
			String item = new String(b, n, 2);
			b2[n / 2] = (byte) Integer.parseInt(item, 16);
		}

		return b2;
	}

	/**
	 * change the bytes array into hex string
	 * 
	 * @param tmp
	 *            the bytes array to be changed
	 * @return hex string
	 */
	public static String byte2hex(byte[] tmp) {
		final int length = tmp.length;
		char str[] = new char[length * 2]; // each byte need two chars to place
		int k = 0;
		for (int i = 0; i < length; i++) {
			byte byte0 = tmp[i];
			str[k++] = hexDigits[byte0 >>> 4 & 0xf]; //
			str[k++] = hexDigits[byte0 & 0xf];
		}
		return new String(str);
	}

	/**
	 * 根据文件名，生成RSA密钥对
	 * 
	 * @param fileName
	 *            指定文件名，多个文件用","分隔
	 * @throws Exception
	 */
	public static void generateRSAKey(String fileName) throws Exception {
		if (fileName == null || "".equals(fileName)) {
			fileName = "UDB";
		}
		String[] files = fileName.split(",");

		/** 为RSA算法创建一个KeyPairGenerator对象 */
		KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
		ObjectOutputStream oos;
		for (int i = 0; i < files.length; i++) {
			/** 利用随机数据源初始化这个KeyPairGenerator对象 */
			kpg.initialize(KEYSIZE_RSA, new SecureRandom());
			/** 生成密匙对 */
			KeyPair kp = kpg.generateKeyPair();
			/** 得到公钥 */
			Key publicKey = kp.getPublic();
			/** 得到私钥 */
			Key privateKey = kp.getPrivate();

			/** 用对象流将生成的密钥写入文件 */
			oos = new ObjectOutputStream(new FileOutputStream("RSA_" + files[i]
					+ "_PUBLIC"));
			oos.writeObject(publicKey);
			oos.close();
			oos = new ObjectOutputStream(new FileOutputStream("RSA_" + files[i]
					+ "_PRIVATE"));
			oos.writeObject(privateKey);
			oos.close();
		}
	}

	/**
	 * generate tripleDes security key accord to the file name
	 * 
	 * @param fileName
	 *            full fileName in classpath
	 * @throws Exception
	 */
	public static void generateTripleDesKey(String fileName) throws Exception {
		if (fileName == null || "".equals(fileName)) {
			fileName = "KEY";
		}

		Security.addProvider(new com.sun.crypto.provider.SunJCE());
		 KeyGenerator keygen = KeyGenerator.getInstance("DESede");
		ObjectOutputStream oos = null;

		SecureRandom sr = new SecureRandom();
		keygen.init(KEYSIZE_3DES, sr);
		SecretKey key = keygen.generateKey();

		oos = new ObjectOutputStream(new FileOutputStream("TRIPLE_DES_" + fileName
				+ "_UNIQUE"));
		oos.writeObject(key);
		oos.close();

	}

}
