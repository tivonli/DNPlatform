digitnexus = (typeof digitnexus == 'undefined') ? {} : digitnexus;
var CURRENT_USER_LOCALE = "en_US";

/**
 * Makes an ajax GET request to obtain the json in a generic way
 * @param url to make the GET request
 * @param requestData the query parameters
 * @param successHandler function to be called on success
 * @param errorHandler function to be called on error
 * @deprecated
 */
digitnexus.ajaxRequest = function(url, requestData, successHandler, errorHandler) {
	digitnexus.ajaxGet(url, requestData, successHandler, errorHandler);
};

/**
 * Makes an ajax GET request to obtain the json in a generic way
 * @param url to make the GET request
 * @param requestData the query parameters
 * @param successHandler function to be called on success
 * @param errorHandler function to be called on error
 */
digitnexus.ajaxGet = function(url, requestData, successHandler, errorHandler) {
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'GET',
		'data':requestData,
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler
	});
};

digitnexus.syncGet = function(url, requestData, successHandler, errorHandler) {
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'GET',
		'data':requestData,
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler,
		'async':false
	});
};

digitnexus.ajaxPost = function(url, postData, successHandler, errorHandler) {
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'POST',
		'data':postData,
		'contentType':'application/json',
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler
	});
};

digitnexus.ajaxPostByContentType = function(url, postData, contentType, successHandler, errorHandler){
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'POST',
		'data':postData,
		'contentType':contentType,
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler
	});
};

digitnexus.ajaxPostByDefaultContentType = function(url, postData, successHandler, errorHandler) {
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'POST',
		'data':postData,
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler
	});
};

digitnexus.syncPost = function(url, postData, successHandler, errorHandler) {
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'POST',
		'data':postData,
		'contentType':'application/json',
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler,
		'async':false
	});
};

digitnexus.syncDelete = function(url, data, successHandler, errorHandler){
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'DELETE',
		'data':data,
		'contentType':'application/json',
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler,
		'async':false
	});
};

digitnexus.ajaxPostWithDataType = function(url, postData, dataType ,successHandler, errorHandler){
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'POST',
		'data':postData,
		'contentType':'application/json',
		'dataType':dataType,
		'success':successHandler,
		'error':errorHandler
	});
};

digitnexus.ajaxWithDataTypeAndType = function(url, postData, contentType, type, successHandler, errorHandler){
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':type,
		'data':postData,
		'contentType':contentType,
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler
	});
};
digitnexus.ajaxPut = function(url, data, processData, successHandler, errorHandler){
	$.ajax({
		'url':'/'+ digitnexus.util.context + url,
		'type':'PUT',
		'data':data,
		'contentType':'application/json',
		'dataType':'json',
		'success':successHandler,
		'error':errorHandler,
		'processData':processData
	});
};

