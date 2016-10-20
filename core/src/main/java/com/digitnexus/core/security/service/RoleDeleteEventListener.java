package com.digitnexus.core.security.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.DeleteEvent;
import com.digitnexus.core.entity.listener.EntityDeleteListener;
/**
 * Listens to delete event and removes any associations for which this class is not owner
 * @author adi
 *
 */
@Service
public class RoleDeleteEventListener implements EntityDeleteListener<Role> {

	@Override
	public void onApplicationEvent(DeleteEvent<Role> event) {
		//Clean up association
		//Remove users
		Role role=event.getEntity();
		Set<User> usersInRole=role.getUsers();
		if(usersInRole!=null && !usersInRole.isEmpty()){
			for(User user:usersInRole){
				user.getRoles().remove(role);
			}
			usersInRole.clear();
		}
		
		Role parentRole = role.getParentRole();
		if (parentRole != null) {
			parentRole.getSubRoles().remove(role);
		}
	}

}
