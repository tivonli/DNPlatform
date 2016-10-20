/**
 * 
 */
package com.digitnexus.core.i18n.spring;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.Resource;

/**
 * Scans all property files starting with  'resourceBundle' as name and derive baseNames to passes it to super class.
 * Assumption is made that there will be at least one properties file with name pattern resourceBundle*_en.propeties
 * Customization is done to avoid configuration change when new resource bundle is added in application or core or any modules
 * depending on autoid core.Supports properties files in jar file
 
 * @author Adi
 *
 */

public class CustomMessageSource extends ReloadableResourceBundleMessageSource implements InitializingBean, ApplicationContextAware {
	private static final String	ENGLISH_RESOURCE_SUFFIX	= "_en.properties";
	private final Logger		logger					= LoggerFactory.getLogger(getClass());
	private ApplicationContext	applicationContext;
	private Set<String>			supportedLocales;

	@Override
	public void afterPropertiesSet() throws IOException {
		//Go through all file names starting with 'resourceBundle', if substring of file name before '_en.properties' is not null, it 
		//is the base name
		List<String> baseNames = new ArrayList<String>();
		//To track duplicates
		Map<String, Resource> baseNameVsResource = new HashMap<String, Resource>();

		for (Resource i18Resource : applicationContext.getResources("classpath*:properties/i18n/resourceBundle*.properties")) {
			String fileName = i18Resource.getFilename();
			if (fileName.endsWith(ENGLISH_RESOURCE_SUFFIX)) {
				fileName = "classpath:properties/i18n/" + StringUtils.substringBefore(fileName, ENGLISH_RESOURCE_SUFFIX);

				if (baseNames.contains(fileName)) {
					//We got a duplicate. Fail first
					Resource resource = baseNameVsResource.get(fileName);

					IllegalStateException illegalStateException = new IllegalStateException("Duplicate resource bundles:\n"
							+ resource.getFile().getAbsolutePath() + "\n" + i18Resource.getFile().getAbsolutePath());

					logger.error(illegalStateException.getMessage(), illegalStateException);
					throw illegalStateException;

				}
				baseNames.add(fileName);
				baseNameVsResource.put(fileName, i18Resource);
			}

		}

		//Finally add Spring security resources base name
		baseNames.add("classpath:org/springframework/security/messages");

		setBasenames(baseNames.toArray(new String[baseNames.size()]));
		setDefaultEncoding("UTF-8");

	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;

	}

	public boolean supportLocale(String localeString) {
		return supportedLocales.contains(localeString);
	}

	public void setSupportedLocales(Set<String> supportedLocales) {
		this.supportedLocales = supportedLocales;
	}

}
