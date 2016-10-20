package com.digitnexus.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * To store info required for password rest during forgot password
 * @author Adi
 *
 */
@Entity
@Table(name="PASSWORD_RESET_INFO")
@NamedQuery(name="PasswordResetInfo.deleteExpired",query="delete from PasswordResetInfo where createdDate < :date24hourAgo" )
public class PasswordResetInfo extends DataObject {
	private static final long	serialVersionUID	= 1L;
	
	private String	uuid;
	private String	userName;
	
	public PasswordResetInfo(){
		
	}
	
	public PasswordResetInfo(String uuid, String userName) {
		super();
		this.uuid = uuid;
		this.userName = userName;
	}

    @Id
    @Column(name="uuid")
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getUserName() {
		return userName;
	}
    
	@Column(name="username",nullable=false)
	public void setUserName(String userName) {
		this.userName = userName;
	}
   
}
