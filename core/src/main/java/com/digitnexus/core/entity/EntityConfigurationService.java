package com.digitnexus.core.entity;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.hibernate.mapping.ToOne;
import org.hibernate.mapping.UniqueKey;
import org.hibernate.mapping.Value;
import org.hibernate.type.SingleColumnType;
import org.hibernate.type.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;
import com.google.common.collect.Multimaps;

/**
 * Service which provides all the configuration information related to a entity.
 * This service was written without complete knowledge of hibernate
 * configuration so it may be buggy.
 * 
 * @author adi
 * 
 */
@Service
public class EntityConfigurationService {
	@Autowired
	private Configuration								configuration;

	private Map<String, PersistentClass>				entityNameVsType						= new ConcurrentHashMap<String, PersistentClass>();
	// if entityTypeNameVsType change to ConcurrentHashMap, application will start fail with NullPointerException, unknow why
	private Map<String, PersistentClass>				entityTypeNameVsType					= new HashMap<String, PersistentClass>();
	private ListMultimap<String, Set<String>>			unSafeEntityNameVsUniqueProperties			= ArrayListMultimap.create();
	private ListMultimap<String, Set<String>>	entityNameVsUniqueProperties  = Multimaps.synchronizedListMultimap(unSafeEntityNameVsUniqueProperties);
	private Map<String, Map<String, PersistentClass>>	entityNameVsAssocitionPersistenClasses	= new ConcurrentHashMap<String, Map<String, PersistentClass>>();

	public Class<?> getClassByEntityName(String entityName) {
		PersistentClass persistentClass = getEntityNameVsType().get(entityName);
		return persistentClass != null ? persistentClass.getMappedClass() : null;
	}

	public PersistentClass getPersistentClassByEntityName(String entityName) {
		return getEntityNameVsType().get(entityName);
	}

	public PersistentClass getPersistentClassByEntityTypeName(String entityTypeName) {
		if (entityTypeNameVsType.isEmpty()) {
			// Initiate entityNameVsType map
			Iterator<PersistentClass> classes = configuration.getClassMappings();
			while (classes.hasNext()) {
				PersistentClass persistentClass = classes.next();
				entityTypeNameVsType.put(persistentClass.getClassName(), persistentClass);
			}
		}
		return entityTypeNameVsType.get(entityTypeName);
	}

	private Map<String, PersistentClass> getEntityNameVsType() {
		if (entityNameVsType.isEmpty()) {
//			synchronized (entityNameVsType) {  // no need, use ConcurrentHashMap to replace HashMap
				//while waiting for the lock the map might have been populated
				if (entityNameVsType.isEmpty()) {
					// Initiate entityNameVsType map
					Iterator<PersistentClass> classes = configuration.getClassMappings();
					while (classes.hasNext()) {
						PersistentClass persistentClass = classes.next();
						entityNameVsType.put(persistentClass.getNodeName(), persistentClass);
						loadAssocationConfiguration(persistentClass);
					}
				}
//			}
		}
		return entityNameVsType;
	}

	@SuppressWarnings("unchecked")
	private void loadAssocationConfiguration(PersistentClass persistentClass) {
		Iterator<Property> propertyIterator=persistentClass.getPropertyIterator();
		Map<String,PersistentClass> propertyNameVsPersistentClass=new HashMap<String, PersistentClass>();
		while(propertyIterator.hasNext()){
			Property property=propertyIterator.next();
				Value value = property.getValue();
				// Only one to one and many to one
				if (value instanceof ToOne) {
					ToOne toOneValue = (ToOne) value;
					String typeName = toOneValue.getTypeName();
					propertyNameVsPersistentClass.put(property.getNodeName(), getPersistentClassByEntityTypeName(typeName));
				}
		}
		
		if(!propertyNameVsPersistentClass.isEmpty()){
			entityNameVsAssocitionPersistenClasses.put(persistentClass.getNodeName(), propertyNameVsPersistentClass);
		}
	}
	
	@SuppressWarnings("unchecked")
	public Map<String,PersistentClass> getAssociationPerssitentClasess(String entityName){
		Map<String, PersistentClass> assocationPropertyVsPersistentClasses=entityNameVsAssocitionPersistenClasses.get(entityName);
		return (Map<String, PersistentClass>) (assocationPropertyVsPersistentClasses!=null?assocationPropertyVsPersistentClasses:Collections.emptyMap());
	}

	@SuppressWarnings("rawtypes")
	public Serializable getIdentifier(String entityName, String idString) {
		PersistentClass persistentClass = getEntityNameVsType().get(entityName);
		if (persistentClass != null) {
			// TODO:This is hack. Need to use hibernate types instead of using
			// 'toString'
			Type type = persistentClass.getIdentifier().getType();
			if (type instanceof SingleColumnType) {
				return (Serializable) ((SingleColumnType) type).fromStringValue(idString);
			}
		}

		return null;
	}

	@SuppressWarnings("unchecked")
	public List<Set<String>> getUniquePropertyNames(String resourceName) {
		List<Set<String>> uniqueProperties = entityNameVsUniqueProperties.get(resourceName);
		if ((uniqueProperties == null || uniqueProperties.isEmpty()) && !entityNameVsUniqueProperties.containsKey(resourceName)) {
			// Fetch unique properties
			PersistentClass persistentClass = getPersistentClassByEntityName(resourceName);

			Iterator<UniqueKey> uniqueKeysIterator = persistentClass.getTable().getUniqueKeyIterator();

			while (uniqueKeysIterator.hasNext()) {
				UniqueKey uniqueKey = uniqueKeysIterator.next();
				Set<String> uniqueKeyProperties = new HashSet<String>();

				for (Column column : (List<Column>) uniqueKey.getColumns()) {
					Iterator<Property> propertiesIterator = persistentClass.getPropertyIterator();
					while (propertiesIterator.hasNext()) {
						Property mappedProperty = propertiesIterator.next();
						if (mappedProperty.getColumnSpan() != 1) {
							// TODO:Can not handle this now. Ignore this for
							// now. If this is part of unique key, we can find
							// it in the end
							continue;
						}

						Column mappedColumn = (Column) mappedProperty.getColumnIterator().next();

						// Add name of the property
						if (column.equals(mappedColumn)) {
							uniqueKeyProperties.add(mappedProperty.getName());
						}
					}
				}

				// Check if we did not find matching property names and then
				// insert in map
				if (uniqueKey.getColumns().size() == uniqueKeyProperties.size()) {
					entityNameVsUniqueProperties.put(resourceName, uniqueKeyProperties);
				}
			}

			if (entityNameVsUniqueProperties.get(resourceName).isEmpty()) {
				// Insert null indicating there are no unique keys for this
				// class so that we do not need
				// to check this in next call
				entityNameVsUniqueProperties.put(resourceName, null);
			}

		}

		if (uniqueProperties != null && !uniqueProperties.isEmpty() && uniqueProperties.get(0) == null) {
			return Collections.emptyList();
		}

		return uniqueProperties;

	}

	public String getIdentifierPropertyName(String entityName) {
		PersistentClass persistentClass = getEntityNameVsType().get(entityName);
		if (persistentClass != null) {
			return persistentClass.getIdentifierProperty().getName();
		}
		return null;
	}

}
