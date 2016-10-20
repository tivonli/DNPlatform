package com.digitnexus.core.encrtypt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.CoreConstants;
import com.digitnexus.core.encrpt.EncryptProxy;


public class EncryptProxyTest {

	protected final Logger log = LoggerFactory.getLogger(getClass());

	private final static String msg = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><messages><sender>sender1</sender><readers><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader2</id><tags><tag><id>00000021</id><time>2011-12-12 11:11:11</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag><tag><id>00000022</id><time>2011-12-12 12:12:12</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader></readers></messages>";

	// private final static String msg =
	// "<?xml version=\"1.0\" encoding=\"UTF-8\"?><messages><sender>sender1</sender><readers><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader1</id><tags><tag><id>00000011</id><time>2011-11-11 11:11:11</time><s0>s0</s0><s1>s1</s1><s2>s2</s2><s3>s3</s3><s4>s4</s4><s5>s5</s5><s6>s6</s6><s7>s7</s7><s8>s8</s8><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader><reader><id>reader2</id><tags><tag><id>00000021</id><time>2011-12-12 11:11:11</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag><tag><id>00000022</id><time>2011-12-12 12:12:12</time><s0>s0</s0><s1/><s2/><s3/><s4/><s5/><s6/><s7/><s8/><s9>s9</s9><location><lng/><lat/><alt/><x/><y/><z/></location></tag></tags></reader></readers></messages>";

	@Test(groups = { "unit" })
	public void testTripleDes() throws Exception {

		String result = EncryptProxy.tripleDesEncrypt(msg,
				CoreConstants.DEFAULT_TRIPLE_DES_KEY_FILE);
		log.debug(result);
		result = EncryptProxy.tripleDesDecrypt(result, null);
		Assert.assertEquals(msg, result);
	}

	@Test(groups = { "unit" })
	public void testSha() throws Exception {
		String result = "password1{admin}";

		result = EncryptProxy.sha256Encrypt(result);

		log.debug(result);
		log.debug("9386cd8a06c2b4e70873fbbf21d3d6d9481beec0e5b8c55dfd42037200838138");
		Assert.assertEquals(
		        "9386cd8a06c2b4e70873fbbf21d3d6d9481beec0e5b8c55dfd42037200838138",
		        result);

	}
	
	@Test(groups = { "unit" })
	public void testMD5() throws Exception {
		String result = "";

		result = EncryptProxy.md5Encrypt("digitadmin@874");
		System.out.println(result);
		log.debug(result);
	
	}

}
