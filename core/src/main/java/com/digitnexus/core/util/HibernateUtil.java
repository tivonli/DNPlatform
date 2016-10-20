package com.digitnexus.core.util;

import java.sql.Blob;
import java.sql.Clob;

import org.hibernate.LobHelper;
import org.hibernate.SessionFactory;

import com.digitnexus.core.spring.ServiceLocator;

public class HibernateUtil {
	private static SessionFactory	sessionFactory;

	private HibernateUtil() {

	}

	public static Blob createBlob(byte[] bytes) {
		return getLobHelper().createBlob(bytes);
	}

	public static Clob createClob(String string) {
		return getLobHelper().createClob(string);
	}

	private static LobHelper getLobHelper() {
		return getSessionFactory().getCurrentSession().getLobHelper();
	}

	private static SessionFactory getSessionFactory() {
		if (sessionFactory == null) {
			sessionFactory = ServiceLocator.getService(SessionFactory.class);
		}
		return sessionFactory;

	}

}
