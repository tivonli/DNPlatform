/**
 * 
 */
package com.digitnexus.core.web.service;

import java.io.InputStream;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Response;

import com.sun.jersey.core.header.FormDataContentDisposition;

/**
 * @author Santanu
 * 
 */
public interface EditViewService {

	/**
	 * 
	 * @param articleName
	 * @param parentArticleName
	 * @return
	 */
	public String getEditMetaDataResponse(String articleName, String parentArticleName);

	/**
	 * 
	 * @param articleName
	 * @param id
	 * @return
	 */
	public String getArticleDataResponse(String articleName, String id);

	/**
	 * 
	 * @param articleName
	 * @param jsonData
	 */
	public void saveArticle(String articleName, String jsonData);

	/**
	 * 
	 * @param articleName
	 * @param jsonData
	 */
	public void updateArticle(String articleName, String jsonData);

	/**
	 * 
	 * @param articleName
	 * @param jsonData
	 */
	public void deleteDataRecords(String articleName, String jsonData);

	public Response saveAttachment(String articleName, String id, String fieldName, InputStream stream,
			FormDataContentDisposition fileInfo, ServletContext context);
}
