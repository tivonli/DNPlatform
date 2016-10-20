package com.digitnexus.core.rest.datahandler.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.hibernate.type.SingleColumnType;
import org.hibernate.type.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.digitnexus.core.dao.BaseDao;
import com.digitnexus.core.entity.EntityConfigurationService;
import com.digitnexus.core.entity.EntityService;
import com.google.gson.Gson;

/**
 * 
 * @author adi
 * 
 */
@Path("/entity/{entityName}/")
@Component
@Scope("request")
public class EntityDataHandler {
	private static final String ENTITY_NAME_PARAM="entityName";
	@Autowired
	private EntityService						entityService;
	@Inject
	@Named("baseDao")
	private BaseDao								baseDao;
	@Autowired
	private EntityConfigurationService			entityConfigurationService;


	@GET
	@Path("/id/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntityAsJson(@PathParam(ENTITY_NAME_PARAM) String entityName, @PathParam("id") String idString) {
		return new Gson().toJson(getEntity(entityName, idString));
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getEntitiesAsJson(@PathParam(ENTITY_NAME_PARAM) String entityName, @Context UriInfo uriInfo) {
		return new Gson().toJson(getEntities(entityName, uriInfo));
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response save(@PathParam(ENTITY_NAME_PARAM) String entityName, String content) {
		return Response.ok(new Gson().toJson(saveOrMerge(entityName, content, false)), MediaType.APPLICATION_JSON).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	public Response update(@PathParam(ENTITY_NAME_PARAM) String entityName, String content) {
		return Response.ok(new Gson().toJson(saveOrMerge(entityName, content, true)), MediaType.APPLICATION_JSON).build();
	}

	@DELETE
	@Path("/id/{id}")
	public void deleteEntity(@PathParam(ENTITY_NAME_PARAM) String entityName, @PathParam("id") String idString) {
		Object entity = getEntity(entityName, idString);
		if (entity != null) {
			entityService.delete(entity);
		}
	}

	public Object saveOrMerge(String entityName, String content, boolean isMerge) {
		Object entity = null;
		Class<?> entityType = entityConfigurationService.getClassByEntityName(entityName);
		if (entityType != null) {
			entity = new Gson().fromJson(content, entityType);
			if (isMerge) {
				//to be persistence
				entity=baseDao.get(entity.getClass(), baseDao.getIdentifier(entity));
				entityService.merge(entity);
			} else {
				entityService.saveOrUpdate(entity);
			}

		}

		return entity;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Object> getEntities(String entityName, UriInfo uriInfo) {
		PersistentClass persistentClass = entityConfigurationService.getPersistentClassByEntityName(entityName);

		if (persistentClass == null) {
			// TODO:Throw proper exception
			return null;
		}

		Class<?> entityClass = persistentClass.getMappedClass();

		List entities = new ArrayList();

		MultivaluedMap<String, String> queryParaMeters = uriInfo.getQueryParameters();

		if (queryParaMeters.isEmpty()) {
			entities = entityService.getAll(entityClass);
		} else {
			// TODO:Handle associations
			int firstResult = -1;
			int maxResults = -1;
			DetachedCriteria detachedCriteria = DetachedCriteria.forClass(entityClass);
			for (String key : queryParaMeters.keySet()) {
				if (key.equals("firstResult")) {
					firstResult = Integer.parseInt(queryParaMeters.getFirst(key));
				} else if (key.equals("maxResults")) {
					maxResults = Integer.parseInt(queryParaMeters.getFirst(key));
				} else {
					List<String> values = queryParaMeters.get(key);

					if (!values.isEmpty()) {
						// Convert values from String to specific data type
						// before setting it to parameters of detached
						// criteria

						Property property = persistentClass.getProperty(key);
						if (property != null && property.getValue().isSimpleValue()) {
							Type type = property.getValue().getType();
							if (type instanceof SingleColumnType) {
								SingleColumnType singleColumnType = (SingleColumnType) type;
								List<Object> convertedValues = new ArrayList<Object>();
								for (String value : values) {
									convertedValues.add(singleColumnType.fromStringValue(value));
								}

								// Set it to criteria
								if (convertedValues.size() == 1) {
									detachedCriteria.add(Restrictions.eq(key, convertedValues.get(0)));

								} else {
									detachedCriteria.add(Restrictions.in(key, convertedValues));
								}
							}

						}

					}
				}

			}

			entities = baseDao.findByCriteria(detachedCriteria, firstResult, maxResults);
		}

		return entities;
	}

	public Object getEntity(String entityName, String idString) {
		Class<?> entityClass =entityConfigurationService.getClassByEntityName(entityName);
		if (entityClass == null) {
			// TODO:Throw proper exception
			return null;
		}

		Serializable identifier = entityConfigurationService.getIdentifier(entityName, idString);

		return entityService.get(entityClass, identifier);
	}

	public void setEntityService(EntityService entityService) {
		this.entityService = entityService;
	}

	public void setBaseDao(BaseDao baseDao) {
		this.baseDao = baseDao;
	}

	public void setEntityConfigurationService(
			EntityConfigurationService entityConfigurationService) {
		this.entityConfigurationService = entityConfigurationService;
	}
	
}
