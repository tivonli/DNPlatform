function hoverIcons(nodeMap, editor){
	var graph = editor.graph;
	var model = graph.model;
	var iconTolerance = 20;
	graph.addMouseListener(
	{
				    currentState: null,
				    currentIconSet: null,
				    mouseDown: function(sender, me)
				    {
				    	// Hides icons on mouse down
			        	if (this.currentState != null)
			        	{
			          		this.dragLeave(me.getEvent(), this.currentState);
			          		this.currentState = null;
			        	}
				    },
				    mouseMove: function(sender, me)
				    {
				    	if (this.currentState != null && (me.getState() == this.currentState ||
				    		me.getState() == null))
				    	{
				    		var tol = iconTolerance;
				    		var tmp = new mxRectangle(me.getGraphX() - tol,
				    			me.getGraphY() - tol, 2 * tol, 2 * tol);

				    		if (mxUtils.intersects(tmp, this.currentState))
				    		{
				    			return;
				    		}
				    	}
				    	
						var tmp = graph.view.getState(me.getCell());
				    	
				    	// Ignores everything but vertices
						if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell)))
						{
							tmp = null;
						}

				      	if (tmp != this.currentState)
				      	{
				        	if (this.currentState != null)
				        	{
				          		this.dragLeave(me.getEvent(), this.currentState);
				        	}
				        
			        		this.currentState = tmp;
				        
				        	if (this.currentState != null)
				        	{
				          		this.dragEnter(me.getEvent(), this.currentState);
				        	}
				      	}
				    },
				    mouseUp: function(sender, me) { },
				    dragEnter: function(evt, state)
				    {
				    	if (this.currentIconSet == null)
				    	{
			    			this.currentIconSet = new mxIconSet(nodeMap, editor, state);
				    	}
				    },
				    dragLeave: function(evt, state)
				    {
				    	if (this.currentIconSet != null)
				    	{
			    			this.currentIconSet.destroy();
			    			this.currentIconSet = null;
				    	}
				    }
				});
}


function mxIconSet(nodeMap, editor, state)
{
			this.images = [];
			var graph = state.view.graph;
			var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
			
			// Icon1
			var img = mxUtils.createImage('images/copy.gif');
			img.setAttribute('title', 'Duplicate');
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.left = (state.x + state.width) + 'px';
			img.style.top = (state.y + state.height) + 'px';
			
			mxEvent.addListener(img, md,
				mxUtils.bind(this, function(evt)
				{
					//var s = graph.gridSize;
					//graph.setSelectionCells(graph.moveCells([state.cell], s, s, true));
					// Adds cells to the model in a single step
					var v1 = state.cell;
					var v1Geo = graph.getModel().getGeometry(v1);
					var cell = editor.templates['jdbcOperator'];
					var node = nodeMap.get('JdbcOperator');
					var style = node.getAttribute("style");
					if (cell != null && style != null) {
						cell = cell.clone();
						cell.setStyle(style);
					}
					//var cell = graph.getModel().cloneCell(template);
					editor.addVertex(v1.getParent(), cell, v1Geo.x + 150, v1Geo.y);
					
					graph.getModel().beginUpdate();
					try
					{
						var e1 = graph.insertEdge(v1.getParent(), null, '', v1, cell);
						e1.geometry.x = 1;
						e1.geometry.y = 0;
						e1.geometry.offset = new mxPoint(0, -20);
				}
				finally
				{
					// Updates the display
					graph.getModel().endUpdate();
				}
					mxEvent.consume(evt);
					this.destroy();
				})
			);
			
			state.view.graph.container.appendChild(img);
			this.images.push(img);
			
			// Delete
			var img = mxUtils.createImage('images/delete.gif');
			img.setAttribute('title', 'Delete');
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.left = (state.x + state.width) + 'px';
			img.style.top = (state.y - 16) + 'px';
			
			mxEvent.addListener(img, md,
				mxUtils.bind(this, function(evt)
				{
					// Disables dragging the image
					mxEvent.consume(evt);
				})
			);
			
			mxEvent.addListener(img, 'click',
				mxUtils.bind(this, function(evt)
				{
					graph.removeCells([state.cell]);
					mxEvent.consume(evt);
					this.destroy();
				})
			);
			
			state.view.graph.container.appendChild(img);
			this.images.push(img);
		};
		mxIconSet.prototype.destroy = function()
		{
			if (this.images != null)
			{
				for (var i = 0; i < this.images.length; i++)
				{
					var img = this.images[i];
					img.parentNode.removeChild(img);
				}
			}
			
			this.images = null;
		};