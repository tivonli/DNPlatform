/**
 * the js file Provide news model web client display and some effect....
 * 
 * author: jeff lee
 */

window.MapView = Backbone.View.extend({
    tagName: 'div',
    className: 'map main-content-panel2',
    //map:null,
    mapSearchViewContener: null,
    mapContenerView: null,

    initialize: function() {
        this.articleObject = this.options.article;
        this.remark = this.articleObject.remark;

        this.parentView = this.options.parentView;
        this.$el.attr({
            id: this.parentView.id + "_content_panel",
            style: "height:99%;padding:0px 5px;"
        });
    },

    render: function() {

        if (!this.mapSearchViewContener) { //add map search View
            if (this.remark == "MapView") {
                this.mapSearchViewContener = new MapSearchViewContener({
                    parentView: this
                });
                this.$el.append(this.mapSearchViewContener.render().el);
                this.$el.append('<div class="blank_line"></div>');
            } else {
                this.mapSearchViewContener = eval("new " + this.remark + "({parentView:this})");
                this.$el.append(this.mapSearchViewContener.render().el);
                this.$el.append('<div class="blank_line"></div>');
            }
        }
        if (!this.mapContenerView) { //add map View
            this.mapContenerView = new MapContenerView({
                parentView: this
            });
            this.$el.append(this.mapContenerView.render().el);
        }
        return this;
    },

    resize: function() {
        this.mapContenerView.resize();
    },
    setSearchCriteria: function(searchData, articleSummary) {
        this.mapContenerView.setSearchCriteria(searchData, articleSummary);
    }
});


window.MapContenerView = Backbone.View.extend({
    tagName: "div",
    remark: null,
    initialize: function() {
        this.parentView = this.options.parentView;
        this.remark = this.parentView.remark;
        this.id = this.parentView.parentView.id + "_map_contener";
        this.searchView = this.options.searchView;
        this.$el.attr({
            id: this.id
        });

        this.mapCenterView = new MapContenerCenterView({
            parentView: this,
            id: this.id
        });
        this.mapEastView = new MapContenerEastView({
            parentView: this,
            id: this.id
        });

        this.$el.append(this.mapCenterView.render().el);
        this.$el.append(this.mapEastView.render().el);
    },
    render: function() {
        return this;
    },
    resize: function() {

        //		console.log(" id="+this.parentView.mapSearchViewContener.$el.attr("class")+this.parentView.mapSearchViewContener.$el.height());
        var viewHeight = this.parentView.parentView.$el.height() - 44;
        this.$el.height(viewHeight);
        this.$el.width("auto");

        this.mapCenterView.resize();
        this.mapEastView.resize();
    },
    initilizeLayoutSetting: function() {
        var self = this;
        this.layout = this.$el.layout({
            west__showOverflowOnHover: true,
            resizeWithWindow: false,
            closable: true // pane can open & close
            ,
            resizable: false // when open, pane can be resized
            ,
            slidable: true // when closed, pane can 'slide' open over other panes - closes on mouse-out
            ,
            spacing_open: 8,
            spacing_closed: 8
            //	we have west and center only. rest all are hidden
            ,
            north__initHidden: true,
            south__initHidden: true,
            west__initHidden: true
            //	some pane-size settings
            ,
            east__minSize: 370,
            east__size: 370,
            east__maxSize: Math.floor(screen.availWidth / 2) // 1/2 screen width
            ,
            center__maxWidth: screen.availWidth - 10,
            showErrorMessages: false,
            slidable: false,
            onresize: function() {
                if (self.adjustEastContener) self.adjustEastContener();
                self.mapCenterView.resize();
            }
        });
    },
    setAdjustEastcontner: function(callBack) {
        this.adjustEastContener = callBack;
    },
    setSearchCriteria: function(searchData, articleSummary) {
        if (this.layout) {
            this.layout.open("east");
        } else {
            this.initilizeLayoutSetting();
        }
        this.mapEastView.setSearchCriteria(searchData, articleSummary);
    }
});

