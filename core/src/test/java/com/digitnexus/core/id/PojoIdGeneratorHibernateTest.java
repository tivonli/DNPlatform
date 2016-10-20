package com.digitnexus.core.id;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

public class PojoIdGeneratorHibernateTest extends BaseTransactionalTest {//extends AbstractJUnit4SpringContextTests BaseTransactionalTest {

	@Autowired
	private EntityService service;
	
	@Test(groups = { "unit" })
	public void getId() {
		UnitTestDomain domain = new UnitTestDomain();
		domain.setName("unittest");
		service.saveOrUpdate(domain);
		Assert.assertNotNull(domain.getId());
		Assert.assertEquals(domain.getId().split("-").length, 4);
	}
}
