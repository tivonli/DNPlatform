/**
 * 
 */
window.ReportListModel = Backbone.View.extend({
	urlRoot : '/rest/mashup/reportList',
	fetch : function(options){
		digitnexus.ajaxRequest(this.urlRoot, 
    			null, 
    			function(response) {
					 if(options.parameter){
						 options.success.call(options.callBackContext,response, options.parameter);
					 }else{
						 options.success.call(options.callBackContext,response);
					 }
    			}, 
    			function(xhr, status, exception) {
    				if(options.parameter){
						 options.failure.call(options.callBackContext,xhr, status, exception, options.parameter);
					 }else{
						 options.failure.call(options.callBackContext,xhr, status, exception);
					 }
        		}
    	);
	}
});

window.ReportColumnData = Backbone.View.extend({
	urlRoot : '/rest/mashup/data/',
	fetch : function(options){
		digitnexus.ajaxRequest(this.urlRoot+encodeURIComponent(options.reportId), 
    			null, 
    			function(response) {
					 if(options.parameter){
						 options.success.call(options.callBackContext,response, options.parameter);
					 }else{
						 options.success.call(options.callBackContext,response);
					 }
    			}, 
    			function(xhr, status, exception) {
    				if(options.parameter){
						 options.failure.call(options.callBackContext,xhr, status, exception, options.parameter);
					 }else{
						 options.failure.call(options.callBackContext,xhr, status, exception);
					 }
        		}
    	);
	}
});

window.ReportListData=Backbone.Model.extend({
	urlRoot:'/rest/report/reportList/browser/',//{groupId}
	fetch:function(options){
		digitnexus.ajaxRequest(this.urlRoot+encodeURIComponent(options.groupId), 
    			null, 
    			function(response) {
    		         options.success.call(options.callBackContext,response);
    			}, 
    			function(xhr, status, exception) {
    				options.failure.call(options.callBackContext,xhr, status, exception);
        		}
    	);
	}
});

window.ReportProfileData=Backbone.Model.extend({
	urlRoot:'/rest/uimanage/userprofile/getAllReportProfile',
	fetch:function(options){
		digitnexus.ajaxRequest(this.urlRoot, 
    			null, 
    			function(response) {
    		         options.success.call(options.callBackContext,response);
    			}, 
    			function(xhr, status, exception) {
    				options.failure.call(options.callBackContext,xhr, status, exception);
        		}
    	);
	}
});