/**
 * 
 */
package com.digitnexus.core.test.acl.dao;

import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.acl.dao.AccessControlDao;
import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.test.acl.BaseAccessControlTest;
import com.digitnexus.core.test.acl.TestAccessControlledObject;

/**
 * @author Santanu
 *
 */
public class AccessControlDaoTest extends BaseAccessControlTest {
	
	/**
	 * Test method for {@link AccessControlDao}.findAclExpressionByName method
	 */
	@Test(groups={"acl", "unit"})
	public void testFindAclExpressionByName() {
		AclExpression expression1 = createExpression("a_test_expression", 
				"TestAccessControlledObject.stringProperty='some_str'", "One test expression");
		
		AclExpression persistedExpression1 = accessControlDao.findAclExpressionByName("a_test_expression");
		Assert.assertEquals(persistedExpression1, expression1, "Retrived expression does not match the saved expression");
	}
	
	/**
	 * Test method for {@link AccessControlDao}.findAclExpressionsForCurrentUser method
	 */
	@Test(groups={"acl", "unit"})
	public void testFindAclExpressionsForCurrentUser() {
		//login as user1 and check the expressions
		login(user1);
		//search the constraint for READ operation..there should not be any
		List<AclExpression> expressions = accessControlDao.findAclExpressionsForCurrentUser(TestAccessControlledObject.class.getName(), 
				TestAccessControlledObject.class.getName(), UserOperation.READ);
		Assert.assertTrue(expressions.isEmpty(), "No expressions is there for READ operation for role1, but found some!");
		//now search for EDIT, there should be two
		expressions = accessControlDao.findAclExpressionsForCurrentUser(TestAccessControlledObject.class.getName(), 
				TestAccessControlledObject.class.getName(), UserOperation.EDIT);
		Assert.assertEquals(expressions.size(), 2, "Expected two expressions, but found " + expressions.size());
		//now check for CREATE, there is one
		expressions = accessControlDao.findAclExpressionsForCurrentUser(TestAccessControlledObject.class.getName(), 
				TestAccessControlledObject.class.getName(), UserOperation.CREATE);
		Assert.assertEquals(expressions.size(), 1, "Expected one expression, but found " + expressions.size());
	}
	
	/**
	 * Test method for {@link AccessControlDao}.findAclExpressionsForRoleAndPermission method
	 */
	@Test(groups={"acl", "unit"})
	public void testFindAclExpressionsForRoleAndPermission() {
		List<AclExpressionAssociation> readPrmissionsForRole1 = accessControlDao.findAclExpressionsForRoleAndPermission(
				TestAccessControlledObject.class.getName(), role1, readPermission);
		//should not get any entry
		Assert.assertEquals(readPrmissionsForRole1.size(), 0, "No ACL expression was associated, but found some");
		List<AclExpressionAssociation> editPrmissionsForRole1 = accessControlDao.findAclExpressionsForRoleAndPermission(
				TestAccessControlledObject.class.getName(), role1, editPermission);
		//should get 2
		Assert.assertEquals(editPrmissionsForRole1.size(), 2, "Two expressions expected, but got " + editPrmissionsForRole1.size());
		List<AclExpressionAssociation> readPrmissionsForRole2 = accessControlDao.findAclExpressionsForRoleAndPermission(
				TestAccessControlledObject.class.getName(), role2, readPermission);
		//should get 1
		Assert.assertEquals(readPrmissionsForRole2.size(), 1, "One expression expected, but got " + editPrmissionsForRole1.size());
	}
}
