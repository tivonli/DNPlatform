/**
 * 
 */
package com.digitnexus.core.freemarker;

/**
 * Used to wrap checked exception during freemarker template processing
 * @author Adi
 *
 */
public class FreemarkerPorcessingException extends RuntimeException {
	private static final long	serialVersionUID	= 1L;

	public FreemarkerPorcessingException(String message, Throwable throwable) {
		super(message, throwable);
	}

}
