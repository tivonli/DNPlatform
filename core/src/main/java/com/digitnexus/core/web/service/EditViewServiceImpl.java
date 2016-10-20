/**
 * 
 */
package com.digitnexus.core.web.service;

 
import java.beans.PropertyDescriptor;
import java.io.InputStream;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.entity.EntityService;
import com.digitnexus.core.entity.EntityValidationException;
import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.json.FlexibleObject;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.nosql.attachment.dao.AttachmentDao;
import com.digitnexus.core.nosql.attachment.dao.AttachmentStream;
import com.digitnexus.core.nosql.attachment.service.AttachmentResponseUtil;
import com.digitnexus.core.nosql.domain.AttachmentObject;
import com.digitnexus.core.security.util.SecurityUtil;
import com.digitnexus.core.util.ConfigUtil;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.dao.ListViewDao;
import com.digitnexus.core.web.dao.ListViewNosqlDao;
import com.digitnexus.core.web.exception.UnauthorizedOperationException;
import com.digitnexus.core.web.ui.config.UiConfiguration;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.dataobject.ColumnMetaData;
import com.digitnexus.core.web.ui.config.dataobject.DataSourceType;
import com.digitnexus.core.web.ui.config.dataobject.EditViewMetaData;
import com.digitnexus.core.web.ui.config.dataobject.FieldMetaData;
import com.digitnexus.core.web.ui.config.dataobject.ListViewMetaData;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import com.google.gson.Gson;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;
/**
 * @author Santanu
 *
 */
@Service
@Path("edit")
public class EditViewServiceImpl implements EditViewService {
	
	private final Logger logger=LoggerFactory.getLogger(getClass());

	private UiConfiguration uiConfiguration;
	private EntityService entityService;
	private ListViewDao listViewDao;
	private ListViewNosqlDao listViewNosqlDao;
	private AttachmentDao attachmentDao;
	
  
	 
