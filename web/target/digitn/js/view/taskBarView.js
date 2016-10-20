window.TaskBarView=Backbone.View.extend({
	tagName:"div",
	
	initialize:function(){
		this.listView=this.options.listView;
		var self=this;
		this.listView.$el.bind('articleList-checked', function(checkedEvent){
			self.onArticleChecked(checkedEvent);
		});
		this.articleName=this.options.articleName;
		
	},
	
	render:function(){
		return this;
	},
	
	onArticleChecked:function(checkedEvent){
		var selectedIds=checkedEvent.ids;
		if(selectedIds!=null && selectedIds.length>0){
			this.loadActiveTaskDefinitions(selectedIds);
		}else{
			this.renderTasks(null);
		}
	},
	
	loadActiveTaskDefinitions:function(articleIds) {
		var self = this;
		var queryPamas = "";
		for (var i in articleIds) {
			queryPamas += "id=" +articleIds[i] + "&";
		}
		
		queryPamas = queryPamas.substring(0, queryPamas.length - 1);
		digitnexus.ajaxGet('/article/task/def/' + this.articleName,
				queryPamas,
				function(response) {
					self.renderTasks(response);
				},
				function(xhr, status, exception) {
					AppView._showErrors(xhr.responseText);
				});	
	
	},
	
	renderTasks:function(response) {
		this.$el.empty();
		if (response) {
			
			//the response is supposed to be an array of task definitions
			for (var i in response) {
				var taskDef = response[i];
				if (taskDef) {
					this.generateUIComponent(taskDef)
				}
			}
		}
	},
	
	generateUIComponent:function(taskDef){
		
		if (taskDef) {
			var displayType=taskDef.display?taskDef.display.displayType:"";
			var self=this;
			switch (displayType) {
				case 'SELECT':
					var selectComponent=new TaskSelectComponent({model:taskDef});
					var selectComponentButton=$(viewCreator.make("a",{"href":'#',"class":'tool_r btn_1'}));
					selectComponentButton.append("<span>"+label_buttons_go+"</span>");
					selectComponentButton.bind('click',function(){
						self.performAction(taskDef,selectComponent.getSelectedValue());
					});
					this.$el.append(selectComponentButton);
					this.$el.append(selectComponent.render().el);
					break;
				case 'BUTTON':
					if (taskDef.display && taskDef.display.selectOptions && (taskDef.display.selectOptions.length > 0)) {
						var selectOptions=taskDef.display.selectOptions;
						for (var i in selectOptions) {
							this.$el.append(new TaskBarButtonComponent({model:taskDef,taskBarView:this,title:selectOptions[i].value,displayName:selectOptions[i].displayName,action:selectOptions[i].value}).render().el);
						}
					}else{
						this.$el.append(new TaskBarButtonComponent({model:taskDef,taskBarView:this,title:taskDef.displayName,displayName:taskDef.displayName}).render().el);
					}
					break;
				case 'NONE':
					break;
				default:
					break;
			}
		}
	},
	
	performAction:function(taskDef, action){
		var jsonRequest="";
		if(action && action!==null){
			jsonRequest=JSON.stringify({'ids' : this.listView.getSelectedIds(), 'action' : action})
		}else{
			jsonRequest=JSON.stringify({'ids' : this.listView.getSelectedIds()})
		}
		var self=this;
		digitnexus.syncPost('/article/task/perform/' + taskDef.name + "/" + this.articleName,
				jsonRequest,
				function(response) {
			        AppView._showMessage(taskDef.displayName +" "+label_completed,"success");
			        self.listView.refresh();
				},
				function(xhr, status, exception) {
					AppView._showErrors(xhr);
				});
		
	}
	
});

window.TaskSelectComponent=Backbone.View.extend({
	tagName:"select",
	className:"tool_r select_1 chzn-select",
	events:{
		
	},
	
	initialize:function(){
		this.$el.attr("style","font-size: 15px");
	},
	
	render:function(){
		var selectOptions=this.model.display.selectOptions;
		for(i in selectOptions){
			this.$el.append(viewCreator.make('option',{'value':selectOptions[i].value},selectOptions[i].displayName));
		}
		return this;
	},
	
	getSelectedValue:function(){
		return this.el.options[this.el.selectedIndex].value
	}
	
});

window.TaskBarButtonComponent=Backbone.View.extend({
	tagName:"a",
	className:"tool_r btn_1",
	events:{
	     'click':'onClick'
    },
	
	initialize:function(){
		this.$el.attr({
			href:"#",
			title:this.options.title
		});
		
		this.taskBarView=this.options.taskBarView;
	},
	
	render:function(){
		this.$el.append(viewCreator.make('span',null,this.options.displayName));
		return this;
	},
	
	onClick:function(){
		var action=null;
		if(this.options.action){
			action=this.options.action;
		}
		
		this.taskBarView.performAction(this.model,action);
	}
	
});