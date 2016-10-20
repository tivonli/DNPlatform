/**
 * 
 */
window.NewsTopToolView = Backbone.View.extend({
	tagName : 'div',
	className : 'toolBar',
	initialize : function(){
		this.parentView = this.options.parentView;
		this.model = this.options.model;
		this.listParentView = this.options.listParentView;
	},
	render : function(){
		this.searchView=new NewsSearchView({typeData:this.parentView.NewsTypeData});
		this.parentView.append(this.searchView.render().el);
		this.parentView.append(viewCreator.make("div",{"class":"blank_line"}));
		
		this.addButton = new NewsAddButton({panel:this.listParentView});
		this.$el.append(new CheckAllView({parentView:this.listParentView}).render().el);
		this.$el.append(this.addButton.render().el);
		this.$el.append(new NewsDelButton({model:this.model,panel:this.listParentView}).render().el);
		this.$el.append(new NewsRefreshButton({model:this.model,panel:this.listParentView}).render().el);
		this.$el.append(new NewsSearchButton({panel:this.parentView,searchView:this.searchView}).render().el);
		
		return this;
	}
});

window.CheckAllView = Backbone.View.extend({
	tagName : 'div',
	className : 'toolBar_checkAll',
	initialize : function(){
		this.parentView = this.options.parentView;
	},
	render : function(){
		var checkAllBox = viewCreator.make("input",{'id':this.parentView.id+"_check_all",'type':'checkbox','name':'check_all'});
		this.$el.append(checkAllBox);
		this.$el.append(viewCreator.make("font",{},label_news_check_all));
		var checkboxJqueryObj = $(checkAllBox);
		this.bindCheckAllEvent(checkboxJqueryObj);
		return this;
	},
	bindCheckAllEvent : function(checkBoxJqueryObj){
		var self = this;
		checkBoxJqueryObj.click(function(){
			self.parentView.checkAllNews(this.checked);
		});
	}
});

window.NewsAddButton = ListTopButton.extend({
	className:'tool_l tool_add',
	initialize : function(){
		this.newsContentView = this.options.panel;
		this.$el.attr({
			href:'#',
			title:label_add
		});
		this.dialog = null;
		this.newsEditViewContainer = null;
	},
	onClick : function(){
		/*if(this.dialog != null){
			$(this.dialog).parent().empty();
			this.dialog == null;
		}*/
		if(this.dialog == null){
			var self = this;
			self.dialog = $(viewCreator.make("div",{"id":"newsAddContainerId","class":"popupBox1","title":label_add,"style":"padding:5px 5px 5px;"}));
			self.newsEditViewContainer = new NewsEditViewContainer({summy:self.newsContentView});
			self.dialog.append(self.newsEditViewContainer.render().el);
			
			self.dialog.dialog({
				show: "blind",
				width: 1000,
				modal: true,
				close:function(event, ui){
					var isSaveDataWithAddNewsView = self.newsEditViewContainer.isSaveDataWithAddNewsView();
					if(!isSaveDataWithAddNewsView){
						self.newsEditViewContainer.reset();
					}
				}
			});
			self.dialog.height(self.newsEditViewContainer.$el.outerHeight(true)+50);
			self.newsEditViewContainer.setSaveSuccessCallBack(function(){
				if(self.dialog.dialog("isOpen")){
					self.dialog.dialog("close");
				}
			});
			self.newsEditViewContainer.showContent();
		}else{
			this.dialog.dialog("open");
			if(this.newsEditViewContainer){
				this.newsEditViewContainer.resetAddDialog();
			}
		}
	}
});

window.NewsDelButton = ListTopButton.extend({
	className : 'tool_l tool_del',
	initialize : function(){
		this.newsContentView = this.options.panel;
		this.deleteData = new NewsListDeleteData();
		this.model = this.options.model;
		this.$el.attr({
			href:'#',
			title:label_delete
		});
	},
	onClick : function(){
		var ids = this.newsContentView.getSelectedIds();
		var self=this;
		this.ids = ids;
		if(ids != null&&ids.length > 0){
			if (!this.deleteConfirm) {
                this.deleteConfirm = $(viewCreator.make("div", null, label_delete_confirm));
                this.deleteConfirmButtons = {};
                this.deleteConfirmButtons[label_ok] = function() {
                	var encodedIds='';
    				for(var i=0;i<self.ids.length;i++){
    					encodedIds += "newsId="+encodeURIComponent(self.ids[i]) + "&";
    				}
    				_self = self;
    				self.deleteData.fetch({
    					newsId: encodedIds,
    					success : function(data) {
    						_self.newsContentView.refreshNewsList();
    						_self.deleteConfirm.dialog("close");
    						AppView._showMessage(label_news_delete_success,"success");
    					},
    					failure:function(xhr,status,exception){
    						_self.deleteConfirm.dialog("close");
    						AppView._showMessage(xhr.statusText,"error");
    					},
    					callBackContext:this
    				});
    				//Move this to model, go to the backend delete this column
                };

                this.deleteConfirmButtons[label_cancel] = function() {
                    self.deleteConfirm.dialog("close");
                };

            }

            this.deleteConfirm.dialog({
                modal: true,
                buttons: this.deleteConfirmButtons
            });
		}else{
			AppView._showMessage(label_delete_alert,"error");
			return;
		}
	}
});

