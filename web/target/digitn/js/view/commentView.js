
window.CommentDialogView = Backbone.View.extend({
	tagName:"div",
	className:"commentCSS",
	
	initialize:function(){
		this.articleEditMeta = this.options.articleEditMeta;
	},
	render:function(){	
		var self = this;
		this.$el.dialog({
			title:label_article_comment,
			autoOpen : false,
			show : "blind",
			width : 800,
			height : 400,
			modal : true,
			resize:function(){
				self.resize();
			},
			open:function(){
				//console.log("open")
				self.resize();
			}
		});
		return this;
	},
	showContent:function(model){
		this.model = model;
		this.$el.empty();
		this.commentView = new CommentView({articleEditMeta:this.articleEditMeta,model:model,parentView:this}).render();
		this.$el.append(this.commentView.el);	
		
		this.$el.dialog("open");
	},
	resize:function(){
		if(this.commentView){
			this.commentView.resize();
		}
	}
	
});


window.CommentView = Backbone.View.extend({
	tagName:"div",
	className:"",
	listViewData:[],
	
	initialize:function(){
		this.articleEditMeta = this.options.articleEditMeta;	
		this.$el.attr("style","width:100%;height:97%;");
		this.parentView = this.options.parentView;
	},
	
	render:function(){
		this.commentInputView = new CommentInputView({parentView:this,model:this.model,articleEditMeta:this.articleEditMeta}).render();
		this.$el.append(this.commentInputView.el);
		
		this.commentListView=new CommentListView({parentView:this});
		this.$el.append(this.commentListView.render().el);
		this.refresh();
		return this;
	},
	refresh:function(){
		
		this.getListData();
		//console.log("this.listViewData.length=="+this.listViewData.length)
		this.commentInputView.showCommentCount(this.listViewData.length);
		this.commentListView.setData(this.listViewData);
		this.commentListView.makeTable();
	},
	resize:function(){		
		this.commentListView.resize();
	},
	getListData:function(){
		//http://localhost:8083/SCMVisibility/rest/comment/searchComment?dataPath=news&dataId=123
		//get
		//return;
		var url = "/rest/comment/searchComment";		
		var requestData = {
				"dataPath":this.articleEditMeta.name,
				"dataId":this.model.id
			};
		var self = this;
		digitnexus.syncGet(
				url, 
				requestData, 
				function(response){
					//console.log("get comment data");
					self.listViewData = (response!=null&&response.length>0)?response:[];
				}, function(response){
					self.listViewData=[];
				}
		);		
	},
	postCommentData:function(){
		//alert(1)
	},
	showReferenceDialog:function(comment){
		if(!this.quoteDialog){			
			this.quoteDialog = new ReferenceDialogView({parentView:this,model:this.model,articleEditMeta:this.articleEditMeta}).render();
		}
		this.quoteDialog.showDialog(comment);
	}
});

