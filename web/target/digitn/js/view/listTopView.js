window.ListToolBar = Backbone.DigitNexusView.extend({
    tagName: "div",
    className: 'toolBar',

    initialize: function() {
    	this.justRenderSearchView = false;
    	if(this.options.justRenderSearchView !== null && this.options.justRenderSearchView !== undefined){
    		this.justRenderSearchView = this.options.justRenderSearchView;
    	}
        this.toolbarEl = this.options.toolbarEl;
        this.listView = this.options.listView;
        //This method modifies the original artileSummary wich has side effects at othe places.So cloning
        //articleSummary passed
        this.articleSummary = _.clone(this.options.articleSummary);
        this.listMeta = this.model;
        this.searchMeta = null;
        if (typeof this.articleSummary.referArticleName != 'undefined') {
            this.searchMeta = ArticleSearchMeta.getMetaWidthParentArticle(this.articleSummary.remark, this.articleSummary.referArticleName);
            this.articleSummary.remark = this.searchMeta.name;
        } else {
            this.searchMeta = ArticleSearchMeta.getMeta(this.articleSummary.remark);
        }
        this.showSearchButtons = true;
        if (this.options.showSearchButtons !== null && this.options.showSearchButtons !== undefined) {
            this.showSearchButtons = this.options.showSearchButtons;
        }
    },

    render: function() {
    	if(!this.justRenderSearchView){
    		this.renderListToolbarButtons();
    	}
        this.renderSearchCriteriaDiv();
        if(!this.justRenderSearchView){
        	this.renderTaskBarView();
        }
        this.renderSearchView();

        this.toolbarEl.append(this.el);
        this.triggerRenderedEvent();
        //Resize list view once everything is rendered
        this.listView.resize();
        return this;
    },
    
    renderListToolbarButtons:function(){
        this.renderAddButton();
        this.renderDeleteButton();
        this.renderLoadButton();
        this.renderAddFeatureButton();
        this.renderRefreshButton();
        //This is for sub classes which want to add additional buttons
        this.renderAdditionalButtons();
    },
    
    /**
     * This is for sub classes to override to add additional buttons
     */
    renderAdditionalButtons:function(){
        
    },

    renderAddButton: function() {
        if (this.model.createPermission && !this.model.readOnly) {
            //Check for flex fields
            if (this.model.flexConfigDescriminatorProperty) {
                this.$el.append(new ListFlexAddButton({
                    articleName: this.articleSummary.remark,
                    listView: this.listView
                }).render().el);
            } else {
                this.$el.append(new ListAddButton({
                    articleName: this.articleSummary.remark,
                    listView: this.listView
                }).render().el);
            }
        }

    },

    renderDeleteButton: function() {
        if (this.model.deletePermission && !this.model.readOnly) {
            this.$el.append(new ListDeleteButton({
                articleSummary: this.articleSummary,
                listView: this.listView
            }).render().el);
        }
    },

    renderLoadButton: function() {
        if (this.model.createPermission && this.model.editPermission && !this.model.readOnly) {
            this.$el.append(new ListLoadDataButton({
                articleSummary: this.articleSummary,
                listView: this.listView
            }).render().el);
        }
    },

    renderAddFeatureButton: function() {
        if (this.model.displayKey.indexOf("VectorLayer") > -1) {
            this.$el.append(new ListAddFeatureButton({
                articleSummary: this.articleSummary,
                listView: this.listView
            }).render().el);
        }
    },

    renderRefreshButton: function() {
        this.$el.append(new ListRefreshButton({
            articleSummary: this.articleSummary,
            listView: this.listView
        }).render().el);
    },

    renderTaskBarView: function() {
        this.$el.append(new TaskBarView({
            listView: this.listView,
            articleName: this.articleSummary.remark
        }).render().el);
    },

    renderSearchCriteriaDiv: function() {
        if (this.listMeta.showSearchCriteria) {
            var searchCriteriaDiv = $(viewCreator.make("div"));
            searchCriteriaDiv.append("<span>" + label_searchFilter + "</span>");
            searchCriteriaDiv.append(new SearchCriteriaView({
                listView: this.listView,
                listMeta: this.listMeta
            }).render().el);
            this.$el.append(searchCriteriaDiv);
        }
    },

    renderSearchView: function() {
    	var searchMetaFields = this.searchMeta.fields;
    	if(this.justRenderSearchView){
        	var tempSearchMetaFields = [];
        	for(var k = 0; k < searchMetaFields.length; k ++){
        		if(searchMetaFields[k].inPopupWindow){
        			tempSearchMetaFields.push(searchMetaFields[k]);
        		}
        	}
        	searchMetaFields = tempSearchMetaFields;
        	if(searchMetaFields.length == 0){
        		this.$el.removeClass("toolBar");
        	}
        }
        var showSearch = searchMetaFields.length != 0;
        if (showSearch) {
            //Pass dom element to view becuase searhc view uses 'chosen' which requires the elements 
            //be part of browser dom
            var searchViewEl = viewCreator.make('div', {
                "class": "searchBar"
            });
            this.toolbarEl.append(searchViewEl);

            var searchViewOptions = {
                el: searchViewEl,
                searchMeta: this.searchMeta,
                articleSummary: this.articleSummary,
                listView: this.listView
            };
            
            if(this.justRenderSearchView){
            	searchViewOptions['justRenderSearchView'] = this.justRenderSearchView;
            }

            //Check for custom view
            this.searchView = SearchView.getView(this.articleSummary.remark, searchViewOptions);
            if (!this.searchView) {
                this.searchView = new SearchView(searchViewOptions).render();
            }

            if (this.showSearchButtons) {
                //Button clicks used for show/hiderenderSearchForm
                this.searchView.hideView();
                this.renderListSearchButtions(this.searchView);
            }

            //Add a blank line
            this.toolbarEl.append("<div class='blank_line'></div>");
        }
    },

    renderListSearchButtions: function(searchView) {
        var listSearchButton = new ListSearchButton({
            searchView: this.searchView
        });
        this.$el.append(listSearchButton.render().el);

        var closeSearchButton = new CloseSearchButton({
            searchView: this.searchView,
            searchButton: listSearchButton
        });
        this.$el.append(closeSearchButton.render().el);

        listSearchButton.setCloseButton(closeSearchButton);


    },

    triggerRenderedEvent: function() {
        var toolBarRenderedEvent = $.Event('toolbar-rendered');
        toolBarRenderedEvent.parentView = this;
        toolBarRenderedEvent.listView = this.listView;
        toolBarRenderedEvent.articleName = this.articleSummary.remark;
        appView.triggerEvent(toolBarRenderedEvent);
    }


});

