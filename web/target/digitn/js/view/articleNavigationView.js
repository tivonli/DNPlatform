window.ArticleGroupView=Backbone.View.extend({
	/**
	 * westTabContentView  reference to WestTabContentView, should be passed as part of options.
	 * This reference will be passed to summary view so that they can get reference centerTabContentView for adding tabs. 
	 */
	initialize:function(){
		this.id='articleGroup_' + this.model.id;
		//Holds value to current selected summary
		this.selectedSummary=null;
		
		window.ArticleGroupView.prototype._idVsGroupModel[this.model.id]=this.model;
		this.articleTypeWrapperEl=this.options.westTabContentView.articleTypeWrapperEl;
	},
	
	render:function(){
		this.articleTypeWrapperEl.append('<h3><a href="#"><div class="leftMenu_header_r">' + this.model.name +
				                                                    '</div></a></h3><div id=' + this.id + '></div>');
		this.articleGroupEL=$('#'+this.id);
		
		//Fetch groups. Is it ok to make ajax call here?
		//Pass reference to this as part of option. 
		appView.tabs.fetchChildren({parentGroup:this.model.id,subMenuFromWay:this.model.subMenuFromWay,success:this.addArticleSummaries,failure:undefined,callBackContext:this});
		return this;
	},
	
	addArticleSummaries:function(articleSummaries){
		var self=this;
		$(articleSummaries).each(function(){
			self.articleGroupEL.append(new ArticleSummaryView({model:this,articleGroupView:self}).render().el);
		});
	},
	
	activate:function(){
	      //Check if this group is currently active if not make it active
	      var active = this.articleTypeWrapperEl.accordion( "option", "active" );
	      var indexofThis=this.articleTypeWrapperEl.children('div').index(this.articleGroupEL);
	      if(active!==indexofThis){
	         this.articleTypeWrapperEl.accordion( "option", "active",indexofThis);
	      }
	}
	
});

//Cache of group view model id to model. Used for showing reference tabs
window.ArticleGroupView.prototype._idVsGroupModel={};

window.ArticleSummaryView=Backbone.View.extend({
	
	tagName:"div",
	className:'subMenu ui-state-default',
	events:{
		     'click':'showArticleContent',
		     'mouseenter':'toggleHighlight',
		     'mouseleave':'toggleHighlight'
		
	       },
	
	/**
	 * Should pass parent ArticlGroupView in articleGroupView variable of options.
	 * 
	 */
	initialize:function(){
		//Long chain objects,is there other way to do it?
		this.articleGroupView=this.options.articleGroupView;
		this.articleTabView=this.articleGroupView.options.westTabContentView.options.centerTabContentView.articleTabsView;
		this.articleTypeWrapperEl=this.articleGroupView.articleTypeWrapperEl;
	
	},
	
		
	render:function(){
		this.$el.append('<span></span>'+this.model.name);
		return this;
	},
	
	showArticleContent:function(){
		this.selectSummary();
		this.articleTabView.showArticleTab(this);
		
	},
	
	selectSummary:function(){
	    //Find the current active link and remove style
	    var selectedSummaries=this.articleTypeWrapperEl.find('.subMenu.ui-state-active');
	    if(selectedSummaries.length>0){
	       var selectedSummary=$(selectedSummaries[0])
	       selectedSummary.removeClass('ui-state-active').addClass('ui-state-default');
	    }
		this.$el.removeClass('ui-state-default').addClass('ui-state-active');
		//Expand parent's header
		this.articleGroupView.activate();
	
	},
	
	toggleHighlight:function(){
		if(this.$el.hasClass('ui-state-default')){
			this.$el.removeClass('ui-state-default');
			this.$el.addClass('ui-state-hover');
		}else{
			this.$el.removeClass('ui-state-hover');
			this.$el.addClass('ui-state-default');
		}
	}
	
});