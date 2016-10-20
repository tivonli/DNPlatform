package com.digitnexus.core.cache;

import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;

import org.testng.Assert;
import org.testng.annotations.Test;

public class EhcacheClientTest {
	
	@Test(groups = { "unit" })
	public void putAndGet() {
		Element e = new Element("a", "aaa");
		EhcacheClient.getCacheManager().addCacheIfAbsent("test").put(e);
		Ehcache cache = EhcacheClient.getCacheManager().getEhcache("test");
		Assert.assertNotNull(cache);
		Assert.assertEquals(cache.get("a").getObjectValue(), "aaa");
		
		e = new Element("a", "bbb");
		EhcacheClient.getCacheManager().getCache("test").put(e);
		cache = EhcacheClient.getCacheManager().getEhcache("test");
		Assert.assertNotNull(cache);
		Assert.assertEquals(cache.get("a").getObjectValue(), "bbb");
	}
	
	@Test(groups = { "unit" }, dependsOnMethods = {"putAndGet"}, expectedExceptions = {CacheException.class})
	public void putIfAbsent() {
		Element e = new Element("a", "bbb");
		EhcacheClient.getCacheManager().getCache("test").putIfAbsent(e);
	}

}
