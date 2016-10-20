window.Tab=Backbone.Model.extend({

	urlRoot:"./rest/uimanage/menu/mainmenu"

});

window.Tabs = Backbone.Collection.extend({
    model:Tab,
    url:"./rest/uimanage/menu/mainmenu",
    //base url to fetch children of a group. We use our own function for ajax call, not fetch from backbone. 
    //So no '.' at the start of url
    baseUrl:"/rest/uimanage/menu/parentId/",
    
    /**
     * options should contain
     * parentGroupId
     * success function to callback when data is received
     * failure function to callback in case of failure 
     * callBackContext context in which success and failure functions need to be executed
     */
    fetchChildren:function(options){
    	
    	digitnexus.ajaxRequest(this.baseUrl + options.parentGroup + "?subMenuFromWay=" +options.subMenuFromWay, 
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

