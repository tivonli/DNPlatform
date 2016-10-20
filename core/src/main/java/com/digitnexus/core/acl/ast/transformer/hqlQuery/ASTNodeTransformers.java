/**
 * 
 */
package com.digitnexus.core.acl.ast.transformer.hqlQuery;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.dao.query.Condition;
import com.digitnexus.core.dao.query.HQLQuery;
import com.digitnexus.core.dao.query.Root;

/**
 * @author Santanu
 *
 */
public class ASTNodeTransformers {
	
	private static final String[] LOGICAL_OPERATORS = {"and", "or"}; 
	private static final String[] RELATIONAL_OPERATORS = {"=", "=>", "<=", ">", "<", "!=", ">=", "=<", "like"}; 
	
	private static Map<String, ASTNodeTransformer> interpretorCache = new HashMap<String, ASTNodeTransformer>();
	
	static {
		interpretorCache.put("and", new AndTransformer());
		interpretorCache.put("or", new OrTransformer());
		interpretorCache.put("=", new EqualsTransformer());
		interpretorCache.put("!=", new NotEqualsTransformer());
		interpretorCache.put(">", new GreaterThanTransformer());
		interpretorCache.put("<", new LessThanTransformer());
	}
	
	public static ASTNodeTransformer getRegisteredTransformer(ASTNode astNode) {
		return interpretorCache.get(astNode.getData());
	}
	
	private static abstract class AbstractASTNodeTransformer implements ASTNodeTransformer {
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
		
		protected Condition pushForInterpretation(ASTNode astNode, HQLQuery formToAdaptIn) {
			return AclTransformationUtil.transformAcl(astNode, formToAdaptIn);
		}
	}

	private abstract static class AbstractLogicalTransformer extends AbstractASTNodeTransformer {
		@Override
		public Condition transform(ASTNode astNode, HQLQuery formToAdaptIn) {
			Condition leftCondition = pushForInterpretation(astNode.getLeft(), formToAdaptIn);
			//wrap if necessary
			if (isWrapped(astNode.getLeft())) {
				leftCondition = leftCondition.wrap();
			}
			Condition rightCondition = pushForInterpretation(astNode.getRight(), formToAdaptIn); 
			//wrap this one also if necessary
			if (isWrapped(astNode.getRight())) {
				rightCondition = rightCondition.wrap();
			}
			return createCondition(leftCondition, rightCondition);
		}
		
		private boolean isWrapped(ASTNode astNode) {
			//if the node is two level deep then wrap that
			//so if the left child is not null and if any of the children of left child 
			//is not null, then this is a candidate for wrapping 
			if ((astNode.getLeft() != null) 
					&& ((astNode.getLeft().getLeft() != null) || (astNode.getLeft().getRight() != null))) {
				return true;
			}
			//similar logic for right as it was for left
			if ((astNode.getRight() != null) 
					&& ((astNode.getRight().getLeft() != null) || (astNode.getRight().getRight() != null))) {
				return true;
			}
			return false;
		}
		
		protected abstract Condition createCondition(Condition leftCondition, Condition rightCondition);
	}
	
	private static class AndTransformer extends AbstractLogicalTransformer {

		@Override
		protected Condition createCondition(Condition leftCondition, Condition rightCondition) {
			return leftCondition.and(rightCondition);
		}
	}
	
	private static class OrTransformer extends AbstractLogicalTransformer {

		@Override
		protected Condition createCondition(Condition leftCondition, Condition rightCondition) {
			return leftCondition.or(rightCondition);
		}
	}

	private static abstract class RelationalOperatorInterpretor extends AbstractASTNodeTransformer {
		
		private static Pattern DOT_PATTERN = Pattern.compile("\\.");
		
