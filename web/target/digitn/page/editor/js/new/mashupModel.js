function Node(id, name, type, nodeConfigurations){
	this.id = id;
	this.mashupId;
	this.name = name;
	this.type = type;
	this.nodeConfigurations = nodeConfigurations;
}

function NodeConfigId(id, key){
	this.id = id;
	this.key = key;
}

function NodeConfiguration(nodeConfigId, value){
	this.nodeConfigId = nodeConfigId;
	this.value = value;
}

function Edge(fromId, toId, attribute){
	this.id;
	this.mashupId;
	this.fromId = fromId;
	this.toId = toId;
	this.attribute = attribute;
}

function MashupInfo(name, type){
	this.id;
	this.name = name;
	this.link;
	this.type = type;
}

var mashupDefinition = null;
var mashup = {
	savaMashupDefinition : function(obj){
		var name = obj.getAttribute('name');
		var type = obj.getAttribute('type');
		var mashupInfo = new MashupInfo(name,type);
		var xmlHttp = getXmlHttpObject();
		sendJson("rest/mashup/mashupdefinition/add", mashupInfo, 
				function(){
			       if(xmlHttp.readyState == 4){                
				      if(xmlHttp.status == 200){ 
				    	  result = eval("[" + xmlHttp.responseText + "]");
				    	  mashupDefinition = result[0];
				    	  obj.setAttribute("mashupId", mashupDefinition.id);
				    	  alert("Sucessful!!");
				}         
			}
		}, "POST", xmlHttp, true);
	},
	
	saveJdbcOperator : function(obj){
			var name = obj.getAttribute('name');
			var id = mashup.sendRequestGetNodeId();
			obj.setAttribute("nodeId", id);
			var sql = obj.getAttribute('sql');
			var header = obj.getAttribute('header');
			var nodeConfigurations = new Array();
			var nc1 = new NodeConfiguration(new NodeConfigId(id, 'jdbcSqlInput'), sql);
			nodeConfigurations.push(nc1);
			var nc2 = new NodeConfiguration(new NodeConfigId(id, 'jdbcHeaderInput'), header);
			nodeConfigurations.push(nc2);
			var nc3 = new NodeConfiguration(new NodeConfigId(id, 'Operator'), 'jdbcOperator');
			nodeConfigurations.push(nc3);
			var node = new Node(id, name,'OperatorNode',nodeConfigurations);
			mashup.addNode(node);
	},
	
	saveJoinOperator : function(obj){
		var name = obj.getAttribute('name');
		var id = mashup.sendRequestGetNodeId();
		obj.setAttribute("nodeId", id);
		var joinType = obj.getAttribute('joinType');
		var joinHeader = obj.getAttribute('joinHeader');
		var nodeConfigurations = new Array();
		var nc1 = new NodeConfiguration(new NodeConfigId(id, 'joinTypeInput'), joinType);
		nodeConfigurations.push(nc1);
		var nc2 = new NodeConfiguration(new NodeConfigId(id, 'joinHeaderInput'), joinHeader);
		nodeConfigurations.push(nc2);
		var nc3 = new NodeConfiguration(new NodeConfigId(id, 'Operator'), 'joinOperator');
		nodeConfigurations.push(nc3);
		var node = new Node(id, name,'OperatorNode',nodeConfigurations);
		mashup.addNode(node);
	},
	
	saveDataNode : function(obj){
			var name = obj.getAttribute('name');
			var id = mashup.sendRequestGetNodeId();
			obj.setAttribute("nodeId", id);
			var nodeConfigurations = new Array();
			var node = new Node(id, name,'DataNode', nodeConfigurations);
			mashup.addNode(node);
	},

	saveDataBase : function(obj){
			var name = obj.getAttribute('name');
			var id = mashup.sendRequestGetNodeId();
			obj.setAttribute("nodeId", id);
			var nodeConfigurations = new Array();
			var node = new Node(id,name,'DataNode', nodeConfigurations);
			mashup.addNode(node);
	},
	
	saveJsonOperator : function(obj){
			var name = obj.getAttribute('name');
			var id = mashup.sendRequestGetNodeId();
			obj.setAttribute("nodeId", id);
			var sql = obj.getAttribute('sql');
			var header = obj.getAttribute('header');
			var nodeConfigurations = new Array();
			var nc1 = new NodeConfiguration(new NodeConfigId(id, 'Operator'), 'jsonOperator');
			nodeConfigurations.push(nc1);
			var node = new Node(id, name,'OperatorNode',nodeConfigurations);
			mashup.addNode(node);
	},
	
	saveFusionChartOperator : function(obj){
		var name = obj.getAttribute('name');
		var caption = obj.getAttribute('caption');
		var subCaption = obj.getAttribute('subCaption');
		var xAxisname = obj.getAttribute('xAxisname');
		var yAxisname = obj.getAttribute('yAxisname');
		var chartType = obj.getAttribute('chartType');
		var id = mashup.sendRequestGetNodeId();
		obj.setAttribute("nodeId", id);
		var nodeConfigurations = new Array();
		var nc1 = new NodeConfiguration(new NodeConfigId(id, 'caption'), caption);
		nodeConfigurations.push(nc1);
		var nc2 = new NodeConfiguration(new NodeConfigId(id, 'subCaption'), subCaption);
		nodeConfigurations.push(nc2);
		var nc3 = new NodeConfiguration(new NodeConfigId(id, 'xaxisname'), xAxisname);
		nodeConfigurations.push(nc3);
		var nc4 = new NodeConfiguration(new NodeConfigId(id, 'yaxisname'), yAxisname);
		nodeConfigurations.push(nc4);
		var nc5 = new NodeConfiguration(new NodeConfigId(id, 'chartType'), chartType);
		nodeConfigurations.push(nc5);
		var nc6 = new NodeConfiguration(new NodeConfigId(id, 'Operator'), 'fusionChartOperator');
		nodeConfigurations.push(nc6);
		var node = new Node(id, name,'OperatorNode',nodeConfigurations);
		mashup.addNode(node);
	},
	
	addEdge : function(obj, source, target){
		var from = obj.getAttribute('from');
		var to = obj.getAttribute('to');
		var attribute = obj.getAttribute('attribute');
		var id = mashup.sendRequestGetNodeId();
		//var id = mashup.sendRequestGetNodeId();
		var edge = new Edge(from, to, attribute);
		edge.mashupId = mashupDefinition.id;
		var xmlHttp = getXmlHttpObject();
		sendJson("rest/mashup/addedge", 
				edge, function action(){
                      if(xmlHttp.readyState == 4){                
	                      if(xmlHttp.status == 200){                      
		                     alert("Sucessful!!");
	                      }         
                       }
                      }, "POST", xmlHttp, true);
	},
	
	addNode : function(node){
		node.mashupId = mashupDefinition.id;
		var xmlHttp = getXmlHttpObject();
		sendJson("rest/mashup/addnode", 
				node, function(){
			              if(xmlHttp.readyState == 4){                
				             if(xmlHttp.status == 200){                      
				            	 mxUtils.alert("Save Sucessfully!!");
				}         
			}
		}, "POST", xmlHttp, true);
	},
	
	sendRequestGetNodeId : function(a){
		var xmlHttp = getXmlHttpObject();
		sendJson("rest/mashup/nodeid", null, 
				null, "GET", xmlHttp, false);
		return xmlHttp.responseText;
	},
	
	getAllOperatorInfo : function(){
		var xmlHttp = getXmlHttpObject();
		sendJson("rest/bomashup/operator/allinfor", 
				null, this.processResult, "GET", xmlHttp, false);
		var objs = eval("("+xmlHttp.responseText+")");
		return objs;
		
	}

}




