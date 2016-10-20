package com.digitnexus.core.test.entity.listener;

import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.ValidateEvent;
import com.digitnexus.core.entity.listener.EntityValidateListener;
/**
 * this is a validate event , when user name not equals 'test'
 * the validation will fail
 * @author Hugh
 */
@Service
public class UserValidateListener implements EntityValidateListener<User> {

	@Override
	public void onApplicationEvent(ValidateEvent<User> entityEvent) {
		 User user =entityEvent.getEntity();
		  if(user.getUsername()!=null && !user.getUsername().startsWith("test")){
			  entityEvent.addMessage("test validation message");
		  }
		
	}

}