		@Override
		public Condition transform(ASTNode astNode, HQLQuery formToAdaptIn) {
			Root leftRoot = null;
			String leftValue = null;
			ASTNode leftChild = astNode.getLeft();
			String leftExpr = leftChild.getData();
			//we need to evaluate here
			//steps are get the root for left
			//get the property for left
			int indexOfDot = leftExpr.indexOf(".");
			if (indexOfDot > 0) {
				String simpleClassName = leftExpr.substring(0, indexOfDot);
				leftRoot = formToAdaptIn.getRoot(simpleClassName);
				//if there is no root available for this class then create one
				if (leftRoot == null) {
					leftRoot = Root.create(simpleClassName, StringUtils.uncapitalize(simpleClassName));
					formToAdaptIn.from(leftRoot);
				}
				leftValue = leftExpr.substring(indexOfDot + 1);
				if (!leftRoot.getInnerJoins().isEmpty() || !leftRoot.getLeftJoins().isEmpty()) {
					String[] propertyChain = DOT_PATTERN.split(leftExpr);
					//the part of the string except the first portion - PurchaseOrder.manufacturer.name
					//becomes {manufacturer, name} or PurchaseOrder.manufacturer becomes {manufacturer}
					String[] trimmedPropertyChain = (String[])ArrayUtils.subarray(propertyChain, 1, propertyChain.length);
					String leftRootAlias = leftRoot.toString() + ".";
					//there might be a portion that is a (inner) join and the rest is just a simple property
					//so we run a simple logic here - the logic goes like this:
					//1. Take the whole array and create a string arrayelem1.arrayelem2.arrayelem3
					//2. See if the whole string is available as inner join
					//3. If not then strip off the last part and try the inner join again
					//4. Whatever part is left is assumed as the child property
					for (int i = trimmedPropertyChain.length - 1; i >= 0; i--) {
						boolean done = false;
						//here we for a string like manufacturer.name
						String joinProperty = toString(trimmedPropertyChain, 0, i);
						for (Root leftJoinRoot:leftRoot.getLeftJoins()) {
							if (leftJoinRoot.toString().equals(leftRootAlias + joinProperty)) {
								leftRoot = leftJoinRoot;
								if (i < trimmedPropertyChain.length - 1) {
									//if left join is not made on the whole property chain 
									leftValue = toString(trimmedPropertyChain, i + 1, trimmedPropertyChain.length - 1);
								} else {
									//if the left join is made of the whole property chain then there is no simple property 
									leftValue = "";
								}
								done = true;
								break;
							}
						}
						if (!done) {
							for (Root innerJoinRoot:leftRoot.getInnerJoins()) {
								if (innerJoinRoot.toString().equals(leftRootAlias + joinProperty)) {
									leftRoot = innerJoinRoot;
									if (i < trimmedPropertyChain.length - 1) {
										//if inner join is not made on the whole property chain 
										leftValue = toString(trimmedPropertyChain, i + 1, trimmedPropertyChain.length - 1);
									} else {
										//if the inner join is made of the whole property chain then there is no simple property 
										leftValue = "";
									}
									done = true;
									break;
								}
							}
						}
						if (done) {
							break;
						}
					}
				}
			} else {
				//here there is no root possible, its a constant
				leftValue = leftExpr;
			}
			
			
			Root rightRoot = null;
			String rightValue = null;
			ASTNode rightChild = astNode.getRight();
			String rightExpr = rightChild.getData();
			indexOfDot = rightExpr.indexOf(".");
			//similar kind of operation as with the left side is done for the right as well
			if (indexOfDot > 0) {
				String simpleClassName = rightExpr.substring(0, indexOfDot);
				rightRoot = formToAdaptIn.getRoot(simpleClassName);
				//if there is no root available for this class then create one
				if (rightRoot == null) {
					rightRoot = Root.create(simpleClassName, StringUtils.uncapitalize(simpleClassName));
					formToAdaptIn.from(rightRoot);
				}
				rightValue = rightExpr.substring(indexOfDot + 1);
				if (!rightRoot.getInnerJoins().isEmpty() || !rightRoot.getLeftJoins().isEmpty()) {
					//the logic is same as that for the case of the left side of the expression
					String[] propertyChain = DOT_PATTERN.split(rightExpr);
					String[] trimmedPropertyChain = (String[])ArrayUtils.subarray(propertyChain, 1, propertyChain.length);
					String rightRootAlias = rightRoot.toString() + ".";
					for (int i = trimmedPropertyChain.length - 1; i >= 0; i--) {
						boolean done = false;
						String joinProperty = toString(trimmedPropertyChain, 0, i);
						for (Root leftJoinRoot:rightRoot.getLeftJoins()) {
							if (leftJoinRoot.toString().equals(rightRootAlias + joinProperty)) {
								rightRoot = leftJoinRoot;
								if (i < trimmedPropertyChain.length - 1) {
									//if inner join is not made on the whole property chain 
									rightValue = toString(trimmedPropertyChain, i + 1, trimmedPropertyChain.length - 1);
								} else {
									//if the inner join is made of the whole property chain then there is no simple property 
									rightValue = "";
								}
								done = true;
								break;
							}
						}
						if (!done) {
							for (Root innerJoinRoot:rightRoot.getInnerJoins()) {
								if (innerJoinRoot.toString().equals(rightRootAlias + joinProperty)) {
									rightRoot = innerJoinRoot;
									if (i < trimmedPropertyChain.length - 1) {
										//if inner join is not made on the whole property chain 
										rightValue = toString(trimmedPropertyChain, i + 1, trimmedPropertyChain.length - 1);
									} else {
										//if the inner join is made of the whole property chain then there is no simple property 
										rightValue = "";
									}
									done = true;
									break;
								}
							}
						}
						if (done) {
							break;
						}
					}
				}
			} else {
				//here there is no root possible, its a constant
				rightValue = rightExpr;
			}
			
			return createCondition(leftRoot, leftValue, rightRoot, rightValue);
		}
		
