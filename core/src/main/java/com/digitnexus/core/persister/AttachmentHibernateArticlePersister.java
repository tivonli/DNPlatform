/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;

/**
 * @author Santanu
 */
@Repository
public class AttachmentHibernateArticlePersister extends HibernateArticlePersister {

	private AttachmentDao attachmentDao;
	private UiConfiguration configuration;
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.HibernateArticlePersister#delete(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> void delete(Class<T> entityType, Serializable id) {
		super.delete(entityType, id);
		deleteAttachments(id, entityType.getName());
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.HibernateArticlePersister#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		Object idObject = getBaseDao().getIdentifier(entity);
		super.delete(entity);
		//TODO: This has to be done in afterCommit
		String articleName = entity.getClass().getName();
		deleteAttachments(idObject, articleName);
	}

	/**
	 * @param idObject
	 * @param articleName
	 */
	private void deleteAttachments(Object idObject, String articleName) {
		EditViewMetaData editViewMetaData = configuration.getEditViewMeta(articleName);
		List<FieldMetaData> fields = editViewMetaData.getFields();
		for (FieldMetaData field:fields) {
			if (field.isAttachment()) {
				List<AttachmentObject> attachmentObjects = attachmentDao.findAttachments(articleName, field.getName(), idObject);
				for (AttachmentObject attachmentObject:attachmentObjects) {
					attachmentDao.delete(attachmentObject);
				}
			}
		}
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.HibernateArticlePersister#persists(java.lang.Class)
	 */
	@Override
	public <T> boolean persists(Class<T> entityType) {
		if (super.persists(entityType)) {
			EditViewMetaData editViewMetaData = configuration.getEditViewMeta(entityType.getName());
			if (editViewMetaData != null) {
				List<FieldMetaData> fields = editViewMetaData.getFields();
				for (FieldMetaData field:fields) {
					if (field.isAttachment()) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.HibernateArticlePersister#getOrder()
	 */
	@Override
	public int getOrder() {
		return -10;
	}

	/**
	 * @param attachmentDao the attachmentDao to set
	 */
	@Autowired
	public void setAttachmentDao(AttachmentDao attachmentDao) {
		this.attachmentDao = attachmentDao;
	}

	/**
	 * @param configuration the configuration to set
	 */
	@Autowired
	public void setConfiguration(UiConfiguration configuration) {
		this.configuration = configuration;
	}
}
