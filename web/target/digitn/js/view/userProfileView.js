/**
 * User Profile Setting Js
 */
UserProfile = {
	init : function(){
		var self = this;
		var $divUserEle = $("div.top_admin");
		var html = $divUserEle.html();
		this.userName = digitnexus.getCurrentUserInfo().username;
		$divUserEle.empty().append(viewCreator.make("a",{"title":label_User_Profile_Setting},html));
		$divUserEle.click(function(){
			self.openUserProfileView(self.userName);
		});
	},
	openUserProfileView : function(userName){
		var self = this;
		var $doc = $(document);
		var dialogWid,dialogHei;
		dialogWid = parseInt($doc.width()-200);
		dialogHei = parseInt($doc.height()-100);
		this.dialog = $(viewCreator.make("div",{"title":label_User_Profile_Setting}));
		this.container = new UserProfileView({articleId:userName,parentArea:{width:dialogWid,height:dialogHei}});
		this.dialog.append(this.container.render().el);
		this.dialog.dialog({
			show: "blind",
			width: dialogWid,
			height: dialogHei,
			position: 'center',
			modal: true,
			close: function( event, ui ) {
				//here is remove the dialog content, include the dialog itself.
				self.dialog.remove();
			}
		});
	}
}

window.UserProfileView = Backbone.View.extend({
	tagName : 'div',
	className : 'userprofileview',
	initialize : function(){
		this.parentArea = this.options.parentArea;
		this.$el.attr({
			style:'width:'+(this.parentArea.width-20)+'px;height:'+(this.parentArea.height-20)+'px;'
		});
	},
	render : function(){
		this.leftView = $(viewCreator.make("div",{"class":"userprofileleftview"}));
		this.rightView = $(viewCreator.make("div",{"class":"userprofilerightview"}));
		this.$el.append(this.leftView).append(this.rightView);
		this.generateLeftViewContent();
		this.generateRightViewContent();
		return this;
	},
	generateLeftViewContent : function(){
		var userInformationProfileItem = new UserProfileItem({
			title : label_User_Information,
			content : new UserProfileUserInformationView({articleId:this.options.articleId,userProfileView:this})
		});
		this.leftView.append(userInformationProfileItem.render().el);
	},
	generateRightViewContent : function(){
		var themeProfileItem = new UserProfileItem({
			title : label_settingSkinTitle,
			content : new UserProfileUserThemeView()
		});
		this.rightView.append(themeProfileItem.render().el);
		var languageProfileItem = new UserProfileItem({
			title : label_languageSettingTitle,
			content : new UserProfileUserLanguageView()
		});
		this.rightView.append(languageProfileItem.render().el);
		//here is remove the relate the report check with QA (Samuel)
		/*var reportRelatedProfileItem = new UserProfileItem({
			title : label_User_Report_Related,
			content : new UserProfileUserReportRelatedView()
		});
		this.rightView.append(reportRelatedProfileItem.render().el);*/
	}
});

window.UserProfileItem = Backbone.View.extend({
	tagName : 'div',
	className : 'userprofileItem',
	initialize : function(){
		this.title = this.options.title;
		this.content = this.options.content;
	},
	render : function(){
		var self = this;
		this.header = $(viewCreator.make("div",{"class":"userprofileItemHeader"}));
		this.body = $(viewCreator.make("div",{"class":"userprofileItemBody"}));
		this.$el.append(this.header).append(this.body);
		
		var ulEle = $(viewCreator.make("ul",{"class":"edit"}));
		var titleEle = $(viewCreator.make("h3"));
		this.header.append(ulEle).append(titleEle);
		titleEle.append(this.title);
		
		var liEle = $(viewCreator.make("li"));
		ulEle.append(liEle);
		var aEle = $(viewCreator.make("a",{"class":"icon","title":label_User_Profile_ATitle}));
		liEle.append(aEle);
		aEle.click(function(){
			self.saveProfileItemValue();
		});
		
		this.body.append(this.content.render().el);
		
		return this;
	},
	saveProfileItemValue : function(){
		if(this.content.save && jQuery.isFunction(this.content.save)){
			this.content.save();
		}
	}
});

