package com.digitnexus.core.rest.exceptionmapper;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.springframework.stereotype.Component;

import com.digitnexus.core.web.service.StaleDataException;

@Component
@Provider
public class StaleDataExceptionMapper extends AbstractExceptionMapper implements ExceptionMapper<StaleDataException> {

	@Override
	public Response toResponse(StaleDataException exception) {
		return super.getResponse(exception);
	}

}
