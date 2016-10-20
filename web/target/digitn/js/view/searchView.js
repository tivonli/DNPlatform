window.SearchView = Backbone.DigitNexusView.extend({
    tagName: "div",
    className: 'searchBar',

    initialize: function() {
        this.rendered = false;
        this.isVisible = false;
        this.model = new ArticleSearchModel();
        //For Form binding
        this.modelBinder = new Backbone.ModelBinder();
    },

    render: function() {
        this.$el.append("<div class='icon_search'></div>");


        var divSearchButtonEL = $(viewCreator.make("div", {
            "class": "search_btn list2"
        }));
        this.$el.append(divSearchButtonEL);

        var ulEl = $(viewCreator.make("ul"));
        divSearchButtonEL.append(ulEl);

        var liSearchButtonEl = $(viewCreator.make("li"));
        var liResetButtonEl = $(viewCreator.make("li"));
        ulEl.append(liSearchButtonEl);
        ulEl.append(liResetButtonEl);

        var searchButton = new SearchContentButton({
            searchView: this
        });
        liSearchButtonEl.append(searchButton.render().el);

        var resetButton = new SearchContentResetButton({
            searchView: this
        });
        liResetButtonEl.append(resetButton.render().el);

        this.searchFormDivEl = $(viewCreator.make("div", {
            "class": "search_content list2"
        }));
        this.$el.append(this.searchFormDivEl);

        this.renderSearchForm();


        return this;
    },

    renderSearchForm: function() {
        this.searchFormEl = $(viewCreator.make('form', {
            'action': ''
        }));
        var ulEl = $(viewCreator.make('ul'));
        this.searchFormEl.append(ulEl);
        this.searchFormDivEl.append(this.searchFormEl);

        this.advancedSearchItems = [];
        this.referenceItems = {};
        var searchMetaFields = this.options.searchMeta.fields;
        if(this.options.justRenderSearchView){
        	var tempSearchMetaFields = [];
        	for(var k = 0; k < searchMetaFields.length; k ++){
        		if(searchMetaFields[k].inPopupWindow){
        			tempSearchMetaFields.push(searchMetaFields[k]);
        		}
        	}
        	searchMetaFields = tempSearchMetaFields;
        }
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

                searchItem.inputView.makeMap();
            }

            if (!searchMetaField.basic) {
                this.advancedSearchItems[this.advancedSearchItems.length] = searchItem;
            }
        }

        this.bindings = Backbone.ModelBinder.createDefaultBindings(this.searchFormEl, 'modelAttr');
        this.modelBinder.bind(this.model, this.searchFormEl, this.bindings);

        //apply chosen
        this.applyChosenOnSearchForm();
        //Hide advanced items only after chosen is applied
        var advanceSearchItemsLength = this.advancedSearchItems.length;
        for (var i = 0; i < advanceSearchItemsLength; i++) {
            this.advancedSearchItems[i].showItem(false);
        }

    },
    
    applyChosenOnSearchForm:function(){
        //Calculate width
        var selectElements=this.searchFormEl.find('select');
        var selectElement=$(selectElements[0]);
        selectElement.after("<input type='text' style='float:left;'></input>");
        selectElement.hide();
        //Find width of input element
        var width = selectElement.next().getHiddenDimensions(true).outerWidth;
        //Remove input element
        selectElement.next().remove();
        selectElement.show()
        selectElements.width(width);
        this.searchFormEl.find('.boolean_select').chosen({
            disable_search_threshold: 3
        });
        this.searchFormEl.find('.search_select').chosen();
        this.searchFormEl.find('.criteria_select').chosen({
            disable_search_threshold: 6
        });
         
    },

    showContent: function(basic) {
        if (!this.isVisible) {
            this.$el.show();
            this.isVisible = true;
            this.options.listView.resize();
        }
         
        var advanceSearchItemsLength = this.advancedSearchItems.length;
        for (var i = 0; i < advanceSearchItemsLength; i++) {
            this.advancedSearchItems[i].showItem(!basic);
        }
    },

    doSearch: function() {

        var searchMetaFields = this.options.searchMeta.fields;
        var searchFieldsLength = searchMetaFields.length;
        var searchData = $.extend({}, this.model.attributes);

        //criteria depend on seachData
        //seachData from referenceItems        
        //Get refrence data before get criteria data
        for (key in this.referenceItems) {
            var refView = this.referenceItems[key];
            var refModel = refView.getModelData();
            if (refModel) {
                searchData[refView.fieldMetaData.name] = refModel[refView.fieldMetaData.associationListMeta.idColumn.name];
            }
        }
    

        for (var a in searchData) {
        
            if (a.indexOf("_criteria") == -1 && !searchData[a + "_criteria"]) {
                //var sel=$("#"+a+"_criteria")[0];
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


        this.options.listView.setSearchCriteria(searchData);
    },

    resetForm: function() {
        this.model.clear();
        this.modelBinder.unbind();
        this.modelBinder.bind(this.model, this.searchFormEl, this.bindings);
        this.options.listView.setSearchCriteria(null);
        
        //reset chosen
        this.searchFormEl.find('.boolean_select').val("").trigger("liszt:updated");
        this.searchFormEl.find('.search_select').val("").trigger("liszt:updated");
        this.searchFormEl.find('.criteria_select').val("").trigger("liszt:updated");
    },

    hideView: function() {
        this.$el.hide();
        this.isVisible = false;
        this.options.listView.resize();
    }

});