window.NewsRefreshButton = ListTopButton.extend({
	className:'tool_l tool_refresh',
	initialize:function(){
		this.model = this.options.model;
		this.newsContentView = this.options.panel;
		this.$el.attr({
			href:'#',
			title:label_refresh
		});
	},
	onClick:function(){
		this.newsContentView.paginatedViewCurrentPage = this.newsContentView.paginatedView.currentPage;
		this.newsContentView.refreshNewsList();
	}
});

window.NewsSaveEditViewButton = EditViewButton.extend({
	render:function(){
		var span=new Backbone.View;
		var spanElement=span.make("span");
		this.$el.append(spanElement);
		var contentDiv=new Backbone.View;
		var spanJqueryObj=$(spanElement);
		spanJqueryObj.append(contentDiv.make("div",{"class":"btn_icon3 icon_save"}));
		spanJqueryObj.append(label_save);
		return this;
	},
	onClick:function(){
		this.options.parentView.save();
	}
});

window.NewsResetEditViewButton = EditViewButton.extend({
	render:function(){
		var span=new Backbone.View;
		var spanElement=span.make("span");
		this.$el.append(spanElement);
		
		var contentDiv=new Backbone.View;
		var spanJqueryObj=$(spanElement);
		spanJqueryObj.append(contentDiv.make("div",{"class":"btn_icon3 icon_reset"}));
		spanJqueryObj.append(label_reset);
		return this;
	},
	onClick:function(){
		this.options.parentView.reset();
	}
});

window.NewsSearchButton = ListTopButton.extend({
	className: 'tool_r btn_1',
    initialize: function() {
        this.$el.attr("href", "#");
        this.expand = false;
        this.searchView = this.options.searchView;
    },
    render : function(){
    	this.spanEl = $(viewCreator.make("span"));
        this.spanEl.append(viewCreator.make("div", {
            "class": "btn_icon3 icon_search2"
        }));
        this.spanEl.append(label_search);
        this.$el.append(this.spanEl);
        return this;
    },
	onClick : function(){
		this.searchView.showContent(this.expand);
		this.toggleSearchLabel();
	},
	setLabel:function(label){
		this.spanEl.text(label);
	},
	toggleSearchLabel : function(){
		if (this.expand) {
			this.setLabel(label_search);
			this.expand = false;
        } else {
        	this.setLabel(label_closeSearch);
            this.expand = true;
        }
	}
});

window.NewsSearchView = Backbone.View.extend({
	tagName: "div",
    className: 'searchBar',
    initialize : function(){
    	this.$el.attr("style", "display: none;");
    	this.typeData = this.options.typeData;
    	this.rendered = false;
    },
    render : function(){
    	this.$el.append(viewCreator.make("div",{"class":"icon_search"}));
    	
    	var divSearchButtonEL = $(viewCreator.make("div", {
            "class": "search_btn list2"
        }));
        this.$el.append(divSearchButtonEL);

        var ulEl = $(viewCreator.make("ul"));
        divSearchButtonEL.append(ulEl);

        var liSearchButtonEl = $(viewCreator.make("li"));
        var liResetButtonEl = $(viewCreator.make("li"));
        ulEl.append(liSearchButtonEl);
        ulEl.append(liResetButtonEl);

        var searchButton = new SearchContentButton({
            searchView: this
        });
        liSearchButtonEl.append(searchButton.render().el);

        var resetButton = new SearchContentResetButton({
            searchView: this
        });
        liResetButtonEl.append(resetButton.render().el);

        this.searchFormDivEl = $(viewCreator.make("div", {
            "class": "search_content list2"
        }));
        this.$el.append(this.searchFormDivEl);
    	
    	return this;
    },
    showContent : function(expand){
    	if(!this.rendered){
    		this.searchFormEl = $(viewCreator.make('form', {
                'action': ''
            }));
            var ulEl = $(viewCreator.make('ul'));
            this.searchFormEl.append(ulEl);
            this.searchFormDivEl.append(this.searchFormEl);
            
    		this.rendered = true;
    	}
    	if(expand){
    		this.$el.attr("style", "display: none;");
    	}else{
    		this.$el.attr("style", "display: block;");
    	}
    },
    doSearch : function(){
    	//console.log('click the do Search method!');
    },
    resetForm : function(){
    	//console.log('click the reset form method!');
    }
});

window.NewsSearchItem = Backbone.View.extend({
	tagName: 'li',
	initialize : function(){
		
	},
	render : function(){
		
		return this;
	}
});