function JsonOperator(editor){
	this.editor = editor;
	this.graph = this.editor.graph;
	this.model = this.graph.model;
	this.multiplicities = new Array();
	this.overlaysMap = new Map();
	this.init();
}
JsonOperator.prototype = new MashupNode();
JsonOperator.prototype.constructor = JsonOperator;
JsonOperator.prototype.outgoingEdgeParam = null;
JsonOperator.prototype.ingoingEdgeParam = null;
JsonOperator.prototype.overlaysMap = null;

JsonOperator.prototype.init = function(){
	var edgeParam = OperatorUtils.getOperatorEdgeParam('jsonOperator');
//	this.outgoingEdgeParam = edgeParam["output"];
	this.outgoingEdgeParam = OperatorUtils.getOperatorOutEdgeParam('jsonOperator');
//	this.ingoingEdgeParam = edgeParam['input'];
	this.ingoingEdgeParam = OperatorUtils.getOperatorInEdgeParam('jsonOperator');
	
	//create overlay
	var step = -50;
	for(var i = 0; i < this.outgoingEdgeParam.length; i ++){
		var overlay = new mxCellOverlay(new mxImage('images/add.png', 24, 24), 'Add DataNode');
		overlay.cursor = 'hand';
		overlay.offset = new mxPoint(50, step);
		step = step + 24;
		overlay.align = mxConstants.ALIGN_CENTER;
//		overlay.listner_flag = false;
		this.overlaysMap.put((this.outgoingEdgeParam)[i].key, overlay);
	}
}
//supposing all of the outgoing key corresponding to DataNode(defined in mxMultiplicity)
JsonOperator.prototype.createOverlayListener = function(cell, key, overlay, nodeMap){
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
			graph.setSelectionCell(vertex);
			
			// redraw the cell overlay
//			overlaysHelper.removeOverlay(graph, cell);
//			overlaysHelper.addOverlay(graph, cell, overlaysHelper.getOverlay(graph, cell, editor, nodeMap));
			graph.removeCellOverlays(cell);

		}
		finally
		{
			model.endUpdate();
//			overlay.listner_flag = true;
		}
	}));
}
JsonOperator.prototype.getMultiplicities = function(multiplicitiesContainer){
	
	// JsonOperator as Source constrain only connect to DataNode
	var asTarget = new mxMultiplicity(
			   true, 'jsonOperator', null, null, 1, 1, ['dataNode'],
			   'JsonOperator must have only one DataNode as target',
			   'JsonOperator must connect to DataNode as target');
	// JsonOperator as Target constrain only coming from DataBase
	var asSource = new mxMultiplicity(
			   false, 'jsonOperator', null, null, 1, 1, ['dataNode'],
			   'JsonOperator must have only one DataNode as source',
			   'JsonOperator must connect to DataNode as source');
	
	this.multiplicities.push(asTarget);
	this.multiplicities.push(asSource);
	
	// JsonOperator as Source constrain only connect to DataNode
	multiplicitiesContainer.push(asTarget);
	// JsonOperator as Target constrain only coming from DataBase
	multiplicitiesContainer.push(asSource);
}
JsonOperator.prototype.save = function(userObject){
	mashup.saveJsonOperator(userObject);
}
JsonOperator.prototype.getOverLays = function(cell){
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