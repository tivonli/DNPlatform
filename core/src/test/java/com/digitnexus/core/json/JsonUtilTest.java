package com.digitnexus.core.json;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.User;

public class JsonUtilTest {
	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" })
	public void testMap() {
		Map<String, String> headers1 = new HashMap<String, String>();
		headers1.put("key", "value");
		String json = JsonUtil.toJson(headers1);
		Assert.assertEquals(json, "{\"key\":\"value\"}");

		Map<String, Object> headers2 = JsonUtil.toObject(json, Map.class);
		Assert.assertEquals(headers2.get("key"), headers1.get("key"));

		Map<String, List<String>> map = new HashMap<String, List<String>>();
		List<String> list = new ArrayList<String>();
		list.add("1");
		list.add("2");
		map.put("test", list);
//		System.out.println(JsonUtil.toJson(map));
	}

	@Test(groups = { "unit" })
	public void testObjects() {
		User tony = new User();
		tony.setUsername("tony");
		User pony = new User();
		pony.setUsername("tony");
		Organization o = new Organization();
		o.setName("sale dept");
		pony.setOrganization(o);
		User[] users1 = { tony, pony };
		String json = JsonUtil.toJson(Arrays.asList(users1));

		List<User> users2 = JsonUtil.toList(json, User.class);

		Assert.assertEquals(users2.size(), users1.length);
		Assert.assertEquals(users2.get(0).getUsername(),
		        users1[0].getUsername());

//		System.out.println(json);
	}

	@Test(groups = { "unit" })
	public void testConvert() {
		AB ab = new AB();
		ab.setA("a");
		ab.setAb("ab");
		String json = JsonUtil.toJson(ab);
//		System.out.println(json);
		
		A a = JsonUtil.toObject(json, AB.class);
		Assert.assertTrue(a instanceof AB);
	}
}
