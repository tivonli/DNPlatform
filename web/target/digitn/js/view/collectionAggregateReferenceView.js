window.CollectionAggregateReferenceView = Backbone.View.extend({
    className: "detailview-content-2",

    events: {
        'click h3': 'toggleEditContainer'
    },

    /**
     * Pass reference element field meta as argument.
     * Pass parentEl which is already part of browser dom otherwise list view 
     * will not render properly
     */
    initialize: function() {
        this.parentEditView = this.options.parentEditView;
        this.referenceMeta = this.options.referenceMeta;
        this.id = this.parentEditView.modifiedArticleName + '_' + this.referenceMeta.name;
        //To track newly added edit views
        this.rendered = false;
        this.readOnly = false;
        this.articleName = this.options.articleName;
        if (this.options.readOnly) {
            this.readOnly = this.options.readOnly;
        }
        this.idColumnName = this.referenceMeta.associationListMeta.idColumn.name;
    },

    render: function() {
        this.$el.append('<h3 class="title2"><div class="title2_l"><div  class="title2_r"><div class="title2_m"><div class="f_left">' + this.referenceMeta.displayName + '</div><div class="news_list_expand_icon"></div></div></div></div></h3>');
        this.containerEl = $(viewCreator.make("div", {
            "class": "detailview-content-3"
        }));
        this.$el.append(this.containerEl);
        if (!this.readOnly) {
            this.containerEl.append(new CollectionAggregateReferenceViewToolBar({
                collectionAggregateReferenceView: this
            }).render().el);
        }
        
        //Append to parentEl
        this.options.parentEl.append(this.$el);
        
        var localListViewEl=viewCreator.make('table');
        this.containerEl.append(localListViewEl);
        
        this.localListView = new LocalListView({
            el:localListViewEl,
            articleListMeta: this.referenceMeta.associationListMeta,
            dataUrl: 'noop',
            dataCountUrl: 'noop',
            showListToolbar: false,
            showIdColumn: !this.readOnly
        });
        this.localListView.render();
        this.localListView.resize();
        return this;
    },

    setModelData: function(modelData) {
        this.modelData = modelData;
        if (this.modelData === null || this.modelData === undefined) {
            this.modelData = [];
        }
        this.localListView.setData(modelData);
        this.localListView.refresh();
    },

    getModelData: function() {
        //Only send id values
        var idModelData = [];
        for (var i = 0; i < this.modelData.length; i++) {
            var idData = {};
            idData[this.idColumnName] = this.modelData[i][this.idColumnName];
            idModelData[i] = idData;
        }

        return idModelData;
    },

    clearContent: function() {

    },

    toggleEditContainer: function() {
        this.containerEl.toggle();
    },

    removeItems: function() {
        var ids = this.localListView.getSelectedIds();

        if (ids.length > 0) {
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];

                for (var j = 0; j < this.modelData.length; j++) {
                    if (this.modelData[j][this.idColumnName] === id) {
                        this.modelData.splice(j, 1);
                        break;
                    }
                }
            }

            this.setModelData(this.modelData);
        }
    },

    isValid: function() {
        return true;
    }

});

window.CollectionAggregateReferenceViewToolBar = EditViewToolBar.extend({
    render: function() {
        this.$el.append(new CollectionAggregateReferenceAddButton({
            collectionAggregateReferenceView: this.options.collectionAggregateReferenceView
        }).render().el);
        this.$el.append(new CollectionAggregateReferenceDeleteButton({
            collectionAggregateReferenceView: this.options.collectionAggregateReferenceView
        }).render().el);
        return this;
    }
});

window.CollectionAggregateReferenceAddButton = ListTopButton.extend({
    className: 'tool_l tool_add',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_add
        });
    },

    onClick: function() {
        if (!this.collectionReferenceSelectDialogView) {
            var collectionAggregateView = this.options.collectionAggregateReferenceView;
            this.collectionReferenceSelectDialogView = new CollectionReferenceSelectDialogView({
                articleName: collectionAggregateView.articleName,
                fieldMetaData: collectionAggregateView.referenceMeta,
                multiSelect: true,
                collectionAggregateReferenceView: collectionAggregateView
            });
            this.collectionReferenceSelectDialogView.render();
        }
        //here is can support the some call back function when finish the dialog show..
        this.collectionReferenceSelectDialogView.setAfterShowDialogAction(function() {
            //here need to see it , if the object not is a object..
            var hasSelected = {};
            //Get selected is from local list view
            var ids = this.options.collectionAggregateReferenceView.localListView.dataTable.find('input[idcolumn="true"]');
            if (ids != null && ids.length > 0) {
                for (var i = 0; i < ids.length; i++) {
                    hasSelected[ids[i].value] = true;
                }
            }
            if (this.modelData === null || this.modelData === undefined) {
                this.modelData = [];
            }
            var dataTable = this.listView.dataTable;
            //Mark current model values as checked in reference dialog list view
            var selectedInputs = dataTable.find('input[idcolumn="true"]');
            if (selectedInputs != null && selectedInputs.length > 0) {
                for (var i = 0; i < selectedInputs.length; i++) {
                    if (hasSelected[selectedInputs[i].value] && hasSelected[selectedInputs[i].value] === true) {
                        //selectedInputs[i].checked = true;
                        $(selectedInputs[i]).attr('checked', true).attr('disabled', true);                         
                    }
                }
            }
        });
        this.collectionReferenceSelectDialogView.showDialog();
    }

});

