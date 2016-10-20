/**
 * this is simulator js file
 * */
digitnexus = (typeof digitnexus == 'undefined') ? {} : digitnexus;
digitnexus.Simulator = function(){
	// control the the inbound monitor status
	this.inboundMonitorStatus=0;
	// control the the outbound monitor status
	this.outboundMonitorStatus=0;
	// inbound listen receive instance ;
	this.inboundListen=null;
	// inbound listen return instance ;
	this.inboundReturnListen=null;
	// outbound listen receive instance ;
	this.outboundListen=null;
	// outbound listen return instance ;
	this.outboundReturnListen=null;
	//inbound receive request info
	this.receivedInboundRequestEntity = {url:'/rest/simulator/message/inbound/received',param:null,
			successHandler:function(response){
				digitnexus.simulator.successReceivedInboundHandler(response);
			},
			errorHandler:function(xhr,status,exception){
				//alert(exception);
				//console.log(exception);
			}};
	//inbound return request info
	this.returnedInboundRequestEntity = {url:'/rest/simulator/message/inbound/returned',param:null,
			successHandler:function(response){
				digitnexus.simulator.successReturnedInboundHandler(response);
			},
		errorHandler:function(xhr,status,exception){
				//alert(exception)
				//console.log(exception);
			}};
	//outbound receive request info
	this.receivedOutboundRequestEntity = {url:'/rest/simulator/message/outbound/received',param:null,
			successHandler:function(response){
				digitnexus.simulator.successReceivedOutboundHandler(response);
			},
			errorHandler:function(xhr,status,exception){
				//alert(exception);
				//console.log(exception);
			}};
	//outbound return request info
	this.returnedOutboundRequestEntity = {url:'/rest/simulator/message/outbound/returned',param:null,
			successHandler:function(response){
				digitnexus.simulator.successReturnedOutboundHandler(response);
			},
			errorHandler:function(xhr,status,exception){
				//alert(exception);
				//console.log(exception);
			}};
	//storage the data source & data type......
	this.dataSourceTypeCollection=null;
	//support the simulator panel reset cache
	this.fileUploader = null;
}
/**
 * simulator init method
 * @author : Bill Huang
 * Date : 2011-10-20 15:45 
 * */
digitnexus.Simulator.prototype.init = function(){
	this.createSimulatorPane();
	// init the tabs
	$( "#tabsSimulator" ).tabs();
	// init the dialog pane
	$("#dialog").attr('title',label_simulator);
	$( "#dialog" ).dialog({
		autoOpen: false,
		show: "blind",
		width: "1000",
		height: "675",
		modal: true
	});
	// init the upload file
	this.createUploader('FileLoad');
	//fill the select's options
	//this.fillDataSource();
};
/**
 * create uploader
 * @param : id
 * @author : Bill Huang
 * Date : 2011-10-20 15:45
 * */
digitnexus.Simulator.prototype.createUploader = function(id){
	var action = digitnexus.util.ctx +"/simulator/echo";
	this.fileUploader = new qq.FileUploader({
        element: digitnexus.util.findDomObj(id),//'FileLoad'
        action: action,
        debug: true,
        multiple: false,
        onComplete: function(id, fileName, responseJSON){
        	var val =  responseJSON.content;
        	digitnexus.util.findDomObj('loadMessageTextarea').value = val;
        }
    });
};
/**
 * cleanContent
 * @author : Bill_Huang
 * Date : 2011-10-24 10:45
 * */
digitnexus.Simulator.prototype.cleanContent = function(id){
	var obj = digitnexus.util.findDomObj(id);
	if(obj != null){
		obj.value = "";
	}
};
/**
 * validation the param
 * @author : Bill Huang
 * Date : 2011-10-25 11:20
 * */
digitnexus.Simulator.prototype.validate = function(){
	
};
/**
 * reset the simulator panel cache data
 * @param null
 * @author Bill_huang
 * Date : 2011-11-16 12:30
 * */
