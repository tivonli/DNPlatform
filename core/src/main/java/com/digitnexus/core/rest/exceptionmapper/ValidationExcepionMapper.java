package com.digitnexus.core.rest.exceptionmapper;

import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.springframework.stereotype.Component;

@Component
@Provider
public class ValidationExcepionMapper implements ExceptionMapper<ValidationException> {

	@Override
	public Response toResponse(ValidationException exception) {
		return Response.status(Status.INTERNAL_SERVER_ERROR)
				.entity(exception.getMessage())
				.type(MediaType.TEXT_PLAIN)
				.build();
	}

}
