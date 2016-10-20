package com.digitnexus.core.test.security.aop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * Testing AuthoirzationAspect. All the data used here is dummy
 * @author Adi
 *
 */
public class AuthorizationAspectTest extends BaseTransactionalTest {
	@Autowired
	private EntityService	entityService;
	@Autowired
	private SecuredService	securedService;
	private Role			authorizedRole;
	private Authentication	authorizedUserAuthentication;
	private Authentication	unAuthorizedUserAuthentication;
	private Permission		readPermission;

	@BeforeMethod(alwaysRun=true)
	public void setUp() {

		authorizedRole = new Role("authorized");
		Role otherRole = new Role("otherRole");

		User authorizedUser = getUserObject();
		authorizedUser.addRole(authorizedRole);

		User unauthorizedUser = getUserObject();
		unauthorizedUser.addRole(otherRole);

		Permission permission = new Permission();
		permission.setName("READ_PERMISSION");
		permission.setResource(SecuredEntity.class.getName());
		permission.setUserOperation(UserOperation.READ);
		entityService.saveOrUpdate(permission);

		//This permission with be used for testing CreateEditAnnotaion
		readPermission = permission;

		authorizedRole.addPermission(permission);
		//Edit
		permission = new Permission();
		permission.setName("EDIT_PERMISSION");
		permission.setResource(SecuredEntity.class.getName());
		permission.setUserOperation(UserOperation.EDIT);
		authorizedRole.addPermission(permission);
		entityService.saveOrUpdate(permission);

		//Create
		permission = new Permission();
		permission.setName("CREATE_PERMISSION");
		permission.setResource(SecuredEntity.class.getName());
		permission.setUserOperation(UserOperation.CREATE);
		authorizedRole.addPermission(permission);
		entityService.saveOrUpdate(permission);

		//DELETE
		permission = new Permission();
		permission.setName("DELETE_PERMISSION");
		permission.setResource(SecuredEntity.class.getName());
		permission.setUserOperation(UserOperation.DELETE);
		authorizedRole.addPermission(permission);
		entityService.saveOrUpdate(permission);

		//Create permission for permission,inception?
		permission = new Permission();
		permission.setName("EDIT_PERMISSION_PERMISSION");
		permission.setResource(Permission.class.getName());
		permission.setUserOperation(UserOperation.EDIT);
		entityService.saveOrUpdate(permission);
		otherRole.addPermission(permission);
		
		permission = new Permission();
		permission.setName("CREATE_PERMISSION_PERMISSION");
		permission.setResource(Permission.class.getName());
		permission.setUserOperation(UserOperation.CREATE);
		entityService.saveOrUpdate(permission);
		authorizedRole.addPermission(permission);

		authorizedUserAuthentication = new TestingAuthenticationToken(authorizedUser, null);
		unAuthorizedUserAuthentication = new TestingAuthenticationToken(unauthorizedUser, null);

	}

	@Test(expectedExceptions = {AccessDeniedException.class},groups = { "unit" })
	public void checkReadAccess() {
		setAuthenticationInSecurityContext(authorizedUserAuthentication);
		SecuredEntity securedEntity = new SecuredEntity();
		try {
			securedService.checkRead(securedEntity);
			Assert.assertTrue(securedEntity.isRead());
			//Test permission without resource name
			securedService.checkReadWithoutResource(null, securedEntity);
			securedService.checkReadWithoutResourceClass(SecuredEntity.class, securedEntity);

		} catch (AccessDeniedException accessDeniedException) {
			Assert.fail();
		}

		setAuthenticationInSecurityContext(unAuthorizedUserAuthentication);
		securedService.checkRead(securedEntity);
	}

	@Test(expectedExceptions = {AccessDeniedException.class},groups = { "unit" })
	public void checkEditAccess() {
		setAuthenticationInSecurityContext(authorizedUserAuthentication);
		SecuredEntity securedEntity = new SecuredEntity();
		try {
			securedService.checkEdit(securedEntity);
			Assert.assertTrue(securedEntity.isEdited());
		} catch (AccessDeniedException accessDeniedException) {
			Assert.fail();
		}

		setAuthenticationInSecurityContext(unAuthorizedUserAuthentication);
		securedService.checkEdit(securedEntity);
	}

	@Test(expectedExceptions = {AccessDeniedException.class},groups = { "unit" })
	public void checkCreateAccess() {
		setAuthenticationInSecurityContext(authorizedUserAuthentication);
		SecuredEntity securedEntity = new SecuredEntity();
		try {
			securedService.checkCreate(securedEntity);
			Assert.assertTrue(securedEntity.isCreated());
		} catch (AccessDeniedException accessDeniedException) {
			Assert.fail();
		}

		setAuthenticationInSecurityContext(unAuthorizedUserAuthentication);
		securedService.checkCreate(securedEntity);
	}

	@Test(expectedExceptions = {AccessDeniedException.class},groups = { "unit" })
	public void checkDeleteAccess() {
		setAuthenticationInSecurityContext(authorizedUserAuthentication);
		SecuredEntity securedEntity = new SecuredEntity();
		try {
			securedService.checkDelete(securedEntity);
			Assert.assertTrue(securedEntity.isDeleted());
		} catch (AccessDeniedException accessDeniedException) {
			Assert.fail();
		}

		setAuthenticationInSecurityContext(unAuthorizedUserAuthentication);
		securedService.checkDelete(securedEntity);
	}

	@Test(groups = { "unit" })
	public void checkCreateEditAccess() {
		setAuthenticationInSecurityContext(authorizedUserAuthentication);

		Permission permission = new Permission();
		Assert.assertNull(permission.getDescription());
		securedService.checkCreateEditEntity(permission);
		Assert.assertTrue(permission.getDescription().equals("create"));

		try {
			securedService.checkCreateEditEntity(readPermission);
			Assert.fail();
		} catch (AccessDeniedException accessDeniedException) {

		}

		setAuthenticationInSecurityContext(unAuthorizedUserAuthentication);
		try {
			securedService.checkCreateEditEntity(permission);
			Assert.fail();
		} catch (AccessDeniedException accessDeniedException) {

		}

		Assert.assertNull(readPermission.getDescription());
		securedService.checkCreateEditEntity(readPermission);
		Assert.assertTrue(readPermission.getDescription().equals("edit"));
	}

	private void setAuthenticationInSecurityContext(Authentication authentication) {
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}

}
