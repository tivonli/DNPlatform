package com.digitnexus.core;

import com.digitnexus.core.util.ConfigUtil;

public class CoreConstants {

	public final static String ENCODING = "utf-8";

	public static final String DEFAULT_CLIENT_ID = "core.clientId";
	
	public static final String CACHE_RESULT = "resultCache";
	public static final String CACHE_MENU = "menuCache";

	public static final String ID_HEADER_SEGMENTS = "core.id.header.segments";
	public static final String ID_HEADER_REMAINDER = "core.id.header.remainder";
	public static final String POJO_ID_MIN_QUANTITY = "core.pojoId.minQuantity";
	public static final String EPC_ID_MIN_QUANTITY = "core.epc.minQuantity";
	public static final Long EPC_ID_COMPANY_NO = ConfigUtil.getConfig()
	        .getLong("core.epc.companyNo");
	
	public final static String DEFAULT_TRIPLE_DES_KEY_FILE = "TRIPLE_DES_KEY_UNIQUE";
}