digitnexus.Simulator.prototype.reset = function(){
	digitnexus.util.findDomObj('fileLoadStatus').className = 'statuinit';
	digitnexus.util.findDomObj('inboundStatus').className = 'statuinit';
	digitnexus.util.findDomObj('outboundStatus').className = 'statuinit';
	//inbound
	if(this.inboundMonitorStatus == 1){
		this.monitorInboundData();		
	}
	if(this.inboundListen!=null){
		window.clearInterval(this.inboundListen);
	}
	if(this.inboundReturnListen){
		window.clearInterval(this.inboundReturnListen);
	}
	//outbound
	if(this.outboundMonitorStatus == 1){
		this.monitorOutboundData();		
	}
	if(this.inboundListen!=null){
		window.clearInterval(this.outboundListen);			
	}
	if(this.inboundReturnListen){
		window.clearInterval(this.outboundReturnListen);
	}
	this.cleanContent('loadMessageTextarea');
    this.cleanContent('loadRetrunMessage');
    this.cleanContent('InboundMessageTextarea');
    this.cleanContent('InboundMessage');
    this.cleanContent('OutboundMessageTextarea');
    this.cleanContent('OutboundMessage');
    this.fileUploader._removeItemFromList();
};
/**
 * sendFileLoadData
 * @author : Bill Huang
 * Date : 2011-10-24 10:45
 * */
digitnexus.Simulator.prototype.sendFileLoadData = function(){
	var url = digitnexus.util.ctx + "/simulator/loadmessage";
   	var loadMessageValue = digitnexus.util.findDomObj('loadMessageTextarea').value;
   	var dataSource = digitnexus.util.findDomObj('FileLoadDataSource').value;
   	var dataType = digitnexus.util.findDomObj('FileLoadDataType').value;
   	if(!digitnexus.util.isEmpty(dataSource) && !digitnexus.util.isEmpty(dataType) && !digitnexus.util.isEmpty(loadMessageValue)){
   		var param = "dataSource="+dataSource+"&dataType="+dataType+"&data="+encodeURIComponent(loadMessageValue);
   	   	var xhr;
   	   	if(window.XMLHttpRequest){
   	   		xhr = new XMLHttpRequest();
   	   	}else{
   	   		xhr = new ActiveXObject("Microsoft.XMLHTTP");
   	   	}
   	   	xhr.onreadystatechange = function(){
   	   		if(xhr.readyState == 4){
   	   			//load
   	   			if(xhr.status == 200){
   	   				//ok
   	   				digitnexus.util.findDomObj('loadRetrunMessage').value = xhr.responseText;
   	   				digitnexus.util.findDomObj('fileLoadStatus').className = 'statusuccess';
   	   			}else{
   	   				digitnexus.util.findDomObj('fileLoadStatus').className = 'statusfail';
   	   			}
   	   		}
   	   	}
   	   	xhr.open("POST",url,true);
   	   	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
   	   	xhr.send(param);
   	   	digitnexus.util.findDomObj('fileLoadStatus').className = "statuprocess";
   	}else{
   		$('font#FileLoadRetureSuccess').append("<div class='FileLoadMessage'>DataSource and Type and Message is null..</div>");
		window.setTimeout("$('div').remove('.FileLoadMessage');",4000);
   	}
};
/**
 * monitor inbound data
 * @param : null
 * @author : Bill Huang
 * Date : 2011-10-26  16:16
 * */
