/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.id.IdGenerateUtil;
import com.digitnexus.core.id.SimpleIdGenerateUtil;
import com.digitnexus.core.id.domain.BaseId;
import com.digitnexus.core.id.domain.IdHeader;
import com.digitnexus.core.id.domain.PojoId;
import com.digitnexus.core.util.ServerInfoUtil;

/**
 * POJO ID Generate dao
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2013-03-28
 * @since 3.1
 */
@Repository
public class PojoIdGenerateDaoImpl extends AbstractBaseIdGenerateDao implements
        BaseIdGenerateDao {

	private final Logger log = LoggerFactory.getLogger(getClass());

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.dao.AbstractBaseIdDao#createId(com.digitnexus.
	 * core.id.domain.BaseId)
	 */
	@Override
	protected BaseId createId(BaseId info) {
		log.debug("start create id...");
		int previousServerNo = (info.getHeader() == null ? 0 : info.getHeader()
		        .getServerNo());

		PojoId newId = new PojoId();
		newId.setId(SimpleIdGenerateUtil.generateId());
		newId.setUseup(false);
		newId.setNextId(1);
		newId.setLength(((PojoId) info).getLength());
		newId.setMaxId(info.getMaxId() == 0 ? IdGenerateUtil
		        .calculateMaxId(19 - (IdHeader.DEFAULT_MAX_SERVER_NO + "")
		                .length()) : info.getMaxId());
		newId.setClientID(info.getClientID());
		newId.setItem(info.getItem());
		newId.setHeader(findMatchIdHeader(previousServerNo));
		this.save(newId);
//		this.flush();
		log.debug("create id success, server no is: "
		        + newId.getHeader().getServerNo());
		return newId;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.dao.AbstractBaseIdDao#findMatchId(com.digitnexus
	 * .core.id.domain.BaseId)
	 */
	@Override
	@SuppressWarnings("unchecked")
	protected List<BaseId> findMatchId(BaseId info) {
		// String hql =
		// "from PojoId c where c.useup = ? and c.item = ? and c.clientID = ? and c.header.mac = ? order by c.header.serverNo asc";
		Criteria criteria = getSession().createCriteria(BaseId.class);
		criteria.add(Restrictions.eq("useup", false)).add(
		        Restrictions.eq("clientID", info.getClientID()));
		if (info.getItem() != null) {
			criteria.add(Restrictions.eq("item", info.getItem()));
		}
		criteria.createCriteria("header")
		        .add(Restrictions.eq("mac", ServerInfoUtil.getMac()))
		        .addOrder(Order.asc("serverNo"));

		List<BaseId> matchIdList = criteria.list();

		return matchIdList;
	}
}
