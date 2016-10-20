/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.nosql.dao.BaseNosqlDao;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.dao.ListViewNosqlDao;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 */
@Repository
public class NoSqlArticlePersister implements UiOperationArticlePersister, InitializingBean {

	private BaseNosqlDao baseNoSqlDao;
	private ListViewNosqlDao listViewNoSqlDao;
	private ArticlePersisterFactory persisterFactory;
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#isTransient(java.lang.Object)
	 */
	@Override
	public boolean isTransient(Object entity) {
		//not yet implemented. 
		return false;
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		baseNoSqlDao.delete(entity);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> void delete(Class<T> entityClass, Serializable id) {
		baseNoSqlDao.delete(baseNoSqlDao.get(entityClass, id));
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#load(java.lang.Class, java.io.Serializable)
	 */
	@Override
	public <T> T load(Class<T> entityClass, Serializable id) {
		return baseNoSqlDao.get(entityClass, id);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#save(java.lang.Object)
	 */
	@Override
	public void save(Object entity) {
		baseNoSqlDao.save(entity);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#update(java.lang.Object)
	 */
	@Override
	public void update(Object entity) {
		baseNoSqlDao.save(entity);
	}

	/* (non-Javadoc)
	 * @see com.calytera.core.persister.UiOperationEntityPersister#count(com.calytera.core.web.ui.config.dataobject.ListViewMetaData, com.calytera.core.search.SearchCriteria)
	 */
	@Override
	public long count(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		return listViewNoSqlDao.getCountForListView(listMetaData, searchCriteria);
	}

	/* (non-Javadoc)
	 * @see com.calytera.core.persister.UiOperationEntityPersister#find(com.calytera.core.web.ui.config.dataobject.ListViewMetaData, com.calytera.core.search.SearchCriteria)
	 */
	@Override
	public <T> List<T> find(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		return listViewNoSqlDao.getDataForListView(listMetaData, searchCriteria, -1, -1);
	}

	/* (non-Javadoc)
	 * @see com.calytera.core.persister.UiOperationEntityPersister#find(com.calytera.core.web.ui.config.dataobject.ListViewMetaData, com.calytera.core.search.SearchCriteria, int, int)
	 */
	@Override
	public <T> List<T> find(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		return listViewNoSqlDao.getDataForListView(listMetaData, searchCriteria, startIndex, maxResults);
	}

	/* (non-Javadoc)
	 * @see com.calytera.core.persister.UiOperationEntityPersister#loadEagerly(com.calytera.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@Override
	@SuppressWarnings("unchecked")
	public <T> T loadEagerly(EditViewMetaData editViewMetaData, Serializable id) {
		return (T) baseNoSqlDao.get(editViewMetaData.getEntityClass(), id);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#persists(java.lang.Class)
	 */
	@Override
	public <T> boolean persists(Class<T> entityClass) {
		return entityClass.isAnnotationPresent(Document.class);
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#getOrder()
	 */
	@Override
	public int getOrder() {
		return 30;
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		persisterFactory.registerDefaultPersister(this);
	}

	/**
	 * @param baseNoSqlDao the baseNoSqlDao to set
	 */
	@Inject @Named("baseNosqlDao")
	public void setBaseNoSqlDao(BaseNosqlDao baseNoSqlDao) {
		this.baseNoSqlDao = baseNoSqlDao;
	}

	/**
	 * @param listViewNoSqlDao the listViewNoSqlDao to set
	 */
	@Autowired
	public void setListViewNoSqlDao(ListViewNosqlDao listViewNoSqlDao) {
		this.listViewNoSqlDao = listViewNoSqlDao;
	}

	/**
	 * @param persisterFactory the persisterFactory to set
	 */
	@Autowired
	public void setPersisterFactory(ArticlePersisterFactory persisterFactory) {
		this.persisterFactory = persisterFactory;
	}
}
