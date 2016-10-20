/**
 * 
 */
package com.digitnexus.core.nosql.domain;

import com.digitnexus.core.nosql.annotation.FileStoreDocument;

/**
 * @author Santanu
 *
 */
@FileStoreDocument(bucket="attachment")
public class AttachmentObject extends FileStoreArticle {
	
	//there are custom properties to be saved for an attachment separately
	private int index = -1;
	private String description;
	private String parentArticleType;
	private String parentArticleField;
	private String parentArticleId;
	
	/**
	 * 
	 */
	public AttachmentObject() {
	}
	/**
	 * 
	 * @param fsFile
	 */
	public AttachmentObject(FSFile fsFile) {
		setId(fsFile.getId());
		setContentType(fsFile.getContentType());
		setFileName(fsFile.getFileName());
		setLength(fsFile.getLength());
		setData(fsFile.getData());
	}
	/**
	 * @return the index
	 */
	public int getIndex() {
		return index;
	}
	/**
	 * @param index the index to set
	 */
	public void setIndex(int index) {
		this.index = index;
	}
	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}
	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	/**
	 * @return the parentArticleType
	 */
	public String getParentArticleType() {
		return parentArticleType;
	}
	/**
	 * @param parentArticleType the parentArticleType to set
	 */
	public void setParentArticleType(String parentArticleType) {
		this.parentArticleType = parentArticleType;
	}
	/**
	 * @return the parentArticelField
	 */
	public String getParentArticleField() {
		return parentArticleField;
	}
	/**
	 * @param parentArticleField the parentArticelField to set
	 */
	public void setParentArticleField(String parentArticleField) {
		this.parentArticleField = parentArticleField;
	}
	/**
	 * @return the parentArticleId
	 */
	public String getParentArticleId() {
		return parentArticleId;
	}
	/**
	 * @param parentArticleId the parentArticleId to set
	 */
	public void setParentArticleId(String parentArticleId) {
		this.parentArticleId = parentArticleId;
	}
}
