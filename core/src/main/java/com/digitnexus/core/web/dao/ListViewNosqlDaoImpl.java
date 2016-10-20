/**
 * 
 */
package com.digitnexus.core.web.dao;

import java.util.List;

import org.springframework.data.mongodb.core.geo.Point;
import org.springframework.data.mongodb.core.geo.Polygon;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.nosql.dao.BaseNosqlDaoImpl;
import com.digitnexus.core.search.FilterExpressionDescription;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.SortExpressionDescription;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 *
 */
@Repository
public class ListViewNosqlDaoImpl extends BaseNosqlDaoImpl implements ListViewNosqlDao {

	/* (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewNosqlDao#getDataForListView(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData)
	 */
	@Override
	public <T> List<T> getDataForListView(ListViewMetaData listMetaData) {
		return getDataForListView(listMetaData, null, -1, -1);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewNosqlDao#getDataForListView(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, 
	 * 																					com.digitnexus.core.search.SearchCriteria, int, int)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> getDataForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria, int startIndex, int maxResults) {
		Query query = new Query();
		if (searchCriteria != null) {
			for(FilterExpressionDescription filterDescription:searchCriteria.getFilterExpressions()){
				if(filterDescription.getSearchOperator().equals(SearchOperator.EQUAL)){
			    	query.addCriteria(Criteria.where(filterDescription.getName()).is(filterDescription.getLowerLimit()));
				}else if(filterDescription.getSearchOperator().equals(SearchOperator.LIKE)){ 
					query.addCriteria(Criteria.where(filterDescription.getName()).regex(filterDescription.getLowerLimit().toString()));
				}else if(filterDescription.getSearchOperator().equals(SearchOperator.NOTEQUAL)){
					query.addCriteria(Criteria.where(filterDescription.getName()).ne(filterDescription.getLowerLimit()));
				}
			}
			 FilterExpressionDescription filter=searchCriteria.getGeofilterExpression();
			  if(filter!=null){
				  String polygon=filter.getLowerLimit().toString().replace("POLYGON","").replaceAll("\\(", "").replaceAll("\\)", "");
				  String[] str=polygon.split(",");
				  Point[] strpoint=new Point[3];
				  Point[] point=new Point[str.length-3];
				  for(int i=0;i<str.length;i++){
					  if(i<3){
					  String[] tmp=str[i].split(" ");
					  strpoint[i]=new Point(Double.parseDouble(tmp[0]),Double.parseDouble(tmp[1]));
					  }else{
						  String[] tmp=str[i].split(" ");
						  point[i-3]=new Point(Double.parseDouble(tmp[0]),Double.parseDouble(tmp[1]));
					  }
				  }
				  Polygon poly=new Polygon(strpoint[0],strpoint[1],strpoint[2],point); 
				  
				  if(filter.getSearchOperator()==SearchOperator.GEOIN){
					     query.addCriteria(Criteria.where("loc").within(poly));
				  } 
			  }
			for(SortExpressionDescription sortDescription:searchCriteria.getSortExpressions()){
				query.sort().on(sortDescription.getName(), sortDescription.isAscending()? Order.ASCENDING : Order.DESCENDING);
			}
		} else {
			query.sort().on("_id", Order.ASCENDING);
		}
		applyAccessControl(listMetaData, UserOperation.READ, query);
		return executeQuery(listMetaData.getEntityClass(), query, startIndex, maxResults);
	}

	/* (non-Javadoc)
	 * @see com.digitnexus.core.web.dao.ListViewNosqlDao#getCountForListView(com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData, com.digitnexus.core.search.SearchCriteria)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public long getCountForListView(ListViewMetaData listMetaData, SearchCriteria searchCriteria) {
		
		Query query = new Query();
		if (searchCriteria != null) {
			for(FilterExpressionDescription filterDescription:searchCriteria.getFilterExpressions()){
				if(filterDescription.getSearchOperator().equals(SearchOperator.EQUAL)){
			    	query.addCriteria(Criteria.where(filterDescription.getName()).is(filterDescription.getLowerLimit()));
				}else if(filterDescription.getSearchOperator().equals(SearchOperator.LIKE)){
					query.addCriteria(Criteria.where(filterDescription.getName()).is(java.util.regex.Pattern.compile(filterDescription.getLowerLimit().toString())));
				}else if(filterDescription.getSearchOperator().equals(SearchOperator.NOTEQUAL)){
					query.addCriteria(Criteria.where(filterDescription.getName()).ne(filterDescription.getLowerLimit()));
				}
			}
		  FilterExpressionDescription filter=searchCriteria.getGeofilterExpression();
		  if(filter!=null){
			  String polygon=filter.getLowerLimit().toString().replace("POLYGON","").replaceAll("\\(", "").replaceAll("\\)", "");
			  String[] str=polygon.split(",");
			  Point[] strpoint=new Point[3];
			  Point[] point=new Point[str.length-3];
			  for(int i=0;i<str.length;i++){
				  if(i<3){
				  String[] tmp=str[i].split(" ");
				  strpoint[i]=new Point(Double.parseDouble(tmp[0]),Double.parseDouble(tmp[1]));
				  }else{
					  String[] tmp=str[i].split(" ");
					  point[i-3]=new Point(Double.parseDouble(tmp[0]),Double.parseDouble(tmp[1]));
				  }
			  }
			  Polygon poly=new Polygon(strpoint[0],strpoint[1],strpoint[2],point); 
			  if(filter.getSearchOperator()==SearchOperator.GEOIN){
			     query.addCriteria(Criteria.where("loc").within(poly));
			  } 
		  }
			 
		}
		applyAccessControl(listMetaData, UserOperation.READ, query);
		return count(listMetaData.getEntityClass(), query);
	}

	/**
	 * @param listMetaData
	 * @param query
	 */
	private void applyAccessControl(ListViewMetaData listMetaData, UserOperation operation, Query query) {
		String secureResourceName = null;
		if (listMetaData.getParentField() != null) {
			secureResourceName = listMetaData.getParentField().getEntityClass().getName() 
					+ "." + listMetaData.getParentField().getName();
		} else {
			secureResourceName = listMetaData.getEntityClass().getName();
		}
		
		applyAccessControl(secureResourceName, listMetaData.getEntityClass().getName(), operation, query);
	}
}
