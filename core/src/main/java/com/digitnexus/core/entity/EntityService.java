package com.digitnexus.core.entity;

import java.io.Serializable;
import java.util.List;

import com.digitnexus.core.nosql.domain.AttachmentObject;
/**
 * 
 * @author adi
 * Service class to do operations on entity/article/domain objects.
 */
public interface EntityService {
	
	public  <T> T get(Class<T> entityClass, Serializable id);

    public <T> List<T> getAll(Class<T> entityClass);

	/**
	 * Fires events for preSave, validation listeners. After saving the entity, event for postSave listeners
	 * will be fired.
	 * @param entity
	 */
	public void saveOrUpdate(Object entity);
	
	/**
	 * Preferably get rid of this method.
	 * Save or update an entity with an attachment
	 * 
	 * @param entity
	 * @param attachment the attachment to be saved
	 */
	public void saveOrUpdate(Object entity, AttachmentObject attachment);
	
	/**
	 * Similar to update but not exact behavior. Check hibernate merge
	 * @param entity
	 */
	public void merge(Object entity);

	/**
	 * Fires event for delete listeners before deleting the entity. 
	 * will be fired.
	 * @param entity
	 */
	public void delete(Object entity);
	
	
    
	
}
