package com.digitnexus.core.nosql.attachment.service;

import javax.ws.rs.core.Response;

/**
 * 
 * @author Santanu
 */
public interface AttachmentService {

	/**
	 * 
	 * @param attachmentId
	 * @return
	 */
	public abstract Response getAttachment(String attachmentId);
	
	/**
	 * 
	 * @param attachmentId
	 */
	public void deleteAttachment(String attachmentId);
    
	/**
	 * 
	 * @param articleName
	 * @param fieldName
	 * @param id
	 * @return
	 */
	public String getAttachments(String articleName, String fieldName, String id);
}