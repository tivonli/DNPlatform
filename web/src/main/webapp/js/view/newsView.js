/**
 * the js file Provide news model web client display and some effect....
 * here is need to refactor when I finish all the function ..
 */
window.NewsViewConfigureObject = {
	debug : false,
	test : true,
	url : {
		newsListViewCountUrl : "/rest/news/newsCounts?newsType=",
		newsListViewDataUrl : "/rest/news/searchPageNews?pageSize=",
		newsDownAttachmentUrl : "rest/mobile/documentData/",
		newsUploadAttachmentUrl : "/mobile/fileupload",
		newsListAllAttachmentUrl : "/rest/attachment/detail/",
		newsDeleteAttachmentUrl : "/rest/attachment/"
	}
};
window.NewsView = Backbone.View.extend({
	tagName : 'div',
	className : 'news main-content-panel2',
	initialize:function(){
		this.articleObject = this.options.article;
		this.parentView = this.options.parentView;
		this.categroyData = new NewsCategroyData();
	},
	render:function(){
		var self = this;
		this.categroyData.fetch({
			success : function(data) {
				self.renderNewsView(data);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});
		return this;
	},
	renderNewsView:function(data){
		var self = this;
		this.destroy();
		if(data && data.length > 0){
			var newsListId = "article_news_list_content_"+this.articleObject.id;
			this.childView = $(viewCreator.make("div",{"id":newsListId,"style":"overflow-y:visible;padding:0;width:auto;height:auto;border:0;"}));
			this.$el.append(this.childView);
			var categroyData = eval(data);
			//the news page include top Categroy view and list content view
			this.childTopCategroyView = new NewsTopCategroyView({model:categroyData,parentView:this.childView,summary:this.articleObject});
			this.childContentListView = new NewsContentListView({model:this.articleObject,parentView:this.childView,newsType:categroyData[0].name,NewsTypeData:categroyData});
			this.childView.append(this.childTopCategroyView.render().el);
			this.childView.append(this.childContentListView.render().el);
			//adjust news page layout.
			this.adjustNewsLayout();
			//bind the event trigger the categroy select to news listView
			this.childTopCategroyView.$el.bind('newsCategroyItem-selection', function(selectionEvent) {
                self.onCategroySelection(selectionEvent);
            });
		}else{
			var tableEle = $(viewCreator.make("table",{"style":"width: 100%; clear: both; margin-left: 0px;"}));
			var tbodyEle = $(viewCreator.make("tbody"));
			tableEle.append(tbodyEle);
			var trEle = $(viewCreator.make("tr",{"class":"odd"}));
			tbodyEle.append(trEle);
			trEle.append(viewCreator.make("td",{"colspan":"10","valign":"top","class":"dataTables_empty"},no_results_text));
			this.$el.empty().append(tableEle);
		}		
	},
	onCategroySelection:function(selectionEvent){
		this.childContentListView.onCategroySelection(selectionEvent);
	},
	resize:function(){
		
	},
	adjustNewsLayout:function(){
		this.childTopCategroyView.bindListener();
		//here is select tip first data by default.
		$($("div#"+this.childTopCategroyView.id+" > ul > li > a")[0]).addClass('news_tab_selected');
		//here is set the width and height;
		var parentDivEle = this.$el.parent();
		this.$el.width(parentDivEle.width());
		this.$el.height(parentDivEle.height());
		this.childView.width(parentDivEle.width());
		this.childView.height(parentDivEle.height());
		//
		var categroyDivHeight = $("div#"+this.childTopCategroyView.id).height();
		//13 is mean in the css file written by nina, set css attribute padding
		$("div#"+this.childContentListView.id).height(parseInt(parentDivEle.height())-parseInt(categroyDivHeight)-13);
		
	},
	destroy : function(){
		var detailDialog = $("div#newsDetailContainerId");
		var addDialog = $("div#newsAddContainerId");
		if(detailDialog){
			detailDialog.empty();
		}
		if(addDialog){
			addDialog.empty();
		}
	},
	refreshReferenceView: function(){
		if(this.childView){
			this.childView.parent().empty();
			var self = this;
			this.categroyData.fetch({
				success : function(data) {
					self.renderNewsView(data);
				},
				failure:function(xhr,status,exception){
					AppView._showMessage(xhr.statusText,"error");
				},
				callBackContext:this
			});
		}
	}
});

window.NewsCategroyItemView = Backbone.View.extend({
	tagName:'li',
	className:'news_tab_l',
	events: {
        'click': 'onClick'
    },
	initialize:function(){
		this.model=this.options.model;
		this.isMore = this.options.isMore;
		this.parentView = this.options.parentView;
		if(this.isMore){
			this.$el.attr({id:this.definedStringFormat(this.model.name)});
		}
	},
	render:function(){
		var name = this.model.name;
		this.aEle = $(viewCreator.make("a",{"class":"news_tab_r","name":name,"id":this.definedStringFormat(name),"href":"#"},name));
		this.$el.append(this.aEle);
		if(this.isMore){
			this.aEle.attr("class","news_tab_r news_tab_selected");
		}
		return this;
	},
	definedStringFormat:function(str){
		return str.replace(/\ /g, '_');
	},
	onClick:function(){
		var self = this;
		var childrens = this.parentView.displayCategroyUlContainerEle.children();
		this.parentView.removeAllSelectClassAndSelectOneClass(childrens, this.aEle);
		
		if(this.isMore){
			if(childrens.length > 7){
				childrens.last().remove();
			}
			//remove other categroy item select class name.
			this.parentView.removeAllSelectClassAndSelectOneClass(childrens, null);
			
			var appendCategroyLiEle = $(viewCreator.make("li",{"class":"news_tab_l"},this.$el.html()));
			appendCategroyLiEle.appendTo(this.parentView.displayCategroyUlContainerEle).click(function(event){
				self.parentView.removeAllSelectClassAndSelectOneClass(self.parentView.displayCategroyUlContainerEle.children(), $(this));
				self.parentView.fireCategroySelection(self.model.name);
			});
		}
		this.parentView.fireCategroySelection(this.model.name);
	}
});

window.NewsTopCategroyView = Backbone.View.extend({
	tagName:'div',
	className:'news_tab',
	initialize:function(){
		this.id = 'news_categroy_'+this.options.summary.id;
		this.$el.attr({
			id:this.id,
			style:'overflow:hidden;width:auto;'
		});
	},
	render:function(){
		var self = this;
		var categroies = this.model;
		var categroyLength = categroies.length;
		this.displayCategroyUlContainerEle = $(viewCreator.make("ul",{}));
		this.$el.append(this.displayCategroyUlContainerEle);
		if(categroyLength > 6){
			for(var i =0; i < 6; i ++){
				this.displayCategroyUlContainerEle.append(new NewsCategroyItemView({model:categroies[i],isMore:false,parentView:this}).render().el);
			}
			this.displayCategroyUlContainerEle.append(new NewsCategroyItemView({model:categroies[6],isMore:false,parentView:this}).render().el);
			if(categroyLength > 7){
				this.moreDivContainerEle = $(viewCreator.make("div",{"class":"news_tab_more"}));
				this.$el.append(this.moreDivContainerEle);
				
				this.moreDivContainerEle.append(viewCreator.make("a",{"class":"news_tab_more_icon"},lable_news_tab_more));
				var moreSubMenuContainerEle = $(viewCreator.make("div",{"class":"news_subnemu","showHide":"0"}));
				this.moreDivContainerEle.append(moreSubMenuContainerEle);
				var subMenuUlEle = $(viewCreator.make("ul",{"id":"news_subnemu"}));
				moreSubMenuContainerEle.append(subMenuUlEle);
				if(categroyLength > 14){
					for(var i = 7; i < 14; i ++){
						subMenuUlEle.append(new NewsCategroyItemView({model:categroies[i],isMore:true,parentView:this}).render().el);
					}
					var moreLiCategroyEle = $(viewCreator.make("li",{"class":"news_subnemu_more","name":"news_tab_more_tag"},viewCreator.make("a",{"name":"news_tab_more_tag"},lable_news_tab_more)));
					//here is more will alert dialog to show the more menus.
					subMenuUlEle.append(moreLiCategroyEle);
					//first, new the more new type dialog view;
					this.moreCategroyViewDialog = new MoreNewsTypeDialogView({model:self.model,parentView:self}).render();
					moreLiCategroyEle.click(function(event){
						//third, can invoke the showDialog ..
						self.moreCategroyViewDialog.showDialog();
					});
					
				}else{
					for(var i = 7; i < categroyLength; i ++){
						subMenuUlEle.append(new NewsCategroyItemView({model:categroies[i],isMore:true,parentView:this}).render().el);
					}
				}
			}
		}else{
			for(var i = 0; i < categroies.length; i ++){
				this.displayCategroyUlContainerEle.append(new NewsCategroyItemView({model:categroies[i],parentView:this}).render().el);
			}
		}
		return this;
	},
	bindListener:function(){
		//bind the categroy item event listener 
		if(this.moreDivContainerEle && !jQuery.isEmptyObject(this.moreDivContainerEle[0])){
			this.moreDivContainerEle.click(function(event){
				var subnemu = $(this).children().last();
				var showHide = subnemu.attr('showHide');
				if(showHide == '1'){
					subnemu.show();
					subnemu.attr('showHide',0);
				}else{
					subnemu.hide();
					subnemu.attr('showHide',1);
				}
			});
			this.moreDivContainerEle.mouseover(function(event){
				var subnemu = $(this).children().last();
				var showHide = subnemu.attr('showHide');
				subnemu.show();
				subnemu.attr('showHide',0);
			});
			this.moreDivContainerEle.mouseout(function(event){
				var subnemu = $(this).children().last();
				var showHide = subnemu.attr('showHide');
				subnemu.hide();
				subnemu.attr('showHide',1);
			});
			//default colspan
			this.moreDivContainerEle.click();
		}
	},
	fireCategroySelection:function(name){
		var selectionEvent = $.Event('newsCategroyItem-selection');
		selectionEvent.name = name;
		this.$el.trigger(selectionEvent);
	},
	removeAllSelectClassAndSelectOneClass:function(all,one){
		var execute = true;
		if(one == null || one == "" || jQuery.isEmptyObject(one[0])){
			execute = false;
		}
		all.each(function(){
			$(this).children().removeClass('news_tab_selected');
		});
		if(execute){
			one.addClass('news_tab_selected');
		}
	}
});

window.MoreNewsTypeDialogView = Backbone.View.extend({
	tagName : 'div',
	className : 'newsType',
	initialize : function(){
		this.model = this.options.model;
		this.parentView = this.options.parentView;
	},
	render : function(){
		var self = this;
		this.$el.dialog({
			title:lable_news_tab_more,
			autoOpen : false,
			show : "blind",
			width : 1000,
			height : 400,
			modal : true
		});
		this.renderMoreNewsTypeContent();
		return this;
	},
	calculateStringByteLength : function(str){
		var totalLength = 0;
        var i;
        var charCode;
        for (i = 0; i < str.length; i++) {
          charCode = str.charCodeAt(i);
          if (charCode < 0x007f) {
            totalLength = totalLength + 1;
          } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
            totalLength += 2;
          } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
            totalLength += 3;
          }
        }
        return totalLength;
	},
	renderMoreNewsTypeContent : function(){
		var self = this;
		var ulEleContainer = $(viewCreator.make("ul",{"class":"newsTypeContent"}));
		this.$el.append(ulEleContainer);
		for(var i = 0; i < this.model.length; i ++){
			var item = this.model[i];
			var _description = "";
			if(item.description.length === this.calculateStringByteLength(item.description)){
				_description = (item.description.length > 28) ? (item.description.substring(0,28)+'...') : item.description;
			}else{
				_description = (item.description.length > 20) ? (item.description.substring(0,20)+'...') : item.description;
			}
			var liEleContainer = $(viewCreator.make("li",{"class":"newsTypeItem","title":item.name}));
			ulEleContainer.append(liEleContainer);
			
			liEleContainer.append(viewCreator.make("div",{"class":"newsTypeImg"},viewCreator.make('img',{"src":"skins/common/images/common/newsTypeImg.png"})));
			liEleContainer.append(viewCreator.make("a",{"href":"#","class":"newsTypeTitle","title":item.description},item.name));
			liEleContainer.append(viewCreator.make("div",{"class":"newsTypeDescription","title":item.description}, _description));
			
			liEleContainer.click(function(event){
				var containerLi = self.parentView.displayCategroyUlContainerEle.children();
				//if there is find the object is not null,then can tigger the object click event; 
				//if there is not find any object, then can add some object to this panel and tigger the click event
				//TODO ... check the object is null or not null...fixed this bugs..
				var findObject = containerLi.find($("a[name='"+this.title+"']"));
				if(findObject&&findObject.length>0){
					findObject.click();
				}else{
					if(containerLi.length > 7){
						containerLi.last().remove();
					}
					self.parentView.removeAllSelectClassAndSelectOneClass(containerLi,null);
					var aEle = viewCreator.make("a",{"id":this.title,"name":this.title,"class":"news_tab_r news_tab_selected"},this.title);
					var liSingleRecordEle = $(viewCreator.make("li",{"class":"news_tab_l"},aEle));
					liSingleRecordEle.appendTo(self.parentView.displayCategroyUlContainerEle).click({containerLi:containerLi,name:this.title},function(event){
						self.parentView.removeAllSelectClassAndSelectOneClass(event.data.containerLi,$(this).children());
						self.parentView.fireCategroySelection(event.data.name);
					});
					self.parentView.fireCategroySelection(this.title);
				}
				self.$el.dialog("close");
			});
		}
	},
	showDialog : function(){
		this.$el.dialog("open");
	}
});