digitnexus.getCurrentUserInfo = function(){
	var currentUserInfo = CookieUtil.getCookie("CURRENTUSERINFO");
	if(currentUserInfo != null && currentUserInfo != ""){
		currentUserInfo = currentUserInfo.replace(/\\/g,"");
		currentUserInfo = currentUserInfo.replace(/^\"|\"$/g,"");
		currentUserINfo = eval('('+currentUserInfo+")");
		return currentUserINfo;
	}else{
		return null;
	}
	
};

digitnexus.showErrorMessage = function(title, message, okAction) {
	var errorMsgDiv = $("#error-message");
	errorMsgDiv.attr('title', title);
	errorMsgDiv.html('<p><span class="icon-error-message" style="float:left; margin:0 7px 50px 0;"></span>' + message + '</p>');
	errorMsgDiv.dialog({
		autoOpen: true,
		modal: true,
		close: function(event, ui) {
			errorMsgDiv.dialog("destroy");
			if (okAction) {
				okAction();
			}
		},
		buttons: {
			Ok: function() {
				errorMsgDiv.dialog("destroy");
				if (okAction) {
					okAction();
				}
			}
		}
	});
};

digitnexus.showSuccessMessage = function(title, message, okAction) {
	var errorMsgDiv = $("#error-message");
	errorMsgDiv.attr('title', title);
	errorMsgDiv.html('<p><span class="icon-success-message" style="float:left; margin:0 7px 50px 0;"></span>' + message + '</p>');
	errorMsgDiv.dialog({
		autoOpen: true,
		modal: true,
		close: function(event, ui) {
			errorMsgDiv.dialog("destroy");
			if (okAction) {
				okAction();
			}
		},
		buttons: {
			Ok: function() {
				errorMsgDiv.dialog("destroy");
				if (okAction) {
					okAction();
				}
			}
		}
	});
};

digitnexus.showPromptMessage = function(id,message,action){
	var mesgAreaDiv = $("#"+id+"_showMessageArea");
	mesgAreaDiv.html("<span id='PromptMesg'>"+message+"</span>");
	mesgAreaDiv.removeClass('tool_show_mesg_area_base').addClass('tool_show_mesg_area');
	window.setTimeout("$('span#PromptMesg').parent().removeClass('tool_show_mesg_area').addClass('tool_show_mesg_area_base').children().remove();",6000);
	if(action){
		action();
	}
};

digitnexus.modifiedArticleName = function(articleName) {
	if(articleName != null && articleName != ""){
		return articleName.replace(/\./g, '_');
	}else{
		return null;
	}
};

digitnexus.emptyRowBuilder = function(rowNum){
	if(rowNum != null && rowNum > 0){
		var oTd = "";
		for(var i = 0; i < rowNum; i++){
			oTd += "<th>&nbsp;&nbsp;</th><td>&nbsp;&nbsp;</td>";
		}
		return oTd;
	}else{
		return "";
	}
};

(function(){
	//IE<9 doesn't have an .indexOf() function for Array,run this before trying to use indexOf
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++)
	    {
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
	
	digitnexus.IMAGE_DIR = 'skins/'+CURRENT_SKIN_DIR+'/images';//images
	
	//take the bigger of these two. I expected these to be same for a maximized window, but windowOuterHeight
	//is giving a bigger value. The reason for that is the invisible title bar for  
	if (window.outerHeight && window.outerWidth) {
		digitnexus.screenHeight = (screen.availHeight > window.outerHeight)?screen.availHeight:window.outerHeight;
		digitnexus.unusableHeight = window.outerHeight - window.innerHeight;
		
		//get  the screen width and unusable with this way can support ie
		digitnexus.screenWidth = screen.availWidth;
		//I do not think this property can be used reliably
		digitnexus.unusableWidth = digitnexus.screenWidth - window.innerWidth;
	} else {
		digitnexus.screenHeight = screen.availHeight;
		digitnexus.unusableHeight = digitnexus.screenHeight - $(window).height();
		
		//get  the screen width and unusable with this way can support firefox
		digitnexus.screenWidth = screen.availWidth - 4;
		digitnexus.unusableWidth = digitnexus.screenWidth - $(window).width();
	}
	digitnexus.windowSize = {
			oldWidth : 0,
			oldHeight : 0,
			width : $(window).width(),
			height : $(window).height()
	};
	$(window).resize(
		function() {
			digitnexus.windowSize.oldWidth = digitnexus.windowSize.width;
			digitnexus.windowSize.oldHeight = digitnexus.windowSize.height;
			digitnexus.windowSize.width = $(window).width();
			digitnexus.windowSize.height = $(window).height();
		}
	);
	//register the Global Ajax Event Handlers ,include ajaxComplete and ajax Error method;
	$(document).ready(function () {
		$(document).ajaxError(function(event,xhr,options,exc){
			if (exc instanceof SyntaxError) {
				digitnexus.showErrorMessage(label_session_timeout_title, label_session_timeout_message,
						function() { window.location = digitnexus.util.ctx; });
			}
		});		
	});
	//extend the string trim method
	String.prototype.trim=function(){
	　　    return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	
	console = console || window.console || new function(){
		this.log = function(msg) {
			//do log
		};
		this.debug = function(msg) {
			//do debug level log
		};
		this.error = function(msg){
			
		};
		this.warn = function(msg){
			
		};
		this.info = function(msg){
			
		};
	};
})();