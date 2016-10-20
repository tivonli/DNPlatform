
digitnexus = (typeof digitnexus == 'undefined') ? {} : digitnexus;
digitnexus.Util = function(){
	this.ctx=null;
	this.context=null;
	this.sourceEntityCollection=null;
	this.sourceUrlCollection=null;
};
/**
 * initialization util
 * @param null
 * @author : bill
 * Date : 2011-10-20 14:58
 * */
digitnexus.Util.prototype.init = function(){
	this.context = (window.location.pathname).substring(1);
	this.context = this.context.substring(0,this.context.indexOf('/'));
	this.ctx = window.location.protocol +"//"+ window.location.host + "/" +this.context;
};
/**
 * initialization the tool's menu
 * @param null
 * @author : bill_Huang
 * @Date : 2011-10-30 14:58
 * */
digitnexus.Util.prototype.initToolMenu = function(){
	this.createToolMenu();
	$( "#dataLoaderDialog" ).attr('title',label_dataLoaderTitle);
	$( "#dataLoaderDialog" ).dialog({
		resizable: false,
		autoOpen: false,
		show: "blind",
		width: "550",
		height: "180",
		modal: true
	});
	$('li.topBtn_tool').contextMenu('toolMenu', {
        bindings: {
          'Simulator': function(t) {
        	  $( "#dialog" ).dialog( "open" );
        	  digitnexus.simulator.reset();
          },
          'DataLoader':function(t){
        	  $( "#dataLoaderDialog" ).dialog( "open" );
          }
        }
      });
	//this.fillDataLoaderParameter();
};

/**
 * 
 * */
digitnexus.Util.prototype.initSettingMenu = function(){
	this.createSettingMenu();
	$('li.topBtn_setting').contextMenu('settingMenu',{
		bindings: {
			'ChangeLanuage': function(t){
				var currentLocale = CookieUtil.currentLocale;				
				$("input[name='lan']").each(function(){
					if($(this).val() == currentLocale){
						$(this).attr("checked","checked");
					}
				})
				$("#settingDialog").dialog( "open" );
			},
			'SettingSkin': function(t){				
				$("input[name='skin']").each(function(){
					if($(this).val() == window.CURRENT_SKIN_DIR){
						$(this).attr("checked","checked");
					}
				})
				$("#skinSettingDialog").dialog( "open" );
			}
		}
	});
	$("#skinSettingDialog").attr('title',label_settingSkinTitle);
	$("#skinSettingDialog").dialog({
		resizable: false,
		autoOpen: false,
		show: "blind",
		width: "500",
		height: "190",
		modal: true,
		buttons : [{
			text:label_ok,
			click:function(){	
				var checkedElement = $("input[name='skin']:checked");
				var skin = checkedElement.val();
				if(skin&&skin!=CURRENT_SKIN_DIR){
					digitnexus.util.changeSkin(checkedElement[0]);
					//digitnexus.util.changeSkinInBackEnd({dialog:$(this),radio:checkedElement[0]});
				}
				$(this).dialog( "close" );
			}
		},{
			text: label_cancel,
		    click: function() {$(this).dialog( "close" );}
		}]	
	});
	var skinSetting = '<div><center><table class="table_3 skinSetting">';
	skinSetting += '<tr><td><img src="skins/skin1/skin1.png"/></td><td><img src="skins/skin2/skin2.png"/></td>'
	skinSetting += '<td><img src="skins/skin3/skin3.png"/></td><td><img src="skins/skin4/skin4.png"/></td>';
	skinSetting += '<td><img src="skins/skin5/skin5.png"/></td></tr>';
	skinSetting += '<tr><th>'+ label_skin1 +'<input type="radio" name="skin" value="skin1" ></th>'
				 + '<th>'+ label_skin2 +'<input type="radio" name="skin" value="skin2" ></th>'
				 + '<th>'+ label_skin3 +'<input type="radio" name="skin" value="skin3" ></th>'
				 + '<th>'+ label_skin4 +'<input type="radio" name="skin" value="skin4" ></th>'
				 + '<th>'+ label_skin5 +'<input type="radio" name="skin" value="skin5" ></th></tr>';
	skinSetting += '</table></center></div>';
	$('div#skinSettingDialog').append(skinSetting);
	$("#settingDialog").attr('title',label_languageSettingTitle);
	$("#settingDialog").dialog({
		resizable: false,
		autoOpen: false,
		show: "blind",
		width: "400",
		height: "130",
		modal: true,		
		buttons : [{
			 text: label_ok,
		     click: function() { 
		    	 var lans = $("input[name='lan']");
					$(lans).each(function(){
						if(this.checked == true){
							$(this).dialog( "close" );
							window.location.href=digitnexus.util.ctx+"/uimangeService?method=setLanguage&lan="+this.value;
						}
					});
		     }
		},{
			text: label_cancel,
		    click: function() {$(this).dialog( "close" );}
		}]	
	});
	var lanuageSetting = '<div class="lanuageSetting"><ul>';//
	lanuageSetting += '<li><input type="radio" name="lan" id="" value="zh_CN" />'+ label_simple_chinese +'</li>';
	lanuageSetting += '<li><input type="radio" name="lan" id="" value="en" />'+ label_english +'</li>';
	lanuageSetting += '</ul></div>';
	$('div#settingDialog').append(lanuageSetting);
};

