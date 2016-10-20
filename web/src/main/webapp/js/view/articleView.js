/**
 * Container of tabs you see when you click on left side navigation links
 */
window.ArticleTabsView = Backbone.View.extend({
    tagName: "div",

    initialize: function() {
        //Indicates if the first tab is added or not
        this.tabsRendered = false;

        this.$el.attr('id', 'article_tab_' + this.model.id);

        //Maintain ArticleTabContent vs id
        this.idVsArticleContents = {};

        window.ArticleTabsView.prototype._idVsTabsView[this.model.id] = this;
    },

    render: function() {
        return this;
    },

    /**
     * In case of reference view model is passed separately
     */
    showArticleTab: function(articleSummaryView, summaryModel) {
        var articleSummaryModel = summaryModel ? summaryModel : articleSummaryView.model;

        if (!this.tabsRendered) {
            this.renderTabs(articleSummaryView, articleSummaryModel);
            return;
        }

        var articleTabContentView = this.idVsArticleContents[articleSummaryModel.id];
        var articleTabContentId = 'article_tab_content' + articleSummaryModel.id;

        if (!articleTabContentView) {
            var articleTabContentViewEl = TemplateFactory.make(this.getTemplateName(articleSummaryModel));
            this.$el.append(articleTabContentViewEl);
            var options = {
                el: articleTabContentViewEl,
                id: articleTabContentId,
                model: articleSummaryModel,
                articleSummaryView: articleSummaryView
            };
            articleTabContentView = this.getArticleTabContentView(options);
            articleTabContentView.render();
            //Keep track of tab content views. We use this to highlight lef navigation links when article tab is shown
            this.idVsArticleContents[articleSummaryModel.id] = articleTabContentView;
            this.articleTabs.tabs("add", "#" + articleTabContentId, articleSummaryModel.name);
        } else {

            if (articleTabContentView.isReferenceView) {
                //Refresh reference list view 
                articleTabContentView.topContentView.listView.refreshReferenceData(summaryModel.referenceId);
            }
            this.articleTabs.tabs("select", articleTabContentId);


        }

    },

    getArticleTabContentView: function(options) {
        //Check for custom view
        var articleTabContentView = ArticleTabContentView.getView(options.model.remark, options);
        if (!articleTabContentView) {
            articleTabContentView = new ArticleTabContentView(options);
        }
        return articleTabContentView;
    },

    getTemplateName: function(articleSummary) {
        if (articleSummary.layoutTemplate) {
            return articleSummary.layoutTemplate;
        } else {
            //Default layout
            return 'articleTabVerticalLayout';
        }

    },

    renderTabs: function(articleSummaryView, summaryModel) {
        //Add tab menu container
        var articleTabMenuContainerId = 'article_tab_menu_container' + this.model.id;
        this.$el.append("<ul class='listview-tab' id='" + articleTabMenuContainerId + "'></ul>");
        this.articleTabMenuContainer = $('#' + articleTabMenuContainerId);

        var articleTabContentId = 'article_tab_content' + summaryModel.id;

        //We can not use Backbone views here for menu content because we will be adding tabs dynamically and
        //jquery tabs menu content html through template
        this.articleTabMenuContainer.append("<li><a href='#" + articleTabContentId + "'>" + summaryModel.name + "</a><span class='ui-icon ui-icon-close ui-icon-close-position'></span></li>");

        //Add tab content
        var articleTabContentViewEl = TemplateFactory.make(this.getTemplateName(summaryModel));
        this.$el.append(articleTabContentViewEl);
        var articleTabContentView = this.getArticleTabContentView({
            el: articleTabContentViewEl,
            id: articleTabContentId,
            model: summaryModel,
            articleSummaryView: articleSummaryView
        });

        articleTabContentView.render();

        //Keep track of tab content views
        this.idVsArticleContents[summaryModel.id] = articleTabContentView;

        var self = this;
        this.articleTabs = this.$el.tabs({
            tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close ui-icon-close-position'></span></li>",
            add: function(event, ui) {
                //Select dynamicaly added tab
                self.articleTabs.tabs("select", ui.panel.id);
            },

            show: function(event, ui) {

                var id = ui.panel.getAttribute("modelId");

                var selectedTabContentView = self.idVsArticleContents[id];
                if (!selectedTabContentView.layout) {
                    self.layoutContent(selectedTabContentView);
                }

                event.stopPropagation();

            },

            select: function(event, ui) {
                var id = ui.panel.getAttribute("modelId");

                var selectedTabContentView = self.idVsArticleContents[id];
                if (selectedTabContentView.options.articleSummaryView) {
                    selectedTabContentView.options.articleSummaryView.selectSummary();
                }

                //here is support the refresh the reference view data.
                if (selectedTabContentView.fullContentView) {
                    selectedTabContentView.fullContentView.refreshReferenceView();
                }

            }
        });


        //Add close listener
        $("div#article_tab_" + this.model.id + " span.ui-icon-close").live("click", function() {
            var index = $("li", self.articleTabs).index($(this).parent());
            if (self.$el.tabs("length") > 1) {
                self.articleTabs.tabs("remove", index);
            }
        });

        //Add remove listener to clean up any data we are holding related to closed tab
        this.articleTabs.bind('tabsremove', function(event, ui) {
            var id = ui.panel.getAttribute("modelId");
            self.idVsArticleContents[id] = undefined;
        });

        appView.adjustPortalLayout();

        this.tabsRendered = true;

    },

    layoutContent: function(selectedTabContentView) {
        var tabMenuContainerHeight = this.articleTabMenuContainer.height();
        var parentHeight = this.$el.parent().parent().height();
        selectedTabContentView.layoutContent(tabMenuContainerHeight, parentHeight);
    }


});

