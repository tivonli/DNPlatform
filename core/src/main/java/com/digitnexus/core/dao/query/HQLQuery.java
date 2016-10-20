/**
 * 
 */
package com.digitnexus.core.dao.query;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.ArrayUtils;
import org.hibernate.Session;

import com.mysema.query.jpa.hibernate.HibernateQuery;
import com.mysema.query.types.EntityPath;
import com.mysema.query.types.OrderSpecifier;
import com.mysema.query.types.Predicate;

/**
 * @author Santanu
 */
public class HQLQuery {
	
	private Session session;
	
	//properties of the query..
	//Roots, result offset and count
	private Root[] roots = new Root[0];
	private long offset = -1;
	private long limit = -1;
	private boolean distinct = false;
	
	private HibernateQuery query;
	
	public HQLQuery(Session session) {
		this.session = session;
	}
	
	public HQLQuery from(Root... roots) {
		if (ArrayUtils.isNotEmpty(this.roots)) {
			this.roots = (Root[])ArrayUtils.addAll(this.roots, roots);
		} else {
			this.roots = roots;
		}
		return this;
	}
	
	public HQLQuery distinct() {
		this.distinct = true;
		return this;
	}
	
	public HQLQuery offset(long offset) {
		this.offset = offset;
		return this;
	}
	
	public HQLQuery limit(long limit) {
		this.limit = limit;
		return this;
	}
	
	/**
	 * @return the roots
	 */
	public Root[] getRoots() {
		return roots;
	}

	/**
	 * Finds the relevant root for the class name passed
	 * @param className
	 * @return
	 */
	public Root getRoot(String className) {
		for (Root root:roots) {
			@SuppressWarnings("rawtypes")
			Class rootType = root.getType();
			if (rootType.getName().equals(className) 
					|| rootType.getSimpleName().equals(className)) {
				return root;
			}
		}
		
		return null;
	}
	
	@SuppressWarnings("unchecked")
	private void buildHibernateQueryObject() {
		query = new HibernateQuery (session);
		query.from(entityPaths(roots));
		
		List<Condition> conditions = new ArrayList<Condition>();
		for (Root root:roots) {
			conditions.addAll(root.getConditions());
			addOrderByClause(query, root);
			List<Root> innerJoins = root.getInnerJoins();
			for (Root innerJoin:innerJoins) {
				conditions.addAll(innerJoin.getConditions());
				query.innerJoin(innerJoin.getRootPath(), innerJoin.getAlias());
				addOrderByClause(query, innerJoin);
			}
			
			List<Root> leftJoins = root.getLeftJoins();
			for (Root leftJoin:leftJoins) {
				conditions.addAll(leftJoin.getConditions());
				query.leftJoin(leftJoin.getRootPath(), leftJoin.getAlias());
				addOrderByClause(query, leftJoin);
			}
		}
		if (distinct) {
			query.distinct();
		}
		if (CollectionUtils.isNotEmpty(conditions)) {
			query.where(predicates(conditions));
		}
		if (offset > 0) {
			query.offset(offset);
		}
		if (limit > 0) {
			query.limit(limit);
		}
	}

	/**
	 * @param root
	 */
	@SuppressWarnings("rawtypes")
	private void addOrderByClause(HibernateQuery query, Root root) {
		for (OrderSpecifier orderSpecifier:root.getOrderByClauses()) {
			query.orderBy(orderSpecifier);
		}
	}
	
	@SuppressWarnings("rawtypes")
	private EntityPath[] entityPaths(Root... roots) {
		EntityPath[] entityPaths = new EntityPath[roots.length];
		for (int i = 0; i < roots.length; i++) {
			entityPaths[i] = roots[i].getAlias();
		}
		return entityPaths;
	}
	
	private Predicate[] predicates(List<Condition> conditions) {
		Predicate[] predicates = new Predicate[conditions.size()];
		for (int i = 0; i < conditions.size(); i++) {
			predicates[i] = conditions.get(i).predicate;
		}
		return predicates;
	}
	
	/**
	 * 
	 * @return
	 */
	public long count() {
		if (query == null) {
			buildHibernateQueryObject();
		}
		return query.count();
	}

	/**
	 * 
	 * @return
	 */
	public <T> List<T> list() {
		return list(roots[0]);
	}
	
	/**
	 * 
	 * @param root
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> list(Root root) {
		if (query == null) {
			buildHibernateQueryObject();
		}
		return query.list(root.getRootPath());
	}
	
	/**
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public <T> T uniqueResult() {
		return (T)uniqueResult(roots[0]);
	}
	
	/**
	 * 
	 * @param root
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public <T> T uniqueResult(Root root) {
		if (query == null) {
			buildHibernateQueryObject();
		}
		return (T) query.uniqueResult(root.getRootPath());
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		if (query == null) {
			buildHibernateQueryObject();
		}
		if (query == null) {
			return "null";
		}
		return query.toString();
	}
}
