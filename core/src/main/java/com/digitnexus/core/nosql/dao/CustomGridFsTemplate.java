/**
 * 
 */
package com.digitnexus.core.nosql.dao;

import java.io.InputStream;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.convert.QueryMapper;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.util.Assert;

import com.digitnexus.core.nosql.exception.NoSqlFileStoreException;
import com.mongodb.DB;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSFile;
import com.mongodb.gridfs.GridFSInputFile;

/**
 * Overwritten to add content type to the saved file
 * @author Santanu
 */
public class CustomGridFsTemplate extends GridFsTemplate {
	
	private final Logger logger=LoggerFactory.getLogger(getClass());

	private final MongoDbFactory dbFactory;
	private final String bucket;
	private final QueryMapper queryMapper;
	
	/**
	 * @see {@link org.springframework.data.mongodb.gridfs.GridFsTemplate}
	 * 
	 * @param dbFactory
	 * @param converter
	 */
	public CustomGridFsTemplate(MongoDbFactory dbFactory, MongoConverter converter) {
		this(dbFactory, converter, null);
	}
	
	/**
	 * @see {@link org.springframework.data.mongodb.gridfs.GridFsTemplate}
	 * 
	 * @param dbFactory
	 * @param converter
	 * @param bucket
	 */
	public CustomGridFsTemplate(MongoDbFactory dbFactory, MongoConverter converter, String bucket) {
		super(dbFactory, converter, bucket);
		this.dbFactory = dbFactory;
		this.bucket = bucket;
		
		this.queryMapper = new QueryMapper(converter);
	}

	/* (non-Javadoc)
	 * @see org.springframework.data.mongodb.gridfs.GridFsTemplate#store(java.io.InputStream, java.lang.String, com.mongodb.DBObject)
	 */
	@Override
	public GridFSFile store(InputStream content, String filename, DBObject metadata) {
		Assert.notNull(content);
		Assert.hasText(filename);
		Assert.notNull(metadata);

		GridFSInputFile file = getGridFs().createFile(content);
		file.setFilename(filename);
		//this are the additional lines we have to add the content type
		String contentType = (String)metadata.removeField("contentType");
		//and..very important id
		String id=null;
		try {
			id = (String) metadata.removeField("_id");
		} catch (Exception ex) {
			logger.error("Error removing id", ex);
			throw new NoSqlFileStoreException("Error removing id from meta data", ex);
		}
		if (StringUtils.isNotBlank(contentType)) {
			file.setContentType(contentType);
		}
		if (StringUtils.isNotBlank(id)) {
			file.setId(id);
		}
		//also if the meta data has only one key _class then remove that 
		//as that became irrelevant because of removal of a value
		Set<String> keys = metadata.keySet();
		if ((keys.size() == 1) && metadata.containsField("_class")) {
			metadata.removeField("_class");
		}
		file.setMetaData(metadata);
		file.save();

		return file;
	}
	
	public int count(Query query) {
		return getGridFs().getFileList(getMappedQuery(query)).count();
	}
	
	private DBObject getMappedQuery(Query query) {
		return query == null ? null : queryMapper.getMappedObject(query.getQueryObject(), null);
	}
	
	private GridFS getGridFs() {
		DB db = dbFactory.getDb();
		return bucket == null ? new GridFS(db) : new GridFS(db, bucket);
	}
}
