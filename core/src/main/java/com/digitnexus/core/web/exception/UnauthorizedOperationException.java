/**
 * 
 */
package com.digitnexus.core.web.exception;

/**
 * @author Santanu
 *
 */
public class UnauthorizedOperationException extends RuntimeException {

	private static final long serialVersionUID = 8929285217517724426L;

	/**
	 * 
	 */
	public UnauthorizedOperationException() {
		super();
	}

	/**
	 * @param message
	 * @param cause
	 */
	public UnauthorizedOperationException(String message, Throwable cause) {
		super(message, cause);
	}

	/**
	 * @param message
	 */
	public UnauthorizedOperationException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public UnauthorizedOperationException(Throwable cause) {
		super(cause);
	}

	/* (non-Javadoc)
	 * @see java.lang.Throwable#getLocalizedMessage()
	 */
	@Override
	public String getLocalizedMessage() {
		return super.getLocalizedMessage();
	}
}