digitnexus.Simulator.prototype.monitorInboundData = function(){
	if( this.inboundMonitorStatus == 0 ){
		//open the listen , do not need warit for the backend execute the open function,
		var open = "/rest/simulator/message/inbound/open";
		var dataSource = digitnexus.util.findDomObj('InboundDataSource').value;
	   	var dataType = digitnexus.util.findDomObj('InboundDataType').value;
	   	if(!digitnexus.util.isEmpty(dataSource) && !digitnexus.util.isEmpty(dataType)){
	   		var param = "dataSource="+dataSource+"&dataType="+dataType;
			var openRequestEntity = {url:open,param:param,
					successHandler:function(response){
						$('font#inboundReturnSuccess').append("<div class='inboundMessage'>Listenning Success..</div>");
						window.setTimeout("$('div').remove('.inboundMessage');",4000);
					},
					errorHandler:function(xhr,status,exception){
						$('font#inboundReturnSuccess').append("<div class='inboundMessage'>Listenning Failed..</div>");
						window.setTimeout("$('div').remove('.inboundMessage');",4000);
					}};
			//open the simulator inbound interface
			this.listenData(openRequestEntity);
			this.inboundMonitorStatus = 1;
			//change the simulator css
			digitnexus.util.findDomObj('inboundMonitor').className = "btn_2 btn_cancel1";
			digitnexus.util.findDomObj('inboundStatus').className = 'statuprocess'
			//set asynchronous monitor data ,the data is inboud data
			this.inboundListen = window.setInterval('digitnexus.simulator.listenData(digitnexus.simulator.receivedInboundRequestEntity)',3000);
			//set asynchronous monitor data ,the data is process return inboud data
			window.setTimeout("digitnexus.simulator.inboundReturnListen = window.setInterval('digitnexus.simulator.listenData(digitnexus.simulator.returnedInboundRequestEntity)',3000)",6000);
	   	}else{
	   		$('font#inboundReturnSuccess').append("<div class='inboundMessage'>DataSource or DataType is null..</div>");
			window.setTimeout("$('div').remove('.inboundMessage');",4000);
	   	}
		
	}else if( this.inboundMonitorStatus == 1 ){
		//close the listen , do not need warit for the backend execute the close function,
		var close = "/rest/simulator/message/inbound/close";
		var closeRequestEntity = {url:close,param:null,
				successHandler:function(response){
					$('font#inboundReturnSuccess').append("<div class='inboundMessage'>Cancel Listenning Success..</div>");
					window.setTimeout("$('div').remove('.inboundMessage');",4000);
				},
				errorHandler:function(xhr,status,exception){
					$('font#inboundReturnSuccess').append("<div class='inboundMessage'>Cancel Listenning Failed..</div>");
					window.setTimeout("$('div').remove('.inboundMessage');",4000);
				}};
		this.listenData(closeRequestEntity);
		//change the simulator css
		digitnexus.util.findDomObj('inboundMonitor').className = "btn_2 btn_monitor";
		digitnexus.util.findDomObj('inboundStatus').className = 'statuinit'
		this.inboundMonitorStatus = 0;
		if(this.inboundListen!=null){
			window.clearInterval(this.inboundListen);
		}
		if(this.inboundReturnListen){
			window.clearInterval(this.inboundReturnListen);
		}
	}
};
/**
 * success process the received inbound message handler
 * @param : response
 * @author: Bill Huang
 * Date : 2011-11-04 10:07
 * */
digitnexus.Simulator.prototype.successReceivedInboundHandler = function(response){
	if(response == 'null' || response == null || response == ''){
		//val = obj.value +"\n";
	}else{
		var obj = digitnexus.util.findDomObj('InboundMessageTextarea');
		var val = obj.value + response;
		//var val = obj.value + response +"\n";
		obj.value = val;
	}
};
/**
 * success process the returned inbound message handler
 * @param : response
 * @author Bill Huang
 * Date : 2011-11-04 10:07
 * */
digitnexus.Simulator.prototype.successReturnedInboundHandler = function(response){
	if(response == 'null' || response == null || response == ''){
		//val = obj.value + "\n";
	}else{
		var obj = digitnexus.util.findDomObj('InboundMessage');
		var val = obj.value + response;
		//var val = obj.value + response + "\n";
		obj.value = val;
	}
};
/**
 * monitor outbound data
 * @param : null
 * @author : Bill Huang
 * Date : 2011-10-26 16:16
 * */
