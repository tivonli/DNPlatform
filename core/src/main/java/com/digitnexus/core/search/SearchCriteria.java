/**
 * 
 */
package com.digitnexus.core.search;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.criterion.Criterion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digitnexus.core.i18n.I18NUtil;
import com.digitnexus.core.web.ui.config.annotation.DataType;
import com.digitnexus.core.web.ui.config.annotation.SearchOperator;
import com.digitnexus.core.web.ui.config.dataobject.ItemMetaData;
import com.digitnexus.core.web.ui.config.dataobject.SearchMetaData;

/**
 * This class has is for handling different search and sort cases and create
 * Hibernate {@link Criterion} accordingly. As this class handles sorting also,
 * SearchCriteria a misnomer. However still decide to continue with the name as
 * other appropriate options seems to be conflicting with standard public APIs.
 * 
 * @author Santanu
 * 
 * Support to save search criteria. This can be defined at development time which will be shown as
 * option in List View tool bar and also can be used to filter article selection view. Storing this criteria in db
 * to support saving User searches in future.
 * 
 * @author adi
 */
@Entity
@Table(name="search_criteria",uniqueConstraints = { @UniqueConstraint(columnNames = { "entity_name", "name" }) })
@NamedQueries(value={@NamedQuery(name=SearchCriteria.FIND_BY_ENTITY_NAME_AND_NAME,query ="from SearchCriteria where entityName=? and name=?"),
		@NamedQuery(name=SearchCriteria.FIND_BY_ENTITY_NAME,query ="from SearchCriteria where entityName=?")})
public class SearchCriteria {
	
	public static final String FIND_BY_ENTITY_NAME_AND_NAME="searchCriteria.findByEntityNameAndName";
	public static final String FIND_BY_ENTITY_NAME="searchCriteria.findByEntityName";

	private final static Logger logger = LoggerFactory.getLogger(SearchCriteria.class);

	// the SearchMetaData object - this might be null if this is for sorting
	// only however, if searching is involved this cannot be null
	private SearchMetaData searchMeta;
	// list of filter criteria derived from the get request
	private List<FilterExpressionDescription> filterExpressions	= new LinkedList<FilterExpressionDescription>();
	private FilterExpressionDescription	geofilterExpression;
	// list of sort criteria derived from the get request
	private List<SortExpressionDescription>	sortExpressions	= new LinkedList<SortExpressionDescription>();
	
	private long id;
	private String name;
	//Entity/article for which this criteria is defined
	private String entityName;
	//Is this the default criteria for the above entity
	private boolean defaultCriteria;
	//i18n key from properties file
	private String displayKey;
	//Display name retrieved from display key. Not saved to db
	private String displayName;
	//Indicates if it is visible in UI
	private boolean visible=true;

	public SearchCriteria(){
		
	}

	private SearchCriteria(SearchMetaData searchMeta) {
		this.searchMeta = searchMeta;
	}
    
	/**
	 * @return the searchMeta
	 */
	@Transient
	public SearchMetaData getSearchMeta() {
		return searchMeta;
	}

	@Id
	@GenericGenerator(name = "idGenerator", strategy = "com.digitnexus.core.id.PojoIdGeneratorHibernate")
	@GeneratedValue(generator = "idGenerator")
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	@Column(name="name",nullable=false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
    
	@Column(name = "entity_name",nullable=false)
	public String getEntityName() {
		return entityName;
	}

	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}
    
	@Column(name = "default_criteria")
	@Type(type = "yes_no")
	public boolean isDefaultCriteria() {
		return defaultCriteria;
	}

	public void setDefaultCriteria(boolean defaultCriteria) {
		this.defaultCriteria = defaultCriteria;
	}

	@Transient
	public SearchCriteria sortCriteria(String name, boolean ascending) {
		sortExpressions.add(new SortExpressionDescription(name, ascending));
		return this;
	}

	@SuppressWarnings("rawtypes")
	@Transient
	public SearchCriteria filterCriteria(String name, Object value, Object toValue, SearchOperator searchOperator, DataType dataType,
			Class javaType) {
		filterExpressions.add(new FilterExpressionDescription(name, value, toValue, searchOperator, dataType, javaType));
		return this;
	}
	
	@Transient
	public SearchCriteria filterCriteria(String name, Object value, Object toValue, SearchOperator searchOperator, DataType dataType) {
		return this.filterCriteria(name, value, toValue, searchOperator, dataType, null);
	}