window.MapContenerCenterView = Backbone.View.extend({

    tagName: "div",
    className: "ui-layout-center",
    map: null,
    remark: null,
    initialize: function() {
        this.id = this.id + "_center";
        this.parentView = this.options.parentView;
        this.remark = this.parentView.remark;
        this.$el.attr({
            id: this.id,
            style: 'overflow:hidden;height:100%;'
        });

        var mapListId = this.parentView.id + "_MapDiv";
        var mapContentListDiv = viewCreator.make("div", {
            "id": mapListId,
            "style": "overflow:hidden;padding:0;width:auto;height:auto;border:0;"
        });
        this.$el.append(mapContentListDiv);
        this.childView = $(mapContentListDiv);

    },
    render: function() {
        return this;
    },
    showSearchContent: function(model) { //show map tag
    },

    initMap: function() {
        var saveLast = false;

        if (this.remark == "MapView") {
            saveLast = true;
        }
        this.map = new digitnexus.Map(this.childView[0], {
            showGoogleMap: true,
            showMapToolBar: saveLast,
            showZoomCellPan: true,
            showEgleMap: true,
            showScaleLine: true,
            saveLast: saveLast
        });

        this.map.parentView = this;
        var layers = [];
        if (typeof(getCustomLayer) != "undefined") {
            layers = getCustomLayer();
        }
        if (layers.length > 0) {
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i].clone();
                this.map.addLayers([layer]);
                if (i == 0) {
                    this.map.setBaseLayer(layer);
                }
            }
            this.map.setCenter(layers[0].maxExtent.getCenterLonLat(), parseInt(layers[0].numZoomLevels / 2));
            // console.log(this);
        }
        if (typeof(getOverLayers) != "undefined") {
            var overlayers = getOverLayers();
            if (overlayers && overlayers.length > 0) {
                this.map.addLayers(overlayers);
            }
        }

        var markerLayer = new OpenLayers.Layer.Markers("searchLayer", {
            removeFromButton: false,
            //remove from the clearallmarkers button;
            displayInLayerSwitcher: false
        });
        var searchVLayer = new OpenLayers.Layer.Vector("searchVLayer", {
            removeFromButton: false,
            //remove from the clearallmarkers button;
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": hisstyle
            })
        });
        this.map.map.addLayer(markerLayer);
        this.map.map.addLayer(searchVLayer);
        this.map.map.raiseLayer(searchVLayer, -5);
        if (typeof(initMapExtendTool) != "undefined") {
            var maptools = initMapExtendTool();
            for (var i = 0; i < maptools.length; i++) {
                this.map.addTool(maptools[i][0], maptools[i][1], maptools[i][2], maptools[i][3]);
            }
            // console.log(this);
        }
        var self = this;
        digitnexus.ajaxGet('/rest/mapinfo/getMapInfo', null, function(response) {
            if (!response) {
                return;
            }

            var lon = response.lon;
            var lat = response.lat;
            var zoom = response.zoom;
            var layername = response.name;
            var layer = self.map.map.getLayersByName(layername);

            if (layer) {
                self.map.map.setBaseLayer(layer[0]);
            }
            self.map.map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
        }, function(xhr, status, exception) {

        });
        
       
        digitnexus.ajaxGet('/rest/mapinfo/getLayerInfo', null, function(response) {
            if (!response) {
                return;
            } 
            for(var i=0;i<response.length;i++){
            	var layer=response[i]
            	var boundsb= new OpenLayers.Bounds(layer.minx,layer.miny,layer.maxx,layer.maxy);  
            	var sblayer= new OpenLayers.Layer.XYZ( 
            			layer.name,
            	        "rest/tile/"+layer.id+"/${z}/${x}/${y}" ,{
            	        	projection: "EPSG:404000",
            	        	 maxExtent: boundsb, 
            	  		   numZoomLevels:layer.smallLevel+layer.bigLevel+1, 
            	  		   maxResolution:layer.resolution, 
            	  		   units:'inches' , 
            	  	    	singleTile:false,
            	  	    	zoomOffset:1
            	        }        
            	);
            	
            	self.map.map.addLayer(sblayer);
            }
        }, function(xhr, status, exception) {

        });
        
        
        digitnexus.ajaxGet('/rest/mapinfo/getVectorLayerInfo', null, function(response) {
            if (!response) {
                return;
            } 
            for(var i=0;i<response.length;i++){
            	var layer=response[i];
            //	console.log(layer);
            	if(layer.geometryType=="POINT"){
            		var mlayer=new OpenLayers.Layer.ScaleMarkers(layer.name,{
            			visibility:false,
            			minLevel:layer.showStartLevel,
            			maxLevel:layer.showEndLevel,
            			 layerId:layer.id,
            			 icon:"rest/mapinfo/getIcon/"+layer.id,
            			 layerType:layer.geometryType
            		}); 
            		
            		mlayer.events.register("visibilitychanged",mlayer,   function (e) {
         	    	   self.loadMarkerLayer(e);
         	       }); 
            		 self.map.map.addLayer(mlayer);
            	}else{
            		var style= new OpenLayers.Style({
            			  strokeColor: layer.lineColor,
            			  strokeWidth:layer.lineWidth,
            			  fillColor:layer.fillColor,
            			  fillOpacity:.3,
            			  strokeOpacity:.8,
            			  pointRadius:5
            		});
            		
            		var vlayer=new OpenLayers.Layer.Vector(layer.name,{ 
            			 visibility:false,
            			 minLevel:layer.showStartLevel,
            			 maxLevel:layer.showEndLevel,
            			 layerId:layer.id,
            			 layerType:layer.geometryType,
            			 styleMap:new OpenLayers.StyleMap({
            	   			 "default": style
            	   		})
            		 });
            		vlayer.events.register("visibilitychanged",vlayer,   function (e) {
            	    	   self.loadLayer(e);
            	       }); 
            		 self.map.map.addLayer(vlayer);
            	}
            }
        }, function(xhr, status, exception) {

        });
        
    },
    loadLayer:function(ee){
    	var self=this;
    	 if(ee.object.getVisibility()){	 
	    	 
	    	var layer=ee.object;
	   		if(layer.minLevel&&layer.maxLevel){ 
	   			if((self.map.map.getZoom()>layer.maxLevel||self.map.map.getZoom()<layer.minLevel)){ 
	   				layer.setHideFromScale=true;
				       layer.setVisibility(false);
				       return ;
	   			}
	   		}
	    	var id=layer.layerId;
	    	var type=layer.layerType;
	    	 if(!layer.isLoad){ 
		    	   layer.isLoad=true;
		    	    digitnexus.ajaxGet('/rest/mapinfo/getVectorFeature/'+id+"/"+type, null, function(response) {
		             if (!response) {
		                 return;
		             } 
		             for(var i=0;i<response.length;i++){
		             	var feature=response[i]; 
		             	 var parser = new OpenLayers.Format.WKT(); 
	      		            var geometry = parser.read(feature.points);  
	      				   layer.addFeatures([geometry]); 
		             }
		         }, function(xhr, status, exception) {
		
		         });
	    	}
      }
    },
    loadMarkerLayer:function(ee){
    	var self=this;
    	 
   	 if(ee.object.getVisibility()){	 
   		var layer=ee.object;
   		if(layer.minLevel&&layer.maxLevel){ 
   			if((self.map.map.getZoom()>layer.maxLevel||self.map.map.getZoom()<layer.minLevel)){ 
   				layer.setHideFromScale=true;
			       layer.setVisibility(false);
			       return ;
   			}
   		}
	    	 
	    	var id=layer.layerId;
	    	var type=layer.layerType;
	    	 if(!layer.isLoad){ 
		    	   layer.isLoad=true;
		    	    digitnexus.ajaxGet('/rest/mapinfo/getVectorFeature/'+id+"/"+type, null, function(response) {
		             if (!response) {
		                 return;
		             } 
		             for(var i=0;i<response.length;i++){
		              	 var feature=response[i]; 
		             	  var parser = new OpenLayers.Format.WKT(); 
	      		           var geometry = parser.read(feature.points).geometry;
	      		        //   console.log(geometry.x);
	      		         var marker=new OpenLayers.Marker.InfoIconMarker (new OpenLayers.LonLat(geometry.x,geometry.y).transform(
	     					        new OpenLayers.Projection("EPSG:4326"),
	     					        self.map.map.getProjectionObject()
	     					    ),feature.name,layer.icon,true);
	      		           layer.addMarker(marker);
		             }
		         }, function(xhr, status, exception) {
		
		         });
	    	}
     }
    },
    resize: function() {
        var parentViewHeight = this.$el.height();
        this.childView.height(parentViewHeight - 10);
        this.childView.width("auto");

        if (!this.map) {
            this.initMap();
        } else {
            this.map.resize(this.$el.width(), this.$el.height());
        }
    }
});

