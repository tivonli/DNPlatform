package com.digitnexus.core.test.security.aop;

import javax.inject.Inject;
import javax.inject.Named;

import org.springframework.stereotype.Service;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.security.annotation.CreateEditEntityPermission;
import com.digitnexus.core.security.annotation.CreatePermission;
import com.digitnexus.core.security.annotation.DeletePermission;
import com.digitnexus.core.security.annotation.EditPermission;
import com.digitnexus.core.security.annotation.ReadPermission;
import com.digitnexus.core.security.annotation.SecuredResource;

@Service
public class SecuredServiceImpl implements SecuredService {
	@Inject
	@Named("baseDao")
	private BaseDao baseDao;

	@ReadPermission(resource="com.digitnexus.core.test.security.aop.SecuredEntity")
	@Override
	public void checkRead(SecuredEntity securedEntity) {
		securedEntity.setRead(true);

	}
    
	@CreatePermission(resource="com.digitnexus.core.test.security.aop.SecuredEntity")
	@Override
	public void checkCreate(SecuredEntity securedEntity) {
		securedEntity.setCreated(true);
	}
    
	@EditPermission(resource="com.digitnexus.core.test.security.aop.SecuredEntity")
	@Override
	public void checkEdit(SecuredEntity securedEntity) {
		securedEntity.setEdited(true);

	}

	@DeletePermission(resource="com.digitnexus.core.test.security.aop.SecuredEntity")
	@Override
	public void checkDelete(SecuredEntity securedEntity) {
		securedEntity.setDeleted(true);
	}

	@ReadPermission
	@Override
	public void checkReadWithoutResource(String test,@SecuredResource SecuredEntity securedEntity) {
		//Do nothing		
	}
	
	@ReadPermission
	@Override
	public void checkReadWithoutResourceClass(@SecuredResource Class<?> entityType, SecuredEntity securedEntity) {
		//Do nothing		
	}

	@CreateEditEntityPermission
	@Override
	public void checkCreateEditEntity(@SecuredResource Permission permission) {
		if(baseDao.isTransient(permission)){
			permission.setDescription("create");
		}else{
			permission.setDescription("edit");
		}
	}

}
