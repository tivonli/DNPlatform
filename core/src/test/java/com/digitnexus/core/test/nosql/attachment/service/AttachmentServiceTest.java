/**
 * 
 */
package com.digitnexus.core.test.nosql.attachment.service;

import java.io.InputStream;
import java.util.List;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.attachment.service.AttachmentService;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.test.nosql.attachment.TestAttachmentEntity;

/**
 * @author Santanu
 *
 */
public class AttachmentServiceTest extends BaseTest {
	
	private static final String TEST_DUMMY_CLASS_NAME = TestAttachmentEntity.class.getName();
	private static final String TEST_DUMMY_FIELD_NAME = "attachment";
	private static final String TEST_DUMMY_ARTICLE_ID = "ainwoaewbr4442";
	
	@Autowired
	private AttachmentService attachmentService;
	@Autowired
	private AttachmentDao attachmentDao;
	
	/**
	 * @return
	 */
	private AttachmentObject createAttachmentObject() {
		return createAttachmentObject(TEST_DUMMY_CLASS_NAME, TEST_DUMMY_FIELD_NAME, TEST_DUMMY_ARTICLE_ID);
	}
	
	private AttachmentObject createAttachmentObject(String articleType, String articleField, String articleId) {
		AttachmentObject attachment = new AttachmentObject();
		attachment.setParentArticleType(articleType);
		attachment.setParentArticleField(articleField);
		attachment.setParentArticleId(articleId);
		attachment.setData(createInputStream());
		attachment.setFileName("log4j.xml");
		return attachment;
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetAttachment() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		Response response = attachmentService.getAttachment(attachment.getId().toString());
		Assert.assertEquals(response.getStatus(), 200, "Response is not a success");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testDeleteAttachment() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		attachmentService.deleteAttachment(attachment.getId().toString());
		
		AttachmentObject persistedAttachment = attachmentDao.getAttachment(attachment.getId());
		Assert.assertNull(persistedAttachment, "Attachment should not be there");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetAttachments() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		TestAttachmentEntity entity = new TestAttachmentEntity();
		entity.setId(TEST_DUMMY_ARTICLE_ID);
		
		String attachmentJson = attachmentService.getAttachments(TEST_DUMMY_CLASS_NAME, TEST_DUMMY_FIELD_NAME, TEST_DUMMY_ARTICLE_ID);
		
		Assert.assertNotNull(attachmentJson, "The json should have some data");
		Assert.assertNotNull(attachmentJson.length() > 0, "The json should have some data");
	}
	
	@AfterMethod(groups={"nosql", "unit"})
	public void tearDown() {
		List<AttachmentObject> attachments = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, null, null);
		for (AttachmentObject attachment:attachments) {
			attachmentDao.delete(attachment);
		}
	}
	
	private InputStream createInputStream() {
		return this.getClass().getClassLoader().getResourceAsStream("log4j.xml");
	}
}