	@OneToMany(fetch = FetchType.EAGER,orphanRemoval=true, cascade=CascadeType.ALL)
	@Fetch(FetchMode.SUBSELECT)//Made this subselect because hibernate can not handle two joins
	@JoinTable(name = "srchcriteria_sortexpr")//Oracle complains about long name, so this shortcut
	public List<SortExpressionDescription> getSortExpressions() {
		return sortExpressions;
	}

	public void setSortExpressions(List<SortExpressionDescription> sortExpressions) {
		this.sortExpressions = sortExpressions;
	}

	@OneToMany(fetch = FetchType.EAGER,orphanRemoval=true, cascade=CascadeType.ALL)
	@Fetch(FetchMode.JOIN)
	@JoinTable(name = "srchcriteria_fltrexpr")//Oracle complains about long name, so this shortcut
	public List<FilterExpressionDescription> getFilterExpressions() {
		return filterExpressions;
	}

	public void setFilterExpressions(List<FilterExpressionDescription> filterExpressions) {
		this.filterExpressions = filterExpressions;
	}
	
	@Column(name = "display_key",nullable=false)
	public String getDisplayKey() {
		return displayKey;
	}

	public void setDisplayKey(String displayKey) {
		this.displayKey = displayKey;
		//Retrieve the actual value only if this is not transient
		if(id!=0){
			displayName=I18NUtil.getMessage(displayKey);
		}
	}
	
	@Transient
	public String getDisplayName() {
		return displayName;
	}
	
	
	public void addFilterExpression(FilterExpressionDescription filterExpressionDescription){
		getFilterExpressions().add(filterExpressionDescription);
	}
	
	/**
	 * This is for jibx
	 */
	@Transient
	public Iterator<FilterExpressionDescription> getFilterExpressionsIterator(){
		return getFilterExpressions().iterator();
	}
	
	public void addSortExpression(SortExpressionDescription sortExpressionDescription){
		getSortExpressions().add(sortExpressionDescription);
	}
	
	/**
	 * This is for jibx
	 */
	@Transient
	public Iterator<SortExpressionDescription> getSortExpressionsIterator(){
		return getSortExpressions().iterator();
	}

	/**
	 * Factory method to create {@link SearchCriteria} object
	 * 
	 * @param queryParams
	 * @param searchMeta
	 * @return
	 */
	public static SearchCriteria createSearchCriteria(MultivaluedMap<String, String> queryParams, SearchMetaData searchMeta) {
		SearchCriteria searchCriteria = new SearchCriteria(searchMeta);
		if (MapUtils.isNotEmpty(queryParams)) {
			if (searchMeta != null) {
				List<ItemMetaData> searchItems = searchMeta.getFields();
				for (ItemMetaData searchItem : searchItems) {
					if (queryParams.containsKey(searchItem.getName())) {
						SearchOperator operator = queryParams.getFirst(searchItem.getName() + "_criteria") == null ? null : SearchOperator
								.valueOf(queryParams.getFirst(searchItem.getName() + "_criteria"));
						String lowerLimit = decode(queryParams.getFirst(searchItem.getName()));
						String upperLimit = decode(queryParams.getFirst(searchItem.getName() + "_max"));
						// second check is the one we should avoid for sure
						if (operator == null || (StringUtils.isBlank(lowerLimit) && StringUtils.isBlank(upperLimit))) {
							continue;
						}
                        if(operator==SearchOperator.GEOIN||operator==SearchOperator.GEONOIN){
                        	searchCriteria.setGeofilterExpression(new FilterExpressionDescription(searchItem.getName(), lowerLimit, upperLimit, operator,  DataType.valueOf(searchItem.getDataType()),searchItem.getPropertyJavaType()));
                        }else{
						searchCriteria.filterCriteria(searchItem.getName(), splitIfRequired(lowerLimit, operator),
								splitIfRequired(upperLimit, operator), operator, DataType.valueOf(searchItem.getDataType()),
								searchItem.getPropertyJavaType());
                        }
					}
				}
			}
			
			setSortCriteria(queryParams, searchCriteria);
			
		}
		return searchCriteria;
	}
	