window.CommentInputView = Backbone.View.extend({
	tagName:"div",
	className:"",
	initialize:function(){
		this.parentView = this.options.parentView;
		this.articleEditMeta = this.options.articleEditMeta;		
		this.$el.attr("style","width:100%;height:120px;");
	},
	render:function(){
		
		var top = $(viewCreator.make("div",{"class":"comment_titlebar"}));
		top.append("<span class='comment_title'>"+label_content_empty+"...</span>");
		top.append("<span class='comment_count'><a href='#comments_list' id='commentCount'>0</a>"+label_content_comments+"</span>");
		
		var center = $(viewCreator.make("div",{"style":"width:100%;"}));		
		center.append("<textarea id='commentArea' style='width:99%;resize: none;'></textarea>");
		
		var bottom = $(viewCreator.make("div",{"class":"comment_btnbar"}));
		bottom.append("<span id='commentAreaTip' class='comment_tip'>"+label_comment_max+"</span>");
		bottom.append(new CommentSubmitButton({parentView:this}).render().el);
		bottom.append(new CommentResetButton({parentView:this}).render().el);
		
		this.$el.append(top).append(center).append(bottom);
		//here is simulation the html anchor tag...
		$("a#commentCount").click(function(){ 
		    var href = $(this).attr("href"); 
		    var pos = $(href).offset().top; 
		    $("html,body").animate({scrollTop: pos}, 200);  
		    return false; 
		});
		return this;
	},
	showCommentCount:function(count){
		$("#commentCount",this.$el).html(count);
	},	
	submit:function(){
		var value = $("#commentArea",this.$el).val();
		if(value===""){
			//alert(label_content_empty);
			$("#commentAreaTip",this.$el).hide().show("slow").html(label_content_empty);
			return ;
		}
		var len = Math.round(getByteLength(value)/2);
		if(len>140){
			$("#commentAreaTip",this.$el).hide().show("slow").show().html(label_comment_max);
			return;
		}
		//return;
		//post 		
		//http://localhost:8083/SCMVisibility/rest/comment/ 		
		var url = "/rest/comment/";
		var postData = {};
		
		postData.message = value;
		postData.dataPath = this.articleEditMeta.name;
		postData.dataId = this.model.id;
		postData.comment = {id:$("#commentArea",this.$el).attr("commentId")};//todo
		
		// {"message":"这部电影不错哦","dataPath":"news","dataId":"123","userName":"admin","toUser":"admin","createTime":"2012-07-26 13:55"}
		this.postCommentData(postData)
	},
	postCommentData:function(data){
		var url = "/rest/comment/";
		var self = this;
		digitnexus.ajaxPost(
			url, 
			JSON.stringify(data), 
			function(){
				//console.log("comment save success");
				if(self.parentView){					
					self.parentView.refresh();
				}
				$("#commentArea",self.$el).val("");
			}, function(){
				//console.log("comment save fail");
			}
		);
	},
	clear:function(){
		$("#commentArea",this.$el).val("");
		$("#commentArea",this.$el).attr("commentId","");
		$("#commentAreaTip",this.$el).html(label_comment_max);
	}	
});


window.CommentButton = Backbone.View.extend({
	tagName : "button",
	className : "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",
	events : {
		'click' : 'onClick'
	},

	initialize : function() {	
		this.parentView = this.options.parentView;
	},

	render : function() {
		this.$el.append("<span class='ui-button-text'>" + this.getDisplayName() + "</span>");
		return this;
	},

	getDisplayName : function() {
		return "";
	},
	
	onClick : function() {	
		//clear
	}
	
});

window.CommentSubmitButton = CommentButton.extend({
	getDisplayName : function() {
		return label_comment_submit;
	},
	onClick : function() {		
		this.parentView.submit();
	}
})


window.CommentResetButton = CommentButton.extend({
	getDisplayName : function() {
		return label_comment_reset;
	},
	onClick : function() {			
		this.parentView.clear();
	}
});



window.ReferenceButton = Backbone.View.extend({

	tagName : "a",
	className : "btn_6 comment_list_btn",
	events : {
		'click' : 'onClick'
	},

	initialize : function() {	
		this.comment = this.options.comment;
		this.parentView = this.options.parentView;
	},

	render : function() {
		this.$el.append("<span>" + this.getDisplayName() + "</span>");
		this.$el.append("<div class='btn_icon1 icon1_message'></div>");
		return this;
	},
	
	getDisplayName : function() {
		return label_quote;
	},
	
	onClick : function() {		
		//this.referenceDialogView.show();
		if(this.parentView){
			this.parentView.parentView.showReferenceDialog(this.comment);
		}
	}
});