//Cache of ArticleTabsView model id vs ArticleTabsView
window.ArticleTabsView.prototype._idVsTabsView = {};

/**
 * Tab which contains containers of list and edit view.
 */
window.ArticleTabContentView = Backbone.DigitNexusView.extend({
    initialize: function() {
        this.$el.attr({
            modelId: this.model.id,
            id: this.id
        });
        this.articleType = this.model.content;
        //Indicate whether layout happened
        this.layout = false;
        this.isReferenceView = false;
        if (this.model.referenceId) {
            this.isReferenceView = true;
        }
    },

    render: function() {

        this.innerContainerDiv = $(this.$el.find('.inner-container')[0]);
        this.$el.append(this.innerContainerDiv);

        //need to separate the topContent view, bottomContent view, fullContent view
        if (this.checkFullContentView(this.articleType)) {

            this.fullContentView = new ArticleTabFullContentView({
                model: this.model,
                parentView: this
            });
            this.innerContainerDiv.append(this.fullContentView.render().el);
        } else {
            this.topContentView = this.getTopContentView({
                el: this.innerContainerDiv.find('.list-view')[0],
                model: this.model,
                parentView: this
            }).render();            
            this.bottomContentView = this.getBottomContentView({
                el: this.innerContainerDiv.find('.detail-and-edit-view')[0],
                model: this.model,
                parentView: this
            }).render();
        }

        return this;
    },

    getTopContentView: function(options) {
        var topContentView = ArticleTabTopContentView.getView(options.model.remark, options);
        if (!topContentView) {
            topContentView = new ArticleTabTopContentView(options);
        }
        return topContentView

    },

    getBottomContentView: function(options) {
        var bottomContentView = ArticleTabBottomContentView.getView(options.model.remark, options);
        if (!bottomContentView) {
            bottomContentView = new ArticleTabBottomContentView(options);
        }
        return bottomContentView

    },

    layoutContent: function(tabMenuContainerHeight, parentHeight) {

        this.$el.height(parentHeight - tabMenuContainerHeight);
        this.innerContainerDiv.height(parentHeight - tabMenuContainerHeight);
        var self = this;
        //need to separate the topContent view, bottomContent view, fullContent view
        if (this.checkFullContentView(this.articleType)) {
            this.innerContainerDiv.layout({
                center__paneSelector: '#' + this.fullContentView.id,
                initHidden: true,
                resizable: false,
                slidable: false,
                closable: false,
                center__size: 300,
                center__minHeight: 50,
                showErrorMessages: false
            });
        } else {
            var layoutOptions = {
                spacing_open: 8,
                // ALL panes
                spacing_closed: 12,
                // ALL panes
                showErrorMessages: false,
                onopen_end: function() {
                    self.resize();
                },
                onclose_end: function() {
                    self.resize();
                },
                onresize: function() {
                    self.resize();
                },

                slidable: false
            };

            if (this.innerContainerDiv.find('.ui-layout-north').length > 0) {
                layoutOptions.north__size = .55;
                layoutOptions.north__maxSize = .90;
            } else if (this.innerContainerDiv.find('.ui-layout-west').length > 0) {
                layoutOptions.west__size = .40;
                layoutOptions.west__maxSize = .90;
            }
            
            this.innerContainerDiv.layout(layoutOptions);
            this.resize();
        }

        //need to separate the topContent view, bottomContent view, fullContent view
        if (this.checkFullContentView(this.articleType)) {
            this.fullContentView.layoutContent();
        }else{
        	//here is set the request back end data equal true,
        	//so the list view will request data form back end through the Ajax request.
        	this.topContentView.listView.canRequestBackendData=true;
        }
        this.layout = true;


    },

    resize: function() {

        //need to separate the topContent view , bottomContent view, fullContent view
        if (this.checkFullContentView(this.articleType)) {

            this.fullContentView.resize();
        } else {
            this.topContentView.resize();
            this.bottomContentView.resize();
        }
    },

    checkFullContentView: function(articleType) {
        var flag = (articleType === 'NEWSVIEW' || articleType === 'MASHUPEDITORVIEW' || articleType === 'CHARTVIEW' || articleType === 'TABLEVIEW' || articleType === 'MAPVIEW' || articleType === "MAP");
        return flag;
    }
});

