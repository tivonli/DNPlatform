/**
 * All rights reserved by DigitNexus Technology INC.
 */
package com.digitnexus.core.id.business;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.digitnexus.core.CoreConstants;
import com.digitnexus.core.id.domain.BaseId;
import com.digitnexus.core.util.ConfigUtil;

/**
 * Get id from cache, if cache not exist or not enough, get id from db, put it
 * into cache, than get id from cache again
 * 
 * @author Tivon Li(tkli@digitnexus.com)
 * @Date 2013-03-22
 * @since 3.1
 */
public abstract class AbstractCacheableIdService {
	// private final Logger log = LoggerFactory.getLogger(getClass());

	// each server have different id segments, so don't worry this local cache
	// not work it cluster
	private static Map<String, BaseId> cacheMap = new ConcurrentHashMap<String, BaseId>();

	protected BaseId getIdFromCache(BaseId info) {
		BaseId result = null;
		long requireQuantity = info.getQuantity();
		long minQuantity = info.getQuantity();
//		if (info instanceof EpcId) {
//			minQuantity = ConfigUtil.getConfig().getLong(
//			        CoreConstants.EPC_ID_MIN_QUANTITY);
//		} else {
			minQuantity = ConfigUtil.getConfig().getLong(
			        CoreConstants.POJO_ID_MIN_QUANTITY);
//		}
		requireQuantity = (requireQuantity < minQuantity ? minQuantity
		        : requireQuantity);
		String key = info.getItem();
		BaseId cacheId = cacheMap.get(key);

		if (cacheId != null) {
			if (cacheId.getMaxId() - cacheId.getNextId() + 1 >= info
			        .getQuantity()) {
				result = cacheId.clone();

				// update cache
				long newId = cacheId.getNextId() + info.getQuantity();
				cacheId.setNextId(newId);
			} // id not enough, keep this cache for other request

		}
		if (result == null) {
			BaseId nextId = generateNextId(info);
			nextId.setMaxId(nextId.getNextId() - 1);
			nextId.setNextId(nextId.getNextId() - requireQuantity);

			cacheMap.put(key, nextId);
			result = getIdFromCache(info);
		}

		return result;
	}

	protected abstract BaseId generateNextId(BaseId baseId);
}
