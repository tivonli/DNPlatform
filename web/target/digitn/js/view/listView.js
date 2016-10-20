window.ListView = Backbone.DigitNexusView.extend({
    map: null,
    dataTypeVsClass:{
       'STRING': 'ui-datatable-data-string',
            'INTEGER': 'ui-datatable-data-integer',
            'BOOLEAN': 'ui-datatable-data-boolean',
            'REFERENCE': 'ui-datatable-data-url' 
    },
    dataTable:null,
    multiSelect:true,
    showIdColumn:true,
    lastMarker: null,
   
    initialize: function() {
        //Indicates whether the contains configuration
        this.containsFlexConfig = false;
        //List meta data is passed directly incase of article selector
        if (this.options.map) {
            this.map = this.options.map;
        }
        this.initArticleName();
        this.initDataUrls();
        this.id = this.generateId();
        this.$el.attr({
            id: this.id,
            'style': 'width:100%;clear:both;'
        });
      
        if (this.options.multiSelect !== undefined) {
            this.multiSelect = this.options.multiSelect;
        }

        if (this.options.showIdColumn !== undefined) {
            this.showIdColumn = this.options.showIdColumn;
        }
        //this Variable is datatable js draw the table callback function, we can give the set function..
        this.fnDrawCallback = null;
        //if the atOnceGetBackendData is true ,the list view will request backend data after the render the list view wrapper,
        //if the atOnceGetBackendData is false,the list view will request backend data when the canRequestBackendData is true;
        this.atOnceGetBackendData = true;
        if(this.options.atOnceGetBackendData !== undefined){
        	this.atOnceGetBackendData = this.options.atOnceGetBackendData;
        }
        //the flag is get  backend data ...
        this.canRequestBackendData=false;
        this.displayIndex=null;
    },

    initArticleName: function() {
        if (!this.options.articleListMeta) {
            this.articleName = this.model.remark;
            this.articleListMeta = null;
            if (typeof this.model.referArticleName != 'undefined') {
                this.articleListMeta = ArticleListMeta.getMetaWidthParentArticle(this.articleName, this.model.referArticleName);
            } else {
                this.articleListMeta = ArticleListMeta.getMeta(this.articleName);
            }
            this.configDescriminatorProperty = this.articleListMeta.flexConfigDescriminatorProperty;
            if (this.configDescriminatorProperty != null) {
                this.containsFlexConfig = true;
            }
        } else {
            this.articleName = this.options.articleListMeta.name;
            this.articleListMeta = this.options.articleListMeta;
        }

    },

    initDataUrls: function() {

        this.dataUrl = this.options.dataUrl;
        if (!this.dataUrl) {
            if (this.model.referenceId) {
                this.dataUrl = '/article/list/data/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&idValue=' + this.model.referenceId;
            } else if (this.model.hiddenField) {


                var layerIdEqual = this.model.hiddenField.fieldName + "_criteria=EQUAL&" + this.model.hiddenField.fieldName + "=" + this.model.hiddenField.fieldValue;
                // this.dataUrl = '/article/list/data/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName +"&"+this.model.hiddenField.fieldName+"="+this.model.hiddenField.fieldValue;
                // this.dataUrl = '/article/list/data/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&idValue=' + this.model.referenceId;
                this.dataUrl = '/article/list/data/' + this.articleName + "?" + layerIdEqual;
            } else {
                this.dataUrl = '/article/list/data/' + this.articleName;
            }

        }

        this.dataCountUrl = this.options.dataCountUrl;
        if (!this.dataCountUrl) {
            if (this.model.referenceId) {
                this.dataCountUrl = '/article/list/data/count/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&idValue=' + this.model.referenceId;
            } else if (this.model.hiddenField) {
                //	 this.dataCountUrl = '/article/list/data/count/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&'+this.model.hiddenField.fieldName+"="+this.model.hiddenField.fieldValue;
                var layerIdEqual = this.model.hiddenField.fieldName + "_criteria=EQUAL&" + this.model.hiddenField.fieldName + "=" + this.model.hiddenField.fieldValue;
                this.dataCountUrl = '/article/list/data/count/' + this.articleName + "?" + layerIdEqual;
            } else {
                this.dataCountUrl = '/article/list/data/count/' + this.articleName;
            }
        }

    },

    setFnDrawCallback: function(fnDrawCallback) {
        this.fnDrawCallback = fnDrawCallback;
    },
    setReferenceDataUrls: function() {
        this.dataUrl = '/article/list/data/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&idValue=' + this.model.referenceId;
        this.dataCountUrl = '/article/list/data/count/listviewassociation/' + this.model.remark + '?sourceArticle=' + this.model.referArticleName + '&idValue=' + this.model.referenceId;
    },

    render: function() {
        if (this.articleListMeta) {
            if (this.$el[0].parentNode != null) {
                this.makeTable(this.articleListMeta);
            } else {
                //We will wait until parent node is part of browser dom otherwise
                //jquery data tables can not find place to add the data tables wrapper
                var self = this;
                var intervalId = setInterval(function() {
                    if (self.$el[0].parentNode != null) {
                        clearInterval(intervalId);
                        self.makeTable(self.articleListMeta);
                    }
                }, 5);

            }
        } /*else{*The caller should make explicit call to makeTable*}*/
        return this;

    },

    generateId: function() {
        return this.articleName.replace(/\./g, '_') + '_list' + ListView._currentId++;
    },

    makeTable: function(metaData) {
        //TODO:The following block is for legacy code which explicitly call this method.
        if (!this.rendered) {
            this.rendered = true;
        } else {
            return;
        }

        this.defaultFilterId = this.getDefaultFilterId(metaData);

        //Assign meta data
        this.metaData = metaData;
        var self = this;

        var tableContentHtml = '<thead><tr><th></th>';
        var columnDefs = this.getColumnDefs(metaData, tableContentHtml);
        tableContentHtml += "</thead><tbody></tbody>";


        var aaSorting = this.getSortingConfig(columnDefs);
        var topId = this.id + "_top";
        var sDomCustom = this.getCustomDom(topId);
        this.columnDefs = columnDefs;

        this.createDataTable(aaSorting, columnDefs, sDomCustom);

        this.createListTop(topId);

        // getting 2 level up parent div which for getting the next footer div
        var parentDivContainer = $("#" + this.$el[0].id + "_wrapper").parent();
        //This is to redraw columns if width changes
        this.currentWidth = 0;
        parentDivContainer.resize(function() {
            var width = parentDivContainer.width();
            if (self.currentWidth !== width) {
                self.currentWidth = width;
                self.dataTable.fnAdjustColumnSizing(false);
            }
        });
    },

    createDataTable: function(aaSorting, columnDefs, sDomCustom) {
        this.dataTable = this.$el.dataTable(this.createDataTableOptions(aaSorting,columnDefs,sDomCustom));
    },

    createDataTableOptions: function(aaSorting, columnDefs, sDomCustom) {
        var self = this;
        return {
            "bSortClasses": false,
            //this is necessary for performance
            "bSort": true,
            "aaSorting": aaSorting,
            "bServerSide": true,
            "bProcessing": true,
            //this is to show busy icon while paging and sorting
            "sAjaxSource": this.dataUrl,
            //server url to fetch data
            "fnServerData": function(sSource, aoData, fnCallback) { //function to load paginated data
                self.loadPaginatedData(sSource, aoData, fnCallback, this);
            },
            "bJQueryUI": true,
            //using for styling
            "sPaginationType": "input",
            //paging style, have to be custom for our purpose
            "bFilter": this.options.showFooterInfo ? this.options.showFooterInfo : false,
            //we do not want the default filtering
            "aoColumnDefs": columnDefs,
            //column definitions from the meta data passed
            "sDom": sDomCustom,
            //format of the surrounding container - <> means empty div on the top
            //this has to be replaced by the toolbar. t means the table
            //F is for footer. i is for current page information, p is for
            //page changing widgets
            "bInfo": false,
            "sScrollY": "100px",
            "iDisplayLength":10,
            "aLengthMenu": [[10, 20, 30, 50], [10, 20, 30, 50]],            
            "oLanguage": {
                "sEmptyTable": table_label_EmptyTable,
                "sLengthMenu": table_label_left+" _MENU_ "+table_label_right
            },
            "fnDrawCallback": function(oSettings) { //invoke the fnDrawCallback function ;if the fnDrawCallback is not null.
                if (self.fnDrawCallback) {
                    self.fnDrawCallback(oSettings);
                }
                
                
            },
            "fnHeaderCallback": function(nHead, aData, iStart, iEnd, aiDisplay) {
                self.handleHeaderDraw();

            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
               return self.handleRowDraw(nRow, aData, iDisplayIndex);
            }
        };

    },

    getPageSize: function(){
    	var $tableListView = $(this.options.el).parent();
    	var _pageSize = Math.floor($tableListView.height()/30);
    	return _pageSize;
    },

    handleHeaderDraw: function() {
    	var self = this;
        $('#' + this.id + '_check_all').click(function() {
            for (var i = 0; i < self.dataTable.fnGetData().length; i++) {
                if (this.checked) {
                    $('input[idColumn=true]', self.dataTable.fnGetNodes(i)).attr('checked', this.checked);
                } else {
                    $('input[idColumn=true]', self.dataTable.fnGetNodes(i)).attr('checked', this.checked);
                }

                self.fireArticleChecked();
            }
        });
    },

    handleRowDraw: function(nRow, aData, iDisplayIndex) {
        var self = this;
        this.clickType = "click";
        $(nRow).click(function(ee) {
        	self.clickType = "click";
            self.handleRowClick(nRow,aData, iDisplayIndex);
            
        });
        
        $(nRow).dblclick(function(ee) {
        	self.clickType = "dbclick";
            self.handleRowClick(nRow,aData, iDisplayIndex);
        });
        
        $(nRow).hover(function(ee) {
            self.handleRowMouseover(nRow,aData, iDisplayIndex); 
        });
        //for check box column
        this.renderIdColumn(aData[0], nRow);
        //based on the data type we might choose to change the display of the table cell
        //if self.showIdColumn is false,the td index start at 0
        for (var i = 1; i < aData.length; i++) {
            this.generateUIForTableCell(nRow, aData[i], this.showIdColumn ? i : (i - 1), this.columnArray[i], this, iDisplayIndex);
        }
        return nRow;
    },

    handleRowClick: function(nRow,aData, iDisplayIndex) {
        var aTrs = this.dataTable.fnGetNodes();
        var currentRow = $(aTrs[iDisplayIndex]);
       
        //Clear previous selection if current selected row is not same as previous selected row
        var selectedRows = this.dataTable.find('.row_selected');
        if (selectedRows.length > 0) {
            var selected = $(selectedRows[0]);
            selected.removeClass('row_selected');
        }

        currentRow.addClass('row_selected');
        this.displayIndex = iDisplayIndex;
        //When selected the row, select the radio input also
        if (this.showIdColumn) {
            if (!this.multiSelect) {
               // this.$el.find('input[idcolumn="true"]').attr("checked", "false");
                currentRow.find('input[idcolumn="true"]').attr("checked", "checked");
            }
        }
        this.fireArticleSelection();
        
        for (var i = 1; i < aData.length; i++) {
            var col = this.columnArray[i];
            var displayType = col.displayType;
            if (displayType == "POINT") {
                var points = aData[i];
                if (this.map && points) {

                    var ind = points.indexOf("(");
                    var end = points.indexOf(" ");
                    var lon = points.substring(ind + 1, end);
                    var ind = points.indexOf(")");
                    var lat = points.substring(end + 1, ind);


                    this.map.map.setCenter(new OpenLayers.LonLat(lon, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"), this.map.map.getProjectionObject()));
                    if (this.lastMarker) {
                        this.lastMarker.setImg();
                    }
                    nRow.marker.highImg("skins/common/images/map/marker.png");
                    this.lastMarker = nRow.marker;
                }
            }
        }
    },
    
    handleRowMouseover: function(nRow,aData, iDisplayIndex) {
    	 
        
        for (var i = 1; i < aData.length; i++) {
            var col = this.columnArray[i];
            var displayType = col.displayType;
            if (displayType == "POINT") {
                var points = aData[i];
                if (this.map && points) {

                    var ind = points.indexOf("(");
                    var end = points.indexOf(" ");
                    var lon = points.substring(ind + 1, end);
                    var ind = points.indexOf(")");
                    var lat = points.substring(end + 1, ind);


                    this.map.map.setCenter(new OpenLayers.LonLat(lon, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"), this.map.map.getProjectionObject()));
                    if (this.lastMarker) {
                        this.lastMarker.setImg();
                    }
                    nRow.marker.highImg("skins/common/images/map/marker.png");
                    this.lastMarker = nRow.marker;
                }
            }
        }
    },

    renderIdColumn: function(data, nRow) {
        var self=this;
        //for check box column
        if (this.showIdColumn) {
            var idHtml = '';
            if (this.multiSelect) {
                idHtml = "<input type='checkbox' value='" + data + "' idColumn=true ></input>";
            } else {
                idHtml = "<input type='radio' value='" + data + "' idColumn=true name='" + this.id + "_radioGroup' ></input>";
            }

            $('td:eq(0)', nRow).html(idHtml).bind('click', function() {
                self.fireArticleChecked();
            });

        }
    },

    getColumnDefs: function(metaData, tableContentHtml) {
        var columnArray = [];
        columnArray[0] = metaData.idColumn;
        for (var j = 0; j < metaData.columns.length; j++) {
            columnArray[j + 1] = metaData.columns[j];
        }

        this.columnArray = columnArray;

        var columnDefs = [];

        if (this.multiSelect) {
            columnDefs[0] = {
                "aTargets": [0],
                //which column index does it effect
                "sTitle": "<input type='checkbox' id = '" + this.id + "_check_all' name = 'check_all' />",
                "sClass": this.getClassForTableData('STRING'),
                //class - should be based on the data type
                "sWidth": "5%",
                "sName": columnArray[0].name,
                "bSortable": false,
                "bVisible": this.showIdColumn
            };
        } else {
            //Make it text and keep it hidden
            columnDefs[0] = {
                "aTargets": [0],
                //which column index does it effect
                "sTitle": "<input type='hidden' id = '" + this.id + "_check_all' name = 'check_all' />",
                "sClass": this.getClassForTableData('STRING'),
                //class - should be based on the data type
                "sWidth": "10%",
                "sName": columnArray[0].name,
                "bSortable": false,
                "bVisible": this.showIdColumn
            };
        }


        var columnsLength = columnArray.length;
        for (var i = 1; i < columnsLength; i++) {
            var columnMeta = columnArray[i];
            tableContentHtml += "<th id='" + columnMeta.name + "'></th>";

            columnDefs[i] = {
                "aTargets": [i],
                //which column index does it effect
                "sTitle": (columnMeta.displayName) ? columnMeta.displayName : columnMeta.displayKey,
                //title of the column..TODO temporary fix
                "sClass": this.getClassForTableData(columnMeta.dataType),
                //class - should be based on the data type
                "sWidth": columnMeta.sizePercentage,
                "sName": columnMeta.name,
                "bSortable": columnMeta.sortable,
                "bVisible": !columnMeta.hidden
            };

            //Store the index of flex config configDescriminatorProperty property
            if (this.containsFlexConfig && columnMeta.name == this.configDescriminatorProperty) {
                this.configDescriminatorPropertyIndex = i;
            }
        }

        return columnDefs;

    },

    getSortingConfig: function(columnDefs) {
        //Set default sorting
        var orderyByColumns = this.metaData.orderByMeta;
        var aaSorting = null;
        if (orderyByColumns !== undefined && orderyByColumns !== null && orderyByColumns.length > 0) {
            var columnDefsLength = columnDefs.length;
            var orderByColumnsLength = orderyByColumns.length;
            aaSorting = new Array(orderyByColumns.length);
            for (var i = 1; i < columnDefsLength; i++) {
                var columnDef = columnDefs[i];
                for (var j = 0; j < orderByColumnsLength; j++) {
                    var orderyColumn = orderyByColumns[j];
                    if (orderyColumn.name === columnDef.sName) {
                        if (orderyColumn.ascending) {
                            aaSorting[j] = [i, 'asc'];
                        } else {
                            aaSorting[j] = [i, 'desc'];
                        }
                    }
                    break;
                }
            }
        } else {
            aaSorting = [
                [1, 'desc']
            ];
        }

        return aaSorting;
    },

    getCustomDom: function(topId) {

        var sDomCustom = '';
        if (this.options.showListToolbar || (this.options.showListToolbar == null) || (this.options.showListToolbar == undefined)) {
            sDomCustom = '<"#' + topId + '">rt';
        } else {
            sDomCustom = 'rt';
        }

        if (this.options.showPagination || (this.options.showPagination == null) || (this.options.showPagination == undefined)) {
            sDomCustom += '<"F"ilp>';
            this.paginated = true;
        } else {
            this.options.showFooterInfo = false;
            this.paginated = false;
        }
        return sDomCustom;

    },

    createListTop: function(topId) {
        if (this.options.createListTop) {
            this.toolbarEl = $('#' + topId);

            var listToolBarOptions = {
                model: this.metaData,
                toolbarEl: this.toolbarEl,
                articleSummary: this.model,
                listView: this
            };
            
            if(this.options.justRenderSearchView !== null && this.options.justRenderSearchView !== undefined){
            	listToolBarOptions['justRenderSearchView'] = this.options.justRenderSearchView;
            }

            var listToolBar = ListToolBar.getView(this.articleName, listToolBarOptions);
            if (!listToolBar) {
                new ListToolBar(listToolBarOptions).render();
            }
        }
    },

    getDefaultFilterId: function(metaData) {
        var defaultFilterId = this.options.defaultFilterId;
        if (defaultFilterId !== undefined && defaultFilterId !== "0" && defaultFilterId !== "-1") {
            return defaultFilterId;
        }

        var searchMetas = metaData.searchCriteriaMetas;
        if (searchMetas !== undefined && searchMetas !== null) {
            for (var i = 0; i < searchMetas.length; i++) {
                var searchCriteria = searchMetas[i];
                if (searchCriteria.defaultCriteria) {
                    return searchCriteria.id;
                }
            }
        }
        return null;
    },

    getClassForTableData: function(dataType) {
        var className = this.dataTypeVsClass[dataType];
        if (className) {
            return className;
        }
        return 'ui-datatable-data-string';
    },

    loadPaginatedData: function(sSource, aoData, fnCallback, dataTable) {
    	if(this.atOnceGetBackendData){
    		this.loadPaginatedDataAtOnce(sSource, aoData, fnCallback, dataTable);
    	}else{
    		var self = this;
        	var intervalId = setInterval(function() {
                if (self.canRequestBackendData) {
                    clearInterval(intervalId);
                    //**********************************************//
                    var _pageSize = self.getPageSize();
              //      self.setValueByKey(aoData, "iDisplayLength",_pageSize);
                    //here is set the _iDisplayLength = _pageSize for 
                    //oPagination fnUpdate method calculate page count keep consistent with here
                    //dataTable.dataTableSettings[0]._iDisplayLength = _pageSize;
                    var oSettings = dataTable.fnSettings();
            //        oSettings._iDisplayLength = _pageSize;
                    //**********************************************//
                    self.loadPaginatedDataAtOnce(sSource, aoData, fnCallback, dataTable);
                    //here is settings to at once get data from backend again draw table.
                    self.atOnceGetBackendData = true;
                    self.canRequestBackendData = false;
                }
            }, 5);
    	}
    },
    
    loadPaginatedDataAtOnce: function(sSource, aoData, fnCallback, dataTable){
    	
    	var self = this;
        this.setDataCount(this.articleName);
        var params = this.getRequestParams(aoData, dataTable);
        var sEcho = this.getKey(aoData, "sEcho");

        var url = this.dataUrl;

        //the original method
        digitnexus.ajaxGet(
        url, encodeURI(params, "UTF-8"), function(response) {
            self.processPaginatedDataResponse(sEcho, response, fnCallback);
        }, function(xhr, status, exception) {
            AppView._showErrors(xhr);
        });

    },

    processPaginatedDataResponse: function(sEcho, response, fnCallback) {
        //this is array of data...well may be
        var data = [];
        for (var i = 0; i < response.length; i++) {
            data[i] = response[i].data;
        }
        //get the cached value
        var metaData = this.metaData;
        //loop over the columns, get the name and fetch the co-responding value
        var idColumn = metaData.idColumn;
        var columnArray = metaData.columns;
        var multiColumnValues = [];
        //loop over the array of data and fetch values of each column
        for (var x = 0; x < data.length; x++) {
            var rowData = data[x];
            multiColumnValues[x] = [];
            multiColumnValues[x][0] = rowData[idColumn.name];
            for (var y = 1; y <= columnArray.length; y++) {
                multiColumnValues[x][y] = rowData[columnArray[y - 1].name];
            }
        }

        if (this.map) {
            var layer = this.map.map.getLayersByName("searchLayer")[0];
            layer.clearMarkers();
            layer = this.map.map.getLayersByName("searchVLayer")[0];
            layer.removeAllFeatures();
        }
        var jsonData = {
            "sEcho": sEcho,
            "iTotalRecords": this.dataCount,
            "iTotalDisplayRecords": this.dataCount,
            "aaData": multiColumnValues
        };
        fnCallback(jsonData);

        //Trigger data loaded event
        this.triggerDataLoadEvent();
    },

    getRequestParams: function(aoData, dataTable) {

        //first data index
        var iRequestStart = this.getKey(aoData, "iDisplayStart");
        //page size
        var iRequestLength = this.getKey(aoData, "iDisplayLength");
        //so the page count is..
        var pageCount = Math.floor(iRequestStart / iRequestLength) + 1;

        var applyDefaultFilter = true;

        var params = "";
        if (this.searchCriteria !== undefined && this.searchCriteria !== null) {
            for (var item in this.searchCriteria) {
                params += item + "=" + encodeURIComponent(this.searchCriteria[item], "UTF-8") + "&";
            }

            applyDefaultFilter = false;
        }

        params += "page=" + pageCount + "&pageSize=" + iRequestLength;//10

        //this parameters is going to contain as array of array of two elements
        //first element is the index of the columns and second element is 'asc' or 'desc' 
        var parameters = dataTable.fnGetSortingParameters();
        //this is going to contain a string with comma separated sort column names
        var sortColumns = '';

        //and this is going to have asc or desc in the same order
        var sortOrder = '';
        for (var i = 0; i < parameters.length; i++) {
            var index = parameters[i][0];
            var sortRule = parameters[i][1];
            var columnName = this.getColumnName(index);
            if (columnName) {
                var skipComma = (i == (parameters.length - 1));
                sortColumns += columnName + (skipComma ? '' : ',');
                if (sortRule) {
                    sortOrder += sortRule + (skipComma ? '' : ',');
                } else {
                    sortOrder += 'desc' + (skipComma ? '' : ',');
                }
            }
        }
        if (sortOrder) {
            params += "&sortColumns=" + encodeURIComponent(sortColumns, "UTF-8") + "&sortOrder=" + encodeURIComponent(sortOrder, "UTF-8");
        }

        if (applyDefaultFilter && this.defaultFilterId !== null) {
            params += "&searchCriteriaId=" + encodeURIComponent(this.defaultFilterId, "UTF-8");
        }

        return params;

    },

    triggerDataLoadEvent: function() {
        this.$el.trigger($.Event("list-view-data-loaded"));
    },

    getKey: function(aoData, sKey) {
        for (var i = 0, iLen = aoData.length; i < iLen; i++) {
            if (aoData[i].name == sKey) {
                return aoData[i].value;
            }
        }
        return null;
    },
    
    setValueByKey: function(aoData, sKey, sValue){
    	for (var i = 0, iLen = aoData.length; i < iLen; i++) {
            if (aoData[i].name == sKey) {
            	aoData[i].value = sValue;
            }
        }
    },

    setDataCount: function() {
        var self = this;

        var params = "";
        if (this.searchCriteria !== undefined && this.searchCriteria !== null) {
            for (var item in this.searchCriteria) {
                params += item + "=" + encodeURIComponent(this.searchCriteria[item], "UTF-8") + "&";
            }
        }

        if (params === "" && this.defaultFilterId !== null) {
            params += "&searchCriteriaId=" + encodeURIComponent(this.defaultFilterId, "UTF-8");
        }

        digitnexus.syncGet(
        this.dataCountUrl, encodeURI(params, "UTF-8"), function(response) {
            //the expected response is a number, the total count
            self.dataCount = response;
        }, function(xhr, status, exception) {
            AppView._showErrors(xhr);
        });
    },

    getColumnName: function(index) {
        if (index > this.metaData.columns.length || index < 0) {
            return null;
        }
        //zeroth column is the id column
        var idColumnName = this.getIdColumnName();
        //if the id column does not exists then assume there is hidden column
        if (!idColumnName) {
            if (index >= this.metaData.columns.length) {
                return null;
            }
            return this.metaData.columns[index].name;
        }
        if (index == 0) {
            return idColumnName;
        }
        return this.metaData.columns[index - 1].name;
    },

    getIdColumnName: function() {
        if (this.metaData.idColumn) {
            return this.metaData.idColumn.name;
        }
        return '';
    },

    /**
     * Generates the UI for a table cell
     * @param nRow complete row to be rendered
     * @param aData data of a specific cell
     * @param dataType data type of that cell
     * @param columnIndex index of the cell in the row
     */
    generateUIForTableCell: function(nRow, aData, columnIndex, columnParam, tableParam, iDisplayIndex) {
        if (!this.tableCellRenderer) {
            this.tableCellRenderer = ListViewTableCellRenderer.create(this.articleName, {
                dataTable: this.dataTable,
                metaData: this.metaData,
                model: this.model,
                columnDefs: this.columnDefs,
                map: this.map
            });

        }
        this.tableCellRenderer.generateUIForTableCell(nRow, aData, columnIndex, columnParam, tableParam, iDisplayIndex);
    },

    fireArticleSelection: function() {
        var selected = this.dataTable.find('.row_selected');
        if (selected.length != 1) {
            this.triggerDummyEvent();
            return;
        }
        var index = this.dataTable.fnGetPosition(selected[0]);
        var id = this.dataTable.fnGetData(index, 0);
        
        if(this.clickType == "dbclick"){
        	var selectionEvent = $.Event('articleList-dbselection');
        }else{
        	var selectionEvent = $.Event('articleList-selection');
        }
        
        selectionEvent.selectedId = id;
        if (this.containsFlexConfig) {
            selectionEvent.flexConfigName = this.dataTable.fnGetData(index, this.configDescriminatorPropertyIndex);
        }
        this.$el.trigger(selectionEvent);
    },

    fireArticleChecked: function() {
        var articleCheckEvent = $.Event('articleList-checked');
        articleCheckEvent.ids = this.getSelectedIds();
        this.$el.trigger(articleCheckEvent);
    },

    refresh: function(isFresh) {
    	if(isFresh){
    		var fnDrawCallback = this.fnDrawCallback||function(){};
    		         
            this.fnDrawCallback = function(oSettings){
            	fnDrawCallback.call(this,oSettings);
            	
            	if(isFresh&&this.displayIndex!=null){                	
             	   var aTrs = this.dataTable.fnGetNodes();
                    var currentRow = $(aTrs[this.displayIndex]);                      
                    currentRow.addClass('row_selected');
                    this.displayIndex=null;
                    isFresh = null;
                 }            	
            }
            
    		var oSettings = this.dataTable.fnSettings();   	
        	var value = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength);
        	this.dataTable.fnPageChange(value);
    	}else{	
        	this.dataTable.fnDraw();
    	}
    
        $('#' + this.id + '_check_all').attr('checked', false);
        this.triggerDummyEvent();


    },

    refreshReferenceData: function(referenceId) {
        if (this.model.referenceId !== referenceId) {
            this.model.referenceId = referenceId;
        }

        this.setReferenceDataUrls();

        this.refresh();
    },

    getSelectedIds: function() {
        var selectedInputs = this.dataTable.find('input[idcolumn="true"]:checked');
        var self = this;
        if (selectedInputs !== undefined && selectedInputs.length > 0) {
            var ids = [];
            $.each(selectedInputs, function(index, selectedInput) {
                var selectedValue = selectedInput.value;
                var idColumnType = self.metaData.idColumn.dataType
                if (idColumnType === 'LONG' || idColumnType === 'INTEGER') {
                    selectedValue = (selectedValue.indexOf(',') != -1) ? selectedValue.replace(",", "") : selectedValue;
                }
                ids[index] = selectedValue;
            });
            return ids;
        }

        return null;
    },

    selectIds: function(ids) {
        var self = this;
        var selectedInputs = this.dataTable.find('input[idcolumn="true"]');
        $.each(selectedInputs, function(index, selectedInput) {
            var idColumnType = self.metaData.idColumn.dataType
            var selectedValue = selectedInput.value;
            if (idColumnType === 'LONG' || idColumnType === 'INTEGER') {
                selectedValue = (selectedValue.indexOf(',') != -1) ? selectedValue.replace(",", "") : selectedValue;
            }

            if ($.inArray(selectedValue, ids) != -1) {
                $(selectedInput).attr("checked", true);
            }
        });
    },

    triggerDummyEvent: function() {
        //Fire list selection event with fake id to indicate selection cleared
        var selectionEvent = $.Event('articleList-selection');
        selectionEvent.selectedId = -1;
        this.$el.trigger(selectionEvent);

        var articleCheckEvent = $.Event('articleList-checked');
        articleCheckEvent.ids = null;
        this.$el.trigger(articleCheckEvent);
    },

    resize: function() {
        // getting 1 level up parent div which is acting as a scrollbody for table
        var tbodyDiv = $(this.$el[0]).parent();
        // getting 2 level up parent div which for getting the next footer div
        var scrollDivContainer = tbodyDiv.parent();
        var parentDivContainer = $("#" + this.$el[0].id + "_wrapper").parent();
        var toolBarOuterHeight = 0;
        if (this.toolbarEl) {
            toolBarOuterHeight = this.toolbarEl.outerHeight();
        }

        // assinging new height based on the calculation after removing height of header and pagination div height from main parent div height to get the
        //height for tablebody
        //change outerHeight to height ,because Need to subtract the height of padding
        var calculatedHeight = parentDivContainer.height() - tbodyDiv.prev().outerHeight() - scrollDivContainer.next().outerHeight() - toolBarOuterHeight;

        tbodyDiv.css("height", calculatedHeight);
        //Diabled auto sizing issue to avoid filkering of headers during resize
        // assiging function header autoresizing behavior
        /*if(this.dataTable){
			 this.dataTable.fnAdjustColumnSizing(false);
		}*/

        if (this.toolbarEl) {
            toolBarOuterHeight = this.toolbarEl.outerHeight();
        }

        //get the height again. if there is a change then set the new height
        var newCalculatedHeight = parentDivContainer.height() - tbodyDiv.prev().outerHeight() - scrollDivContainer.next().outerHeight() - toolBarOuterHeight;

        if (calculatedHeight != newCalculatedHeight) {
            tbodyDiv.css("height", newCalculatedHeight);
        }
    },

    setSearchCriteria: function(searchCriteria) {
        this.searchCriteria = searchCriteria;
        this.refresh();
    }
    //   fg-toolbar
});

//To generate id for data table
ListView._currentId = 0;

//Renderer for table cells in list view
ListViewTableCellRenderer = function(options) {
    this.dataTable = options.dataTable;
    this.metaData = options.metaData;
    this.model = options.model;
    this.columnDefs = options.columnDefs;
    this.map = options.map;
}

_.extend(ListViewTableCellRenderer.prototype, {
    generateUIForTableCell: function(nRow, aData, columnIndex, columnParam, tableParam, iDisplayIndex) {
        if (this.renderCustomCell(nRow, aData, columnIndex, columnParam, tableParam, iDisplayIndex)) {
            //Default rendering in overridden
            return;
        }

        var dataType = columnParam.dataType;
        var displayType = columnParam.displayType;
        var imageData = columnParam.imageMap;
        var self = this;

        dataType = (dataType) ? dataType.toUpperCase() : '';
        displayType = (displayType) ? displayType.toUpperCase() : '';
        var renderedHtml = null;

        switch (dataType) {
        case 'BOOLEAN':
            var booleanData = aData || (aData == 'true') || (aData == 't') || (aData == 'yes') || (aData == 'y');

            switch (displayType) {
            case 'CHECKBOX':
                renderedHtml = this.renderBooleanCheckBox(booleanData);
                break;
            case 'RADIO':
                renderedHtml = this.renderBooleanRadio(booleanData);
                break;
            case 'SELECT':
                renderedHtml = this.renderBooleanSelect(booleanData);
                break;
            }
            break;
        case 'STRING':
            var stringData = aData;
            switch (displayType) {
            case 'TEXTFIELD':
                renderedHtml = this.renderStringText(stringData);
                break;
            case 'ICON':
                renderedHtml = this.renderStringIcon(stringData, imageData);
                break;
            case 'IMAGE':
                // this case is support to display the image... so the mobile client can take a picture, in the web client side; will be to display in the list view ,modify by Bill 
                if (stringData === null || stringData === "") {
                    $('td:eq(' + columnIndex + ')', nRow).html('&nbsp;');
                } else { //<a href="#"><img src="' + digitnexus.IMAGE_DIR + '/common/icons/folder.png" alt="' + stringData + '" ></img></a>
                    $('td:eq(' + columnIndex + ')', nRow).html('<a href="#"><div class="iconBtn_1 icon_sign"></div></a>').bind('click', {
                        picId: stringData,
                        picnRow: nRow
                    }, function(event) {
                        if (event.data.picId && event.data.picnRow) {
                            var imageView = new DisplayImageView({
                                imageId: event.data.picId,
                                parentView: event.data.picnRow
                            });
                            $(event.data.picnRow).append(imageView.render().el);
                            imageView.showDialog();
                        }
                    });
                }
                break;
            case "POINT":

                if (this.map && aData) {

                    var layer = this.map.map.getLayersByName("searchLayer")[0];
                    var ind = aData.indexOf("(");
                    var end = aData.indexOf(" ");
                    var lon = aData.substring(ind + 1, end);
                    var ind = aData.indexOf(")");
                    var lat = aData.substring(end + 1, ind);
                    var marker = new OpenLayers.Marker.InfoIconMarker(new OpenLayers.LonLat(lon, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"), this.map.map.getProjectionObject()), "", "skins/common/images/map/marker" + (iDisplayIndex + 1) + ".png", true, "");

                    layer.addMarker(marker);

                    nRow.marker = marker;
                    $('td:eq(' + columnIndex + ')', nRow).html('<a href="#">' + aData + '</a>');
                } else {
                    $('td:eq(' + columnIndex + ')', nRow).html('<a href="#">' + aData + '</a>');
                }

                break;
            }
            break;
        case 'REFERENCE':
            var referenceData = aData;
            if (referenceData == null) {
                renderedHtml = '&nbsp;';
            } else {
                switch (displayType) {
                case "POPUP":                	
                	var table = self.dataTable;
                    var name = columnParam.name;

                    var summaryModel = {};
                    summaryModel.referenceId = table.fnGetData(iDisplayIndex, 0);
                    summaryModel.referArticleName = self.model.remark;
                    summaryModel.remark = name;
                    summaryModel.id = self.model.id + '_' + name;
                    summaryModel.name = self.model.name + '-' + columnParam.displayName;
                    summaryModel.content = self.model.content;
                    summaryModel.referenceData = referenceData;
                    
                	var referenceElem = this.renderPopupReference(summaryModel);
                	
                	$('td:eq(' + columnIndex + ')', nRow).empty().append(referenceElem);
                	break;
                case 'URL':
                    $('td:eq(' + columnIndex + ')', nRow).html('<a href="#">' + referenceData + '</a>').children().bind('click', function(event) {
                        var table = self.dataTable;
                        var name = columnParam.name;

                        var summaryModel = {};
                        summaryModel.referenceId = table.fnGetData(iDisplayIndex, 0);
                        //See PT-644. The referArticleName should be name of entity for which the current list view belongs
                        summaryModel.referArticleName = self.metaData.name;
                        summaryModel.remark = name;
                        summaryModel.id = self.model.id + '_' + name;
                        summaryModel.name = self.model.name + '-' + columnParam.displayName;
                        summaryModel.content = self.model.content;


                        if (self.model.referenceId) {
                            //Ref view of ref view
                            summaryModel.tabViewId = self.model.tabViewId;
                        } else {
                            summaryModel.tabViewId = ArticleGroupView.prototype._idVsGroupModel[self.model.parentMenu].parentMenu;
                        }

                        ArticleTabsView.prototype._idVsTabsView[summaryModel.tabViewId].showArticleTab(null, summaryModel);
                    });
                    break;
                case 'TEXTFIELD':
                    $('td:eq(' + columnIndex + ')', nRow).html(referenceData);
                    break;
                }

            }

            break;
        }

        if (renderedHtml) {
            $('td:eq(' + columnIndex + ')', nRow).html(renderedHtml);
        }
    },

    renderBooleanCheckBox: function(booleanData) {
        return '<input type="checkbox" disabled="disabled" align="center"' + (booleanData ? 'checked="checked"' : '') + "></input>";
    },

    renderBooleanRadio: function(booleanData) {
        return '<input type="radio" disabled="disabled" align="center"' + (booleanData ? 'checked="checked"' : '') + "></input>";
    },

    renderBooleanSelect: function(booleanData) {
        return '<select disabled="disabled"><option value="' + booleanData + '">' + booleanData + '</option></select>';
    },

    renderStringText: function(stringData) {
        return stringData;
    },

    renderStringIcon: function(stringData, imageData) {
        var imageSrc = imageData ? imageData[stringData] : null;
        if (imageSrc) {
            return '<img src="' + digitnexus.IMAGE_DIR + '/' + imageSrc + '" alt="' + stringData + '" ></img>';
        }
        return stringData;
    },

    /**
     * Applications or platform can register custom renderers and override this method. Return true
     * if rendering is done in this method else false
     */
    renderCustomCell: function(nRow, aData, columnIndex, columnParam, tableParam, iDisplayIndex) {
        //Deafult behavior. Nobody should change this method
        return false;
    },
    
    renderPopupReference:function(summaryData){
    	return new referenceDialog({summaryData:summaryData}).render().$el;
    }


});



window.referenceDialog = Backbone.View.extend({
	tagName : "a",
	events : {
		'click' : 'onClick'
	},

	initialize : function() {
		this.renderDialog = false;
		this.summaryData = this.options.summaryData
	},

	render : function() {
		this.$el.append("<span>" + this.getDisplayName() + "</span>");
		return this;
	},

	getDisplayName : function() {
		return this.summaryData.referenceData;
	},

	onClick : function() {
		this.showDialog();
	},
	showDialog:function(){
		if(!this.renderDialog){
			this.renderDialog = true;
			this.dialog = $(viewCreator.make("div", {
				"class": "popupBox1",
		         "style": "padding:2px 0px 1px 1px;"
		     }));
			
			 var listViewEl=viewCreator.make('table'); 
			 this.dialog.append(listViewEl);	          	               
	                
			  this.listView = new ListView({
				    el:listViewEl,			 
	                model: this.summaryData,
	                parentView: this,
	                footerInfo: true,
	                createListTop: false
	            });
			var self = this;  
			
			var position = this.$el.offset()
			this.dialog.dialog({
				width: "80%",
		        height:"80%",
		        show: "blind",
		        position:[position.left,position.top],
		        modal: true,
		        resize: function() {    
		        	
		        }
			});					
			this.listView.render();	 
		           
		//  this.listView.resize();
		}else{
			this.dialog.dialog("open");
		}			
	}
});





/**
Registry for custom ListViewTableCellRenderer
**/
ListViewTableCellRenderer.registry = {};

/**
To register for custom ListViewTableCellRenderer
**/
ListViewTableCellRenderer.registerRenderer = function(articleName, renderer) {
    ListViewTableCellRenderer.registry[articleName] = renderer;
}

/**
 *Fatcory to create ListViewTableCellRenderer. If custom renderer is registered it is returned
 */
ListViewTableCellRenderer.create = function(articleName, options) {
    var customRender = ListViewTableCellRenderer.registry[articleName];
    if (customRender) {
        return new customRender(options);
    }

    return new ListViewTableCellRenderer(options);
}




/**
 * Enhancement of the data table api to fit our purpose. We need some additional
 * behaviour with the list.
 */
//selected index of the in the list. not sure what should happen to this on page change
$.fn.dataTableExt.oApi._selectedIndex = -1;
/**
 * Function to enable selection of a row on click
 */
$.fn.dataTableExt.oApi.fnEnableSelection = function(oSettings) {
    var apiExt = this.oApi;
    $(this).children('tbody > tr').live('click', null, function() {
        var trs = apiExt._fnGetTrNodes(oSettings);
        var index = trs.indexOf(this);
        if (apiExt._selectedIndex >= 0) {
            $(trs[apiExt._selectedIndex]).removeClass('row_selected');
        }
        apiExt._selectedIndex = index;
        $(this).addClass('row_selected');



    });
};

$.fn.dataTableExt.oApi.fnGetSortingParameters = function(oSettings) {
    var params = oSettings.aaSorting;
    return params;
};

$.fn.dataTableExt.oPagination.input = {
    /*
     * Function: oPagination.input.fnInit
     * Purpose:  Initalise dom elements required for pagination with input textbox
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *           node:nPaging - the DIV which contains this pagination control
     *           function:fnCallbackDraw - draw function which must be called on update
     */"fnInit": function(oSettings, nPaging, fnCallbackDraw) {
    	var nTotalPage = document.createElement('font');    	
        var nFirst = document.createElement('span');
        var nPrevious = document.createElement('span');
        var nNext = document.createElement('span');
        var nLast = document.createElement('span');
        var nInput = document.createElement('input');
        var nPage = document.createElement('span');
        var nOf = document.createElement('span');

        nFirst.innerHTML = '<img src="' + digitnexus.IMAGE_DIR + '/common/page/first.png"></img>';
        nPrevious.innerHTML = '<img src="' + digitnexus.IMAGE_DIR + '/common/page/prev.png"></img>';
        nNext.innerHTML = '<img src="' + digitnexus.IMAGE_DIR + '/common/page/next.png"></img>';
        nLast.innerHTML = '<img src="' + digitnexus.IMAGE_DIR + '/common/page/last.png"></img>';
        
        nTotalPage.className = "paginate_count";
        nFirst.className = "paginate_button";
        nPrevious.className = "paginate_button";
        nNext.className = "paginate_button";
        nLast.className = "paginate_button";
        nOf.className = "paginate_of";
        nPage.className = "paginate_page";

        if (oSettings.sTableId !== '') {
            nPaging.setAttribute('id', oSettings.sTableId + '_paginate');
            nFirst.setAttribute('id', oSettings.sTableId + '_first');
            nPrevious.setAttribute('id', oSettings.sTableId + '_previous');
            nNext.setAttribute('id', oSettings.sTableId + '_next');
            nLast.setAttribute('id', oSettings.sTableId + '_last');
        }

        nInput.type = "text";
        $(nInput).css("width", "2em");
        $(nInput).css("display", "inline");
        $(nInput).css("text-align", "right");
        nPage.innerHTML = table_label_page || "Page ";

        nPaging.appendChild(nTotalPage);
        nPaging.appendChild(nFirst);
        nPaging.appendChild(nPrevious);
        nPaging.appendChild(nPage);
        nPaging.appendChild(nInput);
        nPaging.appendChild(nOf);
        nPaging.appendChild(nNext);
        nPaging.appendChild(nLast);

        $(nFirst).click(function() {
            oSettings.oApi._fnPageChange(oSettings, "first");
            fnCallbackDraw(oSettings);
        });

        $(nPrevious).click(function() {
            oSettings.oApi._fnPageChange(oSettings, "previous");
            fnCallbackDraw(oSettings);
        });

        $(nNext).click(function() {
            oSettings.oApi._fnPageChange(oSettings, "next");
            fnCallbackDraw(oSettings);
        });

        $(nLast).click(function() {
            oSettings.oApi._fnPageChange(oSettings, "last");
            fnCallbackDraw(oSettings);
        });

        $(nInput).focusout(function(e) {
            if (this.value == "" || !$.isNumeric(this.value)) {
                this.value = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
            } else {
                var decimalValue = this.value;
                this.value = Math.round(decimalValue);
                if (this.value < 1) {
                    this.value = 1;
                    oSettings._iDisplayStart = 0;
                    fnCallbackDraw(oSettings);
                    return;
                }
                var iNewStart = oSettings._iDisplayLength * (this.value - 1);
                var recordLength = oSettings.fnRecordsDisplay();
                if (iNewStart >= recordLength) {
                    var iPages = Math.ceil(recordLength / oSettings._iDisplayLength);
                    if (!iPages) {
                        //if page count is 0 then show one
                        iPages = 1;
                    }
                    this.value = iPages;
                    oSettings._iDisplayStart = (Math.ceil((recordLength - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                    fnCallbackDraw(oSettings);
                    return;
                } else {
                    if (decimalValue != this.value) {
                        oSettings._iDisplayStart = iNewStart;
                        fnCallbackDraw(oSettings);
                        return;
                    }
                }
            }
        });

        $(nInput).keyup(function(e) {

            if (this.value == "" || this.value.match(/[^0-9]/)) {
                /* Nothing entered or non-numeric character */
                return;
            }

            if (e.which == 38 || e.which == 39) {
                this.value++;
            } else if ((e.which == 37 || e.which == 40) && this.value > 1) {
                this.value--;
            }

            if (parseInt(this.value) < 1) {
                return;
            }

            var iNewStart = oSettings._iDisplayLength * (this.value - 1);
            if (iNewStart >= oSettings.fnRecordsDisplay()) {
                /* Display overrun */
                //oSettings._iDisplayStart = (Math.ceil((oSettings.fnRecordsDisplay()-1) /
                //    oSettings._iDisplayLength)-1) * oSettings._iDisplayLength;
                //fnCallbackDraw( oSettings );
                return;
            }

            oSettings._iDisplayStart = iNewStart;
            fnCallbackDraw(oSettings);
        });

        /* Take the brutal approach to cancelling text selection */
        $('span', nPaging).bind('mousedown', function() {
            return false;
        });
        $('span', nPaging).bind('selectstart', function() {
            return false;
        });
    },

    /*
     * Function: oPagination.input.fnUpdate
     * Purpose:  Update the input element
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *           function:fnCallbackDraw - draw function which must be called on update
     */"fnUpdate": function(oSettings, fnCallbackDraw) {
        if (!oSettings.aanFeatures.p) {
            return;
        }
        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
        if (!iPages) {
            //if page count is 0 then show one
            iPages = 1;
        }
        var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;

        //if the records in last page all have been deleted, should show the previous page
        if (iCurrentPage > iPages) {
            oSettings.bAjaxDataGet = true;
            oSettings.oApi._fnPageChange(oSettings, "previous");
            fnCallbackDraw(oSettings);
        }
        
        /* Loop over each instance of the pager */
        var an = oSettings.aanFeatures.p;
        var oClasses = oSettings.oClasses;
        for (var i = 0, iLen = an.length; i < iLen; i++) {
            var spans = an[i].getElementsByTagName('span');
            var inputs = an[i].getElementsByTagName('input');
            var fonts = an[i].getElementsByTagName('font');
            fonts[0].innerHTML = table_label_left+" <b class='PerItem'>"+oSettings._iDisplayLength+"</b> "+table_label_middle+"  <b class='PerItem'>"+oSettings.fnRecordsTotal()+"</b> "+table_label_right;
            spans[3].innerHTML = " " + (table_label_pageOf || "of") + " " + "<b class='PerItem'>"+ iPages+"</b> ";
            inputs[0].value = iCurrentPage;

            var anStatic = [
            spans[0], spans[1], spans[spans.length - 2], spans[spans.length - 1]];

            $(anStatic).removeClass(oClasses.sPageButtonStaticDisabled);
            $(anStatic).unbind("click");


            if (iCurrentPage == 1) {
                anStatic[0].className += " " + oClasses.sPageButtonStaticDisabled;
                anStatic[1].className += " " + oClasses.sPageButtonStaticDisabled;
            } else {
                $(anStatic[0]).click(function() {
                    oSettings.oApi._fnPageChange(oSettings, "first");
                    fnCallbackDraw(oSettings);
                });

                $(anStatic[1]).click(function() {
                    oSettings.oApi._fnPageChange(oSettings, "previous");
                    fnCallbackDraw(oSettings);
                });
            }

            if (iPages === 0 || iCurrentPage == iPages || oSettings._iDisplayLength == -1) {
                anStatic[2].className += " " + oClasses.sPageButtonStaticDisabled;
                anStatic[3].className += " " + oClasses.sPageButtonStaticDisabled;
            } else {
                $(anStatic[2]).click(function() {
                    oSettings.oApi._fnPageChange(oSettings, "next");
                    fnCallbackDraw(oSettings);
                });

                $(anStatic[3]).click(function() {
                    oSettings.oApi._fnPageChange(oSettings, "last");
                    fnCallbackDraw(oSettings);
                });
            }

            $(anStatic).removeClass("ui-button");

        }
    }
};

window.LocalListView = ListView.extend({
    data: [],
    loadPaginatedData: function(sSource, aoData, fnCallback, dataTable) {
        //get the cached value
        var metaData = this.metaData;
        //loop over the columns, get the name and fetch the co-responding value
        var idColumn = metaData.idColumn;
        var columnArray = metaData.columns;
        var multiColumnValues = [];
        if (this.data !== undefined && this.data !== null) {
            var iRequestStart = this.getKey(aoData, "iDisplayStart");
            var subData = this.data.slice().splice(iRequestStart, 10);
            //loop over the array of data and fetch values of each column
            for (var x = 0; x < subData.length; x++) {
                var rowData = subData[x];
                multiColumnValues[x] = [];
                multiColumnValues[x][0] = rowData[idColumn.name];
                for (var y = 1; y <= columnArray.length; y++) {
                    var associationReferenceProperty = columnArray[y - 1].referenceProperty;
                    multiColumnValues[x][y] = rowData[columnArray[y - 1].name];
                    if (associationReferenceProperty && (typeof multiColumnValues[x][y][associationReferenceProperty] != 'undefined')) {
                        multiColumnValues[x][y] = multiColumnValues[x][y][associationReferenceProperty];
                    }
                }
            }
        } else {
            this.data = [];
        }

        var sEcho = this.getKey(aoData, "sEcho");
        var jsonData = {
            "sEcho": sEcho,
            "iTotalRecords": this.data.length,
            "iTotalDisplayRecords": this.data.length,
            "aaData": multiColumnValues
        };
        fnCallback(jsonData);

        //Trigger data loaded event
        this.triggerDataLoadEvent();
    },

    setData: function(data) {
        this.data = data;
    },

    resize: function() {
        // getting 1 level up parent div which is acting as a scrollbody for table
        var tbodyDiv = $(this.$el[0]).parent();
        // getting 2 level up parent div which for getting the next footer div
        var scrollDivContainer = tbodyDiv.parent();
        var parentDivContainer = $("#" + this.$el[0].id + "_wrapper");
        var toolBarOuterHeight = 0;
        if (this.toolbarEl) {
            toolBarOuterHeight = this.toolbarEl.outerHeight();
        }

        // assinging new height based on the calculation after removing height of header and pagination div height from main parent div height to get the
        //height for tablebody
        //change outerHeight to height ,because Need to subtract the height of padding
        var calculatedHeight = parentDivContainer.height() - tbodyDiv.prev().outerHeight() - scrollDivContainer.next().outerHeight() - toolBarOuterHeight;

        tbodyDiv.css("height", calculatedHeight - 10);
        //Diabled auto sizing issue to avoid filkering of headers during resize
        // assiging function header autoresizing behavior
        /*if(this.dataTable){
			 this.dataTable.fnAdjustColumnSizing(false);
		}*/

        if (this.toolbarEl) {
            toolBarOuterHeight = this.toolbarEl.outerHeight();
        }

        //get the height again. if there is a change then set the new height
        var newCalculatedHeight = parentDivContainer.height() - tbodyDiv.prev().outerHeight() - scrollDivContainer.next().outerHeight() - toolBarOuterHeight;

        if (calculatedHeight != newCalculatedHeight) {
            tbodyDiv.css("height", newCalculatedHeight - 10);
        }
    }
});
//here can support the view to display the image.... 
window.DisplayImageView = Backbone.View.extend({
    tagName: "div",
    className: "popupBox1",
    initialize: function() {
        this.imageId = this.options.imageId;
        this.parentView = this.options.parentView;
        this.dialogRendered = false;
        this.$el.attr({
            title: lable_show_picture,
            style: 'background-color:black;'
        });
    },
    render: function() {
        return this;
    },
    showDialog: function() {
        if (!this.dialogRendered) {
            this.renderDialog();
            this.$el.dialog("open");
            this.dialogRendered = true;
        } else {
            this.$el.dialog("open");
        }
    },
    renderDialog: function() {
        var self = this;
        var imagePanel = "<image src='" + digitnexus.util.ctx + "/common/file/download?fileId=" + this.imageId + "&category=sign_signpicture' style='width:100%;height:100%;'/>";
        //var imagePanel = "<image id='signPic' src='"+digitnexus.util.ctx+"/images/common/statu-green.gif' style='width:100%;height:100%'/>";
        this.$el.append(imagePanel);
        this.imageView = $(imagePanel);
        this.$el.dialog({
            autoOpen: false,
            modal: true,
            resizable: true,
            resize: function() {
                self.resize();
            },
            buttons: [{
                text: label_cancel,
                click: function() {
                    self.$el.dialog("close");
                }
            }]

        });
    },
    resize: function() {
        var image = new Image();
        image.src = this.imageView.attr('src');
        var imgObject = $("image#signPic");
        var imgWid = parseInt(image.width);
        var imgHei = parseInt(image.height);
        if (imgWid < 120 || imgHei < 120) {
            imgWid += 100;
            imgHei += 100;
        }
        imgObject.width(imgWid);
        imgObject.height(imgHei);
        //this.$el.dialog( "option", "width", imgWid );
        //this.$el.dialog( "option", "height", imgHei );
    }
});