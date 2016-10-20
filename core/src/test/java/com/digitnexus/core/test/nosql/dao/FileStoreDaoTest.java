/**
 * 
 */
package com.digitnexus.core.test.nosql.dao;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.nosql.dao.FileStoreDao;
import com.digitnexus.core.test.BaseTest;

/**
 * @author Santanu
 *
 */
public class FileStoreDaoTest extends BaseTest {
	@Inject
	@Named("fileStoreDao")
	private FileStoreDao fileStoreDao;
	
	@Test(groups={"nosql", "unit"})
	public void testStore() {
		TestFileStoreEntity testEntity = createFileStoreEntity();
		//save the test entity
		fileStoreDao.store(testEntity);
		Assert.assertNotNull(testEntity.getId(), "Failed to store the object successfully");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetFileById() {
		//create a test entity
		TestFileStoreEntity testEntity = createFileStoreEntity();
		//save the test entity
		fileStoreDao.store(testEntity);
		
		TestFileStoreEntity retrievedEntity = fileStoreDao.getFileById(TestFileStoreEntity.class, testEntity.getId());
		Assert.assertEquals(testEntity.getId().toString(), retrievedEntity.getId().toString(), "Failed to retrieve the saved object");
	}

	@Test(groups={"nosql", "unit"})
	public void testGetFileByName() {
		String name = "ANAME_" + System.currentTimeMillis();
		//create a test entity
		TestFileStoreEntity testEntity = createFileStoreEntity();
		testEntity.setFileName(name);
		//save the test entity
		fileStoreDao.store(testEntity);
		
		List<TestFileStoreEntity> retrievedEntities = fileStoreDao.getFilesByFileName(TestFileStoreEntity.class, name);
		
		Assert.assertEquals(1, retrievedEntities.size(), "Did not fetch correct number of files");
		Assert.assertEquals(testEntity.getId().toString(), retrievedEntities.get(0).getId().toString(), "Failed to retrieve the saved object");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetFileCount() {
		//ensure some file is created...
		for (int i = 0; i < 5; i++) {
			//create a test entity
			TestFileStoreEntity testEntity = createFileStoreEntity();
			//save the test entity
			fileStoreDao.store(testEntity);
		}
				
		//once deleted the retrieved object should be null
		long count = fileStoreDao.getFileCount(TestFileStoreEntity.class);
		
		Assert.assertEquals(count, 5, "Delete call failed to delete by id");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testDeleteById() {
		//ensure some file is created...
		//create a test entity
		TestFileStoreEntity testEntity = createFileStoreEntity();
		//save the test entity
		fileStoreDao.store(testEntity);
				
		fileStoreDao.delete(TestFileStoreEntity.class, testEntity.getId());
		//once deleted the retrieved object should be null
		TestFileStoreEntity retrievedEntity = fileStoreDao.getFileById(TestFileStoreEntity.class, testEntity.getId());
		
		Assert.assertNull(retrievedEntity, "Delete call failed to delete by id");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testDeleteAll() {
		//ensure some file is created...
		//create a test entity
		TestFileStoreEntity testEntity = createFileStoreEntity();
		//save the test entity
		fileStoreDao.store(testEntity);
				
		fileStoreDao.delete(TestFileStoreEntity.class);
		long count = fileStoreDao.getFileCount(TestFileStoreEntity.class);
		Assert.assertEquals(count, 0, "Delete call failed to delete all the records");
	}
	
	/**
	 * @return
	 */
	private TestFileStoreEntity createFileStoreEntity() {
		TestFileStoreEntity testEntity = new TestFileStoreEntity();
		testEntity.setStringProperty("Some string");
		testEntity.setDateProperty(new Date());
		testEntity.setIntegerProperty(20);
		testEntity.setData(createInputStream());
		testEntity.setFileName("somefile.xml");
		return testEntity;
	}
	
	private InputStream createInputStream() {
		return this.getClass().getClassLoader().getResourceAsStream("log4j.xml");
	}
	
	@AfterMethod(groups={"nosql", "unit"})
	public void cleanUpTestBucket() {
		//assumption: delete method works
		fileStoreDao.delete(TestFileStoreEntity.class);
	}
}
