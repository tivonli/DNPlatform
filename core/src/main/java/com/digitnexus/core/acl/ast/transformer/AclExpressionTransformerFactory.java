/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.mongodb.core.query.Query;

import com.digitnexus.core.acl.ast.transformer.hqlQuery.HQLQueryAclTransformer;
import com.digitnexus.core.acl.ast.transformer.mongodbQuery.MongoQueryAclTransformer;
import com.digitnexus.core.dao.query.HQLQuery;

/**
 * @author Santanu
 *
 */
public class AclExpressionTransformerFactory {
	@SuppressWarnings("rawtypes")
	private static Map<Class, AclExpressionTransformer> trasformerCache = new LinkedHashMap<Class, AclExpressionTransformer>();
	
	static {
		trasformerCache.put(HQLQuery.class, new HQLQueryAclTransformer());
		trasformerCache.put(Query.class, new MongoQueryAclTransformer());
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> AclExpressionTransformer<T> getSearchCriteriaTransformer(T object) {
		AclExpressionTransformer<T> transformer = trasformerCache.get(object.getClass());
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
