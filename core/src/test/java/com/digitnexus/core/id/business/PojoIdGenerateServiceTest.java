package com.digitnexus.core.id.business;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.id.UnitTestDomain;
import com.digitnexus.core.id.domain.PojoId;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.util.ConfigUtil;

public class PojoIdGenerateServiceTest extends BaseTest {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private PojoIdGenerateServiceImpl generator;

	 @Test(groups = { "unit" })
	public void getIdList() {
		int minQuantity = ConfigUtil.getConfig().getInt(
		        "core.pojoId.minQuantity");
		PojoId info = new PojoId();
		info.setItem(UnitTestDomain.class.getName());
		info.setQuantity(minQuantity - 2);
		info.setLength(6);

		List<Long> list1 = generator.generateIdList(info);
		// make sure there is no duplicate value
		Set<Long> set1 = new HashSet<Long>(list1);
		Assert.assertEquals(info.getQuantity(), set1.size());

		info.setQuantity(minQuantity + 2);
		List<Long> list2 = generator.generateIdList(info);
		Set<Long> set2 = new HashSet<Long>(list2);
		Assert.assertEquals(info.getQuantity(), set2.size());

	}

	@Test(groups = { "unit" })
	public void getSingleId() {
		PojoId info = new PojoId();
		info.setItem(UnitTestDomain.class.getName());
		info.setLength(6);

		// for (int i = 0; i < 100; i++) {
		long id1 = generator.generateId(info);
		long id2 = generator.generateId(info);

		log.info("" + id1);
		log.info("" + id2);
		// }
		Assert.assertEquals(id1 + 1, id2);
	}

}
