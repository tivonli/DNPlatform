/**
 * 
 */
digitnexus = digitnexus || {};
digitnexus.reporting = digitnexus.reporting || {};
digitnexus.reporting.Constants = {
	REPORTTYPE : "reportType",
	DASHBOARD : 'dashboard',
	SINGLECHART : 'singleChart',
	MASHUPAURL: "/rest/mashup_a/data/",
	PRINTURL : "/rest/report/printing/",
	PRINTID : null
}

window.ReportView = Backbone.View.extend({
	tagName : 'div',
	className : 'reportView main-content-panel2',
	initialize : function(){
		this.parentId = this.options.parentId;
		this.article = this.options.article;
		this.type = this.options.type;
		this.id = this.options.parentId+"_reportView";
		this.reportList = new ReportListData();
		
	},
	render : function(){
		var self = this;
		this.reportList.fetch({
			groupId : this.article,
			success : function(data) {
				self.renderReportView(self.$el,data);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});
		return this;
	},
	renderReportView : function(parentView,data){
		this.toolBarView = new ReportTopToolBarView({parentView:this});
		parentView.append(this.toolBarView.render().el);
		var reportList = data.body.data;
		this.generateReportList(parentView,reportList);
	},
	generateReportList : function(parentView,reportList){
		var self = this;
		for(var i = 0; i < reportList.length; i ++){
			var itemData = reportList[i];			
			this.reportListContainerEle = $(viewCreator.make("div",{"class":"news_list_default"}));
			parentView.append(this.reportListContainerEle);
			this.reportListChildContainerEle = $(viewCreator.make("div",{"class":"news_list_line1"}));
			this.reportListContainerEle.append(this.reportListChildContainerEle);
			
			var checkBoxEle = viewCreator.make("input",{"type":"checkbox","newsIdColumn":"true","value":itemData.id});
			this.reportListChildContainerEle.append(checkBoxEle);
			var titleIconEle = viewCreator.make("div",{"class":"news_list_title_icon"});
			this.reportListChildContainerEle.append(titleIconEle);
			var titleEle = $(viewCreator.make("div",{"class":"news_list_title","id":"select_report_content_"+itemData.id},itemData.name));
			this.reportListChildContainerEle.append(titleEle);
			
			var listChildContainerEle2 = viewCreator.make("div",{"class":"news_list_line2"},itemData.descriptor);
			this.reportListContainerEle.append(listChildContainerEle2);
			
			titleEle.bind('click',{reportItem: itemData,reportView: self},function(event){
				if(event.data.reportItem && event.data.reportView){
					event.data.reportView.openView(event.data.reportItem);
				}
			});
		}
	},
	openView : function(item){
		var self = this;
		if(this.dialog != null){
			$(this.dialog).empty();
			this.dialog == null;
		}
		var docHeight = $(document).height();
		var dialogWidth = 1000;
		var dialogHeight = parseInt(docHeight-150);
		self.dialog = $(viewCreator.make("div",{"class":"popupBox1","title":item.name}));
		self.reportChartViewContainer = new ReportChartViewContainer({model:item,parentDialog:self.dialog,dialogVolume:{width:dialogWidth,height:dialogHeight}});
		self.dialog.append(self.reportChartViewContainer.render().el);
		self.dialog.dialog({
			show: "blind",
			width: dialogWidth,
			height: dialogHeight,
			position: 'top',
			modal: true,
			close: function( event, ui ) {
				//self.dialog.empty();
				//here is remove the dialog content, include the dialog itself.
				self.dialog.remove();
			}
		});
		
		self.dialog.height(dialogHeight);
		$(self.reportChartViewContainer).height(dialogHeight);
		
		self.reportChartViewContainer.setSaveSuccessCallBack(function(){
			if(self.dialog.dialog("isOpen")){
				self.dialog.dialog("close");
			}
			self.dialog = null;
		});
		self.reportChartViewContainer.resize();
	},
	resize : function(){
		
	}
});

window.ReportChartViewContainer = Backbone.View.extend({
	tagName : 'div',
	className : 'reportChartViewContainer',
	initialize : function(){
		this.model = this.options.model;
		this.dialogVolume = this.options.dialogVolume;
	},
	render : function(){
		var randomNumber = Math.floor(Math.random()*1000);
		var chartViewTabId = "chartViewTab_"+randomNumber+"_"+this.model.id;
		var detailViewTabId = "detailViewTab_"+randomNumber+"_"+this.model.id;
		this.tabMenuEle = $(viewCreator.make("ul",{"class":"ui-tabs"}));
		var liEle1 = viewCreator.make("li",{"class":"c"},viewCreator.make("a",{"href":"#"+chartViewTabId},label_reportManager_report));
		var liEle2 = viewCreator.make("li",{"class":"c"},viewCreator.make("a",{"href":"#"+detailViewTabId},label_reportManager_detail));
		this.tabMenuEle.append(liEle1);
		this.tabMenuEle.append(liEle2);
		this.$el.append(this.tabMenuEle);
		
		this.chartView = new ReportChartView({
			id : chartViewTabId,
			model : this.model,
			dialogVolume : this.dialogVolume
		});
		this.$el.append(this.chartView.render().el);
		
		this.detailView = new ReportDetailView({
			id : detailViewTabId,
			model : this.model,
			dialogVolume : this.dialogVolume
		});
		this.$el.append(this.detailView.render().el);
		
		this.$el.tabs({selected: 0})
		return this;
	},
	resize : function(){
		if(this.chartView){
			this.chartView.resize();
		}
	},
	setSaveSuccessCallBack : function(saveSuccessCallBack){
		this.saveSuccessCallBack = saveSuccessCallBack;
	}
});

window.ReportChartView = Backbone.View.extend({
	tagName : 'div',
	className : 'report-dialog-content',
	initialize : function(){
		this.id = this.options.id;
		this.model = this.options.model;
		this.dialogVolume = this.options.dialogVolume;
		this.$el.attr({
            id: this.id
        });
	},
	render : function(){
		this.$el.append(new ReportChartViewToolBar({parentView:this}).render().el);
		this.contentId = this.id+"_content";
		var contentView = viewCreator.make("div",{"class":"report_diagram","id":this.contentId});
		this.$el.append(contentView);
		this.contentViewPanel = $(contentView);
		
		if(this.model.type === digitnexus.reporting.Constants.DASHBOARD){
			this.dbView = new dashboardView({parentView:this.contentViewPanel,dialogVolume:this.dialogVolume});
			this.contentViewPanel.append(this.dbView.render().el);
			//here need do someting to support the dashboard............
		}else{
			this.graphId = this.contentId + "_graph";
			var graphView = viewCreator.make("div",{"class":"report_graph","id":this.graphId});
			this.contentViewPanel.append(graphView);
			this.contentGraphViewPanel = $(graphView);
			
			this.canvasId = this.graphId + "_canvas";
			var chartViewGraphCanvas = viewCreator.make("div",{"class":"report_canvas","id":this.canvasId});
			this.contentGraphViewPanel.append(chartViewGraphCanvas);
			this.requestDataAndExecuteMashup(this.canvasId);
		}
		return this;
	},
	requestDataAndExecuteMashup : function(canvasId){
		var callback = function(mashup){
			if(null!= mashup) {
				digitnexus.re.mashupManager.executeMashup(mashup.header.mashupId,false, [canvasId]);
			}
		};
		digitnexus.re.networkManager.requestMashup("/"+digitnexus.util.context+digitnexus.reporting.Constants.MASHUPAURL + this.model.id,null,callback);
	},
	adjustReportChartViewLayout : function(){
		var tabLiHeight = $('a[href=#'+this.id+']').parent().height();
		var parentDialogWidth = parseInt(this.dialogVolume.width-20);
		var parentDialogHeight = this.dialogVolume.height;
		var chartViewHeight = parseInt(parentDialogHeight-tabLiHeight);
		this.contentViewPanel.height(chartViewHeight);
		$("div#"+this.graphId).height(chartViewHeight).width(parentDialogWidth);
		if(this.canvasId){
			$("div#"+this.canvasId).width(parentDialogWidth).height(chartViewHeight);
		}
	},
	resize : function(){
		this.adjustReportChartViewLayout();
		if(this.dbView){
			this.dbView.resize();
		}
	}
});

window.ReportDetailView = Backbone.View.extend({
	tagName : 'div',
	className: 'report-dialog-content report-dialog-content-2',
	initialize : function(){
		this.id = this.options.id;
		this.model = this.options.model;
		this.$el.attr({
            id: this.id
        });
	},
	render : function(){
		//this.$el.append(new ReportDetailViewToolBar({parentView:this}).render().el);
		this.generateDetailTemplate();
		return this;
	},
	generateDetailTemplate : function(){
		var tableModel = {}; 
		for(var p in this.model){
			tableModel[p]=this.model[p];
		}
		//console.log(JSON.stringify(tableModel));
		delete tableModel.id;
		delete tableModel.groupId;
		delete tableModel.usersList;
		delete tableModel.type;
		delete tableModel.reportType;
		//console.log(JSON.stringify(tableModel));
		
		var formTableDiv = viewCreator.make("div",{"id":this.id+"_div"});
		this.$el.append(formTableDiv);
		this.formTableDiv = $(formTableDiv);
		var keys = new Array();
		this.formId = this.id + "_form";
		var detailTable = "<form action='' method='post' id='" + this.formId + "'><table class='table_2'><tbody>";
		for(var p in tableModel){
			keys.push(p);
		}
		if(keys != null && keys.length > 0){
			var columnLayout = 2;
			for(var i = 0,split = columnLayout; i < keys.length && i < split;){
				var jsonChunk = keys.slice(i, split);
				var oTr = "<tr>";
				for(var k = 0; k < jsonChunk.length; k++){
					var jsonChunkTitle = "";
					if(jsonChunk[k] === "name"){
						jsonChunkTitle = "名称";
					}else if(jsonChunk[k] === "descriptor"){
						jsonChunkTitle = "描述";
					}else{
						jsonChunkTitle = jsonChunk[k];
					}
					oTr += "<th>"+jsonChunkTitle+"</th><td>"+tableModel[jsonChunk[k]]+"</td>";
					i++;
				}
				if (jsonChunk.length < columnLayout) {
                    oTr += digitnexus.emptyRowBuilder(columnLayout - jsonChunk.length);
                }
				oTr += "</tr>";
				detailTable += oTr;
				split += columnLayout;
			}
		}
		detailTable += "</tbody></table></form>";
		this.formTableDiv.append(detailTable);
	},
	resize : function(){
		
	}
});

window.ReportDetailViewToolBar = Backbone.View.extend({
    tagName: "div",
    className: "toolBar",
    render: function() {
        //this.$el.append(new EditorViewButton({parentView:this.options.parentView}).render().el);
        return this;
    }
});

window.ReportChartViewToolBar = Backbone.View.extend({
	tagName : "div",
	className : "toolBar",
	initialize : function(){
		
	},
	render : function(){
		//this.$el.append(new ReportFilterButton({parentView:this}).render().el);
		this.$el.append(new ReportPrintButton({parentView:this.options.parentView}).render().el);
		var form = "<form name='exportForm' id='exportForm' method='get' style='display:none;'></form>";
		this.$el.append(form);
		return this;
	}
});

window.ReportButton = Backbone.View.extend({
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
            "class": this.getSignClassName()
        }));
        spanJqueryObj.append(this.getLabel());
        return this;
    },
    getLabel: function() {
        return "";
    },
    getSignClassName : function(){
    	return "";
    },
    onClick: function() {
    	
    }
});

