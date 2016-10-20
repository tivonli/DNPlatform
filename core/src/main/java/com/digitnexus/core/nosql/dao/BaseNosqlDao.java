/**
 * 
 */
package com.digitnexus.core.nosql.dao;

import java.util.List;


/**
 * 
 * @author Santanu
 */
public interface BaseNosqlDao {
	
	/**
	 * Gets the entity identified by the id passed
	 * @param entityClass the type of the object to be fetched
	 * @param id the id of the entity
	 * @return the object identified by id, null if no object found
	 */
	public <T> T get(Class<T> entityClass, Object id);
	
	/**
	 * Gets all the objects from the collection for the entity
	 * @param entityClass
	 * @return
	 */
	public <T> List<T> getAll(Class<T> entityClass);
	
	/**
	 * Saves an object to the nosql store. Populates the passed object with a generated id
	 * if possible
	 * @param entity entity to be saved
	 */
	public void save(Object entity);
	
	/**
	 * Deletes an entity from the nosql data store
	 * @param entity the entity to be deleted
	 */
	public void delete(Object entity);
	
	/**
	 * Drops a collection for the entity class passed
	 * @param entityClass for which the collection has to be dropped
	 */
	public <T> void dropCollection(Class<T> entityClass);
	
	public <T> T findAndDelete(String selectKey,Object selectVal,Class<T> entityClass);
	
	public <T> T findAndUpdate(String selectKey,Object selectVal,String updateKey,Object updateValue,Class<T> entityClass);
}
