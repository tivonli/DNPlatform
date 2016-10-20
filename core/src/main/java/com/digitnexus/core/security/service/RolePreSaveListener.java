package com.digitnexus.core.security.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.domain.Menu;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.RoleMenuAssociationDetail;
import com.digitnexus.core.domain.RolePermissionAssociationDetail;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.PreSaveEvent;
import com.digitnexus.core.entity.listener.EntityPreSaveListener;
import com.digitnexus.core.security.dao.UserDao;

/**
 * Listens to Role pre save event and updates User association if Role is not
 * part of User's role
 * 
 * @author adi
 * 
 */
@Service
public class RolePreSaveListener implements EntityPreSaveListener<Role> {
	@Autowired
	private UserDao userDao;

	@Override
	public void onApplicationEvent(PreSaveEvent<Role> event) {
		Role role = event.getEntity();
		List<User> usersToSave=new ArrayList<User>();
		
		Set<User> users = role.getUsers();
		if (users != null && !users.isEmpty()) {
			for (User user : users) {
				if (!user.getRoles().contains(role)) {
					//Need to get object from db because associated User may not contain all the fields 
					User userFromDb=userDao.loadUserByName(user.getUsername());
					userFromDb.addRole(role);
					usersToSave.add(userFromDb);
				}
			}
		}
		
		//This is to check delete assocation scenario
		List<User> usersByRole=userDao.findUsers(role.getId());
		for(User user:usersByRole){
			if(!users.contains(user)){
				user.getRoles().remove(role);
				usersToSave.add(user);
			}
		}
		
		if(!usersToSave.isEmpty()){
			userDao.saveOrUpdateAll(usersToSave);
		}

		//now adjust the roles..
		//the logic goes like this:
		//1. If a child role is assigned a permission then the same permission is automatically 
		//given to all its parents
		//2. If permission is removed from a role then all parents which got the permission
		//because of this role should also be stripped off this permission
		//so go up the tree and assign the new permission, if any, to the parent role
		//first step is to find if there is any new permission
		Set<Permission> permissions = role.getPermissions();
		Set<RolePermissionAssociationDetail> permissionAssociations = role.getPermissionAssociationDetails();
		Set<Permission> newPermissions = findNewPermissions(permissions, permissionAssociations);
		Set<Permission> removedPermissions = findRemovedPermissions(permissions, permissionAssociations);
		for (Permission newPermission:newPermissions) {
			role.addPermissionAssociationDetail(
					new RolePermissionAssociationDetail(role, null, newPermission));
		}
		for (Permission removedPermission:removedPermissions) {
			for (Iterator<RolePermissionAssociationDetail> permissionAssociationItr = permissionAssociations.iterator(); permissionAssociationItr.hasNext();) {
				RolePermissionAssociationDetail permissionAssociation = permissionAssociationItr.next();
				if (removedPermission.equals(permissionAssociation.getPermission())) {
					permissionAssociationItr.remove();
				}
			}
		}
		assignPermissionsToParent(role, role.getParentRole(), newPermissions);
		removePermissionsFromParent(role, role.getParentRole(), removedPermissions);
		
		//there is a bug in the logic above - lets assume a structure like this:
		//          Role1           Now if Role5 is assigned permission P1 then,
		//            |             roles 3,2 and 1 also get the same. Now at this
		//            |             point none of role 3,2,1 can be directly assigned
		//          Role2           this permission P1. Which means removing the
		//            |             permission from Role5 will remove the same from
		//    ________|________     Role3, 2 and 1 as well. Ideally this should have
		//   |                 |    been allowed.
		// Role3             Role4
		//   |
		//   |
		// Role5
		//
		
		// Role-Menu association, copy from role-menu association
		Set<Menu> menus = role.getMenus();
		Set<RoleMenuAssociationDetail> menuAssociations = role.getMenuAssociationDetails();
		Set<Menu> newMenus = findNewMenus(menus, menuAssociations);
		Set<Menu> removedMenus = findRemovedMenus(menus, menuAssociations);
		for (Menu newMenu:newMenus) {
			role.addMenuAssociationDetail(
					new RoleMenuAssociationDetail(role, null, newMenu));
		}
		for (Menu removedMenu:removedMenus) {
			for (Iterator<RoleMenuAssociationDetail> menuAssociationItr = menuAssociations.iterator(); menuAssociationItr.hasNext();) {
				RoleMenuAssociationDetail menuAssociation = menuAssociationItr.next();
				if (removedMenu.equals(menuAssociation.getMenu())) {
					menuAssociationItr.remove();
				}
			}
		}
		assignMenusToParent(role, role.getParentRole(), newMenus);
		removeMenusFromParent(role, role.getParentRole(), removedMenus);
	}
	
	private void assignPermissionsToParent(Role role, Role parentRole, Set<Permission> permissions) {
		if (parentRole == null || CollectionUtils.isEmpty(permissions)) {
			return;
		} else {
			//ensure the parent role is loaded in session
			parentRole = userDao.load(Role.class, parentRole.getId());
		}
		for (Permission permission:permissions) {
			parentRole.addPermission(permission);
			parentRole.addPermissionAssociationDetail(
						new RolePermissionAssociationDetail(parentRole, role, permission));
		}
		assignPermissionsToParent(role, parentRole.getParentRole(), permissions);
	}

