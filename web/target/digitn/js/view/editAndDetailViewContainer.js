window.EditAndDetailView = Backbone.View.extend({
    /**
     * Initial selected data id should be passed as articleId
     */
    initialize: function() {

        this.$el.attr('style', 'overflow:hidden;width:auto;height:100%;');
        this.modifiedArticleName = digitnexus.modifiedArticleName(this.options.articleName);
        this.articleEditMeta = ArticleEditMeta.getMeta(this.options.articleName);
        this.articleData = new ArticleData(null, {
            remark: this.options.articleName
        });
        this.rendered = false;
        this.articleId = this.options.articleId;
        this.visible = true;
    },

    render: function() {

        var detailTabId = 'tab_detail_' + this.modifiedArticleName;
        var editTabId = 'tab_edit_' + this.modifiedArticleName;

        var tabMenuHtml = "<ul class='detailview-tab'><li><a href='#" + detailTabId + "'>" + label_detail + "</a></li>";

        if (this.articleEditMeta.editPermission === false || this.articleEditMeta.readOnly) {
            //No point in adding detail tab
            tabMenuHtml += "</ul>";
        } else {
            tabMenuHtml += "<li><a href='#" + editTabId + "'>" + label_Edit + "</a></li></ul>";
        }

        this.$el.append(tabMenuHtml);
        
        var detailViewEl=viewCreator.make('div',{"class":"detailview-tab-content"});
        this.$el.append(detailViewEl);
        this.detailView = this.getDetailView({
            el:detailViewEl,
            id: detailTabId,
            model: this.articleData,
            articleEditMeta: this.articleEditMeta
        });
         this.detailView.render();

        if (this.articleEditMeta.editPermission === true && !this.articleEditMeta.readOnly) {
            //Render editview only when the edit view tab is visible. If edit view is rendered before,
            //tab is visible, there will be lot of sizing issues
            this.editViewEl = $(viewCreator.make('div', {
                'id': editTabId,'class':'editview-tab-content'
            }));
            this.editViewRendered = false;
            this.$el.append(this.editViewEl);
        }
        var self = this;
        this.$el.tabs({
            selected: 0,
            show: function(event, ui) {
                if (ui.index == 1 && self.editViewEl && !self.editViewRendered) {
                    self.renderEditView();
                }
                event.stopPropagation();
            }
        })

        if (this.editViewEl) {
            //Tab element ul> 2nd li
            this.editViewTab = $($(this.$el.children()[0]).children()[1]);
        }
        //Set id explicitly to model as our urls can not be strictly rest as required by backbone
        this.articleData.id = this.options.articleId;
        this.fetchArticleData(this.articleData.id);

        return this;
    },
    
    getDetailView:function(options){
        var detailView=DetailView.getView(this.options.articleName,options);
        if(!detailView){
            detailView=new DetailView(options);
        }
        return detailView;
    },
    
    getEditViewContainer:function(options){
        var editViewContainer=EditViewContainer.getView(this.options.articleName,options);
        if(!editViewContainer){
            editViewContainer=new EditViewContainer(options);
        }
        return editViewContainer; 
    },

    renderEditView: function() {
        this.editViewContainer = this.getEditViewContainer({
            el: this.editViewEl,
            model: this.articleData,
            articleEditMeta: this.articleEditMeta,
            editAndDetailView: this
        }).render();
        this.editViewContainer.onArticleSelection(this.articleData.id );
        this.editViewRendered = true;
    },

    fetchArticleData: function(articleId) {
        var self = this;
        //here is add the success function to support bind the signature event..so... modify by bill
        this.articleData.fetch({
            id: articleId,
            data: {
                id: articleId
            },
            success: function() {
                if (self.editViewTab) {
                    if (self.articleData.attributes._readOnly) {
                        if (self.editViewTab.is(":visible")) {
                            self.$el.tabs("option", "selected", 0);
                            self.editViewTab.hide();
                        }
                    } else if (!self.editViewTab.is(":visible")) {
                        self.editViewTab.show();
                    }

                }


                self.detailView.bindSignatureEvent();
                if (self.articleEditMeta.comments === true) {
                    self.detailView.bindCommentsEvent();
                }
            }
        });
    },

    onArticleSelection: function(articleId) {
        if (articleId === -1) {
            //when list view is refreshed
            if (this.visible) {
                this.changeVisibility(false);
            }

            return;
        }
        if (!this.visible) {
            this.changeVisibility(true);
        }
        //Detail and edit view are bound to model change
        //This is hack to make save and fetch work using backbone model. See save method in EditView
        //here is add the success function to support bind the signature event..so... modify by bill
        //Set id explicitly to model as our urls can not be strictly rest as required by backbone
        this.articleData.id = articleId;
        this.fetchArticleData(this.articleData.id);
        this.detailView.onArticleSelection(articleId);
        if (this.editViewContainer) {
            this.editViewContainer.onArticleSelection(articleId);
        }
    },
    refreshDetailView: function() {
        var self = this;
        var articleId = this.articleData.id;
        this.articleData.fetch({
            data: {
                id: articleId
            },
            success: function() {
                self.detailView.bindSignatureEvent();
                if (self.articleEditMeta.comments === true) {
                    self.detailView.bindCommentsEvent();
                }
                self.detailView.onArticleSelection(articleId);
                self.detailView.showContent();
            }
        });
    },
    changeVisibility: function(visible) {
        if (visible) {
            this.$el.css("visibility", "visible");
        } else {
            this.$el.css("visibility", "hidden");
        }
        this.visible = visible;
    },

    resize: function() {
        if (this.detailView) {
            this.detailView.resize();
        }

        if (this.editViewContainer) {
            this.editViewContainer.resize();
        }
    },

    displayNone: function(displayNone) {
        if (displayNone) {
            this.$el.css('display', 'none');
        } else {
            this.$el.css('display', 'block');
        }
    }
});


