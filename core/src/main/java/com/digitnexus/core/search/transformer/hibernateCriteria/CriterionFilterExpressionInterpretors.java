/**
 * 
 */
package com.digitnexus.core.search.transformer.hibernateCriteria;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

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
class CriterionFilterExpressionInterpretors {
	
	private static final EqualsExpressionInterpretor EQUALS_INTERPRETOR = new EqualsExpressionInterpretor();
	private static final NotEqualExpressionInterpretor NOTEQUALS_INTERPRETOR = new NotEqualExpressionInterpretor();
	private static final GreaterExpressionInterpretor GREATER_INTERPRETOR = new GreaterExpressionInterpretor();
	private static final LessExpressionInterpretor LESS_INTERPRETOR = new LessExpressionInterpretor();
	private static final GreaterEqualsExpressionInterpretor GREATEREQUALS_INTERPRETOR = new GreaterEqualsExpressionInterpretor();
	private static final LessEqualsExpressionInterpretor LESSEQUALS_INTERPRETOR = new LessEqualsExpressionInterpretor();
	private static final BetweenExpressionInterpretor BETWEEN_INTERPRETOR = new BetweenExpressionInterpretor();
	private static final LikeExpressionInterpretor LIKE_INTERPRETOR = new LikeExpressionInterpretor();
	
	static FilterExpressionInterpretor<Criterion> getExpressionInterpretor(SearchOperator operator) {
		FilterExpressionInterpretor<Criterion> filterExpressionInterpretor = null;
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
	
	private static class EqualsExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return Restrictions.isNull(expressionDescription.getName());
			}
			if (isArray(expressionDescription.getLowerLimit())) {
				return Restrictions.in(expressionDescription.getName(), (Object[])expressionDescription.getLowerLimit());
			}
			if (DataType.STRING.equals(expressionDescription.getDataType())) {
				return Restrictions.eq(expressionDescription.getName(), expressionDescription.getLowerLimit()).ignoreCase();
			}
			return Restrictions.eq(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class NotEqualExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return Restrictions.ne(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class GreaterExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return Restrictions.gt(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class LessExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return Restrictions.lt(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class GreaterEqualsExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return Restrictions.ge(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class LessEqualsExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			}
			return Restrictions.le(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
	
	private static class BetweenExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null && expressionDescription.getUpperLimit() != null) {
				return Restrictions.lt(expressionDescription.getName(), expressionDescription.getUpperLimit());
			} else if (expressionDescription.getLowerLimit() != null && expressionDescription.getUpperLimit() == null) {
				return Restrictions.ge(expressionDescription.getName(), expressionDescription.getLowerLimit());
			} else if (expressionDescription.getLowerLimit() != null && expressionDescription.getUpperLimit() != null) {
				return Restrictions.between(expressionDescription.getName(), expressionDescription.getLowerLimit(), expressionDescription.getUpperLimit());
			}
			return null;
		}
	}
	
	private static class LikeExpressionInterpretor extends FilterExpressionInterpretor<Criterion> {
		@Override
		public Criterion interpret(FilterExpressionDescription expressionDescription) {
			if (expressionDescription.getLowerLimit() == null) {
				return null;
			} else if (expressionDescription.getLowerLimit() instanceof String) {
				return Restrictions.like(expressionDescription.getName(), (String)expressionDescription.getLowerLimit(), MatchMode.ANYWHERE);
			}
			return Restrictions.like(expressionDescription.getName(), expressionDescription.getLowerLimit());
		}
	}
}
