package com.digitnexus.core.security.util;

import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

public class StringEncoder {
	private static final ShaPasswordEncoder	PASSWORD_ENCODER	= new ShaPasswordEncoder(256);
	
	private StringEncoder(){
		
	}

	public static String encode(String stringToEncode, String salt) {
		return PASSWORD_ENCODER.encodePassword(stringToEncode, salt);
	}

}
