/**
 * 
 */
package com.digitnexus.core.spring.hibernate4;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.context.internal.ThreadLocalSessionContext;
import org.hibernate.context.spi.CurrentSessionContext;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.springframework.orm.hibernate4.SpringSessionContext;

/**
 * {@link CurrentSessionContext} implementation for unit tests. 
 * This class tries to find a transaction bound session if available, else try to get a threadlocal session.
 * 
 * @author Santanu
 */
@SuppressWarnings("serial")
public class UnitTestSessionContext extends SpringSessionContext {

	private final CurrentSessionContext sessionContext;
	
	public UnitTestSessionContext(SessionFactoryImplementor sessionFactory) {
		super(sessionFactory);
		//only null case is meaningful for us
		this.sessionContext = new ThreadLocalSessionContext(sessionFactory);
	}

	/* (non-Javadoc)
	 * @see org.springframework.orm.hibernate4.SpringSessionContext#currentSession()
	 */
	@Override
	public Session currentSession() throws HibernateException {
		try {
			return super.currentSession();
		} catch (HibernateException e) {
			return sessionContext.currentSession();
		}
	}
}
