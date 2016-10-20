package com.digitnexus.core.test.entity.listener;

import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.DeleteEvent;
import com.digitnexus.core.entity.listener.EntityDeleteListener;
/**
 * test the delete event , when delete successed 
 * it will update the user state to 'deleted'
 * @author Hugh
 */
@Service
public class UserDeleteListener implements EntityDeleteListener<User> {
	@Override
	public void onApplicationEvent(DeleteEvent<User> event) {
		event.getEntity().setState("deleted");
		
	}

}
