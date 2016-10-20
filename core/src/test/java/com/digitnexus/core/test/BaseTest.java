package com.digitnexus.core.test;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import com.digitnexus.core.security.util.SecurityUtil;
/**
 * Base class for Non transactional tests
 * @author Adi
 *
 */
@ContextConfiguration(locations={"classpath*:/spring/test/applicationContext-*.xml","classpath*:/spring/applicationContext-*.xml"})
//@Deprecated // not work? meet Exception: HibernateException: No Session found for current thread
public abstract class BaseTest extends AbstractTestNGSpringContextTests {
	protected final Logger	logger	= LoggerFactory.getLogger(getClass());

	@Autowired
	private SessionFactory sessionFactory;
	
	@BeforeMethod(alwaysRun=true)
	public void loginUser(){
		//making this a pseudo transactional test case
		Session session = sessionFactory.getCurrentSession();
		//dont think session can be null here..but anyways
		if (session != null) {
			session.beginTransaction();
			SecurityUtil.loginAsAdmin();
		}
	}

	@AfterMethod(alwaysRun=true)
	public void flushAndCloseSession() {
		Session session = sessionFactory.getCurrentSession();
		if (session != null) {
			session.flush();
			session.getTransaction().rollback();
		}
	}
}
