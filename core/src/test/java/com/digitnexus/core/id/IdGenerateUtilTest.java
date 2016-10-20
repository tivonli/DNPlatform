package com.digitnexus.core.id;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.test.BaseTest;


public class IdGenerateUtilTest extends BaseTest {
	
	@Test(groups = { "unit" })
	public void generateStrId() {
		UnitTestDomain domain = new UnitTestDomain();
		domain.setName("unittest");
		
		String id = IdGenerateUtil.generateStrId(domain, UnitTestDomain.class.getName(), 6, "-", "DN", "${sys.date}", "${name}");
		Assert.assertNotNull(id);
		Assert.assertEquals(id.split("-").length, 4);
	}

}
