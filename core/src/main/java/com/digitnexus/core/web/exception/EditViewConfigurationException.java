/**
 * 
 */
package com.digitnexus.core.web.exception;

/**
 * @author Santanu
 */
public class EditViewConfigurationException extends RuntimeException {

	private static final long serialVersionUID = -305968228483320968L;

	/**
	 * @param message
	 */
	public EditViewConfigurationException(String message) {
		super(message);
	}

	/**
	 * @param cause
	 */
	public EditViewConfigurationException(Throwable cause) {
		super(cause);
	}

	/**
	 * @param message
	 * @param cause
	 */
	public EditViewConfigurationException(String message, Throwable cause) {
		super(message, cause);
	}
}
