package com.digitnexus.core.rest.exceptionmapper;

import java.util.Collections;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.digitnexus.core.json.JsonUtil;

public abstract class AbstractExceptionMapper {
	public javax.ws.rs.core.Response getResponse(Throwable exception) {
		return Response.status(Status.INTERNAL_SERVER_ERROR)
			       .entity(JsonUtil.toJson(JsonUtil.toJson(Collections.singletonMap("all", new String[]{exception.getMessage()}))))
			       .type(MediaType.APPLICATION_JSON)
			       .build();
	};

}
