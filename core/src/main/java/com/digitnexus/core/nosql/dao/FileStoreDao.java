package com.digitnexus.core.nosql.dao;

import java.util.List;

import com.digitnexus.core.nosql.domain.FileStoreArticle;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

public interface FileStoreDao {

	/**
	 * 
	 * @param article
	 */
	public void store(FileStoreArticle article);
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	public <T extends FileStoreArticle> T getFileById(Class<T> entityType, Object id);

	/**
	 * 
	 * @param fileName
	 * @return
	 */
	public <T extends FileStoreArticle> List<T> getFilesByFileName(Class<T> entityType, String fileName);
	
	/**
	 * 
	 * @param entityType
	 * @return
	 */
	public <T extends FileStoreArticle> long getFileCount(Class<T> entityType);
	
	/**
	 * 
	 * @param entityType
	 */
	public <T extends FileStoreArticle> void delete(Class<T> entityType);
	
	/**
	 * Delete file identified by the id passed
	 * @param id
	 */
	public <T extends FileStoreArticle> void delete(Class<T> entityType, Object id);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @param startIndex
	 * @param maxResults
	 * @return
	 */
	public <T extends FileStoreArticle> List<T> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults);
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @return
	 */
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria);
}