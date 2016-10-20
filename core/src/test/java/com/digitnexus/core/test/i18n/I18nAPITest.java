package com.digitnexus.core.test.i18n;

import java.util.Locale;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.test.BaseTest;

public class I18nAPITest extends BaseTest {

	@Test(groups = { "unit" })
	public void getMessage() {
		String message = I18NUtil.getMessage("assetUploadTitle", null, Locale.US);
		Assert.assertEquals(message,"to be upload asset");
		message = I18NUtil.getMessage("assetUploadTitle", null, Locale.CHINA);
		Assert.assertEquals(message,"待新增资产上传");
	}

}
