//pollicy
(function(){
	
	DetailView.registerRenderer('com.digitnexus.core.acl.dataobject.AclExpression', function(options) {
		  var CustomEditView = DetailView.extend({   
			  showContent: function() {

			        if (!this.rendered) {
			            this.generateTemplate();
			            this.rendered = true;
			            this.resetState = true;
			        }

			        if (this.resetState) {
			            this.$el.empty();
			            this.$el.append(this.template({
			                modelAttributes: this.model.attributes,
			                selectionValues: this.selectPropertyToValues
			            }));
			            this.renderCollectionReferences();
			            this.renderAttachments();			           
			            this.renderAssinmentView();
			            this.resetState = false;
			            
			            if(this.elementsRenderer){
			              this.elementsRenderer.postRender(this.$el);
			            }
			        }
			  },
			  renderAssinmentView:function(){
				  this.assinmentView = new AssinmentView({parentView:this,readOnly:true}).render(); 				  
				  this.$el.append(this.assinmentView.el);
				  this.setAssignmentViewValue();
			  },
			  setAssignmentViewValue:function(){
	  	           //发送ajax请求获assinments	   
		    		 if(!this.isNew){
		    			 var self = this;	    		 
			    		 var id = String(this.model.get("id")).replace(",","");
			    		 this.assinmentView.setArticleId(id);
			    		 digitnexus.ajaxGet('/rest/acl/assignment?id=' + id, null, function(response) {
			    			 	self.assinmentView.setModelData(response);
			    		 	}, function(xhr, status, exception) {
			    		 		self.assinmentView.clearContent();
			    		 		AppView._showMessage(xhr.statusText, "error");
		    	         });
		    		 }	    		 
		    		 
		    }
			    
		  });
		  return new CustomEditView(options);
	});
		
	EditView.registerRenderer('com.digitnexus.core.acl.dataobject.AclExpression', function(options) {
	      var CustomEditView = EditView.extend({   
				
	    	  getTextBox:function(metaData, property,__uuId){
	            	
	        	var component = EditView.prototype.getTextBox.call(this,metaData, property,__uuId);
	        	component = component.replace("<input","<input style='width:98%;resize:none;'");
	        	
	        	if(metaData.name=="expression"||metaData.name=="description"){	            		
	        		component = component.replace("<input","<textarea");
	        	}	            	
	    	       	  	
	        	if(metaData.name=="expression"){            		
	        		component = component.replace("<input","<textarea");	        		
		            this.expressionData = metaData;		          
	        	}	            
	        	return component;
	    	  
	    	  },
	    	  
	    	  buildExpressionView:function(){	    		        
	    		  this.expressionView = new ExpressionView({
	    			  fieldMetaData: this.expressionData,
	                  articleEditMeta: this.options.articleEditMeta,
	                  isNew: this.isNew,
	                  parentView:this,
	                  parentNode:$("#"+this.id+"_"+this.expressionData.name).parent().empty()
	                 }).render();		    		  
	    		  //$("#"+this.id+"_"+this.expressionData.name).replaceWith(this.expressionView.$el);
	    	  },
	    	  
	    	  buildAssinmentView:function(){
	    		  this.assinmentView = new AssinmentView({parentView:this}).render();	    		  
	    		  this.$el.append(this.assinmentView.$el);
	    	  },
	    	  
	    	  setAssignmentViewValue:function(){
  	           //发送ajax请求获assinments	   
	    		 if(!this.isNew){
	    			 var self = this;	    		 
		    		 var id = String(this.model.get("id")).replace(",","");
		    		 this.assinmentView.setArticleId(id);
		    		 digitnexus.ajaxGet('/rest/acl/assignment?id=' + id, null, function(response) {
		    			 	self.assinmentView.setModelData(response);
		    		 	}, function(xhr, status, exception) {
		    		 		self.assinmentView.clearContent();
		    		 		AppView._showMessage(xhr.statusText, "error");
	    	         });
	    		 }	    		 
	    		 
	    	  },
	    	  
	    	  setExpressViewValue:function(){	
	    		  this.expressionView.setValue(this.model.get(this.expressionData.name));
	    	  },
	    	  
	    	  generateFormTable:function(parentComponent){
	    		  EditView.prototype.generateFormTable.call(this,parentComponent);	    		  
	    		  this.buildExpressionView();
	    		  if(!this.isNew){
	    			  this.buildAssinmentView();
	    		  }	    		  
	    	  },
	    	  
	    	  save:function(){
	    		  if(this.expressionData){
	    			  if(this.expressionView.isValid()){	 
	    				  appView.buttonBlocker.unblock();
	    				  return;
	    			  }else{
	    				  this.model.set(this.expressionData.name,this.expressionView.getValue());
	    			  }
	    			 
	    		  }
	    		  if(!this.isNew){
		    		  if(this.assinmentView.childViews.length>0&&!this.assinmentView.isValid()){
		    			  appView.buttonBlocker.unblock();
		    			  return;
		    		  }
	    		  }
	    		  EditView.prototype.save.call(this);
	    		  
	    		  if(!this.isNew){
	    			  this.assinmentView.save();
	    		  }
	    	  },
	    	  resetForm: function() {
	    		  EditView.prototype.resetForm.call(this);
	    		  this.expressionView.reset();  
	    	  },
	    	  showContent:function(){
	    		  if (!this.rendered && this.form === null) {
	    	            this.form = $(viewCreator.make("form", {
	    	                action: "",
	    	                method: 'post',
	    	                id: this.formId
	    	            }));
	    	            this.$el.append(this.form);

	    	            //More of the same id cause a bug
	    	            // this.form = $('#' + this.formId);
	    	            this.generateFormTable(this.form);
	    	            var bindings = Backbone.ModelBinder.createDefaultBindings(this.form, 'modelAttr');
	    	            this.modelBinder.bind(this.model, this.form, bindings);
	    	            this.setReferenceElementsValue();
	    	            this.setReferenceDropdownElementsValue();
	    	            this.setCollectionReferenceValues();
	    	            this.setReferenceArrayElements();
	    	            this.setExpressViewValue();
	    	            this.setAssignmentViewValue();
	    	            this.showContent();
	    	            this.form.validate();
	    	            this.rendered = true;
	    	            this.resetState = false;
	    	            //Right now only collection reference edit views are selectable. Assuming, if selectable, it is collection reference and not resize
	    	            if (!this.selectable) {
	    	                this.resize();
	    	            }
	    	            //Just callback, no information in it
	    	            this.$el.trigger($.Event("edit-view-rendered"));	    	            
	    	           
	    	            return;
	    	        }

	    	        if (this.resetState) {
	    	            this.resetForm();
	    	            this.resetState = false;
	    	            //set ref elements data because there is no model binding for ref elements
	    	            
	    	            this.setReferenceElementsValue();
	    	            this.setEnumerationDropdownElements();
	    	            this.setReferenceDropdownElementsValue();

	    	            this.setCollectionReferenceValues();
	    	            this.setColorElements();
	    	            this.setReferenceArrayElements();
	    	            this.setExpressViewValue();
	    	            this.setAssignmentViewValue();
	    	            this.showContent();
	    	        }
	    	  }
	    	  
	      });
	      return new CustomEditView(options);
	});	
	
	
})();

