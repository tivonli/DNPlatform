package com.digitnexus.core.cache;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;

import com.digitnexus.core.exception.DigitNexusRuntimeException;

/**
 * ehcache client
 * 
 * @author Tivon Li
 * @Date: 2011-9-30
 */
public class EhcacheClient {

	private static CacheManager manager;

	public static CacheManager getCacheManager() {
		if (manager == null) {
			manager = CacheManager.create(EhcacheClient.class
					.getResourceAsStream("/cache/ehcache.xml"));
		}
		return manager;
	}

	/**
	 * get Ehcache defined in the ehcache.xml or define by your code, if the cache of this name not
	 * exist, throw RuntimeException
	 * 
	 * @param cacheName
	 * @return the cache of this name, if not exist, return the defaultCache
	 */
	public static Ehcache getCache(String cacheName) {
		Ehcache cache = getCacheManager().getEhcache(cacheName);
		if (cache == null) {
			throw new DigitNexusRuntimeException("Cache " + cacheName + " not exist!");
		}
		return cache;
	}

}
