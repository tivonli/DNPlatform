package com.digitnexus.core.test.entity.listener;

import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.PostSaveEvent;
import com.digitnexus.core.entity.listener.EntityPostSaveListener;
/**
 * Test the post save event , when save succeed 
 * it will update the user fullname to 'haveUpdatedNotInserDB'
 * @author Hugh
 */
@Service
public class UserPostSaveListener implements EntityPostSaveListener<User> {

	
	@Override
	public void onApplicationEvent(PostSaveEvent<User> entityEvent) {
		entityEvent.getEntity().setFullName("haveUpdatedNotInserDB");
		
	}
}