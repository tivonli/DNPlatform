/**
 * 
 */
package com.digitnexus.core.dao.query;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.type.CollectionType;
import org.hibernate.type.Type;

import com.digitnexus.core.spring.ServiceLocator;
import com.mysema.query.support.Expressions;
import com.mysema.query.types.EntityPath;
import com.mysema.query.types.Order;
import com.mysema.query.types.OrderSpecifier;
import com.mysema.query.types.path.PathBuilder;
import com.mysema.query.types.path.SimplePath;

/**
 * @author Santanu
 *
 */
public class Root {
	
	private static SessionFactory sessionFactory = null;
	
	private static String[] INVALID_ALIAS = {"from", "select", "where"};
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Root create(Class type, String variable) {
		return new Root(type, variable);
	}
	
	@SuppressWarnings("unchecked")
	public static Root create(String className, String variable) {
		Map<String, ClassMetadata> classMetaCache = getSessionFactory().getAllClassMetadata();
		Collection<ClassMetadata> classMetas = classMetaCache.values();
		for (ClassMetadata classMeta:classMetas) {
			if (classMeta.getEntityName().equals(className)
					|| classMeta.getMappedClass().getName().equals(className)
					|| classMeta.getMappedClass().getSimpleName().equals(className)) {
				return new Root(classMeta.getMappedClass(), variable);
			}
		}
		throw new RuntimeException("No hibernate mapping found for the class name " + className);
	}
	
	private static SessionFactory getSessionFactory() {
		if (sessionFactory == null) {
			sessionFactory = ServiceLocator.getService(SessionFactory.class);
		}
		
		return sessionFactory;
	}
	
	protected ClassMetadata rootTypeMetadata;
	
	@SuppressWarnings("rawtypes")
	private PathBuilder rootPath;
	@SuppressWarnings("rawtypes")
	private PathBuilder alias;
	
	private List<Root> innerJoins = new ArrayList<Root>();
	private List<Root> leftJoins = new ArrayList<Root>();
	private List<Condition> conditions = new ArrayList<Condition>();
	@SuppressWarnings("rawtypes")
	private List<OrderSpecifier<Comparable>> orderByClauses = new ArrayList<OrderSpecifier<Comparable>>();
	
	//properties which are relevant for inner join roots
	//these are used internally and not anywhere else
	private String aliasString;
	private String associationPropertyName;
	
	private Root(){}
	
	private <T> Root(Class<? extends T> type, String alias) {
		this.rootPath = new PathBuilder<T>(type, generateAlias(alias));
		this.alias = this.rootPath;
		this.rootTypeMetadata = getSessionFactory().getClassMetadata(type);
	}

	private String generateAlias(String alias) {
		if (ArrayUtils.contains(INVALID_ALIAS, alias)) {
			//doing the same thing twice to reduce chance of conflict
			alias += RandomUtils.nextInt(100);
			alias += RandomUtils.nextInt(100);
		}
		
		return alias;
	}
	
	public Condition createCondition() {
		return Condition.create().root(this);
	}
	
	void addCondition(Condition condition) {
		conditions.add(condition);
	}
	
	void removeCondition(Condition condition) {
		conditions.remove(condition);
	}
	
	public Root getAssociation(String property) {
		Root root = new Root();
		root.rootPath = rootPath.get(property);
		return root;
	}
	
	/**
	 * @return the innerJoins
	 */
	public List<Root> getInnerJoins() {
		return innerJoins;
	}
	
	/**
	 * @return the leftJoins
	 */
	public List<Root> getLeftJoins() {
		return leftJoins;
	}

	/**
	 * @return the conditions
	 */
	public List<Condition> getConditions() {
		return conditions;
	}

	/**
	 * @return the orderByClauses
	 */
	@SuppressWarnings("rawtypes")
	public List<OrderSpecifier<Comparable>> getOrderByClauses() {
		return orderByClauses;
	}

	@SuppressWarnings("rawtypes")
	public Class getType() {
		return rootPath.getType();
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Root innerJoin(String property, String alias) {
		for (Root innerJoin:innerJoins) {
			if (property.equals(innerJoin.associationPropertyName)
					&& innerJoin.aliasString.equals(alias)) {
				return innerJoin;
			}
		}
		Type propertyHibernateType = rootTypeMetadata.getPropertyType(property);
		Class propertyJavaType = null;
		if (propertyHibernateType.isCollectionType()) {
			propertyJavaType = ((CollectionType)propertyHibernateType).getElementType((SessionFactoryImplementor)sessionFactory).getReturnedClass();
		} else {
			propertyJavaType = propertyHibernateType.getReturnedClass();
		}
		
		Root aliasRoot = new Root(propertyJavaType, alias);
		
		Root innerJoin = new Root();
		innerJoin.rootPath = rootPath.get(property);
		innerJoin.alias = aliasRoot.rootPath;
		innerJoin.rootTypeMetadata = aliasRoot.rootTypeMetadata;
		innerJoin.aliasString = alias;
		innerJoin.associationPropertyName = property;
		innerJoins.add(innerJoin);
		
		return innerJoin;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Root leftJoin(String property, String alias) {
		for (Root leftJoin:leftJoins) {
			if (property.equals(leftJoin.associationPropertyName)
					&& leftJoin.aliasString.equals(alias)) {
				return leftJoin;
			}
		}
		Type propertyHibernateType = rootTypeMetadata.getPropertyType(property);
		Class propertyJavaType = null;
		if (propertyHibernateType.isCollectionType()) {
			propertyJavaType = ((CollectionType)propertyHibernateType).getElementType((SessionFactoryImplementor)sessionFactory).getReturnedClass();
		} else {
			propertyJavaType = propertyHibernateType.getReturnedClass();
		}
		
		Root aliasRoot = new Root(propertyJavaType, alias);
		
		Root leftJoin = new Root();
		leftJoin.rootPath = rootPath.get(property);
		leftJoin.alias = aliasRoot.rootPath;
		leftJoin.rootTypeMetadata = aliasRoot.rootTypeMetadata;
		leftJoin.aliasString = alias;
		leftJoin.associationPropertyName = property;
		leftJoins.add(leftJoin);
		
		return leftJoin;
	}
	
	/**
	 * 
	 * @param property
	 * @return
	 */
	public Root asc(String property) {
		orderBy(property, Order.ASC);
		return this;
	}
	
	/**
	 * 
	 * @param property
	 * @return
	 */
	public Root desc(String property) {
		orderBy(property, Order.DESC);
		return this;
	}
	
	/**
	 * @param root
	 * @param property
	 */
	@SuppressWarnings("rawtypes")
	private void orderBy(String property, Order order) {
		SimplePath<Comparable> propertyPath = Expressions.path(Comparable.class, getAlias(), property);
		orderByClauses.add(new OrderSpecifier<Comparable>(order, propertyPath));
	}
	
	@SuppressWarnings("rawtypes")
	protected PathBuilder getPropertyPath(String property) {
		return rootPath.get(property);
	}
	
	/**
	 * @return the rootPath
	 */
	@SuppressWarnings("rawtypes")
	protected EntityPath getRootPath() {
		return rootPath;
	}

	/**
	 * @return the alias
	 */
	@SuppressWarnings("rawtypes")
	protected PathBuilder getAlias() {
		return alias;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return rootPath.toString();
	}
}
