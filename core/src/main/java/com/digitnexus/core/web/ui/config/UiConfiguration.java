/**
 * 
 */
package com.digitnexus.core.web.ui.config;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import javax.validation.metadata.BeanDescriptor;
import javax.validation.metadata.ConstraintDescriptor;
import javax.validation.metadata.PropertyDescriptor;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.Predicate;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.hibernate.MappingException;
import org.hibernate.SessionFactory;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.type.Type;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.URL;
import org.hibernate.validator.constraints.Range;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.data.annotation.Persistent;
import org.springframework.data.mongodb.core.mapping.BasicMongoPersistentEntity;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.stereotype.Component;

import com.digitnexus.core.domain.FlexFieldsDataObject;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.entity.EntityConfigurationService;
import com.digitnexus.core.event.AbstractContextRefreshListener;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.nosql.annotation.FileStoreDocument;
import com.digitnexus.core.search.SearchCriteria;
import com.digitnexus.core.search.service.SearchCriteriaService;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.util.SimpleNameValue;
import com.digitnexus.core.web.ui.config.annotation.Attachment;
import com.digitnexus.core.web.ui.config.annotation.AttachmentType;
import com.digitnexus.core.web.ui.config.annotation.Compare;
import com.digitnexus.core.web.ui.config.annotation.Uom;
import com.digitnexus.core.web.ui.config.annotation.Alphanumeric;

import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.FieldGroup;
import com.digitnexus.core.web.ui.config.annotation.FieldGroupType;
import com.digitnexus.core.web.ui.config.annotation.FlexField;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldConfig;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldConfig.FlexConfigList;
import com.digitnexus.core.web.ui.config.annotation.FlexFieldDescriminator;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.OrderBy;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;
import com.digitnexus.core.web.ui.config.annotation.View;
import com.digitnexus.core.web.ui.config.dataobject.ColumnMetaData;
import com.digitnexus.core.web.ui.config.dataobject.CompareMeta;
import com.digitnexus.core.web.ui.config.dataobject.DataSourceType;
import com.digitnexus.core.web.ui.config.dataobject.FieldGroupMeta;
import com.digitnexus.core.web.ui.config.dataobject.UomMeta;
import com.digitnexus.core.web.ui.config.dataobject.AlphanumericMeta;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FlexFieldConfigMeta;
import com.digitnexus.core.web.ui.config.dataobject.ItemMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.OrderByMeta;
import com.digitnexus.core.web.ui.config.dataobject.SearchCriteriaMeta;
import com.digitnexus.core.web.ui.config.dataobject.SearchMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ValidationConstrainNames;

/**
 * @author Santanu
 */
@Component
public class UiConfiguration extends AbstractContextRefreshListener{

	private final Logger	logger	= LoggerFactory.getLogger(getClass()); 
	
	//this session factory is going to give us the persistent entities 
	private SessionFactory sessionFactory;
	//also the mongo mapping context, this also gives the persistent entities in mongo
	private MongoMappingContext mongoMappingContext;
	
	//this cache will contain the ListVewMetaData against the entity name
	private Map<String, ListViewMetaData> listViewMetaCache = new LinkedHashMap<String, ListViewMetaData>();
	
	private Map<String, ListViewMetaData> associationListViewMetaCache = new LinkedHashMap<String, ListViewMetaData>();
	
	private Map<String, EditViewMetaData> editViewMetaCache = new LinkedHashMap<String, EditViewMetaData>();
	
	private Map<String, SearchMetaData> searchMetaCache = new LinkedHashMap<String, SearchMetaData>();
	
	@Autowired
	private Validator validator;
	
	@Autowired
	private EntityConfigurationService entityConfigurationService;
	
	@Autowired
	private SearchCriteriaService searchCriteriaService;  
	
	@Override
	public void onApplicationEvent(ApplicationEvent event){
		Map<String, ClassMetadata> entityClassMetaMap = sessionFactory.getAllClassMetadata();
		Collection<ClassMetadata> entityClassMetaSet = entityClassMetaMap.values();
		
		createListViewMetaFromHibernateMapping(entityClassMetaSet);
		createEditViewMetaFromHibernateMapping(entityClassMetaSet);
		createSearchMetaFromHibernateMapping(entityClassMetaSet);

		//mongo mapping context may not be available all the time, so take guard
		if (mongoMappingContext != null) {
			Collection<BasicMongoPersistentEntity<?>> mongoMappedClasses = mongoMappingContext.getPersistentEntities();
			
			createListViewMetaFromMongoMapping(mongoMappedClasses);
			createEditViewMetaFromMongoMapping(mongoMappedClasses);
			createSearchMetaFromMongoMapping(mongoMappedClasses);
		}
	}

