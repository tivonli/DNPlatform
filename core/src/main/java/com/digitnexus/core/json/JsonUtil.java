/**
 * 
 */
package com.digitnexus.core.json;

import java.beans.BeanInfo;
import java.beans.IndexedPropertyDescriptor;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Member;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.WeakHashMap;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import net.sf.json.util.JSONUtils;
import net.sf.json.util.PropertyFilter;

import org.apache.commons.beanutils.DynaBean;
import org.apache.commons.beanutils.DynaBeanMapDecorator;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.ArrayUtils;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.proxy.HibernateProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.ColumnMetaData;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;

/**
 * @author Santanu
 * WeakHashMap
 */
public class JsonUtil {

	private static Logger logger = LoggerFactory.getLogger(JsonUtil.class);
	
	@SuppressWarnings("rawtypes")
	private static Map<Class, Map> propertyTypeCache = new WeakHashMap<Class, Map>();
	
	private static JsonConfig serializationJsonConfig = null;
	private static PropertyFilter[] defaultFilters = new PropertyFilter[] {new HibernateFilter(), 
		new JavaReflectionClassFilter(), new LobTypeFilter()};
	static {
		serializationJsonConfig = createJsonConfigWithDefaultJsonValueProcessors(defaultFilters);
		
		JSONUtils.getMorpherRegistry().registerMorpher(LocaleTypeAdapter.INSTANCE);
		JSONUtils.getMorpherRegistry().registerMorpher(DateTypeAdapter.INSTANCE);
		JSONUtils.getMorpherRegistry().registerMorpher(TimestampTypeAdapter.INSTANCE);
		JSONUtils.getMorpherRegistry().registerMorpher(LongTypeAdapter.INSTANCE, true);
		JSONUtils.getMorpherRegistry().registerMorpher(PrimitiveLongTypeAdapter.INSTANCE, true);
	}
	
	private static JsonConfig createJsonConfigWithDefaultJsonValueProcessors(PropertyFilter... filters) {
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.NOPROP);
		jsonConfig.setJsonPropertyFilter(new AggregatedPropertyFilter(filters));
		registerDefaultJsonValueProcessors(jsonConfig);
		
