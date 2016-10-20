/**
 * 
 */
package com.digitnexus.core.nosql.spring.config;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.ManagedSet;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.data.annotation.Persistent;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import com.digitnexus.core.nosql.annotation.FileStoreDocument;

/**
 * @author Santanu
 *
 */
public class MongoMappingContextFactory implements FactoryBean<MongoMappingContext>, InitializingBean, ApplicationContextAware{
	
	private static Logger logger = LoggerFactory.getLogger(MongoMappingContextFactory.class);
	
	private MongoMappingContext mappingContext;
	
	private String basePackage;
	private ApplicationContext applicationContext;

	/**
	 * @return the basePackage
	 */
	public String getBasePackage() {
		return basePackage;
	}

	/**
	 * @param basePackage the basePackage to set
	 */
	public void setBasePackage(String basePackage) {
		this.basePackage = basePackage;
	}

	@Override
	public MongoMappingContext getObject() throws Exception {
		return mappingContext;
	}

	@Override
	public Class<?> getObjectType() {
		return MongoMappingContext.class;
	}

	@Override
	public boolean isSingleton() {
		return true;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		//create the object 
		mappingContext = new MongoMappingContext();
		//set the property values
		//give the relevant callbacks it has registered for
		mappingContext.setApplicationContext(applicationContext);
		//here we make spring to read the classes forcibly
		//this part is done on ContextRefreshedEvent for AbstractMappingContext 
		Set<Class<?>> classesToAdd = getInititalEntityClasses();
		for (Class<?> classToAdd:classesToAdd) {
			mappingContext.getPersistentEntity(classToAdd);
		}
	}

	public Set<Class<?>> getInititalEntityClasses() {

		ClassPathScanningCandidateComponentProvider componentProvider = new ClassPathScanningCandidateComponentProvider(false);
		componentProvider.addIncludeFilter(new AnnotationTypeFilter(Document.class));
		componentProvider.addIncludeFilter(new AnnotationTypeFilter(Persistent.class));
		componentProvider.addIncludeFilter(new AnnotationTypeFilter(FileStoreDocument.class));

		Set<Class<?>> classes = new ManagedSet<Class<?>>();
		String[] basePackages = basePackage.split(",");
		for (String oneBasePackage:basePackages) {
			for (BeanDefinition candidate : componentProvider.findCandidateComponents(oneBasePackage.trim())) {
				try {
					classes.add(Class.forName(candidate.getBeanClassName()));
				} catch (ClassNotFoundException e) {
					//here if we fail then we ignore that class and move on
					//infact there is no good reason why we will get this exception because
					//the class might been loaded by ClassPathScanningCandidateComponentProvider
					logger.warn("Failed to load class " + candidate.getBeanClassName(), e);
				}
			}
		}
		return classes;
	}
}
