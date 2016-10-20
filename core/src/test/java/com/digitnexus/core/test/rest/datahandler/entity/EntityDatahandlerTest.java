package com.digitnexus.core.test.rest.datahandler.entity;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.entity.EntityConfigurationService;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.rest.datahandler.entity.EntityDataHandler;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.dataobjects.Category;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class EntityDatahandlerTest extends BaseTransactionalTest {

	@Autowired
	private EntityService						entityService;
	@Inject
	@Named("baseDao")
	private BaseDao								baseDao;
	@Autowired
	private EntityConfigurationService			entityConfigurationService;
	
	private EntityDataHandler entityDatahandle;
	
	private Gson gson = new Gson();
	
	@BeforeMethod(groups = { "unit" })
	public void initialMethod(){
		entityDatahandle= new EntityDataHandler();
		entityDatahandle.setBaseDao(baseDao);
		entityDatahandle.setEntityService(entityService);
		entityDatahandle.setEntityConfigurationService(entityConfigurationService);
		Category category = new Category("test","test","testCode"); 
		entityService.saveOrUpdate(category);
	}
	
	
	@Test(groups = { "unit" })
	public void getEntityAsJson(){
		String entity=entityDatahandle.getEntityAsJson("TestCategory", "test");
		Category category=gson.fromJson(entity, Category.class);
		Assert.assertEquals(category.getName(), "test");
	}
	
	@Test(groups = { "unit" })
	public void getEntitiesAsJson(){
		UriInfo uriInfo =new TestUri();
		MultivaluedMap<String, String>  map=uriInfo.getQueryParameters();
		List<String> stringValues =new ArrayList<String>();
		stringValues.add("test");
		map.put("name", stringValues);
		Type type =new TypeToken<List<Category>>(){}.getType();
		String entities = entityDatahandle.getEntitiesAsJson("TestCategory", uriInfo);
		List<Category> categorys =gson.fromJson(entities, type);
		Assert.assertTrue(categorys.size()==1);
		Assert.assertEquals(categorys.get(0).getName(), "test");
	
	}
	
	@Test(groups = { "unit" })
	public void save(){
		Category category = new Category("testsave","testsave","testCodesave");
		entityDatahandle.save("TestCategory", gson.toJson(category));
		Assert.assertNotNull(entityService.get(Category.class, category.getName()));
	}
	
	@Test(groups = { "unit" })
	public void update(){
		Category category = new Category("testUpdate","testUpdate","testUpdate");
		entityService.saveOrUpdate(category);
		category.setCode("to be updated");
		entityDatahandle.update("TestCategory", gson.toJson(category));
		Category categoryUpdated=entityService.get(Category.class, category.getName());
		Assert.assertTrue(categoryUpdated.getCode().equals(category.getCode()));
		
	}
	
	@Test(groups = { "unit" })
	public void deleteEntity(){
		Assert.assertNotNull(entityService.get(Category.class, "test"));
		entityDatahandle.deleteEntity("TestCategory", "test");
		Assert.assertNull(entityService.get(Category.class, "test"));
	}


}
