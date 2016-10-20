package com.digitnexus.core.web.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.util.AntPathRequestMatcher;
import org.springframework.security.web.util.RequestMatcher;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.spring.ServiceLocator;

public class TransactionInterceptorFilter extends OncePerRequestFilter {
	private static final String		EXCLUDE_DELIMITERS	= ",; \t\n";

	private final Logger			logger				= LoggerFactory.getLogger(getClass());

	private List<RequestMatcher>	exclusionMatchers;

	@Override
	protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response, final FilterChain filterChain)
			throws ServletException, IOException {
		
		if(exclude(request)){
			filterChain.doFilter(request, response);
			return;
		}
		
		TransactionTemplate transactionTemplate = ServiceLocator.getService(TransactionTemplate.class);

		try {
			transactionTemplate.execute(new TransactionCallbackWithoutResult() {

				@Override
				protected void doInTransactionWithoutResult(TransactionStatus status) {
					try {
						filterChain.doFilter(request, response);
						if (response.getStatus() == 500 && !status.isRollbackOnly()) {
							// Error status probably set by jax-rs error
							// mappers. Rollback the transaction
							status.setRollbackOnly();
						}
					} catch (IOException e) {
						logger.error(e.getMessage(), e);
						throw new RuntimeException(e);
					} catch (ServletException e) {
						logger.error(e.getMessage(), e);
						throw new RuntimeException(e);
					}

				}
			});
		} catch (UnexpectedRollbackException rollbackException) {
			if (response.getStatus() == 500) {
				// We do not need to do anything. Response is already set
				return;
			}

			// Any exception during commit which is the result of unhandled
			// errors
			response.setStatus(500);
			// Send JSON
			response.getWriter().print(
					JsonUtil.toJson(Collections.singletonMap("all", new String[] { rollbackException.getRootCause().getMessage() })));
			logger.error("Transaction commit failed.", rollbackException);

		}

	}

	@Override
	protected void initFilterBean() throws ServletException {
		String exclude = getFilterConfig().getInitParameter("exclude");
		if (StringUtils.hasText(exclude)) {
			String[] exclusionPaths = StringUtils.tokenizeToStringArray(exclude, EXCLUDE_DELIMITERS);
			// Create path matcher for each value
			exclusionMatchers = new ArrayList<RequestMatcher>(exclusionPaths.length);
			for (String exclusionPath : exclusionPaths) {
				exclusionMatchers.add(new AntPathRequestMatcher(exclusionPath));
			}

		}
	}

	private boolean exclude(HttpServletRequest request) {
		if (exclusionMatchers != null) {
			for (RequestMatcher exclusionMatcher : exclusionMatchers) {
				if (exclusionMatcher.matches(request)) {
					return true;
				}
			}
		}
		return false;
	}
}