window.UserProfileUserInformationToolBar = Backbone.View.extend({
	className: "toolBar",
	render : function(){
		 this.$el.append(new SaveUserProfileEditViewButton({
	            editView: this.options.editView
	        }).render().el);
		return this;
	}
});

window.SaveUserProfileEditViewButton = EditViewButton.extend({
    onClick: function() {
        this.options.editView.save();
    },

    getLabel: function() {
        return label_save;
    }
});

window.UserProfileUserInformationEditView = EditView.extend({
	tagName : 'div',
	initialize : function(){
		this.parentView = this.options.parentView;
		this.modifiedArticleName = digitnexus.modifiedArticleName(this.parentView.articleName);
		this.model = this.parentView.articleData.attributes;
		this.articleModel = this.parentView.articleData;
		this.articleEditMeta = this.parentView.articleEditMeta;
	},
	render : function(){
		if (this.formId === null || this.formId === undefined) {
            this.formId = 'form_UserProfile_' + this.modifiedArticleName;
        }
		this.form = $(viewCreator.make("form", {
            action: "",
            method: 'post',
            id: this.formId
        }));
        this.$el.append(this.form);
        this.generateFormTable();
		return this;
	},
	generateFormTable : function(){
	    var table = $(viewCreator.make("table", {id:'form_table_'+this.modifiedArticleName,"class":"table_2"}));
	    this.form.append(table);
	    var tbody = $(viewCreator.make("tbody"));    
	    table.append(tbody);
	    
	    var columnLayout = this.articleEditMeta.columnLayout;
	    this.mainFields = [];
	    var metaDataFields = this.articleEditMeta.fields;
	    this.idField = this.articleEditMeta.idField;
	    
	    for(var i = 0; i < metaDataFields.length; i ++){
	    	var fieldMetaData = metaDataFields[i];
	    	if (fieldMetaData.hidden) {
                continue;
            }

            //Ignore attachment if this is add
            if (fieldMetaData.attachment&&!fieldMetaData.showAdd) {
                continue;
            }
            if(!fieldMetaData.editDisplay){
            	continue;
            }
            //here is add some condition filter the metaData.
            if (!((fieldMetaData.dataType == 'COLLECTION') || (fieldMetaData.dataType == "BOOLEAN") || (fieldMetaData.dataType == "ENUMERATION") ||(fieldMetaData.dataType == 'REFERENCE'))) {
            	this.mainFields[this.mainFields.length] = fieldMetaData;
            }
	    }
	    
	    for(var i = 0,split = columnLayout; i < this.mainFields.length;){
	    	var jsonChunk = this.mainFields.slice(i, split);
	    	var oTr = "<tr>";
	    	for(var j = 0; j < jsonChunk.length; j ++){
	    		oTr += this.buildRow(jsonChunk[j]);
	    		++i;
	    	}
	    	oTr += "</tr>";
	    	tbody.append(oTr);
	    	split += columnLayout;
	    }
	},
	buildRow : function(metaData){
		var oTd = "<th>" + metaData.displayName;
        if (metaData.mandatory) {
            oTd += "<sup style='color:red;'>*</sup>";
        }
        oTd += "</th>";
        oTd += "<td>" + this.getColumnComponent(metaData) + "</td>";
        return oTd;
	},
	getColumnComponent : function(metaData){
		var modifiedArticlePropertyName = this.modifiedArticleName+"_"+metaData.name;
		var columnComponect = "<input type='text' style='width:98%;' name='"+metaData.name+"' id='"+ modifiedArticlePropertyName +"' ";
		if(this.idField.name === metaData.name){
			columnComponect += " readOnly='true' disable='disable' ";
		}
		if (metaData.length > -1) {
			columnComponect += " maxlength='" + metaData.length + "' ";
        }
		//metaData.name in class is used for data binding 
		columnComponect += " class='" + modifiedArticlePropertyName + " " + this.getValidationClass(metaData) + "' ";
        
		columnComponect += " value='"+this.model[metaData.name]+"' ";
		columnComponect += " />";
		return columnComponect;
	},
	cloneObjectToArray:function(source){
		var arr = [];
		for(var p in source){
			var element = {};
			element["name"]=p;
			element["value"] = source[p];
			arr.push(element);
	    }
		return arr; 
	},
	save : function(){
		var self = this;
		var isValid = this.form.valid();
		if(isValid){
			var saveJsonInfo = this.mergerTheChangeToModel();
			//here need to save the json string to beckend, so...
			//here is need to decide that when the model save success to close the dialog and parent dialog or other doing.
			digitnexus.ajaxPut('/article/edit/data/'+this.parentView.articleName,JSON.stringify(saveJsonInfo), false, function(){
				self.parentView.detailView.onArticleSelection(self.parentView.articleId);
				self.parentView.fetchArticleData(self.parentView.articleId);
				AppView._showMessage(label_news_add_success,"success");
			}, function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			});
			
			this.parentView.dialog.dialog("close");
		}
	},
	mergerTheChangeToModel:function(){
		var model = {};
		var modelArray = this.cloneObjectToArray(this.model);
		for(var j = 0; j < modelArray.length; j ++){
			var columnDomObj = this.findObj(this.modifiedArticleName+"_"+modelArray[j].name);
			if(columnDomObj != null && columnDomObj != ""){
				if(!(modelArray[j].value === columnDomObj.value)){
					this.setChangeToModelValue(model,modelArray[j].name,columnDomObj.value);
				}else{
					this.setChangeToModelValue(model,modelArray[j].name,modelArray[j].value);
				}
			}else{
				this.setChangeToModelValue(model,modelArray[j].name,modelArray[j].value);
			}
		}
		return model;
	},
	setChangeToModelValue : function(model,key,value){
		var currentFields = null;
		var mainFields = this.articleEditMeta.fields;
		for(var index = 0; index < mainFields.length; index++){
			if(mainFields[index].name === key){
				currentFields = mainFields[index];
				break;
			}
		}
		var val = null;
		if(currentFields!=null&&currentFields!=""){
			var dataType = currentFields.dataType;
			switch(dataType){
				case 'REFERENCE' :
					val = this.convertValueObject(value);
					break;
				case 'COLLECTION' : 
					val = this.convertArrayObjectId(value);
					break;
				default :
					val = value;
					break;
			}
		}else{
			val = value;
		}
		model[key] = val;
	},
	findObj : function(id){
		return digitnexus.util.findDomObj(id);
	},
	convertArrayObjectId : function(value){
		var _array = [];
		for(var index = 0; index < value.length; index ++){
			var element = {'id':value[index].id};
			_array.push(element);
		}
		return _array;
	},
	convertValueObject : function(value){
		if(value!=null&&value!=""){
			return {'id':value.id,'name':value.name};
		}else{
			return;
		}
	}
});

