/**
 * 
 */
package com.digitnexus.core.search.transformer;

import com.digitnexus.core.search.SearchCriteria;

/**
 * @author Santanu
 *
 */
public interface SearchCriteriaTransformer<T> {
	/**
	 * 
	 * @param searchCriteria
	 * @param root
	 */
	public void transform(SearchCriteria searchCriteria, T root);
}
