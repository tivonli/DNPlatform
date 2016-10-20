package com.digitnexus.core.security.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.Menu;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.security.dao.AdminDao;

@Service
public class AdminServiceImpl implements AdminService {
	
	@Autowired
	private AdminDao adminDao;

	@Override
	public Set<String> getSecuredResources() {
		return adminDao.getSecuredResources();
	}

	@Override
	public boolean isPermissionDefined(String resource, UserOperation userOperation) {
		return adminDao.getPermission(resource, userOperation)!=null;
	}

	@Override
	public Role getRoleByName(String roleName) {
		return adminDao.getRoleByName(roleName);
	}
	
	@Override
	public List<Menu> getAllMenus() {
		return adminDao.getAll(Menu.class);
	}

	@Override
	public Permission getPermissionByName(String permissionName) {
		return adminDao.getPermissionByName(permissionName);
	}

}
