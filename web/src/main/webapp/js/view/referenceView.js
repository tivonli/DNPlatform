window.ReferenceElementView = Backbone.View.extend({

    tagName: "td",

    events: {
        'click span.toolbar-button': 'showSelector'
    },

    initialize: function() {
        this.fieldMetaData = this.options.fieldMetaData;
        this.registerListDataLoadListener = true;
        this.parentView = this.options.parentView || null;
    },

    render: function() {
        this.$el.append(this.createInputElement());
        if (!this.fieldMetaData.readOnly && (this.options.isNew || this.fieldMetaData.updatable)) {
            this.$el.append("<span  title='" + label_select + "' class='toolbar-button'> <img border='0' class='article_selector'></span>");
        }
        return this;
    },

    createInputElement: function() {
        var inputType = "text";
        if (this.fieldMetaData.hidden) {
            inputType = "hidden";
        }

        var uniqueId = digitnexus.modifiedArticleName(this.options.articleEditMeta.name);
        var validationClass = "";
        if (this.fieldMetaData.mandatory) {
            //Space after required is important
            validationClass = "required ";
        }

        if (this.fieldMetaData.validation) {
            validationClass += this.fieldMetaData.validation;
        }
        //Not adding id because model binding will mess it up
        var inputElement = viewCreator.make("input", {
            "type": inputType,
            "uniqueId": uniqueId,
            "name": uniqueId + "_" + this.fieldMetaData.name,
            "class": validationClass + " readonly",
            "readOnly": true
        });
        this.inputElementEl = $(inputElement);
        return inputElement;
    },

    showSelector: function() {
        if (!this.referenceDialogView) {
            this.referenceDialogView = new ReferenceSelectDialogView({
                fieldMetaData: this.fieldMetaData,
                articleName: this.options.articleEditMeta.name,
                dataUrl: this.options.dataUrl,
                dataCountUrl: this.options.dataCountUrl,
                refrenceElementView: this
            });
            //Next is span element
            this.inputElementEl.next().append(this.referenceDialogView.render().el);
        }

        this.referenceDialogView.showDialog();

        var self = this;
        var listView = this.referenceDialogView.listView;
        if (this.registerListDataLoadListener) {
            listView.$el.bind('list-view-data-loaded', function(dataLoadEvent) {
                listView.selectIds(self.idValue);
            });
            this.registerListDataLoadListener = false;
        }
    },

    setModelData: function(modelData) {
        this.modelData = modelData;
        if (this.modelData != null) {
            var referencePropertyName = this.fieldMetaData.referenceProperty;
            this.idValue = [modelData[this.fieldMetaData.associationListMeta.idColumn.name]];
            this.inputElementEl.attr("value", modelData[referencePropertyName]);
        } else {
            this.inputElementEl.attr("value", null);
            this.idValue = []
        }

    },

    getModelData: function() {
        return this.modelData;
    },

    setReferenceSelectData: function(referencePropertyValue, idValue) {
        //This is to display to user
        this.inputElementEl.attr("value", referencePropertyValue);
        //This is what we send to server
        this.modelData = {};
        this.modelData[this.fieldMetaData.associationListMeta.idColumn.name] = idValue;
        this.idValue = [idValue];

        var compareMeta = this.fieldMetaData.compareMeta || null;
        if (compareMeta !== null) {
            if (compareMeta.type === "MUTEX") {
                if (this.parentView) {
                    for (var i = 0, j = compareMeta.targets.length; i < j; i++) {
                        var mutexElementView = this.parentView.nameVsRefElementView[compareMeta.targets[i]];
                        mutexElementView.clearContent();
                    }

                }

            }
        }
    },

    clearContent: function() {
        this.modelData = {};
        this.idValue = [];
        this.inputElementEl.attr("value", null);

    }

});

