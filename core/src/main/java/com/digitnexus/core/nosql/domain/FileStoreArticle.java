/**
 * 
 */
package com.digitnexus.core.nosql.domain;

import java.io.InputStream;
import java.util.Date;

import javax.activation.MimetypesFileTypeMap;

import org.apache.commons.lang.StringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import com.digitnexus.core.nosql.annotation.FileStoreDocument;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

/**
 * @author Santanu
 *
 */
@FileStoreDocument
public abstract class FileStoreArticle {
	
	private static final MimetypesFileTypeMap mimeTypeFileTypeMap = new MimetypesFileTypeMap();
	
	@Id
	private Object id;
	@Transient
	private String fileName;
	private String contentType;
	@Transient
	private String md5;
	@Transient
	private long chunkSize = -1;
	@Transient
	private long length = -1;
	@Transient
	private Date uploadDate;
	@Transient
	private InputStream data;
	
	public FileStoreArticle(){}
	
	public FileStoreArticle(GridFSDBFile gridFsFile) {
		this((GridFSFile)gridFsFile);
		this.data = gridFsFile.getInputStream();
	}
	
	public FileStoreArticle(GridFSFile gridFsFile) {
		this.id = gridFsFile.getId();
		this.fileName = gridFsFile.getFilename();
		this.contentType = gridFsFile.getContentType();
		this.md5 = gridFsFile.getMD5();
		this.uploadDate = gridFsFile.getUploadDate();
		this.length = gridFsFile.getLength();
		this.chunkSize = gridFsFile.getChunkSize();
	}
	
	/**
	 * @return the id
	 */
	public Object getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Object id) {
		this.id = id;
	}
	/**
	 * @return the md5
	 */
	public String getMd5() {
		return md5;
	}
	/**
	 * @param md5 the md5 to set
	 */
	public void setMd5(String md5) {
		this.md5 = md5;
	}
	/**
	 * @return the chunkSize
	 */
	public long getChunkSize() {
		return chunkSize;
	}
	/**
	 * @param chunkSize the chunkSize to set
	 */
	public void setChunkSize(long chunkSize) {
		this.chunkSize = chunkSize;
	}
	/**
	 * @return the length
	 */
	public long getLength() {
		return length;
	}
	/**
	 * @param length the length to set
	 */
	public void setLength(long length) {
		this.length = length;
	}
	/**
	 * @return the fileName
	 */
	public String getFileName() {
		return fileName;
	}
	/**
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName) {
		this.fileName = fileName;
		guessContentType();
	}
	/**
	 * @return the contentType
	 */
	public String getContentType() {
		guessContentType();
		return contentType;
	}
	/**
	 * @param contentType the contentType to set
	 */
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	/**
	 * @return the uploadDate
	 */
	public Date getUploadDate() {
		return uploadDate;
	}
	/**
	 * @param uploadDate the uploadDate to set
	 */
	public void setUploadDate(Date uploadDate) {
		this.uploadDate = uploadDate;
	}
	/**
	 * @return the data
	 */
	public InputStream getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(InputStream data) {
		this.data = data;
	}
	/**
	 * Try to set the content type based on the file name
	 */
	private void guessContentType() {
		if (StringUtils.isBlank(contentType) && StringUtils.isNotBlank(fileName)) {
			setContentType(mimeTypeFileTypeMap.getContentType(fileName));
		}
	}
}
