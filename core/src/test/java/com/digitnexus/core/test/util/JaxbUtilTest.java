package com.digitnexus.core.test.util;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.util.JaxbUtil;

public class JaxbUtilTest {
	
	@Test(groups = { "unit" })
	public void testTransformer() throws Exception {
		String message = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><TestBean><evt_id>id</evt_id><src_ip>localhost</src_ip><ant>ant</ant></TestBean>";
		
		JaxbTestBean bean = new JaxbTestBean();
		bean.setEvtId("id");
		bean.setSrcIp("localhost");
		bean.setAnt("ant");
		
		String xml = JaxbUtil.marshal(bean, bean.getClass());
		Assert.assertEquals(xml, message);
		
		JaxbTestBean newBean = (JaxbTestBean)JaxbUtil.unmarshal(xml, JaxbTestBean.class);
		
		Assert.assertEquals(newBean.getEvtId(), bean.getEvtId());
		Assert.assertEquals(newBean.getAnt(), bean.getAnt());
		Assert.assertEquals(newBean.getSrcIp(), bean.getSrcIp());
	}
}
