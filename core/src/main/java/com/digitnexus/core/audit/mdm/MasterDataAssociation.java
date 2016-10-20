package com.digitnexus.core.audit.mdm;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.context.ApplicationEvent;

import com.digitnexus.core.audit.mdm.domain.MasterDataType;
import com.digitnexus.core.event.AbstractContextRefreshListener;

public class MasterDataAssociation  extends AbstractContextRefreshListener {
	//this is a map containing the class name as key and the uri resolver as the value
	private Map<String,String> data;
	private String dataType;
	private String masterAddress;
	private String systemName;
	

	public Map<String,String> getData() {
		return data;
	}

	public void setData(Map<String,String> data) {
		this.data = data;
	}


	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getMasterAddress() {
		return masterAddress;
	}

	public void setMasterAddress(String masterAddress) {
		this.masterAddress = masterAddress;
	}

	public String getSystemName() {
		return systemName;
	}

	public void setSystemName(String systemName) {
		this.systemName = systemName;
	}

	/*
	 * (non-Javadoc)
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		Iterator<Entry<String,String>> it = data.entrySet().iterator();
		while(it.hasNext()){
			Entry<String,String> entry = it.next();
			Class entityClass = null;
			try {
				entityClass = Class.forName(entry.getValue());
			} catch (ClassNotFoundException e) {
				throw new RuntimeException("Master data class parse error!",e);
			}
			MasterDataConfig.put(entry.getKey(), entityClass);
		}
		MasterDataConfig.setType(MasterDataType.valueOf(dataType));
		MasterDataConfig.setMasterAddress(masterAddress);
		MasterDataConfig.setSystemName(systemName);
	}
	
	@Override
	public int getOrder() {
		return 600;
	}
}