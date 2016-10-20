package com.digitnexus.core.i18n.requestfilter;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.i18n.spring.CustomMessageSource;
import com.digitnexus.core.security.util.SecurityUtil;

/**
 * Initializes locale.Order of preference is as follows logged user, 'lan' parameter in request, cookie and browser locale
 * @author Adi
 *
 */
public class LocaleContextInitializingFilter extends OncePerRequestFilter {
	private static final String	LAGUAGEPARAMETER	= "lan";
	public static final int		SECONDS_PER_YEAR	= 60 * 60 * 24 * 365;
	private CustomMessageSource	customMessageSource;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		try {
			User user = SecurityUtil.getCurrentUser();
			Locale locale = I18NUtil.DEFAULT_LOCALE;

			//Get values from cookie, we need them anyway later irrespective of where we find locale
			boolean checkCookie = true;
			Cookie cookie = WebUtils.getCookie(request, LAGUAGEPARAMETER);
			String cookieLanguage = null;
			if (cookie != null) {
				cookieLanguage = cookie.getValue();
			}

			if (user != null) {
				locale = user.getLocale();
			} else if (StringUtils.isNotEmpty(request.getParameter(LAGUAGEPARAMETER))) {
				locale = LocaleUtils.toLocale(request.getParameter(LAGUAGEPARAMETER));
			} else if (StringUtils.isNotEmpty(cookieLanguage)) {
				locale = LocaleUtils.toLocale(cookieLanguage);
				checkCookie = false;
			} else {
				Locale browserLocale = request.getLocale();
				//Check if have support
				if (customMessageSource.supportLocale(browserLocale.toString())) {
					if (browserLocale.equals(Locale.US)) {
						locale = Locale.ENGLISH;
					} else {
						locale = browserLocale;
					}
				}

			}

			//Set locale to context
			LocaleContextHolder.setLocale(locale, true);

			if (checkCookie) {
				//See if cookie exists, otherwise create and set locale
				if (StringUtils.isEmpty(cookieLanguage)) {
					cookie = new Cookie(LAGUAGEPARAMETER, locale.toString());
					cookie.setMaxAge(SECONDS_PER_YEAR);
					cookie.setPath("/");
					response.addCookie(cookie);
				} else if (!locale.toString().equals(cookieLanguage)) {
					cookie.setValue(locale.toString());
					cookie.setMaxAge(SECONDS_PER_YEAR);
					cookie.setPath("/");
					response.addCookie(cookie);
				}

			}

		} finally {
			filterChain.doFilter(request, response);
		}

	}

	public void setCustomMessageSource(CustomMessageSource customMessageSource) {
		this.customMessageSource = customMessageSource;
	}
}
