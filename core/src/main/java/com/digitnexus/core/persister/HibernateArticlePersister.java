/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.dao.ListViewDao;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 */
@Repository
public class HibernateArticlePersister implements UiOperationArticlePersister, InitializingBean {
	
	private final Logger logger=LoggerFactory.getLogger(getClass());

	private BaseDao baseDao;
	private ListViewDao listViewDao;
	private SessionFactory sessionFactory;
	private ArticlePersisterFactory persisterFactory;
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#isTransient(java.lang.Object)
	 */
	@Override
	public boolean isTransient(Object entity) {
		return baseDao.isTransient(entity);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#save(java.lang.Object)
	 */
	@Override
	public void save(Object entity) {
		baseDao.save(entity);
		//the lockVersion does not get sync-ed up after save or update call
		//so ensure lock version is updated by doing a flush
		//got to remove this if we manage to get a better way of achieving the same
		baseDao.flush();
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#update(java.lang.Object)
	 */
	@Override
	public void update(Object entity) {
		baseDao.update(entity);
		//the lockVersion does not get sync-ed up after save or update call
		//so ensure lock version is updated by doing a flush
		//got to remove this if we manage to get a better way of achieving the same
		baseDao.flush();		
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#load(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> T load(Class<T> entityType, Serializable id) {
		return baseDao.load(entityType, id);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> void delete(Class<T> entityType, Serializable id) {
		//load and delete!
		baseDao.delete(baseDao.load(entityType, id));
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		baseDao.delete(entity);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#find(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria) {
		return (List<T>) listViewDao.getDataForListView(metaData, criteria, -1, -1);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#find(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria, int, int)
	 */
	@Override
	@SuppressWarnings("unchecked")
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria, int startIndex, int maxResults) {
		return (List<T>) listViewDao.getDataForListView(metaData, criteria, startIndex, maxResults);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#count(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@Override
	public long count(ListViewMetaData metaData, SearchCriteria criteria) {
		return listViewDao.getCountForListView(metaData, criteria);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#loadEagerly(com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@Override
	@SuppressWarnings("unchecked")
	public <T> T loadEagerly(EditViewMetaData editMetaData, Serializable id) {
		return (T) listViewDao.getObjectEagerly(editMetaData, id);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#persists(java.lang.Class)
	 */
	@Override
	public <T> boolean persists(Class<T> entityType) {
		try {
			if (sessionFactory.getClassMetadata(entityType) != null) {
				return true;
			}
		} catch (HibernateException e) {
			//ignore. this does not happen at the first place, even if happens just ignore
			logger.error(e.getMessage(),e);
		}
		return false;
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#getOrder()
	 */
	@Override
	public int getOrder() {
		return 0;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		persisterFactory.registerDefaultPersister(this);
	}

	/**
	 * @return the baseDao
	 */
	protected BaseDao getBaseDao() {
		return baseDao;
	}

	/**
	 * @param baseDao
	 */
	@Inject @Named("baseDao")
	public void setBaseDao(BaseDao baseDao) {
		this.baseDao = baseDao;
	}

	/**
	 * @param listViewDao the listViewDao to set
	 */
	@Autowired
	public void setListViewDao(ListViewDao listViewDao) {
		this.listViewDao = listViewDao;
	}

	/**
	 * @param sessionFactory
	 */
	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	/**
	 * @param persisterFactory
	 */
	@Autowired
	public void setPersisterFactory(ArticlePersisterFactory persisterFactory) {
		this.persisterFactory = persisterFactory;
	}
}
