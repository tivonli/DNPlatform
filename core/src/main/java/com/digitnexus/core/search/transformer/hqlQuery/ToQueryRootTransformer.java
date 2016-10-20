/**
 * 
 */
package com.digitnexus.core.search.transformer.hqlQuery;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.dao.query.DetachedCondition;
import com.digitnexus.core.dao.query.Root;
import com.digitnexus.core.search.FilterExpressionDescription;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.SortExpressionDescription;
import com.digitnexus.core.search.transformer.FilterExpressionInterpretor;
import com.digitnexus.core.search.transformer.SearchCriteriaTransformer;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.ItemMetaData;

/**
 * @author Santanu
 *
 */
public class ToQueryRootTransformer implements SearchCriteriaTransformer<Root> {
	
	private final static Logger logger = LoggerFactory.getLogger(ToQueryRootTransformer.class);

	/* (non-Javadoc)
	 * @see com.digitnexus.core.search.transformer.SearchCriteriaTransformer#transform(com.digitnexus.core.search.SearchCriteria, java.lang.Object)
	 */
	@Override
	public void transform(SearchCriteria searchCriteria, Root root) {
		for (final FilterExpressionDescription filterExpression : searchCriteria.getFilterExpressions()) {
			// FilterExpressionInterpretor based on the operator
			FilterExpressionInterpretor<DetachedCondition> expressionInterpretor = ConditionFilterExpressionInterpretors.getExpressionInterpretor(filterExpression.getSearchOperator());
			if (expressionInterpretor != null) {
				if (DataType.REFERENCE.equals(filterExpression.getDataType())) {
					ItemMetaData itemMetaData = (ItemMetaData) CollectionUtils.find(searchCriteria.getSearchMeta().getFields(), new Predicate() {
						@Override
						public boolean evaluate(Object arg) {
							if (arg instanceof ItemMetaData) {
								return filterExpression.getName().equals(((ItemMetaData) arg).getName());
							}
							return false;
						}
					});
					// if id is null then we have no clue what so ever of how to query
					if (itemMetaData.getAssociationListMeta() == null || itemMetaData.getAssociationListMeta().getIdColumn() == null) {
						logger.info("Reference property {} can not be handled as no association list or id in association list found",
								filterExpression.getName());
						continue;
					}
					// for the case of reference create a sub-criteria
					Root subCriteria = root.innerJoin(filterExpression.getName(), StringUtils.uncapitalize(filterExpression.getName()));
					// for the new criteria create a new filter based on the id
					FilterExpressionDescription associationExpressionDescription = new FilterExpressionDescription(
							itemMetaData.getAssociationListMeta().getIdColumn().getName(), filterExpression.getLowerLimit(),
							filterExpression.getUpperLimit(), filterExpression.getSearchOperator(), 
							DataType.valueOf(itemMetaData.getAssociationListMeta().getIdColumn().getDataType()));
					expressionInterpretor = ConditionFilterExpressionInterpretors.getExpressionInterpretor(
							associationExpressionDescription.getSearchOperator());
					DetachedCondition criterion = expressionInterpretor.interpret(associationExpressionDescription);
					if (criterion != null) {
						criterion.attach(subCriteria);
					}
				} else {
					// if this is not a reference then just create the criterion
					DetachedCondition criterion = expressionInterpretor.interpret(filterExpression);
					if (criterion != null) {
						criterion.attach(root);
					}
				}
			}
		}
		// here we add the sort expressions...
		addSortRestrictions(searchCriteria, root);
	}
	
	private void addSortRestrictions(SearchCriteria searchCriteria, Root root) {
		for (SortExpressionDescription sortExpression : searchCriteria.getSortExpressions()) {
			if (sortExpression.isAscending()) { 
				root.asc(sortExpression.getName());
			} else {
				root.desc(sortExpression.getName());
			}
		}
	}
}
