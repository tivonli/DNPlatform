package com.digitnexus.core.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang.LocaleUtils;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.DisplayType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.OrderBy;
import com.digitnexus.core.web.ui.config.annotation.SearchColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * @author adi
 */
@Entity
@Table(name = "Users",uniqueConstraints = { @UniqueConstraint(columnNames = { "email" }) })
@View(group = "admin.user",orderBy={@OrderBy(name="username",ascending=true)},layoutColumns=2)
@NamedQuery(name="User.findUsersByRoles",query="select user from User as user inner join user.roles as role where role.id=?" )
@XmlRootElement(name = "user")
@Component
public class User extends DataObject implements UserDetails {

	private static final long		serialVersionUID		= 1L;
	
	private String					username;
	private String					password;
	private String					fullName;
	private String					email;
	private boolean					accountNonExpired		= true;
	private boolean					accountNonLocked		= true;
	private boolean					credentialsNonExpired	= true;
	private boolean					enabled					= true;
	private List<GrantedAuthority>	authorities				= new ArrayList<GrantedAuthority>();
	private String					mobile;
	private String					addrLine1;
	private String					addrLine2;
	private String					city;
	private String					state;
	private String					country;
	private String					postalCode;
	private String					bphone;
	private Long					employeeId;
	private Long					bpemployeeId;
	private Long					userGrp;
	private boolean					passwordTemporary;
	private String					localeString			= I18NUtil.DEFAULT_LOCALE.toString();
	private Locale					locale					= I18NUtil.DEFAULT_LOCALE;
	private Set<Role>				roles					= new HashSet<Role>();
	private Organization			organization;
	
	
	@Id @Column(name = "user_name")
	@ListViewColumn(order = 0, widthPercentage = 50,associationListProperty=true)
	@EditViewField(order = 0)
	@SearchColumn(order = 0, basic = true)
	@Length(max=64)
	@NotEmpty
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "password", nullable = false)
	@XmlTransient
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "full_name", nullable = false)
	@EditViewField(order = 1)
	@Length(max=64)
	@NotEmpty
	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	@Column(name = "email", nullable = false, unique = true)
	@EditViewField(order = 2)
	@Length(max=64)
	@Email
	@NotEmpty
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "account_non_locked", nullable = false)
	@Type(type = "yes_no")
	@XmlTransient
	public boolean isAccountNonLocked() {
		return accountNonLocked;
	}

	public void setAccountNonLocked(boolean accountNonLocked) {
		this.accountNonLocked = accountNonLocked;
	}

	@Transient
	@EditViewField(order = 10)
	@XmlTransient
	public boolean isAccountLocked() {
		return !isAccountNonLocked();
	}

	public void setAccountLocked(boolean accountLocked) {
		setAccountNonLocked(!accountLocked);
	}
	
	@Column(name = "credentials_non_expired", nullable = false)
	@Type(type = "yes_no")
	@XmlTransient
	public boolean isCredentialsNonExpired() {
		return credentialsNonExpired;
	}

	public void setCredentialsNonExpired(boolean credentialsNonExpired) {
		this.credentialsNonExpired = credentialsNonExpired;
	}

	@Transient
	@EditViewField(order = 11)
	@XmlTransient
	public boolean isCredentialsExpired() {
		return !isCredentialsNonExpired();
	}
	
	public void setCredentialsExpired(boolean credentialsExpired) {
		setCredentialsNonExpired(!credentialsExpired);
	}
	
	@Column(name = "enabled", nullable = false)
	@Type(type = "yes_no")
	@EditViewField(order = 12)
	@XmlTransient
	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	@Transient
	@XmlTransient
	public List<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(List<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	@Column(name = "account_non_expired", nullable = false)
	@Type(type = "yes_no")
	@XmlTransient
	public boolean isAccountNonExpired() {
		return accountNonExpired;
	}

	public void setAccountNonExpired(boolean accountNonExpired) {
		this.accountNonExpired = accountNonExpired;
	}

	@Transient
	@EditViewField(order = 13)
	@XmlTransient
	public boolean isAccountExpired() {
		return !isAccountNonExpired();
	}

	public void setAccountExpired(boolean accountExpired) {
		setAccountNonExpired(!accountExpired);
	}
	
	@Column(name = "mobile")
	@EditViewField(order = 3)
	@Length(max=16)
	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "addr_line1")
	@EditViewField(order = 4)
	@Length(max=128)
	public String getAddrLine1() {
		return this.addrLine1;
	}

	public void setAddrLine1(String addrLine1) {
		this.addrLine1 = addrLine1;
	}

	@Column(name = "addr_line2")
	@EditViewField(order = 5)
	@Length(max=128)
	public String getAddrLine2() {
		return this.addrLine2;
	}

	public void setAddrLine2(String addrLine2) {
		this.addrLine2 = addrLine2;
	}

	@Column(name = "city")
	@EditViewField(order = 6)
	@Length(max=64)
	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name = "state")
	@EditViewField(order = 7)
	@Length(max=64)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "country")
	@EditViewField(order = 8)
	@Length(max=64)
	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	@Column(name = "postalcode")
	@EditViewField(order = 9)
	@Length(max=32)
	public String getPostalCode() {
		return this.postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	@Column(name = "bphone")
	public String getBphone() {
		return this.bphone;
	}

	public void setBphone(String bphone) {
		this.bphone = bphone;
	}

	@Column(name = "employee_id")
	public Long getEmployeeId() {
		return this.employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	@Column(name = "bemployee_id")
	public Long getBpemployeeId() {
		return this.bpemployeeId;
	}

	public void setBpemployeeId(Long bpemployeeId) {
		this.bpemployeeId = bpemployeeId;
	}

	@Column(name = "user_grp")
	public Long getUserGrp() {
		return this.userGrp;
	}

	public void setUserGrp(Long userGrp) {
		this.userGrp = userGrp;
	}

	@Column(name = "password_temporary", nullable = false)
	@Type(type = "yes_no")
	@XmlTransient
	public boolean isPasswordTemporary() {
		return passwordTemporary;
	}

	public void setPasswordTemporary(boolean passwordTemporary) {
		this.passwordTemporary = passwordTemporary;
	}

	@Column(name = "localeString", columnDefinition = "varchar(20) default 'en'", nullable = false)
	@EditViewField(order = 13,values={"en:en","zh_CN:zh_CN"})
	@XmlTransient
	@NotEmpty
	public String getLocaleString() {
		return localeString;
	}

	public void setLocaleString(String localeString) {
		this.localeString = localeString;
	}

	@Transient
	@XmlTransient
	public Locale getLocale() {
		if (!locale.toString().equals(localeString)) {
			locale = LocaleUtils.toLocale(localeString);
		}
		return locale;
	}

	public void setLocale(Locale locale) {
		assert locale != null;
		setLocaleString(locale.toString());
	}
	
	@ManyToMany(fetch=FetchType.EAGER)
	@Fetch(FetchMode.JOIN)
    @JoinTable(name="users_roles")
	@EditViewField(order = 19,dataType=DataType.COLLECTION,referenceProperty="name",displayType=DisplayType.MULTI_SELECT)
	@XmlTransient
	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
	
	public void addRole(Role role){
		roles.add(role);
	}
	
	/**
	 * @return the organization
	 */
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="org_id")
	@EditViewField(order = 20,referenceProperty="name",displayType=DisplayType.ARTICLE_DROPDOWN)
	public Organization getOrganization() {
		return organization;
	}

	/**
	 * @param organization the organization to set
	 */
	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof User){
			return username.equals(((User)obj).getUsername());
		}
		return false;
	}
	
	@Override
	public int hashCode() {
		return username.hashCode();
	}

}
