package com.digitnexus.core.test.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.NonUniqueResultException;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.criterion.DetachedCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;
import com.digitnexus.core.test.dataobjects.Asset;

/**
 * There are some methods in BaseDaoImpl just delegates to Hiberante. The tests
 * for those methods may not be necessary but provided them anyway to
 * demonstrate BaseDao and BaseDaoImpl usage.
 * 
 * @author adi
 * 
 */

public class BaseDaoTest extends BaseTransactionalTest {
	@Autowired
	private BaseDao baseDao;
	@Autowired
	private EntityService entityService;
	private User user;

	@BeforeMethod(alwaysRun = true)
	public void initUser() {
		user = getUserObject();
	}

	@Test(groups = { "unit" })
	public void get() {
		entityService.saveOrUpdate(user);
		Assert.assertEquals(baseDao.get(User.class, user.getUsername()), user);
	}

	@Test(groups = { "unit" }, expectedExceptions = { ObjectNotFoundException.class })
	public void load() {
		entityService.saveOrUpdate(user);
		Assert.assertEquals(baseDao.load(User.class, user.getUsername()), user);
		entityService.delete(user);
		// This should thro exception
		baseDao.load(User.class, user.getUsername());
	}

	@Test(groups = { "unit" })
	public void loadAll() {
		List<User> loadedUsers = baseDao.loadAll(User.class);
		Assert.assertFalse(loadedUsers.contains(user));
		int preUpdateSize = loadedUsers.size();
		entityService.saveOrUpdate(user);
		loadedUsers = baseDao.loadAll(User.class);
		Assert.assertEquals(loadedUsers.size(), preUpdateSize + 1);
		Assert.assertTrue(loadedUsers.contains(user));
	}

	@Test(groups = { "unit" })
	public void save() {
		Assert.assertNull(baseDao.get(User.class, user.getUsername()));
		baseDao.save(user);
		Assert.assertEquals(baseDao.get(User.class, user.getUsername()), user);
	}

	@Test(groups = { "unit" })
	public void update() {
		baseDao.save(user);
		String preUpdateEmail = user.getEmail();
		String newEmail = "test1@test.com";
		// To be sure if ever we change test data, user
		Assert.assertNotEquals(preUpdateEmail, newEmail);
		user.setEmail(newEmail);
		baseDao.update(user);
		Assert.assertEquals(baseDao.get(User.class, user.getUsername())
				.getEmail(), newEmail);
	}

	@Test(groups = { "unit" })
	public void saveOrUpdate() {
		Assert.assertNull(baseDao.get(User.class, user.getUsername()));
		baseDao.saveOrUpdate(user);
		Assert.assertEquals(baseDao.get(User.class, user.getUsername()), user);
		String preUpdateEmail = user.getEmail();
		String newEmail = "test1@test.com";
		// To be sure if ever we change test data, user
		Assert.assertNotEquals(preUpdateEmail, newEmail);
		user.setEmail(newEmail);
		baseDao.saveOrUpdate(user);
		Assert.assertEquals(baseDao.get(User.class, user.getUsername())
				.getEmail(), newEmail);
	}

	@Test(groups = { "unit" })
	public void saveOrUpdateAll() {
		List<User> users = getUsers();

		for (User user : users) {
			Assert.assertNull(baseDao.get(User.class, user.getUsername()));
		}

		baseDao.saveOrUpdateAll(users);

		for (User user : users) {
			User userFromDb = baseDao.get(User.class, user.getUsername());
			Assert.assertNotNull(userFromDb);
			Assert.assertEquals(userFromDb, user);
		}

		// Update
		for (User user : users) {
			user.setClientID("tenant2");
		}

		baseDao.saveOrUpdateAll(users);

		for (User user : users) {
			Assert.assertEquals(baseDao.get(User.class, user.getUsername())
					.getClientID(), "tenant2");
		}

	}

	@Test(groups = { "unit" })
	public void getAll() {
		List<User> loadedUsers = baseDao.getAll(User.class);
		Assert.assertFalse(loadedUsers.contains(user));
		int preUpdateSize = loadedUsers.size();
		entityService.saveOrUpdate(user);
		loadedUsers = baseDao.getAll(User.class);
		Assert.assertEquals(loadedUsers.size(), preUpdateSize + 1);
		Assert.assertTrue(loadedUsers.contains(user));
	}

	@Test(groups = { "unit" })
	public void merge() {
		baseDao.save(user);
		User userToMerge = getUserObject();
		String mergedEmail = "test1@test.com";
		Assert.assertNotEquals(mergedEmail, user.getEmail());
		userToMerge.setEmail(mergedEmail);
		baseDao.merge(userToMerge);
		Assert.assertEquals(mergedEmail,
				baseDao.get(User.class, user.getUsername()).getEmail());
	}

	@Test(groups = { "unit" })
	public void delete() {
		baseDao.save(user);
		User userFromDb = baseDao.get(User.class, user.getUsername());
		Assert.assertNotNull(userFromDb);
		baseDao.delete(userFromDb);
		Assert.assertNull(baseDao.get(User.class, user.getUsername()));
	}

