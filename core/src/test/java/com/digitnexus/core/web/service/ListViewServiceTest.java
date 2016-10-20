package com.digitnexus.core.web.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.UriInfo;
import com.digitnexus.core.test.dataobjects.Category;
import com.digitnexus.core.test.dataobjects.GenericArticle;
import com.digitnexus.core.test.dataobjects.ProductMaster;
import com.digitnexus.core.test.dataobjects.Uom;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;
import com.digitnexus.core.web.ui.config.dataobject.ListViewData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * 
 * @author adi
 *
 */
public class ListViewServiceTest extends BaseTransactionalTest {
	@Autowired
	private ListViewService	listViewService;
	@Autowired
	private BaseDao			baseDao;
	@Autowired
	private EntityService  entityService;

	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getListMetaDataResponse() {
		String listMetaJson = listViewService.getListMetaDataResponse(GenericArticle.class.getName(), null);
		ListViewMetaData listMetaData = JsonUtil.toObject(listMetaJson, ListViewMetaData.class);
		Assert.assertEquals(listMetaData.getName(), GenericArticle.class.getName());

		listMetaJson = listViewService.getListMetaDataResponse("uom", ProductMaster.class.getName());
		listMetaData = JsonUtil.toObject(listMetaJson, ListViewMetaData.class);
		Assert.assertEquals(listMetaData.getName(), Uom.class.getName());
		
		// NullPointerException
		listViewService.getListMetaDataResponse("article not supposed to exist", null);
	}

	@Test(groups = { "unit" })
	public void getListDataCount() {
		createGenericArticles();
		String dataCountResponse = listViewService.getListDataCount(GenericArticle.class.getName(), null);
		Assert.assertEquals(dataCountResponse, "20");

		// Add search criteria
		UriInfo uriInfo = new UriInfo();
		uriInfo.putQueryParameter("name", "article").putQueryParameter("name_criteria", SearchOperator.LIKE.toString());
		dataCountResponse = listViewService.getListDataCount(GenericArticle.class.getName(), uriInfo);
		Assert.assertEquals(dataCountResponse, "20");

		// Order By
		uriInfo = new UriInfo();
		uriInfo.putQueryParameter("sortColumns", "name").putQueryParameter("sortOrder", "asc");
		dataCountResponse = listViewService.getListDataCount(GenericArticle.class.getName(), uriInfo);
		Assert.assertEquals(dataCountResponse, "20");

		// Equals
		uriInfo = new UriInfo();
		uriInfo.putQueryParameter("name", "article1").putQueryParameter("name_criteria", SearchOperator.EQUAL.toString());
		dataCountResponse = listViewService.getListDataCount(GenericArticle.class.getName(), uriInfo);
		Assert.assertEquals(dataCountResponse, "1");

	}

