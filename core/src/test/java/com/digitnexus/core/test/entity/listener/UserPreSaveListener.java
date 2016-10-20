package com.digitnexus.core.test.entity.listener;

import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.PreSaveEvent;
import com.digitnexus.core.entity.listener.EntityPreSaveListener;

/**
 * this class implements the onPreSave method , that when save the user
 * successed , it will update the user email to "Hugh@digitnexu.com"
 * @author Hugh
 */
@Service
public class UserPreSaveListener implements EntityPreSaveListener<User> {

	@Override
	public void onApplicationEvent(PreSaveEvent<User> entityEvent) {
		//Please dont do this. this makes impossible to write tests which
		//need to create more than one user
		//entityEvent.getEntity().setEmail("Hugh@digitnexu.com");
		entityEvent.getEntity().setAddrLine1("Shenzhen");
	}

}