window.ListSearchButton = ListTopButton.extend({
    className: 'tool_r btn_1',

    initialize: function() {
        this.$el.attr("href", "#");
        this.expand = false;
        this.basicSearch = true;
        this.searchView = this.options.searchView;
    },

    onClick: function() {
        if (this.expanded) {
            if (this.basicSearch) {
                this.searchView.showContent(false);
            } else {
                this.searchView.showContent(true);
            }

            this.basicSearch = !this.basicSearch;
        } else {
            this.expanded = true;
            this.searchView.showContent(this.basicSearch);
            this.closeButton.showButton();
        }

        this.toggleExpandedSearchLabel();
    },

    setLabel: function(label) {
        this.spanEl.text(label);
    },

    toggleExpandedSearchLabel: function() {
        if (this.basicSearch) {
            this.setLabel(label_advancedSearch);
        } else {
            this.setLabel(label_basicSearch);
        }

    },

    render: function() {
        this.spanEl = $(viewCreator.make("span"));
        this.spanEl.append(viewCreator.make("div", {
            "class": "btn_icon3 icon_search2"
        }));
        this.spanEl.append(label_search);
        this.$el.append(this.spanEl);
        return this;
    },

    closeSearch: function() {
        this.setLabel(label_search);
        this.expanded = false;
        this.searchView.hideView();

    },

    setCloseButton: function(closeButton) {
        this.closeButton = closeButton;
    },

    setSearchView: function(searchView) {
        this.searchView = searchView;
    }
});

window.CloseSearchButton = ListTopButton.extend({
    className: 'tool_r btn_1',

    initialize: function() {
        this.$el.attr({
            href: "#",
            style: 'display:none;'
        });

        this.searchButton = this.options.searchButton;
    },

    onClick: function() {
        this.searchButton.closeSearch();
        this.$el.toggle();
    },

    render: function() {
        var spanEl = $(viewCreator.make("span"));
        spanEl.append(viewCreator.make("div", {
            "class": "btn_icon3 icon_search2"
        }));
        spanEl.append(label_closeSearch);
        this.$el.append(spanEl);
        return this;
    },

    showButton: function() {
        this.$el.toggle();
    }
});

window.SearchContentResetButton = ListTopButton.extend({
    className: 'btn_1',

    initialize: function() {
        this.$el.attr('href', '#');
    },

    onClick: function() {
        this.options.searchView.resetForm();
    },

    render: function() {
        var spanEl = $(viewCreator.make("span"));
        spanEl.append(viewCreator.make("div", {
            "class": "btn_icon3 icon_reset"
        }));
        spanEl.append(label_reset);
        this.$el.append(spanEl);
        return this;
    }
});

window.SearchContentButton = ListTopButton.extend({
    className: 'btn_1',

    initialize: function() {
        this.$el.attr('href', '#');
    },

    onClick: function() {
        this.options.searchView.doSearch();
    },

    render: function() {
        var spanEl = $(viewCreator.make("span"));
        spanEl.append(viewCreator.make("div", {
            "class": "btn_icon3 icon_search2"
        }));
        spanEl.append(label_search);
        this.$el.append(spanEl);
        return this;
    }
});

