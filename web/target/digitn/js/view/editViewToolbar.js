window.EditViewToolBar = Backbone.DigitNexusView.extend({
    className: "toolBar",

    render: function() {
        this.renderSaveButton();
        this.renderResetButton();
        this.renderAdditionalButtons();
        return this;
    },
    
    /**
     * This is for sub classes to override to provide additonal buttons
     */
    renderAdditionalButtons:function(){
        
    },

    renderSaveButton: function() {
        this.$el.append(new SaveEditViewButton({
            editViewContainer: this.options.editViewContainer
        }).render().el);
    },

    renderResetButton: function() {
        if (this.options.isNew) {
            this.$el.append(new ResetEditViewButton({
                editViewContainer: this.options.editViewContainer
            }).render().el);
        }
    }
});

window.EditViewButton = Backbone.View.extend({
    tagName: "a",
    className: 'tool_r btn_1',
    events: {
        'click': 'onClick'
    },

    initialize: function() {
        this.$el.attr('href', '#');
    },

    render: function() {
        var span = new Backbone.View;
        var spanElement = span.make("span");
        this.$el.append(spanElement);

        var contentDiv = new Backbone.View;
        var spanJqueryObj = $(spanElement);
        spanJqueryObj.append(contentDiv.make("div", {
            "class": "btn_icon3 icon_save"
        }));
        spanJqueryObj.append(this.getLabel());
        return this;
    },

    getLabel: function() {
        return "";
    },

    onClick: function() {

    }
});

window.SaveEditViewButton = EditViewButton.extend({
    onClick: function() {
        appView.buttonBlocker.block(this.$el);
        var saveFlag = this.options.editViewContainer.editView.save();
        if(saveFlag===false){
        	this.$el.addClass("error");
        	this.$el.attr("title",error_required);
        }else{
        	this.$el.removeClass("error");
        	this.$el.removeAttr("title");
        }
    },

    getLabel: function() {
        return label_save;
    }
});

window.ResetEditViewButton = EditViewButton.extend({
    onClick: function() {
        this.options.editViewContainer.editView.resetForm();
    },

    getLabel: function() {
        return label_reset;
    }
});