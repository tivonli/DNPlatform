package com.digitnexus.core.security.servlet.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.filter.OncePerRequestFilter;

import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.security.util.SecurityUtil;

public class WebResourceAuthorizationFilter extends OncePerRequestFilter {
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String resourcePath=getResourcePath(request, response);
		if(SecurityUtil.isSecuredResource(resourcePath) && !SecurityUtil.hasPermission(UserOperation.READ, resourcePath)){
			throw new AccessDeniedException("You do not have permission to access this url");
		}
		filterChain.doFilter(request, response);

	}

	protected String getResourcePath(HttpServletRequest request, HttpServletResponse response) {
		//in jersey_SERVLET getServletPath() is different with others.
		String pathInfo = request.getPathInfo();
		if(pathInfo==null||pathInfo.trim().length()<=0){
			pathInfo = "";
		}
		String uri = request.getServletPath()+pathInfo;
		int pathParamIndex = uri.indexOf(';');

		if (pathParamIndex > 0) {
			// strip everything after the first semi-colon
			uri = uri.substring(0, pathParamIndex);
		}

		return uri;
	}

}
