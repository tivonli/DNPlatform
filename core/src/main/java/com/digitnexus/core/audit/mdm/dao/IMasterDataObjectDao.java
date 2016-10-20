package com.digitnexus.core.audit.mdm.dao;

import java.io.Serializable;

import com.digitnexus.core.audit.mdm.domain.MasterDataObject;

public interface IMasterDataObjectDao {
	public MasterDataObject getMasterDataByCode(String entityName,String code);
}
