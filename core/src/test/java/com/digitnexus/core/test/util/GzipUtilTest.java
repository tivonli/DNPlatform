package com.digitnexus.core.test.util;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.util.GzipUtil;

public class GzipUtilTest {
	protected final Logger	log	= LoggerFactory.getLogger(getClass());
	@Test(groups = { "unit" })
	public void testgzip() {
//		String msg = "<return><![CDATA[<message-list><sender>reader-controller1</sender><timestamp>2011-12-12</timestamp><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry-gate2</reader-id><timestamp>2011-12-10</timestamp><tag><tagId>22</tagId><tagName>gate2-tag2</tagName><statusCode>normal</statusCode><width>4</width><height>4</height><length>4</length><volumn>40</volumn></tag><tag><tagId>21</tagId><tagName>gate2-tag1</tagName><statusCode>maintaining</statusCode><width>3</width><height>3</height><length>3</length><volumn>30</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message><message><reader-id>inbound-entry@gate1</reader-id><timestamp>2011-12-11</timestamp><tag><tagId>11</tagId><tagName>gate1-tag1</tagName><statusCode>normal</statusCode><width>2</width><height>2</height><length>2</length><volumn>20</volumn></tag></message></message-list>]]></return>";
		String msg = " <?xml version=\"1.0\" encoding=\"UTF-8\"?><messages><sender>sender1</sender><readers><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader2</id><tags><tag><id>00000021</id><time>2011-12-12 11:11:11</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag><tag><id>00000022</id><time>2011-12-12 12:12:12</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader></readers></messages>";
		String gzipStr;
		try {
			gzipStr = GzipUtil.zip(msg);
			log.debug(gzipStr);
//			Assert.assertTrue(gzipStr.length() < msg.length());
			String unzipStr = GzipUtil.unzip(gzipStr);
			log.debug(unzipStr);
			Assert.assertEquals(msg, unzipStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		
	}
}