window.NewsContentListView = Backbone.View.extend({
	tagName : 'div',
	className : 'news_content',
	initialize : function(){
		this.id = 'news_content_'+this.model.id;
		this.listData = new NewsListData();
		this.typeName = this.options.newsType;
		this.NewsTypeData = this.options.NewsTypeData;
		this.$el.attr({
			id:this.id,
			style:'overflow-y: hidden; overflow-x: hidden;width:auto;height:100%;'
		});
		this.detailDialog = null;
		this.currentListData = null;
		this.paginatedViewCurrentPage = 0;
	},
	render : function(){
		this.renderNewsContentTopView();
		this.countNewsNumberAndTriggerNewsListView();
		return this;
	},
	getDataFromBackendByAjax:function(url,params,callback){
		digitnexus.ajaxGet(url, params, function(response) {
			if (callback && jQuery.isFunction(callback)) {
				callback(response);
			}
		}, function(xhr, status, exception) {
			AppView._showErrors(xhr);
		});
	},
	countNewsNumberAndTriggerNewsListView : function(){
		var self = this;
		var countUrl = NewsViewConfigureObject.url.newsListViewCountUrl+encodeURIComponent(this.typeName);
		var callback = function(response){
			self.renderNewsContent(response);
		};
		self.getDataFromBackendByAjax(countUrl, null, callback);
	},
	renderNewsContent:function(data){
		if(this.paginatedView&& this.paginatedView!=null){
			//
			if(this.paginatedViewCurrentPage&& this.paginatedViewCurrentPage != 0){
				this.paginatedView.reRenderWithCurrentPage(data,this.paginatedViewCurrentPage);
			}else{
				this.paginatedView.reRender(data);
			}
		}else{
			this.paginatedView = new NewsPaginatedView({dataCount:data,model:this.model,parentView:this});
			if(this.paginatedViewCurrentPage&& this.paginatedViewCurrentPage != 0){
				this.paginatedView.setCurrentPage(this.paginatedViewCurrentPage);
			}
			this.$el.append(this.paginatedView.render().el);
		}
		var self = this;
		var dataUrl = NewsViewConfigureObject.url.newsListViewDataUrl
				+ encodeURIComponent(this.paginatedView.pageSize)
				+ "&pageIndex="
				+ encodeURIComponent(this.paginatedView.currentPage)
				+ "&newsType=" + encodeURIComponent(this.typeName);
		//generate the news content list view
		var callback = function(response){
			if(response && response.length>0){
				self.renderNewsContentListView(response);
				self.adjustLayout();
			}
		};
		self.getDataFromBackendByAjax(dataUrl, null, callback);
		//default selected; here is be applied to the listInfoView..
		$("div#news_list_"+this.model.id).attr("categroyId",this.typeName);
		$("a#"+this.typeName.replace(/\ /g, '_')).addClass('news_tab_selected');
	},
	onCategroySelection:function(selectionEvent){
		this.changeNewsList(selectionEvent.name);
	},
	renderNewsContentTopView : function(){
		// the content list view include top tool view and content view
		this.topListInfoView = $(viewCreator.make("div",{"id":"news_list_all_"+this.model.id,"style":"overflow-y: hidden; overflow-x: hidden;"}));
		this.newsTopView = $(viewCreator.make("div",{"id":"news_list_top_"+this.model.id,"class":"news_list_top","style":"overflow-y: hidden; overflow-x: hidden;"}));
		this.toolView = new NewsTopToolView({model:this.model,parentView:this.newsTopView,listParentView:this});
		this.newsTopView.append(this.toolView.render().el);
		this.listInfoView = $(viewCreator.make("div",{"id":"news_list_"+this.model.id,"class":"news_list","style":"overflow-y: hidden; overflow-x: hidden;"}));
		this.topListInfoView.append(this.newsTopView);
		this.topListInfoView.append(this.listInfoView);
		this.$el.append(this.topListInfoView);
		this.paginatedView = null;
	},
	adjustLayout : function(){
		this.topListInfoView.height(parseInt(this.$el.height())-30);
		this.paginatedView.$el.height(30);
	},
	renderNewsContentListView : function(data){
		this.currentListData = data;
		this.generateNewsItem(data);
		//default list news expand ..
		if(data && data.length > 0){
			$("a#expand_news_content_"+data[0].id).click();
		}
	},
	generateNewsItem:function(jsonNewsData){
		var self = this;
		this.data = jsonNewsData;
		var parentView = $(viewCreator.make("dl",{}));
		this.listInfoView.append(parentView);
		for(var i = 0; i < this.data.length; i ++){
			this.generateItemTemplate(this.data[i],parentView);
		}
	},
	generateItemTemplate:function(itemData,parentView){
		var comment_amount = (typeof itemData.commentCount == 'undefined') ? 0 : itemData.commentCount;
		var documentId = (typeof itemData.documentId == 'undefined') ? 0 : itemData.documentId;
		var attchmentIds = (typeof itemData.attchmentIds == 'undefined') ? 0 : itemData.attchmentIds;
		var content = (itemData.content.length > 180) ? (itemData.content.substring(0,180)+'...') : itemData.content;
		
		var ddContainerEle = $(viewCreator.make("dd",{}));
		parentView.append(ddContainerEle);
		var divChildDefaultContainerEle = $(viewCreator.make("div",{"class":"news_list_default"}));
		ddContainerEle.append(divChildDefaultContainerEle);
		
		var divLineOneContainerEle = $(viewCreator.make("div",{"class":"news_list_line1"}));
		divChildDefaultContainerEle.append(divLineOneContainerEle);
		divLineOneContainerEle.append(viewCreator.make("input",{"type":"checkbox","newsIdColumn":"true","value":itemData.id}));
		divLineOneContainerEle.append(viewCreator.make("div",{"class":"news_list_title_icon"}));
		var titleContainerEle = $(viewCreator.make("div",{"class":"news_list_title","id":"select_news_content_"+itemData.id},itemData.title));
		divLineOneContainerEle.append(titleContainerEle);
		var expandAEle = $(viewCreator.make("a",{"id":"expand_news_content_"+itemData.id},viewCreator.make("div",{"class":"news_list_expand_icon"})));
		divLineOneContainerEle.append(expandAEle);
		
		var divLineTwoContainerEle = $(viewCreator.make("div",{"class":"news_list_line2"}));
		divChildDefaultContainerEle.append(divLineTwoContainerEle);
		var lineTwoUlEle = $(viewCreator.make("ul",{}));
		divLineTwoContainerEle.append(lineTwoUlEle);
		lineTwoUlEle.append(viewCreator.make("li",{},itemData.createDate));
		lineTwoUlEle.append(viewCreator.make("li",{},itemData.createdBy));
		lineTwoUlEle.append(viewCreator.make("li",{},viewCreator.make("div",{"class":"news_list_icon icon_like"})));
		lineTwoUlEle.append(viewCreator.make("li",{},viewCreator.make("div",{"class":"news_list_icon icon_notlike"})));
		lineTwoUlEle.append(viewCreator.make("li",{},viewCreator.make("div",{"class":"news_list_icon icon_follow"})));
		var a = $(viewCreator.make("a",{"class":"news_list_comment","id":"comment_news_"+itemData.id}));
		lineTwoUlEle.append(viewCreator.make("li",{},a));
		a.append(viewCreator.make("span",{},label_article_comment+'('));
		a.append(viewCreator.make("div",{"class":"comment_amount"},comment_amount));
		a.append(viewCreator.make("span",{},')'));
		
		var divLineThreeContainerEle = $(viewCreator.make("div",{"class":"news_list_line3","id":"hideOrDisplay_news_content_"+itemData.id}));
		divChildDefaultContainerEle.append(divLineThreeContainerEle);
		
		var imgParentEle = $(viewCreator.make("div",{"class":"news_list_img"}));
		divLineThreeContainerEle.append(imgParentEle);
		if(attchmentIds != null && attchmentIds.length > 0 && attchmentIds != 'null'){
			imgParentEle.append(viewCreator.make("img",{"style":"width:100%;heigth:100%","src": NewsViewConfigureObject.url.newsDownAttachmentUrl+encodeURIComponent(attchmentIds[0])}));
		}
		divLineThreeContainerEle.append(viewCreator.make("div",{"class":"news_list_content"},'<a>'+content+'</a>'));
		//here is start to bind the event...
		//1, allow to the content div set the hide, and give the a ele have some operator to click.
		//2, give the title div click event, user can click the title will invoke openDetailView method.
		//3, give the content div click event, user can click the content will invoke openDetailView method.
		//4, give the comment a click event, user can click the comment will invoke openDetailView method.
		divLineThreeContainerEle.hide().attr("showHide",0);
		expandAEle.bind('click',{id: itemData.id,listContentObj:divLineThreeContainerEle,bindObject:expandAEle}, function(event){
			var id = event.data.id+"";
			if(id && event.data.listContentObj && event.data.bindObject){
				var showOrHide = event.data.listContentObj.attr('showHide');
				var divClassObject = $(event.data.bindObject).children();
				if(showOrHide == '0'){
					event.data.listContentObj.show();
					event.data.listContentObj.attr('showHide',1);
					divClassObject.removeClass('news_list_expand_icon');
					divClassObject.addClass('news_list_contract_icon');
				}else{
					event.data.listContentObj.hide();
					event.data.listContentObj.attr('showHide',0);
					divClassObject.removeClass('news_list_contract_icon');
					divClassObject.addClass('news_list_expand_icon');
				}
			}
		});
		titleContainerEle.bind('click',{id:itemData.id,newsListView:this},function(event){
			var id = event.data.id+"";
			if(id && event.data.newsListView){
				event.data.newsListView.openDetailView(event.data.id);
			}
		});
		divLineThreeContainerEle.bind('click',{id:itemData.id,newsListView:this},function(event){
			var id = event.data.id+"";
			if(id && event.data.newsListView){
				event.data.newsListView.openDetailView(event.data.id);
			}
		});
		a.bind('click',{id:itemData.id,newsListView:this},function(event){
			var id = event.data.id+"";
			if(id && event.data.newsListView){
				event.data.newsListView.openDetailView(event.data.id);
			}
		});
	},
	changeNewsList:function(id){
		//you click the categroy item then tigger the content list will be changed...
		$("div#news_list_"+this.model.id).attr("categroyId",id).empty();
		//this.paginatedView = null; remove the paginated view and the set the value to null;
		this.paginatedView = null;
		//if when you change the news categroy, so you will Reconstruct the paginated view.so...., now must remove the paginated view.
		$("div#"+this.id).children().last().remove();
		this.typeName=id;
		this.paginatedViewCurrentPage = 0;
		this.countNewsNumberAndTriggerNewsListView();
		//when the user click the categroy, then ckeck all box will be blank...
		$("input#"+this.id+"_check_all").attr('checked', false);
	},
	getSelectedIds:function(){
		var selected = $("input[newsIdColumn=true]");
		if(selected.length < 1){
			return null;
		}
		var ids=[];
		for(var i=0; i<selected.length; i++){
			if(selected[i].checked){
				ids.push(selected[i].value);
			}
		}
		return ids;
	},
	checkAllNews:function(checkAllStatus){
		var selected = $("input[newsIdColumn=true]");
		if(selected.length < 1){
			return null;
		}
		for(var i=0; i<selected.length; i++){
			if(checkAllStatus){
				selected[i].checked = true;
			}else{
				selected[i].checked = false;
			}
		}
	},
	refreshNewsList : function(){
		var id = $("div#news_list_"+this.model.id).attr("categroyId");
		//this.changeNewsList(categroyId);
		//you click the categroy item then tigger the content list will be changed...
		$("div#news_list_"+this.model.id).attr("categroyId",id).empty();
		//this.paginatedView = null; remove the paginated view and the set the value to null;
		this.paginatedView = null;
		//if when you change the news categroy, so you will Reconstruct the paginated view.so...., now must remove the paginated view.
		$("div#"+this.id).children().last().remove();
		this.typeName=id;
		this.countNewsNumberAndTriggerNewsListView();
		//when the user click the categroy, then ckeck all box will be blank...
		$("input#"+this.id+"_check_all").attr('checked', false);
	},
	openDetailView:function(id){
		// open the detail view dialog
		var docHeight = $(document).height();
		var dialogHeight = (parseInt(docHeight)-200);
		if(this.detailDialog == null){
			var self = this;
			self.detailDialog = $(viewCreator.make("div",{"id":"newsDetailContainerId","class":"popupBox1","title":label_detail,"style":"padding:5px 5px 5px;overflow-y:auto;"}));
			self.newsDetailViewContainer = new NewsDetailViewContainer({model:self.model,newsId:id,parentDialog:self.detailDialog,detailDialogParentView:self,newsTypeData:self.NewsTypeData});
			self.detailDialog.append(self.newsDetailViewContainer.render().el);
			self.paginatedViewCurrentPage = self.paginatedView.currentPage;
			
			self.detailDialog.dialog({
				show: "blind",
				width: 1000,
				position: 'top',
				modal: true,
				close:function(event, ui){
					self.refreshNewsList();
				}
			});
			self.detailDialog.height(dialogHeight);
			$(self.newsDetailViewContainer.$el).height(dialogHeight).children().height(dialogHeight);
			self.newsDetailViewContainer.setSaveSuccessCallBack(function(){
				if(self.detailDialog.dialog("isOpen")){
					self.detailDialog.dialog("close");
				}
			});
		}else{
			this.paginatedViewCurrentPage = this.paginatedView.currentPage;
			this.detailDialog.dialog("open");
			this.detailDialog.height(dialogHeight);
			$(this.newsDetailViewContainer.$el).height(dialogHeight);
			if(this.newsDetailViewContainer){
				this.newsDetailViewContainer.resetPanel(id);
			}
		}
	}
});