digitnexus.Simulator.prototype.monitorOutboundData = function(){
	if( this.outboundMonitorStatus == 0 ){
		var open = "/rest/simulator/message/outbound/open";
		var dataSource = digitnexus.util.findDomObj('OutboundDataSource').value;
	   	var dataType = digitnexus.util.findDomObj('OutboundDataType').value;
		var param = "dataSource="+dataSource+"&dataType="+dataType;
		if(!digitnexus.util.isEmpty(dataSource) && !digitnexus.util.isEmpty(dataType)){
			var openRequestEntity = {url:open,param:param,
					successHandler:function(response){
						$('font#outboundReturnSuccess').append("<div class='outboundMessage'>Listenning Success..</div>");
						window.setTimeout("$('div').remove('.outboundMessage');",4000);
					},
					errorHandler:function(xhr,status,exception){
						$('font#outboundReturnSuccess').append("<div class='outboundMessage'>Listenning Failed..</div>");
						window.setTimeout("$('div').remove('.outboundMessage');",4000);
					}};
			//open the simulator inbound interface
			this.listenData(openRequestEntity);
			digitnexus.util.findDomObj('outboundMonitor').className = "btn_2 btn_cancel1";
			digitnexus.util.findDomObj('outboundStatus').className = 'statuprocess'
			this.outboundMonitorStatus = 1;
			//set asynchronous monitor data ,the data is inboud data
			this.outboundListen = window.setInterval('digitnexus.simulator.listenData(digitnexus.simulator.receivedOutboundRequestEntity)',3000);
			//set asynchronous monitor data ,the data is process return inboud data
			window.setTimeout("digitnexus.simulator.outboundReturnListen = window.setInterval('digitnexus.simulator.listenData(digitnexus.simulator.returnedOutboundRequestEntity)',3000)",6000);
		}else{
			$('font#outboundReturnSuccess').append("<div class='outboundMessage'>DataSource or DataType is null...</div>");
			window.setTimeout("$('div').remove('.outboundMessage');",4000);
		}
	}else if( this.outboundMonitorStatus == 1 ){
		var close = "/rest/simulator/message/outbound/close";
		var closeRequestEntity = {url:close,param:null,
				successHandler:function(response){
					$('font#outboundReturnSuccess').append("<div class='outboundMessage'>Cancel Listenning Success..</div>");
					window.setTimeout("$('div').remove('.outboundMessage');",4000);
				},
				errorHandler:function(xhr,status,exception){
					$('font#outboundReturnSuccess').append("<div class='outboundMessage'>Cancel Listenning Failed..</div>");
					window.setTimeout("$('div').remove('.outboundMessage');",4000);
				}};
		this.listenData(closeRequestEntity);
		digitnexus.util.findDomObj('outboundMonitor').className = "btn_2 btn_monitor";
		digitnexus.util.findDomObj('outboundStatus').className = 'statuinit'
		this.outboundMonitorStatus = 0;
		if(this.inboundListen!=null){
			window.clearInterval(this.outboundListen);			
		}
		if(this.inboundReturnListen){
			window.clearInterval(this.outboundReturnListen);
		}
	}
};
/**
 * outbound received message success handler
 * @param response
 * @author Bill_Huang
 * */
digitnexus.Simulator.prototype.successReceivedOutboundHandler = function(response){
	if(response == 'null' || response == null || response == ''){
		//val = obj.value + "\n";
	}else{
		var obj = digitnexus.util.findDomObj('OutboundMessageTextarea');
		//var val = obj.value + response + "\n";
		var val = obj.value + response;
		obj.value = val;
	}
};
/**
 * outbound return message success handler
 * @param response
 * @author Bill_Huang
 * */
