/**
 * 
 */
package com.digitnexus.core.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.UnhandledException;

import com.digitnexus.core.util.DataFormatUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;

/**
 * @author Santanu
 *
 */
@MappedSuperclass
public class PersistedObjectInformation {
	//type of the task triggering object
	private String objectTypeName;
	//type of the id field
	private String idTypeName;
	//id of the task triggering object
	private String idString;
	/**
	 * @return the objectTypeName
	 */
	@Column(name="object_type", length=200)
	public String getObjectTypeName() {
		return objectTypeName;
	}
	/**
	 * @param objectTypeName the objectTypeName to set
	 */
	public void setObjectTypeName(String objectTypeName) {
		this.objectTypeName = objectTypeName;
	}
	/**
	 * @return the idTypeName
	 */
	@Column(name="id_type", length=200)
	public String getIdTypeName() {
		return idTypeName;
	}
	/**
	 * @param idTypeName the idTypeName to set
	 */
	public void setIdTypeName(String idTypeName) {
		this.idTypeName = idTypeName;
	}
	/**
	 * @return the idString
	 */
	@Column(name="id_string", length=1024)
	public String getIdString() {
		return idString;
	}
	/**
	 * @param idString the idString to set
	 */
	public void setIdString(String idString) {
		this.idString = idString;
	}
	/**
	 * @return
	 */
	@Transient
	@SuppressWarnings("rawtypes")
	public Serializable getPersistedId() {
		if (StringUtils.isNotBlank(idTypeName)
				&& StringUtils.isNotBlank(idString)) {
			try {
				Class idType = Class.forName(idTypeName);
				return (Serializable)DataFormatUtil.localeIndependentParse(idString, idType, 
						DataType.dataTypeForJavaType(idType));
			} catch (ClassNotFoundException e) {
				throw new UnhandledException(e);
			}
		}
		return null;
		
	}
	/**
	 * @param persistedId
	 */
	public void setPersistedId(Serializable persistedId) {
		if (persistedId != null) {
			setIdTypeName(persistedId.getClass().getName());
			setIdString(DataFormatUtil.toLocaleIndependentJson(persistedId));
		} else {
			setIdTypeName(null);
			setIdString(null);
		}
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		return objectTypeName.hashCode() & idString.hashCode();
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof PersistedObjectInformation) {
			PersistedObjectInformation another = (PersistedObjectInformation)obj;
			return this.objectTypeName.equals(another.objectTypeName) 
					&& this.idTypeName.equals(another.idTypeName)
					&& this.idString.equals(another.idString);
		}
		return false;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return objectTypeName.substring(objectTypeName.lastIndexOf('.') + 1) + "#" + idString;
	}
}