window.ListTopButton = Backbone.View.extend({
    tagName: "a",
    events: {
        'click': 'onClick'
    },

    render: function() {
        return this;
    },

    onClick: function() {

    }
});

window.ListAddButton = ListTopButton.extend({

    className: 'tool_l tool_add',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_add
        });

        this.addViewDialog = new AddViewDialog(this.options.articleName, null, this.options.listView);
    },

    onClick: function() {
        this.addViewDialog.showDialog(this.$el.offset());
    }
});

window.AddViewDialog = function(articleName, flexConfigDescriminator, listView) {
    this.articleName = articleName;
    this.dialog = null;
    this.listView = listView;
    this.articleEditMeta = ArticleEditMeta.getMeta(this.articleName);

    var modelAttributes = {};
    if (flexConfigDescriminator) {
        modelAttributes[this.articleEditMeta.flexConfigDescriminatorProperty] = flexConfigDescriminator;
    }

    this.model = new ArticleData(modelAttributes, {
        remark: this.articleName,
        add: true
    });
}

_.extend(AddViewDialog.prototype, {
    showDialog: function(position) {
     //   if (this.dialog == null) {

            var self = this;
            this.dialog = $(viewCreator.make("div", {
                // "class": "popupBox1",
                "title": label_add,
                "style": "padding:2px 0px 1px 1px;"
            }));
            this.editViewContainer = this.getEditViewContainer({
                model: this.model,
                articleEditMeta: this.articleEditMeta,
                isNew: true,
                listView: this.listView
            });

            this.dialog.wijdialog({
            	captionButtons: {
            		pin: { visible: false },
            		refresh: { visible: false },
            		toggle: { visible: false },
            		minimize: { visible: false }
            	},
                show: "blind",
                width: "80%",
                height: "80%",
                position: [position.left, position.top],
                modal: true,
                resize: function() {
                    self.dialog.removeClass("popupBox1");
                    self.editViewContainer.resize();
                },
                close:function(){
                	self.editViewContainer.editView.resetForm();
                	self.dialog.empty();
                },
                open:function(){
                	
                }
            });

            //This entire dialog is not part of any dom.Content is not added to form before
            //dialog is opened.so calling showContent after dialog is opened
            this.dialog.append(this.editViewContainer.render().el);
            this.editViewContainer.editView.showContent();


            setTimeout(function() {
                var editViewEle = self.editViewContainer.editView.$el;
                editViewEle.height(editViewEle[0].scrollHeight);
                self.dialog.wijdialog("option", "height", self.dialog[0].scrollHeight + 30);
            }, 350);

            this.editViewContainer.editView.setSaveSuccessCallBack(function() {
                if (self.dialog.wijdialog("isOpen")) {
                    self.dialog.wijdialog("close");
                }
            });
                
            // Initialization model
            this.model.fetch({
                id: "init",
                data: {
                    id: "init"
                },
                success: function() {
                	
                }
            });
            
            
//        } else {
//            this.dialog.dialog("open");
//            this.editViewContainer.editView.resetForm();
//        }
    },
    getEditViewContainer: function(options) {
        var editViewContainer = EditViewContainer.getView(options.articleEditMeta.name, options);
        if (!editViewContainer) {
            editViewContainer = new EditViewContainer(options);
        }
        return editViewContainer;

    }
});