window.ExpressionView = Backbone.View.extend({
	tagName:"div",
	
	className: 'name',
	
	initialize:function(){		
		this.isNew = this.options.isNew;
		this.parentView = this.options.parentView;
		this.fieldMetaData = this.options.expressionData;
        this.articleEditMeta = this.options.articleEditMeta;
	},
	
	render:function(){
		this.options.parentNode.append(this.$el);
		var entityViewContainer = $(viewCreator.make("div",{"style":"text-align:right;"}));		
		this.$el.append(entityViewContainer);
		
		
		this.entityView = new SelectView({parentView:entityViewContainer,expressionView:this,items:[],placeholder:label_entity}).render();		
		this.propertyView = new SelectView({parentView:entityViewContainer,expressionView:this,items:[],placeholder:label_property}).render();		
		this.inserBtnView = new InserBtnView({expressionView:this});		
		entityViewContainer.append(this.inserBtnView.render().$el);
		
		var self = this;
		this.entityView.setChangeCallBack(function(value){
			//发送ajax请求 将实体类发送给后台 获取属性
			
//			digitnexus.ajaxGet("URL"+value, null, function(response) { 			 
//	 			 	self.propertyView.setItems(response); 			 	
//				}, function(xhr, status, exception) {	 		 		
//	 		 		AppView._showMessage(xhr.statusText, "error");
//	        });	
			
			var items = [];	
			self.propertyView.setItems(items||[]);
		});
		
		
		var textViewContainer = $(viewCreator.make("div",{"style":"margin:5px 0px;"}));	
		this.$el.append(textViewContainer);
		
		this.editTextView = new EditTextView({parentView:textViewContainer,expressionView:this}).render();
		
		//发送ajax请求获取 获取所有的实体类
		
//		digitnexus.ajaxGet("URL"+vallue, null, function(response) { 			 
//		 		self.entityView.setItems(response);		 	
//			}, function(xhr, status, exception) {	 		 		
//	 			AppView._showMessage(xhr.statusText, "error");
//		});	
		
		var items = [];
		this.entityView.setItems(items||[]);
		
		return this;
	},
	
	reset:function(){
		this.entityView.reset();
		this.propertyView.reset();
		this.editTextView.reset();
	},
	
	insert:function(){		
		if(this.entityView.getValue()==""||this.propertyView.getValue()==""){
			return;
		}
		this.editTextView.insert(this.entityView.getValue()+"."+this.propertyView.getValue());
	},
	
	getValue:function(){
		return 	this.editTextView.getValue();
	},
	
	setValue:function(value){
		this.editTextView.setValue(value);
	},
	
	isValid:function(){
		var value = this.getValue();
		this.editTextView.$el.next("label").remove();
		if(value === ""){
			//this.entityView.$el.append("<label class='error'>必填字段</label>");
			$("<label class='error'>"+error_required+"</label>").insertAfter(this.editTextView.$el);
			appView.buttonBlocker.unblock();
			return true;
		}
		return false;
	}

});


