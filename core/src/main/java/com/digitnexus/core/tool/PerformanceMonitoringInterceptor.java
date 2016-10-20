/**
 * 
 */
package com.digitnexus.core.tool;

import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.springframework.aop.interceptor.AbstractMonitoringInterceptor;

/**
 * @author Santanu
 *
 */
@SuppressWarnings("serial")
public class PerformanceMonitoringInterceptor extends AbstractMonitoringInterceptor {

	/* (non-Javadoc)
	 * @see org.springframework.aop.interceptor.AbstractTraceInterceptor#invokeUnderTrace(org.aopalliance.intercept.MethodInvocation, org.apache.commons.logging.Log)
	 */
	@Override
	protected Object invokeUnderTrace(MethodInvocation invocation, Log logger) throws Throwable {
		try {
			CallTracer.currentInstance().start(invocation.getMethod().getDeclaringClass().getName() + "." + invocation.getMethod().getName());
			return invocation.proceed();
		} finally {
			CallTracer.currentInstance().stop();
		}
	}


}