window.MapContenerEastView = Backbone.View.extend({
    tagName: "div",
    className: "ui-layout-east",

    initialize: function() {
        this.id = this.id + "_east";
        this.parentView = this.options.parentView;
        this.$el.attr({
            id: this.id,
            style: 'padding:0;width:100%;height:100%;border:0;overflow:hidden;'
        });
    },
    resize: function() {
        return this;
    },
    setSearchCriteria: function(searchData, articleSummary) {

        this.$el.empty();
        this.parentView.mapCenterView.map.map.clearAllMarkers();
        
        this.parentView.mapCenterView.map.toolBar.switchModeTo("pan");
        this.$el[0].style.display = "";
        this.listView = new MapTableView({
            el: viewCreator.make('table'),
            model: articleSummary,
            showListToolbar: false,
            showIdColumn: false,
            searchCriteria: searchData,
            map: this.parentView.mapCenterView.map
        }).render();
        this.$el.append(this.listView.$el);

        var self = this;
        this.parentView.setAdjustEastcontner(function() {
            self.listView.dataTable.fnAdjustColumnSizing();
        });
    }
});


window.MapSearchModel = Backbone.Model.extend({
    urlRoot: './rest/uimanage/menu/gismenu'
});

window.MapSearchViewContener = Backbone.View.extend({
    tagName: "div",
    className: 'searchBar',
    searchViews: {},

    initialize: function() {
        this.$el.attr("style", "display: block;");
        this.rendered = false;
        this.isVisible = false;
        this.searchViews = [];
        this.metaData = {};
        this.parentView = this.options.parentView;
    },
    render: function() {
        this.$el.append("<div class='icon_search'></div>");

        var self = this;
        this.searchModel = new MapSearchModel();
        this.searchModel.fetch({
            success: function(data) {
                var metaData = data.toJSON();

                var start = 0;

                for (var key in metaData) {
                    var newName = digitnexus.modifiedArticleName(metaData[key].remark);
                    if (start == 0) {
                        start = metaData[key].remark;
                    }
                    self.metaData[newName] = metaData[key];
                }
                self.showContent(metaData);
                if (start != 0) {
                    self.showSearchContent(start);
                }
            }
        });
        return this;
    },
    showSearchContent: function(name) {
        var newName = digitnexus.modifiedArticleName(name);
        
        if(this.searchViews && this.searchViews.length>0){
        	for (var key in this.searchViews) {
                this.searchViews[key].$el.hide();
            }
        }

        if (!this.searchViews[newName]) {
            var searchMeta = ArticleSearchMeta.getMeta(name);
            this.searchViews[newName] = new MapSearchView({
                searchMeta: searchMeta,
                articleSummary: this.metaData[newName],
                listView: this
            });
            this.$el.append(this.searchViews[newName].render().el);
            this.searchViews[newName].showContent(true);
            this.searchViews[newName].$el.show();
        } else {
            this.searchViews[newName].$el.show();
        }
    },
    showContent: function(metaData) {

        this.divSearchTypeEL = $(viewCreator.make("div", {
            "class": "search_content_l list2"
        }));
        this.divSearchTypeEL.append($(viewCreator.make("font", {}, label_map_search_type)));

        this.$el.append(this.divSearchTypeEL);

        this.mapSelectComponent = new MapSelectComponent({
            parentView: this,
            metaData: metaData
        });
        this.divSearchTypeEL.append(this.mapSelectComponent.render().el);
    },
    fireSelectEvent: function(index) {
        for (var i = 0; i < this.searchViews.length; i++) {
            if (index == 0) {
                this.searchViews[i].$el.hide();
            } else if (i == index - 1) {
                this.searchViews[i].$el.show();
            } else {
                this.searchViews[i].$el.hide();
            }
        }
    },
    setSearchCriteria: function(searchData, articleSummary) {
        this.parentView.setSearchCriteria(searchData, articleSummary);
    },
    resize: function() {
        return this;
    }
});