window.ReferenceDialogView = Backbone.View.extend({
	tagName:"div",
	
	initialize:function(){
		this.comment = this.options.comment;
		this.parentView = this.options.parentView;	
		this.articleEditMeta = this.options.articleEditMeta;
	},
	
	render:function(){		
		var contener = $(viewCreator.make("div",{"style":"width:100%;"}));		
		contener.append("<div class='comment_titlebar'><span class='comment_title'>"+label_content_empty+"...</span></div>");	
		contener.append("<textarea class='comment_quote_textarea' style='resize: none;'></textarea>");
		contener.append("<span id='comment_quoteArea_tip' class='comment_quote_tip'>"+label_comment_max+"</textarea>");
		this.$el.append(contener);
		
		var self = this;
		this.dialog = this.$el.dialog({				
				autoOpen : false,
				show : "blind",					
				modal : true,
				width:400,
				title:label_quote,
				buttons: [
				     {
				    	 text:label_comment_submit,
				    	 click: function() { 
				    		 self.onClick();
				    	 }
				     },
				     {
				    	 text:label_comment_reset,
				    	 click:function(){
							$(".comment_quote_textarea",self.$el).val("");
							$("#comment_quoteArea_tip",self.$el).html(label_comment_max);
						}
				     }
				]
		});
		
		return this;
	},
	onClick:function(){
		//this.postComment();
		var commentData = {};
		
		commentData.message = $(".comment_quote_textarea",this.$el).val();
		if(commentData.message===""){
			//alert(label_content_empty);
			$("#comment_quoteArea_tip",this.$el).hide().show("slow").html(label_content_empty);
			return ;
		}
		var len = Math.round(getByteLength(commentData.message)/2);
		if(len>140){
			$("#comment_quoteArea_tip",this.$el).hide().show("slow").show().html(label_comment_max);
			return;
		}
		
		commentData.dataPath = this.articleEditMeta.name;
		commentData.dataId = this.model.id;
		commentData.comment = {id:this.comment.id};
		this.parentView.commentInputView.postCommentData(commentData);
		this.dialog.dialog("close"); 
		$(".comment_quote_textarea",this.$el).val("");
	},
	showDialog:function(comment){
		this.comment = comment;
		this.dialog.dialog("open");
	}
});


window.CommentListView = Backbone.View.extend({
	tagName:"div",
	className:"comment_list",
	
	setData:function(data){			
		this.data = data;
	},
	render:function(){
		this.$el.attr({
			id:'comments_list',
			style:'overflow:auto;'
		})
		this.parentView = this.options.parentView;
		return this;
	},
	
	makeTable: function() {
		this.$el.empty();
		for(var i=0;i<this.data.length;i++){
			this.generateCommentCell(this.data[i])
		}
	},
	generateCommentCell:function(aData){
		var contenter = $(viewCreator.make("div",{"class":"comment_item"}));
    	
    	var topElement = $(viewCreator.make("div",{"class":"comment_item_line1"}));
    	topElement.append("<span id='"+aData.id+"' data='dataId' class='comment_user'>"+aData.userName+"</span>");    	
    	topElement.append("<span class='comment_createtime'>"+aData.createTime+"</span>");
    	topElement.append(new ReferenceButton({parentView:this,comment:aData}).render().el);
    	contenter.append(topElement);
    	
    	
    	var centerElement = $(viewCreator.make("div",{"class":"comment_content"}));
    
    	var comment = aData.comment;
    	var messageStr = aData.message;
    	

    	
    	var comments = [];
    	while(comment&&comment.userName){

    		comments.push(comment);
    		
    		comment = comment.comment;
    		
    	}
    	for(var i=0,j=comments.length;i<j;i++){
    		if(i<j-1){
    			messageStr+="<span class='comment_quote_separator'>&nbsp;</span>"+"<span class='comment_quote_user'>"+comments[i].userName+"</span>: "+comments[i].message
    					  +"<span class='comment_quote_createtime'>("+comments[i].createTime+")</span>"
    		}else{
    			messageStr += "<div class='comment_original'>"
    					   + "<div class='comment_original_top'></div>"
    					   + "<div class='comment_original_box'>"
    					   + "<div class='comment_original_line1'>"
    					   + "<span class='comment_user'>"+comments[i].userName+"</span>"
    			           + "<span class='comment_createtime'>"+comments[i].createTime+"</span>"
    			           + "</div>"
    			           + "<div class='comment_original_content'>"+comments[i].message+"</div>"   				
    			           + "</div>"	
    			           + "</div>"
    		}
    	}
    	
    	centerElement.html(messageStr);
    	contenter.append(centerElement);
    	
    	this.$el.append(contenter);		
	},
	resize:function(){
		//console.log("sss="+this.$el.height());
		this.$el.height(this.parentView.$el.height()-this.parentView.commentInputView.$el.height());
		//console.log("sss2222="+this.$el.height());
	}
	
})





function getByteLength(source) {
    return String(source).replace(/[^\x00-\xff]/g, "ci").length;
};

function subByte(source, length, tail) {
    source = String(source);
    tail = tail || '';
    if (length < 0 || getByteLength(source) <= length) {
        return source + tail;
    }
    
    //thanks 加宽提供优化方法
    source = source.substr(0,length).replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
        .substr(0,length)//截取长度
        .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
        .replace(/([^\x00-\xff]) /g,"\x241");//还原
    return source + tail;

};
