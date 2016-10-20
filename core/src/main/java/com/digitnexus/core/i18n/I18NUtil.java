package com.digitnexus.core.i18n;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;

import com.digitnexus.core.spring.ServiceLocator;

public class I18NUtil {

//	private MessageSource messageSource = ServiceLocator
//	        .getService(MessageSource.class);

	public static final Locale DEFAULT_LOCALE = Locale.ENGLISH;

	public static final Logger LOGGER = LoggerFactory.getLogger(I18NUtil.class);
	
	private static MessageSource messageSource;

	private I18NUtil() {
	}

	/**
	 * Get message in User's Locale. If User's locale is not found, defaults to
	 * Locale.ENGLISH
	 * 
	 * @param key
	 * @param args
	 * @return localized message if found, otherwise returns key
	 */
	public static String getMessage(String key, Object... args) {
		return getMessage(key, args, (String) null);
	}

	/**
	 * Get the message in the locale obtained from {@link LocaleContextHolder}.
	 * If the message is not found then the default value is returned
	 * 
	 * @param key
	 * @param args
	 * @param defaultValue
	 * @return
	 */
	public static String getMessage(String key, Object[] args,
	        String defaultValue) {
		return getMessage(key, args, defaultValue,
		        LocaleContextHolder.getLocale());
	}

	/**
	 * Gets the message based on the locale passed with the key. If the message
	 * is not found then null is returned.
	 * 
	 * @param key
	 * @param args
	 * @param locale
	 * @return
	 */
	public static String getMessage(String key, Object[] args, Locale locale) {
		return getMessage(key, args, null, locale);
	}

	/**
	 * Message with key for the passed locale is returned. The passed arguments
	 * are replaced in case applicable. The passed default value is returned if
	 * no message found.
	 * 
	 * @param key
	 * @param args
	 * @param defaultValue
	 * @param locale
	 * @return
	 */
	public static String getMessage(String key, Object[] args,
	        String defaultValue, Locale locale) {
		try {
			return getMessageSource().getMessage(key, args, (defaultValue == null) ? key : defaultValue,
			        locale);
		} catch (NoSuchMessageException e) {
			// doubt if this is a relevant code
			LOGGER.warn(e.getMessage(), e);
		}
		return key;
	}

	/**
	 * Finds a message based on the key passed. Logged in user locale is used.
	 * Null is returned if no message is found.
	 * 
	 * @param key
	 * @return
	 */
	public static String getMessage(String key) {
		return getMessage(key, (Object) null);
	}

	public static MessageSource getMessageSource() {
		if(messageSource==null){
			messageSource= ServiceLocator.getService(MessageSource.class);
		}
		return messageSource;
	}

}
