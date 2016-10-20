package com.digitnexus.core.rest.exceptionmapper;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.springframework.stereotype.Component;

import com.digitnexus.core.web.exception.UnauthorizedOperationException;

@Component
@Provider
public class UnauthorizedOperationMapper extends AbstractExceptionMapper implements ExceptionMapper<UnauthorizedOperationException> {

	@Override
	public Response toResponse(UnauthorizedOperationException exception) {
		return super.getResponse(exception);
	}

}
