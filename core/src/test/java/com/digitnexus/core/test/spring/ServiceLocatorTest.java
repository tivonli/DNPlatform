package com.digitnexus.core.test.spring;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.security.dao.UserDao;
import com.digitnexus.core.spring.ServiceLocator;
import com.digitnexus.core.test.BaseTest;

public class ServiceLocatorTest extends BaseTest {
	
	@Test(groups = { "unit" })
	public void getServiceWithInterfaceAsArg(){
		Class<?> classz=null;
		Assert.assertNull(ServiceLocator.getService(classz));
		Assert.assertNotNull(ServiceLocator.getService(UserDao.class));
	}
	
	@Test(groups = { "unit" })
	public void getServiceWithBeanNameAsArg(){
		Assert.assertNull(ServiceLocator.getService("aServiceWhichIsNotSupposedToExist"));
		Assert.assertNotNull(ServiceLocator.getService("baseDao"));
	}
	
	@Test(groups = { "unit" })
	public void getServiceWithBeanNameAndRequiredTypeAsArgs(){
		Assert.assertNotNull(ServiceLocator.getService("baseDao",BaseDao.class));
	}

}
