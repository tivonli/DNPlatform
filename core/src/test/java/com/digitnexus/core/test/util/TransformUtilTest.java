package com.digitnexus.core.test.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.util.TransformUtil;

public class TransformUtilTest extends BaseTest {
	protected final Logger	log	= LoggerFactory.getLogger(getClass());
	@Test(groups = { "unit" })
	public void testTransform() {
		User u = new User();
		u.setUsername("even");
		System.out.println(TransformUtil.object2String(u));
		
		Role r = new Role();
		r.setName("administrator");
		Object[] o = {u, r};
		System.out.println(TransformUtil.object2String(o));
		
//		SyncData d = new SyncData();
//		d.setId(1);
//		d.setMessage("test");
//		System.out.println(TransformUtil.object2String(d));
//		System.out.println(JsonUtil.toJson(d, "lobMessage"));
	}
}
