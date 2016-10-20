package com.digitnexus.core.test.dataobjects;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang.StringUtils;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.digitnexus.core.domain.DataObject;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.View;

/**
 * @author Hugh
 */
@Entity @Table(name = "LOCATION")
@View(displayKey="Location", group="masterData.organisation")
public class Location extends DataObject {

	private static final long serialVersionUID = 1L;
    private LocationId locationId;
	private String text;
	private String latCoor;
	private String lonCoor;
	private String addrLine1;
	private String addrLine2;
	private String city;
	private String state;
	private String country;

    @Id  
	@Embedded
    @AttributeOverrides( {
            @AttributeOverride(name="id", column = @Column(name="id") ),
            @AttributeOverride(name="typecode", column = @Column(name="typecode") )
    } )
	public LocationId getLocationId() {
		return locationId;
	}

	public void setLocationId(LocationId locationId) {
		this.locationId = locationId;
	}

	@Column(name = "text")
	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Column(name = "lat_coor")
	public String getLatCoor() {
		return this.latCoor;
	}

	public void setLatCoor(String latCoor) {
		this.latCoor = latCoor;
	}

	@Column(name = "lon_coor")
	public String getLonCoor() {
		return this.lonCoor;
	}

	public void setLonCoor(String lonCoor) {
		this.lonCoor = lonCoor;
	}

	@Column(name = "addr_line1")
	public String getAddrLine1() {
		return this.addrLine1;
	}

	public void setAddrLine1(String addrLine1) {
		this.addrLine1 = addrLine1;
	}

	@Column(name = "addr_line2")
	@ListViewColumn(displayKey="Address", order=0, widthPercentage=25)
	@EditViewField(displayKey="Address", order=0)
	@Length(max=128)
	@NotBlank
	public String getAddrLine2() {
		return this.addrLine2;
	}

	public void setAddrLine2(String addrLine2) {
		this.addrLine2 = addrLine2;
	}

	@Column(name = "city")
	@ListViewColumn(displayKey="City", order=1, widthPercentage=20)
	//@EditViewField(displayKey="City", order=1, length=128, mandatory=MandatoryType.TRUE)
	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name = "state")
	@ListViewColumn(displayKey="State", order=2, widthPercentage=20)
	//@EditViewField(displayKey="State", order=2, length=128, mandatory=MandatoryType.TRUE)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "country")
	@ListViewColumn(displayKey="Country", order=3, widthPercentage=20)
	//@EditViewField(displayKey="Country", order=3, length=128, mandatory=MandatoryType.TRUE)
	public String getCountry() {
		return this.country;
	}

	public void setCountry(String country) {
		this.country = country;
	}


	@Override
	public String toString() {
		return getAddrLine1() 
		+ (StringUtils.isNotBlank(getCity())? ", " + getCity():"")
		+ (StringUtils.isNotBlank(getState())? ", " + getState():"")
		+ (StringUtils.isNotBlank(getCountry())? ", " + getCountry():"");
	}
}
