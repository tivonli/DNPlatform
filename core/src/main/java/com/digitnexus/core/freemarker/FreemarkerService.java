/**
 * 
 */
package com.digitnexus.core.freemarker;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import freemarker.template.Configuration;
import freemarker.template.TemplateException;

/**
 * Wrapper over freemarker to provide methods for processing tempates to string
 * 
 * @author Adi
 * 
 */
@Service
public class FreemarkerService {
	private final Logger	logger	= LoggerFactory.getLogger(getClass());
	
	@Inject @Named("freemarkerConfiguration")
	private Configuration		configuration;

	public String processTemplateIntoString(String templateName, Map<String, Object> model) {
          return processTemplateIntoString(templateName, model, Locale.US);  
	}

	public String processTemplateIntoString(String templateName, Map<String, Object> model, Locale locale) {

		try {
			return FreeMarkerTemplateUtils.processTemplateIntoString(configuration.getTemplate(templateName, locale,"UTF-8"), model);
		} catch (IOException e) {
			logger.error("", e);
			throw new FreemarkerPorcessingException("Error processing template "+templateName+" to string", e);
		} catch (TemplateException e) {
			logger.error("", e);
			throw new FreemarkerPorcessingException("Error processing template "+templateName+" to string", e);
		}

	}

}
