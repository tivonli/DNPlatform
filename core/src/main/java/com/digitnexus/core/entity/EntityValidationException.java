package com.digitnexus.core.entity;

import javax.validation.ValidationException;

import org.apache.commons.lang.StringUtils;

import com.google.common.collect.SetMultimap;

public class EntityValidationException extends ValidationException {

	private static final long	serialVersionUID	= 1L;
	
	private SetMultimap<String, String>	messagesByField;

	private EntityValidationException(String message) {
		super(message);
	}
		
	
	public static void throwEntityValidationException(SetMultimap<String, String>	messagesByField){
		StringBuilder builder=new StringBuilder();
		
		for(String key:messagesByField.keySet()){
			for(String message:messagesByField.get(key)){
				if(StringUtils.isNotEmpty(key)){
					builder.append(key+":"+message);
				}else{
					builder.append(message);
				}
			}
		}
		
		EntityValidationException entityValidationException=new EntityValidationException(builder.toString());
		entityValidationException.messagesByField=messagesByField;
		throw entityValidationException;
	}


	public SetMultimap<String, String> getMessagesByField() {
		return messagesByField;
	}


	
	
	

}
