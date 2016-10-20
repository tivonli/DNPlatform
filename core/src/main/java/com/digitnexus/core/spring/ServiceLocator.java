
package com.digitnexus.core.spring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;

public class ServiceLocator {
	private static final Logger logger=LoggerFactory.getLogger(ServiceLocator.class);

    private static ApplicationContext applicationContext;

    /**
     * @return Returns the applicationContext.
     */
    public static synchronized ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * @param applicationContext The applicationContext to set.
     */
    public static synchronized void setApplicationContext(ApplicationContext appContext) {
        applicationContext = appContext;
    }

    /**
     * Returns the service that is associated with the interface whose class you provide. For right now, that's going to
     * be the bean in the Spring context whose name is the class name with the first letter lowercased (e.g.
     * SecurityDAO.class looks up a bean called "securityDAO"). Changed this so that it just caches the name of the
     * service rather than the service itself.
     * 
     * @param interfaceClass the class of the interface you wish to return.
     * @return the appropriate object, or null if it doesn't exist.
     */
    public static <T>T getService(Class<T> interfaceClass) {
        if (interfaceClass == null) {
            return null;
        }
        return applicationContext.getBean(interfaceClass);
    }

    /**
     * Returns the service corresponding to the name you request. This is private now because we want to force people to
     * get beans according to the interface, and not let them ask for any old bean.
     * 
     * @param serviceName the name of the service to obtain.
     * @return the appropriate service object, or null if none can be found.
     */
    public static Object getService(String serviceName) {
        try {
            if (applicationContext == null) {
                return null;
            }

            Object o = applicationContext.getBean(serviceName);
            return o;
        } catch (NoSuchBeanDefinitionException e) {
        	logger.warn("No bean found with name:"+serviceName);
            return null;
        }
    }
    
    /**
     * 
     * Returns the service of particular type
     * @param serviceName
     * @param requiredType
     * @return
     */
    public static <T> T getService(String serviceName, Class<T> requiredType){
    	 if (applicationContext == null) {
             return null;
         }
         return applicationContext.getBean(serviceName,requiredType);
    }

    public static MessageSource getMessageSource() {
        return getApplicationContext();
    }

}
