package com.digitnexus.core.dao;

import java.util.List;

import javax.persistence.NonUniqueResultException;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.digitnexus.core.spring.ServiceLocator;

/**
 * Abstract class that provides utility methods for forming an hql query.
 * Also this provides the methods to execute hqls
 *   
 * @author Santanu
 */
public abstract class AbstractQuery {

    protected transient SessionFactory sessionFactory = null;

    protected String orderByClause = null;

    protected boolean isWhereAdded  = false;

    protected abstract void applyParameters(Query query);

    protected abstract String hql();

    /**
     * Sets the {@link SessionFactory} if it is null
     * 
     * @return the sessionFactory
     */
    public SessionFactory getSessionFactory() {
    	if (sessionFactory == null) {
    		sessionFactory = ServiceLocator.getService(SessionFactory.class);
    	}
        return sessionFactory;
    }

    /**
     * @param sessionFactory the sessionFactory to set
     */
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @SuppressWarnings("rawtypes")
	public List untypedList() {
        return (List) execute();
    }

    protected Object untypedUniqueResult() {
        @SuppressWarnings("rawtypes")
		List list = untypedList();
        if (list.isEmpty()) {
            return null;
        }
        if (list.size() > 1) {
            throw new NonUniqueResultException("result not unique: " + list.size());
        }
        return list.get(0);
    }

    public Object execute() {
        return execute(getSessionFactory());

    }
    
	public Object execute(SessionFactory sessionFactory) {
    	Session session = sessionFactory.getCurrentSession();
    	String hql = hql();
    	Query query = session.createQuery(hql);
    	applyParameters(query);
    	return query.list();
    }

    protected void appendWhereClause(String whereClause, StringBuilder hql) {
        if (isWhereAdded) {
            hql.append("  and ");
        } else {
            isWhereAdded = true;
            hql.append(" where ");
        }
        hql.append(whereClause);
    }

    protected void appendOrderByClause(StringBuilder hql) {
        if (orderByClause != null) {
            hql.append(" order by ");
            hql.append(orderByClause);
        }
    }

    protected void addOrderByClause(String clause) {
        if (orderByClause == null) {
            orderByClause = clause;
        } else {
            orderByClause += ", " + clause;
        }
    }

}