window.CollectionAggregateReferenceDeleteButton = ListTopButton.extend({
    className: 'tool_l tool_del',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: label_delete
        });
    },

    onClick: function() {
        this.options.collectionAggregateReferenceView.removeItems();
    }
});

window.CollectionReferenceSelectDialogView = ReferenceSelectDialogView.extend({
    selectData: function() {
        var dataTable = this.listView.dataTable;
        var selectedInputs = dataTable.find('input[idcolumn="true"]:checked:not(:disabled)'); //return array
        //this represent for the id column                
        if (selectedInputs.length > 0) {
            var selectedRowsData = [];
            var columnDefs = this.listView.columnDefs;
            for (var i = 0; i < selectedInputs.length; i++) {
                var selectedRow = selectedInputs.get(i).parentNode.parentNode;
                var index = dataTable.fnGetPosition(selectedRow);
                var rowData = {};
                for (var j = 0; j < columnDefs.length; j++) {
                    rowData[columnDefs[j].sName] = dataTable.fnGetData(index, j);
                }
                selectedRowsData[i] = rowData;

            }
           var newRowsData = [].concat(this.options.collectionAggregateReferenceView.localListView.data).concat(selectedRowsData);
           this.options.collectionAggregateReferenceView.setModelData(newRowsData);
            // time to close dialog
           
            dataTable.find('input[idcolumn="true"]:checked').attr('disabled', true);  
            this.$el.dialog("close");
        }
    }
});

window.CollectionAggregatePickListView = Backbone.View.extend({
    tagName: 'tr',

    /**
     * Pass reference element field meta as argument
     */
    initialize: function() {
        this.parentEditView = this.options.parentEditView;
        this.referenceMeta = this.options.referenceMeta;
        this.id = this.parentEditView.modifiedArticleName + '_' + this.referenceMeta.name;
        //To track newly added edit views
        this.rendered = false;
        this.readOnly = false;
        this.articleName = this.options.articleName;
        if (this.options.readOnly) {
            this.readOnly = this.options.readOnly;
        }
        this.idColumnName = this.referenceMeta.associationListMeta.idColumn.name;

        this.availableDataUrl = '/article/list/data/editviewassociation/' + this.articleName + '?propertyName=' + this.referenceMeta.name;
        this.colspan=this.options.colspan;
    },

    render: function() {
        this.$el.append("<th>" + this.referenceMeta.displayName + "</th>");
        //Leave the first column for label and make select ocupy rest of the columns
        var tdElement=$(viewCreator.make('td',{'colspan':this.colspan-1}));
        this.selectElement = $(viewCreator.make('select', {
            'id': this.id + '_select',
            'class': 'multiselect',
            'multiple': 'multiple',
            'style':'height:200px;width: 500px;'
        }));
        tdElement.append(this.selectElement);
        this.$el.append(tdElement);
        return this;
    },

    setModelData: function(modelData) {
        //Array of current model ids
        this.idValues = [];
        if(modelData!=null && modelData.length > 0){
            var modelDataLength=modelData.length;
            for(var i=0;i<modelDataLength;i++){
                 this.idValues[this.idValues.length]=modelData[i][this.idColumnName];
            }
            
        }

        if (this.rendered) {
            //Destroy exisitng picklist and clean options
            this.selectElement.multiselect('destroy');
            this.selectElement.empty();
        } else {
            this.rendered = true;
        }

        //Get available reference values from server
        var self = this;
        digitnexus.ajaxGet(
        this.availableDataUrl, null, function(response) {
            self.createPickList(response);
        },

        function(xhr, status, exception) {
            AppView._showErrors(xhr);
        });


    },

    getModelData: function() {
        //Only send id values
        var idModelData = [];
        var selectedValues=this.selectElement.multiselect('selectedValues');
        if(selectedValues!=null && selectedValues.length>0){
            var selectedValuesLength=selectedValues.length;
            for(var i=0;i<selectedValuesLength;i++){
                var idData = {};
                idData[this.idColumnName] = selectedValues[i];
                idModelData[i] = idData;
            }
            
        }
        
        return idModelData;
    },

    createPickList: function(data) {
        //Populate options
        if(data!=null && data.length>0){
            var dataLength=data.length;
            for(var i=0;i<dataLength;i++){
                var referenceRecord=data[i].data;
                var idValue=referenceRecord[this.idColumnName];
                var displayValue=referenceRecord[this.referenceMeta.referenceProperty];
                var optionHtml="<option value='"+idValue+"'";
                //Mark current model values as selected
                if(this.idValues.length>0 && this.idValues.indexOf(idValue)!=-1){
                    optionHtml+=" selected='selected'";
                }
                //Add display value
                optionHtml+=">"+displayValue+"</option>";
                
                this.selectElement.append(optionHtml);
            }
        }
        
        this.selectElement.multiselect();
        
        
    },

    clearContent: function() {

    },

    isValid: function() {
        return true;
    }

});




