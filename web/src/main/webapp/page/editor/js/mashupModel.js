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

var mashup = {
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
			var node = new Node(id, name,'OperatorNode',nodeConfigurations);
			mashup.addNode(node);
	},
	
	addEdge : function(obj, source, target){
		var from = obj.getAttribute('from');
		var to = obj.getAttribute('to');
		var attribute = obj.getAttribute('attribute');
		//var id = mashup.sendRequestGetNodeId();
		var edge = new Edge(from, to, attribute);
		edge.mashupId = 1;
		var xmlHttp = getXmlHttpObject();
		sendJson("http://192.168.18.16:8081/library/rest/mashup/addedge", 
				edge, function action(){
                      if(xmlHttp.readyState == 4){                
	                      if(xmlHttp.status == 200){                      
		                     alert("Sucessful!!");
	                      }         
                       }
                      }, "POST", xmlHttp);
	},
	
	addNode : function(node){
		node.mashupId = 1;
		var xmlHttp = getXmlHttpObject();
		sendJson("http://192.168.18.16:8081/library/rest/mashup/addnode", 
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
		sendJson("http://192.168.18.16:8081/library/rest/mashup/nodeid", null, 
				null, "GET", xmlHttp, false);
		return xmlHttp.responseText;
	},
	
	getAllOperatorInfo : function(){
		var xmlHttp = getXmlHttpObject();
		sendJson("http://192.168.18.16:8081/library/rest/bomashup/operator/allinfor", 
				null, this.processResult, "GET", xmlHttp, false);
		//alert(xmlHttp.responseText);
		var objs = eval("("+xmlHttp.responseText+")");
		return objs;
		
	}

}

var Operator = {
		var OperatorInfoList = mashup.getAllOperatorInfo();
		getOperatorEdgeParam : function(type){
			var OperatorInfoList = mashup.getAllOperatorInfo();
			for(var i = 0; i < OperatorInfoList.length; i++){
				var a = OperatorInfoList[i];
				if(a.id == type){
					return a.edgeParam;
				}
			}
		}
}



