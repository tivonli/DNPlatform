package com.digitnexus.core.nosql.exception;

/**
 * Thrown when could not connect to the file store
 * @author Santanu
 */
public class NoSqlFileStoreException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public NoSqlFileStoreException(String message, Throwable cause) {
		super(message, cause);
	}
}
