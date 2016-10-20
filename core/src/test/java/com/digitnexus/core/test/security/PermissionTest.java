package com.digitnexus.core.test.security;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.test.BaseTest;

public class PermissionTest extends BaseTest {
	
	@Test(groups = { "unit" })
	public void toStringTest(){
		Permission permission=new Permission();
		permission.setUserOperation(UserOperation.CREATE);
		permission.setResource("testResource");
		
		Assert.assertTrue( permission.toString().equals(UserOperation.CREATE+":testResource"));
		
	}

}
