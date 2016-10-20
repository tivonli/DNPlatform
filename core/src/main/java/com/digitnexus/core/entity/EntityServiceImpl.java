package com.digitnexus.core.entity;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.hibernate.proxy.HibernateProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.event.EventAPI;
import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.dao.BaseNosqlDao;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.persister.ArticlePersister;
import com.digitnexus.core.persister.ArticlePersisterFactory;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.dataobject.DataSourceType;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;

@Service
public class EntityServiceImpl implements EntityService {
	@Autowired
	private EventAPI	eventAPI;
	@Inject
	@Named("baseDao")
	private BaseDao		baseDao;
	@Inject @Named("baseNosqlDao")
	private BaseNosqlDao baseNosqlDao;
	@Autowired
	private Validator	validator;
	
	private AttachmentDao attachmentDao;
	//this will be changed to a different configuration holder
	//which is less like a configuration dedicated to UI
	private UiConfiguration uiConfiguration;
	
	@Autowired
	private EntityConfigurationService hibernateEntityConfigurationService;
	
	@Autowired
	private ArticlePersisterFactory articlePersisterFactory;
	
	@Override
	public <T> T get(Class<T> entityClass, Serializable id) {
		if (isDocumentStoreEntity(entityClass.getName())) {
			return baseNosqlDao.get(entityClass, id);
		} else {
			return baseDao.get(entityClass, id);
		}
	}

	@Override
	public <T> List<T> getAll(Class<T> entityClass) {
		if (isDocumentStoreEntity(entityClass.getName())) {
			return baseNosqlDao.getAll(entityClass);
		} else {
			return baseDao.getAll(entityClass);
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void delete(Object entity) {
		ValidateEvent validateEvent = new ValidateEvent(entity).setDelete(true);
		eventAPI.publishEvent(validateEvent);

		if (!validateEvent.isValid()) {
			EntityValidationException.throwEntityValidationException(validateEvent.getMessagesByField());
		}

		DeleteEvent entityEvent = new DeleteEvent(entity, validateEvent);
		
		Class entityClass = entity.getClass();
		if (entity instanceof HibernateProxy) {
			entityClass = ((HibernateProxy)entity).getHibernateLazyInitializer().getPersistentClass();
		}
		ArticlePersister  entityPersister = articlePersisterFactory.getEntityPersister(entityClass);
		entityPersister.delete(entity);
		
		eventAPI.publishEvent(entityEvent);
	}

	@Override
	public void saveOrUpdate(Object entity) {
		mergeOrSave(entity, false);
	}

	public void saveOrUpdate(Object entity, AttachmentObject attachment) {
		//this is done with assuming a new entity with an attachment 
		//or updated entity with an attachment may also come
		//if only an attachment is added then it might be useful for
		//raising event, incase we want to raise any event
		mergeOrSave(entity, false);
		//TODO : the parentArticleId for the attachment should be set to
		//attachment at this point
		attachmentDao.store(attachment);
	}
	
	@Override
	public void merge(Object entity) {
		mergeOrSave(entity, true);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void mergeOrSave(Object entity, boolean isMerge) {
		Class entityClass = entity.getClass();
		if (entity instanceof HibernateProxy) {
			entityClass = ((HibernateProxy)entity).getHibernateLazyInitializer().getPersistentClass();
		}
		ArticlePersister  entityPersister = articlePersisterFactory.getEntityPersister(entityClass);
		
		boolean	isNewObject = entityPersister.isTransient(entity);
		
		PreSaveEvent preSaveEvent = new PreSaveEvent(entity, isNewObject);
		eventAPI.publishEvent(preSaveEvent);
		
		//Do default validations
		Set<ConstraintViolation<Object>> constraintViolations=validator.validate(entity);
		
		//A field can contain multiple error messages
		SetMultimap<String, String> messagesByField=HashMultimap.create();
		
		for(ConstraintViolation<Object> constraintVoilation:constraintViolations){
			messagesByField.put(constraintVoilation.getPropertyPath().toString(), constraintVoilation.getMessage());
		}
		
        //ignore validation, not yet implemented
		ValidateEvent validateEvent = new ValidateEvent(entity, preSaveEvent,messagesByField).setNewObject(isNewObject);
		eventAPI.publishEvent(validateEvent);
		if (!validateEvent.isValid()) {
			EntityValidationException.throwEntityValidationException(messagesByField);
		}

		entityPersister.save(entity);
			
		PostSaveEvent postSaveEvent = new PostSaveEvent(entity, validateEvent, isNewObject);
		eventAPI.publishEvent(postSaveEvent);
	}

	public boolean isDocumentStoreEntity(Object entity) {
		String entityName = null;
		if (entity instanceof HibernateProxy) {
			entityName = ((HibernateProxy)entity).getHibernateLazyInitializer().getEntityName();
		} else {
			entityName = entity.getClass().getName();
		}
		// not all the nosql domain object is in the list view.
		@SuppressWarnings("deprecation")
		EditViewMetaData editViewMetaData = uiConfiguration.getRawEditViewMeta(entityName);
		if (editViewMetaData != null) {
			return DataSourceType.DOCUMENT.equals(editViewMetaData.getDataSourceType());
		}
		// if not a hibernate entity , it must be the nosql entity
		return hibernateEntityConfigurationService.getPersistentClassByEntityTypeName(entityName)==null;
	}
	
	private boolean isDocumentStoreEntity(String entityName) {
		@SuppressWarnings("deprecation")
		EditViewMetaData editViewMetaData = uiConfiguration.getRawEditViewMeta(entityName);
		if (editViewMetaData != null) {
			return DataSourceType.DOCUMENT.equals(editViewMetaData.getDataSourceType());
		}
		
		return false;
	}
	
	/**
	 * @param attachmentDao the attachmentDao to set
	 */
	@Autowired
	public void setAttachmentDao(AttachmentDao attachmentDao) {
		this.attachmentDao = attachmentDao;
	}

	/**
	 * @param uiConfiguration the uiConfiguration to set
	 */
	@Autowired
	public void setUiConfiguration(UiConfiguration uiConfiguration) {
		this.uiConfiguration = uiConfiguration;
	}
}
