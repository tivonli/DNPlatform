/**
 * 
 */
package com.digitnexus.core.search.transformer;

import com.digitnexus.core.search.FilterExpressionDescription;

/**
 * Base class for {@link FilterExpressionDescription} interpretation and translation
 * @author Santanu
 */
public abstract class FilterExpressionInterpretor<T> {
	
	/**
	 * The implementation method is supposed to make sense of the {@link FilterExpressionDescription}
	 * passed and create relevant object from it
	 * @param expressionDescription
	 * @return
	 */
	public abstract T interpret(FilterExpressionDescription expressionDescription);
	
	/**
	 * Checks if the passed value is an array
	 * @param value
	 * @return
	 */
	protected boolean isArray(Object value) {
		return (value instanceof Object[]);
	}
}
