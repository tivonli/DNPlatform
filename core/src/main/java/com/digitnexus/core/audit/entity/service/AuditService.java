package com.digitnexus.core.audit.entity.service;

import java.io.Serializable;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.audit.entity.dao.AuditDao;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;

/**
 * Rest service for audit data
 * @author adi
 *
 */
@Service
@Path("entity/audit/{articleName}/{id}")
@Produces(MediaType.APPLICATION_JSON)
public class AuditService {
	@Autowired
	private AuditDao auditDao;
	@Autowired
	private UiConfiguration uiConfiguration;
	
	@GET @Path("count")
	public long getRevisionCount(@PathParam("articleName") String articleName,@PathParam("id") String id){
		EditViewMetaData editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		//Convert id string to it's type
		FieldMetaData idField = editViewMeta.getIdField();
		DataType dataType = DataType.valueOf(idField.getDataType());
		Object idObject = DataFormatUtil.parse(id, idField.getPropertyJavaType(), dataType);
		return auditDao.getRevisionCount(editViewMeta.getEntityClass(), (Serializable) idObject);
		
	}
	
	
	

}