	@Test(groups = { "unit" })
	public void deleteAll() {
		List<User> users = getUsers();
		baseDao.saveOrUpdateAll(users);
		for (User user : users) {
			User userFromDb = baseDao.get(User.class, user.getUsername());
			Assert.assertNotNull(userFromDb);
		}

		baseDao.deleteAll(users);

		for (User user : users) {
			Assert.assertNull(baseDao.get(User.class, user.getUsername()));
		}
	}

	@Test(groups = { "unit" })
	public void isTransient() {
		Assert.assertTrue(baseDao.isTransient(user));
		baseDao.save(user);
		Assert.assertFalse(baseDao.isTransient(user));
		//Object which does not extend DataObject
		NonDataObject nonDataObject=new NonDataObject();
		Assert.assertTrue(baseDao.isTransient(nonDataObject));
		baseDao.save(nonDataObject);
		Assert.assertFalse(baseDao.isTransient(nonDataObject));
	}
	
	@Test(groups = { "unit" })
	public void findByCriteria(){
		baseDao.save(user);
		List<User> users=baseDao.getAll(User.class);
		DetachedCriteria criteria=((BaseDaoImpl)baseDao).getDetachedCriteria(User.class);
		
		List<User> usersByCriteria=baseDao.findByCriteria(criteria, 0, users.size());
		Assert.assertEquals(usersByCriteria.size(), users.size());
		for(User user:users){
			Assert.assertTrue(usersByCriteria.contains(user));
		}
		
		usersByCriteria=baseDao.findByCriteria(criteria);
		Assert.assertEquals(usersByCriteria.size(), users.size());
		for(User user:users){
			Assert.assertTrue(usersByCriteria.contains(user));
		}
		
		Assert.assertEquals(baseDao.findByCriteria(criteria, -1, -1).size(), users.size());
		Assert.assertEquals(baseDao.findByCriteria(criteria, -1, 1).size(), 1);
	}
	
	@Test(groups = { "unit" },expectedExceptions={NonUniqueResultException.class})
	public void findUnique(){
		baseDao.saveOrUpdateAll(getUsers());
		Assert.assertEquals(baseDao.findUnique("from User where email=\'test@test.com\'"), user);
		//This will throw NonUniqueResultException 
		baseDao.findUnique("from User where clientID=\'tenant1\'");
	}
	
	@Test(groups = { "unit" },expectedExceptions={NonUniqueResultException.class})
	public void findUniqueWithArgs(){
		baseDao.saveOrUpdateAll(getUsers());
		Assert.assertEquals(baseDao.findUnique("from User where email= ?","test@test.com"), user);
		//This will throw NonUniqueResultException 
		baseDao.findUnique("from User where clientID=?","tenant1");
	}
	
	@Test(groups = { "unit" },expectedExceptions={NonUniqueResultException.class})
	public void findUniqueByNamedParameter(){
		baseDao.saveOrUpdateAll(getUsers());
		Assert.assertEquals(baseDao.findUniqueByNamedParameter("from User where email= :email",new String[]{"email"},new Object[]{"test@test.com"}), user);
		//This will throw NonUniqueResultException 
		baseDao.findUniqueByNamedParameter("from User where clientID=:clientId",new String[]{"clientId"},new Object[]{"tenant1"});
	}
	
	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" })
	public void find(){
		List<User> users=getUsers();
		baseDao.saveOrUpdateAll(users);
		List<User> usersFromDb=baseDao.find("from User where email=\'test@test.com\'");
		Assert.assertEquals(usersFromDb.size(), 1);
		Assert.assertEquals(usersFromDb.get(0), user);
		
		for(User user:users){
			user.setClientID("tenant2");
		}
		baseDao.saveOrUpdateAll(users);
		
		usersFromDb=baseDao.find("from User where clientID=\'tenant2\'");
		Assert.assertEquals(usersFromDb.size(), users.size());
		for(User user:users){
			Assert.assertTrue(usersFromDb.contains(user));
		}
	
	}
	
	@Test(groups = { "unit" })
	public void findByNamedParameters(){
		baseDao.saveOrUpdateAll(getUsers());
		Assert.assertEquals(baseDao.findByNamedParameters("from User where email= :email",new String[]{"email"},new Object[]{"test@test.com"}).get(0), user);
	}
	
	
	@Test(groups = { "unit" })
	/**
	 * Test for com.digitnexus.core.dao.BaseDao.find(String, int, int)
	 */
	public void findWithResultRestrictionAsArgs(){
		baseDao.save(user);
		List<User> users=baseDao.getAll(User.class);
		List<User> usersByCriteria=baseDao.find("from User", 0, users.size());
		Assert.assertEquals(usersByCriteria.size(), users.size());
		for(User user:users){
			Assert.assertTrue(usersByCriteria.contains(user));
		}
		Assert.assertEquals(baseDao.find("from User", -1, -1).size(), users.size());
		Assert.assertEquals(baseDao.find("from User", -1, 1).size(), 1);
	}
	
