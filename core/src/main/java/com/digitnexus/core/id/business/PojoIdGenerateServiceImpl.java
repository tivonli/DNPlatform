/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id.business;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.digitnexus.core.id.IDException;
import com.digitnexus.core.id.IdGenerateUtil;
import com.digitnexus.core.id.dao.BaseIdGenerateDao;
import com.digitnexus.core.id.domain.BaseId;
import com.digitnexus.core.id.domain.IdHeader;
import com.digitnexus.core.id.domain.PojoId;

/**
 * POJO ID generator
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2012-12-22
 * @since 3.1
 */
@Component
public class PojoIdGenerateServiceImpl extends AbstractCacheableIdService
        implements PojoIdGenerateService {

	@Autowired
	@Qualifier(value = "pojoIdGenerateDaoImpl")
	private BaseIdGenerateDao dao;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.business.PojoIdGenerateService#generateIdList(
	 * com.digitnexus.core.id.domain.BaseId)
	 */
	@Override
	public List<Long> generateIdList(PojoId info) {
		validParameter(info);

		BaseId result = getIdFromCache(info);
		List<Long> list = new ArrayList<Long>();
		String strServerNo = IdGenerateUtil.toFixedWidthId(result.getHeader()
		        .getServerNo(), (IdHeader.DEFAULT_MAX_SERVER_NO + "").length());
		for (int i = 0; i < info.getQuantity(); i++) {
			String strId = IdGenerateUtil.toFixedWidthId(
			        result.getNextId() + i,
			        info.getLength()
			                - String.valueOf(IdHeader.DEFAULT_MAX_SERVER_NO)
			                        .length());
			list.add(Long.valueOf(strServerNo + strId));
		}

		return list;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.business.PojoIdGenerateService#generateId(com.
	 * digitnexus.core.id.domain.BaseId)
	 */
	@Override
	public long generateId(PojoId info) {
		validParameter(info);

		info.setQuantity(1);
		BaseId result = getIdFromCache(info);

		int serverNoLength = String.valueOf(IdHeader.DEFAULT_MAX_SERVER_NO)
		        .length();
		String strId = IdGenerateUtil.toFixedWidthId(result.getNextId(),
		        info.getLength() - serverNoLength);
		String strServerNo = IdGenerateUtil.toFixedWidthId(result.getHeader()
		        .getServerNo(), serverNoLength);
		return Long.valueOf(strServerNo + strId);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.business.AbstractCacheableIdService#generateNextId
	 * (com.digitnexus.core.id.domain.BaseId)
	 */
	@Override
	protected BaseId generateNextId(BaseId baseId) {
		return dao.generateNextId(baseId);
	}

	private void validParameter(PojoId pojoId) {
		if (pojoId == null) {
			throw new IDException("Not valid parameter, can not be null");
		}
		if (StringUtils.isBlank(pojoId.getItem())) {
			throw new IDException("Not valid parameter, the item is must");
		}
		if (pojoId.getLength() < 4) {
			throw new IDException(
			        "Not valid parameter, the length  must greater than 3, recommend the  length is at least 10");
		}
	}
}