	@Test(groups = { "unit" })
	public void getListDataResponse() {
		createGenericArticles();
		String jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), null, 0, null);
		List<ListViewData> listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 20);

		// If page index is given and page is null, page size is 10
		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), null, 1, null);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 10);

		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), null, 1, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 5);

		// Sort
		UriInfo uriInfo = new UriInfo();
		uriInfo.putQueryParameter("sortColumns", "name").putQueryParameter("sortOrder", "asc");
		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), null, 1, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 5);
		for (int i = 0; i < 4; i++) {
			String name1 = (String) listData.get(i).getData().get("name");
			String name2 = (String) listData.get(i + 1).getData().get("name");
			Assert.assertEquals(name1.compareTo(name2), -1);
		}

		uriInfo = new UriInfo();
		uriInfo.putQueryParameter("name", "article").putQueryParameter("name_criteria", SearchOperator.LIKE.toString());
		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), uriInfo, 1, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 5);

		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), uriInfo, null, null);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 20);

		// Equals
		uriInfo = new UriInfo();
		uriInfo.putQueryParameter("name", "article1").putQueryParameter("name_criteria", SearchOperator.EQUAL.toString());
		jsonResponseData = listViewService.getListDataResponse(GenericArticle.class.getName(), uriInfo, null, null);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 1);
	}

	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getEditViewAssociationListDataCount() {
		createProductCategories();
		String dataCount = listViewService.getEditViewAssociationListDataCount(ProductMaster.class.getName(), "category", null);
		Assert.assertEquals(dataCount, "20");

		// with criteria
		UriInfo uriInfo = new UriInfo();
		uriInfo.putQueryParameter("code", "code1").putQueryParameter("code_criteria", SearchOperator.EQUAL.toString());
		dataCount = listViewService.getEditViewAssociationListDataCount(ProductMaster.class.getName(), "category", uriInfo);
		Assert.assertEquals(dataCount, "1");

		// This will generate NullPointerException
		listViewService.getEditViewAssociationListDataCount(ProductMaster.class.getName(), "non existent property", null);
	}

	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getEditViewAssociationListDataResponse() {
		createProductCategories();
		String jsonResponseData = listViewService.getEditViewAssociationListDataResponse(ProductMaster.class.getName(), "category", null,
				null, null);
		List<ListViewData> listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 20);
		
		//Size limit
		jsonResponseData = listViewService.getEditViewAssociationListDataResponse(ProductMaster.class.getName(), "category", null,
				2, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 5);

		// with criteria
		UriInfo uriInfo = new UriInfo();
		uriInfo.putQueryParameter("code", "code1").putQueryParameter("code_criteria", SearchOperator.EQUAL.toString());
		jsonResponseData = listViewService.getEditViewAssociationListDataResponse(ProductMaster.class.getName(), "category", uriInfo,
				1, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 1);
		
		//NullPointerException
		listViewService.getEditViewAssociationListDataResponse(ProductMaster.class.getName(), "non existent property", null,	null, null);
	}
	
	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getSearchViewAssociationListDataCount() {
		createProductCategories();
		String dataCount = listViewService.getSearchViewAssociationListDataCount(ProductMaster.class.getName(), "category");
		Assert.assertEquals(dataCount, "20");

		// This will generate NullPointerException
		listViewService.getSearchViewAssociationListDataCount(ProductMaster.class.getName(), "non existent property");
	}
	
	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getSearchViewAssociationListDataResponse() {
		createProductCategories();
		String jsonResponseData = listViewService.getSearchViewAssociationListDataResponse(ProductMaster.class.getName(), "category", null,
				null, null);
		List<ListViewData> listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 20);
		
		//Size limit
		jsonResponseData = listViewService.getSearchViewAssociationListDataResponse(ProductMaster.class.getName(), "category", null,
				2, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 5);

		// with criteria
		UriInfo uriInfo = new UriInfo();
		uriInfo.putQueryParameter("code", "code1").putQueryParameter("code_criteria", SearchOperator.EQUAL.toString());
		jsonResponseData = listViewService.getSearchViewAssociationListDataResponse(ProductMaster.class.getName(), "category", uriInfo,
				1, 5);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 1);
		
		//NullPointerException
		listViewService.getSearchViewAssociationListDataResponse(ProductMaster.class.getName(), "non existent property", null,	null, null);
	}
	
	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getListViewAssociationListDataCount() {
		User user=createUserAndRoles();
		UriInfo uriInfo=new UriInfo();
		uriInfo.putQueryParameter("sourceArticle", User.class.getName()).putQueryParameter("idValue",user.getUsername());
		String dataCount=listViewService.getListViewAssociationListDataCount("roles", uriInfo);
		Assert.assertEquals(dataCount, "2");
		Assert.assertTrue(baseDao.getAll(Role.class).size()>2);
		
		//With criteria
		uriInfo.putQueryParameter("name", "role1").putQueryParameter("name_criteria", SearchOperator.EQUAL.toString());
		dataCount=listViewService.getListViewAssociationListDataCount("roles", uriInfo);
		Assert.assertEquals(dataCount, "1");
		
		//NullPointerException
		listViewService.getListViewAssociationListDataCount( "non existent property", uriInfo);
	}
	
	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getListViewAssociationListDataResponse() {
		User user=createUserAndRoles();
		UriInfo uriInfo=new UriInfo();
		uriInfo.putQueryParameter("sourceArticle", User.class.getName()).putQueryParameter("idValue",user.getUsername());
		String jsonResponseData=listViewService.getListViewAssociationListDataResponse("roles", uriInfo, null, null);
		List<ListViewData> listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 2);
		
		//Page size limit
		jsonResponseData=listViewService.getListViewAssociationListDataResponse("roles", uriInfo, 1, 1);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 1);
		
		//With criteria
		uriInfo.putQueryParameter("name", "role1").putQueryParameter("name_criteria", SearchOperator.EQUAL.toString());
		jsonResponseData=listViewService.getListViewAssociationListDataResponse("roles", uriInfo, null, null);
		listData = JsonUtil.toList(jsonResponseData, ListViewData.class);
		Assert.assertEquals(listData.size(), 1);
		Assert.assertEquals(listData.get(0).getData().get("name"), "role1");
		
		//NullPointerException
		listViewService.getListViewAssociationListDataResponse( "non existent property", uriInfo,null,null);
		
		
	}

	private User createUserAndRoles() {
		User user=getUserObject();
		
		//Create 3 roles and assign 2 to user
		Role role=new Role("role1");
		entityService.saveOrUpdate(role);
		user.addRole(role);
		
		role=new Role("role2");
		entityService.saveOrUpdate(role);
		user.addRole(role);
		
		role=new Role("role3");
		entityService.saveOrUpdate(role);
		
		entityService.saveOrUpdate(user);
		
		return user;
		
	}

	private void createProductCategories() {
		List<Category> categories = new ArrayList<Category>();
		for (int i = 0; i < 20; i++) {
			categories.add(new Category("category" + i, "description" + i, "code" + i));
		}
		baseDao.saveOrUpdateAll(categories);

	}

	private void createGenericArticles() {
		List<GenericArticle> articles = new ArrayList<GenericArticle>(20);
		for (int i = 0; i < 20; i++) {
			articles.add(new GenericArticle("article" + i));
		}
		baseDao.saveOrUpdateAll(articles);
	}

}
