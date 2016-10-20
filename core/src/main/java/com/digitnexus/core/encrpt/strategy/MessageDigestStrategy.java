package com.digitnexus.core.encrpt.strategy;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.digitnexus.core.exception.DigitNexusRuntimeException;

public class MessageDigestStrategy
{
//	private static Logger log = LogManager.getLogger(MessageDigestStrategy.class);
	
	public byte[] encrypt(byte[] text, String algorithm)
	{
		byte[] theDigest = {};

			MessageDigest message;
			try
			{
				message = MessageDigest.getInstance(algorithm);
				message.update(text);
				theDigest = message.digest();
			}
			catch (NoSuchAlgorithmException e)
			{
				throw new DigitNexusRuntimeException("not supported algorithm：" + algorithm, e);
			}
			

		return theDigest;
	}

}