window.ReportFilterButton = ReportButton.extend({
	getLabel: function() {
        return lable_reportManager_filter;
    },
    getSignClassName : function(){
    	return "btn_icon3 icon_search2";
    },
    onClick: function() {
    	//console.log('Report Filter Button');
    }
});

window.ReportPrintButton = ReportButton.extend({
	getLabel: function() {
        return lable_reportManager_print;
    },
    getSignClassName : function(){
    	return "btn_icon3 icon_print";
    },
    onClick: function() {
    	//digitnexus.reporting.Constants.PRINTURL
    	var action = "/"+digitnexus.util.context + digitnexus.reporting.Constants.PRINTURL + digitnexus.reporting.Constants.PRINTID;
    	var formNode = digitnexus.util.findDomObj('exportForm');
    	if((!digitnexus.util.isEmpty(action))&&(!digitnexus.util.isEmpty(digitnexus.reporting.Constants.PRINTID))){
    		formNode.action = action;
    		formNode.submit();
    	}else{
    		alert("the printId is not allow null !");
    	}
    }
});

window.EditorViewButton = EditViewButton.extend({
    onClick: function() {
    	//console.log($("#"+this.options.parentView.formId));
    },
    getLabel: function() {
        return label_Edit;
    }
});

window.ReportTopToolBarView = Backbone.View.extend({
	tagName : 'div',
	className : 'toolBar',
	initialize : function(){
		this.parentView = this.options.parentView;
		this.id = this.options.parentView.id+"_tooBar";
		this.$el.attr({
			id: this.id
		});
	},
	render : function(){
		//this.searchView=new SearchView();
		//this.$el.append(this.searchView.render().el);
		this.$el.append("<div class='blank_line'></div>");
		
		this.$el.append(new ReportRefreshButton({model:this.model,panel:this.parentView}).render().el);
		//this.$el.append(new ListSearchButton({panel:this.parentView}).render().el);
		
		return this;
	},
	getHeight : function(){
		var toolBarDiv = $("div#"+this.id);
		return toolBarDiv.height();
	}
});

window.ReportRefreshButton = ListTopButton.extend({
	className:'tool_l tool_refresh',
	initialize:function(){
		this.reportView = this.options.panel;
		this.$el.attr({
			href:'#',
			title:label_refresh
		});
	},
	onClick:function(){
		var panelView = this.reportView;
		panelView.reportList.fetch({
			groupId : panelView.article,
			success : function(data) {
				panelView.$el.empty();
				panelView.renderReportView(panelView.$el,data);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});
	}
});