window.SearchTextComponent = Backbone.View.extend({
    tagName: 'input',
    className: 'search_textBox',

    initialize: function() {
        this.$el.attr({
            type: 'text',
            modelAttr: this.id
        });

    }
});

window.SearchDateTimeComponent = SearchTextComponent.extend({

    makeDateTime: function() {
        this.$el.attr("readOnly", "true");
        var id = this.$el.attr("id");
        this.$el.attr("id", this.options.searchMeta.name.replace(/\./g, "_") + "_" + id);
        if (this.model.displayType === "DATETIME") {
            this.$el.datetimepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date And Time'
            });
        } else {
            this.$el.datepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date',
                changeMonth: true,            
                changeYear: true
            });
        }
    }

});


window.BetweenDateTimeComponent = SearchTextComponent.extend({

    makeDateTime: function() {
        this.$el.attr("readOnly", "true");
        var id = this.$el.attr("id");
        this.$el.attr("id", this.options.searchMeta.name.replace(/\./g, "_") + "_" + id);

        this.maxInput = this.options.parentView.maxInput;
        this.inputView = this.options.parentView.inputView;

        if (this.model.displayType === "DATETIME") {
            this.datetimepicker();
        } else {
            this.datepicker();
        }
    },

    datetimepicker: function() {
        var self = this;

        if (this.options.isMax) {
            this.$el.datetimepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date And Time',
                onClose: function(dateText, inst) {
                    var startDateTextBox = self.inputView.$el;
                    if (startDateTextBox.val() != '') {
                        var testStartDate = new Date(startDateTextBox.val());
                        var testEndDate = new Date(dateText);
                        if (testStartDate > testEndDate) startDateTextBox.val(dateText);
                    } else {
                        //startDateTextBox.val(dateText);
                    }
                },
                onSelect: function(selectedDateTime, inst) {
                    var end = $(this).datetimepicker('getDate');
                    self.inputView.$el.datetimepicker('option', 'maxDate', new Date(end.getTime()));
                    inst.input.trigger('change');
                }
            });
        } else {
            this.$el.datetimepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date And Time',
                onClose: function(dateText, inst) {
                    var endDateTextBox = self.maxInput.$el;
                    if (endDateTextBox.val() != '') {
                        var testStartDate = new Date(dateText);
                        var testEndDate = new Date(endDateTextBox.val());
                        if (testStartDate > testEndDate) endDateTextBox.val(dateText);
                    } else {
                        //endDateTextBox.val(dateText);
                    }
                },
                onSelect: function(selectedDateTime, inst) {
                    var start = $(this).datetimepicker('getDate');
                    self.maxInput.$el.datetimepicker('option', 'minDate', new Date(start.getTime()));
                    inst.input.trigger('change');
                }
            });
        }
    },
    datepicker: function() {
        var self = this;

        if (this.options.isMax) {
            this.$el.datepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date',
                changeMonth: true,            
                changeYear: true,
                yearRange: 'c-20:c+20',
                onClose: function(dateText, inst) {
                    var startDateTextBox = self.inputView.$el;
                    if (startDateTextBox.val() != '') {
                        var testStartDate = new Date(startDateTextBox.val());
                        var testEndDate = new Date(dateText);
                        if (testStartDate > testEndDate) startDateTextBox.val(dateText);
                    } else {
                        // startDateTextBox.val(dateText);
                    }
                },
                onSelect: function(selectedDateTime, inst) {
                    var end = $(this).datetimepicker('getDate');
                    self.inputView.$el.datetimepicker('option', 'maxDate', new Date(end.getTime()));
                    inst.input.trigger('change');
                }
            });
        } else {
            this.$el.datepicker({
                showOn: "button",
                buttonImage: "images/common/calendar.gif",
                buttonImageOnly: true,
                buttonText: 'Choose Date',
                changeMonth: true,            
                changeYear: true,
                yearRange: 'c-20:c+20',
                onClose: function(dateText, inst) {
                    var endDateTextBox = self.maxInput.$el;
                    if (endDateTextBox.val() != '') {
                        var testStartDate = new Date(dateText);
                        var testEndDate = new Date(endDateTextBox.val());
                        if (testStartDate > testEndDate) endDateTextBox.val(dateText);
                    } else {
                        //endDateTextBox.val(dateText);
                    }
                },
                onSelect: function(selectedDateTime, inst) {
                    var start = $(this).datetimepicker('getDate');
                    self.maxInput.$el.datetimepicker('option', 'minDate', new Date(start.getTime()));
                    inst.input.trigger('change');
                }
            });
        }
    }

});



