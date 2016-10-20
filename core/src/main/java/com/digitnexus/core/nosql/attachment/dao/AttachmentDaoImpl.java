/**
 * 
 */
package com.digitnexus.core.nosql.attachment.dao;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.nosql.dao.CustomGridFsTemplate;
import com.digitnexus.core.nosql.dao.FileStoreDaoImpl;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.nosql.exception.NoFileFoundException;

/**
 * @author Santanu
 *
 */
@Repository
public class AttachmentDaoImpl extends FileStoreDaoImpl implements AttachmentDao {

	/**
	 * @param dbFactory
	 * @param converter
	 * @param bucket
	 */
	@Autowired
	public AttachmentDaoImpl(MongoDbFactory dbFactory, MongoConverter converter) {
		super(dbFactory, converter, "attachment");
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.dao.AttachmentDao#getAttachment(java.lang.Object)
	 */
	@Override
	public AttachmentObject getAttachment(Object id) {
		return getFileById(AttachmentObject.class, id);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.AttachmentDao#loadAttachment(java.lang.Object)
	 */
	public AttachmentObject loadAttachment(Object id) throws NoFileFoundException {
		//gets the file by the id..here this can return null
		AttachmentObject file = getFileById(AttachmentObject.class, id);
		//but we do not handle null, if id is exposed file should be there
		//so may be an exception is appropriate
		if (file == null) {
			throw new NoFileFoundException("No file with id " + id.toString() + " not found");
		}
		return file;
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.AttachmentDao#store(com.digitnexus.core.domain.AttachmentObject)
	 */
	@Override
	public Object store(AttachmentObject attachment) {
		generateAttachmentId(attachment);
		super.store(attachment);
		return attachment.getId();
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.AttachmentDao#delete(com.digitnexus.core.domain.AttachmentObject)
	 */
	@Override
	public void delete(AttachmentObject attachment) {
		delete(AttachmentObject.class, attachment.getId());
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.AttachmentDao#findAttachments(java.lang.String, java.lang.String, java.lang.Object)
	 */
	@Override
	public List<AttachmentObject> findAttachments(String articleName, String propertyName, Object articleId) {
		Criteria criteria = Criteria.where("metadata._class").is(AttachmentObject.class.getName())
									.and("metadata.parentArticleType").is(articleName);
		if (StringUtils.isNotBlank(propertyName)) {
			criteria.and("metadata.parentArticleField").is(propertyName);
		}
		if (articleId != null) {
			criteria.and("metadata.parentArticleId").is(articleId.toString());
		}
		Query query = new Query().addCriteria(criteria);
		List<AttachmentObject> files = findFiles(AttachmentObject.class, query);
		return files;
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.nosql.attachment.AttachmentDao#countAttachments(java.lang.String, java.lang.String, java.lang.Object)
	 */
	@Override
	public int countAttachments(String articleName, String propertyName, Object articleId) {
		Query query = new Query()
			.addCriteria(Criteria.where("metadata._class").is(AttachmentObject.class.getName())
							.and("metadata.parentArticleType").is(articleName)
							.and("metadata.parentArticleField").is(propertyName)
							.and("metadata.parentArticleId").is(articleId.toString()));
		return findFiles(AttachmentObject.class, query).size();
	}
	
	/**
	 * This method generates the attachment id if possible
	 */
	private void generateAttachmentId(AttachmentObject attachment) {
		if ((attachment.getId() == null) || StringUtils.isBlank(attachment.getId().toString())) {
			StringBuilder idBuilder = new StringBuilder();
			if (StringUtils.isNotBlank(attachment.getParentArticleType())) {
				idBuilder.append(attachment.getParentArticleType().replace(".",""));
			}
			if (StringUtils.isNotBlank(attachment.getParentArticleField())) {
				idBuilder.append(attachment.getParentArticleField());
			}
			if (StringUtils.isNotBlank(attachment.getParentArticleId())) {
				idBuilder.append(attachment.getParentArticleId());
			}
			if ((idBuilder.length() > 0) && (attachment.getIndex() >= 0)) {
				idBuilder.append(attachment.getIndex());
			}
			if (idBuilder.length() > 0) {
				attachment.setId(idBuilder.append(attachment.getIndex()).toString());
			}
		}
	}
	
	protected CustomGridFsTemplate createTemplate() {
		return new CustomGridFsTemplate(dbFactory, converter, bucket);
	}
}
