/**
 * 
 */
package com.digitnexus.core.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.NonUniqueResultException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.internal.SessionImpl;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.persister.entity.EntityPersister;
import org.hibernate.proxy.HibernateProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.security.annotation.CreateEditEntityPermission;
import com.digitnexus.core.security.annotation.CreatePermission;
import com.digitnexus.core.security.annotation.DeletePermission;
import com.digitnexus.core.security.annotation.EditPermission;
import com.digitnexus.core.security.annotation.ReadPermission;
import com.digitnexus.core.security.annotation.SecuredResource;

/**
 * @author adi This interface
 */
@Repository("baseDao") 
public class BaseDaoImpl implements BaseDao {
	
	private final Logger logger=LoggerFactory.getLogger(getClass());
	
	@Autowired
	private SessionFactory sessionFactory;

	
	@SuppressWarnings("unchecked")
	@Override
	@ReadPermission
	public <T> T get(@SecuredResource Class<T> entityClass, Serializable id) throws DataAccessException {
		return (T) getSession().get(entityClass, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	@ReadPermission
	public <T> T load(@SecuredResource Class<T> entityClass, Serializable id) throws DataAccessException {
		return (T) getSession().load(entityClass, id);
	}

	

	@SuppressWarnings("unchecked")
	@Override
	@ReadPermission
	public <T> List<T> loadAll(@SecuredResource Class<T> entityClass) throws DataAccessException {
		return getSession().createCriteria(entityClass).setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY).list();
	}

	@Override
	@CreatePermission
	public Serializable save(@SecuredResource  Object entity) throws DataAccessException {
		return getSession().save(entity);
	}

	@Override
	@EditPermission
	public void update(@SecuredResource  Object entity) throws DataAccessException {
		getSession().update(entity);

	}

	@Override
	@CreateEditEntityPermission
	public void saveOrUpdate(@SecuredResource  Object entity) throws DataAccessException {
		getSession().saveOrUpdate(entity);

	}
	
	@Override
	public void saveOrUpdateAll(Collection<?> entities) throws DataAccessException {
		Session session=getSession();
		for (Object entity : entities) {
			session.saveOrUpdate(entity);
		}
	}

	@Override
	@DeletePermission
	public void delete(@SecuredResource  Object entity) throws DataAccessException {
		getSession().delete(entity);

	}

	@SuppressWarnings("rawtypes")
	@Override
	public void deleteAll(Collection entities) throws DataAccessException {
		Session session=getSession();
		for(Object entity:entities){
			session.delete(entity);
		}
	}

	@Override
	public Object findUnique(String queryString) throws NonUniqueResultException {
		return getSession().createQuery(queryString).uniqueResult();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findUnique(java.lang.String, java.lang.Object[])
	 */
	@SuppressWarnings("unchecked")
	public <T> T findUnique(String queryString, Object... values) throws NonUniqueResultException {
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return (T) query.uniqueResult();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findUniqueByNamedParameter(java.lang.String, java.lang.String[], java.lang.Object[])
	 */
	@SuppressWarnings("unchecked")
	public <T> T findUniqueByNamedParameter(String queryString, String[] parameterNames, Object[] parameters) throws NonUniqueResultException {
		Query query = getSession().createQuery(queryString);
		if (parameterNames != null) {
			Map<String, Object> properties = new HashMap<String, Object>();
			for (int i = 0; i < parameterNames.length; i++) {
				properties.put(parameterNames[i], parameters[i]);
			}
			query.setProperties(properties);
		}
		return (T) query.uniqueResult();
	}
	
	@SuppressWarnings("rawtypes")
	public List find(String queryString) throws DataAccessException {
		return find(queryString, (Object[]) null);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#find(java.lang.String, int, int)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> find(String queryString, int firstResult, int maxResults) throws DataAccessException {
		Query query = getSession().createQuery(queryString);
		if (firstResult >= 0) {
			query.setFirstResult(firstResult);
		}
		if (maxResults > 0) {
			query.setMaxResults(maxResults);
		}
		return query.list();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#find(java.lang.String, java.lang.Object[])
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> find(String queryString, Object... values) throws DataAccessException {
		Query queryObject = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject.list();
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findByNamedParameters(java.lang.String, java.lang.String[], java.lang.Object[])
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> findByNamedParameters(String queryString, String[] parameterNames, Object[] parameters)
			throws DataAccessException {
		Query queryObject = getSession().createQuery(queryString);
		if (parameterNames != null) {
			Map<String, Object> properties = new HashMap<String, Object>();
			for (int i = 0; i < parameterNames.length; i++) {
				properties.put(parameterNames[i], parameters[i]);
			}
			queryObject.setProperties(properties);
		}
		return queryObject.list();
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findUniqueByNamedQuery(java.lang.String, java.lang.Object[])
	 */
	@Override
	public Object findUniqueByNamedQuery(String queryName, Object... values) throws DataAccessException {
		Query queryObject = getNamedQuery(queryName);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject.uniqueResult();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findUniqueByNamedQuery(java.lang.String, java.lang.String[], java.lang.Object[])
	 */
	public Object findUniqueByNamedQuery(String queryName, String[] paramNames, Object[] params) throws DataAccessException {
		Query queryObject = getNamedQuery(queryName);
		if (paramNames != null) {
			for (int i = 0; i < paramNames.length; i++) {
				queryObject.setParameter(paramNames[i], params[i]);
			}
		}
		return queryObject.uniqueResult();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findByNamedQuery(java.lang.String, java.lang.Object[])
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public List findByNamedQuery(String queryName, Object... values) throws DataAccessException {
		Query queryObject = getNamedQuery(queryName);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				queryObject.setParameter(i, values[i]);
			}
		}
		return queryObject.list();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#findByNamedQuery(java.lang.String, java.lang.String[], java.lang.Object[])
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public List findByNamedQuery(String queryName, String[] paramNames, Object[] params) throws DataAccessException {
		Query queryObject = getNamedQuery(queryName);
		if (paramNames != null) {
			for (int i = 0; i < paramNames.length; i++) {
				queryObject.setParameter(paramNames[i], params[i]);
			}
		}
		return queryObject.list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	@ReadPermission
	public <T> List<T> getAll(@SecuredResource Class<T> c) {
		return (List<T>)find("from "+c.getName());
	}
	
	protected Query createQuery(String query){
		return getSession().createQuery(query);
	}
	
	protected Query createCachableQuery(String query){
		return createQuery(query).setCacheable(true);
	}
	
	

	/**
	 * get the object DetachedCriteria to do some select operation
	 * @param c  pojo class 
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public DetachedCriteria getDetachedCriteria(Class c){
		return DetachedCriteria.forClass(c);
	}
	
	/**
	 * once you prepare for the select condition , you can use this function to do select.
	 * @param detachedCriteria
	 * @param c pojo class
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> findByCriteria(DetachedCriteria detachedCriteria){
		return detachedCriteria.getExecutableCriteria(getSession()).list();
	}
	
	/**
	 * once you prepare for the select condition , you can use this function to do select.
	 * @param detachedCriteria
	 * @param c
	 * @param firstResult the beginning row number
	 * @param maxResults the number of result you want
	 * @return a limit number result that you want
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> findByCriteria(DetachedCriteria detachedCriteria,int firstResult,int maxResults){
		Criteria executableCriteria=detachedCriteria.getExecutableCriteria(getSession());
		if (firstResult >= 0) {
			executableCriteria.setFirstResult(firstResult);
		}
		if (maxResults > 0) {
			executableCriteria.setMaxResults(maxResults);
		}
		return executableCriteria.list();
	}
	
	@Override
	public boolean isTransient(Object entity) {
		if(entity instanceof DataObject){
			return ((DataObject)entity).isTransient();
		}
		
		SessionImpl session = (SessionImpl) getSession();
		Boolean isTransient = session.getEntityPersister(null, entity).isTransient(entity, session);
		return isTransient == null ? true : isTransient;
	}
	
	protected Query getNamedQuery(String queryName){
		return getSession().getNamedQuery(queryName);
	}
	
	protected Query getCachedNamedQuery(String queryName){
		return getSession().getNamedQuery(queryName).setCacheable(true);
	}
	
	protected SQLQuery getSQLQuery(String queryString){
		return getSession().createSQLQuery(queryString);
	}

	@Override
	public void merge(Object entity) throws DataAccessException {
		getSession().merge(entity);
	}
	

	/*
	 * (non-Javadoc)
	 * @see org.digitnexus.core.dao.BaseDao#flush()
	 */
	@Override
	public void flush() {
		getSession().flush();
	}

	/**
	 * 
	 * @param entityClass
	 * @return {@link Criteria} object for the entity class
	 */
	protected Criteria createCriteria(@SuppressWarnings("rawtypes") Class entityClass) {
		return getSession().createCriteria(entityClass);
	}
	
	/**
	 * 
	 * @param entityClassName
	 * @return {@link Criteria} object for the entity name
	 */
	protected Criteria createCriteria(String entityClassName) {
		return getSession().createCriteria(entityClassName);
	}
	
	/**
	 * once you prepare for the select condition , you can use this function to do select.
	 * @param criteria
	 * @param c
	 * @param firstResult the beginning row number
	 * @param maxResults the number of result you want
	 * @return a limit number result that you want
	 */
	@SuppressWarnings("unchecked")
	protected <T> List<T> findByCriteria(Criteria criteria, int firstResult, int maxResults){
		return criteria.setFirstResult(firstResult).setMaxResults(maxResults).list();
	}
    
	/**
	 * Do the select with the passed criteria
	 * @param criteria
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected <T> List<T> findByCriteria(Criteria criteria){
		return criteria.list();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#evict(java.lang.Object)
	 */
	@Override
	public void evict(Object entity) {
		getSession().evict(entity);
	}
	
	@Override
	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#getEntityName(java.lang.Object)
	 */
	@Override
	public String getEntityName(Object entity) {
		//for proxy get the entity name from the lazy initializer
		if ( entity instanceof HibernateProxy ) {
			return ((HibernateProxy)entity).getHibernateLazyInitializer().getEntityName();
		}
		
		ClassMetadata classMetadata=sessionFactory.getClassMetadata(entity.getClass());
		if(classMetadata==null){
			throw new IllegalArgumentException(entity.getClass().getName()+" is not Hibernate entity");
		}
		//else its a regular call to the session factory
		return classMetadata.getEntityName();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#getIdentifier(java.lang.Object)
	 */
	@Override
	public Serializable getIdentifier(Object entity) {
		//ensure its not a proxy, else we might get into trouble
		if ( entity instanceof HibernateProxy ) {
			entity = ((HibernateProxy)entity).getHibernateLazyInitializer().getImplementation();
		}
		SessionImplementor sessionImpl = (SessionImplementor)getSession();
		// let the persister inspect the instance to decide
		EntityPersister persister = sessionImpl.getEntityPersister(null, entity);
		try {
			return persister.getIdentifier(entity, sessionImpl);
		} catch (HibernateException e) {
			//we might end up here if there is no id property
			logger.error(e.getMessage(),e);
			return null;
		}
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.dao.BaseDao#hydrate(java.lang.Object)
	 */
	@Override
	public Object hydrate(Object entity) {
		if ( entity instanceof HibernateProxy ) {
			entity = ((HibernateProxy)entity).getHibernateLazyInitializer().getImplementation();
		}
		return entity;
	}
}