		protected String toString(String[] a, int startIndex, int endIndex) {
	        if (a == null || a.length == 0)
	            return "";
	        StringBuilder b = new StringBuilder();
	        for (int i = startIndex; ; i++) {
	            b.append(a[i]);
	            if (i == endIndex)
	            	return b.toString();
	            b.append('.');
	        }
	    }
		
		protected String trimQuotedString(String input) {
			//this is to trim a string and strip off the quotes areound
			//for e.g instead of 'santanu' we need only santanu in the Condition object
			//however if the string is only ', god knows where can that be useful, 
			//we let it go further, and possibly fail :)
			if ((input != null) && (input.length() > 1) && (input.startsWith("'") && (input.endsWith("'")))) {
				return input.substring(1, input.length() - 1);
			}
			
			return input;
		}
		
		/**
		 * @param leftRoot
		 * @param leftValue
		 * @param rightRoot
		 * @param rightValue
		 * @return
		 */
		protected abstract Condition createCondition(Root leftRoot, String leftValue, Root rightRoot, String rightValue);
	}
	
	private static class EqualsTransformer extends RelationalOperatorInterpretor {

		@Override
		public Condition createCondition(Root leftRoot, String leftValue, Root rightRoot, String rightValue) {
			//the left root is not null..this is assumed for simplicity. we need to see if
			//that is not the case under any circumstance
			if (rightRoot != null) {
				return Condition.create().root(leftRoot).eq(trimQuotedString(leftValue), rightRoot, trimQuotedString(rightValue));
			} else {
				return Condition.create().root(leftRoot).eq(trimQuotedString(leftValue), trimQuotedString(rightValue));
			}
		}
	}
	
	private static class NotEqualsTransformer extends RelationalOperatorInterpretor {

		@Override
		public Condition createCondition(Root leftRoot, String leftValue, Root rightRoot, String rightValue) {
			//the left root is not null..this is assumed for simplicity. we need to see if
			//that is not the case under any circumstance
			if (rightRoot != null) {
				return Condition.create().root(leftRoot).ne(trimQuotedString(leftValue), rightRoot, trimQuotedString(rightValue));
			} else {
				return Condition.create().root(leftRoot).ne(trimQuotedString(leftValue), trimQuotedString(rightValue));
			}
		}
	}
	
	private static class GreaterThanTransformer extends RelationalOperatorInterpretor {

		@Override
		public Condition createCondition(Root leftRoot, String leftValue, Root rightRoot, String rightValue) {
			//the left root is not null..this is assumed for simplicity. we need to see if
			//that is not the case under any circumstance
			if (rightRoot != null) {
				return Condition.create().root(leftRoot).gt(trimQuotedString(leftValue), rightRoot, trimQuotedString(rightValue));
			} else {
				return Condition.create().root(leftRoot).gt(trimQuotedString(leftValue), trimQuotedString(rightValue));
			}
		}
	}
	
	private static class LessThanTransformer extends RelationalOperatorInterpretor {

		@Override
		public Condition createCondition(Root leftRoot, String leftValue, Root rightRoot, String rightValue) {
			if (rightRoot != null) {
				return Condition.create().root(leftRoot).lt(trimQuotedString(leftValue), rightRoot, trimQuotedString(rightValue));
			} else {
				return Condition.create().root(leftRoot).lt(trimQuotedString(leftValue), trimQuotedString(rightValue));
			}
		}
	}
}