window.UserProfileUserInformationView = Backbone.View.extend({
	tagName : 'div',
	className : 'detailview-tab-content',
	initialize : function(){
		this.articleName = "com.digitnexus.core.domain.User";
		this.articleEditMeta = ArticleEditMeta.getMeta(this.articleName);
        this.articleData = new ArticleData(null, {
            remark: this.articleName
        });
        this.articleId = this.options.articleId;
        this.userProfileView = this.options.userProfileView;
	},
	render : function(){
        this.detailView = this.getDetailView({
            el:this.el,
            id: "detail_"+digitnexus.modifiedArticleName(this.articleName),
            model: this.articleData,
            articleEditMeta: this.articleEditMeta
        });
         this.detailView.render();
         //Set id explicitly to model as our urls can not be strictly rest as required by backbone
         this.articleData.id = this.articleId;
         this.fetchArticleData(this.articleData.id);
		return this;
	},
	getDetailView : function(options){
		var detailView=DetailView.getView(this.articleName,options);
        if(!detailView){
            detailView=new DetailView(options);
        }
        return detailView;
	},
	fetchArticleData : function(articleId) {
        var self = this;
        //here is add the success function to support bind the signature event..so... modify by bill
        this.articleData.fetch({
            id: articleId,
            data: {
                id: articleId
            },
            success: function() {
                self.detailView.bindSignatureEvent();
                if (self.articleEditMeta.comments === true) {
                    self.detailView.bindCommentsEvent();
                }
            }
        });
    },
    save : function(){
    	var self = this;
		var $doc = this.userProfileView.$el;
		var dialogWid,dialogHei;
		dialogWid = parseInt($doc.width()-100);
		dialogHei = parseInt($doc.height()-100);
		this.dialog = $(viewCreator.make("div",{"title":label_User_Information}));
		this.container = $(viewCreator.make('div',{"class":"editview-tab-content"}));
		this.dialog.append(this.container);
		this.renderEditView();
		this.dialog.dialog({
			show: "blind",
			width: dialogWid,
			height: dialogHei,
			position: 'center',
			modal: true,
			close: function( event, ui ) {
				//here is remove the dialog content, include the dialog itself.
				self.dialog.remove();
			}
		});
		//after the content is initial success then set the dialog height;
		this.dialog.dialog({height:parseInt(this.container.height()+15)});
    },
    renderEditView : function(){
    	var containerToolBarEl = viewCreator.make('div',{"class":"toolBar"});
		this.container.append(containerToolBarEl);
		
		var containerEditViewEl = viewCreator.make('div');//,{"class":"editview-tab-content"}
		this.container.append(containerEditViewEl);
		//
		this.containerEditView = new UserProfileUserInformationEditView({
			el:containerEditViewEl,
			parentView:this
		});
		this.containerToolBar = new UserProfileUserInformationToolBar({
			el:containerToolBarEl,
			editView:this.containerEditView
		});
		this.containerToolBar.render();
		this.containerEditView.render();
    }
});

