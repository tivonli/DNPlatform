
package com.digitnexus.core.exception;

public class UnrecoverableException extends RuntimeException {

	private static final long	serialVersionUID	= 1L;

	public UnrecoverableException(Exception e) {
        super(e);
    }

    public UnrecoverableException(String s) {
        super(s);
    }

    public UnrecoverableException(String s, Throwable t) {
        super(s, t);
    }

}
