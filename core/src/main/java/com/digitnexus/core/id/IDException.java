package com.digitnexus.core.id;

public class IDException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public IDException(String message, Throwable cause) {
		super(((message == null || "".equals(message.trim())) ? "" : message
				+ ". ")
				+ (cause == null ? "" : cause.getMessage()), cause);
	}
	
	public IDException(String message) {
		super(message);
	}
}