window.ListFlexAddButton = ListTopButton.extend({
    className: 'tool_l tool_add',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_add
        });

        this.dialog = null;
        this.articleEditMeta = ArticleEditMeta.getMeta(this.options.articleName);
        //configDescriminator vs flex config
        this.flexConfigMap = {};
        //Modified article name vs AddViewDialog
        this.addViewDialogMap = {};
    },

    onClick: function() {
        if (this.dialog) {
            this.dialog.dialog("open");
        } else {

            this.dialog = $(viewCreator.make("div", {
                "class": "popupBox1",
                "title": label_entity_select,
                "style": "padding:2px 0px 1px 1px;"
            }));

            this.flexConfigRadioDiv = $(viewCreator.make("div", {
                "style": "padding:2px 0px 1px 1px;"
            }));
            this.dialog.append(this.flexConfigRadioDiv);

            this.radioGroupName = this.options.articleName + '_radioGroup';
            //Add article select options
            for (var i in this.articleEditMeta.flexConfigMetas) {
                var flexConfig = this.articleEditMeta.flexConfigMetas[i];
                var modifiedArticleName = digitnexus.modifiedArticleName(flexConfig.name);
                this.flexConfigRadioDiv.append("<input type='radio' name='" + this.radioGroupName + "' value='" + modifiedArticleName + "'/>" + flexConfig.displayName + "</br>");
                this.flexConfigMap[modifiedArticleName] = flexConfig;
            }

            var self = this;
            this.dialog.dialog({
                show: "blind",
                modal: true,
                buttons: [{
                    text: label_ok,
                    click: function() {
                        self.dialog.dialog("close");
                        self.showAdd();
                    }
                }]
            });
        }
    },

    showAdd: function() {
        var checkedInput = this.flexConfigRadioDiv.find('input[name="' + this.radioGroupName + '"]:checked');
        if (checkedInput.length > 0) {
            var modifiedArticleName = $(checkedInput[0]).val();
            var flexConfig = this.flexConfigMap[modifiedArticleName];
            var addViewDialog = this.addViewDialogMap[modifiedArticleName];
            if (addViewDialog == null) {
                addViewDialog = new AddViewDialog(flexConfig.name, flexConfig.configDescriminator, this.options.listView);
                this.addViewDialogMap[modifiedArticleName] = addViewDialog;
            }
            addViewDialog.showDialog(this.$el.offset());
        }
    }


});

window.ListDeleteButton = ListTopButton.extend({
    className: 'tool_l tool_del',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_delete
        });
    },

    onClick: function() {
        var ids = this.options.listView.getSelectedIds();
        this.ids = ids;
        var self = this;
        if (ids == null) {

            if (!this.deleteAlert) {
                this.deleteAlert = $(viewCreator.make("div", null, label_delete_alert));
                this.deleteAlertButtons = {};
                this.deleteAlertButtons[label_ok] = function() {
                    self.deleteAlert.dialog("close");
                };
            }
            this.deleteAlert.dialog({
                modal: true,
                buttons: this.deleteAlertButtons
            });
            return;

        } else {

            if (!this.deleteConfirm) {
                this.deleteConfirm = $(viewCreator.make("div", null, label_delete_confirm));
                this.deleteConfirmButtons = {};
                this.deleteConfirmButtons[label_ok] = function() {
                    var encodedIds = '';
                    for (var i = 0; i < self.ids.length; i++) {
                        encodedIds += encodeURIComponent(self.ids[i]) + ",";
                    }
                    _self = self;
                    //Move this to model
                    digitnexus.ajaxPost('/article/edit/delete/' + self.options.articleSummary.remark, encodedIds, function(response) {
                        _self.options.listView.refresh();
                        _self.deleteConfirm.dialog("close");
                        AppView._showMessage(label_delete_success, "success");
                    }, function(xhr, status, exception) {
                        _self.deleteConfirm.dialog("close");
                        AppView._showErrors(xhr);
                    });
                };

                this.deleteConfirmButtons[label_cancel] = function() {
                    self.deleteConfirm.dialog("close");
                };

            }

            this.deleteConfirm.dialog({
                modal: true,
                buttons: this.deleteConfirmButtons
            });
        }
    }
});




