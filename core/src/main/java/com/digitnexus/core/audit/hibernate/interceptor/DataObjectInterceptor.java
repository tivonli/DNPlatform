package com.digitnexus.core.audit.hibernate.interceptor;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.EmptyInterceptor;
import org.hibernate.type.Type;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.util.ClientIdUtil;

/**
 * Updates created by, created date, client id, updated by and updated date
 * properties of {@link DataObject}
 * 
 * @author Adi
 * 
 */
public class DataObjectInterceptor extends EmptyInterceptor {

	private static final long		serialVersionUID	= 1L;
//	private SessionStatsCollector	sessionStatsCollector;
//	private boolean					profileOn			= true;

	@Override
	public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames, Type[] types) {
		if (!(entity instanceof DataObject)) {
			return false;
		}

		DataObject dataObject = (DataObject) entity;

		ClientIdUtil.populateClientId(dataObject);

		for (int i = 0; i < propertyNames.length; i++) {
			String propertyName = propertyNames[i];
			if (propertyName.equals("clientID")) {
				state[i] = dataObject.getClientID();
			} else if (propertyName.equals("createdDate")) {
				state[i] = new Date();
			} else if (propertyName.equals("createdBy")) {
				User user = SecurityUtil.getCurrentUser();
				if (user != null) {
					state[i] = user.getUsername();
				}
			}

		}

		return true;

	}

	@Override
	public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState, Object[] previousState, String[] propertyNames,
			Type[] types) {
		if (!(entity instanceof DataObject)) {
			return false;
		}

		for (int i = 0; i < propertyNames.length; i++) {
			String propertyName = propertyNames[i];
			if (propertyName.equals("updatedDate")) {
				currentState[i] = new Date();
			} else if (propertyName.equals("updatedBy")) {
				User user = SecurityUtil.getCurrentUser();
				if (user != null) {
					currentState[i] = user.getUsername();
				}
			}

		}

		return true;
	}

//	@Override
//	public String onPrepareStatement(String sql) {
//		if (profileOn) {
//			SessionStatsCollector sessionStatsCollector = getSessionStatsCollector();
//			if (sessionStatsCollector == null) {
//				// No profiler present
//				profileOn = false;
//			} else {
//				sessionStatsCollector.statementPrepared(sql);
//			}
//		}
//		return sql;
//	}
//
//	private SessionStatsCollector getSessionStatsCollector() {
//		if (sessionStatsCollector == null) {
//			try {
//				sessionStatsCollector = ServiceLocator.getService(SessionStatsCollector.class);
//			} catch (BeansException beansException) {
//				// Ignore
//			}
//		}
//		return sessionStatsCollector;
//	}

}
