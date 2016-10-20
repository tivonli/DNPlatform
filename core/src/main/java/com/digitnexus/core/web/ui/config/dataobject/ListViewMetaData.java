/**
 * 
 */
package com.digitnexus.core.web.ui.config.dataobject;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.digitnexus.core.i18n.I18NUtil;

/**
 * Meta information for rendering list view of a entity. When you add any new property to this class, make sure it is copied in 
 * copy constructor as well.
 * @author Santanu
 */
public class ListViewMetaData {

	@SuppressWarnings("rawtypes")
	private transient Class				entityClass;
	private String						name;
	//datasource detail, this will tell which db to look at for this object
	private String dataSourceName;
	private DataSourceType dataSourceType;
	private String displayKey;
	private String displayName;
	private String group;
	private ColumnMetaData idColumn = null;
	// list of column this table is going to display
	private List<ColumnMetaData> columns = new ArrayList<ColumnMetaData>();
	//for the case of edit view this might be a association list view meta data. 
	//for such a case this is the field of the parent object
	private FieldMetaData parentField;
	// Meta data indicating user's permissions
	private boolean createPermission = true;
	private boolean deletePermission = true;
	private boolean editPermission = true;

	private boolean createFromParent = false;
	private List<SearchCriteriaMeta> searchCriteriaMetas = new ArrayList<SearchCriteriaMeta>();
	// Indicates whether search criteria dropdown should be show in list view
	private boolean showSearchCriteria;
	private List<OrderByMeta> orderByMeta;
	// Name of the property which is used to identify flex field configuration.
	// Usefull to edit view when a row is selected in list view
	private String flexConfigDescriminatorProperty;

	private boolean readOnly;
	
	public ListViewMetaData(){
		
	}
	
	@SuppressWarnings("rawtypes")
	public ListViewMetaData(String name, Class entityClass, String displayKey, String group) {
		this.name = name;
		this.entityClass = entityClass;
		this.displayKey = displayKey;
		this.group = group;
	}

	/**
	 * Copy constructor used for cloning.
	 * 
	 * @param anotherListViewMeta
	 */
	public ListViewMetaData(ListViewMetaData anotherListViewMeta) {
		this.name = anotherListViewMeta.name;
		if (anotherListViewMeta.idColumn != null) {
			this.idColumn = new ColumnMetaData(anotherListViewMeta.idColumn);
		}
		this.entityClass = anotherListViewMeta.entityClass;
		this.dataSourceName = anotherListViewMeta.dataSourceName;
		this.dataSourceType = anotherListViewMeta.dataSourceType;
		this.displayKey = anotherListViewMeta.displayKey;
		this.group = anotherListViewMeta.group;
		for (ColumnMetaData column : anotherListViewMeta.columns) {
			columns.add(new ColumnMetaData(column));
		}
		this.parentField = anotherListViewMeta.parentField;
		this.createFromParent = anotherListViewMeta.createFromParent;
		
		this.searchCriteriaMetas=anotherListViewMeta.searchCriteriaMetas;
		this.showSearchCriteria=anotherListViewMeta.showSearchCriteria;
		this.orderByMeta=anotherListViewMeta.orderByMeta;
		this.flexConfigDescriminatorProperty=anotherListViewMeta.flexConfigDescriminatorProperty;
		this.readOnly=anotherListViewMeta.readOnly;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@SuppressWarnings("rawtypes")
	public Class getEntityClass() {
		return entityClass;
	}

	@SuppressWarnings("rawtypes")
	public void setEntityClass(Class entityClass) {
		this.entityClass = entityClass;
	}

	/**
	 * @return the dataSourceName
	 */
	public String getDataSourceName() {
		return dataSourceName;
	}

	/**
	 * @param dataSourceName the dataSourceName to set
	 */
	public void setDataSourceName(String dataSourceName) {
		this.dataSourceName = dataSourceName;
	}

	/**
	 * @return the dataSourceType
	 */
	public DataSourceType getDataSourceType() {
		return dataSourceType;
	}

	/**
	 * @param dataSourceType the dataSourceType to set
	 */
	public void setDataSourceType(DataSourceType dataSourceType) {
		this.dataSourceType = dataSourceType;
	}

	public String getDisplayKey() {
		if (StringUtils.isBlank(displayKey)) {
			displayKey = entityClass.getName();
		}
		return displayKey;
	}

	public void setDisplayKey(String displayKey) {
		this.displayKey = displayKey;
	}

	/**
	 * @return the displayName
	 */
	public String getDisplayName() {
		if (StringUtils.isBlank(displayName)) {
			displayName = I18NUtil.getMessage(getDisplayKey(), null, StringUtils.capitalize(name.substring(name.lastIndexOf(".") + 1)));
		}
		return displayName;
	}

	public String getGroup() {
		return group;
	}

	public List<ColumnMetaData> getColumns() {
		return columns;
	}

	public void setColumns(List<ColumnMetaData> columns) {
		this.columns = columns;
	}

	public ColumnMetaData getIdColumn() {
		return idColumn;
	}

	public void addColumn(ColumnMetaData column) {
		if (columns == null) {
			columns = new ArrayList<ColumnMetaData>();
		}
		columns.add(column);
	}

	public void setIdColumn(ColumnMetaData primaryKey) {
		this.idColumn = primaryKey;
	}

	public boolean isCreatePermission() {
		return createPermission;
	}

	public void setCreatePermission(boolean createPermission) {
		this.createPermission = createPermission;
	}

	public boolean isDeletePermission() {
		return deletePermission;
	}

	public void setDeletePermission(boolean deletePermission) {
		this.deletePermission = deletePermission;
	}

	public boolean isCreateFromParent() {
		return createFromParent;
	}

	public void setCreateFromParent(boolean createFromParent) {
		this.createFromParent = createFromParent;
	}

	public boolean isEditPermission() {
		return editPermission;
	}

	public void setEditPermission(boolean editPermission) {
		this.editPermission = editPermission;
	}

	public List<SearchCriteriaMeta> getSearchCriteriaMetas() {
		return searchCriteriaMetas;
	}

	public void setSearchCriteriaMetas(List<SearchCriteriaMeta> searchCriteriaMetas) {
		this.searchCriteriaMetas = searchCriteriaMetas;
	}

	public boolean isShowSearchCriteria() {
		return showSearchCriteria;
	}

	public void setShowSearchCriteria(boolean showSearchCriteria) {
		this.showSearchCriteria = showSearchCriteria;
	}

	public List<OrderByMeta> getOrderByMeta() {
		return orderByMeta;
	}

	public void setOrderByMeta(List<OrderByMeta> orderByMeta) {
		this.orderByMeta = orderByMeta;
	}

	public String getFlexConfigDescriminatorProperty() {
		return flexConfigDescriminatorProperty;
	}

	public void setFlexConfigDescriminatorProperty(String flexConfigDescriminatorProperty) {
		this.flexConfigDescriminatorProperty = flexConfigDescriminatorProperty;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	/**
	 * @return the parentField
	 */
	public FieldMetaData getParentField() {
		return parentField;
	}

	/**
	 * @param parentField the parentField to set
	 */
	public void setParentField(FieldMetaData parentField) {
		this.parentField = parentField;
	}
}
