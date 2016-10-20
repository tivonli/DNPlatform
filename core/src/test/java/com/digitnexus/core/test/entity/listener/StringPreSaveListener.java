package com.digitnexus.core.test.entity.listener;

import org.springframework.stereotype.Service;
import org.testng.Assert;

import com.digitnexus.core.entity.PreSaveEvent;
import com.digitnexus.core.entity.listener.EntityPreSaveListener;

@Service
public class StringPreSaveListener implements EntityPreSaveListener<String> {

	@Override
	public void onApplicationEvent(PreSaveEvent<String> event) {
		//This is not supposed to be invoked
		Assert.fail("Wrong listener invoked");
	}

}