window.ListAddFeatureButton = ListTopButton.extend({
    className: 'tool_l tool_detail',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_add_feature
        });
    },

    onClick: function() {
        var table = this.options.listView.dataTable;
        var selected = table.find('.row_selected');
        this.model = this.options.listView.model;


        var self = this;
        if (selected == null || selected.length > 1) {

            if (!this.deleteAlert) {
                this.deleteAlert = $(viewCreator.make("div", null, label_add_feature_alert));
                this.deleteAlertButtons = {};
                this.deleteAlertButtons[label_ok] = function() {
                    self.deleteAlert.dialog("close");
                };
            }
            this.deleteAlert.dialog({
                modal: true,
                buttons: this.deleteAlertButtons
            });
            return;

        } else {

            var index = table.fnGetPosition(selected[0]);
            
            var data = table.fnGetData(index);
            var layerId = data[0];
            var layerName = data[2];
            var layerType = data[5];  
         
            var name = label_pointlayer;
            var id = "PointFeature";
            if (layerType.indexOf(label_pointlayer) > -1) {
                id = "PointFeature";
                name = label_pointlayer;
            } else if (layerType.indexOf(label_polylinelayer) > -1) {
                id = "PolylineFeature";
                name = label_polylinelayer;
            } else if (layerType.indexOf(label_polylgonlayer) > -1) {
                id = "PolygonFeature";
                name = label_polylgonlayer;
            }

            var hiddenField = {};            
            hiddenField.fieldName = "layerId";
            hiddenField.fieldValue = layerId;
            hiddenField.fieldName1 = "layerName";
            hiddenField.fieldValue1 = layerName;

            var summaryModel = {};

            //     summaryModel.referArticleName = "com.digitnexus.common.gis.mongodb.domain."+id;
            summaryModel.remark = "com.digitnexus.core.gis.domain." + id;
            summaryModel.id = self.model.id + '_' + layerId;
            summaryModel.name = self.model.name + '-' + layerName+"-"+label_children_manager;
            summaryModel.content = self.model.content;

            if (self.model.referenceId) {
                //Ref view of ref view
                summaryModel.tabViewId = self.model.tabViewId;
            } else {
                summaryModel.tabViewId = ArticleGroupView.prototype._idVsGroupModel[self.model.parentMenu].parentMenu;
            }
            summaryModel.hiddenField = hiddenField;
            ArticleTabsView.prototype._idVsTabsView[summaryModel.tabViewId].showArticleTab(null, summaryModel);

        }
    }
});

window.ListLoadDataButton = ListTopButton.extend({
    className: 'tool_l tool_loadData',

    initialize: function() {
        this.listView = this.options.listView;
        this.$el.attr({
            href: '#',
            title: label_load_data
        });
    },

    onClick: function() {

        var self = this;
        self.dialog = $(viewCreator.make("div", {
            "class": "fileLoader popupBox1 frame1_1",
            "title": label_simulator_title_fileload,
            "style": "padding:10px;"
        }));

        var publicField = null;
        var separator = null;
        if (this.listView && this.listView.model && this.listView.model.hiddenField) {
            publicField = this.listView.model.hiddenField.fieldValue; 
        }
        self.dataLoaderDiv = new DataLoaderDiv({
            articleSummary: this.options.articleSummary,
            listView: this.listView,
            publicField: publicField,
            separator: separator
        });
        self.dialog.append(self.dataLoaderDiv.render().el);

        self.dialog.dialog({
            show: "blind",
            width: 1000,
            modal: true,
            close: function(event, ui) {
                self.dialog.remove();
            }
        });

        var uploader = new qq.FileUploader({
            element: digitnexus.util.findDomObj("fileUpload"),
            action: digitnexus.util.ctx + "/dataloader/echo",
            debug: false,
            onComplete: function(id, fileName, responseJSON) {
                var val = responseJSON.content;
                $("#loadFileRequest").val(val);
                $("#loadFileResponse").text("");
            }
        });
    }
});

window.ListRefreshButton = ListTopButton.extend({
    className: 'tool_l tool_refresh',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_refresh
        });
    },

    onClick: function() {
        this.options.listView.refresh();
    }
});