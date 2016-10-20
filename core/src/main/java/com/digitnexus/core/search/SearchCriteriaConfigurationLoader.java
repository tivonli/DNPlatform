/**
 * 
 */
package com.digitnexus.core.search;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.digitnexus.core.event.AbstractContextRefreshListener;
import com.digitnexus.core.search.service.SearchCriteriaService;
import com.digitnexus.core.util.JibxUtils;

/**
 * Loads search criteria configuration and stores in db
 * 
 * @author adi
 * 
 */
@Component
@Transactional
public class SearchCriteriaConfigurationLoader extends AbstractContextRefreshListener {
	private final Logger			logger	= LoggerFactory.getLogger(getClass());

	@Autowired
	private ApplicationContext		applicationContext;
	@Autowired
	private SearchCriteriaService	searchCriteriaService;

	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		try {
			Resource[] searchConfigResources = applicationContext.getResources("classpath*:searchConfig/*.xml");

			if (searchConfigResources != null && searchConfigResources.length > 0) {
				// To collect search criteria from various configuration files
				final List<SearchCriteria> searchCriterias = new ArrayList<SearchCriteria>();

				for (Resource searchConfigResource : searchConfigResources) {
					SearchCriteriaConfiguration searchCriteriaConfiguration = JibxUtils.parseObjectFromXMLStream(
							searchConfigResource.getInputStream(), SearchCriteriaConfiguration.class);

					if (!searchCriteriaConfiguration.getSearchCriteria().isEmpty()) {
						searchCriterias.addAll(searchCriteriaConfiguration.getSearchCriteria());
					}
				}

				searchCriteriaService.saveCriteriaConfig(searchCriterias);

			} else {
				logger.info("No search configuration files found");
			}
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new RuntimeException(e);
		}

	}

	@Override
	public int getOrder() {
		return 300;
	}
}
