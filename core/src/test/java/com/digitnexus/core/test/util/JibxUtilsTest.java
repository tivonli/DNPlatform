package com.digitnexus.core.test.util;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.search.SearchCriteriaConfiguration;
import com.digitnexus.core.test.BaseTest;
import com.digitnexus.core.util.JibxUtils;

/**
 * 
 * @author adi
 *
 */

public class JibxUtilsTest extends BaseTest {
	
	
	public InputStream getXmlStream(){
		return getClass().getResourceAsStream("/searchConfig/searchConfig.xml");
	}
	
	@Test(groups = { "unit" })
	public void parseObjectFromXML() throws IOException{
		SearchCriteriaConfiguration searchCriteriaConfiguration=JibxUtils.parseObjectFromXML(IOUtils.toString(getXmlStream()), SearchCriteriaConfiguration.class);
		Assert.assertEquals(searchCriteriaConfiguration.getSearchCriteria().size(), 4);
	}
	
	@Test(groups = { "unit" })
	public void parseObjectFromXMLStream() throws IOException{
		SearchCriteriaConfiguration searchCriteriaConfiguration=JibxUtils.parseObjectFromXMLStream(getXmlStream(), SearchCriteriaConfiguration.class);
		Assert.assertEquals(searchCriteriaConfiguration.getSearchCriteria().size(), 4);
	}
}
