/**
 * 
 */
package com.digitnexus.core.web.service;

import java.beans.PropertyDescriptor;
import java.io.UnsupportedEncodingException;
import java.lang.ref.SoftReference;
import java.net.URLDecoder;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.service.SearchCriteriaService;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.util.ConfigUtil;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.dao.ListViewDao;
import com.digitnexus.core.web.dao.ListViewNosqlDao;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.ColumnMetaData;
import com.digitnexus.core.web.ui.config.dataobject.DataSourceType;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ItemMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.SearchMetaData;

/**
 * @author Santanu
 */
@Service
@Path("list")
public class ListViewServiceImpl implements ListViewService {
	
	private static final int MAXSIZE=10000;
	private final Logger logger=LoggerFactory.getLogger(getClass());
	@Autowired
	private UiConfiguration uiConfiguration;
	@Autowired
    private ListViewDao listViewDao;
	@Autowired
	private ListViewNosqlDao listViewNosqlDao;
	@Autowired
	private SearchCriteriaService searchCriteriaService;
	
	private Map<String,SoftReference<List<Object>>> geoSearchCache=new ConcurrentHashMap<String,SoftReference<List<Object>>>();
	 
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListMetaSummaryResponse(java.lang.String)
	 */
	@GET @Path("summary/{groupName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListMetaSummaryResponse(@PathParam("groupName") String groupName) {
		//this returns a clone of the actual objects. so we are free to change the returned objects
		List<ListViewMetaData> listViewMetaForGroup = uiConfiguration.getListViewMetaForGroup(groupName);
		//this list will contain the column information as well. We may not need them for this purpose
		//so lets remove them. This might reduce the traffic a bit
		for (ListViewMetaData listViewMeta:listViewMetaForGroup) {
			listViewMeta.getColumns().clear();
		}
		
		return JsonUtil.toJson(listViewMetaForGroup);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListMetaDataResponse(java.lang.String)
	 */
	@GET @Path("meta/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListMetaDataResponse(@PathParam("articleName") String articleName,@QueryParam("parentArticleName") String parentArticleName) {
		//this returns a clone of the actual meta data 
		ListViewMetaData listMetaData = null;
		if(StringUtils.isNotEmpty(parentArticleName)){
			listMetaData = uiConfiguration.getListViewMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, parentArticleName));
		}else{
			listMetaData = uiConfiguration.getListViewMeta(articleName);
		}
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for " + articleName);
		}
		//give some callback here...
		return JsonUtil.toJson(listMetaData);
	}	

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListDataCount(java.lang.String, javax.ws.rs.core.UriInfo)
	 */
	@GET @Path("data/count/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListDataCount(@PathParam("articleName") String articleName, @Context UriInfo uriInfo) {
		ListViewMetaData listMetaData = uiConfiguration.getListViewMeta(articleName);
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for " + articleName);
		}
		
		return getListDataCount(listMetaData,uriInfo);
	}
	
	private String getListDataCount(ListViewMetaData listMetaData, UriInfo uriInfo) {
		//Check User permissions, temporary logic until we implement filtering
		String securedArticleName=listMetaData.getEntityClass().getName();
		if(SecurityUtil.isSecuredResource(securedArticleName) && !SecurityUtil.hasPermission(UserOperation.READ, securedArticleName)){
			return "0";			
		}
		
		SearchCriteria criteria = null;
		if (uriInfo != null) {
			criteria = getSearchCriteria(uiConfiguration.getSearchMeta(securedArticleName), uriInfo.getQueryParameters());
		}
		
		long dataCount = 0;
		if (DataSourceType.DOCUMENT.equals(listMetaData.getDataSourceType())) {
			dataCount = listViewNosqlDao.getCountForListView(listMetaData, criteria);
		} else {
			dataCount = listViewDao.getCountForListView(listMetaData, criteria);
		}
		return Long.toString(dataCount);
	
	}
	
	private SearchCriteria getSearchCriteria(SearchMetaData searchMeta,MultivaluedMap<String, String> queryParams){
		if(searchMeta==null){
			//can do a search only if search meta data is available
			return null;
		}
		
		String searchCriteriaId=queryParams.getFirst("searchCriteriaId");
		if(StringUtils.isNotEmpty(searchCriteriaId)){
			//We got it from db. We need to populate the transient fields like lowerLimit etc
			SearchCriteria searchCriteria=searchCriteriaService.getSearchCriteria(DataFormatUtil.parseLong(SearchCriteria.decode(searchCriteriaId)));
			SearchCriteria.convertTypes(searchCriteria,searchMeta);
			//Add sort expressions from queryParams if it is absent in searchMeta
			if(searchCriteria.getSortExpressions().isEmpty()){
				SearchCriteria.setSortCriteria(queryParams, searchCriteria);
			}
			return searchCriteria;
		}else{
			return SearchCriteria.createSearchCriteria(queryParams, searchMeta);
		}
		
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListDataResponse(java.lang.String, int)
	 */
	@Override
	public String getListDataResponse(String articleName, int pageIndex) {
		return getListDataResponse(articleName, null, pageIndex, 20);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListDataResponse(java.lang.String, int)
	 */
	@GET @Path("data/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListDataResponse(@PathParam("articleName") String articleName, @Context UriInfo ui,
			@QueryParam("page") Integer pageIndex, @QueryParam("pageSize") Integer pageSize) {
		
		ListViewMetaData listMetaData = uiConfiguration.getListViewMeta(articleName);
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for " + articleName);
		}
		return getListDataResponse(listMetaData, ui, pageIndex, pageSize);
	}
	
	private String getListDataResponse(ListViewMetaData listMetaData ,UriInfo ui,Integer pageIndex,Integer pageSize) {
		
		//Check User permissions, temporary logic until we implement filtering
		String securedArticleName=listMetaData.getEntityClass().getName();
		if (SecurityUtil.isSecuredResource(securedArticleName) && !SecurityUtil.hasPermission(UserOperation.READ, securedArticleName)) {
			return JsonUtil.toJson(Collections.emptyList());
		}
		
		//default the page index and page size if required...
		//if the passed page index is invalid then make it -1 so that it is ignored
		if ((pageIndex == null) || (pageIndex < 1)) {
			pageIndex = -1;
			//if page size is also not given then set a negative value to ensure that is also ignored
			if ((pageSize == null) || (pageSize < 0)) {
				pageSize = -1;
			}
		} else {
			//if page index is given and page size is not then take a default page size
			if ((pageSize == null) || (pageSize < 0)) {
				pageSize = 10;
			}
		}
		//figure out the start index
		int startIndex = (pageIndex > 0)?((pageIndex - 1) * pageSize):-1;
		
		//code for searching..
		SearchMetaData searchMeta = uiConfiguration.getSearchMeta(securedArticleName);
		SearchCriteria criteria = null;
		if (ui != null) {
			criteria = getSearchCriteria(searchMeta, ui.getQueryParameters());			
		}
		
		// here we query for the data
		List<Object> persistedDataList = null;
		if (DataSourceType.DOCUMENT.equals(listMetaData.getDataSourceType())) {
			persistedDataList = listViewNosqlDao.getDataForListView(listMetaData,
					criteria, startIndex, pageSize);
		} else {
			persistedDataList = listViewDao.getDataForListView(listMetaData,
					criteria, startIndex, pageSize);
		}
		
		List<ListViewData> listDataList = createListViewDataList(persistedDataList, listMetaData);
		// we need to give some callback here to execute custom logic if any

		return JsonUtil.toJson(listDataList);

	}


	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListDataCount(java.lang.String, javax.ws.rs.core.UriInfo)
	 */
	@GET @Path("data/count/editviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getEditViewAssociationListDataCount(@PathParam("articleName") String articleName, @QueryParam("propertyName")String associationPropertyName,@Context UriInfo uriInfo) {
		ListViewMetaData listMetaData = findRelevantListMetaData(articleName, associationPropertyName, "edit");
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for " + articleName);
		}
		
		return getListDataCount(listMetaData,uriInfo);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getAssociationListDataResponse(java.lang.String, java.lang.String)
	 */
	@GET @Path("data/editviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
    @Override
	public String getEditViewAssociationListDataResponse(@PathParam("articleName")String articleName, @QueryParam("propertyName")String associationPropertyName,
			@Context UriInfo uriInfo, @QueryParam("page") Integer pageIndex, @QueryParam("pageSize") Integer pageSize) {
		ListViewMetaData listMetaData = findRelevantListMetaData(articleName, associationPropertyName, "edit");
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for entity referred to be " + associationPropertyName + " property of article " + articleName);
		}
		return getListDataResponse(listMetaData, uriInfo, pageIndex, pageSize);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getListDataCount(java.lang.String, javax.ws.rs.core.UriInfo)
	 */
	@GET @Path("data/count/searchviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getSearchViewAssociationListDataCount(@PathParam("articleName") String articleName, @QueryParam("propertyName")String associationPropertyName) {
		
		ListViewMetaData listMetaData = findRelevantListMetaData(articleName, associationPropertyName, "search");
		if (listMetaData == null) {
			 
		   throw new NullPointerException("No list view configured for " + articleName);
		}
		return getListDataCount(listMetaData,null);
	}

	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.web.service.ListViewService#getAssociationListDataResponse(java.lang.String, java.lang.String)
	 */
	@GET @Path("data/searchviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
    @Override
	public String getSearchViewAssociationListDataResponse(@PathParam("articleName")String articleName, @QueryParam("propertyName")String associationPropertyName,
			@Context UriInfo uriInfo, @QueryParam("page") Integer pageIndex, @QueryParam("pageSize") Integer pageSize) {
	 
		ListViewMetaData listMetaData = findRelevantListMetaData(articleName, associationPropertyName, "search");
		if (listMetaData == null) { 
			 throw new NullPointerException("No list view configured for " + articleName);
		}
		
		return getListDataResponse(listMetaData, uriInfo, pageIndex, pageSize);
	}
	
	@GET @Path("data/count/listviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListViewAssociationListDataCount(@PathParam("articleName") String articleName, @Context UriInfo uriInfo) {
		MultivaluedMap<String, String> parameter = uriInfo.getQueryParameters();
		String sourceArticle = parameter.getFirst("sourceArticle");		
		ListViewMetaData listMetaData = uiConfiguration.getListViewMeta(articleName);
		if (listMetaData == null) {
			listMetaData = uiConfiguration.getListViewMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, sourceArticle));
			if (listMetaData == null) {
				throw new NullPointerException("No list view configured for " + articleName);
			}
		}
		ListViewMetaData sourceMetaData = uiConfiguration.getListViewMeta(sourceArticle);
		String idValue = parameter.getFirst("idValue");	
		try {
			idValue = URLDecoder.decode(idValue, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			logger.error(e.getMessage(),e);
		}
		//code for searching..
		SearchMetaData searchMeta = uiConfiguration.getSearchMeta(articleName);
		if(searchMeta==null){
			searchMeta = uiConfiguration.getSearchMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, sourceArticle));
		}
		long dataCount = listViewDao.getCountForAssociationListView(listMetaData, sourceMetaData, articleName, idValue, getSearchCriteria(searchMeta, uriInfo.getQueryParameters()));
		
		return Long.toString(dataCount);
	}
	
	@GET @Path("data/listviewassociation/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getListViewAssociationListDataResponse(@PathParam("articleName") String articleName, @Context UriInfo uriInfo,
			@QueryParam("page") Integer pageIndex, @QueryParam("pageSize") Integer pageSize) {
		MultivaluedMap<String, String> parameter = uriInfo.getQueryParameters();
		String sourceArticle = parameter.getFirst("sourceArticle");
		ListViewMetaData listMetaData = uiConfiguration.getListViewMeta(articleName);
		if (listMetaData == null) {
			listMetaData = uiConfiguration.getListViewMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, sourceArticle));
			if (listMetaData == null) {
				throw new NullPointerException("No list view configured for " + articleName);
			}
		}
		ListViewMetaData sourceMetaData = uiConfiguration.getListViewMeta(sourceArticle);
		String idValue = parameter.getFirst("idValue");		
		try {
			idValue = URLDecoder.decode(idValue, "UTF-8");
		} catch (UnsupportedEncodingException e) {	
			logger.error(e.getMessage(),e);
		}
				
		//default the page index and page size if required...
		//if the passed page index is invalid then make it -1 so that it is ignored
		if ((pageIndex == null) || (pageIndex < 1)) {
			pageIndex = -1;
			//if page size is also not given then set a negative value to ensure that is also ignored
			if ((pageSize == null) || (pageSize < 0)) {
				pageSize = -1;
			}
		} else {
			//if page index is given and page size is not then take a default page size
			if ((pageSize == null) || (pageSize < 0)) {
				pageSize = 10;
			}
		}
		//figure out the start index
		int startIndex = (pageIndex > 0)?((pageIndex - 1) * pageSize):-1;
		
		//code for searching..
		SearchMetaData searchMeta = uiConfiguration.getSearchMeta(articleName);
		if(searchMeta==null){
			searchMeta = uiConfiguration.getSearchMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, sourceArticle));
		}				
		//here we query for the data
		List<Object> persistedDataList = listViewDao.getAssociationDataForListView(listMetaData, sourceMetaData, articleName, idValue, 
				getSearchCriteria(searchMeta, uriInfo.getQueryParameters()), startIndex, pageSize);
		List<ListViewData> listDataList = createListViewDataList(persistedDataList, listMetaData);
				
		return JsonUtil.toJson(listDataList);
	}
	
	

	
	/**
	 * 
	 * @param articleName
	 * @param associationPropertyName
	 * @param purpose
	 * @return
	 */
	private ListViewMetaData findRelevantListMetaData(String articleName, String associationPropertyName, String purpose) {
		ListViewMetaData listMetaData = null;
		if (purpose.equals("edit")) {
			EditViewMetaData editViewMetaData = uiConfiguration.getEditViewMeta(articleName);
			// EditView should have a property with the name passed, we look for that here
			List<FieldMetaData> fields = editViewMetaData.getFields();
			for (FieldMetaData field : fields) {
				if (field.getName().equals(associationPropertyName)) {
					// if this is an association property then it should have an association list meta
					listMetaData = field.getAssociationListMeta();
				}
			}
		} else if (purpose.equals("search")) {
			SearchMetaData searchMetaData = uiConfiguration.getSearchMeta(articleName);
			// SearchView should have a property with the name passed, we look for that here
			List<ItemMetaData> fields = searchMetaData.getFields();
			for (ItemMetaData field : fields) {
				if (field.getName().equals(associationPropertyName)) {
					// if this is an association property then it should have an association list meta
					listMetaData = field.getAssociationListMeta();
				}
			}
		}
		return listMetaData;
	}
	
	/**
	 * 
	 * @param persistedObjects
	 * @param listMetaData
	 * @return
	 */
	private List<ListViewData> createListViewDataList(List<Object> persistedObjects, ListViewMetaData listMetaData) {
		//create a list of ListViewData here
		List<ListViewData> returnValues = new LinkedList<ListViewData>();
		for (Object record:persistedObjects) {
			//create a ListViewData for each array
			ListViewData listViewData = new ListViewData();
			returnValues.add(listViewData);
			//again if the id column is present then set the id column value
			if (listMetaData.getIdColumn() != null) {
				ColumnMetaData idColumnMetaData = listMetaData.getIdColumn();
				PropertyDescriptor columnPropertyDescriptor = idColumnMetaData.getPropertyDescriptor();
				Object data = ReflectionUtils.invokeMethod(columnPropertyDescriptor.getReadMethod(), record, (Object[])null);
				listViewData.addFieldData(idColumnMetaData.getName(), data);
			}
			//here we iterate over the properties
			Iterator<ColumnMetaData> columnItr = listMetaData.getColumns().iterator();
			while (columnItr.hasNext()) {
				ColumnMetaData columnMetaData = columnItr.next();
				String propertyName = columnMetaData.getName();
				//reflectively fetch the values from the objects returned by hibernate
				PropertyDescriptor columnPropertyDescriptor = columnMetaData.getPropertyDescriptor();
				Object data = ReflectionUtils.invokeMethod(columnPropertyDescriptor.getReadMethod(), record, (Object[])null);
				//if this is a reference then the data is another persisted object
				if (DataType.REFERENCE.name().equals(columnMetaData.getDataType()) && (data != null)) {
					//if the reference object has list view configured then try to 
					//retrieve a relevant field value to show as hyperlink
					ListViewMetaData referenceListMetaData = uiConfiguration.getListViewMeta(data.getClass().getName());
					Object referenceFieldData = getReferencePropertyValue(data, columnMetaData, referenceListMetaData);
					if (referenceFieldData != null) {
						listViewData.addFieldData(propertyName, referenceFieldData);
					}else { 
						listViewData.addFieldData(propertyName, "");
					}
				} else if (DataType.ENUMERATION.name().equals(columnMetaData.getDataType()) && (data != null)) {
					listViewData.addFieldData(propertyName, I18NUtil.getMessage(columnMetaData.getDisplayKey()+"."+data.toString(),null,data.toString()));
				} else {
					listViewData.addFieldData(propertyName, data);
				}
			}
		}
		return returnValues;
	}
	
	private Object getReferencePropertyValue(Object referenceObject, ColumnMetaData referenceColumn, ListViewMetaData referenceListMetaData) {
		if (referenceObject != null) {
			//get a field value from the related object. Getting the value has this fallback mechanism:
			//1. Find the value of the configured property
			//2. If no property is configured then search for a property called name
			//3. If there is no property called name then use the id property
			//4. If there is no id, then call toString - can this be handles at all??
			String referenceProperty = referenceColumn.getReferenceProperty();
			PropertyDescriptor referencePropertyDescriptor = null;
			if (StringUtils.isNotBlank(referenceProperty)) {
				referencePropertyDescriptor = referenceColumn.getReferencePropertyDescriptor();
			} else {
				referencePropertyDescriptor = referenceColumn.referenceProperty("name").getReferencePropertyDescriptor();
				if ((referencePropertyDescriptor == null) && (referenceListMetaData != null)) {
					referenceColumn.referenceProperty(null);
					if (referenceListMetaData.getIdColumn() != null) {
						referencePropertyDescriptor = referenceListMetaData.getIdColumn().getPropertyDescriptor();
					}
				}
			}
			if (referencePropertyDescriptor != null) {
				Object data = ReflectionUtils.invokeMethod(referencePropertyDescriptor.getReadMethod(), referenceObject, (Object[])null);
				return data;
			}
		}
		return null;
	}
}
