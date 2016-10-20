/**
 * 
 */
package com.digitnexus.core.test.nosql.dao;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.nosql.dao.BaseNosqlDao;
import com.digitnexus.core.test.BaseTest;

/**
 * @author Santanu
 *
 */
public class BaseNosqlDaoTest extends BaseTest {
	
	@Inject
	@Named("baseNosqlDao")
	private BaseNosqlDao baseNosqlDao;

	@AfterMethod(groups={"nosql", "unit"})
	public void tearDown() {
		baseNosqlDao.dropCollection(TestMongoDbEntity.class);
	}
	
	private TestMongoDbEntity createTestEntity() {
		return createTestEntity("Some string1", new Date(), 12.44, 12808l);
	}
	
	private TestMongoDbEntity createTestEntity(String stringProperty, Date dateProperty, Double doubleProperty, Long longProperty) {
		TestMongoDbEntity testEntity = new TestMongoDbEntity();
		testEntity.setStringProperty(stringProperty);
		testEntity.setDateProperty(dateProperty);
		testEntity.setDoubleProperty(doubleProperty);
		testEntity.setLongProperty(longProperty);
		return testEntity;
	}
	
	@Test(groups={"nosql", "unit"})
	public void testSave() {
		TestMongoDbEntity entity = createTestEntity();
		baseNosqlDao.save(entity);
		
		TestMongoDbEntity persistedEntity = baseNosqlDao.get(TestMongoDbEntity.class, entity.getId());
		Assert.assertNotNull(persistedEntity, "No object is saved");
		Assert.assertTrue(entity.equals(persistedEntity), "Saved object is not same as the one intended");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGet() {
		TestMongoDbEntity entity = createTestEntity();
		baseNosqlDao.save(entity);
		
		TestMongoDbEntity persistedEntity = baseNosqlDao.get(TestMongoDbEntity.class, entity.getId());
		Assert.assertNotNull(persistedEntity, "No object is fetched");
		Assert.assertTrue(entity.equals(persistedEntity), "Retrieved object is not same as the one intended");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetFailure() {
		TestMongoDbEntity entity = createTestEntity();
		baseNosqlDao.save(entity);
		
		TestMongoDbEntity persistedEntity = baseNosqlDao.get(TestMongoDbEntity.class, entity.getId() + "_" + System.currentTimeMillis());
		Assert.assertNull(persistedEntity, "Object should not be fetched");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testGetAll() {
		for (int i = 0; i < 5; i++) {
			TestMongoDbEntity entity = createTestEntity("Some string" + i, new Date(), 12.44 + i, i + 12808l);
			baseNosqlDao.save(entity);
		}
		
		List<TestMongoDbEntity> entities = baseNosqlDao.getAll(TestMongoDbEntity.class);
		Assert.assertEquals(entities.size(), 5, "Number of entitied did not match the actual data saved");
	}
	
	@Test(groups={"nosql", "unit"})
	public void testDelete() {
		TestMongoDbEntity entity = createTestEntity();
		baseNosqlDao.save(entity);
		baseNosqlDao.delete(entity);
		TestMongoDbEntity persistedEntity = baseNosqlDao.get(TestMongoDbEntity.class, entity.getId());
		Assert.assertNull(persistedEntity, "Object should not be fetched");
	}
}
