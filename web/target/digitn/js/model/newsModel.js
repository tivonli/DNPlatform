/**
 * search all type model
 */
window.NewsCategroyData=Backbone.Model.extend({
	urlRoot:'/rest/news/searchAllType',
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

/**
 * search news data by newsType
 * */
window.NewsListData=Backbone.Model.extend({
	urlRoot:'/rest/news/searchByType/',
	fetch:function(options){
		digitnexus.ajaxRequest(this.urlRoot+options.newsType, 
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

/**
 * delete news by newsId
 * */
window.NewsListDeleteData=Backbone.Model.extend({
	urlRoot:'/rest/news/delNews?',
	fetch:function(options){
		digitnexus.syncDelete(this.urlRoot+options.newsId,
				null,
				function(response){
					options.success.call(options.callBackContext,response);
				},
				function(xhr,status,exception){
					options.failure.call(options.callBackContext,xhr, status, exception);
				}
		); 
	}
});

/**
 * add news model
 * */
window.NewsListAddData=Backbone.Model.extend({
	urlRoot:'/rest/news/addNews',
	fetch:function(options){
		digitnexus.ajaxPostByContentType(this.urlRoot,
				options.data,
				options.contentType,
				function(response){
					options.success.call(options.callBackContext,response);
				},
				function(xhr,status,exception){
					options.failure.call(options.callBackContext,xhr, status, exception);
				}
		);
	}
});

/**
 * edit news model
 * */
window.NewsListEditData=Backbone.Model.extend({
	urlRoot:'/rest/news/editNews',
	fetch:function(options){
		digitnexus.ajaxWithDataTypeAndType(this.urlRoot,
				options.data,
				options.contentType,
				options.type,
				function(response){
					options.success.call(options.callBackContext,response);
				},
				function(xhr,status,exception){
					options.failure.call(options.callBackContext,xhr, status, exception);
				}
		);
	}
});

/**
 * search news by newsId model
 * */
window.NewsListQuerySingleData=Backbone.Model.extend({
	urlRoot:'/rest/news/searchNewsById/',
	fetch:function(options){
		digitnexus.ajaxRequest(this.urlRoot+options.newsId, 
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

/**
 * search news by create time and newsType
 * */
window.NewsQueryLatestData=Backbone.Model.extend({
	urlRoot:'/rest/news/searchNewsByIdAndType?',
	fetch:function(options){
		digitnexus.ajaxRequest(this.urlRoot+options.data,
				null,
				function(response){
					options.success.call(options.callBackContext,response);
				},
				function(xhr, status, exception){
					options.failure.call(options.callBackContext,xhr, status, exception);
				}
		);
	}
});