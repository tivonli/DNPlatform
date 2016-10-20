function mashupCustomer(editor) {
	var graph = editor.graph;
	var model = graph.model;
	
	graph.addListener(mxEvent.CLICK, function(sender, evt){
      var e = evt.getProperty('event'); // mouse event
      var cell = evt.getProperty('cell'); // cell may be null

      if (!evt.isConsumed())
    	  if(cell == null){
    		  graph.clearSelection();
    	  }
    	  editor.showProperties(cell);
    });
	
    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt){
    	editor.showProperties();
	});
	
	editor.createProperties = function(b) {
		var n = model.getValue(b);
		// alert(n.tagName);
		if (mxUtils.isNode(n) && !b.isEdge()) {
			var c = new mxForm("properties");
			var k = c.addText("ID", b.getId());
			k.setAttribute("readonly", "true");

			var l = n.attributes;
			var a = [];
			for ( var o = 0; o < l.length; o++) {
				var t = l[o].nodeValue;
				a[o] = c.addTextarea(l[o].nodeName, t,
						(l[o].nodeName == "label") ? 4 : 2);
				if (l[o].nodeName == "nodeId") {
					a[o].setAttribute("readonly", "true");
				}
			}
			var m = mxUtils.bind(this, function() {
				this.hideProperties();
				try {
					model.beginUpdate();
					// alert("l.length= " + l.length);
					help(n);
					for ( var u = 0; u < l.length; u++) {
						var v;
						if (l[u].nodeName == "nodeId") {
							v = new mxCellAttributeChange(b, l[u].nodeName,
									l[u].nodeValue);
						} else {
							v = new mxCellAttributeChange(b, l[u].nodeName,
									a[u].value);
						}
						model.execute(v);
					}
					if (this.graph.isAutoSizeCell(b)) {
						this.graph.updateCellSize(b)
					}
				} catch (e) {
					mxUtils.alert(e.message);
				} finally {
					model.endUpdate();
				}
			});
			var r = mxUtils.bind(this, function() {
				// alert("Cancel");
				this.hideProperties();
			});
			c.addButtons(m, r);
			return c.table
		} else {

			var c = new mxForm("properties");
			var k = c.addText("ID", b.getId());
			k.setAttribute("readonly", "true");

			var source = b.getTerminal(true).value;
			var target = b.getTerminal(false).value;

			var l = n.attributes;
			var a = [];
			for ( var o = 0; o < l.length; o++) {
				var t = l[o].nodeValue;
				if (l[o].nodeName == 'attribute') {
					var param = getEdgeParam(source, target);
					a[o] = c.addCombo(l[o].nodeName, false, 0);
					var flag = false;
					for ( var i = 0; i < param.length; i++) {
						if (t == param[i].key) {
							flag = true;
						}
						c.addOption(a[o], param[i].key, param[i].key, flag);
					}
					if (i == param.length && !flag) {
						a[o].selectedIndex = 0;
					}
					continue;
				} else if (l[o].nodeName == 'from') {
					l[o].nodeValue = source.getAttribute('nodeId');
					t = l[o].nodeValue;
					a[o] = c.addTextarea(l[o].nodeName, t,
							(l[o].nodeName == "label") ? 4 : 2);
					a[o].setAttribute("readonly", "true");
					continue;
				} else if (l[o].nodeName == 'to') {
					l[o].nodeValue = target.getAttribute('nodeId');
					t = l[o].nodeValue;
					a[o] = c.addTextarea(l[o].nodeName, t,
							(l[o].nodeName == "label") ? 4 : 2);
					a[o].setAttribute("readonly", "true");
					continue;
				} else if (l[o].nodeName == 'edgeId') {
					a[o] = c.addTextarea(l[o].nodeName, t,
							(l[o].nodeName == "label") ? 4 : 2);
					a[o].setAttribute("readonly", "true");
					continue;
				}
				a[o] = c.addTextarea(l[o].nodeName, t,
						(l[o].nodeName == "label") ? 4 : 2);
			}
			var m = mxUtils.bind(this, function() {
				this.hideProperties();
				try {
					model.beginUpdate();
					help(n);
					for ( var u = 0; u < l.length; u++) {
						var v = new mxCellAttributeChange(b, l[u].nodeName,
								a[u].value);
						model.execute(v)
					}
					if (this.graph.isAutoSizeCell(b)) {
						this.graph.updateCellSize(b)
					}
				} catch (e) {
					mxUtils.alert(e.message);
				} finally {
					model.endUpdate();
				}
			});
			var r = mxUtils.bind(this, function() {
				// alert("Cancel");
				this.hideProperties();
			});
			c.addButtons(m, r);
			return c.table

		}
		return null;
	};
	
	addMultiplicities(graph);
}

