package com.digitnexus.core.web.service;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.util.ConfigUtil;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.dataobject.SearchMetaData;


@Service
@Path("search")
public class SearchViewServiceImpl implements SearchViewService {
	
	private UiConfiguration uiConfiguration;
	
	@GET @Path("meta/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	public String getSearchMetaDataResponse(@PathParam("articleName") String articleName,@QueryParam("parentArticleName") String parentArticleName) {
		SearchMetaData searchMeta = null;
		if(StringUtils.isNotEmpty(parentArticleName)){
			searchMeta = uiConfiguration.getSearchMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, parentArticleName));
		}else{
			searchMeta = uiConfiguration.getSearchMeta(articleName);
		}
		if (searchMeta == null) {
			throw new NullPointerException("No search view configured for " + articleName);
		}
		//give some callback here...
		return JsonUtil.toJson(searchMeta);
	}
	
	@Autowired
	public void setUiConfiguration(UiConfiguration uiConfiguration) {
		this.uiConfiguration = uiConfiguration;
	}
}