window.InserBtnView = Backbone.View.extend({
	tagName: "a",
    className: "tool_r btn_1",
    events: {
        'click': 'onClick'
    },

    initialize: function() {
        this.$el.attr("href", "#");
    },

    render: function() {
        this.$el.append("<span>" + label_insert + "</span>");
        return this;
    },
    
    onClick: function() {    	
    	this.options.expressionView.insert();
    }
});



window.SelectView = Backbone.View.extend({
	tagName:"select",
	
	initialize:function(){
		this.items = this.options.items;
		this.rendered = false;
		this.parentView = this.options.parentView;		
	},
	render:function(){
		this.$el.attr("data-placeholder",this.options.placeholder);
		this.$el.attr("style","width:120px;margin-left:10px;");
	
		this.$el.append("<option value=''></option>");
		
		this.parentView.append(this.$el);
		this.createOptions();	
		var self = this;//{allow_single_deselect:true,search_contains:true,no_results_text:no_results_text}
		this.$el.chosen()
			.change(function(){
				//console.log("ssssssssssssssssss")
				self.changeCallBack(this.value);
			});
		this.rendered = true;
		return this;
	},
	
	createOptions:function(){
		if(this.rendered){
			this.$el.empty();
			this.$el.append("<option value=''></option>");
		}		
		var options = "";
		
		if(this.items.length==0){
			this.$el.append("<option value=''></option>");	
		}
		
		//satanmu还没有给出数据结构 暂时先这么写
		for(var i=0;i<this.items.length;i++){
			this.$el.append("<option value='"+this.items[i].name+"'>"+this.items[i].name+"</option>");	
		}			
	},
	
	setItems:function(items){
		this.items=items;
		this.createOptions();		
		this.$el.trigger("liszt:updated");
	},
	
	changeCallBack:function(){
		
	},
	
	setChangeCallBack:function(callBack){
		this.changeCallBack=callBack;
	},
	
	reset:function(){
		this.createOptions();		
		this.$el.trigger("liszt:updated");
	},
	
	getValue:function(){
		return this.$el.val();
	}
	
});


