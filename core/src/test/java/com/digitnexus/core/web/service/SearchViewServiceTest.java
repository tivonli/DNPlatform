package com.digitnexus.core.web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.test.dataobjects.GenericArticle;
import com.digitnexus.core.test.dataobjects.ProductMaster;
import com.digitnexus.core.test.dataobjects.Uom;
import com.digitnexus.core.web.ui.config.dataobject.SearchMetaData;
/**
 * 
 * @author adi
 *
 */
public class SearchViewServiceTest extends BaseTest {
	@Autowired
	private SearchViewService searchViewService;
	
	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getSearchMetaDataResponse() {
		String listMetaJson = searchViewService.getSearchMetaDataResponse(GenericArticle.class.getName(), null);
		SearchMetaData searchMetaData = JsonUtil.toObject(listMetaJson, SearchMetaData.class);
		Assert.assertEquals(searchMetaData.getName(), GenericArticle.class.getName());

		listMetaJson = searchViewService.getSearchMetaDataResponse("uom", ProductMaster.class.getName());
		searchMetaData = JsonUtil.toObject(listMetaJson, SearchMetaData.class);
		Assert.assertEquals(searchMetaData.getName(), Uom.class.getName());
		
		// NullPointerException
		searchViewService.getSearchMetaDataResponse("article not supposed to exist", null);
	}


}
