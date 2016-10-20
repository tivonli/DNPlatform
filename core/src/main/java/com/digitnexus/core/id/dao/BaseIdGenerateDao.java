/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id.dao;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.id.domain.BaseId;

/**
 * ID Generate dao
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2013-03-28
 * @since 3.1
 */
public interface BaseIdGenerateDao extends BaseDao {

	/**
	 * Generate next id
	 * 
	 * @param baseId
	 *            for epc, the property schema is must. when schema is gid or
	 *            sgtin or grai, the item is also must <br/>
	 *            for pojo id, the item is must
	 * @return the id object with next id value
	 */
	public BaseId generateNextId(BaseId baseId);

}
