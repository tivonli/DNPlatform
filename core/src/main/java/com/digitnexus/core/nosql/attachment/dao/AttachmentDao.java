/**
 * 
 */
package com.digitnexus.core.nosql.attachment.dao;

import java.util.List;

import com.digitnexus.core.nosql.dao.FileStoreDao;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.nosql.exception.NoFileFoundException;

/**
 * @author Santanu
 *
 */
public interface AttachmentDao extends FileStoreDao {
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public AttachmentObject getAttachment(Object id);
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public AttachmentObject loadAttachment(Object id) throws NoFileFoundException;
	
	/**
	 * 
	 * @param attachment
	 * @return 
	 */
	public Object store(AttachmentObject attachment);
	
	/**
	 * 
	 * @param attachment
	 */
	public void delete(AttachmentObject attachment);
	
	/**
	 * 
	 * @param articleName
	 * @param propertyName
	 * @param articleId
	 * @return
	 */
	public List<AttachmentObject> findAttachments(String articleName, String propertyName, Object articleId);
	
	/**
	 * 
	 * @param articleName
	 * @param propertyName
	 * @param articleId
	 * @return
	 */
	public int countAttachments(String articleName, String propertyName, Object articleId);
}
