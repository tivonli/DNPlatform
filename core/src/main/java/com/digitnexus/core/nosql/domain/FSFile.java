/**
 * 
 */
package com.digitnexus.core.nosql.domain;

import java.util.HashMap;
import java.util.Map;

import com.mongodb.gridfs.GridFSDBFile;

/**
 * @author Santanu
 *
 */
public class FSFile extends FileStoreArticle {
	
	private Map<String, Object> metaData;
	
	/**
	 * 
	 * @param gridFsFile
	 */
	@SuppressWarnings("unchecked")
	public FSFile(GridFSDBFile gridFsFile) {
		super(gridFsFile);
		this.metaData = gridFsFile.getMetaData().toMap();
	}
	/**
	 * @return the metaData
	 */
	public Map<String, Object> getMetaData() {
		if (metaData == null) {
			metaData = new HashMap<String, Object>();
		}
		return metaData;
	}
}
