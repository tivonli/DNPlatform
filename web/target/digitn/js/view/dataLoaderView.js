window.DataLoaderDiv = Backbone.View.extend({
	tagName:"div",
	initialize:function(){
        this.articleSummary=this.options.articleSummary;
        this.publicField=this.options.publicField;
        this.listView=this.options.listView;
        this.separator=this.options.separator;
	},
	render:function(){
		
		//static html, just build this way
		var content =   '<div class="statuBar">'
			        +       '<div class="searchBar list1">'
			        +  			'<ul>'
			        +    			'<li><div id="fileUpload"></div></li>'
			        +  			'</ul>'
			        + 		'</div>'
			        +   '</div>'			
			
					+   '<div class="simulator_content">'
			        +		'<div class="title2">'
			        +			'<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_request"></div>'
			        +				'<a href="#">' + label_dataload_document + '</a></div></div></div>'
			        +		'</div>'
			        +		'<textarea class="content1" id="loadFileRequest"></textarea>'
			        +	    '<div class="btnBar list1">'
			        +			'<ul>'
			        +				'<li><a href="#" class="btn_1" onclick="javascript:digitnexus.util.cleanContent(\'loadFileRequest\')"><span>' + label_simulator_clean + '</span></a></li>'
 			        +				'<li id="dataLoaderSubmit"></li>'
			        +			'</ul>'
			        +	    '</div>'
			        +	'</div>'
			       
			        +	'<div class="simulator_content">'
			        +		'<div class="title2">'
			        +			'<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_response"></div>'
			        +				'<a href="#">' + label_dataload_result + '</a></div></div></div>'
			        +		'</div>'
			        +		'<textarea class="content2" id="loadFileResponse"></textarea>'
			        +		'<div class="btnBar list1">'
			        +			'<ul><li><a href="#" class="btn_1" onclick="javascript:digitnexus.util.cleanContent(\'loadFileResponse\')"><span>' + label_simulator_clean + '</span></a></li></ul>'
			        +		'</div>'
			        +	'</div>';	
		
		this.$el.append(content);
		this.$("#dataLoaderSubmit").append(new DataLoadSubmitButton({articleSummary:this.articleSummary,publicField:this.publicField,separator:this.separator,listView:this.listView}).render().el);
		return this;		
	}	
});


window.DataLoadSubmitButton=Backbone.View.extend({
	tagName:"a",
	className:'btn_1',
	events:{
	     'click':'onClick'
    },
	initialize:function(){
		this.publicField=this.options.publicField;
		this.separator=this.options.separator;
		this.$el.attr({
			href:'#'
		});
	},
    render:function(){
    	$(this.el).html('<span>' + label_simulator_send + '</span>');
		return this;
	},
	onClick:function(){
		$("#loadFileResponse").text("");
 		var loadFileValue = $("#loadFileRequest").val();
		var param = "articleName=" + this.options.articleSummary.remark + "&data=" + encodeURIComponent(loadFileValue, "UTF-8");		
		var url = '/import/CSVValidateDataLoader';
		var params="";
		if(this.publicField){
			params="&publicField="+this.publicField;
		}
		var separator="";
		if(this.separator){
			separator="&separator="+this.separator;
		}
		var self=this;
		digitnexus.ajaxPostByDefaultContentType(url,
				encodeURI(param + "&afterConfirm=false"+params+separator,"UTF-8"), 
				function(response) {
					if(response.success){
						$("#loadFileResponse").text("success");
						self.options.listView.refresh();
					}else if(response.error && response.errorMsg.length>0){
						//alert("Error Data: " + response.errorMsg);
						digitnexus.showErrorMessage(label_dataload_error, response.errorMsg,null);
					}else if(response.repeat && (response.conflictMsg.length>0 || response.repeatMsg.length>0)){
						var msg = "";
						if(response.conflictMsg.length>0){
							msg += response.conflictMsg + "\n\n" ;
						}
						if(response.repeatMsg.length>0){
							msg += response.repeatMsg + "\n\n" ;
						}
						msg += label_dataload_confirm;
						var save = confirm(msg);
						if(save){
							digitnexus.ajaxPostByDefaultContentType(url, 				
									encodeURI(param + "&afterConfirm=true","UTF-8"),
									function(response) {
										$("#loadFileResponse").text("success");
										self.options.listView.refresh();
										 
									}, 
									function(xhr, status, exception) {
										digitnexus.showErrorMessage(label_dataload_error, label_dataload_error_statement,null);
						    		}
							);
						}
					}
				}, 
				function(xhr, status, exception) {
					digitnexus.showErrorMessage(label_dataload_error, label_dataload_error_statement,null);
	    		}
		);
	}
});
