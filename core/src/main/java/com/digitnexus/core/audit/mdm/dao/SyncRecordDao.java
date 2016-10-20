package com.digitnexus.core.audit.mdm.dao;

import org.springframework.stereotype.Repository;

import com.digitnexus.core.audit.mdm.domain.ReceiveRecord;
import com.digitnexus.core.audit.mdm.domain.RecordStatus;
import com.digitnexus.core.dao.BaseDaoImpl;
@Repository
public class SyncRecordDao extends BaseDaoImpl implements ISyncRecordDao{

	@Override
	public ReceiveRecord getReceiveRecord(String entityName, String serverMasterId,RecordStatus status) {
		return (ReceiveRecord) super.createQuery("from ReceiveRecord where serverMasterId =:serverMasterId and entityName=:entityName and status=:status")
		.setParameter("serverMasterId", serverMasterId)
		.setParameter("entityName", entityName)
		.setParameter("status", status).uniqueResult();
	}

}
