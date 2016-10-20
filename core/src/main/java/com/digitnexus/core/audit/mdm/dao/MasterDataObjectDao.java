package com.digitnexus.core.audit.mdm.dao;

import org.springframework.stereotype.Repository;

import com.digitnexus.core.audit.mdm.domain.MasterDataObject;
import com.digitnexus.core.dao.BaseDaoImpl;

@Repository
public class MasterDataObjectDao extends BaseDaoImpl implements
		IMasterDataObjectDao {

	@Override
	public MasterDataObject getMasterDataByCode(String entityName,String code){
		return (MasterDataObject) super.createQuery("from "+entityName+" where code=:code")
				.setParameter("code", code).uniqueResult();
	}

}
