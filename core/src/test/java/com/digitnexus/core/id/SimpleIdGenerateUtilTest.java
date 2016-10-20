package com.digitnexus.core.id;

import org.testng.annotations.Test;


public class SimpleIdGenerateUtilTest {
	
	@Test(groups = { "unit" }, invocationCount = 20, threadPoolSize=5)
	public void generateStrId() {
		String id = SimpleIdGenerateUtil.generateId();
		System.out.println(id);
	}

}
