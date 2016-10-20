/**
 * 
 */
package com.digitnexus.core.search.transformer;

import java.util.LinkedHashMap;
import java.util.Map;

import org.hibernate.Criteria;

import com.digitnexus.core.dao.query.Root;
import com.digitnexus.core.search.transformer.hibernateCriteria.ToHibernateCriteriaTransformer;
import com.digitnexus.core.search.transformer.hqlQuery.ToQueryRootTransformer;

/**
 * @author Santanu
 *
 */
public class SearchCriteriaTransformerFactory {
	
	@SuppressWarnings("rawtypes")
	private static Map<Class, SearchCriteriaTransformer> trasformerCache = new LinkedHashMap<Class, SearchCriteriaTransformer>();
	
	static {
		trasformerCache.put(Criteria.class, new ToHibernateCriteriaTransformer());
		trasformerCache.put(Root.class, new ToQueryRootTransformer());
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> SearchCriteriaTransformer<T> getSearchCriteriaTransformer(T object) {
		SearchCriteriaTransformer<T> transformer = trasformerCache.get(object.getClass());
		if (transformer == null) {
			for (Class key:trasformerCache.keySet()) {
				if (key.isAssignableFrom(object.getClass())) {
					transformer = trasformerCache.get(key);
					break;
				}
			}
		}
		return transformer;
	}
}
