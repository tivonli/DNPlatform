function DataBaseNode(editor){
	this.editor = editor;
	this.graph = this.editor.graph;
	this.model = this.graph.model;
	this.multiplicities = new Array();
	this.overlaysMap = new Map();
	this.init();
}
DataBaseNode.prototype = new MashupNode();
DataBaseNode.prototype.constructor = DataBaseNode;
DataBaseNode.prototype.overlaysMap = null;
DataBaseNode.prototype.init = function(){
	//must correspondign to Multiplicities
	// hard code here
	var typeKey = ['jdbcOperator'];
	//get as Source Multiplicities
//	var validNeighbors = this.multiplicities[0].validNeighbors;
//	for(var i in validNeighbors)
//	typeKey.push(validNeighbors[i]);
	
	
	//create overlay
	var step = -50;
	for(var i = 0; i < typeKey.length; i ++){
		var overlay = new mxCellOverlay(new mxImage('images/add.png', 24, 24), 'Add ' + typeKey[i]);
		overlay.cursor = 'hand';
		overlay.offset = new mxPoint(50, step);
		step = step + 24;
		overlay.align = mxConstants.ALIGN_CENTER;
		this.overlaysMap.put(typeKey[i], overlay);
	}
}
// supposing all of the outgoing key corresponding to DataNode
DataBaseNode.prototype.createOverlayListener = function(cell, key, overlay, nodeMap){
	overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt){
		var model = this.model;
		var editor = this.editor;
		var graph = this.graph;
		var parent = cell.getParent();
		
		var e = evt.getProperty('event');
		var x = mxEvent.getClientX(e);
		var y = mxEvent.getClientY(e);
		
		var v1Geo = model.getGeometry(cell);
		var vertex = editor.templates[key];
		var node = nodeMap.get(key);
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
			var inParam = OperatorUtils.getOperatorInEdgeParam(key);
			//get index  = 0 param by default
			edgeValue.setAttribute('attribute', inParam[0].key);
			if (model.getGeometry(edge) == null) {
				var k = new mxGeometry();
				k.relative = true;
				e.setGeometry(edge, k);
			}
			graph.addEdge(edge, parent, cell, vertex);
			graph.setSelectionCell(vertex);
			
			graph.removeCellOverlays(cell);
		}
		finally
		{
			model.endUpdate();
		}
	}));
}

DataBaseNode.prototype.getMultiplicities = function(multiplicitiesContainer){
	
	// DataBaseNode as Source constrain only connect to JdbcOperator
	var asTarget = new mxMultiplicity(
			   true, 'dataBase', null, null, null, null, ['jdbcOperator'],
			   null,
			   'DataBase must connect to JdbcOperator');
	// DataBaseNode as Target have no Source
	var asSource = new mxMultiplicity(
			   false, 'dataBase', null, null, 0, 0, null,
			   'DataBase must have no incoming Edge',
			   null);
	
	this.multiplicities.push(asTarget);
	this.multiplicities.push(asSource);
	
	// DataBase as Source constrain only connect to JdbcOperator
	multiplicitiesContainer.push(asTarget);
	// DataBase as Target constrain only have outgoing edge but no incoming edge;
	multiplicitiesContainer.push(asSource);
}
DataBaseNode.prototype.getOverLays = function(cell){
	//
	var asTargetMulti = this.multiplicities[0];
	var maxCount = asTargetMulti.max;
	var cellOutgoingEdges = this.model.getOutgoingEdges(cell);
	var result = new Map();
	if(maxCount = 'n' || cellOutgoingEdges.length < maxCount){
		// all type target node can show
		var clone = mxUtils.clone(this.overlaysMap);
		//result.put(key, clone);
		return clone;
//		return this.overlaysMap;
	}
	return new Map();
}
DataBaseNode.prototype.save = function(userObject){
	mashup.saveDataBase(userObject);
}

