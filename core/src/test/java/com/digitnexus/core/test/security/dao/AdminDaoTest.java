package com.digitnexus.core.test.security.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.security.dao.AdminDao;
import com.digitnexus.core.test.BaseTransactionalTest;

public class AdminDaoTest extends BaseTransactionalTest {
	@Autowired
	private AdminDao adminDao;
	Organization root;
	Organization sub1;
	Organization sub2;
	Organization subsub2;
	Organization subsubsub2;

	@BeforeMethod(groups = { "unit" })
	public void initData() {
		root = new Organization();
		root.setId("Test1");
		root.setName("Test1");
		root.setCode("Code1");
		
		sub1 = new Organization();
		sub1.setId("Sub1");
		sub1.setName("Sub1");
		sub1.setCode("Code2");
		
		sub2 = new Organization();
		sub2.setId("Sub2");
		sub2.setName("Sub2");
		sub2.setCode("Code3");
		
		subsub2 = new Organization();
		subsub2.setId("subsub2");
		subsub2.setName("subsub2");
		subsub2.setCode("Code4");
		
		subsubsub2 = new Organization();
		subsubsub2.setId("subsubsub2");
		subsubsub2.setName("subsubsub2");
		subsubsub2.setCode("Code5");
		
		root.addSubOrganization(sub1);
		root.addSubOrganization(sub2);
		sub2.addSubOrganization(subsub2);
		adminDao.save(root);
		adminDao.save(sub1);
		adminDao.save(sub2);
		adminDao.save(subsub2);
		adminDao.save(subsubsub2);
		//adminDao.flush();
	}

	@Test(groups = { "unit" })
	public void isSubOrganization() {
		boolean borg = adminDao.isSubOrganization(root, subsub2);
		Assert.assertTrue(borg);
		boolean borg2 = adminDao.isSubOrganization(root, sub1);
		Assert.assertTrue(borg2);
		boolean bsub1 = adminDao.isSubOrganization(sub1, subsub2);
		Assert.assertTrue(!bsub1);
		boolean bsub2 = adminDao.isSubOrganization(sub1, sub2);
		Assert.assertTrue(!bsub2);
		boolean bsub3 = adminDao.isSubOrganization(sub1, sub1);
		Assert.assertTrue(!bsub3);
	}
	@Test(groups = { "unit" })
	public void isSubOrganizationDeathLoop() {
		sub1.addSubOrganization(root);
		adminDao.save(sub1);
		boolean bHashExp = false;
		try{
			boolean borg = adminDao.isSubOrganization(root, subsub2);
		} catch (IllegalArgumentException ex){
			bHashExp = true;
		}
		Assert.assertTrue(bHashExp);
	}

}
