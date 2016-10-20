/**
 * 
 */
package com.digitnexus.core.persister;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.nosql.dao.FileStoreDao;
import com.digitnexus.core.nosql.domain.FileStoreArticle;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 *
 */
@Repository
public class FileStoreArticlePersister implements UiOperationArticlePersister, InitializingBean {

	private ArticlePersisterFactory persisterFactory;
	private FileStoreDao fileStoreDao;
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#isTransient(java.lang.Object)
	 */
	@Override
	public boolean isTransient(Object entity) {
		//not yet implemented. 
		return false;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#save(java.lang.Object)
	 */
	@Override
	public void save(Object entity) {
		FileStoreArticle article = (FileStoreArticle)entity;
		fileStoreDao.store(article);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#update(java.lang.Object)
	 */
	@Override
	public void update(Object entity) {
		FileStoreArticle article = (FileStoreArticle)entity;
		fileStoreDao.store(article);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#load(java.lang.Class, java.io.Serializable)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> T load(Class<T> entityType, Serializable id) {
		//absolute unnecessary type casts!
		return (T) fileStoreDao.getFileById((Class<? extends FileStoreArticle>)entityType, id);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Class, java.io.Serializable)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> void delete(Class<T> entityType, Serializable id) {
		fileStoreDao.delete((Class<? extends FileStoreArticle>)entityType, id);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#delete(java.lang.Object)
	 */
	@Override
	public void delete(Object entity) {
		FileStoreArticle article = (FileStoreArticle) entity;
		fileStoreDao.delete(article.getClass(), article.getId());
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#persists(java.lang.Class)
	 */
	@Override
	public <T> boolean persists(Class<T> entityType) {
		return FileStoreArticle.class.isAssignableFrom(entityType);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.ArticlePersister#getOrder()
	 */
	@Override
	public int getOrder() {
		return 10;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#find(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@Override
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria) {
		return find(metaData, criteria, -1, -1);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#find(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria, int, int)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> find(ListViewMetaData metaData, SearchCriteria criteria, int startIndex, int maxResults) {
		return (List<T>) fileStoreDao.getDataForListView(metaData, criteria, startIndex, maxResults);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#count(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@Override
	public long count(ListViewMetaData metaData, SearchCriteria criteria) {
		return fileStoreDao.getCountForListView(metaData, criteria);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.persister.UiOperationArticlePersister#loadEagerly(com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> T loadEagerly(EditViewMetaData editMetaData, Serializable id) {
		return (T) fileStoreDao.getFileById((Class<? extends FileStoreArticle>)editMetaData.getEntityClass(), id);
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		persisterFactory.registerDefaultPersister(this);
	}
	
	/**
	 * @param persisterFactory the persisterFactory to set
	 */
	@Autowired
	public void setPersisterFactory(ArticlePersisterFactory persisterFactory) {
		this.persisterFactory = persisterFactory;
	}
}