digitnexus.Simulator.prototype.successReturnedOutboundHandler = function(response){
	if(response == 'null' || response == null || response == ''){
		//val = obj.value + "\n";
	}else{
		var obj = digitnexus.util.findDomObj('OutboundMessage');
		var val = obj.value + response;
		//var val = obj.value + response + "\n";
		obj.value = val;
	}
};

/**
 * need to asynchronous listen
 * */
digitnexus.Simulator.prototype.listenData = function(requestEntity){
	//digitnexus.ajaxPost(requestEntity.url,requestEntity.param,requestEntity.successHandler,requestEntity.errorHandler);
	$.ajax({
		'url':'/'+ digitnexus.util.context + requestEntity.url,
		'type':'POST',
		'data':requestEntity.param,
		'contentType': (requestEntity.contentType == null) ? 'application/x-www-form-urlencoded' : requestEntity.contentType,
		'dataType':(requestEntity.dataType == null) ? 'text' : requestEntity.dataType,
		'success':requestEntity.successHandler,
		'error':requestEntity.errorHandler
	});
};
/**
 * fill the options to the dataSource select object
 * @param null
 * @author Bill Huang
 * @Date : 2011-11-02 17:15
 * */
digitnexus.Simulator.prototype.fillDataSource = function(){
	//init this data is request from the backend and dynamic display the simulator UI;
	//and here some code can request the data from backend ....
	///simulator/config
	digitnexus.ajaxGet('/config/simulator', 
			null, 
			function(response) {
				digitnexus.simulator.parseDataSourceTypeValue(response);
				var fileDataSourceNode = digitnexus.util.findDomObj('FileLoadDataSource');
				var inboundDataSourceNode = digitnexus.util.findDomObj('InboundDataSource');
				var outboundDataSourceNode = digitnexus.util.findDomObj('OutboundDataSource');
				var sourceVal = digitnexus.simulator.dataSourceTypeCollection.keyArray();
				if(sourceVal != null && sourceVal.length > 0){
					digitnexus.util.addSelectOption(fileDataSourceNode,sourceVal);
					digitnexus.util.addSelectOption(inboundDataSourceNode,sourceVal);
					digitnexus.util.addSelectOption(outboundDataSourceNode,sourceVal);
					var typeVal = digitnexus.simulator.dataSourceTypeCollection.get(sourceVal[0]);
					digitnexus.simulator.fillDataType(typeVal);
				}
        	}, 
        	function(xhr, status, exception) {
        		//alert('request dataType & dataSource error !');
        		//console.log('request dataType & dataSource error !');
        	});
};
/**
 * parse the dataSource and dataType data to put the collection
 * @param : val; val is json format data
 * @author Bill_Huang
 * @Date : 2011-11-09 19:17
 * */
digitnexus.Simulator.prototype.parseDataSourceTypeValue = function(val){
	var _array = eval(val);
	this.dataSourceTypeCollection = new digitnexus.Collection();
	if(_array != null && _array.length > 0){
		for(var i = 0; i < _array.length; i++){
			var _dataSource = _array[i].DataSource;
			var _dataType = _array[i].DataType;
			var _arr = eval(_array[i].DataType);
			var _dataTypeArray = new Array();
			if(_arr != null && _arr.length > 0){
				for(var j = 0; j < _arr.length; j++){
					_dataTypeArray.push(_arr[j]);
				}
			}
			this.dataSourceTypeCollection.put(_array[i].DataSource,_dataTypeArray);
		}
	}
};
/**
 * when the dataSource value was changed, then the dataType value will be change.
 * @param sourceVal is dataSource value, obj is dataType select object
 * @author Bill_Huang
 * @Date : 2011-11-09 19:17
 * */
digitnexus.Simulator.prototype.fillChangeDataSourceType = function(sourceVal,obj){
	var typeVal = this.dataSourceTypeCollection.get(sourceVal);
	obj.options.length = 0;
	digitnexus.util.addSelectOption(obj,typeVal);
};
/**
 * fill the options to the dataType select Object
 * @param null
 * @author Bill_Huang
 * @Date : 2011-11-02 17:15
 * */
