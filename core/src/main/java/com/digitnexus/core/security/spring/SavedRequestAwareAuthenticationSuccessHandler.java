package com.digitnexus.core.security.spring;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.security.service.UserService;
import com.digitnexus.core.security.util.SecurityUtil;


/**
 * Overridden onAuthenticationSuccess method to change user locale
 * @author Adi
 * @author Bill
 */
public class SavedRequestAwareAuthenticationSuccessHandler extends
		org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler {

	private UserService	userService;
	private String		localeParamName;
	private String      currentUserInfo = "CURRENTUSERINFO";
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws ServletException, IOException {
		String localeString = request.getParameter(localeParamName);
		User user = SecurityUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(localeString)) {
			Locale selectedLocale = LocaleUtils.toLocale(localeString);
			if (!user.getLocale().equals(selectedLocale)) {
				userService.changeLocale(user, selectedLocale);
			}
		}
		//can support a timer track idle time in the client side ....
		if(user != null && StringUtils.isNotEmpty(user.getUsername())){
			HttpSession session = request.getSession();
			session.setAttribute("session_is_time_out" + user.getUsername(), true);
			//save the current use info to cookie..
			Map<String,String> map = new HashMap<String,String>();
			map.put("username",user.getUsername());
			map.put("password", user.getPassword());
			Cookie cookie = new Cookie(currentUserInfo,JsonUtil.toJson(map));
			cookie.setMaxAge(60 * 60 * 24 * 365);
			cookie.setPath("/");
			response.addCookie(cookie);
			logger.info("new create httpSession again......!");
		}
		super.onAuthenticationSuccess(request, response, authentication);
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public void setLocaleParamName(String localeParamName) {
		this.localeParamName = localeParamName;
	}
	public String getLocaleParamName(){
		return this.localeParamName;
	}
}
