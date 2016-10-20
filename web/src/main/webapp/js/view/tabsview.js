window.TabsView = Backbone.View.extend({

    /**
     * Assumes the model passed is JSON
     */
    initialize: function() {
        this.tabMenuContainer = $("#tab_menu_ul");
        this.tabContentContainer = $("#tab_content");
        //This will hold the id against TabView instances
        this.idVsTabView = {};


    },

    render: function() {
        var self = this;
        $(this.model).each(function() {
            var tabContentView = new TabContentView({
                model: this
            });
            var tabView = new TabView({
                model: this,
                tabContentView: tabContentView
            });
            //Menu you see on top			
            self.tabMenuContainer.append(tabView.render().el);
            //The contents you see when you click a Tab
            self.tabContentContainer.append(tabContentView.render().el);

            //Keep track of created TabViews
            self.idVsTabView[this.id] = tabView;
        });

        //This will make mere html tags to tabs
        var renderedTabs = $("#tabs").tabs({
            selected: "1"
        });

        this.addTabsShowListener(renderedTabs);

        appView.adjustPortalLayout();

        //select the first tab by default
        renderedTabs.tabs("select", 0);

        return this;
    },

    addTabsShowListener: function(renderedTabs) {
        var self = this;
        renderedTabs.bind('tabsshow', function(event, ui) {
            if(!ui.panel){
               return; 
            }
            
            var id = ui.panel.getAttribute("data_menuid");
            if (!id) {
                //Article tabs event coming here. Bug?
                return;
            }
            var selectedTabView = self.idVsTabView[id];

            selectedTabView.showTab();

        });
    }



});


window.TabView = Backbone.View.extend({
    tagName: "li",

    /*
     * Attributes required in options:
     * tabContentViewRef Instance of TabContentView that belongs to this tab
     */
    initialize: function() {
        this.id = 'tabs_menu_li_' + this.model.id;
        this.$el.attr('id', this.id);
        this.tabShown = false;
    },

    render: function() {
        this.$el.append("<a href='#tabs_menu_content_" + this.model.id + "'><div class='top_menu_li_c'>" + this.model.name + "</div></a>");
        return this;
    },

    showTab: function() {
        if (this.tabShown) {
            //Already rendered
            return;
        }

        this.options.tabContentView.showContent();
        this.tabShown = true;

    }

});

window.TabContentView = Backbone.View.extend({

    tagName: "div",

    className: 'ui-tabs-panel ui-widget-content ui-corner-bottom',

    initialize: function() {
        this.id = 'tabs_menu_content_' + this.model.id;
        this.modelId = this.model.id;

        this.$el.attr({
            id: this.id,
            data_menuid: this.modelId
        });
    },

    renderContents: function() {
        //Center Panel which contains article tabs
        var centerTabContentView = new CenterTabContentView({
            model: this.model
        });
        //Left Navigation panel that contains article groups and names
        this.westTabContentView = new WestTabContentView({
            model: this.model,
            centerTabContentView: centerTabContentView
        });
        this.$el.append(this.westTabContentView.render().el);

        this.$el.append(centerTabContentView.render().el);
    },

    showContent: function() {
        if (!this.rendered) {
            this.renderContents();
            this.initilizeLayoutSetting();
        }
        this.westTabContentView.showContent();
    },

    initilizeLayoutSetting: function() {
        // layout setting started
        //this layout is for creating the split pane where the left side is the article navigation list and the right side is the article tab panel
        this.$el.layout({
            //	enable showOverflow on west-pane so CSS popups will overlap north pane
            west__showOverflowOnHover: true,
            resizeWithWindow: false,
            closable: true // pane can open & close
            ,
            resizable: true // when open, pane can be resized
            ,
            spacing_open: 8,
            spacing_closed: 8
            //	we have west and center only. rest all are hidden
            ,
            north__initHidden: true,
            south__initHidden: true,
            east__initHidden: true
            //	some pane-size settings
            ,
            west__minSize: .12,
            west__size: .12,
            west__maxSize: .25,
            center__maxWidth: .85,
            showErrorMessages: false,
            slidable: false
        });
    }
});

window.WestTabContentView = Backbone.View.extend({

    tagName: "div",
    className: 'ui-layout-west',

    /*
     * Attributes required in options:
     *  centerTabContentView reference to CenterTabContentView
     */
    initialize: function() {
        this.modelId = this.model.id;
        this.id = 'ui_layout_west_tab_content_' + this.modelId;
        this.articleTypeWrapperId = 'acticleType_wrapper_' + this.modelId;


        this.$el.attr({
            id: this.id,
            style: 'overflow:hidden;'
        });
    },

    render: function() {

        this.$el.append('<div id=' + this.articleTypeWrapperId + ' class="leftNavigation"></div>');
        return this;
    },

    showContent: function() {
        //Fetch groups. Is it ok to make ajax call here?
        appView.tabs.fetchChildren({
            parentGroup: this.modelId,
            subMenuFromWay: this.model.subMenuFromWay,
            success: this.addArticleTypeGroups,
            failure: undefined,
            callBackContext: this
        });
    },

    addArticleTypeGroups: function(groupData) {
        var self = this;
        this.articleTypeWrapperEl = $('#' + this.articleTypeWrapperId);
        $(groupData).each(function() {
            //and we have a magic string here!
            if (this.type == 'NAVIGATOR') {
                new ArticleGroupView({
                    model: this,
                    westTabContentView: self
                }).render();
            }
        });

        //Make it accordian
        this.articleTypeWrapperEl.accordion({
            fillSpace: true
        });
    }


});

window.CenterTabContentView = Backbone.View.extend({

    tagName: "div",
    className: 'ui-layout-center variable-width-article-tab',


    initialize: function() {
        this.modelId = this.model.id;
        this.id = 'ui_layout_east_tab_content_' + this.modelId;

        this.$el.attr({
            id: this.id,
            style: 'overflow:hidden;width:auto;'
        });
    },

    render: function() {
        this.articleTabsView = new ArticleTabsView({
            model: this.model
        });
        this.$el.append(this.articleTabsView.render().el);
        return this;
    }
});