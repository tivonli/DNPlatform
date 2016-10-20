/**
 * 
 */
package com.digitnexus.core.test.acl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.service.AclExpressionParser;
import com.digitnexus.core.test.acl.BaseAccessControlTest;

/**
 * @author Santanu
 *
 */
public class AclExpressionParserTest extends BaseAccessControlTest {

	@Autowired
	private AclExpressionParser aclExpressionParser;
	
	@Test(groups={"acl", "unit"})
	public void testParseSimpleExpression() {
		ASTNode node = aclExpressionParser.parseAclExpression(aclExpression1);
		Assert.assertNotNull(node, "Expression should have been parsed");
	}
	
	@Test(groups={"acl", "unit"})
	public void testParseSimpleExpressionWithUser() {
		ASTNode node = aclExpressionParser.parseAclExpression(aclExpression2);
		Assert.assertNotNull(node, "Expression should have been parsed");
	}
	
	@Test(groups={"acl", "unit"})
	public void testParseMultiConditionExpression() {
		ASTNode node = aclExpressionParser.parseAclExpression(aclExpression3);
		Assert.assertNotNull(node, "Expression should have been parsed");
	}
	
	@Test(groups={"acl", "unit"})
	public void testParseMultiConditionExpressionWithUser() {
		ASTNode node = aclExpressionParser.parseAclExpression(aclExpression4);
		Assert.assertNotNull(node, "Expression should have been parsed");
	}
}
