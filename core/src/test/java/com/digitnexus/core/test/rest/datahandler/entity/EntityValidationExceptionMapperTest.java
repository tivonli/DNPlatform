package com.digitnexus.core.test.rest.datahandler.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.entity.EntityValidationException;
import com.digitnexus.core.rest.exceptionmapper.EntityValidationExceptionMapper;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.dataobjects.Category;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class EntityValidationExceptionMapperTest  extends BaseTransactionalTest {
	
	@Autowired
	private EntityValidationExceptionMapper entityValidationExceptionMapper;
	
	@Autowired
	private EntityService entityService;
	
	@Test(groups = { "unit" })
	public void toResponse(){
		Category category = new Category("test","","testCode"); 
		try{
			entityService.saveOrUpdate(category);
		}catch(EntityValidationException ex){
			String entityStr=entityValidationExceptionMapper.toResponse(ex).getEntity().toString();
			JsonParser jsonParser = new JsonParser();
			JsonObject jsonObject=jsonParser.parse(entityStr).getAsJsonObject();
			Assert.assertNotNull(jsonObject.get("description").getAsJsonArray().get(0).getAsString());
		}
	}

}
