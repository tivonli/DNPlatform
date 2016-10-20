/**
 * 
 */
package com.digitnexus.core.test;

import java.util.Date;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTransactionalTestNGSpringContextTests;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.util.SecurityUtil;

/**
 * @author adi
 *
 */
@ContextConfiguration(locations = { "classpath*:/spring/test/applicationContext-*.xml", "classpath*:/spring/applicationContext-*.xml" })

public abstract class BaseTransactionalTest extends AbstractTransactionalTestNGSpringContextTests {
	protected final Logger	logger	= LoggerFactory.getLogger(getClass());
	@Autowired
	private SessionFactory sessionFactory;

	//Used as test data in various cases
	protected User getUserObject() {
		User user = new User();
		user.setClientID("tenant1");
		user.setUsername("test");
		user.setPassword("password1");
		user.setFullName("test");
		user.setEmail("test@test.com");
		return user;
	}

	//Class used to throw exception explicitly to pass some tests
	public class TestException extends RuntimeException {

		private static final long	serialVersionUID	= 1L;

	}

	@BeforeMethod(alwaysRun=true)
	public void loginUser() {
		SecurityUtil.loginAsAdmin();
	}
	
	@AfterMethod(alwaysRun=true)
	public void flushSession() {
		Session session = sessionFactory.getCurrentSession();
		if (session != null) {
			session.flush();
		}
	}

	protected void setDataObjectProperties(DataObject dataObject) {
		dataObject.setClientID("tanent1");
		dataObject.setCreatedBy("admin");
		dataObject.setCreatedDate(new Date());
		dataObject.setUpdatedBy("admin");
		dataObject.setUpdatedDate(new Date());
	}
}
