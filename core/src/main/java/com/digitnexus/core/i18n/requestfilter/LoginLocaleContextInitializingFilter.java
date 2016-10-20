package com.digitnexus.core.i18n.requestfilter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.LocaleUtils;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

/**
 * Sets Locale in case the request is for login. This is to help Spring security to display 
 * authentication errors in locale
 * @author Adi
 *
 */
public class LoginLocaleContextInitializingFilter extends OncePerRequestFilter {
	private static final String	filterProcessesUrl	= "/j_spring_security_check";
	
	private static final String proccessUrl="j_spring_cas_security_check";

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			if (requiresLocaleInit(request, response)) {
				Cookie cookie = WebUtils.getCookie(request, "lan");
				if (cookie != null) {
					LocaleContextHolder.setLocale(LocaleUtils.toLocale(cookie.getValue()));
				}
			}

		} finally {
			filterChain.doFilter(request, response);
		}

	}

	/**
	 *  
	 * @param request
	 * @param response
	 * @return true if it is login request
	 */
	protected boolean requiresLocaleInit(HttpServletRequest request, HttpServletResponse response) {
		String uri = request.getRequestURI();
		int pathParamIndex = uri.indexOf(';');

		if (pathParamIndex > 0) {
			// strip everything after the first semi-colon
			uri = uri.substring(0, pathParamIndex);
		}

		if ("".equals(request.getContextPath())) {
			return (uri.endsWith(filterProcessesUrl) || uri.endsWith(proccessUrl));
		}

		return (uri.endsWith(request.getContextPath() + filterProcessesUrl) || uri.endsWith(request.getContextPath() + proccessUrl));
	}

}
