package com.digitnexus.core.id.dao;

import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.CoreConstants;
import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.exception.DigitNexusRuntimeException;
import com.digitnexus.core.id.SimpleIdGenerateUtil;
import com.digitnexus.core.id.domain.BaseId;
import com.digitnexus.core.id.domain.IdHeader;
import com.digitnexus.core.util.ConfigUtil;
import com.digitnexus.core.util.ServerInfoUtil;

public abstract class AbstractBaseIdGenerateDao extends BaseDaoImpl implements
		BaseIdGenerateDao {

	protected List<Integer> remainders = new LinkedList<Integer>();

	protected int serverSegment = ConfigUtil.getConfig().getInteger(
			CoreConstants.ID_HEADER_SEGMENTS, 1);

	public AbstractBaseIdGenerateDao() {
		if (serverSegment > 1) { // need divide server no
			String[] remainderArray = ConfigUtil.getConfig().getStringArray(
					CoreConstants.ID_HEADER_REMAINDER);
			for (String remainder : remainderArray) {
				remainders.add(Integer.valueOf(remainder));
			}
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.id.dao.IDGenerateDao#generateNextId(com.digitnexus
	 * .core.id.domain.BaseId)
	 */
	@Override
	public synchronized BaseId generateNextId(BaseId info) {
		BaseId result = null;
		boolean isMatch = false;
		long requireQuantity = info.getQuantity();
		long minQuantity = 10;
		// if (info instanceof EpcId) {
		// minQuantity = ConfigUtil.getConfig().getLong(
		// CoreConstants.EPC_ID_MIN_QUANTITY);
		// } else {
		minQuantity = ConfigUtil.getConfig().getLong(
				CoreConstants.POJO_ID_MIN_QUANTITY);
		// }
		requireQuantity = (requireQuantity < minQuantity ? minQuantity
				: requireQuantity);
		if (StringUtils.isBlank(info.getClientID())) {
			info.setClientID(ConfigUtil.getConfig().getString(
					CoreConstants.DEFAULT_CLIENT_ID));
		}

		List<BaseId> matchIdList = findMatchId(info);
		if (matchIdList != null && !matchIdList.isEmpty()) {
			for (BaseId matchId : matchIdList) {
				// ID not enough
				if (matchId.getMaxId() - matchId.getNextId() < requireQuantity - 1) {
					// if few ID left at this range, mark as use up
					if ((matchId.getMaxId() - matchId.getNextId()) < 10L) {
						matchId.setUseup(true);
						this.update(matchId);
					}
					// createId method need the last id header info
					info.setHeader(matchId.getHeader());
					continue;
				} else { // id enough
					result = matchId;
					isMatch = true;
					break;
				}
			} // end of for
		}

		if (!isMatch) {
			result = createId(info);
			// return generateNextId(info);
		}

		// update nextId value
		result.setNextId(result.getNextId() + requireQuantity);
		this.update(result);

		// the cache service need to update the result in cache, but should not
		// update the database, so need to clone a new one
		return result.clone();
	}

	/*
	 * find this server's id header, if not exist, create a new one
	 */
	@SuppressWarnings("unchecked")
	protected IdHeader findMatchIdHeader(int previousServerNo) {
		int serverSegment = ConfigUtil.getConfig().getInteger(
				CoreConstants.ID_HEADER_SEGMENTS, 1);
		List<IdHeader> headerList = null;
		if (serverSegment > 1) {
			String hql = "from IdHeader h where h.mac = ? and serverNo > ? and mod(serverNo, ?) in :remainders order by h.serverNo asc";
			headerList = this
					.createQuery(hql)
					// TODO IN
					.setString(0, ServerInfoUtil.getMac())
					.setInteger(1, previousServerNo)
					.setInteger(2, serverSegment)
					.setParameterList("remainders", remainders).list();
		} else {
			String hql = "from IdHeader h where h.mac = ? and serverNo > ? order by h.serverNo asc";
			headerList = this.createQuery(hql)
					// TODO IN
					.setString(0, ServerInfoUtil.getMac())
					.setInteger(1, previousServerNo).list();
		}

		// CriteriaBuilder cb = getSession().);
		// Expression<Integer> mod2 = cb.mod(path, 1000);
		// Criteria criteria = getSession().createCriteria(IdHeader.class);
		// List<IdHeader> headerList = criteria.setProjection(Projections.)
		// .add(Restrictions.eq("mac", ServerInfoUtil.getMac()))
		// .add(Restrictions.ge("serverNo", previousServerNo)).list();
		// aa serverNo/ == 1

		IdHeader header = null;
		if (headerList != null && headerList.size() > 0) {
			header = headerList.get(0);
		} else { // no match header exist, create a new one
			header = new IdHeader();
			header.setMac(ServerInfoUtil.getMac());
			int nextServerNo = 0;
			// need not to divide server no
			if (serverSegment <= 1) {
				nextServerNo = previousServerNo + 1;
				header.setServerNo(nextServerNo);
			} else { // need to use mod to divide server no
//				int segments = ConfigUtil.getConfig().getInt(
//						CoreConstants.ID_HEADER_SEGMENTS);
				for (int remainder : remainders) {
					if (previousServerNo == 0) { // use the first remainder
						nextServerNo = remainder;
						break;
					} else {
						nextServerNo = previousServerNo + serverSegment;
						// id used up for this remainder, use another remainder
						if (nextServerNo > IdHeader.DEFAULT_MAX_SERVER_NO) {
							previousServerNo = 0;
							continue;
						} else {
							break;
						}
					}
				} // end of for
			}
			if (nextServerNo > IdHeader.DEFAULT_MAX_SERVER_NO) {
				throw new DigitNexusRuntimeException(
						"generate id fail due to serverno used up");
			}
			header.setServerNo(nextServerNo);
			header.setId(SimpleIdGenerateUtil.generateId());
			this.save(header);
		}
		return header;
	}

	/*
	 * find the current id in use
	 */
	protected abstract List<BaseId> findMatchId(BaseId info);

	/*
	 * create a new id
	 */
	protected abstract BaseId createId(BaseId info);

}