digitnexus.Util.prototype.initHelpMenu = function(){
	this.createHelpMenu();
	$("#helpDialog").attr('title',label_helpTitle);
	$("#helpDialog").dialog({
		resizable: false,
		autoOpen: false,
		show: "blind",
		width: "500",
		height: "270",
		modal: true,
		buttons : [{
			 text: label_cancel,
		     click: function() { $(this).dialog( "close" ); }
		}]
	});
	$( "li#help" ).click(function() {
		$( "#helpDialog" ).dialog( "open" );
		return false;
	});
};

/**
 * 
 * */
digitnexus.Util.prototype.initLogoutMenu = function(){
	this.createLogoutMenu();
	$("#logoutDialog").attr('title',label_exitTitle);
	$( "#logoutDialog" ).dialog({
		resizable: false,
		autoOpen: false,
		show: "blind",
		//width: "1000",
		height: "130",
		modal: true,
		buttons : [{
			text: label_sure,
			click: function(){
				$(this).dialog( "close" );
				window.location.href=digitnexus.util.ctx+"/uimangeService?method=logout";
			} 
		},{
			text: label_cancel,
		    click: function() { $(this).dialog( "close" ); }
		}]
	});
	$( "li#logout" ).click(function() {
		$( "#logoutDialog" ).dialog( "open" );
		return false;
	});
};

/**
 * 
 * */
digitnexus.Util.prototype.createSettingMenu = function(){
	var settingMenu = '<div class="contextMenu" id="settingMenu" style="display:none;">'; 
	settingMenu += '<ul>';
	settingMenu += '<li id="ChangeLanuage"><a> '+label_languageSetting+' </a></li>';
	settingMenu += '<li id="SettingSkin"><a> '+label_settingSkinTitle+' </a></li>';
	settingMenu += '</ul>';
	settingMenu += '</div>';
	$('li#setting').append(settingMenu);
};

/**
 * 
 * 
 * */
digitnexus.Util.prototype.createHelpMenu = function(){
	var helpMenu = '<div class="helpDialog">';
	helpMenu += '<div class="helpDialog_title">';
	helpMenu += label_help_title;
	helpMenu += '</div>';
	helpMenu += '<div class="helpDialog_title2">'+label_help_version+'</div>';
	helpMenu += '<div class="helpDialog_title2">'+label_help_copyRight+'</div>';
	helpMenu += '<div class="helpDialog_title2">'+label_help_companyUrl+'</div>';
	helpMenu += '<div class="helpDialog_content"">'+label_help_warning+'</div>';
	helpMenu += '</div>';
	$('div#helpDialog').append(helpMenu);
};

/**
 * create the tool's panel
 * @param null
 * @author : bill_Huang
 * @Date : 2011-10-30 14:58
 * */
digitnexus.Util.prototype.createToolMenu = function(){
	this.createDataLoaderPanel();
	var toolMenu = '<div class="contextMenu" id="toolMenu" style="display:none;">';
	toolMenu += '<ul>';
	//toolMenu += '<li id="Simulator"><a> '+label_simulator+' </a></li>'; //  Simulator
	toolMenu += '<li id="DataLoader"><a> '+label_dataLoaderTitle+' </a></li>';// DataLoader
	toolMenu += '</ul>';
	toolMenu += '</div>';
	$('li#tool').append(toolMenu);
};