window.ReferenceSelectDialogView = Backbone.View.extend({
    tagName: "div",
    className: "popupBox1",

    initialize: function() {
        this.articleName = this.options.articleName;
        this.fieldMetaData = this.options.fieldMetaData;
        this.$el.attr("style", "overflow:hidden;");
        if (this.options.dataUrl) {
            this.dataUrl = this.options.dataUrl;
        } else {
            this.dataUrl = '/article/list/data/editviewassociation/' + this.articleName + '?propertyName=' + this.fieldMetaData.name;
        }
        if (this.options.dataCountUrl) {
            this.dataCountUrl = this.options.dataCountUrl;
        } else {
            this.dataCountUrl = '/article/list/data/count/editviewassociation/' + this.articleName + '?propertyName=' + this.fieldMetaData.name;
        }
        this.dialogRendered = false;
        this.multiSelect = false;
        this.afterShowDialogAction = null;
        if (this.options.multiSelect) {
            this.multiSelect = this.options.multiSelect;
        }
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
            this.listView.refresh();
            this.$el.dialog("open");
        }
    },

    renderDialog: function() {
        var self = this;
        this.$el.dialog({
            autoOpen: false,
            modal: true,
            resizable: true,
            width: 1000,
            resize: function() {
                self.listView.resize();
            },
            buttons: [{
                "text": label_button_select,
                click: function() {
                    self.selectData();
                }
            }, {
                "text": label_cancel,
                click: function() {
                    self.$el.dialog("close");
                }
            }],

            open: function(event, ui) {
                self.renderListView();
            }
        });

    },

    renderListView: function() {
        if (this.listView) {
            return;
        }


        var assoicationListMeta = this.fieldMetaData.associationListMeta;
        var listViewEl = viewCreator.make('table');
        this.$el.append(listViewEl);

        this.listView = new ListView({
            el: listViewEl,
            articleListMeta: assoicationListMeta,
            footerInfo: false,
            createListTop: true,
            model: {remark:this.fieldMetaData.name ,referArticleName:this.articleName},
            justRenderSearchView : true,
            dataUrl: this.dataUrl,
            dataCountUrl: this.dataCountUrl,
            multiSelect: this.multiSelect,
            defaultFilterId: this.fieldMetaData.associationSearchCriteriaId
        });
        //here is can support after the table Initialization call back function ..
        //set the callback function after the datatable Initialization ..
        var self = this;
        this.listView.setFnDrawCallback(function(oSettings) {
            if (self.afterShowDialogAction) {
                self.afterShowDialogAction();
            }
        });
        this.listView.render();
        this.listView.resize();
    },

    selectData: function() {
        var dataTable = this.listView.dataTable;
        var selectedInputs = dataTable.find('input[idcolumn="true"]:checked'); //return array
        //this represent for the id column                
        var columnIndex = 0;
        if (selectedInputs.length > 0) {
            var row = selectedInputs.get(0).parentNode.parentNode; // ideally only one row should be selected thats why doing get 0
            var index = dataTable.fnGetPosition(row);
            var idValue = dataTable.fnGetData(index, 0); // hidden column data which is going to have the ID which we need to send to backend
            var referencePropertyValue = dataTable.fnGetData(index, columnIndex + 1); // display column which will come as a display value in UI
            this.options.refrenceElementView.setReferenceSelectData(referencePropertyValue, idValue);
            // time to close dialog
            this.$el.dialog("close");
        }

    },
    //here is provide call back function after the dialog was show..........
    setAfterShowDialogAction: function(afterShowDialogAction) {
        this.afterShowDialogAction = afterShowDialogAction;
    }
});

/*
 * To show reference in combo box
 */
window.ReferenceDropdownView = Backbone.View.extend({

    initialize: function() {
        this.articleEditMeta = this.options.articleEditMeta;
        this.fieldMetaData = this.options.fieldMetaData;

        if (this.options.dataUrl) {
            this.dataUrl = this.options.dataUrl;
        } else {
            this.dataUrl = '/article/list/data/editviewassociation/' + this.articleEditMeta.name + '?propertyName=' + this.fieldMetaData.name;
        }

        //Check for filters in reference drop down
        var associationSearchCriteriaId = this.fieldMetaData.associationSearchCriteriaId;
        if (associationSearchCriteriaId && associationSearchCriteriaId !== "0") {
            this.dataUrl += "&searchCriteriaId=" + encodeURIComponent(associationSearchCriteriaId, "UTF-8");
        }


        var associationColumns = this.fieldMetaData.associationListMeta.columns;
        var associationColumnsLength = associationColumns.length;
        this.referencePropertyName = this.fieldMetaData.referenceProperty;
        for (var i = 0; i < associationColumnsLength; i++) {
            var associationColumn = associationColumns[i];
            if (associationColumn.associatedListProperty) {
                this.referencePropertyName = associationColumn.name;
                break;
            }
        }
        this.idColumnName = this.fieldMetaData.associationListMeta.idColumn.name;
    },

    getModelData: function() {
        var modelData = {};
        var value = this.$el.val()
        modelData[this.idColumnName] = (value === null || value === undefined ? "" : value);
        return modelData;
    },

    setModelData: function(modelData) {
        this.modelData = modelData;
        this.fetchOptions();
    },

    fetchOptions: function() {
        var self = this;
        digitnexus.syncGet(this.dataUrl, null, function(response) {
            self.changeOptions(response);
            return;
        }, function(xhr, status, exception) {
            AppView._showErrors(xhr);
        });
    },

    changeOptions: function(optionsData) {
        if (this.options.isNew) {
            this.$el.empty();
        }

        if (!this.fieldMetaData.readOnly) {
            if (!this.fieldMetaData.mandatory || this.options.isNew) {
                this.$el.find("option[value='']").remove();
                this.$el.append(viewCreator.make('option', {
                    'value': ""
                }, ""));
            }
        }

        if (optionsData && optionsData.length > 0) {
            for (var i = 0; i < optionsData.length; i++) {
                var option = optionsData[i].data;
                this.$el.append(viewCreator.make('option', {
                    'value': option[this.idColumnName]
                }, option[this.referencePropertyName]))
            }
        }
        if (this.modelData) {
            this.$el.val(this.modelData[this.idColumnName]);
        }
        this.$el.trigger("liszt:updated");

    },

    clearContent: function() {
        this.$el.empty();
        if (this.options.isNew) {
            this.fetchOptions();
        } else {
            this.$el.trigger("liszt:updated");
        }
    }

});