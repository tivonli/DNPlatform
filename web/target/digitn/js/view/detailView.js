window.DetailView = Backbone.DigitNexusView.extend({
    className: 'detailview-tab-content',

    initialize: function() {

        this.$el.attr({style:'overflow-y:auto;height:100%;',id:this.id});
        this.model.bind("change", this.showContent, this);
        this.rendered = false;
        var articleName=this.options.articleEditMeta.name;
        this.modifiedArticleName = digitnexus.modifiedArticleName(articleName);
        this.resetState = false;
        //here is add the signatureElements to support bind the signature event..so... modify by bill
        this.signatureElementsId = [];
        this.elementsRenderer=DetailView.getElementsRenderer(articleName);
    },

    render: function() {
        return this;
    },

    showContent: function() {

        if (!this.rendered) {
            this.generateTemplate();
            this.rendered = true;
            this.resetState = true;
        }

        if (this.resetState) {
            this.$el.empty();
            this.$el.append(this.template({
                modelAttributes: this.model.attributes,
                selectionValues: this.selectPropertyToValues
            }));
            this.renderCollectionReferences();
            this.renderAttachments();
            this.resetState = false;
            
            if(this.elementsRenderer){
              this.elementsRenderer.postRender(this.$el);
            }
        }

    },

    generateTemplate: function() {
        var metaData = this.options.articleEditMeta;
        this.collectionReferenceElements = [];
        this.attachmentsMeta = {};
        var mainFields = [];
        //Send cloned metadata so that original metadata is not modified
        var metaDataFields = metaData.fields.slice(0);
        if(this.elementsRenderer){
            this.elementsRenderer.preprocessFieldsMetaData(metaDataFields);
        }
        //Used to display i18n values
        this.selectPropertyToValues = {};
        //Separate collection reference fields and other fields. we will render collection reference fields in the end
        for (var i = 0; i < metaDataFields.length; i++) {
            var fieldMetaData = metaDataFields[i];
            if (fieldMetaData.hidden) {
                continue;
            }
            if (fieldMetaData.dataType === 'COLLECTION') {
                this.collectionReferenceElements[this.collectionReferenceElements.length] = fieldMetaData;
            } else {
                mainFields[mainFields.length] = fieldMetaData;
                //Maintain attachments meta so that we can add them at the end
                if (fieldMetaData.attachment) {
                    this.attachmentsMeta[fieldMetaData.name] = fieldMetaData;
                }
            }
        }

        var detailTable = "<table class='table_2'><tbody>";
        var columnLayout = metaData.columnLayout;
        var mainFieldsLength = mainFields.length;

        for (var i = 0, split = columnLayout; i < mainFieldsLength && i < split;) {
            var jsonChunk = mainFields.slice(i, split);
            var oTr = "<tr>";
            for (var k = 0; k < jsonChunk.length; k++) {
                var fieldMetaData = jsonChunk[k];
                var propertyName = fieldMetaData.name;
                oTr += "<th>" + fieldMetaData.displayName + ":</th><td id='" + propertyName + "'>";
               
                if(this.elementsRenderer && this.elementsRenderer.renderElement(fieldMetaData,oTr)){
                     ++i;
                    //Custom rendered
                    continue;
                }
               
                var dataType = (fieldMetaData.dataType + "_" + fieldMetaData.displayType).toLowerCase();

                switch (dataType) {
                case 'reference_array':                	
                    var referencePropertyName = fieldMetaData.referenceProperty;
                	oTr +="<span><% _.each(modelAttributes."+propertyName+", function(item) { %> <%= item."+referencePropertyName+"!=null?item."+referencePropertyName+":item %>; <% }); %></span>";
                	break;
                case 'reference_article_select':
                case 'reference_article_dropdown':    
                    var referencePropertyName = fieldMetaData.referenceProperty;
                    //Do null check
                    oTr += "<span><%=(modelAttributes." + propertyName + "!=null?modelAttributes." + propertyName + '.' + referencePropertyName + ":'') %></span></td>"
                    break;
                case 'string_image':
                    //here is add the signatureElements to support bind the signature event..so... modify by bill
                    var preId = digitnexus.modifiedArticleName(fieldMetaData.displayKey) + "_signDiv";
                    oTr += "<div id='" + preId + "' class='iconBtn_1 icon_sign' value='<%=modelAttributes." + propertyName + "%>'></div>";
                    this.signatureElementsId.push(preId);
                    break;
                case 'boolean_select':
                case 'boolean_checkbox':
                    oTr += "<span><%=(modelAttributes." + propertyName + "?'" + label_yes + "':'" + label_no + "') %></span></td>";
                    break;
                case 'enumeration_select':
                    //Display i18n values
                    oTr += "<span><%=(modelAttributes." + propertyName + "!=null&&modelAttributes." + propertyName + "!==''?selectionValues." + propertyName + "[modelAttributes." + propertyName + "]:modelAttributes." + propertyName + ") %></span></td>";
                    this.selectPropertyToValues[propertyName] = fieldMetaData.values;
                    break;
                case 'string_html':
                	 oTr += "<span><%-(modelAttributes." + propertyName + "!=null?modelAttributes." + propertyName + ":''" + ")%></span></td>";
                	break;
                case "string_color":
                	 oTr += "<span class='colorfield' style='background-color: <%=(modelAttributes." + propertyName + "!=null?modelAttributes." + propertyName + ":''" + ")%>;' ></span></td>";
                	break;
                default:
                    oTr += "<span><%=(modelAttributes." + propertyName + "!=null?modelAttributes." + propertyName + ":''" + ")%></span></td>";
                    break;

                }

                ++i;
            }
            //builder the empty row 
            var lessRowTdUnitNum = 0;
            if (metaData.comments === true && (i === mainFields.length)) {
                if (jsonChunk.length < columnLayout) {
                    lessRowTdUnitNum = columnLayout - jsonChunk.length - 1;
                    oTr += "<th>" + label_article_comment + " : </th><td><div id='comment_id_" + this.modifiedArticleName + "' class='f_left iconBtn_1 icon_comment'></div>&nbsp;&nbsp;</td>";
                   // oTr += digitnexus.emptyRowBuilder(lessRowTdUnitNum);
                    oTr += "</tr>";
                } else {
                    oTr += "</tr><tr><th>" + label_article_comment + " : </th><td><div id='comment_id_" + this.modifiedArticleName + "' class='f_left iconBtn_1 icon_comment'></div>&nbsp;&nbsp;</td>";
                    lessRowTdUnitNum = 2;
                    // oTr += digitnexus.emptyRowBuilder(2);
                    oTr += "</tr>";
                }
            } else {
                if (jsonChunk.length < columnLayout) {
                    lessRowTdUnitNum = columnLayout - jsonChunk.length;                   
                 // oTr += digitnexus.emptyRowBuilder(lessRowTdUnitNum);
                    oTr += "</tr>";
                }
            }
            
            if(lessRowTdUnitNum>0){
             	var colspan = "colspan="+(lessRowTdUnitNum*2+1);
               
                 var index = oTr.lastIndexOf("<td");                	
             	var temp1 = oTr.substring(0,index);
             	var temp2 = oTr.substring(index).replace(/^<td/,"<td "+colspan);
             	
             	oTr = temp1+temp2;
            }
            
            detailTable += oTr;
            split += columnLayout;
        }
        detailTable += "</tbody></table>";
        this.template = _.template(detailTable);
    },
    bindCommentsEvent: function() {
        var self = this;
        if (!self.commentDialogView) {
            self.commentDialogView = new CommentDialogView({
                articleEditMeta: this.options.articleEditMeta
            }).render();
        }

        $('div#comment_id_' + this.modifiedArticleName).bind('click', {
            model: this.options.model
        }, function(event) {
            self.commentDialogView.showContent(event.data.model);
        });
    },
    //here is add the signatureElements to support bind the signature event..so... modify by bill
    bindSignatureEvent: function() {
        if (this.signatureElementsId.length > 0) {
            for (var k = 0; k < this.signatureElementsId.length; k++) {
                var sigEleId = this.signatureElementsId[k];
                var signatureElements = $('div#' + sigEleId);
                if (signatureElements) {
                    signatureElements.each(function(index) {
                        var signaturePicId = $(this).attr('value');
                        if (signaturePicId != null && signaturePicId != "") {
                            $(this).bind('click', {
                                picId: signaturePicId,
                                picObj: this
                            }, function(event) {
                                if (event.data.picId && event.data.picObj) {
                                    var imageView = new DisplayImageView({
                                        imageId: event.data.picId,
                                        parentView: event.data.picObj
                                    });
                                    $(event.data.picObj).append(imageView.render().el);
                                    imageView.showDialog();
                                }
                            });
                        } else {
                            $(this).parent().empty();
                        }
                    });
                }
            }
        }
    },

    renderCollectionReferences: function() {
        if (this.collectionReferenceElements.length > 0) {
            this.collectionReferencesEl = $(viewCreator.make("div"));
            this.$el.append(this.collectionReferencesEl);

            for (i = 0; i < this.collectionReferenceElements.length; i++) {
                var refElementMeta = this.collectionReferenceElements[i];
                 
                if(this.elementsRenderer && this.elementsRenderer.renderComponents(refElementMeta,this.collectionReferencesEl)){
                    //Custom rendered
                    continue;
                }
                var collectionReferenceView = null;
                if (refElementMeta.allowCreateFromParent) {
                    collectionReferenceView = new CollectionReferenceView({
                        parentEditView: this,
                        referenceMeta: refElementMeta,
                        readOnly: true
                    });
                    this.collectionReferencesEl.append(collectionReferenceView.render().el);
                } else {
                    //Passing parentEl, see comments on CollectionAggregateReferenceView.initialize()
                    collectionReferenceView = new CollectionAggregateReferenceView({
                        parentEditView: this,
                        referenceMeta: refElementMeta,
                        readOnly: true,
                        parentEl: this.collectionReferencesEl
                    }).render();
                }


                collectionReferenceView.setModelData(this.model.get(refElementMeta.name));
            }
        }
    },

    renderAttachments: function() {
        for (var name in this.attachmentsMeta) {
            if (this.attachmentsMeta.hasOwnProperty(name)) {
                var fieldMeta = this.attachmentsMeta[name];
                var attachmentField = $(this.$el.find('#' + name)[0]);
                attachmentField.append(new AttachmentSelectorView({
                    fieldMetaData: fieldMeta,
                    editView: this,
                    readOnly: true
                }).render().el);
            }
        }
    },

    onArticleSelection: function(articleId) {
        //Any changes to model throws 'change' event which will cause calling of 
        //'showContent' method. This is used to keep track of article selection and
        //render content only if resetState is true
        this.resetState = true;
    },



    setTemplate: function(template) {
        this.template = template;
        this.rendered = true;
        this.resetState = true;
    },

    resize: function() {
        //Approximate value After looking in various browsers
        var tabTitleHeight = 25;
        this.$el.height(this.$el.parent().outerHeight() - tabTitleHeight - 30);
    }
});

/**
 * Registry to maintain custom renderers
 */
DetailView.elementsRendererRegistry={};

/**
 * elementRenderer should be instance of subclass of DetailViewElementsRenderer. Check inherits fuction usage
 * in test js files for how to subclass.
 */
DetailView.registerElementsRenderer=function(articleName, elementRenderer){
    DetailView.elementsRendererRegistry[articleName]=elementRenderer;
}

DetailView.getElementsRenderer=function(articleName){
    return DetailView.elementsRendererRegistry[articleName];
}
DetailViewElementsRenderer=function(){
    
}

_.extend(DetailViewElementsRenderer.prototype,{
    /**
     * To modify any metadata info
     */
    preprocessFieldsMetaData:function(fieldsMetaData){
        
    },
    
    /**
     * To override default element rendering of DetailView.
     * Append html string to html for the element. This should take care of underscore bindings as well. 
     * This should return true if rendering is done here otherwise DetailView proceeds with default rendering
     */
    renderElement:function(fieldMetaData,html){
        return false;
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