window.ArticleTabFullContentView = Backbone.View.extend({
    tagName: 'div',
    className: 'main-content-panel1-center',

    initialize: function() {

        this.id = 'article_tab_full_content_' + this.model.id;
        this.$el.attr({
            id: this.id,
            style: 'overflow:hidden;width:auto;'
        });
    },

    render: function() {

        var self = this;
        var articleType = this.model.content;
        this.articleListId = 'article_tab_list_content_' + this.model.id;
        var articleListContentDiv = viewCreator.make("div", {
            "id": this.articleListId,
            "style": "overflow:hidden;padding:0;width:auto;border:0;"
        });
        this.$el.append(articleListContentDiv);
        this.articleListContentEl = $(articleListContentDiv);

        switch (articleType) {
        case 'NEWSVIEW':
            this.contentView = new NewsView({
                article: this.model,
                parentView: this
            });
            break;
        case 'CHARTVIEW':
            this.contentView = new ReportView({
                parentId: this.articleListId,
                article: this.model.remark,
                type: articleType
            });
            break;
        case 'MAP':
            this.contentView = new MapView({
                article: this.model,
                parentView: this
            });

            break;
        }

        if (this.contentView) {
            this.articleListContentEl.append(this.contentView.render().el);
        }

        return this;
    },

    layoutContent: function() {
        this.$el.layout({
            center__paneSelector: '#' + this.articleListId,
            resizable: false,
            slidable: false,
            closable: false,
            center__size: 300,
            center__minHeight: 50,
            showErrorMessages: false
        });
        // mapview need this function please do not comment
        this.resize();
    },

    resize: function() {
        if (this.contentView) {
            this.contentView.resize();
        }
    },
    //to refresh the referenceView the data..
    refreshReferenceView: function() {
        if (this.contentView && jQuery.isFunction(this.contentView.refreshReferenceView)) {
            this.contentView.refreshReferenceView();
        }
    }
});

window.ArticleTabTopContentView = Backbone.DigitNexusView.extend({

    initialize: function() {
        this.id = 'article_tab_top_content_' + this.model.id;
        this.$el.attr({
            id: this.id,
            style: 'overflow:hidden;width:100%;clear:both;'
        });
    },

    render: function() {
        var articleType = this.model.content;
        if (articleType === 'LISTVIEW') {
            var listViewEl = viewCreator.make('table');
            this.$el.append(listViewEl);
            this.listView = this.getListView({
                el: listViewEl,
                model: this.model,
                parentView: this,
                footerInfo: true,
                createListTop: true,
                atOnceGetBackendData: false
            });
            this.listView.render();
        }
        return this;
    },

    getListView: function(options) {
        var listView = ListView.getView(options.model.remark, options);
        if (!listView) {
            listView = new ListView(options);
        }
        return listView;
    },

    resize: function() {
        if (this.listView) {
            this.listView.resize();
        }
    }

});

