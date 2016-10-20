/**
 * 
 */
package com.digitnexus.core.nosql.exception;

/**
 * @author Santanu
 */
public class NoFileFoundException extends RuntimeException {

	private static final long serialVersionUID = -8402962070478364304L;

	/**
	 * @param message
	 */
	public NoFileFoundException(String message) {
		super(message);
	}
}