window.SearchMapComponent = SearchTextComponent.extend({

    makeMap: function(oldmap) {
        var img = $(viewCreator.make("img", {
            "id": this.id + "_img",
            "src": "skins/common/images/map/point_1.png"
        }));
        this.$el.parent().append(img);


        var elemd = $(viewCreator.make("div", {
            "id": this.id + "_dialog"
        }));
        this.$el.parent().append(elemd);



        var style = {
            strokeColor: '#FFE100',
            strokeWidth: 3,

            fillOpacity: .1,
            fillColor: 'white',
            pointRadius: 10
        };

        var id = this.id;
        var myself = this;
        var rand=Math.random();
        var mapid = id + "_map_"+rand;
        var mapToolId = id + "_mapTool_"+rand;

        img.click(function() {

//            if (oldmap) {
//                elemd[0].map = oldmap;
//                var dynmicLayer = new OpenLayers.Layer.Vector("dynmic Layer", {
//                    displayInLayerSwitcher: false,
//                    styleMap: new OpenLayers.StyleMap({
//                        "default": style
//                    })
//                });
//
//                oldmap.addLayers([dynmicLayer]);
//
//                var control = new OpenLayers.Control.DrawFeature(dynmicLayer, OpenLayers.Handler.Polygon, {
//                    displayClass: "olControlAdd",
//                    handlerOptions: {
//                        layerOptions: {
//                            styleMap: editstyle
//                        }
//                    }
//                });
//
//                control.events.on({
//                    "featureadded": myself.handleAddGeometryEnd,
//                    scope: myself
//                });
//                oldmap.addControl(control);
//                control.activate();
//                return;
//            }

            elemd.dialog({
                height: 500,
                width: 800,
                show: "blind",
                buttons: {
                    "Ok": function() {
                        $(this).dialog("close");
                    }
                },
                resize: function() {
                    $("#" + mapid)[0].style.width = this.offsetWidth - 15 + "px";
                    $("#" + mapid)[0].style.height = this.offsetHeight - 10 + "px";
                    this.map.resize();
                }
            }).html("<div id=" + mapToolId + " style='width:780px;height:20px;' ></div><div id=" + mapid + " style='width:780px;height:420px;'></div>");
            elemd.dialog("open");
            var dynmicLayer = new OpenLayers.Layer.Vector("dynmic Layer", {
                displayInLayerSwitcher: false,
                styleMap: new OpenLayers.StyleMap({
                    "default": style
                })
            });
            var map = new digitnexus.Map(document.getElementById(mapid), {
                showGoogleMap: false
            });
            elemd[0].map = map;

            var layers=[];
            if(typeof(getCustomLayer)!="undefined"){
            	layers= getCustomLayer();
       		 }
   		   if(layers.length>0){  
                for (var i = 0; i < layers.length; i++) {
                    map.addLayers([layers[i].clone()]);
                }
                var lonlat = layers[0].maxExtent.getCenterLonLat();
                var lat = lonlat.lat + layers[0].maxExtent.getWidth() / 4;
                map.setCenter(new OpenLayers.LonLat(lonlat.lon, lat), parseInt(layers[0].numZoomLevels / 2));
            }
            map.addLayers([dynmicLayer]);

            var control = new OpenLayers.Control.DrawFeature(dynmicLayer, OpenLayers.Handler.Polygon, {
                displayClass: "olControlAdd",
                handlerOptions: {
                    layerOptions: {
                        styleMap: editstyle
                    }
                }
            });

            control.events.on({
                "featureadded": myself.handleAddGeometryEnd,
                scope: myself
            });
            map.map.addControl(control);
            control.activate();

        });

    },
    handleAddGeometryEnd: function(event) {
        var fea = event.feature;
        var layer = event.feature.layer;
        layer.map.clearAllMarkers();
        layer.removeAllFeatures();
        layer.addFeatures([fea]);
        
        this.$el.val(event.feature.geometry);

        this.$el.change();

    }
});

