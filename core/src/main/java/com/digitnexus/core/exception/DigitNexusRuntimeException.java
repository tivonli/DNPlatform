package com.digitnexus.core.exception;

public class DigitNexusRuntimeException extends RuntimeException {

	private static final long	serialVersionUID	= 1L;

	public DigitNexusRuntimeException() {
	}

	public DigitNexusRuntimeException(String message) {
		super(message);
	}

	public DigitNexusRuntimeException(Throwable cause) {
		super(cause);
	}

	public DigitNexusRuntimeException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public static void throwException(Exception exception){
		throw new DigitNexusRuntimeException(exception);
	}

}
