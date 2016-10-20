package com.digitnexus.core.audit.mdm;

import java.util.HashMap;
import java.util.Map;

import com.digitnexus.core.audit.mdm.domain.MasterDataType;
import com.digitnexus.core.audit.mdm.domain.ReceiveRecord;


public class MasterDataConfig {
	public static ThreadLocal<ReceiveRecord> local = new ThreadLocal<ReceiveRecord>();
	private static  Map<String,Class> set1 = new HashMap<String,Class>();
	private static  Map<String,String> set2 = new HashMap<String,String>();
	private static MasterDataType type = MasterDataType.MASTER;
	private static String masterAddress;
	private static String systemName;
	public static void put(String masterDataName,Class className){
		set1.put(masterDataName, className);
		set2.put(className.getName(), masterDataName);
	}
	
	public static boolean contains(Class masterClassName){
		return set2.get(masterClassName.getName())!=null?true:false;
	}
	
	public static String getCommonName(Class localClass){
		return set2.get(localClass.getName());
	}
	public static Class getEntityClass(String commonName){
		return set1.get(commonName);
	}
	public static void setType(MasterDataType dataType){
		type = dataType;
	}
	public static MasterDataType getDataType(){
		return type;
	}

	public static String getMasterAddress() {
		return masterAddress;
	}

	public static void setMasterAddress(String masterAddress) {
		MasterDataConfig.masterAddress = masterAddress;
	}

	public static String getSystemName() {
		return systemName;
	}

	public static void setSystemName(String systemName) {
		MasterDataConfig.systemName = systemName;
	}
	
}