window.UserProfileUserThemeView = Backbone.View.extend({
	tagName : 'div',
	className : 'skinSetting',
	initialize : function(){
		this.currentValue = window.CURRENT_SKIN_DIR;
	},
	render : function(){
		var tableContainerEle = $(viewCreator.make("table",{"class":"table_3 skinSetting"}));
		this.$el.append(tableContainerEle);
		this.topTrContainerEle = $(viewCreator.make("tr"));
		tableContainerEle.append(this.topTrContainerEle);
		this.bottomTrContainerEle = $(viewCreator.make("tr"));
		tableContainerEle.append(this.bottomTrContainerEle);
		this.generateTopTrPart();
		this.generateBottomTrPart();
		return this;
	},
	generateTopTrPart : function(){
		var topTrItemGenerator = function(src){
			var tdContainerEle = $(viewCreator.make("td"));
			tdContainerEle.append(viewCreator.make("img",{"src":src}));
			return tdContainerEle;
		}
		this.topTrContainerEle.append(topTrItemGenerator("skins/skin1/skin1.png"));
		this.topTrContainerEle.append(topTrItemGenerator("skins/skin2/skin2.png"));
		this.topTrContainerEle.append(topTrItemGenerator("skins/skin3/skin3.png"));
		this.topTrContainerEle.append(topTrItemGenerator("skins/skin4/skin4.png"));
		this.topTrContainerEle.append(topTrItemGenerator("skins/skin5/skin5.png"));
		
	},
	generateBottomTrPart : function(){
		var self = this;
		var bottomTrItemGenerator = function(name,value){
			var thContainerEle = $(viewCreator.make("th"));
			thContainerEle.append(name);
			var radioEle = null;
			if(self.currentValue === value){
				radioEle = viewCreator.make("input",{"type":"radio","name":"skin","value":value,"checked":"checked"});
			}else{
				radioEle = viewCreator.make("input",{"type":"radio","name":"skin","value":value});
			}
			thContainerEle.append(radioEle);
			return thContainerEle;
		}
		this.bottomTrContainerEle.append(bottomTrItemGenerator(label_skin1,"skin1"));
		this.bottomTrContainerEle.append(bottomTrItemGenerator(label_skin2,"skin2"));
		this.bottomTrContainerEle.append(bottomTrItemGenerator(label_skin3,"skin3"));
		this.bottomTrContainerEle.append(bottomTrItemGenerator(label_skin4,"skin4"));
		this.bottomTrContainerEle.append(bottomTrItemGenerator(label_skin5,"skin5"));
	},
	save : function(){
		var vals = [];
		this.values = vals;
		var children = this.bottomTrContainerEle.children();
		for(var index = 0; index < children.length; index++){
			var childList = children[index].childNodes || children[index].children;
			if(childList[1].checked){
				vals.push(childList[1].value);
			}
		}
		if(vals && vals.length > 0){
			var self = this;
			//url : PUT /rest/uimanage/userprofile/saveTheme/{value}
			//here is need to save the language to beck end, to UserProfile Module..
			digitnexus.ajaxWithDataTypeAndType("/rest/uimanage/userprofile/saveTheme/"+vals[0], 
					null, 
					'application/json',
					'PUT',
					function(response){
						if(self.values[0].trim()===self.currentValue.trim()){
							AppView._showMessage(label_news_add_success,"success");
						}else{
							window.location.reload();
							AppView._showMessage(label_news_add_success,"success");
						}
						//console.log(response);
						//eval("window.CURRENT_SKIN_DIR="=response.value);
						//var CURRENT_SKIN_DIR = "${CURRENT_SKIN_DIR}";
					}, 
					function(xhr, status, exception){
						AppView._showErrors(xhr);
					});
		}
	}
});

