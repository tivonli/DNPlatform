package com.digitnexus.core.test.entity.listener;

import java.util.List;

import javax.validation.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.digitnexus.core.domain.User;
import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.test.BaseTransactionalTest;

/**
 * entity service bond multiple event
 * this junit class will cover the saveOrupdate ,merge,delete function
 * and their corresponding event
 * @author Hugh
 *
 */

public class EntityServiceTest extends BaseTransactionalTest {

	private User user;
	//This class do not contain any listeners. Make sure that saving objects
	//with not listeners do not cause any exceptions
	private NoListenerArticle noListenerArticle;
	
	@Autowired
	private EntityService entityService;
	
	
	
	/**
	 * before run the test method , prepare the some test data.
	 */
	@BeforeClass(alwaysRun=true)
	public void setup(){
		user=new User();
		user.setUsername("test");
		user.setPassword("password");
		user.setClientID("test");
		user.setFullName("test");
        user.setEmail("test@test.com");
		
		noListenerArticle=new NoListenerArticle();
		setDataObjectProperties(noListenerArticle);
	}
	
	/**
	 * this method test the saveOrUpdate of EntityService, include its pre save event and post save event , 
	 *  the pre save event please see the @link UserPreSaveListener
	 *  the post save event please see the @link UserPostSaveListener
	 */
	@Test(groups = { "unit" })
	public void saveOrUpdateWithValidationSuccess(){
		User testUser = entityService.get(User.class, "test");
		//the user(test) have not save into the databASE
		Assert.assertNull(testUser);
		entityService.saveOrUpdate(user);
		//to test the user whether have save into the database success and the get method is also work.
		testUser = entityService.get(User.class, "test");
		Assert.assertNotNull(testUser);
		//to test the pre save event whether have added
		//this has been removed from pre-save event. need to use some non-unique property
		//Assert.assertTrue(testUser.getEmail().equals("Hugh@digitnexu.com"));
		Assert.assertTrue(user.getAddrLine1().equals("Shenzhen"));
		//to test the post save event whether have added
		Assert.assertTrue(user.getFullName().equals("haveUpdatedNotInserDB"));
		
		entityService.saveOrUpdate(noListenerArticle);
	}
	
	/**
	 * this method will test the validate event 
	 * the detail validate event please see the @link UserValidateListener
	 */
	@Test(expectedExceptions = {ValidationException.class},groups = { "unit" })
	public void saveOrUpdateWithValidationFailure(){
		 User user=new User();	 
		 entityService.saveOrUpdate(user);
	}
	
	/**
	 * this method test the merge function of EntityService
	 * it also share the pre save event and post save event.
	 */
	@Test(groups = { "unit" })
	public void mergeWithValidationSuccess(){
			entityService.saveOrUpdate(user);
			user.setAddrLine1("adddc");
			user.setEmail("Hugh@qq.com");
			user.setFullName("Hugh");
			entityService.merge(user);
		    User tmpUser = entityService.get(User.class, "test");
		    //the data have been merge to the DB
		    Assert.assertTrue(tmpUser.getAddrLine1().equals(user.getAddrLine1()));
		    //to test the pre save event whether have added
		    //this has been removed from pre-save event. need to use some non-unique property
			//Assert.assertTrue(tmpUser.getEmail().equals("Hugh@digitnexu.com"));
		    Assert.assertTrue(tmpUser.getAddrLine1().equals("Shenzhen"));
			//to test the post save event whether have added
		    Assert.assertTrue(tmpUser.getFullName().equals("haveUpdatedNotInserDB"));
		    
		    entityService.merge(noListenerArticle);
	}
	/**
	 * this method test the delete function of EntityService,include its delete event
	 * the delete event please see the @link UserDeleteListener
	 */
	@Test(groups = { "unit" })
	public void delete(){
		entityService.saveOrUpdate(user);
		//to judge whether the user have saved into DB
		User tmpUser=entityService.get(User.class, user.getUsername());
		Assert.assertNotNull(tmpUser);
		entityService.delete(user);
	    //to test the delete event whether have added
		Assert.assertTrue(user.getState().equals("deleted"));
		//to judge whether the user have deleted from DB
		tmpUser=entityService.get(User.class, user.getUsername());
		Assert.assertNull(tmpUser);
		
		entityService.saveOrUpdate(noListenerArticle);
		entityService.delete(noListenerArticle);
		
	}
	
	
	/**
	 * to test method getAll , it will get all the Object you assigned data.
	 */
	@Test(groups = { "unit" })
	public void getAll(){
		List<User> userList=entityService.getAll(User.class);
		int preSize =0;
		if(userList!=null){
		preSize= userList.size();
		}
		entityService.saveOrUpdate(user);
		int postSaveSize =entityService.getAll(User.class).size();
		Assert.assertTrue(postSaveSize==(preSize+1));
		
	}

}
