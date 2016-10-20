/**
 * 
 */
package com.digitnexus.core.test.nosql.attachment.dao;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.attachment.dao.AttachmentStream;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.test.nosql.attachment.TestAttachmentEntity;

/**
 * @author Santanu
 *
 */
public class AttachmentStreamTest extends BaseTest {

	private static final String TEST_DUMMY_CLASS_NAME = TestAttachmentEntity.class.getName();
	private static final String TEST_DUMMY_FIELD_NAME = "attachment";
	private static final String TEST_DUMMY_ARTICLE_ID = "ainwoaewbr4442";
	
	@Autowired
	private AttachmentDao attachmentDao;
	
	/**
	 * @return
	 */
	private AttachmentObject createAttachment() {
		return createAttachment(TEST_DUMMY_CLASS_NAME, TEST_DUMMY_FIELD_NAME, TEST_DUMMY_ARTICLE_ID);
	}
	
	private AttachmentObject createAttachment(String articleType, String articleField, String articleId) {
		AttachmentObject attachment = new AttachmentObject();
		attachment.setParentArticleType(articleType);
		attachment.setParentArticleField(articleField);
		attachment.setParentArticleId(articleId);
		attachment.setData(createInputStream());
		attachment.setFileName("log4j.xml");
		attachmentDao.store(attachment);
		return attachment;
	}
	
	@Test(groups={"nosql", "unit"})
	public void testRead() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			InputStream expectedStream = createInputStream();
			stream = new AttachmentStream(attachment.getId());
			
			int val = stream.read();
			int expectedVal = expectedStream.read();
			Assert.assertEquals(val, expectedVal, "Value from the stream does not match the value from the attachment");
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"})
	public void testReadBuffered() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			InputStream expectedStream = createInputStream();
			stream = new AttachmentStream(attachment.getId());
			
			byte[] actualBytes = new byte[100];
			byte[] expectedBytes = new byte[100];
			int val = stream.read(actualBytes);
			int expectedVal = expectedStream.read(expectedBytes);

			Assert.assertEquals(val, expectedVal, "Value from the stream does not match the value from the attachment");
			Assert.assertEquals(actualBytes, expectedBytes, "Value from the stream does not match the value from the attachment");
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"})
	public void testReadBufferedOffset() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			InputStream expectedStream = createInputStream();
			stream = new AttachmentStream(attachment.getId());
			
			byte[] actualBytes = new byte[100];
			byte[] expectedBytes = new byte[100];
			int val = stream.read(actualBytes, 10, 90);
			int expectedVal = expectedStream.read(expectedBytes, 10, 90);
			
			Assert.assertEquals(val, expectedVal, "Value from the stream does not match the value from the attachment");
			Assert.assertEquals(actualBytes, expectedBytes, "Value from the stream does not match the value from the attachment");
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"})
	public void testSkip() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			InputStream expectedStream = createInputStream();
			stream = new AttachmentStream(attachment.getId());
			
			long val = stream.skip(79l);
			long expectedVal = expectedStream.skip(79l);
			
			Assert.assertEquals(val, expectedVal, "Value from the stream does not match the value from the attachment");
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"})
	public void testAvailable() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			stream = new AttachmentStream(attachment.getId());
			//should not throw an exception, the return value is not guaranteed
			stream.available();
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"}, expectedExceptions={RuntimeException.class})
	public void testMark() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			stream = new AttachmentStream(attachment.getId());
			stream.mark(0);
		} finally {
			stream.close();
		}
	}
	
	@Test(groups={"nosql", "unit"}, expectedExceptions={RuntimeException.class})
	public void testReset() throws IOException {
		AttachmentStream stream = null;
		
		try {
			AttachmentObject attachment = createAttachment();
			stream = new AttachmentStream(attachment.getId());
			stream.reset();
		} finally {
			stream.close();
		}
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