window.SearchSelectComponent = Backbone.View.extend({
    tagName: 'select',

    initialize: function() {
        this.$el.attr({
            id: this.id + '_' + uniqueID(),
            modelAttr: this.id,
            "data-placeholder" : select_an_option
        });

    },

    render: function() {
        this.$el.append(viewCreator.make('option', {
            'value': ''
        }, ''));
        if (this.model.dataType === 'BOOLEAN') {
            this.$el.append(viewCreator.make('option', {
                'value': 'true'
            }, label_yes));
            this.$el.append(viewCreator.make('option', {
                'value': 'false'
            }, label_no));
            this.$el.addClass('boolean_select');
        } else {
            for (key in this.model.values) {
                this.$el.append(viewCreator.make('option', {
                    'value': key
                }, this.model.values[key]));
            }

            this.$el.addClass('search_select');
        }

        return this;
    }
});

window.SearchReferenceComponent = ReferenceElementView.extend({
    tagName: 'span',
    className: 'toolbar-button',

    events: {
        'click': 'showSelector'
    },

    render: function() {
        this.inputElementEl = this.options.inputElementEl;
        // this.inputElementEl.attr('readOnly', 'true');
        this.$el.attr('title', 'Select Article');
        this.$el.append("<img border='0' class='article_selector'>");
        return this;
    }

});

window.SearchCriteriaComponent = Backbone.View.extend({
    tagName: 'select',

    events: {
        "change": "valueChanged"
    },

    initialize: function() {

        this.$el.attr({
            id: this.id + '_' + uniqueID(),
            modelAttr: this.id,
            style: 'width:100%;'
        });

        this.$el.addClass('criteria_select');

    },

    render: function() {
        var citeria = this.options.criteria;
        var self = this;

        $.each(citeria, function(name, value) {
            var label_value = value;
            switch (name.toUpperCase()) {
            case "LIKE":
                label_value = label_like;
                break;
            case "GEOIN":
                label_value = label_in;
                break;
            case "GEONOIN":
                label_value = label_not_in;
                break;
            }

            var optionEl = $(viewCreator.make('option', {
                'value': name
            }, label_value));
            self.$el.append(optionEl);

        });


        if ('BETWEEN' in citeria) {
            this.currentValue = 'BETWEEN';
            this.isBetween = true;
        } else {
            this.currentValue = '';
        }
        return this;
    },

    valueChanged: function() {

        if (this.isBetween === undefined) {
            return;
        }
        var prevValue = this.currentValue;
        this.currentValue = this.el.options[this.el.selectedIndex].value;


        if (prevValue === 'BETWEEN') {
            this.options.searchItem.showBetweens(false);
        }

        if (this.currentValue === 'BETWEEN') {
            this.options.searchItem.showBetweens(true);
        }
    }
});

