var mashupNodes = {}

var OperatorUtils = {
	operatorInfoList : mashup.getAllOperatorInfo(),
	
	map : new Map(),
	
	getOperatorEdgeParam : function(type){
		var temp = OperatorUtils.map.get(type);
		if(temp != null){
			return temp;
		}
		for(var i = 0; i < OperatorUtils.operatorInfoList.length; i++){
			var a = OperatorUtils.operatorInfoList[i];
			if(a.id == type){
				OperatorUtils.map.put(type, a.edgeParam);
				return a.edgeParam;
			}
		}
	},
	
	getOperatorInEdgeParam : function(type){
		var edgeParam = OperatorUtils.getOperatorEdgeParam(type);
		return edgeParam["input"];
	},
	
	getOperatorOutEdgeParam : function(type){
		var edgeParam = OperatorUtils.getOperatorEdgeParam(type);
		return edgeParam["output"];
	},

	getEdgeParam : function(source, target){
		if (source.getAttribute("type") == 'OperatorNode') {
			var edgeParam = OperatorUtils.getOperatorEdgeParam(source
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
			var edgeParam = OperatorUtils.getOperatorEdgeParam(target
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
}

function mashupCustomer(editor) {
	var graph = editor.graph;
	var model = graph.model;
	graph.addListener(mxEvent.CLICK, function(sender, evt) {
		var e = evt.getProperty('event'); // mouse event
		var cell = evt.getProperty('cell'); // cell may be null

		if (!evt.isConsumed())
			if (cell == null) {
				graph.clearSelection();
			}
		editor.showProperties(cell);
	});

	graph.getSelectionModel().addListener(mxEvent.CHANGE,
			function(sender, evt) {
				editor.showProperties();
			});
	mashupNodes = {
		jdbcOperator : new JdbcOperator(editor),
		jsonOperator : new JsonOperator(editor),
		joinOperator : new JoinOperator(editor),
		fusionChartOperator : new FusionChartOperator(editor),
		dataBase     : new DataBaseNode(editor),
		dataNode     : new DataNode(editor)
	}

	addMultiplicities(graph);
}

function addMultiplicities(graph){
	graph.setAllowDanglingEdges(false);
	for(var obj in mashupNodes){
		mashupNodes[obj].getMultiplicities(graph.multiplicities);
	}
}

var help = function(obj, flag) {
	if (obj != null) {
		if(flag){
			if(mxUtils.isNode(obj, 'Mashup')){
				mashup.savaMashupDefinition(obj);
			}else{
				var name = obj.getAttribute('name');
				mashupNodes[name].save(obj);
			}
		}else{
			mashup.addEdge(obj);
		}
		
	}else{
		mxUtils.error("User object should not be null");
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

mxEditor.prototype.createProperties = function(b) {
	var model = this.graph.getModel();
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
			//this.hideProperties();
			try {
				model.beginUpdate();
				// alert("l.length= " + l.length);
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
				help(n, true);
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
				var param = OperatorUtils.getEdgeParam(source, target);
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
				for ( var u = 0; u < l.length; u++) {
					var v = new mxCellAttributeChange(b, l[u].nodeName,
							a[u].value);
					model.execute(v)
				}
				help(n, false);
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

