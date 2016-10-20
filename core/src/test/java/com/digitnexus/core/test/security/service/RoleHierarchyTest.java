/**
 * 
 */
package com.digitnexus.core.test.security.service;

import java.util.Iterator;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.ResourceType;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * @author Santanu
 *
 */
public class RoleHierarchyTest extends BaseTransactionalTest {
	@Autowired
	private EntityService   entityService;
	@Inject
	@Named("baseDao")
	private BaseDao	baseDao;
	
	private Organization organization;
	
	private Role role1;
	private Role role2;
	private Role role3;
	private Role role4;
	private Role role5;
	
	private Permission createEntity1;
	private Permission readEntity1;
	private Permission editEntity1;
	private Permission deleteEntity1;

	private Permission createEntity2;
	private Permission readEntity2;
	private Permission editEntity2;
	private Permission deleteEntity2;
	
	@BeforeMethod(groups={"unit"})
	public void setUp() {
		role1 = createRole("Role1", null, organization);
		role2 = createRole("Role2", role1, organization);
		role3 = createRole("Role3", role2, organization);
		role4 = createRole("Role4", role2, organization);
		role5 = createRole("Role5", role3, organization);
		
		createEntity1 = createPermission("Entity1", UserOperation.CREATE);
		readEntity1 = createPermission("Entity1", UserOperation.READ);
		editEntity1 = createPermission("Entity1", UserOperation.EDIT);
		deleteEntity1 = createPermission("Entity1", UserOperation.DELETE);

		createEntity2 = createPermission("Entity2", UserOperation.CREATE);
		readEntity2 = createPermission("Entity2", UserOperation.READ);
		editEntity2 = createPermission("Entity2", UserOperation.EDIT);
		deleteEntity2 = createPermission("Entity2", UserOperation.DELETE);
	}
	
	/**
	 * The diagram below shows the role hierarchy. In this test case we assign
	 *          Role1           permission to Role2 and Role5. The same should
	 *            |             reflect in their parents.
	 *            |
	 *          Role2
	 *            |
	 *    ________|________
	 *   |                 |
	 * Role3             Role4
	 *   |
	 *   |
	 * Role5
	 */
	@Test(groups={"unit"})
	public void testHierarchialPermissionAssignment() {
		role1.addPermission(createEntity1);
		role2.addPermission(editEntity1);
		role3.addPermission(deleteEntity1);
		role4.addPermission(readEntity2);
		role5.addPermission(readEntity1);
		
		entityService.saveOrUpdate(role1);
		entityService.saveOrUpdate(role2);
		entityService.saveOrUpdate(role3);
		entityService.saveOrUpdate(role4);
		entityService.saveOrUpdate(role5);
		
		baseDao.flush();
		baseDao.evict(role1);
		baseDao.evict(role2);
		baseDao.evict(role3);
		baseDao.evict(role4);
		baseDao.evict(role5);
		
		role5 = baseDao.load(Role.class, role5.getId());
		role4 = baseDao.load(Role.class, role4.getId());
		role3 = baseDao.load(Role.class, role3.getId());
		role2 = baseDao.load(Role.class, role2.getId());
		role1 = baseDao.load(Role.class, role1.getId());
		
		//role5 should have one permission
		Assert.assertEquals(role5.getPermissions().size(), 1, 
				"Role 5 should have been assigned just one permission");
		Assert.assertEquals(role5.getPermissions().iterator().next(), readEntity1, 
				"Role 5 should have been readEntity1 permission");
		
		//role4 should also have one permission
		Assert.assertEquals(role4.getPermissions().size(), 1, 
				"Role 4 should have been assigned just one permission");
		Assert.assertEquals(role4.getPermissions().iterator().next(), readEntity2, 
				"Role 4 should have been readEntity1 permission");
		
		//role3 should also have two permissions
		Assert.assertEquals(role3.getPermissions().size(), 2, 
				"Role 3 should have been assigned just one permission");
		Assert.assertTrue(role3.getPermissions().contains(readEntity1), 
				"Role 3 should have been readEntity1 permission");
		Assert.assertTrue(role3.getPermissions().contains(deleteEntity1), 
				"Role 3 should have been deleteEntity1 permission");
		
		//role2 should also have four permissions
		Assert.assertEquals(role2.getPermissions().size(), 4, 
				"Role 2 should have been assigned just four permissions");
		Assert.assertTrue(role2.getPermissions().contains(editEntity1), 
				"Role 2 should have been readEntity2 permission");
		Assert.assertTrue(role2.getPermissions().contains(readEntity2), 
				"Role 2 should have been readEntity2 permission");
		Assert.assertTrue(role2.getPermissions().contains(readEntity1), 
				"Role 2 should have been readEntity1 permission");
		Assert.assertTrue(role2.getPermissions().contains(deleteEntity1), 
				"Role 2 should have been deleteEntity1 permission");
		
		//role1 should also have five permissions
		Assert.assertEquals(role1.getPermissions().size(), 5, 
				"Role 1 should have been assigned just three permissions");
		Assert.assertTrue(role1.getPermissions().contains(createEntity1), 
				"Role 1 should have been readEntity2 permission");
		Assert.assertTrue(role1.getPermissions().contains(editEntity1), 
				"Role 1 should have been readEntity2 permission");
		Assert.assertTrue(role1.getPermissions().contains(readEntity2), 
				"Role 1 should have been readEntity2 permission");
		Assert.assertTrue(role1.getPermissions().contains(readEntity1), 
				"Role 1 should have been readEntity1 permission");
		Assert.assertTrue(role1.getPermissions().contains(deleteEntity1), 
				"Role 1 should have been deleteEntity1 permission");
	}
	
