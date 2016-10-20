package com.digitnexus.core.id.business;

import java.util.List;

import com.digitnexus.core.id.domain.PojoId;

/**
 * id generator interface
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date: 2013-03-28
 * @since 3.1
 */
public interface PojoIdGenerateService {

	/**
	 * Generate id list
	 * 
	 * @param pojoId
	 *            the  item, length, quantity is  must
	 * @return the epc value list
	 */
	public List<Long> generateIdList(PojoId pojoId);

	/**
	 * Generate id
	 * 
	 * @param pojoId
	 *            the property item, length is must.
	 * @return the id value
	 */
	public long generateId(PojoId pojoId);

}