	private void removePermissionsFromParent(Role role, Role parentRole, Set<Permission> permissions) {
		if (parentRole == null || CollectionUtils.isEmpty(permissions)) {
			return;
		} else {
			//ensure the parent role is loaded in session
			parentRole = userDao.load(Role.class, parentRole.getId());
		}
		for (Permission permission:permissions) {
			RolePermissionAssociationDetail removedPermissionAssociation = null;
			for (RolePermissionAssociationDetail permissionAssociation:parentRole.getPermissionAssociationDetails()) {
				if (permission.equals(permissionAssociation.getPermission())
						&& role.equals(permissionAssociation.getChildRole())) {
					removedPermissionAssociation = permissionAssociation;
					break;
				}
			}
			if (removedPermissionAssociation != null) {
				parentRole.getPermissionAssociationDetails().remove(removedPermissionAssociation);
				//if the permission does not exist in the permission details collection anymore 
				//then delete that from permissions as well
				boolean deletePermission = true;
				for (RolePermissionAssociationDetail permissionAssociation:parentRole.getPermissionAssociationDetails()) {
					if (permission.equals(permissionAssociation.getPermission())) {
						deletePermission = false;
						break;
					}
				}
				if (deletePermission) {
					parentRole.getPermissions().remove(permission);
				}
			}
		}
		removePermissionsFromParent(role, parentRole.getParentRole(), permissions);
	}
	
	private Set<Permission> findNewPermissions(Set<Permission> permissions, 
			Set<RolePermissionAssociationDetail> permissionAssociations) {
		Set<Permission> newPermissions = new HashSet<Permission>();
		for (Permission permission:permissions) {
			boolean isNew = true;
			for (RolePermissionAssociationDetail permissionAssociation:permissionAssociations) {
				if (permission.equals(permissionAssociation.getPermission())) {
					isNew = false;
					break;
				}
			}
			if (isNew) {
				newPermissions.add(permission);
			}
		}
		return newPermissions;
	}
	
	private Set<Permission> findRemovedPermissions(Set<Permission> permissions, 
			Set<RolePermissionAssociationDetail> permissionAssociations) {
		Set<Permission> removedPermissions = new HashSet<Permission>();
		for (RolePermissionAssociationDetail permissionAssociation:permissionAssociations) {
			boolean isRemoved = true;
			for (Permission permission:permissions) {
				if (permission.equals(permissionAssociation.getPermission())) {
					isRemoved = false;
					break;
				}
			}
			if (isRemoved) {
				removedPermissions.add(permissionAssociation.getPermission());
			}
		}
		return removedPermissions;
	}
	
	
	private void assignMenusToParent(Role role, Role parentRole, Set<Menu> menus) {
		if (parentRole == null || CollectionUtils.isEmpty(menus)) {
			return;
		} else {
			//ensure the parent role is loaded in session
			parentRole = userDao.load(Role.class, parentRole.getId());
		}
		for (Menu menu:menus) {
			parentRole.addMenus(menu);
			parentRole.addMenuAssociationDetail(
						new RoleMenuAssociationDetail(parentRole, role, menu));
		}
		assignMenusToParent(role, parentRole.getParentRole(), menus);
	}
	
	private void removeMenusFromParent(Role role, Role parentRole, Set<Menu> menus) {
		if (parentRole == null || CollectionUtils.isEmpty(menus)) {
			return;
		} else {
			//ensure the parent role is loaded in session
			parentRole = userDao.load(Role.class, parentRole.getId());
		}
		for (Menu menu:menus) {
			RoleMenuAssociationDetail removedMenuAssociation = null;
			for (RoleMenuAssociationDetail menuAssociation:parentRole.getMenuAssociationDetails()) {
				if (menu.equals(menuAssociation.getMenu())
						&& role.equals(menuAssociation.getChildRole())) {
					removedMenuAssociation = menuAssociation;
					break;
				}
			}
			if (removedMenuAssociation != null) {
				parentRole.getMenuAssociationDetails().remove(removedMenuAssociation);
				//if the menu does not exist in the menu details collection anymore 
				//then delete that from menus as well
				boolean deleteMenu = true;
				for (RoleMenuAssociationDetail menuAssociation:parentRole.getMenuAssociationDetails()) {
					if (menu.equals(menuAssociation.getMenu())) {
						deleteMenu = false;
						break;
					}
				}
				if (deleteMenu) {
					parentRole.getMenus().remove(menu);
				}
			}
		}
		removeMenusFromParent(role, parentRole.getParentRole(), menus);
	}
	
	private Set<Menu> findNewMenus(Set<Menu> menus, 
			Set<RoleMenuAssociationDetail> menuAssociations) {
		Set<Menu> newMenus = new HashSet<Menu>();
		for (Menu menu:menus) {
			boolean isNew = true;
			for (RoleMenuAssociationDetail menuAssociation:menuAssociations) {
				if (menu.equals(menuAssociation.getMenu())) {
					isNew = false;
					break;
				}
			}
			if (isNew) {
				newMenus.add(menu);
			}
		}
		return newMenus;
	}
	
	private Set<Menu> findRemovedMenus(Set<Menu> menus, 
			Set<RoleMenuAssociationDetail> menuAssociations) {
		Set<Menu> removedMenus = new HashSet<Menu>();
		for (RoleMenuAssociationDetail menuAssociation:menuAssociations) {
			boolean isRemoved = true;
			for (Menu menu:menus) {
				if (menu.equals(menuAssociation.getMenu())) {
					isRemoved = false;
					break;
				}
			}
			if (isRemoved) {
				removedMenus.add(menuAssociation.getMenu());
			}
		}
		return removedMenus;
	}
}
