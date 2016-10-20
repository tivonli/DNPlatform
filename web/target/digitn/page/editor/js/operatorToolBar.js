var operatorToolBar = function(editor, node){
	var container = document.createElement("div");
	var menu = new mxDefaultMenu(container, editor);
	//var node = mxUtils.load('../config/mashup.xml').getDocumentElement();
	//registeMenu();
	var map = new Map();
	decode(node, menu, editor, map);
	
	var n = parseInt('16');
	var m = parseInt('300');
	//var c = '80';
	//var o = '100';
	
	container.style.cssText = 'padding:5px;padding-top:8px;padding-right:0px';
	var d = new mxWindow('Menu', container, n, m, null, null, false, true);
	d.setVisible(true);
	//hoverIcons(map, editor);
	mashupOverlay(map, editor);
}

function Map(){
	this.map = new Object();
	this.length = 0;
	  this.size = function(){
	       return this.length;
	   }
	   
	   this.put = function(key, value){
	      
	      if( !this.map[key])
	        {
	             ++this.length;
	        }
	      
	      this.map[key] = value;
	     
	   }
	   
	   this.remove = function(key){
	       
	       if(this.map[key])
	      {
	          
	          --this.length;
	        return delete this.map[key];
	      }
	      else
	      {
	          return false;
	      }
	   }
	   
	   this.containsKey = function(key){
	    
	     return this.map[key] ? true:false;
	   
	   }
	   
	   
	   //Attention here : return key arrays
	   this.getAllKey = function(){
		   var keys = [];
		   for(var each in this.map)
		     {
		          keys.push(each);
		     }
		   return keys;
	   }
	    
	   this.get = function(key){    
	  
	      return this.map[key] ? this.map[key]:null;
	  
	   }


	 this.inspect=function(){    
	     var str = '';
	     
	     for(var each in this.map)
	     {
	          str+= '/n'+ each + '  Value:'+ this.map[each];
	     }
	     
	     return str;
	   }
}

