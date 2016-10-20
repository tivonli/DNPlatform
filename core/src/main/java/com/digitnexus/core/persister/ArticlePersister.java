/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;

/**
 * This interface defines a EntityPersister. The name get inspiration from Martin Fowler
 * Patterns of Enterprise Application Architecture (P of EAA, http://martinfowler.com/bliki/PolyglotPersistence.html). 
 * 
 * This means, the implementation of the class may decide the database the record need to 
 * goto, also it may decide the table/collection the data need to go to. This class abstracts
 * the persistence details from the service class.
 * 
 * It exposes methods to read and write data. Individual implementation need to take care
 * of the details of data access.
 * 
 * For each article type that is persisted, there can be a EntityPersister defined for 
 * that. If no such persister is defined then the most appropriate one from the default set
 * of persister will be used.
 * 
 * @author Santanu
 */
public interface ArticlePersister {
	
	/**
	 * Checks if the entity passed is transient or persisted
	 * 
	 * @param entity
	 * @return true if transient
	 */
	public boolean isTransient(Object entity);
	
	/**
	 * saves the entity passed
	 * 
	 * @param entity the entity to be saved
	 */
	public void save(Object entity);
	
	/**
	 * Updates the entity passed
	 * 
	 * @param entity the entity to be updated
	 */
	public void update(Object entity);
	
	/**
	 * Loads an entity from the persistence store
	 * 
	 * @param entityType the data type of the entity
	 * @param id the primary key of the entity
	 * @return the entity loaded
	 */
	public <T> T load(Class<T> entityType, Serializable id);
	
	/**
	 * Deletes an entity from the persistence store
	 * 
	 * @param entityType the data type of the entity
	 * @param id the primary key of the entity
	 */ 
	public <T> void delete(Class<T> entityType, Serializable id);
	
	/**
	 * Deletes the entity passed
	 * 
	 * @param entity the entity to be deleted
	 */
	public void delete(Object entity);
	
	/**
	 * Checks if this persister can handle the type of object
	 * @param entityType
	 * @return
	 */
	public <T> boolean persists(Class<T> entityType);
	
	/**
	 * This is to provide relative order of the default {@link ArticlePersister}s
	 * @return the relative order of the persister
	 */
	public int getOrder();
}