digitnexus.Simulator.prototype.fillDataType = function(val){
	var fileDataTypeNode = digitnexus.util.findDomObj('FileLoadDataType');
	var inboundDataTypeNode = digitnexus.util.findDomObj('InboundDataType');
	var outboundDataTypeNode = digitnexus.util.findDomObj('OutboundDataType');
	digitnexus.util.addSelectOption(fileDataTypeNode,val);
	digitnexus.util.addSelectOption(inboundDataTypeNode,val);
	digitnexus.util.addSelectOption(outboundDataTypeNode,val);
};
/**
 * init the simulator pane
 * @author : Bill_Huang
 * Date : 2011-10-28 18:36 
 * */
digitnexus.Simulator.prototype.createSimulatorPane = function(){
	var content = '<div id="tabsSimulator">'
		+ '<ul>'
		+ '	<li><a href="#tabs-1">'+label_simulator_title_fileload+'</a></li>' //  File Loading
		+ '	<li><a href="#tabs-2">'+label_simulator_title_inbound+'</a></li>'//Inbound Display
		+ '	<li><a href="#tabs-3">'+label_simulator_title_outbound+'</a></li>'//Outbound Display
		+ '</ul>'
		+ '<div id="tabs-1">'
		+ '	<div class="statuBar">'
		+ '    	 <div class="statuinit" id="fileLoadStatus"></div>'
		+ '         <div class="searchBar list1">'
		+ '            <ul>'
		+ '               <li><a class="btn_1" onclick="javascript:digitnexus.simulator.sendFileLoadData();"><span>'+label_simulator_send+'</span></a></li>'
		+ '                <li><div id="FileLoad"></div></li>'
		+ '                <li><font>'+label_simulator_data_type+':</font><select id="FileLoadDataType" name="FileLoadDataType" style="width:100px;"></select></li>'
		+ '                <li><font>'+label_simulator_data_source+':</font><select id="FileLoadDataSource" name="FileLoadDataSource" style="width:100px;" onchange="javascript:digitnexus.simulator.fillChangeDataSourceType(this.value,digitnexus.util.findDomObj(\'FileLoadDataType\'))"></select></li>'
		+ '            	   <li><font style="color:red;" id="FileLoadRetureSuccess"></font></li>'
		+ '            </ul>'
		+ '         </div>'
		+ '    </div>'
		+ '	<div class="simulator_content">'
		+ '       	<div class="title2">'
		+ '       		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_request"></div><a href="#" class="">'+label_simulator_loaded_message+'</a></div></div></div>'
		+ '      		</div>'
		+ '           <textarea class="content1" id="loadMessageTextarea"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '           	<ul>'
		+ '               	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'loadMessageTextarea\')" class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '            </ul>'
		+ '        </div>'
		+ '    </div>'
		+ '	<div class="simulator_content">'
		+ '      	<div class="title2">'
		+ '       		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_response"></div><a href="#" class="">'+label_simulator_return_message+'</a></div></div></div>'
		+ '      		</div>'
		+ '           <textarea class="content2" id="loadRetrunMessage"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '           	<ul>'
		+ '               	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'loadRetrunMessage\')" class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '        </ul>'
		+ '    </div>'
		+ '</div>'
		+ '</div>'
		+ '<div id="tabs-2">'
		+ '<div class="statuBar">'
		+ '    	 <div class="statuinit" id="inboundStatus"></div>'
		+ '         <div class="searchBar list1">'
		+ '            <ul>'
		+ '                <li><a class="btn_1" id="inboundMonitor" onclick="javascript:digitnexus.simulator.monitorInboundData();"><span>'+label_simulator_monitor+'</span></a></li>'
		+ '                <li><font>'+label_simulator_data_type+':</font><select id="InboundDataType" name="InboundDataType" style="width:100px;"></select></li>'
		+ '            	<li><font>'+label_simulator_data_source+':</font><select id="InboundDataSource" name="InboundDataSource" style="width:100px;" onchange="javascript:digitnexus.simulator.fillChangeDataSourceType(this.value,digitnexus.util.findDomObj(\'InboundDataType\'))"></select></li>'
		+ '            	<li><font style="color:red;" id="inboundReturnSuccess"></font></li>'
		+ '            </ul>'
		+ '         </div>'
		+ '    </div>'
		+ '    <div class="simulator_content">'
		+ '    	<div class="title2">'
		+ '    		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_request"></div><a href="#" class="">'+label_simulator_inbound_message+'</a></div></div></div>'
		+ '   		</div>'
		+ '        <textarea class="content1" id="InboundMessageTextarea"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '        	<ul>'
		+ '            	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'InboundMessageTextarea\')" class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '            </ul>'
		+ '        </div>'
		+ '    </div>'
		+ '    <div class="simulator_content">'
		+ '    	<div class="title2">'
		+ '    		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_response"></div><a href="#" class="">'+label_simulator_return_message+'</a></div></div></div>'
		+ '   		</div>'
		+ '        <textarea class="content2" id="InboundMessage"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '        	<ul>'
		+ '            	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'InboundMessage\')"  class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '            </ul>'
		+ '        </div>'
		+ '    </div>'
		+ '</div>'
		+ '<div id="tabs-3">'
		+ '<div class="statuBar">'
		+ '    	 <div class="statuinit"  id="outboundStatus"></div>'
		+ '         <div class="searchBar list1">'
		+ '            <ul>'
		+ '                <li><a class="btn_1" id="outboundMonitor" onclick="javascript:digitnexus.simulator.monitorOutboundData();"><span>'+label_simulator_monitor+'</span></a></li>'
		+ '                <li><font>'+label_simulator_data_type+':</font><select id="OutboundDataType" name="OutboundDataType" style="width:100px;"></select></li>'
		+ '            	<li><font>'+label_simulator_data_source+':</font><select id="OutboundDataSource" name="OutboundDataSource" style="width:100px;" onchange="javascript:digitnexus.simulator.fillChangeDataSourceType(this.value,digitnexus.util.findDomObj(\'OutboundDataType\'))"></select></li>'
		+ '            	<li><font style="color:red;" id="outboundReturnSuccess"></font></li>'
		+ '            </ul>'
		+ '         </div>'
		+ '    </div>'
		+ '    <div class="simulator_content">'
		+ '    	<div class="title2">'
		+ '    		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_request"></div><a href="#" class="">'+label_simulator_outbound_message+'</a></div></div></div>'
		+ '   		</div>'
		+ '		<textarea class="content1" id="OutboundMessageTextarea"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '        	<ul>'
		+ '            	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'OutboundMessageTextarea\')" class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '            </ul>'
		+ '        </div>'
		+ '    </div>'
		+ '    <div class="simulator_content">'
		+ '    	<div class="title2">'
		+ '    		<div class="title2_l"><div class="title2_r"><div class="title2_m"><div class="btn_icon1 icon_response"></div><a href="#" class="">'+label_simulator_return_message+'</a></div></div></div>'
		+ '   		</div>'
		+ '		<textarea class="content2" id="OutboundMessage"></textarea>'
		+ '		<div class="btnBar list1">'
		+ '        	<ul>'
		+ '            	<li><a href="#" onclick="javascript:digitnexus.simulator.cleanContent(\'OutboundMessage\')" class="btn_1"><span>'+label_simulator_clean+'</span></a></li>'
		+ '            </ul>'
		+ '        </div>'
		+ '    </div>'
		+ '</div>'
		+ '</div>';
		$('div#dialog').append(content);
};
digitnexus.simulator = new digitnexus.Simulator();