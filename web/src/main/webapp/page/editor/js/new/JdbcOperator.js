function JdbcOperator(editor){
	this.editor = editor;
	this.graph = this.editor.graph;
	this.model = this.graph.model;
	this.multiplicities = new Array();
	this.overlaysMap = new Map();
	this.init();
}
JdbcOperator.prototype = new MashupNode();
JdbcOperator.prototype.constructor = JdbcOperator;
JdbcOperator.prototype.outgoingEdgeParam = null;
JdbcOperator.prototype.ingoingEdgeParam = null;
JdbcOperator.prototype.overlaysMap = null;
JdbcOperator.prototype.init = function(){
//	var edgeParam = OperatorUtils.getOperatorEdgeParam('jdbcOperator');
//	this.outgoingEdgeParam = edgeParam["output"];
//	this.ingoingEdgeParam = edgeParam['input'];
	var edgeParam = OperatorUtils.getOperatorEdgeParam('jdbcOperator');
	this.outgoingEdgeParam = OperatorUtils.getOperatorOutEdgeParam('jdbcOperator');
	this.ingoingEdgeParam = OperatorUtils.getOperatorInEdgeParam('jdbcOperator');
	
	//create overlay
	var step = -50;
	for(var i = 0; i < this.outgoingEdgeParam.length; i ++){
		var overlay = new mxCellOverlay(new mxImage('images/add.png', 24, 24), 'Add DataNode');
		overlay.cursor = 'hand';
		overlay.offset = new mxPoint(50, step);
		step = step + 24;
		overlay.align = mxConstants.ALIGN_CENTER;
		this.overlaysMap.put((this.outgoingEdgeParam)[i].key, overlay);
	}
}
// supposing all of the outgoing key corresponding to DataNode
JdbcOperator.prototype.createOverlayListener = function(cell, key, overlay, nodeMap){
	overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt){
		var model = this.model;
		var editor = this.editor;
		var graph = this.graph;
		var parent = cell.getParent();
		
		var e = evt.getProperty('event');
		var x = mxEvent.getClientX(e);
		var y = mxEvent.getClientY(e);
		
		var v1Geo = model.getGeometry(cell);
		var vertex = editor.templates['dataNode'];
		var node = nodeMap.get('dataNode');
		var style = node.getAttribute("style");
		if (vertex != null && style != null) {
			vertex = vertex.clone();
			vertex.setStyle(style);
		}
		//var cell = graph.getModel().cloneCell(template);
		editor.addVertex(parent, vertex, x, y + 100);

		model.beginUpdate();
		try
		{
			var edge = editor.createEdge(cell, vertex);
			var edgeValue = model.getValue(edge);
			edgeValue.setAttribute('attribute', key);
			if (model.getGeometry(edge) == null) {
				var k = new mxGeometry();
				k.relative = true;
				e.setGeometry(edge, k);
			}
			graph.addEdge(edge, parent, cell, vertex);
			
			graph.removeCellOverlays(cell);
		}
		finally
		{
			model.endUpdate();
		}
	}));
}
JdbcOperator.prototype.getMultiplicities = function(multiplicitiesContainer){
	
	// JdbcOperator as Source constrain only connect to DataNode
	var asTarget = new mxMultiplicity(
			   true, 'jdbcOperator', null, null, 1, this.ingoingEdgeParam.length, ['dataNode'],
			   'JdbcOperator must have only one DataNode as target',
			   'JdbcOperator must connect to DataNode');
	// JdbcOperator as Target constrain only coming from DataBase
	var asSource = new mxMultiplicity(
			   false, 'jdbcOperator', null, null, 1, this.outgoingEdgeParam.length, ['dataBase'],
			   'JdbcOperator must have only one DataBase as source',
			   'JdbcOperator must connect to DataBase as source');
	
	this.multiplicities.push(asTarget);
	this.multiplicities.push(asSource);
	
	multiplicitiesContainer.push(asTarget);
	multiplicitiesContainer.push(asSource);
}

JdbcOperator.prototype.save = function(userObject){
	mashup.saveJdbcOperator(userObject);
}

JdbcOperator.prototype.getOverLays = function(cell){
	var asSourceMulti = this.multiplicities[1];
	var validateTarget = asSourceMulti.validNeighbors;
	//concurrent cell already have the edges
	var cellOutgoingEdges = this.model.getOutgoingEdges(cell);
	var result = new Map();
	if(cellOutgoingEdges.length < this.outgoingEdgeParam.length){
		for(var j = 0 ; j < this.outgoingEdgeParam.length; j++){
			var key = (this.outgoingEdgeParam)[j].key;
			var attribute ='';
			for(var i = 0; i < cellOutgoingEdges.length; i ++ ){
				var edge = cellOutgoingEdges[i];
				var value = this.model.getValue(edge);
				attribute = value.getAttribute('attribute');
				if(key == attribute){
					break;
				}
			}
			if(i == cellOutgoingEdges.length){
				var overlay = this.overlaysMap.get(key);
//				result.put(key, overlay);
				var clone = mxUtils.clone(overlay);
				result.put(key, clone);
			}
		}
	}
	return result;
}
