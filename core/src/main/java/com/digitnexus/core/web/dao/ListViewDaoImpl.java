/**
 * 
 */
package com.digitnexus.core.web.dao;

import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.ReflectionUtils;

import com.digitnexus.core.acl.service.AclService;
import com.digitnexus.core.dao.BaseDaoImpl;
import com.digitnexus.core.dao.query.HQLQuery;
import com.digitnexus.core.dao.query.Root;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.SortExpressionDescription;
import com.digitnexus.core.search.transformer.SearchCriteriaTransformerFactory;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;
import com.digitnexus.core.web.ui.config.dataobject.ColumnMetaData;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 */
@Repository
public class ListViewDaoImpl extends BaseDaoImpl implements ListViewDao {

	private static Logger logger = LoggerFactory.getLogger(ListViewDaoImpl.class);
	
	private AclService aclService;
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#getDataForListView(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData)
	 */
	public List<Object> getDataForListView(ListViewMetaData listMetaData) {
		return getDataForListView(listMetaData, null, -1, -1);
	}
	
	/* (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#getDataForListView(java.lang.String, java.lang.String)
	 */
	@Override
	public List<Object> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		return getDataForListViewUsingHibernateQueryObject(listMetaData, searchCriteria, startIndex, maxResults);
	}

	private List<Object> getDataForListViewUsingHibernateQueryObject(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		Root root = Root.create(listMetaData.getEntityClass(), StringUtils.uncapitalize(listMetaData.getEntityClass().getSimpleName()));
		for (ColumnMetaData column:listMetaData.getColumns()) {
			if (DataType.REFERENCE.name().equals(column.getDataType())) {
				root.innerJoin(column.getName(), StringUtils.uncapitalize(column.getName()));
			}
		}
		
		if (searchCriteria != null) {
			SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(root)
											.transform(searchCriteria, root);
		}
		
		HQLQuery query = new HQLQuery(getSession())
							.from(root)
							.limit(maxResults)
							.offset(startIndex);
		
		applyAccessControl(listMetaData, UserOperation.READ, query);
		
		logger.debug("List view query to be executed : {}", query.toString());
		
		return query.list();
	}
	
	/**
	 * @param listMetaData
	 * @param searchCriteria
	 * @param startIndex
	 * @param maxResults
	 * @return
	 */
	@SuppressWarnings("unused")
	private List<Object> getDataForListViewUsingHibernateCriteria(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		//This is work around for https://community.jboss.org/wiki/HibernateFAQ-AdvancedProblems#Hibernate_does_not_return_distinct_results_for_a_query_with_outer_join_fetching_enabled_for_a_collection_even_if_I_use_the_distinct_keyword
				
		Criteria listQueryCriteria = createCriteria(listMetaData.getEntityClass());
		
		String idPropertyName=listMetaData.getIdColumn().getName();
		ProjectionList projectionList=Projections.projectionList();
		projectionList.add(Projections.distinct(Projections.property(idPropertyName)));
		
		if (searchCriteria != null) {
			SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(listQueryCriteria)
											.transform(searchCriteria, listQueryCriteria);

			for(SortExpressionDescription sortDescription:searchCriteria.getSortExpressions()){
				if(!sortDescription.getName().equals(idPropertyName)){
					projectionList.add(Projections.property(sortDescription.getName()));
				}
			}
		}
		
		listQueryCriteria.setProjection(projectionList);
		
		for (ColumnMetaData column:listMetaData.getColumns()) {
			if (DataType.REFERENCE.name().equals(column.getDataType())) {
				listQueryCriteria.setFetchMode(column.getName(), FetchMode.JOIN);
			}
		}

		List<Object> listCriteriaResults = null;
		//if the start index and max results are invalid then use a default value
		if (startIndex < 0 || maxResults < 0) {
			//do it without pagination
			listCriteriaResults = findByCriteria(listQueryCriteria);
		} else {
			//this is the regular case with pagination
			listCriteriaResults = findByCriteria(listQueryCriteria, startIndex, maxResults);
		}
		
		if(!listCriteriaResults.isEmpty()){
			List<Object> idResults=null;
			if(projectionList.getLength()>1){
				//Additional projections added for sorted columns
				idResults=new ArrayList<Object>(listCriteriaResults.size());
				for(Object criteriaResult:listCriteriaResults){
					idResults.add(((Object[])criteriaResult)[0]);	
				}
			}else{
				idResults=listCriteriaResults;
			}
			
			Criteria criteria = createCriteria(listMetaData.getEntityClass())
					.add(Restrictions.in(listMetaData.getIdColumn().getName(), idResults))
					.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
			//create search criteria with sort only
			SearchCriteria sortCriteria = SearchCriteria.createSearchCriteria(null, searchCriteria.getSearchMeta());
			sortCriteria.setName(searchCriteria.getName());
			sortCriteria.setEntityName(searchCriteria.getEntityName());
			sortCriteria.setSortExpressions(searchCriteria.getSortExpressions());
			SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(listQueryCriteria)
											.transform(sortCriteria, criteria);
			return findByCriteria(criteria);
		}
		return Collections.emptyList();
	}
	
	@Override
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		return getCountForListViewUsingHibernateQueryObject(listMetaData, searchCriteria);
	}

	/**
	 * @param listMetaData
	 * @param searchCriteria
	 * @return
	 */
	@SuppressWarnings("unused")
	private long getCountForListViewUsingHibernateCriteria(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		Criteria listQueryCriteria = createCriteria(listMetaData.getEntityClass());
		if (searchCriteria != null) {
			SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(listQueryCriteria)
											.transform(searchCriteria, listQueryCriteria);
		}

		long count = ((Number)listQueryCriteria.setProjection(Projections.rowCount()).uniqueResult()).longValue();
		return count;
	}
	
	/**
	 * 
	 * @param listMetaData
	 * @param searchCriteria
	 * @return
	 */
	private long getCountForListViewUsingHibernateQueryObject(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		Root root = Root.create(listMetaData.getEntityClass(), StringUtils.uncapitalize(listMetaData.getEntityClass().getSimpleName()));
		if (searchCriteria != null) {
			SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(root)
											.transform(searchCriteria, root);
		}

		HQLQuery query = new HQLQuery(getSession()).from(root);
		applyAccessControl(listMetaData, UserOperation.READ, query);
		
		logger.debug("List view count query to be executed : {}", query.toString());
		
		long count = query.count();
		return count;
	}

	/**
	 * @param listMetaData
	 * @param query
	 */
	private void applyAccessControl(ListViewMetaData listMetaData, UserOperation operation, HQLQuery query) {
		String secureResourceName = null;
		if (listMetaData.getParentField() != null) {
			secureResourceName = listMetaData.getParentField().getEntityClass().getName() 
					+ "." + listMetaData.getParentField().getName();
		} else {
			secureResourceName = listMetaData.getEntityClass().getName();
		}
		
		applyAccessControl(secureResourceName, listMetaData.getEntityClass().getName(), operation, query);
	}
	
	private void applyAccessControl(String secureResourceName, String primaryResourceName, UserOperation operation, HQLQuery query) {
		aclService.applyAclExpression(secureResourceName, primaryResourceName, operation, query);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#getObjectEagerly(com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@Override
	public Object getObjectEagerly(EditViewMetaData editMetaData, Serializable id) {
		return getObjectEagerlyUsingHibernateQueryObject(editMetaData, id);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#isEditable(com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@Override
	public boolean isEditable(EditViewMetaData editMetaData, Serializable id) {
		return isOperationAllowed(editMetaData.getEntityClass(), editMetaData.getIdField().getName(), id, UserOperation.EDIT);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#isDeletable(com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData, java.io.Serializable)
	 */
	@Override
	public boolean isDeletable(EditViewMetaData editMetaData, Serializable id) {
		return isOperationAllowed(editMetaData.getEntityClass(), editMetaData.getIdField().getName(), id, UserOperation.DELETE);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewDao#isDeletable(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, java.io.Serializable)
	 */
	@Override
	public boolean isDeletable(ListViewMetaData listMetaData, Serializable id) {
		return isOperationAllowed(listMetaData.getEntityClass(), listMetaData.getIdColumn().getName(), id, UserOperation.DELETE);
	}
	
	/**
	 * 
	 * @param entityClass
	 * @param idFieldName
	 * @param id
	 * @param operation
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private boolean isOperationAllowed(Class entityClass, String idFieldName, Serializable id, UserOperation operation) {
		Root root = Root.create(entityClass, StringUtils.uncapitalize(entityClass.getSimpleName()));
		root.createCondition()
		    .eq(idFieldName, id);
		
		HQLQuery query = new HQLQuery(getSession()).from(root);
		applyAccessControl(entityClass.getName(), entityClass.getName(), operation, query);
		
		logger.debug("{} check query to be executed : {}", operation.toString(), query.toString());
		
		//this query should return only one object, so the count should be either zero or one
		return query.count() == 1;
	}
	
	/**
	 * @param editMetaData
	 * @param id
	 * @return
	 */
	@SuppressWarnings("unused")
	private Object getObjectEagerlyUsingHQL(EditViewMetaData editMetaData, Serializable id) {
		FieldMetaData idField = editMetaData.getIdField();
		List<FieldMetaData> fields = editMetaData.getFields();
		StringBuilder hql = new StringBuilder("select obj from " + editMetaData.getEntityClass().getName() + " obj");
		for (FieldMetaData field:fields) {
			if (DataType.REFERENCE.name().equals(field.getDataType())) {
				hql.append(" left join fetch obj.")
				   .append(field.getName());
			}
		}
		hql.append(" where obj.")
		   .append(idField.getName())
		   .append("=?");

		Object result = findUnique(hql.toString(), id);
		return result;
	}

	/**
	 * @param editMetaData
	 * @param id
	 * @param idField
	 * @param fields
	 */
	private Object getObjectEagerlyUsingHibernateQueryObject(EditViewMetaData editMetaData, Serializable id) {
		FieldMetaData idField = editMetaData.getIdField();
		List<FieldMetaData> fields = editMetaData.getFields();
		
		Root root = Root.create(editMetaData.getEntityClass(), StringUtils.uncapitalize(editMetaData.getEntityClass().getSimpleName()));
		for (FieldMetaData field:fields) {
			if (DataType.REFERENCE.name().equals(field.getDataType())) {
				root.leftJoin(field.getName(), StringUtils.uncapitalize(field.getName()));
			}
		}
		root.createCondition()
		    .eq(idField.getName(), id);
		
		HQLQuery query = new HQLQuery(getSession()).from(root).distinct();
		applyAccessControl(editMetaData.getEntityClass().getName(), editMetaData.getEntityClass().getName(), UserOperation.READ, query);
		
		logger.debug("Fetch object query to be executed : {}", query.toString());
		
		return query.uniqueResult();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Object> getAssociationDataForListView(ListViewMetaData listMetaData, ListViewMetaData sourceMetaData,String associationName, String idValue, 
			SearchCriteria searchCriteria, int startIndex, int maxResults) {
		Object value = DataFormatUtil.parse(idValue, null, DataType.valueOf(sourceMetaData.getIdColumn().getDataType()));
		Object sourceObject = get(sourceMetaData.getEntityClass(), (Serializable) value);
		
		return getAssociationDataForListViewUsingHibernateCriteria(listMetaData, sourceMetaData, associationName, sourceObject, searchCriteria);
	}

	/**
	 * @param listMetaData
	 * @param sourceMetaData
	 * @param associationName
	 * @param searchCriteria
	 * @param sourceObject
	 * @return
	 */
	@SuppressWarnings({ "unchecked" })
	private List<Object> getAssociationDataForListViewUsingHibernateCriteria(ListViewMetaData listMetaData, ListViewMetaData sourceMetaData,
			String associationName, Object sourceObject, SearchCriteria searchCriteria) {
		if(sourceObject != null){
			String idValues = getAssociationIdList(sourceObject, listMetaData, sourceMetaData, associationName);
			
			Criteria listQueryCriteria = createCriteria(listMetaData.getEntityClass());
			
			searchCriteria.filterCriteria(listMetaData.getIdColumn().getName(), idValues.split(","), 
					null, SearchOperator.IN, DataType.valueOf(listMetaData.getIdColumn().getDataType()));
			
			if (searchCriteria != null) {
				SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(listQueryCriteria)
												.transform(searchCriteria, listQueryCriteria);				
			}
						
			listQueryCriteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);  
			
			List<Object> results = null;		
			results = listQueryCriteria.list();
			
			return results;	
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public long getCountForAssociationListView(ListViewMetaData listMetaData, ListViewMetaData sourceMetaData, String associationName,
			String idValue, SearchCriteria searchCriteria) {
		Object value = DataFormatUtil.parse(idValue, null, DataType.valueOf(sourceMetaData.getIdColumn().getDataType()));		
		Object sourceObject = get(sourceMetaData.getEntityClass(), (Serializable) value);
		
		return getCountForAssociationListViewUsingHibernateCriteria(listMetaData, sourceMetaData, associationName, searchCriteria, sourceObject);		
	}

	/**
	 * @param listMetaData
	 * @param sourceMetaData
	 * @param associationName
	 * @param searchCriteria
	 * @param sourceObject
	 * @return
	 */
	private long getCountForAssociationListViewUsingHibernateCriteria(ListViewMetaData listMetaData, ListViewMetaData sourceMetaData,
			String associationName, SearchCriteria searchCriteria,
			Object sourceObject) {
		if(sourceObject != null){
			String idValues = getAssociationIdList(sourceObject, listMetaData, sourceMetaData, associationName);
			
			Criteria listQueryCriteria = createCriteria(listMetaData.getEntityClass());
			
			searchCriteria.filterCriteria(listMetaData.getIdColumn().getName(), idValues.split(","), 
					null, SearchOperator.IN, DataType.valueOf(listMetaData.getIdColumn().getDataType()));
			
			if (searchCriteria != null) {
				SearchCriteriaTransformerFactory.getSearchCriteriaTransformer(listQueryCriteria)
												.transform(searchCriteria, listQueryCriteria);				
			}
					
			long count = ((Number)listQueryCriteria.setProjection(Projections.rowCount()).uniqueResult()).longValue();			
			return count;	
		}
		return 0;
	}
	
	private String getAssociationIdList(Object sourceObject, ListViewMetaData listMetaData, ListViewMetaData sourceMetaData, String associationName) {
		
		String idValues = "";
		
		Iterator<ColumnMetaData> columnItr = sourceMetaData.getColumns().iterator();
		while (columnItr.hasNext()) {
			ColumnMetaData columnMetaData = columnItr.next();
			String propertyName = columnMetaData.getName();
			if(propertyName.equals(associationName)){
				
				PropertyDescriptor columnPropertyDescriptor = columnMetaData.getPropertyDescriptor();
				Object data = ReflectionUtils.invokeMethod(columnPropertyDescriptor.getReadMethod(), sourceObject, (Object[])null);
								
				ColumnMetaData idColumnMetaData = listMetaData.getIdColumn();
				PropertyDescriptor idColumnPropertyDescriptor = idColumnMetaData.getPropertyDescriptor();
				String id = ReflectionUtils.invokeMethod(idColumnPropertyDescriptor.getReadMethod(), data, (Object[])null).toString();
				idValues += id + ",";
			}				
		}
		
		return idValues;
	}

	/**
	 * @param aclService the aclService to set
	 */
	@Autowired
	public void setAclService(AclService aclService) {
		this.aclService = aclService;
	}
}
