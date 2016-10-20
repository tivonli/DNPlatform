package com.digitnexus.core.test.audit.hibernate.interceptor;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.dao.UserDao;
import com.digitnexus.core.test.BaseTransactionalTest;

public class DataObjectInterceptorTest extends BaseTransactionalTest {
	
	@Autowired
	private UserDao userDao;
	
	@Test(groups = { "unit" }, enabled=false)
	public void OnSave(){
		User user=getUserObject();
		userDao.save(user);
		user=userDao.get(User.class, user.getUsername());
		
		Assert.assertNotNull(user.getCreatedDate());
		Assert.assertTrue(StringUtils.isNotEmpty(user.getClientID()));
		Assert.assertTrue(StringUtils.isNotEmpty(user.getCreatedBy()));
		Assert.assertEquals("admin", user.getCreatedBy());
		
	}
	
	@Test(groups = { "unit" }, enabled=false)
	public void onFlushDirty(){
		User user=getUserObject();
		userDao.save(user);
		user=userDao.get(User.class, user.getUsername());
		user.setEmail("test@xyz.com");
		userDao.update(user);
		user=userDao.get(User.class, user.getUsername());
		
		
		Assert.assertNotNull(user.getUpdatedDate());
		Assert.assertTrue(StringUtils.isNotEmpty(user.getUpdatedBy()));
		Assert.assertEquals("admin", user.getCreatedBy());
	}

}
