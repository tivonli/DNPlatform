/**
 * 
 */
package com.digitnexus.core.nosql.spring.config;

import java.util.Date;

import org.springframework.context.ApplicationListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.stereotype.Component;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.util.ClientIdUtil;
import com.mongodb.DBObject;

/**
 * A default listener which populates the properties like client id, updated date
 * and updated by properties
 * 
 * @author Santanu
 */
@Component
public class DefaultBeforeSaveEvent<E> implements ApplicationListener<BeforeSaveEvent<E>> {

	/*
	 * (non-Javadoc)
	 * @see org.springframework.context.ApplicationListener#onApplicationEvent(org.springframework.context.ApplicationEvent)
	 */
	@Override
	public void onApplicationEvent(BeforeSaveEvent<E> event) {
		DBObject dbObject = event.getDBObject();
		//set the values for the client id and the updated by user
		String clientId = ClientIdUtil.DEFAULT_CLIENT_ID;
		String username = "";
		User currentUser = SecurityUtil.getCurrentUser();
		if (currentUser != null) {
			clientId = currentUser.getClientID();
			username = currentUser.getUsername();
		}
		//set all the values so that it is saved no matter what
		if (!dbObject.containsField("clientID")) {
			dbObject.put("clientID", clientId);
		}
		if (!dbObject.containsField("updatedDate")) {
			dbObject.put("updatedDate", new Date());
		}
		if (!dbObject.containsField("updatedBy")) {
			dbObject.put("updatedBy", username);
		}
	}
}
