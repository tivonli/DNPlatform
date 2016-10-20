package com.digitnexus.core.util;

import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.security.util.SecurityUtil;

public class ClientIdUtil {
	public static final String	DEFAULT_CLIENT_ID	= "SYSTEM";

	private ClientIdUtil() {

	}

	/**
	 * Populates clientId from logged in User. If there is no logged in user, it will set default client id
	 * @param dataObject
	 */
	public static void populateClientId(DataObject dataObject) {
		if (StringUtils.isEmpty(dataObject.getClientID())) {
			String clientId = DEFAULT_CLIENT_ID;
			User currentUser = SecurityUtil.getCurrentUser();
			if (currentUser != null) {
				clientId = currentUser.getClientID();
			}
			dataObject.setClientID(clientId);
		}
	}

}
