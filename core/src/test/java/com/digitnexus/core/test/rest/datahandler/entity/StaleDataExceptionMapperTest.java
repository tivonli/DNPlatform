package com.digitnexus.core.test.rest.datahandler.entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.rest.exceptionmapper.StaleDataExceptionMapper;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.web.service.StaleDataException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class StaleDataExceptionMapperTest  extends BaseTransactionalTest {
	
	@Autowired
	private StaleDataExceptionMapper staleDataExceptionMapper;
	
	@Test(groups = { "unit" })
	public void toResponse(){
		StaleDataException ex = new StaleDataException();
		String entityStr=staleDataExceptionMapper.toResponse(ex).getEntity().toString();
		JsonParser jsonParser = new JsonParser();
		JsonObject jsonObject=jsonParser.parse(entityStr).getAsJsonObject();
		Assert.assertEquals(jsonObject.get("all").getAsJsonArray().get(0).getAsString(),I18NUtil.getMessage("error_stale_data"));
		
	}

}
