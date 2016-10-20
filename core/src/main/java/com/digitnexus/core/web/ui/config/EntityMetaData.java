/**
 * 
 */
package com.digitnexus.core.web.ui.config;

import org.apache.commons.lang.StringUtils;
import org.hibernate.metadata.ClassMetadata;
import org.springframework.data.mongodb.core.mapping.BasicMongoPersistentEntity;

import com.digitnexus.core.web.ui.config.dataobject.DataSourceType;

/**
 * @author Santanu
 *
 */
class EntityMetaData {
	
	private String entityName;
	@SuppressWarnings("rawtypes")
	private Class entityClass;
	private String identifierPropertyName;
	@SuppressWarnings("rawtypes")
	private Class identifierPropertyType;
	private DataSourceType dataSourceType;
	
	/**
	 * @param hibernateClassMetaData
	 */
	EntityMetaData(ClassMetadata hibernateClassMetaData) {
		entityName = hibernateClassMetaData.getEntityName();
		entityClass = hibernateClassMetaData.getMappedClass();
		identifierPropertyName = hibernateClassMetaData.getIdentifierPropertyName();
		if (StringUtils.isNotBlank(identifierPropertyName)) {
			identifierPropertyType = hibernateClassMetaData.getIdentifierType().getReturnedClass();
		}
		this.dataSourceType = DataSourceType.RELATIONAL;
	}
	
	/**
	 * @param mongoPersistentEntity
	 */
	@SuppressWarnings("rawtypes")
	EntityMetaData(BasicMongoPersistentEntity mongoPersistentEntity) {
		entityName = mongoPersistentEntity.getName();
		entityClass = mongoPersistentEntity.getType();
		if (mongoPersistentEntity.getIdProperty() != null) {
			identifierPropertyName = mongoPersistentEntity.getIdProperty().getName();
			identifierPropertyType = mongoPersistentEntity.getIdProperty().getRawType();
		}
		this.dataSourceType = DataSourceType.DOCUMENT;
	}

	/**
	 * @return the entityName
	 */
	public String getEntityName() {
		return entityName;
	}

	/**
	 * @return the entityClass
	 */
	@SuppressWarnings("unchecked")
	public <T> Class<T> getEntityClass() {
		return entityClass;
	}

	/**
	 * @return the identifierPropertyName
	 */
	public String getIdentifierPropertyName() {
		return identifierPropertyName;
	}

	/**
	 * @return the identifierPropertyType
	 */
	@SuppressWarnings("rawtypes")
	public Class getIdentifierPropertyType() {
		return identifierPropertyType;
	}

	/**
	 * @return the dataSourceType
	 */
	public DataSourceType getDataSourceType() {
		return dataSourceType;
	}
}