	public static void setSortCriteria(MultivaluedMap<String, String> queryParams, SearchCriteria searchCriteria) {
		// check for the sorting parameter possibly passed
		String sortColumnsParameter = decode(queryParams.getFirst("sortColumns"));
		String sortOrderParameter = decode(queryParams.getFirst("sortOrder"));
		// these two might be comma separated strings for multi column
		// sorting
		if (StringUtils.isNotBlank(sortColumnsParameter)) {
			String[] sortColumns = (StringUtils.isNotBlank(sortColumnsParameter)) ? sortColumnsParameter.split(",") : new String[0];
			String[] sortOrders = sortOrderParameter.split(",");
			// typically these two arrays should be of same length, however
			// take safe guard if not
			if (sortColumns.length != sortOrders.length) {
				String[] newSortOrders = new String[sortColumns.length];
				if (sortColumns.length > sortOrders.length) {
					System.arraycopy(sortOrders, 0, newSortOrders, 0, sortOrders.length);
				} else {
					System.arraycopy(sortOrders, 0, newSortOrders, 0, sortColumns.length);
				}
				sortOrders = newSortOrders;
			}
			// now iterate over the columns and create the sort expressions
			for (int i = 0; i < sortColumns.length; i++) {
				if (StringUtils.isNotBlank(sortColumns[i])) {
					searchCriteria.sortCriteria(sortColumns[i], "asc".equalsIgnoreCase(sortOrders[i]));
				}
			}
		}

	}

	/**
	 * Decode the passed string using UTF-8
	 * 
	 * @param encodedString
	 * @return
	 */
	public static String decode(String encodedString) {
		// i would prefer to have just a not null check here...
		if (StringUtils.isNotBlank(encodedString)) {
			try {
				return URLDecoder.decode(encodedString, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				// warn and ignore
				logger.warn("UTF-8 is not supported! The encoded string in question is " + encodedString, e);
			}
		}
		return null;
	}

	private static Object splitIfRequired(String value, SearchOperator operator) {
		if (StringUtils.isNotBlank(value) && SearchOperator.IN.equals(operator)) {
			return value.split(",");
		}
		return value;
	}
    
	@Column(name = "visible")
	@Type(type = "yes_no")
	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}
	
	public static void convertTypes(SearchCriteria searchCriteria, SearchMetaData searchMeta) {
		Map<String, ItemMetaData> nameToMeta=new HashMap<String, ItemMetaData>(searchMeta.getFields().size());
		for(ItemMetaData itemMetaData:searchMeta.getFields()){
			nameToMeta.put(itemMetaData.getName(), itemMetaData);
		}
		
		for(FilterExpressionDescription filterExpression:searchCriteria.filterExpressions){
			ItemMetaData itemMetaData=nameToMeta.get(filterExpression.getName());
			filterExpression.setDataType( DataType.valueOf(itemMetaData.getDataType()));
			filterExpression.setJavaType(itemMetaData.getPropertyJavaType());
			
			filterExpression.setLowerLimit(filterExpression.converDataType(splitIfRequired(filterExpression.getLowerLimitValue(),filterExpression.getSearchOperator()), filterExpression.getDataType()));
			
			if(StringUtils.isNotEmpty(filterExpression.getUpperLimitValue())){
				filterExpression.setUpperLimit(filterExpression.converDataType(splitIfRequired(filterExpression.getUpperLimitValue(),filterExpression.getSearchOperator()), filterExpression.getDataType()));
			}
			
		}
		
		
		
	}
	
	
	@Transient
	public FilterExpressionDescription getGeofilterExpression() {
		return geofilterExpression;
	}

	public void setGeofilterExpression(
			FilterExpressionDescription geofilterExpression) {
		this.geofilterExpression = geofilterExpression;
	}

	
	 
	
	@Transient
	public String toKey(){
		StringBuffer sb=new StringBuffer();
		sb.append(this.name).append('_').append(this.entityName).append('_');
		for(FilterExpressionDescription filterExpression:filterExpressions){
			 sb.append(filterExpression.getName()).append('_').append(filterExpression.getSearchOperator().name()).append('_')
			 .append(filterExpression.getLowerLimit()).append('_').append(filterExpression.getUpperLimit()).append('_');
		}
		if(this.geofilterExpression!=null){
			FilterExpressionDescription filterExpression=this.geofilterExpression;
			 sb.append(filterExpression.getName()).append('_').append(filterExpression.getSearchOperator().name()).append('_')
			 .append(filterExpression.getLowerLimit()).append('_').append(filterExpression.getUpperLimit()).append('_');
		}
		for(SortExpressionDescription sortExpression:sortExpressions){
			 sb.append(sortExpression.getName()).append('_').append(sortExpression.isAscending()).append('_');
		}
		return sb.toString();
	}
	
	 
}
