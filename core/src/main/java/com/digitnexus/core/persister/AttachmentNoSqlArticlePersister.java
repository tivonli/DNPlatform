/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class AttachmentNoSqlArticlePersister extends NoSqlArticlePersister {
	
	private final Logger logger=LoggerFactory.getLogger(getClass());

	private AttachmentDao attachmentDao;
	private UiConfiguration configuration;
	

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> void delete(Class<T> entityType, Serializable id) {
		super.delete(entityType, id);
		deleteAttachments(id, entityType.getName());
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		Object idObject = getIdentifier(entity);
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

	/**
	 * 
	 * @param entity
	 * @return
	 */
	private Object getIdentifier(Object entity) {
		//the process goes like this:
		//1. Look for org.springframework.data.annotation.Id annotation
		//2. Look for javax.persistence.Id annotation
		//3. See if there is a getId method
		try {
			Method idMethod = entity.getClass().getMethod("getId", new Class[]{});
			return idMethod.invoke(entity, new Object[]{});
		} catch (SecurityException e) {
			//Why care!! because we failed...
			logger.error(e.getMessage(),e);
		} catch (NoSuchMethodException e) {
			//fall back to some other logic, but there is no logic to fall back on
			logger.error(e.getMessage(),e);
		} catch (IllegalArgumentException e) {
			//no reason for this as well..so ignore
			logger.error(e.getMessage(),e);
		} catch (IllegalAccessException e) {
			//no reason for this as well..so ignore
			logger.error(e.getMessage(),e);
		} catch (InvocationTargetException e) {
			//why??
			logger.error(e.getMessage(),e);
		}
		return null;
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#persists(java.lang.Class)
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
	 * @see com.digitnexus.core.persister.ArticlePersister#getOrder()
	 */
	@Override
	public int getOrder() {
		return 20;
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
