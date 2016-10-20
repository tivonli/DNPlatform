/**
 * 
 */
package com.digitnexus.core.acl.service;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digitnexus.core.acl.ast.ASTNode;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformer;
import com.digitnexus.core.acl.ast.transformer.AclExpressionTransformerFactory;
import com.digitnexus.core.acl.dao.AccessControlDao;
import com.digitnexus.core.acl.dataobject.AclExpression;
import com.digitnexus.core.acl.dataobject.AclExpressionAssociation;
import com.digitnexus.core.domain.Permission;
import com.digitnexus.core.domain.UserOperation;
import com.digitnexus.core.json.JsonUtil;
import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.service.EditViewService;
import com.digitnexus.core.web.service.ListViewService;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * @author Santanu
 *
 */
@Service
@Path("acl")
public class AclServiceImpl implements AclService {
	
	private ListViewService listViewService;
	private EditViewService editViewService;
	private AccessControlDao accessControlDao;
	private AclExpressionParser aclExpressionParser;
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#getAclListDataCount(javax.ws.rs.core.UriInfo)
	 */
	@GET @Path("list/count") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getAclListDataCount(@Context UriInfo uriInfo) {
		return listViewService.getListDataCount(AclExpression.class.getName(), uriInfo);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#getAclListData(javax.ws.rs.core.UriInfo, java.lang.Integer, java.lang.Integer)
	 */
	@GET @Path("list/data") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getAclListData(@Context UriInfo uriInfo,
			@QueryParam("page") Integer pageIndex, @QueryParam("pageSize") Integer pageSize) {
		return listViewService.getListDataResponse(AclExpression.class.getName(), uriInfo, pageIndex, pageSize);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#getAclEditData(java.lang.String)
	 */
	@GET @Path("edit") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getAclEditData(@QueryParam("id") String id) {
		return editViewService.getArticleDataResponse(AclExpression.class.getName(), id);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#getAclAssignments(java.lang.String)
	 */
	@GET @Path("assignment") @Produces(MediaType.APPLICATION_JSON)
	@Override
	public String getAclAssignments(@QueryParam("id") String id) {
		List<AclExpressionAssociation> expressionAssociations = accessControlDao.findAclExpressionAssociations(Long.parseLong(id));
		return JsonUtil.toJson(expressionAssociations);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#saveAclAssignments(java.lang.String, java.lang.String)
	 */
	@PUT @Path("assignment") @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
	public void saveAclAssignments(@QueryParam("id") String idString, String jsonString) {
		Long id = (Long) DataFormatUtil.parse(idString, Long.class, DataType.LONG);
		AclExpression aclExpression = accessControlDao.load(AclExpression.class, id);
		
		List<AclExpressionAssociation> newExpressionAssociations = JsonUtil.toList(jsonString, AclExpressionAssociation.class);
		//set the AclExpression to the new association objects
		for (AclExpressionAssociation newExpressionAssociation:newExpressionAssociations) {
			newExpressionAssociation.setAclExpression(aclExpression);
			//if no resource is set the set it from the permission object
			if (StringUtils.isBlank(newExpressionAssociation.getResource())) {
				Permission permission = accessControlDao.load(Permission.class, newExpressionAssociation.getPermission().getName());
				newExpressionAssociation.setResource(permission.getResource());
			}
		}
		
		List<AclExpressionAssociation> expressionAssociations = accessControlDao.findAclExpressionAssociations(id);

//			for (AclExpressionAssociation expressionAssociation:expressionAssociations) {
//				//remove the existing object from the new list, if no such object exists then the list remains unchanged
//				newExpressionAssociations.remove(expressionAssociation);
//			}		
//			//save all remaining objects in the list
//			accessControlDao.saveOrUpdateAll(newExpressionAssociations);

		//delete all expressionAssociations
		accessControlDao.deleteAll(expressionAssociations);
		
		//save new expressionAssociations
		accessControlDao.saveOrUpdateAll(newExpressionAssociations);
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.digitnexus.core.acl.service.AclService#applyAclExpression(java.lang.String, java.lang.String, 
	 * 							com.digitnexus.core.domain.UserOperation, com.digitnexus.core.dao.query.HQLQuery)
	 */
	@Override
	public <T> T applyAclExpression(String secureResourceName, String primaryResourceName, UserOperation operation, T query) {
		List<AclExpression> aclExpressions = accessControlDao.findAclExpressionsForCurrentUser(secureResourceName, primaryResourceName, operation);
		AclExpressionTransformer<T> transformer = AclExpressionTransformerFactory.getSearchCriteriaTransformer(query);
		for (AclExpression aclExpression:aclExpressions) {
			ASTNode ast = aclExpressionParser.parseAclExpression(aclExpression);
			query = transformer.transform(ast, query);
		}
		
		return query;
	}
	
	/**
	 * @param listViewService the listViewService to set
	 */
	@Autowired
	public void setListViewService(ListViewService listViewService) {
		this.listViewService = listViewService;
	}

	/**
	 * @param editViewService the editViewService to set
	 */
	@Autowired
	public void setEditViewService(EditViewService editViewService) {
		this.editViewService = editViewService;
	}

	/**
	 * @param accessControlDao the accessControlDao to set
	 */
	@Autowired
	public void setAccessControlDao(AccessControlDao accessControlDao) {
		this.accessControlDao = accessControlDao;
	}

	/**
	 * @param aclExpressionParser the aclExpressionParser to set
	 */
	@Autowired
	public void setAclExpressionParser(AclExpressionParser aclExpressionParser) {
		this.aclExpressionParser = aclExpressionParser;
	}
}