	@Test(groups = { "unit" },expectedExceptions={NonUniqueResultException.class})
	public void findUniqueByNamedQuery(){
		baseDao.saveOrUpdateAll(getAssets());
		Asset uniqueEntity=(Asset) baseDao.findUniqueByNamedQuery("FIND_BY_GUID", "guid1");
		Assert.assertEquals(uniqueEntity.getName(), "asset1");
		Assert.assertEquals(uniqueEntity.getGuid(),  "guid1");
		
		uniqueEntity=(Asset) baseDao.findUniqueByNamedQuery("FIND_BY_GUID_NAMED_PRAM",new String[]{"guid"},new Object[]{ "guid1"});
		Assert.assertEquals(uniqueEntity.getName(), "asset1");
		Assert.assertEquals(uniqueEntity.getGuid(),  "guid1");
		
		List<Asset> assetsFromDb=baseDao.loadAll(Asset.class);
		for(Asset asset:assetsFromDb){
			asset.setName("asset");
		}
		baseDao.saveOrUpdateAll(assetsFromDb);
		
		//This will throw NonUniqueResultException
		baseDao.findUniqueByNamedQuery("FIND_BY_NAME", "asset");
	}
	
	@Test(groups = { "unit" },expectedExceptions={NonUniqueResultException.class})
	public void findUniqueByNamedQueryWithNamedPrams(){
		baseDao.saveOrUpdateAll(getAssets());
		Asset uniqueEntity=(Asset) baseDao.findUniqueByNamedQuery("FIND_BY_GUID_NAMED_PRAM",new String[]{"guid"},new Object[]{ "guid1"});
		Assert.assertEquals(uniqueEntity.getName(), "asset1");
		Assert.assertEquals(uniqueEntity.getGuid(),  "guid1");
		
		List<Asset> assetsFromDb=baseDao.loadAll(Asset.class);
		for(Asset asset:assetsFromDb){
			asset.setName("asset");
		}
		baseDao.saveOrUpdateAll(assetsFromDb);
		
		//This will throw NonUniqueResultException
		baseDao.findUniqueByNamedQuery("FIND_BY_NAME_NAMED_PRAM",new String[]{"name"},new Object[]{ "asset"});
	}
	
	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" })
	public void findByNamedQuery(){
		baseDao.saveOrUpdateAll(getAssets());
		List<Asset> assets=baseDao.findByNamedQuery("FIND_BY_NAME", "asset1");
		Assert.assertEquals(assets.size(), 1);
		Assert.assertEquals(assets.get(0).getGuid(), "guid1");
		
		assets=baseDao.findByNamedQuery("FIND_BY_NAME", "asset3");
		Assert.assertTrue(assets.isEmpty());
	
	}
	
	@SuppressWarnings("unchecked")
	@Test(groups = { "unit" })
	public void findByNamedQueryWithNamedPrams(){
		baseDao.saveOrUpdateAll(getAssets());
		List<Asset> assets=baseDao.findByNamedQuery("FIND_BY_NAME_NAMED_PRAM",new String[]{"name"},new Object[]{ "asset1"});
		Assert.assertEquals(assets.size(), 1);
		Assert.assertEquals(assets.get(0).getGuid(), "guid1");
		
		assets=baseDao.findByNamedQuery("FIND_BY_NAME_NAMED_PRAM",new String[]{"name"},new Object[]{ "asset3"});
		Assert.assertTrue(assets.isEmpty());
	}
	
	@Test(groups = { "unit" },expectedExceptions={IllegalArgumentException.class})
	public void getEntityName(){
	    Assert.assertEquals(baseDao.getEntityName(user), User.class.getName());
	    //This will throw exception
	    baseDao.getEntityName(new Object());
	}
	
	@Test(groups = { "unit" },expectedExceptions={HibernateException.class})
	public void getIdentifier(){
		baseDao.save(user);
	    Assert.assertEquals(baseDao.getIdentifier(user),user.getUsername());
	    //This should throw exception
	    baseDao.getIdentifier(new Object());
	}
	
	
	
	private List<Asset> getAssets(){
		List<Asset> assets=new ArrayList<Asset>(2);
		
		Asset asset=new Asset();
		asset.setName("asset1");
		asset.setGuid("guid1");
		assets.add(asset);
		
		asset=new Asset();
		asset.setName("asset2");
		asset.setGuid("guid2");
		assets.add(asset);
		
		return assets;
	}
	
	

	private List<User> getUsers() {
		List<User> users = new ArrayList<User>();
		users.add(user);

		User user2 = new User();
		user2.setClientID("tenant1");
		user2.setUsername("test1");
		user2.setPassword("password1");
		user2.setFullName("test1");
		user2.setEmail("test1@test.com");

		users.add(user2);

		return users;
	}

}
