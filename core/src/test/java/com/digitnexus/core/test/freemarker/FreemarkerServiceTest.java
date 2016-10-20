/**
 * 
 */
package com.digitnexus.core.test.freemarker;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.freemarker.FreemarkerPorcessingException;
import com.digitnexus.core.freemarker.FreemarkerService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * To test FreeMarkerConfiguration in our application
 * @author Adi
 *
 */
public class FreemarkerServiceTest extends BaseTransactionalTest {
	private static final String TEST_TEMPLATE_NAME="email/password_send_test.ftl";
	
	@Autowired
	private FreemarkerService freemarkerService;
	
	@Test(groups = { "unit" })
	public void processTemplateToString(){
		Map<String, Object> templateVars=new HashMap<String, Object>();
		templateVars.put("user", "admin");
		String processedText=freemarkerService.processTemplateIntoString(TEST_TEMPLATE_NAME, templateVars);
		Assert.assertTrue(processedText.contains("admin"));
		//Example of i18n
		processedText=freemarkerService.processTemplateIntoString(TEST_TEMPLATE_NAME, templateVars,Locale.SIMPLIFIED_CHINESE);
		Assert.assertTrue(processedText.contains("欢迎您"));
		
		//Exception cases
		try {
			freemarkerService.processTemplateIntoString("random template",templateVars);
			Assert.fail();
		} catch (FreemarkerPorcessingException exception) {
			// Do nothing
		}
		
		try {
			freemarkerService.processTemplateIntoString(TEST_TEMPLATE_NAME, null);
			Assert.fail();
		} catch (FreemarkerPorcessingException exception) {
			// Do nothing
		}
	}
}
