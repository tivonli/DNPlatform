package com.digitnexus.core.audit.mdm.dao;

import com.digitnexus.core.audit.mdm.domain.ReceiveRecord;
import com.digitnexus.core.audit.mdm.domain.RecordStatus;

public interface ISyncRecordDao {
	public ReceiveRecord getReceiveRecord(String entityName, String serverMasterId,RecordStatus status);
}
