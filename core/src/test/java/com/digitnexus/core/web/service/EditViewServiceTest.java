package com.digitnexus.core.web.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Response;

import org.easymock.EasyMock;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.domain.Organization;
import com.digitnexus.core.domain.Role;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.entity.EntityValidationException;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.attachment.service.AttachmentService;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.dataobjects.Asset;
import com.digitnexus.core.test.dataobjects.GenericArticle;
import com.digitnexus.core.test.dataobjects.ProductMaster;
import com.digitnexus.core.test.dataobjects.Uom;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.sun.jersey.core.header.FormDataContentDisposition;

/**
 * 
 * @author adi
 * 
 */
public class EditViewServiceTest extends BaseTransactionalTest {
	@Autowired
	private EditViewService		editViewService;
	@Autowired
	private BaseDao				baseDao;
	@Autowired
	private UiConfiguration		uiConfiguration;
	@Autowired
	private EntityService		entityService;
	@Autowired
	private AttachmentService	attachmentService;
	@Autowired
	private AttachmentDao		attachmentDao;

	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getArticleDataResponse() {
		GenericArticle genericArticle = new GenericArticle("article");
		entityService.saveOrUpdate(genericArticle);
		EditViewMetaData editViewMetaData = uiConfiguration.getEditViewMeta(GenericArticle.class.getName());
		String jsonData = editViewService.getArticleDataResponse(editViewMetaData.getName(), genericArticle.getId() + "");

		GenericArticle unmarshalledArticle = JsonUtil.toObject(jsonData, GenericArticle.class);

		Assert.assertEquals(unmarshalledArticle.getId(), genericArticle.getId());
		Assert.assertEquals(unmarshalledArticle.getName(), genericArticle.getName());
		// This should throw NullPionterException
		editViewService.getArticleDataResponse("article not supposed to exist", "1");
	}

	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" }, expectedExceptions = { EntityValidationException.class })
	public void saveArticle() {
		GenericArticle genericArticle = new GenericArticle("article");
		EditViewMetaData editViewMetaData = uiConfiguration.getEditViewMeta(GenericArticle.class.getName());

		String jsonData = JsonUtil.toJson(genericArticle, editViewMetaData);
		editViewService.saveArticle(editViewMetaData.getName(), jsonData);

		List<GenericArticle> genericArticles = baseDao.find("from GenericArticle where name = \'article\'");
		Assert.assertEquals(genericArticles.size(), 1);

		// References scenario
		User user = getUserObject();
		addOrganizationAndRoles(user);
		editViewMetaData = uiConfiguration.getEditViewMeta(User.class.getName());
		jsonData = JsonUtil.toJson(user, editViewMetaData);
		editViewService.saveArticle(editViewMetaData.getName(), jsonData);
		user = baseDao.get(User.class, user.getUsername());

		Assert.assertEquals(user.getOrganization().getName(), "org");
		Assert.assertEquals(user.getRoles().iterator().next().getName(), "test");

		genericArticle = genericArticles.get(0);
		jsonData = JsonUtil.toJson(genericArticle, editViewMetaData);
		// This will throw EntityValidationException
		editViewService.saveArticle(GenericArticle.class.getName(), jsonData);
	}

