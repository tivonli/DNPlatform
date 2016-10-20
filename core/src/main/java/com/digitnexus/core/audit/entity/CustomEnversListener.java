package com.digitnexus.core.audit.entity;

import java.io.Serializable;

import org.hibernate.envers.EntityTrackingRevisionListener;
import org.hibernate.envers.RevisionType;
import org.springframework.stereotype.Service;

import com.digitnexus.core.audit.mdm.MasterDataConfig;
import com.digitnexus.core.audit.mdm.domain.MasterDataType;
import com.digitnexus.core.audit.mdm.domain.ReceiveRecord;
import com.digitnexus.core.audit.mdm.domain.RecordStatus;
import com.digitnexus.core.audit.mdm.domain.SyncRecord;
import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.spring.ServiceLocator;

@Service
public class CustomEnversListener implements EntityTrackingRevisionListener {

	@Override
	public void newRevision(Object revisionEntity) {
		CustomRevisionEntity entity = (CustomRevisionEntity) revisionEntity;
		User user = SecurityUtil.getCurrentUser();
		String userName = "";
		if (user == null)
			userName = "SYSTEM";
		entity.setUsername(userName);
	}

	@Override
	public void entityChanged(Class entityClass, String entityName,
			Serializable entityId, RevisionType revisionType,
			Object revisionEntity) {
		if (MasterDataConfig.contains(entityClass)) {// query receive
			this.syncMasterData(entityClass, entityName, entityId,
					revisionType, revisionEntity);
		}
	}

	private void syncMasterData(Class entityClass, String entityName,
			Serializable entityId, RevisionType revisionType,
			Object revisionEntity) {
		
		ReceiveRecord receiveRecord = MasterDataConfig.local.get();
		CustomRevisionEntity revision = (CustomRevisionEntity) revisionEntity;
		if (!this.isReceive(receiveRecord)) {
			SyncRecord record = new SyncRecord();
			record.setEntityId(entityId);
			record.setEntityName(entityName);
			record.setEntityClass(entityClass);
			record.setRevId(revision.getId());
			record.setType(MasterDataConfig.getDataType());
			record.setRevisionType(revisionType);
			if (receiveRecord == null) {
				record.setUpdateBy(MasterDataConfig.getSystemName());
			} else {
				record.setUpdateBy(receiveRecord.getSubscriber());
			}
			EntityService entityService = ServiceLocator
					.getService(EntityService.class);
			entityService.saveOrUpdate(record);
		}
	}

	/**
	 * slave system:if receive from master don't trigger sync task master
	 * sysntem:if receive from slave trigger sync task
	 * 
	 * @param entityName
	 * @param entityId
	 * @return
	 */
	private boolean isReceive(ReceiveRecord receiveRecord) {

		if (receiveRecord == null) {
			return false;
		} else {
			EntityService entityService = ServiceLocator
					.getService(EntityService.class);
			receiveRecord.setStatus(RecordStatus.FINISH);
			entityService.saveOrUpdate(receiveRecord);
			if (MasterDataType.MASTER.equals(MasterDataConfig.getDataType())) {
				return false;
			}
			return true;
		}
	}
}
