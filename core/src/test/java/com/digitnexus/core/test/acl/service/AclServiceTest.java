/**
 * 
 */
package com.digitnexus.core.test.acl.service;

import java.util.Arrays;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.acl.service.AclService;
import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.dao.query.HQLQuery;
import com.digitnexus.core.dao.query.Root;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.test.acl.BaseAccessControlTest;
import com.digitnexus.core.test.acl.TestAccessControlledObject;
import com.digitnexus.core.util.DataFormatUtil;

/**
 * @author Santanu
 *
 */
public class AclServiceTest extends BaseAccessControlTest {
	@Autowired
	private AclService aclService;
	@Autowired
	private BaseDao baseDao;
	
	@Test(groups={"acl", "unit"})
	public void testApplyAclExpressionSimple() {
		login(user1);
		Root root = Root.create(TestAccessControlledObject.class, StringUtils.uncapitalize(TestAccessControlledObject.class.getSimpleName()));
		root.createCondition()
		    .eq("doubleProperty", 12.4);
		HQLQuery query = new HQLQuery(baseDao.getSession())
							.from(root);
		HQLQuery transformedQuery = aclService.applyAclExpression(TestAccessControlledObject.class.getName(), 
										TestAccessControlledObject.class.getName(), UserOperation.CREATE, query);
		Assert.assertNotNull(transformedQuery, "Query should have been merged with the expression");
	}
	
	@Test(groups={"acl", "unit"})
	public void testSaveAclAssignments() {
		String[] jsonStrings = {newAclExpressionAssociationJson(DataFormatUtil.formatNumber(role1.getId()), readPermission.getName()),
				newAclExpressionAssociationJson(DataFormatUtil.formatNumber(role2.getId()), readPermission.getName()),
				newAclExpressionAssociationJson(DataFormatUtil.formatNumber(role4.getId()), readPermission.getName())};
		String jsonString = Arrays.toString(jsonStrings);
		
		aclService.saveAclAssignments(DataFormatUtil.formatNumber(aclExpression4.getId()), jsonString);
	}
	
	private String newAclExpressionAssociationJson(String roleId, String permissionName) {
		String jsonString = "{\"role\":{\"id\":\"" + roleId + "\"},\"permission\":{\"name\":\"" + permissionName + "\"}}";
		return jsonString;
	}
}
