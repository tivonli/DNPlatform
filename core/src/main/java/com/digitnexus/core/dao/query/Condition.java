/**
 * 
 */
package com.digitnexus.core.dao.query;

import java.util.Collection;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.hibernate.type.Type;

import com.mysema.query.support.Expressions;
import com.mysema.query.types.Expression;
import com.mysema.query.types.Operator;
import com.mysema.query.types.Ops;
import com.mysema.query.types.Path;
import com.mysema.query.types.Predicate;
import com.mysema.query.types.expr.BooleanExpression;
import com.mysema.query.types.expr.BooleanOperation;


/**
 * @author Santanu
 *
 */
public class Condition {
	
	protected Predicate predicate;
	private Root root;
	
	public static Condition create() {
		return new Condition();
	}
	
	protected Condition() {
		super();
	}

	public Condition root(Root root) {
		this.root = root;
		this.root.addCondition(this);
		return this;
	}
	
	private void removeFromRoot() {
		if (this.root != null) {
			this.root.removeCondition(this);
		}
	}
	
	public Condition between(String property, Number lowerLimit, Number upperLimit) {
		Path<Object> propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		Expression<Number> lowerLimitExpression = Expressions.constant(lowerLimit);
		Expression<Number> upperLimitExpression = Expressions.constant(upperLimit);
		BooleanExpression tempPredicate = Expressions.predicate(Ops.BETWEEN, propertyPath, lowerLimitExpression, upperLimitExpression);
		nullsafeAnd(tempPredicate);
		return this;
	}
	
	public Condition between(String property, Date lowerLimit, Date upperLimit) {
		Path<Object> propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		Expression<Date> lowerLimitExpression = Expressions.constant(lowerLimit);
		Expression<Date> upperLimitExpression = Expressions.constant(upperLimit);
		BooleanExpression tempPredicate = Expressions.predicate(Ops.BETWEEN, propertyPath, lowerLimitExpression, upperLimitExpression);
		nullsafeAnd(tempPredicate);
		return this;
	}
	
	public Condition eq(String property, Object value) {
		return eq(root, property, value);
	}
	
	public Condition eq(String property, Root anotherObject, String anotherProperty) {
		return eq(root, property, anotherObject, anotherProperty);
	}
	
	public Condition eq(Root root, String property, Object value) {
		doOperation(Ops.EQ, root, property, value);
		return this;
	}
	
