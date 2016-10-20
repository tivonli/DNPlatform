package com.digitnexus.core.rest.exceptionmapper;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.springframework.stereotype.Component;

import com.digitnexus.core.entity.EntityValidationException;
import com.digitnexus.core.json.JsonUtil;

@Component
@Provider
public class EntityValidationExceptionMapper implements ExceptionMapper<EntityValidationException> {

	@Override
	public Response toResponse(EntityValidationException exception) {
		return Response.status(Status.INTERNAL_SERVER_ERROR)
				       .entity(JsonUtil.toJson(exception.getMessagesByField().asMap()))
				       .type(MediaType.APPLICATION_JSON)
				       .build();
	}

}
