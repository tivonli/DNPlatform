/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.mongodbQuery;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.ArrayUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.digitnexus.core.acl.ast.ASTNode;

/**
 * @author Santanu
 *
 */
class ASTNodeMongoQueryTransformers {
	
	private static final String[] LOGICAL_OPERATORS = {"and", "or"}; 
	private static final String[] RELATIONAL_OPERATORS = {"=", "=>", "<=", ">", "<", "!=", ">=", "=<"}; 
	
	private static Map<String, ASTNodeMongoQueryTransformer> interpretorCache = new HashMap<String, ASTNodeMongoQueryTransformer>();
	
	static {
		interpretorCache.put("and", new AndTransformer());
		interpretorCache.put("or", new OrTransformer());
		interpretorCache.put("=", new EqualsTransformer());
		interpretorCache.put("!=", new NotEqualsTransformer());
		interpretorCache.put(">", new GreaterThanTransformer());
		interpretorCache.put("<", new LessThanTransformer());
	}
	
	public static ASTNodeMongoQueryTransformer getRegisteredTransformer(ASTNode astNode) {
		return interpretorCache.get(astNode.getData());
	}
	
	private static abstract class AbstractASTNodeTransformer implements ASTNodeMongoQueryTransformer {
		@SuppressWarnings("unused")
		protected boolean isOperator(String str) {
			return isLogicalOperator(str) || isRelationalOperator(str);
		}
		
		protected boolean isLogicalOperator(String str) {
			return ArrayUtils.contains(LOGICAL_OPERATORS, str);
		}
		
		protected boolean isRelationalOperator(String str) {
			return ArrayUtils.contains(RELATIONAL_OPERATORS, str);
		}
		
		protected Criteria pushForInterpretation(ASTNode astNode, Query formToAdaptIn) {
			return AclTransformationUtil.transformAcl(astNode, formToAdaptIn);
		}
	}

	private abstract static class AbstractLogicalTransformer extends AbstractASTNodeTransformer {
		@Override
		public Criteria transform(ASTNode astNode, Query formToAdaptIn) {
			Criteria leftCondition = pushForInterpretation(astNode.getLeft(), formToAdaptIn);
			Criteria rightCondition = pushForInterpretation(astNode.getRight(), formToAdaptIn); 
			return createCondition(leftCondition, rightCondition);
		}
		
		protected abstract Criteria createCondition(Criteria leftCondition, Criteria rightCondition);
	}
	
	private static class AndTransformer extends AbstractLogicalTransformer {

		@Override
		protected Criteria createCondition(Criteria leftCondition, Criteria rightCondition) {
			return leftCondition.andOperator(rightCondition);
		}
	}
	
	private static class OrTransformer extends AbstractLogicalTransformer {

		@Override
		protected Criteria createCondition(Criteria leftCondition, Criteria rightCondition) {
			return leftCondition.orOperator(rightCondition);
		}
	}
	
	private static abstract class RelationalOperatorInterpretor extends AbstractASTNodeTransformer {
		@Override
		public Criteria transform(ASTNode astNode, Query formToAdaptIn) {
			ASTNode leftChild = astNode.getLeft();
			ASTNode rightChild = astNode.getRight();
			String leftExpr = leftChild.getData();
			String rightExpr = rightChild.getData();
			//remove the first part before the dot
			int indexOfDotLeft = leftExpr.indexOf(".");
			String leftValue = leftExpr.substring(indexOfDotLeft + 1);
			int indexOfDotRight = rightExpr.indexOf(".");
			String rightValue = rightExpr.substring(indexOfDotRight + 1);
			
			return createCondition(leftValue, rightValue);
		}
		
		protected abstract Criteria createCondition(String propertyName, String value);
	}
	
	private static class EqualsTransformer extends RelationalOperatorInterpretor {

		@Override
		public Criteria createCondition(String propertyName, String value) {
			return Criteria.where(propertyName).is(value);
		}
	}
	
	private static class NotEqualsTransformer extends RelationalOperatorInterpretor {

		@Override
		public Criteria createCondition(String propertyName, String value) {
			return Criteria.where(propertyName).ne(value);
		}
	}
	
	private static class GreaterThanTransformer extends RelationalOperatorInterpretor {

		@Override
		public Criteria createCondition(String propertyName, String value) {
			return Criteria.where(propertyName).gt(value);
		}
	}
	
	private static class LessThanTransformer extends RelationalOperatorInterpretor {

		@Override
		public Criteria createCondition(String propertyName, String value) {
			return Criteria.where(propertyName).lt(value);
		}
	}
	
}
