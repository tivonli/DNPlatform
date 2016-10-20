/**
 * 
 */
package com.digitnexus.core.security.service;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.ValidationException;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.Email;
import com.digitnexus.core.domain.PasswordResetInfo;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.email.service.EmailService;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.entity.PreSaveEvent;
import com.digitnexus.core.entity.listener.AbstractEntityEventListener;
import com.digitnexus.core.freemarker.FreemarkerService;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.security.dao.UserDao;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.security.util.StringEncoder;
import com.digitnexus.core.spring.AOPUtil;

/**
 * @author adi
 * 
 */
@Service("userService")
public class UserServiceImpl extends AbstractEntityEventListener<User>
        implements UserService, InitializingBean {
	private final Logger logger=LoggerFactory.getLogger(getClass());
	
	private static final String USER_INFO_SEND_TEMPLATE = "email/user_info_send.ftl";
	private static final String USER_INFO_SEND_TEMPLATE_SUBJECT = "email/user_info_send_subject.ftl";
	private static final String RESET_INFO_SEND_TEMPLATE = "email/reset_info_send.ftl";
	private static final String RESET_INFO_SEND_TEMPLATE_SUBJECT = "email/reset_info_send_subject.ftl";
	private static final String PASSWORD_VALIDATON_REGEX = "^(?=.*\\d)(?=.*\\D).+$";
	private static final Pattern pattern = Pattern
	        .compile(PASSWORD_VALIDATON_REGEX);

	
	private UserDao userDao;
	/**
	 * Actual(wihtout proxy) dao reference to by pass security for some operations
	 */
	private UserDao unsecureUserDao;
	@Autowired
	private EmailService emailService;
	@Autowired
	private EntityService entityService;
	@Value("${app.url}")
	private String appUrl;
	private String resetPasswordUrl;
	@Autowired
	private FreemarkerService	freemarkerService;

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.security.core.userdetails.UserDetailsService#
	 * loadUserByUsername(java.lang.String)
	 */
	@Override
	public UserDetails loadUserByUsername(String username)
	        throws UsernameNotFoundException, DataAccessException {
		User user = userDao.loadUserByName(username);
		if (user == null) {
			throw new UsernameNotFoundException(I18NUtil.getMessage("error.login.userNotExist"));
		} else {
			user.getAuthorities().add(new SimpleGrantedAuthority("ROLE_USER"));
		}
		return user;
	}

	/*
	 * @see com.digitnexus.core.security.service.UserService#authentication
	 */
	@Override
	public String authentication(String username, String password) {
		UserDetails user = null;
		try {
			user = loadUserByUsername(username);
		} catch (UsernameNotFoundException e) {
			logger.error(e.getMessage(),e);
			return "1";
		}
		if (user.getPassword().equals(StringEncoder.encode(password, username))) {
			return "0";
		} else {
			return "2";
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.digitnexus.core.security.service.UserService#initializeNewUser(com
	 * .digitnexus.core.dataobject.User)
	 */
	@Override
	public void initializeNewUser(User user) {

		if (StringUtils.isEmpty(user.getFullName())
		        || StringUtils.isEmpty(user.getUsername())) {
			return;
		}

		String password = generatePassword();
		// Set encoded password. User name is used as salt
		user.setPassword(StringEncoder.encode(password, user.getUsername()));
		// Indicate that password is temporary, so that we can ask user to reset
		// it
		user.setPasswordTemporary(true);

		// Generate mail using USER_INFO_SEND_TEMPLATE as template
		Map<String, Object> templateModel = new HashMap<String, Object>(2);

		templateModel.put("user", user.getFullName());
		templateModel.put("username", user.getUsername());
		templateModel.put("password", password);

		Email email = new Email();
		email.setSubject(freemarkerService.processTemplateIntoString(USER_INFO_SEND_TEMPLATE_SUBJECT,templateModel, user.getLocale())).setTo(user.getEmail());

		emailService.populateBodyFromTemplate(email, USER_INFO_SEND_TEMPLATE,
		        templateModel, user.getLocale());

		emailService.sendMailAfterTransaction(email);

	}

	/**
	 * Generates password of length 8 with at least one letter and one number
	 * 
	 * @return
	 */
	private String generatePassword() {
		// Ensure that generated password always contains at least one letter
		// and one number
		return RandomStringUtils.randomAlphanumeric(2)
		        + RandomStringUtils.randomAlphabetic(2)
		        + RandomStringUtils.randomNumeric(2)
		        + RandomStringUtils.randomAlphanumeric(2);
	}

	@Override
	public void onPreSave(PreSaveEvent<User> entityEvent) {
		if (entityEvent.isNewObject()) {
			initializeNewUser(entityEvent.getEntity());
		}

	}

	@Override
	public void changePassword(String oldPassword, String newPassword)
	        throws ValidationException {
		if (oldPassword == null || newPassword == null) {
			// This should have been handled at client side
			throw new ValidationException("Some fields are null");
		}

		if (oldPassword.equals(newPassword)) {
			throw new ValidationException(
			        "New Password can not be equal to old password");
		}

		// Get the logged in user
		User user = SecurityUtil.getCurrentUser();

		// Check if the password typed by user is same as the password of
		// current user
		if (!StringEncoder.encode(oldPassword, user.getUsername()).equals(
		        user.getPassword())) {
			// This should have been handled at client side
			throw new ValidationException("The password, you entered is wrong");
		}

		// Check if new password follows password constraints
		validatePassword(newPassword);

		// Set the new password and save it. Default validations will kick in
		user.setPassword(StringEncoder.encode(newPassword, user.getUsername()));
		// Reset temporary password flag, this could be the case of first login
		user.setPasswordTemporary(false);

		// No need for entity service to fire any listeners
		userDao.update(user);

	}

	private void validatePassword(String password) {
		if (password.length() < 8) {
			throw new ValidationException(I18NUtil.getMessage("error_password_minchar"));
		}

		Matcher matcher = pattern.matcher(password);
		if (!matcher.matches()) {
			throw new ValidationException(I18NUtil.getMessage("error_password_invalidchars"));
		}

	}

	@Override
	public void forgotPassword(String username, String email,String localeString)
	        throws ValidationException {
		//Saving current authentication and resetting it back. PT-288
		Authentication currentAuthentication = SecurityContextHolder.getContext().getAuthentication();
		try {
			// Need to login as admin
			SecurityUtil.loginAsAdmin();

			User user = userDao.get(User.class, username);
			if (user == null || !user.getEmail().equals(email)) {
				throw new ValidationException(I18NUtil.getMessage("error_forgotpassword_invalid"));
			}
			//get the user forgotPassword page's Locale.
			Locale locale = LocaleUtils.toLocale(localeString);
			// Store info required for password reset
			String uuid = UUID.randomUUID().toString();
			PasswordResetInfo passwordResetInfo = new PasswordResetInfo(uuid, username);
			entityService.saveOrUpdate(passwordResetInfo);

			// Generate mail using RESET_INFO_SEND_TEMPLATE as template
			Map<String, Object> templateModel = new HashMap<String, Object>(2);
			templateModel.put("user", user.getFullName());
			templateModel.put("resetUrl", resetPasswordUrl + uuid);

			Email emailObj = new Email();
			// TODO:i18n subject
			emailObj.setSubject(freemarkerService.processTemplateIntoString(RESET_INFO_SEND_TEMPLATE_SUBJECT,templateModel, locale)).setTo(user.getEmail());

			emailService.populateBodyFromTemplate(emailObj, RESET_INFO_SEND_TEMPLATE, templateModel, locale);

			emailService.sendMailAfterTransaction(emailObj);

		} finally {
			SecurityContextHolder.getContext().setAuthentication(currentAuthentication);
		}

	}

	@Override
	public void afterPropertiesSet() {
		if (StringUtils.isEmpty(appUrl)) {
			throw new NullPointerException(
			        "appUrl can not be null. Check config.properties if it is properly set ");
		}

		resetPasswordUrl = appUrl + "/jsp/user/resetPassword.jsp?uuid=";

	}

	@Override
	public void resetPassword(String newPasswordFirst,String password, String uuid)
	        throws ValidationException {
		//Saving current authentication and resetting it back. PT-288
		Authentication currentAuthentication = SecurityContextHolder.getContext().getAuthentication();
		try {
			// Need to login as admin
			SecurityUtil.loginAsAdmin();
			
			if(!newPasswordFirst.equals(password)){
				throw new ValidationException(I18NUtil.getMessage("error_resetpassword_nomatch"));
			}
			

			validatePassword(password);
			PasswordResetInfo passwordResetInfo = userDao.get(PasswordResetInfo.class, uuid);
			if (passwordResetInfo == null) {
				throw new ValidationException(I18NUtil.getMessage("error_resetpassword_invalid"));
			}

			User user = userDao.get(User.class, passwordResetInfo.getUserName());

			user.setPassword(StringEncoder.encode(password, user.getUsername()));

			entityService.saveOrUpdate(user);

			userDao.delete(passwordResetInfo);

		} finally {
			SecurityContextHolder.getContext().setAuthentication(currentAuthentication);
		}
		
	}

	@Override
	public void changeLocale(User user, Locale locale) {
		user.setLocale(locale);
		unsecureUserDao.saveOrUpdate(user);
	}

	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
		this.unsecureUserDao=(UserDao) AOPUtil.getTarget(userDao);
	}

}
