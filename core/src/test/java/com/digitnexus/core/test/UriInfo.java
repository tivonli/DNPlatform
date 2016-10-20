package com.digitnexus.core.test;

import java.net.URI;
import java.util.List;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.UriBuilder;

import com.sun.jersey.core.util.MultivaluedMapImpl;

/**
 * Used for testing rest services. Currently used only for Query Parameters. 
 * @author adi
 *
 */
public class UriInfo implements javax.ws.rs.core.UriInfo {
	

    private MultivaluedMap<String, String> queryParams=new MultivaluedMapImpl();


	@Override
	public String getPath() {
		return null;
	}

	@Override
	public String getPath(boolean decode) {
		return null;
	}

	@Override
	public List<PathSegment> getPathSegments() {
		return null;
	}

	@Override
	public List<PathSegment> getPathSegments(boolean decode) {
		return null;
	}

	@Override
	public URI getRequestUri() {
		return null;
	}

	@Override
	public UriBuilder getRequestUriBuilder() {
		return null;
	}

	@Override
	public URI getAbsolutePath() {
		return null;
	}

	@Override
	public UriBuilder getAbsolutePathBuilder() {
		return null;
	}

	@Override
	public URI getBaseUri() {
		return null;
	}

	@Override
	public UriBuilder getBaseUriBuilder() {
		return null;
	}

	@Override
	public MultivaluedMap<String, String> getPathParameters() {
		return null;
	}

	@Override
	public MultivaluedMap<String, String> getPathParameters(boolean decode) {
		
		 return getPathParameters(true);
	}

	@Override
	public MultivaluedMap<String, String> getQueryParameters() {
		return queryParams;
	}

	@Override
	public MultivaluedMap<String, String> getQueryParameters(boolean decode) {
		return getQueryParameters();
	}
	
	public UriInfo putQueryParameter(String key,String value){
		queryParams.putSingle(key, value);
		return this;
	}

	@Override
	public List<String> getMatchedURIs() {
		return null;
	}

	@Override
	public List<String> getMatchedURIs(boolean decode) {
		return null;
	}

	@Override
	public List<Object> getMatchedResources() {
		return null;
	}

}