	/**
	 * The diagram below shows the role hierarchy. In this test case we assign
	 *          Role1           and delete permissions to different roles. The 
	 *            |             same should reflect in their parents whenever
	 *            |             applicable.
	 *          Role2
	 *            |
	 *    ________|________
	 *   |                 |
	 * Role3             Role4
	 *   |
	 *   |
	 * Role5
	 */
	@Test(groups={"unit"})
	public void testHierarchialPermissionDelete() {
		role1.addPermission(createEntity1);
		role2.addPermission(editEntity1);
		role3.addPermission(deleteEntity1);
		role4.addPermission(readEntity2);
		role5.addPermission(readEntity1);
		
		entityService.saveOrUpdate(role1);
		entityService.saveOrUpdate(role2);
		entityService.saveOrUpdate(role3);
		entityService.saveOrUpdate(role4);
		entityService.saveOrUpdate(role5);
		
		//now add some extra which will be deleted later
		role5.addPermission(createEntity2);
		role4.addPermission(createEntity2);
		role4.addPermission(editEntity2);
		
		entityService.saveOrUpdate(role5);
		entityService.saveOrUpdate(role2);
		entityService.saveOrUpdate(role4);
		
		baseDao.flush();
		baseDao.evict(role1);
		baseDao.evict(role2);
		baseDao.evict(role3);
		baseDao.evict(role4);
		baseDao.evict(role5);
		
		role5 = baseDao.load(Role.class, role5.getId());
		role4 = baseDao.load(Role.class, role4.getId());
		role3 = baseDao.load(Role.class, role3.getId());
		role2 = baseDao.load(Role.class, role2.getId());
		role1 = baseDao.load(Role.class, role1.getId());
		
		//verify role5, 3, 2, 1 for permissions
		//role5 should have two permissions
		Assert.assertEquals(role5.getPermissions().size(), 2, 
				"Role 5 should have been assigned two permissions");
		Assert.assertTrue(role5.getPermissions().contains(readEntity1), 
				"Role 5 should have been assigned readEntity1 permission");
		Assert.assertTrue(role5.getPermissions().contains(createEntity2), 
				"Role 5 should have been assigned createEntity2 permission");
		
		//role3 should also have three permissions
		Assert.assertEquals(role3.getPermissions().size(), 3, 
				"Role 3 should have been assigned three permissions");
		Assert.assertTrue(role3.getPermissions().contains(readEntity1), 
				"Role 3 should have been assigned readEntity1 permission");
		Assert.assertTrue(role3.getPermissions().contains(deleteEntity1), 
				"Role 3 should have been assigned deleteEntity1 permission");
		Assert.assertTrue(role3.getPermissions().contains(createEntity2), 
				"Role 3 should have been assigned createEntity2 permission");
		
		//role2 should also have six permissions
		Assert.assertEquals(role2.getPermissions().size(), 6, 
				"Role 2 should have been assigned six permissions");
		Assert.assertTrue(role2.getPermissions().contains(createEntity2), 
				"Role 2 should have been assigned createEntity2 permission");
		Assert.assertTrue(role2.getPermissions().contains(editEntity2), 
				"Role 2 should have been assigned editEntity2 permission");
		
		//role1 should also have five permissions
		Assert.assertEquals(role1.getPermissions().size(), 7, 
				"Role 1 should have been assigned seven permissions");
		Assert.assertTrue(role1.getPermissions().contains(createEntity2), 
				"Role 1 should have been assigned createEntity2 permission");
		Assert.assertTrue(role1.getPermissions().contains(editEntity2), 
				"Role 1 should have been assigned editEntity2 permission");
				
		//remove createEntity2 from role5
		Set<Permission> permissions = role5.getPermissions();
		for (Iterator<Permission> permissionItr = permissions.iterator(); permissionItr.hasNext();) {
			Permission permission = permissionItr.next();
			if (createEntity2.equals(permission)) {
				permissionItr.remove();
				break;
			}
		}
		entityService.saveOrUpdate(role5);
		
		//this should impact 5 and 3, but should not impact 2 and 1
		Assert.assertEquals(role5.getPermissions().size(), 1, 
				"Role 5 should have been assigned just one permission");
		Assert.assertFalse(role5.getPermissions().contains(createEntity2), 
				"Role 5 should not have been assigned createEntity2 permission");
		
		//role3 should also have three permissions
		Assert.assertEquals(role3.getPermissions().size(), 2, 
				"Role 3 should have been assigned two permissions");
		Assert.assertTrue(role3.getPermissions().contains(readEntity1), 
				"Role 3 should have been assigned readEntity1 permission");
		Assert.assertTrue(role3.getPermissions().contains(deleteEntity1), 
				"Role 3 should have been assigned deleteEntity1 permission");
		Assert.assertFalse(role3.getPermissions().contains(createEntity2), 
				"Role 3 should not have been assigned createEntity2 permission");
		
		//role2 should remain unchanged
		Assert.assertEquals(role2.getPermissions().size(), 6, 
				"Role 2 should have been assigned six permissions");
		Assert.assertTrue(role2.getPermissions().contains(createEntity2), 
				"Role 2 should have been assigned createEntity2 permission");
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
	
	protected Role createRole(String name, Role parent, Organization organization) {
		Role role = new Role();
		role.setName(name);
		role.setClientID("tenant1");
		role.setOrganization(organization);
		role.setParentRole(parent);
		entityService.saveOrUpdate(role);
		return role;
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
}