	/**
	 * @param entityClassMetaSet
	 */
	private void createListViewMetaFromHibernateMapping(Collection<ClassMetadata> entityClassMetaSet) {
		for (ClassMetadata entityClassMeta:entityClassMetaSet) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheListViewMetaData(entityMetaData);
		}
	}

	private void createListViewMetaFromMongoMapping(Collection<BasicMongoPersistentEntity<?>> mongoMappedClasses) {
		for (@SuppressWarnings("rawtypes") BasicMongoPersistentEntity entityClassMeta:mongoMappedClasses) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheListViewMetaData(entityMetaData);
		}		
	}

	/**
	 * @param entityMetaData
	 */
	private void createAndCacheListViewMetaData(EntityMetaData entityMetaData) {
		if (hasViewAnnotation(entityMetaData.getEntityClass())) {
			ListViewMetaData listViewMeta = createListViewMetaData(entityMetaData);
			if (listViewMeta != null) {
				listViewMetaCache.put(entityMetaData.getEntityName(), listViewMeta);
			}
		}
	}
	
	/**
	 * @param entityClassMetaSet
	 */
	private void createSearchMetaFromHibernateMapping(Collection<ClassMetadata> entityClassMetaSet) {
		for (ClassMetadata entityClassMeta:entityClassMetaSet) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheSearchMetaData(entityMetaData);
		}
	}

	private void createSearchMetaFromMongoMapping(Collection<BasicMongoPersistentEntity<?>> mongoMappedClasses) {
		for (@SuppressWarnings("rawtypes") BasicMongoPersistentEntity entityClassMeta:mongoMappedClasses) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheSearchMetaData(entityMetaData);
		}
	}
	
	/**
	 * @param entityMetaData
	 */
	private void createAndCacheSearchMetaData(EntityMetaData entityMetaData) {
		if (listViewMetaCache.containsKey(entityMetaData.getEntityName())) {
			ListViewMetaData listViewMeta = listViewMetaCache.get(entityMetaData.getEntityName());
			//define the search cache for the one that has list view
			SearchMetaData searchMeta = createSearchMetaData(entityMetaData, listViewMeta);
			if(searchMeta != null){
				searchMetaCache.put(entityMetaData.getEntityName(), searchMeta);
			}
		}
	}
	
	/**
	 * @param entityClassMetaSet
	 */
	private void createEditViewMetaFromHibernateMapping(Collection<ClassMetadata> entityClassMetaSet) {
		for (ClassMetadata entityClassMeta:entityClassMetaSet) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheEditViewMetaData(entityMetaData);
		}
	}

	private void createEditViewMetaFromMongoMapping(Collection<BasicMongoPersistentEntity<?>> mongoMappedClasses) {
		for (@SuppressWarnings("rawtypes") BasicMongoPersistentEntity entityClassMeta:mongoMappedClasses) {
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheEditViewMetaData(entityMetaData);
		}		
	}
	
	/**
	 * @param entityMetaData
	 */
	private void createAndCacheEditViewMetaData(EntityMetaData entityMetaData) {
		if (hasViewAnnotation(entityMetaData.getEntityClass())) {
			ListViewMetaData listViewMeta = listViewMetaCache.get(entityMetaData.getEntityName());
			EditViewMetaData editViewMeta = createEditViewMetaData(entityMetaData, listViewMeta);
			if (editViewMeta != null) {
				editViewMetaCache.put(entityMetaData.getEntityName(), editViewMeta);
			}
		}
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void createMetaDataFromMongoMappedClass(Class entityClass) {
		if ((entityClass.getAnnotation(Document.class) != null)
				|| (entityClass.getAnnotation(Persistent.class) != null)
				|| (entityClass.getAnnotation(FileStoreDocument.class) != null)) {
			BasicMongoPersistentEntity entityClassMeta = mongoMappingContext.getPersistentEntity(entityClass);
			EntityMetaData entityMetaData = new EntityMetaData(entityClassMeta);
			createAndCacheListViewMetaData(entityMetaData);
			createAndCacheSearchMetaData(entityMetaData);
			createAndCacheEditViewMetaData(entityMetaData);
		}
	}
	
	private <T> boolean hasViewAnnotation(Class<T> entityClass) {
		return entityClass.getAnnotation(View.class) != null;
	}
	
	/**
	 * 
	 * @param articleName
	 * @return
	 */
	public ListViewMetaData getListViewMeta(String articleName) {
		if (articleName.indexOf(".") < 0) {
			//this may just be the last part
			articleName = StringUtils.capitalize(articleName);
			//so possible last portion is..
			articleName = "." + articleName;
			//iterate over the keys and figure out the key
			Set<String> keys = listViewMetaCache.keySet();
			for (String key:keys) {
				if (key.endsWith(articleName)) {
					//clone the object before returning so that the 
					//returned object can be modified as required
					return cloneListViewMeta(getListViewMetaData(key));
				}
			}
		}
		//otherwise assume accurate entity name is passed 
		return cloneListViewMeta(getListViewMetaData(articleName));
	}
	
	/**
	 * Loads the {@link ListViewMetaData} from the cache if available. Else try to
	 * create and entry.
	 *  
	 * @param articleName
	 * @return
	 */
	private ListViewMetaData getListViewMetaData(String articleName) {
		ListViewMetaData listViewMetaData = listViewMetaCache.get(articleName);
		if (listViewMetaData == null) {
			try {
				@SuppressWarnings("rawtypes")
				Class entityClass = Class.forName(articleName);
				//mongo mapped class may be lazily found out, so pre-loading will not
				//work for such classes. so we have this case only for mongo mapped classes
				createMetaDataFromMongoMappedClass(entityClass);
				listViewMetaData = listViewMetaCache.get(articleName);
			} catch (ClassNotFoundException ignored) {
				//this should never happen..but if it happens its not our headache
				//let somebody who came up with this class name have the trouble
				logger.warn("Could not find class " + articleName, ignored);
			}
		}
		return listViewMetaData;
	}

	private ListViewMetaData cloneListViewMeta(ListViewMetaData actualMetaObject) {
		if (actualMetaObject == null) {
			return null;
		}
		
		ListViewMetaData listViewMetaData=new ListViewMetaData(actualMetaObject);
		setListViewPermissions(listViewMetaData);
		return listViewMetaData;
	}
	
	private void setListViewPermissions(ListViewMetaData listViewMetaData) {
		String className=listViewMetaData.getEntityClass().getName();
		if(SecurityUtil.isPermissionDefined(className, UserOperation.CREATE)){
			listViewMetaData.setCreatePermission(SecurityUtil.hasPermission(UserOperation.CREATE, className));
		}

		if(SecurityUtil.isPermissionDefined(className, UserOperation.EDIT)){
			listViewMetaData.setEditPermission(SecurityUtil.hasPermission(UserOperation.EDIT, className));
		}
		
		if(SecurityUtil.isPermissionDefined(className, UserOperation.DELETE)){
			listViewMetaData.setDeletePermission(SecurityUtil.hasPermission(UserOperation.DELETE, className));
		}
		
		
	}

	/**
	 * 
	 * @param groupName
	 * @return
	 */
	public List<ListViewMetaData> getListViewMetaForGroup(String groupName) {
		List<ListViewMetaData> listViewMetaInGroup = new ArrayList<ListViewMetaData>();
		//finds the list views belonging to the group
		Collection<ListViewMetaData> listViews = listViewMetaCache.values();
		for (ListViewMetaData listView:listViews) {
			if (listView.getGroup().equals(groupName)) {
				//here again we clone the record to that any manipulation
				//does not disturb the actual configuration
				listViewMetaInGroup.add(new ListViewMetaData(listView));
			}
		}
		
		return listViewMetaInGroup;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private ListViewMetaData createListViewMetaData(EntityMetaData classMetaData) {
		Class entityClass = classMetaData.getEntityClass();
		View listViewAnnotation = (View) entityClass.getAnnotation(View.class);
		if (listViewAnnotation != null) {
			boolean hasAssociationProperty = false;
			
			ListViewMetaData listViewMeta = new ListViewMetaData(classMetaData.getEntityName(), entityClass,
					listViewAnnotation.displayKey(), listViewAnnotation.group());
			listViewMeta.setDataSourceType(classMetaData.getDataSourceType());
			listViewMeta.setCreateFromParent(listViewAnnotation.createFromParent());
			listViewMeta.setReadOnly(listViewAnnotation.readOnly());
			
			//Add order by
			OrderBy[] orderByColumns=listViewAnnotation.orderBy();
			if(orderByColumns!=null && orderByColumns.length>0){
				List<OrderByMeta> orderMeta=new ArrayList<OrderByMeta>(orderByColumns.length);
				for(int i=0;i<orderByColumns.length;i++){
					OrderBy orderByColumn=orderByColumns[i];
					orderMeta.add(new OrderByMeta(orderByColumn.name(), orderByColumn.ascending()));
				}
				listViewMeta.setOrderByMeta(orderMeta);
			}
			
			
			//set the primary key. as per the documentation, this can be null
			String idPropertyName = classMetaData.getIdentifierPropertyName();
			if (idPropertyName != null) {
				//if the id property name is not null then we should try to 
				//keep track of the primary key as well, that will make life a lot easy
				DataType idPropertyType = DataType.dataTypeForJavaType(classMetaData.getIdentifierPropertyType());
				ColumnMetaData  idColumnMeta = new ColumnMetaData()
												.entityClass(entityClass)
												.propertyJavaType(classMetaData.getIdentifierPropertyType())
												.name(idPropertyName)
												.dataType(idPropertyType.name());
				listViewMeta.setIdColumn(idColumnMeta);
			}
			
			Method[] methods = entityClass.getMethods();
			for (Method method:methods) {
				ListViewColumn listViewColumnAnnotation = method.getAnnotation(ListViewColumn.class);
				if (listViewColumnAnnotation != null) {
					String displayName = listViewColumnAnnotation.displayKey();
					String propertyName = getPropertyName(method.getName());
					DataType dataType = guessDataType(listViewColumnAnnotation.dataType(), method);
					DisplayType displayType = guessDisplayTypeForListView(listViewColumnAnnotation.display(), dataType);
					LinkedHashMap<String, String> imageMap = extractImageMap(displayType, listViewColumnAnnotation.imageMap());
					ColumnMetaData  columnMeta = new ColumnMetaData()
														.entityClass(entityClass)
														.propertyJavaType(determineFieldType(method))
														.name(propertyName)
														.displayKey(displayName)
														.sizePercentage(listViewColumnAnnotation.widthPercentage())
														.order(listViewColumnAnnotation.order())
														.hidden(listViewColumnAnnotation.hidden())
														.sortable(listViewColumnAnnotation.sortable())
														.dataType(dataType.name())
														.displayType(displayType.name())
														.imageMap(imageMap)
														.referenceProperty(listViewColumnAnnotation.referenceProperty())
														.associatedListProperty(listViewColumnAnnotation.associationListProperty());
					listViewMeta.addColumn(columnMeta);
					hasAssociationProperty = (hasAssociationProperty || columnMeta.isAssociatedListProperty());
					
					//Add flex field descriminator property
					addDescriminatorProperty(listViewMeta, method);
				}
			}
			ListViewMetaData associationListViewMeta = null;
			if (hasAssociationProperty) {
				associationListViewMeta = new ListViewMetaData(listViewMeta);
				List<ColumnMetaData> columns = associationListViewMeta.getColumns();
				for (Iterator<ColumnMetaData> columnItr = columns.iterator(); columnItr.hasNext();) {
					if (!columnItr.next().isAssociatedListProperty()) {
						columnItr.remove();
					}
				}
				Collections.sort(associationListViewMeta.getColumns());
				adjustColumnWidths(associationListViewMeta.getColumns());
				//we go against the structure here and cache it here. this is called code to convenience!!
				associationListViewMetaCache.put(classMetaData.getEntityName(), associationListViewMeta);
			}
			
			Collections.sort(listViewMeta.getColumns());
			//here we adjust column width this is to ensure most accurate width percentage
			adjustColumnWidths(listViewMeta.getColumns());
			
			//Add search meta
			addSearchMeta(listViewMeta);
					
			return listViewMeta;
		}
		return null;
	}

	private void addDescriminatorProperty(ListViewMetaData listViewMeta, Method method) {
		FlexFieldDescriminator flexFieldDescriminator=method.getAnnotation(FlexFieldDescriminator.class);
		if(flexFieldDescriminator!=null){
			if(StringUtils.isNotEmpty(listViewMeta.getFlexConfigDescriminatorProperty())){
				throw new IllegalStateException("Entity, "+listViewMeta.getEntityClass().getName()+" contains more than one descriminator properties");
			}
			listViewMeta.setFlexConfigDescriminatorProperty(getPropertyName(method.getName()));
		}
	}
	
	private void addSearchMeta(ListViewMetaData listViewMeta) {
		List<SearchCriteria> searchCriteriaList=searchCriteriaService.getByEntityName(listViewMeta.getEntityClass().getName());
		if(!searchCriteriaList.isEmpty()){
			List<SearchCriteriaMeta> searchMetaDataList=new ArrayList<SearchCriteriaMeta>(searchCriteriaList.size());
			boolean showSearchCriteria=false;
			
			for(SearchCriteria searchCriteria:searchCriteriaList){
				searchMetaDataList.add(new SearchCriteriaMeta(searchCriteria));
				
				if(!showSearchCriteria && searchCriteria.isVisible()){
					showSearchCriteria=true;
					listViewMeta.setShowSearchCriteria(true);
				}
			}
			
			listViewMeta.setSearchCriteriaMetas(searchMetaDataList);		
		}
		
	}

	/**
	 * Adjusts the column width to ensure the total width is 100% and ratio is maintained
	 * 
	 * @param columns
	 */
	private void adjustColumnWidths(List<ColumnMetaData> columns) {
		int totalSize = 0;
		int columnSize = columns.size() == 0 ? 1 : columns.size();
		//precalculate a default width percent
		int defaultWidthPercent = 100 / columnSize;
		//iterate over the columns and calculate the column width
		for (ColumnMetaData  columnMeta:columns) {
			if (columnMeta.getSizePercentAsInt() > 0) {
				totalSize += columnMeta.getSizePercentAsInt();
			} else {
				//else assume the default size to be the total size
				totalSize += defaultWidthPercent;
				//also set the value...
				columnMeta.sizePercentage(defaultWidthPercent);
			}
		}
		//the total size should be 100, if not then adjust all the widths
		if (totalSize != 100) {
			//how much is it going away from 100!
			double deviationRatio = 100.0 / totalSize;
			//new value for for the total size
			totalSize = 0;
			double actualDeviation = 0;
			for (ColumnMetaData  columnMeta:columns) {
				int actualSize = columnMeta.getSizePercentAsInt();
				//calculate the new value
				double calculatedSize = actualSize * deviationRatio;
				//new size has to be integer
				int newSize = (int)Math.round(calculatedSize);
				//also keep the deviation
				actualDeviation += (calculatedSize - newSize);
				if (actualDeviation >= 1) {
					newSize += 1;
					actualDeviation -= 1;
				} else if (actualDeviation <= -1) {
					newSize -= 1;
					actualDeviation += 1;
				}
				columnMeta.sizePercentage(newSize);
				totalSize += newSize;
			}
			//at the end if this is still not 100 then use brute force to make it 100
			if (totalSize != 100 && !columns.isEmpty()) {
				ColumnMetaData firstColumn = columns.get(0);
				firstColumn.sizePercentage(firstColumn.getSizePercentAsInt() + (100 - totalSize));
			}
		}
	}

	/**
	 * Guess the data type based on the get/set method passed, if the passed data type 
	 * is undefined
	 * @param configuredDataType
	 * @param getterOrSetter
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private DataType guessDataType(DataType configuredDataType, Method getterOrSetter) {
		if(getterOrSetter==null){
			return configuredDataType;
		}
		
		if (DataType.UNDEFINED.equals(configuredDataType)) {
			Class fieldType = determineFieldType(getterOrSetter);
			configuredDataType = DataType.dataTypeForJavaType(fieldType);
			if (DataType.UNDEFINED.equals(configuredDataType)) {
				//so this is not a simple type. this must be a reference then
				configuredDataType = DataType.REFERENCE;
			}
		}
		return configuredDataType;
	}
	
	@SuppressWarnings("rawtypes")
	private Class determineFieldType(Method getterOrSetter) {
		Class fieldType = null;
		if (getterOrSetter.getName().startsWith("set")) {
			//this is for setter. need to check the only passed parameter
			Class[] parameterTypes = getterOrSetter.getParameterTypes();
			//this array should have only one entry
			if (parameterTypes.length == 1) {
				fieldType = parameterTypes[0];
			} else {
				//log an warning saying that the method is neither a setter nor a getter
			}
		} else {
			//this is for getter. so return type is the field type
			fieldType = getterOrSetter.getReturnType();
		}
		
		if (Collection.class.isAssignableFrom(fieldType)) {
			//Find the actual class
			java.lang.reflect.Type genericReturnType = getterOrSetter.getGenericReturnType();
			if (genericReturnType instanceof ParameterizedType) {
				ParameterizedType type = (ParameterizedType) genericReturnType;
				java.lang.reflect.Type[] typeArguments = type.getActualTypeArguments();
				fieldType = (Class) typeArguments[0];
			}

		}
		return fieldType;
	}
	
	/**
	 * Guesses the display type based on the data type only if the passed display type 
	 * is undefined
	 * 
	 * @param displayType
	 * @param dataType
	 * @return
	 */
	private DisplayType guessDisplayTypeForListView(DisplayType displayType, DataType dataType) {
		if (DisplayType.UNDEFINED.equals(displayType)) {
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case STRING:
			case DATE:
			case DATETIME:
			case CLOB: //should not be present in list
			case ENUMERATION:
				displayType = DisplayType.TEXTFIELD;
				break;
			case BOOLEAN:
				displayType = DisplayType.CHECKBOX;
				break;
			case REFERENCE:
				displayType = DisplayType.URL;
				break;
			case IMAGE:
			case BLOB:
				displayType = DisplayType.ICON;
				break;
			default:
				//should not come here at all
				displayType = DisplayType.TEXTFIELD;
				break;	
			}
		} else {
			//validate and ensure correct display type is used for a data type
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case DATE:
			case DATETIME:
			case CLOB: //should not be present in list
				if (!DisplayType.TEXTFIELD.equals(displayType)) {
					//the display type does not match the data type. so the display type 
					//will be ignored and the default display type will be used instead
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.TEXTFIELD;
				}
				break;
			case STRING:
                if(DisplayType.POINT.equals(displayType)||DisplayType.POLYGON.equals(displayType)||DisplayType.POLYLINE.equals(displayType)||DisplayType.COLOR.equals(displayType)){
					
				}else  	
				// add the image the display type to support pop display image in the list view..
				if (!(DisplayType.TEXTFIELD.equals(displayType) || DisplayType.ICON.equals(displayType) || DisplayType.IMAGE.equals(displayType))) {
					//the display type does not match the data type. so the display type 
					//will be ignored and the default display type will be used instead
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.TEXTFIELD;
				}
				break;
			case ENUMERATION:
				if (!DisplayType.TEXTFIELD.equals(displayType) || !DisplayType.SELECT.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.TEXTFIELD;
				}
				break;
			case BOOLEAN:
				if (!(DisplayType.CHECKBOX.equals(displayType) 
						|| DisplayType.SELECT.equals(displayType)
						|| DisplayType.RADIO.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.CHECKBOX;
				}
				break;
			case REFERENCE:
				if (!(DisplayType.TEXTFIELD.equals(displayType) || DisplayType.URL.equals(displayType)|| DisplayType.POPUP.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.URL;
				}
				break;
			case IMAGE:
			case BLOB:
				//may need to support text field and url for these two cases
				if (!DisplayType.ICON.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.ICON;
				}
				break;
			}
		}
		return displayType;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private EditViewMetaData createEditViewMetaData(EntityMetaData entityClassMeta, ListViewMetaData listViewMeta) {
		Class entityClass = entityClassMeta.getEntityClass();
		View viewAnnotation = (View) entityClass.getAnnotation(View.class);

		EditViewMetaData editViewMeta = new EditViewMetaData(entityClassMeta.getEntityName(), entityClass, 
				(listViewMeta != null) ? listViewMeta.getDisplayKey() : "");
		editViewMeta.setDataSourceType(entityClassMeta.getDataSourceType());
		editViewMeta.setColumnLayout(viewAnnotation.layoutColumns());
		editViewMeta.setComments(viewAnnotation.comments());
		editViewMeta.setReadOnly(viewAnnotation.readOnly());
		
		boolean checkForFlexConfig = false;
		if (listViewMeta != null) {
			String flexConfigDescriminatorProperty = listViewMeta.getFlexConfigDescriminatorProperty();
			checkForFlexConfig = StringUtils.isNotEmpty(flexConfigDescriminatorProperty);
			if (checkForFlexConfig) {
				editViewMeta.setFlexConfigDescriminatorProperty(flexConfigDescriminatorProperty);
			}
		}
		// To get validation info
		BeanDescriptor beanDescriptor = validator.getConstraintsForClass(entityClass);

		// set the primary key. as per the documentation, this can be null
		String idPropertyName = entityClassMeta.getIdentifierPropertyName();
		if (idPropertyName != null) {
			// if the id property name is not null then we should try to
			// keep track of the primary key as well, that will make life a lot
			// easy
			DataType idPropertyType = DataType.dataTypeForJavaType(entityClassMeta.getIdentifierPropertyType());

			FieldMetaData idFieldMeta = new FieldMetaData().entityClass(entityClass).name(idPropertyName).dataType(idPropertyType.name())
					.hidden(true).readOnly(true).order(-1).length(-1).updatable(false);

			editViewMeta.setIdField(idFieldMeta);
		}

		Method[] methods = entityClass.getMethods();

		FlexConfigList flexConfigList = (FlexConfigList) entityClass.getAnnotation(FlexConfigList.class);

		// To find if a property is updatable
		//Any direct hibernate dependency has to be removed with urgency 
		PersistentClass persistentClass = entityConfigurationService.getPersistentClassByEntityTypeName(entityClass.getName());
		
		List<FieldGroupMeta> fieldGroupMetas  = new ArrayList<FieldGroupMeta>();
		List<FieldMetaData> baseFieldGroup = new ArrayList<FieldMetaData>();
		for (Method method : methods) {
			EditViewField editViewFieldAnnotation = method.getAnnotation(EditViewField.class);
			if (editViewFieldAnnotation != null) {

				DataType dataType = guessDataType(editViewFieldAnnotation.dataType(), method);
				if (ArrayUtils.isNotEmpty(editViewFieldAnnotation.values())) {
					dataType = DataType.ENUMERATION;
				}

				String propertyName = getPropertyName(method.getName());
				FieldMetaData editViewField = getField(entityClass, editViewFieldAnnotation, determineFieldType(method), dataType,
						propertyName);

				if (persistentClass!= null) {
					// Set updatable property
					try {
						editViewField.updatable(persistentClass.getProperty(propertyName).isUpdateable());
					} catch (MappingException mappingException) {
						// Use annotation value. It is updatable only if readOnly is
						// false and updatable is true
						editViewField.updatable(editViewFieldAnnotation.updatable());
					}
				} else {
					// Use annotation value. It is updatable only if readOnly is
					// false and updatable is true
					editViewField.updatable(editViewFieldAnnotation.updatable());
				}
				// Add validation related properties
				addValidationProperties(editViewField, beanDescriptor);
				
				//add the fieldGroup some informations
				FieldGroup fieldGroup = editViewFieldAnnotation.fieldGroup();
				if(!(StringUtils.isEmpty(fieldGroup.name()) && fieldGroup.hidden()==false && fieldGroup.order() == -1 && fieldGroup.type().name() == FieldGroupType.UNDEFINED.name())){
					FieldGroupMeta fieldGroupMeta = new FieldGroupMeta(fieldGroup.name(), fieldGroup.hidden(), fieldGroup.order(),fieldGroup.type().name());
					if(!fieldGroupMetas.contains(fieldGroupMeta)){
						fieldGroupMetas.add(fieldGroupMeta);
					}
				}
				
				Compare compareAnnotation = method.getAnnotation(Compare.class);
				if(compareAnnotation!=null){
					CompareMeta compareMeta = new CompareMeta(compareAnnotation.type(),compareAnnotation.targets());
					editViewField.compare(compareMeta);
				}	
				
				Uom uomAnnotation = method.getAnnotation(Uom.class);
				if(uomAnnotation!=null){
					UomMeta uomMeta = new UomMeta(uomAnnotation.name());
					editViewField.uom(uomMeta);
				}	
				
				Alphanumeric AlphanumericAnnotation = method.getAnnotation(Alphanumeric.class);
				if(AlphanumericAnnotation!=null){
					AlphanumericMeta alphanumericMeta = new AlphanumericMeta(AlphanumericAnnotation.name());
					editViewField.alphanumeric(alphanumericMeta);
				}
				

				if (propertyName.equals(idPropertyName)) {
					editViewField.updatable(false);
					editViewMeta.setIdField(editViewField);
				}

				editViewMeta.addField(editViewField);

				setReferenceProperty(entityClassMeta.getEntityName(), editViewField);

				if (StringUtils.isNotEmpty(editViewFieldAnnotation.searchCriteriaName())) {
					editViewField.associationSearchCriteriaId(searchCriteriaService
							.getSearchCriteria(editViewField.getAssociationListMeta().getEntityClass().getName(),
									editViewFieldAnnotation.searchCriteriaName()).getId());
				}

				if (checkForFlexConfig) {
					FlexConfigList currentFlexConfigList = method.getAnnotation(FlexConfigList.class);
					if(currentFlexConfigList != null){
						if (StringUtils.isNotEmpty(editViewMeta.getFlexFieldsProperty())) {
							throw new IllegalStateException("More than one flex fields configuration exists for entity,"
									+ entityClass.getName());
						}
						flexConfigList = currentFlexConfigList;
						editViewMeta.setFlexFieldsProperty(getPropertyName(method.getName()));
					}
				}
				if(StringUtils.isEmpty(editViewField.getFieldGroupName())){
					baseFieldGroup.add(editViewField);
				}
			}
		}
		if(baseFieldGroup.size()>0&&fieldGroupMetas.size()>0){
			convertFieldGroupTypeAndAddBaseFieldGroupMeta(fieldGroupMetas,baseFieldGroup);
		}
		Collections.sort(fieldGroupMetas);
		editViewMeta.setFieldGroupMetas(fieldGroupMetas);
		
		//loop it for the second time for attachments. this is done is a different
		//loop in order to keep the logic simple.
		
		//as it is in a different loop we also may need to look at the already
		//configured edit view fields for some information
		extractAttachmentsMeta(editViewMeta, methods);
		
		//PT-249
		addVersionControlProperty(editViewMeta);
		
		
		
		Collections.sort(editViewMeta.getFields());

		if (checkForFlexConfig) {
			processFlexConfig(editViewMeta, flexConfigList);
		}
		return editViewMeta;
	}

	private void convertFieldGroupTypeAndAddBaseFieldGroupMeta(List<FieldGroupMeta> fieldGroupMetas,List<FieldMetaData> baseFieldGroup){
		List<FieldGroupMeta> list = new ArrayList<FieldGroupMeta>();
		//here is convert the file Group Type by each FieldGroupType item percentage
		FieldGroupType mainType  = null;
		FieldGroupType[] fieldGTArray = FieldGroupType.values();
		List<SimpleNameValue> simpleList = new ArrayList<SimpleNameValue>(fieldGTArray.length-1);
		for(int j = 0; j < fieldGTArray.length; j++){
			if(!(fieldGTArray[j]==FieldGroupType.UNDEFINED)){
				int count = 0;
				for(FieldGroupMeta fieldGroupMeta : fieldGroupMetas){
					if(fieldGroupMeta.getFieldGroupType()==fieldGTArray[j].name()){
						count++;
					}
				}
				simpleList.add(new SimpleNameValue(fieldGTArray[j],count));
			}
		}
		if(simpleList.size()>0){
			int max = 0, index = 0;
			for(SimpleNameValue snv : simpleList){
				if(max<(Integer)snv.getValue()){
					max = (Integer)snv.getValue();
					index = simpleList.indexOf(snv);
				}else{
					continue;
				}
			}
			mainType = (FieldGroupType)simpleList.get(index).getName();
		}else{
			mainType = fieldGTArray[0];
		}
		for(FieldGroupMeta fieldGroupMeta : fieldGroupMetas){
			FieldGroupMeta fgm = new FieldGroupMeta(fieldGroupMeta.getName(),fieldGroupMeta.isHidden(),fieldGroupMeta.getOrder(),mainType.name());
			//here is must be remove Duplicate object
			if(!list.contains(fgm)){
				list.add(fgm);	
			}
		}
		fieldGroupMetas.clear();
		fieldGroupMetas.addAll(list);
		//here is add base field group meta data
		FieldGroupMeta fieldGroupMeta = new FieldGroupMeta("BaseInformation", false, 0, mainType.name());
		if(!fieldGroupMetas.contains(fieldGroupMeta)){
			fieldGroupMetas.add(fieldGroupMeta);
			for(FieldMetaData fieldMetaData : baseFieldGroup){
				fieldMetaData.fieldGroupName(fieldGroupMeta.getName());
			}
		}
	}
	
	private void addVersionControlProperty(EditViewMetaData editViewMeta) {
		//Get version control property from hibernate meta data and add it as a hiddent field
		ClassMetadata classMetadata=sessionFactory.getClassMetadata(editViewMeta.getEntityClass());
		if(classMetadata!=null && classMetadata.isVersioned()){
			int versionPropertyIndex=classMetadata.getVersionProperty();
			String propertyName=classMetadata.getPropertyNames()[versionPropertyIndex];
			Type type=classMetadata.getPropertyType(propertyName);
			DataType dataType=DataType.valueOf(type.getName().toUpperCase());
			
			FieldMetaData fieldMetaData=new FieldMetaData()
			.entityClass(editViewMeta.getEntityClass())
			.propertyJavaType(DataType.javaTypeForDataType(dataType))
			.hidden(true)
			.order(1000)
			.dataType(dataType.name())
			.displayType(DisplayType.TEXTFIELD.name())
			//name creates the property descriptor so this is done as the last step
			.name(propertyName);
			editViewMeta.addField(fieldMetaData);
			//Set version property. This will be used for checking staleness during update
			editViewMeta.setVersionProperty(fieldMetaData);
		}
		
		
	}

	private void extractAttachmentsMeta(EditViewMetaData editViewMeta, Method[] methods) {
		List<FieldMetaData> fieldMetaDataList = editViewMeta.getFields();
		Class<?> entityClass=editViewMeta.getEntityClass();
		
		for (Method method:methods) {
			Attachment attachmentAnnotation = method.getAnnotation(Attachment.class);
			if (attachmentAnnotation != null) {
				//Attachment types
				AttachmentType[] attachmentTypeAnnotationValues=attachmentAnnotation.type();
				String[] attachmentTypes=new String[attachmentTypeAnnotationValues.length];
				for(int i=0;i<attachmentTypeAnnotationValues.length;i++){
					attachmentTypes[i]=attachmentTypeAnnotationValues[i].toString();
				}
				
				Class<?> fieldType = determineFieldType(method);
				String attachementPropertyName = getPropertyName(method.getName());
				//we prepare a field meta data for the attachment field
				FieldMetaData attachmentFieldMetaData = null;
				//there can be a different field which holds the description of the attachments
				String descriptionField = attachmentAnnotation.descriptionField();
				//if there is one then we will modify that
				if (StringUtils.isNotBlank(descriptionField)) {
					//if this is an attachment field then the field type should be InputStream or Reader

					//then there should be a edit view field already configured for this
					//in case it is not done then we create a hidden edit view field
					//however that sounds a little unlikely
					for (FieldMetaData fieldMetaData:fieldMetaDataList) {
						if (fieldMetaData.getName().equals(descriptionField)) {
							attachmentFieldMetaData = fieldMetaData;
							break;
						}
					}
					//if field meta data does not exist then create a bare minimum field meta data
					//which is hidden. then it becomes somewhat useless for the UI, but we maintain that
					if (attachmentFieldMetaData == null) {
						attachmentFieldMetaData = new FieldMetaData()
							.entityClass(entityClass)
							.hidden(true)
							.readOnly(true) //to ensure that write method lookup does not fail
							.dataType(DataType.UNDEFINED.name())
							//name creates the property descriptor so this is done as the last step
							.name(descriptionField);
						
						editViewMeta.addField(attachmentFieldMetaData);
					}

					Method attachmentDescReadMethod = attachmentFieldMetaData.getPropertyDescriptor().getReadMethod();
					//this should be DataType.STRING
					DataType dataType = guessDataType(DataType.valueOf(attachmentFieldMetaData.getDataType()), attachmentDescReadMethod);
					//this should be String
					Class<?> descriptorFieldType = (attachmentFieldMetaData.getPropertyJavaType() == null)?determineFieldType(attachmentDescReadMethod):attachmentFieldMetaData.getPropertyJavaType();
					
					FieldMetaData rawAttachmentFieldMetaData = new FieldMetaData()
												.entityClass(entityClass)
												.propertyJavaType(fieldType)
												.hidden(attachmentFieldMetaData.isHidden())
												.readOnly(attachmentFieldMetaData.isReadOnly())
												.name(attachementPropertyName);
					
					attachmentFieldMetaData.propertyJavaType(descriptorFieldType)
										   .dataType(dataType.name())
										   .attachment(true)
										   .showAdd(attachmentAnnotation.showAdd())
										   .attachmentField(rawAttachmentFieldMetaData)
										   .attachmentType(attachmentTypes)
										   .allowMultipleAttachments(Collection.class.isAssignableFrom(method.getReturnType()));
					
				} else {
					String attachmentPropertyName = getPropertyName(method.getName());
					//again, there should be edit view field configured for this, if not we need to create a dummy one
					for (FieldMetaData fieldMetaData:fieldMetaDataList) {
						if (fieldMetaData.getName().equals(attachmentPropertyName)) {
							attachmentFieldMetaData = fieldMetaData;
							break;
						}
					}
					if (attachmentFieldMetaData == null) {
						DataType dataType = guessDataType(DataType.UNDEFINED, method);
						attachmentFieldMetaData = new FieldMetaData()
							.entityClass(entityClass)
							.hidden(true)
							.readOnly(true) //to ensure that write method lookup does not fail
							.dataType(dataType.name())
							.propertyJavaType(fieldType)
							//name creates the property descriptor so this is done as the last step
							.name(attachmentPropertyName);
						
						editViewMeta.addField(attachmentFieldMetaData);
					}
					
					attachmentFieldMetaData.attachment(true)
					                      .showAdd(attachmentAnnotation.showAdd())
										   .attachmentField(attachmentFieldMetaData)
										   .attachmentType(attachmentTypes)
										   .allowMultipleAttachments(Collection.class.isAssignableFrom(method.getReturnType()));
				}
				
			}
		}
	}
	
	private FieldMetaData getField(Class<?> entityClass,EditViewField editViewFieldAnnotation,Class<?> javaType,DataType dataType,String propertyName){
		
		DisplayType displayType = guessDisplayTypeForEditView(editViewFieldAnnotation.displayType(), dataType);
		LinkedHashMap<String, String> staticValues = extractStaticValues(displayType, editViewFieldAnnotation.values());
		
		if((staticValues==null || staticValues.isEmpty()) && DataType.ENUMERATION.equals(dataType)){
			staticValues=extractEnumValues(javaType);
			
		}
		LinkedHashMap<String, String> imageMap = extractImageMap(displayType, editViewFieldAnnotation.imageMap());
		
						
		return new FieldMetaData()
					.entityClass(entityClass)
					.propertyJavaType(javaType)
					.displayKey(editViewFieldAnnotation.displayKey())
					.readOnly(editViewFieldAnnotation.readOnly())
					.hidden(editViewFieldAnnotation.hidden())
					.order(editViewFieldAnnotation.order())
					.dataType(dataType.name())
					.displayType(displayType.name())
					.values(staticValues)
					.imageMap(imageMap)
					.referenceProperty(editViewFieldAnnotation.referenceProperty())
					//assumption entity name and class name are same. need to correct. TODO
					.associationListMeta(associationListViewMetaCache.get(javaType.getName()))
					//name creates the property descriptor so this is done as the last step
					.name(propertyName).fieldGroupName(editViewFieldAnnotation.fieldGroup().name())
					.editDisplay(editViewFieldAnnotation.editDisplay());
	}

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void processFlexConfig(EditViewMetaData editViewMeta, FlexConfigList flexConfigList) {
		Class entityClass=editViewMeta.getEntityClass();
		//We did not find the annotations in method
		if(flexConfigList==null){
			flexConfigList=(FlexConfigList) entityClass.getAnnotation(FlexConfigList.class);
			if(flexConfigList==null){
				throw new IllegalStateException("Entity, "+entityClass.getName()+" contains descriminator property but no flex field configuration");
			}else{
				//Set default flex field property
				editViewMeta.setFlexFieldsProperty(FlexFieldsDataObject.FLEXFIELDS_PROPERTY_NAME);
			}
		}
		
		
		
		FlexFieldConfig[] flexFieldConfigs=flexConfigList.value();
		for(FlexFieldConfig flexFieldConfig:flexFieldConfigs){
			addFlexFieldMeta(flexFieldConfig,editViewMeta);
		}
		
		//Finally add the base class to flex config metas, so that it need be handled separately in add
		editViewMeta.getFlexConfigMetas().add(new FlexFieldConfigMeta(editViewMeta.getName(), editViewMeta.getDisplayName(), null));
		
		Collections.sort(editViewMeta.getFlexConfigMetas());
	}
	
	

	@SuppressWarnings("rawtypes")
	private void addFlexFieldMeta(FlexFieldConfig flexFieldConfig, EditViewMetaData editViewMeta) {
		Class entityClass = editViewMeta.getEntityClass();
		// Used as base name for i18n and edit view cache key
		String className = entityClass.getName();
		String flexEditMetaName=className + "." + flexFieldConfig.name();
		EditViewMetaData flexEditViewMetaData = new EditViewMetaData(editViewMeta);
		flexEditViewMetaData.setDisplayKey(flexEditMetaName);
		flexEditViewMetaData.setName(flexEditMetaName);
		// Add field meta data
		for (FlexField flexField : flexFieldConfig.fields()) {
			EditViewField editViewField = flexField.editViewField();
			FieldMetaData fieldMetaData = getField(entityClass, editViewField, DataType.javaTypeForDataType(editViewField.dataType()),
					editViewField.dataType(), editViewMeta.getFlexFieldsProperty() + "." + flexField.name());
			fieldMetaData.setFlexField(true);
			
			flexEditViewMetaData.addField(fieldMetaData);
			
		}
		
		Collections.sort(flexEditViewMetaData.getFields());
		
		editViewMetaCache.put(flexEditMetaName, flexEditViewMetaData);
		editViewMeta.getFlexConfigMetas().add(new FlexFieldConfigMeta(flexEditMetaName, flexEditViewMetaData.getDisplayName(), flexFieldConfig.name()));
	}

	private LinkedHashMap<String, String> extractEnumValues(Class<?> fieldType) {
		LinkedHashMap<String, String> enumValuesMap=new LinkedHashMap<String, String>();
		for(Object enumConst:fieldType.getEnumConstants()){
			String value=enumConst.toString();
			enumValuesMap.put(value, value);
		}
		return enumValuesMap;
	}

	private void addValidationProperties(FieldMetaData editViewField, BeanDescriptor beanDescriptor) {
		PropertyDescriptor propertyDescriptor=beanDescriptor.getConstraintsForProperty(editViewField.getName());
		if(propertyDescriptor==null){
			return;
		}
		
		for(ConstraintDescriptor<? extends Annotation> constraintDescriptor:propertyDescriptor.getConstraintDescriptors()){
			//Collect properties
			Annotation annotation=constraintDescriptor.getAnnotation();
			if(annotation instanceof Length){
				editViewField.length(((Length)annotation).max());
			}else if(annotation instanceof NotBlank || annotation instanceof NotEmpty || annotation instanceof NotNull){
				editViewField.mandatory(true);
			}else if(annotation instanceof Email){
				editViewField.validation(ValidationConstrainNames.EMAIL);
			}else if(annotation instanceof URL){
				editViewField.validation(ValidationConstrainNames.URL);
			}else if(annotation instanceof Range){
				editViewField.range(((Range)annotation).max(),((Range)annotation).min());
			}
		}
		
	}

	/**
	 * Sets the reference property for the edit view field if it is relevant.
	 * @param entityName
	 * @param editViewField
	 */
	private void setReferenceProperty(String entityName, FieldMetaData editViewField) {
		//about the reference property...the logic goes this way
		//if the reference property exists in the edit view annotation then use that reference property and ensure the same exists in the list
		//view meta information for the association property. If it does not exist then we need to add that
		//if the reference property does not exist in the edit view then try to fetch the same in the list view and also ensure that the same is
		//present in the association list view meta data
		//else try to use the id property as the reference property
		String propertyName = editViewField.getName();
		DataType dataType = DataType.valueOf(editViewField.getDataType());
		if (DataType.REFERENCE.equals(dataType) || DataType.COLLECTION.equals(dataType)) {
			String referenceProperty = editViewField.getReferenceProperty();
			ListViewMetaData associationListMeta = editViewField.getAssociationListMeta();
			//get the list view meta for the association class
			ListViewMetaData associatedEntityListViewMeta = listViewMetaCache.get(editViewField.getPropertyJavaType().getName());
			//if this is blank take it from the list view
			if (StringUtils.isBlank(referenceProperty)) {
				ListViewMetaData listMetaData = listViewMetaCache.get(entityName);
				List<ColumnMetaData> columns = listMetaData.getColumns();
				ColumnMetaData relevantColumn = (ColumnMetaData)CollectionUtils.find(columns, new ColumnFinderPredicate(propertyName));
				if (relevantColumn != null) {
					referenceProperty = relevantColumn.getReferenceProperty();
					if (StringUtils.isNotBlank(referenceProperty)) {
						editViewField.referenceProperty(referenceProperty);
						//if this is null then create one and add the column to it
						//else ensure the column exists
						if (associationListMeta == null) {
							//and create a duplicate of that
							associationListMeta = new ListViewMetaData(associatedEntityListViewMeta);
							associationListMeta.getColumns().clear();
							//ensure that the reference property column exists
							ColumnMetaData referenceColumnMetaData 
								= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
							if (referenceColumnMetaData != null) {
								associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(0).hidden(false));
							}
							editViewField.associationListMeta(associationListMeta);
						} else {
							//if the reference property does not exist in the association meta object then need to create one
							if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
								ColumnMetaData referenceColumnMetaData 
									= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
								if (referenceColumnMetaData != null) {
									associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(100).hidden(false));
								}
							}
						}
					}
				}
				//if the reference property is still null then try to use the id property of the associated class as the reference property
				if (StringUtils.isBlank(referenceProperty)) {
					relevantColumn = associatedEntityListViewMeta.getIdColumn();
					if (relevantColumn != null) {
						editViewField.referenceProperty(relevantColumn.getName());
						referenceProperty = editViewField.getReferenceProperty();
						if (associationListMeta == null) {
							//and create a duplicate of that
							associationListMeta = new ListViewMetaData(associatedEntityListViewMeta);
							associationListMeta.getColumns().clear();
							//ensure that the reference property column exists
							associationListMeta.addColumn(new ColumnMetaData(relevantColumn).order(0).hidden(false));
							editViewField.associationListMeta(associationListMeta);
						} else {
							//if the reference property does not exist in the association meta object then need to create one
							if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
								associationListMeta.addColumn(new ColumnMetaData(relevantColumn).order(100).hidden(false));
							}
						}
					}
				}
			} else {
				
				if (associationListMeta == null) {
					//and create a duplicate of that
					associationListMeta = new ListViewMetaData(associatedEntityListViewMeta);
					associationListMeta.getColumns().clear();
					editViewField.associationListMeta(associationListMeta);
				} 
				
				//if the reference property does not exist in the association meta object then need to create one
				if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
					ColumnMetaData referenceColumnMetaData 
						= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
					if (referenceColumnMetaData != null) {
						associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(100).hidden(false));
					}
				}
			}
			
			if(DataType.COLLECTION.equals(dataType)){
				setCollectionReference(entityName, editViewField);
			}
		}
	}
	
	private void setCollectionReference(String entityName, FieldMetaData editViewField) {
		ListViewMetaData associatedEntityListViewMeta = listViewMetaCache.get(editViewField.getPropertyJavaType().getName());
		editViewField.allowCreateFromParent(associatedEntityListViewMeta.isCreateFromParent()).collectionReferenceEntity(editViewField.getPropertyJavaType().getName());
	}
	
	
	@SuppressWarnings("rawtypes")
	private SearchMetaData createSearchMetaData(EntityMetaData entityClassMeta, ListViewMetaData listViewMeta){
		Class entityClass = entityClassMeta.getEntityClass();
		SearchMetaData searchMeta = new SearchMetaData(entityClassMeta.getEntityName(), entityClass, listViewMeta.getDisplayKey());
		Method[] methods = entityClass.getMethods();
		for(Method method : methods){
			SearchColumn searchColumnAnnotaion = method.getAnnotation(SearchColumn.class);
			
			if(searchColumnAnnotaion != null){
				String propertyName = getPropertyName(method.getName());
				DataType dataType = guessDataType(searchColumnAnnotaion.dataType(), method);	
				if (ArrayUtils.isNotEmpty(searchColumnAnnotaion.values())) {
					dataType = DataType.ENUMERATION;
				}
				DisplayType displayType = guessDisplayTypeForSearchView(searchColumnAnnotaion.displayType(), dataType);
				LinkedHashMap<String, String> criteria = generateCriteriaByDataType(dataType,displayType,entityClassMeta,propertyName);		
				LinkedHashMap<String, String> staticValues = extractStaticValues(displayType, searchColumnAnnotaion.values());
				if((staticValues==null || staticValues.isEmpty()) && DataType.ENUMERATION.equals(dataType)){
					staticValues=extractEnumValues(determineFieldType(method));					
				}
				Class fieldType = determineFieldType(method);
				ItemMetaData searchField = new ItemMetaData()
												.entityClass(entityClass)
												.propertyJavaType(fieldType)
												.name(propertyName)
												.displayKey(searchColumnAnnotaion.displayKey())
												.order(searchColumnAnnotaion.order())
												.dataType(dataType.name())
												.displayType(displayType.name())
												.criteria(criteria)
												.values(staticValues)
												.referenceProperty(searchColumnAnnotaion.referenceProperty())
												//assumption entity name and class name are same. need to correct. TODO
												.associationListMeta(associationListViewMetaCache.get(fieldType.getName()))
												.basic(searchColumnAnnotaion.basic()).inPopupWindow(searchColumnAnnotaion.inPopupWindow());
				searchMeta.addFields(searchField);	
				setReferencePropertyForSearch(entityClassMeta.getEntityName(), searchField);
			}			
		}
		Collections.sort(searchMeta.getFields());
		return searchMeta;
	}
	
	
	private LinkedHashMap<String, String> generateCriteriaByDataType(DataType dataType,DisplayType displayType,EntityMetaData entityClassMeta,String name) {
		
		LinkedHashMap<String, String> criteria = new LinkedHashMap<String, String>();
		
		switch (dataType) {
		case STRING:
			if(displayType!=null&&(displayType.equals(DisplayType.POINT)||displayType.equals(DisplayType.POLYGON)||displayType.equals(DisplayType.POLYGON))){
				criteria.put(SearchOperator.GEOIN.toString(), "in");
				
				criteria.put(SearchOperator.GEONOIN.toString(), "not in");
			}else{
				if(entityClassMeta.getDataSourceType()!=DataSourceType.DOCUMENT||!name.equals("id")){
					criteria.put(SearchOperator.LIKE.toString(), "like");
				}
				
				criteria.put(SearchOperator.EQUAL.toString(), "=");
				criteria.put(SearchOperator.NOTEQUAL.toString(), "!=");				
			}
			break;
		case INTEGER:
		case LONG:
		case FLOAT:
		case DOUBLE:
		case BIG_INTEGER:
		case BIG_DECIMAL:
		case DATE:
		case DATETIME:			
			criteria.put(SearchOperator.BETWEEN.toString(), ":");
			criteria.put(SearchOperator.GREATER.toString(), ">");
			criteria.put(SearchOperator.GREATEREQUAL.toString(), ">=");
			criteria.put(SearchOperator.LESS.toString(), "<");
			criteria.put(SearchOperator.LESSEQUAL.toString(), "<=");
			criteria.put(SearchOperator.EQUAL.toString(), "=");
			criteria.put(SearchOperator.NOTEQUAL.toString(), "!=");			
			break;
		case ENUMERATION:
			if(displayType.equals(DisplayType.CHECKBOX)){
				criteria.put(SearchOperator.IN.toString(), "in");
			}else{
				criteria.put(SearchOperator.EQUAL.toString(), "=");
				criteria.put(SearchOperator.NOTEQUAL.toString(), "!=");
			}
			break;
		case REFERENCE:
			criteria.put(SearchOperator.EQUAL.toString(), "=");
			criteria.put(SearchOperator.NOTEQUAL.toString(), "!=");
			break;
		case BOOLEAN:
			criteria.put(SearchOperator.EQUAL.toString(), "=");
			break;
		default:
			criteria.put(SearchOperator.EQUAL.toString(), "=");
		}
		
		return criteria;
	}
	
	
	/**
	 * Sets the reference property for the search view field if it is relevant.
	 * @param entityName
	 * @param editViewField
	 */
	private void setReferencePropertyForSearch(String entityName, ItemMetaData searchField) {
		//about the reference property...the logic goes this way
		//if the reference property exists in the search view annotation then use that reference property and ensure the same exists in the list
		//view meta information for the association property. If it does not exist then we need to add that
		//if the reference property does not exist in the search view then try to fetch the same in the list view and also ensure that the same is
		//present in the association list view meta data
		//else try to use the id property as the reference property
		String propertyName = searchField.getName();
		DataType dataType = DataType.valueOf(searchField.getDataType());
		if (DataType.REFERENCE.equals(dataType)) {
			String referenceProperty = searchField.getReferenceProperty();
			ListViewMetaData associationListMeta = searchField.getAssociationListMeta();
			//get the list view meta for the association class
			ListViewMetaData associatedEntityListViewMeta = listViewMetaCache.get(searchField.getPropertyJavaType().getName());
			//if this is blank take it from the list view
			if (StringUtils.isBlank(referenceProperty)) {
				ListViewMetaData listMetaData = listViewMetaCache.get(entityName);
				List<ColumnMetaData> columns = listMetaData.getColumns();
				ColumnMetaData relevantColumn = (ColumnMetaData)CollectionUtils.find(columns, new ColumnFinderPredicate(propertyName));
				if (relevantColumn != null) {
					referenceProperty = relevantColumn.getReferenceProperty();
					if (StringUtils.isNotBlank(referenceProperty)) {
						searchField.referenceProperty(referenceProperty);
						//if this is null then create one and add the column to it
						//else ensure the column exists
						if (associationListMeta == null) {
							//and create a duplicate of that
							associationListMeta = new ListViewMetaData(associatedEntityListViewMeta);
							associationListMeta.getColumns().clear();
							//ensure that the reference property column exists
							ColumnMetaData referenceColumnMetaData 
								= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
							if (referenceColumnMetaData != null) {
								associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(0).hidden(false));
							}
							searchField.associationListMeta(associationListMeta);
						} else {
							//if the reference property does not exist in the association meta object then need to create one
							if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
								ColumnMetaData referenceColumnMetaData 
									= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
								if (referenceColumnMetaData != null) {
									associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(100).hidden(false));
								}
							}
						}
					}
				}
				//if the reference property is still null then try to use the id property of the associated class as the reference property
				if (StringUtils.isBlank(referenceProperty)) {
					relevantColumn = associatedEntityListViewMeta.getIdColumn();
					if (relevantColumn != null) {
						searchField.referenceProperty(relevantColumn.getName());
						if (associationListMeta == null) {
							//and create a duplicate of that
							associationListMeta = new ListViewMetaData(associatedEntityListViewMeta);
							associationListMeta.getColumns().clear();
							//ensure that the reference property column exists
							associationListMeta.addColumn(new ColumnMetaData(relevantColumn).order(0).hidden(false));
							searchField.associationListMeta(associationListMeta);
						} else {
							//if the reference property does not exist in the association meta object then need to create one
							if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
								associationListMeta.addColumn(new ColumnMetaData(relevantColumn).order(100).hidden(false));
							}
						}
					}
				}
			} else {
				//if the reference property does not exist in the association meta object then need to create one
				if (CollectionUtils.find(associationListMeta.getColumns(), new ColumnFinderPredicate(referenceProperty)) == null) {
					ColumnMetaData referenceColumnMetaData 
						= (ColumnMetaData)CollectionUtils.find(associatedEntityListViewMeta.getColumns(), new ColumnFinderPredicate(referenceProperty));
					if (referenceColumnMetaData != null) {
						associationListMeta.addColumn(new ColumnMetaData(referenceColumnMetaData).order(100).hidden(false));
					}
				}
			}
		}
	}
	
	private DisplayType guessDisplayTypeForSearchView(DisplayType displayType, DataType dataType) {
		if (DisplayType.UNDEFINED.equals(displayType)) {
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case STRING:
				displayType = DisplayType.TEXTFIELD;
				break;
			case DATE:
				displayType = DisplayType.DATE;
				break;
			case DATETIME:
				displayType = DisplayType.DATETIME;
				break;			
			case ENUMERATION:
				displayType = DisplayType.SELECT; //this should have the options defined
				break;
			case BOOLEAN:
				displayType = DisplayType.SELECT;
				break;
			case REFERENCE:
				displayType = DisplayType.ARTICLE_SELECT;
				break;
			}
		} else {
			//validate and ensure correct display type is used for a data type
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case STRING:
               if(DisplayType.POINT.equals(displayType)||DisplayType.POLYGON.equals(displayType)||DisplayType.POLYLINE.equals(displayType)||DisplayType.COLOR.equals(displayType)){
					
				}else  	
				if (!(DisplayType.TEXTFIELD.equals(displayType) || DisplayType.POINT.equals(displayType)||
						DisplayType.POLYGON.equals(displayType)||DisplayType.POLYLINE.equals(displayType))) {
					//the display type does not match the data type. so the display type 
					//will be ignored and the default display type will be used instead
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.TEXTFIELD;
				}
               break;
			case DATE:
				if (!(DisplayType.DATE.equals(displayType) 
						|| DisplayType.DATETIME.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.DATE;
				}
				break;
			case DATETIME:
				if (!DisplayType.DATETIME.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.DATETIME;
				}
				break;
			case ENUMERATION:
				if (!(DisplayType.SELECT.equals(displayType)
						|| DisplayType.CHECKBOX.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.SELECT;
				}
				break;
			case BOOLEAN:
				if (DisplayType.SELECT.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.SELECT;
				}
				break;
			case REFERENCE:
				if (!DisplayType.ARTICLE_SELECT.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.ARTICLE_SELECT;
				}
				break;
			}
		}
		return displayType;
	}
	
	
	/**
	 * Guesses the display type based on the data type only if the passed display type 
	 * is undefined
	 * 
	 * @param displayType
	 * @param dataType
	 * @return
	 */
	private DisplayType guessDisplayTypeForEditView(DisplayType displayType, DataType dataType) {
		if (DisplayType.UNDEFINED.equals(displayType)) {
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case STRING:
				displayType = DisplayType.TEXTFIELD;
				break;
			case DATE:
				displayType = DisplayType.DATE;
				break;
			case DATETIME:
				displayType = DisplayType.DATE;
				break;
			case CLOB: //should not be present in list
				displayType = DisplayType.TEXTAREA;
				break;
			case ENUMERATION:
				displayType = DisplayType.SELECT; //this should have the options defined
				break;
			case BOOLEAN:
				displayType = DisplayType.CHECKBOX;
				break;
			case REFERENCE:
				displayType = DisplayType.ARTICLE_SELECT;
				break;
			case IMAGE:
				displayType = DisplayType.ICON_UPLOAD;
				break;
			case BLOB:
				displayType = DisplayType.TEXT_UPLOAD;
				break;
			}
		} else {
			//validate and ensure correct display type is used for a data type
			switch (dataType) {
			case BIG_DECIMAL:
			case BIG_INTEGER:
			case DOUBLE:
			case INTEGER:
			case LONG:
			case FLOAT:
			case STRING:
				if(DisplayType.POINT.equals(displayType)||DisplayType.POLYGON.equals(displayType)||DisplayType.POLYLINE.equals(displayType)||DisplayType.HTML.equals(displayType)||DisplayType.TIME.equals(displayType)||DisplayType.COLOR.equals(displayType)){
					
				}else  	if (!(DisplayType.TEXTFIELD.equals(displayType) || DisplayType.IMAGE.equals(displayType))) {
					//the display type does not match the data type. so the display type 
					//will be ignored and the default display type will be used instead
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.TEXTFIELD;
				}
				break;
			case DATE:
				if (!(DisplayType.DATE.equals(displayType) 
						|| DisplayType.DATETIME.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.DATE;
				}
				break;
			case DATETIME:
				if (!DisplayType.DATETIME.equals(displayType)) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.DATETIME;
				}
				break;
			case CLOB: //should not be present in list
			case ENUMERATION:
				if (!(DisplayType.SELECT.equals(displayType)
						|| DisplayType.RADIO.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.SELECT;
				}
				break;
			case BOOLEAN:
				if (!(DisplayType.CHECKBOX.equals(displayType) 
						|| DisplayType.SELECT.equals(displayType)
						|| DisplayType.RADIO.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.CHECKBOX;
				}
				break;
			case REFERENCE:
				if (!(DisplayType.ARTICLE_SELECT.equals(displayType) || DisplayType.ARTICLE_DROPDOWN.equals(displayType)|| DisplayType.ARRAY.equals(displayType))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.ARTICLE_SELECT;
				}
				break;
			case IMAGE:
				if (!(DisplayType.ICON_UPLOAD.equals(displayType) || (DisplayType.UPLOAD.equals(displayType)))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.ICON_UPLOAD;
				}
			case BLOB:
				if (!(DisplayType.TEXT_UPLOAD.equals(displayType) || (DisplayType.UPLOAD.equals(displayType)))) {
					logger.warn("Display type {} is not compatible with data type {}", displayType, dataType);
					displayType = DisplayType.UPLOAD;
				}
				break;
			}
		}
		return displayType;
	}
	
	/**
	 * 
	 * @param displayType
	 * @param configuredStaticValues
	 * @return
	 */
	private LinkedHashMap<String, String> extractStaticValues(DisplayType displayType, String[] configuredStaticValues) {
		//static options make sense only for few of the display types
		if (DisplayType.SELECT.equals(displayType) || DisplayType.RADIO.equals(displayType) || DisplayType.CHECKBOX.equals(displayType)) {
			LinkedHashMap<String, String> configuredValues = new LinkedHashMap<String, String>();
			for (String configuredStaticValue:configuredStaticValues) {
				String[] configuredKeyValue = configuredStaticValue.split(":");
				//the size of this array should be exactly 2
				if (configuredKeyValue.length == 2) {
					configuredValues.put(configuredKeyValue[0], configuredKeyValue[1]);
				} else {
					logger.warn("Configured static value {} is not in correct format. Expected format is key:value", configuredStaticValue);
				}
			}
			return configuredValues;
		} 
		
		return null;
	}
	
	/**
	 * 
	 * @param displayType
	 * @param configuredStaticValues
	 * @return
	 */
	private LinkedHashMap<String, String> extractImageMap(DisplayType displayType, String[] configuredStaticValues) {
		//static options make sense only for few of the display types
		if (DisplayType.ICON.equals(displayType)||DisplayType.POLYLINE.equals(displayType)||DisplayType.POINT.equals(displayType)||DisplayType.POLYGON.equals(displayType)) {
			LinkedHashMap<String, String> configuredImageMap = new LinkedHashMap<String, String>();
			for (String configuredStaticValue:configuredStaticValues) {
				String[] configuredKeyValue = configuredStaticValue.split(":");
				//the size of this array should be exactly 2
				if (configuredKeyValue.length == 2) {
					configuredImageMap.put(configuredKeyValue[0], configuredKeyValue[1]);
				} else {
					logger.warn("Configured image map {} is not in correct format. Expected format is fieldValue:imageUrl", configuredStaticValue);
				}
			}
			return configuredImageMap;
		} 
		
		return null;
	}
	
	/**
	 * This method is improper and will be removed. This class has to be refactored along with. 
	 * @param articleName
	 * @return
	 */
	@Deprecated
	public EditViewMetaData getRawEditViewMeta(String articleName) {
		return getEditViewMetaData(articleName);
	}
	
	public EditViewMetaData getEditViewMeta(String articleName) {
		if (articleName.indexOf(".") < 0) {
			//this may just be the last part
			articleName = StringUtils.capitalize(articleName);
			//so possible last portion is..
			articleName = "." + articleName;
			//iterate over the keys and figure out the key
			Set<String> keys = listViewMetaCache.keySet();
			for (String key:keys) {
				if (key.endsWith(articleName)) {
					//clone the object before returning so that the 
					//returned object can be modified as required
					return cloneEditViewMeta(getEditViewMetaData(key));
				}
			}
		}
		//otherwise assume accurate entity name is passed 
		return cloneEditViewMeta(getEditViewMetaData(articleName));		
	}
	
	/**
	 * Loads the {@link EditViewMetaData} from the cache if available. Else try to
	 * create and entry.
	 *  
	 * @param articleName
	 * @return
	 */
	private EditViewMetaData getEditViewMetaData(String articleName) {
		EditViewMetaData editViewMetaData = editViewMetaCache.get(articleName);
		if (editViewMetaData == null) {
			try {
				@SuppressWarnings("rawtypes")
				Class entityClass = Class.forName(articleName);
				//mongo mapped class may be lazily found out, so pre-loading will not
				//work for such classes. so we have this case only for mongo mapped classes
				createMetaDataFromMongoMappedClass(entityClass);
				//get it back from cache again
				editViewMetaData = editViewMetaCache.get(articleName);
			} catch (ClassNotFoundException ignored) {
				//this should never happen..but if it happens its not our headache
				//let somebody who came up with this class name have the trouble
				logger.warn("Could not find class " + articleName, ignored);
			}
		}
		return editViewMetaData;
	}
	
	private EditViewMetaData cloneEditViewMeta(EditViewMetaData actualMetaObject) {
		if (actualMetaObject == null) {
			return null;
		}
		
		EditViewMetaData editViewMetaData=new EditViewMetaData(actualMetaObject);
		setEditViewPermission(editViewMetaData);
		for(FieldMetaData data:editViewMetaData.getFields()){
			if(DataType.ENUMERATION.name().equals(data.getDataType())){
				String displayName = actualMetaObject.getEntityClass().getName()+"."+data.getName();
				//data.displayKey(I18NUtil.getMessage(displayName));
				Map<String,String> mVal = data.getValues();
				for(Entry<String,String> val:mVal.entrySet()){
					val.setValue(I18NUtil.getMessage(displayName+"."+val.getValue()));
				}
			} 
		}
		return editViewMetaData;
	}
	
	private void setEditViewPermission(EditViewMetaData editViewMetaData) {
		String className=editViewMetaData.getEntityClass().getName();
		if (SecurityUtil.isPermissionDefined(className, UserOperation.EDIT)
				|| SecurityUtil.isPermissionDefined(className, UserOperation.CREATE)) {
			boolean canEdit=SecurityUtil.hasPermission(UserOperation.CREATE, className);
			if(!canEdit){
				canEdit=SecurityUtil.hasPermission(UserOperation.EDIT, className);
			}
			editViewMetaData.setEditPermission(canEdit);
		}

	}

	public SearchMetaData getSearchMeta(String articleName) {
		if (articleName.indexOf(".") < 0) {
			//this may just be the last part
			articleName = StringUtils.capitalize(articleName);
			//so possible last portion is..
			articleName = "." + articleName;
			//iterate over the keys and figure out the key
			Set<String> keys = listViewMetaCache.keySet();
			for (String key:keys) {
				if (key.endsWith(articleName)) {
					//clone the object before returning so that the 
					//returned object can be modified as required
					return cloneSearchMeta(getSearchViewMetaData(key));
				}
			}
		}
		//otherwise assume accurate entity name is passed 
		return cloneSearchMeta(getSearchViewMetaData(articleName));		
	}
	
	/**
	 * Loads the {@link SearchMetaData} from the cache if available. Else try to
	 * create and entry.
	 *  
	 * @param articleName
	 * @return
	 */
	private SearchMetaData getSearchViewMetaData(String articleName) {
		SearchMetaData searchViewMetaData = searchMetaCache.get(articleName);
		if (searchViewMetaData == null) {
			try {
				@SuppressWarnings("rawtypes")
				Class entityClass = Class.forName(articleName);
				//mongo mapped class may be lazily found out, so pre-loading will not
				//work for such classes. so we have this case only for mongo mapped classes
				createMetaDataFromMongoMappedClass(entityClass);
				searchViewMetaData = searchMetaCache.get(articleName);
			} catch (ClassNotFoundException ignored) {
				//this should never happen..but if it happens its not our headache
				//let somebody who came up with this class name have the trouble
				logger.warn("Could not find class " + articleName, ignored);
			}
		}
		return searchViewMetaData;
	}
	
	private SearchMetaData cloneSearchMeta(SearchMetaData actualMetaObject) {
		if (actualMetaObject == null) {
			return null;
		}
		SearchMetaData searchMetaData=new SearchMetaData(actualMetaObject);
		Class<?> entityClass=searchMetaData.getEntityClass();
		for(ItemMetaData itemMetaData:searchMetaData.getFields()){
			
			
			if(DataType.ENUMERATION.name().equals(itemMetaData.getDataType())){
				String displayName = entityClass.getName()+"."+itemMetaData.getName();
				itemMetaData.displayKey(I18NUtil.getMessage(displayName));
				Map<String,String> mVal = itemMetaData.getValues();
				for(Entry<String,String> val:mVal.entrySet()){
					val.setValue(I18NUtil.getMessage(displayName+"."+val.getValue()));
				}
			} else {
				itemMetaData.displayKey(getI18NDisplayName(itemMetaData.getDisplayKey(), entityClass, itemMetaData.getName()));
			}
		}
		return searchMetaData;
	}

	private String getPropertyName(String accessorOrModifierMethodName) {
		String propertyName = null;
		if (accessorOrModifierMethodName.startsWith("set")) {
			propertyName = accessorOrModifierMethodName.replaceFirst("set", "");
		} else if (accessorOrModifierMethodName.startsWith("get")) {
			propertyName = accessorOrModifierMethodName.replaceFirst("get", "");
		} else if (accessorOrModifierMethodName.startsWith("is")) {
			propertyName = accessorOrModifierMethodName.replaceFirst("is", "");
		}else if(accessorOrModifierMethodName.startsWith("return")){
			propertyName = accessorOrModifierMethodName.replaceFirst("return", "");
		}
		if (propertyName != null) {
			propertyName = propertyName.substring(0, 1).toLowerCase(Locale.ENGLISH) + propertyName.substring(1);
		}
		
		return propertyName;
	}
	
	@SuppressWarnings("rawtypes")
	private String getI18NDisplayName(String displayName, Class entityClass, String propertyName) {
		if(StringUtils.isNotEmpty(displayName)){
			return I18NUtil.getMessage(displayName);
		}
		
		//Form i18Key
		
		String i18nKey=entityClass.getName();
		if(StringUtils.isNotEmpty(propertyName)){
			i18nKey+="."+propertyName;
		}
		
		String i18nDisplayName=I18NUtil.getMessage(i18nKey);
		
		if(i18nKey.equals(i18nDisplayName)){
		  //No key defined. Generate some friendly name
			i18nDisplayName=entityClass.getSimpleName();
			if(StringUtils.isNotEmpty(propertyName)){
				i18nDisplayName+="_"+propertyName;
			}
		}
		
		return i18nDisplayName;
	}

	
	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	/**
	 * @param mongoMappingContext the mongoMappingContext to set
	 */
	@Autowired(required=false)
	public void setMongoMappingContext(MongoMappingContext mongoMappingContext) {
		this.mongoMappingContext = mongoMappingContext;
	}

	private class ColumnFinderPredicate implements Predicate {
		
		private String propertyName;
		
		/**
		 * @param propertyName
		 */
		public ColumnFinderPredicate(String propertyName) {
			this.propertyName = propertyName;
		}

		@Override
		public boolean evaluate(Object arg) {
			return propertyName.equals(((ColumnMetaData)arg).getName());
		}
	}

	@Override
	public int getOrder() {
		return 400;
	}
}
