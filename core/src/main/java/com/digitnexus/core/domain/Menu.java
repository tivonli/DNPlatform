package com.digitnexus.core.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.digitnexus.core.exception.DigitNexusRuntimeException;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.EditViewField;
import com.digitnexus.core.web.ui.config.annotation.ListViewColumn;
import com.digitnexus.core.web.ui.config.annotation.View;


/*
 * @author : Bill
 * Date : 2011-08-04 16:31
 * */
@Entity
@Table(name = "COMM_MENU")
@View
public class Menu  implements Serializable, Cloneable{
	/**
     * 
     */
    private static final long serialVersionUID = 1L;
	/* menu id */
	private int id;
	/* parent menu  id*/
	private int parentMenu;
	/* display name */
	private String name;
	/* group name */
	private String group;
	/* menu type */
	private String type;
	/* menu typeCode */
	private String typeCode;
	/* icon address */
	private String iconUrl;
	/* belong system */
//	private String belongSystem;
	/* is validate */
	private long isValid;
	/* content layout type */
	private String content;
	/* remark others info */
	private String remark;
	/* sub menu from way */
	private String subMenuFromWay;
	/* Tab layout template name */
	private String layoutTemplate;
	/*
	 * add jeff 
	 * to valid query from db or nosql
	 * 1: db;
	 * 2: mongdb
	 * 3:....
	 */
	private String fromSrc;
	
	@Id
	@Column(name = "id")
	@GenericGenerator(name = "idGenerator", strategy = "assigned")
	@GeneratedValue(generator = "idGenerator")
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@Column(name = "parent_id")
	public int getParentMenu() {
		return parentMenu;
	}
	public void setParentMenu(int parentMenu) {
		this.parentMenu = parentMenu;
	}
	
	@Column(name = "name", length = 32)
	@ListViewColumn(order = 10, widthPercentage = 32)
	@EditViewField(order = 10, dataType = DataType.STRING)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "menu_group", length = 50)
	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	
	@Column(name = "menu_type", length = 32)
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@Column(name = "type_code", length = 16)
	public String getTypeCode() {
		return typeCode;
	}
	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}
	
	@Column(name = "icon_url", length = 64)
	public String getIconUrl() {
		return iconUrl;
	}
	public void setIconUrl(String iconUrl) {
		this.iconUrl = iconUrl;
	}
//	public String getBelongSystem() {
//		return belongSystem;
//	}
//	public void setBelongSystem(String belongSystem) {
//		this.belongSystem = belongSystem;
//	}
	@Column(name = "is_valid", length = 1)
	public long getIsValid() {
		return isValid;
	}
	public void setIsValid(long isValid) {
		this.isValid = isValid;
	}
	@Column(name = "content", length = 32)
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	@Column(name = "remark", length = 100)
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	@Column(name = "from_src", length = 1)
	public String getFromSrc() {
		return fromSrc;
	}
	public void setFromSrc(String fromSrc) {
		this.fromSrc = fromSrc;
	}
	
	@Column(name = "sub_menu_from_way", length = 32)
	public String getSubMenuFromWay() {
		return subMenuFromWay;
	}
	public void setSubMenuFromWay(String subMenuFromWay) {
		this.subMenuFromWay = subMenuFromWay;
	}
	
	@Column(name = "layout_template", length = 32)
	public String getLayoutTemplate() {
		return layoutTemplate;
	}
	public void setLayoutTemplate(String layoutTemplate) {
		this.layoutTemplate = layoutTemplate;
	}
	
	public Menu clone() {
		try {
	        return ((Menu)super.clone());
        } catch (CloneNotSupportedException e) {
	        throw new DigitNexusRuntimeException(e);
        }
	}
}
