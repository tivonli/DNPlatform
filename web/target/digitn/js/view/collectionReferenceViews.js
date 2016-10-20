window.CollectionReferenceView = Backbone.View.extend({
    className: "detailview-content-2",

    events: {
        'click h3': 'toggleEditContainer'
    },

    /**
     * Pass reference element field meta as argument
     */
    initialize: function() {
        this.parentEditView = this.options.parentEditView;
        this.referenceMeta = this.options.referenceMeta;
        this.id = this.parentEditView.modifiedArticleName + '_' + this.referenceMeta.name;
        //To track newly added edit views
        this.childViews = [];
        this.rendered = false;
        this.readOnly = false;
        if (this.options.readOnly) {
            this.readOnly = this.options.readOnly;
        }
    },

    render: function() {
        this.$el.append('<h3 class="title2"><div class="title2_l"><div  class="title2_r"><div class="title2_m"><div class="f_left">' + this.referenceMeta.displayName + '</div><div class="news_list_expand_icon"></div></div></div></div></h3>');
        var divElement = viewCreator.make("div", {
            "class": "detailview-content-3"
        });
        this.$el.append(divElement);

        this.containerEl = $(divElement);
        this.childViewMeta = ArticleEditMeta.getMeta(this.referenceMeta.collectionReferenceEntity);
        this.showContent();

        return this;
    },

    showContent: function() {
        if (!this.childViewMeta.editPermission) {
            this.readOnly = true;
        }

        if (!this.readOnly) {
            this.containerEl.append(new CollectionReferenceViewToolBar({
                collectionReferenceView: this
            }).render().el);
        }

        //Create div container which contains each child
        this.childViewsContainer = $(viewCreator.make("div", {
            "class": "detailview-content-3-item"
        }));
        this.containerEl.append(this.childViewsContainer);
        this.rendered = true;

    },

    add: function(modelAttributes) {

        if (this.readOnly) {
            this.addReadOnlyChildView(modelAttributes);
            return;
        }

        var model = null;
        if (modelAttributes) {
            model = new ArticleData(modelAttributes);
        } else {
            model = new ArticleData();
        }

        var formId = 'form_' + this.id + '_' + this.childViews.length;
        var childView = new EditView({
            model: model,
            articleEditMeta: this.childViewMeta,
            isNew: true,
            formId: formId,
            selectable: true
        });
        this.childViews[this.childViews.length] = childView;
        this.childViewsContainer.append(childView.render().el);
        childView.showContent();
    },

    addReadOnlyChildView: function(modelAttributes) {
        var childView = new DetailView({
            model: new ArticleData(modelAttributes),
            articleEditMeta: this.childViewMeta
        });
        this.childViewsContainer.append(childView.render().el);
        childView.showContent();
    },

    clearContent: function() {
        if (this.rendered) {
            this.childViewsContainer.empty();
            if (!this.readOnly) {
                this.childViews = [];
            }
        }
    },

    setModelData: function(modelData) {
        this.modelData = modelData;
        if (!this.rendered) {
            var self = this;
            //Wait until it is rendered
            var intervalId = setInterval(function() {
                if (self.rendered) {
                    clearInterval(intervalId);
                    self.renderChildViews();
                }
            }, 5);
        } else {
            this.renderChildViews();
        }
    },

    renderChildViews: function() {
        this.clearContent();

        if (this.modelData && this.modelData.length > 0) {
            var modelDataLength = this.modelData.length;
            for (var i = 0; i < modelDataLength; i++) {
                this.add(this.modelData[i]);
            }
            //add search in edit view tab. EditViewSearchBar is defined in application, should estimate exist or not first
            if (!this.readOnly) {
                if (typeof(EditViewSearchBar) != "undefined") {
                    if (this.$el.find(".toolBar").children().length == 2) {
                        var editViewSearch = new EditViewSearchBar({
                            colRefView: this
                        });
                        this.$el.find(".toolBar").append(editViewSearch.render().el);
                    }
                }
            }
        }
    },

    getModelData: function() {
        var modelData = [];
        if (this.childViews.length > 0) {
            var lengthOfViews = this.childViews.length;
            for (var i = 0; i < lengthOfViews; i++) {
                var childView = this.childViews[i];
                childView.setReferenceElementAttributes();
                modelData[modelData.length] = childView.model.attributes;
            }

        }
        return modelData;
    },

    /**
     * 
     * @returns false if any childView data is not valid
     */
    isValid: function() {
        var isValid = true;
        $(this.childViews).each(function(name, childView) {
            isValid = isValid && childView.isValid();
        });

        return isValid;
    },

    toggleEditContainer: function() {
        this.containerEl.toggle();
    },

    removeItems: function() {
        if (this.childViews.length > 0) {
            var lengthOfViews = this.childViews.length;
            var childViewsCopy = this.childViews.slice();
            for (var i = lengthOfViews-1; i >=0 ; i--) {
                var childView = childViewsCopy[i];
                if (childView.selected) {
                    this.childViews.splice(i, 1);
                    childView.close();
                }
            }
        }
    }

});

//To cache child edit meta in read only scenarios
CollectionReferenceView.prototype._childEditMetaCache = {};

window.CollectionReferenceViewToolBar = EditViewToolBar.extend({
    render: function() {
        this.$el.append(new CollectionReferenceAddButton({
            collectionReferenceView: this.options.collectionReferenceView
        }).render().el);
        this.$el.append(new CollectionReferenceDeleteButton({
            collectionReferenceView: this.options.collectionReferenceView
        }).render().el);
        return this;
    }
});

window.CollectionReferenceAddButton = ListTopButton.extend({
    className: 'tool_l tool_add',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: 'Add'
        });
    },

    onClick: function() {
        this.options.collectionReferenceView.add();
    }

});

window.CollectionReferenceDeleteButton = ListTopButton.extend({
    className: 'tool_l tool_del',

    initialize: function() {
        this.$el.attr({
            href: '#',
            title: 'Delete'
        });
    },

    onClick: function() {
        this.options.collectionReferenceView.removeItems();
    }
});