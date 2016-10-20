window.EditView = Backbone.DigitNexusView.extend({
    className: 'detailview-tab-content',

    initialize: function() {
        this.rendered = false;
        this.isNew = false;
        this.articleName=this.options.articleEditMeta.name;
        this.modifiedArticleName = digitnexus.modifiedArticleName(this.articleName);
        this.elementsRenderer=EditView.getElementsRenderer(this.articleName);
        if (this.options.isNew) {
            //Add view case
            this.isNew = true;
            this.modifiedArticleName += '_new';
        }
        this.listView=this.options.listView;
        //Bind it only for the cases of edit view
        this.model.bind("change", this.showContent, this);

        //For Form binding
        this.modelBinder = new Backbone.ModelBinder();

        this.id = 'article_edit_view_' + this.modifiedArticleName;

        this.$el.attr({
            id: this.id,
            style: 'overflow-y:auto;'
        });

        this.resetState = false;
        this.form = null
        //For child edit view, formId can be passed as option
        this.formId = this.options.formId;
        this.selectable = false;
        if (this.options.selectable) {
            this.selectable = this.options.selectable;
        }
        this.selected = false;

    },

    render: function() {
        if (this.formId === null || this.formId === undefined) {
            this.formId = 'form_' + this.modifiedArticleName;
        }
        return this;
    },

    showContent: function() {
        //form null check was necessary because model bind is causing change event
        //in case of add
        if (!this.rendered && this.form === null) {
            this.form = $(viewCreator.make("form", {
                action: "",
                method: 'post',
                id: this.formId
            }));
            this.$el.append(this.form);

            //More of the same id cause a bug
            // this.form = $('#' + this.formId);
            this.generateFormTable(this.form);
            var bindings = Backbone.ModelBinder.createDefaultBindings(this.form, 'modelAttr');
            this.modelBinder.bind(this.model, this.form, bindings);
            this.setReferenceElementsValue();
            this.setReferenceDropdownElementsValue();
            this.setCollectionReferenceValues();
            this.setReferenceArrayElements();
            this.form.validate();
            this.rendered = true;
            this.resetState = false;
            //Right now only collection reference edit views are selectable. Assuming, if selectable, it is collection reference and not resize
            if (!this.selectable) {
                this.resize();
            }
            //Just callback, no information in it
            this.$el.trigger($.Event("edit-view-rendered"));
            return;
        }

        if (this.resetState) {
            this.resetForm();
            this.resetState = false;
            //set ref elements data because there is no model binding for ref elements
            
            this.setReferenceElementsValue();
            this.setEnumerationDropdownElements();
            this.setReferenceDropdownElementsValue();

            this.setCollectionReferenceValues();
            this.setColorElements();
            this.setReferenceArrayElements();
        }

    },

    setReferenceElementsValue: function() {
        var refElementsLength = this.referenceElements.length;

        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceElements[i];
                var refElementView = this.nameVsRefElementView[refElementMeta.name];
                refElementView.setModelData(this.model.get(refElementMeta.name));
            }
        }
    },

    setReferenceArrayElements:function(){
    	var length = this.referenceArrayElements.length;
    	for(var i=0;i<length;i++){
    		var refEnumElementMeta = this.referenceArrayElements[i][0];
    		var dropdownId = this.referenceArrayElements[i][1]||"";    		
    		var arrayValue = this.model.get(refEnumElementMeta.name)||[];
    		var value = "";
    		for(var i=0;i<arrayValue.length;i++){
    			value += ";"+arrayValue[i][refEnumElementMeta.referenceProperty];
    		}
    		$('#' + this.id + '_' + refEnumElementMeta.name+dropdownId).val(value.replace(";",""));
    	}
    	
    },
    
    setEnumerationDropdownElements:function(){
    	var length = this.enumerationDropdownElements.length;
    	for(var i=0;i<length;i++){
    		var refEnumElementMeta = this.enumerationDropdownElements[i][0];
    		var dropdownId = this.enumerationDropdownElements[i][1]||"";    		
    		var value = this.model.get(refEnumElementMeta.name);    		
    		$('#' + this.id + '_' + refEnumElementMeta.name+dropdownId).val(String(value)).trigger("liszt:updated");
    	}
    	
    },
    
    resetEnumerationDropdownElements:function(){
    	var length = this.enumerationDropdownElements.length;
    	for(var i=0;i<length;i++){
    		var refEnumElementMeta = this.enumerationDropdownElements[i][0];
        	var dropdownId = this.enumerationDropdownElements[i][1]||"";   
    		var selectComponent = $('#' + this.id + '_' + refEnumElementMeta.name+dropdownId);
    		if(this.isNew){  				
    			selectComponent.val("");
    		}   		
    		selectComponent.trigger("liszt:updated");    		
    	}
    	
    },
    
    setReferenceDropdownElementsValue: function() {
        var refElementsLength = this.referenceDropdownElements.length;

        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceDropdownElements[i][0];
                var refElementView = this.nameVsRefDropdownElementView[refElementMeta.name];
                refElementView.setModelData(this.model.get(refElementMeta.name));
            }
        }
    },

    resetReferenceElementsValue: function() {
        var refElementsLength = this.referenceElements.length;

        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceElements[i];
                var refElementView = this.nameVsRefElementView[refElementMeta.name];
                refElementView.clearContent()
            }
        }
    },

    resetReferenceDropdownElementsValue: function() {
        var refElementsLength = this.referenceDropdownElements.length;

        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceDropdownElements[i][0];
                var refElementView = this.nameVsRefDropdownElementView[refElementMeta.name];
                refElementView.clearContent()
            }
        }
    },

    setCollectionReferenceValues: function() {
        var refElementsLength = this.collectionReferenceElements.length;
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.collectionReferenceElements[i];
                var refElementView = this.collectionRefNameVsView[refElementMeta.name];
                refElementView.setModelData(this.model.get(refElementMeta.name));
            }
        }
    },

    resetCollectionRefererences: function() {
        var refElementsLength = this.collectionReferenceElements.length;
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.collectionReferenceElements[i];
                var refElementView = this.collectionRefNameVsView[refElementMeta.name];
                refElementView.clearContent();
            }
        }
    },

    onArticleSelection: function(articleId) {
        //Any changes to model throws 'change' event which will cause calling of 
        //'showContent' method. This is used to keep track of article selection and
        //render content only if resetState is true
        this.resetState = true;
    },

    generateFormTable: function(parentComponent) {

        this.dateElements = [];
        //Map of property name to attachments
        this.attachmentsMeta = {};
        this.referenceElements = [];
        this.referenceArrayElements = [];
        this.mapElements = [];
        this.colorElements=[];
        this.collectionReferenceElements = [];
        var mainFields = [];
        this.referenceDropdownElements = [];
        this.enumerationDropdownElements = [];
        //Add dummy data for selectable checkbox.This is a hack to preserve layout
        if (this.selectable) {
            mainFields[0] = "ref_select_checkbox";
        }

        var metaData = this.options.articleEditMeta;
        var metaDataFields = metaData.fields;
        
        if(this.elementsRenderer){
            this.elementsRenderer.preprocessFieldsMetaData(metaDataFields);
        }

        //Separate collection reference fields and other fields. we will render collection reference fields in the end
        for (var i = 0; i < metaDataFields.length; i++) {
            var fieldMetaData = metaDataFields[i];
            if (fieldMetaData.hidden) {
                continue;
            }

            //Ignore attachment if this is add
            if (fieldMetaData.attachment&&!fieldMetaData.showAdd && this.isNew) {
                continue;
            }
            if(!fieldMetaData.editDisplay){
            	continue;
            }

            if (fieldMetaData.dataType === 'COLLECTION') {
                this.collectionReferenceElements[this.collectionReferenceElements.length] = fieldMetaData;
            } else {
                mainFields[mainFields.length] = fieldMetaData;
            }
        }

        this.tableId = 'form_table_' + this.modifiedArticleName;

        var callBack = function(self,parentComponent){
        	var tbodys = parentComponent.find('tbody');
        	self.tbody = $(tbodys[tbodys.length-1]);
            for(var i = 0; i < tbodys.length; i ++){
            	self.applyChosen($(tbodys[i]));
            }
        };
        
        var fieldGroupMeta = metaData.fieldGroupMetas;
        //here is will Separate the fieldGroup field metaData and not fieldGroup field metaData.
        if(fieldGroupMeta && fieldGroupMeta.length > 0){
        	//if there is have some fieldGroupMeta case...
        	var fieldGroupFields = [];
        	var mainFieldGroup = [];
        	for(var i = 0; i < fieldGroupMeta.length; i ++){
        		var fieldGroup = [];
        		for(var j = 0; j < mainFields.length; j++){
        			if(fieldGroupMeta[i].name === mainFields[j].fieldGroupName){
        				fieldGroupFields.push(mainFields[j]);
        				fieldGroup.push(mainFields[j]);
        			}
        		}
        		mainFieldGroup.push(fieldGroup);
        	}
        	//here is init the field Group set part.
        	if(mainFieldGroup && mainFieldGroup.length > 0){
        		if(fieldGroupMeta[0].fieldGroupType === 'FIELDSET'){
        			for(var index = 0; index < mainFieldGroup.length; index++){
            			var filedSetGroupView = new FieldSetGroupView({
            				tableId:this.tableId,
            				editView:this,
            				metaData:metaData,
            				mainFieldGroupMeta:mainFieldGroup[index],
            				fieldGroupMeta:fieldGroupMeta[index]
            			});
            			parentComponent.append(filedSetGroupView.render().el);
            			filedSetGroupView.defaultSetup();
            		}
        			callBack(this,parentComponent);
        		}else if(fieldGroupMeta[0].fieldGroupType === 'FORMTAB'){
        			var fieldTabGroupView = new FieldTabGroupView({
        				tableId:this.tableId,
        				editView:this,
        				metaData:metaData,
        				mainFieldGroupMetas:mainFieldGroup,
        				fieldGroupMetas:fieldGroupMeta
        			});
        			parentComponent.append(fieldTabGroupView.render().el);
        			fieldTabGroupView.defaultSetup();
        		}
        	}
        }else{
        	//if there is not fieldGroupMeta case..
        	var formTable = "<table id='" + this.tableId + "' class='table_2'><tbody>";
            formTable += this.generateFormTableRow(metaData, mainFields);
            formTable += "</tbody></table>";
            parentComponent.append(formTable);
            callBack(this,parentComponent);
        }

        if (this.selectable) {
            var self = this;        	
        	$(this.form.find('.ref_select_checkbox')[0]).bind("change",function() {
                self.selected = this.checked ? true : false;
            });
        }
        //bind the comments event..
        if (metaData.comments === true && !this.isNew) {
            this.bindCommentsEvent();
        }

        //Now form is part of dom. Create date,attachment and reference elements
        this.buildDateAndDateTimeComponent(this.dateElements, parentComponent);

        //Create reference elements
        this.buildReferenceElements();

        this.buildEnumerationDropdownElements();
        
        //Create dropdown reference elements
        this.buildDropdownReferenceElements();

        //Create reference elements
        this.buildMapElements(this.mapElements);
        this.buildColorElements(this.colorElements);

        //Create collection reference elements
        this.buildCollectionReferences(this.collectionReferenceElements);

        //Attachment elements
        this.buildAttachmentElements();

    },
    generateFormTableRow : function(metaData,mainFields){
    	var formTable = "";
    	var columnLayout = metaData.columnLayout;
        for (var i = 0, split = columnLayout; i < mainFields.length && i < split;) {
            var jsonChunk = mainFields.slice(i, split);
            var oTr = "<tr>";
            for (var k = 0; k < jsonChunk.length; k++) {        	
            	
                if (jsonChunk[k] === "ref_select_checkbox") {
                    oTr += "<td rowspan='2' class='lineitem_checkbox' valign='top'><input type='checkbox' class='ref_select_checkbox' id='ref_select_checkbox' modelattr='lineitem_checkbox_" + i + "'/></td>";
                } else {
                //	console.log(colspan);
                    oTr += this.buildRow(jsonChunk[k]);
                }

                ++i;
            }
            //fix line item by checkbox
            for (var j = 0; j < jsonChunk.length; j++) {
                if (jsonChunk[j] === "ref_select_checkbox") {
                    oTr += "<th>&nbsp;&nbsp;</th><td>&nbsp;&nbsp;</td>";
                }
            }
           
            var lessRowTdUnitNum=0;
            if (!this.isNew && metaData.comments === true && (i === mainFields.length)) {
                if (jsonChunk.length < columnLayout) {
                    var lessRowTdUnitNum = columnLayout - jsonChunk.length - 1;
                    oTr += "<th>" + label_article_comment + " : </th><td><div id='comment_div_id_" + this.formId + "' class='f_left iconBtn_1 icon_comment'></div>&nbsp;&nbsp;</td>";
                    //oTr += digitnexus.emptyRowBuilder(lessRowTdUnitNum);
                    oTr += "</tr>";
                } else {
                    oTr += "</tr><tr><th>" + label_article_comment + " : </th><td><div id='comment_div_id_" + this.formId + "' class='f_left iconBtn_1 icon_comment'></div>&nbsp;&nbsp;</td>";
                    lessRowTdUnitNum = 2;
                    //oTr += digitnexus.emptyRowBuilder(2);
                    oTr += "</tr>";
                }
            } else {
                if (jsonChunk.length < columnLayout) {
                    lessRowTdUnitNum = columnLayout - jsonChunk.length;
                   // oTr += digitnexus.emptyRowBuilder(lessRowTdUnitNum);
                    oTr += "</tr>";
                }
            }
        //    console.log("lessRowTdUnitNum=="+lessRowTdUnitNum)
            if(lessRowTdUnitNum>0){
             	var colspan = "colspan="+(lessRowTdUnitNum*2+1);
               
                 var index = oTr.lastIndexOf("<td");                	
             	var temp1 = oTr.substring(0,index);
             	var temp2 = oTr.substring(index).replace(/^<td/,"<td "+colspan);
             	
             	oTr = temp1+temp2;
            }
            
            formTable += oTr;
            split += columnLayout;
        }
        return formTable;
    },
    applyChosen: function(tbody) {
        var selectElements = tbody.find('.chosen');
        if (selectElements.length > 0) {
            //If there are no options, chosen select boxes appear shrinked unless
            //width is set on target select box. Here is the hack to find width
            var selectElement = $(selectElements[0]);
            selectElement.after("<input type='text' style='float:left;'></input>");
            selectElement.hide();
            //Find width of input element
            var width = selectElement.next().getHiddenDimensions(true).outerWidth;
            //Remove input element
            selectElement.next().remove();
            selectElement.show()
            //Set the width of all select boxes
            selectElements.width(width);

            selectElements.chosen({allow_single_deselect:true,search_contains:true,no_results_text:no_results_text});
        }
    },

    bindCommentsEvent: function() {
        var self = this;
        if (!self.commentDialogView) {
            self.commentDialogView = new CommentDialogView({
                articleEditMeta: this.options.articleEditMeta
            }).render();
        }
        $('div#comment_div_id_' + this.formId).bind('click', {
            model: this.options.model
        }, function(event) {
            self.commentDialogView.showContent(event.data.model);
        });
    },

    buildReferenceElements: function() {
        var refElementLength = this.referenceElements.length;
        if (refElementLength > 0) {
            this.nameVsRefElementView = {};
            for (var i = 0; i < refElementLength; i++) {
                var refElementMeta = this.referenceElements[i];
                var refElementView = new ReferenceElementView({
                    fieldMetaData: refElementMeta,
                    articleEditMeta: this.options.articleEditMeta,
                    isNew: this.isNew,
                    parentView:this
                });
                this.nameVsRefElementView[refElementMeta.name] = refElementView;

                //Find ref element tds and replace
                var value = $('#' + this.modifiedArticleName + '_' + refElementMeta.name).attr("colspan");                
                var refView = refElementView.render();
                refView.$el.attr("colspan",value);                
                $('#' + this.modifiedArticleName + '_' + refElementMeta.name).replaceWith(refView.el);
            }
        }
    },
    buildEnumerationDropdownElements:function(){
    	var length = this.enumerationDropdownElements.length;
    	for(var i=0;i<length;i++){
    		var refEnumElementMeta = this.enumerationDropdownElements[i][0];
    		var dropdownId = this.enumerationDropdownElements[i][1]||"";    		
    		var value = this.model.get(refEnumElementMeta.name);  
    		var selectComponent=$('#' + this.id + '_' + refEnumElementMeta.name+dropdownId)
    		$('#' + this.id + '_' + refEnumElementMeta.name+dropdownId).val(String(value)).trigger("liszt:updated");
    	}
    	
    },
    buildDropdownReferenceElements: function() {
        var refElementLength = this.referenceDropdownElements.length;
        if (refElementLength > 0) {
            this.nameVsRefDropdownElementView = {};
            for (var i = 0; i < refElementLength; i++) {
                var refElementMeta = this.referenceDropdownElements[i][0];
                var dropdownId = this.referenceDropdownElements[i][1];//refElementMeta.dropdownId||"";
                var refElementView = new ReferenceDropdownView({
                    el: $('#' + this.id + '_' + refElementMeta.name+dropdownId),
                    fieldMetaData: refElementMeta,
                    articleEditMeta: this.options.articleEditMeta,
                    isNew: this.isNew
                }).render();
                this.nameVsRefDropdownElementView[refElementMeta.name] = refElementView;
            }
        }
    },


    buildMapElements: function(mapElements) {
        var refElementLength = mapElements.length;
        if (refElementLength > 0) {

            var style = {
                strokeColor: '#FFE100',
                strokeWidth: 3,

                fillOpacity: .1,
                fillColor: 'white',
                pointRadius: 10
            };
            for (var i = 0; i < refElementLength; i++) {

                //	uniqueId='" + metaData.uniqueId +
                var id = mapElements[i].uniqueId;

                var myself = this;
                var displayType = mapElements[i].displayType.toLowerCase();
                this.pointtext = $("#" + id);
                var elemd = $("#" + id + "_dialog");
                var mapid = id + "_map";
                var mapToolId = id + "_mapTool";
                
                $("#" + id + "_img").click(function() {
                    elemd.dialog({
                   //     position: [300,100] ,
                        height: 500,
                        width: 800,
                  //      show: "explode",
                        modal: true,
                        buttons: {
                            "Ok": function() {
                                $(this).dialog("close")
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
                    
                      
                    var modifyFeatureControl = new OpenLayers.Control.ModifyFeature(dynmicLayer, {
                        clickout: false,
                        toggle: false,
                        title: map_tool_modify,  
                        displayClass: "olControlModify",
                        onModification: function(feature) {
                            myself.pointtext.val(feature.geometry);
                            myself.pointtext.change();
                            feature.state = OpenLayers.State.UPDATE;
                        } 
                    });
                    
                    var editPanel = new OpenLayers.Control.Panel({
                    	
                        displayClass: 'map_toolbar'
                    });
                   
                    var textControlModify=new OpenLayers.Control.TextControl({
                    	title:map_tool_modify,
                    	parentControl:modifyFeatureControl,
                    	displayClass:"olControlModifyText map_toolbar_text "
                    });
               //     editPanel.addControls([modifyFeatureControl,textControl]);
                    map.map.addControl(editPanel);
                    var value = myself.pointtext.val();
                    if (value && value.length > 2) {
                        var parser = new OpenLayers.Format.WKT();
                        var feature = parser.read(value);
                        dynmicLayer.addFeatures([feature]);

                        map.map.setCenter(feature.geometry.getBounds().getCenterLonLat());

                    }
                    if (displayType == "point") {
                        //			        	   map.map.events.register('click', map, function (e) {  
                        //			           	    var lonlat=map.map.getLonLatFromPixel(e.xy);
                        //			                  
                        //			                   dynmicLayer.removeAllFeatures();
                        //			                   var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
                        //			                   var pointFeature = new OpenLayers.Feature.Vector(point);
                        //			                   dynmicLayer.addFeatures([pointFeature]);  
                        //			                  
                        //			                   myself.pointtext.val("Point("+lonlat.lon+" "+lonlat.lat+")"); 
                        //			                   myself.pointtext.change(); 
                        //			                    OpenLayers.Event.stop(e);
                        //			            });
                        var control = new OpenLayers.Control.DrawFeature(dynmicLayer, OpenLayers.Handler.Point, {
                            displayClass: "olControlAdd",
                            title: map_tool_pointTitle,  
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
                        textControlModify.otherControl=control;
                        var textControl=new OpenLayers.Control.TextControl({
                        	title:map_tool_pointTitle,
                        	parentControl:control,
                        	otherControl:modifyFeatureControl,
                        	displayClass:"olControlAddText map_toolbar_text "
                        });
                        editPanel.addControls([modifyFeatureControl,textControlModify,control,textControl]);

                        control.activate();
                    } else if (displayType == "polyline") {

                        var control = new OpenLayers.Control.DrawFeature(dynmicLayer, OpenLayers.Handler.Path, {
                            displayClass: "olControlAdd",
                            title: map_tool_pathTitle,
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
                        textControlModify.otherControl=control;
                        var textControl=new OpenLayers.Control.TextControl({
                        	title:map_tool_pathTitle,
                        	parentControl:control,
                        	otherControl:modifyFeatureControl,
                        	displayClass:"olControlAddText map_toolbar_text "
                        });
                        editPanel.addControls([modifyFeatureControl,textControlModify,control,textControl]);
                        control.activate();
                    } else if (displayType == "polygon") {
                        var control = new OpenLayers.Control.DrawFeature(dynmicLayer, OpenLayers.Handler.Polygon, {
                            displayClass: "olControlAdd",
                            title: map_tool_polygonTitle,
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
                        textControlModify.otherControl=control;
                        var textControl=new OpenLayers.Control.TextControl({
                        	title:map_tool_polygonTitle,
                        	parentControl:control,
                        	otherControl:modifyFeatureControl,
                        	displayClass:"olControlAddText map_toolbar_text "
                        });
                        editPanel.addControls([modifyFeatureControl,textControlModify,control,textControl]);
                        control.activate();
                    }

                });
            }
        } 
    },
    
    setColorElements:function(){
    	  var metaData = this.options.articleEditMeta;
          var metaDataFields = metaData.fields; 
          for (var i = 0; i < metaDataFields.length; i++) {
              var fieldMetaData = metaDataFields[i]; 
             if(fieldMetaData.displayType=="COLOR"){
            	 var id=fieldMetaData.id;
            	 id=id.replace("_new_","_"); 
            	 var text=$("#" + id);   
                 var val=this.model.attributes[ fieldMetaData.name]; 
                 text.val(val); 
                 text.spectrum("set", val);
             }
          } 
    },
    buildColorElements: function(colorElements) {
        var refElementLength = colorElements.length; 
            for (var i = 0; i < refElementLength; i++) {  
                var id = colorElements[i].id;   
                var text=$("#" + id); 
                var val=this.model.attributes[ this.colorElements[i].name];   
                text.val(val); 
                text.spectrum({   
                	showInput:true, 
                  	preferredFormat: "hex",
                  	chooseText: label_color_ok,
                    cancelText: label_color_cancel
                });  
        }  
    },


    handleAddGeometryEnd: function(event) {
        this.pointtext.val(event.feature.geometry);
        this.pointtext.change();

    },
    buildCollectionReferences: function(collectionReferenceElements) {
        if (collectionReferenceElements.length > 0) {
            this.collectionReferencesEl = $(viewCreator.make("div"));
            this.$el.append(this.collectionReferencesEl);

            this.collectionRefNameVsView = {};

            for (i = 0; i < collectionReferenceElements.length; i++) {
                var collectionRef = collectionReferenceElements[i];
                var collectionRefView = null;
                if (collectionRef.allowCreateFromParent) {
                    collectionRefView = new CollectionReferenceView({
                        parentEditView: this,
                        referenceMeta: collectionRef
                    }).render();
                    this.collectionReferencesEl.append(collectionRefView.el);
                } else if (collectionRef.displayType === 'MULTI_SELECT') {
                    collectionRefView = new CollectionAggregatePickListView({
                        parentEditView: this,
                        referenceMeta: collectionRef,
                        colspan: this.options.articleEditMeta.columnLayout * 2,
                        articleName: this.options.articleEditMeta.name
                    });
                    this.tbody.append(collectionRefView.render().el);
                } else {
                    //Passing parentEl, see comments on CollectionAggregateReferenceView.initialize()
                    collectionRefView = new CollectionAggregateReferenceView({
                        parentEditView: this,
                        referenceMeta: collectionRef,
                        articleName: this.options.articleEditMeta.name,
                        parentEl: this.collectionReferencesEl
                    }).render();
                }
                this.collectionRefNameVsView[collectionRef.name] = collectionRefView;
            }
        }
    },

    buildAttachmentElements: function() {
        for (var name in this.attachmentsMeta) {
            if (this.attachmentsMeta.hasOwnProperty(name)) {
                var fieldMeta = this.attachmentsMeta[name];
                var attachmentField = $(this.form.find('.' + name)[0]);
                if(fieldMeta.showAdd){
	                attachmentField.after(new AttachmentSelectorView({
	                    fieldMetaData: fieldMeta,
	                    editView: this,
	                    fieldId:this.id+"_"+fieldMeta.name
	                }).render().el);
                }else{
                	attachmentField.after(new AttachmentSelectorView({
	                    fieldMetaData: fieldMeta,
	                    editView: this 
	                }).render().el);
                }
            }
        }
    },

    buildRow: function(metaData) {
        var oTd = "<th>" + metaData.displayName;
        if (metaData.mandatory) {
            oTd += "<sup style='color:red;'>*</sup>";
        }
        oTd += "</th>";

        var dataType = metaData.dataType + "_" + metaData.displayType;
        if (dataType.toLowerCase() === 'reference_article_select') {
            //Add empty td we will replace it with reference element later
            var id = this.modifiedArticleName + '_' + metaData.name;
            this.referenceElements[this.referenceElements.length] = metaData;
            oTd += "<td id='" + id + "'/>";

        } else {
            if (dataType.toLowerCase() === 'string_point' || dataType.toLowerCase() === 'string_polyline' || dataType.toLowerCase() === 'string_polygon') {
                metaData.uniqueId = metaData.name + "_" + parseInt(Math.random() * 10000);

                this.mapElements[this.mapElements.length] = metaData;
            }
            //TODO: here if want to support signature to add the metaData to container to bind the something ,, 
            oTd += "<td>" + this.getComponent(metaData) + "</td>";

        }
        return oTd;
    },

    getComponent: function(metaData) {
        var self = this;
        var dataType = metaData.dataType + "_" + metaData.displayType;
        var component = "";

        var uniqueId = digitnexus.modifiedArticleName(this.options.articleEditMeta.name);

        var property = {};
        property.uniqueId = uniqueId;
        property.articleName = this.options.articleEditMeta.name;
        property.tableId = this.tableId;
        property.name = uniqueId + "_" + metaData.name;
        property.id = metaData.name;
        property.properties = {}; // for setting multiple custom properties

        // setting custom properties 
        property.properties.displayType = metaData.displayType;
        
        if(this.elementsRenderer){
            var customComponenet=this.elementsRenderer.renderElement(metaData,property);
            if(customComponenet){
                return customComponenet;
            }
        }

        switch (dataType.toLowerCase()) {

        case "string_textfield":
            component += self.getTextBox(metaData, property);
            if (metaData.attachment) {
                this.attachmentsMeta[property.name] = metaData;
            }
            break;
            //here is can support signature in the edit view so if you want to support, you can remove the annotate,,.. modify by bill
        case "string_image":
            component += self.getSignatureElement(metaData, property);
            break;
        case "boolean_checkbox":
            component += self.getBooleanCheckboxElement(metaData, property);
            break;
        case "list_radio":
            component += self.getRadioElements(metaData, property);
            break;
        case "list_checkbox":
            component += self.getCheckboxElements(metaData, property);
            break;
        case "enumeration_select":
        	var dropdownId = uniqueID();
            component += self.getDropdownElement(metaData, property,dropdownId);   
            this.enumerationDropdownElements[this.enumerationDropdownElements.length]=[metaData,dropdownId];         
            break;  
        case "reference_array":
        	var dropdownId = uniqueID();
            component += self.getArrayElement(metaData, property,dropdownId);   
            this.referenceArrayElements[this.referenceArrayElements.length]=[metaData,dropdownId];         
            break;
        case "string_time":
        case "date_date":
        case "date_datetime":
            //can support the date_datetime,datetime_datetime two case; modify by bill
        case "datetime_datetime":
        case "timestamp_datetime":
        	var uuId = uniqueID();
            component += self.getTextBox(metaData, property,uuId);
            if (!metaData.readOnly || !(this.isNew || metaData.updatable)) {
                this.dateElements[this.dateElements.length] = property.name; // element id into array to generate date component once html will become part of DOM
            }
            break;
        case "reference_article_select":
            component += self.getArticleSelectReferenceComponent(metaData, property);
            break;
        case "reference_article_dropdown":
            // properties use in building editable component
        	var dropdownId = uniqueID();
            component += self.getArticleReferenceDropdownElement(metaData, property,dropdownId);
           // metaData.dropdownId=dropdownId;
            this.referenceDropdownElements[this.referenceDropdownElements.length] = [metaData,dropdownId]; 
            break;
        case "string_point":
        case "string_polyline":
        case "string_polygon":
            component += self.getMapPoint(metaData, property);
            break;
        case "string_color": 
        	 component += self.getTextBox(metaData, property); 
        	// console.log( self.getColorBox(metaData, property));
        	 metaData.id=this.id + "_" + property.id;
        	 this.colorElements[this.colorElements.length] = metaData; 
            break;
 
        default:
            component += self.getTextBox(metaData, property);
            if (metaData.attachment) {
                this.attachmentsMeta[property.name] = metaData;
            }
            break;
        }

        return component;

    },

    getValidationClass: function(metaData) {
        var validationClass = "";
        if (metaData.mandatory) {
            //Space after required is important
            validationClass = "required ";
        }
        
        if(metaData.range){
        	validationClass += "range ";
        }
        
        if(metaData.alphanumericMeta){
        	validationClass += "alphanumeric ";
        }

        if (metaData.compareMeta) {
            var compareMeta = metaData.compareMeta;
            switch (compareMeta.type) {
            case "GREATER":
                validationClass += "greater ";
                break;
            case "LESS":
                validationClass += "less ";
                break;
            case "EQUAL":
                validationClass += "equal ";
                break;
            case "NOTEQUAL":
                validationClass += "notEqual ";
                break;
            case "GREATEREQUAL":
                validationClass += "greaterEqual ";
                break;
            case "LESSEQUAL":
                validationClass += "lessEqual ";
                break;
            }

        }


        switch (metaData.dataType) {
        case 'INTEGER':
        case 'LONG':
        case 'BIG_INTEGER':
            validationClass += " digits";
            break;
        case 'FLOAT':
        case 'DOUBLE':
        case 'BIG_DECIMAL':
            validationClass += " number";
            break;
        }

        if (metaData.validation) {
            validationClass += metaData.validation;
        }

        return validationClass;
    },

    getTextBox: function(metaData, property,__uuId) {
    	var uuid=__uuId||"";
        var component = "<input type='";
        if (metaData.hidden) {
            component += "hidden";
        } else {
            component += "text";
        }
        var readOnly = false;
        component += "' ";
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            component += " readOnly='true' ";
            readOnly = true;
        }
        if (metaData.length > -1) { //-1 is the default value
            component += " maxlength='" + metaData.length + "' ";
        }

        //metaData.name in class is used for data binding 
        component += " class='" + property.name + " " + this.getValidationClass(metaData) + "' ";

        if (metaData.compareMeta) {
            var compareMeta = metaData.compareMeta;
            component += " targets='" + compareMeta.targets.join(" ") + "'";
        }
        if (metaData.range) {            
            component += " range='" + metaData.range + "'";
        }

        if (readOnly) {
            component += " readonly ";
        }

     //   component += "'";

        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "='" + value + "' ";
            }
        }
        if (property.style) {
            component += " " + property.style + " ";
        }
        
     //   var val=this.model.attributes[metaData.name];
     //   console.log(val);
        component += " uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id +uuid+ "'  modelAttr='" + property.id + "' value='' />";
      
        if (metaData.uomMeta){
        	component+= metaData.uomMeta.name;
        }
        return component;
    },
    
    getArrayElement:function(metaData, property,__uuId){
    	var uuid=__uuId||"";
        var component = "<input type='";
        if (metaData.hidden) {
            component += "hidden";
        } else {
            component += "text";
        }
     
        component += "' ";
   
        component += " readOnly='true' ";
          
        //metaData.name in class is used for data binding 
        component += " class='" + property.name + " " + this.getValidationClass(metaData) + "' ";

        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "='" + value + "' ";
            }
        }
        
        if (property.style) {
            component += " " + property.style + " ";
        }   

        component += " uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id +uuid+ "' value='' />";
      
         return component;
    },
    
     
    getSignatureElement: function(metaData, property) {
        //here is can support signature in the edit view so if you want to support, you can remove the annotate,,.. modify by bill
        //here need to implemention .... modify by bill
        //console.log(JSON.stringify(metaData)+" ==== "+JSON.stringify(property));
        return "&nbsp;";
    },
    getMapPoint: function(metaData, property) {
        var component = "<input type='";
        if (metaData.hidden) {
            component += "hidden";
        } else {
            component += "text";
        }
        component += "' ";
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            component += " readOnly='true' ";
        }
        if (metaData.length > -1) { //-1 is the default value
            component += " maxlength='" + metaData.length + "' ";
        }

        //metaData.name in class is used for data binding 
        component += " class='" + property.name + " " + this.getValidationClass(metaData) + "'";

        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "=" + value + " ";
            }
        }
        property.name = this.modifiedArticleName + "_" + metaData.name;
        if (property.style) {
            component += " " + property.style + " ";
        }
        var imgurl = metaData.imageMap["default"];
        //  console.log(imgurl);
        if (!imgurl) {
            imgurl = "skins/common/images/map/point.png";
        }

        component += " uniqueId='" + metaData.uniqueId + "' name='" + property.name + "' id='" + metaData.uniqueId + "'  modelAttr='" + property.id + "' value='' />";
        component += "<img id=" + metaData.uniqueId + "_img src=" + imgurl + " /><div id=" + metaData.uniqueId + "_dialog   />";
        return component;
    },

    getRadioElements: function(metaData, property) {
        var component = "";
        var readOnly = false;
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            readOnly = true;
        }

        for (var i = 0; i < metaData.values.length; i++) {
            component += "<input type='radio' uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id + "'  modelAttr='" + property.id + "' value='" + metaData.values[i].value + "' ";
            if (readOnly) {
                component += " class='readonly' readOnly='true' ";
            }

            //setting addition properties if any onto element as a custom attribute
            if (property && property.properties) {
                for (var key in property.properties) {
                    var value = property.properties[key];
                    component += " " + key + "=" + value + " ";
                }
            }
            component += " />" + metaData.values[i].displayValue + "<br />";
        }
        return component;
    },

    getBooleanCheckboxElement: function(metaData, property) {
        var component = "";
        component += "<input type='checkbox' uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id + "'  modelAttr='" + property.id + "' value='' ";
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            omponent += " class='readonly' readOnly='true' ";
        }

        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "=" + value + " ";
            }
        }
        component += " />";
        return component;
    },

    getCheckboxElements: function(metaData, property) {
        var component = "";
        var readOnly = false;
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            readOnly = true;
        }
        for (var i = 0; i < metaData.values.length; i++) {
            component += "<input type='checkbox' uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id + "'  modelAttr='" + property.id + "' value='" + metaData.values[i].value + "' ";
            if (readOnly) {
                component += " class='readonly' readyOnly='true' ";
            }
            //setting addition properties if any onto element as a custom attribute
            if (property && property.properties) {
                for (var key in property.properties) {
                    var value = property.properties[key];
                    component += " " + key + "=" + value + " ";
                }
            }
            component += " />" + metaData.values[i].displayValue + "<br/>";
        }
        return component;
    },

    getDropdownElement: function(metaData, property,__dropdownId) {
        var self = this;
        var dropdownId = __dropdownId||"";
        //TODO:Width is hard coded because the calculated width we get is not enough to display chosen select
        var component = "<select uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id +dropdownId+ "'  modelAttr='" + property.id + "' ";
        component += " class='chosen " + self.getValidationClass(metaData) + "'";

        //Readonly does not work for select.diabled needs to be used here.If we disabled value of
        //this field will not be sent to server. Maintain a input hidden field 
        var readOnly = false;
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            component += " disabled='disabled' ";
            readOnly = true;
        }


        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "=" + value + " ";
            }
        }
        
        if(!metaData.readOnly&&!metaData.mandatory){
        	component +=" data-placeholder='"+select_an_option+"'";
        }
        component += " >";
        
        if(!metaData.readOnly&&!metaData.mandatory){
        	component += "<option value=''></option>";
        }
        
        var selectedValue = this.model.get(property.id);
        for (var key in metaData.values) {
            component += "<option value='" + key + "'>" + metaData.values[key] + "</option>";
        }

        component += "</select>";
        if (readOnly) {
            component += "<input type='hidden'" + " modelAttr='" + property.id + "'/>";
        }
        return component;
    },

    getArticleReferenceDropdownElement: function(metaData, property,__dropdownId) {
        var self = this;
        var dropdownId = __dropdownId||"";
        //TODO:Width is hard coded because the calculated width we get is not enough to display chosen select
        var component = "<select uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id +dropdownId+ "'";
        component += " class='chosen " + self.getValidationClass(metaData) + "'";

        //Readonly does not work for select.diabled needs to be used here.If we disabled value of
        //this field will not be sent to server. Maintain a input hidden field 
        var readOnly = false;
        if (metaData.readOnly || !(this.isNew || metaData.updatable)) {
            component += " disabled='disabled' ";
            readOnly = true;
        }


        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "=" + value + " ";
            }
        }
        
        var optionNull = ""
        if(!metaData.readOnly&&(!metaData.mandatory||this.isNew)){
        	component +=" data-placeholder='"+select_an_option+"'";
        	optionNull="<option value=''></option>";
        }
        //Add a dummy option so that the combobox do not look shrinked if there are no values.
        component += " >"+optionNull+"</select>";

        if (readOnly) {
            component += "<input type='hidden'" + " modelAttr='" + property.id + "'/>";
        }
        return component;
    },

    getArticleSelectReferenceComponent: function(metaData, property) {
        var component = "<input type='";
        if (metaData.hidden) {
            component += "hidden";
        } else {
            component += "text";
        }
        component += "'  readOnly='true' ";

        if (metaData.length > -1) { //-1 is the default value
            component += " maxlength='" + metaData.length + "' ";
        }

        //metaData.name in class is used for data binding 
        component += " class='" + property.name + " " + this.getValidationClass(metaData) + " readonly'";

        //setting addition properties if any onto element as a custom attribute
        if (property && property.properties) {
            for (var key in property.properties) {
                var value = property.properties[key];
                component += " " + key + "=" + value + " ";
            }
        }
        if (property.style) {
            component += " " + property.style + " ";
        }
        component += " uniqueId='" + property.uniqueId + "' name='" + property.name + "' id='" + this.id + "_" + property.id + "_" + metaData.referenceProperty + "' modelAttr='" + property.id + "[" + metaData.referenceProperty + "]' value='' />";

        return component;

    },

    buildDateAndDateTimeComponent: function(dateElements, parentComponent) {
        $(dateElements).each(function(index, name) {
            var elem = $(parentComponent.find("." + name)[0]);
            elem.attr("readonly", "true");
            //TODO this is incorrect to hardcode this. this has to be fetched based on locale
            if(elem.attr("displayType") === "TIME"){
            	elem.timepicker({
                    showOn: "button",
                    buttonImage: "images/common/calendar.gif",
                    buttonImageOnly: true,
                    buttonText: 'Choose Time',
                    hourGrid: 4,
                	minuteGrid: 10
                	
                });
            }else if (elem.attr("displayType") === "DATETIME") {
                elem.datetimepicker({
                    showOn: "button",
                    buttonImage: "images/common/calendar.gif",
                    buttonImageOnly: true,
                    buttonText: 'Choose Date And Time',
                    changeMonth: true,            
                    changeYear: true,
                    yearRange: 'c-20:c+20'
                });
            } else {
                elem.datepicker({
                    showOn: "button",
                    buttonImage: "images/common/calendar.gif",
                    buttonImageOnly: true,
                    changeMonth: true,            
                    changeYear: true,
                    yearRange: 'c-20:c+20',
                    buttonText: 'Choose Date'
                });
            }

            elem.focus();
        });


    },
    
    setDefaultEnumerationSelectValue: function() {
        var articleEditMeta = this.options.articleEditMeta;
        var metaDataFields = articleEditMeta.fields;
        var fieldLength = metaDataFields.length;
        for (var i = 0; i < fieldLength; i++) {
            metaData = metaDataFields[i];
            var dataType = metaData.dataType + "_" + metaData.displayType;
            if (dataType.toLowerCase() === "enumeration_select") {
                for (var key in metaData.values) {
                    if (!this.model.get(metaData.name)) {
                        this.model.set(metaData.name, key);
                    }
                }
            }
        }

    },
    setEnumerationDropdownElementsValue:function(){
    	var length = this.enumerationDropdownElements.length;
    	for(var i=0;i<length;i++){
    		var refEnumElementMeta = this.enumerationDropdownElements[i][0];
    		var dropdownId = this.enumerationDropdownElements[i][1]||"";    		
    		var value = $('#' + this.id + '_' + refEnumElementMeta.name+dropdownId).val();
    		this.model.set(refEnumElementMeta.name,value);
    	}
    	
    },
    save: function() {
        var self = this;
        if (this.isValid()) {
            //Get collection references child data and set it to this model
            var refElementsLength = this.collectionReferenceElements.length;
            if (refElementsLength > 0) {


                for (var i = 0; i < refElementsLength; i++) {
                    var refElementMeta = this.collectionReferenceElements[i];
                    var collectionRefView = this.collectionRefNameVsView[refElementMeta.name];
                    this.model.set(refElementMeta.name, collectionRefView.getModelData());
                }
            }
            var isT = true;
            for (var i = 0; i < this.mapElements.length; i++) {
                var id = this.modifiedArticleName + "_" + this.mapElements[i].name;
                this.pointtext = $("input[name='" + id + "']");
                var displayType = this.mapElements[i].displayType.toLowerCase();
                var text = this.pointtext.val();

                if (text) {
                    digitnexus.syncGet('/rest/geovalide/' + displayType + '/' + text, null, function(response) {
                        if (response.status != "ok") {
                            self.pointtext.val("");
                            self.pointtext.change();
                            AppView._showMessage(error_geo, "error");
                            isT = false;
                        }
                    }, function(xhr, status, exception) {

                    });
                }

            }
            if (!isT) {
                return false;
            }
            //set enumeration_select element attributes to model
//            this.setDefaultEnumerationSelectValue();
            this.setEnumerationDropdownElementsValue();
            //Set reference element attributes to model
            this.setReferenceElementAttributes();
            this.setReferenceDropdownElementAttributes();
            
            if(this.validDropdownElementAttributes()){
            	appView.buttonBlocker.unblock();
            	return false;
            }
            
            if(this.listView&&this.listView.model&&this.listView.model.hiddenField){
            	 var model=this.listView.model;
            	  this.model.set(model.hiddenField.fieldName, model.hiddenField.fieldValue); 
            	  this.model.set(model.hiddenField.fieldName1, model.hiddenField.fieldValue1); 
           }

            this.model.save(null, {
                success: function() {
                    self.resetState = true;        
                    
                    AppView._showMessage(label_news_add_success, "success");
                    
                    self.options.editViewContainer.refreshListView(true);
                    
                    self.options.editViewContainer.changeVisibility(true);
                    
                    if (self.saveSuccessCallBack) {
                        self.saveSuccessCallBack();
                    }
                },

                error: function(model, response) {
                    var notyText = '';
                    try {
                        var errors = eval('(' + response.responseText + ')');
                        var validationError = {};
                        var modifiedArticleName = digitnexus.modifiedArticleName(self.options.articleEditMeta.name);
                        for (var fieldName in errors) {
                            if (fieldName === 'all') {
                                notyText = errors[fieldName].join("\n");
                            } else {
                                validationError[modifiedArticleName + '_' + fieldName] = errors[fieldName].join(".");
                            }

                        }
                        self.form.validate().showErrors(validationError);
                    } catch (e) {
                        notyText = response.statusText;
                    }

                    if (notyText !== '') {
                        self.options.editViewContainer.$el.noty({
                            "text": notyText,
                            "layout": "inline",
                            "type": "error",
                            "animateOpen": {
                                "height": "toggle"
                            },
                            "animateClose": {
                                "height": "toggle"
                            },
                            "speed": 500,
                            "timeout": 5000,
                            "closeButton": true,
                            "closeOnSelfClick": true,
                            "closeOnSelfOver": false
                        });
                    }

                }
            });
        } else {
            //To unblock any button called before save
            appView.buttonBlocker.unblock();
            return false;
        }
    },
    
    validDropdownElementAttributes:function() {
    	var result = false;
        var refElementsLength = this.referenceDropdownElements.length;
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceDropdownElements[i][0];
                var dropdownId = this.referenceDropdownElements[i][1];//refElementMeta.dropdownId||"";   
                
                var selectId = this.id + '_' + refElementMeta.name+dropdownId;
                var value = $('#' + selectId).val();//this.model.get(refElementMeta.name); 
                
                if(refElementMeta.mandatory&&(value == "" ||value == null || value == undefined)){
        			result = true;
        			$('#' + selectId).next().next("label").remove();
        			$("<label class='error' generated='true'>"+error_required+"</label>").insertAfter($('#' + selectId + "_chzn"))
        			$('#' + selectId).change(function(){
        				$(this).next().next("label").remove();
        			})
                }                        
            }
        }
        return result;
    },

    setReferenceElementAttributes: function() {
        //Get reference elements data
        var refElementsLength = this.referenceElements.length;
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceElements[i];
                var refElementView = this.nameVsRefElementView[refElementMeta.name];
                var modelData = refElementView.getModelData();
                if (this.determineObjectHaveAttributes(modelData)) {
                    this.model.set(refElementMeta.name, modelData);
                }
            }
        }

    },

    setReferenceDropdownElementAttributes: function() {
        //Get reference elements data
        var refElementsLength = this.referenceDropdownElements.length;
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.referenceDropdownElements[i][0];
                var refElementView = this.nameVsRefDropdownElementView[refElementMeta.name];
                var modelData = refElementView.getModelData();
                if (this.determineObjectHaveAttributes(modelData)) {
                    this.model.set(refElementMeta.name, modelData);
                }
            }
        }

    },

    determineObjectHaveAttributes: function(attrObject) {
        if (attrObject) {
            var keys = new Array();
            for (var p in attrObject) {
                keys.push(p);
            }
            if (keys != null && keys.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    /*
     * return false if data represented by this edit view is not valid
     */
    isValid: function() {
        //Validate main form
        var isValid = this.form.valid();
        var refElementsLength = this.collectionReferenceElements.length;
        //Validate collection reference elements
        if (refElementsLength > 0) {
            for (var i = 0; i < refElementsLength; i++) {
                var refElementMeta = this.collectionReferenceElements[i];
                var collectionRefView = this.collectionRefNameVsView[refElementMeta.name];
                isValid = isValid && collectionRefView.isValid();
            }
        }

        return isValid;
    },

    resetForm: function() {
        this.form.validate().resetForm();
        this.resetCollectionRefererences();
        this.resetReferenceElementsValue();
        this.resetReferenceDropdownElementsValue();
        this.resetEnumerationDropdownElements();
        if (this.options.isNew) {
            this.model.clear();
        }
        if (this.isNew) {
            this.form.each(function() {
                this.reset();
            });
        }
    },

    setSaveSuccessCallBack: function(saveSuccessCallBack) {
        this.saveSuccessCallBack = saveSuccessCallBack;
    },

    resize: function() {
        var tabTitleHeight = 25;
        if (this.isNew) {
            tabTitleHeight = 0;
        }

        var toolBarHeight = 30;
        this.$el.height(this.$el.parent().parent().outerHeight() - tabTitleHeight - toolBarHeight - 30);
    },

    close: function() {
        this.remove();
        this.unbind();
        this.modelBinder.unbind();
    }

});

/**
 * Registry for edit view elements renderers
 */
EditView.elementsRendererRegistry={};

/**
 * elementsRenderer should be subclass of EditViewElementsRenderer
 */
EditView.registerElementsRenderer=function(articleName,elementsRenderer){
    EditView.elementsRendererRegistry[articleName]=elementsRenderer;
}

EditView.getElementsRenderer=function(articleName){
    return EditView.elementsRendererRegistry[articleName];
}

/**
 *Base class for all custom edit view element renderers. Althought it looks exactly like
 *DetailViewElementsRenderer code is duplicated to make future modifications independent of detail view renderers
 */
EditViewElementsRenderer=function(){
    
}

_.extend(EditViewElementsRenderer.prototype,{
    /**
     * To modify any metadata info
     */
    preprocessFieldsMetaData:function(fieldsMetaData){
        
    },
    
    /**
     * To override default element rendering of EditView.
     * Append html string to html for the element. This should take care of backbone bindings as well. 
     * This should method should behave exactly like EditView.getComponent(). EditView does default rendering
     * if this method do not return html
     */
    renderElement:function(fieldMetaData,property){
        return null;
    },
    
    /**
     * To override default rendering of some of the component elements like collection references etc 
     * which are added at the end of 
     * template generated dom.Should return true if rendering is overrided.
     */
    renderComponents:function(fieldMetaData,renderedDom){
      return false; 
    },
    
    /**
     * Call back after entire elements rendering is complete so that events can be registered or dom of
     * elements can be modified
     */
    postRender:function(renderedDom){
        
    }
    
    
});
window.FieldTabGroupView = Backbone.View.extend({
	tagName : 'div',
	initialize : function(){
		this.editView = this.options.editView;
		this.metaData = this.options.metaData;
		this.tableId = this.options.tableId;
		this.mainFieldGroupMetas = this.options.mainFieldGroupMetas,
		this.fieldGroupMetas = this.options.fieldGroupMetas;
	},
	render : function(){
		if(this.fieldGroupMetas.length>0){
			this.tabMenuEle = $(viewCreator.make("ul",{"class":"ui-tabs"}));
			this.$el.append(this.tabMenuEle);
			var array = [];
			for(var i = 0; i < this.fieldGroupMetas.length;i++){
				var randomNumber = Math.floor(Math.random()*1000);
				var randomId = this.tableId+"_"+this.fieldGroupMetas[i].name+"_"+randomNumber;
				var liEle = viewCreator.make("li",{"class":"c"},viewCreator.make("a",{"href":"#"+randomId},this.fieldGroupMetas[i].displayName));
				this.tabMenuEle.append(liEle);
				if(this.fieldGroupMetas[i].hidden===false){
					array.push({index:i,indexDivId:randomId});
				}
				this.$el.append(this.generateTabContent(randomId,this.mainFieldGroupMetas[i]));
			}
			this.selectedTabs = null;
			if(array.length>0){
				this.selectedTabs = array[0];
			}
			var self = this;
			this.$el.tabs({selected: this.selectedTabs.index});
			this.$el.tabs({
				show : function(event, ui){
					var isApplyChosen = ui.tab.getAttribute("isApplyChosen");
					if(isApplyChosen){
						//..
						return;
					}else{
						var tbody = $(ui.panel).find('tbody');
						self.editView.tbody = $(tbody[0]);
						self.editView.applyChosen(self.editView.tbody);
						
						ui.tab.setAttribute("isApplyChosen",true);
					}
				}
			});
		}
		return this;
	},
	generateTabContent : function(id,mainFieldGroupMeta){
		var containerEle = $(viewCreator.make("div",{"id":id}));
		var randomNumber = Math.floor(Math.random()*1000);
		var tableContainerEle = $(viewCreator.make('table',{"class":"table_2","id":this.tableId+"_"+randomNumber}));
		containerEle.append(tableContainerEle);
		var tbodyContainerEle = $(viewCreator.make('tbody'));
		tableContainerEle.append(tbodyContainerEle);
		tbodyContainerEle.append(this.editView.generateFormTableRow(this.metaData, mainFieldGroupMeta));
		return containerEle;
	},
	defaultSetup:function(){
		//set the default select tab page to applyChosen
		this.editView.applyChosen($("div#"+this.selectedTabs.indexDivId));
		//and then set the isApplyChosen to true to the default select tab .
		$("a[href=#"+this.selectedTabs.indexDivId+"]").attr("isApplyChosen",true);
	}
});
window.FieldSetGroupView = Backbone.View.extend({
	className : 'detailview-content-2',
	tagName : 'div',
	initialize : function(){
		this.metaData = this.options.metaData;
		this.fieldGroupMeta = this.options.fieldGroupMeta;
		this.editView = this.options.editView;
		this.tableId = this.options.tableId;
		this.mainFieldGroupMeta = this.options.mainFieldGroupMeta;
	},
	render : function(){
		var headerEle = $(viewCreator.make('h3',{"class":"title2"}));
		this.$el.append(headerEle);
		var divContainerEle = $(viewCreator.make('div',{"class":"title2_l"}));
		headerEle.append(divContainerEle);
		var olevelContainerEle = $(viewCreator.make('div',{"class":"title2_r"}));
		divContainerEle.append(olevelContainerEle);
		var tlevelContainerEle = $(viewCreator.make('div',{"class":"title2_m"}));
		olevelContainerEle.append(tlevelContainerEle);
		tlevelContainerEle.append(viewCreator.make('div',{"class":"f_left"},this.fieldGroupMeta.displayName));
		this.expandIconDivEle = $(viewCreator.make('div',{"class":"news_list_expand_icon"}));
		tlevelContainerEle.append(this.expandIconDivEle);
		var self = this;
		var callBack = function(){
			self.toggleTableContainer();
		};
		this.expandIconDivEle.click(callBack);
		headerEle.click(callBack);
		
		var randomNumber = Math.floor(Math.random()*1000);
		this.tableContainerEle = $(viewCreator.make('table',{"class":"table_2","id":this.tableId+"_"+randomNumber}));
		this.$el.append(this.tableContainerEle);
		var tbodyContainerEle = $(viewCreator.make('tbody'));
		this.tableContainerEle.append(tbodyContainerEle);
		tbodyContainerEle.append(this.editView.generateFormTableRow(this.metaData, this.mainFieldGroupMeta));
		return this;
	},
	defaultSetup : function(){
		if(this.fieldGroupMeta.hidden===true){
			this.expandIconDivEle.attr('showHide','1');
			this.tableContainerEle.hide();
		}else{
			this.expandIconDivEle.attr('showHide','0');
			this.expandIconDivEle.removeClass('news_list_expand_icon');
			this.expandIconDivEle.addClass('news_list_contract_icon');
			this.tableContainerEle.show();
		}
	},
	toggleTableContainer : function(){
    	var showHideFlag = this.expandIconDivEle.attr('showHide');
		if(showHideFlag && showHideFlag == '1'){
			this.tableContainerEle.show();
			this.expandIconDivEle.attr('showHide','0');
			this.expandIconDivEle.removeClass('news_list_expand_icon');
			this.expandIconDivEle.addClass('news_list_contract_icon');
		}else{
			this.tableContainerEle.hide();
			this.expandIconDivEle.attr('showHide','1');
			this.expandIconDivEle.removeClass('news_list_contract_icon');
			this.expandIconDivEle.addClass('news_list_expand_icon');
		}
	}
});

