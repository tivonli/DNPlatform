/**
 * 
 */
package com.digitnexus.core.test.acl;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.testng.annotations.BeforeMethod;

import com.digitnexus.core.acl.dao.AccessControlDao;
import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.ResourceType;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * Base test for ACL with some default and fairly complex data preparation
 * @author Santanu
 */
public abstract class BaseAccessControlTest extends BaseTransactionalTest {
	
	@Autowired
	protected AccessControlDao accessControlDao;
	@Autowired
	protected EntityService entityService;
	
	//data related to the tests
	protected Organization organization;
	protected Role role1;
	protected Role role2;
	protected Role role3;
	protected Role role4;
	protected User user1;
	protected User user2;
	protected User user3;
	protected User user4;
	protected Permission readPermission;
	protected Permission editPermission;
	protected Permission createPermission;
	protected Permission deletePermission;
	protected AclExpression aclExpression1;
	protected AclExpression aclExpression2;
	protected AclExpression aclExpression3;
	protected AclExpression aclExpression4;
	
	@BeforeMethod(groups={"acl", "unit"})
	public void setUp() {
		//this is the most common data...
		organization = createOrganization();
		//create a set of roles
		role1 = createRole("role1", organization);
		role2 = createRole("role2", organization);
		role3 = createRole("role3", organization);
		role4 = createRole("role4", organization);
		//these are the permissions..cant get more than this
		createPermission = createPermission(TestAccessControlledObject.class.getName(), UserOperation.CREATE);
		editPermission = createPermission(TestAccessControlledObject.class.getName(), UserOperation.EDIT);
		deletePermission = createPermission(TestAccessControlledObject.class.getName(), UserOperation.DELETE);
		readPermission = createPermission(TestAccessControlledObject.class.getName(), UserOperation.READ);
		//now assign permissions to roles
		//role1 can do everything
		assignPermission(role1, readPermission);
		assignPermission(role1, editPermission);
		assignPermission(role1, createPermission);
		assignPermission(role1, deletePermission);
		//role2 can do read and write
		assignPermission(role2, readPermission);
		assignPermission(role2, editPermission);
		//role3 can do read
		assignPermission(role3, readPermission);
		//role4 can't do anything
		
		//create some expressions..
		//a simple expression
		aclExpression1 = createExpression("first_expression", 
				"TestAccessControlledObject.stringProperty='some_str'", "One test expression");
		//an expression with user in it
		aclExpression2 = createExpression("second_expression", 
				"TestAccessControlledObject.stringProperty='some_str' and this_user.name=TestAccessControlledObject.createdBy", "Another test expression");
		//an expression with multiple conditions
		aclExpression3 = createExpression("third_expression", 
				"TestAccessControlledObject.stringProperty='some_str' and TestAccessControlledObject.longProperty=5", "Yet another test expression");
		//an expression with user and multiple conditions
		aclExpression4 = createExpression("fourth_expression", 
				"TestAccessControlledObject.stringProperty='some_str' and TestAccessControlledObject.longProperty=5  and this_user.name=TestAccessControlledObject.createdBy", "One more test expression");
		
		//now create some really convoluted expression associations
		//first for role 1
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression1, editPermission, role1);
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression4, editPermission, role1);
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression2, createPermission, role1);
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression3, deletePermission, role1);
		//then for role 2
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression2, editPermission, role2);
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression1, readPermission, role2);
		//no expression for role 3
		//another for role 4
		associateAclExpression(TestAccessControlledObject.class.getName(), aclExpression4, readPermission, role4);
		
		//now create some users
		user1 = createUser("testUser1", organization);
		assignRole(user1, role1);
		user2 = createUser("testUser2", organization);
		assignRole(user2, role2);
		user3 = createUser("testUser3", organization);
		assignRole(user3, role3);
		user4 = createUser("testUser4", organization);
		assignRole(user4, role4);
	}
	
	protected void login(User user){
		SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken(user, null));
	}
	
	protected Organization createOrganization() {
		Organization org = new Organization();
		org.setName("unit-test-org");
		org.setCode("UTO");
		org.setId("UTO");
		org.setClientID("tenant1");
		entityService.saveOrUpdate(org);
		return org;
	}
	
	protected Role createRole(String name, Organization organization) {
		Role role = new Role();
		role.setName(name);
		role.setClientID("tenant1");
		role.setOrganization(organization);
		entityService.saveOrUpdate(role);
		return role;
	}
	
	protected User createUser(String userName, Organization organization) {
		User user=new User();
		user.setUsername(userName);
		user.setClientID("tenant1");
		user.setPassword("password1");
		user.setEmail(userName + "test@test.com");
		user.setFullName("test");
		user.setOrganization(organization);
		user.setLocale(Locale.US);
		user.setPassword("password1");
		entityService.saveOrUpdate(user);
		return user;
	}

	protected Permission createPermission(String entityName, UserOperation operation) {
		Permission permission = new Permission();
		permission.setName(entityName + "." + operation.name());
		permission.setUserOperation(operation);
		permission.setResource(entityName);
		permission.setResourceType(ResourceType.ENTITY);
		permission.setClientID("tenant1");
		entityService.saveOrUpdate(permission);
		return permission;
	}
	
	protected void assignPermission(Role role, Permission permission) {
		role.addPermission(permission);
		entityService.saveOrUpdate(role);
	}
	
	protected void assignRole(User user, Role role) {
		user.addRole(role);
		entityService.saveOrUpdate(user);
	}
	
	protected AclExpression createExpression(String name, String expressionString, String description) {
		AclExpression expression = new AclExpression();
		expression.setName(name);
		expression.setDescription(description);
		expression.setExpression(expressionString);
		
		accessControlDao.save(expression);
		
		return expression;
	}
	
	protected AclExpressionAssociation associateAclExpression(String resource, AclExpression aclExpression, Permission permission, Role role) {
		AclExpressionAssociation association = new AclExpressionAssociation();
		association.setAclExpression(aclExpression);
		association.setPermission(permission);
		association.setRole(role);
		association.setResource(resource);
		
		accessControlDao.save(association);
		
		return association;
	}
}