window.ArticleTabBottomContentView = Backbone.DigitNexusView.extend({

    initialize: function() {
        this.id = 'article_tab_bottom_content_' + this.model.id;
        this.$el.attr('id', this.id);

        if (this.model.content === 'LISTVIEW') {
            this.editAndDetailViewRendered = false;
            this.defaultArticleName = this.model.remark;
            //Check if the edit view configurations contains flex fields
            var editViewMeta = null;
            if (typeof this.model.referArticleName != 'undefined') {
                editViewMeta = ArticleEditMeta.getMetaWidthParentArticle(this.defaultArticleName, this.model.referArticleName);
                this.defaultArticleName = editViewMeta.name;
            } else {
                editViewMeta = ArticleEditMeta.getMeta(this.defaultArticleName);
            }
            if (editViewMeta.flexFieldsProperty) {
                this.containsFlexConfig = true;
                //Maintain map of descriminator vs artilce name. For default article name
                //descirminator value will be null in that case use default article name
                this.flexConfigsCache = {};
                var flexConfigMetas = editViewMeta.flexConfigMetas;
                for (var i = 0; i < flexConfigMetas.length; i++) {
                    var flexConfigMeta = flexConfigMetas[i];
                    if (flexConfigMeta.configDescriminator) {
                        this.flexConfigsCache[flexConfigMeta.configDescriminator] = flexConfigMeta.name;
                    }
                }

                //Cache edit and detail view per config
                this.editAndDetailViewCache = {};
            }

        }

        this.topContentView = this.options.parentView.topContentView;

    },

    render: function() {
    	var self = this;
    	this.isDialogView = false;    	
    	if(this.$el.hasClass("ui-layout-dialog")){
    		this.isDialogView = true;
    		this.editAndDetailViewDialog = this.$el.wijdialog({
             	captionButtons: {
             		pin: { visible: false },
             		refresh: { visible: false },
             		toggle: { visible: false },
             		minimize: { visible: false }
             	},
             	 autoOpen:false,
                 show: "blind",
                 width: "900",
                 height: "350",                
                 modal: true,   
                 resize: function() {                     
                     self.resize();
                 }
             });      		
    	}
    	
    	
        if (this.model.content === 'LISTVIEW') {            
            //Make sure topContentView's render is called before this
            
            if(self.isDialogView){
            	  this.topContentView.listView.$el.bind('articleList-dbselection', function(selectionEvent) {
                      self.onArticleSelection(selectionEvent);
                      
                      if(self.isDialogView){
                      	self.editAndDetailViewDialog.wijdialog("open");
                      	self.resize();
                      }
                      
                  });
            }else{
                this.topContentView.listView.$el.bind('articleList-selection', function(selectionEvent) {
                    self.onArticleSelection(selectionEvent);
                    
                });
            }
        }             
        
        return this;
    },

    onArticleSelection: function(selectionEvent) {
        var articleId = selectionEvent.selectedId;
        if (!this.editAndDetailViewRendered) {
            if (articleId === -1) {
                //This is just refresh without any select. Ignore it
                return;
            }

            if (this.containsFlexConfig) {
                this.renderFlexEditAndDetailView(articleId, selectionEvent.flexConfigName);
            } else {
                this.renderEditAndDetailView(articleId, this.defaultArticleName);
            }

            this.editAndDetailViewRendered = true;
            this.resize();
            return;
        }

        if (this.containsFlexConfig && articleId != -1) {
            var articleName = this.getArticleName(selectionEvent.flexConfigName);
            var relatedEditAndDetailView = this.editAndDetailViewCache[digitnexus.modifiedArticleName(articleName)];
            if (relatedEditAndDetailView == null) {
                //Hide existing views
                this.changeDisplayAndVisibility();
                this.renderFlexEditAndDetailView(articleId, selectionEvent.flexConfigName);
                this.resize();
            } else if (relatedEditAndDetailView != this.editAndDetailView) {
                this.changeDisplayAndVisibility(relatedEditAndDetailView);
                this.editAndDetailView = relatedEditAndDetailView;
                this.resize();
            }
        }

        this.editAndDetailView.onArticleSelection(articleId);

    },

    changeDisplayAndVisibility: function(activeEditAndDetailView) {
        for (var name in this.editAndDetailViewCache) {
            var editAndDetialView = this.editAndDetailViewCache[name];
            if (editAndDetialView != activeEditAndDetailView) {
                editAndDetialView.changeVisibility(false);
                editAndDetialView.displayNone(true);
            }
        }

        if (activeEditAndDetailView) {
            activeEditAndDetailView.displayNone(false);

        }
    },

    renderEditAndDetailView: function(articleId, articleName) {
        var editAndDetailViewEl = viewCreator.make('div');
        this.$el.append(editAndDetailViewEl);
        this.editAndDetailView = new EditAndDetailView({
            el: editAndDetailViewEl,
            articleName: articleName,
            articleId: articleId,
            listView: this.options.parentView.topContentView.listView,
            parentView: this
        });
        this.editAndDetailView.render();
    },

    renderFlexEditAndDetailView: function(articleId, descriminatorValue) {
        var articleName = this.getArticleName(descriminatorValue);
        this.renderEditAndDetailView(articleId, articleName);
        this.editAndDetailViewCache[digitnexus.modifiedArticleName(articleName)] = this.editAndDetailView;
    },

    getArticleName: function(descriminatorValue) {
        if (descriminatorValue) {
            return this.flexConfigsCache[descriminatorValue];
        } else {
            return this.defaultArticleName;
        }
    },

    resize: function() {
        if (this.editAndDetailView) {
            this.editAndDetailView.resize();
        }
    }

});