	public Condition eq(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.EQ, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition eqic(String property, Object value) {
		return eqic(root, property, value);
	}
	
	public Condition eqic(String property, Root anotherObject, String anotherProperty) {
		return eqic(root, property, anotherObject, anotherProperty);
	}
	
	public Condition eqic(Root root, String property, Object value) {
		doOperation(Ops.EQ_IGNORE_CASE, root, property, value);
		return this;
	}
	
	public Condition eqic(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.EQ_IGNORE_CASE, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition in(String property, Collection<Object> value) {
		return in(root, property, value);
	}
	
	public Condition in(String property, Object... value) {
		return in(root, property, value);
	}
	
	public Condition in(Root root, String property, Collection<Object> value) {
		doOperation(Ops.IN, root, property, value);
		return this;
	}
	
	public Condition in(Root root, String property, Object... value) {
		doOperation(Ops.IN, root, property, value);
		return this;
	}
	
	public Condition in(String property, Root anotherObject, String anotherProperty) {
		return in(root, property, anotherObject, anotherProperty);
	}
	
	public Condition in(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.IN, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition gt(String property, Object value) {
		return gt(root, property, value);
	}
	
	public Condition gt(String property, Root anotherObject, String anotherProperty) {
		return gt(root, property, anotherObject, anotherProperty);
	}
	
	public Condition gt(Root root, String property, Object value) {
		doOperation(Ops.GT, root, property, value);
		return this;
	}

	public Condition gt(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.GT, root, property, anotherObject, anotherProperty);
		return this;
	}

	public Condition lt(String property, Object value) {
		return lt(root, property, value);
	}
	
	public Condition lt(String property, Root anotherObject, String anotherProperty) {
		return lt(root, property, anotherObject, anotherProperty);
	}
	
	public Condition lt(Root root, String property, Object value) {
		doOperation(Ops.LT, root, property, value);
		return this;
	}

	public Condition lt(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.LT, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition ge(String property, Object value) {
		return ge(root, property, value);
	}
	
	public Condition ge(String property, Root anotherObject, String anotherProperty) {
		return ge(root, property, anotherObject, anotherProperty);
	}
	
	public Condition ge(Root root, String property, Object value) {
		doOperation(Ops.GOE, root, property, value);
		return this;
	}

	public Condition ge(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.GOE, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition le(String property, Object value) {
		return le(root, property, value);
	}
	
	public Condition le(String property, Root anotherObject, String anotherProperty) {
		return le(root, property, anotherObject, anotherProperty);
	}
	
	public Condition le(Root root, String property, Object value) {
		doOperation(Ops.LOE, root, property, value);
		return this;
	}

	public Condition le(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.LOE, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition ne(String property, Object value) {
		return ne(root, property, value);
	}
	
	public Condition ne(String property, Root anotherObject, String anotherProperty) {
		return ne(root, property, anotherObject, anotherProperty);
	}
	
	public Condition ne(Root root, String property, Object value) {
		doOperation(Ops.NE, root, property, value);
		return this;
	}

	public Condition ne(Root root, String property, Root anotherObject, String anotherProperty) {
		doOperation(Ops.NE, root, property, anotherObject, anotherProperty);
		return this;
	}
	
	public Condition like(String property, Object value) {
		return like(root, property, value);
	}
	
	public Condition like(Root root, String property, Object value) {
		doOperation(Ops.LIKE, root, property, value);
		return this;
	}

	/**
	 * @param root
	 * @param property
	 * @param anotherObject
	 * @param anotherProperty
	 */
	@SuppressWarnings("unchecked")
	protected void doOperation(Operator<Boolean> booleanOp, Root root, String property, Root anotherObject, String anotherProperty) {
		Path<Object> propertyPath = root.getAlias();
		if (StringUtils.isNotBlank(property)) {
			propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		}
		Path<Object> relationPath  = anotherObject.getAlias();
		if (StringUtils.isNotBlank(anotherProperty)) {
			relationPath = Expressions.path(Object.class, anotherObject.getAlias(), anotherProperty);
		}
		BooleanExpression tempPredicate = Expressions.predicate(booleanOp, propertyPath, relationPath);
		nullsafeAnd(tempPredicate);
	}
	
	/**
	 * @param root
	 * @param property
	 * @param value
	 */
	protected void doOperation(Operator<Boolean> booleanOp, Root root, String property, Object value) {
		Path<Object> propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		Expression<Object> constant = Expressions.constant(getActualValue(root, property, value));
		BooleanExpression tempPredicate = Expressions.predicate(booleanOp, propertyPath, constant);
		nullsafeAnd(tempPredicate);
	}
	
	/**
	 * Gets the actual value of the object passed which can be set to a hibernate query
	 * @param root
	 * @param property
	 * @param value
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Object getActualValue(Root root, String property, Object value) {
		//first check for the type of the property
		//if the type of the property and the type of the object combination can work together
		//then it is fine, else try to get the object that can be used
		Type type = root.rootTypeMetadata.getPropertyType(property);
		//here we handle enum, if the passed type is string then we get the actual enum constant
		if (type.getReturnedClass().isEnum() && (value instanceof String)) {
			Class<? extends Enum> clazz = type.getReturnedClass();
			Enum[] enumConstants = clazz.getEnumConstants();
			for (Enum enumConstant:enumConstants) {
				if (enumConstant.name().equals(value)) {
					return enumConstant;
				}
			}
		}
		return value;
	}
	
	public Condition isNull(String property) {
		Path<Object> propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		BooleanExpression tempPredicate = Expressions.predicate(Ops.IS_NULL, propertyPath);
		nullsafeAnd(tempPredicate);
		return this;
	}
	
	public Condition isNotNull(String property) {
		Path<Object> propertyPath = Expressions.path(Object.class, root.getAlias(), property);
		BooleanExpression tempPredicate = Expressions.predicate(Ops.IS_NOT_NULL, propertyPath);
		nullsafeAnd(tempPredicate);
		return this;
	}
	
	public Condition wrap() {
		this.predicate = BooleanOperation.create(Ops.WRAPPED, this.predicate);
		return this;
	}
	
	public Condition and(Condition condition) {
		condition.removeFromRoot();
		nullsafeAnd(condition.predicate);
		return this;
	}
	
	public Condition or(Condition condition) {
		condition.removeFromRoot();
		nullsafeOr(condition.predicate);
		return this;
	}
	
	private void nullsafeAnd(Predicate predicate) {
		if (this.predicate == null) {
			this.predicate = predicate;
		} else {
			if (this.predicate instanceof BooleanExpression) {
				this.predicate = ((BooleanExpression)this.predicate).and(predicate);
			} else if (predicate instanceof BooleanExpression){
				this.predicate = ((BooleanExpression)predicate).and(this.predicate);
			}
		}
	}
	
	private void nullsafeOr(Predicate predicate) {
		if (this.predicate == null) {
			this.predicate = predicate;
		} else {
			if (this.predicate instanceof BooleanExpression) {
				this.predicate = ((BooleanExpression)this.predicate).or(predicate);
			} else if (predicate instanceof BooleanExpression){
				this.predicate = ((BooleanExpression)predicate).or(this.predicate);
			}
		}
	}
}