window.EditTextView = Backbone.View.extend({
	tagName:"div",
	
	className:"",
	
	initialize:function(){
		this.items = this.options.items;
		this.rendered = false;
		this.parentView = this.options.parentView;		
	},
	
	render:function(){
		this.$el.attr("contenteditable","true");
		
		this.$el.attr("style","background-color:#ffffff;width:98%px;height:100px;border:1px solid #000; word-break: break-all;word-wrap:break-word; outline:none;  line-height: 1.33;");
		
		this.parentView.append(this.$el);
		return this;
	},
	
	reset:function(){
		this.$el.html("");
	},
	
	getValue:function(){
		return this.$el.html();
	},
	
	setValue:function(value){
		this.$el.html(value);
	},
	
	insert:function(value){
		var selection = null;
		var range = null;
		
		if(window.getSelection){
			this.$el.focus();
			selection = window.getSelection();
			range = selection.getRangeAt(0);
			range.collapse(false);
			
			var hasR = range.createContextualFragment(value);
			range.insertNode(hasR);			
	
			selection.removeAllRanges();
			selection.addRange(range)
			//alert(selection.toString())
		}else{
			this.$el.focus();			
			selection = document.selection;
			range = selection.createRange();

			range.pasteHTML(value);
			range.collapse(false);
			range.select();
		}
	}
})


window.AssinmentView = CollectionReferenceView.extend({
	initialize: function() {
		this.articleName = "com.digitnexus.core.acl.dataobject.AclExpressionAssociation";
        this.parentEditView = this.options.parentView;
        this.referenceMeta = ArticleEditMeta.getMeta(this.articleName);
        this.id = this.parentEditView.modifiedArticleName + '_' + this.referenceMeta.name;
        //To track newly added edit views
        this.childViews = [];
        this.rendered = false;
        this.readOnly = false;
        this.articleId = null;
        if (this.options.readOnly) {
            this.readOnly = this.options.readOnly;
        }
    },

    render: function() {
        this.$el.append('<h3 class="title2"><div class="title2_l"><div  class="title2_r"><div class="title2_m">' + this.referenceMeta.displayName + '</div></div></div></h3>');
        var divElement = viewCreator.make("div", {
            "class": "detailview-content-3"
        });
        this.$el.append(divElement);

        this.containerEl = $(divElement);
        this.childViewMeta = ArticleEditMeta.getMeta(this.articleName);
        this.showContent();

        return this;
    },    
	setArticleId:function(id){
		this.articleId = id;
	},
    save:function(){
    	//获取所有的选项
    	var modelsData = this.getModelData();
    	var data =[];
    	for(var j=0;j<modelsData.length;j++){
    		var o = {};
    		o["role"]={}
    		o.role.id=modelsData[j].role.id;
    		o["permission"]={};
    		o.permission.name=modelsData[j].permission.name;
    		data.push(o);
    	}
    	
    	var modelsDataJson = JSON.stringify(data);
    	//console.log(modelsDataJson);
    	//var model11 = 0;
    	//发送ajax请求保存Assinment //需要santanu提供接口
    	
    	$.ajax({
    		'url':'/' + digitnexus.util.context+'/rest/acl/assignment?id='+this.articleId,
    		'type':'PUT',
    		'data':modelsDataJson,
    		'dataType':'json',
    		'contentType': 'application/json',
    		'success':function(){},
    		'error':function(){},
    		'async':false
    	});
    	
    	
    	
//		digitnexus.ajaxPost("URL", modelsDataJson, function(response) { 			 
// 			//	AppView._showMessage("", "success");	 	
//			}, function(xhr, status, exception) {	 		 		
//			//	AppView._showMessage(xhr.statusText, "error");
//		});	
    	
    }
});