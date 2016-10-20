/**
 * 
 */
package com.digitnexus.core.nosql.attachment.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeUtility;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;

/**
 * @author Santanu
 */
@Service
@Path("attachment")
public class AttachmentServiceImpl implements AttachmentService {
	@Autowired
	private AttachmentDao attachmentDao;
	@Autowired
	private UiConfiguration uiConfiguration;
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.service.AttachmentService#getAttachment(java.lang.String)
	 */
	@Override
	@GET @Path("{id}")
	public Response getAttachment(@PathParam("id") String attachmentId) {
		AttachmentObject attachment = attachmentDao.loadAttachment(attachmentId);
		String fileName = null;
		try {
			fileName = MimeUtility.encodeWord(attachment.getFileName(), "UTF-8", null);
		} catch (UnsupportedEncodingException ignore) {
			fileName = attachment.getFileName();
		}
		return Response
				.ok(attachment.getData(), attachment.getContentType())
				.header("content-disposition", "attachment; filename=" + fileName)
				.header("content-length", attachment.getLength())
				.build();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.service.AttachmentService#deleteAttachment(java.lang.String)
	 */
	@DELETE @Path("{id}")
	public void deleteAttachment(@PathParam("id") String attachmentId) {
		attachmentDao.delete(AttachmentObject.class, attachmentId);
	}
	
	@GET @Path("detail/{articleName}")
	@Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getAttachments(@PathParam("articleName") String articleName, @QueryParam("fieldName") String fieldName, @QueryParam("id") String id){
		EditViewMetaData editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		if (editViewMeta == null) {
			throw new NullPointerException("No edit view configured for " + articleName);
		}
		FieldMetaData idField = editViewMeta.getIdField();
		DataType dataType = DataType.valueOf(idField.getDataType());
		Object idObject = DataFormatUtil.parse(id, idField.getPropertyJavaType(), dataType);
		
		
		List<AttachmentObject> attachmentObjects = attachmentDao.findAttachments(articleName, fieldName, idObject);
		List<Map<String, String>> response=new ArrayList<Map<String,String>>(attachmentObjects.size());
		for(AttachmentObject attachmentObject:attachmentObjects){
			response.add(AttachmentResponseUtil.createAttachmentMetaMap(attachmentObject));
		}
		return JsonUtil.toJson(response);
	}
}
