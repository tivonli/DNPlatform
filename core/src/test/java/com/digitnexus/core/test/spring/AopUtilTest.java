package com.digitnexus.core.test.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.ResourceType;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.spring.AOPUtil;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.dataobjects.Asset;


public class AopUtilTest extends BaseTransactionalTest {
	@Autowired
	private BaseDao baseDao;
	@Autowired
	private EntityService entityService;
	
	@Test(groups = { "unit" })
	public void getTarget(){
		Permission permission = new Permission();
		permission.setName("test");
		permission.setUserOperation(UserOperation.READ);
		permission.setResource(Asset.class.getName());
		permission.setResourceType(ResourceType.ENTITY);
		permission.setClientID("test");
		entityService.saveOrUpdate(permission);
		try{
			baseDao.get(Asset.class,1l);
			Assert.fail();
		}catch(AccessDeniedException accessDeniedException){
			
		}
		
		BaseDao unproxiedBaseDao=(BaseDao) AOPUtil.getTarget(baseDao);
		
		try{
			unproxiedBaseDao.get(Asset.class,1l);
		}catch(AccessDeniedException accessDeniedException){
			Assert.fail();
		}
		
		Assert.assertEquals(AOPUtil.getTarget(unproxiedBaseDao), unproxiedBaseDao);
		
	}

}
