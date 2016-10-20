package com.digitnexus.core.util;

import java.io.File;
import java.lang.reflect.Method;

import org.apache.commons.configuration.CombinedConfiguration;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.DefaultConfigurationBuilder;
import org.apache.commons.configuration.tree.DefaultExpressionEngine;
import org.apache.commons.lang.StringUtils;

public class ConfigUtil {

//	private static final Logger log = LoggerFactory.getLogger(ConfigUtil.class);
	
	private static CombinedConfiguration xmlConfig = null;
	
	private static Configuration config = null;
	
	/**
	 * get Configuration from properties files
	 * @return Configuration
	 */
	public static Configuration getConfig()  {
		if (config == null) {
			init(0);
		}
		
		return config;
	}
	
	/**
	 * get Configuration from xml files
	 * @return Configuration
	 */
	public static Configuration getXmlConfig(String configName)  {
		if (xmlConfig == null) {
			init(1);
		}
		Configuration conf =  xmlConfig.getConfiguration(configName + "-app");

		if (conf == null) {
			conf = xmlConfig.getConfiguration(configName);
		}
		
		return conf;
	}

	/*
	 * init configuration
	 * @param fileType 0:  init properties files 1: init xml files
	 */
	private static void init(int fileType) {
		DefaultConfigurationBuilder builder = new DefaultConfigurationBuilder();
		builder.setExpressionEngine(new DefaultExpressionEngine());
				
		builder.setFile(new File("config.xml"));
		try {
			if (fileType == 0) {
	        config = builder.getConfiguration(true);
			} else {
				xmlConfig = builder.getConfiguration(true);
			}
        } catch (ConfigurationException e) {
        	 throw new RuntimeException(e);
        }
	}

	/*
	 * get article name form parent article by property name
	 * @param propertyName
	 * @param parentArticleName
	 * return string
	 * */
	public static String getArticleNameFromParentArticleByPropertyName(String propertyName,String parentArticleName) throws RuntimeException{
		ClassLoader classLoader = ConfigUtil.class.getClassLoader();
		try {
			Class<?> parentArticleClass = classLoader.loadClass(parentArticleName);
			propertyName = StringUtils.capitalize(propertyName);
			//if the property is object type , so there is must be get...
			Method method = parentArticleClass.getMethod("get"+propertyName, new Class[]{});
			String PropertyNameAtricleName = method.getReturnType().getCanonicalName();
			return PropertyNameAtricleName;
		} catch (Exception e) {
			e.printStackTrace();
			throw new NullPointerException("Can not get " + propertyName+" class type from "+parentArticleName);
		}
	}
}