	/* (non-Javadoc)
	 * @see org.digitnexus.core.web.service.EditViewService#getEditMetaDataResponse(java.lang.String,java.lang.String)
	 */
	@GET @Path("meta/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	public String getEditMetaDataResponse(@PathParam("articleName") String articleName,@QueryParam("parentArticleName") String parentArticleName) {
		EditViewMetaData editViewMeta = null;
		if(StringUtils.isNotEmpty(parentArticleName)){
			editViewMeta = uiConfiguration.getEditViewMeta(ConfigUtil.getArticleNameFromParentArticleByPropertyName(articleName, parentArticleName));
		}else{
			editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		}
		if (editViewMeta == null) {
			throw new NullPointerException("No edit view configured for " + articleName);
		}
		//give some callback here...
		
		return JsonUtil.toJson(editViewMeta);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	@GET @Path("data/{articleName}") @Produces(MediaType.APPLICATION_JSON)
	public String getArticleDataResponse(@PathParam("articleName") String articleName, @QueryParam("id") String id) {
		EditViewMetaData editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		if (editViewMeta == null) {
			throw new NullPointerException("No edit view configured for " + articleName);
		}
		//provide Initialization for ui model		
		if(id.equals("init")){
			Object entity1 = null;
			try{
				entity1 = Class.forName(articleName).newInstance(); 				
			}catch(Exception e){
				throw new NullPointerException("No edit view configured for " + articleName);
			}
			//return JsonUtil.toJson(entity1, editViewMeta);
			return new Gson().toJson(entity1);
		}else{
			FieldMetaData idField = editViewMeta.getIdField();
			DataType dataType = DataType.valueOf(idField.getDataType());
			Object idObject = DataFormatUtil.parse(id, idField.getPropertyJavaType(), dataType);
			
			Object entity = null;
			
			if (DataSourceType.DOCUMENT.equals(editViewMeta.getDataSourceType())) {
				entity = listViewNosqlDao.get(editViewMeta.getEntityClass(), idObject);
			} else {
				entity = listViewDao.getObjectEagerly(editViewMeta, (Serializable)idObject);
				boolean isEditable = listViewDao.isEditable(editViewMeta, (Serializable)idObject);
				boolean isDeletable = listViewDao.isDeletable(editViewMeta, (Serializable)idObject);
				entity = new FlexibleObject(entity)
							.addProperty("_readOnly", !isEditable)
							.addProperty("_allowDelete", isDeletable);
			}
			
			return JsonUtil.toJson(entity, editViewMeta);
		}
		
	}
	
	private EditViewMetaData getEditViewMetaData(String articleName){
		EditViewMetaData editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		if (editViewMeta == null) {
			throw new NullPointerException("No edit view configured for " + articleName);
		}
		return editViewMeta;
	}
	
	@SuppressWarnings("unchecked")
	private Object getExistingObject(Object transientObject,EditViewMetaData editViewMeta){
		Serializable id = getIdValue(transientObject, editViewMeta);
		if (id != null && !id.toString().equals("") && !id.toString().equals("0")) {
			return entityService.get(editViewMeta.getEntityClass(), id);
		}
		return null;
	}
	
	
	/**
	 * To support PUT http method.Rest does not allow to place multiple http methods on the same method. 
	 * @param articleName
	 * @param jsonData
	 */
	@SuppressWarnings("unchecked")
	@PUT @Path("data/{articleName}")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
	@Override
	public void updateArticle(@PathParam("articleName") String articleName, String jsonData){
		EditViewMetaData editViewMeta=getEditViewMetaData(articleName);
		
		
		String imgid=null;
		String fieldName=null;
	    for(FieldMetaData fieldMeta:editViewMeta.getFields()){
	    	if(fieldMeta.isAttachment()&&fieldMeta.isShowAdd()){
	    		String name=fieldMeta.getName();
	    		fieldName=name;
	    		int ind=jsonData.indexOf(",\""+name+"\":");
	    		if(ind>0){ 
	    			if(!jsonData.startsWith("null",ind+4+name.length())){
			    		int end=jsonData.indexOf("\"",ind+5+name.length());
			    		imgid=jsonData.substring(ind+5+name.length(),end); 
			    		jsonData=jsonData.replace("\""+imgid+"\"", "");	 
	    			}else{
	    				jsonData=jsonData.replace("null", "");
	    			}
	    			 jsonData=jsonData.replace(",\""+name+"\":", "");
	    		}
	    	}
	    }
		Object transientObject=JsonUtil.toObject(jsonData, editViewMeta.getEntityClass());
		//check if the user has edit permission
		Serializable id = getIdValue(transientObject, editViewMeta);
		boolean isEditable=true;
		if (!DataSourceType.DOCUMENT.equals(editViewMeta.getDataSourceType())) {  
		    isEditable = listViewDao.isEditable(editViewMeta, id);
		}
		if (!isEditable) {
			//log with some effort to avoid any embarrassment
			String username = "";
			if (SecurityUtil.getCurrentUser() != null) {
				username = SecurityUtil.getCurrentUser().getUsername();
			}
			logger.warn("Edit operation is not permitted for article type {} with id {} for user {}", new Object[]{articleName, id, username});
			//then embarrass the UI developer! why on earth did you allow to edit at the first place??
			throw new UnauthorizedOperationException(I18NUtil.getMessage("error_edit_operation"));
		}
		
		Object persistedObject=getExistingObject(transientObject, editViewMeta);

		checkStaleData(transientObject,persistedObject,editViewMeta);
		//set the configured field values to the persisted object
		updatePersistedObject(persistedObject, transientObject, editViewMeta);
		entityService.saveOrUpdate(persistedObject);
	}
	
	private void checkStaleData(Object transientObject, Object persistedObject, EditViewMetaData editViewMeta) {
		FieldMetaData versionProperty=editViewMeta.getVersionProperty();
		if(versionProperty==null){
			//Either version control is not required or NoSql object
			return;
		}
		Method readMethod=versionProperty.getPropertyDescriptor().getReadMethod();
		try {
			Object transientObjectVersion=readMethod.invoke(transientObject, (Object[]) null);
			Object persistentObjectVersion=readMethod.invoke(persistedObject, (Object[]) null);
			if(!transientObjectVersion.equals(persistentObjectVersion)){
				throw new StaleDataException();
			}
		} catch (IllegalArgumentException e) {
			logger.error(e.getMessage(),e);
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			logger.error(e.getMessage(),e);
			throw new RuntimeException(e);
		} catch (InvocationTargetException e) {
			logger.error(e.getMessage(),e);
			throw new RuntimeException(e);
		}
		
		
	}

	@SuppressWarnings("unchecked")
	@POST @Path("data/{articleName}")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
	@Override
	public void saveArticle(@PathParam("articleName") String articleName, String jsonData){
		EditViewMetaData editViewMetaData=getEditViewMetaData(articleName);
		String id=null;
		String fieldName=null;
	    for(FieldMetaData fieldMeta:editViewMetaData.getFields()){
	    	if(fieldMeta.isAttachment()&&fieldMeta.isShowAdd()){
	    		String name=fieldMeta.getName();
	    		fieldName=name;
	    		int ind=jsonData.indexOf(",\""+name+"\":");
	    		if(ind>0){ 
	    			if(!jsonData.startsWith("null",ind+4+name.length())){
			    		int end=jsonData.indexOf("\"",ind+5+name.length());
			    		id=jsonData.substring(ind+5+name.length(),end); 
			    		jsonData=jsonData.replace("\""+id+"\"", "");	 
	    			}else{
	    				jsonData=jsonData.replace("null", "");
	    			}
	    			 jsonData=jsonData.replace(",\""+name+"\":", ",");
	    		}
	    	}
	    }
	    if (DataSourceType.DOCUMENT.equals(editViewMetaData.getDataSourceType())) {  
		    FieldMetaData idField=editViewMetaData.getIdField();
		    String name=idField.getName();
		    int ind=jsonData.indexOf(",\""+name+"\":\"\"");
    		if(ind>0){  
				    jsonData=jsonData.replace(name, "");
				    jsonData=jsonData.replaceAll("\"\":\"\",", ""); 
    		}
	    }
	    
		Object transientObject=JsonUtil.toObject(jsonData, editViewMetaData.getEntityClass());
		Object persistedObject=getExistingObject(transientObject, editViewMetaData);
		if(persistedObject!=null){
			//check if the user has edit permission 
			FieldMetaData idFieldMetaData=editViewMetaData.getIdField();
			SetMultimap<String, String> errorMessages=HashMultimap.create();
			errorMessages.put(idFieldMetaData.getName(), I18NUtil.getMessage(articleName+"."+idFieldMetaData.getName())+I18NUtil.getMessage("error.uniqueField"));
			EntityValidationException.throwEntityValidationException(errorMessages);
		}
		
		entityService.saveOrUpdate(transientObject);
	}
	
	 
	
	@SuppressWarnings("unchecked")
	@POST @Path("attachment/{articleName}")
	@Consumes({MediaType.MULTIPART_FORM_DATA})
	public Response saveAttachment(@PathParam("articleName") String articleName, @QueryParam("id") String id, @QueryParam("fieldName") String fieldName, 
			@FormDataParam("file") InputStream stream, @FormDataParam("file") FormDataContentDisposition fileInfo,@Context ServletContext context ) {
		EditViewMetaData editViewMeta = uiConfiguration.getEditViewMeta(articleName);
		if (editViewMeta == null) {
			throw new NullPointerException("No edit view configured for " + articleName);
		}
		//if it's a gis layer class,then save the file to cache
		FieldMetaData attachmentFieldMeta = editViewMeta.getField(fieldName);
		if(articleName.equals("com.digitnexus.core.gis.domain.Layer")){ 
                AttachmentObject attachment = new AttachmentObject();
                String key=System.currentTimeMillis()+"";
                
                String name=fileInfo.getFileName(); 
	       		attachment.setFileName(name); 
	       		attachment.setParentArticleType(articleName);
	       		attachment.setParentArticleField(fieldName);  
	       		attachment.setParentArticleId(key);
	       		attachment.setData(stream);
	       		attachmentDao.store(attachment);
               return Response.ok(JsonUtil.toJson(Collections.singletonList(AttachmentResponseUtil.createAttachmentMetaMap(attachment))), 
       				MediaType.APPLICATION_JSON).build();
		}
		
		FieldMetaData idField = editViewMeta.getIdField();
		DataType dataType = DataType.valueOf(idField.getDataType());
		Object idObject = DataFormatUtil.parse(id, idField.getPropertyJavaType(), dataType);
		
		Object entity = null;
		if (DataSourceType.DOCUMENT.equals(editViewMeta.getDataSourceType())) {
			entity = listViewNosqlDao.get(editViewMeta.getEntityClass(), idObject);
		} else {
			entity = listViewDao.getObjectEagerly(editViewMeta, (Serializable)idObject);
		}
		
		
		AttachmentObject attachment = new AttachmentObject();
		attachment.setFileName(fileInfo.getFileName());
		attachment.setData(stream);
		attachment.setParentArticleType(articleName);
		attachment.setParentArticleField(fieldName);
		attachment.setParentArticleId(idObject.toString());
		setAttachmentValue(articleName, idObject, entity, attachment, attachmentFieldMeta); 
		entityService.saveOrUpdate(entity, attachment);
		
		return Response.ok(JsonUtil.toJson(Collections.singletonList(AttachmentResponseUtil.createAttachmentMetaMap(attachment))), 
				MediaType.APPLICATION_JSON).build();
	}
	
	private Serializable getIdValue(Object entityObject, EditViewMetaData editViewMeta) {
		FieldMetaData idFieldMeta = editViewMeta.getIdField();
		if (idFieldMeta != null) {
			Object idValue = getPropertyValue(entityObject, idFieldMeta);
			return (Serializable)idValue;
		}
		return null;
	}
	
	private void updatePersistedObject(Object persistedObject, Object updatedObject, EditViewMetaData editViewMeta) {
	   updatePersistedObject(persistedObject, updatedObject, editViewMeta,null);
	}
	
	private void updatePersistedObject(Object persistedObject, Object updatedObject, EditViewMetaData editViewMeta,Class<?> parentType){
		List<FieldMetaData> fields = editViewMeta.getFields();
		for (FieldMetaData field:fields) {
			if(field.isFlexField()){
				continue;
			}
			
			Object updateProperty = getPropertyValue(updatedObject, field);
			setPropertyValue(persistedObject, updateProperty, field,parentType);
		}
	}
	
	private Object getPropertyValue(Object entityObject, FieldMetaData fieldMetaData) {
		try {
			PropertyDescriptor propertyDescriptor = fieldMetaData.getPropertyDescriptor();
			Object propertyValue = propertyDescriptor.getReadMethod().invoke(
					entityObject, (Object[]) null);
			return propertyValue;
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 
	 * @param articleName
	 * @param articleId
	 * @param entityObject
	 * @param value
	 * @param fieldMetaData
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void setAttachmentValue(String articleName, Object articleId, Object entityObject, AttachmentObject attachment, FieldMetaData fieldMetaData) {
		FieldMetaData rawAttachmentFieldMeta = fieldMetaData.getAttachmentField();
		//this should not be null, but in future we may like to get rid of this completely, it will be null then
		if (rawAttachmentFieldMeta == null) {
			rawAttachmentFieldMeta = fieldMetaData; 
		}
		
		PropertyDescriptor propertyDescriptor = rawAttachmentFieldMeta.getPropertyDescriptor();
		Class<?> propertyType = propertyDescriptor.getPropertyType();
		
		boolean isAttachmentObjectToSet = (rawAttachmentFieldMeta.getPropertyJavaType().equals(AttachmentObject.class));
		
		if (Collection.class.isAssignableFrom(propertyType)) {
			Collection value = null;
			if (isAttachmentObjectToSet) {
				List<AttachmentObject> existingAttachments = attachmentDao.findAttachments(articleName, fieldMetaData.getName(), articleId);
				attachment.setIndex(existingAttachments.size());
				if(List.class.isAssignableFrom(propertyType)){
					value = existingAttachments;
					value.add(attachment);
				} else if (Set.class.isAssignableFrom(propertyType)) {
					value = new LinkedHashSet(existingAttachments);
					value.add(attachment);	
				} 
			} else {
				List<AttachmentObject> existingAttachments = attachmentDao.findAttachments(articleName, fieldMetaData.getName(), articleId);
				attachment.setIndex(existingAttachments.size());
				if(List.class.isAssignableFrom(propertyType)){
					value = new ArrayList<InputStream>();
					for (AttachmentObject existingAttachment:existingAttachments) {
						value.add(new AttachmentStream(existingAttachment.getId()));
					}
					value.add(attachment.getData());
				} else if (Set.class.isAssignableFrom(propertyType)) {
					value = new LinkedHashSet<InputStream>();
					for (AttachmentObject existingAttachment:existingAttachments) {
						value.add(new AttachmentStream(existingAttachment.getId()));
					}
					value.add(attachment.getData());
				}
			}
			try {
				propertyDescriptor.getWriteMethod().invoke(entityObject, value);
			} catch (IllegalArgumentException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
		} else {
			if (isAttachmentObjectToSet) {
				setPropertyValue(entityObject, attachment, fieldMetaData);
			} else {
				setPropertyValue(entityObject, attachment.getData(), rawAttachmentFieldMeta);
			}
		}
	}
	
	private void setPropertyValue(Object entityObject, Object value, FieldMetaData fieldMetaData,Class<?> parentType){
		if(parentType!=null && parentType.equals(fieldMetaData.getPropertyDescriptor().getPropertyType())){
			//Do not set value as it may cause circular effect
			return;
		}
		
		setPropertyValue(entityObject, value, fieldMetaData);
	}
	
	
	private void setPropertyValue(Object entityObject, Object value, FieldMetaData fieldMetaData) {
		
		if(fieldMetaData.isFlexField()){
			return;
		}
		
		//also if this is an attachment field and there is no attachment description field
		//which effectively means that this field expect a input stream type data with the attachment detail
		if (fieldMetaData.isAttachment() && (fieldMetaData.getAttachmentField() == fieldMetaData)) {
			//attachment fields are populated on a separate call
			return;
		}
		
		try {
			if (!fieldMetaData.isReadOnly()) {
				PropertyDescriptor propertyDescriptor = fieldMetaData.getPropertyDescriptor();
				Class<?> propertyType=propertyDescriptor.getPropertyType();
				if(Collection.class.isAssignableFrom(propertyType)){
					setCollectionValues(entityObject, value, fieldMetaData);
				}else if(Map.class.isAssignableFrom(propertyType)){
					setMapValues(entityObject,value,fieldMetaData);
				}else{
					propertyDescriptor.getWriteMethod().invoke(entityObject, value);
				}
			}
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void setMapValues(Object entityObject, Object value, FieldMetaData fieldMetaData) {
		PropertyDescriptor propertyDescriptor = fieldMetaData.getPropertyDescriptor();
		try {
			Map persistedValues=(Map) propertyDescriptor.getReadMethod().invoke(entityObject);
			Map transientValue=(Map) value;
			persistedValues.clear();
			if(transientValue!=null){
				persistedValues.putAll(transientValue);
			}
			
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void setCollectionValues(Object entityObject, Object value, FieldMetaData fieldMetaData) {
		PropertyDescriptor propertyDescriptor = fieldMetaData.getPropertyDescriptor();
		try {
			Collection persistedValues=(Collection) propertyDescriptor.getReadMethod().invoke(entityObject);
			Collection values=(Collection) value;
			if(values==null || values.isEmpty()){
				//Delete All scenario
				persistedValues.clear();
				return;
			}
						
			if(persistedValues.isEmpty()){
				//the entityObject got first children
				persistedValues.addAll(values);
				return;
			}
			
			//Get Collection element field meta data
			EditViewMetaData valueEditMeta=uiConfiguration.getEditViewMeta(fieldMetaData.getCollectionReferenceEntity());
			PropertyDescriptor idPropertyDescriptor=valueEditMeta.getIdField().getPropertyDescriptor();
			
			//Keep a map of id vs persisted values
			Map<Object, Object> idToPersistedValues=new HashMap<Object, Object>(persistedValues.size());
			for(Object persistedValue:persistedValues){
				idToPersistedValues.put(idPropertyDescriptor.getReadMethod().invoke(persistedValue), persistedValue);
			}
			
			//Keep track of values we find in idToPersistedValues
			Set<Object> changedObjectIds=new HashSet<Object>();
			
			//Update or add values
			for(Object transientValue:values){
				Object id=idPropertyDescriptor.getReadMethod().invoke(transientValue);
				if(id==null){
					//New
					persistedValues.add(transientValue);
					continue;
				}
								
				Object persistedValue=idToPersistedValues.get(id);
				
				if(persistedValue==null){
					//New
					persistedValues.add(transientValue);
					continue;
				}
				
				changedObjectIds.add(id);
				
				if(fieldMetaData.isAllowCreateFromParent()){
					updatePersistedObject(persistedValue, transientValue, valueEditMeta);
				}
			}
			
			//Find elements to delete
			for(Map.Entry<Object, Object> persistedEntry:idToPersistedValues.entrySet()){
				if(!changedObjectIds.contains(persistedEntry.getKey())){
					persistedValues.remove(persistedEntry.getValue());
				}
			}
			
			
			
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	@POST @Path("delete/{articleName}")
	@Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
	public void deleteDataRecords(@PathParam("articleName") String articleName, String idData) {
		ListViewMetaData listMetaData = uiConfiguration.getListViewMeta(articleName);
		if (listMetaData == null) {
			throw new NullPointerException("No list view configured for " + articleName);
		}
		
		String[] idArray = StringUtils.split(idData, ",");
		for(int i=0; i<idArray.length; i++){
			String id = null;
			if (StringUtils.isNotBlank(idArray[i])) {
				try {
					id = URLDecoder.decode(idArray[i], "UTF-8");
				} catch (UnsupportedEncodingException e) {	
					logger.error(e.getMessage(),e);
				}
			}
			if (StringUtils.isNotBlank(id)) {
				ColumnMetaData idColumn = listMetaData.getIdColumn();
				DataType dataType = DataType.valueOf(idColumn.getDataType());
				Object idObject = DataFormatUtil.parse(id, idColumn.getPropertyJavaType(), dataType);
				
				if (DataSourceType.DOCUMENT.equals(listMetaData.getDataSourceType())) {
					@SuppressWarnings("unchecked")
					
					Object entity = entityService.get(listMetaData.getEntityClass(), (Serializable)idObject);
					if(entity != null){
						entityService.delete(entity);
					}	 
				}else{ 
					boolean isDeletable = listViewDao.isDeletable(listMetaData, (Serializable)idObject);
					if (isDeletable) {
						@SuppressWarnings("unchecked")
						Object entity = entityService.get(listMetaData.getEntityClass(), (Serializable)idObject);
						if(entity != null){
							entityService.delete(entity);
						}	
					} else {
						//log with some effort to avoid any embarrassment
						String username = "";
						if (SecurityUtil.getCurrentUser() != null) {
							username = SecurityUtil.getCurrentUser().getUsername();
						}
						logger.warn("Delete operation is not permitted for article type {} with id {} for user {}", new Object[]{articleName, id, username});
						//then embarrass the UI developer! why on earth did you allow to delete at the first place??
						throw new UnauthorizedOperationException(I18NUtil.getMessage("error_delete_operation"));
					}
				}
			}					
		}
	}

	/**
	 * @param entityService
	 */
	@Autowired
	public void setEntityService(EntityService entityService) {
		this.entityService = entityService;
	}

	/**
	 * @param uiConfiguration
	 */
	@Autowired
	public void setUiConfiguration(UiConfiguration uiConfiguration) {
		this.uiConfiguration = uiConfiguration;
	}

	/**
	 * @param listViewDao
	 */
	@Autowired
	public void setListViewDao(ListViewDao listViewDao) {
		this.listViewDao = listViewDao;
	}

	/**
	 * @param listViewNosqlDao the listViewNosqlDao to set
	 */
	@Autowired
	public void setListViewNosqlDao(ListViewNosqlDao listViewNosqlDao) {
		this.listViewNosqlDao = listViewNosqlDao;
	}

	/**
	 * @param attachmentDao the attachmentDao to set
	 */
	@Autowired
	public void setAttachmentDao(AttachmentDao attachmentDao) {
		this.attachmentDao = attachmentDao;
	}
}
