/**
 * 
 */
package com.digitnexus.core.search.transformer.hqlQuery;

import java.util.Date;

import com.digitnexus.core.dao.query.DetachedCondition;
import com.digitnexus.core.search.FilterExpressionDescription;
import com.digitnexus.core.search.transformer.FilterExpressionInterpretor;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;

/**
 * Factory for {@link FilterExpressionInterpretor}s
 * Multiple inner classes, which are {@link FilterExpressionInterpretor} implementation
 * are returned based on the SearchOperator passed
 * 
 * @author Santanu
 */
class ConditionFilterExpressionInterpretors {
	
	private static final EqualsExpressionInterpretor EQUALS_INTERPRETOR = new EqualsExpressionInterpretor();
	private static final NotEqualExpressionInterpretor NOTEQUALS_INTERPRETOR = new NotEqualExpressionInterpretor();
	private static final GreaterExpressionInterpretor GREATER_INTERPRETOR = new GreaterExpressionInterpretor();
	private static final LessExpressionInterpretor LESS_INTERPRETOR = new LessExpressionInterpretor();
	private static final GreaterEqualsExpressionInterpretor GREATEREQUALS_INTERPRETOR = new GreaterEqualsExpressionInterpretor();
	private static final LessEqualsExpressionInterpretor LESSEQUALS_INTERPRETOR = new LessEqualsExpressionInterpretor();
	private static final BetweenExpressionInterpretor BETWEEN_INTERPRETOR = new BetweenExpressionInterpretor();
	private static final LikeExpressionInterpretor LIKE_INTERPRETOR = new LikeExpressionInterpretor();
	
	static FilterExpressionInterpretor<DetachedCondition> getExpressionInterpretor(SearchOperator operator) {
		FilterExpressionInterpretor<DetachedCondition> filterExpressionInterpretor = null;
		switch(operator) {
		case EQUAL:
			filterExpressionInterpretor = EQUALS_INTERPRETOR;
			break;
		case NOTEQUAL:
			filterExpressionInterpretor = NOTEQUALS_INTERPRETOR;
			break;
		case GREATER:
			filterExpressionInterpretor = GREATER_INTERPRETOR;
			break;
		case GREATEREQUAL:
			filterExpressionInterpretor = GREATEREQUALS_INTERPRETOR;
			break;
		case LESS:
			filterExpressionInterpretor = LESS_INTERPRETOR;
			break;
		case LESSEQUAL:
			filterExpressionInterpretor = LESSEQUALS_INTERPRETOR;
			break;
		case IN:
			filterExpressionInterpretor = EQUALS_INTERPRETOR;
			break;
		case BETWEEN:
			filterExpressionInterpretor = BETWEEN_INTERPRETOR;
			break;
		case LIKE:
			filterExpressionInterpretor = LIKE_INTERPRETOR;
			break;
		}
		return filterExpressionInterpretor;
	}
	
	private static class EqualsExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return (DetachedCondition) new DetachedCondition().isNull(expressionDescription.getName());
			}
			if (isArray(expressionDescription.getLowerLimit())) {
				return (DetachedCondition) new DetachedCondition().in(expressionDescription.getName(), (Object[])expressionDescription.getLowerLimit());
			}
			if (DataType.STRING.equals(expressionDescription.getDataType())) {
				return (DetachedCondition) new DetachedCondition().eqic(expressionDescription.getName(), expressionDescription.getLowerLimit());
			}
			return (DetachedCondition) new DetachedCondition().eq(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class NotEqualExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return (DetachedCondition) new DetachedCondition().ne(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class GreaterExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return (DetachedCondition) new DetachedCondition().gt(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class LessExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return (DetachedCondition) new DetachedCondition().lt(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class GreaterEqualsExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return (DetachedCondition) new DetachedCondition().ge(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class LessEqualsExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return (DetachedCondition) new DetachedCondition().le(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class BetweenExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null && expressionDescription.getUpperLimit() != null) {
				return (DetachedCondition) new DetachedCondition().lt(expressionDescription.getName(), expressionDescription.getUpperLimit());
			} else if (expressionDescription.getLowerLimit() != null && expressionDescription.getUpperLimit() == null) {
				return (DetachedCondition) new DetachedCondition().ge(expressionDescription.getName(), expressionDescription.getLowerLimit());
			} else if (expressionDescription.getLowerLimit() != null && expressionDescription.getUpperLimit() != null) {
				if ((expressionDescription.getLowerLimit() instanceof Date) && (expressionDescription.getUpperLimit() instanceof Date)) {
					return (DetachedCondition) new DetachedCondition().between(expressionDescription.getName(), 
							(Date)expressionDescription.getLowerLimit(), (Date)expressionDescription.getUpperLimit());
				} else if ((expressionDescription.getLowerLimit() instanceof Number) && (expressionDescription.getUpperLimit() instanceof Number)) {
					return (DetachedCondition) new DetachedCondition().between(expressionDescription.getName(), 
							(Number)expressionDescription.getLowerLimit(), (Number)expressionDescription.getUpperLimit());
				}
			}
			return null;
		}
	}
	
	private static class LikeExpressionInterpretor extends FilterExpressionInterpretor<DetachedCondition> {
		@Override
		public DetachedCondition interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			} 
			Object value = expressionDescription.getLowerLimit();
			//by all probability this is going to be string
			if (value instanceof String) {
				//this should have % in it, if not then add one at the end and the beginning
				if (!((String)value).contains("%")) {
					value = "%" + (String)value + "%";
				}
			}
			return (DetachedCondition) new DetachedCondition().like(expressionDescription.getName(), value);
		}
	}
}