window.EditViewContainer = Backbone.DigitNexusView.extend({
    className: 'editview-tab-content',

    initialize: function() {
        this.rendered = false;
        this.modifiedArticleName = digitnexus.modifiedArticleName(this.options.articleEditMeta.name);
        this.editAndDetailView = this.options.editAndDetailView;
        if (!this.editAndDetailView) {
            //When new dialog is opened
            this.listView = this.options.listView;
        } else {
            this.listView = this.editAndDetailView.options.listView;
        }

    },

    render: function() {
        var editViewToolBarEl=viewCreator.make('div',{"class":"toolBar"});
        this.$el.append(editViewToolBarEl);
        
        var editViewEl=viewCreator.make('div');
        this.$el.append(editViewEl);
        
        this.editView = this.getEditView({
            el:editViewEl,
            model: this.model,
            articleEditMeta: this.options.articleEditMeta,
            editViewContainer: this,
            isNew: this.options.isNew,
            listView:this.listView
        });
        this.editViewToolBar = this.getEditViewToolBar({
            el:editViewToolBarEl,
            model: this.model,
            editViewContainer: this,
            isNew: this.options.isNew
        });
	    
        this.editViewToolBar.render();
        this.editView.render();
        
        return this
    },
    
    getEditView:function(options){
       var editView =EditView.getView(options.articleEditMeta.name,options);
       if(!editView){
          editView=new EditView(options); 
       }
       return editView;
    },
    
    getEditViewToolBar:function(options){
       var editViewToolBar=EditViewToolBar.getView(this.options.articleEditMeta.name,options); 
       if(!editViewToolBar){
           editViewToolBar=new EditViewToolBar(options);
       }
       return editViewToolBar;
    },

    onArticleSelection: function(articleId) {
        if(!this.editView.rendered){
           this.editView.showContent(); 
        }else{
           this.editView.onArticleSelection(articleId); 
        }
    },

    changeVisibility: function(visible) {
        if (this.editAndDetailView) {
            this.editAndDetailView.changeVisibility(visible);
        }
    },

    refreshListView: function(isFresh) {
        //after save the editView,refresh the detailView
     
        if (this.editAndDetailView) {
            this.editAndDetailView.refreshDetailView();
        }
        
        this.listView.refresh(isFresh);
        
    },

    resize: function() {
        this.editView.resize();
    }
});