window.CollectionAggregateTableView = Backbone.View.extend({
    className: "detailview-content-2",

    events: {
        'click h3': 'toggleEditContainer'
    },
    	
	initialize: function() {
        this.parentEditView = this.options.parentEditView;
        this.referenceMeta = this.options.referenceMeta;
        this.id = this.parentEditView.modifiedArticleName + '_' + this.referenceMeta.name;
	    //To track newly added edit views
	    this.rendered = false;
	    this.readOnly = false;
	    this.articleName = this.options.articleName;//this.options.articleEditMeta.name
	    if (this.options.readOnly) {
	        this.readOnly = this.options.readOnly;
	    }
	    this.idColumnName = this.referenceMeta.associationListMeta.idColumn.name;
	
	    this.availableDataUrl = '/article/list/data/editviewassociation/' + this.articleName + '?propertyName=' + this.referenceMeta.name;
	    this.colspan=this.options.colspan;	    
	    
	},
	
	render: function() {	
		
		this.$el.append('<h3 class="title2"><div class="title2_l"><div  class="title2_r"><div class="title2_m">' + this.referenceMeta.displayName + '</div></div></div></h3>');
		this.containerEl = $(viewCreator.make("div", {
			"class": "detailview-content-3"
		}));
		this.$el.append(this.containerEl);
	        
		this.tableViewEl=$(viewCreator.make('table',{width:"100%"}));
		   
		
	    this.containerEl.append(this.tableViewEl);
		
		this.options.parentEl.append(this.$el);
	    return this;
	},	
   
	getElementsData:function(){
		 //Get available reference values from server
        var self = this;
        digitnexus.ajaxGet(
	        this.availableDataUrl, null, function(response) {
	            self.createTrElement(response);
	        },

	        function(xhr, status, exception) {
	            AppView._showErrors(xhr);
	        });
	},
	
	createTrElement:function(response){
		this.perssions={};
		for(var i=0;i<response.length;i++){
			var data = response[i].data;
			var resource = data.resource.replace(/\./g,"_");
			
			if(!this.perssions[resource]){			
				this.perssions[resource]=[null,null,null,null];
			}
			
			switch(data.userOperation){				
				case "CREATE":
					this.perssions[resource][0]=data;
					break;
				case "READ":
					this.perssions[resource][1]=data;
					break;
				case "EDIT":
					this.perssions[resource][2]=data;
					break;
				case "DELETE":
					this.perssions[resource][3]=data;
					break;
			}
		}
		
		this.tableViewEl.empty();
		
		var trElement=$(viewCreator.make('tr'));
		trElement.append("<th width='45%'></th>").append("<th>Create</th><th>Read</th><th>Update</th><th>Delete</th>");
		
		this.tableViewEl.append(trElement);
		
		for(var key in this.perssions){
			var trElement=$(viewCreator.make('tr'));
			var trData = this.perssions[key];
			trElement.append("<td>"+key+"</td>");
			for(var j=0;j<trData.length;j++){				
				var tdElement = this.createCellElement(trData[j]);
				trElement.append(tdElement);
			}
			
			this.tableViewEl.append(trElement);
		}
		
		this.setElementsData();
		
	},
	
	createCellElement:function(trData){
		var tdElement=$(viewCreator.make('td'));
		var readOnly = "";
		if(this.options.readOnly){
			readOnly = "readonly='true' disabled='disabled'";
		}
		tdElement.append(trData.userOperation+"<input "+readOnly+" type='checkbox' id='"+(trData.name.replace(/\./g,"_"))+"' resource='"+trData.resource.replace(/\./g,"_")+"' />");
			
		return tdElement;
	},
	
	setElementsData:function(){
		for(var i=0;i<this.idValues.length;i++){
			$("#"+this.idValues[i],this.$el).attr("checked","checked");
		}
	},
	
	setModelData: function(modelData) {
        //Array of current model ids
        this.idValues = [];
        if(modelData!=null && modelData.length > 0){
            var modelDataLength=modelData.length;
            for(var i=0;i<modelDataLength;i++){
                 this.idValues[this.idValues.length]=modelData[i]["name"].replace(/\./g,"_");
            }            
        }
        
        this.getElementsData();
    },
    
    toggleEditContainer: function() {
        this.containerEl.toggle();
    },
    
    getModelData:function(){
    	var elems = $("input:checked",this.$el);
    	
    	var modelData = [];
    	
    	for(var i=0;i<elems.length;i++){
    		var resource = $(elems[i]).attr("resource");
    		if(this.perssions[resource]){
    			var perssion = this.perssions[resource];
    			for(var j=0;j<perssion.length;j++){
    				if(perssion[j].name.replace(/\./g,"_") == $(elems[i]).attr("id")){
    					modelData.push({name:perssion[j].name});
    				}
    			}    			
    		}    		
    	}
    	
    	return modelData;
    },
    clearContent: function() {

    },
    isValid: function() {
        return true;
    }
    
})