/**
 * create logout the menu
 * 
 * */
digitnexus.Util.prototype.createLogoutMenu = function(){
	var logoutMenu = '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 2px 0 5px;"></span>'+label_exitContent+'</p>';//   Are you sure Exit?
	$('div#logoutDialog').append(logoutMenu);
};

/**
 * 
 * */
digitnexus.Util.prototype.changeSkin = function(obj){
	var skins = $("input[name='skin']");
	if(skins){
		$(skins).each(function(){
			this.checked = false;
		});
	}
	obj.checked = true;
	var url = "/uimangeService/setSkin?CURRENT_SKIN_DIR="+obj.value;
	digitnexus.ajaxPost(url,null,
			function(response) {
				window.location.reload();
        	}, 
        	function(xhr, status, exception) {
        		window.location.reload();
        	});
	
};

digitnexus.Util.prototype.changeSkinInFrontEnd = function(obj){
	var skinPath = "skins/"+obj.value;
	var linkUrl = skinPath+"/style/main.css";
	$.get(linkUrl, function(data) {
		/*console.log("skinPath : "+skinPath);
		console.log("before : "+data);
		var cssContent = data.replace(/\$\{[^\}]+\}/,skinPath);
		console.log("after : "+cssContent);*/
		//${skinPath}   skins/sss  
		//  /\$\{[^\}]+\}/
		$('#skin-css-link-main').empty().append(data);
	});
};

digitnexus.Util.prototype.changeSkinInBackEnd = function(obj){
	var url = "/uimangeService/setSkin?CURRENT_SKIN_DIR="+obj.radio.value;
	digitnexus.ajaxPost(url,null,
			function(response) {
				obj.dialog.dialog( "close" );
        	}, 
        	function(xhr, status, exception) {
        		//window.location.reload();
        	});
};
/**
 * fill the data loader parameter
 * 
 * */
digitnexus.Util.prototype.fillDataLoaderParameter = function(){
	digitnexus.ajaxGet('/config/dataloader',null,
			function(response) {
				digitnexus.util._fillDataLoaderParameter(response);
        	}, 
        	function(xhr, status, exception) {
        		//alert('request SourceType & Entity & url error !');
        		//console.log('request SourceType & Entity & url error !');
        	});
};

/**
 * 
 * */
digitnexus.Util.prototype._fillDataLoaderParameter = function(parameter){
	//var parameter = '[{"SourceType":"CSV","Entity":["Asset","User","AssetLocation","Task","Vehicle"],"SourceUrl":"/CSVDataLoader"},{"SourceType":"EDI","Entity":["Asset"],"SourceUrl":"/dataloader/edi"}]';
	this.parseDataLoaderSourceTypeEntity(parameter);
	var sourceTypeVal = this.sourceEntityCollection.keyArray();
	this.fillSourceType(sourceTypeVal);
	var _entity = this.sourceEntityCollection.get(sourceTypeVal[0]);
	this.fillEntity(_entity);
	var _url = this.sourceUrlCollection.get(sourceTypeVal[0]);
	this.fillUrl(_url);
}
/**
 * onChange event tigger this function; when the value was changed, then the other options will be changed..etc
 * 
 * */
digitnexus.Util.prototype.ChangeSourceTypeEntity = function(sourceVal){
	var typeVal = this.sourceEntityCollection.get(sourceVal);
	
	var entityNode = digitnexus.util.findDomObj('entity');
	entityNode.options.length = 0;
	digitnexus.util.addSelectOption(entityNode,typeVal);
	
	var url = this.sourceUrlCollection.get(sourceVal);
	var formNode = digitnexus.util.findDomObj('fileForm');
	formNode.action = url;
};
/**
 * parse the dataloader sourceType and entity
 * 
 * */
