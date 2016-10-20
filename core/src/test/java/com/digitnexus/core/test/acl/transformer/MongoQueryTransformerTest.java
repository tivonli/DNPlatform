/**
 * 
 */
package com.digitnexus.core.test.acl.transformer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformerFactory;
import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.service.AclExpressionParser;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.test.acl.BaseAccessControlTest;
import com.digitnexus.core.test.acl.TestAccessControlledMongoObject;

/**
 * @author Santanu
 *
 */
public class MongoQueryTransformerTest extends BaseAccessControlTest {

	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private AclExpressionParser aclExpressionParser;
	
	protected Permission nosqlReadPermission;
	protected Permission nosqlEditPermission;
	protected Permission nosqlCreatePermission;
	protected Permission nosqlDeletePermission;
	protected AclExpression mongoAclExpression1;
	protected AclExpression mongoAclExpression2;
	protected AclExpression mongoAclExpression3;
	
	@BeforeMethod(groups={"acl", "unit"})
	public void setUp() {
		super.setUp();
		//these are the permissions..cant get more than this
		nosqlCreatePermission = createPermission(TestAccessControlledMongoObject.class.getName(), UserOperation.CREATE);
		nosqlEditPermission = createPermission(TestAccessControlledMongoObject.class.getName(), UserOperation.EDIT);
		nosqlDeletePermission = createPermission(TestAccessControlledMongoObject.class.getName(), UserOperation.DELETE);
		nosqlReadPermission = createPermission(TestAccessControlledMongoObject.class.getName(), UserOperation.READ);
		//now assign permissions to roles
		//role4 can do everything
		assignPermission(role4, nosqlReadPermission);
		assignPermission(role4, nosqlEditPermission);
		assignPermission(role4, nosqlCreatePermission);
		assignPermission(role4, nosqlDeletePermission);
				
		mongoAclExpression1 = createExpression("first_mongo_acl_expression", 
				"TestAccessControlledMongoObject.stringProperty='some_str'", "One mongo test expression");
		mongoAclExpression2 = createExpression("second_mongo_acl_expression", 
				"TestAccessControlledMongoObject.stringProperty='some_str' and TestAccessControlledMongoObject.longProperty = 21", "Two mongo test expression");
		mongoAclExpression3 = createExpression("third_mongo_acl_expression", 
				"TestAccessControlledMongoObject.updatedBy = this_user.username", "Three mongo test expression");
		//now create some really convoluted expression associations for role 4
		associateAclExpression(TestAccessControlledMongoObject.class.getName(), mongoAclExpression1, nosqlReadPermission, role4);
		associateAclExpression(TestAccessControlledMongoObject.class.getName(), mongoAclExpression2, nosqlEditPermission, role4);
		associateAclExpression(TestAccessControlledMongoObject.class.getName(), mongoAclExpression2, nosqlDeletePermission, role4);
		
	}
	
	@Test(groups={"acl", "unit"})
	public void testMongoQueryTransformer() {
		ASTNode astNode = aclExpressionParser.parseAclExpression(mongoAclExpression1);
		
		Query query=new Query();
		query.addCriteria(Criteria.where("doubleProperty").is(12.6)); 
		
		AclExpressionTransformer<Query> transformer = AclExpressionTransformerFactory.getSearchCriteriaTransformer(query);
		transformer.transform(astNode, query);
		
		mongoTemplate.find(query, TestAccessControlledMongoObject.class);
	}
	
	@Test(groups={"acl", "unit"})
	public void testMongoQueryTransformerWithRelationalOperator() {
		ASTNode astNode = aclExpressionParser.parseAclExpression(mongoAclExpression2);
		
		Query query=new Query();
		query.addCriteria(Criteria.where("doubleProperty").is(12.6)); 
		
		AclExpressionTransformer<Query> transformer = AclExpressionTransformerFactory.getSearchCriteriaTransformer(query);
		transformer.transform(astNode, query);
		
		mongoTemplate.find(query, TestAccessControlledMongoObject.class);
	}
	
	@Test(groups={"acl", "unit"})
	public void testMongoQueryTransformerWithUser() {
		login(user4);
		
		ASTNode astNode = aclExpressionParser.parseAclExpression(mongoAclExpression3);
		
		Query query=new Query();
		query.addCriteria(Criteria.where("doubleProperty").is(12.6)); 
		
		AclExpressionTransformer<Query> transformer = AclExpressionTransformerFactory.getSearchCriteriaTransformer(query);
		transformer.transform(astNode, query);
		
		mongoTemplate.find(query, TestAccessControlledMongoObject.class);
	}
}