window.MapSelectComponent = Backbone.View.extend({
    tagName: 'select',
    events: {
        'change': 'onChange'
    },

    initialize: function() {
        this.parentView = this.options.parentView;
    },

    render: function() {
        var metaData = this.options.metaData;
        for (var key in metaData) {
            this.$el.append(viewCreator.make('option', {
                'value': metaData[key].remark
            }, metaData[key].name));
        }
        return this;
    },
    onChange: function() {
        var value = this.$el.val();
        this.parentView.showSearchContent(value);
    }
});


window.MapSearchView = SearchView.extend({
    className: "search_content_r",
    parentView: null,
    initialize: function() {
        this.parentView = this.options.listView;

        this.$el.attr("style", "display: none;");
        this.rendered = false;
        this.isVisible = false;
        this.model = new ArticleSearchModel();
        //For Form binding
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function() {
        var divSearchButtonEL = $(viewCreator.make("div", {
            "class": "search_btn list2"
        }));
        this.$el.append(divSearchButtonEL);

        var ulEl = $(viewCreator.make("ul"));
        divSearchButtonEL.append(ulEl);

        var liSearchButtonEl = $(viewCreator.make("li"));
        //	var liResetButtonEl=$(viewCreator.make("li"));
        ulEl.append(liSearchButtonEl);
        //	ulEl.append(liResetButtonEl);
        var searchButton = new SearchContentButton({
            searchView: this
        });
        liSearchButtonEl.append(searchButton.render().el);

        //	var resetButton=new SearchContentResetButton({searchView:this});
        //	liResetButtonEl.append(resetButton.render().el);
        this.searchFormDivEl = $(viewCreator.make("div", {
            "class": "search_content_r_l list2"
        }));
        this.$el.append(this.searchFormDivEl);

        this.showContent();
        return this;
    },
    showContent: function(basic) {
        if (!this.rendered) {
            this.searchFormEl = $(viewCreator.make('form', {
                'action': ''
            }));
            var ulEl = $(viewCreator.make('ul'));
            this.searchFormEl.append(ulEl);
            this.searchFormDivEl.append(this.searchFormEl);

            this.advancedSearchItems = [];
            this.referenceItems = {};
            var searchMetaFields = this.options.searchMeta.fields;
            var searchFieldsLength = searchMetaFields.length;

            for (var i = 0; i < searchFieldsLength; i++) {
                var searchMetaField = searchMetaFields[i];

                var searchItem = new SearchItem({
                    model: searchMetaField,
                    searchMeta: this.options.searchMeta
                });
                ulEl.append(searchItem.render().el);

                //The component should be part of main dom to create date and time components
                if (searchMetaField.dataType === 'DATE') {
                    searchItem.makeDateTime();
                } else if (searchItem.referenceComponent) {
                    this.referenceItems[searchMetaField.name] = searchItem.referenceComponent;
                } else if (searchMetaField.displayType === 'POINT' || searchMetaField.displayType === 'POLYLINE' || searchMetaField.displayType === 'POLYGON') {
                    //	var map=this.parentView.parentView.mapContenerView.mapCenterView.map.map; 
                    var map = null;
                    searchItem.inputView.makeMap(map);
                }

                if (!searchMetaField.basic) {
                    this.advancedSearchItems[this.advancedSearchItems.length] = searchItem;
                }
            }
            this.rendered = true;
            var bindings = Backbone.ModelBinder.createDefaultBindings(this.searchFormEl, 'modelAttr');
            this.modelBinder.bind(this.model, this.searchFormEl, bindings);
        }

        //		if(!this.isVisible){
        //			this.$el.show();
        //			this.isVisible=true;
        //			this.options.listView.resize();
        //		}
        var advanceSearchItemsLength = this.advancedSearchItems.length;
        for (var i = 0; i < advanceSearchItemsLength; i++) {
            this.advancedSearchItems[i].showItem(!basic);
        }

    },

    doSearch: function() {
        //	this.parentView.parentView.mapContenerView.mapCenterView.map.toolBar.switchModeTo("pan"); 
        var searchMetaFields = this.options.searchMeta.fields;
        var searchFieldsLength = searchMetaFields.length;
        var searchData = $.extend({}, this.model.attributes);

        for (var a in searchData) {
            if (a.indexOf("_criteria") == -1 && !searchData[a + "_criteria"]) {
            	  var sel = $("[modelattr='" + a + "_criteria']", this.el)[0];
                  
                  if (sel) {
                      var val = sel.options[sel.selectedIndex].value;
                      searchData[a + "_criteria"] = val;
                  }

            }
        }
        //For criteria, backbone model binding adds extra property for text. Remove it
        for (var i = 0; i < searchFieldsLength; i++) {
            delete searchData[searchMetaFields[i].name + '_criteria_text'];
            delete searchData[searchMetaFields[i].name + '_text'];
        }

        //Get refrence data
        for (key in this.referenceItems) {
            var refView = this.referenceItems[key];
            var refModel = refView.getModelData();
            if (refModel) {
                searchData[refView.fieldMetaData.name] = refModel[refView.fieldMetaData.associationListMeta.idColumn.name];
            }
        }
        this.options.listView.setSearchCriteria(searchData, this.options.articleSummary);
    }
});


window.MapTableView = ListView.extend({
    render: function() {
        this.searchCriteria = this.options.searchCriteria;
        //Calling original render method
        ListView.prototype.render.call(this);
        return this;
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
            if (columnMeta.name == "points" || columnMeta.name == "loc") { //hidden points 
                columnMeta.hidden = true;
            }
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
    makeTable: function(metaData) {
    	ListView.prototype.makeTable.call(this,metaData);
        this.resize();
    }
});