function decode(nodes, into, editor, map){
		var node = nodes.firstChild;
		while(node != null){
			if (node.nodeType == mxConstants.NODETYPE_ELEMENT) {
					if (node.nodeName == "separator") {
						into.addSeparator()
					} else {
						if (node.nodeName == "br") {
							into.toolbar.addBreak()
						} else {
							if (node.nodeName == "hr") {
								into.toolbar.addLine()
							} else {
								if (node.nodeName == "add") {
									var as = node.getAttribute("as");
									map.put(as, node);
									as = mxResources.get(as) || as;
									var icon = node.getAttribute("icon");
									var pressedIcon = node.getAttribute("pressedIcon");
									var action = node.getAttribute("action");
									var mode = node.getAttribute("mode");
									var template = node.getAttribute("template");
									var text = mxUtils.getTextContent(node);
									var elt = null;
									if (action != null) {
										elt = into.addItem(as, icon, action, pressedIcon)
									} else {
										if (mode != null) {
											var funct = mxUtils.eval(text);
											elt = into.addMode(as, icon, mode, pressedIcon, funct)
										} else {
											if (template != null || (text != null && text.length > 0)) {
												var cell = editor.templates[template];
												var style = node.getAttribute("style");
												if (cell != null && style != null) {
													cell = cell.clone();
													cell.setStyle(style)
												}
												var insertFunction = null;
												if (text != null && text.length > 0) {
													insertFunction = mxUtils.eval(text)
												}
												elt = into.addPrototype(as, icon, cell, pressedIcon, insertFunction)
											} else {
												var children = mxUtils.getChildNodes(node);
												if (children.length > 0) {
													if (icon == null) {
														var combo = into.addActionCombo(as);
														for (var i = 0; i < children.length; i++) {
															var child = children[i];
															if (child.nodeName == "separator") {
																into.addOption(combo, "---")
															} else {
																if (child.nodeName == "add") {
																	var lab = child.getAttribute("as");
																	var act = child.getAttribute("action");
																	into.addActionOption(combo, lab, act)
																}
															}
														}
													} else {
														var select = null;
														var create = function() {
														var template = editor.templates[select.value];
														if (template != null) {
															var clone = template.clone();
															var style = select.options[select.selectedIndex].cellStyle;
															if (style != null) {
																clone.setStyle(style)
															}
															return clone
														} else {
															mxLog.warn("Template " + template + " not found")
													}
														return null
												};
												var img = into.addPrototype(as, icon, create);
												select = into.addCombo();
												mxEvent.addListener(select, "change",
														function() {
													into.toolbar.selectMode(img,
															function(evt) {
														var pt = mxUtils.convertPoint(editor.graph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
														return editor.addVertex(null, funct(), pt.x, pt.y)
													});
													into.toolbar.noReset = false
												});
												for (var i = 0; i < children.length; i++) {
													var child = children[i];
													if (child.nodeName == "separator") {
														into.addOption(select, "---")
													} else {
														if (child.nodeName == "add") {
															var lab = child.getAttribute("as");
															var tmp = child.getAttribute("template");
															var option = into.addOption(select, lab, tmp || template);
															option.cellStyle = child.getAttribute("style")
														}
													}
												}
													}
												}
											}
										}
									}
									if (elt != null) {
										var id = node.getAttribute("id");
										if (id != null && id.length > 0) {
											elt.setAttribute("id", id)
										}
							}
								}
							}
						}
					}
				
			}
			node = node.nextSibling;
		}
}

function mxDefaultMenu(a, b) {
	this.editor = b;
	if (a != null && b != null) {
		this.init(a)
	}
}
mxDefaultMenu.prototype = new mxDefaultToolbar();
mxMenu.prototype.constructor = mxDefaultMenu;

mxDefaultMenu.prototype.init = function(a) {
	if (a != null) {
		this.toolbar = new mxMenu(a);
		this.toolbar.addListener(mxEvent.SELECT, mxUtils.bind(this,
		function(d, c) {
			var b = c.getProperty("function");
			if (b != null) {
				this.editor.insertFunction = mxUtils.bind(this,
				function() {
					b.apply(this, arguments);
					this.toolbar.resetMode()
				})
			} else {
				this.editor.insertFunction = null
			}
		}));
		this.resetHandler = mxUtils.bind(this,
		function() {
			if (this.toolbar != null) {
				this.toolbar.resetMode(true)
			}
		});
		this.editor.graph.addListener(mxEvent.DOUBLE_CLICK, this.resetHandler);
		this.editor.addListener(mxEvent.ESCAPE, this.resetHandler)
	}
};

function mxMenu(a){
	this.container = a;
}
mxMenu.prototype = new mxToolbar();
mxMenu.prototype.constructor = mxMenu;
                              //title, icon, funct, pressedIcon, style
mxMenu.prototype.addMode = function(g, f, a, e, d) {
    var b = document.createElement('label');
    b.initialClassName = d || "mxToolbarMode";
    b.className = b.initialClassName;
    b.appendChild(document.createTextNode(g));
    b.altIcon = e;
    if (this.enabled) {
        mxEvent.addListener(b, "click", mxUtils.bind(this, 
        function(h) {
            this.selectMode(b, a);
            this.noReset = false
        }));
        mxEvent.addListener(b, "dblclick", mxUtils.bind(this, 
        function(h) {
            this.selectMode(b, a);
            this.noReset = true
        }));
        if (this.defaultMode == null) {
            this.defaultMode = b;
            this.selectedMode = b;
            var c = b.altIcon;
            if (c != null) {
                b.altIcon = b.getAttribute("src");
                b.setAttribute("src", c)
            } else {
                b.className = b.initialClassName + "Selected"
            }
        }
    }
    this.container.appendChild(b);
    return b
};