package com.digitnexus.core.security.dao;

import java.util.Calendar;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;

@Repository
public class UserDaoImpl extends BaseDaoImpl implements UserDao {

	@Override
	public void deleteExpiredPasswordResetInfo() {
	    //Get date 24 hours before current time. We assume db server time and app server time is in sync
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.HOUR_OF_DAY, -24);
		getNamedQuery("PasswordResetInfo.deleteExpired").setTimestamp("date24hourAgo", cal.getTime()).executeUpdate();
		
	}

	@Override
	public User loadUserByName(String username) {
		User user = (User) getSession().get(User.class, username);
//		for (Role role : user.getRoles()) {
			// load this object again, in order to get the related menus and permissions
//			role = this.get(Role.class, role.getId());
//			System.out.println();
//		}
		return user;
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<User> findUsers(long roleId){
		return getNamedQuery("User.findUsersByRoles").setLong(0, roleId).list();
	}

}
