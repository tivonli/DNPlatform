package com.digitnexus.core.security.service;

import java.util.Locale;

import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.digitnexus.core.domain.User;

@Path("/user/")
public interface UserService extends UserDetailsService {

	/**
	 * Generates password, sets encrypted password to user and send notification
	 * to user
	 * 
	 * @param user
	 * @return
	 */
	public void initializeNewUser(User user);

	/**
	 * authentication service for mobile client
	 * @param username
	 * @param password
	 * @return authentication result(0: success; 1: username not found; 2: password incorrect)
	 */
	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Path("/authentication")
	public String authentication(@FormParam("j_username") String username,
	        @FormParam("j_password") String password) ;

	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Path("/changePassword")
	public void changePassword(@FormParam("oldPassword") String oldPassword,
	        @FormParam("newPassword") String newPassword)
	        throws ValidationException;

	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Path("/forgotPassword")
	public void forgotPassword(@FormParam("username") String userName,
	        @FormParam("email") String email,@FormParam("locale") String localeString) throws ValidationException;

	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Path("/resetPassword")
	public void resetPassword(@FormParam("newPasswordFirst") String newPasswordFirst, @FormParam("password") String password,
	        @FormParam("uuid") String uuid) throws ValidationException;

	public void changeLocale(User user, Locale locale);

}