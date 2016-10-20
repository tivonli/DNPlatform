/**
 * 
 */
package com.digitnexus.core.dao.query;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.UndeclaredThrowableException;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;

import com.mysema.query.types.Operator;

/**
 * @author Santanu
 *
 */
public class DetachedCondition extends Condition {
	
	private List<MethodCall> methodCalls = new LinkedList<MethodCall>();

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#doOperation(com.mysema.query.types.Operator, com.digitnexus.core.dao.query.Root, 
	 * 															java.lang.String, com.digitnexus.core.dao.query.Root, java.lang.String)
	 */
	@Override
	protected void doOperation(Operator<Boolean> booleanOp, Root root, String property, Root anotherObject, String anotherProperty) {
		methodCalls.add(new MethodCall(getMethod("doOperation", Operator.class, Root.class, String.class, Root.class, String.class), 
				booleanOp, MethodCall.ROOT_MARKER, property, anotherObject, anotherProperty));
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#doOperation(com.mysema.query.types.Operator, com.digitnexus.core.dao.query.Root, java.lang.String, java.lang.Object)
	 */
	@Override
	protected void doOperation(Operator<Boolean> booleanOp, Root root, String property, Object value) {
		methodCalls.add(new MethodCall(getMethod("doOperation", Operator.class, Root.class, String.class, Object.class),
				booleanOp, MethodCall.ROOT_MARKER, property, value));
	}

	
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#between(java.lang.String, java.lang.Number, java.lang.Number)
	 */
	@Override
	public Condition between(String property, Number lowerLimit, Number upperLimit) {
		methodCalls.add(new MethodCall(getMethod("between", String.class, Number.class, Number.class),
				property, lowerLimit, upperLimit));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#between(java.lang.String, java.util.Date, java.util.Date)
	 */
	@Override
	public Condition between(String property, Date lowerLimit, Date upperLimit) {
		methodCalls.add(new MethodCall(getMethod("between", String.class, Date.class, Date.class),
				property, lowerLimit, upperLimit));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#wrap()
	 */
	@Override
	public Condition wrap() {
		methodCalls.add(new MethodCall(getMethod("wrap")));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#isNull(java.lang.String)
	 */
	@Override
	public Condition isNull(String property) {
		methodCalls.add(new MethodCall(getMethod("isNull", String.class), property));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#isNotNull(java.lang.String)
	 */
	@Override
	public Condition isNotNull(String property) {
		methodCalls.add(new MethodCall(getMethod("isNotNull", String.class), property));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#and(com.digitnexus.core.dao.query.Condition)
	 */
	@Override
	public Condition and(Condition condition) {
		methodCalls.add(new MethodCall(getMethod("and", Condition.class), condition));
		return this;
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.dao.query.Condition#or(com.digitnexus.core.dao.query.Condition)
	 */
	@Override
	public Condition or(Condition condition) {
		methodCalls.add(new MethodCall(getMethod("or", Condition.class), condition));
		return this;
	}
	
	public Condition attach(Root root) {
		Condition condition = Condition.create().root(root);
		for (MethodCall methodCall:methodCalls) {
			try {
				methodCall.getMethod().invoke(condition, methodCall.getParameters(root));
			} catch (IllegalAccessException e) {
				throw new IllegalStateException("Could not access method " + e.getMessage());
			} catch (InvocationTargetException e) {
				throw new UndeclaredThrowableException(e.getTargetException());
			}
		}
		return condition;
	}
	
	private Method getMethod(String name, Class<?>... parameterTypes) {
		try {
			return Condition.class.getDeclaredMethod(name, parameterTypes);
		} catch (SecurityException e) {
			throw new IllegalStateException("Method not accessible " + e.getMessage());
		} catch (NoSuchMethodException e) {
			throw new IllegalStateException("Method not found " + e.getMessage());
		}
	}
	
	private class MethodCall {
		
		static final String ROOT_MARKER = "_root";
		
		private Method method;
		private Object[] parameters;
		/**
		 * @param methodName
		 * @param parameters
		 */
		public MethodCall(Method method, Object... parameters) {
			this.method = method;
			this.parameters = parameters;
			this.method.setAccessible(true);
		}
		/**
		 * @return the method
		 */
		public Method getMethod() {
			return method;
		}
		/**
		 * @return the parameters
		 */
		public Object[] getParameters(Root root) {
			int index = ArrayUtils.indexOf(parameters, ROOT_MARKER, 0);
			if (index >= 0) {
				parameters[index] = root;
			}
			return parameters;
		}
	}
}
