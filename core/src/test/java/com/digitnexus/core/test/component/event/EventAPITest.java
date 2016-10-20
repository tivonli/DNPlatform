package com.digitnexus.core.test.component.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.event.EventAPI;
import com.digitnexus.core.test.BaseTransactionalTest;

public class EventAPITest extends BaseTransactionalTest {
	@Autowired
	private EventAPI eventAPI;

	@Test(groups = { "unit" })
	public void publishEvent(){
		CustomEvent customComponentEvent=new CustomEvent(this);
		eventAPI.publishEvent(customComponentEvent);
		Assert.assertTrue(customComponentEvent.isConsumed());
	}
	
	
}
