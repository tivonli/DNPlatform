package com.digitnexus.core.test.security.service;

import java.util.Locale;
import java.util.UUID;

import javax.validation.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.PasswordResetInfo;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.security.service.UserService;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.security.util.StringEncoder;
import com.digitnexus.core.test.BaseTransactionalTest;

public class UserServiceTest extends BaseTransactionalTest {
	@Autowired
	private UserService		userService;
	@Autowired
	private EntityService	entityService;
	@Autowired
	private BaseDao         baseDao;

	@Test(expectedExceptions = { UsernameNotFoundException.class })
	public void loadUserByUsername() {
		User user = new User();
		user.setClientID("tenant1");
		user.setUsername("test");
		user.setPassword("password1");
		user.setEmail("test@test.com");
		user.setFullName("test");

		entityService.saveOrUpdate(user);

		User loadedUser = (User) userService.loadUserByUsername("test");

		Assert.assertEquals(user, loadedUser);

		// Should throw UsernameNotFoundException
		userService.loadUserByUsername("xyz");

	}

	@Test(groups = { "unit" })
	public void changeLocale() {
		User user = getUserObject();
		String userName = user.getUsername();
		entityService.saveOrUpdate(user);
		Assert.assertEquals(I18NUtil.DEFAULT_LOCALE, user.getLocale());

		userService.changeLocale(user, Locale.CHINESE);
		Assert.assertEquals(Locale.CHINESE, ((User) userService.loadUserByUsername(userName)).getLocale());
	}

	@Test(groups = { "unit" })
	public void resetPassword() {

		User user = getUserObject();
		entityService.saveOrUpdate(user);

		String uuid = simulatePasswordReset(user.getUsername());

		try {
			userService.resetPassword("password2", "password2", uuid);
		} catch (ValidationException e) {
			Assert.fail("Validation exception even when valid password is passed.Check if password constrainsts are changed and update the test");
		}

		// Validations
		uuid = simulatePasswordReset(user.getUsername());
		try {
			userService.resetPassword("pass", "pass", uuid);
			Assert.fail();
		} catch (ValidationException e) {
			// Do nothing
		}

		uuid = simulatePasswordReset(user.getUsername());
		try {
			userService.resetPassword("password", "password", uuid);
			Assert.fail();
		} catch (ValidationException e) {
			// Do nothing
		}

		uuid = simulatePasswordReset(user.getUsername());
		try {
			userService.resetPassword("12345678", "12345678", uuid);
			Assert.fail(); //Is this possible hibernate bug? Delete executed above affecting rows but we get object below from cache.Commenting the line for now
		} catch (ValidationException e) {
			// Do nothing
		}
	}

	@Test(groups = { "unit" })
	public void changePassword() {
		// Assuming admin user is current user
		try {
			userService.changePassword(null, "");
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		try {
			userService.changePassword("", null);
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		try {
			userService.changePassword("test", "test");
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		try {
			userService.changePassword("test", "test1");
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		User user = SecurityUtil.getCurrentUser();

		// New password is less than 8 chars
		try {
			userService.changePassword("password1", "test");
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		// New password doeactuals not contain numbers
		try {
			userService.changePassword("password1", "testtest");
			Assert.fail();
		} catch (ValidationException validationException) {
		}

		// New password does not contain letters
		try {
			userService.changePassword("password1", "12345678");
			Assert.fail();
		} catch (ValidationException validationException) {
		}
		
		String newPassword=user.getPassword()+"2";
		userService.changePassword("password1", newPassword);
		
		Assert.assertEquals(userService.loadUserByUsername(user.getUsername()).getPassword(), StringEncoder.encode(newPassword, user.getUsername()));

	}
	
	@Test(groups = { "unit" },expectedExceptions={ValidationException.class})
	public void forgotPassword() {
		User currentUser=SecurityUtil.getCurrentUser();
		userService.forgotPassword(currentUser.getUsername(), currentUser.getEmail(), currentUser.getLocaleString());
		Assert.assertEquals(baseDao.find("from PasswordResetInfo where userName = ?", currentUser.getUsername()).size(), 1);
		//ValidationException
		userService.forgotPassword(currentUser.getUsername(), "", currentUser.getLocaleString());
	}
	

	private String simulatePasswordReset(String userName) {
		String uuid = UUID.randomUUID().toString();
		PasswordResetInfo passwordResetInfo = new PasswordResetInfo(uuid, userName);
		setDataObjectProperties(passwordResetInfo);
		entityService.saveOrUpdate(passwordResetInfo);
		return uuid;
	}
}
