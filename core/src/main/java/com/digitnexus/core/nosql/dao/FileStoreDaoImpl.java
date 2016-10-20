/**
 * 
 */
package com.digitnexus.core.nosql.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.WeakHashMap;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Transformer;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.UnhandledException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.nosql.annotation.FileStoreDocument;
import com.digitnexus.core.nosql.domain.FSFile;
import com.digitnexus.core.nosql.domain.FileStoreArticle;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.SortExpressionDescription;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

/**
 * @author Santanu
 */
@Repository(value="fileStoreDao")
public class FileStoreDaoImpl implements FileStoreDao, InitializingBean {

	//a cache that maintains bucket name vs GridFsTemplate
	private WeakHashMap<String, CustomGridFsTemplate> templateForBucketCache = new WeakHashMap<String, CustomGridFsTemplate>();
	
	protected final MongoDbFactory dbFactory;
	protected final MongoConverter converter;
	protected final String bucket;
	
	private CustomGridFsTemplate gridFsTemplate;
	
	/**
	 * 
	 */
	@Autowired
	public FileStoreDaoImpl(MongoDbFactory dbFactory, MongoConverter converter) {
		this(dbFactory, converter, null);
	}
	
	/**
	 * @param dbFactory
	 * @param converter
	 * @param bucket
	 */
	public FileStoreDaoImpl(MongoDbFactory dbFactory, MongoConverter converter, String bucket) {
		this.dbFactory = dbFactory;
		this.converter = converter;
		this.bucket = bucket;
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#store(com.digitnexus.core.nosql.domain.FileStoreArticle)
	 */
	public void store(FileStoreArticle article) {
		GridFSFile gridFsFile = getGridFsTemplate(article.getClass()).store(article.getData(), article.getFileName(), article);
		article.setId(gridFsFile.getId().toString());
		article.setLength(gridFsFile.getLength());
		article.setUploadDate(gridFsFile.getUploadDate());
		article.setMd5(gridFsFile.getMD5());
		article.setChunkSize(gridFsFile.getChunkSize());
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#getFileById(java.lang.Object)
	 */
	@Override
	@SuppressWarnings("unchecked")
	public <T extends FileStoreArticle> T getFileById(Class<T> entityType, Object id) {
		Query query = new Query().addCriteria(Criteria.where("_id").is(id));
		GridFSDBFile file =	getGridFsTemplate(entityType).findOne(query);
		if (file != null) {
			T entity = (T) createObject(file);
			
			return entity;
		}
		return null;
	}

	/* (non-Javadoc)
	 * @see org.santanu.dao.FileStoreDao#getFilesByFileName(java.lang.String)
	 */
	@Override
	public <T extends FileStoreArticle> List<T> getFilesByFileName(Class<T> entityType, String fileName) {
		Query query = new Query().addCriteria(Criteria.where("filename").is(fileName));
		return findFiles(entityType, query);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#delete(java.lang.Class)
	 */
	public <T extends FileStoreArticle> void delete(Class<T> entityType) {
		getGridFsTemplate(entityType).delete(null);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#delete(java.lang.Object)
	 */
	@Override
	public <T extends FileStoreArticle> void delete(Class<T> entityType, Object id) {
		Query query = new Query().addCriteria(Criteria.where("_id").is(id));
		getGridFsTemplate(entityType).delete(query);
	}
	
	
	@SuppressWarnings("unchecked")
	public <T extends FileStoreArticle> List<T> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		Query query = new Query().skip(startIndex).limit(maxResults);
		if (searchCriteria != null) {
			for(SortExpressionDescription sortDescription:searchCriteria.getSortExpressions()){
				query.sort().on(sortDescription.getName(), sortDescription.isAscending()? Order.ASCENDING : Order.DESCENDING);
			}
		} else {
			query.sort().on("uploadDate", Order.ASCENDING);
		}
		return findFiles(listMetaData.getEntityClass(), query);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#getCountForListView(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@SuppressWarnings("unchecked")
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		return getGridFsTemplate(listMetaData.getEntityClass()).count(null);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.dao.FileStoreDao#getFileCount(java.lang.Class)
	 */
	public <T extends FileStoreArticle> long getFileCount(Class<T> entityType) {
		return getGridFsTemplate(entityType).count(null);
	}
	
	/**
	 * 
	 * @param query
	 * @return
	 */
	protected <T extends FileStoreArticle> List<T> findFiles(Class<T> entityType, Query query) {
		List<GridFSDBFile> files = getGridFsTemplate(entityType).find(query);
		return transformList(files);
	}
	
	@SuppressWarnings("unchecked")
	protected <T extends FileStoreArticle> List<T> transformList(List<GridFSDBFile> files) {
		return (List<T>) CollectionUtils.collect(files, new GridFSDBFileTransformer(), new ArrayList<T>());
	}
	
	@SuppressWarnings("unchecked")
	private <T extends FileStoreArticle> T createObject(GridFSDBFile file) {
		DBObject dbObject = file.getMetaData();
		
		String className = (String) dbObject.get("_class");
		if (StringUtils.isNotBlank(className)) {
			try {
				Class<T> entityType = (Class<T>) Class.forName(className);
				T entity = converter.read(entityType, dbObject);
				entity.setId(file.getId());
				entity.setFileName(file.getFilename());
				entity.setLength(file.getLength());
				entity.setMd5(file.getMD5());
				entity.setUploadDate(file.getUploadDate());
				entity.setContentType(file.getContentType());
				entity.setChunkSize(file.getChunkSize());
				entity.setData(file.getInputStream());
				return entity;
			} catch (ClassNotFoundException e) {
				throw new UnhandledException(e);
			}
		} else {
			return (T) new FSFile(file);
		}
	}
	
	private <T> CustomGridFsTemplate getGridFsTemplate(Class<T> entityClass) {
		String bucket = null;
		if (entityClass.isAnnotationPresent(FileStoreDocument.class)) {
			bucket = entityClass.getAnnotation(FileStoreDocument.class).bucket();
		}
		if (StringUtils.isBlank(bucket)) {
			bucket = entityClass.getSimpleName().toLowerCase();
		}
		if (!templateForBucketCache.containsKey(bucket)) {
			CustomGridFsTemplate template = new CustomGridFsTemplate(dbFactory, converter, bucket);
			templateForBucketCache.put(bucket, template);
		}
		return templateForBucketCache.get(bucket);
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		this.gridFsTemplate = createTemplate();
	}
	
	protected CustomGridFsTemplate createTemplate() {
		return this.gridFsTemplate;
	}
	
	/**
	 * 
	 * @author Santanu
	 */
	protected class GridFSDBFileTransformer implements Transformer {
		@Override
		public Object transform(Object input) {
			GridFSDBFile file = (GridFSDBFile)input;
			return createObject(file);
		}
	}
}
