function mashupOverlay(nodeMap, editor){
	var graph = editor.graph;
	var model = graph.model;
	
	var iconTolerance = 20;
	graph.addMouseListener(
	{
				    currentCell: null,
				    currentOvelayes: null,
				    mouseDown: function(sender, me)
				    {
				    	// Hides icons on mouse down
			        	if (this.currentCell != null)
			        	{
			          		this.dragLeave(me.getEvent());
			        	}
				    },
				    mouseMove: function(sender, me)
				    {
				  	
						var tmp = me.getCell();
				    	
				    	// Ignores everything but vertices
						if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp)))
						{
							tmp = null;
						}

				      	if (tmp != this.currentCell)
				      	{
				        	if (this.currentOvelayes != null)
				        	{
				          		this.dragLeave(me.getEvent(), this.currentCell);
				        	}
				        
			        		this.currentCell = tmp;
				        
				        	if (this.currentCell != null)
				        	{
				          		this.dragEnter(me.getEvent(), this.currentCell);
				        	}
				      	}
				    },
				    mouseUp: function(sender, me) { },
				    dragEnter: function(evt, state)
				    {
				    	if (this.currentOvelayes == null)
				    	{
			    			this.currentOvelayes = overlaysHelper.getOverlay(graph, this.currentCell, editor, nodeMap);
			    			overlaysHelper.addOverlay(graph, this.currentCell, this.currentOvelayes);
				    	}
				    },
				    dragLeave: function(evt, state)
				    {
				    	if (this.currentOvelayes != null)
				    	{
				    		overlaysHelper.removeOverlay(graph, this.currentCell);
			    			this.currentOvelayes = null;
				    	}
				    }
				});
}


var overlaysHelper = 
{
	getOverlay : function(graph, cell, editor, nodeMap){
		var overlay = new mxCellOverlay(new mxImage('images/add.png', 24, 24), 'Add child');
		overlay.cursor = 'hand';
		overlay.offset = new mxPoint(50, -50);
		overlay.align = mxConstants.ALIGN_CENTER;
		overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt){
			addNode(graph, cell, editor, nodeMap,evt);
		}));
		return overlay;
	},
	
	addOverlay : function(graph, cell, overlay){
		graph.addCellOverlay(cell, overlay);
	},
	
	removeOverlay : function(graph, cell){
		graph.removeCellOverlays(cell);
	}
}

function addNode(graph, cell, editor, nodeMap,evt)
{
	var model = graph.getModel();
	var parent = cell.getParent();
	
	var e = evt.getProperty('event');
	var x = mxEvent.getClientX(e);
	var y = mxEvent.getClientY(e);
	
	var v1Geo = graph.getModel().getGeometry(cell);
	var vertex = editor.templates['jdbcOperator'];
	var node = nodeMap.get('JdbcOperator');
	var style = node.getAttribute("style");
	if (vertex != null && style != null) {
		vertex = vertex.clone();
		vertex.setStyle(style);
	}
	//var cell = graph.getModel().cloneCell(template);
	editor.addVertex(parent, vertex, x, y + 150);

	model.beginUpdate();
	try
	{
		var edge = editor.createEdge(cell, vertex);
		if (model.getGeometry(edge) == null) {
			var k = new mxGeometry();
			k.relative = true;
			e.setGeometry(edge, k);
		}
		graph.addEdge(edge, parent, cell, vertex);
		graph.setSelectionCell(vertex);

	}
	finally
	{
		model.endUpdate();
	}
}