	@Test(groups = { "unit" }, expectedExceptions = { StaleDataException.class })
	public void updateArticle() {
		GenericArticle genericArticle = new GenericArticle("article");
		entityService.saveOrUpdate(genericArticle);
		Assert.assertFalse(genericArticle.isBooleanPrimitive());
		genericArticle.setBooleanPrimitive(true);

		EditViewMetaData editViewMetaData = uiConfiguration.getEditViewMeta(GenericArticle.class.getName());
		String jsonData = JsonUtil.toJson(genericArticle, editViewMetaData);

		editViewService.updateArticle(editViewMetaData.getName(), jsonData);
		GenericArticle updatedArticle = baseDao.get(GenericArticle.class, genericArticle.getId());
		Assert.assertTrue(updatedArticle.isBooleanPrimitive());

		// References scenario
		User user = getUserObject();
		entityService.saveOrUpdate(user);
		addOrganizationAndRoles(user);
		editViewMetaData = uiConfiguration.getEditViewMeta(User.class.getName());
		jsonData = JsonUtil.toJson(user, editViewMetaData);
		editViewService.updateArticle(editViewMetaData.getName(), jsonData);
		user = baseDao.get(User.class, user.getUsername());

		Assert.assertEquals(user.getOrganization().getName(), "org");
		Assert.assertEquals(user.getRoles().iterator().next().getName(), "test");

		// Creating scenario for generating StaleDataException
		user.setLockVersion(user.getLockVersion() - 1);
		jsonData = JsonUtil.toJson(user, editViewMetaData);
		// This should throw StaleDataException
		editViewService.updateArticle(editViewMetaData.getName(), jsonData);

	}

	@Test(groups = { "unit" })
	public void deleteDataRecords() {
		GenericArticle genericArticle1 = new GenericArticle("article1");
		entityService.saveOrUpdate(genericArticle1);

		GenericArticle genericArticle2 = new GenericArticle("article2");
		entityService.saveOrUpdate(genericArticle2);

		editViewService.deleteDataRecords(GenericArticle.class.getName(), genericArticle1.getId() + "," + genericArticle2.getId());

		Assert.assertNull(baseDao.get(GenericArticle.class, genericArticle1.getId()));
		Assert.assertNull(baseDao.get(GenericArticle.class, genericArticle2.getId()));

	}

	@Test(groups = { "unit" }, expectedExceptions = { NullPointerException.class })
	public void getEditMetaDataResponse() {
		String editMetaJson = editViewService.getEditMetaDataResponse(GenericArticle.class.getName(), null);
		EditViewMetaData editViewMeta = JsonUtil.toObject(editMetaJson, EditViewMetaData.class);
		Assert.assertEquals(editViewMeta.getName(), GenericArticle.class.getName());

		// With parent
		editMetaJson = editViewService.getEditMetaDataResponse("uom", ProductMaster.class.getName());
		editViewMeta = JsonUtil.toObject(editMetaJson, EditViewMetaData.class);
		Assert.assertEquals(editViewMeta.getName(), Uom.class.getName());

		// NullPointerException
		editViewService.getEditMetaDataResponse("article not supposed to exist", null);
	}

	private void addOrganizationAndRoles(User user) {
		Organization organization = new Organization();
		organization.setId("org");
		organization.setName("org");
		organization.setCode("parentCode");

		entityService.saveOrUpdate(organization);

		user.setOrganization(organization);

		Role role = new Role("test");
		entityService.saveOrUpdate(role);
		user.getRoles().add(role);
	}

	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" })
	public void saveAttachment() throws IOException {
		Asset asset = new Asset();
		asset.setName("asset1");
		asset.setGuid("guid1");
		entityService.saveOrUpdate(asset);

		InputStream fileStream = applicationContext.getResource("classpath:attachments/icon_admin.gif").getInputStream();
		FormDataContentDisposition fileInfo = FormDataContentDisposition.name("test").fileName("icon_admin.gif").build();
		ServletContext servletContext = EasyMock.createMock(ServletContext.class);
		Response response = editViewService.saveAttachment(Asset.class.getName(), asset.getId() + "", "attachmentDescription", fileStream,
				fileInfo, servletContext);
		String responseJson = (String) response.getEntity();
		Map<String, String> attachmentMeta = JsonUtil.toList(responseJson, Map.class).get(0);
		String attachmentId = attachmentMeta.get("id");

		try {
			Assert.assertNotNull(attachmentId);
			AttachmentObject attacmentObject = attachmentDao.loadAttachment(attachmentId);
			Assert.assertNotNull(attacmentObject);
			Assert.assertEquals(attacmentObject.getFileName(), "icon_admin.gif");
		} finally {
			// Clean up
			attachmentService.deleteAttachment(attachmentId);
		}

	}

}
