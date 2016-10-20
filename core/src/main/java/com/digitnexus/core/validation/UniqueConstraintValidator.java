package com.digitnexus.core.validation;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.beanutils.PropertyUtils;
import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.proxy.HibernateProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.entity.EntityConfigurationService;
import com.digitnexus.core.entity.ValidateEvent;
import com.digitnexus.core.entity.listener.EntityValidateListener;
import com.digitnexus.core.exception.DigitNexusRuntimeException;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;

@Service
public class UniqueConstraintValidator implements EntityValidateListener<DataObject> {
	private final Logger				logger	= LoggerFactory.getLogger(getClass());

	@Autowired
	private EntityConfigurationService	entityConfigurationService;
	@Inject
	@Named("baseDao")
	private BaseDao						baseDao;
	@Autowired
	private UiConfiguration				uiConfiguration;

	@Override
	public void onApplicationEvent(ValidateEvent<DataObject> event) {
		Object entity = event.getEntity();
		//'entityName' is complete qualified name of class
		String entityName = baseDao.getEntityName(entity);
		Map<String, FieldMetaData> fieldMetaDataByName = null;
        
		//Hibernate stores name of name given in Entity annotation in as nodeName. The attributes names are confusing
		String nodeName=entityConfigurationService.getPersistentClassByEntityTypeName(entityName).getNodeName();
		List<Set<String>> uniquePropertyNames = entityConfigurationService.getUniquePropertyNames(nodeName);
		for (Set<String> uniqueProperties : uniquePropertyNames) {
			Object existingEntity = findExistingEntity(entity, entityName, uniqueProperties);
			if (existingEntity != null) {

				if (!event.isNewObject() && areSameObjects(entity, existingEntity)) {
					return;
				}

				if (uniqueProperties.size() == 1) {				
					event.addMessage(uniqueProperties.iterator().next(), I18NUtil.getMessage(entity.getClass().getName()+"."+uniqueProperties.iterator().next())+I18NUtil.getMessage("error.uniqueField"));
				} else {
					//Retrieve field names to display message
					EditViewMetaData editViewMetaData = uiConfiguration.getEditViewMeta(entityName);
					if (fieldMetaDataByName == null) {
						fieldMetaDataByName = new HashMap<String, FieldMetaData>();
						for (FieldMetaData fieldMetaData : editViewMetaData.getFields()) {
							fieldMetaDataByName.put(fieldMetaData.getName(), fieldMetaData);
						}
					}

					StringBuilder uniqueFieldNames = new StringBuilder();
					for (String uniqueProperty : uniqueProperties) {
						uniqueFieldNames.append(fieldMetaDataByName.get(uniqueProperty).getDisplayName()).append(',');
					}

					//Delete last ','
					uniqueFieldNames.charAt(uniqueFieldNames.length());

					event.addMessage(I18NUtil.getMessage("error.uniqueFields", new Object[] { uniqueFieldNames.toString() }));
				}

			}

		}

	}

	private boolean areSameObjects(Object entity, Object existingEntity) {
		@SuppressWarnings("rawtypes")
		Class entityClass = entity.getClass();
		if (entity instanceof HibernateProxy) {
			entityClass = ((HibernateProxy)entity).getHibernateLazyInitializer().getPersistentClass();
		}
		//Check if object we found is same as entity we are validating
		String nodeName=entityConfigurationService.getPersistentClassByEntityTypeName(entityClass.getName()).getNodeName();
		String identifierPropertyName = entityConfigurationService.getIdentifierPropertyName(nodeName);
		try {
			return PropertyUtils.getProperty(entity, identifierPropertyName).equals(
					PropertyUtils.getProperty(existingEntity, identifierPropertyName));

		} catch (IllegalAccessException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		} catch (NoSuchMethodException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		}
		return false;
	}

	private Object findExistingEntity(Object entity, String entityName, Set<String> uniqueProperties) {
		DetachedCriteria detachedCriteria = DetachedCriteria.forEntityName(entityName);
		try {
			for (String uniqueProperty : uniqueProperties) {

				detachedCriteria.add(Restrictions.eq(uniqueProperty,PropertyUtils.getProperty(entity, uniqueProperty)));

			}

		} catch (IllegalAccessException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		} catch (NoSuchMethodException e) {
			logger.error(e.getMessage(), e);
			DigitNexusRuntimeException.throwException(e);
		}

		//Hibernate flushing entity which is causing unique constraint exception, this is a hack and is temporary
		Session session = baseDao.getSession();
		FlushMode flushMode = session.getFlushMode();
		session.setFlushMode(FlushMode.MANUAL);
		Object existingEntity = null;

		try {
			List<?> existingEntities = baseDao.findByCriteria(detachedCriteria, -1, -1);
			if (!existingEntities.isEmpty()) {
				existingEntity = existingEntities.get(0);
			}
		} finally {
			session.setFlushMode(flushMode);
		}

		return existingEntity;
	}

}
