/**
 * 
 */
package com.digitnexus.core.nosql.dao;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.acl.service.AclService;
import com.digitnexus.core.domain.UserOperation;

/**
 * @author Santanu
 *
 */
@Repository("baseNosqlDao")
public class BaseNosqlDaoImpl implements BaseNosqlDao {

	protected AclService aclService;
	protected MongoTemplate mongoTemplate;
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#get(java.lang.Class, java.lang.Object)
	 */
	@Override
	public <T> T get(Class<T> entityClass, Object id) {
		return mongoTemplate.findById(id, entityClass);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#getAll(java.lang.Class)
	 */
	@Override
	public <T> List<T> getAll(Class<T> entityClass) {
		return mongoTemplate.findAll(entityClass);
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#save(java.lang.Object)
	 */
	@Override
	public void save(Object entity) {
		mongoTemplate.save(entity);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#findAndUpdate(java.lang.String, java.lang.Object, java.lang.String, java.lang.Object, java.lang.Class)
	 */
	@Override
	public <T> T findAndUpdate(String selectKey, Object selectValue, String updateKey,
			Object updateValue, Class<T> entityClass) {
		//this method will be replaced with search criteria integration
		Query query=new Query();
		query.addCriteria(Criteria.where(selectKey).is(selectValue)); 
		mongoTemplate.findAndModify(query, Update.update(updateKey, updateValue), entityClass);
		return null;
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		mongoTemplate.remove(entity);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#findAndDelete(java.lang.String, java.lang.Object, java.lang.Class)
	 */
	@Override
	public <T> T findAndDelete(String selectKey, Object selectValue,Class<T> entityClass) {
		//this method will be replaced with search criteria integration
		Query query=new Query();
		query.addCriteria(Criteria.where(selectKey).is(selectValue)); 
		mongoTemplate.remove(query, entityClass);		
		return null;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.BaseNosqlDao#dropCollection(java.lang.Class)
	 */
	@Override
	public <T> void dropCollection(Class<T> entityClass) {
		mongoTemplate.dropCollection(entityClass);
	}
	
	/**
	 * 
	 * @param entityClass
	 * @param query
	 * @param firstResult
	 * @param maxResult
	 * @return
	 */
	protected <T> List<T> executeQuery(Class<T> entityClass, Query query, int firstResult, int maxResult) {
		if (firstResult >= 0 && maxResult >= 0) {
			query.skip(firstResult).limit(maxResult);
		}
		return mongoTemplate.find(query, entityClass);
	}

	protected <T> List<T> executeQuery(String secureResourceName, String primaryResourceName, UserOperation operation, 
			Class<T> entityClass, Query query, int firstResult, int maxResult) {
		applyAccessControl(secureResourceName, primaryResourceName, operation, query);
		if (firstResult >= 0 && maxResult >= 0) {
			query.skip(firstResult).limit(maxResult);
		}
		return mongoTemplate.find(query, entityClass);
	}
	
	protected <T> long count(Class<T> entityClass, Query query) {
		return mongoTemplate.count(query, entityClass);
	}
	
	protected <T> long count(String secureResourceName, String primaryResourceName, UserOperation operation,
			Class<T> entityClass, Query query) {
		applyAccessControl(secureResourceName, primaryResourceName, operation, query);
		return mongoTemplate.count(query, entityClass);
	}
	
	protected void applyAccessControl(String secureResourceName, String primaryResourceName, UserOperation operation, Query query) {
		aclService.applyAclExpression(secureResourceName, primaryResourceName, operation, query);
	}
	
	@SuppressWarnings("rawtypes")
	protected boolean isOperationAllowed(Class entityClass, String idFieldName, Serializable id, UserOperation operation) {
		Query query=new Query();
		query.addCriteria(Criteria.where(idFieldName).is(id));
		
		applyAccessControl(entityClass.getName(), entityClass.getName(), operation, query);
		
		//this query should return only one object, so the count should be either zero or one
		return mongoTemplate.count(query, entityClass) > 0;
	}
	
	/**
	 * @param mongoTemplate the mongoTemplate to set
	 */
	@Autowired
	public void setMongoTemplate(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	/**
	 * @param aclService the aclService to set
	 */
	@Autowired
	public void setAclService(AclService aclService) {
		this.aclService = aclService;
	}
}