digitnexus.Util.prototype.parseDataLoaderSourceTypeEntity = function(val){
	var _data = eval(val);
	this.sourceEntityCollection = new digitnexus.Collection();
	this.sourceUrlCollection = new digitnexus.Collection();
	if(_data != null && _data.length > 0){
		for(var i = 0; i < _data.length; i ++){
			var _sourceType = _data[i].SourceType;
			var _entity = _data[i].Entity;
			var _sourceUrl = digitnexus.util.ctx + _data[i].SourceUrl;
			var _arr = eval(_entity);
			var _entityArray = new Array();
			if(_arr != null && _arr.length > 0){
				for(var j = 0; j < _arr.length; j++){
					_entityArray.push(_arr[j]);
				}
			}
			this.sourceEntityCollection.put(_sourceType,_entityArray);
			this.sourceUrlCollection.put(_sourceType,_sourceUrl);
		}
	}
};
/**
 * fill url
 * 
 * */
digitnexus.Util.prototype.fillUrl = function(val){
	var formNode = digitnexus.util.findDomObj('fileForm');
	formNode.action = val;
};
/**
 * fill entity
 * 
 * */
digitnexus.Util.prototype.fillEntity = function(val){
	var entityNode = digitnexus.util.findDomObj('entity');
	digitnexus.util.addSelectOption(entityNode,val);
};
/**
 * fill source type
 * 
 * */
digitnexus.Util.prototype.fillSourceType = function(val){
	var sourceTypeNode = digitnexus.util.findDomObj('sourceType');
	digitnexus.util.addSelectOption(sourceTypeNode,val);
};
/**
 * create the dataLoader Panel
 * 
 * */
digitnexus.Util.prototype.createDataLoaderPanel = function(){
	var content = '<div><form name="fileForm" id="fileForm" method="post" enctype="multipart/form-data" action="'+digitnexus.util.ctx+'/dataloader/edi">'
		+ '				<ul class="form_1">'
		+ '	            	<li><div class="lable">'+label_dataload_source_type+'：</div><div class="inp"><select id="sourceType" name="" style="width:150px;" onchange="javascript:digitnexus.util.ChangeSourceTypeEntity(this.value)">'
		+ '	            	</select></div></li>'
		+ '	            	<li><div class="lable">'+label_dataload_entity+'：</div><div class="inp"><select id="entity" name="dataObjectName" style="width:150px;">'
		+ '	            	</select></div></li>'
		+ '	            	<li><div class="lable">'+label_dataload_select_file+'：</div><div class="inp"><input name="file" type="file" style="width:200px;"/></div></li>'
		+ '	                <li class="btn"><a href="#" onclick="document.forms[document.forms.length-1].submit();" class="btn_1"><span>'+label_dataload_upload+'</span></a></li>'
		+ '	            </ul>'
		+ '	      </form></div>';
	//<a class="btn_chooseFile"></a>
	$('div#dataLoaderDialog').append(content);
}
/**
 * initialization the menu
 * @param null
 * @author : bill_Huang
 * @Date : 2011-10-30 14:58
 * */
digitnexus.Util.prototype.initMenu = function(){
	this.internationalization();
	this.initToolMenu();
	this.initSettingMenu();
	this.initHelpMenu();
	this.initLogoutMenu();
};

/**
 * 
 * */
digitnexus.Util.prototype.internationalization = function(){
	$('div#logout_label').html('<div class="btn_icon1 icon_logout1"></div>'+label_logout);
    $('div#help_label').html('<div class="btn_icon1 icon_help1"></div>'+label_help);
    $('div#setting_label').html('<div class="btn_icon1 icon_setting1"></div>'+label_setting);
    $('div#tool_label').html('<div class="btn_icon1 icon_tool1"></div>'+label_tool);
};

/**
 * add options to select object
 * @param node--select Object, value--option value, actually the value is array;
 * @author Bill_Huang
 * @Date : 2011-11-02 16:23
 * */
digitnexus.Util.prototype.addSelectOption = function(node,value){
	if(this.isEmpty(node)){
		return;
	}
	if(this.isEmpty(value)&&value.length == 0){
		return;
	}
	for(var i = 0;i < value.length; i++){
		node.options[node.options.length] = new Option(value[i],value[i]);
	}
};
/**
 * add empty options to select object
 * @param node -- select Object
 * 
 * 
 * */
