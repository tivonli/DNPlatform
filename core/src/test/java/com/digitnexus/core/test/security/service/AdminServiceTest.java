package com.digitnexus.core.test.security.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.ResourceType;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.security.service.AdminService;
import com.digitnexus.core.test.BaseTransactionalTest;

public class AdminServiceTest extends BaseTransactionalTest {
	@Autowired
	private AdminService	adminService;
	@Autowired
	private EntityService   entityService;

	@Test(groups = { "unit" })
	public void getSecuredResources() {
		Permission permission = new Permission();
		permission.setName("test");
		permission.setUserOperation(UserOperation.CREATE);
		permission.setResource("test");
		permission.setResourceType(ResourceType.ENTITY);
		permission.setClientID("test");
		entityService.saveOrUpdate(permission);
		
		Set<String> securedResource=adminService.getSecuredResources();
		Assert.assertTrue(securedResource.contains("test"));
	}
	
	@Test(groups = { "unit" })
	public void isPermissionDefined() {
		Permission permission = new Permission();
		permission.setName("test");
		permission.setUserOperation(UserOperation.CREATE);
		permission.setResource("test");
		permission.setResourceType(ResourceType.ENTITY);
		permission.setClientID("test");
		entityService.saveOrUpdate(permission);
		Assert.assertTrue(adminService.isPermissionDefined("test", UserOperation.CREATE));
		Assert.assertFalse(adminService.isPermissionDefined("test", UserOperation.DELETE));
	}
	
	@Test(groups = { "unit" })
	public void getPermissionByName() {
		Permission permission = new Permission();
		permission.setName("test");
		permission.setUserOperation(UserOperation.CREATE);
		permission.setResource("test");
		permission.setResourceType(ResourceType.ENTITY);
		permission.setClientID("test");
		entityService.saveOrUpdate(permission);
		Assert.assertEquals(adminService.getPermissionByName("test"), permission);
	}
	
	@Test(groups = { "unit" })
	public void getRoleByName() {
		Role role=new Role("test");
		entityService.saveOrUpdate(role);
		Assert.assertEquals(adminService.getRoleByName("test"), role);
	}

}
