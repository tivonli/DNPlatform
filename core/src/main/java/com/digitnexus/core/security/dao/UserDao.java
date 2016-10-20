package com.digitnexus.core.security.dao;

import java.util.List;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.User;

public interface UserDao extends BaseDao {
	public void deleteExpiredPasswordResetInfo();

	/**
	 * access user data directly(across access control),for login module
	 * 
	 * @param username
	 * @return
	 */
	public User loadUserByName(String username);
    
	/**
	 * Find Users by role
	 * @param roleId
	 * @return
	 */
	public List<User> findUsers(long roleId);
}
