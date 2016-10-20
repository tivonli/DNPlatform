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
		var cellValue = graph.model.getValue(cell);
		var name = cellValue.getAttribute('name');
		var operator = mashupNodes[name];
		var overLaysMap = operator.getOverLays(cell);
		var keys = overLaysMap.getAllKey();
		for(var i in keys){
			var overlay = overLaysMap.get(keys[i]);
//			if(!overlay.listner_flag){
				operator.createOverlayListener(cell, keys[i], overLaysMap.get(keys[i]), nodeMap);
//			}
		}
		return overLaysMap;
	},
	
	addOverlay : function(graph, cell, overlaysMap){
		var keys = overlaysMap.getAllKey();
		for(var i in keys){
			graph.addCellOverlay(cell, overlaysMap.get(keys[i]));
		}
	},
	
	removeOverlay : function(graph, cell){
		graph.removeCellOverlays(cell);
	}
}
