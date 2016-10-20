package com.digitnexus.core.security.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import net.sf.ehcache.Element;

import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.digitnexus.core.CoreConstants;
import com.digitnexus.core.cache.EhcacheClient;
import com.digitnexus.core.domain.Menu;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.security.service.AdminService;
import com.digitnexus.core.security.service.UserService;
import com.digitnexus.core.spring.ServiceLocator;

/**
 * 
 * @author Adi
 * 
 */
public class SecurityUtil {
	private static User admin;
	private static final String ADMIN_USER_NAME = "admin";
	private static AdminService adminService;
	private static UserService userService;
//	private static List<Menu> allMenus;

	private SecurityUtil() {

	}

	/**
	 * Gives current logged in user
	 */
	public static User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext()
		        .getAuthentication();
		if (authentication != null && authentication.getPrincipal() != null) {
			Object object = authentication.getPrincipal();
			// It will not be user in case of anonymous authentication. In case
			// of anonymous authentication it will be String
			if (object instanceof User) {
				return (User) object;
			}
		}

		return null;
	}

	/**
	 * Get the auth menus
	 */
    @SuppressWarnings("unchecked")
    public static List<Menu> getAuthMenus() {
		User user = getCurrentUser();
		Element e = EhcacheClient.getCache(CoreConstants.CACHE_MENU).get(user.getUsername());
		if (e != null) {
			return ( List<Menu>)e.getObjectValue();
		} else {
			List<Menu> menuList = new ArrayList<Menu>();
			if (ADMIN_USER_NAME.equals(user.getUsername())) {
					menuList = adminService.getAllMenus();
			} else {
				// use set to avoid adding duplicated menu
				Set<Menu> menuSet = new TreeSet<Menu>(new Comparator<Menu>() {
					@Override
					 public int compare(Menu m1, Menu m2) {
						 if (m1.getId() < m2.getId()) {
							 return -1;
						 } else if (m1.getId() > m2.getId()) {
							 return 1;
						 } else {
							 return 0;
						 }
					 }
				});
				for (Role role : getCurrentUser().getRoles()) {
					for (Menu menu : role.getMenus()) {
						menuSet.add(menu);
					}
				}
				menuList.addAll(menuSet);
			}
			
			List<Menu> results = new ArrayList<Menu>();
			for(Menu tmp : menuList) {
				Menu menu = tmp.clone();
				menu.setName(I18NUtil.getMessage(tmp.getName(), null, tmp.getName(), user.getLocale()));
				results.add(menu);
			}
			
			return results;
		}
	}

	/**
	 * If user has edit or create or delete permission, user is allowed to read
	 * as well
	 * 
	 * @param userOperation
	 * @param resource
	 * @return
	 */
	public static boolean hasPermission(UserOperation userOperation,
	        String resource) {

		for (Role role : getCurrentUser().getRoles()) {
			for (Permission permission : role.getPermissions()) {
				switch (userOperation) {
				case READ:
					if (permission.getResource().equals(resource)) {
						return true;
					}
					break;
				default:
					if (permission.getUserOperation().equals(userOperation)
					        && permission.getResource().equals(resource)) {
						return true;
					}
					break;
				}

			}
		}
		return false;
	}

	public static boolean isSecuredResource(String resource) {
		return getAdminService().getSecuredResources().contains(resource);
	}

	public static boolean isPermissionDefined(String resource,
	        UserOperation userOperation) {
		return getAdminService().isPermissionDefined(resource, userOperation);
	}

	public static void loginAsAdmin() {
		if (admin == null) {
			admin = (User) getUserService().loadUserByUsername(ADMIN_USER_NAME);
		}
		SecurityContextHolder.getContext().setAuthentication(
		        new TestingAuthenticationToken(admin, null));
	}

	public static boolean isAdmin() {
		return getCurrentUser().getUsername().equals(ADMIN_USER_NAME);
	}

	private static AdminService getAdminService() {
		if (adminService == null) {
			adminService = ServiceLocator.getService(AdminService.class);
		}
		return adminService;
	}

	private static UserService getUserService() {
		if (userService == null) {
			userService = ServiceLocator.getService(UserService.class);
		}
		return userService;
	}

}