function addMultiplicities(graph){
	graph.setAllowDanglingEdges(false);
	
	// DataBase as Source constrain only connect to JdbcOperator
	graph.multiplicities.push(new mxMultiplicity(
			   true, 'DataBase', null, null, null, null, ['JdbcOperator'],
			   null,
			   'DataBase must connect to JdbcOperator'));
	// DataBase as Target constrain only have outgoing edge but no incoming edge;
	graph.multiplicities.push(new mxMultiplicity(
			   false, 'DataBase', null, null, 0, 0, null,
			   'DataBase must have no incoming Edge',
			   null));
	// JdbcOperator as Source constrain only connect to DataNode
	graph.multiplicities.push(new mxMultiplicity(
			   true, 'JdbcOperator', null, null, 1, 1, ['DataNode'],
			   'JdbcOperator must have only one DataNode as target',
			   'JdbcOperator must connect to DataNode'));
	// JdbcOperator as Target constrain only coming from DataBase
	graph.multiplicities.push(new mxMultiplicity(
			   false, 'JdbcOperator', null, null, 1, 1, ['DataBase'],
			   'JdbcOperator must have only one DataBase as source',
			   'JdbcOperator must connect to DataBase as source'));
	// DataNode as Target constrain only 
	graph.multiplicities.push(new mxMultiplicity(
			   true, 'DataNode', null, null, null, null, ['JsonOperator','JdbcOperator'],
			   null,
			   'DataNode must connect to OperatorNode as target'));
	graph.multiplicities.push(new mxMultiplicity(
			   false, 'DataNode', null, null, 1, 1, ['JsonOperator','JdbcOperator'],
			   'DataNode must have only one OperatorNode as source',
			   'DataNode must connect to OperatorNode as source'));
	// JsonOperator as Source constrain only connect to DataNode
	graph.multiplicities.push(new mxMultiplicity(
			   true, 'JsonOperator', null, null, 1, 1, ['DataNode'],
			   'JsonOperator must have only one DataNode as target',
			   'JsonOperator must connect to DataNode as target'));
	// JsonOperator as Target constrain only coming from DataBase
	graph.multiplicities.push(new mxMultiplicity(
			   false, 'JsonOperator', null, null, 1, 1, ['DataNode'],
			   'JsonOperator must have only one DataNode as source',
			   'JsonOperator must connect to DataNode as source'));
}

var help = function(obj) {
	if (obj != null) {
		var name = obj.getAttribute('name');
		if (name == 'dataBase') {
			mashup.saveDataBase(obj);
		} else if (name == 'dataNode') {
			mashup.saveDataNode(obj);
		} else if (name == 'jdbcOperator') {
			mashup.saveJdbcOperator(obj);
		} else if (name == 'jsonOperator') {
			mashup.saveJsonOperator(obj);
		} else if (name == 'edge') {
			mashup.addEdge(obj);
		}
	}
}

var getEdgeParam = function(source, target) {
	if (source.getAttribute("type") == 'OperatorNode') {
		var edgeParam = Operator.getOperatorEdgeParam(source
				.getAttribute("name"));
		var outputList = edgeParam["output"];
		// for(var l = 0 ; l < outputList.length; l++){
		// var output = outputList[l];
		// alert("EdgeParam Output Key : " + output["key"] + " " + "EdgeParam
		// Output
		// DataType: " + output["dataType"]);
		// }
		return outputList;
	} else if (target.getAttribute("type") == 'OperatorNode') {
		var edgeParam = Operator.getOperatorEdgeParam(target
				.getAttribute("name"));
		var inputList = edgeParam["input"];
		// for(var l = 0 ; l < inputList.length; l++){
		// var input = inputList[l];
		// alert("EdgeParam Input Key : " + input["key"] + " " + "EdgeParam
		// Input dataType: " + input["dataType"]);
		//		}
		return inputList;
	}
}

mxEditor.prototype.showProperties = function(b) {
    b = b || this.graph.getSelectionCell();
    if (b == null) {
        b = this.graph.getCurrentRoot();
        if (b == null) {
            b = this.graph.getModel().getRoot()
        }
    }
    if (b != null) {
        this.graph.stopEditing(true);
        var e = mxUtils.getOffset(this.graph.container);
        var containerWidth = this.graph.container.clientWidth;
        var x = e.x + (containerWidth - this.propertiesWidth);
        var y = e.y + 4;
        this.hideProperties();
        var c = this.createProperties(b);
        if (c != null) {
            this.properties = new mxWindow(mxResources.get(this.propertiesResource) || this.propertiesResource, c, x, y, this.propertiesWidth, this.propertiesHeight, false);
            this.properties.setVisible(true)
        }
    }
}