window.SearchItem = Backbone.View.extend({
    tagName: 'li',

    render: function() {
        this.$el.append(viewCreator.make('font', {}, this.model.displayKey));
        var criteriaFont = $(viewCreator.make('font'));
        var criteriaView = new SearchCriteriaComponent({
            id: this.model.name + '_criteria',
            criteria: this.model.criteria,
            searchItem: this
        });

        this.criteriaView = criteriaView;
        criteriaFont.append(criteriaView.render().el);
        this.$el.append(criteriaFont);

        var inputSpan = $(viewCreator.make('span'));
        var inputFont = $(viewCreator.make('font'));
        inputSpan.append(inputFont);
        this.inputView = this.getSearchInput(this.model.name, this.model, false);
        if (this.inputView) {
            inputFont.append(this.inputView.render().el);

            //Handling reference selectors
            var dataType = this.model.dataType + "_" + this.model.displayType;
            if (dataType.toLowerCase() === 'reference_article_select') {
                this.referenceComponent = new SearchReferenceComponent({
                    fieldMetaData: this.model,
                    articleEditMeta: this.options.searchMeta,
                    dataUrl: '/article/list/data/searchviewassociation/' + this.options.searchMeta.name + '?propertyName=' + this.model.name,
                    dataCountUrl: '/article/list/data/count/searchviewassociation/' + this.options.searchMeta.name + '?propertyName=' + this.model.name,
                    inputElementEl: this.inputView.$el
                });
                inputSpan.append(this.referenceComponent.render().el);

            }

            if ('BETWEEN' in this.model.criteria) {
                this.betweenSpan = $(viewCreator.make('span', {
                    'style': 'display: inline;'
                }));
                this.betweenSpan.append(viewCreator.make('font', {}, '-'));

                var maxInputFont = $(viewCreator.make('font'));
                this.maxInput = this.getSearchInput(this.model.name + '_max', this.model, true);
                maxInputFont.append(this.maxInput.render().el);
                this.betweenSpan.append(maxInputFont);
                inputSpan.append(this.betweenSpan);
            }

        }

        this.$el.append(inputSpan);
        return this;
    },

    getSearchInput: function(id, model, isMax) {
        var dataType = this.model.dataType + "_" + this.model.displayType;

        switch (dataType.toLowerCase()) {
        case "string_point":
        case "string_polyline":
        case "string_polygon":

            return new SearchMapComponent({
                id: id,
                model: model
            });

            break;
        case "string_textfield":
        case "long_textfield":
        case "integer_textfield":
        default:
            return new SearchTextComponent({
                id: id,
                model: model
            });
        case "date_date":
        case "datetime_datetime":
            if ('BETWEEN' in this.model.criteria) {
                return new BetweenDateTimeComponent({
                    id: id,
                    model: model,
                    parentView: this,
                    isMax: isMax,
                    searchMeta: this.options.searchMeta
                });
            } else {
                return new SearchDateTimeComponent({
                    id: id,
                    model: model,
                    searchMeta: this.options.searchMeta
                });
            }

        case "boolean_select":
        case "enumeration_select":
            return new SearchSelectComponent({
                id: id,
                model: model
            });
        }
    },

    showBetweens: function(show) {
        var isDateTimePicker = true;
        if (show) {
            this.betweenSpan.show();
            isDateTimePicker = true;
        } else {
            this.betweenSpan.hide();
            isDateTimePicker = false;
        }

        if ('BETWEEN' in this.model.criteria) {
            if (isDateTimePicker) {
                var start = this.maxInput.$el.datetimepicker('getDate');
                this.inputView.$el.datetimepicker('option', 'maxDate', new Date(start.getTime()));
                this.inputView.$el.trigger('change');

                var end = this.inputView.$el.datetimepicker('getDate');
                this.maxInput.$el.datetimepicker('option', 'minDate', new Date(end.getTime()));
                this.maxInput.$el.trigger('change');
            } else {
                this.inputView.$el.datetimepicker('option', 'maxDate', null);
            }
        }
    },

    showItem: function(show) {
        if (show) {
            this.$el.show();
        } else {
            this.$el.hide();
        }
    },

    makeDateTime: function() {
        this.inputView.makeDateTime();
        if (this.maxInput) {
            this.maxInput.makeDateTime();
        }
    }
});

window.SearchCriteriaView = Backbone.View.extend({
    tagName: 'select',

    events: {
        "change": "valueChanged"
    },

    initialize: function() {

        this.searchCriteriaMetas = this.options.listMeta.searchCriteriaMetas;
        this.listView = this.options.listView;

    },

    render: function() {
        //To show all
        this.$el.append(viewCreator.make('option', {
            'value': ''
        }, ''));

        var noadd = true;
        for (var i = 0; i < this.searchCriteriaMetas.length; i++) {
            var searchCriteria = this.searchCriteriaMetas[i];
            if (searchCriteria.visible) {
                var optionEl = $(viewCreator.make('option', {
                    'value': searchCriteria.id
                }, searchCriteria.displayName));
                if (noadd) {
                    noadd = false;
                    optionEl.attr('selected', 'selected');
                }
                if (searchCriteria.defaultCriteria) {
                    noadd = false;
                    optionEl.attr('selected', 'selected');
                }

                this.$el.append(optionEl);
            }
        }
        return this;
    },

    valueChanged: function() {

        var currentValue = this.el.options[this.el.selectedIndex].value;
        var searchData = {};
        if (this.currentValue !== '') {
            searchData['searchCriteriaId'] = currentValue;
            this.listView.setSearchCriteria(searchData);
        }

    }
});