window.UserProfileUserLanguageView = Backbone.View.extend({
	tagName : 'div',
	className : 'lanuageSetting',
	initialize : function(){
		this.currentValue = CookieUtil.currentLocale;
	},
	render : function(){
		this.ulContainerEle = $(viewCreator.make("ul"));
		this.$el.append(this.ulContainerEle);
		this.ulContainerEle.append(this.generateLiItem(label_simple_chinese, "zh_CN"));
		this.ulContainerEle.append(this.generateLiItem(label_english, "en"));
		return this;
	},
	generateLiItem : function(name,value){
		var liContainerEle = $(viewCreator.make("li"));
		var radioEle = null;
		if(this.currentValue === value){
			radioEle = viewCreator.make("input",{"type":"radio","name":"lan","value":value,"checked":"checked"});
		}else{
			radioEle = viewCreator.make("input",{"type":"radio","name":"lan","value":value});
		}
		liContainerEle.append(radioEle);
		liContainerEle.append(name);
		return liContainerEle; 
	},
	save : function(){
		var vals = [];
		this.values = vals;
		var children = this.ulContainerEle.children();
		for(var index = 0; index < children.length; index++){
			var childList = children[index].childNodes || children[index].children;
			if(childList[0].checked){
				vals.push(childList[0].value);
			}
		}
		if(vals && vals.length > 0){
			var self = this;
			//url : PUT /rest/uimanage/userprofile/saveLanguage/{value}
			//here is need to save the language to beck end, to UserProfile Module..
			digitnexus.ajaxWithDataTypeAndType("/rest/uimanage/userprofile/saveLanguage/"+vals[0], 
					null, 
					'application/json',
					'PUT',
					function(response){
						if(self.values[0].trim()===self.currentValue.trim()){
							AppView._showMessage(label_news_add_success,"success");
						}else{
							window.location.reload();
							AppView._showMessage(label_news_add_success,"success");
						}
						//console.log(response);
						//eval("window.LAN="=response.value);
						//var LAN = '${lan}';
					}, 
					function(xhr, status, exception){
						AppView._showErrors(xhr);
					});
		}
	}
});

window.UserProfileUserReportRelatedView = Backbone.View.extend({
	tagName : 'div',
	initialize : function(){
		//this.reportProfileList = new ReportProfileData();
	},
	render : function(){
		/*var self = this;
		this.reportProfileList.fetch({
			success : function(data) {
				self.renderUserProfileReportRelateView(self.$el,data);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});*/
		return this;
	},
	renderUserProfileReportRelateView : function(parent,data){
		//console.log(data);
		//console.log(parent);
	},
	save : function(){
		alert("UserProfileUserReportRelatedView +++");	
	}
});