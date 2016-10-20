/**
 * 
 */
package com.digitnexus.core.test.nosql.attachment.dao;

import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.nosql.exception.NoFileFoundException;
import com.digitnexus.core.test.BaseTest;

/**
 * @author Santanu
 */
public class AttachmentDaoTest extends BaseTest {
	
	private static final String TEST_DUMMY_CLASS_NAME = "com.digitnexus.scv.domain.test.TestOrder";
	private static final String TEST_DUMMY_FIELD_NAME = "attachment1";
	private static final String TEST_DUMMY_ARTICLE_ID = "ainwoaewbr4442";
	
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
	public void testStore() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		Assert.assertNotNull(attachment.getId(), "Attachment id is not set");
		
		AttachmentObject persistedObject = attachmentDao.getFileById(AttachmentObject.class, attachment.getId());
		Assert.assertNotNull(persistedObject, "No object is retrieved");
		Assert.assertEquals(persistedObject.getParentArticleType(), attachment.getParentArticleType(), "Parent article type not set");
		Assert.assertEquals(persistedObject.getParentArticleField(), attachment.getParentArticleField(), "Parent article field not set");
		Assert.assertEquals(persistedObject.getParentArticleId(), attachment.getParentArticleId(), "Parent article id not set");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testDelete() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		attachmentDao.delete(attachment);
		
		AttachmentObject persistedObject = attachmentDao.getFileById(AttachmentObject.class, attachment.getId());
		Assert.assertNull(persistedObject, "No object should be retrieved");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetAttachment() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		AttachmentObject persistedObject = attachmentDao.getAttachment(attachment.getId());
		Assert.assertNotNull(persistedObject, "getAttachment could not retrieve the object");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testLoadAttachment() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		AttachmentObject persistedObject = attachmentDao.loadAttachment(attachment.getId());
		Assert.assertNotNull(persistedObject, "getAttachment could not retrieve the object");
	}
	
	@Test(groups={"nosql", "unit"}, expectedExceptions={NoFileFoundException.class})
	public void testLoadAttachmentFail() {
		AttachmentObject attachment = createAttachmentObject();
		attachmentDao.store(attachment);
		
		attachmentDao.loadAttachment(attachment.getId() + "_asfdaf");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testFindAttachments() {
		String testAttachmentFiled1 = "attachmentField1";
		String testAttachmentFiled2 = "attachmentField2";
		String testAttachmentFiled3 = "attachmentField3";
		
		for (int i = 0; i < 19; i++) {
			AttachmentObject attachment = createAttachmentObject(TEST_DUMMY_CLASS_NAME, testAttachmentFiled1, TEST_DUMMY_ARTICLE_ID);
			attachment.setIndex(i);
			attachmentDao.store(attachment);
		}
		
		for (int i = 0; i < 5; i++) {
			AttachmentObject attachment = createAttachmentObject(TEST_DUMMY_CLASS_NAME, testAttachmentFiled2, TEST_DUMMY_ARTICLE_ID);
			attachment.setIndex(i);
			attachmentDao.store(attachment);
		}
		
		List<AttachmentObject> attachmentList1 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, testAttachmentFiled1, TEST_DUMMY_ARTICLE_ID);
		List<AttachmentObject> attachmentList2 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, testAttachmentFiled2, TEST_DUMMY_ARTICLE_ID);
		List<AttachmentObject> attachmentList3 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, testAttachmentFiled3, TEST_DUMMY_ARTICLE_ID);
		
		Assert.assertEquals(attachmentList1.size(), 19, "Attachments found does not match the attachments saved");
		Assert.assertEquals(attachmentList2.size(), 5, "Attachments found does not match the attachments saved");
		Assert.assertEquals(attachmentList3.size(), 0, "Attachments found when none saved");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testFindAttachmentsWithDifferentArguments() {
		String testAttachmentFiled1 = "attachmentField1";
		String testAttachmentFiled2 = "attachmentField2";
		
		for (int i = 0; i < 19; i++) {
			AttachmentObject attachment = createAttachmentObject(TEST_DUMMY_CLASS_NAME, testAttachmentFiled1, TEST_DUMMY_ARTICLE_ID);
			attachment.setIndex(i);
			attachmentDao.store(attachment);
		}
		
		for (int i = 0; i < 5; i++) {
			AttachmentObject attachment = createAttachmentObject(TEST_DUMMY_CLASS_NAME, testAttachmentFiled2, TEST_DUMMY_ARTICLE_ID);
			attachment.setIndex(i);
			attachmentDao.store(attachment);
		}
		
		List<AttachmentObject> attachmentList1 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, testAttachmentFiled1, TEST_DUMMY_ARTICLE_ID);
		List<AttachmentObject> attachmentList2 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, testAttachmentFiled1, null);
		List<AttachmentObject> attachmentList3 = attachmentDao.findAttachments(TEST_DUMMY_CLASS_NAME, null, null);
		
		Assert.assertEquals(attachmentList1.size(), 19, "Attachments found does not match the attachments saved when queried with class name, field name and article id");
		Assert.assertEquals(attachmentList2.size(), 19, "Attachments found does not match the attachments saved when queried with class name and field name");
		Assert.assertEquals(attachmentList3.size(), 19 + 5, "Attachments found does not match the attachments saved when queried with class name");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testCountAttachments() {
		for (int i = 0; i < 57; i++) {
			AttachmentObject attachment = createAttachmentObject();
			attachment.setIndex(i);
			attachmentDao.store(attachment);
		}
		
		int attachmentCount = attachmentDao.countAttachments(TEST_DUMMY_CLASS_NAME, TEST_DUMMY_FIELD_NAME, TEST_DUMMY_ARTICLE_ID);
		Assert.assertEquals(attachmentCount, 57, "Count did not match the number of attachments saved");
		
		attachmentCount = attachmentDao.countAttachments(TEST_DUMMY_CLASS_NAME, TEST_DUMMY_FIELD_NAME, TEST_DUMMY_ARTICLE_ID + "_3435");
		Assert.assertEquals(attachmentCount, 0, "Count should be zero");
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
