/**
 * 
 */
package com.digitnexus.core.persister;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.stereotype.Component;

/**
 * 
 * @author Santanu
 */
@Component
public class ArticlePersisterFactory {
	private Set<ArticlePersister> defaultPersisters = new TreeSet<ArticlePersister>(new EntityPersisterComparator());
	@SuppressWarnings("rawtypes")
	private Map<Class, ArticlePersister> entityPersisterMapping = new HashMap<Class, ArticlePersister>();
	@SuppressWarnings("rawtypes")
	private Map<Class, UiOperationArticlePersister> uiOperationEntityPersisterMapping = new HashMap<Class, UiOperationArticlePersister>();
	
	/**
	 * Orders persister based on the order specified
	 * @author Santanu
	 */
	private class EntityPersisterComparator implements Comparator<ArticlePersister> {
		/*
		 * (non-Javadoc)
		 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
		 */
		@Override
		public int compare(ArticlePersister o1, ArticlePersister o2) {
			return Integer.valueOf(o1.getOrder()).compareTo(o2.getOrder());
		}
		
	}
	
	/**
	 * Gets the {@link ArticlePersister} for the entity type passed
	 * @param entityType
	 * @return
	 */
	public <T> ArticlePersister getEntityPersister(Class<T> entityType) {
		ArticlePersister persister = entityPersisterMapping.get(entityType);
		if (persister == null) {
			mapEntityPersister(entityType);
			persister = entityPersisterMapping.get(entityType);
		}
		return persister;
	}
	
	/**
	 * Gets the {@link UiOperationArticlePersister} for the entity type passed
	 * 
	 * @param entityType
	 * @return
	 */
	public <T> UiOperationArticlePersister getUiOperationEntityPersister(Class<T> entityType) {
		UiOperationArticlePersister persister = uiOperationEntityPersisterMapping.get(entityType);
		if (persister == null) {
			mapUiOperationEntityPersister(entityType);
			persister = uiOperationEntityPersisterMapping.get(entityType);
		}
		return persister;
	}
	
	private synchronized <T> void mapEntityPersister(Class<T> entityType) {
		if (!entityPersisterMapping.containsKey(entityType)) {
			for (ArticlePersister defaultPersister:defaultPersisters) {
				if (defaultPersister.persists(entityType)) {
					entityPersisterMapping.put(entityType, defaultPersister);
					return;
				}
			}
		}
	}
	
	private synchronized <T> void mapUiOperationEntityPersister(Class<T> entityType) {
		if (!entityPersisterMapping.containsKey(entityType)) {
			for (ArticlePersister defaultPersister:defaultPersisters) {
				if ((defaultPersister instanceof UiOperationArticlePersister) && defaultPersister.persists(entityType)) {
					uiOperationEntityPersisterMapping.put(entityType, 
							(UiOperationArticlePersister) defaultPersister);
					return;
				}
			}
		}
	}
	
	/**
	 * Registers a default persister. Not typically used beyond the purview of the platform
	 * @param defaultPersister
	 */
	public void registerDefaultPersister(ArticlePersister defaultPersister) {
		defaultPersisters.add(defaultPersister);
	}
	
	/**
	 * Registers a class-specific entity persister
	 * 
	 * @param entityType the class for which the entity persister to be registered
	 * @param persister the entity persister to be registered
	 */
	public <T> void registerPersister(Class<T> entityType, ArticlePersister persister) {
		entityPersisterMapping.put(entityType, persister);
		if (persister instanceof UiOperationArticlePersister) {
			uiOperationEntityPersisterMapping.put(entityType, (UiOperationArticlePersister) persister);
		}
	}
}