		//add defaultValueProcessor
		jsonConfig.registerDefaultValueProcessor(Double.class, NumberClassProcessor.INSTANCE);
		jsonConfig.registerDefaultValueProcessor(Integer.class, NumberClassProcessor.INSTANCE);
		jsonConfig.registerDefaultValueProcessor(Long.class, NumberClassProcessor.INSTANCE);
		return jsonConfig;
	}
	
	private static void registerDefaultJsonValueProcessors(JsonConfig jsonConfig) {
		jsonConfig.registerJsonValueProcessor(Locale.class, LocaleTypeAdapter.INSTANCE);
		jsonConfig.registerJsonValueProcessor(Date.class, DateTypeAdapter.INSTANCE);
		jsonConfig.registerJsonValueProcessor(Timestamp.class, TimestampTypeAdapter.INSTANCE);
		jsonConfig.registerJsonValueProcessor(Long.class, LongTypeAdapter.INSTANCE);
		jsonConfig.registerJsonValueProcessor(Long.TYPE, PrimitiveLongTypeAdapter.INSTANCE);
	}
	
	public static String toJson(Collection<? extends Object> serializable) {
		JSONArray jsonObject = JSONArray.fromObject(serializable, serializationJsonConfig);
		return jsonObject.toString();
	}
	
	/**
	 * Converts the passed object to a JSON string. This method excludes the 
	 * hibernate proxies and transient fields
	 * 
	 * @param serializable the object to be serialized to JSON
	 * @return
	 */
	public static String toJson(Object serializable) {
		return toJson(serializable, false);
	}
	
	/**
	 * Converts the passed object to a JSON string. This method excludes the 
	 * hibernate proxies and transient fields
	 * 
	 * @param serializable to be serialized
	 * @param ignoreNull, ignores the null properties if true
	 * @return
	 */
	public static String toJson(Object serializable, boolean ignoreNull) {
		//if null values are to be ignored then we need to create a duplicate of the default 
		//jsonConfig and add an additional property filter to eliminate nulls
		if (ignoreNull) {
			return toJson(serializable, new NullPropertyFilter());
		}
		
		return toJson(serializable, (PropertyFilter[])null);
	}
	
	/**
	 * Converts the passed object to a JSON string. This method excludes the 
	 * hibernate proxies, transient fields, null fields and the spicific fields
	 * 
	 * @param serializable to be serialized
	 * @param excludeFields the fields to be excluded
	 * @return
	 */
	public static String toJson(Object serializable, String... excludeFields) {
		return toJson(serializable, new ExcludePropertyFilter(excludeFields));
	}

	/**
	 * Special purpose method to serialize data objects using {@link EditViewMetaData}
	 *  
	 * @param serializable
	 * @param editViewMetaData
	 * @return
	 */
	public static String toJson(Object serializable, EditViewMetaData editViewMetaData) {
		return toJson(serializable, new EditViewPropertyFilter(editViewMetaData));
	}
	
	/**
	 * Serialize the object passed using the property filters along with the default filters defines
	 * @param serializable
	 * @param propertyFilters
	 * @return
	 */
	private static String toJson(Object serializable, PropertyFilter... propertyFilters) {
		//this is the object that will be serialized to json
		Object obj = serializable;
		//and by default we start with the default filters
		PropertyFilter[] filters = defaultFilters;
		if (serializable instanceof FlexibleObject) {
			//in case this is a flexible object, we need to get the target object
			obj = ((FlexibleObject)serializable).getWrappedObject();
			//also handle the excluded properties if any present
			Set<String> excludedProperties = ((FlexibleObject)serializable).getExcludedProperties();
			if (CollectionUtils.isNotEmpty(excludedProperties)) {
				filters = (PropertyFilter[])ArrayUtils.add(filters, 
						new ExcludePropertyFilter(excludedProperties.toArray(new String[excludedProperties.size()])));
			}
		}
		if (ArrayUtils.isNotEmpty(propertyFilters)) {
			filters = (PropertyFilter[]) ArrayUtils.addAll(defaultFilters, propertyFilters);
		}
		
		JsonConfig jsonConfig = createJsonConfigWithDefaultJsonValueProcessors(filters);
		JSONObject jsonObject = JSONObject.fromObject(obj, jsonConfig);
		//this will add any extra property to the json object if required
		processJsonObject(serializable, jsonObject);
		
		return jsonObject.toString();
	}
	
	/**
	 * Modifies the {@link JSONObject} if required
	 * @param serializable
	 * @param jsonObject
	 */
	private static void processJsonObject(Object serializable, JSONObject jsonObject) {
		if (serializable instanceof FlexibleObject) {
			//if this is a flexible object then check if we need to add any additional property
			FlexibleObject obj = (FlexibleObject)serializable;
			Map<String, Object> additionalProperties = obj.getAdditionalProperties();
			//if there is any additional property then add that to the JSONObject
			if (MapUtils.isNotEmpty(additionalProperties)) {
				for (Entry<String, Object> entry:additionalProperties.entrySet()) {
					jsonObject.element(entry.getKey(), entry.getValue());
				}
			}
		}
	}
	
	/**
	 * Creates the bean from the json passed
	 * @param json
	 * @param beanClass
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> T toObject(String json, Class<T> beanClass) {
		JSONObject jsonObject = JSONObject.fromObject(json);
	    Object value = JSONObject.toBean(jsonObject, beanClass, getClassMap(beanClass));
	    return (T)value;
	}
	
	/**
	 * Creates a list of objects from a Json string. If the json does not represent
	 * a collection then this method results in JsonException. If the passed bean class
	 * is null then this object returns a {@link List} of {@link Map}
	 * 
	 * @param json JSON String
	 * @param beanClass type of individual elements in the returned {@link List}
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static <T> List<T> toList(String json, Class<T> beanClass) {
		JSONArray jsonArray = JSONArray.fromObject(json);
		T[] beanArray = (T[])JSONArray.toArray(jsonArray, beanClass, getClassMap(beanClass));
		//we work on the raw type list as we need to cover for null bean class
		List beanList = new ArrayList();
		if (beanClass != null) {
			CollectionUtils.addAll(beanList, beanArray);
		} else {
			//for the case of null T does not have any meaning. However 
			//it means Map then
			Object[] dynaBeanArray = beanArray;
			for (Object dynaBean:dynaBeanArray) {
				beanList.add(new DynaBeanMapDecorator((DynaBean)dynaBean));
			}
		}
		return beanList;
	}
	
	/**
	 * Creates a class map for the bean class which is required for json deserialization
	 * @param beanClass
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private static synchronized Map getClassMap(Class beanClass) {
		if (beanClass == null) {
			return Collections.EMPTY_MAP;
		}
		//check the cache if present
		if (!propertyTypeCache.containsKey(beanClass)) {
			//if not then populate the cache
			Map classMap = new HashMap();
			//this will ensure that if there is a cyclic reference then it will return a semi-populated map
			//till the complete process is over. At the end everything should get properly populated
			//this method is marked synchronized to ensure that if one thread in is progress of populating
			//the class map the other thread should not get an incomplete one
			propertyTypeCache.put(beanClass, classMap);
			//now populate the map 
			populateClassMap(beanClass, classMap);
		}
		return propertyTypeCache.get(beanClass);
	}
	
	/**
	 * Create a map for the passed bean class. The map has the collection property names as the
	 * key and the type of the parameterized collection as the value
	 * 
	 * @param beanClass class to introspect
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private static Map populateClassMap(Class beanClass, Map classMap) {
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(beanClass, Object.class);
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			for (PropertyDescriptor propertyDescriptor:propertyDescriptors) {
				//properties that has both read and write methods will be participating in
				//serialization and de-serialization completely. So we check for the existence
				//of the getter here. May need to review is we check for either setter or getter
				if ((propertyDescriptor.getReadMethod() != null) 
						&& Collection.class.isAssignableFrom(propertyDescriptor.getPropertyType()) 
						&& !(propertyDescriptor instanceof IndexedPropertyDescriptor)) {
					Type genericReturnType = propertyDescriptor.getReadMethod().getGenericReturnType();
					//if the class is parameterized then only we care
					if (genericReturnType instanceof ParameterizedType) {
						ParameterizedType parameterizedReturnType = (ParameterizedType)genericReturnType;
						Type[] typeArguments = parameterizedReturnType.getActualTypeArguments();
						for (Type typeArgument:typeArguments) {
							classMap.put(propertyDescriptor.getName(), typeArgument);
							if (typeArgument instanceof Class) {
								//if the type argument itself is a bean then introspect that as well
								classMap.putAll(getClassMap((Class)typeArgument));
							}
						}
					}
				}
			}
		} catch (IntrospectionException e) {
			logger.warn("Introspection of class {} failed with exception {}", beanClass, e.getMessage());
		}
		return classMap;
	}
	
	private static class HibernateFilter implements PropertyFilter {
		@Override
		public boolean apply(Object source, String name, Object value) {
			return (value instanceof HibernateProxy) || (value instanceof Session) || (value instanceof SessionFactory);
		}
	}
	
	private static class JavaReflectionClassFilter implements PropertyFilter {
		@Override
		public boolean apply(Object source, String name, Object value) {
			return (value instanceof Type) || (value instanceof Member) || (value instanceof PropertyDescriptor);
		}
	}
	
	private static class NullPropertyFilter implements PropertyFilter {
		@Override
		public boolean apply(Object source, String name, Object value) {
			return (value == null);
		}
	}
	
	private static class LobTypeFilter implements PropertyFilter {
		@Override
		public boolean apply(Object source, String name, Object value) {
			return (value instanceof Clob) || (value instanceof Blob);
		}
	}
	
	/**
	 * This object maintains state. So can not be reused 
	 * @author Santanu
	 */
	private static class EditViewPropertyFilter implements PropertyFilter {

		private EditViewMetaData editViewMetaData;
		private FieldMetaData referenceFieldMetaData;
		
		/**
		 * @param editViewMetaData
		 */
		EditViewPropertyFilter(EditViewMetaData editViewMetaData) {
			this.editViewMetaData = editViewMetaData;
		}

		@Override
		public boolean apply(Object source, String name, Object value) {
			//source is null!! dont think ever going to happen
			if ((source != null) && editViewMetaData.getEntityClass().equals(source.getClass())) {
				//this means this is a property of the main bean class
				//this is a villain member variable which makes this class so delicate
				referenceFieldMetaData = null;
				//if this is the id property then we need to send the property anyway
				FieldMetaData idField = editViewMetaData.getIdField();
				if (idField != null) {
					if (idField.getName().equals(name)) {
						return false;
					}
				}
				//else if the field name matches one of the edit view field names then we take that 
				List<FieldMetaData> fields = editViewMetaData.getFields();
				for (FieldMetaData field:fields) {
					if (field.getName().equals(name)) {
						//if this is a reference property then next call is likely going to be for that
						//bean. so we maintain a reference to that field
						if (DataType.REFERENCE.name().equals(field.getDataType())) {
							referenceFieldMetaData = field;
						}
						return false;
					}
				}
				return true;
			} else {
				//if the source is a referenced bean then we need to accept only the id and the reference property
				if (referenceFieldMetaData != null && source.getClass().equals(referenceFieldMetaData.getPropertyJavaType())) {
					//check for the reference property first
					String referenceProperty = referenceFieldMetaData.getReferenceProperty();
					if (name.equals(referenceProperty)) {
						return false;
					}
					//else check if this is the id field
					ListViewMetaData associationListMeta = referenceFieldMetaData.getAssociationListMeta();
					if (associationListMeta != null) {
						ColumnMetaData idColumn = associationListMeta.getIdColumn();
						if ((idColumn != null) && (idColumn.getName().equals(name))) {
							return false;
						}
					}
					//else we do not care to take that field
					return true;
				}
			}
			//by default we take the field in the json
			return false;
		}
		
	}
	
	private static class AggregatedPropertyFilter implements PropertyFilter {
		
		private PropertyFilter[] wrappedFilters = null;
		
		AggregatedPropertyFilter(PropertyFilter... filters) {
			wrappedFilters = filters;
		}
		
		@Override
		public boolean apply(Object source, String name, Object value) {
			for (PropertyFilter wrappedFilter:wrappedFilters) {
				if (wrappedFilter.apply(source, name, value)) {
					return true;
				}
			}
			return false;
		}
		
	}
	
	private static class ExcludePropertyFilter implements PropertyFilter {
		
		private String[] excludeFields = null;
		
		public ExcludePropertyFilter(String... fields) {
			excludeFields = fields;
		}
		
		@Override
		public boolean apply(Object source, String name, Object value) {
			for (String field:excludeFields) {
				if (name.equals(field)) {
					return true;
				}
			}
			return false;
		}
		
	}
}
