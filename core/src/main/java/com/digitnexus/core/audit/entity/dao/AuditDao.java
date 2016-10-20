package com.digitnexus.core.audit.entity.dao;

import java.io.Serializable;
import java.util.List;

import com.digitnexus.core.dao.BaseDao;
/**
 * To get audit information
 * @author adi
 *
 */
public interface AuditDao extends BaseDao {
	
	/**
	 * @param entityClass
	 * @return 
	 */
	long getRevisionCount(Class<?> entityClass,Serializable id);
	
	/**
	 * 
	 * @param entityClass
	 * @param start
	 * @param numberOfResults
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	List getRevisions(Class<?> entityClass,Serializable id,int start, int numberOfResults);
	
	/**
	 * To find if the entity is configured for auditing
	 * @param entityClass
	 * @return
	 */
	boolean isAudited(Class<?> entityClass);

}