window.NewsPaginatedView = Backbone.View.extend({
	tagName : 'div',
	className : 'fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix',
	initialize : function(){
		this.pageSize = 5;
		this.dataCount = this.options.dataCount;
		this.model = this.options.model;
		this.pageCount = this.calculatePageCount(this.dataCount/this.pageSize);
		this.currentPage = 1;
		this.parentView = this.options.parentView;
		this.disabledButtonClassName = "ui-state-disabled";
		this.avaibleButtonClassName = "paginate_button";
	},
	setCurrentPage : function(currentPage){
		if(currentPage&&(0<currentPage<this.dataCount)){
			this.currentPage = currentPage;
		}
	},
	render : function(){
		var self = this;
		//this.pageCount = this.calculatePageCount(this.dataCount/this.pageSize);
		var articleName = digitnexus.modifiedArticleName(this.model.remark);
		this.parentDivEleContainer = $(viewCreator.make("div",{"class":"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_input","id":articleName+"_list1_paginate","style":"padding: 2px 7px 2px;"})); 
		this.$el.append(this.parentDivEleContainer);
		
		this.first = $(viewCreator.make("span",{"class":this.avaibleButtonClassName,"id":articleName+"_list1_first"},'<img src="' + digitnexus.IMAGE_DIR + '/common/page/first.png"></img>'));
		this.parentDivEleContainer.append(this.first);
		this.first.click(function(){
			if(self.currentPage <= 1){
				self.currentPage = 1;
				self.first.addClass(self.disabledButtonClassName);
				self.previous.addClass(self.disabledButtonClassName);
				return ;
			}else{
				self.currentPage = 1;
				//here is empty the news view list div
				$("div#news_list_"+self.parentView.model.id).empty();
				//here is trigger some event to do some thing..
				self.parentView.paginatedViewCurrentPage = 0;
				//and request the data and will be display by paginated .
				self.parentView.countNewsNumberAndTriggerNewsListView();
				//here is add the some effect to for can click the button with the css 
				self.removeAllDisableButtonClassName();
				self.first.addClass(self.disabledButtonClassName);
				self.previous.addClass(self.disabledButtonClassName);
			}
		});
		this.previous = $(viewCreator.make("span",{"class":this.avaibleButtonClassName,"id":articleName+"_list1_previous"},'<img src="' + digitnexus.IMAGE_DIR + '/common/page/prev.png"></img>'));
		this.parentDivEleContainer.append(this.previous);
		this.previous.click(function(){
			if(self.currentPage <= 1){
				self.currentPage = 1;
				return ;
			}else{
				self.currentPage--;
				//here is empty the news view list div
				$("div#news_list_"+self.parentView.model.id).empty();
				//here is trigger some event to do some thing..
				self.parentView.paginatedViewCurrentPage = 0;
				//and request the data and will be display by paginated .
				self.parentView.countNewsNumberAndTriggerNewsListView();
				//here is add the some effect to for can click the button with the css 
				self.removeAllDisableButtonClassName();
				if(self.currentPage===1){
					self.first.addClass(self.disabledButtonClassName);
					self.previous.addClass(self.disabledButtonClassName);
				}
			}
		});
		
		var page = viewCreator.make("span",{"class":"paginate_page"},table_label_page || 'Page');
		this.parentDivEleContainer.append(page);
		
		this.input = $(viewCreator.make("input",{"type":"text","style":"width: 2em; display: inline; text-align: right;","value":this.currentPage}));
		this.parentDivEleContainer.append(this.input);
		this.input.keyup(function(e){
			if (this.value == "" || this.value.match(/[^0-9]/)) {
                /* Nothing entered or non-numeric character */
                return;
            }

            if (e.which == 38 || e.which == 39) {
                this.value++;
            } else if ((e.which == 37 || e.which == 40) && this.value > 1) {
                this.value--;
            }

            if (parseInt(this.value) < 1) {
                return;
            }
            if(this.value < 1 | this.value > self.pageCount){
            	return;
            }
            
            self.currentPage=parseInt(this.value);//this.value;
			//here is empty the news view list div
			$("div#news_list_"+self.parentView.model.id).empty();
			//here is trigger some event to do some thing..
			self.parentView.paginatedViewCurrentPage = 0;
			//and request the data and will be display by paginated .
			self.parentView.countNewsNumberAndTriggerNewsListView();
			//here is add the some effect to for can click the button with the css 
			self.removeAllDisableButtonClassName();
			if(self.currentPage===1){
				self.first.addClass(self.disabledButtonClassName);
				self.previous.addClass(self.disabledButtonClassName);
			}
			if(self.currentPage===self.pageCount){
				self.next.addClass(self.disabledButtonClassName);
				self.last.addClass(self.disabledButtonClassName);
			}
		});
		
		this.input.focusout(function(e){
			if (this.value == "" || !$.isNumeric(this.value)) {
                this.value = self.currentPage;
            } else {
                var decimalValue = this.value;
                this.value = Math.round(decimalValue);
                if (this.value < 1) {
                    this.value = 1;
                    self.currentPage = parseInt(this.value);
                    $("div#news_list_"+self.parentView.model.id).empty();
        			//here is trigger some event to do some thing..
                    self.parentView.paginatedViewCurrentPage = 0;
        			//and request the data and will be display by paginated .
        			self.parentView.countNewsNumberAndTriggerNewsListView();
        			//here is add the some effect to for can click the button with the css 
        			self.removeAllDisableButtonClassName();
        			self.first.addClass(self.disabledButtonClassName);
    				self.previous.addClass(self.disabledButtonClassName);
    				if(parseInt(self.currentPage)===parseInt(self.pageCount)&&parseInt(self.currentPage)===1){
    					self.next.addClass(self.disabledButtonClassName);
        				self.last.addClass(self.disabledButtonClassName);
    				}
                    return;
                }else if(this.value > self.pageCount){
                	this.value = self.pageCount;
                	self.currentPage = parseInt(this.value);
                    $("div#news_list_"+self.parentView.model.id).empty();
        			//here is trigger some event to do some thing..
                    self.parentView.paginatedViewCurrentPage = 0;
        			//and request the data and will be display by paginated .
        			self.parentView.countNewsNumberAndTriggerNewsListView();
        			//here is add the some effect to for can click the button with the css 
        			self.removeAllDisableButtonClassName();
        			self.next.addClass(self.disabledButtonClassName);
    				self.last.addClass(self.disabledButtonClassName);
    				if(parseInt(self.currentPage)===parseInt(self.pageCount)&&parseInt(self.currentPage)===1){
    					self.first.addClass(self.disabledButtonClassName);
        				self.previous.addClass(self.disabledButtonClassName);
    				}
                    return;
                }
                this.value = Math.ceil(this.value);
                self.currentPage = parseInt(this.value);
                $("div#news_list_"+self.parentView.model.id).empty();
    			//here is trigger some event to do some thing..
                self.parentView.paginatedViewCurrentPage = 0;
    			//and request the data and will be display by paginated .
    			self.parentView.countNewsNumberAndTriggerNewsListView();
    			//here is add the some effect to for can click the button with the css 
    			self.removeAllDisableButtonClassName();
    			if(self.currentPage===1){
    				self.first.addClass(self.disabledButtonClassName);
    				self.previous.addClass(self.disabledButtonClassName);
    			}
    			if(self.currentPage===self.pageCount){
    				self.next.addClass(self.disabledButtonClassName);
    				self.last.addClass(self.disabledButtonClassName);
    			}
            }
		});
		
		this.of = $(viewCreator.make("span",{"class":"paginate_of"},'/'+this.pageCount));
		this.parentDivEleContainer.append(this.of);
		
		this.next = $(viewCreator.make("span",{"class":this.avaibleButtonClassName,"id":articleName+"_list1_next"},'<img src="' + digitnexus.IMAGE_DIR + '/common/page/next.png"></img>'));	
		this.parentDivEleContainer.append(this.next);
		this.next.click(function(){
			if(self.currentPage>=self.pageCount){
				self.currentPage = self.pageCount;
				return;
			}else{
				self.currentPage++;
				//here is empty the news view list div
				$("div#news_list_"+self.parentView.model.id).empty();
				//here is trigger some event to do some thing..
				self.parentView.paginatedViewCurrentPage = 0;
				//and request the data and will be display by paginated .
				self.parentView.countNewsNumberAndTriggerNewsListView();
				//here is add the some effect to for can click the button with the css 
				self.removeAllDisableButtonClassName();
				if(self.currentPage===self.pageCount){
					self.next.addClass(self.disabledButtonClassName);
					self.last.addClass(self.disabledButtonClassName);
				}
			}
		});
		this.last = $(viewCreator.make("span",{"class":this.avaibleButtonClassName,"id":articleName+"_list1_last"},'<img src="' + digitnexus.IMAGE_DIR + '/common/page/last.png"></img>'));
		this.parentDivEleContainer.append(this.last);
		this.last.click(function(){
			if(self.currentPage>=self.pageCount){
				self.currentPage = self.pageCount;
				return ;
			}else{
				self.currentPage = self.pageCount;
				//here is empty the news view list div
				$("div#news_list_"+self.parentView.model.id).empty();
				//here is trigger some event to do some thing.. request the data
				self.parentView.paginatedViewCurrentPage = 0;
				//and request the data and will be display by paginated .
				self.parentView.countNewsNumberAndTriggerNewsListView();
				//here is add the some effect to for can click the button with the css 
				self.removeAllDisableButtonClassName();
				self.next.addClass(self.disabledButtonClassName);
				self.last.addClass(self.disabledButtonClassName);
			}
		});
		//so here is first iniat the paginated view ,
		//will add the disabled css to the first button and previous button..
		if(this.currentPage==1){
			this.first.addClass(this.disabledButtonClassName);
			this.previous.addClass(this.disabledButtonClassName);
		}
		if(this.pageCount===this.currentPage){
			this.next.addClass(this.disabledButtonClassName);
			this.last.addClass(this.disabledButtonClassName);
		}
		return this;
	},
	calculatePageCount:function(Num){
		var pageCount = 0;
		if(Num.toString().indexOf(".")!= -1){
			pageCount = Math.floor(Num)+1;
		}else if(Num<=0){
			pageCount = 1;
		}else{
			pageCount = Math.floor(Num);
		}
		return pageCount;
	},
	removeAllDisableButtonClassName : function(){
		this.first.removeClass(this.disabledButtonClassName).addClass(this.avaibleButtonClassName);
		this.previous.removeClass(this.disabledButtonClassName).addClass(this.avaibleButtonClassName);
		this.next.removeClass(this.disabledButtonClassName).addClass(this.avaibleButtonClassName);
		this.last.removeClass(this.disabledButtonClassName).addClass(this.avaibleButtonClassName);
	},
	reRender : function(dataCount){
		this.dataCount = dataCount;
		this.pageCount = this.calculatePageCount(this.dataCount/this.pageSize);
		//this.currentPage = 1;
		this.input.val(this.currentPage);
		this.of.text('/'+this.pageCount);
	},
	reRenderWithCurrentPage : function(dataCount,currentPage){
		this.dataCount = dataCount;
		this.pageCount = this.calculatePageCount(this.dataCount/this.pageSize);
		this.setCurrentPage(currentPage);
		this.input.val(this.currentPage);
		this.of.text('/'+this.pageCount);
	}
});