package com.digitnexus.core.spring;

import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;

public final class AOPUtil {
    private AOPUtil(){
    	
    }
    
    public static Object getTarget(Object proxy){
    	if(AopUtils.isAopProxy(proxy) && proxy instanceof Advised) {
    	    try {
				return ((Advised)proxy).getTargetSource().getTarget();
			} catch (Exception e) {
				return proxy;
			}
       	}
    	
    	return proxy;
    }
}
