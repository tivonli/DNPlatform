function JoinOperator(editor){
	this.editor = editor;
	this.graph = this.editor.graph;
	this.model = this.graph.model;
	this.multiplicities = new Array();
	this.overlaysMap = new Map();
	this.init();
}
JoinOperator.prototype = new MashupNode();
JoinOperator.prototype.constructor = JoinOperator;
JoinOperator.prototype.outgoingEdgeParam = null;
JoinOperator.prototype.ingoingEdgeParam = null;
JoinOperator.prototype.overlaysMap = null;
JoinOperator.prototype.init = function(){
	var edgeParam = OperatorUtils.getOperatorEdgeParam('joinOperator');
	this.outgoingEdgeParam = OperatorUtils.getOperatorOutEdgeParam('joinOperator');
	this.ingoingEdgeParam = OperatorUtils.getOperatorInEdgeParam('joinOperator');
	
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
JoinOperator.prototype.createOverlayListener = function(cell, key, overlay, nodeMap){
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
JoinOperator.prototype.getMultiplicities = function(multiplicitiesContainer){
	
	// JoinOperator as Source constrain only connect to DataNode
	var asTarget = new mxMultiplicity(
			   true, 'joinOperator', null, null, 1, 1, ['dataNode'],
			   'JoinOperator must have only one DataNode as target',
			   'JoinOperator must connect to DataNode');
	// JoinOperator as Target constrain only coming from DataNode
	var asSource = new mxMultiplicity(
			   false, 'joinOperator', null, null, 1, null, ['dataNode'],
			   'JoinOperator must have only one DataNode as source',
			   'JoinOperator must connect to DataNode as source');
	
	this.multiplicities.push(asTarget);
	this.multiplicities.push(asSource);
	
	multiplicitiesContainer.push(asTarget);
	multiplicitiesContainer.push(asSource);
}

JoinOperator.prototype.save = function(userObject){
	mashup.saveJoinOperator(userObject);
}

JoinOperator.prototype.getOverLays = function(cell){
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
