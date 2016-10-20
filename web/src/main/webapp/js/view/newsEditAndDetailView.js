/**
 * 
 */

window.NewsViewContainer = Backbone.View.extend({
	attachmentArticleName : "com.digitnexus.common.document.dataobject.Document",
	allowUploadAttachmentNumber : 5,
	resetAllowUploadAttachmentNumber : 5,
	initAllowUploadAttachment : function(num){
		if(num && parseInt(num) > 0){
			this.allowUploadAttachmentNumber=num;
			this.resetAllowUploadAttachmentNumber=num;
		}
	},
	setAllowUploadAttachment : function(num){
		num = parseInt(num);
		if(parseInt(num) >= 0){
			this.allowUploadAttachmentNumber=num;
		}
	},
	resetAllowUploadAttachment : function(){
		this.allowUploadAttachmentNumber=this.resetAllowUploadAttachmentNumber;
	},
	render : function(){
		
		return this;
	},
	generateUploadAttachmentView:function(uploaderPanelId,iframeContainer,acceptObject,allowUploadAttachmentNumber){
		var self = this;
		var $uploaderPanel = $('#'+uploaderPanelId);
		var targetIframeId = uploaderPanelId;
		uploaderPanelId = uploaderPanelId +"_"+ Math.floor(Math.random()*1000);
		var formContainerEle = $(viewCreator.make("form",{"name":"newsFileForm_"+uploaderPanelId,"id":"newsFileForm_"+uploaderPanelId,"method":"post","enctype":"multipart/form-data","target":"news_UploadFrame_file_"+targetIframeId,"action":digitnexus.util.ctx + NewsViewConfigureObject.url.newsUploadAttachmentUrl}));
		var tableContainerEle = $(viewCreator.make("table",{"class":"table_2"}));
		var trContainerEle = $(viewCreator.make("tr",{}));
		tableContainerEle.append(trContainerEle);
		
		var inputEle = $(viewCreator.make("input",{"id":"fileUp_"+uploaderPanelId,"type":"file","name":"fileUp","contentEditable":"false","size":"80"}));
		var submitEle = $(viewCreator.make("input",{"type":"button","id":"newsSubmitButton_"+uploaderPanelId,"value":lable_news_upload,"uploadable":true}));
		var fileDivInfoEle = $(viewCreator.make("div",{"id":"file_info_"+uploaderPanelId}));
		var tdContainerEle = $(viewCreator.make("td",{}));
		tdContainerEle.append(inputEle).append(submitEle).append(fileDivInfoEle);
		trContainerEle.append(tdContainerEle);
		
		formContainerEle.append(tableContainerEle);
		$uploaderPanel.append(formContainerEle);
		this.uploadify(submitEle,inputEle,fileDivInfoEle,formContainerEle,iframeContainer,acceptObject);
		if(self.allowUploadAttachmentNumber && self.allowUploadAttachmentNumber < self.resetAllowUploadAttachmentNumber){
			var deleteAEle = $(viewCreator.make("div",{"class":"iconbtn_1 btn_del_1","title":label_delete}));
			var deleteTdEle = $(viewCreator.make("td",{}));
			trContainerEle.append(deleteTdEle);
			deleteTdEle.append(deleteAEle);
			deleteAEle.click({formContainerEle:formContainerEle},function(event){
				var attachmentInfo = event.data.formContainerEle.attr("attachmentId");
				var callBack = function(){
					self.allowUploadAttachmentNumber++;
					event.data.formContainerEle.remove();
				};
				if(attachmentInfo && attachmentInfo != null && attachmentInfo != ""){
					attachmentInfo = jQuery.parseJSON(attachmentInfo);
					self.deleteAttachment(attachmentInfo.id,true,callBack);
				}else{
					callBack();
				}
			});
		}
		return trContainerEle;
	},
	uploadify:function(submitEle,inputEle,fileDivInfoEle,formContainerEle,iframeContainerEle,acceptObject){
		var self = this;
		submitEle.click({submitButton:submitEle,fileUpInput:inputEle,fileDivInfo:fileDivInfoEle,formEntity:formContainerEle,iframeEntity:iframeContainerEle},function(event){
			var fileObject = event.data.fileUpInput.val();
			if(fileObject){
				var contenteditable = event.data.fileUpInput.attr('repeatable');
				if(contenteditable){
					//AppView._showMessage(label_news_repeat_upload_prompt,"error");
					return;
				}
				var fileExtByMedia = getExtensionByMedia('IMAGE');
				var fileName = fileObject.toLowerCase();
				var iflag = false;
				for(var i = 0; i < fileExtByMedia.length; i++){
					if (fileName.indexOf(fileExtByMedia[i]) > 0){
						iflag = true;
						break;
					}
				}
				if(iflag){
					var allUploadButton = event.data.formEntity.parent().find("input[type=button][uploadable=true]");
					allUploadButton.attr("disabled","disabled");
					event.data.fileDivInfo.html(label_news_upload_statement);
					var documentIdText = acceptObject.val();
					if(documentIdText && documentIdText != null && documentIdText != ""){
						var formEntityId = event.data.formEntity.attr("id");
						var formDocumentIdInput = $("input#documentId_"+formEntityId+"_"+documentIdText);
						if(jQuery.isEmptyObject(formDocumentIdInput[0])){
							event.data.formEntity.append(viewCreator.make("input",{"type":"hidden","id":"documentId_"+formEntityId+"_"+documentIdText,"name":"documentId","value":documentIdText}));
						}else{
							formDocumentIdInput.val(documentIdText);
						}
					}
					event.data.formEntity.submit();
					event.data.fileUpInput.attr('repeatable',true);
					var _scrtime = setInterval(function(){
						var _documentIdText = $(event.data.iframeEntity[0].contentWindow.document.body).text();
						if(_documentIdText){
							_scrtime = clearInterval(_scrtime);
							_documentIdText = jQuery.parseJSON(_documentIdText);
							if(_documentIdText.errorCode != undefined){
								event.data.fileDivInfo.empty().html(_documentIdText.errorMessage);
								event.data.fileUpInput.val("");
							}else{
								var callBack = function(response){
									for(var i = 0; i < response.length; i ++){
										//here is not Compatible ff, ie, chrome, safari
										var fileName = event.data.fileUpInput.val();
										var patt = new RegExp(response[i].name);
										if(patt.test(fileName)){
											event.data.formEntity.attr("attachmentId",JSON.stringify(response[i]));
										}
									}
								}
								self.getAllAttachmentInformation(_documentIdText,callBack);
								acceptObject.val(_documentIdText);
								event.data.fileDivInfo.empty().html(label_news_upload_success);
								allUploadButton.removeAttr("disabled");
							}
						}
					},3000);
				}else{
					AppView._showMessage(label_news_upload_file_type_prompt,"error");
				}
			}else{
				AppView._showMessage(label_news_upload_not_null_validate,"error");
			}
		});
	},
	getAllAttachmentInformation:function(documentId,callBack){
		if(documentId&&documentId!=null&&documentId!=""){
			if(NewsViewConfigureObject.debug){
				console.log("execute the getAllAttachmentInformation function, documentId : "+documentId);
			}
			var params = "fieldName=document&id="+encodeURIComponent(documentId);
			digitnexus.ajaxRequest(NewsViewConfigureObject.url.newsListAllAttachmentUrl+encodeURIComponent(this.attachmentArticleName),
					params,
					function(response){
						if(callBack && jQuery.isFunction(callBack)){
							callBack(response);
						}
					},
					function(xhr, status, exception){
						AppView._showMessage(xhr.statusText,"error");
					}
			);
		}
	},
	fillTypeName:function(data,containerObj,selectionHelperId){
		var categroyData = eval(data);
		var categroyDataArr = new Array();
		for(var i = 0; i < categroyData.length; i ++){
			categroyDataArr.push(categroyData[i].name);
		}
		var entityNode = digitnexus.util.findDomObj('TypeNameSelection');
		selectionHelperId += "";
		if(selectionHelperId != null && selectionHelperId != ""){
			entityNode = digitnexus.util.findDomObj('TypeNameSelection_'+selectionHelperId);
			//remove last options
			$('#TypeNameSelection_'+selectionHelperId).empty();
		}else{
			entityNode = digitnexus.util.findDomObj('TypeNameSelection');
			//remove last options
			$("#TypeNameSelection").empty();
		}
		digitnexus.util.addSelectOption(entityNode,categroyDataArr);
		//bind the categroy value to select object..
		var id = (typeof containerObj.newsSunmmy.model !== "undefined") ? containerObj.newsSunmmy.model.id : containerObj.newsSunmmy.id;
		var currentCategroyId = $("div#news_list_"+id).attr("categroyId"); 
		$(entityNode).val(currentCategroyId);
	},
	createUploader:function(uploaderPanelId,acceptObject){
		var self = this;
		var $uploaderPanel = $('#'+uploaderPanelId);
		$uploaderPanel.empty();
		var iframeContainerEle = $("iframe#news_UploadFrame_file_"+uploaderPanelId);
		if(jQuery.isEmptyObject(iframeContainerEle[0])){
			iframeContainerEle = $(viewCreator.make("iframe",{"style":"display:none","id":"news_UploadFrame_file_"+uploaderPanelId,"name":"news_UploadFrame_file_"+uploaderPanelId}));
		}
		iframeContainerEle.empty();
		$uploaderPanel.append(iframeContainerEle);
		this.resetAllowUploadAttachment();//reset the allow upload attachment number.
		var trContainerEle = this.generateUploadAttachmentView(uploaderPanelId,iframeContainerEle,acceptObject);
		this.allowUploadAttachmentNumber--;
		if(this.allowUploadAttachmentNumber && parseInt(this.allowUploadAttachmentNumber) > 0){
			var moreButtonEle = $(viewCreator.make("input",{"type":"button","value":lable_news_tab_more}));
			var deleteButton = $(viewCreator.make("div",{"class":"iconbtn_1 btn_del_1","title":label_delete}));
			var tdContainerEle = $(viewCreator.make("td",{}));
			trContainerEle.append(tdContainerEle);
			tdContainerEle.append(deleteButton);
			tdContainerEle.append(moreButtonEle);
			
			moreButtonEle.click({parameter:{uploaderId:uploaderPanelId,iframe:iframeContainerEle,accept:acceptObject}},function(event){
				if(self.allowUploadAttachmentNumber>0){
					self.generateUploadAttachmentView(event.data.parameter.uploaderId,event.data.parameter.iframe,event.data.parameter.accept);
					self.allowUploadAttachmentNumber--;
				}
			});
			var formContainerEle = $uploaderPanel.find("form");
			deleteButton.click({formContainerEle:formContainerEle},function(event){
				var attachmentInfo = event.data.formContainerEle.attr("attachmentId");
				var callBack = function(){
					var fileUp = event.data.formContainerEle.find("input[name=fileUp]");
					var repeatable = fileUp.attr('repeatable');
					if(repeatable){
						fileUp.removeAttr('repeatable');
					}
					fileUp.val('');
					$(event.data.formContainerEle.find("div")[0]).empty();
					if(attachmentInfo && attachmentInfo != null && attachmentInfo != ""){
						event.data.formContainerEle.removeAttr("attachmentId");
					}
				};
				if(attachmentInfo && attachmentInfo != null && attachmentInfo != ""){
					attachmentInfo = jQuery.parseJSON(attachmentInfo);
					self.deleteAttachment(attachmentInfo.id,true,callBack);
				}else{
					callBack();
				}
			});
		}
	},
	buildAddAndEditView: function(model,fileUploadId){
		var formId = "form_"+model.id+"_add";
		var formTableId  = "form_table_"+model.id+"_add";
		var formPanel = $(viewCreator.make("form",{"id":formId,"method":"post","action":" "}));
		var editTableEle = $(viewCreator.make("table",{"id":formTableId,"class":"table_2"}));
		formPanel.append(editTableEle);
		var tbodyEle = $(viewCreator.make("tbody",{}));
		editTableEle.append(tbodyEle);
		//generate the table html to save the data ...
		var trOneEle = $(viewCreator.make("tr",{}));
		tbodyEle.append(trOneEle);
		trOneEle.append($(viewCreator.make("th",{})).append(label_news_title).append(viewCreator.make("sup",{"style":"color:red;"},"*")).append(":"));
		trOneEle.append(viewCreator.make("td",{},viewCreator.make("input",{"id":"Title_"+model.id,"type":"text","name":"Title","style":"width:99%"})));
		
		var trTwoEle = $(viewCreator.make("tr",{}));
		tbodyEle.append(trTwoEle);
		trTwoEle.append($(viewCreator.make("th",{})).append(label_news_type).append(viewCreator.make("sup",{"style":"color:red;"},"*")).append(":"));
		trTwoEle.append(viewCreator.make("td",{},viewCreator.make("select",{"id":"TypeNameSelection_"+model.id,"name":"TypeName"},viewCreator.make("option",{}," .. "))));  
		
		var trThreeEle = $(viewCreator.make("tr",{}));
		tbodyEle.append(trThreeEle);
		trThreeEle.append($(viewCreator.make("th",{})).append(lable_news_Content).append(viewCreator.make("sup",{"style":"color:red;"},"*")).append(":<br/>").append(viewCreator.make("div",{},label_news_MaxLengthPromp)));
		trThreeEle.append(viewCreator.make("td",{},viewCreator.make("textarea",{"id":"Content_"+model.id,"name":"Content","rows":"10","style":"width:99%"})));
		
		var trFourEle = $(viewCreator.make("tr",{}));
		tbodyEle.append(trFourEle);
		trFourEle.append(viewCreator.make("th",{},lable_news_Attachment+":"));
		trFourEle.append(viewCreator.make("td",{},viewCreator.make("div",{"id":fileUploadId})));
		
		var documentIdInput = $(viewCreator.make("input",{"type":"hidden","name":"DocumentId","id":"DocumentId_"+model.id}));
		tbodyEle.append(documentIdInput);
		return {form:formPanel,document:documentIdInput};
	},
	setSaveSuccessCallBack:function(saveSuccessCallBack){
		this.saveSuccessCallBack = saveSuccessCallBack;
	},
	deleteAttachment:function(attachmentId,isConfirm,callBack){
		//here is delete file form the mongo db by file id.. 
		if(isConfirm){
			this.attachmentId = attachmentId;
			this.callBack = callBack;
			var self = this;
			if (!this.deleteConfirm) {
	            this.deleteConfirm = $(viewCreator.make("div", null, label_delete_confirm));
	            this.deleteConfirmButtons = {};
	            this.deleteConfirmButtons[label_ok] = function() {
	            	self.deleteAttachmentRequest(self.attachmentId, self.callBack);
	            	self.deleteConfirm.dialog("close");
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
			this.deleteAttachmentRequest(attachmentId, callBack);
		}
	},
	deleteAttachmentRequest:function(attachmentId,callBack){
		if(attachmentId && attachmentId != null && attachmentId != ""){
			this.callBack = callBack;
			var self = this;
			digitnexus.syncDelete(NewsViewConfigureObject.url.newsDeleteAttachmentUrl+encodeURIComponent(attachmentId),
					null,
					function(response){
						//console.log("delete the attachment id: "+attachmentId+" success !");
						if(self.callBack && jQuery.isFunction(self.callBack)){
							self.callBack();
						}
					},
					function(xhr, status, exception){
						AppView._showMessage(xhr.statusText,"error");
					}
			);
		}
	}
});

window.NewsEditViewContainer = NewsViewContainer.extend({
	tagName : 'div',
	className : 'editview-tab-content',
	initialize : function(){
		this.newsSunmmy = this.options.summy;
		this.formPanel = null;
		this.formId = null;
		this.fileUploadPanelId = null;
		this.isSaveDataWithAddNewsViewFlag = false;
	},
	render : function(){
		var self = this;
		if(typeof registerNewsViewAllowUploadAttachmentNumListeners !== 'undefined'){
			var initAllowUploadAttachment = function(num){
				self.initAllowUploadAttachment(num);
			};
			registerNewsViewAllowUploadAttachmentNumListeners(initAllowUploadAttachment);
		}
		/*
		Here is init the newsView allow upload attachment Number in the application
		window.registerNewsViewAllowUploadAttachmentNumListeners = function(initAllowUploadAttachment){
			initAllowUploadAttachment(6);
		}*/
		// the edit view include the buttons and content view
		return this;
	},
	showContent : function(){
		this.createToolBar(this.$el);
		this.createContent(this.$el);
	},
	createToolBar : function(parentView){
		var newsContentEditViewButtonDiv = viewCreator.make("div",{"class":"toolBar"});
		parentView.append(newsContentEditViewButtonDiv);
		var ButtonView = $(newsContentEditViewButtonDiv);
		ButtonView.append(new NewsResetEditViewButton({parentView:this}).render().el);
		ButtonView.append(new NewsSaveEditViewButton({parentView:this}).render().el);
		return true;
	},
	createContent : function(parentView){
		var self = this;
		var randomNumber = Math.floor(Math.random()*1000);
		this.fileUploadPanelId = 'newsFileUpload_'+randomNumber+"_"+this.newsSunmmy.model.id;
		var FromTableView = $(viewCreator.make("div",{"class":"detailview-tab-content newsEdit","style":"overflow-y:auto;"}));
		parentView.append(FromTableView);
		
		var formAndDocumentPanel = self.buildAddAndEditView(this.newsSunmmy.model,this.fileUploadPanelId);
		this.formPanel = formAndDocumentPanel.form;
		FromTableView.append(this.formPanel);
		
		self.fillTypeName(this.newsSunmmy.NewsTypeData,self,this.newsSunmmy.model.id);
		$("input#Title_"+this.newsSunmmy.model.id).keyup(function(){
			this.value = this.value.slice(0,100);
		});
		$("textarea#Content_"+this.newsSunmmy.model.id).keyup(function(){
			this.value = this.value.slice(0,10000);
		});
		
		this.documentInput = formAndDocumentPanel.document;
		self.createUploader(this.fileUploadPanelId,this.documentInput);
		return true;
	},
	save : function(){
		this.isSaveDataWithAddNewsViewFlag = true;
		var self = this;
		//here is can stop interval from backend ,, refresh...
		var newsId = this.newsSunmmy.model.id;
		var title=$("input#Title_"+newsId).val();
		var typeName=$("select#TypeNameSelection_"+newsId).val();
		var content=$("textarea#Content_"+newsId).val();
		var documentId=this.documentInput.val();
		if(!digitnexus.util.isEmpty(title)&& !digitnexus.util.isEmpty(typeName)&& !digitnexus.util.isEmpty(content)){
			var params = "title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content)+"&typeName="+encodeURIComponent(typeName)+"&documentId="+encodeURIComponent(documentId);
			new NewsListAddData().fetch({
				data:params,
				contentType:'application/x-www-form-urlencoded',
				success : function(data) {
					AppView._showMessage(label_news_add_success,"success");
					self.newsSunmmy.refreshNewsList();
				},
				failure:function(xhr,status,exception){
					AppView._showMessage(xhr.statusText,"error");
				},
				callBackContext:this
			});
			if(this.saveSuccessCallBack){
				this.saveSuccessCallBack();
			}
		}else{
			AppView._showMessage(label_news_add_not_null_validate,"error");
		}
	},
	isSaveDataWithAddNewsView : function(){
		return this.isSaveDataWithAddNewsViewFlag;
	},
	resetAddDialog : function(){
		this.isSaveDataWithAddNewsViewFlag = false;
		this.formPanel[0].reset();
		//here is remove the documentId when the show the add view
		var documentId = this.documentInput.val();
		if(documentId&&documentId!=null&&documentId!=""){
			//here is need to delete the attachment and document when the document is not null,			
			this.documentInput.val("");
		}	
		this.fillTypeName(this.newsSunmmy.NewsTypeData,this,this.newsSunmmy.model.id);
        this.createUploader(this.fileUploadPanelId,this.documentInput);
        return documentId;
	},
	reset : function(){
		var self = this;
		var documentId = this.resetAddDialog();
		var callback = function(response){
			if(response && (response.length > 0) && (!digitnexus.util.isEmpty(response))){
				for(var i = 0; i < response.length; i++){
					self.deleteAttachment(response[i].id,false,null);
				}
			}
		};
		self.getAllAttachmentInformation(documentId,callback);
	}
});

window.NewsDetailViewContainer = NewsViewContainer.extend({
	tagName : 'div',
	initialize : function(){
		this.newsSunmmy = this.options.model;
		this.newsId = this.options.newsId;
		this.parentDialog = this.options.parentDialog;
		this.newsTypeData = this.options.newsTypeData;
		this.parentDialogParentView = this.options.detailDialogParentView;
		this.$el.attr({
			style:"overflow-y:auto"
		});
	},
	render : function(){
		var self = this;
		if(typeof registerNewsViewAllowUploadAttachmentNumListeners !== 'undefined'){
			var initAllowUploadAttachment = function(num){
				self.initAllowUploadAttachment(num);
			};
			registerNewsViewAllowUploadAttachmentNumListeners(initAllowUploadAttachment);
		}
		/*
		Here is init the newsView allow upload attachment Number in the application
		window.registerNewsViewAllowUploadAttachmentNumListeners = function(initAllowUploadAttachment){
			initAllowUploadAttachment(3);
		}*/
		
		new NewsListQuerySingleData().fetch({
			newsId : self.newsId,
			success : function(data) {
				self.showContent(data,this.$el);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});
		return this;
	},
	showContent : function(data,parentView){
		this.detailView = $(viewCreator.make("div",{"id":"newsDetail_"+data.id+"_DetailDiv","class":"newsDetail"}));
		parentView.append(this.detailView);
		this.showContentTop(data);
		this.showContentComment(data);
	},
	showContentTop : function(data){
		var documentId = (typeof data.documentId == 'undefined') ? 0 : data.documentId;
		var createdBy = (typeof data.createdBy !== 'undefined') ? data.createdBy : null;
		var attchmentIds = (typeof data.attchmentIds == 'undefined') ? 0 : data.attchmentIds;
		
		var newsDetailTopEle = $(viewCreator.make("div",{"class":"newsDetail_top"}));
		this.detailView.append(newsDetailTopEle);
		
		var newsDetailCategroyEle = viewCreator.make("div",{"class":"newsDetail_categroy"},lable_news_detail_categroy+' >> '+data.newsType.name);
		newsDetailTopEle.append(newsDetailCategroyEle);
		var newsDetailTopIconsEle = $(viewCreator.make("div",{"class":"newsDetail_top_r"}));
		newsDetailTopEle.append(newsDetailTopIconsEle);
		var newsDetailTopIconsUlEle = $(viewCreator.make("ul",{}));
		newsDetailTopIconsEle.append(newsDetailTopIconsUlEle);
		var newsDetailTopAIconEle = null;
		if(createdBy === digitnexus.getCurrentUserInfo().username){
			var IconsLiEle = $(viewCreator.make("li",{}));
			var newsDetailTopEditIconEle = viewCreator.make("div",{"class":"newsDetail_top_icon icon_edit"});
			newsDetailTopAIconEle = $(viewCreator.make("a",{"id":"editor_a_"+data.id},lable_news_detail_edit));
			IconsLiEle.append(newsDetailTopEditIconEle).append(newsDetailTopAIconEle);
			newsDetailTopIconsUlEle.append(IconsLiEle);
		}
		var IconFollowLiEle = viewCreator.make("li",{},viewCreator.make("div",{"class":"newsDetail_top_icon icon_follow"}));
		newsDetailTopIconsUlEle.append(IconFollowLiEle);
		var IconNotLikeLiEle = viewCreator.make("li",{},viewCreator.make("div",{"class":"newsDetail_top_icon icon_notlike"}));
		newsDetailTopIconsUlEle.append(IconNotLikeLiEle);
		var IconLikeLiEle = viewCreator.make("li",{},viewCreator.make("div",{"class":"newsDetail_top_icon icon_like"}));
		newsDetailTopIconsUlEle.append(IconLikeLiEle);
		
		var newsDetailTitleEle = viewCreator.make("div",{"class":"newsDetail_title"},viewCreator.make("pre",{},data.title));
		this.detailView.append(newsDetailTitleEle);
		var newsDetailCreateTimeEle = viewCreator.make("div",{"class":"newsDetail_createtime"},data.createDate);
		this.detailView.append(newsDetailCreateTimeEle);
		
		var newsDetailContent = $(viewCreator.make("div",{"class":"newsDetail_content"}));
		this.detailView.append(newsDetailContent);
		newsDetailContent.append(viewCreator.make("pre",{},data.content));
		newsDetailContent.append(viewCreator.make("div",{"class":"blank_line"}));
		
		var newsImageDivContainerEle = $(viewCreator.make("div",{"style":"width:99%;height:200px;"}));
		this.detailView.append(newsImageDivContainerEle);
		
		if(attchmentIds != null && attchmentIds.length > 0 && attchmentIds != 'null'){
			for(var i = 0 ; i < attchmentIds.length; i ++){
				var imgEle = viewCreator.make("img",{"id":"newImgId_"+data.id+"_"+attchmentIds[i],"style":"width:120px;height:90px;","src": NewsViewConfigureObject.url.newsDownAttachmentUrl + encodeURIComponent(attchmentIds[i])});//"rest/mobile/documentData/"+
				newsImageDivContainerEle.append(viewCreator.make("div",{"href": NewsViewConfigureObject.url.newsDownAttachmentUrl + encodeURIComponent(attchmentIds[i]),"rel":"[gall1]","class":"newsDetail_content_img","style":"float:left;width:120px;height:90px;"},imgEle));
				//load the picture error hide the
				$(imgEle).error(function(event){
					$(this).parent().remove();
				});
			}
		}
		//here is jquery plugin to display the image.
		newsImageDivContainerEle.children().foxibox();
		//here is bind some event to process something..
		if(!jQuery.isEmptyObject(newsDetailTopAIconEle) && newsDetailTopAIconEle != null){
			newsDetailTopAIconEle.click({columenData:data,parentView:this},function(event){
				var parentView = event.data.parentView;
				//delete two level div to sure just a editview div
				var newsDetailDivEle = parentView.detailView.parent().empty();
				parentView.constructEditView(event.data.columenData,newsDetailDivEle,parentView.newsTypeData);
				newsDetailDivEle.attr("style",'height:100%;');
			})
		}
	},
	showContentComment : function(data){
		this.commentView = new CommentView({articleEditMeta:{name:this.newsSunmmy.remark},model:data,parentView:this.detailView}).render();
		this.detailView.append(this.commentView.el);
	},
	constructEditView : function(colData,parentView,typeData){
		var self = this;
		var id = (typeof colData.id !== 'undefined') ? colData.id : null;
		var title = (typeof colData.title !== 'undefined') ? colData.title : null;
		var content = (typeof colData.content !== 'undefined') ? colData.content : null;
		var newsType = (typeof colData.newsType !== 'undefined') ? colData.newsType.name : null;
		var documentId = (typeof colData.documentId !== 'undefined') ? colData.documentId : null;
		var attchmentIds = (typeof colData.attchmentIds !== 'undefined') ? colData.attchmentIds : null;
		
		var randomNumber = Math.floor(Math.random()*1000);
		this.fileUploadPanelId = 'newsFileUpload_'+randomNumber+"_"+id;
		
		var editView = $(viewCreator.make("div",{"class":"editview-tab-content"}));
		parentView.append(editView);
		var toolBarView = $(viewCreator.make("div",{"class":"toolBar"}));
		editView.append(toolBarView);
		toolBarView.append(new NewsSaveEditViewButton({parentView:this}).render().el);	
		var FromTableView = $(viewCreator.make("div",{"class":"detailview-tab-content newsEdit","style":"overflow-y:hidden;"}));
		parentView.append(FromTableView);
		
		var formAndDocumentPanel = self.buildAddAndEditView(colData,this.fileUploadPanelId);
		this.formPanel = formAndDocumentPanel.form;
		FromTableView.append(this.formPanel);
		
		var formTableId  = "form_table_"+id+"_add";
		//here can save the data to table tag, then in the save and reset can use it
		$("table#"+formTableId).attr('summary', JSON.stringify(colData));
		self.setEditViewInitializationData(colData);
		// fill the type name select in the edit view
		self.fillTypeName(typeData,self,id);
		$("input#Title_"+id).val(title).keyup(function(){
			this.value = this.value.slice(0,100);
		});;
		//fill the data to select options value;
		$("select#TypeNameSelection_"+id).val(newsType);
		//fill the data to textare content
		$("textarea[name='Content']").val(content).keyup(function(){
			this.value = this.value.slice(0,10000);
		});
		this.documentInput = formAndDocumentPanel.document;
		this.documentInput.val(documentId);
		//here need to display the attachment and can delete this attachment , upload the attachment again..
		this.fillEditViewAttachmentView(this.fileUploadPanelId,documentId,id,this.documentInput);
	},
	fillEditViewAttachmentView : function(parentId,documentId,newsId,acceptObject){
		var self = this;
		if((!digitnexus.util.isEmpty(documentId)) && documentId != 0 && documentId != ''){
			var callback = function(response){
				AttachmentFileUploadView.listener(parentId,response,newsId,self,acceptObject);
			};
			self.getAllAttachmentInformation(documentId,callback);
		}else{
			$("#"+parentId).empty();
			self.createUploader(parentId,acceptObject);
		}
		var AttachmentFileUploadView = {
				newsId:null,
				parentDetailView:null,
				listener:function(parentId,attachmentsInfo,newsId,parentDetailView,acceptObject){
					this.newsId = newsId;
					this.parentDetailView = parentDetailView;
					//true is generate the attachment list; false empty to the upload view and create the uploader.
					if(attachmentsInfo && (attachmentsInfo.length > 0) && (!digitnexus.util.isEmpty(attachmentsInfo))){
						var fileUploadParentEle = $("#"+parentId);
						var attachmentListDivEle = $(viewCreator.make("div",{"style":"width:100%;height:25px;"}));
						fileUploadParentEle.append(attachmentListDivEle);
						for(var i = 0; i < attachmentsInfo.length; i++){
							this.generateAttachmentDownAndUploadView(attachmentListDivEle,attachmentsInfo[i],acceptObject,parentId);
						}
						self.resetAllowUploadAttachment();
						if(attachmentsInfo.length < self.allowUploadAttachmentNumber){
							self.setAllowUploadAttachment(self.allowUploadAttachmentNumber-attachmentsInfo.length);
							this.generateAttachmentMoreButton(attachmentListDivEle, parentId, acceptObject);
						}else{
							self.setAllowUploadAttachment(0);
						}
					}else{
						$("#"+parentId).empty();
						self.createUploader(parentId,acceptObject);
					}
				},
				generateAttachmentMoreButton : function(attachmentListDivEle,parentId,acceptObject){
					var fileUploadParentEle = $("#"+parentId);
					var moreButtonEle = $("input#"+parentId+"_moreButtonEle");
					if(jQuery.isEmptyObject(moreButtonEle[0])){
						moreButtonEle = $(viewCreator.make("input",{"id":parentId+"_moreButtonEle","type":"button","value":lable_news_tab_more}));
						attachmentListDivEle.append(moreButtonEle);
					}
					var iframeContainerEle = $("iframe#news_UploadFrame_file_"+parentId);
					if(jQuery.isEmptyObject(iframeContainerEle[0])){
						iframeContainerEle = $(viewCreator.make("iframe",{"style":"display:none","id":"news_UploadFrame_file_"+parentId,"name":"news_UploadFrame_file_"+parentId}));
						fileUploadParentEle.append(iframeContainerEle);
					}
					moreButtonEle.click({parameter:{uploaderId:parentId,iframe:iframeContainerEle,accept:acceptObject}},function(event){
						if(self.allowUploadAttachmentNumber>0){
							self.generateUploadAttachmentView(event.data.parameter.uploaderId,event.data.parameter.iframe,event.data.parameter.accept);
							self.allowUploadAttachmentNumber--;
						}
					});
				},
				generateAttachmentDownAndUploadView : function(attachmentListPanel,attachmentItemInfo,acceptObject,parentId){
					var self = this;
					var outerContainerDivEle = $(viewCreator.make("div",{"class":"uploadfile1"}));
					var innerDownloadAEle = $(viewCreator.make("a",{"class":"uploadfile1_text","id":"FileUploadATag_"+attachmentItemInfo.id,"fileModule":JSON.stringify(attachmentItemInfo)},attachmentItemInfo.name));
					var innerDeleteDivEle = $(viewCreator.make("div",{"class":"iconbtn_1 btn_del_1","id":"DeleteFileATag_"+attachmentItemInfo.id}));
					outerContainerDivEle.append(innerDownloadAEle).append(innerDeleteDivEle);
					attachmentListPanel.append(outerContainerDivEle);
					
					innerDownloadAEle.click({attachmentId:attachmentItemInfo.id},function(event){
						if(event.data.attachmentId && event.data.attachmentId != null && event.data.attachmentId != ""){
							self.downloadAttachment(event.data.attachmentId);
						}
					});
					
					innerDeleteDivEle.click({attachmentId : attachmentItemInfo.id,deleteDivEleSelf : innerDeleteDivEle,attachmentList : attachmentListPanel,parentId : parentId,acceptObject : acceptObject},function(event){
						if (event.data.attachmentId && event.data.deleteDivEleSelf && event.data.attachmentList && event.data.parentId && event.data.acceptObject) {
							self.deleteAttachment(event.data.attachmentId, event.data.deleteDivEleSelf, event.data.attachmentList, event.data.parentId, event.data.acceptObject);
						}
					});
				},
				downloadAttachment:function(attachmentId){
					var url = "/"+digitnexus.util.context +"/"+ NewsViewConfigureObject.url.newsDownAttachmentUrl + encodeURIComponent(attachmentId);
					var downloadIframe = document.getElementById('iframe#downloadIframeId');
					if(downloadIframe!=null){
						document.body.removeChild(downloadIframe);
					}
					var ifElem = viewCreator.make("iframe",{"src":url,"id":"downloadIframeId","style":"display:none"});
					document.body.appendChild(ifElem);
				},
				deleteAttachment:function(attachmentId,deleteDivSelf,attachmentListDivEle, parentId, acceptObject){
					var _self = this;
					var callBack = function(){
						deleteDivSelf.parent().remove();
						if(self.allowUploadAttachmentNumber === 0){
							_self.generateAttachmentMoreButton(attachmentListDivEle, parentId, acceptObject);
						}
						self.allowUploadAttachmentNumber++;
					}
					self.deleteAttachment(attachmentId,true,callBack);
				}
		};
	},
	setEditViewInitializationData:function(ediViewInitializationData){
		this.ediViewInitializationData = ediViewInitializationData;
	},
	save : function(){
		if(this.ediViewInitializationData){
			var self = this;
			//here is stop refresh from backend...
			var newsId = (typeof this.ediViewInitializationData.id !== 'undefined') ? this.ediViewInitializationData.id : null;
			var title=$("input#Title_"+newsId).val();
			var typeName=$("select#TypeNameSelection_"+newsId).val();
			var content=$("textarea#Content_"+newsId).val();
			var documentId=this.documentInput.val();
			if(!digitnexus.util.isEmpty(title)&& !digitnexus.util.isEmpty(newsId)&& !digitnexus.util.isEmpty(content)){
				var params = "title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content)+"&typeName="+encodeURIComponent(typeName)+"&newsId="+encodeURIComponent(newsId)+"&documentId="+encodeURIComponent(documentId);
				new NewsListEditData().fetch({
					data:params,
					contentType:'application/x-www-form-urlencoded',
					type : 'PUT',
					success : function(data) {
						AppView._showMessage(label_news_add_success,"success");
						//TO-DO here refresh news list method is not must,
						//because the dialog have the close method invoke the refresh method,
						//so if there invoke, some issue will appear......
						//self.parentDialogParentView.refreshNewsList();
					},
					failure:function(xhr,status,exception){
						AppView._showMessage(xhr.statusText,"error");
					},
					callBackContext:this
				});
				if(this.saveSuccessCallBack){
					this.saveSuccessCallBack();
				}
			}else{
				AppView._showMessage(label_news_add_not_null_validate,"error");
			}
		}
	},
	reset : function(){
		if(this.ediViewInitializationData){
			$("input#Title_"+this.ediViewInitializationData.id).val(this.ediViewInitializationData.title);
			$("select#TypeNameSelection_"+this.ediViewInitializationData.id).val(this.ediViewInitializationData.newsType.name);
			$("textarea#Content_"+this.ediViewInitializationData.id).val(this.ediViewInitializationData.content);
			this.documentInput.val(this.ediViewInitializationData.documentId);
			//here rest the img view..
			this.fillEditViewAttachmentView(this.fileUploadPanelId, this.ediViewInitializationData.documentId,this.ediViewInitializationData.id,this.documentInput);
		}
	},
	resetPanel : function(id){
		//reset the detail view content...
		this.$el.empty();
		var self = this;
		new NewsListQuerySingleData().fetch({
			newsId : id,
			success : function(data) {
				self.showContent(data,this.$el);
			},
			failure:function(xhr,status,exception){
				AppView._showMessage(xhr.statusText,"error");
			},
			callBackContext:this
		});
	}
});