digitnexus.Util.prototype.addSelectEmptyOption = function(node){
	if(this.isEmpty(node)){
		return;
	}
	node.options[node.options.length] = new Option(" ... ... "," ");
};
/**
 * calculate the numerator and denominator percentage
 * 
 * */
digitnexus.Util.prototype.calculatePercentage = function(numerator,denominator,bit){
	if(bit == null || bit == 0){
		bit = 2;
	}
	if(numerator == null || numerator == 0){
		return "0%";
	}
	if(denominator == null || denominator == 0){
		return "0%";
	}
	if(isNaN(numerator) || isNaN(denominator) || isNaN(bit)){
		return "0%";
	}
	var result = (Number(numerator)/Number(denominator)) * 100;
	if((result+"").indexOf(".") != -1){
		var SeparatedNumber = (result+"").indexOf(".");
		var fontNumber = (result+"").substring(0,SeparatedNumber);
		var backNumber = (result+"").substring(SeparatedNumber+1);
		if(backNumber.length > bit){
			return fontNumber +"."+ backNumber.substring(0,bit) +"%";
		}else{
			return result + "%";
		}
	}else{
		return result + "%";
	}
};
/**
 * determine the object is null
 * @param value | object
 * @author Bill_Huang
 * @Date : 2011-11-02 16:23
 * */
digitnexus.Util.prototype.isEmpty = function(value){
	if(value != null && value != ""){
		return false;
	}else{
		return true;
	}
};
/**
 * according to id find dom object in the current html page
 * @param : id
 * @author Bill_Huang
 * @Date : 2011-11-02 16:23
 * */
digitnexus.Util.prototype.findDomObj = function(id){
	var obj = null;
	obj = document.getElementById(id);
	if(obj == null){
		try{
			obj = document.getElementsByName(id)[0];			
		}catch(e){}
	}
	if(obj == null){
		try{
			var frm = document.forms[document.forms.length-1];
			obj     = frm[id];
		}catch(e){}
	}
	return obj;
};
/**
 * ajax method
 * @author : bill
 * Date : 2011-10-20 11:42
 */
digitnexus.Util.prototype.ajaxRequest = function(requestURL,requestEntity){
	var backEntity = null;
	if(requestURL == null || requestURL == ''){
		alert("url is empty, please set url !");
	}
	requestEntity 		   = (requestEntity == undefined || requestEntity == null) ? {} : requestEntity;
	var requestData        = (requestEntity.ajax_data == undefined || requestEntity.ajax_data == null) ? "": requestEntity.ajax_data; 
	var requestType 	   = (requestEntity.ajax_type == undefined || requestEntity.ajax_type == null) ? "GET": requestEntity.ajax_type;
	var requestAsync 	   = (requestEntity.ajax_async == undefined || requestEntity.ajax_async == null) ? false: requestEntity.ajax_async;
	var requestDataType    = (requestEntity.ajax_dataType == undefined || requestEntity.ajax_dataType == null) ? "json": requestEntity.ajax_dataType;
	var requestContentType = (requestEntity.ajax_contentType == undefined || requestEntity.ajax_contentType == null) ? "application/json" : requestEntity.ajax_contentType;
	var requesttimeout     = (requestEntity.ajax_timeout == undefined || requestEntity.ajax_timeout == null) ? null : requestEntity.ajax_timeout;
	try{
		var	 define = {   
			        url         : requestURL,  
			        type        : requestType,
			        async       : requestAsync,
			        data        : requestData,
			        dataType    : requestDataType,
			        contentType : requestContentType,
			        success	    : function(data){ 
		        			 	  backEntity = data;
			        		   },   
			        error       : function(data){
			        			  throw new Error("Ajax Request["+requestURL+";"+data.code+"] error !");
							   }
			    };
		if(requesttimeout !=null && parseInt(requesttimeout) != NaN){
		   define.timeout = requesttimeout; 
		}
		$.ajax(define);
		return backEntity;
	 }catch(e){
	 	throw new Error(e.message);  
	 }
};

digitnexus.Util.prototype.cleanContent = function(id){
	var obj = digitnexus.util.findDomObj(id);
	if(obj != null){
		obj.value = "";
	}
};

digitnexus.util = new digitnexus.Util();
digitnexus.util.init();