/**
 * 
 */
package com.digitnexus.core.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.hibernate.NonUniqueResultException;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.hibernate3.HibernateOperations;

/**
 * @author adi
 * Base Dao interface that all the dao interfaces must extend.
 * It contains some of the methods from {@link HibernateOperations}. 
 * Unit tests are must for methods which are not from HibernateOperations.
 * There are some methods from HibernateOperation which are not exposed through this interface. Most of those methods(for example 'find')
 * are expected to be invoked only from sub classes of BaseDaoImpl.
 */
public interface BaseDao{
	
    /**Methods from {@link HibernateOperations} */ 
	<T> T get(Class<T> entityClass, Serializable id) throws DataAccessException;
	
	
	<T> T load(Class<T> entityClass, Serializable id) throws DataAccessException;
	
	
	<T>List<T> loadAll(Class<T> entityClass) throws DataAccessException;
	
	Serializable save(Object entity) throws DataAccessException;
	
	void update(Object entity) throws DataAccessException;
	
	void saveOrUpdate(Object entity) throws DataAccessException;
	
	void saveOrUpdateAll(Collection<?> entities) throws DataAccessException;
	
	void merge(Object entity) throws DataAccessException;
	
	void delete(Object entity) throws DataAccessException;
	
	@SuppressWarnings("rawtypes")
	void deleteAll(Collection entities) throws DataAccessException;
		
	/**End of methods from {@link HibernateOperations} */ 
	public <T> List<T> getAll(Class<T> c);
	
	/**
	 * Is this a new transient instance? Returns true if the object is new
	 */
	public boolean isTransient(Object entity);
	
	public <T> List<T> findByCriteria(DetachedCriteria detachedCriteria,int firstResult,int maxResults);
	
	public <T> List<T> findByCriteria(DetachedCriteria detachedCriteria);
	
	/**
	 * Finds a single object using the query.
	 * @param queryString
	 * @return
	 * @throws NonUniqueResultException if the number of results are more than one
	 */
	public Object findUnique(String queryString) throws NonUniqueResultException;
	
	/**
	 * 
	 * @param queryString
	 * @param values
	 * @return
	 * @throws NonUniqueResultException
	 */
	public <T> T findUnique(String queryString, Object... values) throws NonUniqueResultException;
	
	/**
	 * 
	 * @param queryString
	 * @param parameterNames
	 * @param parameters
	 * @return
	 * @throws NonUniqueResultException
	 */
	public <T> T findUniqueByNamedParameter(String queryString, String[] parameterNames, Object[] parameters) throws NonUniqueResultException;
	
	/**
	 * 
	 * @param queryString
	 * @param values
	 * @return
	 */
	public <T> List<T> find(String queryString, Object... values) throws DataAccessException;
	
	/**
	 * 
	 * @param queryString
	 * @param parameterNames
	 * @param parameters
	 * @return
	 * @throws DataAccessException
	 */
	public <T> List<T> findByNamedParameters(String queryString, String[] parameterNames, Object[] parameters) throws DataAccessException;
	
	/**
	 * 
	 * @param queryString
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public List find(String queryString);
	
	/**
	 * Triggers paginated query
	 * 
	 * @param queryString
	 * @param firstResult
	 * @param maxResults
	 * @return
	 * @throws DataAccessException
	 */
	public <T> List<T> find(String queryString, int firstResult, int maxResults) throws DataAccessException;
	
	/**
	 * 
	 * @param queryName
	 * @param values
	 * @return
	 * @throws DataAccessException
	 */
	public Object findUniqueByNamedQuery(String queryName, Object... values) throws DataAccessException;
	
	/**
	 * 
	 * @param queryName
	 * @param paramNames
	 * @param params
	 * @return
	 * @throws DataAccessException
	 */
	public Object findUniqueByNamedQuery(String queryName, String[] paramNames, Object[] params) throws DataAccessException;
	
	/**
	 * 
	 * @param queryName
	 * @param values
	 * @return
	 * @throws DataAccessException
	 */
	@SuppressWarnings("rawtypes")
	public List findByNamedQuery(String queryName, Object... values) throws DataAccessException;
	
	/**
	 * 
	 * @param queryName
	 * @param paramNames
	 * @param params
	 * @return
	 * @throws DataAccessException
	 */
	@SuppressWarnings("rawtypes")
	public List findByNamedQuery(String queryName, String[] paramNames, Object[] params) throws DataAccessException;
	
	/**
	 * Flushes to synchronize the current session data
	 */
	public void flush();
	
	/**
	 * Evicts an entity from the current hibernate session
	 * @param entity
	 */
	public void evict(Object entity);
	
	/**
	 * Finds the entity name of the object passed. This method 
	 * takes care of {@link HibernateProxy}
	 * 
	 * @param entity
	 * @return
	 */
	public String getEntityName(Object entity);
	
	/**
	 * Gets the identifier if available of the persisted object
	 * @param entity
	 * @return
	 */
	public Serializable getIdentifier(Object entity);
	
	/**
	 * Initializes the entity if it is a proxy, does nothing if
	 * the passed object is not a proxy
	 * 
	 * @param entity
	 * @return
	 */
	public Object hydrate(Object entity);
	
	/**
	 * Gets the current session if any
	 * @return
	 */
	public Session getSession();
}


