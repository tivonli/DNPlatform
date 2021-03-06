var mxClient = {
	VERSION: "1.9.0.2",
	IS_IE: navigator.userAgent.indexOf("MSIE") >= 0,
	IS_IE6: navigator.userAgent.indexOf("MSIE 6") >= 0,
	IS_NS: navigator.userAgent.indexOf("Mozilla/") >= 0 && navigator.userAgent.indexOf("MSIE") < 0,
	IS_OP: navigator.userAgent.indexOf("Opera/") >= 0,
	IS_OT: navigator.userAgent.indexOf("Presto/2.4") < 0 && navigator.userAgent.indexOf("Presto/2.3") < 0 && navigator.userAgent.indexOf("Presto/2.2") < 0 && navigator.userAgent.indexOf("Presto/2.1") < 0 && navigator.userAgent.indexOf("Presto/2.0") < 0 && navigator.userAgent.indexOf("Presto/1") < 0,
	IS_SF: navigator.userAgent.indexOf("AppleWebKit/") >= 0 && navigator.userAgent.indexOf("Chrome/") < 0,
	IS_GC: navigator.userAgent.indexOf("Chrome/") >= 0,
	IS_MT: (navigator.userAgent.indexOf("Firefox/") >= 0 && navigator.userAgent.indexOf("Firefox/1") < 0 && navigator.userAgent.indexOf("Firefox/2") < 0) || (navigator.userAgent.indexOf("Iceweasel/") >= 0 && navigator.userAgent.indexOf("Iceweasel/1") < 0 && navigator.userAgent.indexOf("Iceweasel/2") < 0) || (navigator.userAgent.indexOf("SeaMonkey/") >= 0 && navigator.userAgent.indexOf("SeaMonkey/1") < 0) || (navigator.userAgent.indexOf("Iceape/") >= 0 && navigator.userAgent.indexOf("Iceape/1") < 0),
	IS_SVG: navigator.userAgent.indexOf("Firefox/") >= 0 || navigator.userAgent.indexOf("Iceweasel/") >= 0 || navigator.userAgent.indexOf("Seamonkey/") >= 0 || navigator.userAgent.indexOf("Iceape/") >= 0 || navigator.userAgent.indexOf("Galeon/") >= 0 || navigator.userAgent.indexOf("Epiphany/") >= 0 || navigator.userAgent.indexOf("AppleWebKit/") >= 0 || navigator.userAgent.indexOf("Gecko/") >= 0 || navigator.userAgent.indexOf("Opera/") >= 0,
	NO_FO: navigator.userAgent.indexOf("Firefox/1") >= 0 || navigator.userAgent.indexOf("Iceweasel/1") >= 0 || navigator.userAgent.indexOf("Firefox/2") >= 0 || navigator.userAgent.indexOf("Iceweasel/2") >= 0 || navigator.userAgent.indexOf("SeaMonkey/1") >= 0 || navigator.userAgent.indexOf("Iceape/1") >= 0 || navigator.userAgent.indexOf("Camino/1") >= 0 || navigator.userAgent.indexOf("Epiphany/2") >= 0 || navigator.userAgent.indexOf("Opera/") >= 0 || navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Mozilla/2") >= 0,
	IS_VML: navigator.appName.toUpperCase() == "MICROSOFT INTERNET EXPLORER",
	IS_MAC: navigator.userAgent.toUpperCase().indexOf("MACINTOSH") > 0,
	IS_TOUCH: navigator.userAgent.toUpperCase().indexOf("IPAD") > 0 || navigator.userAgent.toUpperCase().indexOf("IPOD") > 0 || navigator.userAgent.toUpperCase().indexOf("IPHONE") > 0 || navigator.userAgent.toUpperCase().indexOf("ANDROID") > 0,
	IS_LOCAL: document.location.href.indexOf("http://") < 0 && document.location.href.indexOf("https://") < 0,
	isBrowserSupported: function() {
		return mxClient.IS_VML || mxClient.IS_SVG
	},
	link: function(a, b, e) {
		e = e || document;
		if (false) {
			e.write('<link rel="' + a + '" href="' + b + '" charset="ISO-8859-1" type="text/css"/>')
		} else {
			var d = e.createElement("link");
			d.setAttribute("rel", a);
			d.setAttribute("href", b);
			d.setAttribute("charset", "ISO-8859-1");
			d.setAttribute("type", "text/css");
			var c = e.getElementsByTagName("head")[0];
			c.appendChild(d)
		}
	},
	include: function(a) {
		document.write('<script src="' + a + '"><\/script>')
	},
	dispose: function() {
		for (var a = 0; a < mxEvent.objects.length; a++) {
			if (mxEvent.objects[a].mxListenerList != null) {
				mxEvent.removeAllListeners(mxEvent.objects[a])
			}
		}
	}
};
if (typeof(mxLoadResources) == "undefined") {
	mxLoadResources = true
}
if (typeof(mxLoadStylesheets) == "undefined") {
	mxLoadStylesheets = true
}
if (typeof(mxBasePath) != "undefined" && mxBasePath.length > 0) {
	if (mxBasePath.substring(mxBasePath.length - 1) == "/") {
		mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1)
	}
	mxClient.basePath = mxBasePath
} else {
	mxClient.basePath = "."
}
if (typeof(mxImageBasePath) != "undefined" && mxImageBasePath.length > 0) {
	if (mxImageBasePath.substring(mxImageBasePath.length - 1) == "/") {
		mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1)
	}
	mxClient.imageBasePath = mxImageBasePath
} else {
	mxClient.imageBasePath = mxClient.basePath + "/images"
}
if (typeof(mxLanguage) != "undefined") {
	mxClient.language = mxLanguage
} else {
	mxClient.language = (mxClient.IS_IE) ? navigator.userLanguage: navigator.language;
	var dash = mxClient.language.indexOf("-");
	if (dash > 0) {
		mxClient.language = mxClient.language.substring(0, dash)
	}
}
if (typeof(mxDefaultLanguage) != "undefined") {
	mxClient.defaultLanguage = mxLanguage
} else {
	mxClient.defaultLanguage = "en"
}
if (mxLoadStylesheets) {
	mxClient.link("stylesheet", mxClient.basePath + "/css/common.css")
}
if (typeof(mxLanguages) != "undefined") {
	mxClient.languages = mxLanguages
}
if (mxClient.IS_IE) {
	if (document.documentMode == 9) {
		mxClient.IS_VML = false;
		mxClient.IS_SVG = true
	} else {
		if (document.documentMode == 8) {
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml", "#default#VML");
			document.namespaces.add("o", "urn:schemas-microsoft-com:office:office", "#default#VML")
		} else {
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			document.namespaces.add("o", "urn:schemas-microsoft-com:office:office")
		}
		var ss = document.createStyleSheet();
		ss.cssText = "v\\:*{behavior:url(#default#VML)}o\\:*{behavior:url(#default#VML)}";
		if (mxLoadStylesheets) {
			mxClient.link("stylesheet", mxClient.basePath + "/css/explorer.css")
		}
	}
	window.attachEvent("onunload", mxClient.dispose)
}
var mxLog = {
	consoleName: "Console",
	TRACE: false,
	DEBUG: true,
	WARN: true,
	buffer: "",
	init: function() {
		if (mxLog.window == null && document.body != null) {
			var g = mxLog.consoleName + " - mxGraph " + mxClient.VERSION;
			var k = document.createElement("table");
			k.setAttribute("width", "100%");
			k.setAttribute("height", "100%");
			var d = document.createElement("tbody");
			var f = document.createElement("tr");
			var b = document.createElement("td");
			b.style.verticalAlign = "top";
			mxLog.textarea = document.createElement("textarea");
			mxLog.textarea.setAttribute("readOnly", "true");
			mxLog.textarea.style.height = "100%";
			mxLog.textarea.style.resize = "none";
			mxLog.textarea.value = mxLog.buffer;
			if ((!mxClient.IS_IE && !mxClient.IS_OP) && document.compatMode != "BackCompat") {
				mxLog.textarea.style.width = "99%"
			} else {
				mxLog.textarea.style.width = "100%"
			}
			b.appendChild(mxLog.textarea);
			f.appendChild(b);
			d.appendChild(f);
			f = document.createElement("tr");
			mxLog.td = document.createElement("td");
			mxLog.td.style.verticalAlign = "top";
			mxLog.td.setAttribute("height", "30px");
			f.appendChild(mxLog.td);
			d.appendChild(f);
			k.appendChild(d);
			mxLog.addButton("Info",
			function(h) {
				mxLog.info()
			});
			mxLog.addButton("DOM",
			function(h) {
				var l = mxUtils.getInnerHtml(document.body);
				mxLog.debug(l)
			});
			mxLog.addButton("Trace",
			function(h) {
				mxLog.TRACE = !mxLog.TRACE;
				if (mxLog.TRACE) {
					mxLog.debug("Tracing enabled")
				} else {
					mxLog.debug("Tracing disabled")
				}
			});
			mxLog.addButton("Copy",
			function(h) {
				try {
					mxUtils.copy(mxLog.textarea.value)
				} catch(l) {
					mxUtils.alert(l)
				}
			});
			mxLog.addButton("Show",
			function(h) {
				try {
					mxUtils.popup(mxLog.textarea.value)
				} catch(l) {
					mxUtils.alert(l)
				}
			});
			mxLog.addButton("Clear",
			function(h) {
				mxLog.textarea.value = ""
			});
			var e = (document.body.clientHeight || document.documentElement.clientHeight);
			var i = document.body.clientWidth;
			mxLog.window = new mxWindow(g, k, Math.max(0, i - 320), Math.max(0, e - 210), 300, 160);
			mxLog.window.setMaximizable(true);
			mxLog.window.setScrollable(false);
			mxLog.window.setResizable(true);
			mxLog.window.setClosable(true);
			mxLog.window.destroyOnClose = false;
			if (((!mxClient.IS_IE && !mxClient.IS_OP) || mxClient.IS_IE) && mxClient.IS_GC && !mxClient.IS_SF && document.compatMode != "BackCompat") {
				var c = mxLog.window.getElement();
				var a = function(l, h) {
					mxLog.textarea.style.height = Math.max(0, c.offsetHeight - 70) + "px"
				};
				mxLog.window.addListener(mxEvent.RESIZE_END, a);
				mxLog.window.addListener(mxEvent.MAXIMIZE, a);
				mxLog.window.addListener(mxEvent.NORMALIZE, a);
				mxLog.textarea.style.height = "92px"
			}
		}
	},
	info: function() {
		mxLog.writeln(mxUtils.toString(navigator))
	},
	addButton: function(c, a) {
		var b = document.createElement("button");
		mxUtils.write(b, c);
		mxEvent.addListener(b, "click", a);
		mxLog.td.appendChild(b)
	},
	isVisible: function() {
		if (mxLog.window != null) {
			return mxLog.window.isVisible()
		}
		return false
	},
	show: function() {
		mxLog.setVisible(true)
	},
	setVisible: function(a) {
		if (mxLog.window == null) {
			mxLog.init()
		}
		if (mxLog.window != null) {
			mxLog.window.setVisible(a)
		}
	},
	enter: function(a) {
		if (mxLog.TRACE) {
			mxLog.writeln("Entering " + a);
			return new Date().getTime()
		}
	},
	leave: function(a, c) {
		if (mxLog.TRACE) {
			var b = (c != 0) ? " (" + (new Date().getTime() - c) + " ms)": "";
			mxLog.writeln("Leaving " + a + b)
		}
	},
	debug: function() {
		if (mxLog.DEBUG) {
			mxLog.writeln.apply(this, arguments)
		}
	},
	warn: function() {
		if (mxLog.WARN) {
			mxLog.writeln.apply(this, arguments)
		}
	},
	write: function() {
		var a = "";
		for (var b = 0; b < arguments.length; b++) {
			a += arguments[b];
			if (b < arguments.length - 1) {
				a += " "
			}
		}
		if (mxLog.textarea != null) {
			mxLog.textarea.value = mxLog.textarea.value + a;
			if (navigator.userAgent.indexOf("Presto/2.5") >= 0) {
				mxLog.textarea.style.visibility = "hidden";
				mxLog.textarea.style.visibility = "visible"
			}
			mxLog.textarea.scrollTop = mxLog.textarea.scrollHeight
		} else {
			mxLog.buffer += a
		}
	},
	writeln: function() {
		var a = "";
		for (var b = 0; b < arguments.length; b++) {
			a += arguments[b];
			if (b < arguments.length - 1) {
				a += " "
			}
		}
		mxLog.write(a + "\n")
	}
};
var mxObjectIdentity = {
	FIELD_NAME: "mxObjectId",
	counter: 0,
	get: function(b) {
		if (typeof(b) == "object" && b[mxObjectIdentity.FIELD_NAME] == null) {
			var a = mxUtils.getFunctionName(b.constructor);
			b[mxObjectIdentity.FIELD_NAME] = a + "#" + mxObjectIdentity.counter++
		}
		return b[mxObjectIdentity.FIELD_NAME]
	},
	clear: function(a) {
		if (typeof(a) == "object") {
			delete a[mxObjectIdentity.FIELD_NAME]
		}
	}
};
function mxDictionary() {
	this.clear()
}
mxDictionary.prototype.map = null;
mxDictionary.prototype.clear = function() {
	this.map = {}
};
mxDictionary.prototype.get = function(a) {
	var b = mxObjectIdentity.get(a);
	return this.map[b]
};
mxDictionary.prototype.put = function(a, c) {
	var d = mxObjectIdentity.get(a);
	var b = this.map[d];
	this.map[d] = c;
	return b
};
mxDictionary.prototype.remove = function(a) {
	var c = mxObjectIdentity.get(a);
	var b = this.map[c];
	delete this.map[c];
	return b
};
mxDictionary.prototype.getKeys = function() {
	var a = [];
	for (key in this.map) {
		a.push(key)
	}
	return a
};
mxDictionary.prototype.getValues = function() {
	var a = [];
	for (key in this.map) {
		a.push(this.map[key])
	}
	return a
};
mxDictionary.prototype.visit = function(a) {
	for (key in this.map) {
		a(key, this.map[key])
	}
};
var mxResources = {
	resources: [],
	loadDefaultBundle: true,
	loadSpecialBundle: true,
	isLanguageSupported: function(a) {
		if (mxClient.languages != null) {
			return mxUtils.indexOf(mxClient.languages, a) >= 0
		}
		return true
	},
	getDefaultBundle: function(b, a) {
		if (mxResources.loadDefaultBundle) {
			return b + ".properties"
		} else {
			return null
		}
	},
	getSpecialBundle: function(b, a) {
		if (mxResources.loadSpecialBundle && a != mxClient.defaultLanguage) {
			return b + "_" + a + ".properties"
		} else {
			return null
		}
	},
	add: function(f, b) {
		b = (b != null) ? b: mxClient.language;
		if (b != mxConstants.NONE) {
			var g = mxResources.getDefaultBundle(f, b);
			if (g != null) {
				try {
					var c = mxUtils.load(g);
					if (c.isReady()) {
						mxResources.parse(c.getText())
					}
				} catch(d) {}
			}
			if (mxResources.isLanguageSupported(b)) {
				var a = mxResources.getSpecialBundle(f, b);
				if (a != null) {
					try {
						var c = mxUtils.load(a);
						if (c.isReady()) {
							mxResources.parse(c.getText())
						}
					} catch(d) {}
				}
			}
		}
	},
	parse: function(g) {
		if (g != null) {
			var b = g.split("\n");
			for (var e = 0; e < b.length; e++) {
				var c = b[e].indexOf("=");
				if (c > 0) {
					var d = b[e].substring(0, c);
					var a = b[e].length;
					if (b[e].charCodeAt(a - 1) == 13) {
						a--
					}
					var f = b[e].substring(c + 1, a);
					mxResources.resources[d] = unescape(f)
				}
			}
		}
	},
	get: function(f, h, b) {
		var g = mxResources.resources[f];
		if (g == null) {
			g = b
		}
		if (g != null && h != null) {
			var a = [];
			var d = null;
			for (var e = 0; e < g.length; e++) {
				var k = g.charAt(e);
				if (k == "{") {
					d = ""
				} else {
					if (d != null && k == "}") {
						d = parseInt(d) - 1;
						if (d >= 0 && d < h.length) {
							a.push(h[d])
						}
						d = null
					} else {
						if (d != null) {
							d += k
						} else {
							a.push(k)
						}
					}
				}
			}
			g = a.join("")
		}
		return g
	}
};
function mxPoint(a, b) {
	this.x = (a != null) ? a: 0;
	this.y = (b != null) ? b: 0
}
mxPoint.prototype.x = null;
mxPoint.prototype.y = null;
mxPoint.prototype.equals = function(a) {
	return a.x == this.x && a.y == this.y
};
mxPoint.prototype.clone = function() {
	return mxUtils.clone(this)
};
function mxRectangle(b, d, c, a) {
	mxPoint.call(this, b, d);
	this.width = (c != null) ? c: 0;
	this.height = (a != null) ? a: 0
}
mxRectangle.prototype = new mxPoint();
mxRectangle.prototype.constructor = mxRectangle;
mxRectangle.prototype.width = null;
mxRectangle.prototype.height = null;
mxRectangle.prototype.setRect = function(a, d, b, c) {
	this.x = a;
	this.y = d;
	this.width = b;
	this.height = c
};
mxRectangle.prototype.getCenterX = function() {
	return this.x + this.width / 2
};
mxRectangle.prototype.getCenterY = function() {
	return this.y + this.height / 2
};
mxRectangle.prototype.add = function(b) {
	if (b != null) {
		var a = Math.min(this.x, b.x);
		var e = Math.min(this.y, b.y);
		var d = Math.max(this.x + this.width, b.x + b.width);
		var c = Math.max(this.y + this.height, b.y + b.height);
		this.x = a;
		this.y = e;
		this.width = d - a;
		this.height = c - e
	}
};
mxRectangle.prototype.grow = function(a) {
	this.x -= a;
	this.y -= a;
	this.width += 2 * a;
	this.height += 2 * a
};
mxRectangle.prototype.getPoint = function() {
	return new mxPoint(this.x, this.y)
};
mxRectangle.prototype.equals = function(a) {
	return a.x == this.x && a.y == this.y && a.width == this.width && a.height == this.height
};
var mxEffects = {
	animateChanges: function(g, e, b) {
		var a = 10;
		var f = 0;
		var c = function() {
			var l = false;
			for (var m = 0; m < e.length; m++) {
				var o = e[m];
				if (o instanceof mxGeometryChange || o instanceof mxTerminalChange || o instanceof mxValueChange || o instanceof mxChildChange || o instanceof mxStyleChange) {
					var h = g.getView().getState(o.cell || o.child, false);
					if (h != null) {
						l = true;
						if (o.constructor != mxGeometryChange || g.model.isEdge(o.cell)) {
							mxUtils.setOpacity(h.shape.node, 100 * f / a)
						} else {
							var k = g.getView().scale;
							var r = (o.geometry.x - o.previous.x) * k;
							var q = (o.geometry.y - o.previous.y) * k;
							var p = (o.geometry.width - o.previous.width) * k;
							var n = (o.geometry.height - o.previous.height) * k;
							if (f == 0) {
								h.x -= r;
								h.y -= q;
								h.width -= p;
								h.height -= n
							} else {
								h.x += r / a;
								h.y += q / a;
								h.width += p / a;
								h.height += n / a
							}
							g.cellRenderer.redraw(h);
							mxEffects.cascadeOpacity(g, o.cell, 100 * f / a)
						}
					}
				}
			}
			mxUtils.repaintGraph(g, new mxPoint(1, 1));
			if (f < a && l) {
				f++;
				window.setTimeout(c, d)
			} else {
				if (b != null) {
					b()
				}
			}
		};
		var d = 30;
		c()
	},
	cascadeOpacity: function(h, g, f) {
		var b = h.model.getChildCount(g);
		for (var d = 0; d < b; d++) {
			var a = h.model.getChildAt(g, d);
			var k = h.getView().getState(a);
			if (k != null) {
				mxUtils.setOpacity(k.shape.node, f);
				mxEffects.cascadeOpacity(h, a, f)
			}
		}
		var c = h.model.getEdges(g);
		if (c != null) {
			for (var d = 0; d < c.length; d++) {
				var e = h.getView().getState(c[d]);
				if (e != null) {
					mxUtils.setOpacity(e.shape.node, f)
				}
			}
		}
	},
	fadeOut: function(g, i, a, e, c, d) {
		e = e || 40;
		c = c || 30;
		var b = i || 100;
		mxUtils.setOpacity(g, b);
		if (d || d == null) {
			var h = function() {
				b = Math.max(b - e, 0);
				mxUtils.setOpacity(g, b);
				if (b > 0) {
					window.setTimeout(h, c)
				} else {
					g.style.visibility = "hidden";
					if (a && g.parentNode) {
						g.parentNode.removeChild(g)
					}
				}
			};
			window.setTimeout(h, c)
		} else {
			g.style.visibility = "hidden";
			if (a && g.parentNode) {
				g.parentNode.removeChild(g)
			}
		}
	}
};
var mxUtils = {
	errorResource: (mxClient.language != "none") ? "error": "",
	closeResource: (mxClient.language != "none") ? "close": "",
	errorImage: mxClient.imageBasePath + "/error.gif",
	removeCursors: function(d) {
		if (d.style != null) {
			d.style.cursor = ""
		}
		var c = d.childNodes;
		if (c != null) {
			var a = c.length;
			for (var b = 0; b < a; b += 1) {
				mxUtils.removeCursors(c[b])
			}
		}
	},
	repaintGraph: function(a, d) {
		if (mxClient.IS_GC || mxClient.IS_SF || mxClient.IS_OP) {
			var e = a.container;
			if (e != null && d != null && (e.scrollLeft > 0 || e.scrollTop > 0)) {
				var b = document.createElement("div");
				b.style.position = "absolute";
				b.style.left = d.x + "px";
				b.style.top = d.y + "px";
				b.style.width = "1px";
				b.style.height = "1px";
				e.appendChild(b);
				e.removeChild(b)
			}
		}
	},
	getCurrentStyle: function() {
		if (mxClient.IS_IE) {
			return function(a) {
				return (a != null) ? a.currentStyle: null
			}
		} else {
			return function(a) {
				return (a != null) ? window.getComputedStyle(a, "") : null
			}
		}
	} (),
	hasScrollbars: function(b) {
		var a = mxUtils.getCurrentStyle(b);
		return a != null && (a.overflow == "scroll" || a.overflow == "auto")
	},
	bind: function(b, a) {
		return function() {
			return a.apply(b, arguments)
		}
	},
	eval: function(expr) {
		var result = null;
		if (expr.indexOf("function") >= 0) {
			try {
				eval("var _mxJavaScriptExpression=" + expr);
				result = _mxJavaScriptExpression;
				_mxJavaScriptExpression = null
			} catch(e) {
				mxLog.warn(e.message + " while evaluating " + expr)
			}
		} else {
			try {
				result = eval(expr)
			} catch(e) {
				mxLog.warn(e.message + " while evaluating " + expr)
			}
		}
		return result
	},
	findNode: function(d, b, e) {
		var c = d.getAttribute(b);
		if (c != null && c == e) {
			return d
		}
		d = d.firstChild;
		while (d != null) {
			var a = mxUtils.findNode(d, b, e);
			if (a != null) {
				return a
			}
			d = d.nextSibling
		}
		return null
	},
	findNodeByAttribute: function() {
		if (document.documentMode == 9) {
			return function(c, b, d) {
				var a = null;
				if (c.nodeType == mxConstants.NODETYPE_ELEMENT && c.getAttribute(b) == d) {
					a = c
				} else {
					var e = c.firstChild;
					while (e != null && a != null) {
						a = mxUtils.findNodeByAttribute(e, b, d);
						e = e.nextSibling
					}
				}
				return a
			}
		} else {
			if (mxClient.IS_IE) {
				return function(b, a, c) {
					var d = "//*[@" + a + "='" + c + "']";
					return b.ownerDocument.selectSingleNode(d)
				}
			} else {
				return function(c, b, d) {
					var a = c.ownerDocument.evaluate("//*[@" + b + "='" + d + "']", c.ownerDocument, null, XPathResult.ANY_TYPE, null);
					return a.iterateNext()
				}
			}
		}
	} (),
	getFunctionName: function(d) {
		var e = null;
		if (d != null) {
			if (d.name != null) {
				e = d.name
			} else {
				var c = d.toString();
				var b = 9;
				while (c.charAt(b) == " ") {
					b++
				}
				var a = c.indexOf("(", b);
				e = c.substring(b, a)
			}
		}
		return e
	},
	indexOf: function(c, b) {
		if (c != null && b != null) {
			for (var a = 0; a < c.length; a++) {
				if (c[a] == b) {
					return a
				}
			}
		}
		return - 1
	},
	remove: function(d, e) {
		var a = null;
		if (typeof(e) == "object") {
			var b = mxUtils.indexOf(e, d);
			while (b >= 0) {
				e.splice(b, 1);
				a = d;
				b = mxUtils.indexOf(e, d)
			}
		}
		for (var c in e) {
			if (e[c] == d) {
				delete e[c];
				a = d
			}
		}
		return a
	},
	isNode: function(c, d, a, b) {
		if (c != null && !isNaN(c.nodeType) && (d == null || c.nodeName.toLowerCase() == d.toLowerCase())) {
			return a == null || c.getAttribute(a) == b
		}
		return false
	},
	getChildNodes: function(d, a) {
		a = a || mxConstants.NODETYPE_ELEMENT;
		var c = [];
		var b = d.firstChild;
		while (b != null) {
			if (b.nodeType == a) {
				c.push(b)
			}
			b = b.nextSibling
		}
		return c
	},
	createXmlDocument: function() {
		var a = null;
		if (document.implementation && document.implementation.createDocument) {
			a = document.implementation.createDocument("", "", null)
		} else {
			if (window.ActiveXObject) {
				a = new ActiveXObject("Microsoft.XMLDOM")
			}
		}
		return a
	},
	parseXml: function() {
		if (mxClient.IS_IE && document.documentMode != 9) {
			return function(b) {
				var a = mxUtils.createXmlDocument();
				a.async = "false";
				a.loadXML(b);
				return a
			}
		} else {
			return function(a) {
				var b = new DOMParser();
				return b.parseFromString(a, "text/xml")
			}
		}
	} (),
	clearSelection: function() {
		if (document.selection) {
			return function() {
				document.selection.empty()
			}
		} else {
			if (window.getSelection) {
				return function() {
					window.getSelection().removeAllRanges()
				}
			}
		}
	} (),
	getPrettyXml: function(g, f, b) {
		var a = [];
		if (g != null) {
			f = f || "  ";
			b = b || "";
			if (g.nodeType == mxConstants.NODETYPE_TEXT) {
				a.push(g.nodeValue)
			} else {
				a.push(b + "<" + g.nodeName);
				var c = g.attributes;
				if (c != null) {
					for (var e = 0; e < c.length; e++) {
						var h = mxUtils.htmlEntities(c[e].nodeValue);
						a.push(" " + c[e].nodeName + '="' + h + '"')
					}
				}
				var d = g.firstChild;
				if (d != null) {
					a.push(">\n");
					while (d != null) {
						a.push(mxUtils.getPrettyXml(d, f, b + f));
						d = d.nextSibling
					}
					a.push(b + "</" + g.nodeName + ">\n")
				} else {
					a.push("/>\n")
				}
			}
		}
		return a.join("")
	},
	removeWhitespace: function(c, d) {
		var a = (d) ? c.previousSibling: c.nextSibling;
		while (a != null && a.nodeType == mxConstants.NODETYPE_TEXT) {
			var b = (d) ? a.previousSibling: a.nextSibling;
			var e = mxUtils.getTextContent(a);
			if (mxUtils.trim(e).length == 0) {
				a.parentNode.removeChild(a)
			}
			a = b
		}
	},
	htmlEntities: function(b, a) {
		b = b || "";
		b = b.replace(/&/g, "&amp;");
		b = b.replace(/"/g, "&quot;");
		b = b.replace(/\'/g, "&#39;");
		b = b.replace(/</g, "&lt;");
		b = b.replace(/>/g, "&gt;");
		if (a == null || a) {
			b = b.replace(/\n/g, "&#xa;")
		}
		return b
	},
	isVml: function(a) {
		return a != null && a.tagUrn == "urn:schemas-microsoft-com:vml"
	},
	getXml: function(d, b) {
		var c = "";
		if (d != null) {
			c = d.xml;
			if (c == null) {
				if (d.innerHTML) {
					c = d.innerHTML
				} else {
					var a = new XMLSerializer();
					c = a.serializeToString(d)
				}
			} else {
				c = c.replace(/\r\n\t[\t]*/g, "").replace(/>\r\n/g, ">").replace(/\r\n/g, "\n")
			}
		}
		b = b || "&#xa;";
		c = c.replace(/\n/g, b);
		return c
	},
	getTextContent: function(b) {
		var a = "";
		if (b != null) {
			if (b.firstChild != null) {
				b = b.firstChild
			}
			a = b.nodeValue || ""
		}
		return a
	},
	getInnerHtml: function() {
		if (mxClient.IS_IE) {
			return function(a) {
				if (a != null) {
					return a.innerHTML
				}
				return ""
			}
		} else {
			return function(b) {
				if (b != null) {
					var a = new XMLSerializer();
					return a.serializeToString(b)
				}
				return ""
			}
		}
	} (),
	getOuterHtml: function() {
		if (mxClient.IS_IE) {
			return function(d) {
				if (d != null) {
					if (d.outerHTML != null) {
						return d.outerHTML
					} else {
						var c = [];
						c.push("<" + d.nodeName);
						var a = d.attributes;
						for (var b = 0; b < a.length; b++) {
							var e = a[b].nodeValue;
							if (e != null && e.length > 0) {
								c.push(" ");
								c.push(a[b].nodeName);
								c.push('="');
								c.push(e);
								c.push('"')
							}
						}
						if (d.innerHTML.length == 0) {
							c.push("/>")
						} else {
							c.push(">");
							c.push(d.innerHTML);
							c.push("</" + d.nodeName + ">")
						}
						return c.join("")
					}
				}
				return ""
			}
		} else {
			return function(b) {
				if (b != null) {
					var a = new XMLSerializer();
					return a.serializeToString(b)
				}
				return ""
			}
		}
	} (),
	write: function(a, c) {
		doc = a.ownerDocument;
		var b = doc.createTextNode(c);
		if (a != null) {
			a.appendChild(b)
		}
		return b
	},
	writeln: function(a, c) {
		doc = a.ownerDocument;
		var b = doc.createTextNode(c);
		if (a != null) {
			a.appendChild(b);
			a.appendChild(document.createElement("br"))
		}
		return b
	},
	br: function(c, d) {
		d = d || 1;
		var b = null;
		for (var a = 0; a < d; a++) {
			if (c != null) {
				b = c.ownerDocument.createElement("br");
				c.appendChild(b)
			}
		}
		return b
	},
	button: function(b, a, d) {
		d = (d != null) ? d: document;
		var c = d.createElement("button");
		mxUtils.write(c, b);
		mxEvent.addListener(c, "click",
		function(e) {
			a(e)
		});
		return c
	},
	para: function(a, c) {
		var b = document.createElement("p");
		mxUtils.write(b, c);
		if (a != null) {
			a.appendChild(b)
		}
		return b
	},
	linkAction: function(b, e, a, c, d) {
		return mxUtils.link(b, e,
		function() {
			a.execute(c)
		},
		d)
	},
	linkInvoke: function(d, f, c, b, a, e) {
		return mxUtils.link(d, f,
		function() {
			c[b](a)
		},
		e)
	},
	link: function(d, f, c, e) {
		var b = document.createElement("span");
		b.style.color = "blue";
		b.style.textDecoration = "underline";
		b.style.cursor = "pointer";
		if (e != null) {
			b.style.paddingLeft = e + "px"
		}
		mxEvent.addListener(b, "click", c);
		mxUtils.write(b, f);
		if (d != null) {
			d.appendChild(b)
		}
		return b
	},
	fit: function(f) {
		var e = parseInt(f.offsetLeft);
		var c = parseInt(f.offsetWidth);
		var i = document.body;
		var g = document.documentElement;
		var k = (i.scrollLeft || g.scrollLeft) + (i.clientWidth || g.clientWidth);
		if (e + c > k) {
			f.style.left = Math.max((i.scrollLeft || g.scrollLeft), k - c) + "px"
		}
		var h = parseInt(f.offsetTop);
		var l = parseInt(f.offsetHeight);
		var a = (i.scrollTop || g.scrollTop) + Math.max(i.clientHeight || 0, g.clientHeight);
		if (h + l > a) {
			f.style.top = Math.max((i.scrollTop || g.scrollTop), a - l) + "px"
		}
	},
	open: function(b) {
		if (!mxClient.IS_IE && !mxClient.IS_OP) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
			} catch(h) {
				mxUtils.alert("Permission to read file denied.");
				return ""
			}
			var d = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			d.initWithPath(b);
			if (!d.exists()) {
				mxUtils.alert("File not found.");
				return ""
			}
			var g = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			g.init(d, 1, 4, null);
			var f = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			f.init(g);
			var c = f.read(f.available());
			return c
		} else {
			var i = new ActiveXObject("Scripting.FileSystemObject");
			var a = i.OpenTextFile(b, 1);
			var k = a.readAll();
			a.close();
			return k
		}
		return null
	},
	save: function(b, d) {
		if (!mxClient.IS_IE && !mxClient.IS_OP) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
			} catch(g) {
				mxUtils.alert("Permission to write file denied.");
				return
			}
			var c = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			c.initWithPath(b);
			if (!c.exists()) {
				c.create(0, 420)
			}
			var a = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			a.init(c, 32 | 2, 4, null);
			a.write(d, d.length);
			a.flush();
			a.close()
		} else {
			var f = new ActiveXObject("Scripting.FileSystemObject");
			var c = f.CreateTextFile(b, true);
			c.Write(d);
			c.Close()
		}
	},
	saveAs: function(b) {
		var a = document.createElement("iframe");
		a.setAttribute("src", "");
		a.style.visibility = "hidden";
		document.body.appendChild(a);
		try {
			if (!mxClient.IS_IE && !mxClient.IS_OP) {
				var d = a.contentDocument;
				d.open();
				d.write(b);
				d.close();
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					a.focus();
					saveDocument(d)
				} catch(c) {
					mxUtils.alert("Permission to save document denied.")
				}
			} else {
				var d = a.contentWindow.document;
				d.write(b);
				d.execCommand("SaveAs", false, document.location)
			}
		} finally {
			document.body.removeChild(a)
		}
	},
	copy: function(c) {
		if (window.clipboardData) {
			window.clipboardData.setData("Text", c)
		} else {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var b = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
			if (!b) {
				return
			}
			var a = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
			if (!a) {
				return
			}
			a.addDataFlavor("text/unicode");
			var e = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			var f = c;
			e.data = f;
			a.setTransferData("text/unicode", e, f.length * 2);
			var d = Components.interfaces.nsIClipboard;
			b.setData(a, null, d.kGlobalClipboard)
		}
	},
	load: function(a) {
		var b = new mxXmlRequest(a, null, "GET", false);
		b.send();
		return b
	},
	get: function(b, c, a) {
		return new mxXmlRequest(b, null, "GET").send(c, a)
	},
	post: function(b, d, c, a) {
		return new mxXmlRequest(b, d).send(c, a)
	},
	submit: function(a, d, c, b) {
		return new mxXmlRequest(a, d).simulate(c, b)
	},
	loadInto: function(a, c, b) {
		if (mxClient.IS_IE) {
			c.onreadystatechange = function() {
				if (c.readyState == 4) {
					b()
				}
			}
		} else {
			c.addEventListener("load", b, false)
		}
		c.load(a)
	},
	getValue: function(d, b, a) {
		var c = (d != null) ? d[b] : null;
		if (c == null) {
			c = a
		}
		return c
	},
	getNumber: function(d, b, a) {
		var c = (d != null) ? d[b] : null;
		if (c == null) {
			c = a || 0
		}
		return Number(c)
	},
	getColor: function(d, b, a) {
		var c = (d != null) ? d[b] : null;
		if (c == null) {
			c = a
		} else {
			if (c == mxConstants.NONE) {
				c = null
			}
		}
		return c
	},
	clone: function(d, b, c) {
		c = (c != null) ? c: false;
		var e = null;
		if (d != null && typeof(d.constructor) == "function") {
			e = new d.constructor();
			for (var a in d) {
				if (a != mxObjectIdentity.FIELD_NAME && (b == null || mxUtils.indexOf(b, a) < 0)) {
					if (!c && typeof(d[a]) == "object") {
						e[a] = mxUtils.clone(d[a])
					} else {
						e[a] = d[a]
					}
				}
			}
		}
		return e
	},
	equalPoints: function(d, c) {
		if ((d == null && c != null) || (d != null && c == null) || (d != null && c != null && d.length != c.length)) {
			return false
		} else {
			if (d != null && c != null) {
				for (var e = 0; e < d.length; e++) {
					if (d[e] == c[e] || (d[e] != null && !d[e].equals(c[e]))) {
						return false
					}
				}
			}
		}
		return true
	},
	equalEntries: function(d, c) {
		if ((d == null && c != null) || (d != null && c == null) || (d != null && c != null && d.length != c.length)) {
			return false
		} else {
			if (d != null && c != null) {
				for (var e in d) {
					if (d[e] != c[e]) {
						return false
					}
				}
			}
		}
		return true
	},
	toString: function(f) {
		var a = "";
		for (var b in f) {
			try {
				if (f[b] == null) {
					a += b + " = [null]\n"
				} else {
					if (typeof(f[b]) == "function") {
						a += b + " => [Function]\n"
					} else {
						if (typeof(f[b]) == "object") {
							var c = mxUtils.getFunctionName(f[b].constructor);
							a += b + " => [" + c + "]\n"
						} else {
							a += b + " = " + f[b] + "\n"
						}
					}
				}
			} catch(d) {
				a += b + "=" + d.message
			}
		}
		return a
	},
	toRadians: function(a) {
		return Math.PI * a / 180
	},
	arcToCurves: function(z, a, u, s, B, E, H, O, N) {
		var D = [];
		O -= z;
		N -= a;
		if (u === 0 || s === 0) {
			return D
		}
		var T = H;
		var X = B;
		u = Math.abs(u);
		s = Math.abs(s);
		var G = -O / 2;
		var F = -N / 2;
		var e = Math.cos(X * Math.PI / 180);
		var K = Math.sin(X * Math.PI / 180);
		var J = e * G + K * F;
		var r = -1 * K * G + e * F;
		var q = J * J;
		var k = r * r;
		var I = u * u;
		var o = s * s;
		var ab = q / I + k / o;
		var U;
		if (ab > 1) {
			u = Math.sqrt(ab) * u;
			s = Math.sqrt(ab) * s;
			U = 0
		} else {
			var m = 1;
			if (E === T) {
				m = -1
			}
			U = m * Math.sqrt((I * o - I * k - o * q) / (I * k + o * q))
		}
		var A = U * u * r / s;
		var d = -1 * U * s * J / u;
		var W = e * A - K * d + O / 2;
		var V = K * A + e * d + N / 2;
		var g = Math.atan2((r - d) / s, (J - A) / u) - Math.atan2(0, 1);
		var Y = (g >= 0) ? g: 2 * Math.PI + g;
		g = Math.atan2(( - r - d) / s, ( - J - A) / u) - Math.atan2((r - d) / s, (J - A) / u);
		var l = (g >= 0) ? g: 2 * Math.PI + g;
		if (!T && l > 0) {
			l -= 2 * Math.PI
		} else {
			if (T && l < 0) {
				l += 2 * Math.PI
			}
		}
		var h = l * 2 / Math.PI;
		var L = Math.ceil(h < 0 ? -1 * h: h);
		var M = l / L;
		var R = 8 / 3 * Math.sin(M / 4) * Math.sin(M / 4) / Math.sin(M / 2);
		var Q = e * u;
		var P = e * s;
		var c = K * u;
		var b = K * s;
		var C = Math.cos(Y);
		var p = Math.sin(Y);
		var w = -R * (Q * p + b * C);
		var aa = -R * (c * p - P * C);
		var v = 0;
		var Z = 0;
		for (var S = 0; S < L; ++S) {
			Y += M;
			C = Math.cos(Y);
			p = Math.sin(Y);
			v = Q * C - b * p + W;
			Z = c * C + P * p + V;
			var i = -R * (Q * p + b * C);
			var f = -R * (c * p - P * C);
			D = D.concat([Number(w + z), Number(aa + a), Number(v - i + z), Number(Z - f + a), Number(v + z), Number(Z + a)]);
			w = v + i;
			aa = Z + f
		}
		return D
	},
	getBoundingBox: function(d, k) {
		var l = null;
		if (d != null && k != null && k != 0) {
			var c = mxUtils.toRadians(k);
			var i = Math.cos(c);
			var b = Math.sin(c);
			var a = new mxPoint(d.x + d.width / 2, d.y + d.height / 2);
			var h = new mxPoint(d.x, d.y);
			var g = new mxPoint(d.x + d.width, d.y);
			var f = new mxPoint(g.x, d.y + d.height);
			var e = new mxPoint(d.x, f.y);
			h = mxUtils.getRotatedPoint(h, i, b, a);
			g = mxUtils.getRotatedPoint(g, i, b, a);
			f = mxUtils.getRotatedPoint(f, i, b, a);
			e = mxUtils.getRotatedPoint(e, i, b, a);
			l = new mxRectangle(h.x, h.y, 0, 0);
			l.add(new mxRectangle(g.x, g.y, 0, 0));
			l.add(new mxRectangle(f.x, f.y, 0, 0));
			l.add(new mxRectangle(e.x, e.Y, 0, 0))
		}
		return l
	},
	getRotatedPoint: function(g, f, b, i) {
		i = (i != null) ? i: new mxPoint();
		var a = g.x - i.x;
		var h = g.y - i.y;
		var d = a * f - h * b;
		var e = h * f + a * b;
		return new mxPoint(d + i.x, e + i.y)
	},
	getPortConstraints: function(b, d, f, a) {
		var e = mxUtils.getValue(b.style, mxConstants.STYLE_PORT_CONSTRAINT, null);
		if (e == null) {
			return a
		} else {
			var g = e.toString();
			var c = mxConstants.DIRECTION_MASK_NONE;
			if (g.indexOf(mxConstants.DIRECTION_NORTH) >= 0) {
				c |= mxConstants.DIRECTION_MASK_NORTH
			}
			if (g.indexOf(mxConstants.DIRECTION_WEST) >= 0) {
				c |= mxConstants.DIRECTION_MASK_WEST
			}
			if (g.indexOf(mxConstants.DIRECTION_SOUTH) >= 0) {
				c |= mxConstants.DIRECTION_MASK_SOUTH
			}
			if (g.indexOf(mxConstants.DIRECTION_EAST) >= 0) {
				c |= mxConstants.DIRECTION_MASK_EAST
			}
			return c
		}
	},
	reversePortConstraints: function(b) {
		var a = 0;
		a = (b & mxConstants.DIRECTION_MASK_WEST) << 3;
		a |= (b & mxConstants.DIRECTION_MASK_NORTH) << 1;
		a |= (b & mxConstants.DIRECTION_MASK_SOUTH) >> 1;
		a |= (b & mxConstants.DIRECTION_MASK_EAST) >> 3;
		return a
	},
	findNearestSegment: function(a, h, g) {
		var d = -1;
		if (a.absolutePoints.length > 0) {
			var k = a.absolutePoints[0];
			var b = null;
			for (var c = 1; c < a.absolutePoints.length; c++) {
				var e = a.absolutePoints[c];
				var f = mxUtils.ptSegDistSq(k.x, k.y, e.x, e.y, h, g);
				if (b == null || f < b) {
					b = f;
					d = c - 1
				}
				k = e
			}
		}
		return d
	},
	rectangleIntersectsSegment: function(d, q, o) {
		var m = d.y;
		var h = d.x;
		var e = m + d.height;
		var p = h + d.width;
		var i = q.x;
		var f = o.x;
		if (q.x > o.x) {
			i = o.x;
			f = q.x
		}
		if (f > p) {
			f = p
		}
		if (i < h) {
			i = h
		}
		if (i > f) {
			return false
		}
		var g = q.y;
		var c = o.y;
		var r = o.x - q.x;
		if (Math.abs(r) > 1e-7) {
			var n = (o.y - q.y) / r;
			var l = q.y - n * q.x;
			g = n * i + l;
			c = n * f + l
		}
		if (g > c) {
			var k = c;
			c = g;
			g = k
		}
		if (c > e) {
			c = e
		}
		if (g < m) {
			g = m
		}
		if (g > c) {
			return false
		}
		return true
	},
	contains: function(b, a, c) {
		return (b.x <= a && b.x + b.width >= a && b.y <= c && b.y + b.height >= c)
	},
	intersects: function(l, k) {
		var i = l.width;
		var e = l.height;
		var f = k.width;
		var m = k.height;
		if (f <= 0 || m <= 0 || i <= 0 || e <= 0) {
			return false
		}
		var h = l.x;
		var g = l.y;
		var d = k.x;
		var c = k.y;
		f += d;
		m += c;
		i += h;
		e += g;
		return ((f < d || f > h) && (m < c || m > g) && (i < h || i > d) && (e < g || e > c))
	},
	intersectsHotspot: function(a, m, k, b, f, l) {
		b = (b != null) ? b: 1;
		f = (f != null) ? f: 0;
		l = (l != null) ? l: 0;
		if (b > 0) {
			var e = a.getCenterX();
			var d = a.getCenterY();
			var n = a.width;
			var g = a.height;
			var c = mxUtils.getValue(a.style, mxConstants.STYLE_STARTSIZE);
			if (c > 0) {
				if (mxUtils.getValue(a.style, mxConstants.STYLE_HORIZONTAL, true)) {
					d = a.y + c / 2;
					g = c
				} else {
					e = a.x + c / 2;
					n = c
				}
			}
			n = Math.max(f, n * b);
			g = Math.max(f, g * b);
			if (l > 0) {
				n = Math.min(n, l);
				g = Math.min(g, l)
			}
			var i = new mxRectangle(e - n / 2, d - g / 2, n, g);
			return mxUtils.contains(i, m, k)
		}
		return true
	},
	getOffset: function(a) {
		var c = 0;
		var b = 0;
		while (a.offsetParent) {
			c += a.offsetLeft;
			b += a.offsetTop;
			a = a.offsetParent
		}
		return new mxPoint(c, b)
	},
	getScrollOrigin: function(g) {
		var e = document.body;
		var h = document.documentElement;
		var c = (e.scrollLeft || h.scrollLeft);
		var f = (e.scrollTop || h.scrollTop);
		var a = new mxPoint(c, f);
		while (g != null && g != e && g != h) {
			a.x += g.scrollLeft;
			a.y += g.scrollTop;
			g = g.parentNode
		}
		return a
	},
	convertPoint: function(b, a, e) {
		var c = mxUtils.getScrollOrigin(b);
		var d = mxUtils.getOffset(b);
		d.x -= c.x;
		d.y -= c.y;
		return new mxPoint(a - d.x, e - d.y)
	},
	ltrim: function(b, a) {
		a = a || "\\s";
		return b.replace(new RegExp("^[" + a + "]+", "g"), "")
	},
	rtrim: function(b, a) {
		a = a || "\\s";
		return b.replace(new RegExp("[" + a + "]+$", "g"), "")
	},
	trim: function(b, a) {
		return mxUtils.ltrim(mxUtils.rtrim(b, a), a)
	},
	isNumeric: function(a) {
		return a != null && (a.length == null || (a.length > 0 && a.indexOf("0x") < 0) && a.indexOf("0X") < 0) && !isNaN(a)
	},
	mod: function(b, a) {
		return ((b % a) + a) % a
	},
	intersection: function(f, p, e, n, d, l, b, k) {
		var i = ((k - l) * (e - f)) - ((b - d) * (n - p));
		var o = ((b - d) * (p - l)) - ((k - l) * (f - d));
		var m = ((e - f) * (p - l)) - ((n - p) * (f - d));
		var c = o / i;
		var a = m / i;
		if (c >= 0 && c <= 1 && a >= 0 && a <= 1) {
			var h = f + c * (e - f);
			var g = p + c * (n - p);
			return new mxPoint(h, g)
		}
		return null
	},
	ptSegDistSq: function(c, g, b, e, i, h) {
		b -= c;
		e -= g;
		i -= c;
		h -= g;
		var f = i * b + h * e;
		var a;
		if (f <= 0) {
			a = 0
		} else {
			i = b - i;
			h = e - h;
			f = i * b + h * e;
			if (f <= 0) {
				a = 0
			} else {
				a = f * f / (b * b + e * e)
			}
		}
		var d = i * i + h * h - a;
		if (d < 0) {
			d = 0
		}
		return d
	},
	relativeCcw: function(d, g, b, f, e, c) {
		b -= d;
		f -= g;
		e -= d;
		c -= g;
		var a = e * f - c * b;
		if (a == 0) {
			a = e * b + c * f;
			if (a > 0) {
				e -= b;
				c -= f;
				a = e * b + c * f;
				if (a < 0) {
					a = 0
				}
			}
		}
		return (a < 0) ? -1 : ((a > 0) ? 1 : 0)
	},
	animateChanges: function(b, a) {
		mxEffects.animateChanges.apply(this, arguments)
	},
	cascadeOpacity: function(c, a, b) {
		mxEffects.cascadeOpacity.apply(this, arguments)
	},
	fadeOut: function(e, f, a, d, b, c) {
		mxEffects.fadeOut.apply(this, arguments)
	},
	setOpacity: function(a, b) {
		if (mxUtils.isVml(a)) {
			if (b >= 100) {
				a.style.filter = null
			} else {
				a.style.filter = "alpha(opacity=" + (b / 5) + ")"
			}
		} else {
			if (mxClient.IS_IE) {
				if (b >= 100) {
					a.style.filter = null
				} else {
					a.style.filter = "alpha(opacity=" + b + ")"
				}
			} else {
				a.style.opacity = (b / 100)
			}
		}
	},
	createImage: function(b) {
		var a = null;
		if (false && document.compatMode != "CSS1Compat") {
			a = document.createElement("v:image");
			a.setAttribute("src", b);
			a.style.borderStyle = "none"
		} else {
			a = document.createElement("img");
			a.setAttribute("src", b);
			a.setAttribute("border", "0")
		}
		return a
	},
	sortCells: function(a, b) {
		b = (b != null) ? b: true;
		var c = new mxDictionary();
		a.sort(function(f, e) {
			var h = c.get(f);
			if (h == null) {
				h = mxCellPath.create(f).split(mxCellPath.PATH_SEPARATOR);
				c.put(f, h)
			}
			var g = c.get(e);
			if (g == null) {
				g = mxCellPath.create(e).split(mxCellPath.PATH_SEPARATOR);
				c.put(e, g)
			}
			var d = mxCellPath.compare(h, g);
			return (d == 0) ? 0 : (((d > 0) == b) ? 1 : -1)
		});
		return a
	},
	getStylename: function(a) {
		if (a != null) {
			var c = a.split(";");
			var b = c[0];
			if (b.indexOf("=") < 0) {
				return b
			}
		}
		return ""
	},
	getStylenames: function(c) {
		var a = [];
		if (c != null) {
			var d = c.split(";");
			for (var b = 0; b < d.length; b++) {
				if (d[b].indexOf("=") < 0) {
					a.push(d[b])
				}
			}
		}
		return a
	},
	indexOfStylename: function(b, c) {
		if (b != null && c != null) {
			var d = b.split(";");
			var e = 0;
			for (var a = 0; a < d.length; a++) {
				if (d[a] == c) {
					return e
				}
				e += d[a].length + 1
			}
		}
		return - 1
	},
	addStylename: function(a, b) {
		if (mxUtils.indexOfStylename(a, b) < 0) {
			if (a == null) {
				a = ""
			} else {
				if (a.length > 0 && a.charAt(a.length - 1) != ";") {
					a += ";"
				}
			}
			a += b
		}
		return a
	},
	removeStylename: function(c, d) {
		var a = [];
		if (c != null) {
			var e = c.split(";");
			for (var b = 0; b < e.length; b++) {
				if (e[b] != d) {
					a.push(e[b])
				}
			}
		}
		return a.join(";")
	},
	removeAllStylenames: function(c) {
		var a = [];
		if (c != null) {
			var d = c.split(";");
			for (var b = 0; b < d.length; b++) {
				if (d[b].indexOf("=") >= 0) {
					a.push(d[b])
				}
			}
		}
		return a.join(";")
	},
	setCellStyles: function(b, a, d, f) {
		if (a != null && a.length > 0) {
			b.beginUpdate();
			try {
				for (var c = 0; c < a.length; c++) {
					if (a[c] != null) {
						var e = mxUtils.setStyle(b.getStyle(a[c]), d, f);
						b.setStyle(a[c], e)
					}
				}
			} finally {
				b.endUpdate()
			}
		}
	},
	setStyle: function(f, e, g) {
		var h = g != null && (typeof(g.length) == "undefined" || g.length > 0);
		if (f == null || f.length == 0) {
			if (h) {
				f = e + "=" + g
			}
		} else {
			var c = f.indexOf(e + "=");
			if (c < 0) {
				if (h) {
					var b = (f.charAt(f.length - 1) == ";") ? "": ";";
					f = f + b + e + "=" + g
				}
			} else {
				var d = (h) ? (e + "=" + g) : "";
				var a = f.indexOf(";", c);
				if (!h) {
					a++
				}
				f = f.substring(0, c) + d + ((a > c) ? f.substring(a) : "")
			}
		}
		return f
	},
	setCellStyleFlags: function(c, b, e, a, g) {
		if (b != null && b.length > 0) {
			c.beginUpdate();
			try {
				for (var d = 0; d < b.length; d++) {
					if (b[d] != null) {
						var f = mxUtils.setStyleFlag(c.getStyle(b[d]), e, a, g);
						c.setStyle(b[d], f)
					}
				}
			} finally {
				c.endUpdate()
			}
		}
	},
	setStyleFlag: function(g, f, b, h) {
		if (g == null || g.length == 0) {
			if (h || h == null) {
				g = f + "=" + b
			} else {
				g = f + "=0"
			}
		} else {
			var d = g.indexOf(f + "=");
			if (d < 0) {
				var c = (g.charAt(g.length - 1) == ";") ? "": ";";
				if (h || h == null) {
					g = g + c + f + "=" + b
				} else {
					g = g + c + f + "=0"
				}
			} else {
				var a = g.indexOf(";", d);
				var e = "";
				if (a < 0) {
					e = g.substring(d + f.length + 1)
				} else {
					e = g.substring(d + f.length + 1, a)
				}
				if (h == null) {
					e = parseInt(e) ^ b
				} else {
					if (h) {
						e = parseInt(e) | b
					} else {
						e = parseInt(e) & ~b
					}
				}
				g = g.substring(0, d) + f + "=" + e + ((a >= 0) ? g.substring(a) : "")
			}
		}
		return g
	},
	getSizeForString: function(d, c, a) {
		var e = document.createElement("div");
		e.style.fontSize = c || mxConstants.DEFAULT_FONTSIZE;
		e.style.fontFamily = a || mxConstants.DEFAULT_FONTFAMILY;
		e.style.position = "absolute";
		e.style.display = "inline";
		e.style.visibility = "hidden";
		e.innerHTML = d;
		document.body.appendChild(e);
		var b = new mxRectangle(0, 0, e.offsetWidth, e.offsetHeight);
		document.body.removeChild(e);
		return b
	},
	getViewXml: function(l, c, n, a, i) {
		a = (a != null) ? a: 0;
		i = (i != null) ? i: 0;
		c = (c != null) ? c: 1;
		if (n == null) {
			var e = l.getModel();
			n = [e.getRoot()]
		}
		var g = l.getView();
		var o = null;
		var f = g.isEventsEnabled();
		g.setEventsEnabled(false);
		var h = g.drawPane;
		var m = g.overlayPane;
		if (l.dialect == mxConstants.DIALECT_SVG) {
			g.drawPane = document.createElementNS(mxConstants.NS_SVG, "g");
			g.canvas.appendChild(g.drawPane);
			g.overlayPane = document.createElementNS(mxConstants.NS_SVG, "g");
			g.canvas.appendChild(g.overlayPane)
		} else {
			g.drawPane = g.drawPane.cloneNode(false);
			g.canvas.appendChild(g.drawPane);
			g.overlayPane = g.overlayPane.cloneNode(false);
			g.canvas.appendChild(g.overlayPane)
		}
		var b = g.getTranslate();
		g.translate = new mxPoint(a, i);
		var k = new mxTemporaryCellStates(l.getView(), c, n);
		try {
			var d = new mxCodec();
			o = d.encode(l.getView())
		} finally {
			k.destroy();
			g.translate = b;
			g.canvas.removeChild(g.drawPane);
			g.canvas.removeChild(g.overlayPane);
			g.drawPane = h;
			g.overlayPane = m;
			g.setEventsEnabled(f)
		}
		return o
	},
	getScaleForPageCount: function(s, g, t, u) {
		if (s < 1) {
			return 1
		}
		t = (t != null) ? t: mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		u = (u != null) ? u: 0;
		var r = t.width - (u * 2);
		var c = t.height - (u * 2);
		var h = g.getGraphBounds().clone();
		var e = g.getView().getScale();
		h.width /= e;
		h.height /= e;
		var m = h.width;
		var o = h.height;
		var x = 1;
		var k = r / c;
		var v = m / o;
		var p = v / k;
		var b = Math.sqrt(s);
		var a = Math.sqrt(p);
		var f = b * a;
		var n = b / a;
		if (f < 1 && n > s) {
			var y = n / s;
			n = s;
			f /= y
		}
		if (n < 1 && f > s) {
			var y = f / s;
			f = s;
			n /= y
		}
		var d = Math.ceil(f) * Math.ceil(n);
		var l = 0;
		while (d > s) {
			var w = Math.floor(f) / f;
			var i = Math.floor(n) / n;
			if (w == 1) {
				w = Math.floor(f - 1) / f
			}
			if (i == 1) {
				i = Math.floor(n - 1) / n
			}
			var y = 1;
			if (w > i) {
				y = w
			} else {
				y = i
			}
			f = f * y;
			n = n * y;
			d = Math.ceil(f) * Math.ceil(n);
			l++;
			if (l > 10) {
				break
			}
		}
		var q = r * f;
		x = q / m;
		return x * 0.99999
	},
	show: function(q, n, c, o) {
		c = (c != null) ? c: 0;
		o = (o != null) ? o: 0;
		if (n == null) {
			var f = window.open();
			n = f.document
		} else {
			n.open()
		}
		var a = q.getGraphBounds();
		var t = -a.x + c;
		var s = -a.y + o;
		if (mxClient.IS_IE) {
			var h = "<html>";
			h += "<head>";
			var b = document.getElementsByTagName("base");
			for (var g = 0; g < b.length; g++) {
				h += b[g].outerHTML
			}
			h += "<style>";
			for (var g = 0; g < document.styleSheets.length; g++) {
				try {
					h += document.styleSheets(g).cssText
				} catch(k) {}
			}
			h += "</style>";
			h += "</head>";
			h += "<body>";
			h += q.container.innerHTML;
			h += "</body>";
			h += "<html>";
			n.writeln(h);
			n.close();
			var d = n.body.getElementsByTagName("DIV")[0];
			if (d != null) {
				d.style.position = "absolute";
				d.style.left = t + "px";
				d.style.top = s + "px"
			}
		} else {
			n.writeln("<html");
			n.writeln("<head>");
			var b = document.getElementsByTagName("base");
			for (var g = 0; g < b.length; g++) {
				n.writeln(mxUtils.getOuterHtml(b[g]))
			}
			var p = document.getElementsByTagName("link");
			for (var g = 0; g < p.length; g++) {
				n.writeln(mxUtils.getOuterHtml(p[g]))
			}
			var r = document.getElementsByTagName("style");
			for (var g = 0; g < r.length; g++) {
				n.writeln(mxUtils.getOuterHtml(r[g]))
			}
			n.writeln("</head>");
			n.writeln("</html>");
			n.close();
			if (n.body == null) {
				n.documentElement.appendChild(n.createElement("body"))
			}
			n.body.style.overflow = "auto";
			var d = q.container.firstChild;
			while (d != null) {
				var l = d.cloneNode(true);
				n.body.appendChild(l);
				d = d.nextSibling
			}
			var d = n.getElementsByTagName("g")[0];
			if (d != null) {
				d.setAttribute("transform", "translate(" + t + "," + s + ")");
				var m = d.ownerSVGElement;
				m.setAttribute("width", a.width + Math.max(a.x, 0) + 3);
				m.setAttribute("height", a.height + Math.max(a.y, 0) + 3)
			}
		}
		mxUtils.removeCursors(n.body);
		return n
	},
	printScreen: function(c) {
		var b = window.open();
		mxUtils.show(c, b.document);
		var a = function() {
			b.focus();
			b.print();
			b.close()
		};
		if (mxClient.IS_GC) {
			b.setTimeout(a, 500)
		} else {
			a()
		}
	},
	popup: function(d, g) {
		if (g) {
			var f = document.createElement("div");
			f.style.overflow = "scroll";
			f.style.width = "636px";
			f.style.height = "460px";
			var e = document.createElement("pre");
			e.innerHTML = mxUtils.htmlEntities(d, false).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
			f.appendChild(e);
			var a = document.body.clientWidth;
			var b = (document.body.clientHeight || document.documentElement.clientHeight);
			var c = new mxWindow("Popup Window", f, a / 2 - 320, b / 2 - 240, 640, 480, false, true);
			c.setClosable(true);
			c.setVisible(true)
		} else {
			if (!mxClient.IS_IE && !mxClient.IS_OP) {
				var c = window.open();
				c.document.writeln("<pre>" + mxUtils.htmlEntities(d) + "</pre");
				c.document.close()
			} else {
				var c = window.open();
				var e = c.document.createElement("pre");
				e.innerHTML = mxUtils.htmlEntities(d, false).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
				c.document.body.appendChild(e)
			}
		}
	},
	alert: function(a) {
		alert(a)
	},
	prompt: function(b, a) {
		return prompt(b, a)
	},
	confirm: function(a) {
		return confirm(a)
	},
	error: function(m, b, l, i) {
		var a = document.createElement("div");
		a.style.padding = "20px";
		var d = document.createElement("img");
		d.setAttribute("src", i || mxUtils.errorImage);
		d.setAttribute("valign", "bottom");
		d.style.verticalAlign = "middle";
		a.appendChild(d);
		a.appendChild(document.createTextNode("\u00a0"));
		a.appendChild(document.createTextNode("\u00a0"));
		a.appendChild(document.createTextNode("\u00a0"));
		mxUtils.write(a, m);
		var k = document.body.clientWidth;
		var f = (document.body.clientHeight || document.documentElement.clientHeight);
		var g = new mxWindow(mxResources.get(mxUtils.errorResource) || mxUtils.errorResource, a, (k - b) / 2, f / 4, b, null, false, true);
		if (l) {
			mxUtils.br(a);
			var c = document.createElement("p");
			var e = document.createElement("button");
			if (mxClient.IS_IE) {
				e.style.cssText = "float:right"
			} else {
				e.setAttribute("style", "float:right")
			}
			mxEvent.addListener(e, "click",
			function(h) {
				g.destroy()
			});
			mxUtils.write(e, mxResources.get(mxUtils.closeResource) || mxUtils.closeResource);
			c.appendChild(e);
			a.appendChild(c);
			mxUtils.br(a);
			g.setClosable(true)
		}
		g.setVisible(true);
		return g
	},
	makeDraggable: function(e, f, b, a, l, k, i, h, d, g) {
		var c = new mxDragSource(e, b);
		c.dragOffset = new mxPoint((l != null) ? l: 0, (k != null) ? k: mxConstants.TOOLTIP_VERTICAL_OFFSET);
		c.autoscroll = i;
		c.setGuidesEnabled(false);
		if (d != null) {
			c.highlightDropTargets = d
		}
		if (g != null) {
			c.getDropTarget = g
		}
		c.getGraphForEvent = function(m) {
			return (typeof(f) == "function") ? f(m) : f
		};
		if (a != null) {
			c.createDragElement = function() {
				return a.cloneNode(true)
			};
			if (h) {
				c.createPreviewElement = function(p) {
					var n = a.cloneNode(true);
					var m = parseInt(n.style.width);
					var o = parseInt(n.style.height);
					n.style.width = Math.round(m * p.view.scale) + " px";
					n.style.height = Math.round(o * p.view.scale) + " px";
					return n
				}
			}
		}
		return c
	}
};
var mxConstants = {
	DEFAULT_HOTSPOT: 0.3,
	MIN_HOTSPOT_SIZE: 8,
	MAX_HOTSPOT_SIZE: 0,
	RENDERING_HINT_EXACT: "exact",
	RENDERING_HINT_FASTER: "faster",
	RENDERING_HINT_FASTEST: "fastest",
	DIALECT_SVG: "svg",
	DIALECT_VML: "vml",
	DIALECT_MIXEDHTML: "mixedHtml",
	DIALECT_PREFERHTML: "preferHtml",
	DIALECT_STRICTHTML: "strictHtml",
	NS_SVG: "http://www.w3.org/2000/svg",
	NS_XHTML: "http://www.w3.org/1999/xhtml",
	NS_XLINK: "http://www.w3.org/1999/xlink",
	SHADOWCOLOR: "gray",
	SVG_SHADOWTRANSFORM: "translate(2 3)",
	SHADOW_OFFSET_X: 2,
	SHADOW_OFFSET_Y: 3,
	SHADOW_OPACITY: 1,
	NODETYPE_ELEMENT: 1,
	NODETYPE_ATTRIBUTE: 2,
	NODETYPE_TEXT: 3,
	NODETYPE_CDATA: 4,
	NODETYPE_ENTITY_REFERENCE: 5,
	NODETYPE_ENTITY: 6,
	NODETYPE_PROCESSING_INSTRUCTION: 7,
	NODETYPE_COMMENT: 8,
	NODETYPE_DOCUMENT: 9,
	NODETYPE_DOCUMENTTYPE: 10,
	NODETYPE_DOCUMENT_FRAGMENT: 11,
	NODETYPE_NOTATION: 12,
	TOOLTIP_VERTICAL_OFFSET: 16,
	DEFAULT_VALID_COLOR: "#00FF00",
	DEFAULT_INVALID_COLOR: "#FF0000",
	HIGHLIGHT_STROKEWIDTH: 3,
	CURSOR_MOVABLE_VERTEX: "move",
	CURSOR_MOVABLE_EDGE: "move",
	CURSOR_MOVABLE_LABEL: "default",
	CURSOR_BEND_HANDLE: "pointer",
	CURSOR_CONNECT: "pointer",
	HIGHLIGHT_COLOR: "#00FF00",
	CONNECT_TARGET_COLOR: "#0000FF",
	INVALID_CONNECT_TARGET_COLOR: "#FF0000",
	DROP_TARGET_COLOR: "#0000FF",
	VALID_COLOR: "#00FF00",
	INVALID_COLOR: "#FF0000",
	EDGE_SELECTION_COLOR: "#00FF00",
	VERTEX_SELECTION_COLOR: "#00FF00",
	VERTEX_SELECTION_STROKEWIDTH: 1,
	EDGE_SELECTION_STROKEWIDTH: 1,
	VERTEX_SELECTION_DASHED: true,
	EDGE_SELECTION_DASHED: true,
	GUIDE_COLOR: "#FF0000",
	GUIDE_STROKEWIDTH: 1,
	OUTLINE_COLOR: "#0099FF",
	OUTLINE_STROKEWIDTH: (mxClient.IS_IE) ? 2 : 3,
	HANDLE_SIZE: 7,
	LABEL_HANDLE_SIZE: 4,
	HANDLE_FILLCOLOR: "#00FF00",
	HANDLE_STROKECOLOR: "black",
	LABEL_HANDLE_FILLCOLOR: "yellow",
	CONNECT_HANDLE_FILLCOLOR: "#0000FF",
	LOCKED_HANDLE_FILLCOLOR: "#FF0000",
	OUTLINE_HANDLE_FILLCOLOR: "#00FFFF",
	OUTLINE_HANDLE_STROKECOLOR: "#0033FF",
	DEFAULT_FONTFAMILY: "Arial,Helvetica",
	DEFAULT_FONTSIZE: 11,
	DEFAULT_STARTSIZE: 40,
	DEFAULT_MARKERSIZE: 6,
	DEFAULT_IMAGESIZE: 24,
	ENTITY_SEGMENT: 30,
	RECTANGLE_ROUNDING_FACTOR: 0.15,
	LINE_ARCSIZE: 20,
	ARROW_SPACING: 10,
	ARROW_WIDTH: 30,
	ARROW_SIZE: 30,
	PAGE_FORMAT_A4_PORTRAIT: new mxRectangle(0, 0, 826, 1169),
	PAGE_FORMAT_A4_LANDSCAPE: new mxRectangle(0, 0, 1169, 826),
	PAGE_FORMAT_LETTER_PORTRAIT: new mxRectangle(0, 0, 850, 1100),
	PAGE_FORMAT_LETTER_LANDSCAPE: new mxRectangle(0, 0, 1100, 850),
	NONE: "none",
	STYLE_PERIMETER: "perimeter",
	STYLE_SOURCE_PORT: "sourcePort",
	STYLE_TARGET_PORT: "targetPort",
	STYLE_PORT_CONSTRAINT: "portConstraint",
	STYLE_OPACITY: "opacity",
	STYLE_TEXT_OPACITY: "textOpacity",
	STYLE_OVERFLOW: "overflow",
	STYLE_ORTHOGONAL: "orthogonal",
	STYLE_EXIT_X: "exitX",
	STYLE_EXIT_Y: "exitY",
	STYLE_EXIT_PERIMETER: "exitPerimeter",
	STYLE_ENTRY_X: "entryX",
	STYLE_ENTRY_Y: "entryY",
	STYLE_ENTRY_PERIMETER: "entryPerimeter",
	STYLE_WHITE_SPACE: "whiteSpace",
	STYLE_ROTATION: "rotation",
	STYLE_FILLCOLOR: "fillColor",
	STYLE_GRADIENTCOLOR: "gradientColor",
	STYLE_GRADIENT_DIRECTION: "gradientDirection",
	STYLE_STROKECOLOR: "strokeColor",
	STYLE_SEPARATORCOLOR: "separatorColor",
	STYLE_STROKEWIDTH: "strokeWidth",
	STYLE_ALIGN: "align",
	STYLE_VERTICAL_ALIGN: "verticalAlign",
	STYLE_LABEL_POSITION: "labelPosition",
	STYLE_VERTICAL_LABEL_POSITION: "verticalLabelPosition",
	STYLE_IMAGE_ALIGN: "imageAlign",
	STYLE_IMAGE_VERTICAL_ALIGN: "imageVerticalAlign",
	STYLE_GLASS: "glass",
	STYLE_IMAGE: "image",
	STYLE_IMAGE_WIDTH: "imageWidth",
	STYLE_IMAGE_HEIGHT: "imageHeight",
	STYLE_IMAGE_BACKGROUND: "imageBackground",
	STYLE_IMAGE_BORDER: "imageBorder",
	STYLE_IMAGE_FLIPH: "imageFlipH",
	STYLE_IMAGE_FLIPV: "imageFlipV",
	STYLE_STENCIL_FLIPH: "stencilFlipH",
	STYLE_STENCIL_FLIPV: "stencilFlipV",
	STYLE_NOLABEL: "noLabel",
	STYLE_NOEDGESTYLE: "noEdgeStyle",
	STYLE_LABEL_BACKGROUNDCOLOR: "labelBackgroundColor",
	STYLE_LABEL_BORDERCOLOR: "labelBorderColor",
	STYLE_LABEL_PADDING: "labelPadding",
	STYLE_INDICATOR_SHAPE: "indicatorShape",
	STYLE_INDICATOR_IMAGE: "indicatorImage",
	STYLE_INDICATOR_COLOR: "indicatorColor",
	STYLE_INDICATOR_STROKECOLOR: "indicatorStrokeColor",
	STYLE_INDICATOR_GRADIENTCOLOR: "indicatorGradientColor",
	STYLE_INDICATOR_SPACING: "indicatorSpacing",
	STYLE_INDICATOR_WIDTH: "indicatorWidth",
	STYLE_INDICATOR_HEIGHT: "indicatorHeight",
	STYLE_INDICATOR_DIRECTION: "indicatorDirection",
	STYLE_SHADOW: "shadow",
	STYLE_SEGMENT: "segment",
	STYLE_ENDARROW: "endArrow",
	STYLE_STARTARROW: "startArrow",
	STYLE_ENDSIZE: "endSize",
	STYLE_STARTSIZE: "startSize",
	STYLE_ENDFILL: "endFill",
	STYLE_STARTFILL: "startFill",
	STYLE_DASHED: "dashed",
	STYLE_ROUNDED: "rounded",
	STYLE_ARCSIZE: "arcSize",
	STYLE_SMOOTH: "smooth",
	STYLE_SOURCE_PERIMETER_SPACING: "sourcePerimeterSpacing",
	STYLE_TARGET_PERIMETER_SPACING: "targetPerimeterSpacing",
	STYLE_PERIMETER_SPACING: "perimeterSpacing",
	STYLE_SPACING: "spacing",
	STYLE_SPACING_TOP: "spacingTop",
	STYLE_SPACING_LEFT: "spacingLeft",
	STYLE_SPACING_BOTTOM: "spacingBottom",
	STYLE_SPACING_RIGHT: "spacingRight",
	STYLE_HORIZONTAL: "horizontal",
	STYLE_DIRECTION: "direction",
	STYLE_ELBOW: "elbow",
	STYLE_FONTCOLOR: "fontColor",
	STYLE_FONTFAMILY: "fontFamily",
	STYLE_FONTSIZE: "fontSize",
	STYLE_FONTSTYLE: "fontStyle",
	STYLE_AUTOSIZE: "autosize",
	STYLE_FOLDABLE: "foldable",
	STYLE_EDITABLE: "editable",
	STYLE_BENDABLE: "bendable",
	STYLE_MOVABLE: "movable",
	STYLE_RESIZABLE: "resizable",
	STYLE_CLONEABLE: "cloneable",
	STYLE_DELETABLE: "deletable",
	STYLE_SHAPE: "shape",
	STYLE_EDGE: "edgeStyle",
	STYLE_LOOP: "loopStyle",
	STYLE_ROUTING_CENTER_X: "routingCenterX",
	STYLE_ROUTING_CENTER_Y: "routingCenterY",
	FONT_BOLD: 1,
	FONT_ITALIC: 2,
	FONT_UNDERLINE: 4,
	FONT_SHADOW: 8,
	SHAPE_RECTANGLE: "rectangle",
	SHAPE_ELLIPSE: "ellipse",
	SHAPE_DOUBLE_ELLIPSE: "doubleEllipse",
	SHAPE_RHOMBUS: "rhombus",
	SHAPE_LINE: "line",
	SHAPE_IMAGE: "image",
	SHAPE_ARROW: "arrow",
	SHAPE_LABEL: "label",
	SHAPE_CYLINDER: "cylinder",
	SHAPE_SWIMLANE: "swimlane",
	SHAPE_CONNECTOR: "connector",
	SHAPE_ACTOR: "actor",
	SHAPE_CLOUD: "cloud",
	SHAPE_TRIANGLE: "triangle",
	SHAPE_HEXAGON: "hexagon",
	ARROW_CLASSIC: "classic",
	ARROW_BLOCK: "block",
	ARROW_OPEN: "open",
	ARROW_OVAL: "oval",
	ARROW_DIAMOND: "diamond",
	ALIGN_LEFT: "left",
	ALIGN_CENTER: "center",
	ALIGN_RIGHT: "right",
	ALIGN_TOP: "top",
	ALIGN_MIDDLE: "middle",
	ALIGN_BOTTOM: "bottom",
	DIRECTION_NORTH: "north",
	DIRECTION_SOUTH: "south",
	DIRECTION_EAST: "east",
	DIRECTION_WEST: "west",
	DIRECTION_MASK_NONE: 0,
	DIRECTION_MASK_WEST: 1,
	DIRECTION_MASK_NORTH: 2,
	DIRECTION_MASK_SOUTH: 4,
	DIRECTION_MASK_EAST: 8,
	DIRECTION_MASK_ALL: 15,
	ELBOW_VERTICAL: "vertical",
	ELBOW_HORIZONTAL: "horizontal",
	EDGESTYLE_ELBOW: "elbowEdgeStyle",
	EDGESTYLE_ENTITY_RELATION: "entityRelationEdgeStyle",
	EDGESTYLE_LOOP: "loopEdgeStyle",
	EDGESTYLE_SIDETOSIDE: "sideToSideEdgeStyle",
	EDGESTYLE_TOPTOBOTTOM: "topToBottomEdgeStyle",
	EDGESTYLE_ORTHOGONAL: "orthogonalEdgeStyle",
	EDGESTYLE_SEGMENT: "segmentEdgeStyle",
	PERIMETER_ELLIPSE: "ellipsePerimeter",
	PERIMETER_RECTANGLE: "rectanglePerimeter",
	PERIMETER_RHOMBUS: "rhombusPerimeter",
	PERIMETER_TRIANGLE: "trianglePerimeter"
};
function mxEventObject(a) {
	this.name = a;
	this.properties = [];
	for (var b = 1; b < arguments.length; b += 2) {
		if (arguments[b + 1] != null) {
			this.properties[arguments[b]] = arguments[b + 1]
		}
	}
}
mxEventObject.prototype.name = null;
mxEventObject.prototype.properties = null;
mxEventObject.prototype.consumed = false;
mxEventObject.prototype.getName = function() {
	return this.name
};
mxEventObject.prototype.getProperties = function() {
	return this.properties
};
mxEventObject.prototype.getProperty = function(a) {
	return this.properties[a]
};
mxEventObject.prototype.isConsumed = function() {
	return this.consumed
};
mxEventObject.prototype.consume = function() {
	this.consumed = true
};
function mxMouseEvent(a, b) {
	this.evt = a;
	this.state = b
}
mxMouseEvent.prototype.consumed = false;
mxMouseEvent.prototype.evt = null;
mxMouseEvent.prototype.graphX = null;
mxMouseEvent.prototype.graphY = null;
mxMouseEvent.prototype.state = null;
mxMouseEvent.prototype.getEvent = function() {
	return this.evt
};
mxMouseEvent.prototype.getSource = function() {
	return mxEvent.getSource(this.evt)
};
mxMouseEvent.prototype.isSource = function(a) {
	if (a != null) {
		var b = this.getSource();
		while (b != null) {
			if (b == a.node) {
				return true
			}
			b = b.parentNode
		}
	}
	return false
};
mxMouseEvent.prototype.getX = function() {
	return mxEvent.getClientX(this.getEvent())
};
mxMouseEvent.prototype.getY = function() {
	return mxEvent.getClientY(this.getEvent())
};
mxMouseEvent.prototype.getGraphX = function() {
	return this.graphX
};
mxMouseEvent.prototype.getGraphY = function() {
	return this.graphY
};
mxMouseEvent.prototype.getState = function() {
	return this.state
};
mxMouseEvent.prototype.getCell = function() {
	var a = this.getState();
	if (a != null) {
		return a.cell
	}
	return null
};
mxMouseEvent.prototype.isPopupTrigger = function() {
	return mxEvent.isPopupTrigger(this.getEvent())
};
mxMouseEvent.prototype.isConsumed = function() {
	return this.consumed
};
mxMouseEvent.prototype.consume = function(a) {
	a = (a != null) ? a: true;
	if (a && this.evt.preventDefault) {
		this.evt.preventDefault()
	}
	this.evt.returnValue = false;
	this.consumed = true
};
function mxEventSource(a) {
	this.setEventSource(a)
}
mxEventSource.prototype.eventListeners = null;
mxEventSource.prototype.eventsEnabled = true;
mxEventSource.prototype.eventSource = null;
mxEventSource.prototype.isEventsEnabled = function() {
	return this.eventsEnabled
};
mxEventSource.prototype.setEventsEnabled = function(a) {
	this.eventsEnabled = a
};
mxEventSource.prototype.getEventSource = function() {
	return this.eventSource
};
mxEventSource.prototype.setEventSource = function(a) {
	this.eventSource = a
};
mxEventSource.prototype.addListener = function(b, a) {
	if (this.eventListeners == null) {
		this.eventListeners = []
	}
	this.eventListeners.push(b);
	this.eventListeners.push(a)
};
mxEventSource.prototype.removeListener = function(a) {
	if (this.eventListeners != null) {
		var b = 0;
		while (b < this.eventListeners.length) {
			if (this.eventListeners[b + 1] == a) {
				this.eventListeners.splice(b, 2)
			} else {
				b += 2
			}
		}
	}
};
mxEventSource.prototype.fireEvent = function(a, e) {
	if (this.eventListeners != null && this.isEventsEnabled()) {
		if (a == null) {
			a = new mxEventObject()
		}
		if (e == null) {
			e = this.getEventSource()
		}
		if (e == null) {
			e = this
		}
		var b = [e, a];
		for (var d = 0; d < this.eventListeners.length; d += 2) {
			var c = this.eventListeners[d];
			if (c == null || c == a.getName()) {
				this.eventListeners[d + 1].apply(this, b)
			}
		}
	}
};
var mxEvent = {
	objects: [],
	addListener: function() {
		var a = function(d, c, b) {
			if (d.mxListenerList == null) {
				d.mxListenerList = [];
				mxEvent.objects.push(d)
			}
			var e = {
				name: c,
				f: b
			};
			d.mxListenerList.push(e)
		};
		if (window.addEventListener) {
			return function(d, c, b) {
				d.addEventListener(c, b, false);
				a(d, c, b)
			}
		} else {
			return function(d, c, b) {
				d.attachEvent("on" + c, b);
				a(d, c, b)
			}
		}
	} (),
	removeListener: function() {
		var a = function(e, c, b) {
			if (e.mxListenerList != null) {
				var g = e.mxListenerList.length;
				for (var d = 0; d < g; d++) {
					var f = e.mxListenerList[d];
					if (f.f == b) {
						e.mxListenerList.splice(d, 1);
						break
					}
				}
				if (e.mxListenerList.length == 0) {
					e.mxListenerList = null
				}
			}
		};
		if (window.removeEventListener) {
			return function(d, c, b) {
				d.removeEventListener(c, b, false);
				a(d, c, b)
			}
		} else {
			return function(d, c, b) {
				d.detachEvent("on" + c, b);
				a(d, c, b)
			}
		}
	} (),
	removeAllListeners: function(a) {
		var c = a.mxListenerList;
		if (c != null) {
			while (c.length > 0) {
				var b = c[0];
				mxEvent.removeListener(a, b.name, b.f)
			}
		}
	},
	redirectMouseEvents: function(c, k, a, i, d, f, b) {
		var g = function(m) {
			return (typeof(a) == "function") ? a(m) : a
		};
		var h = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
		var e = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		var l = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
		mxEvent.addListener(c, h,
		function(m) {
			if (i != null) {
				i(m)
			} else {
				if (!mxEvent.isConsumed(m)) {
					k.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(m, g(m)))
				}
			}
		});
		mxEvent.addListener(c, e,
		function(m) {
			if (d != null) {
				d(m)
			} else {
				if (!mxEvent.isConsumed(m)) {
					k.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(m, g(m)))
				}
			}
		});
		mxEvent.addListener(c, l,
		function(m) {
			if (f != null) {
				f(m)
			} else {
				if (!mxEvent.isConsumed(m)) {
					k.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(m, g(m)))
				}
			}
		});
		mxEvent.addListener(c, "dblclick",
		function(m) {
			if (b != null) {
				b(m)
			} else {
				if (!mxEvent.isConsumed(m)) {
					var n = g(m);
					k.dblClick(m, (n != null) ? n.cell: null)
				}
			}
		})
	},
	release: function(d) {
		if (d != null) {
			mxEvent.removeAllListeners(d);
			var c = d.childNodes;
			if (c != null) {
				var a = c.length;
				for (var b = 0; b < a; b += 1) {
					mxEvent.release(c[b])
				}
			}
		}
	},
	addMouseWheelListener: function(a) {
		if (a != null) {
			var c = function(d) {
				if (d == null) {
					d = window.event
				}
				var e = 0;
				if (mxClient.IS_GC && !mxClient.IS_SF && !false && !mxClient.IS_GC) {
					e = -d.detail / 2
				} else {
					e = d.wheelDelta / 120
				}
				if (e != 0) {
					a(d, e > 0)
				}
			};
			if (!mxClient.IS_IE && !mxClient.IS_OP) {
				var b = (mxClient.IS_SF || mxClient.IS_GC) ? "mousewheel": "DOMMouseScroll";
				mxEvent.addListener(window, b, c)
			} else {
				mxEvent.addListener(document, "mousewheel", c)
			}
		}
	},
	disableContextMenu: function() {
		if (mxClient.IS_IE && document.documentMode != 9) {
			return function(a) {
				mxEvent.addListener(a, "contextmenu",
				function() {
					return false
				})
			}
		} else {
			return function(a) {
				a.setAttribute("oncontextmenu", "return false;")
			}
		}
	} (),
	getSource: function(a) {
		return (a.srcElement != null) ? a.srcElement: a.target
	},
	isConsumed: function(a) {
		return a.isConsumed != null && a.isConsumed
	},
	isLeftMouseButton: function(a) {
		return a.button == ((mxClient.IS_IE) ? 1 : 0)
	},
	isRightMouseButton: function(a) {
		return a.button == 2
	},
	isPopupTrigger: function(a) {
		return mxEvent.isRightMouseButton(a) || (mxEvent.isShiftDown(a) && !mxEvent.isControlDown(a))
	},
	isShiftDown: function(a) {
		return (a != null) ? a.shiftKey: false
	},
	isAltDown: function(a) {
		return (a != null) ? a.altKey: false
	},
	isControlDown: function(a) {
		return (a != null) ? a.ctrlKey: false
	},
	isMetaDown: function(a) {
		return (a != null) ? a.metaKey: false
	},
	getMainEvent: function(a) {
		if ((a.type == "touchstart" || a.type == "touchmove") && a.touches != null && a.touches[0] != null) {
			a = a.touches[0]
		} else {
			if (a.type == "touchend" && a.changedTouches != null && a.changedTouches[0] != null) {
				a = a.changedTouches[0]
			}
		}
		return a
	},
	getClientX: function(a) {
		return mxEvent.getMainEvent(a).clientX
	},
	getClientY: function(a) {
		return mxEvent.getMainEvent(a).clientY
	},
	consume: function(a, b) {
		if (b == null || b) {
			if (a.preventDefault) {
				a.stopPropagation();
				a.preventDefault()
			} else {
				a.cancelBubble = true
			}
		}
		a.isConsumed = true;
		a.returnValue = false
	},
	LABEL_HANDLE: -1,
	MOUSE_DOWN: "mouseDown",
	MOUSE_MOVE: "mouseMove",
	MOUSE_UP: "mouseUp",
	ACTIVATE: "activate",
	RESIZE_START: "resizeStart",
	RESIZE: "resize",
	RESIZE_END: "resizeEnd",
	MOVE_START: "moveStart",
	MOVE: "move",
	MOVE_END: "moveEnd",
	PAN_START: "panStart",
	PAN: "pan",
	PAN_END: "panEnd",
	MINIMIZE: "minimize",
	NORMALIZE: "normalize",
	MAXIMIZE: "maximize",
	HIDE: "hide",
	SHOW: "show",
	CLOSE: "close",
	DESTROY: "destroy",
	REFRESH: "refresh",
	SIZE: "size",
	SELECT: "select",
	FIRED: "fired",
	GET: "get",
	RECEIVE: "receive",
	CONNECT: "connect",
	DISCONNECT: "disconnect",
	SUSPEND: "suspend",
	RESUME: "resume",
	MARK: "mark",
	SESSION: "session",
	ROOT: "root",
	POST: "post",
	OPEN: "open",
	SAVE: "save",
	BEFORE_ADD_VERTEX: "beforeAddVertex",
	ADD_VERTEX: "addVertex",
	AFTER_ADD_VERTEX: "afterAddVertex",
	DONE: "done",
	EXECUTE: "execute",
	BEGIN_UPDATE: "beginUpdate",
	END_UPDATE: "endUpdate",
	BEFORE_UNDO: "beforeUndo",
	UNDO: "undo",
	REDO: "redo",
	CHANGE: "change",
	NOTIFY: "notify",
	LAYOUT_CELLS: "layoutCells",
	CLICK: "click",
	SCALE: "scale",
	TRANSLATE: "translate",
	SCALE_AND_TRANSLATE: "scaleAndTranslate",
	UP: "up",
	DOWN: "down",
	ADD: "add",
	CLEAR: "clear",
	ADD_CELLS: "addCells",
	CELLS_ADDED: "cellsAdded",
	MOVE_CELLS: "moveCells",
	CELLS_MOVED: "cellsMoved",
	RESIZE_CELLS: "resizeCells",
	CELLS_RESIZED: "cellsResized",
	TOGGLE_CELLS: "toggleCells",
	CELLS_TOGGLED: "cellsToggled",
	ORDER_CELLS: "orderCells",
	CELLS_ORDERED: "cellsOrdered",
	REMOVE_CELLS: "removeCells",
	CELLS_REMOVED: "cellsRemoved",
	GROUP_CELLS: "groupCells",
	UNGROUP_CELLS: "ungroupCells",
	REMOVE_CELLS_FROM_PARENT: "removeCellsFromParent",
	FOLD_CELLS: "foldCells",
	CELLS_FOLDED: "cellsFolded",
	ALIGN_CELLS: "alignCells",
	LABEL_CHANGED: "labelChanged",
	CONNECT_CELL: "connectCell",
	CELL_CONNECTED: "cellConnected",
	SPLIT_EDGE: "splitEdge",
	FLIP_EDGE: "flipEdge",
	START_EDITING: "startEditing",
	ADD_OVERLAY: "addOverlay",
	REMOVE_OVERLAY: "removeOverlay",
	UPDATE_CELL_SIZE: "updateCellSize",
	ESCAPE: "escape",
	CLICK: "click",
	DOUBLE_CLICK: "doubleClick"
};
function mxXmlRequest(b, d, f, c, e, a) {
	this.url = b;
	this.params = d;
	this.method = f || "POST";
	this.async = (c != null) ? c: true;
	this.username = e;
	this.password = a
}
mxXmlRequest.prototype.url = null;
mxXmlRequest.prototype.params = null;
mxXmlRequest.prototype.method = null;
mxXmlRequest.prototype.async = null;
mxXmlRequest.prototype.binary = false;
mxXmlRequest.prototype.username = null;
mxXmlRequest.prototype.password = null;
mxXmlRequest.prototype.request = null;
mxXmlRequest.prototype.isBinary = function() {
	return this.binary
};
mxXmlRequest.prototype.setBinary = function(a) {
	this.binary = a
};
mxXmlRequest.prototype.getText = function() {
	return this.request.responseText
};
mxXmlRequest.prototype.isReady = function() {
	return this.request.readyState == 4
};
mxXmlRequest.prototype.getDocumentElement = function() {
	var a = this.getXml();
	if (a != null) {
		return a.documentElement
	}
	return null
};
mxXmlRequest.prototype.getXml = function() {
	var a = this.request.responseXML;
	if (document.documentMode == 9 || a == null || a.documentElement == null) {
		a = mxUtils.parseXml(this.request.responseText)
	}
	return a
};
mxXmlRequest.prototype.getText = function() {
	return this.request.responseText
};
mxXmlRequest.prototype.getStatus = function() {
	return this.request.status
};
mxXmlRequest.prototype.create = function() {
	if (window.XMLHttpRequest) {
		return function() {
			var a = new XMLHttpRequest();
			if (this.isBinary() && a.overrideMimeType) {
				a.overrideMimeType("text/plain; charset=x-user-defined")
			}
			return a
		}
	} else {
		if (typeof(ActiveXObject) != "undefined") {
			return function() {
				return new ActiveXObject("Microsoft.XMLHTTP")
			}
		}
	}
} ();
mxXmlRequest.prototype.send = function(b, a) {
	this.request = this.create();
	if (this.request != null) {
		if (b != null) {
			this.request.onreadystatechange = mxUtils.bind(this,
			function() {
				if (this.isReady()) {
					b(this);
					this.onreadystatechaange = null
				}
			})
		}
		this.request.open(this.method, this.url, this.async, this.username, this.password);
		this.setRequestHeaders(this.request, this.params);
		this.request.send(this.params)
	}
};
mxXmlRequest.prototype.setRequestHeaders = function(a, b) {
	if (b != null) {
		a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	}
};
mxXmlRequest.prototype.simulate = function(m, g) {
	m = m || document;
	var d = null;
	if (m == document) {
		d = window.onbeforeunload;
		window.onbeforeunload = null
	}
	var b = m.createElement("form");
	b.setAttribute("method", this.method);
	b.setAttribute("action", this.url);
	if (g != null) {
		b.setAttribute("target", g)
	}
	b.style.display = "none";
	b.style.visibility = "hidden";
	var c = (this.params.indexOf("&") > 0) ? this.params.split("&") : this.params.split();
	for (var e = 0; e < c.length; e++) {
		var h = c[e].indexOf("=");
		if (h > 0) {
			var a = c[e].substring(0, h);
			var l = c[e].substring(h + 1);
			var k = m.createElement("textarea");
			k.setAttribute("name", a);
			l = l.replace(/\n/g, "&#xa;");
			var f = m.createTextNode(l);
			k.appendChild(f);
			b.appendChild(k)
		}
	}
	m.body.appendChild(b);
	b.submit();
	m.body.removeChild(b);
	if (d != null) {
		window.onbeforeunload = d
	}
};
var mxClipboard = {
	STEPSIZE: 10,
	insertCount: 1,
	cells: null,
	isEmpty: function() {
		return mxClipboard.cells == null
	},
	cut: function(b, a) {
		a = mxClipboard.copy(b, a);
		mxClipboard.insertCount = 0;
		mxClipboard.removeCells(b, a);
		return a
	},
	removeCells: function(b, a) {
		b.removeCells(a)
	},
	copy: function(c, b) {
		b = b || c.getSelectionCells();
		var a = c.getExportableCells(b);
		mxClipboard.insertCount = 1;
		mxClipboard.cells = c.cloneCells(a);
		return a
	},
	paste: function(c) {
		if (mxClipboard.cells != null) {
			var a = c.getImportableCells(mxClipboard.cells);
			var d = mxClipboard.insertCount * mxClipboard.STEPSIZE;
			var b = c.getDefaultParent();
			a = c.importCells(a, d, d, b);
			mxClipboard.insertCount++;
			c.setSelectionCells(a)
		}
	}
};
function mxWindow(g, e, h, f, b, i, c, k, d, a) {
	if (e != null) {
		c = (c != null) ? c: true;
		this.content = e;
		this.init(h, f, b, i, a);
		this.installMaximizeHandler();
		this.installMinimizeHandler();
		this.installCloseHandler();
		this.setMinimizable(c);
		this.setTitle(g);
		if (k == null || k) {
			this.installMoveHandler()
		}
		if (d != null && d.parentNode != null) {
			d.parentNode.replaceChild(this.div, d)
		} else {
			document.body.appendChild(this.div)
		}
	}
}
mxWindow.prototype = new mxEventSource();
mxWindow.prototype.constructor = mxWindow;
mxWindow.prototype.closeImage = mxClient.imageBasePath + "/close.gif";
mxWindow.prototype.minimizeImage = mxClient.imageBasePath + "/minimize.gif";
mxWindow.prototype.normalizeImage = mxClient.imageBasePath + "/normalize.gif";
mxWindow.prototype.maximizeImage = mxClient.imageBasePath + "/maximize.gif";
mxWindow.prototype.resizeImage = mxClient.imageBasePath + "/resize.gif";
mxWindow.prototype.visible = false;
mxWindow.prototype.content = false;
mxWindow.prototype.minimumSize = new mxRectangle(0, 0, 50, 40);
mxWindow.prototype.title = false;
mxWindow.prototype.content = false;
mxWindow.prototype.destroyOnClose = true;
mxWindow.prototype.init = function(h, g, b, i, a) {
	a = (a != null) ? a: "mxWindow";
	this.div = document.createElement("div");
	this.div.className = a;
	this.div.style.left = h + "px";
	this.div.style.top = g + "px";
	this.table = document.createElement("table");
	this.table.className = a;
	if (b != null) {
		if (!mxClient.IS_IE) {
			this.div.style.width = b + "px"
		}
		this.table.style.width = b + "px"
	}
	if (i != null) {
		if (!mxClient.IS_IE) {
			this.div.style.height = i + "px"
		}
		this.table.style.height = i + "px"
	}
	var c = document.createElement("tbody");
	var e = document.createElement("tr");
	this.title = document.createElement("td");
	this.title.className = a + "Title";
	e.appendChild(this.title);
	c.appendChild(e);
	e = document.createElement("tr");
	this.td = document.createElement("td");
	this.td.className = a + "Pane";
	this.contentWrapper = document.createElement("div");
	this.contentWrapper.className = a + "Pane";
	this.contentWrapper.style.width = "100%";
	this.contentWrapper.appendChild(this.content);
	if (mxClient.IS_IE || this.content.nodeName.toUpperCase() != "DIV") {
		this.contentWrapper.style.height = "100%"
	}
	this.td.appendChild(this.contentWrapper);
	e.appendChild(this.td);
	c.appendChild(e);
	this.table.appendChild(c);
	this.div.appendChild(this.table);
	var d = mxUtils.bind(this,
	function(k) {
		this.activate()
	});
	var f = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	mxEvent.addListener(this.title, f, d);
	mxEvent.addListener(this.table, f, d);
	this.hide()
};
mxWindow.prototype.setTitle = function(b) {
	var c = this.title.firstChild;
	while (c != null) {
		var a = c.nextSibling;
		if (c.nodeType == mxConstants.NODETYPE_TEXT) {
			c.parentNode.removeChild(c)
		}
		c = a
	}
	mxUtils.write(this.title, b || "")
};
mxWindow.prototype.setScrollable = function(a) {
	if (navigator.userAgent.indexOf("Presto/2.5") < 0) {
		if (a) {
			this.contentWrapper.style.overflow = "auto"
		} else {
			this.contentWrapper.style.overflow = "hidden"
		}
	}
};
mxWindow.prototype.activate = function() {
	if (mxWindow.activeWindow != this) {
		var d = mxUtils.getCurrentStyle(this.getElement());
		var b = (d != null) ? d.zIndex: 3;
		if (mxWindow.activeWindow) {
			var a = mxWindow.activeWindow.getElement();
			if (a != null && a.style != null) {
				a.style.zIndex = b
			}
		}
		var c = mxWindow.activeWindow;
		this.getElement().style.zIndex = parseInt(b) + 1;
		mxWindow.activeWindow = this;
		this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, "previousWindow", c))
	}
};
mxWindow.prototype.getElement = function() {
	return this.div
};
mxWindow.prototype.fit = function() {
	mxUtils.fit(this.div)
};
mxWindow.prototype.isResizable = function() {
	if (this.resize != null) {
		return this.resize.style.display != "none"
	}
	return false
};
mxWindow.prototype.setResizable = function(b) {
	if (b) {
		if (this.resize == null) {
			this.resize = document.createElement("img");
			this.resize.style.position = "absolute";
			this.resize.style.bottom = "2px";
			this.resize.style.right = "2px";
			this.resize.setAttribute("src", mxClient.imageBasePath + "/resize.gif");
			this.resize.style.cursor = "nw-resize";
			var c = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
			var d = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
			var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
			mxEvent.addListener(this.resize, c, mxUtils.bind(this,
			function(h) {
				this.activate();
				var g = mxEvent.getClientX(h);
				var f = mxEvent.getClientY(h);
				var l = this.div.offsetWidth;
				var e = this.div.offsetHeight;
				var k = mxUtils.bind(this,
				function(n) {
					var o = mxEvent.getClientX(n) - g;
					var m = mxEvent.getClientY(n) - f;
					this.setSize(l + o, e + m);
					this.fireEvent(new mxEventObject(mxEvent.RESIZE, "event", n));
					mxEvent.consume(n)
				});
				var i = mxUtils.bind(this,
				function(m) {
					mxEvent.removeListener(document, d, k);
					mxEvent.removeListener(document, a, i);
					this.fireEvent(new mxEventObject(mxEvent.RESIZE_END, "event", m));
					mxEvent.consume(m)
				});
				mxEvent.addListener(document, d, k);
				mxEvent.addListener(document, a, i);
				this.fireEvent(new mxEventObject(mxEvent.RESIZE_START, "event", h));
				mxEvent.consume(h)
			}));
			this.div.appendChild(this.resize)
		} else {
			this.resize.style.display = "inline"
		}
	} else {
		if (this.resize != null) {
			this.resize.style.display = "none"
		}
	}
};
mxWindow.prototype.setSize = function(b, a) {
	b = Math.max(this.minimumSize.width, b);
	a = Math.max(this.minimumSize.height, a);
	if (!mxClient.IS_IE) {
		this.div.style.width = b + "px";
		this.div.style.height = a + "px"
	}
	this.table.style.width = b + "px";
	this.table.style.height = a + "px";
	if (!mxClient.IS_IE) {
		this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + "px"
	}
};
mxWindow.prototype.setMinimizable = function(a) {
	this.minimize.style.display = (a) ? "": "none"
};
mxWindow.prototype.getMinimumSize = function() {
	return new mxRectangle(0, 0, 0, this.title.offsetHeight)
};
mxWindow.prototype.installMinimizeHandler = function() {
	this.minimize = document.createElement("img");
	this.minimize.setAttribute("src", this.minimizeImage);
	this.minimize.setAttribute("align", "right");
	this.minimize.setAttribute("title", "Minimize");
	this.minimize.style.cursor = "pointer";
	this.minimize.style.marginRight = "1px";
	this.minimize.style.display = "none";
	this.title.appendChild(this.minimize);
	var c = false;
	var d = null;
	var a = null;
	var b = mxUtils.bind(this,
	function(f) {
		this.activate();
		if (!c) {
			c = true;
			this.minimize.setAttribute("src", this.normalizeImage);
			this.minimize.setAttribute("title", "Normalize");
			this.contentWrapper.style.display = "none";
			d = this.maximize.style.display;
			this.maximize.style.display = "none";
			a = this.table.style.height;
			var g = this.getMinimumSize();
			if (g.height > 0) {
				if (!mxClient.IS_IE) {
					this.div.style.height = g.height + "px"
				}
				this.table.style.height = g.height + "px"
			}
			if (g.width > 0) {
				if (!mxClient.IS_IE) {
					this.div.style.width = g.width + "px"
				}
				this.table.style.width = g.width + "px"
			}
			if (this.resize != null) {
				this.resize.style.visibility = "hidden"
			}
			this.fireEvent(new mxEventObject(mxEvent.MINIMIZE, "event", f))
		} else {
			c = false;
			this.minimize.setAttribute("src", this.minimizeImage);
			this.minimize.setAttribute("title", "Minimize");
			this.contentWrapper.style.display = "";
			this.maximize.style.display = d;
			if (!mxClient.IS_IE) {
				this.div.style.height = a
			}
			this.table.style.height = a;
			if (this.resize != null) {
				this.resize.style.visibility = ""
			}
			this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, "event", f))
		}
		mxEvent.consume(f)
	});
	var e = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	mxEvent.addListener(this.minimize, e, b)
};
mxWindow.prototype.setMaximizable = function(a) {
	this.maximize.style.display = (a) ? "": "none"
};
mxWindow.prototype.installMaximizeHandler = function() {
	this.maximize = document.createElement("img");
	this.maximize.setAttribute("src", this.maximizeImage);
	this.maximize.setAttribute("align", "right");
	this.maximize.setAttribute("title", "Maximize");
	this.maximize.style.cursor = "default";
	this.maximize.style.marginLeft = "1px";
	this.maximize.style.cursor = "pointer";
	this.maximize.style.display = "none";
	this.title.appendChild(this.maximize);
	var d = false;
	var b = null;
	var g = null;
	var a = null;
	var e = null;
	var c = mxUtils.bind(this,
	function(h) {
		this.activate();
		if (this.maximize.style.display != "none") {
			if (!d) {
				d = true;
				this.maximize.setAttribute("src", this.normalizeImage);
				this.maximize.setAttribute("title", "Normalize");
				this.contentWrapper.style.display = "";
				this.minimize.style.visibility = "hidden";
				b = parseInt(this.div.style.left);
				g = parseInt(this.div.style.top);
				a = this.table.style.height;
				e = this.table.style.width;
				this.div.style.left = "0px";
				this.div.style.top = "0px";
				if (!mxClient.IS_IE) {
					this.div.style.height = (document.body.clientHeight - 2) + "px";
					this.div.style.width = (document.body.clientWidth - 2) + "px"
				}
				this.table.style.width = (document.body.clientWidth - 2) + "px";
				this.table.style.height = (document.body.clientHeight - 2) + "px";
				if (this.resize != null) {
					this.resize.style.visibility = "hidden"
				}
				if (!mxClient.IS_IE) {
					var i = mxUtils.getCurrentStyle(this.contentWrapper);
					if (i.overflow == "auto" || this.resize != null) {
						this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + "px"
					}
				}
				this.fireEvent(new mxEventObject(mxEvent.MAXIMIZE, "event", h))
			} else {
				d = false;
				this.maximize.setAttribute("src", this.maximizeImage);
				this.maximize.setAttribute("title", "Maximize");
				this.contentWrapper.style.display = "";
				this.minimize.style.visibility = "";
				this.div.style.left = b + "px";
				this.div.style.top = g + "px";
				if (!mxClient.IS_IE) {
					this.div.style.height = a;
					this.div.style.width = e;
					var i = mxUtils.getCurrentStyle(this.contentWrapper);
					if (i.overflow == "auto" || this.resize != null) {
						this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + "px"
					}
				}
				this.table.style.height = a;
				this.table.style.width = e;
				if (this.resize != null) {
					this.resize.style.visibility = ""
				}
				this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, "event", h))
			}
			mxEvent.consume(h)
		}
	});
	var f = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	mxEvent.addListener(this.maximize, f, c);
	mxEvent.addListener(this.title, "dblclick", c)
};
mxWindow.prototype.installMoveHandler = function() {
	this.title.style.cursor = "move";
	var b = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var c = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
	var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
	mxEvent.addListener(this.title, b, mxUtils.bind(this,
	function(g) {
		var f = mxEvent.getClientX(g);
		var e = mxEvent.getClientY(g);
		var d = this.getX();
		var k = this.getY();
		var i = mxUtils.bind(this,
		function(m) {
			var n = mxEvent.getClientX(m) - f;
			var l = mxEvent.getClientY(m) - e;
			this.setLocation(d + n, k + l);
			this.fireEvent(new mxEventObject(mxEvent.MOVE, "event", m));
			mxEvent.consume(m)
		});
		var h = mxUtils.bind(this,
		function(l) {
			mxEvent.removeListener(document, c, i);
			mxEvent.removeListener(document, a, h);
			this.fireEvent(new mxEventObject(mxEvent.MOVE_END, "event", l));
			mxEvent.consume(l)
		});
		mxEvent.addListener(document, c, i);
		mxEvent.addListener(document, a, h);
		this.fireEvent(new mxEventObject(mxEvent.MOVE_START, "event", g));
		mxEvent.consume(g)
	}))
};
mxWindow.prototype.setLocation = function(a, b) {
	this.div.style.left = a + "px";
	this.div.style.top = b + "px"
};
mxWindow.prototype.getX = function() {
	return parseInt(this.div.style.left)
};
mxWindow.prototype.getY = function() {
	return parseInt(this.div.style.top)
};
mxWindow.prototype.installCloseHandler = function() {
	this.closeImg = document.createElement("img");
	this.closeImg.setAttribute("src", this.closeImage);
	this.closeImg.setAttribute("align", "right");
	this.closeImg.setAttribute("title", "Close");
	this.closeImg.style.marginLeft = "2px";
	this.closeImg.style.cursor = "pointer";
	this.closeImg.style.display = "none";
	this.title.insertBefore(this.closeImg, this.title.firstChild);
	var a = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	mxEvent.addListener(this.closeImg, a, mxUtils.bind(this,
	function(b) {
		this.fireEvent(new mxEventObject(mxEvent.CLOSE, "event", b));
		if (this.destroyOnClose) {
			this.destroy()
		} else {
			this.setVisible(false)
		}
		mxEvent.consume(b)
	}))
};
mxWindow.prototype.setImage = function(a) {
	this.image = document.createElement("img");
	this.image.setAttribute("src", a);
	this.image.setAttribute("align", "left");
	this.image.style.marginRight = "4px";
	this.image.style.marginLeft = "0px";
	this.image.style.marginTop = "-2px";
	this.title.insertBefore(this.image, this.title.firstChild)
};
mxWindow.prototype.setClosable = function(a) {
	this.closeImg.style.display = (a) ? "": "none"
};
mxWindow.prototype.isVisible = function() {
	if (this.div != null) {
		return this.div.style.visibility != "hidden"
	}
	return false
};
mxWindow.prototype.setVisible = function(a) {
	if (this.div != null && this.isVisible() != a) {
		if (a) {
			this.show()
		} else {
			this.hide()
		}
	}
};
mxWindow.prototype.show = function() {
	this.div.style.visibility = "";
	this.activate();
	var a = mxUtils.getCurrentStyle(this.contentWrapper);
	if (!mxClient.IS_IE && (a.overflow == "auto" || this.resize != null)) {
		this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + "px"
	}
	this.fireEvent(new mxEventObject(mxEvent.SHOW))
};
mxWindow.prototype.hide = function() {
	this.div.style.visibility = "hidden";
	this.fireEvent(new mxEventObject(mxEvent.HIDE))
};
mxWindow.prototype.destroy = function() {
	this.fireEvent(new mxEventObject(mxEvent.DESTROY));
	if (this.div != null) {
		mxEvent.release(this.div);
		this.div.parentNode.removeChild(this.div);
		this.div = null
	}
	this.title = null;
	this.content = null;
	this.contentWrapper = null
};
function mxForm(a) {
	this.table = document.createElement("table");
	this.table.className = a;
	this.body = document.createElement("tbody");
	this.table.appendChild(this.body)
}
mxForm.prototype.table = null;
mxForm.prototype.body = false;
mxForm.prototype.getTable = function() {
	return this.table
};
mxForm.prototype.addButtons = function(c, e) {
	var b = document.createElement("tr");
	var d = document.createElement("td");
	b.appendChild(d);
	d = document.createElement("td");
	var a = document.createElement("button");
	mxUtils.write(a, mxResources.get("ok") || "OK");
	d.appendChild(a);
	mxEvent.addListener(a, "click",
	function() {
		c()
	});
	a = document.createElement("button");
	mxUtils.write(a, mxResources.get("cancel") || "Cancel");
	d.appendChild(a);
	mxEvent.addListener(a, "click",
	function() {
		e()
	});
	b.appendChild(d);
	this.body.appendChild(b)
};
mxForm.prototype.addText = function(b, c) {
	var a = document.createElement("input");
	a.setAttribute("type", "text");
	a.value = c;
	return this.addField(b, a)
};
mxForm.prototype.addCheckbox = function(b, c) {
	var a = document.createElement("input");
	a.setAttribute("type", "checkbox");
	this.addField(b, a);
	if (c) {
		a.checked = true
	}
	return a
};
mxForm.prototype.addTextarea = function(b, d, c) {
	var a = document.createElement("textarea");
	if (mxClient.IS_IE || mxClient.IS_OP) {
		c--
	}
	a.setAttribute("rows", c || 2);
	a.value = d;
	return this.addField(b, a)
};
mxForm.prototype.addCombo = function(b, d, c) {
	var a = document.createElement("select");
	if (c != null) {
		a.setAttribute("size", c)
	}
	if (d) {
		a.setAttribute("multiple", "true")
	}
	return this.addField(b, a)
};
mxForm.prototype.addOption = function(e, b, d, a) {
	var c = document.createElement("option");
	mxUtils.writeln(c, b);
	c.setAttribute("value", d);
	if (a) {
		c.setAttribute("selected", a)
	}
	e.appendChild(c)
};
mxForm.prototype.addField = function(b, a) {
	var c = document.createElement("tr");
	var d = document.createElement("td");
	mxUtils.write(d, b);
	c.appendChild(d);
	d = document.createElement("td");
	d.appendChild(a);
	c.appendChild(d);
	this.body.appendChild(c);
	return a
};
function mxImage(c, b, a) {
	this.src = c;
	this.width = b;
	this.height = a
}
mxImage.prototype.src = null;
mxImage.prototype.width = null;
mxImage.prototype.height = null;
function mxDivResizer(c, a) {
	if (c.nodeName.toLowerCase() == "div") {
		if (a == null) {
			a = window
		}
		this.div = c;
		var b = mxUtils.getCurrentStyle(c);
		if (b != null) {
			this.resizeWidth = b.width == "auto";
			this.resizeHeight = b.height == "auto"
		}
		mxEvent.addListener(a, "resize", mxUtils.bind(this,
		function(d) {
			if (!this.handlingResize) {
				this.handlingResize = true;
				this.resize();
				this.handlingResize = false
			}
		}));
		this.resize()
	}
}
mxDivResizer.prototype.resizeWidth = true;
mxDivResizer.prototype.resizeHeight = true;
mxDivResizer.prototype.handlingResize = false;
mxDivResizer.prototype.resize = function() {
	var d = this.getDocumentWidth();
	var f = this.getDocumentHeight();
	var c = parseInt(this.div.style.left);
	var g = parseInt(this.div.style.right);
	var e = parseInt(this.div.style.top);
	var a = parseInt(this.div.style.bottom);
	if (this.resizeWidth && !isNaN(c) && !isNaN(g) && c >= 0 && g >= 0 && d - g - c > 0) {
		this.div.style.width = (d - g - c) + "px"
	}
	if (this.resizeHeight && !isNaN(e) && !isNaN(a) && e >= 0 && a >= 0 && f - e - a > 0) {
		this.div.style.height = (f - e - a) + "px"
	}
};
mxDivResizer.prototype.getDocumentWidth = function() {
	return document.body.clientWidth
};
mxDivResizer.prototype.getDocumentHeight = function() {
	return document.body.clientHeight
};
function mxDragSource(b, a) {
	this.element = b;
	this.dropHandler = a;
	var c = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	mxEvent.addListener(b, c, mxUtils.bind(this, this.mouseDown))
}
mxDragSource.prototype.element = null;
mxDragSource.prototype.dropHandler = null;
mxDragSource.prototype.dragOffset = null;
mxDragSource.prototype.dragElement = null;
mxDragSource.prototype.previewElement = null;
mxDragSource.prototype.enabled = true;
mxDragSource.prototype.currentGraph = null;
mxDragSource.prototype.currentDropTarget = null;
mxDragSource.prototype.currentPoint = null;
mxDragSource.prototype.currentGuide = null;
mxDragSource.prototype.currentHighlight = null;
mxDragSource.prototype.autoscroll = true;
mxDragSource.prototype.guidesEnabled = true;
mxDragSource.prototype.gridEnabled = true;
mxDragSource.prototype.highlightDropTargets = true;
mxDragSource.prototype.isEnabled = function() {
	return this.enabled
};
mxDragSource.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxDragSource.prototype.isGuidesEnabled = function() {
	return this.guidesEnabled
};
mxDragSource.prototype.setGuidesEnabled = function(a) {
	this.guidesEnabled = a
};
mxDragSource.prototype.isGridEnabled = function() {
	return this.gridEnabled
};
mxDragSource.prototype.setGridEnabled = function(a) {
	this.gridEnabled = a
};
mxDragSource.prototype.getGraphForEvent = function(a) {
	return null
};
mxDragSource.prototype.getGraphForEvent = function(a) {
	return null
};
mxDragSource.prototype.getDropTarget = function(b, a, c) {
	return b.getCellAt(a, c)
};
mxDragSource.prototype.createDragElement = function(a) {
	return this.element.cloneNode(true)
};
mxDragSource.prototype.createPreviewElement = function(a) {
	return null
};
mxDragSource.prototype.mouseDown = function(b) {
	if (this.enabled && !mxEvent.isConsumed(b)) {
		this.startDrag(b);
		var c = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
		this.mouseMoveHandler = mxUtils.bind(this, this.mouseMove);
		mxEvent.addListener(document, c, this.mouseMoveHandler);
		this.mouseUpHandler = mxUtils.bind(this, this.mouseUp);
		mxEvent.addListener(document, a, this.mouseUpHandler);
		mxEvent.consume(b)
	}
};
mxDragSource.prototype.startDrag = function(a) {
	this.dragElement = this.createDragElement(a);
	this.dragElement.style.position = "absolute";
	this.dragElement.style.zIndex = "3";
	mxUtils.setOpacity(this.dragElement, 70)
};
mxDragSource.prototype.stopDrag = function(a) {
	if (this.dragElement != null) {
		if (this.dragElement.parentNode != null) {
			this.dragElement.parentNode.removeChild(this.dragElement)
		}
		this.dragElement = null
	}
};
mxDragSource.prototype.graphContainsEvent = function(d, b) {
	var a = mxEvent.getClientX(b);
	var f = mxEvent.getClientY(b);
	var e = mxUtils.getOffset(d.container);
	var c = mxUtils.getScrollOrigin();
	return a >= e.x - c.x && f >= e.y - c.y && a <= e.x - c.x + d.container.offsetWidth && f <= e.y - c.y + d.container.offsetHeight
};
mxDragSource.prototype.mouseMove = function(b) {
	var c = this.getGraphForEvent(b);
	if (c != null && !this.graphContainsEvent(c, b)) {
		c = null
	}
	if (c != this.currentGraph) {
		if (this.currentGraph != null) {
			this.dragExit(this.currentGraph)
		}
		this.currentGraph = c;
		if (this.currentGraph != null) {
			this.dragEnter(this.currentGraph)
		}
	}
	if (this.currentGraph != null) {
		this.dragOver(this.currentGraph, b)
	}
	if (this.dragElement != null && (this.previewElement == null || this.previewElement.style.visibility != "visible")) {
		var a = mxEvent.getClientX(b);
		var d = mxEvent.getClientY(b);
		if (this.dragElement.parentNode == null) {
			document.body.appendChild(this.dragElement)
		}
		this.dragElement.style.visibility = "visible";
		if (this.dragOffset != null) {
			a += this.dragOffset.x;
			d += this.dragOffset.y
		}
		a += document.body.scrollLeft || document.documentElement.scrollLeft;
		d += document.body.scrollTop || document.documentElement.scrollTop;
		this.dragElement.style.left = a + "px";
		this.dragElement.style.top = d + "px"
	} else {
		if (this.dragElement != null) {
			this.dragElement.style.visibility = "hidden"
		}
	}
	mxEvent.consume(b)
};
mxDragSource.prototype.mouseUp = function(c) {
	if (this.currentGraph != null) {
		if (this.currentPoint != null && (this.previewElement == null || this.previewElement.style.visibility != "hidden")) {
			var f = this.currentGraph.view.scale;
			var d = this.currentGraph.view.translate;
			var a = this.currentPoint.x / f - d.x;
			var g = this.currentPoint.y / f - d.y;
			this.drop(this.currentGraph, c, this.currentDropTarget, a, g)
		}
		this.dragExit(this.currentGraph)
	}
	this.stopDrag(c);
	this.currentGraph = null;
	if (this.mouseMoveHandler != null) {
		var e = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		mxEvent.removeListener(document, e, this.mouseMoveHandler);
		this.mouseMoveHandler = null
	}
	if (this.mouseUpHandler != null) {
		var b = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
		mxEvent.removeListener(document, b, this.mouseUpHandler);
		this.mouseUpHandler = null
	}
	mxEvent.consume(c)
};
mxDragSource.prototype.dragEnter = function(a) {
	a.isMouseDown = true;
	this.previewElement = this.createPreviewElement(a);
	if (this.isGuidesEnabled() && this.previewElement != null) {
		this.currentGuide = new mxGuide(a, a.graphHandler.getGuideStates())
	}
	if (this.highlightDropTargets) {
		this.currentHighlight = new mxCellHighlight(a, mxConstants.DROP_TARGET_COLOR)
	}
};
mxDragSource.prototype.dragExit = function(a) {
	this.currentDropTarget = null;
	this.currentPoint = null;
	a.isMouseDown = false;
	if (this.previewElement != null) {
		if (this.previewElement.parentNode != null) {
			this.previewElement.parentNode.removeChild(this.previewElement)
		}
		this.previewElement = null
	}
	if (this.currentGuide != null) {
		this.currentGuide.destroy();
		this.currentGuide = null
	}
	if (this.currentHighlight != null) {
		this.currentHighlight.destroy();
		this.currentHighlight = null
	}
};
mxDragSource.prototype.dragOver = function(r, q) {
	var f = mxUtils.getOffset(r.container);
	var o = mxUtils.getScrollOrigin(r.container);
	var m = mxEvent.getClientX(q) - f.x + o.x;
	var l = mxEvent.getClientY(q) - f.y + o.y;
	if (r.autoScroll && (this.autoscroll == null || this.autoscroll)) {
		r.scrollPointToVisible(m, l, r.autoExtend)
	}
	if (this.currentHighlight != null && r.isDropEnabled()) {
		this.currentDropTarget = this.getDropTarget(r, m, l);
		var b = r.getView().getState(this.currentDropTarget);
		this.currentHighlight.highlight(b)
	}
	if (this.previewElement != null) {
		if (this.previewElement.parentNode == null) {
			r.container.appendChild(this.previewElement);
			this.previewElement.style.zIndex = "3";
			this.previewElement.style.position = "absolute"
		}
		var i = this.isGridEnabled() && r.isGridEnabledEvent(q);
		var e = true;
		if (this.currentGuide != null && this.currentGuide.isEnabledForEvent(q)) {
			var n = parseInt(this.previewElement.style.width);
			var g = parseInt(this.previewElement.style.height);
			var a = new mxRectangle(0, 0, n, g);
			var p = new mxPoint(m, l);
			p = this.currentGuide.move(a, p, i);
			e = false;
			m = p.x;
			l = p.y
		} else {
			if (i) {
				var d = r.view.scale;
				var k = r.view.translate;
				var c = r.gridSize / 2;
				m = (r.snap(m / d - k.x - c) + k.x) * d;
				l = (r.snap(l / d - k.y - c) + k.y) * d
			}
		}
		if (this.currentGuide != null && e) {
			this.currentGuide.hide()
		}
		if (this.previewOffset != null) {
			m += this.previewOffset.x;
			l += this.previewOffset.y
		}
		this.previewElement.style.left = m + "px";
		this.previewElement.style.top = l + "px";
		this.previewElement.style.visibility = "visible"
	}
	this.currentPoint = new mxPoint(m, l)
};
mxDragSource.prototype.drop = function(c, b, e, a, d) {
	this.dropHandler(c, b, e, a, d);
	c.container.focus()
};
function mxToolbar(a) {
	this.container = a
}
mxToolbar.prototype = new mxEventSource();
mxToolbar.prototype.constructor = mxToolbar;
mxToolbar.prototype.container = null;
mxToolbar.prototype.enabled = true;
mxToolbar.prototype.noReset = false;
mxToolbar.prototype.updateDefaultMode = true;
mxToolbar.prototype.addItem = function(k, i, a, e, b, c) {
	var f = document.createElement((i != null) ? "img": "button");
	var d = b || ((c != null) ? "mxToolbarMode": "mxToolbarItem");
	f.className = d;
	f.setAttribute("src", i);
	if (k != null) {
		if (i != null) {
			f.setAttribute("title", k)
		} else {
			mxUtils.write(f, k)
		}
	}
	this.container.appendChild(f);
	if (a != null) {
		mxEvent.addListener(f, (mxClient.IS_TOUCH) ? "touchend": "click", a)
	}
	var h = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var l = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
	mxEvent.addListener(f, h, mxUtils.bind(this,
	function(n) {
		if (e != null) {
			f.setAttribute("src", e)
		} else {
			f.style.backgroundColor = "gray"
		}
		if (c != null) {
			if (this.menu == null) {
				this.menu = new mxPopupMenu();
				this.menu.init()
			}
			var o = this.currentImg;
			if (this.menu.isMenuShowing()) {
				this.menu.hideMenu()
			}
			if (o != f) {
				this.currentImg = f;
				this.menu.factoryMethod = c;
				var m = new mxPoint(f.offsetLeft, f.offsetTop + f.offsetHeight);
				this.menu.popup(m.x, m.y, null, n);
				if (this.menu.isMenuShowing()) {
					f.className = d + "Selected";
					this.menu.hideMenu = function() {
						mxPopupMenu.prototype.hideMenu.apply(this);
						f.className = d;
						this.currentImg = null
					}
				}
			}
		}
	}));
	var g = mxUtils.bind(this,
	function(m) {
		if (e != null) {
			f.setAttribute("src", i)
		} else {
			f.style.backgroundColor = ""
		}
	});
	mxEvent.addListener(f, l, g);
	mxEvent.addListener(f, "mouseout", g);
	return f
};
mxToolbar.prototype.addCombo = function(b) {
	var c = document.createElement("div");
	c.style.display = "inline";
	c.className = "mxToolbarComboContainer";
	var a = document.createElement("select");
	a.className = b || "mxToolbarCombo";
	c.appendChild(a);
	this.container.appendChild(c);
	return a
};
mxToolbar.prototype.addActionCombo = function(c, b) {
	var a = document.createElement("select");
	a.className = b || "mxToolbarCombo";
	this.addOption(a, c, null);
	mxEvent.addListener(a, "change",
	function(d) {
		var e = a.options[a.selectedIndex];
		a.selectedIndex = 0;
		if (e.funct != null) {
			e.funct(d)
		}
	});
	this.container.appendChild(a);
	return a
};
mxToolbar.prototype.addOption = function(c, d, b) {
	var a = document.createElement("option");
	mxUtils.writeln(a, d);
	if (typeof(b) == "function") {
		a.funct = b
	} else {
		a.setAttribute("value", b)
	}
	c.appendChild(a);
	return a
};
mxToolbar.prototype.addSwitchMode = function(g, f, a, e, d) {
	var b = document.createElement("img");
	b.initialClassName = d || "mxToolbarMode";
	b.className = b.initialClassName;
	b.setAttribute("src", f);
	b.altIcon = e;
	if (g != null) {
		b.setAttribute("title", g)
	}
	mxEvent.addListener(b, "click", mxUtils.bind(this,
	function(h) {
		var i = this.selectedMode.altIcon;
		if (i != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute("src");
			this.selectedMode.setAttribute("src", i)
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName
		}
		if (this.updateDefaultMode) {
			this.defaultMode = b
		}
		this.selectedMode = b;
		var i = b.altIcon;
		if (i != null) {
			b.altIcon = b.getAttribute("src");
			b.setAttribute("src", i)
		} else {
			b.className = b.initialClassName + "Selected"
		}
		this.fireEvent(new mxEventObject(mxEvent.SELECT));
		a()
	}));
	this.container.appendChild(b);
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
		a()
	}
	return b
};
mxToolbar.prototype.addMode = function(g, f, a, e, d) {
	var b = document.createElement((f != null) ? "img": "button");
	b.initialClassName = d || "mxToolbarMode";
	b.className = b.initialClassName;
	b.setAttribute("src", f);
	b.altIcon = e;
	if (g != null) {
		b.setAttribute("title", g)
	}
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
mxToolbar.prototype.selectMode = function(c, a) {
	if (this.selectedMode != c) {
		var b = this.selectedMode.altIcon;
		if (b != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute("src");
			this.selectedMode.setAttribute("src", b)
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName
		}
		this.selectedMode = c;
		var b = this.selectedMode.altIcon;
		if (b != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute("src");
			this.selectedMode.setAttribute("src", b)
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName + "Selected"
		}
		this.fireEvent(new mxEventObject(mxEvent.SELECT, "function", a))
	}
};
mxToolbar.prototype.resetMode = function(a) {
	if ((a || !this.noReset) && this.selectedMode != this.defaultMode) {
		this.selectMode(this.defaultMode, null)
	}
};
mxToolbar.prototype.addSeparator = function(a) {
	return this.addItem(null, a, null)
};
mxToolbar.prototype.addBreak = function() {
	mxUtils.br(this.container)
};
mxToolbar.prototype.addLine = function() {
	var a = document.createElement("hr");
	a.style.marginRight = "6px";
	a.setAttribute("size", "1");
	this.container.appendChild(a)
};
mxToolbar.prototype.destroy = function() {
	mxEvent.release(this.container);
	this.container = null;
	this.defaultMode = null;
	this.selectedMode = null;
	if (this.menu != null) {
		this.menu.destroy()
	}
};
function mxSession(c, b, a, d) {
	this.model = c;
	this.urlInit = b;
	this.urlPoll = a;
	this.urlNotify = d;
	if (c != null) {
		this.codec = new mxCodec();
		this.codec.lookup = function(e) {
			return c.getCell(e)
		}
	}
	c.addListener(mxEvent.NOTIFY, mxUtils.bind(this,
	function(f, e) {
		var g = e.getProperty("edit");
		if (g != null && this.debug || (this.connected && !this.suspended)) {
			this.notify("<edit>" + this.encodeChanges(g.changes, g.undone) + "</edit>")
		}
	}))
}
mxSession.prototype = new mxEventSource();
mxSession.prototype.constructor = mxSession;
mxSession.prototype.model = null;
mxSession.prototype.urlInit = null;
mxSession.prototype.urlPoll = null;
mxSession.prototype.urlNotify = null;
mxSession.prototype.codec = null;
mxSession.prototype.linefeed = "&#xa;";
mxSession.prototype.escapePostData = true;
mxSession.prototype.significantRemoteChanges = true;
mxSession.prototype.sent = 0;
mxSession.prototype.received = 0;
mxSession.prototype.debug = false;
mxSession.prototype.connected = false;
mxSession.prototype.suspended = false;
mxSession.prototype.polling = false;
mxSession.prototype.start = function() {
	if (this.debug) {
		this.connected = true;
		this.fireEvent(new mxEventObject(mxEvent.CONNECT))
	} else {
		if (!this.connected) {
			this.get(this.urlInit, mxUtils.bind(this,
			function(a) {
				this.connected = true;
				this.fireEvent(new mxEventObject(mxEvent.CONNECT));
				this.poll()
			}))
		}
	}
};
mxSession.prototype.suspend = function() {
	if (this.connected && !this.suspended) {
		this.suspended = true;
		this.fireEvent(new mxEventObject(mxEvent.SUSPEND))
	}
};
mxSession.prototype.resume = function(b, a, c) {
	if (this.connected && this.suspended) {
		this.suspended = false;
		this.fireEvent(new mxEventObject(mxEvent.RESUME));
		if (!this.polling) {
			this.poll()
		}
	}
};
mxSession.prototype.stop = function(a) {
	if (this.connected) {
		this.connected = false
	}
	this.fireEvent(new mxEventObject(mxEvent.DISCONNECT, "reason", a))
};
mxSession.prototype.poll = function() {
	if (this.connected && !this.suspended && this.urlPoll != null) {
		this.polling = true;
		this.get(this.urlPoll, mxUtils.bind(this,
		function() {
			this.poll()
		}))
	} else {
		this.polling = false
	}
};
mxSession.prototype.notify = function(a, b, c) {
	if (a != null && a.length > 0) {
		if (this.urlNotify != null) {
			if (this.debug) {
				mxLog.show();
				mxLog.debug("mxSession.notify: " + this.urlNotify + " xml=" + a)
			} else {
				a = "<message><delta>" + a + "</delta></message>";
				if (this.escapePostData) {
					a = encodeURIComponent(a)
				}
				mxUtils.post(this.urlNotify, "xml=" + a, b, c)
			}
		}
		this.sent += a.length;
		this.fireEvent(new mxEventObject(mxEvent.NOTIFY, "url", this.urlNotify, "xml", a))
	}
};
mxSession.prototype.get = function(b, c, e) {
	if (typeof(mxUtils) != "undefined") {
		var a = mxUtils.bind(this,
		function(f) {
			if (e != null) {
				e(f)
			} else {
				this.stop(f)
			}
		});
		var d = mxUtils.get(b, mxUtils.bind(this,
		function(g) {
			if (typeof(mxUtils) != "undefined") {
				if (g.isReady() && g.getStatus() != 404) {
					this.received += g.getText().length;
					this.fireEvent(new mxEventObject(mxEvent.GET, "url", b, "request", g));
					if (this.isValidResponse(g)) {
						if (g.getText().length > 0) {
							var f = g.getDocumentElement();
							if (f == null) {
								a("Invalid response: " + g.getText())
							} else {
								this.receive(f)
							}
						}
						if (c != null) {
							c(g)
						}
					}
				} else {
					a("Response not ready")
				}
			}
		}),
		function(f) {
			a("Transmission error")
		})
	}
};
mxSession.prototype.isValidResponse = function(a) {
	return a.getText().indexOf("<?php") < 0
};
mxSession.prototype.encodeChanges = function(c, g) {
	var a = "";
	var e = (g) ? -1 : 1;
	var f = (g) ? c.length - 1 : 0;
	for (var b = f; b >= 0 && b < c.length; b += e) {
		var d = this.codec.encode(c[b]);
		a += mxUtils.getXml(d, this.linefeed)
	}
	return a
};
mxSession.prototype.receive = function(c) {
	if (c != null && c.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var b = c.getAttribute("namespace");
		if (b != null) {
			this.model.prefix = b + "-"
		}
		var d = c.firstChild;
		while (d != null) {
			var a = d.nodeName.toLowerCase();
			if (a == "state") {
				this.processState(d)
			} else {
				if (a == "delta") {
					this.processDelta(d)
				}
			}
			d = d.nextSibling
		}
		this.fireEvent(new mxEventObject(mxEvent.RECEIVE, "node", c))
	}
};
mxSession.prototype.processState = function(a) {
	var b = new mxCodec(a.ownerDocument);
	b.decode(a.firstChild, this.model)
};
mxSession.prototype.processDelta = function(b) {
	var a = b.firstChild;
	while (a != null) {
		if (a.nodeName == "edit") {
			this.processEdit(a)
		}
		a = a.nextSibling
	}
};
mxSession.prototype.processEdit = function(c) {
	var a = this.decodeChanges(c);
	if (a.length > 0) {
		var b = this.createUndoableEdit(a);
		this.model.fireEvent(new mxEventObject(mxEvent.CHANGE, "edit", b, "changes", a));
		this.model.fireEvent(new mxEventObject(mxEvent.UNDO, "edit", b));
		this.fireEvent(new mxEventObject(mxEvent.FIRED, "edit", b))
	}
};
mxSession.prototype.createUndoableEdit = function(a) {
	var b = new mxUndoableEdit(this.model, this.significantRemoteChanges);
	b.changes = a;
	b.notify = function() {
		b.source.fireEvent(new mxEventObject(mxEvent.CHANGE, "edit", b, "changes", b.changes));
		b.source.fireEvent(new mxEventObject(mxEvent.NOTIFY, "edit", b, "changes", b.changes))
	};
	return b
};
mxSession.prototype.decodeChanges = function(c) {
	this.codec.document = c.ownerDocument;
	var b = [];
	c = c.firstChild;
	while (c != null) {
		if (c.nodeType == mxConstants.NODETYPE_ELEMENT) {
			var d = null;
			if (c.nodeName == "mxRootChange") {
				var a = new mxCodec(c.ownerDocument);
				d = a.decode(c)
			} else {
				d = this.codec.decode(c)
			}
			if (d != null) {
				d.model = this.model;
				d.execute();
				if (c.nodeName == "mxChildChange" && d.parent == null) {
					this.cellRemoved(d.child)
				}
				b.push(d)
			}
		}
		c = c.nextSibling
	}
	return b
};
mxSession.prototype.cellRemoved = function(a, d) {
	this.codec.putObject(a.getId(), a);
	var b = this.model.getChildCount(a);
	for (var c = 0; c < b; c++) {
		this.cellRemoved(this.model.getChildAt(a, c))
	}
};
function mxUndoableEdit(b, a) {
	this.source = b;
	this.changes = [];
	this.significant = (a != null) ? a: true
}
mxUndoableEdit.prototype.source = null;
mxUndoableEdit.prototype.changes = null;
mxUndoableEdit.prototype.significant = null;
mxUndoableEdit.prototype.undone = false;
mxUndoableEdit.prototype.redone = false;
mxUndoableEdit.prototype.isEmpty = function() {
	return this.changes.length == 0
};
mxUndoableEdit.prototype.isSignificant = function() {
	return this.significant
};
mxUndoableEdit.prototype.add = function(a) {
	this.changes.push(a)
};
mxUndoableEdit.prototype.notify = function() {};
mxUndoableEdit.prototype.die = function() {};
mxUndoableEdit.prototype.undo = function() {
	if (!this.undone) {
		var b = this.changes.length;
		for (var a = b - 1; a >= 0; a--) {
			var c = this.changes[a];
			if (c.execute != null) {
				c.execute()
			} else {
				if (c.undo != null) {
					c.undo()
				}
			}
		}
		this.undone = true;
		this.redone = false
	}
	this.notify()
};
mxUndoableEdit.prototype.redo = function() {
	if (!this.redone) {
		var b = this.changes.length;
		for (var a = 0; a < b; a++) {
			var c = this.changes[a];
			if (c.execute != null) {
				c.execute()
			} else {
				if (c.redo != null) {
					c.redo()
				}
			}
		}
		this.undone = false;
		this.redone = true
	}
	this.notify()
};
function mxUndoManager(a) {
	this.size = (a != null) ? a: 100;
	this.clear()
}
mxUndoManager.prototype = new mxEventSource();
mxUndoManager.prototype.constructor = mxUndoManager;
mxUndoManager.prototype.size = null;
mxUndoManager.prototype.history = null;
mxUndoManager.prototype.indexOfNextAdd = 0;
mxUndoManager.prototype.isEmpty = function() {
	return this.history.length == 0
};
mxUndoManager.prototype.clear = function() {
	this.history = [];
	this.indexOfNextAdd = 0;
	this.fireEvent(new mxEventObject(mxEvent.CLEAR))
};
mxUndoManager.prototype.canUndo = function() {
	return this.indexOfNextAdd > 0
};
mxUndoManager.prototype.undo = function() {
	while (this.indexOfNextAdd > 0) {
		var a = this.history[--this.indexOfNextAdd];
		a.undo();
		if (a.isSignificant()) {
			this.fireEvent(new mxEventObject(mxEvent.UNDO, "edit", a));
			break
		}
	}
};
mxUndoManager.prototype.canRedo = function() {
	return this.indexOfNextAdd < this.history.length
};
mxUndoManager.prototype.redo = function() {
	var b = this.history.length;
	while (this.indexOfNextAdd < b) {
		var a = this.history[this.indexOfNextAdd++];
		a.redo();
		if (a.isSignificant()) {
			this.fireEvent(new mxEventObject(mxEvent.REDO, "edit", a));
			break
		}
	}
};
mxUndoManager.prototype.undoableEditHappened = function(a) {
	this.trim();
	if (this.size > 0 && this.size == this.history.length) {
		this.history.shift()
	}
	this.history.push(a);
	this.indexOfNextAdd = this.history.length;
	this.fireEvent(new mxEventObject(mxEvent.ADD, "edit", a))
};
mxUndoManager.prototype.trim = function() {
	if (this.history.length > this.indexOfNextAdd) {
		var a = this.history.splice(this.indexOfNextAdd, this.history.length - this.indexOfNextAdd);
		for (var b = 0; b < a.length; b++) {
			a[b].die()
		}
	}
};
var mxUrlConverter = function(a) {
	var b = true;
	var c = null;
	var d = function() {
		c = document.URL;
		var e = c.lastIndexOf("/");
		if (e > 0) {
			c = c.substring(0, e + 1)
		}
	};
	return {
		isEnabled: function() {
			return b
		},
		setEnabled: function(e) {
			b = e
		},
		getBaseUrl: function() {
			return c
		},
		setBaseUrl: function(e) {
			c = e
		},
		convert: function(e) {
			if (b && e.indexOf("http://") < 0 && e.indexOf("https://") < 0) {
				if (c == null) {
					d()
				}
				e = c + e
			}
			return e
		}
	}
};
function mxPath(a) {
	this.format = a;
	this.path = [];
	this.translate = new mxPoint(0, 0)
}
mxPath.prototype.format = null;
mxPath.prototype.translate = null;
mxPath.prototype.path = null;
mxPath.prototype.isVml = function() {
	return this.format == "vml"
};
mxPath.prototype.getPath = function() {
	return this.path.join("")
};
mxPath.prototype.setTranslate = function(a, b) {
	this.translate = new mxPoint(a, b)
};
mxPath.prototype.moveTo = function(a, b) {
	if (this.isVml()) {
		this.path.push("m ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + b), " ")
	} else {
		this.path.push("M ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + b), " ")
	}
};
mxPath.prototype.lineTo = function(a, b) {
	if (this.isVml()) {
		this.path.push("l ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + b), " ")
	} else {
		this.path.push("L ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + b), " ")
	}
};
mxPath.prototype.quadTo = function(b, c, a, d) {
	if (this.isVml()) {
		this.path.push("c ", Math.round(this.translate.x + b), " ", Math.round(this.translate.y + c), " ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + d), " ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + d), " ")
	} else {
		this.path.push("Q ", Math.round(this.translate.x + b), " ", Math.round(this.translate.y + c), " ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + d), " ")
	}
};
mxPath.prototype.curveTo = function(c, e, b, d, a, f) {
	if (this.isVml()) {
		this.path.push("c ", Math.round(this.translate.x + c), " ", Math.round(this.translate.y + e), " ", Math.round(this.translate.x + b), " ", Math.round(this.translate.y + d), " ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + f), " ")
	} else {
		this.path.push("C ", Math.round(this.translate.x + c), " ", Math.round(this.translate.y + e), " ", Math.round(this.translate.x + b), " ", Math.round(this.translate.y + d), " ", Math.round(this.translate.x + a), " ", Math.round(this.translate.y + f), " ")
	}
};
mxPath.prototype.write = function(a) {
	this.path.push(a, " ")
};
mxPath.prototype.end = function() {
	if (this.format == "vml") {
		this.path.push("e")
	}
};
mxPath.prototype.close = function() {
	if (this.format == "vml") {
		this.path.push("x e")
	} else {
		this.path.push("Z")
	}
};
function mxPopupMenu(a) {
	this.factoryMethod = a
}
mxPopupMenu.prototype = new mxEventSource();
mxPopupMenu.prototype.constructor = mxPopupMenu;
mxPopupMenu.prototype.submenuImage = mxClient.imageBasePath + "/submenu.gif";
mxPopupMenu.prototype.zIndex = 10006;
mxPopupMenu.prototype.factoryMethod = null;
mxPopupMenu.prototype.useLeftButtonForPopup = false;
mxPopupMenu.prototype.enabled = true;
mxPopupMenu.prototype.itemCount = 0;
mxPopupMenu.prototype.autoExpand = false;
mxPopupMenu.prototype.init = function() {
	this.table = document.createElement("table");
	this.table.className = "mxPopupMenu";
	this.tbody = document.createElement("tbody");
	this.table.appendChild(this.tbody);
	this.div = document.createElement("div");
	this.div.className = "mxPopupMenu";
	this.div.style.display = "inline";
	this.div.style.zIndex = this.zIndex;
	this.div.appendChild(this.table);
	mxEvent.disableContextMenu(this.div)
};
mxPopupMenu.prototype.isEnabled = function() {
	return this.enabled
};
mxPopupMenu.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxPopupMenu.prototype.isPopupTrigger = function(a) {
	return a.isPopupTrigger() || (this.useLeftButtonForPopup && mxEvent.isLeftMouseButton(a.getEvent()))
};
mxPopupMenu.prototype.addItem = function(l, c, a, m, n) {
	m = m || this;
	this.itemCount++;
	var i = document.createElement("tr");
	i.className = "mxPopupMenuItem";
	var h = document.createElement("td");
	h.className = "mxPopupMenuIcon";
	if (c != null) {
		var e = document.createElement("img");
		e.src = c;
		h.appendChild(e)
	} else {
		if (n != null) {
			var b = document.createElement("div");
			b.className = n;
			h.appendChild(b)
		}
	}
	i.appendChild(h);
	var g = document.createElement("td");
	g.className = "mxPopupMenuItem";
	mxUtils.write(g, l);
	g.align = "left";
	i.appendChild(g);
	var f = document.createElement("td");
	f.style.width = "10px";
	f.style.paddingRight = "6px";
	i.appendChild(f);
	if (m.div == null) {
		this.createSubmenu(m)
	}
	m.tbody.appendChild(i);
	var k = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var d = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
	var o = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
	mxEvent.addListener(i, k, mxUtils.bind(this,
	function(p) {
		this.eventReceiver = i;
		if (m.activeRow != i && m.activeRow != m) {
			if (m.activeRow != null && m.activeRow.div.parentNode != null) {
				this.hideSubmenu(m)
			}
			if (i.div != null) {
				this.showSubmenu(m, i);
				m.activeRow = i
			}
		}
		mxEvent.consume(p)
	}));
	mxEvent.addListener(i, d, mxUtils.bind(this,
	function(p) {
		if (m.activeRow != i && m.activeRow != m) {
			if (m.activeRow != null && m.activeRow.div.parentNode != null) {
				this.hideSubmenu(m)
			}
			if (this.autoExpand && i.div != null) {
				this.showSubmenu(m, i);
				m.activeRow = i
			}
		}
		i.className = "mxPopupMenuItemHover"
	}));
	mxEvent.addListener(i, o, mxUtils.bind(this,
	function(p) {
		if (this.eventReceiver == i) {
			if (m.activeRow != i) {
				this.hideMenu()
			}
			if (a != null) {
				a(p)
			}
		}
		this.eventReceiver = null;
		mxEvent.consume(p)
	}));
	mxEvent.addListener(i, "mouseout", mxUtils.bind(this,
	function(p) {
		i.className = "mxPopupMenuItem"
	}));
	return i
};
mxPopupMenu.prototype.createSubmenu = function(b) {
	b.table = document.createElement("table");
	b.table.className = "mxPopupMenu";
	b.tbody = document.createElement("tbody");
	b.table.appendChild(b.tbody);
	b.div = document.createElement("div");
	b.div.className = "mxPopupMenu";
	b.div.style.position = "absolute";
	b.div.style.display = "inline";
	b.div.style.zIndex = this.zIndex;
	b.div.appendChild(b.table);
	var a = document.createElement("img");
	a.setAttribute("src", this.submenuImage);
	td = b.firstChild.nextSibling.nextSibling;
	td.appendChild(a)
};
mxPopupMenu.prototype.showSubmenu = function(f, i) {
	if (i.div != null) {
		i.div.style.left = (f.div.offsetLeft + i.offsetLeft + i.offsetWidth - 1) + "px";
		i.div.style.top = (f.div.offsetTop + i.offsetTop) + "px";
		document.body.appendChild(i.div);
		var g = parseInt(i.div.offsetLeft);
		var e = parseInt(i.div.offsetWidth);
		var a = document.body;
		var h = document.documentElement;
		var c = (a.scrollLeft || h.scrollLeft) + (a.clientWidth || h.clientWidth);
		if (g + e > c) {
			i.div.style.left = (f.div.offsetLeft - e + ((mxClient.IS_IE) ? 6 : -6)) + "px"
		}
		mxUtils.fit(i.div)
	}
};
mxPopupMenu.prototype.addSeparator = function(b) {
	b = b || this;
	if (b.tbody != null) {
		var d = document.createElement("tr");
		var e = document.createElement("td");
		e.className = "mxPopupMenuIcon";
		e.style.padding = "0 0 0 0px";
		d.appendChild(e);
		var c = document.createElement("td");
		c.style.padding = "0 0 0 0px";
		c.setAttribute("colSpan", "2");
		var a = document.createElement("hr");
		a.setAttribute("size", "1");
		c.appendChild(a);
		d.appendChild(c);
		b.tbody.appendChild(d)
	}
};
mxPopupMenu.prototype.popup = function(b, d, a, c) {
	if (this.div != null && this.tbody != null && this.factoryMethod != null) {
		this.div.style.left = b + "px";
		this.div.style.top = d + "px";
		while (this.tbody.firstChild != null) {
			mxEvent.release(this.tbody.firstChild);
			this.tbody.removeChild(this.tbody.firstChild)
		}
		this.itemCount = 0;
		this.factoryMethod(this, a, c);
		if (this.itemCount > 0) {
			this.showMenu();
			this.fireEvent(new mxEventObject(mxEvent.SHOW))
		}
	}
};
mxPopupMenu.prototype.isMenuShowing = function() {
	return this.div != null && this.div.parentNode == document.body
};
mxPopupMenu.prototype.showMenu = function() {
	document.body.appendChild(this.div);
	mxUtils.fit(this.div)
};
mxPopupMenu.prototype.hideMenu = function() {
	if (this.div != null) {
		if (this.div.parentNode != null) {
			this.div.parentNode.removeChild(this.div)
		}
		this.hideSubmenu(this)
	}
};
mxPopupMenu.prototype.hideSubmenu = function(a) {
	if (a.activeRow != null) {
		this.hideSubmenu(a.activeRow);
		if (a.activeRow.div.parentNode != null) {
			a.activeRow.div.parentNode.removeChild(a.activeRow.div)
		}
		a.activeRow = null
	}
};
mxPopupMenu.prototype.destroy = function() {
	if (this.div != null) {
		mxEvent.release(this.div);
		if (this.div.parentNode != null) {
			this.div.parentNode.removeChild(this.div)
		}
		this.div = null
	}
};
function mxAutoSaveManager(a) {
	this.changeHandler = mxUtils.bind(this,
	function(c, b) {
		if (this.isEnabled()) {
			this.graphModelChanged(b.getProperty("edit").changes)
		}
	});
	this.setGraph(a)
}
mxAutoSaveManager.prototype = new mxEventSource();
mxAutoSaveManager.prototype.constructor = mxAutoSaveManager;
mxAutoSaveManager.prototype.graph = null;
mxAutoSaveManager.prototype.autoSaveDelay = 10;
mxAutoSaveManager.prototype.autoSaveThrottle = 2;
mxAutoSaveManager.prototype.autoSaveThreshold = 5;
mxAutoSaveManager.prototype.ignoredChanges = 0;
mxAutoSaveManager.prototype.lastSnapshot = 0;
mxAutoSaveManager.prototype.enabled = true;
mxAutoSaveManager.prototype.changeHandler = null;
mxAutoSaveManager.prototype.isEnabled = function() {
	return this.enabled
};
mxAutoSaveManager.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxAutoSaveManager.prototype.setGraph = function(a) {
	if (this.graph != null) {
		this.graph.getModel().removeListener(this.changeHandler)
	}
	this.graph = a;
	if (this.graph != null) {
		this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler)
	}
};
mxAutoSaveManager.prototype.save = function() {};
mxAutoSaveManager.prototype.graphModelChanged = function(b) {
	var a = new Date().getTime();
	var c = (a - this.lastSnapshot) / 1000;
	if (c > this.autoSaveDelay || (this.ignoredChanges >= this.autoSaveThreshold && c > this.autoSaveThrottle)) {
		this.save();
		this.reset()
	} else {
		this.ignoredChanges++
	}
};
mxAutoSaveManager.prototype.reset = function() {
	this.lastSnapshot = new Date().getTime();
	this.ignoredChanges = 0
};
mxAutoSaveManager.prototype.destroy = function() {
	this.setGraph(null)
};
function mxAnimation(a) {
	this.delay = (a != null) ? a: 20
}
mxAnimation.prototype = new mxEventSource();
mxAnimation.prototype.constructor = mxAnimation;
mxAnimation.prototype.delay = null;
mxAnimation.prototype.thread = null;
mxAnimation.prototype.startAnimation = function() {
	if (this.thread == null) {
		this.thread = window.setInterval(mxUtils.bind(this, this.updateAnimation), this.delay)
	}
};
mxAnimation.prototype.updateAnimation = function() {
	this.fireEvent(new mxEventObject(mxEvent.EXECUTE))
};
mxAnimation.prototype.stopAnimation = function() {
	if (this.thread != null) {
		window.clearInterval(this.thread);
		this.thread = null;
		this.fireEvent(new mxEventObject(mxEvent.DONE))
	}
};
function mxMorphing(c, a, d, b) {
	mxAnimation.call(this, b);
	this.graph = c;
	this.steps = (a != null) ? a: 6;
	this.ease = (d != null) ? d: 1.5
}
mxMorphing.prototype = new mxAnimation();
mxMorphing.prototype.constructor = mxMorphing;
mxMorphing.prototype.graph = null;
mxMorphing.prototype.steps = null;
mxMorphing.prototype.step = 0;
mxMorphing.prototype.ease = null;
mxMorphing.prototype.cells = null;
mxMorphing.prototype.updateAnimation = function() {
	var a = new mxCellStatePreview(this.graph);
	if (this.cells != null) {
		for (var b = 0; b < this.cells.length; b++) {
			this.animateCell(cells[b], a, false)
		}
	} else {
		this.animateCell(this.graph.getModel().getRoot(), a, true)
	}
	this.show(a);
	if (a.isEmpty() || this.step++>=this.steps) {
		this.stopAnimation()
	}
};
mxMorphing.prototype.show = function(a) {
	a.show()
};
mxMorphing.prototype.animateCell = function(k, d, b) {
	var a = this.graph.getView().getState(k);
	var h = null;
	if (a != null) {
		h = this.getDelta(a);
		if (this.graph.getModel().isVertex(k) && (h.x != 0 || h.y != 0)) {
			var c = this.graph.view.getTranslate();
			var e = this.graph.view.getScale();
			h.x += c.x * e;
			h.y += c.y * e;
			d.moveState(a, -h.x / this.ease, -h.y / this.ease)
		}
	}
	if (b && !this.stopRecursion(a, h)) {
		var f = this.graph.getModel().getChildCount(k);
		for (var g = 0; g < f; g++) {
			this.animateCell(this.graph.getModel().getChildAt(k, g), d, b)
		}
	}
};
mxMorphing.prototype.stopRecursion = function(a, b) {
	return b != null && (b.x != 0 || b.y != 0)
};
mxMorphing.prototype.getDelta = function(b) {
	var a = this.getOriginForCell(b.cell);
	var e = this.graph.getView().getTranslate();
	var d = this.graph.getView().getScale();
	var c = new mxPoint(b.x / d - e.x, b.y / d - e.y);
	return new mxPoint((a.x - c.x) * d, (a.y - c.y) * d)
};
mxMorphing.prototype.getOriginForCell = function(b) {
	var a = null;
	if (b != null) {
		a = this.getOriginForCell(this.graph.getModel().getParent(b));
		var d = this.graph.getCellGeometry(b);
		if (d != null) {
			a.x += d.x;
			a.y += d.y
		}
	}
	if (a == null) {
		var c = this.graph.view.getTranslate();
		a = new mxPoint( - c.x, -c.y)
	}
	return a
};
function mxImageBundle(a) {
	this.images = [];
	this.alt = (a != null) ? a: false
}
mxImageBundle.prototype.images = null;
mxImageBundle.prototype.images = null;
mxImageBundle.prototype.putImage = function(a, b, c) {
	this.images[a] = {
		value: b,
		fallback: c
	}
};
mxImageBundle.prototype.getImage = function(c) {
	var a = null;
	if (c != null) {
		var b = this.images[c];
		if (b != null) {
			a = (this.alt) ? b.fallback: b.value
		}
	}
	return a
};
function mxImageExport() {
	this.initShapes();
	this.initMarkers()
}
mxImageExport.prototype.includeOverlays = false;
mxImageExport.prototype.glassSize = 0.4;
mxImageExport.prototype.shapes = null;
mxImageExport.prototype.markers = null;
mxImageExport.prototype.drawState = function(g, d) {
	if (g != null) {
		if (g.shape != null) {
			var b = (g.shape.stencil != null) ? g.shape.stencil: this.shapes[g.style[mxConstants.STYLE_SHAPE]];
			if (b == null) {
				if (typeof(g.shape.redrawPath) == "function") {
					b = this.createShape(g, d)
				} else {
					if (g.view.graph.getModel().isVertex(g.cell)) {
						b = this.shapes.rectangle
					}
				}
			}
			if (b != null) {
				this.drawShape(g, d, b);
				if (this.includeOverlays) {
					this.drawOverlays(g, d)
				}
			}
		}
		var f = g.view.graph;
		var a = f.model.getChildCount(g.cell);
		for (var e = 0; e < a; e++) {
			var c = f.view.getState(f.model.getChildAt(g.cell, e));
			this.drawState(c, d)
		}
	}
};
mxImageExport.prototype.createShape = function(b, a) {
	return {
		isExportWrapperShape: true,
		drawShape: function(c, h, g, e) {
			var d = g.x;
			var f = g.y;
			var i = {
				moveTo: function(k, l) {
					c.moveTo(d + k, f + l)
				},
				lineTo: function(k, l) {
					c.lineTo(d + k, f + l)
				},
				quadTo: function(l, m, k, n) {
					c.quadTo(d + l, f + m, d + k, f + n)
				},
				curveTo: function(m, o, l, n, k, p) {
					c.curveTo(d + m, f + o, d + l, f + n, d + k, f + p)
				},
				end: function() {},
				close: function() {
					c.close()
				}
			};
			if (!e) {
				c.fillAndStroke()
			}
			c.begin();
			h.shape.redrawPath(i, g.x, g.y, g.width, g.height, !e);
			if (!e) {
				c.fillAndStroke()
			}
			return true
		}
	}
};
mxImageExport.prototype.drawOverlays = function(d, a) {
	if (d.overlays != null) {
		for (var b = 0; b < d.overlays.length; b++) {
			if (d.overlays[b].bounds != null) {
				var c = d.overlays[b].bounds;
				a.image(c.x, c.y, c.width, c.height, d.overlays[b].image)
			}
		}
	}
};
mxImageExport.prototype.drawShape = function(k, g, c) {
	var x = mxUtils.getNumber(k.style, mxConstants.STYLE_ROTATION, 0);
	var E = mxUtils.getValue(k.style, mxConstants.STYLE_DIRECTION, null);
	if (E != null) {
		if (E == "north") {
			x += 270
		} else {
			if (E == "west") {
				x += 180
			} else {
				if (E == "south") {
					x += 90
				}
			}
		}
	}
	var z = k.style[mxConstants.STYLE_STENCIL_FLIPH];
	var p = k.style[mxConstants.STYLE_STENCIL_FLIPV];
	if (z && p) {
		x += 180;
		z = false;
		p = false
	}
	g.save();
	x = x % 360;
	if (x != 0 || z || p) {
		g.rotate(x, z, p, k.getCenterX(), k.getCenterY())
	}
	var G = k.view.scale;
	var v = mxUtils.getNumber(k.style, mxConstants.STYLE_STROKEWIDTH, 1) * G;
	g.setStrokeWidth(v);
	var a = v / 2;
	var f = this.getBackgroundBounds(k);
	if (c.isExportWrapperShape && (E == "south" || E == "north")) {
		var r = (f.width - f.height) / 2;
		f.x += r;
		f.y += -r;
		var C = f.width;
		f.width = f.height;
		f.height = C
	}
	var l = new mxRectangle(f.x - a, f.y - a, f.width + v, f.height + v);
	var i = mxUtils.getValue(k.style, mxConstants.STYLE_OPACITY, 100) / 100;
	var B = k.style[mxConstants.STYLE_SHAPE] == "image";
	var s = (B) ? null: mxUtils.getValue(k.style, mxConstants.STYLE_GRADIENTCOLOR);
	if (s == mxConstants.NONE) {
		s = null
	}
	var F = (B) ? mxConstants.STYLE_IMAGE_BACKGROUND: mxConstants.STYLE_FILLCOLOR;
	var h = mxUtils.getValue(k.style, F, null);
	if (h == mxConstants.NONE) {
		h = null
	}
	var I = (B) ? mxConstants.STYLE_IMAGE_BORDER: mxConstants.STYLE_STROKECOLOR;
	var w = mxUtils.getValue(k.style, I, null);
	if (w == mxConstants.NONE) {
		stokeColor = null
	}
	var H = (h != null && (k.style[mxConstants.STYLE_SHAPE] == "label" || k.style[mxConstants.STYLE_SHAPE] == "rectangle"));
	if (h != null && mxUtils.getValue(k.style, mxConstants.STYLE_SHADOW, false)) {
		this.drawShadow(g, k, c, x, z, p, f, i)
	}
	g.setAlpha(i);
	if (mxUtils.getValue(k.style, mxConstants.STYLE_DASHED, "0") == "1") {
		g.setDashed(true)
	}
	if (w != null || h != null) {
		if (w != null) {
			g.setStrokeColor(w)
		}
		if (h != null) {
			if (s != null && s != "transparent") {
				g.setGradient(h, s, f.x, f.y, f.width, f.height, E)
			} else {
				g.setFillColor(h)
			}
		}
		H = c.drawShape(g, k, f, true) && H;
		c.drawShape(g, k, f, false)
	}
	if (H && mxUtils.getValue(k.style, mxConstants.STYLE_GLASS, 0) == 1) {
		this.drawGlass(k, g, l, c, this.glassSize)
	}
	if (B || k.style[mxConstants.STYLE_SHAPE] == "label") {
		var n = k.view.graph.getImage(k);
		if (n != null) {
			var u = this.getImageBounds(k);
			if (u != null) {
				this.drawImage(k, g, u, n)
			}
		}
	}
	g.restore();
	var t = k.text;
	var o = k.view.graph.getLabel(k.cell);
	if (t != null && o != null && o.length > 0) {
		g.save();
		g.setAlpha(mxUtils.getValue(k.style, mxConstants.STYLE_TEXT_OPACITY, 100) / 100);
		var m = new mxRectangle(t.boundingBox.x, t.boundingBox.y, t.boundingBox.width, t.boundingBox.height);
		var A = mxUtils.getValue(k.style, mxConstants.STYLE_HORIZONTAL, 1) == 0;
		m.y += 2;
		if (A) {
			if (t.dialect != mxConstants.DIALECT_SVG) {
				var e = m.x + m.width / 2;
				var d = m.y + m.height / 2;
				var C = m.width;
				m.width = m.height;
				m.height = C;
				m.x = e - m.width / 2;
				m.y = d - m.height / 2
			} else {
				if (t.dialect == mxConstants.DIALECT_SVG) {
					var D = k.y + k.height;
					var e = m.getCenterX() - k.x;
					var d = m.getCenterY() - k.y;
					var q = D - e - m.height / 2;
					m.x = k.x + d - m.width / 2;
					m.y = q
				}
			}
		}
		this.drawLabelBackground(k, g, m, A);
		this.drawLabel(k, g, m, A, o);
		g.restore()
	}
};
mxImageExport.prototype.drawShadow = function(d, b, g, m, k, c, a, e) {
	var i = m * Math.PI / 180;
	var l = Math.cos( - i);
	var h = Math.sin( - i);
	var f = mxUtils.getRotatedPoint(new mxPoint(mxConstants.SHADOW_OFFSET_X, mxConstants.SHADOW_OFFSET_Y), l, h);
	if (k) {
		f.x *= -1
	}
	if (c) {
		f.y *= -1
	}
	d.translate(f.x, f.y);
	if (g.drawShape(d, b, a, true)) {
		d.setAlpha(mxConstants.SHADOW_OPACITY * e);
		d.shadow(mxConstants.SHADOWCOLOR)
	}
	d.translate( - f.x, -f.y)
};
mxImageExport.prototype.drawGlass = function(e, b, d, a, c) {
	if (a.drawShape(b, e, d, true)) {
		b.save();
		b.clip();
		b.setGlassGradient(d.x, d.y, d.width, d.height);
		b.begin();
		b.moveTo(d.x, d.y);
		b.lineTo(d.x, (d.y + d.height * c));
		b.quadTo((d.x + d.width * 0.5), (d.y + d.height * 0.7), d.x + d.width, (d.y + d.height * c));
		b.lineTo(d.x + d.width, d.y);
		b.close();
		b.fill();
		b.restore()
	}
};
mxImageExport.prototype.drawImage = function(e, b, d, g) {
	var a = true;
	var f = mxUtils.getValue(e.style, mxConstants.STYLE_IMAGE_FLIPH, 0) == 1;
	var c = mxUtils.getValue(e.style, mxConstants.STYLE_IMAGE_FLIPV, 0) == 1;
	b.image(d.x, d.y, d.width, d.height, g, a, f, c)
};
mxImageExport.prototype.drawLabelBackground = function(b, c, a, f) {
	var l = mxUtils.getValue(b.style, mxConstants.STYLE_LABEL_BORDERCOLOR);
	var m = mxUtils.getValue(b.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR);
	if (l == mxConstants.NONE) {
		l = null
	}
	if (m == mxConstants.NONE) {
		m = null
	}
	if (l != null || m != null) {
		var i = a.x;
		var g = a.y - mxUtils.getValue(b.style, mxConstants.STYLE_LABEL_PADDING, 0);
		var k = a.width;
		var e = a.height;
		if (f) {
			i += (k - e) / 2;
			g += (e - k) / 2;
			var d = k;
			k = e;
			e = d
		}
		if (m != null) {
			c.setFillColor(m)
		}
		if (l != null) {
			c.setStrokeColor(l);
			c.setStrokeWidth(1);
			c.setDashed(false)
		}
		c.rect(i, g, k, e);
		if (m != null && l != null) {
			c.fillAndStroke()
		} else {
			if (m != null) {
				c.fill()
			} else {
				if (l != null) {
					c.stroke()
				}
			}
		}
	}
};
mxImageExport.prototype.drawLabel = function(d, b, c, a, f) {
	var e = d.view.scale;
	b.setFontColor(mxUtils.getValue(d.style, mxConstants.STYLE_FONTCOLOR, "#000000"));
	b.setFontFamily(mxUtils.getValue(d.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY));
	b.setFontStyle(mxUtils.getValue(d.style, mxConstants.STYLE_FONTSTYLE, 0));
	b.setFontSize(mxUtils.getValue(d.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE) * e);
	var h = mxUtils.getValue(d.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
	if (h == "left") {
		h = null
	}
	var g = c.y - mxUtils.getValue(d.style, mxConstants.STYLE_LABEL_PADDING, 0);
	b.text(c.x, g, c.width, c.height, f, h, null, a)
};
mxImageExport.prototype.getBackgroundBounds = function(c) {
	if (c.style[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_SWIMLANE) {
		var d = c.view.scale;
		var e = mxUtils.getValue(c.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE) * d;
		var a = c.width;
		var b = c.height;
		if (mxUtils.getValue(c.style, mxConstants.STYLE_HORIZONTAL, true)) {
			b = e
		} else {
			a = e
		}
		return new mxRectangle(c.x, c.y, Math.min(c.width, a), Math.min(c.height, b))
	} else {
		return new mxRectangle(c.x, c.y, c.width, c.height)
	}
};
mxImageExport.prototype.getImageBounds = function(g) {
	var e = new mxRectangle(g.x, g.y, g.width, g.height);
	var d = g.style;
	if (mxUtils.getValue(d, mxConstants.STYLE_SHAPE) != mxConstants.SHAPE_IMAGE) {
		var f = mxUtils.getValue(d, mxConstants.STYLE_IMAGE_ALIGN, mxConstants.ALIGN_LEFT);
		var c = mxUtils.getValue(d, mxConstants.STYLE_IMAGE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		var b = mxUtils.getValue(d, mxConstants.STYLE_IMAGE_WIDTH, mxConstants.DEFAULT_IMAGESIZE);
		var a = mxUtils.getValue(d, mxConstants.STYLE_IMAGE_HEIGHT, mxConstants.DEFAULT_IMAGESIZE);
		var h = mxUtils.getValue(d, mxConstants.STYLE_SPACING, 2);
		if (f == mxConstants.ALIGN_CENTER) {
			e.x += (e.width - b) / 2
		} else {
			if (f == mxConstants.ALIGN_RIGHT) {
				e.x += e.width - b - h - 2
			} else {
				e.x += h + 4
			}
		}
		if (c == mxConstants.ALIGN_TOP) {
			e.y += h
		} else {
			if (c == mxConstants.ALIGN_BOTTOM) {
				e.y += e.height - a - h
			} else {
				e.y += (e.height - a) / 2
			}
		}
		e.width = b;
		e.height = a
	}
	return e
};
mxImageExport.prototype.drawMarker = function(b, d, s) {
	var h = null;
	var x = d.absolutePoints;
	var r = x.length;
	var a = (s) ? x[1] : x[r - 2];
	var w = (s) ? x[0] : x[r - 1];
	var m = w.x - a.x;
	var l = w.y - a.y;
	var q = Math.max(1, Math.sqrt(m * m + l * l));
	var g = m / q;
	var e = l / q;
	var o = mxUtils.getValue(d.style, (s) ? mxConstants.STYLE_STARTSIZE: mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
	var v = g * o;
	var u = e * o;
	var p = mxUtils.getValue(d.style, mxConstants.STYLE_STROKEWIDTH, 1);
	var k = g * p;
	var i = e * p;
	w = w.clone();
	var c = mxUtils.getValue(d.style, (s) ? mxConstants.STYLE_STARTARROW: mxConstants.STYLE_ENDARROW);
	var t = this.markers[c];
	if (t != null) {
		h = t(b, d, c, w, v, u, o, s, k, i);
		if (h != null) {
			h.x -= k / 2;
			h.y -= i / 2
		}
	}
	return h
};
mxImageExport.prototype.initShapes = function() {
	this.shapes = [];
	this.shapes.rectangle = {
		drawShape: function(b, h, e, c) {
			if (c) {
				if (mxUtils.getValue(h.style, mxConstants.STYLE_ROUNDED, false)) {
					var g = mxUtils.getValue(h.style, mxConstants.STYLE_ARCSIZE, mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
					var d = Math.min(e.width * g, e.height * g);
					b.roundrect(e.x, e.y, e.width, e.height, d, d)
				} else {
					b.rect(e.x, e.y, e.width, e.height)
				}
				return true
			} else {
				b.fillAndStroke()
			}
		}
	};
	this.shapes.swimlane = {
		drawShape: function(f, d, b, e) {
			if (e) {
				if (mxUtils.getValue(d.style, mxConstants.STYLE_ROUNDED, false)) {
					var c = Math.min(b.width * mxConstants.RECTANGLE_ROUNDING_FACTOR, b.height * mxConstants.RECTANGLE_ROUNDING_FACTOR);
					f.roundrect(b.x, b.y, b.width, b.height, c, c)
				} else {
					f.rect(b.x, b.y, b.width, b.height)
				}
				return true
			} else {
				f.fillAndStroke();
				var k = d.x;
				var i = d.y;
				var l = d.width;
				var g = d.height;
				if (mxUtils.getValue(d.style, mxConstants.STYLE_HORIZONTAL, 1) == 0) {
					k += b.width;
					l -= b.width
				} else {
					i += b.height;
					g -= b.height
				}
				f.begin();
				f.moveTo(k, i);
				f.lineTo(k, i + g);
				f.lineTo(k + l, i + g);
				f.lineTo(k + l, i);
				f.stroke()
			}
		}
	};
	this.shapes.image = this.shapes.rectangle;
	this.shapes.label = this.shapes.rectangle;
	var a = this;
	this.shapes.connector = {
		translatePoint: function(c, b, e) {
			if (e != null) {
				var d = c[b].clone();
				d.x += e.x;
				d.y += e.y;
				c[b] = d
			}
		},
		drawShape: function(d, e, f, s) {
			if (s) {
				return false
			} else {
				var v = mxUtils.getValue(e.style, mxConstants.STYLE_ROUNDED, false);
				var o = mxConstants.LINE_ARCSIZE / 2;
				d.setFillColor(mxUtils.getValue(e.style, mxConstants.STYLE_STROKECOLOR, "#000000"));
				d.setDashed(false);
				var y = e.absolutePoints.slice();
				this.translatePoint(y, 0, a.drawMarker(d, e, true));
				this.translatePoint(y, y.length - 1, a.drawMarker(d, e, false));
				d.setDashed(mxUtils.getValue(e.style, mxConstants.STYLE_DASHED, "0") == "1");
				var m = y[0];
				var x = y[y.length - 1];
				d.begin();
				d.moveTo(m.x, m.y);
				for (var q = 1; q < y.length - 1; q++) {
					var u = y[q];
					var h = m.x - u.x;
					var g = m.y - u.y;
					if ((v && q < y.length - 1) && (h != 0 || g != 0)) {
						var n = Math.sqrt(h * h + g * g);
						var p = h * Math.min(o, n / 2) / n;
						var z = g * Math.min(o, n / 2) / n;
						var t = u.x + p;
						var c = u.y + z;
						d.lineTo(t, c);
						var l = y[q + 1];
						h = l.x - u.x;
						g = l.y - u.y;
						n = Math.max(1, Math.sqrt(h * h + g * g));
						var k = h * Math.min(o, n / 2) / n;
						var w = g * Math.min(o, n / 2) / n;
						var r = u.x + k;
						var b = u.y + w;
						d.curveTo(u.x, u.y, u.x, u.y, r, b);
						u = new mxPoint(r, b)
					} else {
						d.lineTo(u.x, u.y)
					}
					m = u
				}
				d.lineTo(x.x, x.y);
				d.stroke()
			}
		}
	};
	this.shapes.arrow = {
		drawShape: function(f, i, m, B) {
			if (B) {
				var h = mxConstants.ARROW_SPACING;
				var w = mxConstants.ARROW_WIDTH;
				var e = mxConstants.ARROW_SIZE;
				var F = i.absolutePoints;
				var d = F[0];
				var E = F[F.length - 1];
				var u = E.x - d.x;
				var t = E.y - d.y;
				var v = Math.sqrt(u * u + t * t);
				var g = v - 2 * h - e;
				var D = u / v;
				var C = t / v;
				var o = g * D;
				var n = g * C;
				var l = w * C / 3;
				var k = -w * D / 3;
				var z = d.x - l / 2 + h * D;
				var x = d.y - k / 2 + h * C;
				var c = z + l;
				var b = x + k;
				var r = c + o;
				var p = b + n;
				var A = r + l;
				var y = p + k;
				var s = A - 3 * l;
				var q = y - 3 * k;
				f.begin();
				f.moveTo(z, x);
				f.lineTo(c, b);
				f.lineTo(r, p);
				f.lineTo(A, y);
				f.lineTo(E.x - h * D, E.y - h * C);
				f.lineTo(s, q);
				f.lineTo(s + l, q + k);
				f.close();
				return true
			} else {
				f.fillAndStroke()
			}
		}
	};
	this.shapes.cylinder = {
		drawShape: function(e, c, b, d) {
			if (d) {
				return false
			} else {
				var i = b.x;
				var g = b.y;
				var k = b.width;
				var f = b.height;
				var l = Math.min(mxCylinder.prototype.maxHeight, Math.floor(f / 5));
				e.begin();
				e.moveTo(i, g + l);
				e.curveTo(i, g - l / 3, i + k, g - l / 3, i + k, g + l);
				e.lineTo(i + k, g + f - l);
				e.curveTo(i + k, g + f + l / 3, i, g + f + l / 3, i, g + f - l);
				e.close();
				e.fillAndStroke();
				e.begin();
				e.moveTo(i, g + l);
				e.curveTo(i, g + 2 * l, i + k, g + 2 * l, i + k, g + l);
				e.stroke()
			}
		}
	};
	this.shapes.line = {
		drawShape: function(d, g, f, e) {
			if (e) {
				return false
			} else {
				var c = mxUtils.getValue(g.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
				d.begin();
				if (c == mxConstants.DIRECTION_EAST || c == mxConstants.DIRECTION_WEST) {
					var b = g.getCenterY();
					d.moveTo(f.x, b);
					d.lineTo(f.x + f.width, b)
				} else {
					var b = g.getCenterX();
					d.moveTo(b, f.y);
					d.lineTo(b, f.y + f.height)
				}
				d.stroke()
			}
		}
	};
	this.shapes.ellipse = {
		drawShape: function(b, e, d, c) {
			if (c) {
				b.ellipse(d.x, d.y, d.width, d.height);
				return true
			} else {
				b.fillAndStroke()
			}
		}
	};
	this.shapes.doubleEllipse = {
		drawShape: function(e, c, b, d) {
			var i = b.x;
			var g = b.y;
			var k = b.width;
			var f = b.height;
			if (d) {
				e.ellipse(i, g, k, f);
				return true
			} else {
				e.fillAndStroke();
				var l = Math.min(4, Math.min(k / 5, f / 5));
				i += l;
				g += l;
				k -= 2 * l;
				f -= 2 * l;
				if (k > 0 && f > 0) {
					e.ellipse(i, g, k, f)
				}
				e.stroke()
			}
		}
	};
	this.shapes.triangle = {
		drawShape: function(e, c, b, d) {
			if (d) {
				var f = mxUtils.getValue(c.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
				var k = b.x;
				var i = b.y;
				var l = b.width;
				var g = b.height;
				e.begin();
				if (f == mxConstants.DIRECTION_NORTH) {
					e.moveTo(k, i + g);
					e.lineTo(k + l / 2, i);
					e.lineTo(k + l, i + g)
				} else {
					if (f == mxConstants.DIRECTION_SOUTH) {
						e.moveTo(k, i);
						e.lineTo(k + l / 2, i + g);
						e.lineTo(k + l, i)
					} else {
						if (f == mxConstants.DIRECTION_WEST) {
							e.moveTo(k + l, i);
							e.lineTo(k, i + g / 2);
							e.lineTo(k + l, i + g)
						} else {
							e.moveTo(k, i);
							e.lineTo(k + l, i + g / 2);
							e.lineTo(k, i + g)
						}
					}
				}
				e.close();
				return true
			} else {
				e.fillAndStroke()
			}
		}
	};
	this.shapes.rhombus = {
		drawShape: function(e, c, b, d) {
			if (d) {
				var l = b.x;
				var k = b.y;
				var m = b.width;
				var g = b.height;
				var i = m / 2;
				var f = g / 2;
				e.begin();
				e.moveTo(l + i, k);
				e.lineTo(l + m, k + f);
				e.lineTo(l + i, k + g);
				e.lineTo(l, k + f);
				e.close();
				return true
			} else {
				e.fillAndStroke()
			}
		}
	};
	this.shapes.hexagon = {
		drawShape: function(e, c, b, d) {
			if (d) {
				var f = mxUtils.getValue(c.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
				var k = b.x;
				var i = b.y;
				var l = b.width;
				var g = b.height;
				e.begin();
				if (f == mxConstants.DIRECTION_NORTH || f == mxConstants.DIRECTION_SOUTH) {
					e.moveTo(k, i + g);
					e.lineTo(k + l / 2, i);
					e.lineTo(k + l, i + g);
					e.moveTo(k + 0.5 * l, i);
					e.lineTo(k + l, i + 0.25 * g);
					e.lineTo(k + l, i + 0.75 * g);
					e.lineTo(k + 0.5 * l, i + g);
					e.lineTo(k, i + 0.75 * g);
					e.lineTo(k, i + 0.25 * g)
				} else {
					e.moveTo(k + 0.25 * l, i);
					e.lineTo(k + 0.75 * l, i);
					e.lineTo(k + l, i + 0.5 * g);
					e.lineTo(k + 0.75 * l, i + g);
					e.lineTo(k + 0.25 * l, i + g);
					e.lineTo(k, i + 0.5 * g)
				}
				e.close();
				return true
			} else {
				e.fillAndStroke()
			}
		}
	};
	this.shapes.actor = {
		drawShape: function(f, c, b, d) {
			if (d) {
				var k = b.x;
				var i = b.y;
				var l = b.width;
				var g = b.height;
				var e = l * 2 / 6;
				f.begin();
				f.moveTo(k, i + g);
				f.curveTo(k, i + 3 * g / 5, k, i + 2 * g / 5, k + l / 2, i + 2 * g / 5);
				f.curveTo(k + l / 2 - e, i + 2 * g / 5, k + l / 2 - e, i, k + l / 2, i);
				f.curveTo(k + l / 2 + e, i, k + l / 2 + e, i + 2 * g / 5, k + l / 2, i + 2 * g / 5);
				f.curveTo(k + l, i + 2 * g / 5, k + l, i + 3 * g / 5, k + l, i + g);
				f.close();
				return true
			} else {
				f.fillAndStroke()
			}
		}
	};
	this.shapes.cloud = {
		drawShape: function(d, i, g, e) {
			if (e) {
				var b = g.x;
				var k = g.y;
				var c = g.width;
				var f = g.height;
				d.begin();
				d.moveTo(b + 0.25 * c, k + 0.25 * f);
				d.curveTo(b + 0.05 * c, k + 0.25 * f, b, k + 0.5 * f, b + 0.16 * c, k + 0.55 * f);
				d.curveTo(b, k + 0.66 * f, b + 0.18 * c, k + 0.9 * f, b + 0.31 * c, k + 0.8 * f);
				d.curveTo(b + 0.4 * c, k + f, b + 0.7 * c, k + f, b + 0.8 * c, k + 0.8 * f);
				d.curveTo(b + c, k + 0.8 * f, b + c, k + 0.6 * f, b + 0.875 * c, k + 0.5 * f);
				d.curveTo(b + c, k + 0.3 * f, b + 0.8 * c, k + 0.1 * f, b + 0.625 * c, k + 0.2 * f);
				d.curveTo(b + 0.5 * c, k + 0.05 * f, b + 0.3 * c, k + 0.05 * f, b + 0.25 * c, k + 0.25 * f);
				d.close();
				return true
			} else {
				d.fillAndStroke()
			}
		}
	}
};
mxImageExport.prototype.initMarkers = function() {
	this.markers = [];
	var a = function(d, c, k, i, h, f, m, b, g, e) {
		i.x -= g;
		i.y -= e;
		d.begin();
		d.moveTo(i.x, i.y);
		d.lineTo(i.x - h - f / 2, i.y - f + h / 2);
		if (k == mxConstants.ARROW_CLASSIC) {
			d.lineTo(i.x - h * 3 / 4, i.y - f * 3 / 4)
		}
		d.lineTo(i.x + f / 2 - h, i.y - f - h / 2);
		d.close();
		var l = (b) ? mxConstants.STYLE_STARTFILL: mxConstants.STYLE_ENDFILL;
		if (c.style[l] == 0) {
			d.stroke()
		} else {
			d.fillAndStroke()
		}
		return new mxPoint( - h, -f)
	};
	this.markers.classic = a;
	this.markers.block = a;
	this.markers.open = function(d, c, k, i, h, f, l, b, g, e) {
		i.x -= g;
		i.y -= e;
		h *= 1.2;
		f *= 1.2;
		d.begin();
		d.moveTo(i.x - h - f / 2, i.y - f + h / 2);
		d.lineTo(i.x - h / 6, i.y - f / 6);
		d.lineTo(i.x + f / 2 - h, i.y - f - h / 2);
		d.stroke();
		return new mxPoint( - h / 2, -f / 2)
	};
	this.markers.oval = function(d, c, k, i, h, f, n, b, g, e) {
		var l = n / 2;
		d.ellipse(i.x - l, i.y - l, n, n);
		var m = (b) ? mxConstants.STYLE_STARTFILL: mxConstants.STYLE_ENDFILL;
		if (c.style[m] == 0) {
			d.stroke()
		} else {
			d.fillAndStroke()
		}
		return new mxPoint( - h / 2, -f / 2)
	};
	this.markers.diamond = function(d, c, k, i, h, f, m, b, g, e) {
		i.x -= g;
		i.y -= e;
		h *= 1.2;
		f *= 1.2;
		d.begin();
		d.moveTo(i.x, i.y);
		d.lineTo(i.x - h / 2 - f / 2, i.y + h / 2 - f / 2);
		d.lineTo(i.x - h, i.y - f);
		d.lineTo(i.x - h / 2 + f / 2, i.y - f / 2 - h / 2);
		d.close();
		var l = (b) ? mxConstants.STYLE_STARTFILL: mxConstants.STYLE_ENDFILL;
		if (c.style[l] == 0) {
			d.stroke()
		} else {
			d.fillAndStroke()
		}
		return new mxPoint( - h / 2, -f / 2)
	}
};
var mxXmlCanvas2D = function(c) {
	var e = new mxUrlConverter();
	var d = true;
	var b = true;
	var g = c.ownerDocument;
	var a = [];
	var f = {
		alpha: 1,
		dashed: false,
		strokewidth: 1,
		fontsize: mxConstants.DEFAULT_FONTSIZE,
		fontfamily: mxConstants.DEFAULT_FONTFAMILY,
		fontcolor: "#000000"
	};
	var h = function(i) {
		return Math.round(parseFloat(i) * 100) / 100
	};
	return {
		getConverter: function() {
			return e
		},
		isCompressed: function() {
			return d
		},
		setCompressed: function(i) {
			d = i
		},
		isTextEnabled: function() {
			return b
		},
		setTextEnabled: function(i) {
			b = i
		},
		getDocument: function() {
			return g
		},
		save: function() {
			if (d) {
				a.push(f);
				f = mxUtils.clone(f)
			}
			c.appendChild(g.createElement("save"))
		},
		restore: function() {
			if (d) {
				f = a.pop()
			}
			c.appendChild(g.createElement("restore"))
		},
		scale: function(k) {
			var i = g.createElement("scale");
			i.setAttribute("scale", k);
			c.appendChild(i)
		},
		translate: function(k, i) {
			var l = g.createElement("translate");
			l.setAttribute("dx", h(k));
			l.setAttribute("dy", h(i));
			c.appendChild(l)
		},
		rotate: function(k, n, l, i, o) {
			var m = g.createElement("rotate");
			m.setAttribute("theta", h(k));
			m.setAttribute("flipH", (n) ? "1": "0");
			m.setAttribute("flipV", (l) ? "1": "0");
			m.setAttribute("cx", h(i));
			m.setAttribute("cy", h(o));
			c.appendChild(m)
		},
		setStrokeWidth: function(k) {
			if (d) {
				if (f.strokewidth == k) {
					return
				}
				f.strokewidth = k
			}
			var i = g.createElement("strokewidth");
			i.setAttribute("width", h(k));
			c.appendChild(i)
		},
		setStrokeColor: function(k) {
			var i = g.createElement("strokecolor");
			i.setAttribute("color", k);
			c.appendChild(i)
		},
		setDashed: function(k) {
			if (d) {
				if (f.dashed == k) {
					return
				}
				f.dashed = k
			}
			var i = g.createElement("dashed");
			i.setAttribute("dashed", (k) ? "1": "0");
			c.appendChild(i)
		},
		setDashPattern: function(k) {
			var i = g.createElement("dashpattern");
			i.setAttribute("pattern", k);
			c.appendChild(i)
		},
		setLineCap: function(k) {
			var i = g.createElement("linecap");
			i.setAttribute("cap", k);
			c.appendChild(i)
		},
		setLineJoin: function(k) {
			var i = g.createElement("linejoin");
			i.setAttribute("join", k);
			c.appendChild(i)
		},
		setMiterLimit: function(k) {
			var i = g.createElement("miterlimit");
			i.setAttribute("limit", k);
			c.appendChild(i)
		},
		setFontSize: function(k) {
			if (b) {
				if (d) {
					if (f.fontsize == k) {
						return
					}
					f.fontsize = k
				}
				var i = g.createElement("fontsize");
				i.setAttribute("size", k);
				c.appendChild(i)
			}
		},
		setFontColor: function(k) {
			if (b) {
				if (d) {
					if (f.fontcolor == k) {
						return
					}
					f.fontcolor = k
				}
				var i = g.createElement("fontcolor");
				i.setAttribute("color", k);
				c.appendChild(i)
			}
		},
		setFontFamily: function(k) {
			if (b) {
				if (d) {
					if (f.fontfamily == k) {
						return
					}
					f.fontfamily = k
				}
				var i = g.createElement("fontfamily");
				i.setAttribute("family", k);
				c.appendChild(i)
			}
		},
		setFontStyle: function(k) {
			if (b) {
				var i = g.createElement("fontstyle");
				i.setAttribute("style", k);
				c.appendChild(i)
			}
		},
		setAlpha: function(k) {
			if (d) {
				if (f.alpha == k) {
					return
				}
				f.alpha = k
			}
			var i = g.createElement("alpha");
			i.setAttribute("alpha", h(k));
			c.appendChild(i)
		},
		setFillColor: function(k) {
			var i = g.createElement("fillcolor");
			i.setAttribute("color", k);
			c.appendChild(i)
		},
		setGradient: function(m, k, i, q, l, n, p) {
			var o = g.createElement("gradient");
			o.setAttribute("c1", m);
			o.setAttribute("c2", k);
			o.setAttribute("x", h(i));
			o.setAttribute("y", h(q));
			o.setAttribute("w", h(l));
			o.setAttribute("h", h(n));
			if (p != null) {
				o.setAttribute("direction", p)
			}
			c.appendChild(o)
		},
		setGlassGradient: function(i, n, k, l) {
			var m = g.createElement("glass");
			m.setAttribute("x", h(i));
			m.setAttribute("y", h(n));
			m.setAttribute("w", h(k));
			m.setAttribute("h", h(l));
			c.appendChild(m)
		},
		rect: function(i, n, k, l) {
			var m = g.createElement("rect");
			m.setAttribute("x", h(i));
			m.setAttribute("y", h(n));
			m.setAttribute("w", h(k));
			m.setAttribute("h", h(l));
			c.appendChild(m)
		},
		roundrect: function(i, p, l, n, m, k) {
			var o = g.createElement("roundrect");
			o.setAttribute("x", h(i));
			o.setAttribute("y", h(p));
			o.setAttribute("w", h(l));
			o.setAttribute("h", h(n));
			o.setAttribute("dx", h(m));
			o.setAttribute("dy", h(k));
			c.appendChild(o)
		},
		ellipse: function(i, n, k, l) {
			var m = g.createElement("ellipse");
			m.setAttribute("x", h(i));
			m.setAttribute("y", h(n));
			m.setAttribute("w", h(k));
			m.setAttribute("h", h(l));
			c.appendChild(m)
		},
		image: function(q, p, r, n, i, k, o, l) {
			i = e.convert(i);
			var m = g.createElement("image");
			m.setAttribute("x", h(q));
			m.setAttribute("y", h(p));
			m.setAttribute("w", h(r));
			m.setAttribute("h", h(n));
			m.setAttribute("src", i);
			m.setAttribute("aspect", (k) ? "1": "0");
			m.setAttribute("flipH", (o) ? "1": "0");
			m.setAttribute("flipV", (l) ? "1": "0");
			c.appendChild(m)
		},
		text: function(q, o, r, l, n, m, p, k) {
			if (b) {
				var i = g.createElement("text");
				i.setAttribute("x", h(q));
				i.setAttribute("y", h(o));
				i.setAttribute("w", h(r));
				i.setAttribute("h", h(l));
				i.setAttribute("str", n);
				if (m != null) {
					i.setAttribute("align", m)
				}
				if (p != null) {
					i.setAttribute("valign", p)
				}
				i.setAttribute("vertical", (k) ? "1": "0");
				c.appendChild(i)
			}
		},
		begin: function() {
			c.appendChild(g.createElement("begin"))
		},
		moveTo: function(i, l) {
			var k = g.createElement("move");
			k.setAttribute("x", h(i));
			k.setAttribute("y", h(l));
			c.appendChild(k)
		},
		lineTo: function(i, l) {
			var k = g.createElement("line");
			k.setAttribute("x", h(i));
			k.setAttribute("y", h(l));
			c.appendChild(k)
		},
		quadTo: function(k, m, i, l) {
			var n = g.createElement("quad");
			n.setAttribute("x1", h(k));
			n.setAttribute("y1", h(m));
			n.setAttribute("x2", h(i));
			n.setAttribute("y2", h(l));
			c.appendChild(n)
		},
		curveTo: function(m, o, k, n, i, l) {
			var p = g.createElement("curve");
			p.setAttribute("x1", h(m));
			p.setAttribute("y1", h(o));
			p.setAttribute("x2", h(k));
			p.setAttribute("y2", h(n));
			p.setAttribute("x3", h(i));
			p.setAttribute("y3", h(l));
			c.appendChild(p)
		},
		close: function() {
			c.appendChild(g.createElement("close"))
		},
		stroke: function() {
			c.appendChild(g.createElement("stroke"))
		},
		fill: function() {
			c.appendChild(g.createElement("fill"))
		},
		fillAndStroke: function() {
			c.appendChild(g.createElement("fillstroke"))
		},
		shadow: function(k) {
			var i = g.createElement("shadow");
			i.setAttribute("value", k);
			c.appendChild(i)
		},
		clip: function() {
			c.appendChild(g.createElement("clip"))
		}
	}
};
var mxSvgCanvas2D = function(q, i) {
	i = (i != null) ? i: false;
	var t = new mxUrlConverter();
	var r = true;
	var e = true;
	var m = function(w) {
		if (mxClient.IS_VML) {
			return q.ownerDocument.createElement(w)
		} else {
			return q.ownerDocument.createElementNS(mxConstants.NS_SVG, w)
		}
	};
	var b = m("defs");
	if (i) {
		var s = m("style");
		s.setAttribute("type", "text/css");
		mxUtils.write(s, "svg{font-family:" + mxConstants.DEFAULT_FONTFAMILY + ";font-size:" + mxConstants.DEFAULT_FONTSIZE + ";fill:none;stroke-miterlimit:10}");
		if (r) {
			mxUtils.write(s, "rect{shape-rendering:crispEdges}")
		}
		b.appendChild(s)
	}
	q.appendChild(b);
	var v = {
		dx: 0,
		dy: 0,
		scale: 1,
		transform: "",
		fill: null,
		gradient: null,
		stroke: null,
		strokeWidth: 1,
		dashed: false,
		dashpattern: "3 3",
		alpha: 1,
		linecap: "flat",
		linejoin: "miter",
		miterlimit: 10,
		fontColor: "#000000",
		fontSize: mxConstants.DEFAULT_FONTSIZE,
		fontFamily: mxConstants.DEFAULT_FONTFAMILY,
		fontStyle: 0
	};
	var h = true;
	var n = null;
	var f = null;
	var d = null;
	var g = null;
	var o = [];
	var l = 0;
	var k = [];
	var u = function(A, w, z) {
		if (A.charAt(0) == "#") {
			A = A.substring(1)
		}
		if (w.charAt(0) == "#") {
			w = w.substring(1)
		}
		A = A.toLowerCase();
		w = w.toLowerCase();
		var x = null;
		if (z == null || z == mxConstants.DIRECTION_SOUTH) {
			x = "s"
		} else {
			if (z == mxConstants.DIRECTION_EAST) {
				x = "e"
			} else {
				var y = A;
				A = w;
				w = y;
				if (z == mxConstants.DIRECTION_NORTH) {
					x = "s"
				} else {
					if (z == mxConstants.DIRECTION_WEST) {
						x = "e"
					}
				}
			}
		}
		return A + "-" + w + "-" + x
	};
	var c = function(B, w, z) {
		var A = u(B, w, z);
		var y = o[A];
		if (y == null) {
			y = m("linearGradient");
			y.setAttribute("id", ++l);
			y.setAttribute("x1", "0%");
			y.setAttribute("y1", "0%");
			y.setAttribute("x2", "0%");
			y.setAttribute("y2", "0%");
			if (z == null || z == mxConstants.DIRECTION_SOUTH) {
				y.setAttribute("y2", "100%")
			} else {
				if (z == mxConstants.DIRECTION_EAST) {
					y.setAttribute("x2", "100%")
				} else {
					if (z == mxConstants.DIRECTION_NORTH) {
						y.setAttribute("y1", "100%")
					} else {
						if (z == mxConstants.DIRECTION_WEST) {
							y.setAttribute("x1", "100%")
						}
					}
				}
			}
			var x = m("stop");
			x.setAttribute("offset", "0%");
			x.setAttribute("style", "stop-color:" + B);
			y.appendChild(x);
			x = m("stop");
			x.setAttribute("offset", "100%");
			x.setAttribute("style", "stop-color:" + w);
			y.appendChild(x);
			b.appendChild(y);
			o[A] = y
		}
		return y.getAttribute("id")
	};
	var a = function(x, A, z, w) {
		if (x != null) {
			if (A.clip != null) {
				x.setAttribute("clip-path", "url(#" + A.clip + ")");
				A.clip = null
			}
			if (d != null) {
				x.setAttribute("d", d.join(" "));
				d = null;
				if (r && h) {
					x.setAttribute("shape-rendering", "crispEdges");
					A.strokeWidth = Math.max(1, A.strokeWidth)
				}
			}
			if (A.alpha < 1) {
				x.setAttribute("opacity", A.alpha)
			}
			if (z && (A.fill != null || A.gradient != null)) {
				if (A.gradient != null) {
					x.setAttribute("fill", "url(#" + A.gradient + ")")
				} else {
					x.setAttribute("fill", A.fill.toLowerCase())
				}
			} else {
				if (!i) {
					x.setAttribute("fill", "none")
				}
			}
			if (w && A.stroke != null) {
				x.setAttribute("stroke", A.stroke.toLowerCase());
				if (A.strokeWidth != 1) {
					if (x.nodeName == "rect" && r) {
						A.strokeWidth = Math.max(1, A.strokeWidth)
					}
					x.setAttribute("stroke-width", A.strokeWidth)
				}
				if (x.nodeName == "path") {
					if (A.linejoin != null && A.linejoin != "miter") {
						x.setAttribute("stroke-linejoin", A.linejoin)
					}
					if (A.linecap != null) {
						var y = A.linecap;
						if (y == "flat") {
							y = "butt"
						}
						if (y != "butt") {
							x.setAttribute("stroke-linecap", y)
						}
					}
					if (A.miterlimit != null && (!i || A.miterlimit != 10)) {
						x.setAttribute("stroke-miterlimit", A.miterlimit)
					}
				}
				if (A.dashed) {
					x.setAttribute("stroke-dasharray", A.dashpattern)
				}
			}
			if (A.transform.length > 0) {
				x.setAttribute("transform", A.transform)
			}
			q.appendChild(x)
		}
	};
	var p = function(w) {
		return Math.round(parseFloat(w) * 100) / 100
	};
	return {
		getConverter: function() {
			return t
		},
		isAutoAntiAlias: function() {
			return r
		},
		setAutoAntiAlias: function(w) {
			r = w
		},
		isTextEnabled: function() {
			return e
		},
		setTextEnabled: function(w) {
			e = w
		},
		save: function() {
			k.push(v);
			v = mxUtils.clone(v)
		},
		restore: function() {
			v = k.pop()
		},
		scale: function(w) {
			v.scale *= w
		},
		translate: function(x, w) {
			v.dx += x;
			v.dy += w
		},
		rotate: function(x, C, w, z, y) {
			z += v.dx;
			y += v.dy;
			z *= v.scale;
			y *= v.scale;
			if (C ^ w) {
				var B = (C) ? z: 0;
				var E = (C) ? -1 : 1;
				var A = (w) ? y: 0;
				var D = (w) ? -1 : 1;
				v.transform += "translate(" + p(B) + "," + p(A) + ")";
				v.transform += "scale(" + p(E) + "," + p(D) + ")";
				v.transform += "translate(" + p( - B) + " " + p( - A) + ")"
			}
			v.transform += "rotate(" + p(x) + "," + p(z) + "," + p(y) + ")"
		},
		setStrokeWidth: function(w) {
			v.strokeWidth = w * v.scale
		},
		setStrokeColor: function(w) {
			v.stroke = w
		},
		setDashed: function(w) {
			v.dashed = w
		},
		setDashPattern: function(w) {
			v.dashPattern = w
		},
		setLineCap: function(w) {
			v.linecap = w
		},
		setLineJoin: function(w) {
			v.linejoin = w
		},
		setMiterLimit: function(w) {
			v.miterlimit = w
		},
		setFontSize: function(w) {
			v.fontSize = w
		},
		setFontColor: function(w) {
			v.fontColor = w
		},
		setFontFamily: function(w) {
			v.fontFamily = w
		},
		setFontStyle: function(w) {
			v.fontStyle = w
		},
		setAlpha: function(w) {
			v.alpha = w
		},
		setFillColor: function(w) {
			v.fill = w;
			v.gradient = null
		},
		setGradient: function(C, A, z, F, B, D, E) {
			if (C != null && A != null) {
				v.gradient = c(C, A, E);
				v.fill = C
			}
		},
		setGlassGradient: function(z, E, A, C) {
			if (n == null) {
				n = m("linearGradient");
				n.setAttribute("id", "0");
				n.setAttribute("x1", "0%");
				n.setAttribute("y1", "0%");
				n.setAttribute("x2", "0%");
				n.setAttribute("y2", "100%");
				var D = m("stop");
				D.setAttribute("offset", "0%");
				D.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.9");
				n.appendChild(D);
				var B = m("stop");
				B.setAttribute("offset", "100%");
				B.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.1");
				n.appendChild(B);
				if (b.firstChild.nextSibling != null) {
					b.insertBefore(n, b.firstChild.nextSibling)
				} else {
					b.appendChild(n)
				}
			}
			v.gradient = "0"
		},
		rect: function(z, C, A, B) {
			z += v.dx;
			C += v.dy;
			f = m("rect");
			f.setAttribute("x", p(z * v.scale));
			f.setAttribute("y", p(C * v.scale));
			f.setAttribute("width", p(A * v.scale));
			f.setAttribute("height", p(B * v.scale));
			if (!i && r) {
				f.setAttribute("shape-rendering", "crispEdges")
			}
		},
		roundrect: function(z, E, B, D, C, A) {
			z += v.dx;
			E += v.dy;
			f = m("rect");
			f.setAttribute("x", p(z * v.scale));
			f.setAttribute("y", p(E * v.scale));
			f.setAttribute("width", p(B * v.scale));
			f.setAttribute("height", p(D * v.scale));
			if (C > 0) {
				f.setAttribute("rx", p(C * v.scale))
			}
			if (A > 0) {
				f.setAttribute("ry", p(A * v.scale))
			}
			if (!i && r) {
				f.setAttribute("shape-rendering", "crispEdges")
			}
		},
		ellipse: function(z, C, A, B) {
			z += v.dx;
			C += v.dy;
			f = m("ellipse");
			f.setAttribute("cx", p((z + A / 2) * v.scale));
			f.setAttribute("cy", p((C + B / 2) * v.scale));
			f.setAttribute("rx", p(A / 2 * v.scale));
			f.setAttribute("ry", p(B / 2 * v.scale))
		},
		image: function(J, H, K, D, z, A, F, B) {
			z = t.convert(z);
			A = (A != null) ? A: true;
			F = (F != null) ? F: false;
			B = (B != null) ? B: false;
			J += v.dx;
			H += v.dy;
			var C = m("image");
			C.setAttribute("x", p(J * v.scale));
			C.setAttribute("y", p(H * v.scale));
			C.setAttribute("width", p(K * v.scale));
			C.setAttribute("height", p(D * v.scale));
			if (mxClient.IS_VML) {
				C.setAttribute("xlink:href", z)
			} else {
				C.setAttributeNS(mxConstants.NS_XLINK, "xlink:href", z)
			}
			if (!A) {
				C.setAttribute("preserveAspectRatio", "none")
			}
			if (v.alpha < 1) {
				C.setAttribute("opacity", v.alpha)
			}
			var E = v.transform;
			if (F || B) {
				var I = 1;
				var G = 1;
				var M = 0;
				var L = 0;
				if (F) {
					I = -1;
					M = -K - 2 * J
				}
				if (B) {
					G = -1;
					L = -D - 2 * H
				}
				E += "scale(" + I + "," + G + ")translate(" + M + "," + L + ")"
			}
			if (E.length > 0) {
				C.setAttribute("transform", E)
			}
			q.appendChild(C)
		},
		text: function(J, I, L, S, O, Q, G, C) {
			if (e) {
				J += v.dx;
				I += v.dy;
				var N = Math.floor(v.fontSize);
				var P = m("g");
				var B = v.transform;
				if (C) {
					var F = J + L / 2;
					var D = I + S / 2;
					B += "rotate(-90," + p(F * v.scale) + "," + p(D * v.scale) + ")"
				}
				if (B.length > 0) {
					P.setAttribute("transform", B)
				}
				if (v.alpha < 1) {
					P.setAttribute("opacity", v.alpha)
				}
				var H = (Q == mxConstants.ALIGN_RIGHT) ? "end": (Q == mxConstants.ALIGN_CENTER) ? "middle": "start";
				if (H == "end") {
					J += Math.max(0, L - 2)
				} else {
					if (H == "middle") {
						J += L / 2
					} else {
						J += (L > 0) ? 2 : 0
					}
				}
				if ((v.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
					P.setAttribute("font-weight", "bold")
				}
				if ((v.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
					P.setAttribute("font-style", "italic")
				}
				if ((v.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
					P.setAttribute("text-decoration", "underline")
				}
				if (H != "start") {
					P.setAttribute("text-anchor", H)
				}
				if (!i || N != mxConstants.DEFAULT_FONTSIZE) {
					P.setAttribute("font-size", Math.floor(N * v.scale) + "px")
				}
				if (!i || v.fontFamily != mxConstants.DEFAULT_FONTFAMILY) {
					P.setAttribute("font-family", v.fontFamily)
				}
				P.setAttribute("fill", v.fontColor);
				var A = O.split("\n");
				var E = N * 1.25;
				var z = (S > 0) ? N + (A.length - 1) * E: A.length * E - 1;
				var K = S - z;
				if (G == null || G == mxConstants.ALIGN_TOP) {
					I = Math.max(I - 3 * v.scale, I + K / 2 + ((S > 0) ? E / 2 - 8 : 0))
				} else {
					if (G == mxConstants.ALIGN_MIDDLE) {
						I = I + K / 2
					} else {
						if (G == mxConstants.ALIGN_BOTTOM) {
							I = Math.min(I, I + K + 2 * v.scale)
						}
					}
				}
				I += N;
				for (var R = 0; R < A.length; R++) {
					var M = m("text");
					M.setAttribute("x", p(J * v.scale));
					M.setAttribute("y", p(I * v.scale));
					mxUtils.write(M, A[R]);
					P.appendChild(M);
					I += N * 1.3
				}
				q.appendChild(P)
			}
		},
		begin: function() {
			f = m("path");
			d = [];
			g = null;
			h = true
		},
		moveTo: function(w, z) {
			if (d != null) {
				w += v.dx;
				z += v.dy;
				d.push("M " + p(w * v.scale) + " " + p(z * v.scale));
				if (r) {
					g = new mxPoint(w, z)
				}
			}
		},
		lineTo: function(w, z) {
			if (d != null) {
				w += v.dx;
				z += v.dy;
				d.push("L " + p(w * v.scale) + " " + p(z * v.scale));
				if (r) {
					if (g != null && h && w != g.x && z != g.y) {
						h = false
					}
					g = new mxPoint(w, z)
				}
			}
		},
		quadTo: function(x, z, w, y) {
			if (d != null) {
				x += v.dx;
				z += v.dy;
				w += v.dx;
				y += v.dy;
				d.push("Q " + p(x * v.scale) + " " + p(z * v.scale) + " " + p(w * v.scale) + " " + p(y * v.scale));
				h = false
			}
		},
		curveTo: function(z, B, x, A, w, y) {
			if (d != null) {
				z += v.dx;
				B += v.dy;
				x += v.dx;
				A += v.dy;
				w += v.dx;
				y += v.dy;
				d.push("C " + p(z * v.scale) + " " + p(B * v.scale) + " " + p(x * v.scale) + " " + p(A * v.scale) + " " + p(w * v.scale) + " " + p(y * v.scale));
				h = false
			}
		},
		close: function() {
			if (d != null) {
				d.push("Z")
			}
		},
		stroke: function() {
			a(f, v, false, true)
		},
		fill: function() {
			a(f, v, true, false)
		},
		fillAndStroke: function() {
			a(f, v, true, true)
		},
		shadow: function(w) {
			this.save();
			this.setStrokeColor(w);
			this.setFillColor(w);
			this.fillAndStroke();
			this.restore()
		},
		clip: function() {
			if (f != null) {
				if (d != null) {
					f.setAttribute("d", d.join(" "));
					d = null
				}
				var x = ++l;
				var w = m("clipPath");
				w.setAttribute("id", x);
				w.appendChild(f);
				b.appendChild(w);
				v.clip = x
			}
		}
	}
};
function mxGuide(b, a) {
	this.graph = b;
	this.setStates(a)
}
mxGuide.prototype.graph = null;
mxGuide.prototype.states = null;
mxGuide.prototype.horizontal = true;
mxGuide.prototype.vertical = true;
mxGuide.prototype.guideX = null;
mxGuide.prototype.guideY = null;
mxGuide.prototype.crisp = true;
mxGuide.prototype.setStates = function(a) {
	this.states = a
};
mxGuide.prototype.isEnabledForEvent = function(a) {
	return true
};
mxGuide.prototype.getGuideTolerance = function() {
	return this.graph.gridSize * this.graph.view.scale / 2
};
mxGuide.prototype.createGuideShape = function(b) {
	var a = new mxPolyline([], mxConstants.GUIDE_COLOR, mxConstants.GUIDE_STROKEWIDTH);
	a.crisp = this.crisp;
	a.isDashed = true;
	return a
};
mxGuide.prototype.move = function(k, w, t) {
	if (this.states != null && (this.horizontal || this.vertical) && k != null && w != null) {
		var m = this.graph.getView().translate;
		var B = this.graph.getView().scale;
		var o = w.x;
		var n = w.y;
		var d = false;
		var c = false;
		var a = this.getGuideTolerance();
		var s = a;
		var r = a;
		var x = k.clone();
		x.x += w.x;
		x.y += w.y;
		var e = x.x;
		var u = x.x + x.width;
		var y = x.getCenterX();
		var p = x.y;
		var l = x.y + x.height;
		var A = x.getCenterY();
		function h(b) {
			var i = false;
			if (Math.abs(b - y) < s) {
				o = b - k.getCenterX();
				s = Math.abs(b - y);
				i = true
			} else {
				if (Math.abs(b - e) < s) {
					o = b - k.x;
					s = Math.abs(b - e);
					i = true
				} else {
					if (Math.abs(b - u) < s) {
						o = b - k.x - k.width;
						s = Math.abs(b - u);
						i = true
					}
				}
			}
			if (i) {
				if (this.guideX == null) {
					this.guideX = this.createGuideShape(true);
					this.guideX.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
					this.guideX.init(this.graph.getView().getOverlayPane())
				}
				var C = this.graph.container;
				this.guideX.points = [new mxPoint(b, 0), new mxPoint(b, C.scrollHeight - 3)]
			}
			d = d || i
		}
		function g(C) {
			var b = false;
			if (Math.abs(C - A) < r) {
				n = C - k.getCenterY();
				r = Math.abs(C - A);
				b = true
			} else {
				if (Math.abs(C - p) < r) {
					n = C - k.y;
					r = Math.abs(C - p);
					b = true
				} else {
					if (Math.abs(C - l) < r) {
						n = C - k.y - k.height;
						r = Math.abs(C - l);
						b = true
					}
				}
			}
			if (b) {
				if (this.guideY == null) {
					this.guideY = this.createGuideShape(false);
					this.guideY.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
					this.guideY.init(this.graph.getView().getOverlayPane())
				}
				var i = this.graph.container;
				this.guideY.points = [new mxPoint(0, C), new mxPoint(i.scrollWidth - 3, C)]
			}
			c = c || b
		}
		for (var q = 0; q < this.states.length; q++) {
			var f = this.states[q];
			if (f != null) {
				if (this.horizontal) {
					h.call(this, f.getCenterX());
					h.call(this, f.x);
					h.call(this, f.x + f.width)
				}
				if (this.vertical) {
					g.call(this, f.getCenterY());
					g.call(this, f.y);
					g.call(this, f.y + f.height)
				}
			}
		}
		if (!d && this.guideX != null) {
			this.guideX.node.style.visibility = "hidden"
		} else {
			if (this.guideX != null) {
				this.guideX.node.style.visibility = "visible";
				this.guideX.redraw()
			}
		}
		if (!c && this.guideY != null) {
			this.guideY.node.style.visibility = "hidden"
		} else {
			if (this.guideY != null) {
				this.guideY.node.style.visibility = "visible";
				this.guideY.redraw()
			}
		}
		if (t) {
			if (!d) {
				var z = k.x - (this.graph.snap(k.x / B - m.x) + m.x) * B;
				o = this.graph.snap(o / B) * B - z
			}
			if (!c) {
				var v = k.y - (this.graph.snap(k.y / B - m.y) + m.y) * B;
				n = this.graph.snap(n / B) * B - v
			}
		}
		w = new mxPoint(o, n)
	}
	return w
};
mxGuide.prototype.hide = function() {
	if (this.guideX != null) {
		this.guideX.node.style.visibility = "hidden"
	}
	if (this.guideY != null) {
		this.guideY.node.style.visibility = "hidden"
	}
};
mxGuide.prototype.destroy = function() {
	if (this.guideX != null) {
		this.guideX.destroy();
		this.guideX = null
	}
	if (this.guideY != null) {
		this.guideY.destroy();
		this.guideY = null
	}
};
function mxShape() {}
mxShape.prototype.SVG_STROKE_TOLERANCE = 8;
mxShape.prototype.scale = 1;
mxShape.prototype.dialect = null;
mxShape.prototype.crisp = false;
mxShape.prototype.mixedModeHtml = true;
mxShape.prototype.preferModeHtml = true;
mxShape.prototype.bounds = null;
mxShape.prototype.points = null;
mxShape.prototype.node = null;
mxShape.prototype.label = null;
mxShape.prototype.innerNode = null;
mxShape.prototype.style = null;
mxShape.prototype.startOffset = null;
mxShape.prototype.endOffset = null;
mxShape.prototype.vmlNodes = ["node", "strokeNode", "fillNode", "shadowNode"];
mxShape.prototype.init = function(b) {
	if (this.node == null) {
		this.node = this.create(b);
		if (b != null) {
			var a = document.documentMode == 8 && mxUtils.isVml(this.node);
			if (a) {
				for (var c = 0; c < this.vmlNodes.length; c++) {
					if (this[this.vmlNodes[c]] != null) {
						this[this.vmlNodes[c]].setAttribute("id", "mxTemporaryReference-" + this.vmlNodes[c])
					}
				}
				b.insertAdjacentHTML("beforeEnd", this.node.outerHTML);
				for (var c = 0; c < this.vmlNodes.length; c++) {
					if (this[this.vmlNodes[c]] != null) {
						this[this.vmlNodes[c]] = b.ownerDocument.getElementById("mxTemporaryReference-" + this.vmlNodes[c]);
						this[this.vmlNodes[c]].removeAttribute("id")
					}
				}
			} else {
				b.appendChild(this.node)
			}
		}
	}
	if (this.insertGradientNode != null) {
		this.insertGradient(this.insertGradientNode);
		this.insertGradientNode = null
	}
};
mxShape.prototype.insertGradient = function(d) {
	if (d != null) {
		var c = 0;
		var f = d.getAttribute("id");
		var e = document.getElementById(f);
		while (e != null && e.ownerSVGElement != this.node.ownerSVGElement) {
			c++;
			f = d.getAttribute("id") + "-" + c;
			e = document.getElementById(f)
		}
		if (e == null) {
			d.setAttribute("id", f);
			this.node.ownerSVGElement.appendChild(d);
			e = d
		}
		if (e != null) {
			var b = "url(#" + f + ")";
			var a = (this.innerNode != null) ? this.innerNode: this.node;
			if (a != null && a.getAttribute("fill") != b) {
				a.setAttribute("fill", b)
			}
		}
	}
};
mxShape.prototype.isMixedModeHtml = function() {
	return this.mixedModeHtml && !this.isRounded && !this.isShadow && this.gradient == null && mxUtils.getValue(this.style, mxConstants.STYLE_GLASS, 0) == 0
};
mxShape.prototype.create = function(a) {
	var b = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		b = this.createSvg()
	} else {
		if (this.dialect == mxConstants.DIALECT_STRICTHTML || (this.preferModeHtml && this.dialect == mxConstants.DIALECT_PREFERHTML) || (this.isMixedModeHtml() && this.dialect == mxConstants.DIALECT_MIXEDHTML)) {
			b = this.createHtml()
		} else {
			b = this.createVml()
		}
	}
	return b
};
mxShape.prototype.createHtml = function() {
	var a = document.createElement("DIV");
	this.configureHtmlShape(a);
	return a
};
mxShape.prototype.destroy = function() {
	if (this.node != null) {
		mxEvent.release(this.node);
		if (this.node.parentNode != null) {
			this.node.parentNode.removeChild(this.node)
		}
		if (this.node.glassOverlay) {
			this.node.glassOverlay.parentNode.removeChild(this.node.glassOverlay);
			this.node.glassOverlay = null
		}
		this.node = null
	}
};
mxShape.prototype.apply = function(b) {
	var a = b.style;
	this.style = a;
	if (a != null) {
		this.fill = mxUtils.getValue(a, mxConstants.STYLE_FILLCOLOR, this.fill);
		this.gradient = mxUtils.getValue(a, mxConstants.STYLE_GRADIENTCOLOR, this.gradient);
		this.gradientDirection = mxUtils.getValue(a, mxConstants.STYLE_GRADIENT_DIRECTION, this.gradientDirection);
		this.opacity = mxUtils.getValue(a, mxConstants.STYLE_OPACITY, this.opacity);
		this.stroke = mxUtils.getValue(a, mxConstants.STYLE_STROKECOLOR, this.stroke);
		this.strokewidth = mxUtils.getNumber(a, mxConstants.STYLE_STROKEWIDTH, this.strokewidth);
		this.isShadow = mxUtils.getValue(a, mxConstants.STYLE_SHADOW, this.isShadow);
		this.isDashed = mxUtils.getValue(a, mxConstants.STYLE_DASHED, this.isDashed);
		this.spacing = mxUtils.getValue(a, mxConstants.STYLE_SPACING, this.spacing);
		this.startSize = mxUtils.getNumber(a, mxConstants.STYLE_STARTSIZE, this.startSize);
		this.endSize = mxUtils.getNumber(a, mxConstants.STYLE_ENDSIZE, this.endSize);
		this.isRounded = mxUtils.getValue(a, mxConstants.STYLE_ROUNDED, this.isRounded);
		this.startArrow = mxUtils.getValue(a, mxConstants.STYLE_STARTARROW, this.startArrow);
		this.endArrow = mxUtils.getValue(a, mxConstants.STYLE_ENDARROW, this.endArrow);
		this.rotation = mxUtils.getValue(a, mxConstants.STYLE_ROTATION, this.rotation);
		this.direction = mxUtils.getValue(a, mxConstants.STYLE_DIRECTION, this.direction);
		if (this.fill == "none") {
			this.fill = null
		}
		if (this.gradient == "none") {
			this.gradient = null
		}
		if (this.stroke == "none") {
			this.stroke = null
		}
	}
};
mxShape.prototype.createSvgGroup = function(a) {
	var b = document.createElementNS(mxConstants.NS_SVG, "g");
	this.innerNode = document.createElementNS(mxConstants.NS_SVG, a);
	this.configureSvgShape(this.innerNode);
	if (a == "rect" && this.strokewidth * this.scale >= 1 && !this.isRounded) {
		this.innerNode.setAttribute("shape-rendering", "optimizeSpeed")
	}
	this.shadowNode = this.createSvgShadow(this.innerNode);
	if (this.shadowNode != null) {
		b.appendChild(this.shadowNode)
	}
	b.appendChild(this.innerNode);
	return b
};
mxShape.prototype.createSvgShadow = function(a) {
	if (this.isShadow && this.fill != null) {
		var b = a.cloneNode(true);
		b.setAttribute("stroke", mxConstants.SHADOWCOLOR);
		b.setAttribute("fill", mxConstants.SHADOWCOLOR);
		b.setAttribute("transform", mxConstants.SVG_SHADOWTRANSFORM);
		b.setAttribute("opacity", mxConstants.SHADOW_OPACITY);
		return b
	}
	return null
};
mxShape.prototype.configureHtmlShape = function(b) {
	if (mxUtils.isVml(b)) {
		this.configureVmlShape(b)
	} else {
		b.style.position = "absolute";
		b.style.overflow = "hidden";
		var a = this.stroke;
		if (a != null && a != mxConstants.NONE) {
			b.style.borderColor = a;
			if (this.isDashed) {
				b.style.borderStyle = "dashed"
			} else {
				if (this.strokewidth > 0) {
					b.style.borderStyle = "solid"
				}
			}
			b.style.borderWidth = Math.ceil(this.strokewidth * this.scale) + "px"
		} else {
			b.style.borderWidth = "0px"
		}
		a = this.fill;
		b.style.background = "";
		if (a != null && a != mxConstants.NONE) {
			b.style.backgroundColor = a
		} else {
			if (this.points == null) {
				this.configureTransparentBackground(b)
			}
		}
		if (this.opacity != null) {
			mxUtils.setOpacity(b, this.opacity)
		}
	}
};
mxShape.prototype.updateVmlFill = function(d, c, b, a, e) {
	d.color = c;
	if (e != null && e != 100) {
		d.opacity = e + "%";
		if (b != null) {
			d.setAttribute("o:opacity2", e + "%")
		}
	}
	if (b != null) {
		d.type = "gradient";
		d.color2 = b;
		var f = "180";
		if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
			f = "270"
		} else {
			if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
				f = "90"
			} else {
				if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
					f = "0"
				}
			}
		}
		d.angle = f
	}
};
mxShape.prototype.updateVmlStrokeNode = function(a) {
	if (this.strokeNode == null) {
		this.strokeNode = document.createElement("v:stroke");
		this.strokeNode.joinstyle = "miter";
		this.strokeNode.miterlimit = 4;
		a.appendChild(this.strokeNode)
	}
	if (this.opacity != null) {
		this.strokeNode.opacity = this.opacity + "%"
	}
	this.updateVmlDashStyle()
};
mxShape.prototype.updateVmlStrokeColor = function(b) {
	var a = this.stroke;
	if (a != null && a != mxConstants.NONE) {
		b.stroked = "true";
		b.strokecolor = a
	} else {
		b.stroked = "false"
	}
};
mxShape.prototype.configureVmlShape = function(b) {
	b.style.position = "absolute";
	this.updateVmlStrokeColor(b);
	b.style.background = "";
	var a = this.fill;
	if (a != null && a != mxConstants.NONE) {
		if (this.fillNode == null) {
			this.fillNode = document.createElement("v:fill");
			b.appendChild(this.fillNode)
		}
		this.updateVmlFill(this.fillNode, a, this.gradient, this.gradientDirection, this.opacity)
	} else {
		b.filled = "false";
		if (this.points == null) {
			this.configureTransparentBackground(b)
		}
	}
	this.updateVmlStrokeNode(b);
	if (this.isShadow && this.fill != null) {
		if (this.shadowNode == null) {
			this.shadowNode = document.createElement("v:shadow");
			this.shadowNode.on = "true";
			this.shadowNode.color = mxConstants.SHADOWCOLOR;
			this.shadowNode.opacity = (mxConstants.SHADOW_OPACITY * 100) + "%";
			this.shadowNode.offset = mxConstants.SHADOW_OFFSET_X + "px," + mxConstants.SHADOW_OFFSET_Y + "px";
			b.appendChild(this.shadowNode)
		}
	}
	if (b.nodeName == "roundrect") {
		try {
			var c = mxConstants.RECTANGLE_ROUNDING_FACTOR * 100;
			if (this.style != null) {
				c = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, c)
			}
			b.setAttribute("arcsize", String(c) + "%")
		} catch(d) {}
	}
};
mxShape.prototype.configureTransparentBackground = function(a) {
	a.style.background = "url('" + mxClient.imageBasePath + "/transparent.gif')"
};
mxShape.prototype.configureSvgShape = function(c) {
	var b = this.stroke;
	if (b != null && b != mxConstants.NONE) {
		c.setAttribute("stroke", b)
	} else {
		c.setAttribute("stroke", "none")
	}
	if (this.isDashed) {
		var a = Math.max(1, Math.round(3 * this.scale));
		c.setAttribute("stroke-dasharray", a + "," + a)
	}
	b = this.fill;
	if (b != null && b != mxConstants.NONE) {
		if (this.gradient != null) {
			var d = this.getGradientId(b, this.gradient);
			if (this.gradientNode != null && this.gradientNode.getAttribute("id") != d) {
				this.gradientNode = null;
				c.setAttribute("fill", "")
			}
			if (this.gradientNode == null) {
				this.gradientNode = this.createSvgGradient(d, b, this.gradient, c);
				c.setAttribute("fill", "url(#" + d + ")")
			}
		} else {
			this.gradientNode = null;
			c.setAttribute("fill", b)
		}
	} else {
		c.setAttribute("fill", "none")
	}
	if (this.opacity != null) {
		c.setAttribute("fill-opacity", this.opacity / 100);
		c.setAttribute("stroke-opacity", this.opacity / 100)
	}
};
mxShape.prototype.getGradientId = function(d, a) {
	if (d.charAt(0) == "#") {
		d = d.substring(1)
	}
	if (a.charAt(0) == "#") {
		a = a.substring(1)
	}
	d = d.toLowerCase();
	a = a.toLowerCase();
	var b = null;
	if (this.gradientDirection == null || this.gradientDirection == mxConstants.DIRECTION_SOUTH) {
		b = "south"
	} else {
		if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
			b = "east"
		} else {
			var c = d;
			d = a;
			a = c;
			if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
				b = "south"
			} else {
				if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
					b = "east"
				}
			}
		}
	}
	return "mx-gradient-" + d + "-" + a + "-" + b
};
mxShape.prototype.createSvgPipe = function(e, d, a, c) {
	var b = document.createElementNS(mxConstants.NS_SVG, "path");
	b.setAttribute("pointer-events", "stroke");
	b.setAttribute("fill", "none");
	b.setAttribute("visibility", "hidden");
	b.setAttribute("stroke", (mxClient.IS_OP) ? "none": "white");
	return b
};
mxShape.prototype.createSvgGradient = function(f, e, a, c) {
	var d = this.insertGradientNode;
	if (d == null) {
		d = document.createElementNS(mxConstants.NS_SVG, "linearGradient");
		d.setAttribute("id", f);
		d.setAttribute("x1", "0%");
		d.setAttribute("y1", "0%");
		d.setAttribute("x2", "0%");
		d.setAttribute("y2", "0%");
		if (this.gradientDirection == null || this.gradientDirection == mxConstants.DIRECTION_SOUTH) {
			d.setAttribute("y2", "100%")
		} else {
			if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
				d.setAttribute("x2", "100%")
			} else {
				if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
					d.setAttribute("y1", "100%")
				} else {
					if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
						d.setAttribute("x1", "100%")
					}
				}
			}
		}
		var b = document.createElementNS(mxConstants.NS_SVG, "stop");
		b.setAttribute("offset", "0%");
		b.setAttribute("style", "stop-color:" + e);
		d.appendChild(b);
		b = document.createElementNS(mxConstants.NS_SVG, "stop");
		b.setAttribute("offset", "100%");
		b.setAttribute("style", "stop-color:" + a);
		d.appendChild(b)
	}
	this.insertGradientNode = d;
	return d
};
mxShape.prototype.createPoints = function(u, b, n, h) {
	var q = (h) ? this.bounds.x: 0;
	var p = (h) ? this.bounds.y: 0;
	var r = (this.crisp && this.dialect == mxConstants.DIALECT_SVG && mxClient.IS_IE) ? 0.5 : 0;
	if (isNaN(this.points[0].x) || isNaN(this.points[0].y)) {
		return null
	}
	var e = mxConstants.LINE_ARCSIZE * this.scale;
	var a = this.points[0];
	if (this.startOffset != null) {
		a = a.clone();
		a.x += this.startOffset.x;
		a.y += this.startOffset.y
	}
	var m = u + " " + (Math.round(a.x - q) + r) + " " + (Math.round(a.y - p) + r) + " ";
	for (var o = 1; o < this.points.length; o++) {
		a = this.points[o - 1];
		var g = this.points[o];
		if (isNaN(g.x) || isNaN(g.y)) {
			return null
		}
		if (o == this.points.length - 1 && this.endOffset != null) {
			g = g.clone();
			g.x += this.endOffset.x;
			g.y += this.endOffset.y
		}
		var d = a.x - g.x;
		var c = a.y - g.y;
		if ((this.isRounded && o < this.points.length - 1) && (d != 0 || c != 0) && this.scale > 0.3) {
			var k = Math.sqrt(d * d + c * c);
			var l = d * Math.min(e, k / 2) / k;
			var v = c * Math.min(e, k / 2) / k;
			m += b + " " + (Math.round(g.x + l - q) + r) + " " + (Math.round(g.y + v - p) + r) + " ";
			var t = this.points[o + 1];
			d = t.x - g.x;
			c = t.y - g.y;
			k = Math.max(1, Math.sqrt(d * d + c * c));
			if (k != 0) {
				var f = d * Math.min(e, k / 2) / k;
				var s = c * Math.min(e, k / 2) / k;
				m += n + " " + Math.round(g.x - q) + " " + Math.round(g.y - p) + " " + Math.round(g.x - q) + "," + Math.round(g.y - p) + " " + (Math.round(g.x + f - q) + r) + " " + (Math.round(g.y + s - p) + r) + " "
			}
		} else {
			m += b + " " + (Math.round(g.x - q) + r) + " " + (Math.round(g.y - p) + r) + " "
		}
	}
	return m
};
mxShape.prototype.updateHtmlShape = function(t) {
	if (t != null) {
		if (mxUtils.isVml(t)) {
			this.updateVmlShape(t)
		} else {
			t.style.borderWidth = Math.max(1, Math.round(this.strokewidth * this.scale)) + "px";
			if (this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) && !isNaN(this.bounds.width) && !isNaN(this.bounds.height)) {
				var p = Math.ceil(this.strokewidth * this.scale);
				t.style.left = Math.round(this.bounds.x - p / 2) + "px";
				t.style.top = Math.round(this.bounds.y - p / 2) + "px";
				if (document.compatMode == "CSS1Compat") {
					p = -p
				}
				t.style.width = Math.round(Math.max(0, this.bounds.width + p)) + "px";
				t.style.height = Math.round(Math.max(0, this.bounds.height + p)) + "px"
			}
		}
		if (this.points != null && this.bounds != null && !mxUtils.isVml(t)) {
			if (this.divContainer == null) {
				this.divContainer = t
			}
			while (this.divContainer.firstChild != null) {
				mxEvent.release(this.divContainer.firstChild);
				this.divContainer.removeChild(this.divContainer.firstChild)
			}
			t.style.borderStyle = "";
			t.style.background = "";
			if (this.points.length == 2) {
				var a = this.points[0];
				var E = this.points[1];
				var m = E.x - a.x;
				var l = E.y - a.y;
				if (m == 0 || l == 0) {
					t.style.borderStyle = "solid"
				} else {
					t.style.width = Math.round(this.bounds.width + 1) + "px";
					t.style.height = Math.round(this.bounds.height + 1) + "px";
					var c = Math.sqrt(m * m + l * l);
					var b = 1 + (c / (8 * this.scale));
					var B = m / b;
					var A = l / b;
					var g = a.x - this.bounds.x;
					var f = a.y - this.bounds.y;
					for (var u = 0; u < b; u++) {
						var C = document.createElement("DIV");
						C.style.position = "absolute";
						C.style.overflow = "hidden";
						C.style.left = Math.round(g) + "px";
						C.style.top = Math.round(f) + "px";
						C.style.width = Math.max(1, 2 * this.scale) + "px";
						C.style.height = Math.max(1, 2 * this.scale) + "px";
						C.style.backgroundColor = this.stroke;
						this.divContainer.appendChild(C);
						g += B;
						f += A
					}
				}
			} else {
				if (this.points.length == 3) {
					var D = this.points[1];
					var r = "0";
					var o = "1";
					var k = "0";
					var z = "1";
					if (D.x == this.bounds.x) {
						z = "0";
						k = "1"
					}
					if (D.y == this.bounds.y) {
						r = "1";
						o = "0"
					}
					t.style.borderStyle = "solid";
					t.style.borderWidth = r + " " + z + " " + o + " " + k + "px"
				} else {
					t.style.width = Math.round(this.bounds.width + 1) + "px";
					t.style.height = Math.round(this.bounds.height + 1) + "px";
					var d = this.points[0];
					for (var u = 1; u < this.points.length; u++) {
						var q = this.points[u];
						var C = document.createElement("DIV");
						C.style.position = "absolute";
						C.style.overflow = "hidden";
						C.style.borderColor = this.stroke;
						C.style.borderStyle = "solid";
						C.style.borderWidth = "1 0 0 1px";
						var g = Math.min(q.x, d.x) - this.bounds.x;
						var f = Math.min(q.y, d.y) - this.bounds.y;
						var k = Math.max(1, Math.abs(q.x - d.x));
						var v = Math.max(1, Math.abs(q.y - d.y));
						C.style.left = g + "px";
						C.style.top = f + "px";
						C.style.width = k + "px";
						C.style.height = v + "px";
						this.divContainer.appendChild(C);
						d = q
					}
				}
			}
		}
	}
};
mxShape.prototype.updateVmlDashStyle = function() {
	if (this.isDashed) {
		var a = Math.max(1, Math.round(4 / this.strokewidth * this.scale));
		var b = a + " " + (a - 1);
		if (this.strokeNode.dashstyle != b) {
			this.strokeNode.dashstyle = b
		}
	} else {
		if (this.strokeNode.dashstyle != "solid") {
			this.strokeNode.dashstyle = "solid"
		}
	}
};
mxShape.prototype.updateVmlShape = function(c) {
	c.strokeweight = (this.strokewidth * this.scale) + "px";
	if (this.strokeNode != null) {
		this.updateVmlDashStyle()
	}
	if (this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) && !isNaN(this.bounds.width) && !isNaN(this.bounds.height)) {
		if (c.parentNode != this.node) {
			c.style.left = Math.round(this.bounds.x) + "px";
			c.style.top = Math.round(this.bounds.y) + "px";
			if (this.points == null) {
				if (this.rotation != null && this.rotation != 0) {
					c.style.rotation = this.rotation
				} else {
					if (c.style.rotation != null) {
						c.style.rotation = ""
					}
				}
			}
		}
		var g = Math.max(0, Math.round(this.bounds.width));
		var e = Math.max(0, Math.round(this.bounds.height));
		c.style.width = g + "px";
		c.style.height = e + "px";
		if (this.points != null || c.nodeName == "shape" || c.nodeName == "group") {
			c.coordsize = g + "," + e
		}
	}
	if (this.points != null && c.nodeName != "group") {
		if (c.nodeName == "polyline" && c.points != null) {
			var k = "";
			for (var d = 0; d < this.points.length; d++) {
				k += this.points[d].x + "," + this.points[d].y + " "
			}
			c.points.value = k;
			c.style.left = null;
			c.style.top = null;
			c.style.width = null;
			c.style.height = null
		} else {
			if (this.bounds != null) {
				var k = this.createPoints("m", "l", "c", true);
				if (this.style != null && this.style[mxConstants.STYLE_SMOOTH]) {
					var l = this.points;
					var b = l.length;
					if (b > 3) {
						var a = this.bounds.x;
						var f = this.bounds.y;
						k = "m " + Math.round(l[0].x - a) + " " + Math.round(l[0].y - f) + " qb";
						for (var d = 1; d < b - 1; d++) {
							k += " " + Math.round(l[d].x - a) + " " + Math.round(l[d].y - f)
						}
						k += " nf l " + Math.round(l[b - 1].x - a) + " " + Math.round(l[b - 1].y - f)
					}
				}
				c.path = k + " e"
			}
		}
	}
};
mxShape.prototype.updateSvgShape = function(c) {
	var o = Math.round(Math.max(1, this.strokewidth * this.scale));
	c.setAttribute("stroke-width", o);
	if (this.crisp) {
		c.setAttribute("shape-rendering", "crispEdges")
	} else {
		c.removeAttribute("shape-rendering")
	}
	if (this.points != null && this.points[0] != null) {
		var m = this.createPoints("M", "L", "C", false);
		if (m != null) {
			c.setAttribute("d", m);
			if (this.style != null && this.style[mxConstants.STYLE_SMOOTH]) {
				var t = this.points;
				var b = t.length;
				if (b > 3) {
					var s = "M " + t[0].x + " " + t[0].y + " ";
					s += " Q " + t[1].x + " " + t[1].y + "  " + t[2].x + " " + t[2].y;
					for (var e = 3; e < b; e++) {
						s += " T " + t[e].x + " " + t[e].y
					}
					c.setAttribute("d", s)
				}
			}
			c.removeAttribute("x");
			c.removeAttribute("y");
			c.removeAttribute("width");
			c.removeAttribute("height")
		}
	} else {
		if (this.bounds != null) {
			var l = (this.crisp && mxClient.IS_IE) ? 0.5 : 0;
			c.setAttribute("x", Math.round(this.bounds.x) + l);
			c.setAttribute("y", Math.round(this.bounds.y) + l);
			var q = Math.round(this.bounds.width);
			var g = Math.round(this.bounds.height);
			c.setAttribute("width", q);
			c.setAttribute("height", g);
			if (this.isRounded) {
				var k = mxConstants.RECTANGLE_ROUNDING_FACTOR * 100;
				if (this.style != null) {
					k = mxUtils.getValue(this.style, mxConstants.STYLE_ARCSIZE, k) / 100
				}
				var a = Math.min(q * k, g * k);
				c.setAttribute("rx", a);
				c.setAttribute("ry", a)
			}
			this.updateSvgTransform(c, c == this.shadowNode)
		}
	}
	if (this.isDashed) {
		var p = Math.max(1, Math.round(3 * this.scale));
		c.setAttribute("stroke-dasharray", p + "," + p)
	}
};
mxShape.prototype.updateSvgTransform = function(b, d) {
	if (this.rotation != null && this.rotation != 0) {
		var a = this.bounds.x + this.bounds.width / 2;
		var c = this.bounds.y + this.bounds.height / 2;
		if (d) {
			b.setAttribute("transform", "rotate(" + this.rotation + "," + a + "," + c + ") " + mxConstants.SVG_SHADOWTRANSFORM)
		} else {
			b.setAttribute("transform", "rotate(" + this.rotation + "," + a + "," + c + ")")
		}
	} else {
		if (d) {
			b.setAttribute("transform", mxConstants.SVG_SHADOWTRANSFORM)
		} else {
			b.removeAttribute("transform")
		}
	}
};
mxShape.prototype.reconfigure = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		if (this.innerNode != null) {
			this.configureSvgShape(this.innerNode)
		} else {
			this.configureSvgShape(this.node)
		}
		if (this.insertGradientNode != null) {
			this.insertGradient(this.insertGradientNode);
			this.insertGradientNode = null
		}
	} else {
		if (mxUtils.isVml(this.node)) {
			this.node.style.visibility = "hidden";
			this.configureVmlShape(this.node);
			this.node.style.visibility = "visible"
		} else {
			this.node.style.visibility = "hidden";
			this.configureHtmlShape(this.node);
			this.node.style.visibility = "visible"
		}
	}
};
mxShape.prototype.redraw = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		this.redrawSvg()
	} else {
		if (mxUtils.isVml(this.node)) {
			this.node.style.visibility = "hidden";
			this.redrawVml();
			this.node.style.visibility = "visible"
		} else {
			this.redrawHtml()
		}
	}
};
mxShape.prototype.redrawSvg = function() {
	if (this.innerNode != null) {
		this.updateSvgShape(this.innerNode);
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode)
		}
	} else {
		this.updateSvgShape(this.node)
	}
	this.updateSvgGlassPane()
};
mxShape.prototype.updateVmlGlassPane = function() {
	if (this.bounds != null && this.node.nodeName == "group" && this.style != null && mxUtils.getValue(this.style, mxConstants.STYLE_GLASS, 0) == 1) {
		if (this.node.glassOverlay == null) {
			this.node.glassOverlay = document.createElement("v:shape");
			this.node.glassOverlay.setAttribute("filled", "true");
			this.node.glassOverlay.setAttribute("fillcolor", "white");
			this.node.glassOverlay.setAttribute("stroked", "false");
			var e = document.createElement("v:fill");
			e.setAttribute("type", "gradient");
			e.setAttribute("color", "white");
			e.setAttribute("color2", "white");
			e.setAttribute("opacity", "90%");
			e.setAttribute("o:opacity2", "15%");
			e.setAttribute("angle", "180");
			this.node.glassOverlay.appendChild(e);
			this.node.appendChild(this.node.glassOverlay)
		}
		var f = 0.4;
		var c = this.bounds;
		var a = Math.ceil(this.strokewidth * this.scale / 2 + 1);
		var g = "m " + ( - a) + " " + ( - a) + " l " + ( - a) + " " + Math.round(c.height * f) + " c " + Math.round(c.width * 0.3) + " " + Math.round(c.height * 0.6) + " " + Math.round(c.width * 0.7) + " " + Math.round(c.height * 0.6) + " " + Math.round(c.width + a) + " " + Math.round(c.height * f) + " l " + Math.round(c.width + a) + " " + ( - a) + " x e";
		this.node.glassOverlay.style.position = "absolute";
		this.node.glassOverlay.style.width = c.width + "px";
		this.node.glassOverlay.style.height = c.height + "px";
		this.node.glassOverlay.setAttribute("coordsize", Math.round(this.bounds.width) + "," + Math.round(this.bounds.height));
		this.node.glassOverlay.setAttribute("path", g)
	} else {
		if (this.node.glassOverlay != null) {
			this.node.glassOverlay.parentNode.removeChild(this.node.glassOverlay);
			this.node.glassOverlay = null
		}
	}
};
mxShape.prototype.updateSvgGlassPane = function() {
	if (this.node.nodeName == "g" && this.style != null && mxUtils.getValue(this.style, mxConstants.STYLE_GLASS, 0) == 1) {
		if (this.node.glassOverlay == null) {
			if (this.node.ownerSVGElement.glassGradient == null) {
				var e = document.createElementNS(mxConstants.NS_SVG, "linearGradient");
				e.setAttribute("x1", "0%");
				e.setAttribute("y1", "0%");
				e.setAttribute("x2", "0%");
				e.setAttribute("y2", "100%");
				var k = document.createElementNS(mxConstants.NS_SVG, "stop");
				k.setAttribute("offset", "0%");
				k.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.9");
				e.appendChild(k);
				var h = document.createElementNS(mxConstants.NS_SVG, "stop");
				h.setAttribute("offset", "100%");
				h.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.1");
				e.appendChild(h);
				var f = "mx-glass-gradient-";
				var a = 0;
				while (document.getElementById(f + a) != null) {
					a++
				}
				e.setAttribute("id", f + a);
				this.node.ownerSVGElement.appendChild(e);
				this.node.ownerSVGElement.glassGradient = e
			}
			this.node.glassOverlay = document.createElementNS(mxConstants.NS_SVG, "path");
			var c = this.node.ownerSVGElement.glassGradient.getAttribute("id");
			this.node.glassOverlay.setAttribute("style", "fill:url(#" + c + ");");
			this.node.appendChild(this.node.glassOverlay)
		}
		var m = 0.4;
		var i = this.bounds;
		var l = Math.ceil(this.strokewidth * this.scale / 2);
		var g = "m " + (i.x - l) + "," + (i.y - l) + " L " + (i.x - l) + "," + (i.y + i.height * m) + " Q " + (i.x + i.width * 0.5) + "," + (i.y + i.height * 0.7) + " " + (i.x + i.width + l) + "," + (i.y + i.height * m) + " L " + (i.x + i.width + l) + "," + (i.y - l) + " z";
		this.node.glassOverlay.setAttribute("d", g)
	} else {
		if (this.node.glassOverlay != null) {
			this.node.glassOverlay.parentNode.removeChild(this.node.glassOverlay);
			this.node.glassOverlay = null
		}
	}
};
mxShape.prototype.redrawVml = function() {
	this.node.style.visibility = "hidden";
	this.updateVmlShape(this.node);
	this.updateVmlGlassPane();
	this.node.style.visibility = "visible"
};
mxShape.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node)
};
mxShape.prototype.createPath = function(m) {
	var g = this.bounds.x;
	var f = this.bounds.y;
	var i = this.bounds.width;
	var e = this.bounds.height;
	var o = 0;
	var l = 0;
	if (this.direction == "north" || this.direction == "south") {
		o = (i - e) / 2;
		l = (e - i) / 2;
		g += o;
		f += l;
		var d = i;
		i = e;
		e = d
	}
	var k = this.rotation || 0;
	if (this.direction != null) {
		if (this.direction == "north") {
			k += 270
		} else {
			if (this.direction == "west") {
				k += 180
			} else {
				if (this.direction == "south") {
					k += 90
				}
			}
		}
	}
	var n = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		n = new mxPath("svg");
		n.setTranslate(g, f);
		if (k != 0) {
			var c = this.bounds.getCenterX();
			var b = this.bounds.getCenterY();
			var a = "rotate(" + k + " " + c + " " + b + ")";
			if (this.innerNode != null) {
				this.innerNode.setAttribute("transform", a)
			}
			if (this.foreground != null) {
				this.foreground.setAttribute("transform", a)
			}
			if (this.shadowNode != null) {
				this.shadowNode.setAttribute("transform", mxConstants.SVG_SHADOWTRANSFORM + " " + a)
			}
		}
	} else {
		n = new mxPath("vml");
		n.setTranslate(o, -o);
		if (k != 0) {
			this.node.style.rotation = k
		}
	}
	this.redrawPath(n, g, f, i, e, m);
	return n.getPath()
};
mxShape.prototype.redrawPath = function(d, a, e, b, c) {};
function mxStencil(a) {
	this.desc = a;
	this.parseDescription();
	this.parseConstraints()
}
mxStencil.prototype.desc = null;
mxStencil.prototype.constraints = null;
mxStencil.prototype.aspect = null;
mxStencil.prototype.w0 = null;
mxStencil.prototype.h0 = null;
mxStencil.prototype.bgNode = null;
mxStencil.prototype.fgNode = null;
mxStencil.prototype.strokewidth = null;
mxStencil.prototype.parseDescription = function() {
	this.fgNode = this.desc.getElementsByTagName("foreground")[0];
	this.bgNode = this.desc.getElementsByTagName("background")[0];
	this.w0 = Number(this.desc.getAttribute("w") || 100);
	this.h0 = Number(this.desc.getAttribute("h") || 100);
	var b = this.desc.getAttribute("aspect");
	this.aspect = (b != null) ? b: "variable";
	var a = this.desc.getAttribute("strokewidth");
	this.strokewidth = (a != null) ? a: "1"
};
mxStencil.prototype.parseConstraints = function() {
	var a = this.desc.getElementsByTagName("connections")[0];
	if (a != null) {
		var c = mxUtils.getChildNodes(a);
		if (c != null && c.length > 0) {
			this.constraints = [];
			for (var b = 0; b < c.length; b++) {
				this.constraints.push(this.parseConstraint(c[b]))
			}
		}
	}
};
mxStencil.prototype.parseConstraint = function(c) {
	var a = Number(c.getAttribute("x"));
	var d = Number(c.getAttribute("y"));
	var b = c.getAttribute("perimeter") == "1";
	return new mxConnectionConstraint(new mxPoint(a, d), b)
};
mxStencil.prototype.evaluateAttribute = function(node, attribute, state) {
	var result = node.getAttribute(attribute);
	if (result == null) {
		var text = mxUtils.getTextContent(node);
		if (text != null) {
			var funct = mxUtils.eval(text);
			if (typeof(funct) == "function") {
				result = funct(state)
			}
		}
	}
	return result
};
mxStencil.prototype.renderDom = function(c, o, p, k) {
	var d = c.dialect != mxConstants.DIALECT_SVG;
	var w = c.rotation || 0;
	var g = false;
	if (c.direction != null) {
		if (c.direction == "north") {
			w += 270
		} else {
			if (c.direction == "west") {
				w += 180
			} else {
				if (c.direction == "south") {
					w += 90
				}
			}
		}
		g = (c.direction == "north" || c.direction == "south")
	}
	var x = c.style[mxConstants.STYLE_STENCIL_FLIPH];
	var q = c.style[mxConstants.STYLE_STENCIL_FLIPV];
	if (x && q) {
		w += 180;
		x = false;
		q = false
	}
	var A = false;
	var H = "";
	if (d) {
		if (x) {
			p.style.flip = "x"
		} else {
			if (q) {
				p.style.flip = "y"
			}
		}
		if (w != 0) {
			p.style.rotation = w
		}
	} else {
		if (x || q) {
			var u = 1;
			var t = 1;
			var s = 0;
			var r = 0;
			if (x) {
				u = -1;
				s = -o.width - 2 * o.x
			}
			if (q) {
				t = -1;
				r = -o.height - 2 * o.y
			}
			H = "scale(" + u + " " + t + ") translate(" + s + " " + r + ")"
		}
		if (w != 0) {
			var h = o.getCenterX();
			var f = o.getCenterY();
			H += " rotate(" + w + " " + h + " " + f + ")"
		}
	}
	var z = (k == null);
	if (this.bgNode != null || this.fgNode != null) {
		var B = (d && k == null) ? 0 : o.x;
		var i = (d && k == null) ? 0 : o.y;
		var u = o.width / this.w0;
		var t = o.height / this.h0;
		this.lastMoveX = 0;
		this.lastMoveY = 0;
		if (g) {
			t = o.width / this.h0;
			u = o.height / this.w0;
			var F = (o.width - o.height) / 2;
			B += F;
			i -= F
		}
		if (this.aspect != "variable") {
			t = Math.min(u, t);
			u = t;
			if (g) {
				B += (o.height - this.w0 * u) / 2;
				i += (o.width - this.h0 * t) / 2
			} else {
				B += (o.width - this.w0 * u) / 2;
				i += (o.height - this.h0 * t) / 2
			}
		}
		var C = Math.min(u, t);
		var l = Math.max(1, Math.round(3 * c.scale)) * C;
		var n = [];
		var G = (k != null) ? k: {
			fill: c.fill,
			stroke: c.stroke,
			strokeWidth: (this.strokewidth == "inherit") ? Number(c.strokewidth) * c.scale: Number(this.strokewidth) * C,
			dashed: c.isDashed,
			dashpattern: l + " " + l,
			alpha: c.opacity,
			linejoin: "miter",
			fontColor: "#000000",
			fontSize: mxConstants.DEFAULT_FONTSIZE,
			fontFamily: mxConstants.DEFAULT_FONTFAMILY,
			fontStyle: 0
		};
		var e = null;
		var y = null;
		var a = function(M, J) {
			var I = Math.round(Math.max(1, J.strokeWidth));
			if (d) {
				M.strokeweight = I + "px";
				if (J.fill != null) {
					var L = (!A) ? c.gradient: null;
					var K = document.createElement("v:fill");
					c.updateVmlFill(K, J.fill, L, c.gradientDirection, J.alpha);
					M.appendChild(K)
				} else {
					M.filled = "false"
				}
				if (J.stroke != null) {
					M.stroked = "true";
					M.strokecolor = J.stroke
				} else {
					M.stroked = "false"
				}
				M.style.position = "absolute"
			} else {
				M.setAttribute("stroke-width", I);
				if (J.fill != null && A) {
					M.setAttribute("fill", J.fill)
				}
				if (J.stroke != null) {
					M.setAttribute("stroke", J.stroke)
				}
			}
		};
		var E = function(I) {
			if (document.documentMode == 8) {
				p.insertAdjacentHTML("beforeEnd", I.outerHTML)
			} else {
				p.appendChild(I)
			}
		};
		var v = function(I) {
			if (e != null && y != null) {
				y.push(I)
			}
		};
		var m = function(af) {
			var U = af.nodeName;
			var au = U == "fill";
			var I = U == "stroke";
			var ar = U == "fillstroke";
			if (U == "save") {
				n.push(G);
				G = mxUtils.clone(G)
			} else {
				if (U == "restore") {
					G = n.pop()
				} else {
					if (U == "path") {
						y = [];
						if (d) {
							e = document.createElement("v:shape");
							a.call(this, e, G);
							var ap = Math.round(o.width);
							var aD = Math.round(o.height);
							e.style.width = ap + "px";
							e.style.height = aD + "px";
							e.coordsize = ap + "," + aD
						} else {
							e = document.createElementNS(mxConstants.NS_SVG, "path");
							a.call(this, e, G);
							if (H.length > 0) {
								e.setAttribute("transform", H)
							}
							if (af.getAttribute("crisp") == "1") {
								e.setAttribute("shape-rendering", "crispEdges")
							}
						}
						var Z = af.firstChild;
						while (Z != null) {
							if (Z.nodeType == mxConstants.NODETYPE_ELEMENT) {
								m.call(this, Z)
							}
							Z = Z.nextSibling
						}
						if (d) {
							v("e");
							e.path = y.join("")
						} else {
							e.setAttribute("d", y.join(""))
						}
					} else {
						if (U == "move") {
							var ae = (d) ? "m": "M";
							this.lastMoveX = Math.round(B + Number(af.getAttribute("x")) * u);
							this.lastMoveY = Math.round(i + Number(af.getAttribute("y")) * t);
							v(ae + " " + this.lastMoveX + " " + this.lastMoveY)
						} else {
							if (U == "line") {
								var ae = (d) ? "l": "L";
								this.lastMoveX = Math.round(B + Number(af.getAttribute("x")) * u);
								this.lastMoveY = Math.round(i + Number(af.getAttribute("y")) * t);
								v(ae + " " + this.lastMoveX + " " + this.lastMoveY)
							} else {
								if (U == "quad") {
									if (d) {
										var J = this.lastMoveX;
										var al = this.lastMoveY;
										var ao = B + Number(af.getAttribute("x1")) * u;
										var aa = i + Number(af.getAttribute("y1")) * t;
										var aG = B + Number(af.getAttribute("x2")) * u;
										var ai = i + Number(af.getAttribute("y2")) * t;
										var aI = J + 2 / 3 * (ao - J);
										var ak = al + 2 / 3 * (aa - al);
										var aH = aG + 2 / 3 * (ao - aG);
										var aj = ai + 2 / 3 * (aa - ai);
										v("c " + Math.round(aI) + " " + Math.round(ak) + " " + Math.round(aH) + " " + Math.round(aj) + " " + Math.round(aG) + " " + Math.round(ai));
										this.lastMoveX = aG;
										this.lastMoveY = ai
									} else {
										this.lastMoveX = Math.round(B + Number(af.getAttribute("x2")) * u);
										this.lastMoveY = Math.round(i + Number(af.getAttribute("y2")) * t);
										v("Q " + Math.round(B + Number(af.getAttribute("x1")) * u) + " " + Math.round(i + Number(af.getAttribute("y1")) * t) + " " + this.lastMoveX + " " + this.lastMoveY)
									}
								} else {
									if (U == "curve") {
										var ae = (d) ? "c": "C";
										this.lastMoveX = Math.round(B + Number(af.getAttribute("x3")) * u);
										this.lastMoveY = Math.round(i + Number(af.getAttribute("y3")) * t);
										v(ae + " " + Math.round(B + Number(af.getAttribute("x1")) * u) + " " + Math.round(i + Number(af.getAttribute("y1")) * t) + " " + Math.round(B + Number(af.getAttribute("x2")) * u) + " " + Math.round(i + Number(af.getAttribute("y2")) * t) + " " + this.lastMoveX + " " + this.lastMoveY)
									} else {
										if (U == "close") {
											v((d) ? "x": "Z")
										} else {
											if (U == "rect" || U == "roundrect") {
												var P = U == "roundrect";
												var an = Math.round(B + Number(af.getAttribute("x")) * u);
												var am = Math.round(i + Number(af.getAttribute("y")) * t);
												var ap = Math.round(Number(af.getAttribute("w")) * u);
												var aD = Math.round(Number(af.getAttribute("h")) * t);
												var R = af.getAttribute("arcsize");
												if (R == 0) {
													R = mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
												}
												if (d) {
													e = document.createElement((P) ? "v:roundrect": "v:rect");
													e.style.left = an + "px";
													e.style.top = am + "px";
													e.style.width = ap + "px";
													e.style.height = aD + "px";
													if (P) {
														e.setAttribute("arcsize", String(R) + "%")
													}
												} else {
													e = document.createElementNS(mxConstants.NS_SVG, "rect");
													e.setAttribute("x", an);
													e.setAttribute("y", am);
													e.setAttribute("width", ap);
													e.setAttribute("height", aD);
													if (P) {
														var aB = Number(R) / 100;
														var aw = Math.min(ap * aB, aD * aB);
														e.setAttribute("rx", aw);
														e.setAttribute("ry", aw)
													}
													if (H.length > 0) {
														e.setAttribute("transform", H)
													}
													if (af.getAttribute("crisp") == "1") {
														e.setAttribute("shape-rendering", "crispEdges")
													}
												}
												a.call(this, e, G)
											} else {
												if (U == "ellipse") {
													var an = Math.round(B + Number(af.getAttribute("x")) * u);
													var am = Math.round(i + Number(af.getAttribute("y")) * t);
													var ap = Math.round(Number(af.getAttribute("w")) * u);
													var aD = Math.round(Number(af.getAttribute("h")) * t);
													if (d) {
														e = document.createElement("v:arc");
														e.startangle = "0";
														e.endangle = "360";
														e.style.left = an + "px";
														e.style.top = am + "px";
														e.style.width = ap + "px";
														e.style.height = aD + "px"
													} else {
														e = document.createElementNS(mxConstants.NS_SVG, "ellipse");
														e.setAttribute("cx", an + ap / 2);
														e.setAttribute("cy", am + aD / 2);
														e.setAttribute("rx", ap / 2);
														e.setAttribute("ry", aD / 2);
														if (H.length > 0) {
															e.setAttribute("transform", H)
														}
													}
													a.call(this, e, G)
												} else {
													if (U == "arc") {
														var T = Number(af.getAttribute("rx")) * u;
														var S = Number(af.getAttribute("ry")) * t;
														var X = Number(af.getAttribute("x-axis-rotation"));
														var Y = Number(af.getAttribute("large-arc-flag"));
														var ac = Number(af.getAttribute("sweep-flag"));
														var an = B + Number(af.getAttribute("x")) * u;
														var am = i + Number(af.getAttribute("y")) * t;
														if (d) {
															var K = mxUtils.arcToCurves(this.lastMoveX, this.lastMoveY, T, S, X, Y, ac, an, am);
															for (var aC = 0; aC < K.length; aC += 6) {
																v("c " + Math.round(K[aC]) + " " + Math.round(K[aC + 1]) + " " + Math.round(K[aC + 2]) + " " + Math.round(K[aC + 3]) + " " + Math.round(K[aC + 4]) + " " + Math.round(K[aC + 5]));
																this.lastMoveX = K[aC + 4];
																this.lastMoveY = K[aC + 5]
															}
														} else {
															v("A " + T + "," + S + " " + X + " " + Y + "," + ac + " " + an + "," + am);
															this.lastMoveX = B + an;
															this.lastMoveY = i + am
														}
													} else {
														if (U == "image") {
															var ab = this.evaluateAttribute(af, "src", c.state);
															if (ab != null) {
																var an = Math.round(B + Number(af.getAttribute("x")) * u);
																var am = Math.round(i + Number(af.getAttribute("y")) * t);
																var ap = Math.round(Number(af.getAttribute("w")) * u);
																var aD = Math.round(Number(af.getAttribute("h")) * t);
																var W = false;
																var aE = af.getAttribute("flipH") == "1";
																var ax = af.getAttribute("flipV") == "1";
																if (d) {
																	e = document.createElement("v:image");
																	e.style.filter = "alpha(opacity=" + G.alpha + ")";
																	e.style.left = an + "px";
																	e.style.top = am + "px";
																	e.style.width = ap + "px";
																	e.style.height = aD + "px";
																	e.src = ab;
																	if (aE && ax) {
																		e.style.rotation = "180"
																	} else {
																		if (aE) {
																			e.style.flip = "x"
																		} else {
																			if (ax) {
																				e.style.flip = "y"
																			}
																		}
																	}
																} else {
																	e = document.createElementNS(mxConstants.NS_SVG, "image");
																	e.setAttributeNS(mxConstants.NS_XLINK, "xlink:href", ab);
																	e.setAttribute("opacity", G.alpha / 100);
																	e.setAttribute("x", an);
																	e.setAttribute("y", am);
																	e.setAttribute("width", ap);
																	e.setAttribute("height", aD);
																	if (!W) {
																		e.setAttribute("preserveAspectRatio", "none")
																	}
																	if (aE || ax) {
																		var O = 1;
																		var N = 1;
																		var M = 0;
																		var L = 0;
																		if (aE) {
																			O = -1;
																			M = -ap - 2 * an
																		}
																		if (ax) {
																			N = -1;
																			L = -aD - 2 * am
																		}
																		e.setAttribute("transform", H + "scale(" + O + " " + N + ") translate(" + M + " " + L + ") ")
																	} else {
																		e.setAttribute("transform", H)
																	}
																}
																E(e)
															}
														} else {
															if (U == "include-shape") {
																var az = mxStencilRegistry.getStencil(af.getAttribute("name"));
																if (az != null) {
																	var an = B + Number(af.getAttribute("x")) * u;
																	var am = i + Number(af.getAttribute("y")) * t;
																	var ap = Number(af.getAttribute("w")) * u;
																	var aD = Number(af.getAttribute("h")) * t;
																	az.renderDom(c, new mxRectangle(an, am, ap, aD), p, G)
																}
															} else {
																if (U == "text") {
																	var ag = this.evaluateAttribute(af, "str", c.state);
																	if (ag != null) {
																		var an = Math.round(B + Number(af.getAttribute("x")) * u);
																		var am = Math.round(i + Number(af.getAttribute("y")) * t);
																		var aA = af.getAttribute("align") || "left";
																		var aq = af.getAttribute("valign") || "top";
																		if (d) {
																			e = document.createElement("v:line");
																			e.style.position = "absolute";
																			e.style.width = "1px";
																			e.style.height = "1px";
																			e.to = (an + 1) + " " + am;
																			e.from = an + " " + am;
																			var V = document.createElement("v:fill");
																			V.color = G.fontColor;
																			V.on = "true";
																			e.appendChild(V);
																			var ad = document.createElement("v:stroke");
																			ad.on = "false";
																			e.appendChild(ad);
																			var av = document.createElement("v:path");
																			av.textpathok = "true";
																			e.appendChild(av);
																			var aF = document.createElement("v:textpath");
																			aF.style.cssText = "v-text-align:" + aA;
																			aF.style.fontSize = G.fontSize + "px";
																			aF.style.fontFamily = G.fontFamily;
																			aF.string = ag;
																			aF.on = "true";
																			if ((G.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
																				aF.style.fontWeight = "bold"
																			}
																			if ((G.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
																				aF.style.fontStyle = "italic"
																			}
																			if ((G.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
																				aF.style.textDecoration = "underline"
																			}
																			if (aq == "top") {
																				e.style.top = (G.fontSize / 2) + "px"
																			} else {
																				if (aq == "bottom") {
																					e.style.top = -(G.fontSize / 3) + "px"
																				}
																			}
																			e.appendChild(aF)
																		} else {
																			e = document.createElementNS(mxConstants.NS_SVG, "text");
																			e.setAttribute("fill", G.fontColor);
																			e.setAttribute("font-family", G.fontFamily);
																			e.setAttribute("font-size", G.fontSize);
																			e.setAttribute("stroke", "none");
																			e.setAttribute("x", an);
																			e.appendChild(document.createTextNode(ag));
																			if ((G.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) {
																				e.setAttribute("font-weight", "bold")
																			}
																			if ((G.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) {
																				e.setAttribute("font-style", "italic")
																			}
																			if ((G.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE) {
																				e.setAttribute("text-decoration", uline)
																			}
																			if (aA == "left") {
																				aA = "start"
																			} else {
																				if (aA == "center") {
																					aA = "middle"
																				} else {
																					if (aA == "right") {
																						aA = "end"
																					}
																				}
																			}
																			e.setAttribute("text-anchor", aA);
																			if (aq == "top") {
																				e.setAttribute("y", am + G.fontSize / 5);
																				e.setAttribute("dy", "1ex")
																			} else {
																				if (aq == "middle") {
																					e.setAttribute("y", am + G.fontSize / 8);
																					e.setAttribute("dy", "0.5ex")
																				} else {
																					e.setAttribute("y", am)
																				}
																			}
																			if (H.length > 0) {
																				e.setAttribute("transform", H)
																			}
																		}
																		E(e)
																	}
																} else {
																	if (au || I || ar) {
																		if (e != null) {
																			if (I || ar) {
																				if (d) {
																					var ad = document.createElement("v:stroke");
																					ad.endcap = G.linecap || "flat";
																					ad.joinstyle = G.linejoin || "miter";
																					ad.miterlimit = G.miterlimit || "10";
																					e.appendChild(ad);
																					if (G.dashed) {
																						ad.dashstyle = G.dashpattern
																					}
																				} else {
																					if (G.linejoin != null) {
																						e.setAttribute("stroke-linejoin", G.linejoin)
																					}
																					if (G.linecap != null) {
																						var at = G.linecap;
																						if (at == "flat") {
																							at = "butt"
																						}
																						e.setAttribute("stroke-linecap", at)
																					}
																					if (G.miterlimit != null) {
																						e.setAttribute("stroke-miterlimit", G.miterlimit)
																					}
																				}
																			}
																			if (z && c.isShadow && G.fill != null && (au || ar)) {
																				if (d) {
																					var ah = document.createElement("v:shadow");
																					ah.setAttribute("on", "true");
																					ah.setAttribute("color", mxConstants.SHADOWCOLOR);
																					ah.setAttribute("offset", mxConstants.SHADOW_OFFSET_X + "px," + mxConstants.SHADOW_OFFSET_Y + "px");
																					ah.setAttribute("opacity", (mxConstants.SHADOW_OPACITY * 100) + "%");
																					e.appendChild(ah)
																				} else {
																					var ah = e.cloneNode(true);
																					ah.setAttribute("stroke", mxConstants.SHADOWCOLOR);
																					ah.setAttribute("fill", mxConstants.SHADOWCOLOR);
																					ah.setAttribute("transform", "translate(" + mxConstants.SHADOW_OFFSET_X + " " + mxConstants.SHADOW_OFFSET_Y + ") " + (ah.getAttribute("transform") || ""));
																					ah.setAttribute("opacity", mxConstants.SHADOW_OPACITY);
																					p.appendChild(ah)
																				}
																			}
																			if (G.dashed && !d && (I || ar)) {
																				e.setAttribute("stroke-dasharray", G.dashpattern)
																			}
																			if (au) {
																				if (d) {
																					e.stroked = "false"
																				} else {
																					e.setAttribute("stroke", "none")
																				}
																			} else {
																				if (I) {
																					if (d) {
																						e.filled = "false"
																					} else {
																						e.setAttribute("fill", "none")
																					}
																				}
																			}
																			E(e)
																		}
																		if (z) {
																			z = false
																		}
																	} else {
																		if (U == "linecap") {
																			G.linecap = af.getAttribute("cap")
																		} else {
																			if (U == "linejoin") {
																				G.linejoin = af.getAttribute("join")
																			} else {
																				if (U == "miterlimit") {
																					G.miterlimit = af.getAttribute("limit")
																				} else {
																					if (U == "dashed") {
																						G.dashed = af.getAttribute("dashed") == "1"
																					} else {
																						if (U == "dashpattern") {
																							var at = af.getAttribute("pattern");
																							if (at != null) {
																								var ay = at.split(" ");
																								var Q = [];
																								for (var aC = 0; aC < ay.length; aC++) {
																									if (ay[aC].length > 0) {
																										Q.push(Number(ay[aC]) * c.scale * C)
																									}
																								}
																								G.dashpattern = Q.join(" ")
																							}
																						} else {
																							if (U == "strokewidth") {
																								G.strokeWidth = af.getAttribute("width") * C
																							} else {
																								if (U == "strokecolor") {
																									G.stroke = af.getAttribute("color")
																								} else {
																									if (U == "fillcolor") {
																										G.fill = af.getAttribute("color");
																										A = true
																									} else {
																										if (U == "alpha") {
																											G.alpha = Number(af.getAttribute("alpha"))
																										} else {
																											if (U == "fontcolor") {
																												G.fontColor = af.getAttribute("color")
																											} else {
																												if (U == "fontsize") {
																													G.fontSize = Number(af.getAttribute("size")) * C
																												} else {
																													if (U == "fontfamily") {
																														G.fontFamily = af.getAttribute("family")
																													} else {
																														if (U == "fontstyle") {
																															G.fontStyle = Number(af.getAttribute("style"))
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};
		if (!d) {
			var b = document.createElementNS(mxConstants.NS_SVG, "rect");
			b.setAttribute("x", o.x);
			b.setAttribute("y", o.y);
			b.setAttribute("width", o.width);
			b.setAttribute("height", o.height);
			b.setAttribute("fill", "none");
			b.setAttribute("stroke", "none");
			p.appendChild(b)
		}
		if (this.bgNode != null) {
			var D = this.bgNode.firstChild;
			while (D != null) {
				if (D.nodeType == mxConstants.NODETYPE_ELEMENT) {
					m.call(this, D)
				}
				D = D.nextSibling
			}
		} else {
			z = false
		}
		if (this.fgNode != null) {
			var D = this.fgNode.firstChild;
			while (D != null) {
				if (D.nodeType == mxConstants.NODETYPE_ELEMENT) {
					m.call(this, D)
				}
				D = D.nextSibling
			}
		}
	}
};
mxStencil.prototype.drawShape = function(e, c, a, d) {
	var g = (d) ? this.bgNode: this.fgNode;
	if (g != null) {
		var i = mxUtils.getValue(c.style, mxConstants.STYLE_DIRECTION, null);
		var b = this.computeAspect(c, a, i);
		var f = Math.min(b.width, b.height);
		var k = (this.strokewidth == "inherit") ? Number(mxUtils.getNumber(c.style, mxConstants.STYLE_STROKEWIDTH, 1)) * c.view.scale: Number(this.strokewidth) * f;
		this.lastMoveX = 0;
		this.lastMoveY = 0;
		e.setStrokeWidth(k);
		var h = g.firstChild;
		while (h != null) {
			if (h.nodeType == mxConstants.NODETYPE_ELEMENT) {
				this.drawNode(e, c, h, b)
			}
			h = h.nextSibling
		}
		return true
	}
	return false
};
mxStencil.prototype.computeAspect = function(b, a, g) {
	var c = a.x;
	var h = a.y;
	var f = a.width / this.w0;
	var e = a.height / this.h0;
	var d = (g == "north" || g == "south");
	if (d) {
		e = a.width / this.h0;
		f = a.height / this.w0;
		var i = (a.width - a.height) / 2;
		c += i;
		h -= i
	}
	if (this.aspect != "variable") {
		e = Math.min(f, e);
		f = e;
		if (d) {
			c += (a.height - this.w0 * f) / 2;
			h += (a.width - this.h0 * e) / 2
		} else {
			c += (a.width - this.w0 * f) / 2;
			h += (a.height - this.h0 * e) / 2
		}
	}
	return new mxRectangle(c, h, f, e)
};
mxStencil.prototype.drawNode = function(d, f, C, u) {
	var M = C.nodeName;
	var J = u.x;
	var c = u.y;
	var z = u.width;
	var t = u.height;
	var K = Math.min(z, t);
	function a(i, O, r, N) {
		if (r < 0) {
			i += r;
			r *= -1
		}
		if (N < 0) {
			O += N;
			N *= -1
		}
		return new mxRectangle(i, O, r, N)
	}
	if (M == "save") {
		d.save()
	} else {
		if (M == "restore") {
			d.restore()
		} else {
			if (M == "path") {
				d.begin();
				var b = C.firstChild;
				while (b != null) {
					if (b.nodeType == mxConstants.NODETYPE_ELEMENT) {
						this.drawNode(d, f, b, u)
					}
					b = b.nextSibling
				}
			} else {
				if (M == "close") {
					d.close()
				} else {
					if (M == "move") {
						this.lastMoveX = J + Number(C.getAttribute("x")) * z;
						this.lastMoveY = c + Number(C.getAttribute("y")) * t;
						d.moveTo(this.lastMoveX, this.lastMoveY)
					} else {
						if (M == "line") {
							this.lastMoveX = J + Number(C.getAttribute("x")) * z;
							this.lastMoveY = c + Number(C.getAttribute("y")) * t;
							d.lineTo(this.lastMoveX, this.lastMoveY)
						} else {
							if (M == "quad") {
								this.lastMoveX = J + Number(C.getAttribute("x2")) * z;
								this.lastMoveY = c + Number(C.getAttribute("y2")) * t;
								d.quadTo(J + Number(C.getAttribute("x1")) * z, c + Number(C.getAttribute("y1")) * t, this.lastMoveX, this.lastMoveY)
							} else {
								if (M == "curve") {
									this.lastMoveX = J + Number(C.getAttribute("x3")) * z;
									this.lastMoveY = c + Number(C.getAttribute("y3")) * t;
									d.curveTo(J + Number(C.getAttribute("x1")) * z, c + Number(C.getAttribute("y1")) * t, J + Number(C.getAttribute("x2")) * z, c + Number(C.getAttribute("y2")) * t, this.lastMoveX, this.lastMoveY)
								} else {
									if (M == "arc") {
										var G = Number(C.getAttribute("rx")) * z;
										var E = Number(C.getAttribute("ry")) * t;
										var I = Number(C.getAttribute("x-axis-rotation"));
										var g = Number(C.getAttribute("large-arc-flag"));
										var e = Number(C.getAttribute("sweep-flag"));
										var n = J + Number(C.getAttribute("x")) * z;
										var m = c + Number(C.getAttribute("y")) * t;
										var p = mxUtils.arcToCurves(this.lastMoveX, this.lastMoveY, G, E, I, g, e, n, m);
										for (var F = 0; F < p.length; F += 6) {
											d.curveTo(p[F], p[F + 1], p[F + 2], p[F + 3], p[F + 4], p[F + 5]);
											this.lastMoveX = p[F + 4];
											this.lastMoveY = p[F + 5]
										}
									} else {
										if (M == "rect") {
											d.rect(J + Number(C.getAttribute("x")) * z, c + Number(C.getAttribute("y")) * t, Number(C.getAttribute("w")) * z, Number(C.getAttribute("h")) * t)
										} else {
											if (M == "roundrect") {
												var l = C.getAttribute("arcsize");
												if (l == 0) {
													l = mxConstants.RECTANGLE_ROUNDING_FACTOR * 100
												}
												var o = Number(C.getAttribute("w")) * z;
												var H = Number(C.getAttribute("h")) * t;
												var v = Number(l) / 100;
												var s = Math.min(o * v, H * v);
												d.roundrect(J + Number(C.getAttribute("x")) * z, c + Number(C.getAttribute("y")) * t, Number(C.getAttribute("w")) * z, Number(C.getAttribute("h")) * t, s, s)
											} else {
												if (M == "ellipse") {
													d.ellipse(J + Number(C.getAttribute("x")) * z, c + Number(C.getAttribute("y")) * t, Number(C.getAttribute("w")) * z, Number(C.getAttribute("h")) * t)
												} else {
													if (M == "image") {
														var k = this.evaluateAttribute(C, "src", f);
														d.image(J + Number(C.getAttribute("x")) * z, c + Number(C.getAttribute("y")) * t, Number(C.getAttribute("w")) * z, Number(C.getAttribute("h")) * t, k, false, C.getAttribute("flipH") == "1", C.getAttribute("flipV") == "1")
													} else {
														if (M == "text") {
															var B = this.evaluateAttribute(C, "str", f);
															d.text(J + Number(C.getAttribute("x")) * z, c + Number(C.getAttribute("y")) * t, 0, 0, B, C.getAttribute("align"), C.getAttribute("valign"), C.getAttribute("vertical"))
														} else {
															if (M == "include-shape") {
																var D = mxStencilRegistry.getStencil(C.getAttribute("name"));
																if (D != null) {
																	var n = J + Number(C.getAttribute("x")) * z;
																	var m = c + Number(C.getAttribute("y")) * t;
																	var o = Number(C.getAttribute("w")) * z;
																	var H = Number(C.getAttribute("h")) * t;
																	var L = new mxRectangle(n, m, o, H);
																	D.drawShape(d, f, L, true);
																	D.drawShape(d, f, L, false)
																}
															} else {
																if (M == "fillstroke") {
																	d.fillAndStroke()
																} else {
																	if (M == "fill") {
																		d.fill()
																	} else {
																		if (M == "stroke") {
																			d.stroke()
																		} else {
																			if (M == "strokewidth") {
																				d.setStrokeWidth(Number(C.getAttribute("width")) * K)
																			} else {
																				if (M == "dashed") {
																					d.setDashed(C.getAttribute("dashed") == "1")
																				} else {
																					if (M == "dashpattern") {
																						var A = C.getAttribute("pattern");
																						if (A != null) {
																							var L = A.split(" ");
																							var q = [];
																							for (var F = 0; F < L.length; F++) {
																								if (L[F].length > 0) {
																									q.push(Number(L[F]) * K)
																								}
																							}
																							A = q.join(" ")
																						}
																						d.setDashPattern(A)
																					} else {
																						if (M == "strokecolor") {
																							d.setStrokeColor(C.getAttribute("color"))
																						} else {
																							if (M == "linecap") {
																								d.setLineCap(C.getAttribute("cap"))
																							} else {
																								if (M == "linejoin") {
																									d.setLineJoin(C.getAttribute("join"))
																								} else {
																									if (M == "miterlimit") {
																										d.setLineJoin(C.getAttribute("limit"))
																									} else {
																										if (M == "fillcolor") {
																											d.setFillColor(C.getAttribute("color"))
																										} else {
																											if (M == "fontcolor") {
																												d.setFontColor(C.getAttribute("color"))
																											} else {
																												if (M == "fontstyle") {
																													d.setFontStyle(C.getAttribute("style"))
																												} else {
																													if (M == "fontfamily") {
																														d.setFontFamily(C.getAttribute("family"))
																													} else {
																														if (M == "fontsize") {
																															d.setFontSize(Number(C.getAttribute("size")) * K)
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var mxStencilRegistry = {
	stencils: [],
	addStencil: function(a, b) {
		mxStencilRegistry.stencils[a] = b
	},
	getStencil: function(a) {
		return mxStencilRegistry.stencils[a]
	}
};
function mxStencilShape(a) {
	this.stencil = a
}
mxStencilShape.prototype = new mxShape();
mxStencilShape.prototype.constructor = mxStencilShape;
mxStencilShape.prototype.mixedModeHtml = false;
mxStencilShape.prototype.preferModeHtml = false;
mxStencilShape.prototype.stencil = null;
mxStencilShape.prototype.state = null;
mxStencilShape.prototype.apply = function(a) {
	this.state = a;
	mxShape.prototype.apply.apply(this, arguments)
};
mxStencilShape.prototype.createSvg = function() {
	var a = document.createElementNS(mxConstants.NS_SVG, "g");
	this.configureSvgShape(a);
	return a
};
mxStencilShape.prototype.configureHtmlShape = function(a) {
	mxShape.prototype.configureHtmlShape.apply(this, arguments);
	if (!mxUtils.isVml(a)) {
		a.style.overflow = "visible"
	}
};
mxStencilShape.prototype.createVml = function() {
	var a = (document.documentMode == 8) ? "div": "v:group";
	var b = document.createElement(a);
	this.configureTransparentBackground(b);
	b.style.position = "absolute";
	return b
};
mxStencilShape.prototype.configureVmlShape = function(a) {};
mxStencilShape.prototype.redraw = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		this.redrawShape()
	} else {
		this.node.style.visibility = "hidden";
		this.redrawShape();
		this.node.style.visibility = "visible"
	}
};
mxStencilShape.prototype.redrawShape = function() {
	if (this.dialect != mxConstants.DIALECT_SVG) {
		this.node.innerHTML = "";
		this.node.style.left = Math.round(this.bounds.x) + "px";
		this.node.style.top = Math.round(this.bounds.y) + "px";
		var a = Math.round(this.bounds.width);
		var b = Math.round(this.bounds.height);
		this.node.style.width = a + "px";
		this.node.style.height = b + "px";
		if (mxUtils.isVml(this.node)) {
			this.node.coordsize = a + "," + b
		}
	} else {
		while (this.node.firstChild != null) {
			this.node.removeChild(this.node.firstChild)
		}
	}
	this.stencil.renderDom(this, this.bounds, this.node)
};
var mxMarker = {
	markers: [],
	paintMarker: function(q, c, a, w, r, g, n, x, t, b, p, s) {
		var f = mxMarker.markers[c];
		var i = null;
		if (f != null) {
			var d = mxUtils.isVml(q);
			var m = w.x - a.x;
			var k = w.y - a.y;
			if (isNaN(m) || isNaN(k)) {
				return
			}
			var o = Math.max(1, Math.sqrt(m * m + k * k));
			var l = n * x;
			var v = m * l / o;
			var u = k * l / o;
			w = w.clone();
			if (d) {
				w.x -= t;
				w.y -= b
			}
			v *= 0.5 + g / 2;
			u *= 0.5 + g / 2;
			var e = true;
			var y = (p) ? mxConstants.STYLE_STARTFILL: mxConstants.STYLE_ENDFILL;
			if (s[y] == 0) {
				e = false
			}
			if (d) {
				q.strokecolor = r;
				if (e) {
					q.fillcolor = r
				} else {
					q.filled = "false"
				}
			} else {
				q.setAttribute("stroke", r);
				var h = (s.opacity != null) ? s.opacity / 100 : 1;
				q.setAttribute("stroke-opacity", h);
				if (e) {
					q.setAttribute("fill", r);
					q.setAttribute("fill-opacity", h)
				} else {
					q.setAttribute("fill", "none")
				}
			}
			i = f.call(this, q, c, w, v, u, g, n, x, d)
		}
		return i
	}
};
(function() {
	var a = function(b, i, h, e, d, l, m, c, k) {
		h.x -= e * l / (2 * m);
		h.y -= d * l / (2 * m);
		if (k) {
			b.path = "m" + Math.round(h.x) + "," + Math.round(h.y) + " l" + Math.round(h.x - e - d / 2) + " " + Math.round(h.y - d + e / 2) + ((i != mxConstants.ARROW_CLASSIC) ? "": " " + Math.round(h.x - e * 3 / 4) + " " + Math.round(h.y - d * 3 / 4)) + " " + Math.round(h.x + d / 2 - e) + " " + Math.round(h.y - d - e / 2) + " x e"
		} else {
			b.setAttribute("d", "M " + h.x + " " + h.y + " L " + (h.x - e - d / 2) + " " + (h.y - d + e / 2) + ((i != mxConstants.ARROW_CLASSIC) ? "": " L " + (h.x - e * 3 / 4) + " " + (h.y - d * 3 / 4)) + " L " + (h.x + d / 2 - e) + " " + (h.y - d - e / 2) + " z")
		}
		var g = (i != mxConstants.ARROW_CLASSIC) ? 1 : 3 / 4;
		return new mxPoint( - e * g, -d * g)
	};
	mxMarker.markers[mxConstants.ARROW_CLASSIC] = a;
	mxMarker.markers[mxConstants.ARROW_BLOCK] = a
} ());
mxMarker.markers[mxConstants.ARROW_OPEN] = function(a, f, e, d, c, h, i, b, g) {
	e.x -= d * h / (2 * i);
	e.y -= c * h / (2 * i);
	if (g) {
		a.path = "m" + Math.round(e.x - d - c / 2) + " " + Math.round(e.y - c + d / 2) + " l" + Math.round(e.x) + " " + Math.round(e.y) + " " + Math.round(e.x + c / 2 - d) + " " + Math.round(e.y - c - d / 2) + " e nf";
		a.setAttribute("strokeweight", (h * b) + "px")
	} else {
		a.setAttribute("d", "M " + (e.x - d - c / 2) + " " + (e.y - c + d / 2) + " L " + (e.x) + " " + (e.y) + " L " + (e.x + c / 2 - d) + " " + (e.y - c - d / 2));
		a.setAttribute("stroke-width", h * b);
		a.setAttribute("fill", "none")
	}
	return new mxPoint( - d / 4, -c / 4)
};
mxMarker.markers[mxConstants.ARROW_OVAL] = function(b, h, g, e, d, k, l, c, i) {
	var a = l * c;
	var f = a / 2;
	if (i) {
		b.path = "m" + Math.round(g.x + f) + " " + Math.round(g.y) + " at " + Math.round(g.x - f) + " " + Math.round(g.y - f) + " " + Math.round(g.x + f) + " " + Math.round(g.y + f) + " " + Math.round(g.x + f) + " " + Math.round(g.y) + " " + Math.round(g.x + f) + " " + Math.round(g.y) + " x e";
		b.setAttribute("strokeweight", (k * c) + "px")
	} else {
		b.setAttribute("d", "M " + (g.x - f) + " " + (g.y) + " a " + (f) + " " + (f) + " 0  1,1 " + (a) + " 0 a " + (f) + " " + (f) + " 0  1,1 " + ( - a) + " 0 z");
		b.setAttribute("stroke-width", k * c)
	}
	return new mxPoint( - e / (2 + k), -d / (2 + k))
};
mxMarker.markers[mxConstants.ARROW_DIAMOND] = function(a, f, e, d, c, h, i, b, g) {
	e.x -= d * h / (2 * i);
	e.y -= c * h / (2 * i);
	if (g) {
		a.path = "m" + Math.round(e.x + d / 2) + " " + Math.round(e.y + c / 2) + " l" + Math.round(e.x - c / 2) + " " + Math.round(e.y + d / 2) + " " + Math.round(e.x - d / 2) + " " + Math.round(e.y - c / 2) + " " + Math.round(e.x + c / 2) + " " + Math.round(e.y - d / 2) + " x e";
		a.setAttribute("strokeweight", (h * b) + "px")
	} else {
		a.setAttribute("d", "M " + (e.x + d / 2) + " " + (e.y + c / 2) + " L " + (e.x - c / 2) + " " + (e.y + d / 2) + " L " + (e.x - d / 2) + " " + (e.y - c / 2) + " L " + (e.x + c / 2) + " " + (e.y - d / 2) + " z");
		a.setAttribute("stroke-width", h * b)
	}
	return new mxPoint( - d / 2, -c / 2)
};
function mxActor(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxActor.prototype = new mxShape();
mxActor.prototype.constructor = mxActor;
mxActor.prototype.mixedModeHtml = false;
mxActor.prototype.preferModeHtml = false;
mxActor.prototype.createVml = function() {
	var a = document.createElement("v:shape");
	a.style.position = "absolute";
	this.configureVmlShape(a);
	return a
};
mxActor.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	this.node.path = this.createPath()
};
mxActor.prototype.createSvg = function() {
	return this.createSvgGroup("path")
};
mxActor.prototype.redrawSvg = function() {
	var b = Math.round(Math.max(1, this.strokewidth * this.scale));
	this.innerNode.setAttribute("stroke-width", b);
	this.innerNode.setAttribute("stroke-linejoin", "round");
	if (this.crisp) {
		this.innerNode.setAttribute("shape-rendering", "crispEdges")
	} else {
		this.innerNode.removeAttribute("shape-rendering")
	}
	var a = this.createPath();
	if (a.length > 0) {
		this.innerNode.setAttribute("d", a);
		if (this.shadowNode != null) {
			this.shadowNode.setAttribute("stroke-width", b);
			this.shadowNode.setAttribute("d", a)
		}
	} else {
		this.innerNode.removeAttribute("d");
		if (this.shadowNode != null) {
			this.shadowNode.removeAttribute("d")
		}
	}
};
mxActor.prototype.redrawPath = function(e, a, f, b, d) {
	var c = b / 3;
	e.moveTo(0, d);
	e.curveTo(0, 3 * d / 5, 0, 2 * d / 5, b / 2, 2 * d / 5);
	e.curveTo(b / 2 - c, 2 * d / 5, b / 2 - c, 0, b / 2, 0);
	e.curveTo(b / 2 + c, 0, b / 2 + c, 2 * d / 5, b / 2, 2 * d / 5);
	e.curveTo(b, 2 * d / 5, b, 3 * d / 5, b, d);
	e.close()
};
function mxCloud(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxCloud.prototype = new mxActor();
mxCloud.prototype.constructor = mxActor;
mxCloud.prototype.redrawPath = function(d, a, e, b, c) {
	d.moveTo(0.25 * b, 0.25 * c);
	d.curveTo(0.05 * b, 0.25 * c, 0, 0.5 * c, 0.16 * b, 0.55 * c);
	d.curveTo(0, 0.66 * c, 0.18 * b, 0.9 * c, 0.31 * b, 0.8 * c);
	d.curveTo(0.4 * b, c, 0.7 * b, c, 0.8 * b, 0.8 * c);
	d.curveTo(b, 0.8 * c, b, 0.6 * c, 0.875 * b, 0.5 * c);
	d.curveTo(b, 0.3 * c, 0.8 * b, 0.1 * c, 0.625 * b, 0.2 * c);
	d.curveTo(0.5 * b, 0.05 * c, 0.3 * b, 0.05 * c, 0.25 * b, 0.25 * c);
	d.close()
};
function mxRectangleShape(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxRectangleShape.prototype = new mxShape();
mxRectangleShape.prototype.constructor = mxRectangleShape;
mxRectangleShape.prototype.createHtml = function() {
	var a = document.createElement("DIV");
	this.configureHtmlShape(a);
	return a
};
mxRectangleShape.prototype.createVml = function() {
	var a = (this.isRounded) ? "v:roundrect": "v:rect";
	var b = document.createElement(a);
	this.configureVmlShape(b);
	return b
};
mxRectangleShape.prototype.createSvg = function() {
	return this.createSvgGroup("rect")
};
function mxEllipse(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxEllipse.prototype = new mxShape();
mxEllipse.prototype.constructor = mxEllipse;
mxEllipse.prototype.mixedModeHtml = false;
mxEllipse.prototype.preferModeHtml = false;
mxEllipse.prototype.createVml = function() {
	var a = document.createElement("v:arc");
	a.startangle = "0";
	a.endangle = "360";
	this.configureVmlShape(a);
	return a
};
mxEllipse.prototype.createSvg = function() {
	return this.createSvgGroup("ellipse")
};
mxEllipse.prototype.redrawSvg = function() {
	if (this.crisp) {
		this.innerNode.setAttribute("shape-rendering", "crispEdges")
	} else {
		this.innerNode.removeAttribute("shape-rendering")
	}
	this.updateSvgNode(this.innerNode);
	this.updateSvgNode(this.shadowNode)
};
mxEllipse.prototype.updateSvgNode = function(a) {
	if (a != null) {
		var b = Math.round(Math.max(1, this.strokewidth * this.scale));
		a.setAttribute("stroke-width", b);
		a.setAttribute("cx", this.bounds.x + this.bounds.width / 2);
		a.setAttribute("cy", this.bounds.y + this.bounds.height / 2);
		a.setAttribute("rx", this.bounds.width / 2);
		a.setAttribute("ry", this.bounds.height / 2)
	}
};
function mxDoubleEllipse(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxDoubleEllipse.prototype = new mxShape();
mxDoubleEllipse.prototype.constructor = mxDoubleEllipse;
mxDoubleEllipse.prototype.vmlNodes = mxDoubleEllipse.prototype.vmlNodes.concat(["background", "foreground"]);
mxDoubleEllipse.prototype.mixedModeHtml = false;
mxDoubleEllipse.prototype.preferModeHtml = false;
mxDoubleEllipse.prototype.createVml = function() {
	var a = document.createElement("v:group");
	this.background = document.createElement("v:arc");
	this.background.startangle = "0";
	this.background.endangle = "360";
	this.configureVmlShape(this.background);
	a.appendChild(this.background);
	this.label = this.background;
	this.isShadow = false;
	this.fill = null;
	this.foreground = document.createElement("v:oval");
	this.configureVmlShape(this.foreground);
	a.appendChild(this.foreground);
	this.stroke = null;
	this.configureVmlShape(a);
	return a
};
mxDoubleEllipse.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.foreground);
	var d = this.strokewidth * this.scale;
	var b = 3 + d;
	var a = Math.round(this.bounds.width);
	var c = Math.round(this.bounds.height);
	this.foreground.style.top = b + "px";
	this.foreground.style.left = b + "px";
	this.foreground.style.width = Math.max(0, a - 2 * b) + "px";
	this.foreground.style.height = Math.max(0, c - 2 * b) + "px"
};
mxDoubleEllipse.prototype.createSvg = function() {
	var a = this.createSvgGroup("ellipse");
	this.foreground = document.createElementNS(mxConstants.NS_SVG, "ellipse");
	if (this.stroke != null) {
		this.foreground.setAttribute("stroke", this.stroke)
	} else {
		this.foreground.setAttribute("stroke", "none")
	}
	this.foreground.setAttribute("fill", "none");
	a.appendChild(this.foreground);
	return a
};
mxDoubleEllipse.prototype.redrawSvg = function() {
	var a = this.strokewidth * this.scale;
	if (this.crisp) {
		this.innerNode.setAttribute("shape-rendering", "crispEdges");
		this.foreground.setAttribute("shape-rendering", "crispEdges")
	} else {
		this.innerNode.removeAttribute("shape-rendering");
		this.foreground.removeAttribute("shape-rendering")
	}
	this.updateSvgNode(this.innerNode);
	this.updateSvgNode(this.shadowNode);
	this.updateSvgNode(this.foreground, 3 * this.scale + a)
};
mxDoubleEllipse.prototype.updateSvgNode = function(b, a) {
	a = (a != null) ? a: 0;
	if (b != null) {
		var c = Math.round(Math.max(1, this.strokewidth * this.scale));
		b.setAttribute("stroke-width", c);
		b.setAttribute("cx", this.bounds.x + this.bounds.width / 2);
		b.setAttribute("cy", this.bounds.y + this.bounds.height / 2);
		b.setAttribute("rx", Math.max(0, this.bounds.width / 2 - a));
		b.setAttribute("ry", Math.max(0, this.bounds.height / 2 - a))
	}
};
function mxRhombus(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxRhombus.prototype = new mxShape();
mxRhombus.prototype.constructor = mxRhombus;
mxRhombus.prototype.mixedModeHtml = false;
mxRhombus.prototype.preferModeHtml = false;
mxRhombus.prototype.createHtml = function() {
	var a = document.createElement("DIV");
	this.configureHtmlShape(a);
	return a
};
mxRhombus.prototype.createVml = function() {
	var a = document.createElement("v:shape");
	this.configureVmlShape(a);
	return a
};
mxRhombus.prototype.createSvg = function() {
	return this.createSvgGroup("path")
};
mxRhombus.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	var a = 0;
	var d = 0;
	var b = Math.round(this.bounds.width);
	var c = Math.round(this.bounds.height);
	this.node.path = "m " + Math.round(a + b / 2) + " " + d + " l " + (a + b) + " " + Math.round(d + c / 2) + " l " + Math.round(a + b / 2) + " " + (d + c) + " l " + a + " " + Math.round(d + c / 2) + " x e"
};
mxRhombus.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node)
};
mxRhombus.prototype.redrawSvg = function() {
	this.updateSvgNode(this.innerNode);
	if (this.shadowNode != null) {
		this.updateSvgNode(this.shadowNode)
	}
};
mxRhombus.prototype.updateSvgNode = function(e) {
	var i = Math.round(Math.max(1, this.strokewidth * this.scale));
	e.setAttribute("stroke-width", i);
	var a = this.bounds.x;
	var g = this.bounds.y;
	var b = this.bounds.width;
	var c = this.bounds.height;
	var f = "M " + Math.round(a + b / 2) + " " + Math.round(g) + " L " + Math.round(a + b) + " " + Math.round(g + c / 2) + " L " + Math.round(a + b / 2) + " " + Math.round(g + c) + " L " + Math.round(a) + " " + Math.round(g + c / 2) + " Z ";
	e.setAttribute("d", f);
	this.updateSvgTransform(e, e == this.shadowNode)
};
function mxPolyline(b, c, a) {
	this.points = b;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxPolyline.prototype = new mxShape();
mxPolyline.prototype.constructor = mxPolyline;
mxPolyline.prototype.create = function() {
	var a = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		a = this.createSvg()
	} else {
		if (this.dialect == mxConstants.DIALECT_STRICTHTML || (this.dialect == mxConstants.DIALECT_PREFERHTML && this.points != null && this.points.length > 0)) {
			a = document.createElement("DIV");
			this.configureHtmlShape(a);
			a.style.borderStyle = "";
			a.style.background = ""
		} else {
			a = document.createElement("v:shape");
			this.configureVmlShape(a);
			var b = document.createElement("v:stroke");
			if (this.opacity != null) {
				b.opacity = this.opacity + "%"
			}
			a.appendChild(b)
		}
	}
	return a
};
mxPolyline.prototype.redrawVml = function() {
	if (this.points != null && this.points.length > 0 && this.points[0] != null) {
		this.bounds = new mxRectangle(this.points[0].x, this.points[0].y, 0, 0);
		for (var a = 1; a < this.points.length; a++) {
			this.bounds.add(new mxRectangle(this.points[a].x, this.points[a].y, 0, 0))
		}
	}
	mxShape.prototype.redrawVml.apply(this, arguments)
};
mxPolyline.prototype.createSvg = function() {
	var a = this.createSvgGroup("path");
	this.pipe = this.createSvgPipe();
	a.appendChild(this.pipe);
	return a
};
mxPolyline.prototype.redrawSvg = function() {
	this.updateSvgShape(this.innerNode);
	var a = this.innerNode.getAttribute("d");
	if (a != null) {
		this.pipe.setAttribute("d", a);
		var b = Math.round(Math.max(1, this.strokewidth * this.scale));
		this.pipe.setAttribute("stroke-width", b + mxShape.prototype.SVG_STROKE_TOLERANCE)
	}
};
function mxArrow(c, e, d, b, a, g, f) {
	this.points = c;
	this.fill = e;
	this.stroke = d;
	this.strokewidth = (b != null) ? b: 1;
	this.arrowWidth = (a != null) ? a: mxConstants.ARROW_WIDTH;
	this.spacing = (g != null) ? g: mxConstants.ARROW_SPACING;
	this.endSize = (f != null) ? f: mxConstants.ARROW_SIZE
}
mxArrow.prototype = new mxShape();
mxArrow.prototype.constructor = mxArrow;
mxArrow.prototype.mixedModeHtml = false;
mxArrow.prototype.preferModeHtml = false;
mxArrow.prototype.DEG_PER_RAD = 57.2957795;
mxArrow.prototype.createVml = function() {
	var a = document.createElement("v:shape");
	a.style.position = "absolute";
	this.configureVmlShape(a);
	return a
};
mxArrow.prototype.redrawVml = function() {
	if (this.points != null) {
		this.updateVmlShape(this.node);
		var f = this.spacing * this.scale;
		var s = this.arrowWidth * this.scale;
		var d = this.endSize * this.scale;
		var c = this.points[0].clone();
		c.x -= this.bounds.x;
		c.y -= this.bounds.y;
		var z = this.points[this.points.length - 1].clone();
		z.x -= this.bounds.x;
		z.y -= this.bounds.y;
		var q = z.x - c.x;
		var p = z.y - c.y;
		var r = Math.sqrt(q * q + p * p);
		var e = r - 2 * f - d;
		var y = q / r;
		var x = p / r;
		var k = e * y;
		var i = e * x;
		var h = s * x / 3;
		var g = -s * y / 3;
		var v = c.x - h / 2 + f * y;
		var t = c.y - g / 2 + f * x;
		var b = v + h;
		var a = t + g;
		var n = b + k;
		var l = a + i;
		var w = n + h;
		var u = l + g;
		var o = w - 3 * h;
		var m = u - 3 * g;
		this.node.path = "m" + Math.round(v) + " " + Math.round(t) + " l" + Math.round(b) + " " + Math.round(a) + " " + Math.round(n) + " " + Math.round(l) + " " + Math.round(w) + " " + Math.round(u) + " " + Math.round(z.x - f * y) + " " + Math.round(z.y - f * x) + " " + Math.round(o) + " " + Math.round(m) + " " + Math.round(o + h) + " " + Math.round(m + g) + " " + Math.round(v) + " " + Math.round(t) + " xe"
	}
};
mxArrow.prototype.createSvg = function() {
	var a = document.createElementNS(mxConstants.NS_SVG, "polygon");
	this.configureSvgShape(a);
	return a
};
mxArrow.prototype.redrawSvg = function() {
	if (this.points != null) {
		var m = Math.round(Math.max(1, this.strokewidth * this.scale));
		this.node.setAttribute("stroke-width", m);
		var r = this.points[0];
		var g = this.points[this.points.length - 1];
		var d = g.x - r.x;
		var c = g.y - r.y;
		var i = Math.sqrt(d * d + c * c);
		var e = this.spacing * this.scale;
		var f = Math.min(25, Math.max(20, i / 5)) * this.scale;
		var n = i - 2 * e;
		var l = r.x + e;
		var k = r.y - f / 2;
		var s = f;
		var q = f * 0.3;
		var p = l + n;
		var a = k + f;
		var o = l + "," + (k + q) + " " + (p - s) + "," + (k + q) + " " + (p - s) + "," + k + " " + p + "," + (k + f / 2) + " " + (p - s) + "," + a + " " + (p - s) + "," + (a - q) + " " + l + "," + (a - q);
		this.node.setAttribute("points", o);
		var s = g.x - r.x;
		var q = g.y - r.y;
		var b = Math.atan(q / s) * this.DEG_PER_RAD;
		if (s < 0) {
			b -= 180
		}
		this.node.setAttribute("transform", "rotate(" + b + "," + r.x + "," + r.y + ")")
	}
};
function mxText(m, g, p, f, o, r, k, d, e, t, b, h, c, s, q, n, i, a, l, u) {
	this.value = m;
	this.bounds = g;
	this.color = (o != null) ? o: "black";
	this.align = (p != null) ? p: "";
	this.valign = (f != null) ? f: "";
	this.family = (r != null) ? r: mxConstants.DEFAULT_FONTFAMILY;
	this.size = (k != null) ? k: mxConstants.DEFAULT_FONTSIZE;
	this.fontStyle = (d != null) ? d: 0;
	this.spacing = parseInt(e || 2);
	this.spacingTop = this.spacing + parseInt(t || 0);
	this.spacingRight = this.spacing + parseInt(b || 0);
	this.spacingBottom = this.spacing + parseInt(h || 0);
	this.spacingLeft = this.spacing + parseInt(c || 0);
	this.horizontal = (s != null) ? s: true;
	this.background = q;
	this.border = n;
	this.wrap = (i != null) ? i: false;
	this.clipped = (a != null) ? a: false;
	this.overflow = (l != null) ? l: "visible";
	this.labelPadding = (u != null) ? u: 0
}
mxText.prototype = new mxShape();
mxText.prototype.constructor = mxText;
mxText.prototype.ieVerticalFilter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
mxText.prototype.verticalTextDegree = -90;
mxText.prototype.isStyleSet = function(a) {
	return (this.fontStyle & a) == a
};
mxText.prototype.create = function(a) {
	var b = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		b = this.createSvg()
	} else {
		if (this.dialect == mxConstants.DIALECT_STRICTHTML || this.dialect == mxConstants.DIALECT_PREFERHTML || !mxUtils.isVml(a)) {
			if (mxClient.IS_SVG && !mxClient.NO_FO) {
				b = this.createForeignObject()
			} else {
				b = this.createHtml()
			}
		} else {
			b = this.createVml()
		}
	}
	return b
};
mxText.prototype.createForeignObject = function() {
	var c = document.createElementNS(mxConstants.NS_SVG, "g");
	var b = document.createElementNS(mxConstants.NS_SVG, "foreignObject");
	b.setAttribute("pointer-events", "fill");
	var a = document.createElementNS(mxConstants.NS_XHTML, "body");
	a.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
	a.style.margin = "0px";
	a.style.height = "100%";
	b.appendChild(a);
	c.appendChild(b);
	return c
};
mxText.prototype.createHtml = function() {
	var a = this.createHtmlTable();
	a.style.position = "absolute";
	return a
};
mxText.prototype.createVml = function() {
	return document.createElement("v:textbox")
};
mxText.prototype.redrawHtml = function() {
	this.redrawVml()
};
mxText.prototype.getOffset = function(h, f, a, e, b) {
	b = (b != null) ? b: this.horizontal;
	var d = (b) ? this.align: this.valign;
	var c = (b) ? this.valign: this.align;
	var i = a - h;
	var g = e - f;
	if (d == mxConstants.ALIGN_CENTER || d == mxConstants.ALIGN_MIDDLE) {
		i = Math.round(i / 2)
	} else {
		if (d == mxConstants.ALIGN_LEFT || d === mxConstants.ALIGN_TOP) {
			i = (b) ? 0 : (a - e) / 2
		} else {
			if (!b) {
				i = (a + e) / 2 - h
			}
		}
	}
	if (c == mxConstants.ALIGN_MIDDLE || c == mxConstants.ALIGN_CENTER) {
		g = Math.round(g / 2)
	} else {
		if (c == mxConstants.ALIGN_TOP || c == mxConstants.ALIGN_LEFT) {
			g = (b) ? 0 : (e + a) / 2 - f
		} else {
			if (!b) {
				g = (e - a) / 2
			}
		}
	}
	return new mxPoint(i, g)
};
mxText.prototype.getSpacing = function(b) {
	b = (b != null) ? b: this.horizontal;
	var c = 0;
	var a = 0;
	if (this.align == mxConstants.ALIGN_CENTER) {
		c = (this.spacingLeft - this.spacingRight) / 2
	} else {
		if (this.align == mxConstants.ALIGN_RIGHT) {
			c = -this.spacingRight
		} else {
			c = this.spacingLeft
		}
	}
	if (this.valign == mxConstants.ALIGN_MIDDLE) {
		a = (this.spacingTop - this.spacingBottom) / 2
	} else {
		if (this.valign == mxConstants.ALIGN_BOTTOM) {
			a = -this.spacingBottom
		} else {
			a = this.spacingTop
		}
	}
	return (b) ? new mxPoint(c, a) : new mxPoint(a, c)
};
mxText.prototype.createHtmlTable = function() {
	var b = document.createElement("table");
	b.style.borderCollapse = "collapse";
	var a = document.createElement("tbody");
	var c = document.createElement("tr");
	var d = document.createElement("td");
	c.appendChild(d);
	a.appendChild(c);
	b.appendChild(a);
	return b
};
mxText.prototype.updateHtmlTable = function(a, c) {
	c = (c != null) ? c: 1;
	var d = a.firstChild.firstChild.firstChild;
	if (this.wrap) {
		a.style.width = ""
	}
	if (mxUtils.isNode(this.value)) {
		if (d.firstChild != this.value) {
			if (d.firstChild != null) {
				d.removeChild(d.firstChild)
			}
			d.appendChild(this.value)
		}
	} else {
		if (this.lastValue != this.value) {
			d.innerHTML = this.value.replace(/\n/g, "<br/>");
			this.lastValue = this.value
		}
	}
	var b = Math.round(this.size * c);
	if (b <= 0) {
		a.style.visibility = "hidden"
	} else {
		a.style.visibility = ""
	}
	a.style.fontSize = b + "px";
	a.style.color = this.color;
	a.style.fontFamily = this.family;
	if (this.isStyleSet(mxConstants.FONT_BOLD)) {
		a.style.fontWeight = "bold"
	} else {
		a.style.fontWeight = "normal"
	}
	if (this.isStyleSet(mxConstants.FONT_ITALIC)) {
		a.style.fontStyle = "italic"
	} else {
		a.style.fontStyle = ""
	}
	if (this.isStyleSet(mxConstants.FONT_UNDERLINE)) {
		a.style.textDecoration = "underline"
	} else {
		a.style.textDecoration = ""
	}
	if (mxClient.IS_IE) {
		if (this.isStyleSet(mxConstants.FONT_SHADOW)) {
			d.style.filter = "Shadow(Color=#666666,Direction=135,Strength=%)"
		} else {
			d.style.removeAttribute("filter")
		}
	}
	d.style.textAlign = (this.align == mxConstants.ALIGN_RIGHT) ? "right": ((this.align == mxConstants.ALIGN_CENTER) ? "center": "left");
	d.style.verticalAlign = (this.valign == mxConstants.ALIGN_BOTTOM) ? "bottom": ((this.valign == mxConstants.ALIGN_MIDDLE) ? "middle": "top");
	if (this.value.length > 0 && this.background != null) {
		d.style.background = this.background
	} else {
		d.style.background = ""
	}
	d.style.padding = this.labelPadding + "px";
	if (this.value.length > 0 && this.border != null) {
		a.style.borderColor = this.border;
		a.style.borderWidth = "1px";
		a.style.borderStyle = "solid"
	} else {
		a.style.borderStyle = "none"
	}
};
mxText.prototype.updateTableWidth = function(a) {
	var c = a.firstChild.firstChild.firstChild;
	if (this.wrap && this.bounds.width > 0 && this.dialect != mxConstants.DIALECT_SVG) {
		c.style.whiteSpace = "nowrap";
		var b = Math.min(a.offsetWidth, ((this.horizontal || mxUtils.isVml(this.node)) ? this.bounds.width: this.bounds.height) / this.scale);
		if (mxClient.IS_OP) {
			b *= this.scale
		}
		a.style.width = Math.round(b) + "px";
		c.style.whiteSpace = "normal"
	} else {
		a.style.width = "";
		c.style.whiteSpace = "nowrap"
	}
};
mxText.prototype.redrawVml = function() {
	if (this.node.nodeName == "g") {
		this.redrawForeignObject()
	} else {
		if (mxUtils.isVml(this.node)) {
			this.redrawTextbox()
		} else {
			this.redrawHtmlTable()
		}
	}
};
mxText.prototype.redrawTextbox = function() {
	var q = this.node;
	if (q.firstChild == null) {
		q.appendChild(this.createHtmlTable())
	}
	var z = q.firstChild;
	this.updateHtmlTable(z);
	this.updateTableWidth(z);
	if (this.opacity != null) {
		mxUtils.setOpacity(z, this.opacity)
	}
	z.style.filter = "";
	q.inset = "0px,0px,0px,0px";
	if (this.overflow != "fill") {
		var k = z.offsetWidth * this.scale;
		var u = z.offsetHeight * this.scale;
		var e = this.getOffset(this.bounds.width, this.bounds.height, k, u);
		if (!this.horizontal) {
			z.style.filter = this.ieVerticalFilter
		}
		var c = this.getSpacing();
		var g = this.bounds.x - e.x + c.x * this.scale;
		var f = this.bounds.y - e.y + c.y * this.scale;
		var v = this.bounds.x;
		var a = this.bounds.y;
		var d = this.bounds.width;
		var o = this.bounds.height;
		if (this.horizontal) {
			var C = Math.round(g - v);
			var B = Math.round(f - a);
			var p = Math.min(0, Math.round(v + d - g - k - 1));
			var A = Math.min(0, Math.round(a + o - f - u - 1));
			q.inset = C + "px," + B + "px," + p + "px," + A + "px"
		} else {
			var n = 0;
			var s = 0;
			var p = 0;
			var A = 0;
			if (this.align == mxConstants.ALIGN_CENTER) {
				n = (o - k) / 2;
				A = n
			} else {
				if (this.align == mxConstants.ALIGN_LEFT) {
					n = o - k
				} else {
					A = o - k
				}
			}
			if (this.valign == mxConstants.ALIGN_MIDDLE) {
				s = (d - u) / 2;
				p = s
			} else {
				if (this.valign == mxConstants.ALIGN_BOTTOM) {
					s = d - u
				} else {
					p = d - u
				}
			}
			q.inset = s + "px," + n + "px," + p + "px," + A + "px"
		}
		q.style.zoom = this.scale;
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			var m = Math.round(v - g);
			var i = Math.round(a - f);
			q.style.clip = "rect(" + (i / this.scale) + " " + ((m + this.bounds.width) / this.scale) + " " + ((i + this.bounds.height) / this.scale) + " " + (m / this.scale) + ")"
		} else {
			this.boundingBox = new mxRectangle(g, f, k, u)
		}
	} else {
		this.boundingBox = this.bounds.clone()
	}
};
mxText.prototype.redrawHtmlTable = function() {
	if (isNaN(this.bounds.x) || isNaN(this.bounds.y) || isNaN(this.bounds.width) || isNaN(this.bounds.height)) {
		return
	}
	var t = this.node;
	var f = t.firstChild.firstChild.firstChild;
	var e = false;
	var q = 1;
	if (mxClient.IS_IE) {
		t.style.removeAttribute("filter")
	} else {
		if (mxClient.IS_SF || mxClient.IS_GC) {
			t.style.WebkitTransform = ""
		} else {
			if (mxClient.IS_Mt) {
				t.style.MozTransform = "";
				f.style.MozTransform = ""
			} else {
				if (mxClient.IS_OT) {
					t.style.OTransform = ""
				}
				q = this.scale;
				e = true
			}
		}
	}
	f.style.zoom = "";
	this.updateHtmlTable(t, q);
	this.updateTableWidth(t);
	if (this.opacity != null) {
		mxUtils.setOpacity(t, this.opacity)
	}
	t.style.left = "";
	t.style.top = "";
	t.style.height = "";
	var n = parseFloat(f.style.zoom) || 1;
	var l = t.offsetWidth / n;
	var r = t.offsetHeight / n;
	var c = this.getOffset(this.bounds.width / this.scale, this.bounds.height / this.scale, l, r, e || this.horizontal);
	var b = this.getSpacing(e || this.horizontal);
	var i = this.bounds.x / this.scale - c.x + b.x;
	var g = this.bounds.y / this.scale - c.y + b.y;
	var o = this.scale;
	var a = 1;
	var v = 0;
	var u = 0;
	if (!this.horizontal) {
		if (mxClient.IS_IE && mxClient.IS_SVG) {
			t.style.msTransform = "rotate(" + this.verticalTextDegree + "deg)"
		} else {
			if (mxClient.IS_IE) {
				t.style.filter = this.ieVerticalFilter;
				v = (l - r) / 2;
				u = -v
			} else {
				if (mxClient.IS_SF || mxClient.IS_GC) {
					t.style.WebkitTransform = "rotate(" + this.verticalTextDegree + "deg)"
				} else {
					if (mxClient.IS_OT) {
						t.style.OTransform = "rotate(" + this.verticalTextDegree + "deg)"
					} else {
						if (mxClient.IS_MT) {
							t.style.MozTransform = "rotate(" + this.verticalTextDegree + "deg)";
							f.style.MozTransform = "rotate(0deg)";
							a = 1 / this.scale;
							o = 1
						}
					}
				}
			}
		}
	}
	if (mxClient.IS_MT || e) {
		if (mxClient.IS_MT) {
			t.style.MozTransform += " scale(" + this.scale + ")";
			a = 1 / this.scale
		} else {
			if (mxClient.IS_OT) {
				f.style.OTransform = "scale(" + this.scale + ")"
			}
		}
		v = (this.scale - 1) * l / (2 * this.scale);
		u = (this.scale - 1) * r / (2 * this.scale);
		o = 1
	} else {
		if (!e) {
			if (mxClient.IS_IE && mxClient.IS_SVG) {
				f.style.msTransform = "scale(" + this.scale + ")";
				v = (this.scale - 1) * l / (2 * this.scale);
				u = (this.scale - 1) * r / (2 * this.scale);
				o = 1;
				o = this.scale
			} else {
				if (mxClient.IS_SF || mxClient.IS_GC) {
					f.style.WebkitTransform = "scale(" + this.scale + ")";
					v = (this.scale - 1) * l / (2 * this.scale);
					u = (this.scale - 1) * r / (2 * this.scale);
					o = 1
				} else {
					f.style.zoom = this.scale;
					if (document.documentMode == 8 || !mxClient.IS_IE) {
						o = 1
					}
				}
			}
		}
	}
	if (this.overflow != "fill") {
		t.style.left = Math.round((i + v) * this.scale) + "px";
		t.style.top = Math.round((g + u) * this.scale) + "px";
		t.style.width = Math.round(l * o) + "px";
		t.style.height = Math.round(r * o) + "px";
		if ((this.background != null || this.border != null) && (document.documentMode == 8 || (mxClient.IS_IE && mxClient.IS_SVG))) {
			f.innerHTML = '<div style="padding:' + this.labelPadding + "px;background:" + f.style.background + ";border:" + t.style.border + '">' + this.value + "</div>";
			f.style.padding = "0px";
			f.style.background = "";
			t.style.border = ""
		}
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			if (this.horizontal || (e && !mxClient.IS_OT)) {
				var m = Math.max(0, c.x * o);
				var k = Math.max(0, c.y * o);
				t.style.clip = "rect(" + (k) + "px " + (m + this.bounds.width * a) + "px " + (k + this.bounds.height * a) + "px " + (m) + "px)"
			} else {
				if (mxClient.IS_IE) {
					var d = this.bounds.width;
					var p = this.bounds.height;
					var m = 0;
					var k = 0;
					if (this.align == mxConstants.ALIGN_LEFT) {
						m = Math.max(0, l - p / this.scale) * this.scale
					} else {
						if (this.align == mxConstants.ALIGN_CENTER) {
							m = Math.max(0, l - p / this.scale) * this.scale / 2
						}
					}
					if (this.valign == mxConstants.ALIGN_BOTTOM) {
						k = Math.max(0, r - d / this.scale) * this.scale
					} else {
						if (this.valign == mxConstants.ALIGN_MIDDLE) {
							k = Math.max(0, r - d / this.scale) * this.scale / 2
						}
					}
					t.style.clip = "rect(" + (m) + "px " + (k + d - 1) + "px " + (m + p - 1) + "px " + (k) + "px)"
				} else {
					var d = this.bounds.width / this.scale;
					var p = this.bounds.height / this.scale;
					if (mxClient.IS_OT) {
						d = this.bounds.width;
						p = this.bounds.height
					}
					var m = 0;
					var k = 0;
					if (this.align == mxConstants.ALIGN_RIGHT) {
						m = Math.max(0, l - p)
					} else {
						if (this.align == mxConstants.ALIGN_CENTER) {
							m = Math.max(0, l - p) / 2
						}
					}
					if (this.valign == mxConstants.ALIGN_BOTTOM) {
						k = Math.max(0, r - d)
					} else {
						if (this.valign == mxConstants.ALIGN_MIDDLE) {
							k = Math.max(0, r - d) / 2
						}
					}
					if (mxClient.IS_GC || mxClient.IS_SF) {
						m *= this.scale;
						k *= this.scale;
						d *= this.scale;
						p *= this.scale
					}
					t.style.clip = "rect(" + (k) + " " + (m + p) + " " + (k + d) + " " + (m) + ")"
				}
			}
		} else {
			this.boundingBox = new mxRectangle(t.offsetLeft, t.offsetTop, t.offsetWidth, t.offsetHeight)
		}
	} else {
		this.boundingBox = this.bounds.clone();
		t.style.left = Math.round(this.bounds.x + this.scale / 2) + "px";
		t.style.top = Math.round(this.bounds.y + this.scale / 2) + "px";
		t.style.width = Math.round(this.bounds.width - this.scale) + "px";
		t.style.height = Math.round(this.bounds.height - this.scale) + "px"
	}
};
mxText.prototype.getVerticalOffset = function(a) {
	return new mxPoint(a.y, -a.x)
};
mxText.prototype.redrawForeignObject = function() {
	var g = this.node;
	var f = g.firstChild;
	while (f == this.backgroundNode) {
		f = f.nextSibling
	}
	var n = f.firstChild;
	if (n.firstChild == null) {
		n.appendChild(this.createHtmlTable())
	}
	var v = n.firstChild;
	this.updateHtmlTable(v);
	if (this.opacity != null) {
		f.setAttribute("opacity", this.opacity / 100)
	}
	if (mxClient.IS_GC || mxClient.IS_SF) {
		v.style.borderStyle = "none";
		v.firstChild.firstChild.firstChild.style.background = "";
		if (this.backgroundNode == null && (this.background != null || this.border != null)) {
			this.backgroundNode = document.createElementNS(mxConstants.NS_SVG, "rect");
			g.insertBefore(this.backgroundNode, g.firstChild)
		} else {
			if (this.backgroundNode != null && this.background == null && this.border == null) {
				this.backgroundNode.parentNode.removeChild(this.backgroundNode);
				this.backgroundNode = null
			}
		}
		if (this.backgroundNode != null) {
			if (this.background != null) {
				this.backgroundNode.setAttribute("fill", this.background)
			} else {
				this.backgroundNode.setAttribute("fill", "none")
			}
			if (this.border != null) {
				this.backgroundNode.setAttribute("stroke", this.border)
			} else {
				this.backgroundNode.setAttribute("stroke", "none")
			}
		}
	}
	var a = "";
	if (this.overflow != "fill") {
		f.removeAttribute("width");
		f.removeAttribute("height");
		f.style.width = "";
		f.style.height = "";
		f.style.clip = "";
		if (this.wrap || (!mxClient.IS_GC && !mxClient.IS_SF)) {
			document.body.appendChild(v)
		}
		this.updateTableWidth(v);
		var m = v.offsetWidth;
		var r = v.offsetHeight;
		if (v.parentNode != n) {
			n.appendChild(v)
		}
		var c = this.getSpacing();
		var k = this.bounds.x / this.scale + c.x;
		var i = this.bounds.y / this.scale + c.y;
		var e = this.bounds.width / this.scale;
		var q = this.bounds.height / this.scale;
		var d = this.getOffset(e, q, m, r);
		if (this.horizontal) {
			k -= d.x;
			i -= d.y;
			a = "scale(" + this.scale + ")"
		} else {
			var t = k + m / 2;
			var b = i + r / 2;
			a = "scale(" + this.scale + ") rotate(" + this.verticalTextDegree + " " + t + " " + b + ")";
			var z = this.getVerticalOffset(d);
			k += z.x;
			i += z.y
		}
		a += " translate(" + k + " " + i + ")";
		if (this.backgroundNode != null) {
			this.backgroundNode.setAttribute("width", m);
			this.backgroundNode.setAttribute("height", r)
		}
		f.setAttribute("width", m);
		f.setAttribute("height", r);
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			var o = Math.max(0, d.x);
			var l = Math.max(0, d.y);
			if (this.horizontal) {
				f.style.clip = "rect(" + l + " " + (o + e) + " " + (l + q) + " " + (o) + ")"
			} else {
				var o = 0;
				var l = 0;
				if (this.align == mxConstants.ALIGN_RIGHT) {
					o = Math.max(0, m - q)
				} else {
					if (this.align == mxConstants.ALIGN_CENTER) {
						o = Math.max(0, m - q) / 2
					}
				}
				if (this.valign == mxConstants.ALIGN_BOTTOM) {
					l = Math.max(0, r - e)
				} else {
					if (this.valign == mxConstants.ALIGN_MIDDLE) {
						l = Math.max(0, r - e) / 2
					}
				}
				f.style.clip = "rect(" + (l) + " " + (o + q) + " " + (l + e) + " " + (o) + ")"
			}
			if (this.backgroundNode != null) {
				k = this.bounds.x / this.scale;
				i = this.bounds.y / this.scale;
				if (!this.horizontal) {
					k += (r + m) / 2 - q;
					i += (r - m) / 2;
					var z = e;
					e = q;
					q = z
				}
				var u = this.getSvgClip(this.node.ownerSVGElement, k, i, e, q);
				if (u != this.clip) {
					this.releaseSvgClip();
					this.clip = u;
					u.refCount++
				}
				this.backgroundNode.setAttribute("clip-path", "url(#" + u.getAttribute("id") + ")")
			}
		} else {
			this.releaseSvgClip();
			if (this.backgroundNode != null) {
				this.backgroundNode.removeAttribute("clip-path")
			}
			if (this.horizontal) {
				this.boundingBox = new mxRectangle(k * this.scale, i * this.scale, m * this.scale, r * this.scale)
			} else {
				this.boundingBox = new mxRectangle(k * this.scale, i * this.scale, r * this.scale, m * this.scale)
			}
		}
	} else {
		var p = this.scale;
		var m = this.bounds.width / p;
		var r = this.bounds.height / p;
		f.setAttribute("width", m);
		f.setAttribute("height", r);
		v.style.width = m + "px";
		v.style.height = r + "px";
		if (this.backgroundNode != null) {
			this.backgroundNode.setAttribute("width", m);
			this.backgroundNode.setAttribute("height", r)
		}
		a = "scale(" + p + ") translate(" + (this.bounds.x / p) + " " + (this.bounds.y / p) + ")"
	}
	g.setAttribute("transform", a)
};
mxText.prototype.createSvg = function() {
	var b = document.createElementNS(mxConstants.NS_SVG, "g");
	var e = this.isStyleSet(mxConstants.FONT_UNDERLINE) ? "underline": "none";
	var c = this.isStyleSet(mxConstants.FONT_BOLD) ? "bold": "normal";
	var a = this.isStyleSet(mxConstants.FONT_ITALIC) ? "italic": null;
	var d = (this.align == mxConstants.ALIGN_RIGHT) ? "end": (this.align == mxConstants.ALIGN_CENTER) ? "middle": "start";
	b.setAttribute("text-decoration", e);
	b.setAttribute("text-anchor", d);
	b.setAttribute("font-family", this.family);
	b.setAttribute("font-weight", c);
	b.setAttribute("font-size", Math.round(this.size * this.scale) + "px");
	b.setAttribute("fill", this.color);
	if (a != null) {
		b.setAttribute("font-style", a)
	}
	if (this.background != null || this.border != null) {
		this.backgroundNode = document.createElementNS(mxConstants.NS_SVG, "rect");
		this.backgroundNode.setAttribute("shape-rendering", "crispEdges");
		if (this.background != null) {
			this.backgroundNode.setAttribute("fill", this.background)
		} else {
			this.backgroundNode.setAttribute("fill", "none")
		}
		if (this.border != null) {
			this.backgroundNode.setAttribute("stroke", this.border)
		} else {
			this.backgroundNode.setAttribute("stroke", "none")
		}
	}
	this.updateSvgValue(b);
	return b
};
mxText.prototype.updateSvgValue = function(c) {
	if (this.currentValue != this.value) {
		while (c.firstChild != null) {
			c.removeChild(c.firstChild)
		}
		if (this.value != null) {
			var e = this.isStyleSet(mxConstants.FONT_UNDERLINE) ? "underline": "none";
			var a = this.value.split("\n");
			this.textNodes = new Array(a.length);
			for (var b = 0; b < a.length; b++) {
				if (!this.isEmptyString(a[b])) {
					var d = this.createSvgSpan(a[b]);
					c.appendChild(d);
					this.textNodes[b] = d;
					d.setAttribute("text-decoration", e)
				} else {
					this.textNodes[b] = null
				}
			}
		}
		this.currentValue = this.value
	}
};
mxText.prototype.redrawSvg = function() {
	if (this.node.nodeName == "foreignObject") {
		this.redrawHtml();
		return
	}
	var b = Math.round(this.size * this.scale);
	if (b <= 0) {
		this.node.setAttribute("visibility", "hidden")
	} else {
		this.node.removeAttribute("visibility")
	}
	this.updateSvgValue(this.node);
	this.node.setAttribute("font-size", b + "px");
	if (this.opacity != null) {
		this.node.setAttribute("fill-opacity", this.opacity / 100);
		this.node.setAttribute("stroke-opacity", this.opacity / 100)
	}
	var g = Math.round(b * 1.3);
	var s = this.node.childNodes.length;
	var n = (this.textNodes != null) ? this.textNodes.length: 0;
	if (this.backgroundNode != null) {
		s--
	}
	var f = this.bounds.x;
	var e = this.bounds.y;
	f += (this.align == mxConstants.ALIGN_RIGHT) ? ((this.horizontal) ? this.bounds.width: this.bounds.height) - this.spacingRight * this.scale: (this.align == mxConstants.ALIGN_CENTER) ? this.spacingLeft + (((this.horizontal) ? this.bounds.width: this.bounds.height) - this.spacingLeft - this.spacingRight) / 2 : this.spacingLeft * this.scale + 1;
	e += (this.valign == mxConstants.ALIGN_BOTTOM) ? ((this.horizontal) ? this.bounds.height: this.bounds.width) - (n - 1) * g - this.spacingBottom * this.scale - 4 : (this.valign == mxConstants.ALIGN_MIDDLE) ? (this.spacingTop * this.scale + ((this.horizontal) ? this.bounds.height: this.bounds.width) - this.spacingBottom * this.scale - (n - 1.5) * g) / 2 : this.spacingTop * this.scale + g;
	if (!this.horizontal) {
		var d = this.bounds.x + this.bounds.width / 2;
		var a = this.bounds.y + this.bounds.height / 2;
		var z = (this.bounds.width - this.bounds.height) / 2;
		var t = (this.bounds.height - this.bounds.width) / 2;
		this.node.setAttribute("transform", "rotate(" + this.verticalTextDegree + " " + d + " " + a + ") translate(" + ( - t) + " " + ( - z) + ")")
	}
	if (this.textNodes != null) {
		var p = e;
		for (var q = 0; q < n; q++) {
			var o = this.textNodes[q];
			if (o != null) {
				o.setAttribute("x", f);
				o.setAttribute("y", p);
				o.setAttribute("style", "pointer-events: all")
			}
			p += g
		}
	}
	if (this.overflow != "fill") {
		var c = this.value;
		var v = this.createHtmlTable();
		this.lastValue = null;
		this.value = mxUtils.htmlEntities(this.value, false);
		this.updateHtmlTable(v);
		document.body.appendChild(v);
		var k = v.offsetWidth * this.scale;
		var r = v.offsetHeight * this.scale;
		v.parentNode.removeChild(v);
		this.value = c;
		var l = 2 * this.scale;
		if (this.align == mxConstants.ALIGN_CENTER) {
			l += k / 2
		} else {
			if (this.align == mxConstants.ALIGN_RIGHT) {
				l += k
			}
		}
		this.boundingBox = new mxRectangle(f - l, e - g, k + 4 * this.scale, r + 1 * this.scale)
	} else {
		this.boundingBox = this.bounds.clone()
	}
	if (this.value.length > 0 && this.backgroundNode != null && this.node.firstChild != null) {
		if (this.node.firstChild != this.backgroundNode) {
			this.node.insertBefore(this.backgroundNode, this.node.firstChild)
		}
		this.backgroundNode.setAttribute("x", this.boundingBox.x + this.scale / 2 + 1 * this.scale);
		this.backgroundNode.setAttribute("y", this.boundingBox.y + this.scale / 2 + 2 * this.scale - this.labelPadding);
		this.backgroundNode.setAttribute("width", this.boundingBox.width - this.scale - 2 * this.scale);
		this.backgroundNode.setAttribute("height", this.boundingBox.height - this.scale);
		var m = Math.round(Math.max(1, this.scale));
		this.backgroundNode.setAttribute("stroke-width", m)
	}
	if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
		this.boundingBox = this.bounds.clone();
		if (!this.horizontal) {
			this.boundingBox.width = this.bounds.height;
			this.boundingBox.height = this.bounds.width
		}
		f = this.bounds.x;
		e = this.bounds.y;
		if (this.horizontal) {
			k = this.bounds.width;
			r = this.bounds.height
		} else {
			k = this.bounds.height;
			r = this.bounds.width
		}
		var u = this.getSvgClip(this.node.ownerSVGElement, f, e, k, r);
		if (u != this.clip) {
			this.releaseSvgClip();
			this.clip = u;
			u.refCount++
		}
		this.node.setAttribute("clip-path", "url(#" + u.getAttribute("id") + ")")
	} else {
		this.releaseSvgClip();
		this.node.removeAttribute("clip-path")
	}
};
mxText.prototype.releaseSvgClip = function() {
	if (this.clip != null) {
		this.clip.refCount--;
		if (this.clip.refCount == 0) {
			this.clip.parentNode.removeChild(this.clip)
		}
		this.clip = null
	}
};
mxText.prototype.getSvgClip = function(f, k, i, l, e) {
	k = Math.round(k);
	i = Math.round(i);
	l = Math.round(l);
	e = Math.round(e);
	var b = "-mx-clip+" + k + "+" + i + "+" + l + "+" + e;
	if (this.clip != null && this.clip.ident == b) {
		return this.clip
	}
	var a = 0;
	var d = b + "-" + a;
	var c = document.getElementById(d);
	while (c != null) {
		if (c.ownerSVGElement == f) {
			return c
		}
		a++;
		d = b + "-" + a;
		c = document.getElementById(d)
	}
	if (c != null) {
		c = c.cloneNode(true);
		a++
	} else {
		c = document.createElementNS(mxConstants.NS_SVG, "clipPath");
		var g = document.createElementNS(mxConstants.NS_SVG, "rect");
		g.setAttribute("x", k);
		g.setAttribute("y", i);
		g.setAttribute("width", l);
		g.setAttribute("height", e);
		c.appendChild(g)
	}
	c.setAttribute("id", b + "-" + a);
	c.ident = b;
	f.appendChild(c);
	c.refCount = 0;
	return c
};
mxText.prototype.isEmptyString = function(a) {
	return a.replace(/ /g, "").length == 0
};
mxText.prototype.createSvgSpan = function(b) {
	var a = document.createElementNS(mxConstants.NS_SVG, "text");
	mxUtils.write(a, b);
	return a
};
mxText.prototype.destroy = function() {
	this.releaseSvgClip();
	mxShape.prototype.destroy.apply(this, arguments)
};
function mxTriangle() {}
mxTriangle.prototype = new mxActor();
mxTriangle.prototype.constructor = mxTriangle;
mxTriangle.prototype.redrawPath = function(d, a, e, b, c) {
	d.moveTo(0, 0);
	d.lineTo(b, 0.5 * c);
	d.lineTo(0, c);
	d.close()
};
function mxHexagon() {}
mxHexagon.prototype = new mxActor();
mxHexagon.prototype.constructor = mxHexagon;
mxHexagon.prototype.redrawPath = function(d, a, e, b, c) {
	d.moveTo(0.25 * b, 0);
	d.lineTo(0.75 * b, 0);
	d.lineTo(b, 0.5 * c);
	d.lineTo(0.75 * b, c);
	d.lineTo(0.25 * b, c);
	d.lineTo(0, 0.5 * c);
	d.close()
};
function mxLine(b, c, a) {
	this.bounds = b;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxLine.prototype = new mxShape();
mxLine.prototype.constructor = mxLine;
mxLine.prototype.vmlNodes = mxLine.prototype.vmlNodes.concat(["label", "innerNode"]);
mxLine.prototype.mixedModeHtml = false;
mxLine.prototype.preferModeHtml = false;
mxLine.prototype.clone = function() {
	var a = new mxLine(this.bounds, this.stroke, this.strokewidth);
	a.isDashed = this.isDashed;
	return a
};
mxLine.prototype.createVml = function() {
	var a = document.createElement("v:group");
	a.style.position = "absolute";
	this.label = document.createElement("v:rect");
	this.label.style.position = "absolute";
	this.label.stroked = "false";
	this.label.filled = "false";
	a.appendChild(this.label);
	this.innerNode = document.createElement("v:shape");
	this.configureVmlShape(this.innerNode);
	a.appendChild(this.innerNode);
	return a
};
mxLine.prototype.reconfigure = function() {
	if (mxUtils.isVml(this.node)) {
		this.configureVmlShape(this.innerNode)
	} else {
		mxShape.prototype.reconfigure.apply(this, arguments)
	}
};
mxLine.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.label);
	this.innerNode.coordsize = this.node.coordsize;
	this.innerNode.strokeweight = (this.strokewidth * this.scale) + "px";
	this.innerNode.style.width = this.node.style.width;
	this.innerNode.style.height = this.node.style.height;
	var a = this.bounds.width;
	var b = this.bounds.height;
	if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH) {
		this.innerNode.path = "m " + Math.round(a / 2) + " 0 l " + Math.round(a / 2) + " " + Math.round(b) + " e"
	} else {
		this.innerNode.path = "m 0 " + Math.round(b / 2) + " l " + Math.round(a) + " " + Math.round(b / 2) + " e"
	}
};
mxLine.prototype.createSvg = function() {
	var a = this.createSvgGroup("path");
	this.pipe = this.createSvgPipe();
	a.appendChild(this.pipe);
	return a
};
mxLine.prototype.redrawSvg = function() {
	var g = Math.round(Math.max(1, this.strokewidth * this.scale));
	this.innerNode.setAttribute("stroke-width", g);
	if (this.bounds != null) {
		var a = this.bounds.x;
		var f = this.bounds.y;
		var b = this.bounds.width;
		var c = this.bounds.height;
		var e = null;
		if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH) {
			e = "M " + Math.round(a + b / 2) + " " + Math.round(f) + " L " + Math.round(a + b / 2) + " " + Math.round(f + c)
		} else {
			e = "M " + Math.round(a) + " " + Math.round(f + c / 2) + " L " + Math.round(a + b) + " " + Math.round(f + c / 2)
		}
		this.innerNode.setAttribute("d", e);
		this.pipe.setAttribute("d", e);
		this.pipe.setAttribute("stroke-width", this.strokewidth + mxShape.prototype.SVG_STROKE_TOLERANCE);
		this.updateSvgTransform(this.innerNode, false);
		this.updateSvgTransform(this.pipe, false);
		if (this.crisp) {
			this.innerNode.setAttribute("shape-rendering", "crispEdges")
		} else {
			this.innerNode.removeAttribute("shape-rendering")
		}
	}
};
function mxImageShape(b, e, d, c, a) {
	this.bounds = b;
	this.image = (e != null) ? e: "";
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1;
	this.isShadow = false
}
mxImageShape.prototype = new mxShape();
mxImageShape.prototype.constructor = mxImageShape;
mxImageShape.prototype.preserveImageAspect = true;
mxImageShape.prototype.apply = function(a) {
	mxShape.prototype.apply.apply(this, arguments);
	this.fill = null;
	this.stroke = null;
	if (this.style != null) {
		this.fill = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BACKGROUND);
		this.stroke = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BORDER);
		this.gradient = null
	}
};
mxImageShape.prototype.create = function() {
	var c = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		c = this.createSvgGroup("rect");
		this.innerNode.setAttribute("visibility", "hidden");
		this.innerNode.setAttribute("pointer-events", "fill");
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, "image");
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, "xlink:href", this.image);
		this.imageNode.setAttribute("style", "pointer-events:none");
		this.configureSvgShape(this.imageNode);
		this.imageNode.removeAttribute("stroke");
		this.imageNode.removeAttribute("fill");
		c.insertBefore(this.imageNode, this.innerNode);
		if ((this.fill != null && this.fill != mxConstants.NONE) || (this.stroke != null && this.stroke != mxConstants.NONE)) {
			this.bg = document.createElementNS(mxConstants.NS_SVG, "rect");
			c.insertBefore(this.bg, c.firstChild)
		}
		if (!this.preserveImageAspect) {
			this.imageNode.setAttribute("preserveAspectRatio", "none")
		}
	} else {
		var d = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_FLIPH, 0) == 1;
		var b = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_FLIPV, 0) == 1;
		var a = this.image.toUpperCase();
		if (mxClient.IS_IE && !d && !b && a.substring(0, 6) == "MHTML:") {
			this.imageNode = document.createElement("DIV");
			this.imageNode.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='" + this.image + "', sizingMethod='scale')";
			c = document.createElement("DIV");
			this.configureHtmlShape(c);
			c.appendChild(this.imageNode)
		} else {
			if (!mxClient.IS_IE || a.substring(0, 5) == "DATA:" || document.documentMode == 9) {
				this.imageNode = document.createElement("img");
				this.imageNode.setAttribute("src", this.image);
				this.imageNode.setAttribute("border", "0");
				this.imageNode.style.position = "absolute";
				this.imageNode.style.width = "100%";
				this.imageNode.style.height = "100%";
				c = document.createElement("DIV");
				this.configureHtmlShape(c);
				c.appendChild(this.imageNode)
			} else {
				this.imageNode = document.createElement("v:image");
				this.imageNode.style.position = "absolute";
				this.imageNode.src = this.image;
				this.imageNode.style.width = this.bounds.width + "px";
				this.imageNode.style.height = this.bounds.height + "px";
				c = document.createElement("DIV");
				this.configureHtmlShape(c);
				c.style.overflow = "visible";
				c.appendChild(this.imageNode)
			}
		}
	}
	return c
};
mxImageShape.prototype.updateAspect = function(a, e) {
	var d = Math.min(this.bounds.width / a, this.bounds.height / e);
	a = Math.round(a * d);
	e = Math.round(e * d);
	var c = (this.bounds.width - a) / 2;
	var f = (this.bounds.height - e) / 2;
	var b = this.imageNode.style;
	if (this.imageNode.parentNode == this.node) {
		this.node.style.paddingLeft = Math.round(c) + "px";
		this.node.style.paddingTop = Math.round(f) + "px"
	} else {
		b.left = Math.round(this.bounds.x + c) + "px";
		b.top = Math.round(this.bounds.y + f) + "px"
	}
	b.width = a + "px";
	b.height = e + "px"
};
mxImageShape.prototype.scheduleUpdateAspect = function() {
	var a = new Image();
	a.onload = mxUtils.bind(this,
	function() {
		mxImageShape.prototype.updateAspect.call(this, a.width, a.height)
	});
	a.src = this.image
};
mxImageShape.prototype.redraw = function() {
	mxShape.prototype.redraw.apply(this, arguments);
	if (this.imageNode != null && this.bounds != null) {
		var f = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_FLIPH, 0) == 1;
		var e = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_FLIPV, 0) == 1;
		if (this.dialect == mxConstants.DIALECT_SVG) {
			var h = 1;
			var g = 1;
			var b = 0;
			var a = 0;
			if (f) {
				h = -1;
				b = -this.bounds.width - 2 * this.bounds.x
			}
			if (e) {
				g = -1;
				a = -this.bounds.height - 2 * this.bounds.y
			}
			var c = (this.imageNode.getAttribute("transform") || "") + " scale(" + h + " " + g + ") translate(" + b + " " + a + ")";
			this.imageNode.setAttribute("transform", c)
		} else {
			if (this.preserveImageAspect) {
				this.scheduleUpdateAspect()
			} else {
				if (this.imageNode.nodeName != "DIV") {
					this.node.style.width = this.bounds.width + "px";
					this.node.style.height = this.bounds.height + "px"
				}
			}
			if (f || e) {
				if (mxUtils.isVml(this.imageNode)) {
					if (f && e) {
						this.imageNode.style.rotation = "180"
					} else {
						if (f) {
							this.imageNode.style.flip = "x"
						} else {
							this.imageNode.style.flip = "y"
						}
					}
				} else {
					var d = (this.imageNode.nodeName == "DIV") ? "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='" + this.image + "', sizingMethod='scale')": "";
					if (f && e) {
						d += "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)"
					} else {
						if (f) {
							d += "progid:DXImageTransform.Microsoft.BasicImage(mirror=1)"
						} else {
							d += "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)"
						}
					}
					if (this.imageNode.style.filter != d) {
						this.imageNode.style.filter = d
					}
				}
			}
		}
	}
};
mxImageShape.prototype.configureTransparentBackground = function(a) {};
mxImageShape.prototype.redrawSvg = function() {
	this.updateSvgShape(this.innerNode);
	this.updateSvgShape(this.imageNode);
	if (this.bg != null) {
		this.updateSvgShape(this.bg);
		if (this.fill != null) {
			this.bg.setAttribute("fill", this.fill)
		} else {
			this.bg.setAttribute("fill", "none")
		}
		if (this.stroke != null) {
			this.bg.setAttribute("stroke", this.stroke)
		} else {
			this.bg.setAttribute("stroke", "none")
		}
		this.bg.setAttribute("shape-rendering", "crispEdges")
	}
};
mxImageShape.prototype.configureSvgShape = function(a) {
	mxShape.prototype.configureSvgShape.apply(this, arguments);
	if (this.imageNode != null) {
		if (this.opacity != null) {
			this.imageNode.setAttribute("opacity", this.opacity / 100)
		} else {
			this.imageNode.removeAttribute("opacity")
		}
	}
};
function mxLabel(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxLabel.prototype = new mxShape();
mxLabel.prototype.constructor = mxLabel;
mxLabel.prototype.vmlNodes = mxLabel.prototype.vmlNodes.concat(["label", "imageNode", "indicatorImageNode", "rectNode"]);
mxLabel.prototype.imageSize = mxConstants.DEFAULT_IMAGESIZE;
mxLabel.prototype.spacing = 2;
mxLabel.prototype.indicatorSize = 10;
mxLabel.prototype.indicatorSpacing = 2;
mxLabel.prototype.opaqueVmlImages = false;
mxLabel.prototype.init = function(a) {
	mxShape.prototype.init.apply(this, arguments);
	if (this.indicatorColor != null && this.indicatorShape != null) {
		this.indicator = new this.indicatorShape();
		this.indicator.dialect = this.dialect;
		this.indicator.bounds = this.bounds;
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.init(this.node);
		this.indicatorShape = null
	}
};
mxLabel.prototype.reconfigure = function() {
	mxShape.prototype.reconfigure.apply(this);
	if (this.indicator != null) {
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.reconfigure()
	}
};
mxLabel.prototype.createHtml = function() {
	var a = "DIV";
	var b = document.createElement(a);
	this.configureHtmlShape(b);
	if (this.indicatorImage != null) {
		this.indicatorImageNode = mxUtils.createImage(this.indicatorImage);
		this.indicatorImageNode.style.position = "absolute";
		b.appendChild(this.indicatorImageNode)
	}
	if (this.image != null) {
		this.imageNode = mxUtils.createImage(this.image);
		this.stroke = null;
		this.configureHtmlShape(this.imageNode);
		mxUtils.setOpacity(this.imageNode, "100");
		b.appendChild(this.imageNode)
	}
	return b
};
mxLabel.prototype.createVml = function() {
	var b = document.createElement("v:group");
	var a = (this.isRounded) ? "v:roundrect": "v:rect";
	this.rectNode = document.createElement(a);
	this.configureVmlShape(this.rectNode);
	this.isShadow = false;
	this.configureVmlShape(b);
	b.coordorigin = "0,0";
	b.appendChild(this.rectNode);
	if (this.indicatorImage != null) {
		this.indicatorImageNode = this.createVmlImage(this.indicatorImage, (this.opaqueVmlImages) ? null: this.opacity);
		b.appendChild(this.indicatorImageNode)
	}
	if (this.image != null) {
		this.imageNode = this.createVmlImage(this.image, (this.opaqueVmlImages) ? null: this.opacity);
		b.appendChild(this.imageNode)
	}
	this.label = document.createElement("v:rect");
	this.label.style.top = "0px";
	this.label.style.left = "0px";
	this.label.filled = "false";
	this.label.stroked = "false";
	b.appendChild(this.label);
	return b
};
mxLabel.prototype.createVmlImage = function(c, b) {
	var a = null;
	if (c.substring(0, 5) == "data:" || b != null) {
		a = document.createElement("img");
		mxUtils.setOpacity(a, b);
		a.setAttribute("border", "0");
		a.style.position = "absolute";
		a.setAttribute("src", c)
	} else {
		a = document.createElement("v:image");
		a.src = c
	}
	return a
};
mxLabel.prototype.createSvg = function() {
	var a = this.createSvgGroup("rect");
	if (this.indicatorImage != null) {
		this.indicatorImageNode = document.createElementNS(mxConstants.NS_SVG, "image");
		this.indicatorImageNode.setAttributeNS(mxConstants.NS_XLINK, "href", this.indicatorImage);
		a.appendChild(this.indicatorImageNode);
		if (this.opacity != null) {
			this.indicatorImageNode.setAttribute("opacity", this.opacity / 100)
		}
	}
	if (this.image != null) {
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, "image");
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, "href", this.image);
		if (this.opacity != null) {
			this.imageNode.setAttribute("opacity", this.opacity / 100)
		}
		this.imageNode.setAttribute("style", "pointer-events:none");
		this.configureSvgShape(this.imageNode);
		a.appendChild(this.imageNode)
	}
	return a
};
mxLabel.prototype.redraw = function() {
	var c = (this.dialect == mxConstants.DIALECT_SVG);
	var n = mxUtils.isVml(this.node);
	if (c) {
		this.updateSvgShape(this.innerNode);
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode)
		}
		this.updateSvgGlassPane()
	} else {
		if (n) {
			this.updateVmlShape(this.node);
			this.updateVmlShape(this.rectNode);
			this.label.style.width = this.node.style.width;
			this.label.style.height = this.node.style.height;
			this.updateVmlGlassPane()
		} else {
			this.updateHtmlShape(this.node)
		}
	}
	var g = 0;
	var e = 0;
	if (this.imageNode != null) {
		g = (this.style[mxConstants.STYLE_IMAGE_WIDTH] || this.imageSize) * this.scale;
		e = (this.style[mxConstants.STYLE_IMAGE_HEIGHT] || this.imageSize) * this.scale
	}
	var i = 0;
	var d = 0;
	var b = 0;
	if (this.indicator != null || this.indicatorImageNode != null) {
		i = (this.style[mxConstants.STYLE_INDICATOR_SPACING] || this.indicatorSpacing) * this.scale;
		d = (this.style[mxConstants.STYLE_INDICATOR_WIDTH] || this.indicatorSize) * this.scale;
		b = (this.style[mxConstants.STYLE_INDICATOR_HEIGHT] || this.indicatorSize) * this.scale
	}
	var f = this.style[mxConstants.STYLE_IMAGE_ALIGN];
	var l = this.style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN];
	var o = this.spacing * this.scale + 5;
	var a = Math.max(g, d);
	var m = e + i + b;
	var k = (c) ? this.bounds.x: 0;
	if (f == mxConstants.ALIGN_RIGHT) {
		k += this.bounds.width - a - o
	} else {
		if (f == mxConstants.ALIGN_CENTER) {
			k += (this.bounds.width - a) / 2
		} else {
			k += o
		}
	}
	var h = (c) ? this.bounds.y: 0;
	if (l == mxConstants.ALIGN_BOTTOM) {
		h += this.bounds.height - m - o
	} else {
		if (l == mxConstants.ALIGN_TOP) {
			h += o
		} else {
			h += (this.bounds.height - m) / 2
		}
	}
	if (this.imageNode != null) {
		if (c) {
			this.imageNode.setAttribute("x", (k + (a - g) / 2) + "px");
			this.imageNode.setAttribute("y", h + "px");
			this.imageNode.setAttribute("width", g + "px");
			this.imageNode.setAttribute("height", e + "px")
		} else {
			this.imageNode.style.left = (k + a - g) + "px";
			this.imageNode.style.top = h + "px";
			this.imageNode.style.width = g + "px";
			this.imageNode.style.height = e + "px";
			this.imageNode.stroked = "false"
		}
	}
	if (this.indicator != null) {
		this.indicator.bounds = new mxRectangle(k + (a - d) / 2, h + e + i, d, b);
		this.indicator.redraw()
	} else {
		if (this.indicatorImageNode != null) {
			if (c) {
				this.indicatorImageNode.setAttribute("x", (k + (a - d) / 2) + "px");
				this.indicatorImageNode.setAttribute("y", (h + e + i) + "px");
				this.indicatorImageNode.setAttribute("width", d + "px");
				this.indicatorImageNode.setAttribute("height", b + "px")
			} else {
				this.indicatorImageNode.style.left = (k + (a - d) / 2) + "px";
				this.indicatorImageNode.style.top = (h + e + i) + "px";
				this.indicatorImageNode.style.width = d + "px";
				this.indicatorImageNode.style.height = b + "px"
			}
		}
	}
};
function mxCylinder(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxCylinder.prototype = new mxShape();
mxCylinder.prototype.constructor = mxCylinder;
mxCylinder.prototype.vmlNodes = mxCylinder.prototype.vmlNodes.concat(["background", "foreground"]);
mxCylinder.prototype.mixedModeHtml = false;
mxCylinder.prototype.preferModeHtml = false;
mxCylinder.prototype.strokedBackground = true;
mxCylinder.prototype.maxHeight = 40;
mxCylinder.prototype.create = function(a) {
	if (this.stroke == null) {
		this.stroke = this.fill
	}
	return mxShape.prototype.create.apply(this, arguments)
};
mxCylinder.prototype.reconfigure = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		this.configureSvgShape(this.foreground);
		this.foreground.setAttribute("fill", "none")
	} else {
		if (mxUtils.isVml(this.node)) {
			this.configureVmlShape(this.background);
			this.configureVmlShape(this.foreground)
		}
	}
	mxShape.prototype.reconfigure.apply(this)
};
mxCylinder.prototype.createVml = function() {
	var a = document.createElement("v:group");
	this.background = document.createElement("v:shape");
	this.label = this.background;
	this.configureVmlShape(this.background);
	a.appendChild(this.background);
	this.fill = null;
	this.isShadow = false;
	this.configureVmlShape(a);
	this.foreground = document.createElement("v:shape");
	this.configureVmlShape(this.foreground);
	var b = document.createElement("v:stroke");
	b.joinstyle = "miter";
	b.miterlimit = 4;
	this.foreground.appendChild(b);
	a.appendChild(this.foreground);
	return a
};
mxCylinder.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.updateVmlShape(this.foreground);
	this.background.path = this.createPath(false);
	this.foreground.path = this.createPath(true)
};
mxCylinder.prototype.createSvg = function() {
	var a = this.createSvgGroup("path");
	this.foreground = document.createElementNS(mxConstants.NS_SVG, "path");
	if (this.stroke != null && this.stroke != mxConstants.NONE) {
		this.foreground.setAttribute("stroke", this.stroke)
	} else {
		this.foreground.setAttribute("stroke", "none")
	}
	this.foreground.setAttribute("fill", "none");
	a.appendChild(this.foreground);
	return a
};
mxCylinder.prototype.redrawSvg = function() {
	var b = Math.round(Math.max(1, this.strokewidth * this.scale));
	this.innerNode.setAttribute("stroke-width", b);
	if (this.crisp) {
		this.innerNode.setAttribute("shape-rendering", "crispEdges");
		this.foreground.setAttribute("shape-rendering", "crispEdges")
	} else {
		this.innerNode.removeAttribute("shape-rendering");
		this.foreground.removeAttribute("shape-rendering")
	}
	var a = this.createPath(false);
	if (a.length > 0) {
		this.innerNode.setAttribute("d", a)
	} else {
		this.innerNode.removeAttribute("d")
	}
	if (!this.strokedBackground) {
		this.innerNode.setAttribute("stroke", "none")
	}
	if (this.shadowNode != null) {
		this.shadowNode.setAttribute("stroke-width", b);
		this.shadowNode.setAttribute("d", a)
	}
	a = this.createPath(true);
	if (a.length > 0) {
		this.foreground.setAttribute("stroke-width", b);
		this.foreground.setAttribute("d", a)
	} else {
		this.foreground.removeAttribute("d")
	}
};
mxCylinder.prototype.redrawPath = function(f, a, g, c, e, d) {
	var b = Math.min(this.maxHeight, Math.round(e / 5));
	if (d) {
		f.moveTo(0, b);
		f.curveTo(0, 2 * b, c, 2 * b, c, b)
	} else {
		f.moveTo(0, b);
		f.curveTo(0, -b / 3, c, -b / 3, c, b);
		f.lineTo(c, e - b);
		f.curveTo(c, e + b / 3, 0, e + b / 3, 0, e - b);
		f.close()
	}
};
function mxConnector(b, c, a) {
	this.points = b;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxConnector.prototype = new mxShape();
mxConnector.prototype.constructor = mxConnector;
mxConnector.prototype.vmlNodes = mxConnector.prototype.vmlNodes.concat(["shapeNode", "start", "end", "startStroke", "endStroke", "startFill", "endFill"]);
mxConnector.prototype.mixedModeHtml = false;
mxConnector.prototype.preferModeHtml = false;
mxConnector.prototype.allowCrispMarkers = false;
mxConnector.prototype.configureHtmlShape = function(a) {
	mxShape.prototype.configureHtmlShape.apply(this, arguments);
	a.style.borderStyle = "";
	a.style.background = ""
};
mxConnector.prototype.createVml = function() {
	var a = document.createElement("v:group");
	a.style.position = "absolute";
	this.shapeNode = document.createElement("v:shape");
	this.updateVmlStrokeColor(this.shapeNode);
	this.updateVmlStrokeNode(this.shapeNode);
	a.appendChild(this.shapeNode);
	this.shapeNode.filled = "false";
	if (this.startArrow != null) {
		this.start = document.createElement("v:shape");
		this.start.style.position = "absolute";
		this.startStroke = document.createElement("v:stroke");
		this.startStroke.joinstyle = "miter";
		this.start.appendChild(this.startStroke);
		this.startFill = document.createElement("v:fill");
		this.start.appendChild(this.startFill);
		a.appendChild(this.start)
	}
	if (this.endArrow != null) {
		this.end = document.createElement("v:shape");
		this.end.style.position = "absolute";
		this.endStroke = document.createElement("v:stroke");
		this.endStroke.joinstyle = "miter";
		this.end.appendChild(this.endStroke);
		this.endFill = document.createElement("v:fill");
		this.end.appendChild(this.endFill);
		a.appendChild(this.end)
	}
	this.updateVmlMarkerOpacity();
	return a
};
mxConnector.prototype.updateVmlMarkerOpacity = function() {
	var a = (this.opacity != null) ? (this.opacity + "%") : "100%";
	if (this.start != null) {
		this.startFill.opacity = a;
		this.startStroke.opacity = a
	}
	if (this.end != null) {
		this.endFill.opacity = a;
		this.endStroke.opacity = a
	}
};
mxConnector.prototype.reconfigure = function() {
	this.fill = null;
	this.shadow = false;
	if (mxUtils.isVml(this.node)) {
		this.node.style.visibility = "hidden";
		this.configureVmlShape(this.shapeNode);
		this.updateVmlMarkerOpacity();
		this.node.style.visibility = "visible"
	} else {
		mxShape.prototype.reconfigure.apply(this, arguments)
	}
};
mxConnector.prototype.redrawVml = function() {
	if (this.node != null && this.points != null && this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) && !isNaN(this.bounds.width) && !isNaN(this.bounds.height)) {
		var b = Math.max(0, Math.round(this.bounds.width));
		var e = Math.max(0, Math.round(this.bounds.height));
		var d = b + "," + e;
		b += "px";
		e += "px";
		if (this.start != null) {
			this.start.style.width = b;
			this.start.style.height = e;
			this.start.coordsize = d;
			var g = this.points[1];
			var a = this.points[0];
			var c = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.startOffset = this.redrawMarker(this.start, this.startArrow, g, a, this.stroke, c)
		}
		if (this.end != null) {
			this.end.style.width = b;
			this.end.style.height = e;
			this.end.coordsize = d;
			var f = this.points.length;
			var g = this.points[f - 2];
			var a = this.points[f - 1];
			var c = mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.endOffset = this.redrawMarker(this.end, this.endArrow, g, a, this.stroke, c)
		}
		this.updateVmlShape(this.node);
		this.updateVmlShape(this.shapeNode)
	}
};
mxConnector.prototype.createSvg = function() {
	var a = this.createSvgGroup("path");
	if (this.shadowNode != null) {
		this.shadowNode.setAttribute("fill", "none");
		this.shadowNode.setAttribute("stroke", "none")
	}
	if (this.startArrow != null) {
		this.start = document.createElementNS(mxConstants.NS_SVG, "path");
		a.appendChild(this.start)
	}
	if (this.endArrow != null) {
		this.end = document.createElementNS(mxConstants.NS_SVG, "path");
		a.appendChild(this.end)
	}
	this.pipe = this.createSvgPipe();
	a.appendChild(this.pipe);
	return a
};
mxConnector.prototype.redrawSvg = function() {
	mxShape.prototype.redrawSvg.apply(this, arguments);
	var b = this.innerNode.getAttribute("stroke");
	if (this.points != null && this.points[0] != null) {
		if (this.start != null) {
			var h = this.points[1];
			var a = this.points[0];
			var c = mxUtils.getNumber(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.startOffset = this.redrawMarker(this.start, this.startArrow, h, a, b, c);
			if (this.allowCrispMarkers && this.crisp) {
				this.start.setAttribute("shape-rendering", "crispEdges")
			} else {
				this.start.removeAttribute("shape-rendering")
			}
		}
		if (this.end != null) {
			var g = this.points.length;
			var h = this.points[g - 2];
			var a = this.points[g - 1];
			var c = mxUtils.getNumber(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.endOffset = this.redrawMarker(this.end, this.endArrow, h, a, b, c);
			if (this.allowCrispMarkers && this.crisp) {
				this.end.setAttribute("shape-rendering", "crispEdges")
			} else {
				this.end.removeAttribute("shape-rendering")
			}
		}
	}
	this.updateSvgShape(this.innerNode);
	var e = this.innerNode.getAttribute("d");
	if (e != null) {
		this.pipe.setAttribute("d", this.innerNode.getAttribute("d"));
		var f = Math.round(this.strokewidth * this.scale);
		this.pipe.setAttribute("stroke-width", f + mxShape.prototype.SVG_STROKE_TOLERANCE)
	}
};
mxConnector.prototype.redrawMarker = function(e, d, f, a, b, c) {
	return mxMarker.paintMarker(e, d, f, a, b, this.strokewidth, c, this.scale, this.bounds.x, this.bounds.y, this.start == e, this.style)
};
function mxSwimlane(b, d, c, a) {
	this.bounds = b;
	this.fill = d;
	this.stroke = c;
	this.strokewidth = (a != null) ? a: 1
}
mxSwimlane.prototype = new mxShape();
mxSwimlane.prototype.constructor = mxSwimlane;
mxSwimlane.prototype.vmlNodes = mxSwimlane.prototype.vmlNodes.concat(["label", "content", "imageNode", "separator"]);
mxSwimlane.prototype.imageSize = 16;
mxSwimlane.prototype.mixedModeHtml = false;
mxRhombus.prototype.preferModeHtml = false;
mxSwimlane.prototype.createHtml = function() {
	var b = document.createElement("DIV");
	this.configureHtmlShape(b);
	b.style.background = "";
	b.style.backgroundColor = "";
	b.style.borderStyle = "none";
	this.label = document.createElement("DIV");
	this.configureHtmlShape(this.label);
	b.appendChild(this.label);
	this.content = document.createElement("DIV");
	this.configureHtmlShape(this.content);
	this.content.style.backgroundColor = "";
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		this.content.style.borderTopStyle = "none"
	} else {
		this.content.style.borderLeftStyle = "none"
	}
	this.content.style.cursor = "default";
	b.appendChild(this.content);
	var a = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (a != null) {
		this.separator = document.createElement("DIV");
		this.separator.style.borderColor = a;
		this.separator.style.borderLeftStyle = "dashed";
		b.appendChild(this.separator)
	}
	if (this.image != null) {
		this.imageNode = mxUtils.createImage(this.image);
		this.configureHtmlShape(this.imageNode);
		this.imageNode.style.borderStyle = "none";
		b.appendChild(this.imageNode)
	}
	return b
};
mxSwimlane.prototype.reconfigure = function(a) {
	mxShape.prototype.reconfigure.apply(this, arguments);
	if (this.dialect == mxConstants.DIALECT_SVG) {
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode);
			if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
				this.shadowNode.setAttribute("height", this.startSize * this.scale)
			} else {
				this.shadowNode.setAttribute("width", this.startSize * this.scale)
			}
		}
	} else {
		if (!mxUtils.isVml(this.node)) {
			this.node.style.background = "";
			this.node.style.backgroundColor = ""
		}
	}
};
mxSwimlane.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node);
	this.node.style.background = "";
	this.node.style.backgroundColor = "";
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	this.updateHtmlShape(this.label);
	this.label.style.top = "0px";
	this.label.style.left = "0px";
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		this.startSize = Math.min(this.startSize, this.bounds.height);
		this.label.style.height = (this.startSize * this.scale) + "px";
		this.updateHtmlShape(this.content);
		this.content.style.background = "";
		this.content.style.backgroundColor = "";
		var b = this.startSize * this.scale;
		this.content.style.top = b + "px";
		this.content.style.left = "0px";
		this.content.style.height = Math.max(1, this.bounds.height - b) + "px";
		if (this.separator != null) {
			this.separator.style.left = Math.round(this.bounds.width) + "px";
			this.separator.style.top = Math.round(this.startSize * this.scale) + "px";
			this.separator.style.width = "1px";
			this.separator.style.height = Math.round(this.bounds.height) + "px";
			this.separator.style.borderWidth = Math.round(this.scale) + "px"
		}
		if (this.imageNode != null) {
			this.imageNode.style.left = (this.bounds.width - this.imageSize - 4) + "px";
			this.imageNode.style.top = "0px";
			this.imageNode.style.width = Math.round(this.imageSize * this.scale) + "px";
			this.imageNode.style.height = Math.round(this.imageSize * this.scale) + "px"
		}
	} else {
		this.startSize = Math.min(this.startSize, this.bounds.width);
		this.label.style.width = (this.startSize * this.scale) + "px";
		this.updateHtmlShape(this.content);
		this.content.style.background = "";
		this.content.style.backgroundColor = "";
		var a = this.startSize * this.scale;
		this.content.style.top = "0px";
		this.content.style.left = a + "px";
		this.content.style.width = Math.max(0, this.bounds.width - a) + "px";
		if (this.separator != null) {
			this.separator.style.left = Math.round(this.startSize * this.scale) + "px";
			this.separator.style.top = Math.round(this.bounds.height) + "px";
			this.separator.style.width = Math.round(this.bounds.width) + "px";
			this.separator.style.height = "1px"
		}
		if (this.imageNode != null) {
			this.imageNode.style.left = (this.bounds.width - this.imageSize - 4) + "px";
			this.imageNode.style.top = "0px";
			this.imageNode.style.width = this.imageSize * this.scale + "px";
			this.imageNode.style.height = this.imageSize * this.scale + "px"
		}
	}
};
mxSwimlane.prototype.createVml = function() {
	var d = document.createElement("v:group");
	var b = (this.isRounded) ? "v:roundrect": "v:rect";
	this.label = document.createElement(b);
	this.configureVmlShape(this.label);
	if (this.isRounded) {
		this.label.setAttribute("arcsize", "20%")
	}
	this.isShadow = false;
	this.configureVmlShape(d);
	d.coordorigin = "0,0";
	d.appendChild(this.label);
	this.content = document.createElement(b);
	var c = this.fill;
	this.fill = null;
	this.configureVmlShape(this.content);
	d.style.background = "";
	if (this.isRounded) {
		this.content.setAttribute("arcsize", "4%")
	}
	this.fill = c;
	this.content.style.borderBottom = "0px";
	d.appendChild(this.content);
	var a = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (a != null) {
		this.separator = document.createElement("v:shape");
		this.separator.style.position = "absolute";
		this.separator.strokecolor = a;
		var e = document.createElement("v:stroke");
		e.dashstyle = "2 2";
		this.separator.appendChild(e);
		d.appendChild(this.separator)
	}
	if (this.image != null) {
		this.imageNode = document.createElement("v:image");
		this.imageNode.src = this.image;
		this.configureVmlShape(this.imageNode);
		this.imageNode.stroked = "false";
		d.appendChild(this.imageNode)
	}
	return d
};
mxSwimlane.prototype.redrawVml = function() {
	var a = Math.round(this.bounds.x);
	var i = Math.round(this.bounds.y);
	var b = Math.round(this.bounds.width);
	var e = Math.round(this.bounds.height);
	this.updateVmlShape(this.node);
	this.node.coordsize = b + "," + e;
	this.updateVmlShape(this.label);
	this.label.style.top = "0px";
	this.label.style.left = "0px";
	this.label.style.rotation = null;
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	var g = Math.round(this.startSize * this.scale);
	if (this.separator != null) {
		this.separator.coordsize = b + "," + e;
		this.separator.style.left = a + "px";
		this.separator.style.top = i + "px";
		this.separator.style.width = b + "px";
		this.separator.style.height = e + "px"
	}
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		g = Math.min(g, this.bounds.height);
		this.label.style.height = g + "px";
		this.updateVmlShape(this.content);
		this.content.style.background = "";
		this.content.style.top = g + "px";
		this.content.style.left = "0px";
		this.content.style.height = Math.max(0, e - g) + "px";
		if (this.separator != null) {
			var f = "m " + (b - a) + " " + (g - i) + " l " + (b - a) + " " + (e - i) + " e";
			this.separator.path = f
		}
		if (this.imageNode != null) {
			var c = Math.round(this.imageSize * this.scale);
			this.imageNode.style.left = (b - c - 4) + "px";
			this.imageNode.style.top = "0px";
			this.imageNode.style.width = c + "px";
			this.imageNode.style.height = c + "px"
		}
	} else {
		g = Math.min(g, this.bounds.width);
		this.label.style.width = g + "px";
		this.updateVmlShape(this.content);
		this.content.style.background = "";
		this.content.style.top = "0px";
		this.content.style.left = g + "px";
		this.content.style.width = Math.max(0, b - g) + "px";
		if (this.separator != null) {
			var f = "m " + (g - a) + " " + (e - i) + " l " + (b - a) + " " + (e - i) + " e";
			this.separator.path = f
		}
		if (this.imageNode != null) {
			var c = Math.round(this.imageSize * this.scale);
			this.imageNode.style.left = (b - c - 4) + "px";
			this.imageNode.style.top = "0px";
			this.imageNode.style.width = c + "px";
			this.imageNode.style.height = c + "px"
		}
	}
	this.content.style.rotation = null
};
mxSwimlane.prototype.createSvg = function() {
	var b = this.createSvgGroup("rect");
	if (this.isRounded) {
		this.innerNode.setAttribute("rx", 10);
		this.innerNode.setAttribute("ry", 10)
	}
	this.content = document.createElementNS(mxConstants.NS_SVG, "path");
	this.configureSvgShape(this.content);
	this.content.setAttribute("fill", "none");
	if (this.isRounded) {
		this.content.setAttribute("rx", 10);
		this.content.setAttribute("ry", 10)
	}
	b.appendChild(this.content);
	var a = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (a != null) {
		this.separator = document.createElementNS(mxConstants.NS_SVG, "line");
		this.separator.setAttribute("stroke", a);
		this.separator.setAttribute("fill", "none");
		this.separator.setAttribute("stroke-dasharray", "2, 2");
		b.appendChild(this.separator)
	}
	if (this.image != null) {
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, "image");
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, "href", this.image);
		this.configureSvgShape(this.imageNode);
		b.appendChild(this.imageNode)
	}
	return b
};
mxSwimlane.prototype.redrawSvg = function() {
	var b = this.isRounded;
	this.isRounded = false;
	this.updateSvgShape(this.innerNode);
	this.updateSvgShape(this.content);
	var a = mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true);
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	var k = this.startSize * this.scale;
	if (this.shadowNode != null) {
		this.updateSvgShape(this.shadowNode);
		if (a) {
			this.shadowNode.setAttribute("height", k)
		} else {
			this.shadowNode.setAttribute("width", k)
		}
	}
	this.isRounded = b;
	this.content.removeAttribute("x");
	this.content.removeAttribute("y");
	this.content.removeAttribute("width");
	this.content.removeAttribute("height");
	var d = (this.crisp && mxClient.IS_IE) ? 0.5 : 0;
	var f = Math.round(this.bounds.x) + d;
	var e = Math.round(this.bounds.y) + d;
	var g = Math.round(this.bounds.width);
	var c = Math.round(this.bounds.height);
	if (a) {
		k = Math.min(k, c);
		this.innerNode.setAttribute("height", k);
		var i = "M " + f + " " + (e + k) + " l 0 " + (c - k) + " l " + g + " 0 l 0 " + (k - c);
		this.content.setAttribute("d", i);
		if (this.separator != null) {
			this.separator.setAttribute("x1", f + g);
			this.separator.setAttribute("y1", e + k);
			this.separator.setAttribute("x2", f + g);
			this.separator.setAttribute("y2", e + c)
		}
		if (this.imageNode != null) {
			this.imageNode.setAttribute("x", f + g - this.imageSize - 4);
			this.imageNode.setAttribute("y", e);
			this.imageNode.setAttribute("width", this.imageSize * this.scale + "px");
			this.imageNode.setAttribute("height", this.imageSize * this.scale + "px")
		}
	} else {
		k = Math.min(k, g);
		this.innerNode.setAttribute("width", k);
		var i = "M " + (f + k) + " " + e + " l " + (g - k) + " 0 l 0 " + c + " l " + (k - g) + " 0";
		this.content.setAttribute("d", i);
		if (this.separator != null) {
			this.separator.setAttribute("x1", f + k);
			this.separator.setAttribute("y1", e + c);
			this.separator.setAttribute("x2", f + g);
			this.separator.setAttribute("y2", e + c)
		}
		if (this.imageNode != null) {
			this.imageNode.setAttribute("x", f + g - this.imageSize - 4);
			this.imageNode.setAttribute("y", e);
			this.imageNode.setAttribute("width", this.imageSize * this.scale + "px");
			this.imageNode.setAttribute("height", this.imageSize * this.scale + "px")
		}
	}
};
function mxGraphLayout(a) {
	this.graph = a
}
mxGraphLayout.prototype.graph = null;
mxGraphLayout.prototype.useBoundingBox = true;
mxGraphLayout.prototype.moveCell = function(b, a, c) {};
mxGraphLayout.prototype.execute = function(a) {};
mxGraphLayout.prototype.getGraph = function() {
	return this.graph
};
mxGraphLayout.prototype.getConstraint = function(b, a, d, f) {
	var e = this.graph.view.getState(a);
	var c = (e != null) ? e.style: this.graph.getCellStyle(a);
	return (c != null) ? c[b] : null
};
mxGraphLayout.prototype.isVertexMovable = function(a) {
	return this.graph.isCellMovable(a)
};
mxGraphLayout.prototype.isVertexIgnored = function(a) {
	return ! this.graph.getModel().isVertex(a) || !this.graph.isCellVisible(a)
};
mxGraphLayout.prototype.isEdgeIgnored = function(b) {
	var a = this.graph.getModel();
	return ! a.isEdge(b) || !this.graph.isCellVisible(b) || a.getTerminal(b, true) == null || a.getTerminal(b, false) == null
};
mxGraphLayout.prototype.setEdgeStyleEnabled = function(a, b) {
	this.graph.setCellStyles(mxConstants.STYLE_NOEDGESTYLE, (b) ? "0": "1", [a])
};
mxGraphLayout.prototype.setOrthogonalEdge = function(a, b) {
	this.graph.setCellStyles(mxConstants.STYLE_ORTHOGONAL, (b) ? "1": "0", [a])
};
mxGraphLayout.prototype.setEdgePoints = function(c, b) {
	if (c != null) {
		var a = this.graph.model;
		var d = a.getGeometry(c);
		if (d == null) {
			d = new mxGeometry();
			d.setRelative(true)
		} else {
			d = d.clone()
		}
		d.points = b;
		a.setGeometry(c, d)
	}
};
mxGraphLayout.prototype.setVertexLocation = function(h, g, e) {
	var d = this.graph.getModel();
	var f = d.getGeometry(h);
	var i = null;
	if (f != null) {
		i = new mxRectangle(g, e, f.width, f.height);
		if (this.useBoundingBox) {
			var a = this.graph.getView().getState(h);
			if (a != null && a.text != null && a.text.boundingBox != null) {
				var b = this.graph.getView().scale;
				var c = a.text.boundingBox;
				if (a.text.boundingBox.x < a.x) {
					g += (a.x - c.x) / b;
					i.width = c.width
				}
				if (a.text.boundingBox.y < a.y) {
					e += (a.y - c.y) / b;
					i.height = c.height
				}
			}
		}
		if (f.x != g || f.y != e) {
			f = f.clone();
			f.x = g;
			f.y = e;
			d.setGeometry(h, f)
		}
	}
	return i
};
mxGraphLayout.prototype.getVertexBounds = function(h) {
	var c = this.graph.getModel().getGeometry(h);
	if (this.useBoundingBox) {
		var a = this.graph.getView().getState(h);
		if (a != null && a.text != null && a.text.boundingBox != null) {
			var b = this.graph.getView().scale;
			var d = a.text.boundingBox;
			var i = Math.max(a.x - d.x, 0) / b;
			var f = Math.max(a.y - d.y, 0) / b;
			var g = Math.max((d.x + d.width) - (a.x + a.width), 0) / b;
			var e = Math.max((d.y + d.height) - (a.y + a.height), 0) / b;
			c = new mxRectangle(c.x - i, c.y - f, c.width + i + g, c.height + f + e)
		}
	}
	return new mxRectangle(c.x, c.y, c.width, c.height)
};
function mxStackLayout(e, a, f, c, d, b) {
	mxGraphLayout.call(this, e);
	this.horizontal = (a != null) ? a: true;
	this.spacing = (f != null) ? f: 0;
	this.x0 = (c != null) ? c: 0;
	this.y0 = (d != null) ? d: 0;
	this.border = (b != null) ? b: 0
}
mxStackLayout.prototype = new mxGraphLayout();
mxStackLayout.prototype.constructor = mxStackLayout;
mxStackLayout.prototype.horizontal = null;
mxStackLayout.prototype.spacing = null;
mxStackLayout.prototype.x0 = null;
mxStackLayout.prototype.y0 = null;
mxStackLayout.prototype.border = 0;
mxStackLayout.prototype.keepFirstLocation = false;
mxStackLayout.prototype.fill = false;
mxStackLayout.prototype.resizeParent = false;
mxStackLayout.prototype.resizeLast = false;
mxStackLayout.prototype.wrap = null;
mxStackLayout.prototype.isHorizontal = function() {
	return this.horizontal
};
mxStackLayout.prototype.moveCell = function(q, l, k) {
	var h = this.graph.getModel();
	var o = h.getParent(q);
	var b = this.isHorizontal();
	if (q != null && o != null) {
		var g = 0;
		var p = 0;
		var d = h.getChildCount(o);
		var n = (b) ? l: k;
		var f = this.graph.getView().getState(o);
		if (f != null) {
			n -= (b) ? f.x: f.y
		}
		for (g = 0; g < d; g++) {
			var c = h.getChildAt(o, g);
			if (c != q) {
				var a = h.getGeometry(c);
				if (a != null) {
					var e = (b) ? a.x + a.width / 2 : a.y + a.height / 2;
					if (p < n && e > n) {
						break
					}
					p = e
				}
			}
		}
		var m = o.getIndex(q);
		m = Math.max(0, g - ((g > m) ? 1 : 0));
		h.add(o, q, m)
	}
};
mxStackLayout.prototype.getParentSize = function(e) {
	var c = this.graph.getModel();
	var b = c.getGeometry(e);
	if (this.graph.container != null && ((b == null && c.isLayer(e)) || e == this.graph.getView().currentRoot)) {
		var d = this.graph.container.offsetWidth - 1;
		var a = this.graph.container.offsetHeight - 1;
		b = new mxRectangle(0, 0, d, a)
	}
	return b
};
mxStackLayout.prototype.execute = function(n) {
	if (n != null) {
		var a = this.isHorizontal();
		var k = this.graph.getModel();
		var d = this.getParentSize(n);
		var l = 0;
		if (d != null) {
			l = (a) ? d.height: d.width
		}
		l -= 2 * this.spacing + 2 * this.border;
		var p = (this.graph.isSwimlane(n)) ? this.graph.getStartSize(n) : new mxRectangle();
		l -= (a) ? p.height: p.width;
		var c = this.x0 + p.width + this.border;
		var m = this.y0 + p.height + this.border;
		k.beginUpdate();
		try {
			var h = 0;
			var o = null;
			var e = k.getChildCount(n);
			for (var g = 0; g < e; g++) {
				var b = k.getChildAt(n, g);
				if (!this.isVertexIgnored(b) && this.isVertexMovable(b)) {
					var f = k.getGeometry(b);
					if (f != null) {
						f = f.clone();
						if (this.wrap != null && o != null) {
							if ((a && o.x + o.width + f.width + 2 * this.spacing > this.wrap) || (!a && o.y + o.height + f.height + 2 * this.spacing > this.wrap)) {
								o = null;
								if (a) {
									m += h + this.spacing
								} else {
									c += h + this.spacing
								}
								h = 0
							}
						}
						h = Math.max(h, (a) ? f.height: f.width);
						if (o != null) {
							if (a) {
								f.x = o.x + o.width + this.spacing
							} else {
								f.y = o.y + o.height + this.spacing
							}
						} else {
							if (!this.keepFirstLocation) {
								if (a) {
									f.x = c
								} else {
									f.y = m
								}
							}
						}
						if (a) {
							f.y = m
						} else {
							f.x = c
						}
						if (this.fill && l > 0) {
							if (a) {
								f.height = l
							} else {
								f.width = l
							}
						}
						k.setGeometry(b, f);
						o = f
					}
				}
			}
			if (this.resizeParent && d != null && o != null && !this.graph.isCellCollapsed(n)) {
				d = d.clone();
				if (a) {
					d.width = o.x + o.width + this.spacing
				} else {
					d.height = o.y + o.height + this.spacing
				}
				k.setGeometry(n, d)
			} else {
				if (this.resizeLast && d != null && o != null) {
					if (a) {
						o.width = d.width - o.x - this.spacing
					} else {
						o.height = d.height - o.y - this.spacing
					}
				}
			}
		} finally {
			k.endUpdate()
		}
	}
};
function mxPartitionLayout(c, a, d, b) {
	mxGraphLayout.call(this, c);
	this.horizontal = (a != null) ? a: true;
	this.spacing = d || 0;
	this.border = b || 0
}
mxPartitionLayout.prototype = new mxGraphLayout();
mxPartitionLayout.prototype.constructor = mxPartitionLayout;
mxPartitionLayout.prototype.horizontal = null;
mxPartitionLayout.prototype.spacing = null;
mxPartitionLayout.prototype.border = null;
mxPartitionLayout.prototype.resizeVertices = true;
mxPartitionLayout.prototype.isHorizontal = function() {
	return this.horizontal
};
mxPartitionLayout.prototype.moveCell = function(n, h, g) {
	var f = this.graph.getModel();
	var l = f.getParent(n);
	if (n != null && l != null) {
		var e = 0;
		var m = 0;
		var c = f.getChildCount(l);
		for (e = 0; e < c; e++) {
			var b = f.getChildAt(l, e);
			var a = this.getVertexBounds(b);
			if (a != null) {
				var d = a.x + a.width / 2;
				if (m < h && d > h) {
					break
				}
				m = d
			}
		}
		var k = l.getIndex(n);
		k = Math.max(0, e - ((e > k) ? 1 : 0));
		f.add(l, n, k)
	}
};
mxPartitionLayout.prototype.execute = function(f) {
	var s = this.isHorizontal();
	var b = this.graph.getModel();
	var o = b.getGeometry(f);
	if (this.graph.container != null && ((o == null && b.isLayer(f)) || f == this.graph.getView().currentRoot)) {
		var l = this.graph.container.offsetWidth - 1;
		var h = this.graph.container.offsetHeight - 1;
		o = new mxRectangle(0, 0, l, h)
	}
	if (o != null) {
		var c = [];
		var q = b.getChildCount(f);
		for (var p = 0; p < q; p++) {
			var e = b.getChildAt(f, p);
			if (!this.isVertexIgnored(e) && this.isVertexMovable(e)) {
				c.push(e)
			}
		}
		var k = c.length;
		if (k > 0) {
			var r = this.border;
			var a = this.border;
			var d = (s) ? o.height: o.width;
			d -= 2 * this.border;
			var g = (this.graph.isSwimlane(f)) ? this.graph.getStartSize(f) : new mxRectangle();
			d -= (s) ? g.height: g.width;
			r = r + g.width;
			a = a + g.height;
			var t = this.border + (k - 1) * this.spacing;
			var m = (s) ? ((o.width - r - t) / k) : ((o.height - a - t) / k);
			if (m > 0) {
				b.beginUpdate();
				try {
					for (var p = 0; p < k; p++) {
						var e = c[p];
						var u = b.getGeometry(e);
						if (u != null) {
							u = u.clone();
							u.x = r;
							u.y = a;
							if (s) {
								if (this.resizeVertices) {
									u.width = m;
									u.height = d
								}
								r += m + this.spacing
							} else {
								if (this.resizeVertices) {
									u.height = m;
									u.width = d
								}
								a += m + this.spacing
							}
							b.setGeometry(e, u)
						}
					}
				} finally {
					b.endUpdate()
				}
			}
		}
	}
};
function mxCompactTreeLayout(b, a, c) {
	mxGraphLayout.call(this, b);
	this.horizontal = (a != null) ? a: true;
	this.invert = (c != null) ? c: false
}
mxCompactTreeLayout.prototype = new mxGraphLayout();
mxCompactTreeLayout.prototype.constructor = mxCompactTreeLayout;
mxCompactTreeLayout.prototype.horizontal = null;
mxCompactTreeLayout.prototype.invert = null;
mxCompactTreeLayout.prototype.resizeParent = true;
mxCompactTreeLayout.prototype.moveTree = true;
mxCompactTreeLayout.prototype.levelDistance = 10;
mxCompactTreeLayout.prototype.nodeDistance = 20;
mxCompactTreeLayout.prototype.resetEdges = true;
mxCompactTreeLayout.prototype.prefHozEdgeSep = 5;
mxCompactTreeLayout.prototype.prefVertEdgeOff = 4;
mxCompactTreeLayout.prototype.minEdgeJetty = 8;
mxCompactTreeLayout.prototype.channelBuffer = 4;
mxCompactTreeLayout.prototype.edgeRouting = true;
mxCompactTreeLayout.prototype.isVertexIgnored = function(a) {
	return mxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(a).length == 0
};
mxCompactTreeLayout.prototype.isHorizontal = function() {
	return this.horizontal
};
mxCompactTreeLayout.prototype.execute = function(m, k) {
	var f = this.graph.getModel();
	if (k == null) {
		if (this.graph.getEdges(m, f.getParent(m), this.invert, !this.invert, false).length > 0) {
			k = m
		} else {
			var o = this.graph.findTreeRoots(m, true, this.invert);
			if (o.length > 0) {
				for (var e = 0; e < o.length; e++) {
					if (!this.isVertexIgnored(o[e]) && this.graph.getEdges(o[e], null, this.invert, !this.invert, false).length > 0) {
						k = o[e];
						break
					}
				}
			}
		}
	}
	if (k != null) {
		m = f.getParent(k);
		f.beginUpdate();
		try {
			var d = this.dfs(k, m);
			if (d != null) {
				this.layout(d);
				var c = this.graph.gridSize;
				var l = c;
				if (!this.moveTree || f.isLayer(m)) {
					var h = f.getGeometry(k);
					if (h != null) {
						c = h.x;
						l = h.y
					}
				}
				var a = null;
				if (this.isHorizontal()) {
					a = this.horizontalLayout(d, c, l)
				} else {
					a = this.verticalLayout(d, null, c, l)
				}
				if (a != null) {
					var r = 0;
					var p = 0;
					if (a.x < 0) {
						r = Math.abs(c - a.x)
					}
					if (a.y < 0) {
						p = Math.abs(l - a.y)
					}
					if (m != null) {
						var q = (this.graph.isSwimlane(m)) ? this.graph.getStartSize(m) : new mxRectangle();
						r += q.width;
						p += q.height;
						if (this.resizeParent && !this.graph.isCellCollapsed(m)) {
							var h = f.getGeometry(m);
							if (h != null) {
								var b = a.width + q.width - a.x + 2 * c;
								var n = a.height + q.height - a.y + 2 * l;
								h = h.clone();
								if (h.width > b) {
									r += (h.width - b) / 2
								} else {
									h.width = b
								}
								if (h.height > n) {
									if (this.isHorizontal()) {
										p += (h.height - n) / 2
									}
								} else {
									h.height = n
								}
								f.setGeometry(m, h)
							}
						}
					}
					this.moveNode(d, r, p);
					if (this.edgeRouting) {
						this.localEdgeProcessing(d)
					}
				}
			}
		} finally {
			f.endUpdate()
		}
	}
};
mxCompactTreeLayout.prototype.moveNode = function(c, b, a) {
	c.x += b;
	c.y += a;
	this.apply(c);
	var d = c.child;
	while (d != null) {
		this.moveNode(d, b, a);
		d = d.next
	}
};
mxCompactTreeLayout.prototype.dfs = function(n, m, l) {
	l = (l != null) ? l: [];
	var a = mxCellPath.create(n);
	var c = null;
	if (n != null && l[a] == null && !this.isVertexIgnored(n)) {
		l[a] = n;
		c = this.createNode(n);
		var h = this.graph.getModel();
		var d = null;
		var e = this.graph.getEdges(n, m, this.invert, !this.invert, false);
		for (var g = 0; g < e.length; g++) {
			var b = e[g];
			if (!this.isEdgeIgnored(b)) {
				if (this.resetEdges || this.edgeRouting) {
					this.setEdgeStyleEnabled(b, false);
					this.setEdgePoints(b, null)
				}
				var k = this.graph.getView().getVisibleTerminal(b, this.invert);
				var f = this.dfs(k, m, l);
				if (f != null && h.getGeometry(k) != null) {
					if (d == null) {
						c.child = f
					} else {
						d.next = f
					}
					d = f
				}
			}
		}
	}
	return c
};
mxCompactTreeLayout.prototype.layout = function(a) {
	if (a != null) {
		var b = a.child;
		while (b != null) {
			this.layout(b);
			b = b.next
		}
		if (a.child != null) {
			this.attachParent(a, this.join(a))
		} else {
			this.layoutLeaf(a)
		}
	}
};
mxCompactTreeLayout.prototype.horizontalLayout = function(f, b, e, d) {
	f.x += b + f.offsetX;
	f.y += e + f.offsetY;
	d = this.apply(f, d);
	var g = f.child;
	if (g != null) {
		d = this.horizontalLayout(g, f.x, f.y, d);
		var a = f.y + g.offsetY;
		var c = g.next;
		while (c != null) {
			d = this.horizontalLayout(c, f.x + g.offsetX, a, d);
			a += c.offsetY;
			c = c.next
		}
	}
	return d
};
mxCompactTreeLayout.prototype.verticalLayout = function(g, d, b, f, e) {
	g.x += b + g.offsetY;
	g.y += f + g.offsetX;
	e = this.apply(g, e);
	var h = g.child;
	if (h != null) {
		e = this.verticalLayout(h, g, g.x, g.y, e);
		var a = g.x + h.offsetY;
		var c = h.next;
		while (c != null) {
			e = this.verticalLayout(c, g, a, g.y + h.offsetX, e);
			a += c.offsetY;
			c = c.next
		}
	}
	return e
};
mxCompactTreeLayout.prototype.attachParent = function(e, b) {
	var a = this.nodeDistance + this.levelDistance;
	var c = (b - e.width) / 2 - this.nodeDistance;
	var d = c + e.width + 2 * this.nodeDistance - b;
	e.child.offsetX = a + e.height;
	e.child.offsetY = d;
	e.contour.upperHead = this.createLine(e.height, 0, this.createLine(a, d, e.contour.upperHead));
	e.contour.lowerHead = this.createLine(e.height, 0, this.createLine(a, c, e.contour.lowerHead))
};
mxCompactTreeLayout.prototype.layoutLeaf = function(a) {
	var b = 2 * this.nodeDistance;
	a.contour.upperTail = this.createLine(a.height + b, 0);
	a.contour.upperHead = a.contour.upperTail;
	a.contour.lowerTail = this.createLine(0, -a.width - b);
	a.contour.lowerHead = this.createLine(a.height + b, 0, a.contour.lowerTail)
};
mxCompactTreeLayout.prototype.join = function(c) {
	var f = 2 * this.nodeDistance;
	var g = c.child;
	c.contour = g.contour;
	var b = g.width + f;
	var a = b;
	g = g.next;
	while (g != null) {
		var e = this.merge(c.contour, g.contour);
		g.offsetY = e + b;
		g.offsetX = 0;
		b = g.width + f;
		a += e + b;
		g = g.next
	}
	return a
};
mxCompactTreeLayout.prototype.merge = function(l, i) {
	var h = 0;
	var f = 0;
	var g = 0;
	var k = l.lowerHead;
	var a = i.upperHead;
	while (a != null && k != null) {
		var c = this.offset(h, f, a.dx, a.dy, k.dx, k.dy);
		f += c;
		g += c;
		if (h + a.dx <= k.dx) {
			h += a.dx;
			f += a.dy;
			a = a.next
		} else {
			h -= k.dx;
			f -= k.dy;
			k = k.next
		}
	}
	if (a != null) {
		var e = this.bridge(l.upperTail, 0, 0, a, h, f);
		l.upperTail = (e.next != null) ? i.upperTail: e;
		l.lowerTail = i.lowerTail
	} else {
		var e = this.bridge(i.lowerTail, h, f, k, 0, 0);
		if (e.next == null) {
			l.lowerTail = e
		}
	}
	l.lowerHead = i.lowerHead;
	return g
};
mxCompactTreeLayout.prototype.offset = function(h, g, b, a, f, e) {
	var c = 0;
	if (f <= h || h + b <= 0) {
		return 0
	}
	var i = f * a - b * e;
	if (i > 0) {
		if (h < 0) {
			var k = h * a;
			c = k / b - g
		} else {
			if (h > 0) {
				var k = h * e;
				c = k / f - g
			} else {
				c = -g
			}
		}
	} else {
		if (f < h + b) {
			var k = (f - h) * a;
			c = e - (g + k / b)
		} else {
			if (f > h + b) {
				var k = (b + h) * e;
				c = k / f - (g + a)
			} else {
				c = e - (g + a)
			}
		}
	}
	if (c > 0) {
		return c
	} else {
		return 0
	}
};
mxCompactTreeLayout.prototype.bridge = function(g, c, e, f, b, d) {
	var k = b + f.dx - c;
	var h = 0;
	var i = 0;
	if (f.dx == 0) {
		h = f.dy
	} else {
		var i = k * f.dy;
		h = i / f.dx
	}
	var a = this.createLine(k, h, f.next);
	g.next = this.createLine(0, d + f.dy - h - e, a);
	return a
};
mxCompactTreeLayout.prototype.createNode = function(a) {
	var b = new Object();
	b.cell = a;
	b.x = 0;
	b.y = 0;
	b.width = 0;
	b.height = 0;
	var c = this.getVertexBounds(a);
	if (c != null) {
		if (this.isHorizontal()) {
			b.width = c.height;
			b.height = c.width
		} else {
			b.width = c.width;
			b.height = c.height
		}
	}
	b.offsetX = 0;
	b.offsetY = 0;
	b.contour = new Object();
	return b
};
mxCompactTreeLayout.prototype.apply = function(c, b) {
	var a = this.graph.getModel().getGeometry(c.cell);
	if (c.cell != null && a != null) {
		if (this.isVertexMovable(c.cell)) {
			a = this.setVertexLocation(c.cell, c.x, c.y)
		}
		if (b == null) {
			b = new mxRectangle(a.x, a.y, a.width, a.height)
		} else {
			b = new mxRectangle(Math.min(b.x, a.x), Math.min(b.y, a.y), Math.max(b.x + b.width, a.x + a.width), Math.max(b.y + b.height, a.y + a.height))
		}
	}
	return b
};
mxCompactTreeLayout.prototype.createLine = function(c, b, d) {
	var a = new Object();
	a.dx = c;
	a.dy = b;
	a.next = d;
	return a
};
mxCompactTreeLayout.prototype.localEdgeProcessing = function(a) {
	this.processNodeOutgoing(a);
	var b = a.child;
	while (b != null) {
		this.localEdgeProcessing(b);
		b = b.next
	}
};
mxCompactTreeLayout.prototype.processNodeOutgoing = function(q) {
	var g = this.graph.getModel();
	var k = q.child;
	var u = q.cell;
	var t = 0;
	var l = [];
	while (k != null) {
		t++;
		var h = k.x;
		if (this.horizontal) {
			h = k.y
		}
		l.push(new WeightedCellSorter(k, h));
		k = k.next
	}
	l.sort(WeightedCellSorter.prototype.compare);
	var b = q.width;
	var e = (t + 1) * this.prefHozEdgeSep;
	if (b > e + (2 * this.prefHozEdgeSep)) {
		b -= 2 * this.prefHozEdgeSep
	}
	var f = b / t;
	var a = f / 2;
	if (b > e + (2 * this.prefHozEdgeSep)) {
		a += this.prefHozEdgeSep
	}
	var o = this.minEdgeJetty - this.prefVertEdgeOff;
	var d = 0;
	var v = this.getVertexBounds(u);
	k = q.child;
	for (var r = 0; r < l.length; r++) {
		var p = l[r].cell.cell;
		var z = this.getVertexBounds(p);
		var c = this.graph.getEdgesBetween(u, p, false);
		var w = [];
		var n = 0;
		var m = 0;
		for (var s = 0; s < c.length; s++) {
			if (this.horizontal) {
				n = v.x + v.width;
				m = v.y + a;
				w.push(new mxPoint(n, m));
				n = v.x + v.width + o;
				w.push(new mxPoint(n, m));
				m = z.y + z.height / 2;
				w.push(new mxPoint(n, m));
				this.setEdgePoints(c[s], w)
			} else {
				n = v.x + a;
				m = v.y + v.height;
				w.push(new mxPoint(n, m));
				m = v.y + v.height + o;
				w.push(new mxPoint(n, m));
				n = z.x + z.width / 2;
				w.push(new mxPoint(n, m));
				this.setEdgePoints(c[s], w)
			}
		}
		if (r < t / 2) {
			o += this.prefVertEdgeOff
		} else {
			if (r > t / 2) {
				o -= this.prefVertEdgeOff
			}
		}
		a += f;
		d = Math.max(d, o)
	}
};
function WeightedCellSorter(a, b) {
	this.cell = a;
	this.weightedValue = b
}
WeightedCellSorter.prototype.weightedValue = 0;
WeightedCellSorter.prototype.nudge = false;
WeightedCellSorter.prototype.visited = false;
WeightedCellSorter.prototype.rankIndex = null;
WeightedCellSorter.prototype.cell = null;
WeightedCellSorter.prototype.compare = function(d, c) {
	if (d != null && c != null) {
		if (c.weightedValue > d.weightedValue) {
			return 1
		} else {
			if (c.weightedValue < d.weightedValue) {
				return - 1
			} else {
				if (c.nudge) {
					return 1
				} else {
					return - 1
				}
			}
		}
	} else {
		return 0
	}
};
function mxFastOrganicLayout(a) {
	mxGraphLayout.call(this, a)
}
mxFastOrganicLayout.prototype = new mxGraphLayout();
mxFastOrganicLayout.prototype.constructor = mxFastOrganicLayout;
mxFastOrganicLayout.prototype.useInputOrigin = true;
mxFastOrganicLayout.prototype.resetEdges = true;
mxFastOrganicLayout.prototype.disableEdgeStyle = true;
mxFastOrganicLayout.prototype.forceConstant = 50;
mxFastOrganicLayout.prototype.forceConstantSquared = 0;
mxFastOrganicLayout.prototype.minDistanceLimit = 2;
mxFastOrganicLayout.prototype.maxDistanceLimit = 500;
mxFastOrganicLayout.prototype.minDistanceLimitSquared = 4;
mxFastOrganicLayout.prototype.initialTemp = 200;
mxFastOrganicLayout.prototype.temperature = 0;
mxFastOrganicLayout.prototype.maxIterations = 0;
mxFastOrganicLayout.prototype.iteration = 0;
mxFastOrganicLayout.prototype.vertexArray;
mxFastOrganicLayout.prototype.dispX;
mxFastOrganicLayout.prototype.dispY;
mxFastOrganicLayout.prototype.cellLocation;
mxFastOrganicLayout.prototype.radius;
mxFastOrganicLayout.prototype.radiusSquared;
mxFastOrganicLayout.prototype.isMoveable;
mxFastOrganicLayout.prototype.neighbours;
mxFastOrganicLayout.prototype.indices;
mxFastOrganicLayout.prototype.allowedToRun = true;
mxFastOrganicLayout.prototype.isVertexIgnored = function(a) {
	return mxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(a).length == 0
};
mxFastOrganicLayout.prototype.execute = function(k) {
	var d = this.graph.getModel();
	this.vertexArray = [];
	var c = this.graph.getChildVertices(k);
	for (var v = 0; v < c.length; v++) {
		if (!this.isVertexIgnored(c[v])) {
			this.vertexArray.push(c[v])
		}
	}
	var h = (this.useInputOrigin) ? this.graph.view.getBounds(this.vertexArray) : null;
	var s = this.vertexArray.length;
	this.indices = [];
	this.dispX = [];
	this.dispY = [];
	this.cellLocation = [];
	this.isMoveable = [];
	this.neighbours = [];
	this.radius = [];
	this.radiusSquared = [];
	if (this.forceConstant < 0.001) {
		this.forceConstant = 0.001
	}
	this.forceConstantSquared = this.forceConstant * this.forceConstant;
	for (var v = 0; v < this.vertexArray.length; v++) {
		var w = this.vertexArray[v];
		this.cellLocation[v] = [];
		var r = mxCellPath.create(w);
		this.indices[r] = v;
		var g = this.getVertexBounds(w);
		var t = g.width;
		var q = g.height;
		var m = g.x;
		var l = g.y;
		this.cellLocation[v][0] = m + t / 2;
		this.cellLocation[v][1] = l + q / 2;
		this.radius[v] = Math.min(t, q);
		this.radiusSquared[v] = this.radius[v] * this.radius[v]
	}
	d.beginUpdate();
	try {
		for (var v = 0; v < s; v++) {
			this.dispX[v] = 0;
			this.dispY[v] = 0;
			this.isMoveable[v] = this.isVertexMovable(this.vertexArray[v]);
			var a = this.graph.getConnections(this.vertexArray[v], k);
			var c = this.graph.getOpposites(a, this.vertexArray[v]);
			this.neighbours[v] = [];
			for (var u = 0; u < c.length; u++) {
				if (this.resetEdges) {
					this.graph.resetEdge(a[u])
				}
				if (this.disableEdgeStyle) {
					this.setEdgeStyleEnabled(a[u], false)
				}
				var r = mxCellPath.create(c[u]);
				var f = this.indices[r];
				if (f != null) {
					this.neighbours[v][u] = f
				} else {
					this.neighbours[v][u] = v
				}
			}
		}
		this.temperature = this.initialTemp;
		if (this.maxIterations == 0) {
			this.maxIterations = 20 * Math.sqrt(s)
		}
		for (this.iteration = 0; this.iteration < this.maxIterations; this.iteration++) {
			if (!this.allowedToRun) {
				return
			}
			this.calcRepulsion();
			this.calcAttraction();
			this.calcPositions();
			this.reduceTemperature()
		}
		var e = null;
		var b = null;
		for (var v = 0; v < this.vertexArray.length; v++) {
			var w = this.vertexArray[v];
			if (this.isVertexMovable(w)) {
				var g = this.getVertexBounds(w);
				if (g != null) {
					this.cellLocation[v][0] -= g.width / 2;
					this.cellLocation[v][1] -= g.height / 2;
					var m = this.graph.snap(this.cellLocation[v][0]);
					var l = this.graph.snap(this.cellLocation[v][1]);
					this.setVertexLocation(w, m, l);
					if (e == null) {
						e = m
					} else {
						e = Math.min(e, m)
					}
					if (b == null) {
						b = l
					} else {
						b = Math.min(b, l)
					}
				}
			}
		}
		var p = -(e || 0) + 1;
		var o = -(b || 0) + 1;
		if (h != null) {
			p += h.x;
			o += h.y
		}
		this.graph.moveCells(this.vertexArray, p, o)
	} finally {
		d.endUpdate()
	}
};
mxFastOrganicLayout.prototype.calcPositions = function() {
	for (var b = 0; b < this.vertexArray.length; b++) {
		if (this.isMoveable[b]) {
			var c = Math.sqrt(this.dispX[b] * this.dispX[b] + this.dispY[b] * this.dispY[b]);
			if (c < 0.001) {
				c = 0.001
			}
			var d = this.dispX[b] / c * Math.min(c, this.temperature);
			var a = this.dispY[b] / c * Math.min(c, this.temperature);
			this.dispX[b] = 0;
			this.dispY[b] = 0;
			this.cellLocation[b][0] += d;
			this.cellLocation[b][1] += a
		}
	}
};
mxFastOrganicLayout.prototype.calcAttraction = function() {
	for (var l = 0; l < this.vertexArray.length; l++) {
		for (var f = 0; f < this.neighbours[l].length; f++) {
			var g = this.neighbours[l][f];
			if (l != g && this.isMoveable[l] && this.isMoveable[g]) {
				var h = this.cellLocation[l][0] - this.cellLocation[g][0];
				var m = this.cellLocation[l][1] - this.cellLocation[g][1];
				var e = h * h + m * m - this.radiusSquared[l] - this.radiusSquared[g];
				if (e < this.minDistanceLimitSquared) {
					e = this.minDistanceLimitSquared
				}
				var d = Math.sqrt(e);
				var c = (e) / this.forceConstant;
				var b = (h / d) * c;
				var a = (m / d) * c;
				this.dispX[l] -= b;
				this.dispY[l] -= a;
				this.dispX[g] += b;
				this.dispY[g] += a
			}
		}
	}
};
mxFastOrganicLayout.prototype.calcRepulsion = function() {
	var b = this.vertexArray.length;
	for (var h = 0; h < b; h++) {
		for (var f = h; f < b; f++) {
			if (!this.allowedToRun) {
				return
			}
			if (f != h && this.isMoveable[h] && this.isMoveable[f]) {
				var g = this.cellLocation[h][0] - this.cellLocation[f][0];
				var k = this.cellLocation[h][1] - this.cellLocation[f][1];
				if (g == 0) {
					g = 0.01 + Math.random()
				}
				if (k == 0) {
					k = 0.01 + Math.random()
				}
				var e = Math.sqrt((g * g) + (k * k));
				var l = e - this.radius[h] - this.radius[f];
				if (l > this.maxDistanceLimit) {
					continue
				}
				if (l < this.minDistanceLimit) {
					l = this.minDistanceLimit
				}
				var d = this.forceConstantSquared / l;
				var c = (g / e) * d;
				var a = (k / e) * d;
				this.dispX[h] += c;
				this.dispY[h] += a;
				this.dispX[f] -= c;
				this.dispY[f] -= a
			}
		}
	}
};
mxFastOrganicLayout.prototype.reduceTemperature = function() {
	this.temperature = this.initialTemp * (1 - this.iteration / this.maxIterations)
};
function mxCircleLayout(b, a) {
	mxGraphLayout.call(this, b);
	this.radius = (a != null) ? a: 100
}
mxCircleLayout.prototype = new mxGraphLayout();
mxCircleLayout.prototype.constructor = mxCircleLayout;
mxCircleLayout.prototype.radius = null;
mxCircleLayout.prototype.moveCircle = false;
mxCircleLayout.prototype.x0 = 0;
mxCircleLayout.prototype.y0 = 0;
mxCircleLayout.prototype.resetEdges = true;
mxCircleLayout.prototype.disableEdgeStyle = true;
mxCircleLayout.prototype.execute = function(m) {
	var g = this.graph.getModel();
	g.beginUpdate();
	try {
		var l = 0;
		var k = null;
		var d = null;
		var h = [];
		var e = g.getChildCount(m);
		for (var f = 0; f < e; f++) {
			var n = g.getChildAt(m, f);
			if (!this.isVertexIgnored(n)) {
				h.push(n);
				var c = this.getVertexBounds(n);
				if (k == null) {
					k = c.y
				} else {
					k = Math.min(k, c.y)
				}
				if (d == null) {
					d = c.x
				} else {
					d = Math.min(d, c.x)
				}
				l = Math.max(l, Math.max(c.width, c.height))
			} else {
				if (!this.isEdgeIgnored(n)) {
					if (this.resetEdges) {
						this.graph.resetEdge(n)
					}
					if (this.disableEdgeStyle) {
						this.setEdgeStyleEnabled(n, false)
					}
				}
			}
		}
		var b = h.length;
		var a = Math.max(b * l / Math.PI, this.radius);
		if (this.moveCircle) {
			k = this.x0;
			d = this.y0
		}
		this.circle(h, a, d, k)
	} finally {
		g.endUpdate()
	}
};
mxCircleLayout.prototype.circle = function(a, e, g, f) {
	var c = a.length;
	var d = 2 * Math.PI / c;
	for (var b = 0; b < c; b++) {
		if (this.isVertexMovable(a[b])) {
			this.setVertexLocation(a[b], g + e + e * Math.sin(b * d), f + e + e * Math.cos(b * d))
		}
	}
};
function mxParallelEdgeLayout(a) {
	mxGraphLayout.call(this, a)
}
mxParallelEdgeLayout.prototype = new mxGraphLayout();
mxParallelEdgeLayout.prototype.constructor = mxParallelEdgeLayout;
mxParallelEdgeLayout.prototype.spacing = 20;
mxParallelEdgeLayout.prototype.execute = function(c) {
	var d = this.findParallels(c);
	this.graph.model.beginUpdate();
	try {
		for (var b in d) {
			var a = d[b];
			if (a.length > 1) {
				this.layout(a)
			}
		}
	} finally {
		this.graph.model.endUpdate()
	}
};
mxParallelEdgeLayout.prototype.findParallels = function(d) {
	var b = this.graph.getModel();
	var e = [];
	var a = b.getChildCount(d);
	for (var c = 0; c < a; c++) {
		var g = b.getChildAt(d, c);
		if (!this.isEdgeIgnored(g)) {
			var f = this.getEdgeId(g);
			if (f != null) {
				if (e[f] == null) {
					e[f] = []
				}
				e[f].push(g)
			}
		}
	}
	return e
};
mxParallelEdgeLayout.prototype.getEdgeId = function(c) {
	var b = this.graph.getView();
	var d = b.getVisibleTerminal(c, true);
	var a = b.getVisibleTerminal(c, false);
	if (d != null && a != null) {
		d = mxCellPath.create(d);
		a = mxCellPath.create(a);
		return (d > a) ? a + "-" + d: d + "-" + a
	}
	return null
};
mxParallelEdgeLayout.prototype.layout = function(l) {
	var c = l[0];
	var k = this.graph.getView();
	var b = this.graph.getModel();
	var f = b.getGeometry(b.getTerminal(c, true));
	var q = b.getGeometry(b.getTerminal(c, false));
	if (f == q) {
		var r = f.x + f.width + this.spacing;
		var a = f.y + f.height / 2;
		for (var n = 0; n < l.length; n++) {
			this.route(l[n], r, a);
			r += this.spacing
		}
	} else {
		if (f != null && q != null) {
			var o = f.x + f.width / 2;
			var m = f.y + f.height / 2;
			var e = q.x + q.width / 2;
			var d = q.y + q.height / 2;
			var h = e - o;
			var g = d - m;
			var p = Math.sqrt(h * h + g * g);
			var r = o + h / 2;
			var a = m + g / 2;
			var t = g * this.spacing / p;
			var s = h * this.spacing / p;
			r += t * (l.length - 1) / 2;
			a -= s * (l.length - 1) / 2;
			for (var n = 0; n < l.length; n++) {
				this.route(l[n], r, a);
				r -= t;
				a += s
			}
		}
	}
};
mxParallelEdgeLayout.prototype.route = function(b, a, c) {
	if (this.graph.isCellMovable(b)) {
		this.setEdgePoints(b, [new mxPoint(a, c)])
	}
};
function mxCompositeLayout(b, c, a) {
	mxGraphLayout.call(this, b);
	this.layouts = c;
	this.master = a
}
mxCompositeLayout.prototype = new mxGraphLayout();
mxCompositeLayout.prototype.constructor = mxCompositeLayout;
mxCompositeLayout.prototype.layouts = null;
mxCompositeLayout.prototype.master = null;
mxCompositeLayout.prototype.moveCell = function(b, a, c) {
	if (this.master != null) {
		this.master.move.apply(this.master, arguments)
	} else {
		this.layouts[0].move.apply(this.layouts[0], arguments)
	}
};
mxCompositeLayout.prototype.execute = function(c) {
	var a = this.graph.getModel();
	a.beginUpdate();
	try {
		for (var b = 0; b < this.layouts.length; b++) {
			this.layouts[b].execute.apply(this.layouts[b], arguments)
		}
	} finally {
		a.endUpdate()
	}
};
function mxEdgeLabelLayout(b, a) {
	mxGraphLayout.call(this, b)
}
mxEdgeLabelLayout.prototype = new mxGraphLayout();
mxEdgeLabelLayout.prototype.constructor = mxEdgeLabelLayout;
mxEdgeLabelLayout.prototype.execute = function(h) {
	var g = this.graph.view;
	var e = this.graph.getModel();
	var b = [];
	var f = [];
	var c = e.getChildCount(h);
	for (var d = 0; d < c; d++) {
		var k = e.getChildAt(h, d);
		var a = g.getState(k);
		if (a != null) {
			if (!this.isVertexIgnored(k)) {
				f.push(a)
			} else {
				if (!this.isEdgeIgnored(k)) {
					b.push(a)
				}
			}
		}
	}
	this.placeLabels(f, b)
};
mxEdgeLabelLayout.prototype.placeLabels = function(a, h) {
	var c = this.graph.getModel();
	c.beginUpdate();
	try {
		for (var d = 0; d < h.length; d++) {
			var f = h[d];
			if (f != null && f.text != null && f.text.boundingBox != null) {
				for (var b = 0; b < a.length; b++) {
					var g = a[b];
					if (g != null) {
						this.avoid(f, g)
					}
				}
			}
		}
	} finally {
		c.endUpdate()
	}
};
mxEdgeLabelLayout.prototype.avoid = function(a, e) {
	var b = this.graph.getModel();
	var h = a.text.boundingBox;
	if (mxUtils.intersects(h, e)) {
		var f = -h.y - h.height + e.y;
		var c = -h.y + e.y + e.height;
		var l = (Math.abs(f) < Math.abs(c)) ? f: c;
		var k = -h.x - h.width + e.x;
		var i = -h.x + e.x + e.width;
		var m = (Math.abs(k) < Math.abs(i)) ? k: i;
		if (Math.abs(m) < Math.abs(l)) {
			l = 0
		} else {
			m = 0
		}
		var d = b.getGeometry(a.cell);
		if (d != null) {
			d = d.clone();
			if (d.offset != null) {
				d.offset.x += m;
				d.offset.y += l
			} else {
				d.offset = new mxPoint(m, l)
			}
			b.setGeometry(a.cell, d)
		}
	}
};
function mxGraphAbstractHierarchyCell() {
	this.x = [];
	this.y = [];
	this.temp = []
}
mxGraphAbstractHierarchyCell.prototype.maxRank = -1;
mxGraphAbstractHierarchyCell.prototype.minRank = -1;
mxGraphAbstractHierarchyCell.prototype.x = null;
mxGraphAbstractHierarchyCell.prototype.y = null;
mxGraphAbstractHierarchyCell.prototype.width = 0;
mxGraphAbstractHierarchyCell.prototype.height = 0;
mxGraphAbstractHierarchyCell.prototype.nextLayerConnectedCells = null;
mxGraphAbstractHierarchyCell.prototype.previousLayerConnectedCells = null;
mxGraphAbstractHierarchyCell.prototype.temp = null;
mxGraphAbstractHierarchyCell.prototype.getNextLayerConnectedCells = function(a) {
	return null
};
mxGraphAbstractHierarchyCell.prototype.getPreviousLayerConnectedCells = function(a) {
	return null
};
mxGraphAbstractHierarchyCell.prototype.isEdge = function() {
	return false
};
mxGraphAbstractHierarchyCell.prototype.isVertex = function() {
	return false
};
mxGraphAbstractHierarchyCell.prototype.getGeneralPurposeVariable = function(a) {
	return null
};
mxGraphAbstractHierarchyCell.prototype.setGeneralPurposeVariable = function(a, b) {
	return null
};
mxGraphAbstractHierarchyCell.prototype.setX = function(a, b) {
	if (this.isVertex()) {
		this.x[0] = b
	} else {
		if (this.isEdge()) {
			this.x[a - this.minRank - 1] = b
		}
	}
};
mxGraphAbstractHierarchyCell.prototype.getX = function(a) {
	if (this.isVertex()) {
		return this.x[0]
	} else {
		if (this.isEdge()) {
			return this.x[a - this.minRank - 1]
		}
	}
	return 0
};
mxGraphAbstractHierarchyCell.prototype.setY = function(a, b) {
	if (this.isVertex()) {
		this.y[0] = b
	} else {
		if (this.isEdge()) {
			this.y[a - this.minRank - 1] = b
		}
	}
};
function mxGraphHierarchyNode(a) {
	mxGraphAbstractHierarchyCell.apply(this, arguments);
	this.cell = a
}
mxGraphHierarchyNode.prototype = new mxGraphAbstractHierarchyCell();
mxGraphHierarchyNode.prototype.constructor = mxGraphHierarchyNode;
mxGraphHierarchyNode.prototype.cell = null;
mxGraphHierarchyNode.prototype.connectsAsTarget = [];
mxGraphHierarchyNode.prototype.connectsAsSource = [];
mxGraphHierarchyNode.prototype.hashCode = false;
mxGraphHierarchyNode.prototype.getRankValue = function(a) {
	return this.maxRank
};
mxGraphHierarchyNode.prototype.getNextLayerConnectedCells = function(b) {
	if (this.nextLayerConnectedCells == null) {
		this.nextLayerConnectedCells = [];
		this.nextLayerConnectedCells[0] = [];
		for (var a = 0; a < this.connectsAsTarget.length; a++) {
			var c = this.connectsAsTarget[a];
			if (c.maxRank == -1 || c.maxRank == b + 1) {
				this.nextLayerConnectedCells[0].push(c.source)
			} else {
				this.nextLayerConnectedCells[0].push(c)
			}
		}
	}
	return this.nextLayerConnectedCells[0]
};
mxGraphHierarchyNode.prototype.getPreviousLayerConnectedCells = function(b) {
	if (this.previousLayerConnectedCells == null) {
		this.previousLayerConnectedCells = [];
		this.previousLayerConnectedCells[0] = [];
		for (var a = 0; a < this.connectsAsSource.length; a++) {
			var c = this.connectsAsSource[a];
			if (c.minRank == -1 || c.minRank == b - 1) {
				this.previousLayerConnectedCells[0].push(c.target)
			} else {
				this.previousLayerConnectedCells[0].push(c)
			}
		}
	}
	return this.previousLayerConnectedCells[0]
};
mxGraphHierarchyNode.prototype.isVertex = function() {
	return true
};
mxGraphHierarchyNode.prototype.getGeneralPurposeVariable = function(a) {
	return this.temp[0]
};
mxGraphHierarchyNode.prototype.setGeneralPurposeVariable = function(a, b) {
	this.temp[0] = b
};
mxGraphHierarchyNode.prototype.isAncestor = function(b) {
	if (b != null && this.hashCode != null && b.hashCode != null && this.hashCode.length < b.hashCode.length) {
		if (this.hashCode == b.hashCode) {
			return true
		}
		if (this.hashCode == null || this.hashCode == null) {
			return false
		}
		for (var a = 0; a < this.hashCode.length; a++) {
			if (this.hashCode[a] != b.hashCode[a]) {
				return false
			}
		}
		return true
	}
	return false
};
function mxGraphHierarchyEdge(a) {
	mxGraphAbstractHierarchyCell.apply(this, arguments);
	this.edges = a
}
mxGraphHierarchyEdge.prototype = new mxGraphAbstractHierarchyCell();
mxGraphHierarchyEdge.prototype.constructor = mxGraphHierarchyEdge;
mxGraphHierarchyEdge.prototype.edges = null;
mxGraphHierarchyEdge.prototype.source = null;
mxGraphHierarchyEdge.prototype.target = null;
mxGraphHierarchyEdge.prototype.isReversed = false;
mxGraphHierarchyEdge.prototype.invert = function(b) {
	var a = this.source;
	this.source = this.target;
	this.target = a;
	this.isReversed = !this.isReversed
};
mxGraphHierarchyEdge.prototype.getNextLayerConnectedCells = function(b) {
	if (this.nextLayerConnectedCells == null) {
		this.nextLayerConnectedCells = [];
		for (var a = 0; a < this.temp.length; a++) {
			this.nextLayerConnectedCells[a] = [];
			if (a == this.nextLayerConnectedCells.length - 1) {
				this.nextLayerConnectedCells[a].push(this.source)
			} else {
				this.nextLayerConnectedCells[a].push(this)
			}
		}
	}
	return this.nextLayerConnectedCells[b - this.minRank - 1]
};
mxGraphHierarchyEdge.prototype.getPreviousLayerConnectedCells = function(b) {
	if (this.previousLayerConnectedCells == null) {
		this.previousLayerConnectedCells = [];
		for (var a = 0; a < this.temp.length; a++) {
			this.previousLayerConnectedCells[a] = [];
			if (a == 0) {
				this.previousLayerConnectedCells[a].push(this.target)
			} else {
				this.previousLayerConnectedCells[a].push(this)
			}
		}
	}
	return this.previousLayerConnectedCells[b - this.minRank - 1]
};
mxGraphHierarchyEdge.prototype.isEdge = function() {
	return true
};
mxGraphHierarchyEdge.prototype.getGeneralPurposeVariable = function(a) {
	return this.temp[a - this.minRank - 1]
};
mxGraphHierarchyEdge.prototype.setGeneralPurposeVariable = function(a, b) {
	this.temp[a - this.minRank - 1] = b
};
function mxGraphHierarchyModel(u, g, l, o, v, m, w, e) {
	var b = u.getGraph();
	this.deterministic = m;
	this.tightenToSource = w;
	this.scanRanksFromSinks = e;
	this.roots = l;
	this.parent = o;
	this.vertexMapper = new Object();
	this.edgeMapper = new Object();
	this.maxRank = 0;
	var f = [];
	if (g == null) {
		g = this.graph.getChildVertices(o)
	}
	if (v) {
		this.formOrderedHierarchy(u, g, o)
	} else {
		if (this.scanRanksFromSinks) {
			this.maxRank = 0
		} else {
			this.maxRank = this.SOURCESCANSTARTRANK
		}
		this.createInternalCells(u, g, f);
		for (var t = 0; t < g.length; t++) {
			var c = f[t].connectsAsSource;
			for (var s = 0; s < c.length; s++) {
				var a = c[s];
				var d = a.edges;
				for (var r = 0; r < d.length; r++) {
					var n = d[r];
					var p = b.getView().getVisibleTerminal(n, false);
					var q = mxCellPath.create(p);
					var h = this.vertexMapper[q];
					if (h != null && f[t] != h) {
						a.target = h;
						if (h.connectsAsTarget.length == 0) {
							h.connectsAsTarget = []
						}
						if (mxUtils.indexOf(h.connectsAsTarget, a) < 0) {
							h.connectsAsTarget.push(a)
						}
					}
				}
			}
			f[t].temp[0] = 1
		}
	}
}
mxGraphHierarchyModel.prototype.scanRanksFromSinks = true;
mxGraphHierarchyModel.prototype.maxRank = null;
mxGraphHierarchyModel.prototype.vertexMapper = null;
mxGraphHierarchyModel.prototype.edgeMapper = null;
mxGraphHierarchyModel.prototype.ranks = null;
mxGraphHierarchyModel.prototype.roots = null;
mxGraphHierarchyModel.prototype.parent = null;
mxGraphHierarchyModel.prototype.dfsCount = 0;
mxGraphHierarchyModel.prototype.SOURCESCANSTARTRANK = 100000000;
mxGraphHierarchyModel.prototype.deterministic;
mxGraphHierarchyModel.prototype.tightenToSource = false;
mxGraphHierarchyModel.prototype.formOrderedHierarchy = function(n, o, r) {
	var s = n.getGraph();
	this.createInternalCells(n, o, internalVertices);
	var p = [];
	for (var l = 0; l < o.length; l++) {
		var g = internalVertices[l].connectsAsSource;
		for (var f = 0; f < g.length; f++) {
			var m = g[f];
			var a = m.edges;
			for (var e = 0; e < a.length; e++) {
				var b = a[e];
				var c = this.graph.getView().getVisibleTerminal(b, false);
				var q = mxCellPath.create(c);
				var d = vertexMapper[q];
				if (d != null && internalVertices[l] != d) {
					m.target = d;
					if (d.connectsAsTarget.length == 0) {
						d.connectsAsTarget = []
					}
					if (d.temp[0] == 1) {
						m.invert();
						d.connectsAsSource.push(m);
						p.push(m);
						if (mxUtils.indexOf(internalVertices[l].connectsAsTarget, m) < 0) {
							internalVertices[l].connectsAsTarget.push(m)
						}
					} else {
						if (mxUtils.indexOf(d.connectsAsTarget, m) < 0) {
							d.connectsAsTarget.push(m)
						}
					}
				}
			}
		}
		for (var f = 0; f < p.length; f++) {
			var h = p[f];
			mxUtils.remove(h, internalVertices[l].connectsAsSource)
		}
		p = [];
		internalVertices[l].temp[0] = 1
	}
};
mxGraphHierarchyModel.prototype.createInternalCells = function(h, l, o) {
	var q = h.getGraph();
	for (var f = 0; f < l.length; f++) {
		o[f] = new mxGraphHierarchyNode(l[f]);
		var m = mxCellPath.create(l[f]);
		this.vertexMapper[m] = o[f];
		var a = q.getConnections(l[f], this.parent);
		var r = q.getOpposites(a, l[f]);
		o[f].connectsAsSource = [];
		for (var e = 0; e < r.length; e++) {
			var p = r[e];
			if (p != l[f] && !h.isVertexIgnored(p)) {
				var d = q.getEdgesBetween(l[f], p, true);
				if (d != null && d.length > 0) {
					var g = new mxGraphHierarchyEdge(d);
					for (var c = 0; c < d.length; c++) {
						var b = d[c];
						var n = mxCellPath.create(b);
						this.edgeMapper[n] = g;
						q.resetEdge(b);
						if (h.disableEdgeStyle) {
							h.setEdgeStyleEnabled(b, false);
							h.setOrthogonalEdge(b, true)
						}
					}
					g.source = o[f];
					if (mxUtils.indexOf(o[f].connectsAsSource, g) < 0) {
						o[f].connectsAsSource.push(g)
					}
				}
			}
		}
		o[f].temp[0] = 0
	}
};
mxGraphHierarchyModel.prototype.initialRank = function() {
	var g = [];
	if (!this.scanRanksFromSinks && this.roots != null) {
		for (var h = 0; h < this.roots.length; h++) {
			var n = mxCellPath.create(this.roots[h]);
			var m = this.vertexMapper[n];
			if (m != null) {
				g.push(m)
			}
		}
	}
	if (this.scanRanksFromSinks) {
		for (var p in this.vertexMapper) {
			var m = this.vertexMapper[p];
			if (m.connectsAsSource == null || m.connectsAsSource.length == 0) {
				g.push(m)
			}
		}
	}
	if (g.length == 0) {
		for (var p in this.vertexMapper) {
			var m = this.vertexMapper[p];
			if (m.connectsAsTarget == null || m.connectsAsTarget.length == 0) {
				g.push(m);
				this.scanRanksFromSinks = false;
				this.maxRank = this.SOURCESCANSTARTRANK
			}
		}
	}
	for (var p in this.vertexMapper) {
		var m = this.vertexMapper[p];
		m.temp[0] = -1
	}
	var l = g.slice();
	while (g.length > 0) {
		var m = g[0];
		var q;
		var o;
		if (this.scanRanksFromSinks) {
			q = m.connectsAsSource;
			o = m.connectsAsTarget
		} else {
			q = m.connectsAsTarget;
			o = m.connectsAsSource
		}
		var a = true;
		var c = 0;
		if (!this.scanRanksFromSinks) {
			c = this.SOURCESCANSTARTRANK
		}
		for (var h = 0; h < q.length; h++) {
			var k = q[h];
			if (k.temp[0] == 5270620) {
				var f;
				if (this.scanRanksFromSinks) {
					f = k.target
				} else {
					f = k.source
				}
				if (this.scanRanksFromSinks) {
					c = Math.max(c, f.temp[0] + 1)
				} else {
					c = Math.min(c, f.temp[0] - 1)
				}
			} else {
				a = false;
				break
			}
		}
		if (a) {
			m.temp[0] = c;
			if (this.scanRanksFromSinks) {
				this.maxRank = Math.max(this.maxRank, c)
			} else {
				this.maxRank = Math.min(this.maxRank, c)
			}
			if (o != null) {
				for (var h = 0; h < o.length; h++) {
					var k = o[h];
					k.temp[0] = 5270620;
					var f;
					if (this.scanRanksFromSinks) {
						f = k.source
					} else {
						f = k.target
					}
					if (f.temp[0] == -1) {
						g.push(f);
						f.temp[0] = -2
					}
				}
			}
			g.shift()
		} else {
			var d = g.shift();
			g.push(m);
			if (d == m && g.length == 1) {
				break
			}
		}
	}
	if (this.scanRanksFromSinks) {
		if (this.tightenToSource) {
			for (var h = 0; h < l.length; h++) {
				var m = l[h];
				var b = 1000000;
				var q = m.connectsAsTarget;
				for (var e = 0; e < m.connectsAsTarget.length; e++) {
					var k = m.connectsAsTarget[e];
					var f = k.source;
					m.temp[0] = Math.min(b, f.temp[0] - 1);
					b = m.temp[0]
				}
			}
		}
	} else {
		for (var p in this.vertexMapper) {
			var m = this.vertexMapper[p];
			m.temp[0] -= this.maxRank
		}
		this.maxRank = this.SOURCESCANSTARTRANK - this.maxRank
	}
};
mxGraphHierarchyModel.prototype.fixRanks = function() {
	var c = [];
	this.ranks = [];
	for (var d = 0; d < this.maxRank + 1; d++) {
		c[d] = [];
		this.ranks[d] = c[d]
	}
	var g = null;
	if (this.roots != null) {
		var b = this.roots;
		g = [];
		for (var d = 0; d < b.length; d++) {
			var a = b[d];
			var e = mxCellPath.create(a);
			var f = this.vertexMapper[e];
			g[d] = f
		}
	}
	this.visit(function(n, p, o, m, k) {
		if (k == 0 && p.maxRank < 0 && p.minRank < 0) {
			c[p.temp[0]].push(p);
			p.maxRank = p.temp[0];
			p.minRank = p.temp[0];
			p.temp[0] = c[p.maxRank].length - 1
		}
		if (n != null && o != null) {
			var h = n.maxRank - p.maxRank;
			if (h > 1) {
				o.maxRank = n.maxRank;
				o.minRank = p.maxRank;
				o.temp = [];
				o.x = [];
				o.y = [];
				for (var l = o.minRank + 1; l < o.maxRank; l++) {
					c[l].push(o);
					o.setGeneralPurposeVariable(l, c[l].length - 1)
				}
			}
		}
	},
	g, false, null)
};
mxGraphHierarchyModel.prototype.visit = function(e, a, d, b) {
	if (a != null) {
		for (var c = 0; c < a.length; c++) {
			var f = a[c];
			if (f != null) {
				if (b == null) {
					b = new Object()
				}
				if (d) {
					f.hashCode = [];
					f.hashCode[0] = this.dfsCount;
					f.hashCode[1] = c;
					this.extendedDfs(null, f, null, e, b, f.hashCode, c, 0)
				} else {
					this.dfs(null, f, null, e, b, 0)
				}
			}
		}
		this.dfsCount++
	}
};
mxGraphHierarchyModel.prototype.dfs = function(k, h, m, f, a, e) {
	if (h != null) {
		var l = mxCellPath.create(h.cell);
		if (a[l] == null) {
			a[l] = h;
			f(k, h, m, e, 0);
			var b = h.connectsAsSource.slice();
			for (var c = 0; c < b.length; c++) {
				var d = b[c];
				var g = d.target;
				this.dfs(h, g, d, f, a, e + 1)
			}
		} else {
			f(k, h, m, e, 1)
		}
	}
};
mxGraphHierarchyModel.prototype.extendedDfs = function(n, l, o, h, a, p, c, g) {
	if (l != null) {
		if (n != null) {
			if (l.hashCode == null || l.hashCode[0] != n.hashCode[0]) {
				var b = n.hashCode.length + 1;
				l.hashCode = n.hashCode.slice();
				l.hashCode[b - 1] = c
			}
		}
		var m = mxCellPath.create(l.cell);
		if (a[m] == null) {
			a[m] = l;
			h(n, l, o, g, 0);
			var d = l.connectsAsSource.slice();
			for (var e = 0; e < d.length; e++) {
				var f = d[e];
				var k = f.target;
				this.extendedDfs(l, k, f, h, a, l.hashCode, e, g + 1)
			}
		} else {
			h(n, l, o, g, 1)
		}
	}
};
function mxHierarchicalLayoutStage() {}
mxHierarchicalLayoutStage.prototype.execute = function(a) {};
function mxMedianHybridCrossingReduction(a) {
	this.layout = a
}
mxMedianHybridCrossingReduction.prototype = new mxHierarchicalLayoutStage();
mxMedianHybridCrossingReduction.prototype.constructor = mxMedianHybridCrossingReduction;
mxMedianHybridCrossingReduction.prototype.layout = null;
mxMedianHybridCrossingReduction.prototype.maxIterations = 24;
mxMedianHybridCrossingReduction.prototype.nestedBestRanks = null;
mxMedianHybridCrossingReduction.prototype.currentBestCrossings = 0;
mxMedianHybridCrossingReduction.prototype.iterationsWithoutImprovement = 0;
mxMedianHybridCrossingReduction.prototype.maxNoImprovementIterations = 2;
mxMedianHybridCrossingReduction.prototype.execute = function(n) {
	var g = this.layout.getModel();
	this.nestedBestRanks = [];
	for (var e = 0; e < g.ranks.length; e++) {
		this.nestedBestRanks[e] = g.ranks[e].slice()
	}
	var a = 0;
	var h = this.calculateCrossings(g);
	for (var e = 0; e < this.maxIterations && a < this.maxNoImprovementIterations; e++) {
		this.weightedMedian(e, g);
		this.transpose(e, g);
		var m = this.calculateCrossings(g);
		if (m < h) {
			h = m;
			a = 0;
			for (var c = 0; c < this.nestedBestRanks.length; c++) {
				var d = g.ranks[c];
				for (var b = 0; b < d.length; b++) {
					var o = d[b];
					this.nestedBestRanks[c][o.getGeneralPurposeVariable(c)] = o
				}
			}
		} else {
			a++;
			for (var c = 0; c < this.nestedBestRanks.length; c++) {
				var d = g.ranks[c];
				for (var b = 0; b < d.length; b++) {
					var o = d[b];
					o.setGeneralPurposeVariable(c, b)
				}
			}
		}
		if (h == 0) {
			break
		}
	}
	var f = [];
	var l = [];
	for (var e = 0; e < g.maxRank + 1; e++) {
		l[e] = [];
		f[e] = l[e]
	}
	for (var e = 0; e < this.nestedBestRanks.length; e++) {
		for (var c = 0; c < this.nestedBestRanks[e].length; c++) {
			l[e].push(this.nestedBestRanks[e][c])
		}
	}
	g.ranks = f
};
mxMedianHybridCrossingReduction.prototype.calculateCrossings = function(b) {
	var d = b.ranks.length;
	var a = 0;
	for (var c = 1; c < d; c++) {
		a += this.calculateRankCrossing(c, b)
	}
	return a
};
mxMedianHybridCrossingReduction.prototype.calculateRankCrossing = function(l, m) {
	var d = 0;
	var h = m.ranks[l];
	var r = m.ranks[l - 1];
	var q = h.length;
	var p = r.length;
	var t = [];
	for (var f = 0; f < q; f++) {
		t[f] = []
	}
	for (var f = 0; f < h.length; f++) {
		var c = h[f];
		var a = c.getGeneralPurposeVariable(l);
		var o = c.getPreviousLayerConnectedCells(l);
		for (var e = 0; e < o.length; e++) {
			var b = o[e];
			var g = b.getGeneralPurposeVariable(l - 1);
			t[a][g] = 201207
		}
	}
	for (var f = 0; f < q; f++) {
		for (var e = 0; e < p; e++) {
			if (t[f][e] == 201207) {
				for (var s = f + 1; s < q; s++) {
					for (var n = 0; n < e; n++) {
						if (t[s][n] == 201207) {
							d++
						}
					}
				}
				for (var s = 0; s < f; s++) {
					for (var n = e + 1; n < p; n++) {
						if (t[s][n] == 201207) {
							d++
						}
					}
				}
			}
		}
	}
	return d / 2
};
mxMedianHybridCrossingReduction.prototype.transpose = function(a, f) {
	var b = true;
	var n = 0;
	var q = 10;
	while (b && n++<q) {
		var s = a % 2 == 1 && n % 2 == 1;
		b = false;
		for (var y = 0; y < f.ranks.length; y++) {
			var z = f.ranks[y];
			var C = [];
			for (var x = 0; x < z.length; x++) {
				var d = z[x];
				var B = d.getGeneralPurposeVariable(y);
				if (B < 0) {
					B = x
				}
				C[B] = d
			}
			var t = null;
			var m = null;
			var g = null;
			var r = null;
			var e = null;
			var w = null;
			var D = null;
			var c = null;
			var l = null;
			var v = null;
			for (var x = 0; x < (z.length - 1); x++) {
				if (x == 0) {
					l = C[x];
					t = l.getNextLayerConnectedCells(y);
					m = l.getPreviousLayerConnectedCells(y);
					e = [];
					w = [];
					for (var u = 0; u < e.length; u++) {
						e[u] = t[u].getGeneralPurposeVariable(y + 1)
					}
					for (var u = 0; u < w.length; u++) {
						w[u] = m[u].getGeneralPurposeVariable(y - 1)
					}
				} else {
					t = g;
					m = r;
					e = D;
					w = c;
					l = v
				}
				v = C[x + 1];
				g = v.getNextLayerConnectedCells(y);
				r = v.getPreviousLayerConnectedCells(y);
				D = [];
				c = [];
				for (var u = 0; u < D.length; u++) {
					D[u] = g[u].getGeneralPurposeVariable(y + 1)
				}
				for (var u = 0; u < c.length; u++) {
					c[u] = r[u].getGeneralPurposeVariable(y - 1)
				}
				var h = 0;
				var o = 0;
				for (var u = 0; u < e.length; u++) {
					for (var p = 0; p < D.length; p++) {
						if (e[u] > D[p]) {
							h++
						}
						if (e[u] < D[p]) {
							o++
						}
					}
				}
				for (var u = 0; u < w.length; u++) {
					for (var p = 0; p < c.length; p++) {
						if (w[u] > c[p]) {
							h++
						}
						if (w[u] < c[p]) {
							o++
						}
					}
				}
				if ((o < h) || (o == h && s)) {
					var A = l.getGeneralPurposeVariable(y);
					l.setGeneralPurposeVariable(y, v.getGeneralPurposeVariable(y));
					v.setGeneralPurposeVariable(y, A);
					g = t;
					r = m;
					D = e;
					c = w;
					v = l;
					if (!s) {
						b = true
					}
				}
			}
		}
	}
};
mxMedianHybridCrossingReduction.prototype.weightedMedian = function(c, b) {
	var d = (c % 2 == 0);
	if (d) {
		for (var a = b.maxRank - 1; a >= 0; a--) {
			this.medianRank(a, d)
		}
	} else {
		for (var a = 1; a < b.maxRank; a++) {
			this.medianRank(a, d)
		}
	}
};
mxMedianHybridCrossingReduction.prototype.medianRank = function(e, g) {
	var f = this.nestedBestRanks[e].length;
	var b = [];
	for (var c = 0; c < f; c++) {
		var a = this.nestedBestRanks[e][c];
		b[c] = new MedianCellSorter();
		b[c].cell = a;
		b[c].nudge = !g;
		var h;
		if (g) {
			h = a.getNextLayerConnectedCells(e)
		} else {
			h = a.getPreviousLayerConnectedCells(e)
		}
		var d;
		if (g) {
			d = e + 1
		} else {
			d = e - 1
		}
		if (h != null && h.length != 0) {
			b[c].medianValue = this.medianValue(h, d)
		} else {
			b[c].medianValue = -1
		}
	}
	b.sort(MedianCellSorter.prototype.compare);
	for (var c = 0; c < f; c++) {
		b[c].cell.setGeneralPurposeVariable(e, c)
	}
};
mxMedianHybridCrossingReduction.prototype.medianValue = function(e, k) {
	var f = [];
	var g = 0;
	for (var b = 0; b < e.length; b++) {
		var h = e[b];
		f[g++] = h.getGeneralPurposeVariable(k)
	}
	f.sort(MedianCellSorter.prototype.compare);
	if (g % 2 == 1) {
		return f[g / 2]
	} else {
		if (g == 2) {
			return ((f[0] + f[1]) / 2)
		} else {
			var c = g / 2;
			var d = f[c - 1] - f[0];
			var a = f[g - 1] - f[c];
			return (f[c - 1] * a + f[c] * d) / (d + a)
		}
	}
};
function MedianCellSorter() {}
MedianCellSorter.prototype.medianValue = 0;
MedianCellSorter.prototype.nudge = false;
MedianCellSorter.prototype.cell = false;
MedianCellSorter.prototype.compare = function(d, c) {
	if (d != null && c != null) {
		if (c.medianValue > d.medianValue) {
			return - 1
		} else {
			if (c.medianValue < d.medianValue) {
				return 1
			} else {
				if (c.nudge) {
					return - 1
				} else {
					return 1
				}
			}
		}
	} else {
		return 0
	}
};
function mxMinimumCycleRemover(a) {
	this.layout = a
}
mxMinimumCycleRemover.prototype = new mxHierarchicalLayoutStage();
mxMinimumCycleRemover.prototype.constructor = mxMinimumCycleRemover;
mxMinimumCycleRemover.prototype.layout = null;
mxMinimumCycleRemover.prototype.execute = function(o) {
	var m = this.layout.getModel();
	var a = new Object();
	var n = mxUtils.clone(m.vertexMapper, null, true);
	var l = null;
	if (m.roots != null) {
		var f = m.roots;
		l = [];
		for (var h = 0; h < f.length; h++) {
			var c = mxCellPath.create(f[h]);
			l[h] = m.vertexMapper[c]
		}
	}
	m.visit(function(t, u, i, s, r) {
		if (u.isAncestor(t)) {
			i.invert();
			mxUtils.remove(i, t.connectsAsSource);
			t.connectsAsTarget.push(i);
			mxUtils.remove(i, u.connectsAsTarget);
			u.connectsAsSource.push(i)
		}
		var v = mxCellPath.create(u.cell);
		a[v] = u;
		delete n[v]
	},
	l, true, null);
	var k = null;
	if (n.lenth > 0) {
		k = mxUtils.clone(n, null, true)
	}
	var g = mxUtils.clone(a, null, true);
	m.visit(function(t, u, i, s, r) {
		if (u.isAncestor(t)) {
			i.invert();
			mxUtils.remove(i, t.connectsAsSource);
			u.connectsAsSource.push(i);
			t.connectsAsTarget.push(i);
			mxUtils.remove(i, u.connectsAsTarget)
		}
		var v = mxCellPath.create(u.cell);
		a[v] = u;
		delete n[v]
	},
	n, true, g);
	var q = this.layout.getGraph();
	if (k != null && k.length > 0) {
		var p = m.roots;
		for (var h = 0; h < k.length; h++) {
			var e = k[h];
			var d = e.cell;
			var b = q.getIncomingEdges(d).length;
			if (b == 0) {
				p.push(d)
			}
		}
	}
};
function mxCoordinateAssignment(e, b, f, c, d, a) {
	this.layout = e;
	this.intraCellSpacing = b;
	this.interRankCellSpacing = f;
	this.orientation = c;
	this.initialX = d;
	this.parallelEdgeSpacing = a
}
var mxHierarchicalEdgeStyle = {
	ORTHOGONAL: 1,
	POLYLINE: 2,
	STRAIGHT: 3
};
mxCoordinateAssignment.prototype = new mxHierarchicalLayoutStage();
mxCoordinateAssignment.prototype.constructor = mxCoordinateAssignment;
mxCoordinateAssignment.prototype.layout = null;
mxCoordinateAssignment.prototype.intraCellSpacing = 30;
mxCoordinateAssignment.prototype.interRankCellSpacing = 10;
mxCoordinateAssignment.prototype.parallelEdgeSpacing = 10;
mxCoordinateAssignment.prototype.maxIterations = 8;
mxCoordinateAssignment.prototype.prefHozEdgeSep = 5;
mxCoordinateAssignment.prototype.prefVertEdgeOff = 2;
mxCoordinateAssignment.prototype.minEdgeJetty = 12;
mxCoordinateAssignment.prototype.channelBuffer = 4;
mxCoordinateAssignment.prototype.jettyPositions = null;
mxCoordinateAssignment.prototype.orientation = mxConstants.DIRECTION_NORTH;
mxCoordinateAssignment.prototype.initialX = null;
mxCoordinateAssignment.prototype.limitX = null;
mxCoordinateAssignment.prototype.currentXDelta = null;
mxCoordinateAssignment.prototype.widestRank = null;
mxCoordinateAssignment.prototype.rankTopY = null;
mxCoordinateAssignment.prototype.rankBottomY = null;
mxCoordinateAssignment.prototype.widestRankValue = null;
mxCoordinateAssignment.prototype.rankWidths = null;
mxCoordinateAssignment.prototype.rankY = null;
mxCoordinateAssignment.prototype.fineTuning = true;
mxCoordinateAssignment.prototype.edgeStyle = mxHierarchicalEdgeStyle.POLYLINE;
mxCoordinateAssignment.prototype.nextLayerConnectedCache = null;
mxCoordinateAssignment.prototype.previousLayerConnectedCache = null;
mxCoordinateAssignment.prototype.execute = function(g) {
	this.jettyPositions = [];
	var d = this.layout.getModel();
	this.currentXDelta = 0;
	this.initialCoords(this.layout.getGraph(), d);
	if (this.fineTuning) {
		this.minNode(d)
	}
	var f = 100000000;
	if (this.fineTuning) {
		for (var e = 0; e < this.maxIterations; e++) {
			if (e != 0) {
				this.medianPos(e, d);
				this.minNode(d)
			}
			if (this.currentXDelta < f) {
				for (var c = 0; c < d.ranks.length; c++) {
					var h = d.ranks[c];
					for (var b = 0; b < h.length; b++) {
						var a = h[b];
						a.setX(c, a.getGeneralPurposeVariable(c))
					}
				}
				f = this.currentXDelta
			} else {
				for (var c = 0; c < d.ranks.length; c++) {
					var h = d.ranks[c];
					for (var b = 0; b < h.length; b++) {
						var a = h[b];
						a.setGeneralPurposeVariable(c, a.getX(c))
					}
				}
			}
			this.minPath(this.layout.getGraph(), d);
			this.currentXDelta = 0
		}
	}
	this.setCellLocations(this.layout.getGraph(), d)
};
mxCoordinateAssignment.prototype.minNode = function(h) {
	var H = [];
	var I = [];
	var G = [];
	for (var D = 0; D <= h.maxRank; D++) {
		G[D] = h.ranks[D];
		for (var C = 0; C < G[D].length; C++) {
			var x = G[D][C];
			var o = new WeightedCellSorter(x, D);
			o.rankIndex = C;
			o.visited = true;
			H.push(o);
			var J = mxCellPath.create(x.cell);
			I[J] = o
		}
	}
	var B = H.length * 10;
	var m = 0;
	var E = 1;
	while (H.length > 0 && m <= B) {
		var e = H.shift();
		var d = e.cell;
		var A = e.weightedValue;
		var p = parseInt(e.rankIndex);
		var w = d.getNextLayerConnectedCells(A);
		var b = d.getPreviousLayerConnectedCells(A);
		var u = w.length;
		var r = b.length;
		var n = this.medianXValue(w, A + 1);
		var c = this.medianXValue(b, A - 1);
		var y = u + r;
		var s = d.getGeneralPurposeVariable(A);
		var F = s;
		if (y > 0) {
			F = (n * u + c * r) / y
		}
		var a = false;
		if (F < s - E) {
			if (p == 0) {
				d.setGeneralPurposeVariable(A, F);
				a = true
			} else {
				var l = G[A][p - 1];
				var g = l.getGeneralPurposeVariable(A);
				g = g + l.width / 2 + this.intraCellSpacing + d.width / 2;
				if (g < F) {
					d.setGeneralPurposeVariable(A, F);
					a = true
				} else {
					if (g < d.getGeneralPurposeVariable(A) - E) {
						d.setGeneralPurposeVariable(A, g);
						a = true
					}
				}
			}
		} else {
			if (F > s + E) {
				var q = G[A].length;
				if (p == q - 1) {
					d.setGeneralPurposeVariable(A, F);
					a = true
				} else {
					var z = G[A][p + 1];
					var k = z.getGeneralPurposeVariable(A);
					k = k - z.width / 2 - this.intraCellSpacing - d.width / 2;
					if (k > F) {
						d.setGeneralPurposeVariable(A, F);
						a = true
					} else {
						if (k > d.getGeneralPurposeVariable(A) + E) {
							d.setGeneralPurposeVariable(A, k);
							a = true
						}
					}
				}
			}
		}
		if (a) {
			for (var D = 0; D < w.length; D++) {
				var f = w[D];
				var t = mxCellPath.create(f.cell);
				var v = I[t];
				if (v != null) {
					if (v.visited == false) {
						v.visited = true;
						H.push(v)
					}
				}
			}
			for (var D = 0; D < b.length; D++) {
				var f = b[D];
				var t = mxCellPath.create(f.cell);
				var v = I[t];
				if (v != null) {
					if (v.visited == false) {
						v.visited = true;
						H.push(v)
					}
				}
			}
		}
		e.visited = false;
		m++
	}
};
mxCoordinateAssignment.prototype.medianPos = function(c, b) {
	var d = (c % 2 == 0);
	if (d) {
		for (var a = b.maxRank; a > 0; a--) {
			this.rankMedianPosition(a - 1, b, a)
		}
	} else {
		for (var a = 0; a < b.maxRank - 1; a++) {
			this.rankMedianPosition(a + 1, b, a)
		}
	}
};
mxCoordinateAssignment.prototype.rankMedianPosition = function(r, d, o) {
	var u = d.ranks[r];
	var h = [];
	var k = [];
	for (var t = 0; t < u.length; t++) {
		var n = u[t];
		h[t] = new WeightedCellSorter();
		h[t].cell = n;
		h[t].rankIndex = t;
		var m = mxCellPath.create(n.cell);
		k[m] = h[t];
		var p = null;
		if (o < r) {
			p = n.getPreviousLayerConnectedCells(r)
		} else {
			p = n.getNextLayerConnectedCells(r)
		}
		h[t].weightedValue = this.calculatedWeightedValue(n, p)
	}
	h.sort(WeightedCellSorter.prototype.compare);
	for (var t = 0; t < h.length; t++) {
		var l = 0;
		var a = h[t].cell;
		var p = null;
		var g = 0;
		if (o < r) {
			p = a.getPreviousLayerConnectedCells(r).slice()
		} else {
			p = a.getNextLayerConnectedCells(r).slice()
		}
		if (p != null) {
			l = p.length;
			if (l > 0) {
				g = this.medianXValue(p, o)
			} else {
				g = a.getGeneralPurposeVariable(r)
			}
		}
		var w = 0;
		var c = -100000000;
		for (var s = h[t].rankIndex - 1; s >= 0;) {
			var b = mxCellPath.create(u[s].cell);
			var v = k[b];
			if (v != null) {
				var f = v.cell;
				if (v.visited) {
					c = f.getGeneralPurposeVariable(r) + f.width / 2 + this.intraCellSpacing + w + a.width / 2;
					s = -1
				} else {
					w += f.width + this.intraCellSpacing;
					s--
				}
			}
		}
		var x = 0;
		var e = 100000000;
		for (var s = h[t].rankIndex + 1; s < h.length;) {
			var b = mxCellPath.create(u[s].cell);
			var v = k[b];
			if (v != null) {
				var q = v.cell;
				if (v.visited) {
					e = q.getGeneralPurposeVariable(r) - q.width / 2 - this.intraCellSpacing - x - a.width / 2;
					s = h.length
				} else {
					x += q.width + this.intraCellSpacing;
					s++
				}
			}
		}
		if (g >= c && g <= e) {
			a.setGeneralPurposeVariable(r, g)
		} else {
			if (g < c) {
				a.setGeneralPurposeVariable(r, c);
				this.currentXDelta += c - g
			} else {
				if (g > e) {
					a.setGeneralPurposeVariable(r, e);
					this.currentXDelta += g - e
				}
			}
		}
		h[t].visited = true
	}
};
mxCoordinateAssignment.prototype.calculatedWeightedValue = function(e, d) {
	var b = 0;
	for (var c = 0; c < d.length; c++) {
		var a = d[c];
		if (e.isVertex() && a.isVertex()) {
			b++
		} else {
			if (e.isEdge() && a.isEdge()) {
				b += 8
			} else {
				b += 2
			}
		}
	}
	return b
};
mxCoordinateAssignment.prototype.medianXValue = function(c, g) {
	if (c.length == 0) {
		return 0
	}
	var a = [];
	for (var f = 0; f < c.length; f++) {
		a[f] = c[f].getGeneralPurposeVariable(g)
	}
	a.sort(MedianCellSorter.prototype.compare);
	if (c.length % 2 == 1) {
		return a[c.length / 2]
	} else {
		var e = c.length / 2;
		var b = a[e - 1];
		var d = a[e];
		return ((b + d) / 2)
	}
};
mxCoordinateAssignment.prototype.initialCoords = function(c, a) {
	this.calculateWidestRank(c, a);
	for (var b = this.widestRank; b >= 0; b--) {
		if (b < a.maxRank) {
			this.rankCoordinates(b, c, a)
		}
	}
	for (var b = this.widestRank + 1; b <= a.maxRank; b++) {
		if (b > 0) {
			this.rankCoordinates(b, c, a)
		}
	}
};
mxCoordinateAssignment.prototype.rankCoordinates = function(m, l, k) {
	var g = k.ranks[m];
	var b = 0;
	var e = this.initialX + (this.widestRankValue - this.rankWidths[m]) / 2;
	var c = false;
	for (var h = 0; h < g.length; h++) {
		var d = g[h];
		if (d.isVertex()) {
			var a = this.layout.getVertexBounds(d.cell);
			if (a != null) {
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					d.width = a.width;
					d.height = a.height
				} else {
					d.width = a.height;
					d.height = a.width
				}
			} else {
				c = true
			}
			b = Math.max(b, d.height)
		} else {
			if (d.isEdge()) {
				var f = 1;
				if (d.edges != null) {
					f = d.edges.length
				} else {
					mxLog.warn("edge.edges is null")
				}
				d.width = (f - 1) * this.parallelEdgeSpacing
			}
		}
		e += d.width / 2;
		d.setX(m, e);
		d.setGeneralPurposeVariable(m, e);
		e += d.width / 2;
		e += this.intraCellSpacing
	}
	if (c == true) {
		mxLog.warn("At least one cell has no bounds")
	}
};
mxCoordinateAssignment.prototype.calculateWidestRank = function(p, m) {
	var n = -this.interRankCellSpacing;
	var e = 0;
	this.rankWidths = [];
	this.rankY = [];
	for (var q = m.maxRank; q >= 0; q--) {
		var b = 0;
		var l = m.ranks[q];
		var f = this.initialX;
		var c = false;
		for (var k = 0; k < l.length; k++) {
			var d = l[k];
			if (d.isVertex()) {
				var a = this.layout.getVertexBounds(d.cell);
				if (a != null) {
					if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
						d.width = a.width;
						d.height = a.height
					} else {
						d.width = a.height;
						d.height = a.width
					}
				} else {
					c = true
				}
				b = Math.max(b, d.height)
			} else {
				if (d.isEdge()) {
					var h = 1;
					if (d.edges != null) {
						h = d.edges.length
					} else {
						mxLog.warn("edge.edges is null")
					}
					d.width = (h - 1) * this.parallelEdgeSpacing
				}
			}
			f += d.width / 2;
			d.setX(q, f);
			d.setGeneralPurposeVariable(q, f);
			f += d.width / 2;
			f += this.intraCellSpacing;
			if (f > this.widestRankValue) {
				this.widestRankValue = f;
				this.widestRank = q
			}
			this.rankWidths[q] = f
		}
		if (c == true) {
			mxLog.warn("At least one cell has no bounds")
		}
		this.rankY[q] = n;
		var g = b / 2 + e / 2 + this.interRankCellSpacing;
		e = b;
		if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_WEST) {
			n += g
		} else {
			n -= g
		}
		for (var k = 0; k < l.length; k++) {
			var o = l[k];
			o.setY(q, n)
		}
	}
};
mxCoordinateAssignment.prototype.minPath = function(q, g) {
	var e = g.edgeMapper;
	for (var o in e) {
		var p = e[o];
		var b = p.maxRank - p.minRank - 1;
		var a = p.getGeneralPurposeVariable(p.minRank + 1);
		var h = true;
		var l = 0;
		for (var f = p.minRank + 2; f < p.maxRank; f++) {
			var m = p.getGeneralPurposeVariable(f);
			if (a != m) {
				h = false;
				a = m
			} else {
				l++
			}
		}
		if (!h) {
			var d = 0;
			var n = 0;
			var r = [];
			var k = [];
			var c = p.getGeneralPurposeVariable(p.minRank + 1);
			for (var f = p.minRank + 1; f < p.maxRank - 1; f++) {
				var s = p.getX(f + 1);
				if (c == s) {
					r[f - p.minRank - 1] = c;
					d++
				} else {
					if (this.repositionValid(g, p, f + 1, c)) {
						r[f - p.minRank - 1] = c;
						d++
					} else {
						r[f - p.minRank - 1] = p.getX(f);
						c = s
					}
				}
			}
			c = p.getX(f);
			for (var f = p.maxRank - 1; f > p.minRank + 1; f--) {
				var s = p.getX(f - 1);
				if (c == s) {
					k[f - p.minRank - 2] = c;
					n++
				} else {
					if (this.repositionValid(g, p, f - 1, c)) {
						k[f - p.minRank - 2] = c;
						n++
					} else {
						k[f - p.minRank - 2] = p.getX(f);
						c = s
					}
				}
			}
			if (n > l || d > l) {
				if (n > d) {
					for (var f = p.maxRank - 2; f > p.minRank; f--) {
						p.setX(f, k[f - p.minRank - 1])
					}
				} else {
					if (d > n) {
						for (var f = p.minRank + 2; f < p.maxRank; f++) {
							p.setX(f, r[f - p.minRank - 2])
						}
					} else {}
				}
			}
		}
	}
};
mxCoordinateAssignment.prototype.repositionValid = function(e, m, c, f) {
	var l = e.ranks[c];
	var h = -1;
	for (var d = 0; d < l.length; d++) {
		if (m == l[d]) {
			h = d;
			break
		}
	}
	if (h < 0) {
		return false
	}
	var a = m.getGeneralPurposeVariable(c);
	if (f < a) {
		if (h == 0) {
			return true
		}
		var k = l[h - 1];
		var g = k.getGeneralPurposeVariable(c);
		g = g + k.width / 2 + this.intraCellSpacing + m.width / 2;
		if (g <= f) {
			return true
		} else {
			return false
		}
	} else {
		if (f > a) {
			if (h == l.length - 1) {
				return true
			}
			var b = l[h + 1];
			var n = b.getGeneralPurposeVariable(c);
			n = n - b.width / 2 - this.intraCellSpacing - m.width / 2;
			if (n >= f) {
				return true
			} else {
				return false
			}
		}
	}
	return true
};
mxCoordinateAssignment.prototype.setCellLocations = function(f, c) {
	this.rankTopY = [];
	this.rankBottomY = [];
	for (var e = 0; e < c.ranks.length; e++) {
		this.rankTopY[e] = Number.MAX_VALUE;
		this.rankBottomY[e] = 0
	}
	var a = c.edgeMapper;
	var b = c.vertexMapper;
	for (var d in b) {
		this.setVertexLocation(b[d])
	}
	if (this.edgeStyle == mxHierarchicalEdgeStyle.ORTHOGONAL || this.edgeStyle == mxHierarchicalEdgeStyle.POLYLINE) {
		this.localEdgeProcessing(c)
	}
	for (var d in a) {
		this.setEdgePosition(a[d])
	}
};
mxCoordinateAssignment.prototype.localEdgeProcessing = function(h) {
	var r = h.edgeMapper;
	for (var q = 0; q < h.ranks.length; q++) {
		var C = h.ranks[q];
		for (var t = 0; t < C.length; t++) {
			var c = C[t];
			if (c.isVertex()) {
				var F = c.getPreviousLayerConnectedCells(q);
				var n = q - 1;
				for (var A = 0; A < 2; A++) {
					if (n > -1 && n < h.ranks.length && F != null && F.length > 0) {
						var s = [];
						for (var B = 0; B < F.length; B++) {
							var z = new WeightedCellSorter(F[B], F[B].getX(n));
							s.push(z)
						}
						s.sort(WeightedCellSorter.prototype.compare);
						var g = c.x[0] - c.width / 2;
						var i = g + c.width;
						var o = 0;
						var p = 0;
						var D = [];
						for (var B = 0; B < s.length; B++) {
							var E = s[B].cell;
							var v;
							if (E.isVertex()) {
								if (A == 0) {
									v = c.connectsAsSource
								} else {
									v = c.connectsAsTarget
								}
								for (var a = 0; a < v.length; a++) {
									if (v[a].source == E || v[a].target == E) {
										o += v[a].edges.length;
										p++;
										D.push(v[a])
									}
								}
							} else {
								o += E.edges.length;
								p++;
								D.push(E)
							}
						}
						var f = (o + 1) * this.prefHozEdgeSep;
						if (c.width > f + (2 * this.prefHozEdgeSep)) {
							g += this.prefHozEdgeSep;
							i -= this.prefHozEdgeSep
						}
						var b = i - g;
						var e = b / o;
						var y = g + e / 2;
						var u = this.minEdgeJetty - this.prefVertEdgeOff;
						var d = 0;
						for (var B = 0; B < D.length; B++) {
							var w = D[B].edges.length;
							var G = mxCellPath.create(D[B].edges[0]);
							var l = this.jettyPositions[G];
							if (l == null) {
								l = [];
								this.jettyPositions[G] = l
							}
							if (B < o / 2) {
								u += this.prefVertEdgeOff
							} else {
								if (B > o / 2) {
									u -= this.prefVertEdgeOff
								}
							}
							for (var x = 0; x < w; x++) {
								l[x * 4 + A * 2] = y;
								y += e;
								l[x * 4 + A * 2 + 1] = u
							}
							d = Math.max(d, u)
						}
					}
					F = c.getNextLayerConnectedCells(q);
					n = q + 1
				}
			}
		}
	}
};
mxCoordinateAssignment.prototype.setEdgePosition = function(b) {
	var v = 0;
	if (b.temp[0] != 101207) {
		var h = b.maxRank;
		var e = b.minRank;
		if (h == e) {
			h = b.source.maxRank;
			e = b.target.minRank
		}
		var u = 0;
		var B = mxCellPath.create(b.edges[0]);
		var o = this.jettyPositions[B];
		for (var t = 0; t < b.edges.length; t++) {
			var k = b.edges[t];
			var w = [];
			if (o != null) {
				var p = b.isReversed ? 2 : 0;
				var l = b.isReversed ? this.rankTopY[e] : this.rankBottomY[h];
				var q = o[u * 4 + 1 + p];
				if (b.isReversed) {
					q = -q
				}
				l += q;
				var m = o[u * 4 + p];
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					w.push(new mxPoint(m, l))
				} else {
					w.push(new mxPoint(l, m))
				}
			}
			var n = b.x.length - 1;
			var a = -1;
			var c = -1;
			var f = b.maxRank - 1;
			if (b.isReversed) {
				n = 0;
				a = b.x.length;
				c = 1;
				f = b.minRank + 1
			}
			for (var s = n;
			(b.maxRank != b.minRank) && s != a; s += c) {
				var A = b.x[s] + v;
				var r = (this.rankTopY[f] + this.rankBottomY[f + 1]) / 2;
				var g = (this.rankTopY[f - 1] + this.rankBottomY[f]) / 2;
				if (b.isReversed) {
					var z = r;
					r = g;
					g = z
				}
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					w.push(new mxPoint(A, r));
					w.push(new mxPoint(A, g))
				} else {
					w.push(new mxPoint(r, A));
					w.push(new mxPoint(g, A))
				}
				this.limitX = Math.max(this.limitX, A);
				f += c
			}
			if (o != null) {
				var p = b.isReversed ? 2 : 0;
				var d = b.isReversed ? this.rankBottomY[h] : this.rankTopY[e];
				var q = o[u * 4 + 3 - p];
				if (b.isReversed) {
					q = -q
				}
				var l = d - q;
				var m = o[u * 4 + 2 - p];
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					w.push(new mxPoint(m, l))
				} else {
					w.push(new mxPoint(l, m))
				}
			}
			if (b.isReversed) {
				this.processReversedEdge(b, k)
			}
			this.layout.setEdgePoints(k, w);
			if (v == 0) {
				v = this.parallelEdgeSpacing
			} else {
				if (v > 0) {
					v = -v
				} else {
					v = -v + this.parallelEdgeSpacing
				}
			}
			u++
		}
		b.temp[0] = 101207
	}
};
mxCoordinateAssignment.prototype.setVertexLocation = function(b) {
	var a = b.cell;
	var d = b.x[0] - b.width / 2;
	var c = b.y[0] - b.height / 2;
	this.rankTopY[b.minRank] = Math.min(this.rankTopY[b.minRank], c);
	this.rankBottomY[b.minRank] = Math.max(this.rankBottomY[b.minRank], c + b.height);
	if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
		this.layout.setVertexLocation(a, d, c)
	} else {
		this.layout.setVertexLocation(a, c, d)
	}
	this.limitX = Math.max(this.limitX, d + b.width)
};
mxCoordinateAssignment.prototype.processReversedEdge = function(b, a) {};
function WeightedCellSorter(a, b) {
	this.cell = a;
	this.weightedValue = b
}
WeightedCellSorter.prototype.weightedValue = 0;
WeightedCellSorter.prototype.nudge = false;
WeightedCellSorter.prototype.visited = false;
WeightedCellSorter.prototype.rankIndex = null;
WeightedCellSorter.prototype.cell = null;
WeightedCellSorter.prototype.compare = function(d, c) {
	if (d != null && c != null) {
		if (c.weightedValue > d.weightedValue) {
			return - 1
		} else {
			if (c.weightedValue < d.weightedValue) {
				return 1
			} else {
				if (c.nudge) {
					return - 1
				} else {
					return 1
				}
			}
		}
	} else {
		return 0
	}
};
function mxHierarchicalLayout(c, a, b) {
	mxGraphLayout.call(this, c);
	this.orientation = (a != null) ? a: mxConstants.DIRECTION_NORTH;
	this.deterministic = (b != null) ? b: true
}
mxHierarchicalLayout.prototype = new mxGraphLayout();
mxHierarchicalLayout.prototype.constructor = mxHierarchicalLayout;
mxHierarchicalLayout.prototype.roots = null;
mxHierarchicalLayout.prototype.resizeParent = false;
mxHierarchicalLayout.prototype.moveParent = false;
mxHierarchicalLayout.prototype.parentBorder = 0;
mxHierarchicalLayout.prototype.intraCellSpacing = 30;
mxHierarchicalLayout.prototype.interRankCellSpacing = 50;
mxHierarchicalLayout.prototype.interHierarchySpacing = 60;
mxHierarchicalLayout.prototype.parallelEdgeSpacing = 10;
mxHierarchicalLayout.prototype.orientation = mxConstants.DIRECTION_NORTH;
mxHierarchicalLayout.prototype.fineTuning = true;
mxHierarchicalLayout.prototype.deterministic;
mxHierarchicalLayout.prototype.fixRoots = false;
mxHierarchicalLayout.prototype.layoutFromSinks = true;
mxHierarchicalLayout.prototype.tightenToSource = true;
mxHierarchicalLayout.prototype.disableEdgeStyle = true;
mxHierarchicalLayout.prototype.model = null;
mxHierarchicalLayout.prototype.getModel = function() {
	return this.model
};
mxHierarchicalLayout.prototype.execute = function(c, a) {
	if (a == null) {
		a = this.graph.findTreeRoots(c)
	}
	this.roots = a;
	if (this.roots != null) {
		var b = this.graph.getModel();
		b.beginUpdate();
		try {
			this.run(c);
			if (this.resizeParent && !this.graph.isCellCollapsed(c)) {
				this.graph.updateGroupBounds([c], this.parentBorder, this.moveParent)
			}
		} finally {
			b.endUpdate()
		}
	}
};
mxHierarchicalLayout.prototype.run = function(f) {
	var v = [];
	var g = null;
	var o = null;
	var z = null;
	if (this.fixRoots) {
		g = [];
		o = [];
		z = []
	}
	for (var x = 0; x < this.roots.length; x++) {
		var l = true;
		for (var w = 0; l && w < v.length; w++) {
			var B = mxCellPath.create(this.roots[x]);
			if (v[w][B] != null) {
				l = false
			}
		}
		if (l) {
			var e = [];
			e.push(this.roots[x]);
			var c = null;
			if (this.fixRoots) {
				g.push(this.roots[x]);
				var a = this.getVertexBounds(this.roots[x]).getPoint();
				o.push(a);
				c = []
			}
			var p = new Object();
			while (e.length > 0) {
				var b = e.shift();
				var D = mxCellPath.create(b);
				if (p[D] == null) {
					p[D] = b;
					if (this.fixRoots) {
						var A = this.graph.getIncomingEdges(b, f);
						for (var u = 0; u < A.length; u++) {
							c.push(A[u])
						}
					}
					var h = this.graph.getConnections(b, f);
					var d = this.graph.getOpposites(h, b);
					for (var u = 0; u < d.length; u++) {
						var m = mxCellPath.create(d[u]);
						if (p[m] == null) {
							e.push(d[u])
						}
					}
				}
			}
			v.push(p);
			if (this.fixRoots) {
				z.push(c)
			}
		}
	}
	var C = 0;
	for (var x = 0; x < v.length; x++) {
		var p = v[x];
		var A = [];
		for (var E in p) {
			A.push(p[E])
		}
		this.model = new mxGraphHierarchyModel(this, A, this.roots, f, false, this.deterministic, this.tightenToSource, this.layoutFromSinks);
		this.cycleStage(f);
		this.layeringStage();
		this.crossingStage(f);
		C = this.placementStage(C, f);
		if (this.fixRoots) {
			var t = g[x];
			var r = o[x];
			var s = this.getVertexBounds(t).getPoint();
			var q = r.x - s.x;
			var n = r.y - s.y;
			this.graph.moveCells(p, q, n);
			var y = z[x + 1];
			this.graph.moveCells(y, q, n)
		}
	}
};
mxHierarchicalLayout.prototype.cycleStage = function(b) {
	var a = new mxMinimumCycleRemover(this);
	a.execute(b)
};
mxHierarchicalLayout.prototype.layeringStage = function() {
	this.model.initialRank();
	this.model.fixRanks()
};
mxHierarchicalLayout.prototype.crossingStage = function(a) {
	var b = new mxMedianHybridCrossingReduction(this);
	b.execute(a)
};
mxHierarchicalLayout.prototype.placementStage = function(a, c) {
	var b = new mxCoordinateAssignment(this, this.intraCellSpacing, this.interRankCellSpacing, this.orientation, a, this.parallelEdgeSpacing);
	b.fineTuning = this.fineTuning;
	b.execute(c);
	return b.limitX + this.interHierarchySpacing
};
function mxGraphModel(a) {
	this.currentEdit = this.createUndoableEdit();
	if (a != null) {
		this.setRoot(a)
	} else {
		this.clear()
	}
}
mxGraphModel.prototype = new mxEventSource();
mxGraphModel.prototype.constructor = mxGraphModel;
mxGraphModel.prototype.root = null;
mxGraphModel.prototype.cells = null;
mxGraphModel.prototype.maintainEdgeParent = true;
mxGraphModel.prototype.createIds = true;
mxGraphModel.prototype.prefix = "";
mxGraphModel.prototype.postfix = "";
mxGraphModel.prototype.nextId = 0;
mxGraphModel.prototype.currentEdit = null;
mxGraphModel.prototype.updateLevel = 0;
mxGraphModel.prototype.endingUpdate = false;
mxGraphModel.prototype.clear = function() {
	this.setRoot(this.createRoot())
};
mxGraphModel.prototype.isCreateIds = function() {
	return this.createIds
};
mxGraphModel.prototype.setCreateIds = function(a) {
	this.createIds = a
};
mxGraphModel.prototype.createRoot = function() {
	var a = new mxCell();
	a.insert(new mxCell());
	return a
};
mxGraphModel.prototype.getCell = function(a) {
	return (this.cells != null) ? this.cells[a] : null
};
mxGraphModel.prototype.filterCells = function(b, d) {
	var a = null;
	if (b != null) {
		a = [];
		for (var c = 0; c < b.length; c++) {
			if (d(b[c])) {
				a.push(b[c])
			}
		}
	}
	return a
};
mxGraphModel.prototype.getDescendants = function(a) {
	return this.filterDescendants(null, a)
};
mxGraphModel.prototype.filterDescendants = function(e, d) {
	var a = [];
	d = d || this.getRoot();
	if (e == null || e(d)) {
		a.push(d)
	}
	var b = this.getChildCount(d);
	for (var c = 0; c < b; c++) {
		var f = this.getChildAt(d, c);
		a = a.concat(this.filterDescendants(e, f))
	}
	return a
};
mxGraphModel.prototype.getRoot = function(a) {
	var b = a || this.root;
	if (a != null) {
		while (a != null) {
			b = a;
			a = this.getParent(a)
		}
	}
	return b
};
mxGraphModel.prototype.setRoot = function(a) {
	this.execute(new mxRootChange(this, a));
	return a
};
mxGraphModel.prototype.rootChanged = function(a) {
	var b = this.root;
	this.root = a;
	this.nextId = 0;
	this.cells = null;
	this.cellAdded(a);
	return b
};
mxGraphModel.prototype.isRoot = function(a) {
	return a != null && this.root == a
};
mxGraphModel.prototype.isLayer = function(a) {
	return this.isRoot(this.getParent(a))
};
mxGraphModel.prototype.isAncestor = function(a, b) {
	while (b != null && b != a) {
		b = this.getParent(b)
	}
	return b == a
};
mxGraphModel.prototype.contains = function(a) {
	return this.isAncestor(this.root, a)
};
mxGraphModel.prototype.getParent = function(a) {
	return (a != null) ? a.getParent() : null
};
mxGraphModel.prototype.add = function(b, d, a) {
	if (d != b && b != null && d != null) {
		if (a == null) {
			a = this.getChildCount(b)
		}
		var c = b != this.getParent(d);
		this.execute(new mxChildChange(this, b, d, a));
		if (this.maintainEdgeParent && c) {
			this.updateEdgeParents(d)
		}
	}
	return d
};
mxGraphModel.prototype.cellAdded = function(a) {
	if (a != null) {
		if (a.getId() == null && this.createIds) {
			a.setId(this.createId(a))
		}
		if (a.getId() != null) {
			var d = this.getCell(a.getId());
			if (d != a) {
				while (d != null) {
					a.setId(this.createId(a));
					d = this.getCell(a.getId())
				}
				if (this.cells == null) {
					this.cells = new Object()
				}
				this.cells[a.getId()] = a
			}
		}
		if (mxUtils.isNumeric(a.getId())) {
			this.nextId = Math.max(this.nextId, a.getId())
		}
		var b = this.getChildCount(a);
		for (var c = 0; c < b; c++) {
			this.cellAdded(this.getChildAt(a, c))
		}
	}
};
mxGraphModel.prototype.createId = function(a) {
	var b = this.nextId;
	this.nextId++;
	return this.prefix + b + this.postfix
};
mxGraphModel.prototype.updateEdgeParents = function(a, b) {
	b = b || this.getRoot(a);
	var d = this.getChildCount(a);
	for (var e = 0; e < d; e++) {
		var h = this.getChildAt(a, e);
		this.updateEdgeParents(h, b)
	}
	var g = this.getEdgeCount(a);
	var c = [];
	for (var e = 0; e < g; e++) {
		c.push(this.getEdgeAt(a, e))
	}
	for (var e = 0; e < c.length; e++) {
		var f = c[e];
		if (this.isAncestor(b, f)) {
			this.updateEdgeParent(f, b)
		}
	}
};
mxGraphModel.prototype.updateEdgeParent = function(b, g) {
	var a = this.getTerminal(b, true);
	var d = this.getTerminal(b, false);
	var h = null;
	while (a != null && !this.isEdge(a) && a.geometry != null && a.geometry.relative) {
		a = this.getParent(a)
	}
	while (d != null && !this.isEdge(d) && d.geometry != null && d.geometry.relative) {
		d = this.getParent(d)
	}
	if (this.isAncestor(g, a) && this.isAncestor(g, d)) {
		if (a == d) {
			h = this.getParent(a)
		} else {
			h = this.getNearestCommonAncestor(a, d)
		}
		if (h != null && (this.getParent(h) != this.root || this.isAncestor(h, b)) && this.getParent(b) != h) {
			var c = this.getGeometry(b);
			if (c != null) {
				var f = this.getOrigin(this.getParent(b));
				var e = this.getOrigin(h);
				var k = e.x - f.x;
				var i = e.y - f.y;
				c = c.clone();
				c.translate( - k, -i);
				this.setGeometry(b, c)
			}
			this.add(h, b, this.getChildCount(h))
		}
	}
};
mxGraphModel.prototype.getOrigin = function(b) {
	var a = null;
	if (b != null) {
		a = this.getOrigin(this.getParent(b));
		if (!this.isEdge(b)) {
			var c = this.getGeometry(b);
			if (c != null) {
				a.x += c.x;
				a.y += c.y
			}
		}
	} else {
		a = new mxPoint()
	}
	return a
};
mxGraphModel.prototype.getNearestCommonAncestor = function(c, b) {
	if (c != null && b != null) {
		var g = mxCellPath.create(b);
		if (g != null && g.length > 0) {
			var a = c;
			var f = mxCellPath.create(a);
			if (g.length < f.length) {
				a = b;
				var d = f;
				f = g;
				g = d
			}
			while (a != null) {
				var e = this.getParent(a);
				if (g.indexOf(f + mxCellPath.PATH_SEPARATOR) == 0 && e != null) {
					return a
				}
				f = mxCellPath.getParentPath(f);
				a = e
			}
		}
	}
	return null
};
mxGraphModel.prototype.remove = function(a) {
	if (a == this.root) {
		this.setRoot(null)
	} else {
		if (this.getParent(a) != null) {
			this.execute(new mxChildChange(this, null, a))
		}
	}
	return a
};
mxGraphModel.prototype.cellRemoved = function(a) {
	if (a != null && this.cells != null) {
		var b = this.getChildCount(a);
		for (var c = b - 1; c >= 0; c--) {
			this.cellRemoved(this.getChildAt(a, c))
		}
		if (this.cells != null && a.getId() != null) {
			delete this.cells[a.getId()]
		}
	}
};
mxGraphModel.prototype.parentForCellChanged = function(a, c, b) {
	var d = this.getParent(a);
	if (c != null) {
		if (c != d || d.getIndex(a) != b) {
			c.insert(a, b)
		}
	} else {
		if (d != null) {
			var e = d.getIndex(a);
			d.remove(e)
		}
	}
	if (!this.contains(d) && c != null) {
		this.cellAdded(a)
	} else {
		if (c == null) {
			this.cellRemoved(a)
		}
	}
	return d
};
mxGraphModel.prototype.getChildCount = function(a) {
	return (a != null) ? a.getChildCount() : 0
};
mxGraphModel.prototype.getChildAt = function(a, b) {
	return (a != null) ? a.getChildAt(b) : null
};
mxGraphModel.prototype.getChildren = function(a) {
	return (a != null) ? a.children: null
};
mxGraphModel.prototype.getChildVertices = function(a) {
	return this.getChildCells(a, true, false)
};
mxGraphModel.prototype.getChildEdges = function(a) {
	return this.getChildCells(a, false, true)
};
mxGraphModel.prototype.getChildCells = function(f, d, c) {
	d = (d != null) ? d: false;
	c = (c != null) ? c: false;
	var b = this.getChildCount(f);
	var a = [];
	for (var e = 0; e < b; e++) {
		var g = this.getChildAt(f, e);
		if ((!c && !d) || (c && this.isEdge(g)) || (d && this.isVertex(g))) {
			a.push(g)
		}
	}
	return a
};
mxGraphModel.prototype.getTerminal = function(b, a) {
	return (b != null) ? b.getTerminal(a) : null
};
mxGraphModel.prototype.setTerminal = function(d, c, b) {
	var a = c != this.getTerminal(d, b);
	this.execute(new mxTerminalChange(this, d, c, b));
	if (this.maintainEdgeParent && a) {
		this.updateEdgeParent(d, this.getRoot())
	}
	return c
};
mxGraphModel.prototype.setTerminals = function(a, b, c) {
	this.beginUpdate();
	try {
		this.setTerminal(a, b, true);
		this.setTerminal(a, c, false)
	} finally {
		this.endUpdate()
	}
};
mxGraphModel.prototype.terminalForCellChanged = function(d, b, a) {
	var c = this.getTerminal(d, a);
	if (b != null) {
		b.insertEdge(d, a)
	} else {
		if (c != null) {
			c.removeEdge(d, a)
		}
	}
	return c
};
mxGraphModel.prototype.getEdgeCount = function(a) {
	return (a != null) ? a.getEdgeCount() : 0
};
mxGraphModel.prototype.getEdgeAt = function(a, b) {
	return (a != null) ? a.getEdgeAt(b) : null
};
mxGraphModel.prototype.getDirectedEdgeCount = function(a, b, f) {
	var e = 0;
	var g = this.getEdgeCount(a);
	for (var c = 0; c < g; c++) {
		var d = this.getEdgeAt(a, c);
		if (d != f && this.getTerminal(d, b) == a) {
			e++
		}
	}
	return e
};
mxGraphModel.prototype.getConnections = function(a) {
	return this.getEdges(a, true, true, false)
};
mxGraphModel.prototype.getIncomingEdges = function(a) {
	return this.getEdges(a, true, false, false)
};
mxGraphModel.prototype.getOutgoingEdges = function(a) {
	return this.getEdges(a, false, true, false)
};
mxGraphModel.prototype.getEdges = function(k, e, g, d) {
	e = (e != null) ? e: true;
	g = (g != null) ? g: true;
	d = (d != null) ? d: true;
	var b = this.getEdgeCount(k);
	var l = [];
	for (var f = 0; f < b; f++) {
		var c = this.getEdgeAt(k, f);
		var a = this.getTerminal(c, true);
		var h = this.getTerminal(c, false);
		if (d || ((a != h) && ((e && h == k) || (g && a == k)))) {
			l.push(c)
		}
	}
	return l
};
mxGraphModel.prototype.getEdgesBetween = function(c, n, f) {
	f = (f != null) ? f: false;
	var h = this.getEdgeCount(c);
	var g = this.getEdgeCount(n);
	var m = c;
	var b = h;
	if (g < h) {
		b = g;
		m = n
	}
	var p = [];
	for (var k = 0; k < b; k++) {
		var e = this.getEdgeAt(m, k);
		var a = this.getTerminal(e, true);
		var d = this.getTerminal(e, false);
		var l = (a == c) && (d == n);
		var o = (d == c) && (a == n);
		if (l || (!f && o)) {
			p.push(e)
		}
	}
	return p
};
mxGraphModel.prototype.getOpposites = function(b, e, c, a) {
	c = (c != null) ? c: true;
	a = (a != null) ? a: true;
	var h = [];
	if (b != null) {
		for (var d = 0; d < b.length; d++) {
			var f = this.getTerminal(b[d], true);
			var g = this.getTerminal(b[d], false);
			if (f == e && g != null && g != e && a) {
				h.push(g)
			} else {
				if (g == e && f != null && f != e && c) {
					h.push(f)
				}
			}
		}
	}
	return h
};
mxGraphModel.prototype.getTopmostCells = function(c) {
	var e = [];
	for (var d = 0; d < c.length; d++) {
		var a = c[d];
		var b = true;
		var f = this.getParent(a);
		while (f != null) {
			if (mxUtils.indexOf(c, f) >= 0) {
				b = false;
				break
			}
			f = this.getParent(f)
		}
		if (b) {
			e.push(a)
		}
	}
	return e
};
mxGraphModel.prototype.isVertex = function(a) {
	return (a != null) ? a.isVertex() : false
};
mxGraphModel.prototype.isEdge = function(a) {
	return (a != null) ? a.isEdge() : false
};
mxGraphModel.prototype.isConnectable = function(a) {
	return (a != null) ? a.isConnectable() : false
};
mxGraphModel.prototype.getValue = function(a) {
	return (a != null) ? a.getValue() : null
};
mxGraphModel.prototype.setValue = function(a, b) {
	this.execute(new mxValueChange(this, a, b));
	return b
};
mxGraphModel.prototype.valueForCellChanged = function(a, b) {
	return a.valueChanged(b)
};
mxGraphModel.prototype.getGeometry = function(a, b) {
	return (a != null) ? a.getGeometry() : null
};
mxGraphModel.prototype.setGeometry = function(a, b) {
	if (b != this.getGeometry(a)) {
		this.execute(new mxGeometryChange(this, a, b))
	}
	return b
};
mxGraphModel.prototype.geometryForCellChanged = function(a, c) {
	var b = this.getGeometry(a);
	a.setGeometry(c);
	return b
};
mxGraphModel.prototype.getStyle = function(a) {
	return (a != null) ? a.getStyle() : null
};
mxGraphModel.prototype.setStyle = function(a, b) {
	if (b != this.getStyle(a)) {
		this.execute(new mxStyleChange(this, a, b))
	}
	return b
};
mxGraphModel.prototype.styleForCellChanged = function(a, b) {
	var c = this.getStyle(a);
	a.setStyle(b);
	return c
};
mxGraphModel.prototype.isCollapsed = function(a) {
	return (a != null) ? a.isCollapsed() : false
};
mxGraphModel.prototype.setCollapsed = function(a, b) {
	if (b != this.isCollapsed(a)) {
		this.execute(new mxCollapseChange(this, a, b))
	}
	return b
};
mxGraphModel.prototype.collapsedStateForCellChanged = function(a, c) {
	var b = this.isCollapsed(a);
	a.setCollapsed(c);
	return b
};
mxGraphModel.prototype.isVisible = function(a) {
	return (a != null) ? a.isVisible() : false
};
mxGraphModel.prototype.setVisible = function(a, b) {
	if (b != this.isVisible(a)) {
		this.execute(new mxVisibleChange(this, a, b))
	}
	return b
};
mxGraphModel.prototype.visibleStateForCellChanged = function(a, c) {
	var b = this.isVisible(a);
	a.setVisible(c);
	return b
};
mxGraphModel.prototype.execute = function(a) {
	a.execute();
	this.beginUpdate();
	this.currentEdit.add(a);
	this.fireEvent(new mxEventObject(mxEvent.EXECUTE, "change", a));
	this.endUpdate()
};
mxGraphModel.prototype.beginUpdate = function() {
	this.updateLevel++;
	this.fireEvent(new mxEventObject(mxEvent.BEGIN_UPDATE))
};
mxGraphModel.prototype.endUpdate = function() {
	this.updateLevel--;
	if (!this.endingUpdate) {
		this.endingUpdate = this.updateLevel == 0;
		this.fireEvent(new mxEventObject(mxEvent.END_UPDATE, "edit", this.currentEdit));
		try {
			if (this.endingUpdate && !this.currentEdit.isEmpty()) {
				this.fireEvent(new mxEventObject(mxEvent.BEFORE_UNDO, "edit", this.currentEdit));
				var a = this.currentEdit;
				this.currentEdit = this.createUndoableEdit();
				a.notify();
				this.fireEvent(new mxEventObject(mxEvent.UNDO, "edit", a))
			}
		} finally {
			this.endingUpdate = false
		}
	}
};
mxGraphModel.prototype.createUndoableEdit = function() {
	var a = new mxUndoableEdit(this, true);
	a.notify = function() {
		a.source.fireEvent(new mxEventObject(mxEvent.CHANGE, "edit", a, "changes", a.changes));
		a.source.fireEvent(new mxEventObject(mxEvent.NOTIFY, "edit", a, "changes", a.changes))
	};
	return a
};
mxGraphModel.prototype.mergeChildren = function(g, f, b) {
	b = (b != null) ? b: true;
	this.beginUpdate();
	try {
		var c = new Object();
		this.mergeChildrenImpl(g, f, b, c);
		for (var e in c) {
			var a = c[e];
			var d = this.getTerminal(a, true);
			if (d != null) {
				d = c[mxCellPath.create(d)];
				this.setTerminal(a, d, true)
			}
			d = this.getTerminal(a, false);
			if (d != null) {
				d = c[mxCellPath.create(d)];
				this.setTerminal(a, d, false)
			}
		}
	} finally {
		this.endUpdate()
	}
};
mxGraphModel.prototype.mergeChildrenImpl = function(h, k, d, a) {
	this.beginUpdate();
	try {
		var c = h.getChildCount();
		for (var e = 0; e < c; e++) {
			var l = h.getChildAt(e);
			if (typeof(l.getId) == "function") {
				var b = l.getId();
				var f = (b != null && (!this.isEdge(l) || !d)) ? this.getCell(b) : null;
				if (f == null) {
					var g = l.clone();
					g.setId(b);
					g.setTerminal(l.getTerminal(true), true);
					g.setTerminal(l.getTerminal(false), false);
					f = k.insert(g);
					this.cellAdded(f)
				}
				a[mxCellPath.create(l)] = f;
				this.mergeChildrenImpl(l, f, d, a)
			}
		}
	} finally {
		this.endUpdate()
	}
};
mxGraphModel.prototype.getParents = function(b) {
	var a = [];
	if (b != null) {
		var e = new Object();
		for (var c = 0; c < b.length; c++) {
			var d = this.getParent(b[c]);
			if (d != null) {
				var f = mxCellPath.create(d);
				if (e[f] == null) {
					e[f] = d;
					a.push(d)
				}
			}
		}
	}
	return a
};
mxGraphModel.prototype.cloneCell = function(a) {
	if (a != null) {
		return this.cloneCells([a], true)[0]
	}
	return null
};
mxGraphModel.prototype.cloneCells = function(c, a) {
	var b = new Object();
	var e = [];
	for (var d = 0; d < c.length; d++) {
		if (c[d] != null) {
			e.push(this.cloneCellImpl(c[d], b, a))
		} else {
			e.push(null)
		}
	}
	for (var d = 0; d < e.length; d++) {
		if (e[d] != null) {
			this.restoreClone(e[d], c[d], b)
		}
	}
	return e
};
mxGraphModel.prototype.cloneCellImpl = function(b, d, a) {
	var g = this.cellCloned(b);
	d[mxObjectIdentity.get(b)] = g;
	if (a) {
		var c = this.getChildCount(b);
		for (var e = 0; e < c; e++) {
			var f = this.cloneCellImpl(this.getChildAt(b, e), d, true);
			g.insert(f)
		}
	}
	return g
};
mxGraphModel.prototype.cellCloned = function(a) {
	return a.clone()
};
mxGraphModel.prototype.restoreClone = function(h, a, c) {
	var f = this.getTerminal(a, true);
	if (f != null) {
		var e = c[mxObjectIdentity.get(f)];
		if (e != null) {
			e.insertEdge(h, true)
		}
	}
	var g = this.getTerminal(a, false);
	if (g != null) {
		var e = c[mxObjectIdentity.get(g)];
		if (e != null) {
			e.insertEdge(h, false)
		}
	}
	var b = this.getChildCount(h);
	for (var d = 0; d < b; d++) {
		this.restoreClone(this.getChildAt(h, d), this.getChildAt(a, d), c)
	}
};
function mxRootChange(b, a) {
	this.model = b;
	this.root = a;
	this.previous = a
}
mxRootChange.prototype.execute = function() {
	this.root = this.previous;
	this.previous = this.model.rootChanged(this.previous)
};
function mxChildChange(b, c, d, a) {
	this.model = b;
	this.parent = c;
	this.previous = c;
	this.child = d;
	this.index = a;
	this.previousIndex = a
}
mxChildChange.prototype.execute = function() {
	var a = this.model.getParent(this.child);
	var b = (a != null) ? a.getIndex(this.child) : 0;
	if (this.previous == null) {
		this.connect(this.child, false)
	}
	a = this.model.parentForCellChanged(this.child, this.previous, this.previousIndex);
	if (this.previous != null) {
		this.connect(this.child, true)
	}
	this.parent = this.previous;
	this.previous = a;
	this.index = this.previousIndex;
	this.previousIndex = b
};
mxChildChange.prototype.connect = function(a, d) {
	d = (d != null) ? d: true;
	var e = a.getTerminal(true);
	var f = a.getTerminal(false);
	if (e != null) {
		if (d) {
			this.model.terminalForCellChanged(a, e, true)
		} else {
			this.model.terminalForCellChanged(a, null, true)
		}
	}
	if (f != null) {
		if (d) {
			this.model.terminalForCellChanged(a, f, false)
		} else {
			this.model.terminalForCellChanged(a, null, false)
		}
	}
	a.setTerminal(e, true);
	a.setTerminal(f, false);
	var b = this.model.getChildCount(a);
	for (var c = 0; c < b; c++) {
		this.connect(this.model.getChildAt(a, c), d)
	}
};
function mxTerminalChange(b, a, c, d) {
	this.model = b;
	this.cell = a;
	this.terminal = c;
	this.previous = c;
	this.source = d
}
mxTerminalChange.prototype.execute = function() {
	this.terminal = this.previous;
	this.previous = this.model.terminalForCellChanged(this.cell, this.previous, this.source)
};
function mxValueChange(b, a, c) {
	this.model = b;
	this.cell = a;
	this.value = c;
	this.previous = c
}
mxValueChange.prototype.execute = function() {
	this.value = this.previous;
	this.previous = this.model.valueForCellChanged(this.cell, this.previous)
};
function mxStyleChange(b, a, c) {
	this.model = b;
	this.cell = a;
	this.style = c;
	this.previous = c
}
mxStyleChange.prototype.execute = function() {
	this.style = this.previous;
	this.previous = this.model.styleForCellChanged(this.cell, this.previous)
};
function mxGeometryChange(b, a, c) {
	this.model = b;
	this.cell = a;
	this.geometry = c;
	this.previous = c
}
mxGeometryChange.prototype.execute = function() {
	this.geometry = this.previous;
	this.previous = this.model.geometryForCellChanged(this.cell, this.previous)
};
function mxCollapseChange(b, a, c) {
	this.model = b;
	this.cell = a;
	this.collapsed = c;
	this.previous = c
}
mxCollapseChange.prototype.execute = function() {
	this.collapsed = this.previous;
	this.previous = this.model.collapsedStateForCellChanged(this.cell, this.previous)
};
function mxVisibleChange(b, a, c) {
	this.model = b;
	this.cell = a;
	this.visible = c;
	this.previous = c
}
mxVisibleChange.prototype.execute = function() {
	this.visible = this.previous;
	this.previous = this.model.visibleStateForCellChanged(this.cell, this.previous)
};
function mxCellAttributeChange(a, b, c) {
	this.cell = a;
	this.attribute = b;
	this.value = c;
	this.previous = c
}
mxCellAttributeChange.prototype.execute = function() {
	var a = this.cell.getAttribute(this.attribute);
	if (this.previous == null) {
		this.cell.value.removeAttribute(this.attribute)
	} else {
		this.cell.setAttribute(this.attribute, this.previous)
	}
	this.previous = a
};
function mxCell(b, c, a) {
	this.value = b;
	this.setGeometry(c);
	this.setStyle(a);
	if (this.onInit != null) {
		this.onInit()
	}
}
mxCell.prototype.id = null;
mxCell.prototype.value = null;
mxCell.prototype.geometry = null;
mxCell.prototype.style = null;
mxCell.prototype.vertex = false;
mxCell.prototype.edge = false;
mxCell.prototype.connectable = true;
mxCell.prototype.visible = true;
mxCell.prototype.collapsed = false;
mxCell.prototype.parent = null;
mxCell.prototype.source = null;
mxCell.prototype.target = null;
mxCell.prototype.children = null;
mxCell.prototype.edges = null;
mxCell.prototype.mxTransient = ["id", "value", "parent", "source", "target", "children", "edges"];
mxCell.prototype.getId = function() {
	return this.id
};
mxCell.prototype.setId = function(a) {
	this.id = a
};
mxCell.prototype.getValue = function() {
	return this.value
};
mxCell.prototype.setValue = function(a) {
	this.value = a
};
mxCell.prototype.valueChanged = function(b) {
	var a = this.getValue();
	this.setValue(b);
	return a
};
mxCell.prototype.getGeometry = function() {
	return this.geometry
};
mxCell.prototype.setGeometry = function(a) {
	this.geometry = a
};
mxCell.prototype.getStyle = function() {
	return this.style
};
mxCell.prototype.setStyle = function(a) {
	this.style = a
};
mxCell.prototype.isVertex = function() {
	return this.vertex
};
mxCell.prototype.setVertex = function(a) {
	this.vertex = a
};
mxCell.prototype.isEdge = function() {
	return this.edge
};
mxCell.prototype.setEdge = function(a) {
	this.edge = a
};
mxCell.prototype.isConnectable = function() {
	return this.connectable
};
mxCell.prototype.setConnectable = function(a) {
	this.connectable = a
};
mxCell.prototype.isVisible = function() {
	return this.visible
};
mxCell.prototype.setVisible = function(a) {
	this.visible = a
};
mxCell.prototype.isCollapsed = function() {
	return this.collapsed
};
mxCell.prototype.setCollapsed = function(a) {
	this.collapsed = a
};
mxCell.prototype.getParent = function() {
	return this.parent
};
mxCell.prototype.setParent = function(a) {
	this.parent = a
};
mxCell.prototype.getTerminal = function(a) {
	return (a) ? this.source: this.target
};
mxCell.prototype.setTerminal = function(b, a) {
	if (a) {
		this.source = b
	} else {
		this.target = b
	}
	return b
};
mxCell.prototype.getChildCount = function() {
	return (this.children == null) ? 0 : this.children.length
};
mxCell.prototype.getIndex = function(a) {
	return mxUtils.indexOf(this.children, a)
};
mxCell.prototype.getChildAt = function(a) {
	return (this.children == null) ? null: this.children[a]
};
mxCell.prototype.insert = function(b, a) {
	if (b != null) {
		if (a == null) {
			a = this.getChildCount();
			if (b.getParent() == this) {
				a--
			}
		}
		b.removeFromParent();
		b.setParent(this);
		if (this.children == null) {
			this.children = [];
			this.children.push(b)
		} else {
			this.children.splice(a, 0, b)
		}
	}
	return b
};
mxCell.prototype.remove = function(a) {
	var b = null;
	if (this.children != null && a >= 0) {
		b = this.getChildAt(a);
		if (b != null) {
			this.children.splice(a, 1);
			b.setParent(null)
		}
	}
	return b
};
mxCell.prototype.removeFromParent = function() {
	if (this.parent != null) {
		var a = this.parent.getIndex(this);
		this.parent.remove(a)
	}
};
mxCell.prototype.getEdgeCount = function() {
	return (this.edges == null) ? 0 : this.edges.length
};
mxCell.prototype.getEdgeIndex = function(a) {
	return mxUtils.indexOf(this.edges, a)
};
mxCell.prototype.getEdgeAt = function(a) {
	return (this.edges == null) ? null: this.edges[a]
};
mxCell.prototype.insertEdge = function(a, b) {
	if (a != null) {
		a.removeFromTerminal(b);
		a.setTerminal(this, b);
		if (this.edges == null || a.getTerminal(!b) != this || mxUtils.indexOf(this.edges, a) < 0) {
			if (this.edges == null) {
				this.edges = []
			}
			this.edges.push(a)
		}
	}
	return a
};
mxCell.prototype.removeEdge = function(b, c) {
	if (b != null) {
		if (b.getTerminal(!c) != this && this.edges != null) {
			var a = this.getEdgeIndex(b);
			if (a >= 0) {
				this.edges.splice(a, 1)
			}
		}
		b.setTerminal(null, c)
	}
	return b
};
mxCell.prototype.removeFromTerminal = function(b) {
	var a = this.getTerminal(b);
	if (a != null) {
		a.removeEdge(this, b)
	}
};
mxCell.prototype.getAttribute = function(b, a) {
	var c = this.getValue();
	var d = (c != null && c.nodeType == mxConstants.NODETYPE_ELEMENT) ? c.getAttribute(b) : null;
	return d || a
};
mxCell.prototype.setAttribute = function(a, c) {
	var b = this.getValue();
	if (b != null && b.nodeType == mxConstants.NODETYPE_ELEMENT) {
		b.setAttribute(a, c)
	}
};
mxCell.prototype.clone = function() {
	var a = mxUtils.clone(this, this.mxTransient);
	a.setValue(this.cloneValue());
	return a
};
mxCell.prototype.cloneValue = function() {
	var a = this.getValue();
	if (a != null) {
		if (typeof(a.clone) == "function") {
			a = a.clone()
		} else {
			if (!isNaN(a.nodeType)) {
				a = a.cloneNode(true)
			}
		}
	}
	return a
};
function mxGeometry(b, d, c, a) {
	mxRectangle.call(this, b, d, c, a)
}
mxGeometry.prototype = new mxRectangle();
mxGeometry.prototype.constructor = mxGeometry;
mxGeometry.prototype.TRANSLATE_CONTROL_POINTS = true;
mxGeometry.prototype.alternateBounds = null;
mxGeometry.prototype.sourcePoint = null;
mxGeometry.prototype.targetPoint = null;
mxGeometry.prototype.points = null;
mxGeometry.prototype.offset = null;
mxGeometry.prototype.relative = false;
mxGeometry.prototype.swap = function() {
	if (this.alternateBounds != null) {
		var a = new mxRectangle(this.x, this.y, this.width, this.height);
		this.x = this.alternateBounds.x;
		this.y = this.alternateBounds.y;
		this.width = this.alternateBounds.width;
		this.height = this.alternateBounds.height;
		this.alternateBounds = a
	}
};
mxGeometry.prototype.getTerminalPoint = function(a) {
	return (a) ? this.sourcePoint: this.targetPoint
};
mxGeometry.prototype.setTerminalPoint = function(a, b) {
	if (b) {
		this.sourcePoint = a
	} else {
		this.targetPoint = a
	}
	return a
};
mxGeometry.prototype.translate = function(b, a) {
	var f = this.clone();
	if (!this.relative) {
		this.x += b;
		this.y += a
	}
	if (this.sourcePoint != null) {
		this.sourcePoint.x += b;
		this.sourcePoint.y += a
	}
	if (this.targetPoint != null) {
		this.targetPoint.x += b;
		this.targetPoint.y += a
	}
	if (this.TRANSLATE_CONTROL_POINTS && this.points != null) {
		var d = this.points.length;
		for (var c = 0; c < d; c++) {
			var e = this.points[c];
			if (e != null) {
				e.x += b;
				e.y += a
			}
		}
	}
};
var mxCellPath = {
	PATH_SEPARATOR: ".",
	create: function(b) {
		var a = "";
		if (b != null) {
			var d = b.getParent();
			while (d != null) {
				var c = d.getIndex(b);
				a = c + mxCellPath.PATH_SEPARATOR + a;
				b = d;
				d = b.getParent()
			}
		}
		var e = a.length;
		if (e > 1) {
			a = a.substring(0, e - 1)
		}
		return a
	},
	getParentPath: function(b) {
		if (b != null) {
			var a = b.lastIndexOf(mxCellPath.PATH_SEPARATOR);
			if (a >= 0) {
				return b.substring(0, a)
			} else {
				if (b.length > 0) {
					return ""
				}
			}
		}
		return null
	},
	resolve: function(a, e) {
		var c = a;
		if (e != null) {
			var d = e.split(mxCellPath.PATH_SEPARATOR);
			for (var b = 0; b < d.length; b++) {
				c = c.getChildAt(parseInt(d[b]))
			}
		}
		return c
	},
	compare: function(g, f) {
		var c = Math.min(g.length, f.length);
		var a = 0;
		for (var b = 0; b < c; b++) {
			if (g[b] != f[b]) {
				if (g[b].length == 0 || f[b].length == 0) {
					a = (g[b] == f[b]) ? 0 : ((g[b] > f[b]) ? 1 : -1)
				} else {
					var e = parseInt(g[b]);
					var d = parseInt(f[b]);
					a = (e == d) ? 0 : ((e > d) ? 1 : -1)
				}
				break
			}
		}
		if (a == 0) {
			var e = g.length;
			var d = f.length;
			if (e != d) {
				a = (e > d) ? 1 : -1
			}
		}
		return a
	}
};
var mxPerimeter = {
	RectanglePerimeter: function(a, i, h, c) {
		var f = a.getCenterX();
		var d = a.getCenterY();
		var o = h.x - f;
		var n = h.y - d;
		var e = Math.atan2(n, o);
		var b = new mxPoint(0, 0);
		var g = Math.PI;
		var k = Math.PI / 2;
		var l = k - e;
		var m = Math.atan2(a.height, a.width);
		if (e < -g + m || e > g - m) {
			b.x = a.x;
			b.y = d - a.width * Math.tan(e) / 2
		} else {
			if (e < -m) {
				b.y = a.y;
				b.x = f - a.height * Math.tan(l) / 2
			} else {
				if (e < m) {
					b.x = a.x + a.width;
					b.y = d + a.width * Math.tan(e) / 2
				} else {
					b.y = a.y + a.height;
					b.x = f + a.height * Math.tan(l) / 2
				}
			}
		}
		if (c) {
			if (h.x >= a.x && h.x <= a.x + a.width) {
				b.x = h.x
			} else {
				if (h.y >= a.y && h.y <= a.y + a.height) {
					b.y = h.y
				}
			}
			if (h.x < a.x) {
				b.x = a.x
			} else {
				if (h.x > a.x + a.width) {
					b.x = a.x + a.width
				}
			}
			if (h.y < a.y) {
				b.y = a.y
			} else {
				if (h.y > a.y + a.height) {
					b.y = a.y + a.height
				}
			}
		}
		return b
	},
	EllipsePerimeter: function(m, G, A, l) {
		var s = m.x;
		var r = m.y;
		var M = m.width / 2;
		var K = m.height / 2;
		var i = s + M;
		var c = r + K;
		var w = A.x;
		var v = A.y;
		var u = parseInt(w - i);
		var t = parseInt(v - c);
		if (u == 0 && t != 0) {
			return new mxPoint(i, c + K * t / Math.abs(t))
		} else {
			if (u == 0 && t == 0) {
				return new mxPoint(w, v)
			}
		}
		if (l) {
			if (v >= r && v <= r + m.height) {
				var L = v - c;
				var N = Math.sqrt(M * M * (1 - (L * L) / (K * K))) || 0;
				if (w <= s) {
					N = -N
				}
				return new mxPoint(i + N, v)
			}
			if (w >= s && w <= s + m.width) {
				var N = w - i;
				var L = Math.sqrt(K * K * (1 - (N * N) / (M * M))) || 0;
				if (v <= r) {
					L = -L
				}
				return new mxPoint(w, c + L)
			}
		}
		var J = t / u;
		var E = c - J * i;
		var I = M * M * J * J + K * K;
		var H = -2 * i * I;
		var F = M * M * J * J * i * i + K * K * i * i - M * M * K * K;
		var k = Math.sqrt(H * H - 4 * I * F);
		var C = ( - H + k) / (2 * I);
		var B = ( - H - k) / (2 * I);
		var o = J * C + E;
		var n = J * B + E;
		var q = Math.sqrt(Math.pow((C - w), 2) + Math.pow((o - v), 2));
		var p = Math.sqrt(Math.pow((B - w), 2) + Math.pow((n - v), 2));
		var z = 0;
		var D = 0;
		if (q < p) {
			z = C;
			D = o
		} else {
			z = B;
			D = n
		}
		return new mxPoint(z, D)
	},
	RhombusPerimeter: function(a, k, g, b) {
		var n = a.x;
		var l = a.y;
		var p = a.width;
		var i = a.height;
		var d = n + p / 2;
		var c = l + i / 2;
		var o = g.x;
		var m = g.y;
		if (d == o) {
			if (c > m) {
				return new mxPoint(d, l)
			} else {
				return new mxPoint(d, l + i)
			}
		} else {
			if (c == m) {
				if (d > o) {
					return new mxPoint(n, c)
				} else {
					return new mxPoint(n + p, c)
				}
			}
		}
		var f = d;
		var e = c;
		if (b) {
			if (o >= n && o <= n + p) {
				f = o
			} else {
				if (m >= l && m <= l + i) {
					e = m
				}
			}
		}
		if (o < d) {
			if (m < c) {
				return mxUtils.intersection(o, m, f, e, d, l, n, c)
			} else {
				return mxUtils.intersection(o, m, f, e, d, l + i, n, c)
			}
		} else {
			if (m < c) {
				return mxUtils.intersection(o, m, f, e, d, l, n + p, c)
			} else {
				return mxUtils.intersection(o, m, f, e, d, l + i, n + p, c)
			}
		}
	},
	TrianglePerimeter: function(k, A, u, f) {
		var B = (A != null) ? A.style[mxConstants.STYLE_DIRECTION] : null;
		var a = B == mxConstants.DIRECTION_NORTH || B == mxConstants.DIRECTION_SOUTH;
		var n = k.x;
		var m = k.y;
		var q = k.width;
		var z = k.height;
		var c = n + q / 2;
		var b = m + z / 2;
		var g = new mxPoint(n, m);
		var l = new mxPoint(n + q, b);
		var d = new mxPoint(n, m + z);
		if (B == mxConstants.DIRECTION_NORTH) {
			g = d;
			l = new mxPoint(c, m);
			d = new mxPoint(n + q, m + z)
		} else {
			if (B == mxConstants.DIRECTION_SOUTH) {
				l = new mxPoint(c, m + z);
				d = new mxPoint(n + q, m)
			} else {
				if (B == mxConstants.DIRECTION_WEST) {
					g = new mxPoint(n + q, m);
					l = new mxPoint(n, b);
					d = new mxPoint(n + q, m + z)
				}
			}
		}
		var r = u.x - c;
		var p = u.y - b;
		var e = (a) ? Math.atan2(r, p) : Math.atan2(p, r);
		var s = (a) ? Math.atan2(q, z) : Math.atan2(z, q);
		var i = false;
		if (B == mxConstants.DIRECTION_NORTH || B == mxConstants.DIRECTION_WEST) {
			i = e > -s && e < s
		} else {
			i = e < -Math.PI + s || e > Math.PI - s
		}
		var o = null;
		if (i) {
			if (f && ((a && u.x >= g.x && u.x <= d.x) || (!a && u.y >= g.y && u.y <= d.y))) {
				if (a) {
					o = new mxPoint(u.x, g.y)
				} else {
					o = new mxPoint(g.x, u.y)
				}
			} else {
				if (B == mxConstants.DIRECTION_NORTH) {
					o = new mxPoint(n + q / 2 + z * Math.tan(e) / 2, m + z)
				} else {
					if (B == mxConstants.DIRECTION_SOUTH) {
						o = new mxPoint(n + q / 2 - z * Math.tan(e) / 2, m)
					} else {
						if (B == mxConstants.DIRECTION_WEST) {
							o = new mxPoint(n + q, m + z / 2 + q * Math.tan(e) / 2)
						} else {
							o = new mxPoint(n, m + z / 2 - q * Math.tan(e) / 2)
						}
					}
				}
			}
		} else {
			if (f) {
				var v = new mxPoint(c, b);
				if (u.y >= m && u.y <= m + z) {
					v.x = (a) ? c: ((B == mxConstants.DIRECTION_WEST) ? n + q: n);
					v.y = u.y
				} else {
					if (u.x >= n && u.x <= n + q) {
						v.x = u.x;
						v.y = (!a) ? b: ((B == mxConstants.DIRECTION_NORTH) ? m + z: m)
					}
				}
				r = u.x - v.x;
				p = u.y - v.y;
				c = v.x;
				b = v.y
			}
			if ((a && u.x <= n + q / 2) || (!a && u.y <= m + z / 2)) {
				o = mxUtils.intersection(u.x, u.y, c, b, g.x, g.y, l.x, l.y)
			} else {
				o = mxUtils.intersection(u.x, u.y, c, b, l.x, l.y, d.x, d.y)
			}
		}
		if (o == null) {
			o = new mxPoint(c, b)
		}
		return o
	}
};
function mxPrintPreview(i, d, c, e, a, h, b, g, f) {
	this.graph = i;
	this.scale = (d != null) ? d: 1 / i.pageScale;
	this.border = (e != null) ? e: 0;
	this.pageFormat = (c != null) ? c: i.pageFormat;
	this.title = (g != null) ? g: "Printer-friendly version";
	this.x0 = (a != null) ? a: 0;
	this.y0 = (h != null) ? h: 0;
	this.borderColor = b;
	this.pageSelector = (f != null) ? f: true
}
mxPrintPreview.prototype.graph = null;
mxPrintPreview.prototype.pageFormat = null;
mxPrintPreview.prototype.scale = null;
mxPrintPreview.prototype.border = 0;
mxPrintPreview.prototype.x0 = 0;
mxPrintPreview.prototype.y0 = 0;
mxPrintPreview.prototype.autoOrigin = true;
mxPrintPreview.prototype.printOverlays = false;
mxPrintPreview.prototype.borderColor = null;
mxPrintPreview.prototype.title = null;
mxPrintPreview.prototype.pageSelector = null;
mxPrintPreview.prototype.wnd = null;
mxPrintPreview.prototype.pageCount = 0;
mxPrintPreview.prototype.getWindow = function() {
	return this.wnd
};
mxPrintPreview.prototype.open = function(p) {
	var s = this.graph.cellRenderer.initializeOverlay;
	var t = null;
	try {
		if (this.printOverlays) {
			this.graph.cellRenderer.initializeOverlay = function(i, e) {
				e.init(i.view.getDrawPane())
			}
		}
		if (this.wnd == null) {
			this.wnd = window.open();
			var D = this.wnd.document;
			D.writeln("<html>");
			D.writeln("<head>");
			this.writeHead(D, p);
			D.writeln("</head>");
			D.writeln('<body class="mxPage">');
			mxClient.link("stylesheet", mxClient.basePath + "/css/common.css", D);
			if (mxClient.IS_IE && document.documentMode != 9) {
				D.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				D.namespaces.add("o", "urn:schemas-microsoft-com:office:office");
				var v = D.createStyleSheet();
				v.cssText = "v\\:*{behavior:url(#default#VML)}o\\:*{behavior:url(#default#VML)}";
				mxClient.link("stylesheet", mxClient.basePath + "/css/explorer.css", D)
			}
			var l = this.graph.getGraphBounds().clone();
			var w = this.graph.getView().getScale();
			var b = w / this.scale;
			var d = this.graph.getView().getTranslate();
			if (!this.autoOrigin) {
				this.x0 = -d.x * this.scale;
				this.y0 = -d.y * this.scale;
				l.width += l.x;
				l.height += l.y;
				l.x = 0;
				l.y = 0;
				this.border = 0
			}
			l.width /= b;
			l.height /= b;
			var c = this.pageFormat.width - (this.border * 2);
			var f = this.pageFormat.height - (this.border * 2);
			var h = Math.max(1, Math.ceil((l.width + this.y0) / c));
			var C = Math.max(1, Math.ceil((l.height + this.x0) / f));
			this.pageCount = h * C;
			var k = mxUtils.bind(this,
			function() {
				if (this.pageSelector && (C > 1 || h > 1)) {
					var e = this.createPageSelector(C, h);
					D.body.appendChild(e);
					if (mxClient.IS_IE) {
						e.style.position = "absolute";
						var i = function() {
							e.style.top = (D.body.scrollTop + 10) + "px"
						};
						mxEvent.addListener(this.wnd, "scroll",
						function(E) {
							i()
						});
						mxEvent.addListener(this.wnd, "resize",
						function(E) {
							i()
						})
					}
				}
			});
			var q = null;
			if (mxClient.IS_IE && document.documentMode != 9) {
				q = [];
				var m = 0;
				var u = false;
				var n = mxImageShape.prototype.scheduleUpdateAspect;
				var g = mxImageShape.prototype.updateAspect;
				var a = function() {
					if (u && m == 0) {
						mxImageShape.prototype.scheduleUpdateAspect = n;
						mxImageShape.prototype.updateAspect = g;
						var e = "";
						for (var E = 0; E < q.length; E++) {
							e += q[E].outerHTML;
							q[E].parentNode.removeChild(q[E]);
							if (E < q.length - 1) {
								e += "<hr/>"
							}
						}
						D.body.innerHTML = e;
						k()
					}
				};
				mxImageShape.prototype.scheduleUpdateAspect = function() {
					m++;
					n.apply(this, arguments)
				};
				mxImageShape.prototype.updateAspect = function() {
					g.apply(this, arguments);
					m--;
					a()
				}
			}
			for (var y = 0; y < C; y++) {
				var o = y * f / this.scale - this.y0 / this.scale + (l.y - d.y * w) / w;
				for (var x = 0; x < h; x++) {
					if (this.wnd == null) {
						return null
					}
					var r = x * c / this.scale - this.x0 / this.scale + (l.x - d.x * w) / w;
					var A = y * h + x + 1;
					t = this.renderPage(this.pageFormat.width, this.pageFormat.height, -r, -o, this.scale, A);
					t.setAttribute("id", "mxPage-" + A);
					if (this.borderColor != null) {
						t.style.borderColor = this.borderColor;
						t.style.borderStyle = "solid";
						t.style.borderWidth = "1px"
					}
					t.style.background = "white";
					if (y < C - 1 || x < h - 1) {
						t.style.pageBreakAfter = "always"
					}
					if (mxClient.IS_IE) {
						D.writeln(t.outerHTML);
						if (q != null) {
							q.push(t)
						} else {
							t.parentNode.removeChild(t)
						}
					} else {
						t.parentNode.removeChild(t);
						D.body.appendChild(t)
					}
					if (y < C - 1 || x < h - 1) {
						var B = D.createElement("hr");
						B.className = "mxPageBreak";
						D.body.appendChild(B)
					}
				}
			}
			D.writeln("</body>");
			D.writeln("</html>");
			D.close();
			if (q != null) {
				u = true;
				a()
			} else {
				k()
			}
			mxEvent.release(D.body)
		}
		this.wnd.focus()
	} catch(z) {
		if (t != null && t.parentNode != null) {
			t.parentNode.removeChild(t)
		}
	} finally {
		this.graph.cellRenderer.initializeOverlay = s
	}
	return this.wnd
};
mxPrintPreview.prototype.writeHead = function(b, a) {
	if (this.title != null) {
		b.writeln("<title>" + this.title + "</title>")
	}
	b.writeln('<style type="text/css">');
	b.writeln("@media print {");
	b.writeln("  table.mxPageSelector { display: none; }");
	b.writeln("  hr.mxPageBreak { display: none; }");
	b.writeln("}");
	b.writeln("@media screen {");
	b.writeln("  table.mxPageSelector { position: fixed; right: 10px; top: 10px;font-family: Arial; font-size:10pt; border: solid 1px darkgray;background: white; border-collapse:collapse; }");
	b.writeln("  table.mxPageSelector td { border: solid 1px gray; padding:4px; }");
	b.writeln("  body.mxPage { background: gray; }");
	b.writeln("}");
	if (a != null) {
		b.writeln(a)
	}
	b.writeln("</style>")
};
mxPrintPreview.prototype.createPageSelector = function(c, b) {
	var k = this.wnd.document;
	var m = k.createElement("table");
	m.className = "mxPageSelector";
	m.setAttribute("border", "0");
	var f = k.createElement("tbody");
	for (var e = 0; e < c; e++) {
		var n = k.createElement("tr");
		for (var d = 0; d < b; d++) {
			var g = e * b + d + 1;
			var l = k.createElement("td");
			if (! (!mxClient.IS_IE && !mxClient.IS_OP) || mxClient.IS_SF || mxClient.IS_GC) {
				var h = k.createElement("a");
				h.setAttribute("href", "#mxPage-" + g);
				mxUtils.write(h, g, k);
				l.appendChild(h)
			} else {
				mxUtils.write(l, g, k)
			}
			n.appendChild(l)
		}
		f.appendChild(n)
	}
	m.appendChild(f);
	return m
};
mxPrintPreview.prototype.renderPage = function(i, s, k, g, A, y) {
	var p = document.createElement("div");
	try {
		p.style.width = i + "px";
		p.style.height = s + "px";
		p.style.overflow = "hidden";
		p.style.pageBreakInside = "avoid";
		var z = document.createElement("div");
		z.style.top = this.border + "px";
		z.style.left = this.border + "px";
		z.style.width = (i - 2 * this.border) + "px";
		z.style.height = (s - 2 * this.border) + "px";
		z.style.overflow = "hidden";
		if (this.graph.dialect == mxConstants.DIALECT_VML) {
			z.style.position = "absolute"
		}
		p.appendChild(z);
		document.body.appendChild(p);
		var o = this.graph.getView();
		var f = this.graph.container;
		this.graph.container = z;
		var a = o.getCanvas();
		var x = o.getBackgroundPane();
		var r = o.getDrawPane();
		var l = o.getOverlayPane();
		if (this.graph.dialect == mxConstants.DIALECT_SVG) {
			o.createSvg()
		} else {
			if (this.graph.dialect == mxConstants.DIALECT_VML) {
				o.createVml()
			} else {
				o.createHtml()
			}
		}
		var d = o.isEventsEnabled();
		o.setEventsEnabled(false);
		var m = this.graph.isEnabled();
		this.graph.setEnabled(false);
		var n = o.getTranslate();
		o.translate = new mxPoint(k, g);
		var u = null;
		try {
			var c = this.graph.getModel();
			var b = [c.getRoot()];
			u = new mxTemporaryCellStates(o, A, b)
		} finally {
			if (mxClient.IS_IE) {
				o.overlayPane.innerHTML = ""
			} else {
				var v = z.firstChild;
				while (v != null) {
					var q = v.nextSibling;
					if (v.nodeName.toLowerCase() != "svg" && v.style.cursor != "default") {
						v.parentNode.removeChild(v)
					}
					v = q
				}
			}
			o.overlayPane.parentNode.removeChild(o.overlayPane);
			this.graph.setEnabled(m);
			this.graph.container = f;
			o.canvas = a;
			o.backgroundPane = x;
			o.drawPane = r;
			o.overlayPane = l;
			o.translate = n;
			u.destroy();
			o.setEventsEnabled(d)
		}
	} catch(t) {
		p.parentNode.removeChild(p);
		p = null;
		throw t
	}
	return p
};
mxPrintPreview.prototype.print = function() {
	var a = this.open();
	if (a != null) {
		a.print()
	}
};
mxPrintPreview.prototype.close = function() {
	if (this.wnd != null) {
		this.wnd.close();
		this.wnd = null
	}
};
function mxStylesheet() {
	this.styles = new Object();
	this.putDefaultVertexStyle(this.createDefaultVertexStyle());
	this.putDefaultEdgeStyle(this.createDefaultEdgeStyle())
}
mxStylesheet.prototype.styles;
mxStylesheet.prototype.createDefaultVertexStyle = function() {
	var a = new Object();
	a[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
	a[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	a[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	a[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	a[mxConstants.STYLE_FILLCOLOR] = "#C3D9FF";
	a[mxConstants.STYLE_STROKECOLOR] = "#6482B9";
	a[mxConstants.STYLE_FONTCOLOR] = "#774400";
	return a
};
mxStylesheet.prototype.createDefaultEdgeStyle = function() {
	var a = new Object();
	a[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
	a[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
	a[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	a[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	a[mxConstants.STYLE_STROKECOLOR] = "#6482B9";
	a[mxConstants.STYLE_FONTCOLOR] = "#446299";
	return a
};
mxStylesheet.prototype.putDefaultVertexStyle = function(a) {
	this.putCellStyle("defaultVertex", a)
};
mxStylesheet.prototype.putDefaultEdgeStyle = function(a) {
	this.putCellStyle("defaultEdge", a)
};
mxStylesheet.prototype.getDefaultVertexStyle = function() {
	return this.styles.defaultVertex
};
mxStylesheet.prototype.getDefaultEdgeStyle = function() {
	return this.styles.defaultEdge
};
mxStylesheet.prototype.putCellStyle = function(a, b) {
	this.styles[a] = b
};
mxStylesheet.prototype.getCellStyle = function(b, l) {
	var a = l;
	if (b != null && b.length > 0) {
		var c = b.split(";");
		if (a != null && b.charAt(0) != ";") {
			a = mxUtils.clone(a)
		} else {
			a = new Object()
		}
		for (var d = 0; d < c.length; d++) {
			var e = c[d];
			var g = e.indexOf("=");
			if (g >= 0) {
				var k = e.substring(0, g);
				var h = e.substring(g + 1);
				if (h == mxConstants.NONE) {
					delete a[k]
				} else {
					if (mxUtils.isNumeric(h)) {
						a[k] = parseFloat(h)
					} else {
						a[k] = h
					}
				}
			} else {
				var f = this.styles[e];
				if (f != null) {
					for (var k in f) {
						a[k] = f[k]
					}
				}
			}
		}
	}
	return a
};
function mxCellState(b, a, c) {
	this.view = b;
	this.cell = a;
	this.style = c;
	this.origin = new mxPoint();
	this.absoluteOffset = new mxPoint()
}
mxCellState.prototype = new mxRectangle();
mxCellState.prototype.constructor = mxCellState;
mxCellState.prototype.view = null;
mxCellState.prototype.cell = null;
mxCellState.prototype.style = null;
mxCellState.prototype.invalid = true;
mxCellState.prototype.invalidOrder = false;
mxCellState.prototype.orderChanged = false;
mxCellState.prototype.origin = null;
mxCellState.prototype.absolutePoints = null;
mxCellState.prototype.absoluteOffset = null;
mxCellState.prototype.terminalDistance = 0;
mxCellState.prototype.length = 0;
mxCellState.prototype.segments = null;
mxCellState.prototype.shape = null;
mxCellState.prototype.text = null;
mxCellState.prototype.getPerimeterBounds = function(b, c) {
	b = b || 0;
	c = (c != null) ? c: new mxRectangle(this.x, this.y, this.width, this.height);
	if (this.shape != null && this.shape.stencil != null) {
		var a = this.shape.stencil.computeAspect(this, c, null);
		c.x = a.x;
		c.y = a.y;
		c.width = this.shape.stencil.w0 * a.width;
		c.height = this.shape.stencil.h0 * a.height
	}
	if (b != 0) {
		c.grow(b)
	}
	return c
};
mxCellState.prototype.setAbsoluteTerminalPoint = function(a, b) {
	if (b) {
		if (this.absolutePoints == null) {
			this.absolutePoints = []
		}
		if (this.absolutePoints.length == 0) {
			this.absolutePoints.push(a)
		} else {
			this.absolutePoints[0] = a
		}
	} else {
		if (this.absolutePoints == null) {
			this.absolutePoints = [];
			this.absolutePoints.push(null);
			this.absolutePoints.push(a)
		} else {
			if (this.absolutePoints.length == 1) {
				this.absolutePoints.push(a)
			} else {
				this.absolutePoints[this.absolutePoints.length - 1] = a
			}
		}
	}
};
mxCellState.prototype.setCursor = function(b) {
	if (b == null) {
		b = ""
	}
	if (this.shape != null) {
		var a = this.view.graph.getModel().isEdge(this.cell);
		if (!a && this.shape.innerNode != null) {
			this.shape.innerNode.style.cursor = b
		} else {
			if (!a && this.shape.label != null) {
				this.shape.label.style.cursor = b
			} else {
				this.shape.node.style.cursor = b
			}
		}
	}
	if (this.text != null) {
		this.text.node.style.cursor = b
	}
};
mxCellState.prototype.destroy = function() {
	this.view.graph.cellRenderer.destroy(this)
};
mxCellState.prototype.clone = function() {
	var b = new mxCellState(this.view, this.cell, this.style);
	if (this.absolutePoints != null) {
		b.absolutePoints = [];
		for (var a = 0; a < this.absolutePoints.length; a++) {
			b.absolutePoints[a] = this.absolutePoints[a].clone()
		}
	}
	if (this.origin != null) {
		b.origin = this.origin.clone()
	}
	if (this.absoluteOffset != null) {
		b.absoluteOffset = this.absoluteOffset.clone()
	}
	if (this.boundingBox != null) {
		b.boundingBox = this.boundingBox.clone()
	}
	b.terminalDistance = this.terminalDistance;
	b.segments = this.segments;
	b.length = this.length;
	b.x = this.x;
	b.y = this.y;
	b.width = this.width;
	b.height = this.height;
	return b
};
function mxGraphSelectionModel(a) {
	this.graph = a;
	this.cells = []
}
mxGraphSelectionModel.prototype = new mxEventSource();
mxGraphSelectionModel.prototype.constructor = mxGraphSelectionModel;
mxGraphSelectionModel.prototype.doneResource = (mxClient.language != "none") ? "done": "";
mxGraphSelectionModel.prototype.updatingSelectionResource = (mxClient.language != "none") ? "updatingSelection": "";
mxGraphSelectionModel.prototype.graph = null;
mxGraphSelectionModel.prototype.singleSelection = false;
mxGraphSelectionModel.prototype.isSingleSelection = function() {
	return this.singleSelection
};
mxGraphSelectionModel.prototype.setSingleSelection = function(a) {
	this.singleSelection = a
};
mxGraphSelectionModel.prototype.isSelected = function(a) {
	if (a != null) {
		return mxUtils.indexOf(this.cells, a) >= 0
	}
	return false
};
mxGraphSelectionModel.prototype.isEmpty = function() {
	return this.cells.length == 0
};
mxGraphSelectionModel.prototype.clear = function() {
	this.changeSelection(null, this.cells)
};
mxGraphSelectionModel.prototype.setCell = function(a) {
	if (a != null) {
		this.setCells([a])
	}
};
mxGraphSelectionModel.prototype.setCells = function(a) {
	if (a != null) {
		if (this.singleSelection) {
			a = [this.getFirstSelectableCell(a)]
		}
		var c = [];
		for (var b = 0; b < a.length; b++) {
			if (this.graph.isCellSelectable(a[b])) {
				c.push(a[b])
			}
		}
		this.changeSelection(c, this.cells)
	}
};
mxGraphSelectionModel.prototype.getFirstSelectableCell = function(a) {
	if (a != null) {
		for (var b = 0; b < a.length; b++) {
			if (this.graph.isCellSelectable(a[b])) {
				return a[b]
			}
		}
	}
	return null
};
mxGraphSelectionModel.prototype.addCell = function(a) {
	if (a != null) {
		this.addCells([a])
	}
};
mxGraphSelectionModel.prototype.addCells = function(b) {
	if (b != null) {
		var a = null;
		if (this.singleSelection) {
			a = this.cells;
			b = [this.getFirstSelectableCell(b)]
		}
		var d = [];
		for (var c = 0; c < b.length; c++) {
			if (!this.isSelected(b[c]) && this.graph.isCellSelectable(b[c])) {
				d.push(b[c])
			}
		}
		this.changeSelection(d, a)
	}
};
mxGraphSelectionModel.prototype.removeCell = function(a) {
	if (a != null) {
		this.removeCells([a])
	}
};
mxGraphSelectionModel.prototype.removeCells = function(a) {
	if (a != null) {
		var c = [];
		for (var b = 0; b < a.length; b++) {
			if (this.isSelected(a[b])) {
				c.push(a[b])
			}
		}
		this.changeSelection(null, c)
	}
};
mxGraphSelectionModel.prototype.changeSelection = function(a, c) {
	if ((a != null && a.length > 0 && a[0] != null) || (c != null && c.length > 0 && c[0] != null)) {
		var d = new mxSelectionChange(this, a, c);
		d.execute();
		var b = new mxUndoableEdit(this, false);
		b.add(d);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, "edit", b))
	}
};
mxGraphSelectionModel.prototype.cellAdded = function(a) {
	if (a != null && !this.isSelected(a)) {
		this.cells.push(a)
	}
};
mxGraphSelectionModel.prototype.cellRemoved = function(a) {
	if (a != null) {
		var b = mxUtils.indexOf(this.cells, a);
		if (b >= 0) {
			this.cells.splice(b, 1)
		}
	}
};
function mxSelectionChange(a, b, c) {
	this.selectionModel = a;
	this.added = (b != null) ? b.slice() : null;
	this.removed = (c != null) ? c.slice() : null
}
mxSelectionChange.prototype.execute = function() {
	var c = mxLog.enter("mxSelectionChange.execute");
	window.status = mxResources.get(this.selectionModel.updatingSelectionResource) || this.selectionModel.updatingSelectionResource;
	if (this.removed != null) {
		for (var b = 0; b < this.removed.length; b++) {
			this.selectionModel.cellRemoved(this.removed[b])
		}
	}
	if (this.added != null) {
		for (var b = 0; b < this.added.length; b++) {
			this.selectionModel.cellAdded(this.added[b])
		}
	}
	var a = this.added;
	this.added = this.removed;
	this.removed = a;
	window.status = mxResources.get(this.selectionModel.doneResource) || this.selectionModel.doneResource;
	mxLog.leave("mxSelectionChange.execute", c);
	this.selectionModel.fireEvent(new mxEventObject(mxEvent.CHANGE, "added", this.added, "removed", this.removed))
};
function mxCellEditor(a) {
	this.graph = a
}
mxCellEditor.prototype.graph = null;
mxCellEditor.prototype.textarea = null;
mxCellEditor.prototype.editingCell = null;
mxCellEditor.prototype.trigger = null;
mxCellEditor.prototype.modified = false;
mxCellEditor.prototype.emptyLabelText = "";
mxCellEditor.prototype.textNode = "";
mxCellEditor.prototype.init = function() {
	this.textarea = document.createElement("textarea");
	this.textarea.className = "mxCellEditor";
	this.textarea.style.position = "absolute";
	this.textarea.style.overflow = "visible";
	this.textarea.setAttribute("cols", "20");
	this.textarea.setAttribute("rows", "4");
	if (mxClient.IS_GC) {
		this.textarea.style.resize = "none"
	}
	mxEvent.addListener(this.textarea, "blur", mxUtils.bind(this,
	function(a) {
		this.stopEditing(!this.graph.isInvokesStopCellEditing())
	}));
	mxEvent.addListener(this.textarea, "keydown", mxUtils.bind(this,
	function(a) {
		if (!mxEvent.isConsumed(a)) {
			if (a.keyCode == 113 || (this.graph.isEnterStopsCellEditing() && a.keyCode == 13 && !mxEvent.isControlDown(a) && !mxEvent.isShiftDown(a))) {
				this.graph.stopEditing(false);
				mxEvent.consume(a)
			} else {
				if (a.keyCode == 27) {
					this.graph.stopEditing(true);
					mxEvent.consume(a)
				} else {
					if (this.clearOnChange) {
						this.clearOnChange = false;
						this.textarea.value = ""
					}
					this.setModified(true)
				}
			}
		}
	}))
};
mxCellEditor.prototype.isModified = function() {
	return this.modified
};
mxCellEditor.prototype.setModified = function(a) {
	this.modified = a
};
mxCellEditor.prototype.startEditing = function(k, c) {
	if (this.textarea == null) {
		this.init()
	}
	this.stopEditing(true);
	var b = this.graph.getView().getState(k);
	if (b != null) {
		this.editingCell = k;
		this.trigger = c;
		this.textNode = null;
		if (b.text != null && this.isHideLabel(b)) {
			this.textNode = b.text.node;
			this.textNode.style.visibility = "hidden"
		}
		var d = this.graph.getView().scale;
		var l = mxUtils.getValue(b.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE) * d;
		var f = mxUtils.getValue(b.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
		var e = mxUtils.getValue(b.style, mxConstants.STYLE_FONTCOLOR, "black");
		var g = (this.graph.model.isEdge(b.cell)) ? mxConstants.ALIGN_LEFT: mxUtils.getValue(b.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
		var h = (mxUtils.getValue(b.style, mxConstants.STYLE_FONTSTYLE, 0) & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
		this.textarea.style.fontSize = l;
		this.textarea.style.fontFamily = f;
		this.textarea.style.textAlign = g;
		this.textarea.style.color = e;
		this.textarea.style.fontWeight = (h) ? "bold": "normal";
		var a = this.getEditorBounds(b);
		this.textarea.style.left = a.x + "px";
		this.textarea.style.top = a.y + "px";
		this.textarea.style.width = a.width + "px";
		this.textarea.style.height = a.height + "px";
		this.textarea.style.zIndex = 5;
		var i = this.getInitialValue(b, c);
		if (i == null || i.length == 0) {
			i = this.getEmptyLabelText();
			this.clearOnChange = true
		} else {
			this.clearOnChange = false
		}
		this.setModified(false);
		this.textarea.value = i;
		this.graph.container.appendChild(this.textarea);
		this.textarea.focus();
		this.textarea.select()
	}
};
mxCellEditor.prototype.stopEditing = function(a) {
	a = a || false;
	if (this.editingCell != null) {
		if (this.textNode != null) {
			this.textNode.style.visibility = "visible";
			this.textNode = null
		}
		if (!a && this.isModified()) {
			this.graph.labelChanged(this.editingCell, this.getCurrentValue(), this.trigger)
		}
		this.editingCell = null;
		this.trigger = null;
		this.textarea.blur();
		this.textarea.parentNode.removeChild(this.textarea)
	}
};
mxCellEditor.prototype.getInitialValue = function(b, a) {
	return this.graph.getEditingValue(b.cell, a)
};
mxCellEditor.prototype.getCurrentValue = function() {
	return this.textarea.value.replace(/\r/g, "")
};
mxCellEditor.prototype.isHideLabel = function(a) {
	return true
};
mxCellEditor.prototype.getEditorBounds = function(b) {
	var l = this.graph.getModel().isEdge(b.cell);
	var f = this.graph.getView().scale;
	var m = (b.text == null) ? 30 : b.text.size * f + 20;
	var c = (this.textarea.style.textAlign == "left") ? 120 : 40;
	var k = parseInt(b.style[mxConstants.STYLE_SPACING] || 2) * f;
	var i = (parseInt(b.style[mxConstants.STYLE_SPACING_TOP] || 0)) * f + k;
	var g = (parseInt(b.style[mxConstants.STYLE_SPACING_RIGHT] || 0)) * f + k;
	var d = (parseInt(b.style[mxConstants.STYLE_SPACING_BOTTOM] || 0)) * f + k;
	var h = (parseInt(b.style[mxConstants.STYLE_SPACING_LEFT] || 0)) * f + k;
	var n = new mxRectangle(b.x, b.y, Math.max(c, b.width - h - g), Math.max(m, b.height - i - d));
	if (l) {
		n.x = b.absoluteOffset.x;
		n.y = b.absoluteOffset.y;
		if (b.text != null && b.text.boundingBox != null) {
			if (b.text.boundingBox.x > 0) {
				n.x = b.text.boundingBox.x
			}
			if (b.text.boundingBox.y > 0) {
				n.y = b.text.boundingBox.y
			}
		}
	} else {
		if (b.text != null && b.text.boundingBox != null) {
			n.x = Math.min(n.x, b.text.boundingBox.x);
			n.y = Math.min(n.y, b.text.boundingBox.y)
		}
	}
	n.x += h;
	n.y += i;
	if (b.text != null && b.text.boundingBox != null) {
		if (!l) {
			n.width = Math.max(n.width, b.text.boundingBox.width);
			n.height = Math.max(n.height, b.text.boundingBox.height)
		} else {
			n.width = Math.max(c, b.text.boundingBox.width);
			n.height = Math.max(m, b.text.boundingBox.height)
		}
	}
	if (this.graph.getModel().isVertex(b.cell)) {
		var a = mxUtils.getValue(b.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
		if (a == mxConstants.ALIGN_LEFT) {
			n.x -= b.width
		} else {
			if (a == mxConstants.ALIGN_RIGHT) {
				n.x += b.width
			}
		}
		var e = mxUtils.getValue(b.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
		if (e == mxConstants.ALIGN_TOP) {
			n.y -= b.height
		} else {
			if (e == mxConstants.ALIGN_BOTTOM) {
				n.y += b.height
			}
		}
	}
	return n
};
mxCellEditor.prototype.getEmptyLabelText = function(a) {
	return this.emptyLabelText
};
mxCellEditor.prototype.getEditingCell = function() {
	return this.editingCell
};
mxCellEditor.prototype.destroy = function() {
	if (this.textarea != null) {
		mxEvent.release(this.textarea);
		if (this.textarea.parentNode != null) {
			this.textarea.parentNode.removeChild(this.textarea)
		}
		this.textarea = null
	}
};
function mxCellRenderer() {
	this.shapes = mxUtils.clone(this.defaultShapes)
}
mxCellRenderer.prototype.shapes = null;
mxCellRenderer.prototype.defaultEdgeShape = mxConnector;
mxCellRenderer.prototype.defaultVertexShape = mxRectangleShape;
mxCellRenderer.prototype.defaultShapes = new Object();
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ARROW] = mxArrow;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_RECTANGLE] = mxRectangleShape;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ELLIPSE] = mxEllipse;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_DOUBLE_ELLIPSE] = mxDoubleEllipse;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_RHOMBUS] = mxRhombus;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_IMAGE] = mxImageShape;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_LINE] = mxLine;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_LABEL] = mxLabel;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CYLINDER] = mxCylinder;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_SWIMLANE] = mxSwimlane;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CONNECTOR] = mxConnector;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ACTOR] = mxActor;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CLOUD] = mxCloud;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_TRIANGLE] = mxTriangle;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_HEXAGON] = mxHexagon;
mxCellRenderer.prototype.registerShape = function(b, a) {
	this.shapes[b] = a
};
mxCellRenderer.prototype.initialize = function(b) {
	var a = b.view.graph.getModel();
	if (b.view.graph.container != null && b.shape == null && b.cell != b.view.currentRoot && (a.isVertex(b.cell) || a.isEdge(b.cell))) {
		this.createShape(b);
		if (b.shape != null) {
			this.initializeShape(b);
			if (b.view.graph.ordered || a.isEdge(b.cell)) {
				b.invalidOrder = true
			} else {
				if (b.view.graph.keepEdgesInForeground && this.firstEdge != null) {
					if (this.firstEdge.parentNode == b.shape.node.parentNode) {
						this.insertState(b, this.firstEdge)
					} else {
						this.firstEdge = null
					}
				}
			}
			b.shape.scale = b.view.scale;
			this.createCellOverlays(b);
			this.installListeners(b)
		}
	}
};
mxCellRenderer.prototype.initializeShape = function(a) {
	a.shape.init(a.view.getDrawPane())
};
mxCellRenderer.prototype.getPreviousStateInContainer = function(e, b) {
	var a = null;
	var d = e.view.graph;
	var c = d.getModel();
	var g = e.cell;
	var f = c.getParent(g);
	while (f != null && a == null) {
		a = this.findPreviousStateInContainer(d, f, g, b);
		g = f;
		f = c.getParent(g)
	}
	return a
};
mxCellRenderer.prototype.findPreviousStateInContainer = function(h, g, f, a) {
	var k = null;
	var e = h.getModel();
	if (f != null) {
		var b = g.getIndex(f);
		for (var d = b - 1; d >= 0 && k == null; d--) {
			k = this.findPreviousStateInContainer(h, e.getChildAt(g, d), null, a)
		}
	} else {
		var c = e.getChildCount(g);
		for (var d = c - 1; d >= 0 && k == null; d--) {
			k = this.findPreviousStateInContainer(h, e.getChildAt(g, d), null, a)
		}
	}
	if (k == null) {
		k = h.view.getState(g);
		if (k != null && (k.shape == null || k.shape.node == null || k.shape.node.parentNode != a)) {
			k = null
		}
	}
	return k
};
mxCellRenderer.prototype.order = function(d) {
	var b = d.shape.node.parentNode;
	var c = this.getPreviousStateInContainer(d, b);
	var a = b.firstChild;
	if (c != null) {
		a = c.shape.node;
		if (c.text != null && c.text.node != null && c.text.node.parentNode == b) {
			a = c.text.node
		}
		a = a.nextSibling
	}
	this.insertState(d, a)
};
mxCellRenderer.prototype.orderEdge = function(g) {
	var b = g.view;
	var c = b.graph.getModel();
	if (b.graph.keepEdgesInForeground) {
		if (this.firstEdge == null || this.firstEdge.parentNode == null || this.firstEdge.parentNode != g.shape.node.parentNode) {
			this.firstEdge = g.shape.node
		}
	} else {
		if (b.graph.keepEdgesInBackground) {
			var e = g.shape.node;
			var d = e.parentNode;
			var a = c.getParent(g.cell);
			var f = b.getState(a);
			if (f != null && f.shape != null && f.shape.node != null) {
				var h = f.shape.node.nextSibling;
				if (h != null && h != e) {
					this.insertState(g, h)
				}
			} else {
				var h = d.firstChild;
				if (h != null && h != e) {
					this.insertState(g, h)
				}
			}
		}
	}
};
mxCellRenderer.prototype.insertState = function(b, a) {
	b.shape.node.parentNode.insertBefore(b.shape.node, a);
	if (b.text != null && b.text.node != null && b.text.node.parentNode == b.shape.node.parentNode) {
		b.shape.node.parentNode.insertBefore(b.text.node, b.shape.node.nextSibling)
	}
};
mxCellRenderer.prototype.createShape = function(d) {
	if (d.style != null) {
		var a = d.style[mxConstants.STYLE_SHAPE];
		var c = mxStencilRegistry.getStencil(a);
		if (c != null) {
			d.shape = new mxStencilShape(c)
		} else {
			var b = this.getShapeConstructor(d);
			d.shape = new b()
		}
		d.shape.points = d.absolutePoints;
		d.shape.bounds = new mxRectangle(d.x, d.y, d.width, d.height);
		d.shape.dialect = d.view.graph.dialect;
		this.configureShape(d)
	}
};
mxCellRenderer.prototype.getShapeConstructor = function(c) {
	var a = c.style[mxConstants.STYLE_SHAPE];
	var b = (a != null) ? this.shapes[a] : null;
	if (b == null) {
		b = (c.view.graph.getModel().isEdge(c.cell)) ? this.defaultEdgeShape: this.defaultVertexShape
	}
	return b
};
mxCellRenderer.prototype.configureShape = function(d) {
	d.shape.apply(d);
	var e = d.view.graph.getImage(d);
	if (e != null) {
		d.shape.image = e
	}
	var a = d.view.graph.getIndicatorColor(d);
	var b = d.view.graph.getIndicatorShape(d);
	var c = (b != null) ? this.shapes[b] : null;
	if (a != null) {
		d.shape.indicatorShape = c;
		d.shape.indicatorColor = a;
		d.shape.indicatorGradientColor = d.view.graph.getIndicatorGradientColor(d);
		d.shape.indicatorDirection = d.style[mxConstants.STYLE_INDICATOR_DIRECTION]
	} else {
		var a = d.view.graph.getIndicatorImage(d);
		if (a != null) {
			d.shape.indicatorImage = a
		}
	}
	this.postConfigureShape(d)
};
mxCellRenderer.prototype.postConfigureShape = function(a) {
	if (a.shape != null) {
		this.resolveColor(a, "indicatorColor", mxConstants.STYLE_FILLCOLOR);
		this.resolveColor(a, "indicatorGradientColor", mxConstants.STYLE_GRADIENTCOLOR);
		this.resolveColor(a, "fill", mxConstants.STYLE_FILLCOLOR);
		this.resolveColor(a, "stroke", mxConstants.STYLE_STROKECOLOR);
		this.resolveColor(a, "gradient", mxConstants.STYLE_GRADIENTCOLOR)
	}
};
mxCellRenderer.prototype.resolveColor = function(e, g, a) {
	var d = e.shape[g];
	var c = e.view.graph;
	var f = null;
	if (d == "inherit") {
		f = c.model.getParent(e.cell)
	} else {
		if (d == "swimlane") {
			if (c.model.getTerminal(e.cell, false) != null) {
				f = c.model.getTerminal(e.cell, false)
			} else {
				f = e.cell
			}
			f = c.getSwimlane(f);
			a = c.swimlaneIndicatorColorAttribute
		} else {
			if (d == "indicated") {
				e.shape[g] = e.shape.indicatorColor
			}
		}
	}
	if (f != null) {
		var b = c.getView().getState(f);
		e.shape[g] = null;
		if (b != null) {
			if (b.shape != null && g != "indicatorColor") {
				e.shape[g] = b.shape[g]
			} else {
				e.shape[g] = b.style[a]
			}
		}
	}
};
mxCellRenderer.prototype.getLabelValue = function(c) {
	var b = c.view.graph;
	var a = b.getLabel(c.cell);
	if (!b.isHtmlLabel(c.cell) && !mxUtils.isNode(a) && mxClient.IS_IE && document.documentMode != 9 && a != null) {
		a = mxUtils.htmlEntities(a, false)
	}
	return a
};
mxCellRenderer.prototype.createLabel = function(a, g) {
	var h = a.view.graph;
	var e = h.getModel().isEdge(a.cell);
	if (a.style[mxConstants.STYLE_FONTSIZE] > 0 || a.style[mxConstants.STYLE_FONTSIZE] == null) {
		var c = (h.isHtmlLabel(a.cell) || (g != null && mxUtils.isNode(g))) && h.dialect == mxConstants.DIALECT_SVG;
		a.text = new mxText(g, new mxRectangle(), (a.style[mxConstants.STYLE_ALIGN] || mxConstants.ALIGN_CENTER), h.getVerticalAlign(a), a.style[mxConstants.STYLE_FONTCOLOR], a.style[mxConstants.STYLE_FONTFAMILY], a.style[mxConstants.STYLE_FONTSIZE], a.style[mxConstants.STYLE_FONTSTYLE], a.style[mxConstants.STYLE_SPACING], a.style[mxConstants.STYLE_SPACING_TOP], a.style[mxConstants.STYLE_SPACING_RIGHT], a.style[mxConstants.STYLE_SPACING_BOTTOM], a.style[mxConstants.STYLE_SPACING_LEFT], a.style[mxConstants.STYLE_HORIZONTAL], a.style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR], a.style[mxConstants.STYLE_LABEL_BORDERCOLOR], h.isWrapping(a.cell), h.isLabelClipped(a.cell), a.style[mxConstants.STYLE_OVERFLOW], a.style[mxConstants.STYLE_LABEL_PADDING]);
		a.text.opacity = a.style[mxConstants.STYLE_TEXT_OPACITY];
		a.text.dialect = (c) ? mxConstants.DIALECT_STRICTHTML: a.view.graph.dialect;
		this.initializeLabel(a);
		var d = function(m) {
			var l = a;
			if (mxClient.IS_TOUCH) {
				var k = mxEvent.getClientX(m);
				var o = mxEvent.getClientY(m);
				var n = mxUtils.convertPoint(h.container, k, o);
				l = h.view.getState(h.getCellAt(n.x, n.y))
			}
			return l
		};
		var f = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
		var b = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		var i = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
		mxEvent.addListener(a.text.node, f, mxUtils.bind(this,
		function(k) {
			if (this.isLabelEvent(a, k)) {
				h.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(k, a))
			}
		}));
		mxEvent.addListener(a.text.node, b, mxUtils.bind(this,
		function(k) {
			if (this.isLabelEvent(a, k)) {
				h.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(k, d(k)))
			}
		}));
		mxEvent.addListener(a.text.node, i, mxUtils.bind(this,
		function(k) {
			if (this.isLabelEvent(a, k)) {
				h.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(k, d(k)))
			}
		}));
		mxEvent.addListener(a.text.node, "dblclick", mxUtils.bind(this,
		function(k) {
			if (this.isLabelEvent(a, k)) {
				h.dblClick(k, a.cell);
				mxEvent.consume(k)
			}
		}))
	}
};
mxCellRenderer.prototype.initializeLabel = function(b) {
	var a = b.view.graph;
	if (b.text.dialect != mxConstants.DIALECT_SVG) {
		if (mxClient.IS_SVG && mxClient.NO_FO) {
			b.text.init(a.container)
		} else {
			if (mxUtils.isVml(b.view.getDrawPane())) {
				if (b.shape.label != null) {
					b.text.init(b.shape.label)
				} else {
					b.text.init(b.shape.node)
				}
			}
		}
	}
	if (b.text.node == null) {
		b.text.init(b.view.getDrawPane());
		if (b.shape != null && b.text != null) {
			b.shape.node.parentNode.insertBefore(b.text.node, b.shape.node.nextSibling)
		}
	}
};
mxCellRenderer.prototype.createCellOverlays = function(e) {
	var d = e.view.graph;
	var c = d.getCellOverlays(e.cell);
	if (c != null) {
		e.overlays = [];
		for (var b = 0; b < c.length; b++) {
			var a = new mxImageShape(new mxRectangle(), c[b].image.src);
			a.dialect = e.view.graph.dialect;
			this.initializeOverlay(e, a);
			this.installCellOverlayListeners(e, c[b], a);
			e.overlays.push(a);
			if (c[b].cursor != null) {
				a.node.style.cursor = c[b].cursor
			}
		}
	}
};
mxCellRenderer.prototype.initializeOverlay = function(b, a) {
	a.init(b.view.getOverlayPane())
};
mxCellRenderer.prototype.installCellOverlayListeners = function(e, b, a) {
	var d = e.view.graph;
	mxEvent.addListener(a.node, "click",
	function(g) {
		if (d.isEditing()) {
			d.stopEditing(!d.isInvokesStopCellEditing())
		}
		b.fireEvent(new mxEventObject(mxEvent.CLICK, "event", g, "cell", e.cell))
	});
	var c = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var f = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
	mxEvent.addListener(a.node, c,
	function(g) {
		mxEvent.consume(g)
	});
	mxEvent.addListener(a.node, f,
	function(g) {
		d.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(g, e))
	});
	if (mxClient.IS_TOUCH) {
		mxEvent.addListener(a.node, "touchend",
		function(g) {
			b.fireEvent(new mxEventObject(mxEvent.CLICK, "event", g, "cell", e.cell))
		})
	}
};
mxCellRenderer.prototype.createControl = function(d) {
	var c = d.view.graph;
	var e = c.getFoldingImage(d);
	if (c.foldingEnabled && e != null) {
		if (d.control == null) {
			var a = new mxRectangle(0, 0, e.width, e.height);
			d.control = new mxImageShape(a, e.src);
			d.control.dialect = c.dialect;
			d.control.preserveImageAspect = false;
			this.initControl(d, d.control, true,
			function(b) {
				if (c.isEnabled()) {
					var f = !c.isCellCollapsed(d.cell);
					c.foldCells(f, false, [d.cell]);
					mxEvent.consume(b)
				}
			})
		}
	} else {
		if (d.control != null) {
			d.control.destroy();
			d.control = null
		}
	}
};
mxCellRenderer.prototype.initControl = function(a, e, g, f) {
	var i = a.view.graph;
	var d = i.isHtmlLabel(a.cell) && mxClient.NO_FO && i.dialect == mxConstants.DIALECT_SVG;
	if (d) {
		e.dialect = mxConstants.DIALECT_PREFERHTML;
		e.init(i.container);
		e.node.style.zIndex = 1
	} else {
		e.init(a.view.getOverlayPane())
	}
	var b = e.innerNode || e.node;
	if (f) {
		if (i.isEnabled()) {
			b.style.cursor = "pointer"
		}
		mxEvent.addListener(b, "click", f)
	}
	if (g) {
		var h = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
		var c = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		mxEvent.addListener(b, h,
		function(k) {
			i.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(k, a));
			mxEvent.consume(k)
		});
		mxEvent.addListener(b, c,
		function(k) {
			i.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(k, a))
		})
	}
	return b
};
mxCellRenderer.prototype.isShapeEvent = function(b, a) {
	return true
};
mxCellRenderer.prototype.isLabelEvent = function(b, a) {
	return true
};
mxCellRenderer.prototype.installListeners = function(a) {
	var g = a.view.graph;
	if (g.dialect == mxConstants.DIALECT_SVG) {
		var h = "all";
		if (g.getModel().isEdge(a.cell) && a.shape.stroke != null && a.shape.fill == null) {
			h = "visibleStroke"
		}
		if (a.shape.innerNode != null) {
			a.shape.innerNode.setAttribute("pointer-events", h)
		} else {
			a.shape.node.setAttribute("pointer-events", h)
		}
	}
	var d = function(m) {
		var l = a;
		if ((mxClient.IS_IE && mxEvent.getSource(m).nodeName == "IMG") || mxClient.IS_TOUCH) {
			var k = mxEvent.getClientX(m);
			var o = mxEvent.getClientY(m);
			var n = mxUtils.convertPoint(g.container, k, o);
			l = g.view.getState(g.getCellAt(n.x, n.y))
		}
		return l
	};
	var c = false;
	mxEvent.addListener(a.shape.node, "gesturestart", mxUtils.bind(this,
	function(k) {
		g.lastTouchTime = 0;
		c = true;
		mxEvent.consume(k)
	}));
	var e = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var b = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
	var i = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
	mxEvent.addListener(a.shape.node, e, mxUtils.bind(this,
	function(k) {
		if (this.isShapeEvent(a, k) && !c) {
			g.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(k, (a.shape != null && mxEvent.getSource(k) == a.shape.content) ? null: a))
		} else {
			if (c) {
				mxEvent.consume(k)
			}
		}
	}));
	mxEvent.addListener(a.shape.node, b, mxUtils.bind(this,
	function(k) {
		if (this.isShapeEvent(a, k) && !c) {
			g.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(k, (a.shape != null && mxEvent.getSource(k) == a.shape.content) ? null: d(k)))
		} else {
			if (c) {
				mxEvent.consume(k)
			}
		}
	}));
	mxEvent.addListener(a.shape.node, i, mxUtils.bind(this,
	function(k) {
		if (this.isShapeEvent(a, k) && !c) {
			g.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(k, (a.shape != null && mxEvent.getSource(k) == a.shape.content) ? null: d(k)))
		} else {
			if (c) {
				mxEvent.consume(k)
			}
		}
	}));
	var f = (mxClient.IS_TOUCH) ? "gestureend": "dblclick";
	mxEvent.addListener(a.shape.node, f, mxUtils.bind(this,
	function(k) {
		c = false;
		if (f == "gestureend") {
			g.lastTouchTime = 0;
			if (g.gestureEnabled) {
				g.handleGesture(a, k);
				mxEvent.consume(k)
			}
		} else {
			if (this.isShapeEvent(a, k)) {
				g.dblClick(k, (a.shape != null && mxEvent.getSource(k) == a.shape.content) ? null: a.cell);
				mxEvent.consume(k)
			}
		}
	}))
};
mxCellRenderer.prototype.redrawLabel = function(e) {
	var d = this.getLabelValue(e);
	if (e.text == null && d != null && (mxUtils.isNode(d) || d.length > 0)) {
		this.createLabel(e, d)
	} else {
		if (e.text != null && (d == null || d.length == 0)) {
			e.text.destroy();
			e.text = null
		}
	}
	if (e.text != null) {
		var c = e.view.graph;
		var b = c.isWrapping(e.cell);
		var f = c.isLabelClipped(e.cell);
		var a = this.getLabelBounds(e);
		if (e.text.value != d || e.text.isWrapping != b || e.text.isClipping != f || e.text.scale != e.view.scale || !e.text.bounds.equals(a)) {
			e.text.value = d;
			e.text.bounds = a;
			e.text.scale = e.view.scale;
			e.text.isWrapping = b;
			e.text.isClipping = f;
			e.text.redraw()
		}
	}
};
mxCellRenderer.prototype.getLabelBounds = function(e) {
	var d = e.view.graph;
	var c = d.getModel().isEdge(e.cell);
	var b = new mxRectangle(e.absoluteOffset.x, e.absoluteOffset.y);
	if (!c) {
		b.x += e.x;
		b.y += e.y;
		b.width = Math.max(1, e.width);
		b.height = Math.max(1, e.height);
		if (d.isSwimlane(e.cell)) {
			var f = d.view.scale;
			var a = d.getStartSize(e.cell);
			if (a.width > 0) {
				b.width = a.width * f
			} else {
				if (a.height > 0) {
					b.height = a.height * f
				}
			}
		}
	}
	return b
};
mxCellRenderer.prototype.redrawCellOverlays = function(f) {
	var c = f.view.graph.getCellOverlays(f.cell);
	var a = (f.overlays != null) ? f.overlays.length: 0;
	var e = (c != null) ? c.length: 0;
	if (a != e) {
		if (a > 0) {
			for (var b = 0; b < f.overlays.length; b++) {
				f.overlays[b].destroy()
			}
			f.overlays = null
		}
		if (e > 0) {
			this.createCellOverlays(f)
		}
	}
	if (f.overlays != null) {
		for (var b = 0; b < c.length; b++) {
			var d = c[b].getBounds(f);
			if (f.overlays[b].bounds == null || f.overlays[b].scale != f.view.scale || !f.overlays[b].bounds.equals(d)) {
				f.overlays[b].bounds = d;
				f.overlays[b].scale = f.view.scale;
				f.overlays[b].redraw()
			}
		}
	}
};
mxCellRenderer.prototype.redrawControl = function(c) {
	if (c.control != null) {
		var b = this.getControlBounds(c);
		var a = c.view.scale;
		if (c.control.scale != a || !c.control.bounds.equals(b)) {
			c.control.bounds = b;
			c.control.scale = a;
			c.control.redraw()
		}
	}
};
mxCellRenderer.prototype.getControlBounds = function(e) {
	if (e.control != null) {
		var d = e.control.scale;
		var a = e.control.bounds.width / d;
		var c = e.control.bounds.height / d;
		var b = e.view.scale;
		return (e.view.graph.getModel().isEdge(e.cell)) ? new mxRectangle(e.x + e.width / 2 - a / 2 * b, e.y + e.height / 2 - c / 2 * b, a * b, c * b) : new mxRectangle(e.x + a / 2 * b, e.y + c / 2 * b, a * b, c * b)
	}
	return null
};
mxCellRenderer.prototype.redraw = function(d) {
	if (d.shape != null) {
		var b = d.view.graph.getModel();
		var c = b.isEdge(d.cell);
		var a = false;
		this.createControl(d);
		if (d.shape.bounds == null || d.shape.scale != d.view.scale || !d.shape.bounds.equals(d) || !mxUtils.equalPoints(d.shape.points, d.absolutePoints)) {
			if (d.absolutePoints != null) {
				d.shape.points = d.absolutePoints.slice()
			} else {
				d.shape.points = null
			}
			d.shape.bounds = new mxRectangle(d.x, d.y, d.width, d.height);
			d.shape.scale = d.view.scale;
			d.shape.redraw()
		}
		this.redrawLabel(d);
		this.redrawCellOverlays(d);
		this.redrawControl(d);
		if (d.orderChanged || d.invalidOrder) {
			if (d.view.graph.ordered) {
				this.order(d)
			} else {
				this.orderEdge(d)
			}
			a = d.orderChanged
		}
		delete d.invalidOrder;
		delete d.orderChanged;
		if (!a && !mxUtils.equalEntries(d.shape.style, d.style)) {
			a = true
		}
		if (a) {
			this.configureShape(d);
			d.shape.reconfigure()
		}
	}
};
mxCellRenderer.prototype.destroy = function(b) {
	if (b.shape != null) {
		if (b.text != null) {
			b.text.destroy();
			b.text = null
		}
		if (b.overlays != null) {
			for (var a = 0; a < b.overlays.length; a++) {
				b.overlays[a].destroy()
			}
			b.overlays = null
		}
		if (b.control != null) {
			b.control.destroy();
			b.control = null
		}
		b.shape.destroy();
		b.shape = null
	}
};
var mxEdgeStyle = {
	EntityRelation: function(k, s, A, u, o) {
		var q = k.view;
		var f = q.graph;
		var d = mxUtils.getValue(k.style, mxConstants.STYLE_SEGMENT, mxConstants.ENTITY_SEGMENT) * q.scale;
		var B = k.absolutePoints;
		var e = B[0];
		var z = B[B.length - 1];
		var w = false;
		if (e != null) {
			s = new mxCellState();
			s.x = e.x;
			s.y = e.y
		} else {
			if (s != null) {
				var a = mxUtils.getPortConstraints(s, k, true, mxConstants.DIRECTION_MASK_NONE);
				if (a != mxConstants.DIRECTION_MASK_NONE) {
					w = a == mxConstants.DIRECTION_MASK_WEST
				} else {
					var r = f.getCellGeometry(s.cell);
					if (r.relative) {
						w = r.x <= 0.5
					} else {
						if (A != null) {
							w = A.x + A.width < s.x
						}
					}
				}
			} else {
				return
			}
		}
		var i = true;
		if (z != null) {
			A = new mxCellState();
			A.x = z.x;
			A.y = z.y
		} else {
			if (A != null) {
				var a = mxUtils.getPortConstraints(A, k, false, mxConstants.DIRECTION_MASK_NONE);
				if (a != mxConstants.DIRECTION_MASK_NONE) {
					i = a == mxConstants.DIRECTION_MASK_WEST
				} else {
					var g = f.getCellGeometry(A.cell);
					if (g.relative) {
						i = g.x <= 0.5
					} else {
						if (s != null) {
							i = s.x + s.width < A.x
						}
					}
				}
			}
		}
		if (s != null && A != null) {
			var y = (w) ? s.x: s.x + s.width;
			var h = q.getRoutingCenterY(s);
			var t = (i) ? A.x: A.x + A.width;
			var c = q.getRoutingCenterY(A);
			var v = d;
			var p = (w) ? -v: v;
			var l = new mxPoint(y + p, h);
			p = (i) ? -v: v;
			var b = new mxPoint(t + p, c);
			if (w == i) {
				var m = (w) ? Math.min(y, t) - d: Math.max(y, t) + d;
				o.push(new mxPoint(m, h));
				o.push(new mxPoint(m, c))
			} else {
				if ((l.x < b.x) == w) {
					var n = h + (c - h) / 2;
					o.push(l);
					o.push(new mxPoint(l.x, n));
					o.push(new mxPoint(b.x, n));
					o.push(b)
				} else {
					o.push(l);
					o.push(b)
				}
			}
		}
	},
	Loop: function(b, a, e, i, o) {
		if (a != null) {
			var g = b.view;
			var k = g.graph;
			var n = (i != null && i.length > 0) ? i[0] : null;
			if (n != null) {
				n = g.transformControlPoint(b, n);
				if (mxUtils.contains(a, n.x, n.y)) {
					n = null
				}
			}
			var h = 0;
			var m = 0;
			var f = 0;
			var l = 0;
			var d = mxUtils.getValue(b.style, mxConstants.STYLE_SEGMENT, k.gridSize) * g.scale;
			var c = mxUtils.getValue(b.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_WEST);
			if (c == mxConstants.DIRECTION_NORTH || c == mxConstants.DIRECTION_SOUTH) {
				h = g.getRoutingCenterX(a);
				m = d
			} else {
				f = g.getRoutingCenterY(a);
				l = d
			}
			if (n == null || n.x < a.x || n.x > a.x + a.width) {
				if (n != null) {
					h = n.x;
					l = Math.max(Math.abs(f - n.y), l)
				} else {
					if (c == mxConstants.DIRECTION_NORTH) {
						f = a.y - 2 * m
					} else {
						if (c == mxConstants.DIRECTION_SOUTH) {
							f = a.y + a.height + 2 * m
						} else {
							if (c == mxConstants.DIRECTION_EAST) {
								h = a.x - 2 * l
							} else {
								h = a.x + a.width + 2 * l
							}
						}
					}
				}
			} else {
				if (n != null) {
					h = g.getRoutingCenterX(a);
					m = Math.max(Math.abs(h - n.x), l);
					f = n.y;
					l = 0
				}
			}
			o.push(new mxPoint(h - m, f - l));
			o.push(new mxPoint(h + m, f + l))
		}
	},
	ElbowConnector: function(c, b, g, k, m) {
		var l = (k != null && k.length > 0) ? k[0] : null;
		var f = false;
		var d = false;
		if (b != null && g != null) {
			if (l != null) {
				var e = Math.min(b.x, g.x);
				var i = Math.max(b.x + b.width, g.x + g.width);
				var h = Math.min(b.y, g.y);
				var a = Math.max(b.y + b.height, g.y + g.height);
				l = c.view.transformControlPoint(c, l);
				f = l.y < h || l.y > a;
				d = l.x < e || l.x > i
			} else {
				var e = Math.max(b.x, g.x);
				var i = Math.min(b.x + b.width, g.x + g.width);
				f = e == i;
				if (!f) {
					var h = Math.max(b.y, g.y);
					var a = Math.min(b.y + b.height, g.y + g.height);
					d = h == a
				}
			}
		}
		if (!d && (f || c.style[mxConstants.STYLE_ELBOW] == mxConstants.ELBOW_VERTICAL)) {
			mxEdgeStyle.TopToBottom(c, b, g, k, m)
		} else {
			mxEdgeStyle.SideToSide(c, b, g, k, m)
		}
	},
	SideToSide: function(d, c, f, o, v) {
		var k = d.view;
		var u = (o != null && o.length > 0) ? o[0] : null;
		var s = d.absolutePoints;
		var q = s[0];
		var g = s[s.length - 1];
		if (u != null) {
			u = k.transformControlPoint(d, u)
		}
		if (q != null) {
			c = new mxCellState();
			c.x = q.x;
			c.y = q.y
		}
		if (g != null) {
			f = new mxCellState();
			f.x = g.x;
			f.y = g.y
		}
		if (c != null && f != null) {
			var e = Math.max(c.x, f.x);
			var a = Math.min(c.x + c.width, f.x + f.width);
			var n = (u != null) ? u.x: a + (e - a) / 2;
			var m = k.getRoutingCenterY(c);
			var i = k.getRoutingCenterY(f);
			if (u != null) {
				if (q != null && u.y >= c.y && u.y <= c.y + c.height) {
					m = u.y
				}
				if (g != null && u.y >= f.y && u.y <= f.y + f.height) {
					i = u.y
				}
			}
			if (!mxUtils.contains(f, n, m) && !mxUtils.contains(c, n, m)) {
				v.push(new mxPoint(n, m))
			}
			if (!mxUtils.contains(f, n, i) && !mxUtils.contains(c, n, i)) {
				v.push(new mxPoint(n, i))
			}
			if (v.length == 1) {
				if (u != null) {
					if (!mxUtils.contains(f, n, u.y) && !mxUtils.contains(c, n, u.y)) {
						v.push(new mxPoint(n, u.y))
					}
				} else {
					var p = Math.max(c.y, f.y);
					var h = Math.min(c.y + c.height, f.y + f.height);
					v.push(new mxPoint(n, p + (h - p) / 2))
				}
			}
		}
	},
	TopToBottom: function(d, c, f, n, u) {
		var k = d.view;
		var s = (n != null && n.length > 0) ? n[0] : null;
		var q = d.absolutePoints;
		var p = q[0];
		var g = q[q.length - 1];
		if (s != null) {
			s = k.transformControlPoint(d, s)
		}
		if (p != null) {
			c = new mxCellState();
			c.x = p.x;
			c.y = p.y
		}
		if (g != null) {
			f = new mxCellState();
			f.x = g.x;
			f.y = g.y
		}
		if (c != null && f != null) {
			var o = Math.max(c.y, f.y);
			var i = Math.min(c.y + c.height, f.y + f.height);
			var m = k.getRoutingCenterX(c);
			if (s != null && s.x >= c.x && s.x <= c.x + c.width) {
				m = s.x
			}
			var h = (s != null) ? s.y: i + (o - i) / 2;
			if (!mxUtils.contains(f, m, h) && !mxUtils.contains(c, m, h)) {
				u.push(new mxPoint(m, h))
			}
			if (s != null && s.x >= f.x && s.x <= f.x + f.width) {
				m = s.x
			} else {
				m = k.getRoutingCenterX(f)
			}
			if (!mxUtils.contains(f, m, h) && !mxUtils.contains(c, m, h)) {
				u.push(new mxPoint(m, h))
			}
			if (u.length == 1) {
				if (s != null && u.length == 1) {
					if (!mxUtils.contains(f, s.x, h) && !mxUtils.contains(c, s.x, h)) {
						u.push(new mxPoint(s.x, h))
					}
				} else {
					var e = Math.max(c.x, f.x);
					var a = Math.min(c.x + c.width, f.x + f.width);
					u.push(new mxPoint(e + (a - e) / 2, h))
				}
			}
		}
	},
	SegmentConnector: function(d, n, v, o, h) {
		var w = d.absolutePoints;
		var t = true;
		var k = null;
		var m = w[0];
		if (m == null && n != null) {
			m = new mxPoint(d.view.getRoutingCenterX(n), d.view.getRoutingCenterY(n))
		} else {
			if (m != null) {
				m = m.clone()
			}
		}
		var f = w.length - 1;
		if (o != null && o.length > 0) {
			k = d.view.transformControlPoint(d, o[0]);
			var b = n;
			var q = w[0];
			var s = false;
			var c = false;
			var a = k;
			var g = o.length;
			for (var p = 0; p < 2; p++) {
				var u = q != null && q.x == a.x;
				var e = q != null && q.y == a.y;
				var r = b != null && (a.y >= b.y && a.y <= b.y + b.height);
				var l = b != null && (a.x >= b.x && a.x <= b.x + b.width);
				s = e || (q == null && r);
				c = u || (q == null && l);
				if (q != null && (!e && !u) && (r || l)) {
					t = r ? false: true;
					break
				}
				if (c || s) {
					t = s;
					if (p == 1) {
						t = o.length % 2 == 0 ? s: c
					}
					break
				}
				b = v;
				q = w[f];
				a = d.view.transformControlPoint(d, o[g - 1])
			}
			if (t && ((w[0] != null && w[0].y != k.y) || (w[0] == null && n != null && (k.y < n.y || k.y > n.y + n.height)))) {
				h.push(new mxPoint(m.x, k.y))
			} else {
				if (!t && ((w[0] != null && w[0].x != k.x) || (w[0] == null && n != null && (k.x < n.x || k.x > n.x + n.width)))) {
					h.push(new mxPoint(k.x, m.y))
				}
			}
			if (t) {
				m.y = k.y
			} else {
				m.x = k.x
			}
			for (var p = 0; p < o.length; p++) {
				t = !t;
				k = d.view.transformControlPoint(d, o[p]);
				if (t) {
					m.y = k.y
				} else {
					m.x = k.x
				}
				h.push(m.clone())
			}
		} else {
			k = m;
			t = true
		}
		m = w[f];
		if (m == null && v != null) {
			m = new mxPoint(d.view.getRoutingCenterX(v), d.view.getRoutingCenterY(v))
		}
		if (t && ((w[f] != null && w[f].y != k.y) || (w[f] == null && v != null && (k.y < v.y || k.y > v.y + v.height)))) {
			h.push(new mxPoint(m.x, k.y))
		} else {
			if (!t && ((w[f] != null && w[f].x != k.x) || (w[f] == null && v != null && (k.x < v.x || k.x > v.x + v.width)))) {
				h.push(new mxPoint(k.x, m.y))
			}
		}
		if (w[0] == null && n != null) {
			while (h.length > 1 && mxUtils.contains(n, h[1].x, h[1].y)) {
				h = h.splice(1, 1)
			}
		}
		if (w[f] == null && v != null) {
			while (h.length > 1 && mxUtils.contains(v, h[h.length - 1].x, h[h.length - 1].y)) {
				h = h.splice(h.length - 1, 1)
			}
		}
	},
	orthBuffer: 10,
	dirVectors: [[ - 1, 0], [0, -1], [1, 0], [0, 1], [ - 1, 0], [0, -1], [1, 0]],
	wayPoints1: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	routePatterns: [[[513, 2308, 2081, 2562], [513, 1090, 514, 2184, 2114, 2561], [513, 1090, 514, 2564, 2184, 2562], [513, 2308, 2561, 1090, 514, 2568, 2308]], [[514, 1057, 513, 2308, 2081, 2562], [514, 2184, 2114, 2561], [514, 2184, 2562, 1057, 513, 2564, 2184], [514, 1057, 513, 2568, 2308, 2561]], [[1090, 514, 1057, 513, 2308, 2081, 2562], [2114, 2561], [1090, 2562, 1057, 513, 2564, 2184], [1090, 514, 1057, 513, 2308, 2561, 2568]], [[2081, 2562], [1057, 513, 1090, 514, 2184, 2114, 2561], [1057, 513, 1090, 514, 2184, 2562, 2564], [1057, 2561, 1090, 514, 2568, 2308]]],
	inlineRoutePatterns: [[null, [2114, 2568], null, null], [null, [514, 2081, 2114, 2568], null, null], [null, [2114, 2561], null, null], [[2081, 2562], [1057, 2114, 2568], [2184, 2562], null]],
	vertexSeperations: [],
	limits: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
	LEFT_MASK: 32,
	TOP_MASK: 64,
	RIGHT_MASK: 128,
	BOTTOM_MASK: 256,
	LEFT: 1,
	TOP: 2,
	RIGHT: 4,
	BOTTOM: 8,
	SIDE_MASK: 480,
	CENTER_MASK: 512,
	SOURCE_MASK: 1024,
	TARGET_MASK: 2048,
	VERTEX_MASK: 3072,
	OrthConnector: function(ap, I, a, S, F) {
		var T = ap.view.graph;
		var p = I == null ? false: T.getModel().isEdge(I.cell);
		var g = a == null ? false: T.getModel().isEdge(a.cell);
		if ((S != null && S.length > 0) || (p) || (g)) {
			mxEdgeStyle.SegmentConnector(ap, I, a, S, F);
			return
		}
		var am = ap.absolutePoints;
		var ag = am[0];
		var E = am[am.length - 1];
		var d = I != null ? I.x: ag.x;
		var b = I != null ? I.y: ag.y;
		var t = I != null ? I.width: 1;
		var X = I != null ? I.height: 1;
		var ao = a != null ? a.x: E.x;
		var al = a != null ? a.y: E.y;
		var C = a != null ? a.width: 1;
		var q = a != null ? a.height: 1;
		var Z = ap.view.scale * mxEdgeStyle.orthBuffer;
		var ac = [mxConstants.DIRECTION_MASK_ALL, mxConstants.DIRECTION_MASK_ALL];
		if (I != null) {
			ac[0] = mxUtils.getPortConstraints(I, ap, true, mxConstants.DIRECTION_MASK_ALL)
		}
		if (a != null) {
			ac[1] = mxUtils.getPortConstraints(a, ap, false, mxConstants.DIRECTION_MASK_ALL)
		}
		var ak = [0, 0];
		var af = [[d, b, t, X], [ao, al, C, q]];
		for (var ab = 0; ab < 2; ab++) {
			mxEdgeStyle.limits[ab][1] = af[ab][0] - Z;
			mxEdgeStyle.limits[ab][2] = af[ab][1] - Z;
			mxEdgeStyle.limits[ab][4] = af[ab][0] + af[ab][2] + Z;
			mxEdgeStyle.limits[ab][8] = af[ab][1] + af[ab][3] + Z
		}
		var h = af[0][0] + af[0][2] / 2;
		var f = af[0][1] + af[0][3] / 2;
		var an = af[1][0] + af[1][2] / 2;
		var aj = af[1][1] + af[1][3] / 2;
		var m = h - an;
		var l = f - aj;
		var o = 0;
		if (m < 0) {
			if (l < 0) {
				o = 2
			} else {
				o = 1
			}
		} else {
			if (l <= 0) {
				o = 3;
				if (m == 0) {
					o = 2
				}
			}
		}
		var U = null;
		if (I != null) {
			U = ag
		}
		var ah = [[0.5, 0.5], [0.5, 0.5]];
		for (var ab = 0; ab < 2; ab++) {
			if (U != null) {
				ah[ab][0] = (U.x - af[ab][0]) / af[ab][2];
				if (ah[ab][0] < 0.01) {
					ak[ab] = mxConstants.DIRECTION_MASK_WEST
				} else {
					if (ah[ab][0] > 0.99) {
						ak[ab] = mxConstants.DIRECTION_MASK_EAST
					}
				}
				ah[ab][1] = (U.y - af[ab][1]) / af[ab][3];
				if (ah[ab][1] < 0.01) {
					ak[ab] = mxConstants.DIRECTION_MASK_NORTH
				} else {
					if (ah[ab][1] > 0.99) {
						ak[ab] = mxConstants.DIRECTION_MASK_SOUTH
					}
				}
			}
			U = null;
			if (a != null) {
				U = E
			}
		}
		var n = af[0][1] - (af[1][1] + af[1][3]);
		var v = af[0][0] - (af[1][0] + af[1][2]);
		var ad = af[1][1] - (af[0][1] + af[0][3]);
		var z = af[1][0] - (af[0][0] + af[0][2]);
		mxEdgeStyle.vertexSeperations[1] = Math.max(v - 2 * Z, 0);
		mxEdgeStyle.vertexSeperations[2] = Math.max(n - 2 * Z, 0);
		mxEdgeStyle.vertexSeperations[4] = Math.max(ad - 2 * Z, 0);
		mxEdgeStyle.vertexSeperations[3] = Math.max(z - 2 * Z, 0);
		var Y = [];
		var ai = [];
		var u = [];
		ai[0] = (v >= z) ? mxConstants.DIRECTION_MASK_WEST: mxConstants.DIRECTION_MASK_EAST;
		u[0] = (n >= ad) ? mxConstants.DIRECTION_MASK_NORTH: mxConstants.DIRECTION_MASK_SOUTH;
		ai[1] = mxUtils.reversePortConstraints(ai[0]);
		u[1] = mxUtils.reversePortConstraints(u[0]);
		var Q = v >= z ? v: z;
		var O = n >= ad ? n: ad;
		var N = [[0, 0], [0, 0]];
		var e = false;
		for (var ab = 0; ab < 2; ab++) {
			if (ak[ab] != 0) {
				continue
			}
			if ((ai[ab] & ac[ab]) == 0) {
				ai[ab] = mxUtils.reversePortConstraints(ai[ab])
			}
			if ((u[ab] & ac[ab]) == 0) {
				u[ab] = mxUtils.reversePortConstraints(u[ab])
			}
			N[ab][0] = u[ab];
			N[ab][1] = ai[ab]
		}
		if (O > Z * 2 && Q > Z * 2) {
			if (((ai[0] & ac[0]) > 0) && ((u[1] & ac[1]) > 0)) {
				N[0][0] = ai[0];
				N[0][1] = u[0];
				N[1][0] = u[1];
				N[1][1] = ai[1];
				e = true
			} else {
				if (((u[0] & ac[0]) > 0) && ((ai[1] & ac[1]) > 0)) {
					N[0][0] = u[0];
					N[0][1] = ai[0];
					N[1][0] = ai[1];
					N[1][1] = u[1];
					e = true
				}
			}
		}
		if (O > Z * 2 && !e) {
			N[0][0] = u[0];
			N[0][1] = ai[0];
			N[1][0] = u[1];
			N[1][1] = ai[1];
			e = true
		}
		if (Q > Z * 2 && !e) {
			N[0][0] = ai[0];
			N[0][1] = u[0];
			N[1][0] = ai[1];
			N[1][1] = u[1];
			e = true
		}
		for (var ab = 0; ab < 2; ab++) {
			if (ak[ab] != 0) {
				continue
			}
			if ((N[ab][0] & ac[ab]) == 0) {
				N[ab][0] = N[ab][1]
			}
			Y[ab] = N[ab][0] & ac[ab];
			Y[ab] |= (N[ab][1] & ac[ab]) << 8;
			Y[ab] |= (N[1 - ab][ab] & ac[ab]) << 16;
			Y[ab] |= (N[1 - ab][1 - ab] & ac[ab]) << 24;
			if ((Y[ab] & 15) == 0) {
				Y[ab] = Y[ab] << 8
			}
			if ((Y[ab] & 3840) == 0) {
				Y[ab] = (Y[ab] & 15) | Y[ab] >> 8
			}
			if ((Y[ab] & 983040) == 0) {
				Y[ab] = (Y[ab] & 65535) | ((Y[ab] & 251658240) >> 8)
			}
			ak[ab] = Y[ab] & 15;
			if (ac[ab] == mxConstants.DIRECTION_MASK_WEST || ac[ab] == mxConstants.DIRECTION_MASK_NORTH || ac[ab] == mxConstants.DIRECTION_MASK_EAST || ac[ab] == mxConstants.DIRECTION_MASK_SOUTH) {
				ak[ab] = ac[ab]
			}
		}
		var V = ak[0] == mxConstants.DIRECTION_MASK_EAST ? 3 : ak[0];
		var ae = ak[1] == mxConstants.DIRECTION_MASK_EAST ? 3 : ak[1];
		V -= o;
		ae -= o;
		if (V < 1) {
			V += 4
		}
		if (ae < 1) {
			ae += 4
		}
		var M = mxEdgeStyle.routePatterns[V - 1][ae - 1];
		mxEdgeStyle.wayPoints1[0][0] = af[0][0];
		mxEdgeStyle.wayPoints1[0][1] = af[0][1];
		switch (ak[0]) {
		case mxConstants.DIRECTION_MASK_WEST:
			mxEdgeStyle.wayPoints1[0][0] -= Z;
			mxEdgeStyle.wayPoints1[0][1] += ah[0][1] * af[0][3];
			break;
		case mxConstants.DIRECTION_MASK_SOUTH:
			mxEdgeStyle.wayPoints1[0][0] += ah[0][0] * af[0][2];
			mxEdgeStyle.wayPoints1[0][1] += af[0][3] + Z;
			break;
		case mxConstants.DIRECTION_MASK_EAST:
			mxEdgeStyle.wayPoints1[0][0] += af[0][2] + Z;
			mxEdgeStyle.wayPoints1[0][1] += ah[0][1] * af[0][3];
			break;
		case mxConstants.DIRECTION_MASK_NORTH:
			mxEdgeStyle.wayPoints1[0][0] += ah[0][0] * af[0][2];
			mxEdgeStyle.wayPoints1[0][1] -= Z;
			break
		}
		var k = 0;
		var G = (ak[0] & (mxConstants.DIRECTION_MASK_EAST | mxConstants.DIRECTION_MASK_WEST)) > 0 ? 0 : 1;
		var W = G;
		var L = 0;
		for (var ab = 0; ab < M.length; ab++) {
			var K = M[ab] & 15;
			var P = K == mxConstants.DIRECTION_MASK_EAST ? 3 : K;
			P += o;
			if (P > 4) {
				P -= 4
			}
			var w = mxEdgeStyle.dirVectors[P - 1];
			L = (P % 2 > 0) ? 0 : 1;
			if (L != G) {
				k++;
				mxEdgeStyle.wayPoints1[k][0] = mxEdgeStyle.wayPoints1[k - 1][0];
				mxEdgeStyle.wayPoints1[k][1] = mxEdgeStyle.wayPoints1[k - 1][1]
			}
			var R = (M[ab] & mxEdgeStyle.TARGET_MASK) > 0;
			var x = (M[ab] & mxEdgeStyle.SOURCE_MASK) > 0;
			var D = (M[ab] & mxEdgeStyle.SIDE_MASK) >> 5;
			D = D << o;
			if (D > 15) {
				D = D >> 4
			}
			var c = (M[ab] & mxEdgeStyle.CENTER_MASK) > 0;
			if ((x || R) && D < 9) {
				var J = 0;
				var H = x ? 0 : 1;
				if (c && L == 0) {
					J = af[H][0] + ah[H][0] * af[H][2]
				} else {
					if (c) {
						J = af[H][1] + ah[H][1] * af[H][3]
					} else {
						J = mxEdgeStyle.limits[H][D]
					}
				}
				if (L == 0) {
					var s = mxEdgeStyle.wayPoints1[k][0];
					var A = (J - s) * w[0];
					if (A > 0) {
						mxEdgeStyle.wayPoints1[k][0] += w[0] * A
					}
				} else {
					var r = mxEdgeStyle.wayPoints1[k][1];
					var y = (J - r) * w[1];
					if (y > 0) {
						mxEdgeStyle.wayPoints1[k][1] += w[1] * y
					}
				}
			} else {
				if (c) {
					mxEdgeStyle.wayPoints1[k][0] += w[0] * Math.abs(mxEdgeStyle.vertexSeperations[P] / 2);
					mxEdgeStyle.wayPoints1[k][1] += w[1] * Math.abs(mxEdgeStyle.vertexSeperations[P] / 2)
				}
			}
			if (k > 0 && mxEdgeStyle.wayPoints1[k][L] == mxEdgeStyle.wayPoints1[k - 1][L]) {
				k--
			} else {
				G = L
			}
		}
		for (var ab = 0; ab <= k; ab++) {
			if (ab == k) {
				var B = (ak[1] & (mxConstants.DIRECTION_MASK_EAST | mxConstants.DIRECTION_MASK_WEST)) > 0 ? 0 : 1;
				var aa = B == W ? 0 : 1;
				if (aa != (k + 1) % 2) {
					break
				}
			}
			F.push(new mxPoint(mxEdgeStyle.wayPoints1[ab][0], mxEdgeStyle.wayPoints1[ab][1]))
		}
	},
	getRoutePattern: function(g, d, f, c) {
		var b = g[0] == mxConstants.DIRECTION_MASK_EAST ? 3 : g[0];
		var e = g[1] == mxConstants.DIRECTION_MASK_EAST ? 3 : g[1];
		b -= d;
		e -= d;
		if (b < 1) {
			b += 4
		}
		if (e < 1) {
			e += 4
		}
		var a = routePatterns[b - 1][e - 1];
		if (f == 0 || c == 0) {
			if (inlineRoutePatterns[b - 1][e - 1] != null) {
				a = inlineRoutePatterns[b - 1][e - 1]
			}
		}
		return a
	}
};
var mxStyleRegistry = {
	values: [],
	putValue: function(a, b) {
		mxStyleRegistry.values[a] = b
	},
	getValue: function(a) {
		return mxStyleRegistry.values[a]
	},
	getName: function(b) {
		for (var a in mxStyleRegistry.values) {
			if (mxStyleRegistry.values[a] == b) {
				return a
			}
		}
		return null
	}
};
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_ELBOW, mxEdgeStyle.ElbowConnector);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_ENTITY_RELATION, mxEdgeStyle.EntityRelation);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_LOOP, mxEdgeStyle.Loop);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_SIDETOSIDE, mxEdgeStyle.SideToSide);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_TOPTOBOTTOM, mxEdgeStyle.TopToBottom);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_ORTHOGONAL, mxEdgeStyle.OrthConnector);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_SEGMENT, mxEdgeStyle.SegmentConnector);
mxStyleRegistry.putValue(mxConstants.PERIMETER_ELLIPSE, mxPerimeter.EllipsePerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_RECTANGLE, mxPerimeter.RectanglePerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_RHOMBUS, mxPerimeter.RhombusPerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_TRIANGLE, mxPerimeter.TrianglePerimeter);
function mxGraphView(a) {
	this.graph = a;
	this.translate = new mxPoint();
	this.graphBounds = new mxRectangle();
	this.states = new mxDictionary()
}
mxGraphView.prototype = new mxEventSource();
mxGraphView.prototype.constructor = mxGraphView;
mxGraphView.prototype.EMPTY_POINT = new mxPoint();
mxGraphView.prototype.doneResource = (mxClient.language != "none") ? "done": "";
mxGraphView.prototype.updatingDocumentResource = (mxClient.language != "none") ? "updatingDocument": "";
mxGraphView.prototype.allowEval = false;
mxGraphView.prototype.captureDocumentGesture = true;
mxGraphView.prototype.rendering = true;
mxGraphView.prototype.graph = null;
mxGraphView.prototype.currentRoot = null;
mxGraphView.prototype.graphBounds = null;
mxGraphView.prototype.scale = 1;
mxGraphView.prototype.translate = null;
mxGraphView.prototype.updateStyle = false;
mxGraphView.prototype.getGraphBounds = function() {
	return this.graphBounds
};
mxGraphView.prototype.setGraphBounds = function(a) {
	this.graphBounds = a
};
mxGraphView.prototype.getBounds = function(c) {
	var a = null;
	if (c != null && c.length > 0) {
		var b = this.graph.getModel();
		for (var d = 0; d < c.length; d++) {
			if (b.isVertex(c[d]) || b.isEdge(c[d])) {
				var e = this.getState(c[d]);
				if (e != null) {
					if (a == null) {
						a = new mxRectangle(e.x, e.y, e.width, e.height)
					} else {
						a.add(e)
					}
				}
			}
		}
	}
	return a
};
mxGraphView.prototype.setCurrentRoot = function(a) {
	if (this.currentRoot != a) {
		var c = new mxCurrentRootChange(this, a);
		c.execute();
		var b = new mxUndoableEdit(this, false);
		b.add(c);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, "edit", b));
		this.graph.sizeDidChange()
	}
	return a
};
mxGraphView.prototype.scaleAndTranslate = function(e, b, a) {
	var c = this.scale;
	var d = new mxPoint(this.translate.x, this.translate.y);
	if (this.scale != e || this.translate.x != b || this.translate.y != a) {
		this.scale = e;
		this.translate.x = b;
		this.translate.y = a;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange()
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE, "scale", e, "previousScale", c, "translate", this.translate, "previousTranslate", d))
};
mxGraphView.prototype.getScale = function() {
	return this.scale
};
mxGraphView.prototype.setScale = function(b) {
	var a = this.scale;
	if (this.scale != b) {
		this.scale = b;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange()
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.SCALE, "scale", b, "previousScale", a))
};
mxGraphView.prototype.getTranslate = function() {
	return this.translate
};
mxGraphView.prototype.setTranslate = function(b, a) {
	var c = new mxPoint(this.translate.x, this.translate.y);
	if (this.translate.x != b || this.translate.y != a) {
		this.translate.x = b;
		this.translate.y = a;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange()
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.TRANSLATE, "translate", this.translate, "previousTranslate", c))
};
mxGraphView.prototype.refresh = function() {
	if (this.currentRoot != null) {
		this.clear()
	}
	this.revalidate()
};
mxGraphView.prototype.revalidate = function() {
	this.invalidate();
	this.validate()
};
mxGraphView.prototype.clear = function(a, f, e) {
	var c = this.graph.getModel();
	a = a || c.getRoot();
	f = (f != null) ? f: false;
	e = (e != null) ? e: true;
	this.removeState(a);
	if (e && (f || a != this.currentRoot)) {
		var b = c.getChildCount(a);
		for (var d = 0; d < b; d++) {
			this.clear(c.getChildAt(a, d), f)
		}
	} else {
		this.invalidate(a)
	}
};
mxGraphView.prototype.invalidate = function(l, c, k, h) {
	var g = this.graph.getModel();
	l = l || g.getRoot();
	c = (c != null) ? c: true;
	k = (k != null) ? k: true;
	h = (h != null) ? h: false;
	var b = this.getState(l);
	if (b != null) {
		b.invalid = true;
		if (h) {
			b.orderChanged = true
		}
	}
	if (c) {
		var e = g.getChildCount(l);
		for (var f = 0; f < e; f++) {
			var d = g.getChildAt(l, f);
			this.invalidate(d, c, k, h)
		}
	}
	if (k) {
		var a = g.getEdgeCount(l);
		for (var f = 0; f < a; f++) {
			this.invalidate(g.getEdgeAt(l, f), c, k)
		}
	}
};
mxGraphView.prototype.validate = function(a) {
	var b = mxLog.enter("mxGraphView.validate");
	window.status = mxResources.get(this.updatingDocumentResource) || this.updatingDocumentResource;
	a = a || ((this.currentRoot != null) ? this.currentRoot: this.graph.getModel().getRoot());
	this.validateBounds(null, a);
	var c = this.validatePoints(null, a);
	if (c == null) {
		c = new mxRectangle()
	}
	this.setGraphBounds(c);
	this.validateBackground();
	window.status = mxResources.get(this.doneResource) || this.doneResource;
	mxLog.leave("mxGraphView.validate", b)
};
mxGraphView.prototype.validateBackground = function() {
	var c = this.graph.getBackgroundImage();
	if (c != null) {
		if (this.backgroundImage == null || this.backgroundImage.image != c.src) {
			if (this.backgroundImage != null) {
				this.backgroundImage.destroy()
			}
			var d = new mxRectangle(0, 0, 1, 1);
			this.backgroundImage = new mxImageShape(d, c.src);
			this.backgroundImage.dialect = this.graph.dialect;
			this.backgroundImage.init(this.backgroundPane);
			this.backgroundImage.redraw()
		}
		this.redrawBackgroundImage(this.backgroundImage, c)
	} else {
		if (this.backgroundImage != null) {
			this.backgroundImage.destroy();
			this.backgroundImage = null
		}
	}
	if (this.graph.pageVisible) {
		var b = this.graph.pageFormat;
		var g = this.scale * this.graph.pageScale;
		var d = new mxRectangle(this.scale * this.translate.x, this.scale * this.translate.y, b.width * g, b.height * g);
		if (this.backgroundPageShape == null) {
			this.backgroundPageShape = new mxRectangleShape(d, "white", "black");
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.isShadow = true;
			this.backgroundPageShape.dialect = this.graph.dialect;
			this.backgroundPageShape.init(this.backgroundPane);
			this.backgroundPageShape.redraw();
			mxEvent.addListener(this.backgroundPageShape.node, "dblclick", mxUtils.bind(this,
			function(h) {
				this.graph.dblClick(h)
			}));
			var e = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
			var f = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
			var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
			mxEvent.addListener(this.backgroundPageShape.node, e, mxUtils.bind(this,
			function(h) {
				this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(h))
			}));
			mxEvent.addListener(this.backgroundPageShape.node, f, mxUtils.bind(this,
			function(h) {
				if (this.graph.tooltipHandler != null && this.graph.tooltipHandler.isHideOnHover()) {
					this.graph.tooltipHandler.hide()
				}
				if (this.graph.isMouseDown && !mxEvent.isConsumed(h)) {
					this.graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(h))
				}
			}));
			mxEvent.addListener(this.backgroundPageShape.node, a, mxUtils.bind(this,
			function(h) {
				this.graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(h))
			}))
		} else {
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.bounds = d;
			this.backgroundPageShape.redraw()
		}
	} else {
		if (this.backgroundPageShape != null) {
			this.backgroundPageShape.destroy();
			this.backgroundPageShape = null
		}
	}
};
mxGraphView.prototype.redrawBackgroundImage = function(b, a) {
	b.scale = this.scale;
	b.bounds.x = this.scale * this.translate.x;
	b.bounds.y = this.scale * this.translate.y;
	b.bounds.width = this.scale * a.width;
	b.bounds.height = this.scale * a.height;
	b.redraw()
};
mxGraphView.prototype.validateBounds = function(h, k) {
	var g = this.graph.getModel();
	var a = this.getState(k, true);
	if (a != null && a.invalid) {
		if (!this.graph.isCellVisible(k)) {
			this.removeState(k)
		} else {
			if (k != this.currentRoot && h != null) {
				a.absoluteOffset.x = 0;
				a.absoluteOffset.y = 0;
				a.origin.x = h.origin.x;
				a.origin.y = h.origin.y;
				var e = this.graph.getCellGeometry(k);
				if (e != null) {
					if (!g.isEdge(k)) {
						var c = e.offset || this.EMPTY_POINT;
						if (e.relative) {
							a.origin.x += e.x * h.width / this.scale + c.x;
							a.origin.y += e.y * h.height / this.scale + c.y
						} else {
							a.absoluteOffset.x = this.scale * c.x;
							a.absoluteOffset.y = this.scale * c.y;
							a.origin.x += e.x;
							a.origin.y += e.y
						}
					}
					a.x = this.scale * (this.translate.x + a.origin.x);
					a.y = this.scale * (this.translate.y + a.origin.y);
					a.width = this.scale * e.width;
					a.height = this.scale * e.height;
					if (g.isVertex(k)) {
						this.updateVertexLabelOffset(a)
					}
				}
			}
		}
		var c = this.graph.getChildOffsetForCell(k);
		if (c != null) {
			a.origin.x += c.x;
			a.origin.y += c.y
		}
	}
	if (a != null && (!this.graph.isCellCollapsed(k) || k == this.currentRoot)) {
		var d = g.getChildCount(k);
		for (var f = 0; f < d; f++) {
			var b = g.getChildAt(k, f);
			this.validateBounds(a, b)
		}
	}
};
mxGraphView.prototype.updateVertexLabelOffset = function(c) {
	var a = mxUtils.getValue(c.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
	if (a == mxConstants.ALIGN_LEFT) {
		c.absoluteOffset.x -= c.width
	} else {
		if (a == mxConstants.ALIGN_RIGHT) {
			c.absoluteOffset.x += c.width
		}
	}
	var b = mxUtils.getValue(c.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
	if (b == mxConstants.ALIGN_TOP) {
		c.absoluteOffset.y -= c.height
	} else {
		if (b == mxConstants.ALIGN_BOTTOM) {
			c.absoluteOffset.y += c.height
		}
	}
};
mxGraphView.prototype.validatePoints = function(o, p) {
	var l = this.graph.getModel();
	var c = this.getState(p);
	var q = null;
	if (c != null) {
		if (c.invalid) {
			var g = this.graph.getCellGeometry(p);
			if (g != null && l.isEdge(p)) {
				var b = this.getState(this.getVisibleTerminal(p, true));
				if (b != null && l.isEdge(b.cell) && !l.isAncestor(b.cell, p)) {
					var h = this.getState(l.getParent(b.cell));
					this.validatePoints(h, b.cell)
				}
				var m = this.getState(this.getVisibleTerminal(p, false));
				if (m != null && l.isEdge(m.cell) && !l.isAncestor(m.cell, p)) {
					var h = this.getState(l.getParent(m.cell));
					this.validatePoints(h, m.cell)
				}
				this.updateFixedTerminalPoints(c, b, m);
				this.updatePoints(c, g.points, b, m);
				this.updateFloatingTerminalPoints(c, b, m);
				this.updateEdgeBounds(c);
				this.updateEdgeLabelOffset(c)
			} else {
				if (g != null && g.relative && o != null && l.isEdge(o.cell)) {
					var n = this.getPoint(o, g);
					if (n != null) {
						c.x = n.x;
						c.y = n.y;
						n.x = (n.x / this.scale) - this.translate.x;
						n.y = (n.y / this.scale) - this.translate.y;
						c.origin = n;
						this.childMoved(o, c)
					}
				}
			}
			c.invalid = false;
			if (this.isRendering() && p != this.currentRoot) {
				this.graph.cellRenderer.redraw(c)
			}
		}
		if (l.isEdge(p) || l.isVertex(p)) {
			q = new mxRectangle(c.x, c.y, c.width, c.height);
			var k = (c.text != null && !this.graph.isLabelClipped(c.cell)) ? c.text.boundingBox: null;
			if (k != null) {
				q.add(k)
			}
		}
	}
	if (c != null && (!this.graph.isCellCollapsed(p) || p == this.currentRoot)) {
		var e = l.getChildCount(p);
		for (var f = 0; f < e; f++) {
			var d = l.getChildAt(p, f);
			var a = this.validatePoints(c, d);
			if (a != null) {
				if (q == null) {
					q = a
				} else {
					q.add(a)
				}
			}
		}
	}
	return q
};
mxGraphView.prototype.childMoved = function(e, f) {
	var a = f.cell;
	if (!this.graph.isCellCollapsed(a) || a == this.currentRoot) {
		var c = this.graph.getModel();
		var b = c.getChildCount(a);
		for (var d = 0; d < b; d++) {
			this.validateBounds(f, c.getChildAt(a, d))
		}
	}
};
mxGraphView.prototype.updateFixedTerminalPoints = function(a, b, c) {
	this.updateFixedTerminalPoint(a, b, true, this.graph.getConnectionConstraint(a, b, true));
	this.updateFixedTerminalPoint(a, c, false, this.graph.getConnectionConstraint(a, c, false))
};
mxGraphView.prototype.updateFixedTerminalPoint = function(c, e, a, b) {
	var h = null;
	if (b != null) {
		h = this.graph.getConnectionPoint(e, b)
	}
	if (h == null && e == null) {
		var i = this.scale;
		var f = this.translate;
		var g = c.origin;
		var d = this.graph.getCellGeometry(c.cell);
		h = d.getTerminalPoint(a);
		if (h != null) {
			h = new mxPoint(i * (f.x + h.x + g.x), i * (f.y + h.y + g.y))
		}
	}
	c.setAbsoluteTerminalPoint(h, a)
};
mxGraphView.prototype.updatePoints = function(d, k, b, h) {
	if (d != null) {
		var m = [];
		m.push(d.absolutePoints[0]);
		var g = this.getEdgeStyle(d, k, b, h);
		if (g != null) {
			var a = this.getTerminalPort(d, b, true);
			var c = this.getTerminalPort(d, h, false);
			g(d, a, c, k, m)
		} else {
			if (k != null) {
				for (var f = 0; f < k.length; f++) {
					if (k[f] != null) {
						var l = mxUtils.clone(k[f]);
						m.push(this.transformControlPoint(d, l))
					}
				}
			}
		}
		var e = d.absolutePoints;
		m.push(e[e.length - 1]);
		d.absolutePoints = m
	}
};
mxGraphView.prototype.transformControlPoint = function(a, b) {
	var c = a.origin;
	return new mxPoint(this.scale * (b.x + this.translate.x + c.x), this.scale * (b.y + this.translate.y + c.y))
};
mxGraphView.prototype.getEdgeStyle = function(edge, points, source, target) {
	var edgeStyle = (source != null && source == target) ? mxUtils.getValue(edge.style, mxConstants.STYLE_LOOP, this.graph.defaultLoopStyle) : (!mxUtils.getValue(edge.style, mxConstants.STYLE_NOEDGESTYLE, false) ? edge.style[mxConstants.STYLE_EDGE] : null);
	if (typeof(edgeStyle) == "string") {
		var tmp = mxStyleRegistry.getValue(edgeStyle);
		if (tmp == null && this.isAllowEval()) {
			tmp = mxUtils.eval(edgeStyle)
		}
		edgeStyle = tmp
	}
	if (typeof(edgeStyle) == "function") {
		return edgeStyle
	}
	return null
};
mxGraphView.prototype.updateFloatingTerminalPoints = function(c, b, d) {
	var e = c.absolutePoints;
	var f = e[0];
	var a = e[e.length - 1];
	if (a == null && d != null) {
		this.updateFloatingTerminalPoint(c, d, b, false)
	}
	if (f == null && b != null) {
		this.updateFloatingTerminalPoint(c, b, d, true)
	}
};
mxGraphView.prototype.updateFloatingTerminalPoint = function(d, g, a, e) {
	g = this.getTerminalPort(d, g, e);
	var c = this.getNextPoint(d, a, e);
	var b = parseFloat(d.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
	b += parseFloat(d.style[(e) ? mxConstants.STYLE_SOURCE_PERIMETER_SPACING: mxConstants.STYLE_TARGET_PERIMETER_SPACING] || 0);
	var f = this.getPerimeterPoint(g, c, this.graph.isOrthogonal(d), b);
	d.setAbsoluteTerminalPoint(f, e)
};
mxGraphView.prototype.getTerminalPort = function(e, c, d) {
	var b = (d) ? mxConstants.STYLE_SOURCE_PORT: mxConstants.STYLE_TARGET_PORT;
	var f = mxUtils.getValue(e.style, b);
	if (f != null) {
		var a = this.getState(this.graph.getModel().getCell(f));
		if (a != null) {
			c = a
		}
	}
	return c
};
mxGraphView.prototype.getPerimeterPoint = function(d, e, g, c) {
	var a = null;
	if (d != null) {
		var b = this.getPerimeterFunction(d);
		if (b != null && e != null) {
			var f = this.getPerimeterBounds(d, c);
			if (f.width > 0 || f.height > 0) {
				a = b(f, d, e, g)
			}
		}
		if (a == null) {
			a = this.getPoint(d)
		}
	}
	return a
};
mxGraphView.prototype.getRoutingCenterX = function(b) {
	var a = (b.style != null) ? parseFloat(b.style[mxConstants.STYLE_ROUTING_CENTER_X]) || 0 : 0;
	return b.getCenterX() + a * b.width
};
mxGraphView.prototype.getRoutingCenterY = function(b) {
	var a = (b.style != null) ? parseFloat(b.style[mxConstants.STYLE_ROUTING_CENTER_Y]) || 0 : 0;
	return b.getCenterY() + a * b.height
};
mxGraphView.prototype.getPerimeterBounds = function(b, a) {
	a = (a != null) ? a: 0;
	if (b != null) {
		a += parseFloat(b.style[mxConstants.STYLE_PERIMETER_SPACING] || 0)
	}
	return b.getPerimeterBounds(a * this.scale)
};
mxGraphView.prototype.getPerimeterFunction = function(state) {
	var perimeter = state.style[mxConstants.STYLE_PERIMETER];
	if (typeof(perimeter) == "string") {
		var tmp = mxStyleRegistry.getValue(perimeter);
		if (tmp == null && this.isAllowEval()) {
			tmp = mxUtils.eval(perimeter)
		}
		perimeter = tmp
	}
	if (typeof(perimeter) == "function") {
		return perimeter
	}
	return null
};
mxGraphView.prototype.getNextPoint = function(c, e, d) {
	var f = c.absolutePoints;
	var a = null;
	if (f != null && (d || f.length > 2 || e == null)) {
		var b = f.length;
		a = f[(d) ? Math.min(1, b - 1) : Math.max(0, b - 2)]
	}
	if (a == null && e != null) {
		a = new mxPoint(e.getCenterX(), e.getCenterY())
	}
	return a
};
mxGraphView.prototype.getVisibleTerminal = function(c, d) {
	var b = this.graph.getModel();
	var a = b.getTerminal(c, d);
	var e = a;
	while (a != null && a != this.currentRoot) {
		if (!this.graph.isCellVisible(e) || this.graph.isCellCollapsed(a)) {
			e = a
		}
		a = b.getParent(a)
	}
	if (b.getParent(e) == b.getRoot()) {
		e = null
	}
	return e
};
mxGraphView.prototype.updateEdgeBounds = function(c) {
	var o = c.absolutePoints;
	c.length = 0;
	if (o != null && o.length > 0) {
		var p = o[0];
		var m = o[o.length - 1];
		if (p == null || m == null) {
			this.clear(c.cell, true)
		} else {
			if (p.x != m.x || p.y != m.y) {
				var s = m.x - p.x;
				var q = m.y - p.y;
				c.terminalDistance = Math.sqrt(s * s + q * q)
			} else {
				c.terminalDistance = 0
			}
			var d = 0;
			var k = [];
			var r = p;
			if (r != null) {
				var f = r.x;
				var e = r.y;
				var b = f;
				var a = e;
				for (var h = 1; h < o.length; h++) {
					var g = o[h];
					if (g != null) {
						var s = r.x - g.x;
						var q = r.y - g.y;
						var l = Math.sqrt(s * s + q * q);
						k.push(l);
						d += l;
						r = g;
						f = Math.min(r.x, f);
						e = Math.min(r.y, e);
						b = Math.max(r.x, b);
						a = Math.max(r.y, a)
					}
				}
				c.length = d;
				c.segments = k;
				var n = 1;
				c.x = f;
				c.y = e;
				c.width = Math.max(n, b - f);
				c.height = Math.max(n, a - e)
			}
		}
	}
};
mxGraphView.prototype.getPoint = function(d, e) {
	var i = d.getCenterX();
	var h = d.getCenterY();
	if (d.segments != null && (e == null || e.relative)) {
		var n = (e != null) ? e.x / 2 : 0;
		var t = d.absolutePoints.length;
		var p = (n + 0.5) * d.length;
		var a = d.segments[0];
		var c = 0;
		var g = 1;
		while (p > c + a && g < t - 1) {
			c += a;
			a = d.segments[g++]
		}
		var o = (a == 0) ? 0 : (p - c) / a;
		var b = d.absolutePoints[g - 1];
		var v = d.absolutePoints[g];
		if (b != null && v != null) {
			var m = 0;
			var r = 0;
			var q = 0;
			if (e != null) {
				m = e.y;
				var f = e.offset;
				if (f != null) {
					r = f.x;
					q = f.y
				}
			}
			var l = v.x - b.x;
			var k = v.y - b.y;
			var u = (a == 0) ? 0 : k / a;
			var s = (a == 0) ? 0 : l / a;
			i = b.x + l * o + (u * m + r) * this.scale;
			h = b.y + k * o - (s * m - q) * this.scale
		}
	} else {
		if (e != null) {
			var f = e.offset;
			if (f != null) {
				i += f.x;
				h += f.y
			}
		}
	}
	return new mxPoint(i, h)
};
mxGraphView.prototype.getRelativePoint = function(t, l, k) {
	var e = this.graph.getModel();
	var g = e.getGeometry(t.cell);
	if (g != null) {
		var C = t.absolutePoints.length;
		if (g.relative && C > 1) {
			var m = t.length;
			var u = t.segments;
			var b = t.absolutePoints[0];
			var G = t.absolutePoints[1];
			var a = mxUtils.ptSegDistSq(b.x, b.y, G.x, G.y, l, k);
			var h = 0;
			var D = 0;
			var f = 0;
			for (var v = 2; v < C; v++) {
				D += u[v - 2];
				G = t.absolutePoints[v];
				var s = mxUtils.ptSegDistSq(b.x, b.y, G.x, G.y, l, k);
				if (s <= a) {
					a = s;
					h = v - 1;
					f = D
				}
				b = G
			}
			var A = u[h];
			b = t.absolutePoints[h];
			G = t.absolutePoints[h + 1];
			var w = b.x;
			var c = b.y;
			var z = G.x;
			var d = G.y;
			var q = l;
			var o = k;
			var n = w - z;
			var p = c - d;
			q -= z;
			o -= d;
			var H = 0;
			q = n - q;
			o = p - o;
			var r = q * n + o * p;
			if (r <= 0) {
				H = 0
			} else {
				H = r * r / (n * n + p * p)
			}
			var B = Math.sqrt(H);
			if (B > A) {
				B = A
			}
			var F = Math.sqrt(mxUtils.ptSegDistSq(b.x, b.y, G.x, G.y, l, k));
			var E = mxUtils.relativeCcw(b.x, b.y, G.x, G.y, l, k);
			if (E == -1) {
				F = -F
			}
			return new mxPoint(((m / 2 - f - B) / m) * -2, F / this.scale)
		}
	}
	return new mxPoint()
};
mxGraphView.prototype.updateEdgeLabelOffset = function(a) {
	var k = a.absolutePoints;
	a.absoluteOffset.x = a.getCenterX();
	a.absoluteOffset.y = a.getCenterY();
	if (k != null && k.length > 0 && a.segments != null) {
		var g = this.graph.getCellGeometry(a.cell);
		if (g.relative) {
			var d = this.getPoint(a, g);
			if (d != null) {
				a.absoluteOffset = d
			}
		} else {
			var l = k[0];
			var e = k[k.length - 1];
			if (l != null && e != null) {
				var n = e.x - l.x;
				var m = e.y - l.y;
				var b = 0;
				var i = 0;
				var c = g.offset;
				if (c != null) {
					b = c.x;
					i = c.y
				}
				var h = l.x + n / 2 + b * this.scale;
				var f = l.y + m / 2 + i * this.scale;
				a.absoluteOffset.x = h;
				a.absoluteOffset.y = f
			}
		}
	}
};
mxGraphView.prototype.getState = function(a, b) {
	b = b || false;
	var c = null;
	if (a != null) {
		c = this.states.get(a);
		if (this.graph.isCellVisible(a)) {
			if (c == null && b && this.graph.isCellVisible(a)) {
				c = this.createState(a);
				this.states.put(a, c)
			} else {
				if (b && c != null && this.updateStyle) {
					c.style = this.graph.getCellStyle(a)
				}
			}
		}
	}
	return c
};
mxGraphView.prototype.isRendering = function() {
	return this.rendering
};
mxGraphView.prototype.setRendering = function(a) {
	this.rendering = a
};
mxGraphView.prototype.isAllowEval = function() {
	return this.allowEval
};
mxGraphView.prototype.setAllowEval = function(a) {
	this.allowEval = a
};
mxGraphView.prototype.getStates = function() {
	return this.states
};
mxGraphView.prototype.setStates = function(a) {
	this.states = a
};
mxGraphView.prototype.getCellStates = function(b) {
	if (b == null) {
		return this.states
	} else {
		var a = [];
		for (var c = 0; c < b.length; c++) {
			var d = this.getState(b[c]);
			if (d != null) {
				a.push(d)
			}
		}
		return a
	}
};
mxGraphView.prototype.removeState = function(a) {
	var b = null;
	if (a != null) {
		b = this.states.remove(a);
		if (b != null) {
			this.graph.cellRenderer.destroy(b);
			b.destroy()
		}
	}
	return b
};
mxGraphView.prototype.createState = function(a) {
	var b = this.graph.getCellStyle(a);
	var c = new mxCellState(this, a, b);
	if (this.isRendering()) {
		this.graph.cellRenderer.initialize(c)
	}
	return c
};
mxGraphView.prototype.getCanvas = function() {
	return this.canvas
};
mxGraphView.prototype.getBackgroundPane = function() {
	return this.backgroundPane
};
mxGraphView.prototype.getDrawPane = function() {
	return this.drawPane
};
mxGraphView.prototype.getOverlayPane = function() {
	return this.overlayPane
};
mxGraphView.prototype.isContainerEvent = function(a) {
	var b = mxEvent.getSource(a);
	return (b == this.graph.container || b.parentNode == this.backgroundPane || (b.parentNode != null && b.parentNode.parentNode == this.backgroundPane) || b == this.canvas.parentNode || b == this.canvas || b == this.backgroundPane || b == this.drawPane || b == this.overlayPane)
};
mxGraphView.prototype.isScrollEvent = function(c) {
	var g = mxUtils.getOffset(this.graph.container);
	var f = new mxPoint(c.clientX - g.x, c.clientY - g.y);
	var a = this.graph.container.offsetWidth;
	var b = this.graph.container.clientWidth;
	if (a > b && f.x > b + 2 && f.x <= a) {
		return true
	}
	var e = this.graph.container.offsetHeight;
	var d = this.graph.container.clientHeight;
	if (e > d && f.y > d + 2 && f.y <= e) {
		return true
	}
	return false
};
mxGraphView.prototype.init = function() {
	this.installListeners();
	var a = this.graph;
	if (a.dialect == mxConstants.DIALECT_SVG) {
		this.createSvg()
	} else {
		if (a.dialect == mxConstants.DIALECT_VML) {
			this.createVml()
		} else {
			this.createHtml()
		}
	}
};
mxGraphView.prototype.installListeners = function() {
	var e = this.graph;
	var b = e.container;
	if (b != null) {
		var d = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
		var f = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
		var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
		mxEvent.addListener(b, d, mxUtils.bind(this,
		function(g) {
			if (mxClient.IS_TOUCH && e.isEditing()) {
				e.stopEditing(!e.isInvokesStopCellEditing())
			}
			if (this.isContainerEvent(g) && ((!mxClient.IS_IE && !mxClient.IS_GC && !mxClient.IS_OP && !mxClient.IS_SF) || !this.isScrollEvent(g))) {
				e.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(g))
			}
		}));
		mxEvent.addListener(b, f, mxUtils.bind(this,
		function(g) {
			if (this.isContainerEvent(g)) {
				e.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(g))
			}
		}));
		mxEvent.addListener(b, a, mxUtils.bind(this,
		function(g) {
			if (this.isContainerEvent(g)) {
				e.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(g))
			}
		}));
		mxEvent.addListener(b, "dblclick", mxUtils.bind(this,
		function(g) {
			e.dblClick(g)
		}));
		var c = function(h) {
			var i = null;
			if (mxClient.IS_TOUCH) {
				var g = mxEvent.getClientX(h);
				var l = mxEvent.getClientY(h);
				var k = mxUtils.convertPoint(b, g, l);
				i = e.view.getState(e.getCellAt(k.x, k.y))
			}
			return i
		};
		e.addMouseListener({
			mouseDown: function(g, h) {
				e.panningHandler.hideMenu()
			},
			mouseMove: function() {},
			mouseUp: function() {}
		});
		mxEvent.addListener(document, f, mxUtils.bind(this,
		function(g) {
			if (e.tooltipHandler != null && e.tooltipHandler.isHideOnHover()) {
				e.tooltipHandler.hide()
			}
			if (this.captureDocumentGesture && e.isMouseDown && !mxEvent.isConsumed(g)) {
				e.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(g, c(g)))
			}
		}));
		mxEvent.addListener(document, a, mxUtils.bind(this,
		function(g) {
			if (this.captureDocumentGesture) {
				e.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(g))
			}
		}))
	}
};
mxGraphView.prototype.createHtml = function() {
	var a = this.graph.container;
	if (a != null) {
		this.canvas = this.createHtmlPane();
		this.backgroundPane = this.createHtmlPane(1, 1);
		this.drawPane = this.createHtmlPane(1, 1);
		this.overlayPane = this.createHtmlPane(1, 1);
		this.canvas.appendChild(this.backgroundPane);
		this.canvas.appendChild(this.drawPane);
		this.canvas.appendChild(this.overlayPane);
		a.appendChild(this.canvas)
	}
};
mxGraphView.prototype.createHtmlPane = function(b, a) {
	var c = document.createElement("DIV");
	if (b != null && a != null) {
		c.style.position = "absolute";
		c.style.left = "0px";
		c.style.top = "0px";
		c.style.width = b + "px";
		c.style.height = a + "px"
	} else {
		c.style.position = "relative"
	}
	return c
};
mxGraphView.prototype.createVml = function() {
	var b = this.graph.container;
	if (b != null) {
		var c = b.offsetWidth;
		var a = b.offsetHeight;
		this.canvas = this.createVmlPane(c, a);
		this.backgroundPane = this.createVmlPane(c, a);
		this.drawPane = this.createVmlPane(c, a);
		this.overlayPane = this.createVmlPane(c, a);
		this.canvas.appendChild(this.backgroundPane);
		this.canvas.appendChild(this.drawPane);
		this.canvas.appendChild(this.overlayPane);
		b.appendChild(this.canvas)
	}
};
mxGraphView.prototype.createVmlPane = function(b, a) {
	var c = document.createElement("v:group");
	c.style.position = "absolute";
	c.style.left = "0px";
	c.style.top = "0px";
	c.style.width = b + "px";
	c.style.height = a + "px";
	c.setAttribute("coordsize", b + "," + a);
	c.setAttribute("coordorigin", "0,0");
	return c
};
mxGraphView.prototype.createSvg = function() {
	var b = this.graph.container;
	this.canvas = document.createElementNS(mxConstants.NS_SVG, "g");
	this.backgroundPane = document.createElementNS(mxConstants.NS_SVG, "g");
	this.canvas.appendChild(this.backgroundPane);
	this.drawPane = document.createElementNS(mxConstants.NS_SVG, "g");
	this.canvas.appendChild(this.drawPane);
	this.overlayPane = document.createElementNS(mxConstants.NS_SVG, "g");
	this.canvas.appendChild(this.overlayPane);
	var a = document.createElementNS(mxConstants.NS_SVG, "svg");
	var d = mxUtils.bind(this,
	function(f) {
		if (this.graph.container != null) {
			var g = this.graph.container.offsetWidth;
			var e = this.graph.container.offsetHeight;
			var h = this.getGraphBounds();
			a.setAttribute("width", Math.max(g, h.width));
			a.setAttribute("height", Math.max(e, h.height))
		}
	});
	mxEvent.addListener(window, "resize", d);
	if (false) {
		d()
	}
	a.appendChild(this.canvas);
	if (b != null) {
		b.appendChild(a);
		var c = mxUtils.getCurrentStyle(b);
		if (c.position == "static") {
			b.style.position = "relative"
		}
	}
};
mxGraphView.prototype.destroy = function() {
	var a = (this.canvas != null) ? this.canvas.ownerSVGElement: null;
	if (a == null) {
		a = this.canvas
	}
	if (a != null && a.parentNode != null) {
		this.clear(this.currentRoot, true);
		mxEvent.removeAllListeners(document);
		mxEvent.release(this.graph.container);
		a.parentNode.removeChild(a);
		this.canvas = null;
		this.backgroundPane = null;
		this.drawPane = null;
		this.overlayPane = null
	}
};
function mxCurrentRootChange(b, a) {
	this.view = b;
	this.root = a;
	this.previous = a;
	this.isUp = a == null;
	if (!this.isUp) {
		var d = this.view.currentRoot;
		var c = this.view.graph.getModel();
		while (d != null) {
			if (d == a) {
				this.isUp = true;
				break
			}
			d = c.getParent(d)
		}
	}
}
mxCurrentRootChange.prototype.execute = function() {
	var b = this.view.currentRoot;
	this.view.currentRoot = this.previous;
	this.previous = b;
	var c = this.view.graph.getTranslateForRoot(this.view.currentRoot);
	if (c != null) {
		this.view.translate = new mxPoint( - c.x, -c.y)
	}
	var a = (this.isUp) ? mxEvent.UP: mxEvent.DOWN;
	this.view.fireEvent(new mxEventObject(a, "root", this.view.currentRoot, "previous", this.previous));
	if (this.isUp) {
		this.view.clear(this.view.currentRoot, true);
		this.view.validate()
	} else {
		this.view.refresh()
	}
	this.isUp = !this.isUp
};
function mxGraph(a, b, d, c) {
	this.mouseListeners = null;
	this.renderHint = d;
	if (mxClient.IS_SVG) {
		this.dialect = mxConstants.DIALECT_SVG
	} else {
		if (d == mxConstants.RENDERING_HINT_EXACT && mxClient.IS_VML) {
			this.dialect = mxConstants.DIALECT_VML
		} else {
			if (d == mxConstants.RENDERING_HINT_FASTEST) {
				this.dialect = mxConstants.DIALECT_STRICTHTML
			} else {
				if (d == mxConstants.RENDERING_HINT_FASTER) {
					this.dialect = mxConstants.DIALECT_PREFERHTML
				} else {
					this.dialect = mxConstants.DIALECT_MIXEDHTML
				}
			}
		}
	}
	this.model = (b != null) ? b: new mxGraphModel();
	this.multiplicities = [];
	this.imageBundles = [];
	this.cellRenderer = this.createCellRenderer();
	this.setSelectionModel(this.createSelectionModel());
	this.setStylesheet((c != null) ? c: this.createStylesheet());
	this.view = this.createGraphView();
	this.model.addListener(mxEvent.CHANGE, mxUtils.bind(this,
	function(f, e) {
		this.graphModelChanged(e.getProperty("edit").changes)
	}));
	this.createHandlers();
	if (a != null) {
		this.init(a)
	}
	this.view.revalidate()
}
if (mxLoadResources) {
	mxResources.add(mxClient.basePath + "/resources/graph")
}
mxGraph.prototype = new mxEventSource();
mxGraph.prototype.constructor = mxGraph;
mxGraph.prototype.EMPTY_ARRAY = [];
mxGraph.prototype.mouseListeners = null;
mxGraph.prototype.isMouseDown = false;
mxGraph.prototype.model = null;
mxGraph.prototype.view = null;
mxGraph.prototype.stylesheet = null;
mxGraph.prototype.selectionModel = null;
mxGraph.prototype.cellEditor = null;
mxGraph.prototype.cellRenderer = null;
mxGraph.prototype.multiplicities = null;
mxGraph.prototype.renderHint = null;
mxGraph.prototype.dialect = null;
mxGraph.prototype.gridSize = 10;
mxGraph.prototype.gridEnabled = true;
mxGraph.prototype.portsEnabled = true;
mxGraph.prototype.doubleTapEnabled = true;
mxGraph.prototype.doubleTapTimeout = 700;
mxGraph.prototype.doubleTapTolerance = 25;
mxGraph.prototype.lastTouchY = 0;
mxGraph.prototype.lastTouchY = 0;
mxGraph.prototype.lastTouchTime = 0;
mxGraph.prototype.gestureEnabled = true;
mxGraph.prototype.tolerance = 4;
mxGraph.prototype.defaultOverlap = 0.5;
mxGraph.prototype.defaultParent = null;
mxGraph.prototype.alternateEdgeStyle = null;
mxGraph.prototype.backgroundImage = null;
mxGraph.prototype.pageVisible = false;
mxGraph.prototype.pageBreaksVisible = false;
mxGraph.prototype.pageBreakColor = "gray";
mxGraph.prototype.pageBreakDashed = true;
mxGraph.prototype.minPageBreakDist = 20;
mxGraph.prototype.preferPageSize = false;
mxGraph.prototype.pageFormat = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
mxGraph.prototype.pageScale = 1.5;
mxGraph.prototype.enabled = true;
mxGraph.prototype.escapeEnabled = true;
mxGraph.prototype.invokesStopCellEditing = true;
mxGraph.prototype.enterStopsCellEditing = false;
mxGraph.prototype.useScrollbarsForPanning = true;
mxGraph.prototype.exportEnabled = true;
mxGraph.prototype.importEnabled = true;
mxGraph.prototype.cellsLocked = false;
mxGraph.prototype.cellsCloneable = true;
mxGraph.prototype.foldingEnabled = true;
mxGraph.prototype.cellsEditable = true;
mxGraph.prototype.cellsDeletable = true;
mxGraph.prototype.cellsMovable = true;
mxGraph.prototype.edgeLabelsMovable = true;
mxGraph.prototype.vertexLabelsMovable = false;
mxGraph.prototype.dropEnabled = false;
mxGraph.prototype.splitEnabled = true;
mxGraph.prototype.cellsResizable = true;
mxGraph.prototype.cellsBendable = true;
mxGraph.prototype.cellsSelectable = true;
mxGraph.prototype.cellsDisconnectable = true;
mxGraph.prototype.autoSizeCells = false;
mxGraph.prototype.autoScroll = true;
mxGraph.prototype.autoExtend = true;
mxGraph.prototype.maximumGraphBounds = null;
mxGraph.prototype.minimumGraphSize = null;
mxGraph.prototype.minimumContainerSize = null;
mxGraph.prototype.maximumContainerSize = null;
mxGraph.prototype.resizeContainer = false;
mxGraph.prototype.border = 0;
mxGraph.prototype.ordered = true;
mxGraph.prototype.keepEdgesInForeground = false;
mxGraph.prototype.keepEdgesInBackground = true;
mxGraph.prototype.allowNegativeCoordinates = true;
mxGraph.prototype.constrainChildren = true;
mxGraph.prototype.extendParents = true;
mxGraph.prototype.extendParentsOnAdd = true;
mxGraph.prototype.collapseToPreferredSize = true;
mxGraph.prototype.zoomFactor = 1.2;
mxGraph.prototype.keepSelectionVisibleOnZoom = false;
mxGraph.prototype.centerZoom = true;
mxGraph.prototype.resetViewOnRootChange = true;
mxGraph.prototype.resetEdgesOnResize = false;
mxGraph.prototype.resetEdgesOnMove = false;
mxGraph.prototype.resetEdgesOnConnect = true;
mxGraph.prototype.allowLoops = false;
mxGraph.prototype.defaultLoopStyle = mxEdgeStyle.Loop;
mxGraph.prototype.multigraph = true;
mxGraph.prototype.connectableEdges = false;
mxGraph.prototype.allowDanglingEdges = true;
mxGraph.prototype.cloneInvalidEdges = false;
mxGraph.prototype.disconnectOnMove = true;
mxGraph.prototype.labelsVisible = true;
mxGraph.prototype.htmlLabels = false;
mxGraph.prototype.swimlaneSelectionEnabled = true;
mxGraph.prototype.swimlaneNesting = true;
mxGraph.prototype.swimlaneIndicatorColorAttribute = mxConstants.STYLE_FILLCOLOR;
mxGraph.prototype.imageBundles = null;
mxGraph.prototype.collapsedImage = new mxImage(mxClient.imageBasePath + "/collapsed.gif", 9, 9);
mxGraph.prototype.expandedImage = new mxImage(mxClient.imageBasePath + "/expanded.gif", 9, 9);
mxGraph.prototype.warningImage = new mxImage(mxClient.imageBasePath + "/warning" + ((mxClient.IS_MAC) ? ".png": ".gif"), 16, 16);
mxGraph.prototype.alreadyConnectedResource = (mxClient.language != "none") ? "alreadyConnected": "";
mxGraph.prototype.containsValidationErrorsResource = (mxClient.language != "none") ? "containsValidationErrors": "";
mxGraph.prototype.collapseExpandResource = (mxClient.language != "none") ? "collapse-expand": "";
mxGraph.prototype.init = function(a) {
	this.container = a;
	this.cellEditor = this.createCellEditor();
	this.view.init();
	this.sizeDidChange();
	if (mxClient.IS_IE) {
		mxEvent.addListener(window, "unload", mxUtils.bind(this,
		function() {
			this.destroy()
		}));
		mxEvent.addListener(a, "selectstart", mxUtils.bind(this,
		function() {
			return this.isEditing()
		}))
	}
};
mxGraph.prototype.createHandlers = function(a) {
	this.tooltipHandler = new mxTooltipHandler(this);
	this.tooltipHandler.setEnabled(false);
	this.panningHandler = new mxPanningHandler(this);
	this.panningHandler.panningEnabled = false;
	this.selectionCellsHandler = new mxSelectionCellsHandler(this);
	this.connectionHandler = new mxConnectionHandler(this);
	this.connectionHandler.setEnabled(false);
	this.graphHandler = new mxGraphHandler(this)
};
mxGraph.prototype.createSelectionModel = function() {
	return new mxGraphSelectionModel(this)
};
mxGraph.prototype.createStylesheet = function() {
	return new mxStylesheet()
};
mxGraph.prototype.createGraphView = function() {
	return new mxGraphView(this)
};
mxGraph.prototype.createCellRenderer = function() {
	return new mxCellRenderer()
};
mxGraph.prototype.createCellEditor = function() {
	return new mxCellEditor(this)
};
mxGraph.prototype.getModel = function() {
	return this.model
};
mxGraph.prototype.getView = function() {
	return this.view
};
mxGraph.prototype.getStylesheet = function() {
	return this.stylesheet
};
mxGraph.prototype.setStylesheet = function(a) {
	this.stylesheet = a
};
mxGraph.prototype.getSelectionModel = function() {
	return this.selectionModel
};
mxGraph.prototype.setSelectionModel = function(a) {
	this.selectionModel = a
};
mxGraph.prototype.getSelectionCellsForChanges = function(d) {
	var b = [];
	for (var c = 0; c < d.length; c++) {
		var e = d[c];
		if (e.constructor != mxRootChange) {
			var a = null;
			if (e instanceof mxChildChange && e.previous == null) {
				a = e.child
			} else {
				if (e.cell != null && e.cell instanceof mxCell) {
					a = e.cell
				}
			}
			if (a != null && mxUtils.indexOf(b, a) < 0) {
				b.push(a)
			}
		}
	}
	return this.getModel().getTopmostCells(b)
};
mxGraph.prototype.graphModelChanged = function(b) {
	for (var a = 0; a < b.length; a++) {
		this.processChange(b[a])
	}
	this.removeSelectionCells(this.getRemovedCellsForChanges(b));
	this.view.validate();
	this.sizeDidChange()
};
mxGraph.prototype.getRemovedCellsForChanges = function(c) {
	var a = [];
	for (var b = 0; b < c.length; b++) {
		var d = c[b];
		if (d instanceof mxRootChange) {
			break
		} else {
			if (d instanceof mxChildChange) {
				if (d.previous != null && d.parent == null) {
					a = a.concat(this.model.getDescendants(d.child))
				}
			} else {
				if (d instanceof mxVisibleChange) {
					a = a.concat(this.model.getDescendants(d.cell))
				}
			}
		}
	}
	return a
};
mxGraph.prototype.processChange = function(b) {
	if (b instanceof mxRootChange) {
		this.clearSelection();
		this.removeStateForCell(b.previous);
		if (this.resetViewOnRootChange) {
			this.view.scale = 1;
			this.view.translate.x = 0;
			this.view.translate.y = 0
		}
		this.fireEvent(new mxEventObject(mxEvent.ROOT))
	} else {
		if (b instanceof mxChildChange) {
			var a = this.model.getParent(b.child);
			if (a != null) {
				this.view.invalidate(b.child, true, false, b.previous != null)
			} else {
				this.removeStateForCell(b.child);
				if (this.view.currentRoot == b.child) {
					this.home()
				}
			}
			if (a != b.previous) {
				if (a != null) {
					this.view.invalidate(a, false, false)
				}
				if (b.previous != null) {
					this.view.invalidate(b.previous, false, false)
				}
			}
		} else {
			if (b instanceof mxTerminalChange || b instanceof mxGeometryChange) {
				this.view.invalidate(b.cell)
			} else {
				if (b instanceof mxValueChange) {
					this.view.invalidate(b.cell, false, false)
				} else {
					if (b instanceof mxStyleChange) {
						this.view.removeState(b.cell)
					} else {
						if (b.cell != null && b.cell instanceof mxCell) {
							this.removeStateForCell(b.cell)
						}
					}
				}
			}
		}
	}
};
mxGraph.prototype.removeStateForCell = function(a) {
	var b = this.model.getChildCount(a);
	for (var c = 0; c < b; c++) {
		this.removeStateForCell(this.model.getChildAt(a, c))
	}
	this.view.removeState(a)
};
mxGraph.prototype.addCellOverlay = function(a, b) {
	if (a.overlays == null) {
		a.overlays = []
	}
	a.overlays.push(b);
	var c = this.view.getState(a);
	if (c != null) {
		this.cellRenderer.redraw(c)
	}
	this.fireEvent(new mxEventObject(mxEvent.ADD_OVERLAY, "cell", a, "overlay", b));
	return b
};
mxGraph.prototype.getCellOverlays = function(a) {
	return a.overlays
};
mxGraph.prototype.removeCellOverlay = function(a, c) {
	if (c == null) {
		this.removeCellOverlays(a)
	} else {
		var b = mxUtils.indexOf(a.overlays, c);
		if (b >= 0) {
			a.overlays.splice(b, 1);
			if (a.overlays.length == 0) {
				a.overlays = null
			}
			var d = this.view.getState(a);
			if (d != null) {
				this.cellRenderer.redraw(d)
			}
			this.fireEvent(new mxEventObject(mxEvent.REMOVE_OVERLAY, "cell", a, "overlay", c))
		} else {
			c = null
		}
	}
	return c
};
mxGraph.prototype.removeCellOverlays = function(a) {
	var c = a.overlays;
	if (c != null) {
		a.overlays = null;
		var d = this.view.getState(a);
		if (d != null) {
			this.cellRenderer.redraw(d)
		}
		for (var b = 0; b < c.length; b++) {
			this.fireEvent(new mxEventObject(mxEvent.REMOVE_OVERLAY, "cell", a, "overlay", c[b]))
		}
	}
	return c
};
mxGraph.prototype.clearCellOverlays = function(a) {
	a = (a != null) ? a: this.model.getRoot();
	this.removeCellOverlays(a);
	var b = this.model.getChildCount(a);
	for (var c = 0; c < b; c++) {
		var d = this.model.getChildAt(a, c);
		this.clearCellOverlays(d)
	}
};
mxGraph.prototype.setCellWarning = function(a, d, b, e) {
	if (d != null && d.length > 0) {
		b = (b != null) ? b: this.warningImage;
		var c = new mxCellOverlay(b, "<font color=red>" + d + "</font>");
		if (e) {
			c.addListener(mxEvent.CLICK, mxUtils.bind(this,
			function(g, f) {
				if (this.isEnabled()) {
					this.setSelectionCell(a)
				}
			}))
		}
		return this.addCellOverlay(a, c)
	} else {
		this.removeCellOverlays(a)
	}
	return null
};
mxGraph.prototype.startEditing = function(a) {
	this.startEditingAtCell(null, a)
};
mxGraph.prototype.startEditingAtCell = function(a, b) {
	if (a == null) {
		a = this.getSelectionCell();
		if (a != null && !this.isCellEditable(a)) {
			a = null
		}
	}
	if (a != null) {
		this.fireEvent(new mxEventObject(mxEvent.START_EDITING, "cell", a, "event", b));
		this.cellEditor.startEditing(a, b)
	}
};
mxGraph.prototype.getEditingValue = function(a, b) {
	return this.convertValueToString(a)
};
mxGraph.prototype.stopEditing = function(a) {
	this.cellEditor.stopEditing(a)
};
mxGraph.prototype.labelChanged = function(a, c, b) {
	this.model.beginUpdate();
	try {
		this.cellLabelChanged(a, c, this.isAutoSizeCell(a));
		this.fireEvent(new mxEventObject(mxEvent.LABEL_CHANGED, "cell", a, "value", c, "event", b))
	} finally {
		this.model.endUpdate()
	}
	return a
};
mxGraph.prototype.cellLabelChanged = function(b, c, a) {
	this.model.beginUpdate();
	try {
		this.model.setValue(b, c);
		if (a) {
			this.cellSizeUpdated(b, false)
		}
	} finally {
		this.model.endUpdate()
	}
};
mxGraph.prototype.escape = function(a) {
	this.stopEditing(true);
	this.connectionHandler.reset();
	this.graphHandler.reset();
	var b = this.getSelectionCells();
	for (var c = 0; c < b.length; c++) {
		var d = this.view.getState(b[c]);
		if (d != null && d.handler != null) {
			d.handler.reset()
		}
	}
};
mxGraph.prototype.click = function(c) {
	var b = c.getEvent();
	var a = c.getCell();
	var e = new mxEventObject(mxEvent.CLICK, "event", b, "cell", a);
	if (c.isConsumed()) {
		e.consume()
	}
	this.fireEvent(e);
	if (this.isEnabled() && !mxEvent.isConsumed(b) && !e.isConsumed()) {
		if (a != null) {
			this.selectCellForEvent(a, b)
		} else {
			var d = null;
			if (this.isSwimlaneSelectionEnabled()) {
				d = this.getSwimlaneAt(c.getGraphX(), c.getGraphY())
			}
			if (d != null) {
				this.selectCellForEvent(d, b)
			} else {
				if (!this.isToggleEvent(b)) {
					this.clearSelection()
				}
			}
		}
	}
};
mxGraph.prototype.dblClick = function(b, a) {
	var c = new mxEventObject(mxEvent.DOUBLE_CLICK, "event", b, "cell", a);
	this.fireEvent(c);
	if (this.isEnabled() && !mxEvent.isConsumed(b) && !c.isConsumed() && a != null && this.isCellEditable(a)) {
		this.startEditingAtCell(a, b)
	}
};
mxGraph.prototype.scrollPointToVisible = function(k, h, f, e) {
	if (mxUtils.hasScrollbars(this.container)) {
		var g = this.container;
		e = (e != null) ? e: 20;
		if (k >= g.scrollLeft && h >= g.scrollTop && k <= g.scrollLeft + g.clientWidth && h <= g.scrollTop + g.clientHeight) {
			var n = g.scrollLeft + g.clientWidth - k;
			if (n < e) {
				var d = g.scrollLeft;
				g.scrollLeft += e - n;
				if (f && d == g.scrollLeft) {
					if (this.dialect == mxConstants.DIALECT_SVG) {
						var i = this.view.getDrawPane().ownerSVGElement;
						var a = this.container.scrollWidth + e - n;
						i.setAttribute("width", a)
					} else {
						var a = Math.max(g.clientWidth, g.scrollWidth) + e - n;
						var b = this.view.getCanvas();
						b.style.width = a + "px"
					}
					g.scrollLeft += e - n
				}
			} else {
				n = k - g.scrollLeft;
				if (n < e) {
					g.scrollLeft -= e - n
				}
			}
			var m = g.scrollTop + g.clientHeight - h;
			if (m < e) {
				var d = g.scrollTop;
				g.scrollTop += e - m;
				if (d == g.scrollTop && f) {
					if (this.dialect == mxConstants.DIALECT_SVG) {
						var i = this.view.getDrawPane().ownerSVGElement;
						var l = this.container.scrollHeight + e - m;
						i.setAttribute("height", l)
					} else {
						var l = Math.max(g.clientHeight, g.scrollHeight) + e - m;
						var b = this.view.getCanvas();
						b.style.height = l + "px"
					}
					g.scrollTop += e - m
				}
			} else {
				m = h - g.scrollTop;
				if (m < e) {
					g.scrollTop -= e - m
				}
			}
		}
	}
};
mxGraph.prototype.sizeDidChange = function() {
	var g = this.getGraphBounds();
	if (this.container != null) {
		var o = this.getBorder();
		var l = g.x + g.width + 1 + o;
		var k = g.y + g.height + 1 + o;
		if (this.minimumContainerSize != null) {
			l = Math.max(l, this.minimumContainerSize.width);
			k = Math.max(k, this.minimumContainerSize.height)
		}
		if (this.resizeContainer) {
			var i = l;
			var s = k;
			if (this.maximumContainerSize != null) {
				i = Math.min(this.maximumContainerSize.width, i);
				s = Math.min(this.maximumContainerSize.height, s)
			}
			this.container.style.width = i + "px";
			this.container.style.height = s + "px"
		}
		if (this.preferPageSize || (!mxClient.IS_IE && this.pageVisible)) {
			var t = this.view.scale;
			var a = this.view.translate;
			var b = this.pageFormat;
			var m = t * this.pageScale;
			var e = new mxRectangle(t * a.x, t * a.y, b.width * m, b.height * m);
			var f = (this.pageBreaksVisible) ? Math.ceil(l / e.width) : 1;
			var c = (this.pageBreaksVisible) ? Math.ceil(k / e.height) : 1;
			l = f * e.width + 2;
			k = c * e.height + 2
		}
		var r = 2 * (parseInt(this.container.style.borderWidth || 0) + parseInt(this.container.style.padding || 0));
		l = Math.max(l, this.container.offsetWidth - r);
		k = Math.max(k, this.container.offsetHeight - 3 - r);
		if (this.dialect == mxConstants.DIALECT_SVG) {
			var n = this.view.getDrawPane().ownerSVGElement;
			if (this.minimumGraphSize != null) {
				l = Math.max(l, this.minimumGraphSize.width * this.view.scale);
				k = Math.max(k, this.minimumGraphSize.height * this.view.scale)
			}
			n.setAttribute("width", l);
			n.setAttribute("height", k);
			if (l <= this.container.offsetWidth && this.container.clientWidth < this.container.offsetWidth) {
				var q = this.container.style.overflow;
				this.container.style.overflow = "hidden";
				this.container.scrollLeft = 1;
				this.container.style.overflow = q
			}
		} else {
			var p = this.view.getDrawPane();
			var d = this.view.getCanvas();
			p.style.width = l + "px";
			p.style.height = k + "px";
			d.style.width = l + "px";
			d.style.height = k + "px";
			if (this.minimumGraphSize != null) {
				l = Math.max(l, this.minimumGraphSize.width * this.view.scale);
				k = Math.max(k, this.minimumGraphSize.height * this.view.scale);
				d.style.width = l + "px";
				d.style.height = k + "px"
			}
		}
		this.updatePageBreaks(this.pageBreaksVisible, l - 1, k - 1)
	}
	this.fireEvent(new mxEventObject(mxEvent.SIZE, "bounds", g))
};
mxGraph.prototype.updatePageBreaks = function(h, e, o) {
	var k = this.view.scale;
	var m = this.view.translate;
	var g = this.pageFormat;
	var b = k * this.pageScale;
	var c = new mxRectangle(k * m.x, k * m.y, g.width * b, g.height * b);
	h = h && Math.min(c.width, c.height) > this.minPageBreakDist;
	c.x = mxUtils.mod(c.x, c.width);
	c.y = mxUtils.mod(c.y, c.height);
	var d = (h) ? Math.ceil((e - c.x) / c.width) : 0;
	var f = (h) ? Math.ceil((o - c.y) / c.height) : 0;
	var n = e;
	var a = o;
	if (this.horizontalPageBreaks == null && d > 0) {
		this.horizontalPageBreaks = []
	}
	if (this.horizontalPageBreaks != null) {
		for (var l = 0; l <= d; l++) {
			var q = [new mxPoint(c.x + l * c.width, 1), new mxPoint(c.x + l * c.width, a)];
			if (this.horizontalPageBreaks[l] != null) {
				this.horizontalPageBreaks[l].scale = k;
				this.horizontalPageBreaks[l].points = q;
				this.horizontalPageBreaks[l].redraw()
			} else {
				var p = new mxPolyline(q, this.pageBreakColor, this.scale);
				p.dialect = this.dialect;
				p.isDashed = this.pageBreakDashed;
				p.scale = k;
				p.crisp = true;
				p.init(this.view.backgroundPane);
				p.redraw();
				this.horizontalPageBreaks[l] = p
			}
		}
		for (var l = d; l < this.horizontalPageBreaks.length; l++) {
			this.horizontalPageBreaks[l].destroy()
		}
		this.horizontalPageBreaks.splice(d, this.horizontalPageBreaks.length - d)
	}
	if (this.verticalPageBreaks == null && f > 0) {
		this.verticalPageBreaks = []
	}
	if (this.verticalPageBreaks != null) {
		for (var l = 0; l <= f; l++) {
			var q = [new mxPoint(1, c.y + l * c.height), new mxPoint(n, c.y + l * c.height)];
			if (this.verticalPageBreaks[l] != null) {
				this.verticalPageBreaks[l].scale = k;
				this.verticalPageBreaks[l].points = q;
				this.verticalPageBreaks[l].redraw()
			} else {
				var p = new mxPolyline(q, this.pageBreakColor, k);
				p.dialect = this.dialect;
				p.isDashed = this.pageBreakDashed;
				p.scale = k;
				p.crisp = true;
				p.init(this.view.backgroundPane);
				p.redraw();
				this.verticalPageBreaks[l] = p
			}
		}
		for (var l = f; l < this.verticalPageBreaks.length; l++) {
			this.verticalPageBreaks[l].destroy()
		}
		this.verticalPageBreaks.splice(f, this.verticalPageBreaks.length - f)
	}
};
mxGraph.prototype.getCellStyle = function(a) {
	var c = this.model.getStyle(a);
	var b = null;
	if (this.model.isEdge(a)) {
		b = this.stylesheet.getDefaultEdgeStyle()
	} else {
		b = this.stylesheet.getDefaultVertexStyle()
	}
	if (c != null) {
		b = this.postProcessCellStyle(this.stylesheet.getCellStyle(c, b))
	}
	if (b == null) {
		b = mxGraph.prototype.EMPTY_ARRAY
	}
	return b
};
mxGraph.prototype.postProcessCellStyle = function(c) {
	if (c != null) {
		var b = c[mxConstants.STYLE_IMAGE];
		var d = this.getImageFromBundles(b);
		if (d != null) {
			c[mxConstants.STYLE_IMAGE] = d
		} else {
			d = b
		}
		if (d != null && d.substring(0, 11) == "data:image/") {
			var a = d.indexOf(",");
			if (a > 0) {
				d = d.substring(0, a) + ";base64," + d.substring(a + 1)
			}
			c[mxConstants.STYLE_IMAGE] = d
		}
	}
	return c
};
mxGraph.prototype.setCellStyle = function(c, a) {
	a = a || this.getSelectionCells();
	if (a != null) {
		this.model.beginUpdate();
		try {
			for (var b = 0; b < a.length; b++) {
				this.model.setStyle(a[b], c)
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.toggleCellStyle = function(c, b, a) {
	a = a || this.getSelectionCell();
	this.toggleCellStyles(c, b, [a])
};
mxGraph.prototype.toggleCellStyles = function(c, a, b) {
	a = (a != null) ? a: false;
	b = b || this.getSelectionCells();
	if (b != null && b.length > 0) {
		var e = this.view.getState(b[0]);
		var d = (e != null) ? e.style: this.getCellStyle(b[0]);
		if (d != null) {
			var f = (mxUtils.getValue(d, c, a)) ? 0 : 1;
			this.setCellStyles(c, f, b)
		}
	}
};
mxGraph.prototype.setCellStyles = function(b, c, a) {
	a = a || this.getSelectionCells();
	mxUtils.setCellStyles(this.model, a, b, c)
};
mxGraph.prototype.toggleCellStyleFlags = function(c, a, b) {
	this.setCellStyleFlags(c, a, null, b)
};
mxGraph.prototype.setCellStyleFlags = function(c, a, f, b) {
	b = b || this.getSelectionCells();
	if (b != null && b.length > 0) {
		if (f == null) {
			var e = this.view.getState(b[0]);
			var d = (e != null) ? e.style: this.getCellStyle(b[0]);
			if (d != null) {
				var g = parseInt(d[c] || 0);
				f = !((g & a) == a)
			}
		}
		mxUtils.setCellStyleFlags(this.model, b, c, a, f)
	}
};
mxGraph.prototype.alignCells = function(e, a, d) {
	if (a == null) {
		a = this.getSelectionCells()
	}
	if (a != null && a.length > 1) {
		if (d == null) {
			for (var b = 0; b < a.length; b++) {
				var c = this.getCellGeometry(a[b]);
				if (c != null && !this.model.isEdge(a[b])) {
					if (d == null) {
						if (e == mxConstants.ALIGN_CENTER) {
							d = c.x + c.width / 2;
							break
						} else {
							if (e == mxConstants.ALIGN_RIGHT) {
								d = c.x + c.width
							} else {
								if (e == mxConstants.ALIGN_TOP) {
									d = c.y
								} else {
									if (e == mxConstants.ALIGN_MIDDLE) {
										d = c.y + c.height / 2;
										break
									} else {
										if (e == mxConstants.ALIGN_BOTTOM) {
											d = c.y + c.height
										} else {
											d = c.x
										}
									}
								}
							}
						}
					} else {
						if (e == mxConstants.ALIGN_RIGHT) {
							d = Math.max(d, c.x + c.width)
						} else {
							if (e == mxConstants.ALIGN_TOP) {
								d = Math.min(d, c.y)
							} else {
								if (e == mxConstants.ALIGN_BOTTOM) {
									d = Math.max(d, c.y + c.height)
								} else {
									d = Math.min(d, c.x)
								}
							}
						}
					}
				}
			}
		}
		if (d != null) {
			this.model.beginUpdate();
			try {
				for (var b = 0; b < a.length; b++) {
					var c = this.getCellGeometry(a[b]);
					if (c != null && !this.model.isEdge(a[b])) {
						c = c.clone();
						if (e == mxConstants.ALIGN_CENTER) {
							c.x = d - c.width / 2
						} else {
							if (e == mxConstants.ALIGN_RIGHT) {
								c.x = d - c.width
							} else {
								if (e == mxConstants.ALIGN_TOP) {
									c.y = d
								} else {
									if (e == mxConstants.ALIGN_MIDDLE) {
										c.y = d - c.height / 2
									} else {
										if (e == mxConstants.ALIGN_BOTTOM) {
											c.y = d - c.height
										} else {
											c.x = d
										}
									}
								}
							}
						}
						this.model.setGeometry(a[b], c)
					}
				}
				this.fireEvent(new mxEventObject(mxEvent.ALIGN_CELLS, "align", e, "cells", a))
			} finally {
				this.model.endUpdate()
			}
		}
	}
	return a
};
mxGraph.prototype.flipEdge = function(b) {
	if (b != null && this.alternateEdgeStyle != null) {
		this.model.beginUpdate();
		try {
			var a = this.model.getStyle(b);
			if (a == null || a.length == 0) {
				this.model.setStyle(b, this.alternateEdgeStyle)
			} else {
				this.model.setStyle(b, null)
			}
			this.resetEdge(b);
			this.fireEvent(new mxEventObject(mxEvent.FLIP_EDGE, "edge", b))
		} finally {
			this.model.endUpdate()
		}
	}
	return b
};
mxGraph.prototype.addImageBundle = function(a) {
	this.imageBundles.push(a)
};
mxGraph.prototype.removeImageBundle = function(a) {
	var c = [];
	for (var b = 0; b < this.imageBundles.length; b++) {
		if (this.imageBundles[b] != a) {
			c.push(this.imageBundles[b])
		}
	}
	this.imageBundles = c
};
mxGraph.prototype.getImageFromBundles = function(b) {
	if (b != null) {
		for (var a = 0; a < this.imageBundles.length; a++) {
			var c = this.imageBundles[a].getImage(b);
			if (c != null) {
				return c
			}
		}
	}
	return null
};
mxGraph.prototype.orderCells = function(a, b) {
	if (b == null) {
		b = mxUtils.sortCells(this.getSelectionCells(), true)
	}
	this.model.beginUpdate();
	try {
		this.cellsOrdered(b, a);
		this.fireEvent(new mxEventObject(mxEvent.ORDER_CELLS, "back", a, "cells", b))
	} finally {
		this.model.endUpdate()
	}
	return b
};
mxGraph.prototype.cellsOrdered = function(b, a) {
	if (b != null) {
		this.model.beginUpdate();
		try {
			for (var c = 0; c < b.length; c++) {
				var d = this.model.getParent(b[c]);
				if (a) {
					this.model.add(d, b[c], c)
				} else {
					this.model.add(d, b[c], this.model.getChildCount(d) - 1)
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_ORDERED, "back", a, "cells", b))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.groupCells = function(f, c, b) {
	if (b == null) {
		b = mxUtils.sortCells(this.getSelectionCells(), true)
	}
	b = this.getCellsForGroup(b);
	if (f == null) {
		f = this.createGroupCell(b)
	}
	var e = this.getBoundsForGroup(f, b, c);
	if (b.length > 0 && e != null) {
		var d = this.model.getParent(b[0]);
		this.model.beginUpdate();
		try {
			if (this.getCellGeometry(f) == null) {
				this.model.setGeometry(f, new mxGeometry())
			}
			var a = this.model.getChildCount(f);
			this.cellsAdded(b, f, a, null, null, false);
			this.cellsMoved(b, -e.x, -e.y, false, true);
			a = this.model.getChildCount(d);
			this.cellsAdded([f], d, a, null, null, false);
			this.cellsResized([f], [e]);
			this.fireEvent(new mxEventObject(mxEvent.GROUP_CELLS, "group", f, "border", c, "cells", b))
		} finally {
			this.model.endUpdate()
		}
	}
	return f
};
mxGraph.prototype.getCellsForGroup = function(b) {
	var a = [];
	if (b != null && b.length > 0) {
		var d = this.model.getParent(b[0]);
		a.push(b[0]);
		for (var c = 1; c < b.length; c++) {
			if (this.model.getParent(b[c]) == d) {
				a.push(b[c])
			}
		}
	}
	return a
};
mxGraph.prototype.getBoundsForGroup = function(e, d, b) {
	var a = this.getBoundingBoxFromGeometry(d);
	if (a != null) {
		if (this.isSwimlane(e)) {
			var c = this.getStartSize(e);
			a.x -= c.width;
			a.y -= c.height;
			a.width += c.width;
			a.height += c.height
		}
		a.x -= b;
		a.y -= b;
		a.width += 2 * b;
		a.height += 2 * b
	}
	return a
};
mxGraph.prototype.createGroupCell = function(a) {
	var b = new mxCell("");
	b.setVertex(true);
	b.setConnectable(false);
	return b
};
mxGraph.prototype.ungroupCells = function(c) {
	var a = [];
	if (c == null) {
		c = this.getSelectionCells();
		var f = [];
		for (var e = 0; e < c.length; e++) {
			if (this.model.getChildCount(c[e]) > 0) {
				f.push(c[e])
			}
		}
		c = f
	}
	if (c != null && c.length > 0) {
		this.model.beginUpdate();
		try {
			for (var e = 0; e < c.length; e++) {
				var d = this.model.getChildren(c[e]);
				if (d != null && d.length > 0) {
					d = d.slice();
					var g = this.model.getParent(c[e]);
					var b = this.model.getChildCount(g);
					this.cellsAdded(d, g, b, null, null, true);
					a = a.concat(d)
				}
			}
			this.cellsRemoved(this.addAllEdges(c));
			this.fireEvent(new mxEventObject(mxEvent.UNGROUP_CELLS, "cells", c))
		} finally {
			this.model.endUpdate()
		}
	}
	return a
};
mxGraph.prototype.removeCellsFromParent = function(b) {
	if (b == null) {
		b = this.getSelectionCells()
	}
	this.model.beginUpdate();
	try {
		var c = this.getDefaultParent();
		var a = this.model.getChildCount(c);
		this.cellsAdded(b, c, a, null, null, true);
		this.fireEvent(new mxEventObject(mxEvent.REMOVE_CELLS_FROM_PARENT, "cells", b))
	} finally {
		this.model.endUpdate()
	}
	return b
};
mxGraph.prototype.updateGroupBounds = function(c, b, a) {
	if (c == null) {
		c = this.getSelectionCells()
	}
	b = (b != null) ? b: 0;
	a = (a != null) ? a: false;
	this.model.beginUpdate();
	try {
		for (var f = 0; f < c.length; f++) {
			var h = this.getCellGeometry(c[f]);
			if (h != null) {
				var e = this.getChildCells(c[f]);
				if (e != null && e.length > 0) {
					var g = this.getBoundingBoxFromGeometry(e);
					if (g.width > 0 && g.height > 0) {
						var d = (this.isSwimlane(c[f])) ? this.getStartSize(c[f]) : new mxRectangle();
						h = h.clone();
						if (a) {
							h.x += g.x - d.width - b;
							h.y += g.y - d.height - b
						}
						h.width = g.width + d.width + 2 * b;
						h.height = g.height + d.height + 2 * b;
						this.model.setGeometry(c[f], h);
						this.moveCells(e, -g.x + d.width + b, -g.y + d.height + b)
					}
				}
			}
		}
	} finally {
		this.model.endUpdate()
	}
	return c
};
mxGraph.prototype.cloneCells = function(c, v) {
	v = (v != null) ? v: true;
	var a = null;
	if (c != null) {
		var b = new Object();
		var w = [];
		for (var s = 0; s < c.length; s++) {
			var o = mxCellPath.create(c[s]);
			b[o] = c[s];
			w.push(c[s])
		}
		if (w.length > 0) {
			var y = this.view.scale;
			var d = this.view.translate;
			a = this.model.cloneCells(c, true);
			for (var s = 0; s < c.length; s++) {
				if (!v && this.model.isEdge(a[s]) && this.getEdgeValidationError(a[s], this.model.getTerminal(a[s], true), this.model.getTerminal(a[s], false)) != null) {
					a[s] = null
				} else {
					var u = this.model.getGeometry(a[s]);
					if (u != null) {
						var e = this.view.getState(c[s]);
						var x = this.view.getState(this.model.getParent(c[s]));
						if (e != null && x != null) {
							var m = x.origin.x;
							var l = x.origin.y;
							if (this.model.isEdge(a[s])) {
								var z = e.absolutePoints;
								var h = this.model.getTerminal(c[s], true);
								var k = mxCellPath.create(h);
								while (h != null && b[k] == null) {
									h = this.model.getParent(h);
									k = mxCellPath.create(h)
								}
								if (h == null) {
									u.setTerminalPoint(new mxPoint(z[0].x / y - d.x, z[0].y / y - d.y), true)
								}
								var t = this.model.getTerminal(c[s], false);
								var f = mxCellPath.create(t);
								while (t != null && b[f] == null) {
									t = this.model.getParent(t);
									f = mxCellPath.create(t)
								}
								if (t == null) {
									var p = z.length - 1;
									u.setTerminalPoint(new mxPoint(z[p].x / y - d.x, z[p].y / y - d.y), false)
								}
								var r = u.points;
								if (r != null) {
									for (var q = 0; q < r.length; q++) {
										r[q].x += m;
										r[q].y += l
									}
								}
							} else {
								u.x += m;
								u.y += l
							}
						}
					}
				}
			}
		} else {
			a = []
		}
	}
	return a
};
mxGraph.prototype.insertVertex = function(i, c, h, g, f, d, k, b, a) {
	var e = this.createVertex(i, c, h, g, f, d, k, b, a);
	return this.addCell(e, i)
};
mxGraph.prototype.createVertex = function(k, c, i, h, g, d, l, b, a) {
	var f = new mxGeometry(h, g, d, l);
	f.relative = (a != null) ? a: false;
	var e = new mxCell(i, f, b);
	e.setId(c);
	e.setVertex(true);
	e.setConnectable(true);
	return e
};
mxGraph.prototype.insertEdge = function(b, g, e, d, f, a) {
	var c = this.createEdge(b, g, e, d, f, a);
	return this.addEdge(c, b, d, f)
};
mxGraph.prototype.createEdge = function(b, g, e, d, f, a) {
	var c = new mxCell(e, new mxGeometry(), a);
	c.setId(g);
	c.setEdge(true);
	c.geometry.relative = true;
	return c
};
mxGraph.prototype.addEdge = function(c, b, d, e, a) {
	return this.addCell(c, b, a, d, e)
};
mxGraph.prototype.addCell = function(a, c, b, d, e) {
	return this.addCells([a], c, b, d, e)[0]
};
mxGraph.prototype.addCells = function(b, c, a, d, e) {
	if (c == null) {
		c = this.getDefaultParent()
	}
	if (a == null) {
		a = this.model.getChildCount(c)
	}
	this.model.beginUpdate();
	try {
		this.cellsAdded(b, c, a, d, e, false);
		this.fireEvent(new mxEventObject(mxEvent.ADD_CELLS, "cells", b, "parent", c, "index", a, "source", d, "target", e))
	} finally {
		this.model.endUpdate()
	}
	return b
};
mxGraph.prototype.cellsAdded = function(q, n, h, a, k, m) {
	if (q != null && n != null && h != null) {
		this.model.beginUpdate();
		try {
			var o = (m) ? this.view.getState(n) : null;
			var c = (o != null) ? o.origin: null;
			var l = new mxPoint(0, 0);
			for (var f = 0; f < q.length; f++) {
				var g = this.model.getParent(q[f]);
				if (c != null && q[f] != n && n != g) {
					var d = this.view.getState(g);
					var b = (d != null) ? d.origin: l;
					var e = this.model.getGeometry(q[f]);
					if (e != null) {
						var r = b.x - c.x;
						var p = b.y - c.y;
						e = e.clone();
						e.translate(r, p);
						if (!e.relative && this.model.isVertex(q[f]) && !this.isAllowNegativeCoordinates()) {
							e.x = Math.max(0, e.x);
							e.y = Math.max(0, e.y)
						}
						this.model.setGeometry(q[f], e)
					}
				}
				if (n == g) {
					h--
				}
				this.model.add(n, q[f], h + f);
				if (this.isExtendParentsOnAdd() && this.isExtendParent(q[f])) {
					this.extendParent(q[f])
				}
				this.constrainChild(q[f]);
				if (a != null) {
					this.cellConnected(q[f], a, true)
				}
				if (k != null) {
					this.cellConnected(q[f], k, false)
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_ADDED, "cells", q, "parent", n, "index", h, "source", a, "target", k, "absolute", m))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.removeCells = function(a, b) {
	b = (b != null) ? b: true;
	if (a == null) {
		a = this.getDeletableCells(this.getSelectionCells())
	}
	if (b) {
		a = this.getDeletableCells(this.addAllEdges(a))
	}
	this.model.beginUpdate();
	try {
		this.cellsRemoved(a);
		this.fireEvent(new mxEventObject(mxEvent.REMOVE_CELLS, "cells", a, "includeEdges", b))
	} finally {
		this.model.endUpdate()
	}
	return a
};
mxGraph.prototype.cellsRemoved = function(o) {
	if (o != null && o.length > 0) {
		var e = this.view.scale;
		var m = this.view.translate;
		this.model.beginUpdate();
		try {
			var k = new Object();
			for (var l = 0; l < o.length; l++) {
				var c = mxCellPath.create(o[l]);
				k[c] = o[l]
			}
			for (var l = 0; l < o.length; l++) {
				var g = this.getConnections(o[l]);
				for (var f = 0; f < g.length; f++) {
					var c = mxCellPath.create(g[f]);
					if (k[c] == null) {
						var h = this.model.getGeometry(g[f]);
						if (h != null) {
							var b = this.view.getState(g[f]);
							if (b != null) {
								h = h.clone();
								var a = this.view.getVisibleTerminal(g[f], true) == o[l];
								var p = b.absolutePoints;
								var d = (a) ? 0 : p.length - 1;
								h.setTerminalPoint(new mxPoint(p[d].x / e - m.x, p[d].y / e - m.y), a);
								this.model.setTerminal(g[f], null, a);
								this.model.setGeometry(g[f], h)
							}
						}
					}
				}
				this.model.remove(o[l])
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_REMOVED, "cells", o))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.splitEdge = function(f, c, d, b, a) {
	b = b || 0;
	a = a || 0;
	if (d == null) {
		d = this.cloneCells([f])[0]
	}
	var e = this.model.getParent(f);
	var g = this.model.getTerminal(f, true);
	this.model.beginUpdate();
	try {
		this.cellsMoved(c, b, a, false, false);
		this.cellsAdded(c, e, this.model.getChildCount(e), null, null, true);
		this.cellsAdded([d], e, this.model.getChildCount(e), g, c[0], false);
		this.cellConnected(f, c[0], true);
		this.fireEvent(new mxEventObject(mxEvent.SPLIT_EDGE, "edge", f, "cells", c, "newEdge", d, "dx", b, "dy", a))
	} finally {
		this.model.endUpdate()
	}
	return d
};
mxGraph.prototype.toggleCells = function(a, b, c) {
	if (b == null) {
		b = this.getSelectionCells()
	}
	if (c) {
		b = this.addAllEdges(b)
	}
	this.model.beginUpdate();
	try {
		this.cellsToggled(b, a);
		this.fireEvent(new mxEventObject(mxEvent.TOGGLE_CELLS, "show", a, "cells", b, "includeEdges", c))
	} finally {
		this.model.endUpdate()
	}
	return b
};
mxGraph.prototype.cellsToggled = function(b, a) {
	if (b != null && b.length > 0) {
		this.model.beginUpdate();
		try {
			for (var c = 0; c < b.length; c++) {
				this.model.setVisible(b[c], a)
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.foldCells = function(c, b, a) {
	b = (b != null) ? b: false;
	if (a == null) {
		a = this.getFoldableCells(this.getSelectionCells(), c)
	}
	this.stopEditing(false);
	this.model.beginUpdate();
	try {
		this.cellsFolded(a, c, b);
		this.fireEvent(new mxEventObject(mxEvent.FOLD_CELLS, "collapse", c, "recurse", b, "cells", a))
	} finally {
		this.model.endUpdate()
	}
	return a
};
mxGraph.prototype.cellsFolded = function(a, e, d) {
	if (a != null && a.length > 0) {
		this.model.beginUpdate();
		try {
			for (var c = 0; c < a.length; c++) {
				if (e != this.isCellCollapsed(a[c])) {
					this.model.setCollapsed(a[c], e);
					this.swapBounds(a[c], e);
					if (this.isExtendParent(a[c])) {
						this.extendParent(a[c])
					}
					if (d) {
						var b = this.model.getChildren(a[c]);
						this.foldCells(b, e, d)
					}
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_FOLDED, "cells", a, "collapse", e, "recurse", d))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.swapBounds = function(a, b) {
	if (a != null) {
		var c = this.model.getGeometry(a);
		if (c != null) {
			c = c.clone();
			this.updateAlternateBounds(a, c, b);
			c.swap();
			this.model.setGeometry(a, c)
		}
	}
};
mxGraph.prototype.updateAlternateBounds = function(a, h, g) {
	if (a != null && h != null) {
		if (h.alternateBounds == null) {
			var e = h;
			if (this.collapseToPreferredSize) {
				var c = this.getPreferredSizeForCell(a);
				if (c != null) {
					e = c;
					var f = this.view.getState(a);
					var d = (f != null) ? f.style: this.getCellStyle(a);
					var b = mxUtils.getValue(d, mxConstants.STYLE_STARTSIZE);
					if (b > 0) {
						e.height = Math.max(e.height, b)
					}
				}
			}
			h.alternateBounds = new mxRectangle(h.x, h.y, e.width, e.height)
		} else {
			h.alternateBounds.x = h.x;
			h.alternateBounds.y = h.y
		}
	}
};
mxGraph.prototype.addAllEdges = function(a) {
	var b = a.slice();
	b = b.concat(this.getAllEdges(a));
	return b
};
mxGraph.prototype.getAllEdges = function(c) {
	var a = [];
	if (c != null) {
		for (var e = 0; e < c.length; e++) {
			var f = this.model.getEdgeCount(c[e]);
			for (var b = 0; b < f; b++) {
				a.push(this.model.getEdgeAt(c[e], b))
			}
			var d = this.model.getChildren(c[e]);
			a = a.concat(this.getAllEdges(d))
		}
	}
	return a
};
mxGraph.prototype.updateCellSize = function(b, a) {
	a = (a != null) ? a: false;
	this.model.beginUpdate();
	try {
		this.cellSizeUpdated(b, a);
		this.fireEvent(new mxEventObject(mxEvent.UPDATE_CELL_SIZE, "cell", b, "ignoreChildren", a))
	} finally {
		this.model.endUpdate()
	}
	return b
};
mxGraph.prototype.cellSizeUpdated = function(l, f) {
	if (l != null) {
		this.model.beginUpdate();
		try {
			var n = this.getPreferredSizeForCell(l);
			var i = this.model.getGeometry(l);
			if (n != null && i != null) {
				var h = this.isCellCollapsed(l);
				i = i.clone();
				if (this.isSwimlane(l)) {
					var b = this.view.getState(l);
					var c = (b != null) ? b.style: this.getCellStyle(l);
					var e = this.model.getStyle(l);
					if (e == null) {
						e = ""
					}
					if (mxUtils.getValue(c, mxConstants.STYLE_HORIZONTAL, true)) {
						e = mxUtils.setStyle(e, mxConstants.STYLE_STARTSIZE, n.height + 8);
						if (h) {
							i.height = n.height + 8
						}
						i.width = n.width
					} else {
						e = mxUtils.setStyle(e, mxConstants.STYLE_STARTSIZE, n.width + 8);
						if (h) {
							i.width = n.width + 8
						}
						i.height = n.height
					}
					this.model.setStyle(l, e)
				} else {
					i.width = n.width;
					i.height = n.height
				}
				if (!f && !h) {
					var a = this.view.getBounds(this.model.getChildren(l));
					if (a != null) {
						var k = this.view.translate;
						var g = this.view.scale;
						var d = (a.x + a.width) / g - i.x - k.x;
						var m = (a.y + a.height) / g - i.y - k.y;
						i.width = Math.max(i.width, d);
						i.height = Math.max(i.height, m)
					}
				}
				this.cellsResized([l], [i])
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.getPreferredSizeForCell = function(h) {
	var o = null;
	if (h != null) {
		var a = this.view.getState(h);
		var b = (a != null) ? a.style: this.getCellStyle(h);
		if (b != null && !this.model.isEdge(h)) {
			var m = b[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
			var n = 0;
			var k = 0;
			if (this.getImage(a) != null || b[mxConstants.STYLE_IMAGE] != null) {
				if (b[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_LABEL) {
					if (b[mxConstants.STYLE_VERTICAL_ALIGN] == mxConstants.ALIGN_MIDDLE) {
						n += parseFloat(b[mxConstants.STYLE_IMAGE_WIDTH]) || mxLabel.prototype.imageSize
					}
					if (b[mxConstants.STYLE_ALIGN] != mxConstants.ALIGN_CENTER) {
						k += parseFloat(b[mxConstants.STYLE_IMAGE_HEIGHT]) || mxLabel.prototype.imageSize
					}
				}
			}
			n += 2 * (b[mxConstants.STYLE_SPACING] || 0);
			n += b[mxConstants.STYLE_SPACING_LEFT] || 0;
			n += b[mxConstants.STYLE_SPACING_RIGHT] || 0;
			k += 2 * (b[mxConstants.STYLE_SPACING] || 0);
			k += b[mxConstants.STYLE_SPACING_TOP] || 0;
			k += b[mxConstants.STYLE_SPACING_BOTTOM] || 0;
			var e = this.getFoldingImage(a);
			if (e != null) {
				n += e.width + 8
			}
			var g = this.getLabel(h);
			if (g != null && g.length > 0) {
				if (!this.isHtmlLabel(h)) {
					g = g.replace(/\n/g, "<br>")
				}
				var l = mxUtils.getSizeForString(g, m, b[mxConstants.STYLE_FONTFAMILY]);
				var c = l.width + n;
				var i = l.height + k;
				if (!mxUtils.getValue(b, mxConstants.STYLE_HORIZONTAL, true)) {
					var f = i;
					i = c;
					c = f
				}
				if (this.gridEnabled) {
					c = this.snap(c + this.gridSize / 2);
					i = this.snap(i + this.gridSize / 2)
				}
				o = new mxRectangle(0, 0, c, i)
			} else {
				var d = 4 * this.gridSize;
				o = new mxRectangle(0, 0, d, d)
			}
		}
	}
	return o
};
mxGraph.prototype.handleGesture = function(b, k) {
	if (Math.abs(1 - k.scale) > 0.2) {
		var c = this.view.scale;
		var e = this.view.translate;
		var i = b.width * k.scale;
		var d = b.height * k.scale;
		var g = b.x - (i - b.width) / 2;
		var f = b.y - (d - b.height) / 2;
		var a = new mxRectangle(this.snap(g / c) - e.x, this.snap(f / c) - e.y, this.snap(i / c), this.snap(d / c));
		this.resizeCell(b.cell, a)
	}
};
mxGraph.prototype.resizeCell = function(a, b) {
	return this.resizeCells([a], [b])[0]
};
mxGraph.prototype.resizeCells = function(a, b) {
	this.model.beginUpdate();
	try {
		this.cellsResized(a, b);
		this.fireEvent(new mxEventObject(mxEvent.RESIZE_CELLS, "cells", a, "bounds", b))
	} finally {
		this.model.endUpdate()
	}
	return a
};
mxGraph.prototype.cellsResized = function(a, d) {
	if (a != null && d != null && a.length == d.length) {
		this.model.beginUpdate();
		try {
			for (var c = 0; c < a.length; c++) {
				var b = d[c];
				var e = this.model.getGeometry(a[c]);
				if (e != null && (e.x != b.x || e.y != b.y || e.width != b.width || e.height != b.height)) {
					e = e.clone();
					if (e.relative) {
						var f = e.offset;
						if (f != null) {
							f.x += b.x - e.x;
							f.y += b.y - e.y
						}
					} else {
						e.x = b.x;
						e.y = b.y
					}
					e.width = b.width;
					e.height = b.height;
					if (!e.relative && this.model.isVertex(a[c]) && !this.isAllowNegativeCoordinates()) {
						e.x = Math.max(0, e.x);
						e.y = Math.max(0, e.y)
					}
					this.model.setGeometry(a[c], e);
					if (this.isExtendParent(a[c])) {
						this.extendParent(a[c])
					}
				}
			}
			if (this.resetEdgesOnResize) {
				this.resetEdges(a)
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_RESIZED, "cells", a, "bounds", d))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.extendParent = function(a) {
	if (a != null) {
		var b = this.model.getParent(a);
		var d = this.model.getGeometry(b);
		if (b != null && d != null && !this.isCellCollapsed(b)) {
			var c = this.model.getGeometry(a);
			if (c != null && (d.width < c.x + c.width || d.height < c.y + c.height)) {
				d = d.clone();
				d.width = Math.max(d.width, c.x + c.width);
				d.height = Math.max(d.height, c.y + c.height);
				this.cellsResized([b], [d])
			}
		}
	}
};
mxGraph.prototype.importCells = function(d, c, b, e, a) {
	return this.moveCells(d, c, b, true, e, a)
};
mxGraph.prototype.moveCells = function(e, c, b, g, f, a) {
	if (e != null && (c != 0 || b != 0 || g || f != null)) {
		this.model.beginUpdate();
		try {
			if (g) {
				e = this.cloneCells(e, this.isCloneInvalidEdges());
				if (f == null) {
					f = this.getDefaultParent()
				}
			}
			this.cellsMoved(e, c, b, !g && this.isDisconnectOnMove() && this.isAllowDanglingEdges(), f == null);
			if (f != null) {
				var d = this.model.getChildCount(f);
				this.cellsAdded(e, f, d, null, null, true)
			}
			this.fireEvent(new mxEventObject(mxEvent.MOVE_CELLS, "cells", e, "dx", c, "dy", b, "clone", g, "target", f, "event", a))
		} finally {
			this.model.endUpdate()
		}
	}
	return e
};
mxGraph.prototype.cellsMoved = function(d, c, a, b, f) {
	if (d != null && (c != 0 || a != 0)) {
		this.model.beginUpdate();
		try {
			if (b) {
				this.disconnectGraph(d)
			}
			for (var e = 0; e < d.length; e++) {
				this.translateCell(d[e], c, a);
				if (f) {
					this.constrainChild(d[e])
				}
			}
			if (this.resetEdgesOnMove) {
				this.resetEdges(d)
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_MOVED, "cells", d, "dx", a, "dy", a, "disconnect", b))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.translateCell = function(a, c, b) {
	var d = this.model.getGeometry(a);
	if (d != null) {
		d = d.clone();
		d.translate(c, b);
		if (!d.relative && this.model.isVertex(a) && !this.isAllowNegativeCoordinates()) {
			d.x = Math.max(0, d.x);
			d.y = Math.max(0, d.y)
		}
		if (d.relative && !this.model.isEdge(a)) {
			if (d.offset == null) {
				d.offset = new mxPoint(c, b)
			} else {
				d.offset.x += c;
				d.offset.y += b
			}
		}
		this.model.setGeometry(a, d)
	}
};
mxGraph.prototype.getCellContainmentArea = function(b) {
	if (b != null && !this.model.isEdge(b)) {
		var f = this.model.getParent(b);
		if (f == this.getDefaultParent() || f == this.getCurrentRoot()) {
			return this.getMaximumGraphBounds()
		} else {
			if (f != null && f != this.getDefaultParent()) {
				var i = this.model.getGeometry(f);
				if (i != null) {
					var a = 0;
					var k = 0;
					var c = i.width;
					var e = i.height;
					if (this.isSwimlane(f)) {
						var d = this.getStartSize(f);
						a = d.width;
						c -= d.width;
						k = d.height;
						e -= d.height
					}
					return new mxRectangle(a, k, c, e)
				}
			}
		}
	}
	return null
};
mxGraph.prototype.getMaximumGraphBounds = function() {
	return this.maximumGraphBounds
};
mxGraph.prototype.constrainChild = function(a) {
	if (a != null) {
		var d = this.model.getGeometry(a);
		var c = (this.isConstrainChild(a)) ? this.getCellContainmentArea(a) : this.getMaximumGraphBounds();
		if (d != null && c != null) {
			if (!d.relative && (d.x < c.x || d.y < c.y || c.width < d.x + d.width || c.height < d.y + d.height)) {
				var b = this.getOverlap(a);
				if (c.width > 0) {
					d.x = Math.min(d.x, c.x + c.width - (1 - b) * d.width)
				}
				if (c.height > 0) {
					d.y = Math.min(d.y, c.y + c.height - (1 - b) * d.height)
				}
				d.x = Math.max(d.x, c.x - d.width * b);
				d.y = Math.max(d.y, c.y - d.height * b)
			}
		}
	}
};
mxGraph.prototype.resetEdges = function(l) {
	if (l != null) {
		var e = new Object();
		for (var f = 0; f < l.length; f++) {
			var b = mxCellPath.create(l[f]);
			e[b] = l[f]
		}
		this.model.beginUpdate();
		try {
			for (var f = 0; f < l.length; f++) {
				var d = this.model.getEdges(l[f]);
				if (d != null) {
					for (var c = 0; c < d.length; c++) {
						var a = this.view.getVisibleTerminal(d[c], true);
						var k = mxCellPath.create(a);
						var g = this.view.getVisibleTerminal(d[c], false);
						var h = mxCellPath.create(g);
						if (e[k] == null || e[h] == null) {
							this.resetEdge(d[c])
						}
					}
				}
				this.resetEdges(this.model.getChildren(l[f]))
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.resetEdge = function(a) {
	var b = this.model.getGeometry(a);
	if (b != null && b.points != null && b.points.length > 0) {
		b = b.clone();
		b.points = [];
		this.model.setGeometry(a, b)
	}
	return a
};
mxGraph.prototype.getAllConnectionConstraints = function(a, b) {
	if (a != null && a.shape != null && a.shape instanceof mxStencilShape) {
		if (a.shape.stencil != null) {
			return a.shape.stencil.constraints
		}
	}
	return null
};
mxGraph.prototype.getConnectionConstraint = function(e, d, f) {
	var b = null;
	var a = e.style[(f) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X];
	if (a != null) {
		var g = e.style[(f) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y];
		if (g != null) {
			b = new mxPoint(parseFloat(a), parseFloat(g))
		}
	}
	var c = false;
	if (b != null) {
		c = mxUtils.getValue(e.style, (f) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, true)
	}
	return new mxConnectionConstraint(b, c)
};
mxGraph.prototype.setConnectionConstraint = function(b, a, c, d) {
	if (d != null) {
		this.model.beginUpdate();
		try {
			if (d == null || d.point == null) {
				this.setCellStyles((c) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X, null, [b]);
				this.setCellStyles((c) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y, null, [b]);
				this.setCellStyles((c) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, null, [b])
			} else {
				if (d.point != null) {
					this.setCellStyles((c) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X, d.point.x, [b]);
					this.setCellStyles((c) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y, d.point.y, [b]);
					if (!d.perimeter) {
						this.setCellStyles((c) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, "0", [b])
					} else {
						this.setCellStyles((c) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, null, [b])
					}
				}
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.getConnectionPoint = function(g, b) {
	var l = null;
	if (g != null) {
		var a = this.view.getPerimeterBounds(g);
		var e = new mxPoint(a.getCenterX(), a.getCenterY());
		var k = g.style[mxConstants.STYLE_DIRECTION];
		var d = 0;
		if (k != null) {
			if (k == "north") {
				d += 270
			} else {
				if (k == "west") {
					d += 180
				} else {
					if (k == "south") {
						d += 90
					}
				}
			}
			if (k == "north" || k == "south") {
				a.x += a.width / 2 - a.height / 2;
				a.y += a.height / 2 - a.width / 2;
				var f = a.width;
				a.width = a.height;
				a.height = f
			}
		}
		if (b.point != null) {
			l = new mxPoint(a.x + b.point.x * a.width, a.y + b.point.y * a.height)
		}
		var c = g.style[mxConstants.STYLE_ROTATION] || 0;
		if (b.perimeter) {
			if (d != 0 && l != null) {
				var m = 0;
				var i = 0;
				if (d == 90) {
					i = 1
				} else {
					if (d == 180) {
						m = -1
					} else {
						if (c == 270) {
							i = -1
						}
					}
				}
				l = mxUtils.getRotatedPoint(l, m, i, e)
			}
			if (l != null && b.perimeter) {
				l = this.view.getPerimeterPoint(g, l, false)
			}
		} else {
			c += d
		}
		if (c != 0 && l != null) {
			var h = mxUtils.toRadians(c);
			var m = Math.cos(h);
			var i = Math.sin(h);
			l = mxUtils.getRotatedPoint(l, m, i, e)
		}
	}
	return l
};
mxGraph.prototype.connectCell = function(c, a, d, e) {
	this.model.beginUpdate();
	try {
		var b = this.model.getTerminal(c, d);
		this.cellConnected(c, a, d, e);
		this.fireEvent(new mxEventObject(mxEvent.CONNECT_CELL, "edge", c, "terminal", a, "source", d, "previous", b))
	} finally {
		this.model.endUpdate()
	}
	return c
};
mxGraph.prototype.cellConnected = function(d, b, e, f) {
	if (d != null) {
		this.model.beginUpdate();
		try {
			var c = this.model.getTerminal(d, e);
			this.setConnectionConstraint(d, b, e, f);
			if (this.isPortsEnabled()) {
				var g = null;
				if (this.isPort(b)) {
					g = b.getId();
					b = this.getTerminalForPort(b, e)
				}
				var a = (e) ? mxConstants.STYLE_SOURCE_PORT: mxConstants.STYLE_TARGET_PORT;
				this.setCellStyles(a, g, [d])
			}
			this.model.setTerminal(d, b, e);
			if (this.resetEdgesOnConnect) {
				this.resetEdge(d)
			}
			this.fireEvent(new mxEventObject(mxEvent.CELL_CONNECTED, "edge", d, "terminal", b, "source", e, "previous", c))
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.disconnectGraph = function(r) {
	if (r != null) {
		this.model.beginUpdate();
		try {
			var g = this.view.scale;
			var o = this.view.translate;
			var k = new Object();
			for (var m = 0; m < r.length; m++) {
				var e = mxCellPath.create(r[m]);
				k[e] = r[m]
			}
			for (var m = 0; m < r.length; m++) {
				if (this.model.isEdge(r[m])) {
					var l = this.model.getGeometry(r[m]);
					if (l != null) {
						var d = this.view.getState(r[m]);
						var h = this.view.getState(this.model.getParent(r[m]));
						if (d != null && h != null) {
							l = l.clone();
							var t = -h.origin.x;
							var q = -h.origin.y;
							var s = d.absolutePoints;
							var b = this.model.getTerminal(r[m], true);
							if (b != null && this.isCellDisconnectable(r[m], b, true)) {
								var a = mxCellPath.create(b);
								while (b != null && k[a] == null) {
									b = this.model.getParent(b);
									a = mxCellPath.create(b)
								}
								if (b == null) {
									l.setTerminalPoint(new mxPoint(s[0].x / g - o.x + t, s[0].y / g - o.y + q), true);
									this.model.setTerminal(r[m], null, true)
								}
							}
							var c = this.model.getTerminal(r[m], false);
							if (c != null && this.isCellDisconnectable(r[m], c, false)) {
								var p = mxCellPath.create(c);
								while (c != null && k[p] == null) {
									c = this.model.getParent(c);
									p = mxCellPath.create(c)
								}
								if (c == null) {
									var f = s.length - 1;
									l.setTerminalPoint(new mxPoint(s[f].x / g - o.x + t, s[f].y / g - o.y + q), false);
									this.model.setTerminal(r[m], null, false)
								}
							}
							this.model.setGeometry(r[m], l)
						}
					}
				}
			}
		} finally {
			this.model.endUpdate()
		}
	}
};
mxGraph.prototype.getCurrentRoot = function() {
	return this.view.currentRoot
};
mxGraph.prototype.getTranslateForRoot = function(a) {
	return null
};
mxGraph.prototype.isPort = function(a) {
	return false
};
mxGraph.prototype.getTerminalForPort = function(a, b) {
	return this.model.getParent(a)
};
mxGraph.prototype.getChildOffsetForCell = function(a) {
	return null
};
mxGraph.prototype.enterGroup = function(a) {
	a = a || this.getSelectionCell();
	if (a != null && this.isValidRoot(a)) {
		this.view.setCurrentRoot(a);
		this.clearSelection()
	}
};
mxGraph.prototype.exitGroup = function() {
	var a = this.model.getRoot();
	var d = this.getCurrentRoot();
	if (d != null) {
		var b = this.model.getParent(d);
		while (b != a && !this.isValidRoot(b) && this.model.getParent(b) != a) {
			b = this.model.getParent(b)
		}
		if (b == a || this.model.getParent(b) == a) {
			this.view.setCurrentRoot(null)
		} else {
			this.view.setCurrentRoot(b)
		}
		var c = this.view.getState(d);
		if (c != null) {
			this.setSelectionCell(d)
		}
	}
};
mxGraph.prototype.home = function() {
	var b = this.getCurrentRoot();
	if (b != null) {
		this.view.setCurrentRoot(null);
		var a = this.view.getState(b);
		if (a != null) {
			this.setSelectionCell(b)
		}
	}
};
mxGraph.prototype.isValidRoot = function(a) {
	return (a != null)
};
mxGraph.prototype.getGraphBounds = function() {
	return this.view.getGraphBounds()
};
mxGraph.prototype.getCellBounds = function(b, h, g) {
	var d = [b];
	if (h) {
		d = d.concat(this.model.getEdges(b))
	}
	var a = this.view.getBounds(d);
	if (g) {
		var c = this.model.getChildCount(b);
		for (var f = 0; f < c; f++) {
			var e = this.getCellBounds(this.model.getChildAt(b, f), h, true);
			if (a != null) {
				a.add(e)
			} else {
				a = e
			}
		}
	}
	return a
};
mxGraph.prototype.getBoundingBoxFromGeometry = function(g, f) {
	f = (f != null) ? f: false;
	var k = null;
	if (g != null) {
		for (var d = 0; d < g.length; d++) {
			if (f || this.model.isVertex(g[d])) {
				var c = this.getCellGeometry(g[d]);
				if (c != null) {
					var h = c.points;
					if (h != null && h.length > 0) {
						var e = new mxRectangle(h[0].x, h[0].y, 0, 0);
						var a = function(i) {
							if (i != null) {
								e.add(new mxRectangle(i.x, i.y, 0, 0))
							}
						};
						for (var b = 1; b < h.length; b++) {
							a(h[b])
						}
						a(c.getTerminalPoint(true));
						a(c.getTerminalPoint(false))
					}
					if (k == null) {
						k = new mxRectangle(c.x, c.y, c.width, c.height)
					} else {
						k.add(c)
					}
				}
			}
		}
	}
	return k
};
mxGraph.prototype.refresh = function(a) {
	this.view.clear(a, a == null);
	this.view.validate();
	this.sizeDidChange();
	this.fireEvent(new mxEventObject(mxEvent.REFRESH))
};
mxGraph.prototype.snap = function(a) {
	if (this.gridEnabled) {
		a = Math.round(a / this.gridSize) * this.gridSize
	}
	return a
};
mxGraph.prototype.panGraph = function(b, a) {
	if (this.useScrollbarsForPanning && mxUtils.hasScrollbars(this.container)) {
		this.container.scrollLeft = -b;
		this.container.scrollTop = -a
	} else {
		var c = this.view.getCanvas();
		if (this.dialect == mxConstants.DIALECT_SVG) {
			c.setAttribute("transform", "translate(" + b + "," + a + ")");
			if (b == 0 && a == 0) {
				if (this.shiftPreview != null) {
					this.shiftPreview.parentNode.removeChild(this.shiftPreview);
					this.shiftPreview = null;
					var f = this.container.firstChild;
					while (f != null) {
						if (f != c.parentNode) {
							if (f.style != null) {
								f.style.visibility = "visible"
							}
						}
						f = f.nextSibling
					}
				}
			} else {
				if (this.shiftPreview == null) {
					this.shiftPreview = document.createElement("div");
					var d = [];
					var f = this.container.firstChild;
					while (f != null) {
						if (f != c.parentNode) {
							d.push(mxUtils.getInnerHtml(f));
							if (f.style != null) {
								f.style.visibility = "hidden"
							}
						}
						f = f.nextSibling
					}
					this.shiftPreview.innerHTML = d.join("");
					this.shiftPreview.style.position = "absolute";
					this.shiftPreview.style.overflow = "visible";
					var e = mxUtils.getOffset(this.container);
					this.shiftPreview.style.left = e.x + "px";
					this.shiftPreview.style.top = e.y + "px";
					this.container.appendChild(this.shiftPreview)
				}
				this.shiftPreview.style.left = b + "px";
				this.shiftPreview.style.top = a + "px"
			}
		} else {
			if (this.dialect == mxConstants.DIALECT_VML) {
				c.setAttribute("coordorigin", ( - b) + "," + ( - a))
			} else {
				if (b == 0 && a == 0) {
					if (this.shiftPreview != null) {
						this.shiftPreview.parentNode.removeChild(this.shiftPreview);
						c.style.display = "";
						this.shiftPreview = null
					}
				} else {
					if (this.shiftPreview == null) {
						this.shiftPreview = this.view.getDrawPane().cloneNode(false);
						var d = mxUtils.getInnerHtml(this.view.getBackgroundPane());
						d += mxUtils.getInnerHtml(this.view.getDrawPane());
						this.shiftPreview.innerHTML = d;
						var e = mxUtils.getOffset(this.container);
						this.shiftPreview.style.position = "absolute";
						this.shiftPreview.style.left = e.x + "px";
						this.shiftPreview.style.top = e.y + "px";
						c.style.display = "none";
						this.container.appendChild(this.shiftPreview)
					}
					this.shiftPreview.style.left = b + "px";
					this.shiftPreview.style.top = a + "px"
				}
			}
		}
	}
};
mxGraph.prototype.zoomIn = function() {
	this.zoom(this.zoomFactor)
};
mxGraph.prototype.zoomOut = function() {
	this.zoom(1 / this.zoomFactor)
};
mxGraph.prototype.zoomActual = function() {
	if (this.view.scale == 1) {
		this.view.setTranslate(0, 0)
	} else {
		this.view.translate.x = 0;
		this.view.translate.y = 0;
		this.view.setScale(1)
	}
};
mxGraph.prototype.zoom = function(c) {
	var h = this.view.scale * c;
	var g = this.view.getState(this.getSelectionCell());
	if (this.keepSelectionVisibleOnZoom && g != null) {
		var d = new mxRectangle(g.x * c, g.y * c, g.width * c, g.height * c);
		this.view.scale = h;
		if (!this.scrollRectToVisible(d)) {
			this.view.revalidate();
			this.view.setScale(h)
		}
	} else {
		if (this.centerZoom && !mxUtils.hasScrollbars(this.container)) {
			var b = this.container.offsetWidth;
			var a = this.container.offsetHeight;
			if (c > 1) {
				var e = (c - 1) / (h * 2);
				b *= -e;
				a *= -e
			} else {
				var e = (1 / c - 1) / (this.view.scale * 2);
				b *= e;
				a *= e
			}
			this.view.scaleAndTranslate(h, this.view.translate.x + b, this.view.translate.y + a)
		} else {
			this.view.setScale(h)
		}
	}
};
mxGraph.prototype.fit = function(d, c) {
	if (this.container != null) {
		d = (d != null) ? d: 0;
		c = (c != null) ? c: false;
		var f = this.container.offsetWidth - 3;
		var h = this.container.offsetHeight - 3;
		var a = this.view.getGraphBounds();
		if (c && a.x != null && a.y != null) {
			a.width += a.x;
			a.height += a.y;
			a.x = 0;
			a.y = 0
		}
		var l = this.view.scale;
		var e = a.width / l;
		var g = a.height / l;
		if (this.backgroundImage != null) {
			e = Math.max(e, this.backgroundImage.width - a.x / l);
			g = Math.max(g, this.backgroundImage.height - a.y / l)
		}
		var i = (c) ? d: 2 * d;
		var k = Math.min(f / (e + i), h / (g + i));
		if (k > 0.1 && k < 8) {
			if (!c) {
				this.view.translate.x = (a.x != null) ? Math.floor(this.view.translate.x - a.x / l + d + 1) : d;
				this.view.translate.y = (a.y != null) ? Math.floor(this.view.translate.y - a.y / l + d + 1) : d
			}
			this.view.setScale(Math.floor(k * 100) / 100)
		}
	}
	return this.view.scale
};
mxGraph.prototype.scrollCellToVisible = function(c, b) {
	var a = -this.view.translate.x;
	var i = -this.view.translate.y;
	var g = this.view.getState(c);
	if (g != null) {
		var f = new mxRectangle(a + g.x, i + g.y, g.width, g.height);
		if (b && this.container != null) {
			var d = this.container.clientWidth;
			var e = this.container.clientHeight;
			f.x = f.getCenterX() - d / 2;
			f.width = d;
			f.y = f.getCenterY() - e / 2;
			f.height = e
		}
		if (this.scrollRectToVisible(f)) {
			this.view.setTranslate(this.view.translate.x, this.view.translate.y)
		}
	}
};
mxGraph.prototype.scrollRectToVisible = function(k) {
	var n = false;
	if (k != null) {
		var m = this.container.offsetWidth;
		var d = this.container.offsetHeight;
		var b = Math.min(m, k.width);
		var a = Math.min(d, k.height);
		if (mxUtils.hasScrollbars(this.container)) {
			var f = this.container;
			var q = f.scrollLeft - k.x;
			var i = Math.max(q - f.scrollLeft, 0);
			if (q > 0) {
				f.scrollLeft -= q + 2
			} else {
				q = k.x + b - f.scrollLeft - f.clientWidth;
				if (q > 0) {
					f.scrollLeft += q + 2
				}
			}
			var o = f.scrollTop - k.y;
			var e = Math.max(0, o - f.scrollTop);
			if (o > 0) {
				f.scrollTop -= o + 2
			} else {
				o = k.y + a - f.scrollTop - f.clientHeight;
				if (o > 0) {
					f.scrollTop += o + 2
				}
			}
			if (!this.useScrollbarsForPanning && (i != 0 || e != 0)) {
				this.view.setTranslate(i, e)
			}
		} else {
			var l = -this.view.translate.x;
			var g = -this.view.translate.y;
			var p = this.view.scale;
			if (k.x + b > l + m) {
				this.view.translate.x -= (k.x + b - m - l) / p;
				n = true
			}
			if (k.y + a > g + d) {
				this.view.translate.y -= (k.y + a - d - g) / p;
				n = true
			}
			if (k.x < l) {
				this.view.translate.x += (l - k.x) / p;
				n = true
			}
			if (k.y < g) {
				this.view.translate.y += (g - k.y) / p;
				n = true
			}
			if (n) {
				this.view.refresh()
			}
		}
	}
	return n
};
mxGraph.prototype.getCellGeometry = function(a) {
	return this.model.getGeometry(a)
};
mxGraph.prototype.isCellVisible = function(a) {
	return this.model.isVisible(a)
};
mxGraph.prototype.isCellCollapsed = function(a) {
	return this.model.isCollapsed(a)
};
mxGraph.prototype.isCellConnectable = function(a) {
	return this.model.isConnectable(a)
};
mxGraph.prototype.isOrthogonal = function(b) {
	var c = b.style[mxConstants.STYLE_ORTHOGONAL];
	if (c != null) {
		return c
	}
	var a = this.view.getEdgeStyle(b);
	return a == mxEdgeStyle.SegmentConnector || a == mxEdgeStyle.ElbowConnector || a == mxEdgeStyle.SideToSide || a == mxEdgeStyle.TopToBottom || a == mxEdgeStyle.EntityRelation || a == mxEdgeStyle.OrthConnector
};
mxGraph.prototype.isLoop = function(b) {
	var c = this.view.getVisibleTerminal(b.cell, true);
	var a = this.view.getVisibleTerminal(b.cell, false);
	return (c != null && c == a)
};
mxGraph.prototype.isCloneEvent = function(a) {
	return mxEvent.isControlDown(a)
};
mxGraph.prototype.isToggleEvent = function(a) {
	return mxEvent.isControlDown(a)
};
mxGraph.prototype.isGridEnabledEvent = function(a) {
	return a != null && !mxEvent.isAltDown(a)
};
mxGraph.prototype.isConstrainedEvent = function(a) {
	return mxEvent.isShiftDown(a)
};
mxGraph.prototype.isForceMarqueeEvent = function(a) {
	return mxEvent.isAltDown(a) || mxEvent.isMetaDown(a)
};
mxGraph.prototype.validationAlert = function(a) {
	mxUtils.alert(a)
};
mxGraph.prototype.isEdgeValid = function(a, b, c) {
	return this.getEdgeValidationError(a, b, c) == null
};
mxGraph.prototype.getEdgeValidationError = function(b, a, g) {
	if (b != null && this.model.getTerminal(b, true) == null && this.model.getTerminal(b, false) == null) {
		return null
	}
	if (!this.allowLoops && a == g && a != null) {
		return ""
	}
	if (!this.isValidConnection(a, g)) {
		return ""
	}
	if (a != null && g != null) {
		var h = "";
		if (!this.multigraph) {
			var d = this.model.getEdgesBetween(a, g, true);
			if (d.length > 1 || (d.length == 1 && d[0] != b)) {
				h += (mxResources.get(this.alreadyConnectedResource) || this.alreadyConnectedResource) + "\n"
			}
		}
		var k = this.model.getDirectedEdgeCount(a, true, b);
		var e = this.model.getDirectedEdgeCount(g, false, b);
		if (this.multiplicities != null) {
			for (var f = 0; f < this.multiplicities.length; f++) {
				var c = this.multiplicities[f].check(this, b, a, g, k, e);
				if (c != null) {
					h += c
				}
			}
		}
		var c = this.validateEdge(b, a, g);
		if (c != null) {
			h += c
		}
		return (h.length > 0) ? h: null
	}
	return (this.allowDanglingEdges) ? null: ""
};
mxGraph.prototype.validateEdge = function(a, b, c) {
	return null
};
mxGraph.prototype.validateGraph = function(h, a) {
	h = (h != null) ? h: this.model.getRoot();
	a = (a != null) ? a: new Object();
	var k = true;
	var c = this.model.getChildCount(h);
	for (var d = 0; d < c; d++) {
		var e = this.model.getChildAt(h, d);
		var l = a;
		if (this.isValidRoot(e)) {
			l = new Object()
		}
		var f = this.validateGraph(e, l);
		if (f != null) {
			this.setCellWarning(e, f.replace(/\n/g, "<br>"))
		} else {
			this.setCellWarning(e, null)
		}
		k = k && f == null
	}
	var g = "";
	if (this.isCellCollapsed(h) && !k) {
		g += (mxResources.get(this.containsValidationErrorsResource) || this.containsValidationErrorsResource) + "\n"
	}
	if (this.model.isEdge(h)) {
		g += this.getEdgeValidationError(h, this.model.getTerminal(h, true), this.model.getTerminal(h, false)) || ""
	} else {
		g += this.getCellValidationError(h) || ""
	}
	var b = this.validateCell(h, a);
	if (b != null) {
		g += b
	}
	if (this.model.getParent(h) == null) {
		this.view.validate()
	}
	return (g.length > 0 || !k) ? g: null
};
mxGraph.prototype.getCellValidationError = function(a) {
	var b = this.model.getDirectedEdgeCount(a, true);
	var c = this.model.getDirectedEdgeCount(a, false);
	var f = this.model.getValue(a);
	var d = "";
	if (this.multiplicities != null) {
		for (var e = 0; e < this.multiplicities.length; e++) {
			var g = this.multiplicities[e];
			if (g.source && mxUtils.isNode(f, g.type, g.attr, g.value) && ((g.max == 0 && b > 0) || (g.min == 1 && b == 0) || (g.max == 1 && b > 1))) {
				d += g.countError + "\n"
			} else {
				if (!g.source && mxUtils.isNode(f, g.type, g.attr, g.value) && ((g.max == 0 && c > 0) || (g.min == 1 && c == 0) || (g.max == 1 && c > 1))) {
					d += g.countError + "\n"
				}
			}
		}
	}
	return (d.length > 0) ? d: null
};
mxGraph.prototype.validateCell = function(a, b) {
	return null
};
mxGraph.prototype.getBackgroundImage = function() {
	return this.backgroundImage
};
mxGraph.prototype.setBackgroundImage = function(a) {
	this.backgroundImage = a
};
mxGraph.prototype.getFoldingImage = function(b) {
	if (b != null && this.foldingEnabled && !this.getModel().isEdge(b.cell)) {
		var a = this.isCellCollapsed(b.cell);
		if (this.isCellFoldable(b.cell, !a)) {
			return (a) ? this.collapsedImage: this.expandedImage
		}
	}
	return null
};
mxGraph.prototype.convertValueToString = function(a) {
	var b = this.model.getValue(a);
	if (b != null) {
		if (mxUtils.isNode(b)) {
			return b.nodeName
		} else {
			if (typeof(b.toString) == "function") {
				return b.toString()
			}
		}
	}
	return ""
};
mxGraph.prototype.getLabel = function(b) {
	var a = "";
	if (this.labelsVisible && b != null) {
		var d = this.view.getState(b);
		var c = (d != null) ? d.style: this.getCellStyle(b);
		if (!mxUtils.getValue(c, mxConstants.STYLE_NOLABEL, false)) {
			a = this.convertValueToString(b)
		}
	}
	return a
};
mxGraph.prototype.isHtmlLabel = function(a) {
	return this.isHtmlLabels()
};
mxGraph.prototype.isHtmlLabels = function() {
	return this.htmlLabels
};
mxGraph.prototype.setHtmlLabels = function(a) {
	this.htmlLabels = a
};
mxGraph.prototype.isWrapping = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return (b != null) ? b[mxConstants.STYLE_WHITE_SPACE] == "wrap": false
};
mxGraph.prototype.isLabelClipped = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return (b != null) ? b[mxConstants.STYLE_OVERFLOW] == "hidden": false
};
mxGraph.prototype.getTooltip = function(f, d, a, g) {
	var e = null;
	if (f != null) {
		if (f.control != null && (d == f.control.node || d.parentNode == f.control.node)) {
			e = this.collapseExpandResource;
			e = mxResources.get(e) || e
		}
		if (e == null && f.overlays != null) {
			for (var b = 0; b < f.overlays.length; b++) {
				if (d == f.overlays[b].node || d.parentNode == f.overlays[b].node) {
					e = this.getCellOverlays(f.cell)[b].toString();
					break
				}
			}
		}
		if (e == null) {
			var c = this.selectionCellsHandler.getHandler(f.cell);
			if (c != null && typeof(c.getTooltipForNode) == "function") {
				e = c.getTooltipForNode(d)
			}
		}
		if (e == null) {
			e = this.getTooltipForCell(f.cell)
		}
	}
	return e
};
mxGraph.prototype.getTooltipForCell = function(a) {
	var b = null;
	if (a != null && a.getTooltip != null) {
		b = a.getTooltip()
	} else {
		b = this.convertValueToString(a)
	}
	return b
};
mxGraph.prototype.getCursorForCell = function(a) {
	return null
};
mxGraph.prototype.getStartSize = function(e) {
	var a = new mxRectangle();
	var d = this.view.getState(e);
	var c = (d != null) ? d.style: this.getCellStyle(e);
	if (c != null) {
		var b = parseInt(mxUtils.getValue(c, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
		if (mxUtils.getValue(c, mxConstants.STYLE_HORIZONTAL, true)) {
			a.height = b
		} else {
			a.width = b
		}
	}
	return a
};
mxGraph.prototype.getImage = function(a) {
	return (a != null && a.style != null) ? a.style[mxConstants.STYLE_IMAGE] : null
};
mxGraph.prototype.getVerticalAlign = function(a) {
	return (a != null && a.style != null) ? (a.style[mxConstants.STYLE_VERTICAL_ALIGN] || mxConstants.ALIGN_MIDDLE) : null
};
mxGraph.prototype.getIndicatorColor = function(a) {
	return (a != null && a.style != null) ? a.style[mxConstants.STYLE_INDICATOR_COLOR] : null
};
mxGraph.prototype.getIndicatorGradientColor = function(a) {
	return (a != null && a.style != null) ? a.style[mxConstants.STYLE_INDICATOR_GRADIENTCOLOR] : null
};
mxGraph.prototype.getIndicatorShape = function(a) {
	return (a != null && a.style != null) ? a.style[mxConstants.STYLE_INDICATOR_SHAPE] : null
};
mxGraph.prototype.getIndicatorImage = function(a) {
	return (a != null && a.style != null) ? a.style[mxConstants.STYLE_INDICATOR_IMAGE] : null
};
mxGraph.prototype.getBorder = function() {
	return this.border
};
mxGraph.prototype.setBorder = function(a) {
	this.border = a
};
mxGraph.prototype.isSwimlane = function(a) {
	if (a != null) {
		if (this.model.getParent(a) != this.model.getRoot()) {
			var c = this.view.getState(a);
			var b = (c != null) ? c.style: this.getCellStyle(a);
			if (b != null && !this.model.isEdge(a)) {
				return b[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_SWIMLANE
			}
		}
	}
	return false
};
mxGraph.prototype.isResizeContainer = function() {
	return this.resizeContainer
};
mxGraph.prototype.setResizeContainer = function(a) {
	this.resizeContainer = a
};
mxGraph.prototype.isEnabled = function() {
	return this.enabled
};
mxGraph.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxGraph.prototype.isEscapeEnabled = function() {
	return this.escapeEnabled
};
mxGraph.prototype.setEscapeEnabled = function(a) {
	this.escapeEnabled = a
};
mxGraph.prototype.isInvokesStopCellEditing = function() {
	return this.invokesStopCellEditing
};
mxGraph.prototype.setInvokesStopCellEditing = function(a) {
	this.invokesStopCellEditing = a
};
mxGraph.prototype.isEnterStopsCellEditing = function() {
	return this.enterStopsCellEditing
};
mxGraph.prototype.setEnterStopsCellEditing = function(a) {
	this.enterStopsCellEditing = a
};
mxGraph.prototype.isCellLocked = function(a) {
	var b = this.model.getGeometry(a);
	return this.isCellsLocked() || (b != null && this.model.isVertex(a) && b.relative)
};
mxGraph.prototype.isCellsLocked = function() {
	return this.cellsLocked
};
mxGraph.prototype.setCellsLocked = function(a) {
	this.cellsLocked = a
};
mxGraph.prototype.getCloneableCells = function(a) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(b) {
		return this.isCellCloneable(b)
	}))
};
mxGraph.prototype.isCellCloneable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsCloneable() && b[mxConstants.STYLE_CLONEABLE] != 0
};
mxGraph.prototype.isCellsCloneable = function() {
	return this.cellsCloneable
};
mxGraph.prototype.setCellsCloneable = function(a) {
	this.cellsCloneable = a
};
mxGraph.prototype.getExportableCells = function(a) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(b) {
		return this.canExportCell(b)
	}))
};
mxGraph.prototype.canExportCell = function(a) {
	return this.exportEnabled
};
mxGraph.prototype.getImportableCells = function(a) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(b) {
		return this.canImportCell(b)
	}))
};
mxGraph.prototype.canImportCell = function(a) {
	return this.importEnabled
};
mxGraph.prototype.isCellSelectable = function(a) {
	return this.isCellsSelectable()
};
mxGraph.prototype.isCellsSelectable = function() {
	return this.cellsSelectable
};
mxGraph.prototype.setCellsSelectable = function(a) {
	this.cellsSelectable = a
};
mxGraph.prototype.getDeletableCells = function(a) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(b) {
		return this.isCellDeletable(b)
	}))
};
mxGraph.prototype.isCellDeletable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsDeletable() && b[mxConstants.STYLE_DELETABLE] != 0
};
mxGraph.prototype.isCellsDeletable = function() {
	return this.cellsDeletable
};
mxGraph.prototype.setCellsDeletable = function(a) {
	this.cellsDeletable = a
};
mxGraph.prototype.isLabelMovable = function(a) {
	return ! this.isCellLocked(a) && ((this.model.isEdge(a) && this.edgeLabelsMovable) || (this.model.isVertex(a) && this.vertexLabelsMovable))
};
mxGraph.prototype.getMovableCells = function(a) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(b) {
		return this.isCellMovable(b)
	}))
};
mxGraph.prototype.isCellMovable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsMovable() && !this.isCellLocked(a) && b[mxConstants.STYLE_MOVABLE] != 0
};
mxGraph.prototype.isCellsMovable = function() {
	return this.cellsMovable
};
mxGraph.prototype.setCellsMovable = function(a) {
	this.cellsMovable = a
};
mxGraph.prototype.isGridEnabled = function() {
	return this.gridEnabled
};
mxGraph.prototype.setGridEnabled = function(a) {
	this.gridEnabled = a
};
mxGraph.prototype.isPortsEnabled = function() {
	return this.portsEnabled
};
mxGraph.prototype.setPortsEnabled = function(a) {
	this.portsEnabled = a
};
mxGraph.prototype.getGridSize = function() {
	return this.gridSize
};
mxGraph.prototype.setGridSize = function(a) {
	this.gridSize = a
};
mxGraph.prototype.getTolerance = function() {
	return this.tolerance
};
mxGraph.prototype.setTolerance = function(a) {
	this.tolerance = a
};
mxGraph.prototype.isVertexLabelsMovable = function() {
	return this.vertexLabelsMovable
};
mxGraph.prototype.setVertexLabelsMovable = function(a) {
	this.vertexLabelsMovable = a
};
mxGraph.prototype.isEdgeLabelsMovable = function() {
	return this.edgeLabelsMovable
};
mxGraph.prototype.setEdgeLabelsMovable = function(a) {
	this.edgeLabelsMovable = a
};
mxGraph.prototype.isSwimlaneNesting = function() {
	return this.swimlaneNesting
};
mxGraph.prototype.setSwimlaneNesting = function(a) {
	this.swimlaneNesting = a
};
mxGraph.prototype.isSwimlaneSelectionEnabled = function() {
	return this.swimlaneSelectionEnabled
};
mxGraph.prototype.setSwimlaneSelectionEnabled = function(a) {
	this.swimlaneSelectionEnabled = a
};
mxGraph.prototype.isMultigraph = function() {
	return this.multigraph
};
mxGraph.prototype.setMultigraph = function(a) {
	this.multigraph = a
};
mxGraph.prototype.isAllowLoops = function() {
	return this.allowLoops
};
mxGraph.prototype.setAllowDanglingEdges = function(a) {
	this.allowDanglingEdges = a
};
mxGraph.prototype.isAllowDanglingEdges = function() {
	return this.allowDanglingEdges
};
mxGraph.prototype.setConnectableEdges = function(a) {
	this.connectableEdges = a
};
mxGraph.prototype.isConnectableEdges = function() {
	return this.connectableEdges
};
mxGraph.prototype.setCloneInvalidEdges = function(a) {
	this.cloneInvalidEdges = a
};
mxGraph.prototype.isCloneInvalidEdges = function() {
	return this.cloneInvalidEdges
};
mxGraph.prototype.setAllowLoops = function(a) {
	this.allowLoops = a
};
mxGraph.prototype.isDisconnectOnMove = function() {
	return this.disconnectOnMove
};
mxGraph.prototype.setDisconnectOnMove = function(a) {
	this.disconnectOnMove = a
};
mxGraph.prototype.isDropEnabled = function() {
	return this.dropEnabled
};
mxGraph.prototype.setDropEnabled = function(a) {
	this.dropEnabled = a
};
mxGraph.prototype.isSplitEnabled = function() {
	return this.splitEnabled
};
mxGraph.prototype.setSplitEnabled = function(a) {
	this.splitEnabled = a
};
mxGraph.prototype.isCellResizable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsResizable() && !this.isCellLocked(a) && b[mxConstants.STYLE_RESIZABLE] != 0
};
mxGraph.prototype.isCellsResizable = function() {
	return this.cellsResizable
};
mxGraph.prototype.setCellsResizable = function(a) {
	this.cellsResizable = a
};
mxGraph.prototype.isTerminalPointMovable = function(a, b) {
	return true
};
mxGraph.prototype.isCellBendable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsBendable() && !this.isCellLocked(a) && b[mxConstants.STYLE_BENDABLE] != 0
};
mxGraph.prototype.isCellsBendable = function() {
	return this.cellsBendable
};
mxGraph.prototype.setCellsBendable = function(a) {
	this.cellsBendable = a
};
mxGraph.prototype.isCellEditable = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isCellsEditable() && !this.isCellLocked(a) && b[mxConstants.STYLE_EDITABLE] != 0
};
mxGraph.prototype.isCellsEditable = function() {
	return this.cellsEditable
};
mxGraph.prototype.setCellsEditable = function(a) {
	this.cellsEditable = a
};
mxGraph.prototype.isCellDisconnectable = function(a, b, c) {
	return this.isCellsDisconnectable() && !this.isCellLocked(a)
};
mxGraph.prototype.isCellsDisconnectable = function() {
	return this.cellsDisconnectable
};
mxGraph.prototype.setCellsDisconnectable = function(a) {
	this.cellsDisconnectable = a
};
mxGraph.prototype.isValidSource = function(a) {
	return (a == null && this.allowDanglingEdges) || (a != null && (!this.model.isEdge(a) || this.connectableEdges) && this.isCellConnectable(a))
};
mxGraph.prototype.isValidTarget = function(a) {
	return this.isValidSource(a)
};
mxGraph.prototype.isValidConnection = function(a, b) {
	return this.isValidSource(a) && this.isValidTarget(b)
};
mxGraph.prototype.setConnectable = function(a) {
	this.connectionHandler.setEnabled(a)
};
mxGraph.prototype.isConnectable = function(a) {
	return this.connectionHandler.isEnabled()
};
mxGraph.prototype.setTooltips = function(a) {
	this.tooltipHandler.setEnabled(a)
};
mxGraph.prototype.setPanning = function(a) {
	this.panningHandler.panningEnabled = a
};
mxGraph.prototype.isEditing = function(a) {
	if (this.cellEditor != null) {
		var b = this.cellEditor.getEditingCell();
		return (a == null) ? b != null: a == b
	}
	return false
};
mxGraph.prototype.isAutoSizeCell = function(a) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.isAutoSizeCells() || b[mxConstants.STYLE_AUTOSIZE] == 1
};
mxGraph.prototype.isAutoSizeCells = function() {
	return this.autoSizeCells
};
mxGraph.prototype.setAutoSizeCells = function(a) {
	this.autoSizeCells = a
};
mxGraph.prototype.isExtendParent = function(a) {
	return ! this.getModel().isEdge(a) && this.isExtendParents()
};
mxGraph.prototype.isExtendParents = function() {
	return this.extendParents
};
mxGraph.prototype.setExtendParents = function(a) {
	this.extendParents = a
};
mxGraph.prototype.isExtendParentsOnAdd = function() {
	return this.extendParentsOnAdd
};
mxGraph.prototype.setExtendParentsOnAdd = function(a) {
	this.extendParentsOnAdd = a
};
mxGraph.prototype.isConstrainChild = function(a) {
	return this.isConstrainChildren() && !this.getModel().isEdge(this.getModel().getParent(a))
};
mxGraph.prototype.isConstrainChildren = function() {
	return this.constrainChildren
};
mxGraph.prototype.setConstrainChildren = function(a) {
	this.constrainChildren = a
};
mxGraph.prototype.isAllowNegativeCoordinates = function() {
	return this.allowNegativeCoordinates
};
mxGraph.prototype.setAllowNegativeCoordinates = function(a) {
	this.allowNegativeCoordinates = a
};
mxGraph.prototype.getOverlap = function(a) {
	return (this.isAllowOverlapParent(a)) ? this.defaultOverlap: 0
};
mxGraph.prototype.isAllowOverlapParent = function(a) {
	return false
};
mxGraph.prototype.getFoldableCells = function(a, b) {
	return this.model.filterCells(a, mxUtils.bind(this,
	function(c) {
		return this.isCellFoldable(c, b)
	}))
};
mxGraph.prototype.isCellFoldable = function(a, d) {
	var c = this.view.getState(a);
	var b = (c != null) ? c.style: this.getCellStyle(a);
	return this.model.getChildCount(a) > 0 && b[mxConstants.STYLE_FOLDABLE] != 0
};
mxGraph.prototype.isValidDropTarget = function(a, c, b) {
	return a != null && ((this.isSplitEnabled() && this.isSplitTarget(a, c, b)) || (!this.model.isEdge(a) && (this.isSwimlane(a) || (this.model.getChildCount(a) > 0 && !this.isCellCollapsed(a)))))
};
mxGraph.prototype.isSplitTarget = function(d, c, b) {
	if (this.model.isEdge(d) && c != null && c.length == 1 && this.isCellConnectable(c[0]) && this.getEdgeValidationError(d, this.model.getTerminal(d, true), c[0]) == null) {
		var e = this.model.getTerminal(d, true);
		var a = this.model.getTerminal(d, false);
		return (!this.model.isAncestor(c[0], e) && !this.model.isAncestor(c[0], a))
	}
	return false
};
mxGraph.prototype.getDropTarget = function(c, b, a) {
	if (!this.isSwimlaneNesting()) {
		for (var e = 0; e < c.length; e++) {
			if (this.isSwimlane(c[e])) {
				return null
			}
		}
	}
	var g = mxUtils.convertPoint(this.container, mxEvent.getClientX(b), mxEvent.getClientY(b));
	var f = this.getSwimlaneAt(g.x, g.y);
	if (a == null) {
		a = f
	} else {
		if (f != null) {
			var d = this.model.getParent(f);
			while (d != null && this.isSwimlane(d) && d != a) {
				d = this.model.getParent(d)
			}
			if (d == a) {
				a = f
			}
		}
	}
	while (a != null && !this.isValidDropTarget(a, c, b) && !this.model.isLayer(a)) {
		a = this.model.getParent(a)
	}
	return (!this.model.isLayer(a) && mxUtils.indexOf(c, a) < 0) ? a: null
};
mxGraph.prototype.getDefaultParent = function() {
	var b = this.defaultParent;
	if (b == null) {
		b = this.getCurrentRoot();
		if (b == null) {
			var a = this.model.getRoot();
			b = this.model.getChildAt(a, 0)
		}
	}
	return b
};
mxGraph.prototype.setDefaultParent = function(a) {
	this.defaultParent = a
};
mxGraph.prototype.getSwimlane = function(a) {
	while (a != null && !this.isSwimlane(a)) {
		a = this.model.getParent(a)
	}
	return a
};
mxGraph.prototype.getSwimlaneAt = function(b, h, e) {
	e = e || this.getDefaultParent();
	if (e != null) {
		var c = this.model.getChildCount(e);
		for (var d = 0; d < c; d++) {
			var g = this.model.getChildAt(e, d);
			var a = this.getSwimlaneAt(b, h, g);
			if (a != null) {
				return a
			} else {
				if (this.isSwimlane(g)) {
					var f = this.view.getState(g);
					if (this.intersects(f, b, h)) {
						return g
					}
				}
			}
		}
	}
	return null
};
mxGraph.prototype.getCellAt = function(g, f, h, e, b) {
	e = (e != null) ? e: true;
	b = (b != null) ? b: true;
	h = (h != null) ? h: this.getDefaultParent();
	if (h != null) {
		var c = this.model.getChildCount(h);
		for (var d = c - 1; d >= 0; d--) {
			var k = this.model.getChildAt(h, d);
			var l = this.getCellAt(g, f, k, e, b);
			if (l != null) {
				return l
			} else {
				if (this.isCellVisible(k) && (b && this.model.isEdge(k) || e && this.model.isVertex(k))) {
					var a = this.view.getState(k);
					if (this.intersects(a, g, f)) {
						return k
					}
				}
			}
		}
	}
	return null
};
mxGraph.prototype.intersects = function(a, g, f) {
	if (a != null) {
		var h = a.absolutePoints;
		if (h != null) {
			var c = this.tolerance * this.tolerance;
			var k = h[0];
			for (var b = 1; b < h.length; b++) {
				var d = h[b];
				var e = mxUtils.ptSegDistSq(k.x, k.y, d.x, d.y, g, f);
				if (e <= c) {
					return true
				}
				k = d
			}
		} else {
			if (mxUtils.contains(a, g, f)) {
				return true
			}
		}
	}
	return false
};
mxGraph.prototype.hitsSwimlaneContent = function(d, a, f) {
	var c = this.getView().getState(d);
	var b = this.getStartSize(d);
	if (c != null) {
		var e = this.getView().getScale();
		a -= c.x;
		f -= c.y;
		if (b.width > 0 && a > 0 && a > b.width * e) {
			return true
		} else {
			if (b.height > 0 && f > 0 && f > b.height * e) {
				return true
			}
		}
	}
	return false
};
mxGraph.prototype.getChildVertices = function(a) {
	return this.getChildCells(a, true, false)
};
mxGraph.prototype.getChildEdges = function(a) {
	return this.getChildCells(a, false, true)
};
mxGraph.prototype.getChildCells = function(f, d, b) {
	f = (f != null) ? f: this.getDefaultParent();
	d = (d != null) ? d: false;
	b = (b != null) ? b: false;
	var c = this.model.getChildCells(f, d, b);
	var a = [];
	for (var e = 0; e < c.length; e++) {
		if (this.isCellVisible(c[e])) {
			a.push(c[e])
		}
	}
	return a
};
mxGraph.prototype.getConnections = function(a, b) {
	return this.getEdges(a, b, true, true, false)
};
mxGraph.prototype.getIncomingEdges = function(a, b) {
	return this.getEdges(a, b, true, false, false)
};
mxGraph.prototype.getOutgoingEdges = function(a, b) {
	return this.getEdges(a, b, false, true, false)
};
mxGraph.prototype.getEdges = function(n, m, d, h, c) {
	d = (d != null) ? d: true;
	h = (h != null) ? h: true;
	c = (c != null) ? c: true;
	var e = [];
	var k = this.isCellCollapsed(n);
	var f = this.model.getChildCount(n);
	for (var g = 0; g < f; g++) {
		var b = this.model.getChildAt(n, g);
		if (k || !this.isCellVisible(b)) {
			e = e.concat(this.model.getEdges(b, d, h))
		}
	}
	e = e.concat(this.model.getEdges(n, d, h));
	var o = [];
	for (var g = 0; g < e.length; g++) {
		var a = this.view.getVisibleTerminal(e[g], true);
		var l = this.view.getVisibleTerminal(e[g], false);
		if (c || ((a != l) && ((d && l == n && (m == null || this.model.getParent(a) == m)) || (h && a == n && (m == null || this.model.getParent(l) == m))))) {
			o.push(e[g])
		}
	}
	return o
};
mxGraph.prototype.getOpposites = function(d, g, b, h) {
	b = (b != null) ? b: true;
	h = (h != null) ? h: true;
	var l = [];
	var e = new Object();
	if (d != null) {
		for (var f = 0; f < d.length; f++) {
			var a = this.view.getVisibleTerminal(d[f], true);
			var k = this.view.getVisibleTerminal(d[f], false);
			if (a == g && k != null && k != g && h) {
				var c = mxCellPath.create(k);
				if (e[c] == null) {
					e[c] = k;
					l.push(k)
				}
			} else {
				if (k == g && a != null && a != g && b) {
					var c = mxCellPath.create(a);
					if (e[c] == null) {
						e[c] = a;
						l.push(a)
					}
				}
			}
		}
	}
	return l
};
mxGraph.prototype.getEdgesBetween = function(f, g, e) {
	e = (e != null) ? e: false;
	var c = this.getEdges(f);
	var a = [];
	for (var d = 0; d < c.length; d++) {
		var h = this.view.getVisibleTerminal(c[d], true);
		var b = this.view.getVisibleTerminal(c[d], false);
		if ((h == f && b == g) || (!e && h == g && b == f)) {
			a.push(c[d])
		}
	}
	return a
};
mxGraph.prototype.getPointForEvent = function(a, f) {
	var d = mxUtils.convertPoint(this.container, mxEvent.getClientX(a), mxEvent.getClientY(a));
	var b = this.view.scale;
	var c = this.view.translate;
	var e = (f != false) ? this.gridSize / 2 : 0;
	d.x = this.snap(d.x / b - c.x - e);
	d.y = this.snap(d.y / b - c.y - e);
	return d
};
mxGraph.prototype.getCells = function(g, f, c, m, h, n) {
	n = (n != null) ? n: [];
	if (c > 0 || m > 0) {
		var l = g + c;
		var a = f + m;
		h = h || this.getDefaultParent();
		if (h != null) {
			var d = this.model.getChildCount(h);
			for (var e = 0; e < d; e++) {
				var k = this.model.getChildAt(h, e);
				var b = this.view.getState(k);
				if (this.isCellVisible(k) && b != null) {
					if (b.x >= g && b.y >= f && b.x + b.width <= l && b.y + b.height <= a) {
						n.push(k)
					} else {
						this.getCells(g, f, c, m, k, n)
					}
				}
			}
		}
	}
	return n
};
mxGraph.prototype.getCellsBeyond = function(c, g, h, f, k) {
	var l = [];
	if (f || k) {
		if (h == null) {
			h = this.getDefaultParent()
		}
		if (h != null) {
			var d = this.model.getChildCount(h);
			for (var e = 0; e < d; e++) {
				var b = this.model.getChildAt(h, e);
				var a = this.view.getState(b);
				if (this.isCellVisible(b) && a != null) {
					if ((!f || a.x >= c) && (!k || a.y >= g)) {
						l.push(b)
					}
				}
			}
		}
	}
	return l
};
mxGraph.prototype.findTreeRoots = function(p, m, c) {
	m = (m != null) ? m: false;
	c = (c != null) ? c: false;
	var r = [];
	if (p != null) {
		var h = this.getModel();
		var f = h.getChildCount(p);
		var d = null;
		var n = 0;
		for (var g = 0; g < f; g++) {
			var q = h.getChildAt(p, g);
			if (this.model.isVertex(q) && this.isCellVisible(q)) {
				var b = this.getConnections(q, (m) ? p: null);
				var l = 0;
				var k = 0;
				for (var e = 0; e < b.length; e++) {
					var a = this.view.getVisibleTerminal(b[e], true);
					if (a == q) {
						l++
					} else {
						k++
					}
				}
				if ((c && l == 0 && k > 0) || (!c && k == 0 && l > 0)) {
					r.push(q)
				}
				var o = (c) ? k - l: l - k;
				if (o > n) {
					n = o;
					d = q
				}
			}
		}
		if (r.length == 0 && d != null) {
			r.push(d)
		}
	}
	return r
};
mxGraph.prototype.traverse = function(k, d, f, c, n) {
	if (f != null && k != null) {
		d = (d != null) ? d: true;
		n = n || [];
		var b = mxCellPath.create(k);
		if (n[b] == null) {
			n[b] = k;
			var o = f(k, c);
			if (o == null || o) {
				var a = this.model.getEdgeCount(k);
				if (a > 0) {
					for (var g = 0; g < a; g++) {
						var l = this.model.getEdgeAt(k, g);
						var m = this.model.getTerminal(l, true) == k;
						if (!d || m) {
							var h = this.model.getTerminal(l, !m);
							this.traverse(h, d, f, l, n)
						}
					}
				}
			}
		}
	}
};
mxGraph.prototype.isCellSelected = function(a) {
	return this.getSelectionModel().isSelected(a)
};
mxGraph.prototype.isSelectionEmpty = function() {
	return this.getSelectionModel().isEmpty()
};
mxGraph.prototype.clearSelection = function() {
	return this.getSelectionModel().clear()
};
mxGraph.prototype.getSelectionCount = function() {
	return this.getSelectionModel().cells.length
};
mxGraph.prototype.getSelectionCell = function() {
	return this.getSelectionModel().cells[0]
};
mxGraph.prototype.getSelectionCells = function() {
	return this.getSelectionModel().cells.slice()
};
mxGraph.prototype.setSelectionCell = function(a) {
	this.getSelectionModel().setCell(a)
};
mxGraph.prototype.setSelectionCells = function(a) {
	this.getSelectionModel().setCells(a)
};
mxGraph.prototype.addSelectionCell = function(a) {
	this.getSelectionModel().addCell(a)
};
mxGraph.prototype.addSelectionCells = function(a) {
	this.getSelectionModel().addCells(a)
};
mxGraph.prototype.removeSelectionCell = function(a) {
	this.getSelectionModel().removeCell(a)
};
mxGraph.prototype.removeSelectionCells = function(a) {
	this.getSelectionModel().removeCells(a)
};
mxGraph.prototype.selectRegion = function(c, a) {
	var b = this.getCells(c.x, c.y, c.width, c.height);
	this.selectCellsForEvent(b, a);
	return b
};
mxGraph.prototype.selectNextCell = function() {
	this.selectCell(true)
};
mxGraph.prototype.selectPreviousCell = function() {
	this.selectCell()
};
mxGraph.prototype.selectParentCell = function() {
	this.selectCell(false, true)
};
mxGraph.prototype.selectChildCell = function() {
	this.selectCell(false, false, true)
};
mxGraph.prototype.selectCell = function(a, h, b) {
	var d = this.selectionModel;
	var m = (d.cells.length > 0) ? d.cells[0] : null;
	if (d.cells.length > 1) {
		d.clear()
	}
	var l = (m != null) ? this.model.getParent(m) : this.getDefaultParent();
	var e = this.model.getChildCount(l);
	if (m == null && e > 0) {
		var c = this.model.getChildAt(l, 0);
		this.setSelectionCell(c)
	} else {
		if ((m == null || h) && this.view.getState(l) != null && this.model.getGeometry(l) != null) {
			if (this.getCurrentRoot() != l) {
				this.setSelectionCell(l)
			}
		} else {
			if (m != null && b) {
				var g = this.model.getChildCount(m);
				if (g > 0) {
					var c = this.model.getChildAt(m, 0);
					this.setSelectionCell(c)
				}
			} else {
				if (e > 0) {
					var f = l.getIndex(m);
					if (a) {
						f++;
						var c = this.model.getChildAt(l, f % e);
						this.setSelectionCell(c)
					} else {
						f--;
						var k = (f < 0) ? e - 1 : f;
						var c = this.model.getChildAt(l, k);
						this.setSelectionCell(c)
					}
				}
			}
		}
	}
};
mxGraph.prototype.selectAll = function(b) {
	b = b || this.getDefaultParent();
	var a = this.model.getChildren(b);
	if (a != null) {
		this.setSelectionCells(a)
	}
};
mxGraph.prototype.selectVertices = function(a) {
	this.selectCells(true, false, a)
};
mxGraph.prototype.selectEdges = function(a) {
	this.selectCells(false, true, a)
};
mxGraph.prototype.selectCells = function(c, a, e) {
	e = e || this.getDefaultParent();
	var d = mxUtils.bind(this,
	function(f) {
		return this.view.getState(f) != null && this.model.getChildCount(f) == 0 && ((this.model.isVertex(f) && c) || (this.model.isEdge(f) && a))
	});
	var b = this.model.filterDescendants(d, e);
	this.setSelectionCells(b)
};
mxGraph.prototype.selectCellForEvent = function(a, b) {
	var c = this.isCellSelected(a);
	if (this.isToggleEvent(b)) {
		if (c) {
			this.removeSelectionCell(a)
		} else {
			this.addSelectionCell(a)
		}
	} else {
		if (!c || this.getSelectionCount() != 1) {
			this.setSelectionCell(a)
		}
	}
};
mxGraph.prototype.selectCellsForEvent = function(b, a) {
	if (this.isToggleEvent(a)) {
		this.addSelectionCells(b)
	} else {
		this.setSelectionCells(b)
	}
};
mxGraph.prototype.createHandler = function(c) {
	var a = null;
	if (c != null) {
		if (this.model.isEdge(c.cell)) {
			var b = this.view.getEdgeStyle(c);
			if (this.isLoop(c) || b == mxEdgeStyle.ElbowConnector || b == mxEdgeStyle.SideToSide || b == mxEdgeStyle.TopToBottom) {
				a = new mxElbowEdgeHandler(c)
			} else {
				if (b == mxEdgeStyle.SegmentConnector || b == mxEdgeStyle.OrthConnector) {
					a = new mxEdgeSegmentHandler(c)
				} else {
					a = new mxEdgeHandler(c)
				}
			}
		} else {
			a = new mxVertexHandler(c)
		}
	}
	return a
};
mxGraph.prototype.addMouseListener = function(a) {
	if (this.mouseListeners == null) {
		this.mouseListeners = []
	}
	this.mouseListeners.push(a)
};
mxGraph.prototype.removeMouseListener = function(b) {
	if (this.mouseListeners != null) {
		for (var a = 0; a < this.mouseListeners.length; a++) {
			if (this.mouseListeners[a] == b) {
				this.mouseListeners.splice(a, 1);
				break
			}
		}
	}
};
mxGraph.prototype.updateMouseEvent = function(a) {
	if (a.graphX == null || a.graphY == null) {
		var b = mxUtils.convertPoint(this.container, a.getX(), a.getY());
		a.graphX = b.x;
		a.graphY = b.y
	}
};
mxGraph.prototype.fireMouseEvent = function(g, f, d) {
	if (d == null) {
		d = this
	}
	this.updateMouseEvent(f);
	if (g == mxEvent.MOUSE_DOWN) {
		this.isMouseDown = true
	}
	if (mxClient.IS_TOUCH && this.doubleTapEnabled && g == mxEvent.MOUSE_DOWN) {
		var e = new Date().getTime();
		if (e - this.lastTouchTime < this.doubleTapTimeout && Math.abs(this.lastTouchX - f.getX()) < this.doubleTapTolerance && Math.abs(this.lastTouchY - f.getY()) < this.doubleTapTolerance) {
			this.lastTouchTime = 0;
			this.dblClick(f.getEvent(), f.getCell());
			f.getEvent().cancelBubble = true
		} else {
			this.lastTouchX = f.getX();
			this.lastTouchY = f.getY();
			this.lastTouchTime = e
		}
	}
	var h = f.getEvent().detail != 2;
	if (mxClient.IS_IE && document.compatMode == "CSS1Compat") {
		if ((this.lastMouseX != null && Math.abs(this.lastMouseX - f.getX()) > this.doubleTapTolerance) || (this.lastMouseY != null && Math.abs(this.lastMouseY - f.getY()) > this.doubleTapTolerance)) {
			h = true
		}
		if (g == mxEvent.MOUSE_UP) {
			this.lastMouseX = f.getX();
			this.lastMouseY = f.getY()
		}
	}
	if ((g != mxEvent.MOUSE_UP || this.isMouseDown) && h) {
		if (g == mxEvent.MOUSE_UP) {
			this.isMouseDown = false
		}
		if (!this.isEditing() && (mxClient.IS_OP || mxClient.IS_SF || mxClient.IS_GC || (mxClient.IS_IE && mxClient.IS_SVG) || f.getEvent().target != this.container)) {
			if (g == mxEvent.MOUSE_MOVE && this.isMouseDown && this.autoScroll) {
				this.scrollPointToVisible(f.getGraphX(), f.getGraphY(), this.autoExtend)
			}
			if (this.mouseListeners != null) {
				var b = [d, f];
				f.getEvent().returnValue = true;
				for (var c = 0; c < this.mouseListeners.length; c++) {
					var a = this.mouseListeners[c];
					if (g == mxEvent.MOUSE_DOWN) {
						a.mouseDown.apply(a, b)
					} else {
						if (g == mxEvent.MOUSE_MOVE) {
							a.mouseMove.apply(a, b)
						} else {
							if (g == mxEvent.MOUSE_UP) {
								a.mouseUp.apply(a, b)
							}
						}
					}
				}
			}
			if (g == mxEvent.MOUSE_UP) {
				this.click(f)
			}
		}
	} else {
		if (g == mxEvent.MOUSE_UP) {
			this.isMouseDown = false
		}
	}
};
mxGraph.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		if (this.tooltipHandler != null) {
			this.tooltipHandler.destroy()
		}
		if (this.selectionCellsHandler != null) {
			this.selectionCellsHandler.destroy()
		}
		if (this.panningHandler != null) {
			this.panningHandler.destroy()
		}
		if (this.connectionHandler != null) {
			this.connectionHandler.destroy()
		}
		if (this.graphHandler != null) {
			this.graphHandler.destroy()
		}
		if (this.cellEditor != null) {
			this.cellEditor.destroy()
		}
		if (this.view != null) {
			this.view.destroy()
		}
		this.container = null
	}
};
function mxCellOverlay(b, a, f, e, d, c) {
	this.image = b;
	this.tooltip = a;
	this.align = f;
	this.verticalAlign = e;
	this.offset = (d != null) ? d: new mxPoint();
	this.cursor = (c != null) ? c: "help"
}
mxCellOverlay.prototype = new mxEventSource();
mxCellOverlay.prototype.constructor = mxCellOverlay;
mxCellOverlay.prototype.image = null;
mxCellOverlay.prototype.tooltip = null;
mxCellOverlay.prototype.align = null;
mxCellOverlay.prototype.verticalAlign = null;
mxCellOverlay.prototype.offset = null;
mxCellOverlay.prototype.cursor = null;
mxCellOverlay.prototype.defaultOverlap = 0.5;
mxCellOverlay.prototype.getBounds = function(a) {
	var c = a.view.graph.getModel().isEdge(a.cell);
	var l = a.view.scale;
	var k = null;
	var d = this.image.width;
	var b = this.image.height;
	if (c) {
		var i = a.absolutePoints;
		if (i.length % 2 == 1) {
			k = i[Math.floor(i.length / 2)]
		} else {
			var e = i.length / 2;
			var g = i[e - 1];
			var f = i[e];
			k = new mxPoint(g.x + (f.x - g.x) / 2, g.y + (f.y - g.y) / 2)
		}
	} else {
		k = new mxPoint();
		if (this.align == mxConstants.ALIGN_LEFT) {
			k.x = a.x
		} else {
			if (this.align == mxConstants.ALIGN_CENTER) {
				k.x = a.x + a.width / 2
			} else {
				k.x = a.x + a.width
			}
		}
		if (this.verticalAlign == mxConstants.ALIGN_TOP) {
			k.y = a.y
		} else {
			if (this.verticalAlign == mxConstants.ALIGN_MIDDLE) {
				k.y = a.y + a.height / 2
			} else {
				k.y = a.y + a.height
			}
		}
	}
	return new mxRectangle(k.x - (d * this.defaultOverlap - this.offset.x) * l, k.y - (b * this.defaultOverlap - this.offset.y) * l, d * l, b * l)
};
mxCellOverlay.prototype.toString = function() {
	return this.tooltip
};
function mxOutline(e, c) {
	this.source = e;
	this.outline = new mxGraph(c, e.getModel(), this.graphRenderHint, e.getStylesheet());
	if (mxClient.IS_SVG) {
		var d = this.outline.getView().getCanvas().parentNode;
		d.setAttribute("shape-rendering", "optimizeSpeed");
		d.setAttribute("image-rendering", "optimizeSpeed")
	}
	this.outline.labelsVisible = false;
	this.outline.setEnabled(false);
	e.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this,
	function(g, f) {
		this.update()
	}));
	this.outline.addMouseListener(this);
	var b = mxUtils.bind(this,
	function(f) {
		if (!this.active) {
			this.update()
		}
	});
	this.source.getModel().addListener(mxEvent.CHANGE, b);
	var a = this.source.getView();
	a.addListener(mxEvent.SCALE, b);
	a.addListener(mxEvent.TRANSLATE, b);
	a.addListener(mxEvent.SCALE_AND_TRANSLATE, b);
	a.addListener(mxEvent.DOWN, b);
	a.addListener(mxEvent.UP, b);
	mxEvent.addListener(e.container, "scroll", b);
	e.addListener(mxEvent.REFRESH, mxUtils.bind(this,
	function(f) {
		this.outline.setStylesheet(e.getStylesheet());
		this.outline.refresh()
	}));
	this.bounds = new mxRectangle(0, 0, 0, 0);
	this.selectionBorder = new mxRectangleShape(this.bounds, null, mxConstants.OUTLINE_COLOR, mxConstants.OUTLINE_STROKEWIDTH);
	this.selectionBorder.dialect = (this.outline.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.selectionBorder.crisp = true;
	this.selectionBorder.init(this.outline.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(this.selectionBorder.node, this.outline);
	this.selectionBorder.node.style.background = "";
	this.sizer = this.createSizer();
	this.sizer.init(this.outline.getView().getOverlayPane());
	if (this.enabled) {
		this.sizer.node.style.cursor = "pointer"
	}
	mxEvent.addListener(this.sizer.node, (mxClient.IS_TOUCH) ? "touchstart": "mousedown", mxUtils.bind(this,
	function(f) {
		this.outline.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(f))
	}));
	this.selectionBorder.node.style.display = (this.showViewport) ? "": "none";
	this.sizer.node.style.display = this.selectionBorder.node.style.display;
	this.selectionBorder.node.style.cursor = "move";
	this.update(false)
}
mxOutline.prototype.source = null;
mxOutline.prototype.outline = null;
mxOutline.prototype.graphRenderHint = mxConstants.RENDERING_HINT_FASTER;
mxOutline.prototype.enabled = true;
mxOutline.prototype.showViewport = true;
mxOutline.prototype.border = 10;
mxOutline.prototype.sizerSize = 8;
mxOutline.prototype.sizerImage = null;
mxOutline.prototype.isEnabled = function() {
	return this.enabled
};
mxOutline.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxOutline.prototype.setZoomEnabled = function(a) {
	this.sizer.node.style.visibility = (a) ? "visible": "hidden"
};
mxOutline.prototype.refresh = function() {
	this.update(true)
};
mxOutline.prototype.createSizer = function() {
	if (this.sizerImage != null) {
		var a = new mxImageShape(new mxRectangle(0, 0, this.sizerImage.width, this.sizerImage.height), this.sizerImage.src);
		a.dialect = this.outline.dialect;
		return a
	} else {
		var a = new mxRectangleShape(new mxRectangle(0, 0, this.sizerSize, this.sizerSize), mxConstants.OUTLINE_HANDLE_FILLCOLOR, mxConstants.OUTLINE_HANDLE_STROKECOLOR);
		a.dialect = this.outline.dialect;
		a.crisp = true;
		return a
	}
};
mxOutline.prototype.update = function(g) {
	var v = this.source.view.scale;
	var k = this.source.getGraphBounds();
	var i = new mxRectangle(k.x / v, k.y / v, k.width / v, k.height / v);
	var u = Math.min(0, i.x);
	var e = Math.min(0, i.y);
	var o = new mxRectangle( - u, -e, this.source.container.clientWidth / v, this.source.container.clientHeight / v);
	var c = i;
	c.add(o);
	var l = Math.max(this.source.container.scrollWidth / v, c.width + c.x);
	var r = Math.max(this.source.container.scrollHeight / v, c.height + c.y);
	var a = Math.max(0, this.outline.container.clientWidth - this.border);
	var d = Math.max(0, this.outline.container.clientHeight - this.border);
	var f = Math.min(a / l, d / r);
	var z = f;
	if (z > 0) {
		if (this.outline.getView().scale != z) {
			this.outline.getView().scale = z;
			g = true
		}
		var s = this.outline.getView();
		if (s.currentRoot != this.source.getView().currentRoot) {
			s.setCurrentRoot(this.source.getView().currentRoot)
		}
		var n = this.source.view.translate;
		var y = n.x;
		var x = n.y;
		if (i.x < 0) {
			y = n.x - i.x
		}
		if (i.y < 0) {
			x = n.y - i.y
		}
		if (s.translate.x != y || s.translate.y != x) {
			s.translate.x = y;
			s.translate.y = x;
			g = true
		}
		var h = s.translate;
		var z = this.source.getView().scale;
		var q = z / s.scale;
		var p = 1 / s.scale;
		var m = this.source.container;
		this.bounds = new mxRectangle((h.x - n.x) / p, (h.y - n.y) / p, (m.clientWidth / q), (m.clientHeight / q));
		this.bounds.x += this.source.container.scrollLeft * s.scale / z;
		this.bounds.y += this.source.container.scrollTop * s.scale / z;
		this.selectionBorder.bounds = this.bounds;
		this.selectionBorder.redraw();
		var w = this.sizer.bounds;
		this.sizer.bounds = new mxRectangle(this.bounds.x + this.bounds.width - w.width / 2, this.bounds.y + this.bounds.height - w.height / 2, w.width, w.height);
		this.sizer.redraw();
		if (g) {
			this.outline.view.revalidate()
		}
	}
};
mxOutline.prototype.mouseDown = function(a, b) {
	if (this.enabled && this.showViewport) {
		this.zoom = b.isSource(this.sizer);
		this.startX = b.getX();
		this.startY = b.getY();
		this.active = true;
		if (this.source.useScrollbarsForPanning && mxUtils.hasScrollbars(this.source.container)) {
			this.dx0 = this.source.container.scrollLeft;
			this.dy0 = this.source.container.scrollTop
		} else {
			this.dx0 = 0;
			this.dy0 = 0
		}
	}
	b.consume()
};
mxOutline.prototype.mouseMove = function(e, f) {
	if (this.active) {
		this.selectionBorder.node.style.display = (this.showViewport) ? "": "none";
		this.sizer.node.style.display = this.selectionBorder.node.style.display;
		var k = f.getX() - this.startX;
		var h = f.getY() - this.startY;
		var a = null;
		if (!this.zoom) {
			var d = this.outline.getView().scale;
			a = new mxRectangle(this.bounds.x + k, this.bounds.y + h, this.bounds.width, this.bounds.height);
			this.selectionBorder.bounds = a;
			this.selectionBorder.redraw();
			k /= d;
			k *= this.source.getView().scale;
			h /= d;
			h *= this.source.getView().scale;
			this.source.panGraph( - k - this.dx0, -h - this.dy0)
		} else {
			var c = this.source.container;
			var i = c.clientWidth / c.clientHeight;
			h = k / i;
			a = new mxRectangle(this.bounds.x, this.bounds.y, Math.max(1, this.bounds.width + k), Math.max(1, this.bounds.height + h));
			this.selectionBorder.bounds = a;
			this.selectionBorder.redraw()
		}
		var g = this.sizer.bounds;
		this.sizer.bounds = new mxRectangle(a.x + a.width - g.width / 2, a.y + a.height - g.height / 2, g.width, g.height);
		this.sizer.redraw();
		f.consume()
	}
};
mxOutline.prototype.mouseUp = function(e, f) {
	if (this.active) {
		var c = f.getX() - this.startX;
		var b = f.getY() - this.startY;
		if (Math.abs(c) > 0 || Math.abs(b) > 0) {
			if (!this.zoom) {
				if (!this.source.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.source.container)) {
					this.source.panGraph(0, 0);
					c /= this.outline.getView().scale;
					b /= this.outline.getView().scale;
					var d = this.source.getView().translate;
					this.source.getView().setTranslate(d.x - c, d.y - b)
				}
			} else {
				var a = this.selectionBorder.bounds.width;
				var g = this.source.getView().scale;
				this.source.getView().setScale(g - (c * g) / a)
			}
			this.update();
			f.consume()
		}
		this.index = null;
		this.active = false
	}
};
function mxMultiplicity(a, g, e, k, c, i, b, d, h, f) {
	this.source = a;
	this.type = g;
	this.attr = e;
	this.value = k;
	this.min = (c != null) ? c: 0;
	this.max = (i != null) ? i: "n";
	this.validNeighbors = b;
	this.countError = mxResources.get(d) || d;
	this.typeError = mxResources.get(h) || h;
	this.validNeighborsAllowed = (f != null) ? f: true
}
mxMultiplicity.prototype.type = null;
mxMultiplicity.prototype.attr = null;
mxMultiplicity.prototype.value = null;
mxMultiplicity.prototype.source = null;
mxMultiplicity.prototype.min = null;
mxMultiplicity.prototype.max = null;
mxMultiplicity.prototype.validNeighbors = null;
mxMultiplicity.prototype.validNeighborsAllowed = true;
mxMultiplicity.prototype.countError = null;
mxMultiplicity.prototype.typeError = null;
mxMultiplicity.prototype.check = function(f, d, e, h, c, b) {
	var a = "";
	if ((this.source && this.checkTerminal(f, e, d)) || (!this.source && this.checkTerminal(f, h, d))) {
		if (this.countError != null && ((this.source && (this.max == 0 || (c >= this.max))) || (!this.source && (this.max == 0 || (b >= this.max))))) {
			a += this.countError + "\n"
		}
		if (this.validNeighbors != null && this.typeError != null && this.validNeighbors.length > 0) {
			var g = this.checkNeighbors(f, d, e, h);
			if (!g) {
				a += this.typeError + "\n"
			}
		}
	}
	return (a.length > 0) ? a: null
};
mxMultiplicity.prototype.checkNeighbors = function(h, c, a, f) {
	var g = h.model.getValue(a);
	var e = h.model.getValue(f);
	var i = !this.validNeighborsAllowed;
	var b = this.validNeighbors;
	for (var d = 0; d < b.length; d++) {
		if (this.source && this.checkType(h, e, b[d])) {
			i = this.validNeighborsAllowed;
			break
		} else {
			if (!this.source && this.checkType(h, g, b[d])) {
				i = this.validNeighborsAllowed;
				break
			}
		}
	}
	return i
};
mxMultiplicity.prototype.checkTerminal = function(d, a, b) {
	var c = d.model.getValue(a);
	return this.checkType(d, c, this.type, this.attr, this.value)
};
mxMultiplicity.prototype.checkType = function(d, c, b, a, e) {
	if (c != null) {
		if (!isNaN(c.nodeType)) {
			return mxUtils.isNode(c, b, a, e)
		} else {
			return c == b
		}
	}
	return false
};
function mxLayoutManager(a) {
	this.undoHandler = mxUtils.bind(this,
	function(c, b) {
		if (this.isEnabled()) {
			this.beforeUndo(b.getProperty("edit"))
		}
	});
	this.moveHandler = mxUtils.bind(this,
	function(c, b) {
		if (this.isEnabled()) {
			this.cellsMoved(b.getProperty("cells"), b.getProperty("event"))
		}
	});
	this.setGraph(a)
}
mxLayoutManager.prototype = new mxEventSource();
mxLayoutManager.prototype.constructor = mxLayoutManager;
mxLayoutManager.prototype.graph = null;
mxLayoutManager.prototype.bubbling = true;
mxLayoutManager.prototype.enabled = true;
mxLayoutManager.prototype.updateHandler = null;
mxLayoutManager.prototype.moveHandler = null;
mxLayoutManager.prototype.isEnabled = function() {
	return this.enabled
};
mxLayoutManager.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxLayoutManager.prototype.isBubbling = function() {
	return this.bubbling
};
mxLayoutManager.prototype.setBubbling = function(a) {
	this.bubbling = a
};
mxLayoutManager.prototype.getGraph = function() {
	return this.graph
};
mxLayoutManager.prototype.setGraph = function(b) {
	if (this.graph != null) {
		var a = this.graph.getModel();
		a.removeListener(this.undoHandler);
		this.graph.removeListener(this.moveHandler)
	}
	this.graph = b;
	if (this.graph != null) {
		var a = this.graph.getModel();
		a.addListener(mxEvent.BEFORE_UNDO, this.undoHandler);
		this.graph.addListener(mxEvent.MOVE_CELLS, this.moveHandler)
	}
};
mxLayoutManager.prototype.getLayout = function(a) {
	return null
};
mxLayoutManager.prototype.beforeUndo = function(c) {
	var b = this.getCellsForChanges(c.changes);
	var a = this.getGraph().getModel();
	if (this.isBubbling()) {
		var d = a.getParents(b);
		while (d.length > 0) {
			b = b.concat(d);
			d = a.getParents(d)
		}
	}
	this.layoutCells(mxUtils.sortCells(b, false))
};
mxLayoutManager.prototype.cellsMoved = function(d, b) {
	if (d != null && b != null) {
		var a = mxUtils.convertPoint(this.getGraph().container, mxEvent.getClientX(b), mxEvent.getClientY(b));
		var c = this.getGraph().getModel();
		for (var e = 0; e < d.length; e++) {
			var f = this.getLayout(c.getParent(d[e]));
			if (f != null) {
				f.moveCell(d[e], a.x, a.y)
			}
		}
	}
};
mxLayoutManager.prototype.getCellsForChanges = function(e) {
	var a = [];
	var f = new Object();
	for (var d = 0; d < e.length; d++) {
		var h = e[d];
		if (h instanceof mxRootChange) {
			return []
		} else {
			var c = this.getCellsForChange(h);
			for (var b = 0; b < c.length; b++) {
				if (c[b] != null) {
					var g = mxCellPath.create(c[b]);
					if (f[g] == null) {
						f[g] = c[b];
						a.push(c[b])
					}
				}
			}
		}
	}
	return a
};
mxLayoutManager.prototype.getCellsForChange = function(b) {
	var a = this.getGraph().getModel();
	if (b instanceof mxChildChange) {
		return [b.child, b.previous, a.getParent(b.child)]
	} else {
		if (b instanceof mxTerminalChange || b instanceof mxGeometryChange) {
			return [b.cell, a.getParent(b.cell)]
		}
	}
	return []
};
mxLayoutManager.prototype.layoutCells = function(b) {
	if (b.length > 0) {
		var a = this.getGraph().getModel();
		a.beginUpdate();
		try {
			var d = null;
			for (var c = 0; c < b.length; c++) {
				if (b[c] != a.getRoot() && b[c] != d) {
					d = b[c];
					this.executeLayout(this.getLayout(d), d)
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.LAYOUT_CELLS, "cells", b))
		} finally {
			a.endUpdate()
		}
	}
};
mxLayoutManager.prototype.executeLayout = function(b, a) {
	if (b != null && a != null) {
		b.execute(a)
	}
};
mxLayoutManager.prototype.destroy = function() {
	this.setGraph(null)
};
function mxSpaceManager(c, b, d, a) {
	this.resizeHandler = mxUtils.bind(this,
	function(f, e) {
		if (this.isEnabled()) {
			this.cellsResized(e.getProperty("cells"))
		}
	});
	this.foldHandler = mxUtils.bind(this,
	function(f, e) {
		if (this.isEnabled()) {
			this.cellsResized(e.getProperty("cells"))
		}
	});
	this.shiftRightwards = (b != null) ? b: true;
	this.shiftDownwards = (d != null) ? d: true;
	this.extendParents = (a != null) ? a: true;
	this.setGraph(c)
}
mxSpaceManager.prototype = new mxEventSource();
mxSpaceManager.prototype.constructor = mxSpaceManager;
mxSpaceManager.prototype.graph = null;
mxSpaceManager.prototype.enabled = true;
mxSpaceManager.prototype.shiftRightwards = true;
mxSpaceManager.prototype.shiftDownwards = true;
mxSpaceManager.prototype.extendParents = true;
mxSpaceManager.prototype.resizeHandler = null;
mxSpaceManager.prototype.foldHandler = null;
mxSpaceManager.prototype.isCellIgnored = function(a) {
	return ! this.getGraph().getModel().isVertex(a)
};
mxSpaceManager.prototype.isCellShiftable = function(a) {
	return this.getGraph().getModel().isVertex(a) && this.getGraph().isCellMovable(a)
};
mxSpaceManager.prototype.isEnabled = function() {
	return this.enabled
};
mxSpaceManager.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxSpaceManager.prototype.isShiftRightwards = function() {
	return this.shiftRightwards
};
mxSpaceManager.prototype.setShiftRightwards = function(a) {
	this.shiftRightwards = a
};
mxSpaceManager.prototype.isShiftDownwards = function() {
	return this.shiftDownwards
};
mxSpaceManager.prototype.setShiftDownwards = function(a) {
	this.shiftDownwards = a
};
mxSpaceManager.prototype.isExtendParents = function() {
	return this.extendParents
};
mxSpaceManager.prototype.setExtendParents = function(a) {
	this.extendParents = a
};
mxSpaceManager.prototype.getGraph = function() {
	return this.graph
};
mxSpaceManager.prototype.setGraph = function(a) {
	if (this.graph != null) {
		this.graph.removeListener(this.resizeHandler);
		this.graph.removeListener(this.foldHandler)
	}
	this.graph = a;
	if (this.graph != null) {
		this.graph.addListener(mxEvent.RESIZE_CELLS, this.resizeHandler);
		this.graph.addListener(mxEvent.FOLD_CELLS, this.foldHandler)
	}
};
mxSpaceManager.prototype.cellsResized = function(b) {
	if (b != null) {
		var a = this.graph.getModel();
		a.beginUpdate();
		try {
			for (var c = 0; c < b.length; c++) {
				if (!this.isCellIgnored(b[c])) {
					this.cellResized(b[c]);
					break
				}
			}
		} finally {
			a.endUpdate()
		}
	}
};
mxSpaceManager.prototype.cellResized = function(b) {
	var c = this.getGraph();
	var o = c.getView();
	var h = c.getModel();
	var k = o.getState(b);
	var s = o.getState(h.getParent(b));
	if (k != null && s != null) {
		var g = this.getCellsToShift(k);
		var u = h.getGeometry(b);
		if (g != null && u != null) {
			var a = o.translate;
			var t = o.scale;
			var q = k.x - s.origin.x - a.x * t;
			var e = k.y - s.origin.y - a.y * t;
			var r = k.x + k.width;
			var l = k.y + k.height;
			var n = k.width - u.width * t + q - u.x * t;
			var m = k.height - u.height * t + e - u.y * t;
			var f = 1 - u.width * t / k.width;
			var d = 1 - u.height * t / k.height;
			h.beginUpdate();
			try {
				for (var p = 0; p < g.length; p++) {
					if (g[p] != b && this.isCellShiftable(g[p])) {
						this.shiftCell(g[p], n, m, q, e, r, l, f, d, this.isExtendParents() && c.isExtendParent(g[p]))
					}
				}
			} finally {
				h.endUpdate()
			}
		}
	}
};
mxSpaceManager.prototype.shiftCell = function(l, q, p, e, i, k, a, d, c, h) {
	var n = this.getGraph();
	var b = n.getView().getState(l);
	if (b != null) {
		var g = n.getModel();
		var f = g.getGeometry(l);
		if (f != null) {
			g.beginUpdate();
			try {
				if (this.isShiftRightwards()) {
					if (b.x >= k) {
						f = f.clone();
						f.translate( - q, 0)
					} else {
						var o = Math.max(0, b.x - x0);
						f = f.clone();
						f.translate( - d * o, 0)
					}
				}
				if (this.isShiftDownwards()) {
					if (b.y >= a) {
						f = f.clone();
						f.translate(0, -p)
					} else {
						var m = Math.max(0, b.y - i);
						f = f.clone();
						f.translate(0, -c * m)
					}
				}
				if (f != g.getGeometry(l)) {
					g.setGeometry(l, f);
					if (h) {
						n.extendParent(l)
					}
				}
			} finally {
				g.endUpdate()
			}
		}
	}
};
mxSpaceManager.prototype.getCellsToShift = function(d) {
	var c = this.getGraph();
	var b = c.getModel().getParent(d.cell);
	var e = this.isShiftDownwards();
	var a = this.isShiftRightwards();
	return c.getCellsBeyond(d.x + ((e) ? 0 : d.width), d.y + ((e && a) ? 0 : d.height), b, a, e)
};
mxSpaceManager.prototype.destroy = function() {
	this.setGraph(null)
};
function mxSwimlaneManager(d, b, c, a) {
	this.horizontal = (b != null) ? b: true;
	this.addEnabled = (c != null) ? c: true;
	this.resizeEnabled = (a != null) ? a: true;
	this.addHandler = mxUtils.bind(this,
	function(f, e) {
		if (this.isEnabled() && this.isAddEnabled()) {
			this.cellsAdded(e.getProperty("cells"))
		}
	});
	this.resizeHandler = mxUtils.bind(this,
	function(f, e) {
		if (this.isEnabled() && this.isResizeEnabled()) {
			this.cellsResized(e.getProperty("cells"))
		}
	});
	this.setGraph(d)
}
mxSwimlaneManager.prototype = new mxEventSource();
mxSwimlaneManager.prototype.constructor = mxSwimlaneManager;
mxSwimlaneManager.prototype.graph = null;
mxSwimlaneManager.prototype.enabled = true;
mxSwimlaneManager.prototype.horizontal = true;
mxSwimlaneManager.prototype.addEnabled = true;
mxSwimlaneManager.prototype.resizeEnabled = true;
mxSwimlaneManager.prototype.addHandler = null;
mxSwimlaneManager.prototype.resizeHandler = null;
mxSwimlaneManager.prototype.isEnabled = function() {
	return this.enabled
};
mxSwimlaneManager.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxSwimlaneManager.prototype.isHorizontal = function() {
	return this.horizontal
};
mxSwimlaneManager.prototype.setHorizontal = function(a) {
	this.horizontal = a
};
mxSwimlaneManager.prototype.isAddEnabled = function() {
	return this.addEnabled
};
mxSwimlaneManager.prototype.setAddEnabled = function(a) {
	this.addEnabled = a
};
mxSwimlaneManager.prototype.isResizeEnabled = function() {
	return this.resizeEnabled
};
mxSwimlaneManager.prototype.setResizeEnabled = function(a) {
	this.resizeEnabled = a
};
mxSwimlaneManager.prototype.getGraph = function() {
	return this.graph
};
mxSwimlaneManager.prototype.setGraph = function(a) {
	if (this.graph != null) {
		this.graph.removeListener(this.addHandler);
		this.graph.removeListener(this.resizeHandler)
	}
	this.graph = a;
	if (this.graph != null) {
		this.graph.addListener(mxEvent.ADD_CELLS, this.addHandler);
		this.graph.addListener(mxEvent.CELLS_RESIZED, this.resizeHandler)
	}
};
mxSwimlaneManager.prototype.isSwimlaneIgnored = function(a) {
	return ! this.getGraph().isSwimlane(a)
};
mxSwimlaneManager.prototype.isCellHorizontal = function(a) {
	if (this.graph.isSwimlane(a)) {
		var c = this.graph.view.getState(a);
		var b = (c != null) ? c.style: this.graph.getCellStyle(a);
		return mxUtils.getValue(b, mxConstants.STYLE_HORIZONTAL, 1) == 1
	}
	return ! this.isHorizontal()
};
mxSwimlaneManager.prototype.cellsAdded = function(b) {
	if (b != null) {
		var a = this.getGraph().getModel();
		a.beginUpdate();
		try {
			for (var c = 0; c < b.length; c++) {
				if (!this.isSwimlaneIgnored(b[c])) {
					this.swimlaneAdded(b[c])
				}
			}
		} finally {
			a.endUpdate()
		}
	}
};
mxSwimlaneManager.prototype.swimlaneAdded = function(e) {
	var b = this.getGraph().getModel();
	var d = b.getParent(e);
	var a = b.getChildCount(d);
	var f = null;
	for (var c = 0; c < a; c++) {
		var g = b.getChildAt(d, c);
		if (g != e && !this.isSwimlaneIgnored(g)) {
			f = b.getGeometry(g);
			if (f != null) {
				break
			}
		}
	}
	if (f != null) {
		this.resizeSwimlane(e, f.width, f.height)
	}
};
mxSwimlaneManager.prototype.cellsResized = function(b) {
	if (b != null) {
		var a = this.getGraph().getModel();
		a.beginUpdate();
		try {
			for (var e = 0; e < b.length; e++) {
				if (!this.isSwimlaneIgnored(b[e])) {
					var h = a.getGeometry(b[e]);
					if (h != null) {
						var d = new mxRectangle(0, 0, h.width, h.height);
						var g = b[e];
						var f = g;
						while (f != null) {
							g = f;
							f = a.getParent(f);
							var c = (this.graph.isSwimlane(f)) ? this.graph.getStartSize(f) : new mxRectangle();
							d.width += c.width;
							d.height += c.height
						}
						this.resizeSwimlane(g, d.width, d.height)
					}
				}
			}
		} finally {
			a.endUpdate()
		}
	}
};
mxSwimlaneManager.prototype.resizeSwimlane = function(l, m, g) {
	var k = this.getGraph().getModel();
	k.beginUpdate();
	try {
		if (!this.isSwimlaneIgnored(l)) {
			var e = k.getGeometry(l);
			if (e != null) {
				var a = this.isCellHorizontal(l);
				if ((a && e.height != g) || (!a && e.width != m)) {
					e = e.clone();
					if (a) {
						e.height = g
					} else {
						e.width = m
					}
					k.setGeometry(l, e)
				}
			}
		}
		var f = (this.graph.isSwimlane(l)) ? this.graph.getStartSize(l) : new mxRectangle();
		m -= f.width;
		g -= f.height;
		var c = k.getChildCount(l);
		for (var d = 0; d < c; d++) {
			var b = k.getChildAt(l, d);
			this.resizeSwimlane(b, m, g)
		}
	} finally {
		k.endUpdate()
	}
};
mxSwimlaneManager.prototype.destroy = function() {
	this.setGraph(null)
};
function mxTemporaryCellStates(a, g, b) {
	this.view = a;
	g = (g != null) ? g: 1;
	this.oldBounds = a.getGraphBounds();
	this.oldStates = a.getStates();
	this.oldScale = a.getScale();
	a.setStates(new mxDictionary());
	a.setScale(g);
	if (b != null) {
		var e = a.createState(new mxCell());
		for (var c = 0; c < b.length; c++) {
			a.validateBounds(e, b[c])
		}
		var f = null;
		for (var c = 0; c < b.length; c++) {
			var d = a.validatePoints(e, b[c]);
			if (f == null) {
				f = d
			} else {
				f.add(d)
			}
		}
		if (f == null) {
			f = new mxRectangle()
		}
		a.setGraphBounds(f)
	}
}
mxTemporaryCellStates.prototype.view = null;
mxTemporaryCellStates.prototype.oldStates = null;
mxTemporaryCellStates.prototype.oldBounds = null;
mxTemporaryCellStates.prototype.oldScale = null;
mxTemporaryCellStates.prototype.destroy = function() {
	this.view.setScale(this.oldScale);
	this.view.setStates(this.oldStates);
	this.view.setGraphBounds(this.oldBounds)
};
function mxCellStatePreview(a) {
	this.graph = a;
	this.deltas = new Object()
}
mxCellStatePreview.prototype.graph = null;
mxCellStatePreview.prototype.deltas = null;
mxCellStatePreview.prototype.count = 0;
mxCellStatePreview.prototype.isEmpty = function() {
	return this.count == 0
};
mxCellStatePreview.prototype.moveState = function(d, b, a, e, c) {
	e = (e != null) ? e: true;
	c = (c != null) ? c: true;
	var g = mxCellPath.create(d.cell);
	var f = this.deltas[g];
	if (f == null) {
		f = new mxPoint(b, a);
		this.deltas[g] = f;
		this.count++
	} else {
		if (e) {
			f.X += b;
			f.Y += a
		} else {
			f.X = b;
			f.Y = a
		}
	}
	if (c) {
		this.addEdges(d)
	}
	return f
};
mxCellStatePreview.prototype.show = function(f) {
	var c = this.graph.getModel();
	var b = c.getRoot();
	for (var h in this.deltas) {
		var a = mxCellPath.resolve(b, h);
		var e = this.graph.view.getState(a);
		var g = this.deltas[h];
		var d = this.graph.view.getState(c.getParent(a));
		this.translateState(d, e, g.x, g.y)
	}
	for (var h in this.deltas) {
		var a = mxCellPath.resolve(b, h);
		var e = this.graph.view.getState(a);
		var g = this.deltas[h];
		var d = this.graph.view.getState(c.getParent(a));
		this.revalidateState(d, e, g.x, g.y, f)
	}
};
mxCellStatePreview.prototype.translateState = function(g, a, k, h) {
	if (a != null) {
		var f = this.graph.getModel();
		if (f.isVertex(a.cell)) {
			a.invalid = true;
			this.graph.view.validateBounds(g, a.cell);
			var e = f.getGeometry(a.cell);
			var b = mxCellPath.create(a.cell);
			if ((k != 0 || h != 0) && e != null && (!e.relative || this.deltas[b] != null)) {
				a.x += k;
				a.y += h
			}
		}
		var c = f.getChildCount(a.cell);
		for (var d = 0; d < c; d++) {
			this.translateState(a, this.graph.view.getState(f.getChildAt(a.cell, d)), k, h)
		}
	}
};
mxCellStatePreview.prototype.revalidateState = function(h, a, l, k, g) {
	if (a != null) {
		a.invalid = true;
		this.graph.view.validatePoints(h, a.cell);
		var b = mxCellPath.create(a.cell);
		var f = this.graph.getModel();
		var e = this.graph.getCellGeometry(a.cell);
		if ((l != 0 || k != 0) && e != null && e.relative && f.isVertex(a.cell) && (h == null || f.isVertex(h.cell) || this.deltas[b] != null)) {
			a.x += l;
			a.y += k;
			this.graph.view.updateLabelBounds(a);
			this.graph.cellRenderer.redraw(a)
		}
		if (g != null) {
			g(a)
		}
		var c = f.getChildCount(a.cell);
		for (var d = 0; d < c; d++) {
			this.revalidateState(a, this.graph.view.getState(f.getChildAt(a.cell, d)), l, k, g)
		}
	}
};
mxCellStatePreview.prototype.addEdges = function(d) {
	var a = this.graph.getModel();
	var e = a.getEdgeCount(d.cell);
	for (var b = 0; b < e; b++) {
		var c = this.graph.view.getState(a.getEdgeAt(d.cell, b));
		if (c != null) {
			this.moveState(c, 0, 0)
		}
	}
};
function mxConnectionConstraint(a, b) {
	this.point = a;
	this.perimeter = (b != null) ? b: true
}
mxConnectionConstraint.prototype.point = null;
mxConnectionConstraint.prototype.perimeter = null;
function mxGraphHandler(a) {
	this.graph = a;
	this.graph.addMouseListener(this)
}
mxGraphHandler.prototype.graph = null;
mxGraphHandler.prototype.maxCells = (mxClient.IS_IE) ? 20 : 50;
mxGraphHandler.prototype.enabled = true;
mxGraphHandler.prototype.highlightEnabled = true;
mxGraphHandler.prototype.cloneEnabled = true;
mxGraphHandler.prototype.moveEnabled = true;
mxGraphHandler.prototype.guidesEnabled = false;
mxGraphHandler.prototype.guide = null;
mxGraphHandler.prototype.currentDx = null;
mxGraphHandler.prototype.currentDy = null;
mxGraphHandler.prototype.updateCursor = true;
mxGraphHandler.prototype.selectEnabled = true;
mxGraphHandler.prototype.removeCellsFromParent = true;
mxGraphHandler.prototype.connectOnDrop = false;
mxGraphHandler.prototype.scrollOnMove = true;
mxGraphHandler.prototype.minimumSize = 6;
mxGraphHandler.prototype.previewColor = "black";
mxGraphHandler.prototype.htmlPreview = false;
mxGraphHandler.prototype.shape = null;
mxGraphHandler.prototype.scaleGrid = false;
mxGraphHandler.prototype.crisp = true;
mxGraphHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxGraphHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxGraphHandler.prototype.isCloneEnabled = function() {
	return this.cloneEnabled
};
mxGraphHandler.prototype.setCloneEnabled = function(a) {
	this.cloneEnabled = a
};
mxGraphHandler.prototype.isMoveEnabled = function() {
	return this.moveEnabled
};
mxGraphHandler.prototype.setMoveEnabled = function(a) {
	this.moveEnabled = a
};
mxGraphHandler.prototype.isSelectEnabled = function() {
	return this.selectEnabled
};
mxGraphHandler.prototype.setSelectEnabled = function(a) {
	this.selectEnabled = a
};
mxGraphHandler.prototype.isRemoveCellsFromParent = function() {
	return this.removeCellsFromParent
};
mxGraphHandler.prototype.setRemoveCellsFromParent = function(a) {
	this.removeCellsFromParent = a
};
mxGraphHandler.prototype.mouseDown = function(c, d) {
	if (!d.isConsumed() && this.isEnabled() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(d.getEvent()) && d.getState() != null) {
		var a = d.getCell();
		this.cell = null;
		this.delayedSelection = this.graph.isCellSelected(a);
		if (this.isSelectEnabled() && !this.delayedSelection) {
			this.graph.selectCellForEvent(a, d.getEvent())
		}
		if (this.isMoveEnabled()) {
			var b = this.graph.model;
			var e = b.getGeometry(a);
			if (this.graph.isCellMovable(a) && ((!b.isEdge(a) || this.graph.getSelectionCount() > 1 || (e.points != null && e.points.length > 0) || b.getTerminal(a, true) == null || b.getTerminal(a, false) == null) || this.graph.allowDanglingEdges || (this.graph.isCloneEvent(d.getEvent()) && this.graph.isCellsCloneable()))) {
				this.start(a, d.getX(), d.getY())
			}
			this.cellWasClicked = true;
			if ((!mxClient.IS_SF && !mxClient.IS_GC) || d.getSource().nodeName != "SELECT") {
				d.consume()
			} else {
				if (false && d.getSource().nodeName == "SELECT") {
					this.cellWasClicked = false;
					this.first = null
				}
			}
		}
	}
};
mxGraphHandler.prototype.getGuideStates = function() {
	var c = this.graph.getDefaultParent();
	var a = this.graph.getModel();
	var b = mxUtils.bind(this,
	function(d) {
		return this.graph.view.getState(d) != null && a.isVertex(d) && a.getGeometry(d) != null && !a.getGeometry(d).relative
	});
	return this.graph.view.getCellStates(a.filterDescendants(b, c))
};
mxGraphHandler.prototype.getCells = function(a) {
	if (!this.graph.isCellSelected(a) && this.graph.isCellMovable(a)) {
		return [a]
	} else {
		return this.graph.getMovableCells(this.graph.getSelectionCells())
	}
};
mxGraphHandler.prototype.getPreviewBounds = function(c) {
	var d = this.graph.getView().getBounds(c);
	if (d != null) {
		if (d.width < this.minimumSize) {
			var b = this.minimumSize - d.width;
			d.x -= b / 2;
			d.width = this.minimumSize
		}
		if (d.height < this.minimumSize) {
			var a = this.minimumSize - d.height;
			d.y -= a / 2;
			d.height = this.minimumSize
		}
	}
	return d
};
mxGraphHandler.prototype.createPreviewShape = function(b) {
	var a = new mxRectangleShape(b, null, this.previewColor);
	a.isDashed = true;
	a.crisp = this.crisp;
	if (this.htmlPreview) {
		a.dialect = mxConstants.DIALECT_STRICTHTML;
		a.init(this.graph.container)
	} else {
		a.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		a.init(this.graph.getView().getOverlayPane());
		if (a.dialect == mxConstants.DIALECT_SVG) {
			a.node.setAttribute("style", "pointer-events:none;")
		} else {
			a.node.style.background = ""
		}
	}
	return a
};
mxGraphHandler.prototype.start = function(b, a, c) {
	this.cell = b;
	this.first = mxUtils.convertPoint(this.graph.container, a, c);
	this.cells = this.getCells(this.cell);
	this.bounds = this.getPreviewBounds(this.cells);
	if (this.guidesEnabled) {
		this.guide = new mxGuide(this.graph, this.getGuideStates())
	}
};
mxGraphHandler.prototype.useGuidesForEvent = function(a) {
	return (this.guide != null) ? this.guide.isEnabledForEvent(a.getEvent()) : true
};
mxGraphHandler.prototype.snap = function(a) {
	var b = (this.scaleGrid) ? this.graph.view.scale: 1;
	a.x = this.graph.snap(a.x / b) * b;
	a.y = this.graph.snap(a.y / b) * b;
	return a
};
mxGraphHandler.prototype.mouseMove = function(c, y) {
	var b = this.graph;
	if (!y.isConsumed() && b.isMouseDown && this.cell != null && this.first != null && this.bounds != null) {
		var p = mxUtils.convertPoint(b.container, y.getX(), y.getY());
		var l = p.x - this.first.x;
		var k = p.y - this.first.y;
		var o = b.tolerance;
		if (this.shape != null || Math.abs(l) > o || Math.abs(k) > o) {
			if (this.highlight == null) {
				this.highlight = new mxCellHighlight(this.graph, mxConstants.DROP_TARGET_COLOR, 3)
			}
			if (this.shape == null) {
				this.shape = this.createPreviewShape(this.bounds)
			}
			var t = b.isGridEnabledEvent(y.getEvent());
			var n = true;
			if (this.guide != null && this.useGuidesForEvent(y)) {
				var u = this.guide.move(this.bounds, new mxPoint(l, k), t);
				n = false;
				l = u.x;
				k = u.y
			} else {
				if (t) {
					var i = b.getView().translate;
					var A = b.getView().scale;
					var x = this.bounds.x - (b.snap(this.bounds.x / A - i.x) + i.x) * A;
					var w = this.bounds.y - (b.snap(this.bounds.y / A - i.y) + i.y) * A;
					var m = this.snap(new mxPoint(l, k));
					l = m.x - x;
					k = m.y - w
				}
			}
			if (this.guide != null && n) {
				this.guide.hide()
			}
			if (b.isConstrainedEvent(y.getEvent())) {
				if (Math.abs(l) > Math.abs(k)) {
					k = 0
				} else {
					l = 0
				}
			}
			this.currentDx = l;
			this.currentDy = k;
			this.shape.bounds = new mxRectangle(this.bounds.x + l, this.bounds.y + k, this.bounds.width, this.bounds.height);
			this.shape.redraw();
			var z = null;
			var a = y.getCell();
			if (b.isDropEnabled() && this.highlightEnabled) {
				z = b.getDropTarget(this.cells, y.getEvent(), a)
			}
			var h = z;
			var d = b.getModel();
			while (h != null && h != this.cell) {
				h = d.getParent(h)
			}
			var s = b.isCloneEvent(y.getEvent()) && b.isCellsCloneable() && this.isCloneEnabled();
			var g = b.getView().getState(z);
			var f = false;
			if (g != null && h == null && (d.getParent(this.cell) != z || s)) {
				if (this.target != z) {
					this.target = z;
					this.setHighlightColor(mxConstants.DROP_TARGET_COLOR)
				}
				f = true
			} else {
				this.target = null;
				if (this.connectOnDrop && a != null && this.cells.length == 1 && b.getModel().isVertex(a) && b.isCellConnectable(a)) {
					g = b.getView().getState(a);
					if (g != null) {
						var r = b.getEdgeValidationError(null, this.cell, a);
						var q = (r == null) ? mxConstants.VALID_COLOR: mxConstants.INVALID_CONNECT_TARGET_COLOR;
						this.setHighlightColor(q);
						f = true
					}
				}
			}
			if (g != null && f) {
				this.highlight.highlight(g)
			} else {
				this.highlight.hide()
			}
		}
		y.consume();
		mxEvent.consume(y.getEvent())
	} else {
		if ((this.isMoveEnabled() || this.isCloneEnabled()) && this.updateCursor && !y.isConsumed() && y.getState() != null && !b.isMouseDown) {
			var e = b.getCursorForCell(y.getCell());
			if (e == null && b.isEnabled() && b.isCellMovable(y.getCell())) {
				if (b.getModel().isEdge(y.getCell())) {
					e = mxConstants.CURSOR_MOVABLE_EDGE
				} else {
					e = mxConstants.CURSOR_MOVABLE_VERTEX
				}
			}
			y.getState().setCursor(e);
			y.consume()
		}
	}
};
mxGraphHandler.prototype.setHighlightColor = function(a) {
	if (this.highlight != null) {
		this.highlight.setHighlightColor(a)
	}
};
mxGraphHandler.prototype.mouseUp = function(b, e) {
	if (!e.isConsumed()) {
		var g = this.graph;
		if (this.cell != null && this.first != null && this.shape != null && this.currentDx != null && this.currentDy != null) {
			var a = g.getView().scale;
			var d = g.isCloneEvent(e.getEvent()) && g.isCellsCloneable() && this.isCloneEnabled();
			var i = this.currentDx / a;
			var h = this.currentDy / a;
			var f = e.getCell();
			if (this.connectOnDrop && this.target == null && f != null && g.getModel().isVertex(f) && g.isCellConnectable(f) && g.isEdgeValid(null, this.cell, f)) {
				g.connectionHandler.connect(this.cell, f, e.getEvent())
			} else {
				var c = this.target;
				if (g.isSplitEnabled() && g.isSplitTarget(c, this.cells, e.getEvent())) {
					g.splitEdge(c, this.cells, null, i, h)
				} else {
					this.moveCells(this.cells, i, h, d, this.target, e.getEvent())
				}
			}
		} else {
			if (this.isSelectEnabled() && this.delayedSelection && this.cell != null) {
				g.selectCellForEvent(this.cell, e.getEvent())
			}
		}
	}
	if (this.cellWasClicked) {
		e.consume()
	}
	this.reset()
};
mxGraphHandler.prototype.reset = function() {
	this.destroyShapes();
	this.cellWasClicked = false;
	this.delayedSelection = false;
	this.currentDx = null;
	this.currentDy = null;
	this.guides = null;
	this.first = null;
	this.cell = null;
	this.target = null
};
mxGraphHandler.prototype.shouldRemoveCellsFromParent = function(d, c, a) {
	if (this.graph.getModel().isVertex(d)) {
		var b = this.graph.getView().getState(d);
		var e = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(a), mxEvent.getClientY(a));
		return b != null && !mxUtils.contains(b, e.x, e.y)
	}
	return false
};
mxGraphHandler.prototype.moveCells = function(d, c, b, f, e, a) {
	if (f) {
		d = this.graph.getCloneableCells(d)
	}
	if (e == null && this.isRemoveCellsFromParent() && this.shouldRemoveCellsFromParent(this.graph.getModel().getParent(this.cell), d, a)) {
		e = this.graph.getDefaultParent()
	}
	d = this.graph.moveCells(d, c, b, f, e, a);
	if (this.isSelectEnabled() && this.scrollOnMove) {
		this.graph.scrollCellToVisible(d[0])
	}
	if (f) {
		this.graph.setSelectionCells(d)
	}
};
mxGraphHandler.prototype.destroyShapes = function() {
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null
	}
	if (this.guide != null) {
		this.guide.destroy();
		this.guide = null
	}
	if (this.highlight != null) {
		this.highlight.destroy();
		this.highlight = null
	}
};
mxGraphHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	this.destroyShapes()
};
function mxPanningHandler(b, a) {
	if (b != null) {
		this.graph = b;
		this.factoryMethod = a;
		this.graph.addMouseListener(this);
		this.init()
	}
}
mxPanningHandler.prototype = new mxPopupMenu();
mxPanningHandler.prototype.constructor = mxPanningHandler;
mxPanningHandler.prototype.graph = null;
mxPanningHandler.prototype.usePopupTrigger = true;
mxPanningHandler.prototype.useLeftButtonForPanning = false;
mxPanningHandler.prototype.selectOnPopup = true;
mxPanningHandler.prototype.clearSelectionOnBackground = true;
mxPanningHandler.prototype.ignoreCell = false;
mxPanningHandler.prototype.previewEnabled = true;
mxPanningHandler.prototype.useGrid = false;
mxPanningHandler.prototype.panningEnabled = true;
mxPanningHandler.prototype.isPanningEnabled = function() {
	return this.panningEnabled
};
mxPanningHandler.prototype.setPanningEnabled = function(a) {
	this.panningEnabled = a
};
mxPanningHandler.prototype.init = function() {
	mxPopupMenu.prototype.init.apply(this);
	mxEvent.addListener(this.div, (mxClient.IS_TOUCH) ? "touchmove": "mousemove", mxUtils.bind(this,
	function(a) {
		this.graph.tooltipHandler.hide()
	}))
};
mxPanningHandler.prototype.isPanningTrigger = function(b) {
	var a = b.getEvent();
	return (this.useLeftButtonForPanning && (this.ignoreCell || b.getState() == null) && mxEvent.isLeftMouseButton(a)) || (mxEvent.isControlDown(a) && mxEvent.isShiftDown(a)) || (this.usePopupTrigger && mxEvent.isPopupTrigger(a))
};
mxPanningHandler.prototype.mouseDown = function(a, b) {
	if (!b.isConsumed() && this.isEnabled()) {
		this.hideMenu();
		this.dx0 = -this.graph.container.scrollLeft;
		this.dy0 = -this.graph.container.scrollTop;
		this.popupTrigger = this.isPopupTrigger(b);
		this.panningTrigger = this.isPanningEnabled() && this.isPanningTrigger(b);
		this.startX = b.getX();
		this.startY = b.getY();
		if (this.panningTrigger) {
			b.consume()
		}
	}
};
mxPanningHandler.prototype.mouseMove = function(d, e) {
	var b = e.getX() - this.startX;
	var a = e.getY() - this.startY;
	if (this.active) {
		if (this.previewEnabled) {
			if (this.useGrid) {
				b = this.graph.snap(b);
				a = this.graph.snap(a)
			}
			this.graph.panGraph(b + this.dx0, a + this.dy0)
		}
		this.fireEvent(new mxEventObject(mxEvent.PAN, "event", e));
		e.consume()
	} else {
		if (this.panningTrigger) {
			var c = this.active;
			this.active = Math.abs(b) > this.graph.tolerance || Math.abs(a) > this.graph.tolerance;
			if (!c && this.active) {
				this.fireEvent(new mxEventObject(mxEvent.PAN_START, "event", e))
			}
		}
	}
};
mxPanningHandler.prototype.mouseUp = function(b, c) {
	var i = Math.abs(c.getX() - this.startX);
	var h = Math.abs(c.getY() - this.startY);
	if (this.active) {
		if (!this.graph.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.graph.container)) {
			i = c.getX() - this.startX;
			h = c.getY() - this.startY;
			if (this.useGrid) {
				i = this.graph.snap(i);
				h = this.graph.snap(h)
			}
			var a = this.graph.getView().scale;
			var g = this.graph.getView().translate;
			this.graph.panGraph(0, 0);
			this.panGraph(g.x + i / a, g.y + h / a)
		}
		this.active = false;
		this.fireEvent(new mxEventObject(mxEvent.PAN_END, "event", c));
		c.consume()
	} else {
		if (this.popupTrigger) {
			if (i < this.graph.tolerance && h < this.graph.tolerance) {
				var f = c.getCell();
				if (this.graph.isEnabled() && this.selectOnPopup && f != null && !this.graph.isCellSelected(f)) {
					this.graph.setSelectionCell(f)
				} else {
					if (this.clearSelectionOnBackground && f == null) {
						this.graph.clearSelection()
					}
				}
				this.graph.tooltipHandler.hide();
				var e = mxUtils.getScrollOrigin();
				var d = new mxPoint(c.getX() + e.x, c.getY() + e.y);
				this.popup(d.x + 1, d.y + 1, f, c.getEvent());
				c.consume()
			}
		}
	}
	this.panningTrigger = false;
	this.popupTrigger = false
};
mxPanningHandler.prototype.panGraph = function(b, a) {
	this.graph.getView().setTranslate(b, a)
};
mxPanningHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	mxPopupMenu.prototype.destroy.apply(this)
};
function mxCellMarker(c, d, a, b) {
	if (c != null) {
		this.graph = c;
		this.validColor = (d != null) ? d: mxConstants.DEFAULT_VALID_COLOR;
		this.invalidColor = (d != null) ? a: mxConstants.DEFAULT_INVALID_COLOR;
		this.hotspot = (b != null) ? b: mxConstants.DEFAULT_HOTSPOT;
		this.highlight = new mxCellHighlight(c)
	}
}
mxCellMarker.prototype = new mxEventSource();
mxCellMarker.prototype.constructor = mxCellMarker;
mxCellMarker.prototype.graph = null;
mxCellMarker.prototype.enabled = true;
mxCellMarker.prototype.hotspot = mxConstants.DEFAULT_HOTSPOT;
mxCellMarker.prototype.hotspotEnabled = false;
mxCellMarker.prototype.validColor = null;
mxCellMarker.prototype.invalidColor = null;
mxCellMarker.prototype.currentColor = null;
mxCellMarker.prototype.validState = null;
mxCellMarker.prototype.markedState = null;
mxCellMarker.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxCellMarker.prototype.isEnabled = function() {
	return this.enabled
};
mxCellMarker.prototype.setHotspot = function(a) {
	this.hotspot = a
};
mxCellMarker.prototype.getHotspot = function() {
	return this.hotspot
};
mxCellMarker.prototype.setHotspotEnabled = function(a) {
	this.hotspotEnabled = a
};
mxCellMarker.prototype.isHotspotEnabled = function() {
	return this.hotspotEnabled
};
mxCellMarker.prototype.hasValidState = function() {
	return this.validState != null
};
mxCellMarker.prototype.getValidState = function() {
	return this.validState
};
mxCellMarker.prototype.getMarkedState = function() {
	return this.markedState
};
mxCellMarker.prototype.reset = function() {
	this.validState = null;
	if (this.markedState != null) {
		this.markedState = null;
		this.unmark()
	}
};
mxCellMarker.prototype.process = function(b) {
	var c = null;
	if (this.isEnabled()) {
		c = this.getState(b);
		var d = (c != null) ? this.isValidState(c) : false;
		var a = this.getMarkerColor(b.getEvent(), c, d);
		if (d) {
			this.validState = c
		} else {
			this.validState = null
		}
		if (c != this.markedState || a != this.currentColor) {
			this.currentColor = a;
			if (c != null && this.currentColor != null) {
				this.markedState = c;
				this.mark()
			} else {
				if (this.markedState != null) {
					this.markedState = null;
					this.unmark()
				}
			}
		}
	}
	return c
};
mxCellMarker.prototype.markCell = function(a, b) {
	var c = this.graph.getView().getState(a);
	if (c != null) {
		this.currentColor = (b != null) ? b: this.validColor;
		this.markedState = c;
		this.mark()
	}
};
mxCellMarker.prototype.mark = function() {
	this.highlight.setHighlightColor(this.currentColor);
	this.highlight.highlight(this.markedState);
	this.fireEvent(new mxEventObject(mxEvent.MARK, "state", this.markedState))
};
mxCellMarker.prototype.unmark = function() {
	this.mark()
};
mxCellMarker.prototype.isValidState = function(a) {
	return true
};
mxCellMarker.prototype.getMarkerColor = function(a, b, c) {
	return (c) ? this.validColor: this.invalidColor
};
mxCellMarker.prototype.getState = function(b) {
	var a = this.graph.getView();
	cell = this.getCell(b);
	var c = this.getStateToMark(a.getState(cell));
	return (c != null && this.intersects(c, b)) ? c: null
};
mxCellMarker.prototype.getCell = function(a) {
	return a.getCell()
};
mxCellMarker.prototype.getStateToMark = function(a) {
	return a
};
mxCellMarker.prototype.intersects = function(b, a) {
	if (this.hotspotEnabled) {
		return mxUtils.intersectsHotspot(b, a.getGraphX(), a.getGraphY(), this.hotspot, mxConstants.MIN_HOTSPOT_SIZE, mxConstants.MAX_HOTSPOT_SIZE)
	}
	return true
};
mxCellMarker.prototype.destroy = function() {
	this.graph.getView().removeListener(this.resetHandler);
	this.graph.getModel().removeListener(this.resetHandler);
	this.highlight.destroy()
};
function mxSelectionCellsHandler(a) {
	this.graph = a;
	this.handlers = new mxDictionary();
	this.graph.addMouseListener(this);
	this.refreshHandler = mxUtils.bind(this,
	function(c, b) {
		this.refresh()
	});
	this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.refreshHandler);
	this.graph.getModel().addListener(mxEvent.CHANGE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.SCALE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.TRANSLATE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.DOWN, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.UP, this.refreshHandler)
}
mxSelectionCellsHandler.prototype.graph = null;
mxSelectionCellsHandler.prototype.enabled = true;
mxSelectionCellsHandler.prototype.refreshHandler = null;
mxSelectionCellsHandler.prototype.maxHandlers = 100;
mxSelectionCellsHandler.prototype.handlers = null;
mxSelectionCellsHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxSelectionCellsHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxSelectionCellsHandler.prototype.getHandler = function(a) {
	return this.handlers.get(a)
};
mxSelectionCellsHandler.prototype.reset = function() {
	this.handlers.visit(function(a, b) {
		b.reset.apply(b)
	})
};
mxSelectionCellsHandler.prototype.refresh = function() {
	var e = this.handlers;
	this.handlers = new mxDictionary();
	var b = this.graph.getSelectionCells();
	for (var a = 0; a < b.length; a++) {
		var d = this.graph.view.getState(b[a]);
		if (d != null) {
			var c = e.remove(b[a]);
			if (c != null) {
				if (c.state != d) {
					c.destroy();
					c = null
				} else {
					c.redraw()
				}
			}
			if (c == null) {
				c = this.graph.createHandler(d)
			}
			if (c != null) {
				this.handlers.put(b[a], c)
			}
		}
	}
	e.visit(function(f, g) {
		g.destroy()
	})
};
mxSelectionCellsHandler.prototype.mouseDown = function(b, c) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var a = [b, c];
		this.handlers.visit(function(d, e) {
			e.mouseDown.apply(e, a)
		})
	}
};
mxSelectionCellsHandler.prototype.mouseMove = function(b, c) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var a = [b, c];
		this.handlers.visit(function(d, e) {
			e.mouseMove.apply(e, a)
		})
	}
};
mxSelectionCellsHandler.prototype.mouseUp = function(b, c) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var a = [b, c];
		this.handlers.visit(function(d, e) {
			e.mouseUp.apply(e, a)
		})
	}
};
mxSelectionCellsHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	if (this.refreshHandler != null) {
		this.graph.getSelectionModel().removeListener(this.refreshHandler);
		this.graph.getModel().removeListener(this.refreshHandler);
		this.graph.getView().removeListener(this.refreshHandler);
		this.refreshHandler = null
	}
};
function mxConnectionHandler(b, a) {
	if (b != null) {
		this.graph = b;
		this.factoryMethod = a;
		this.init()
	}
}
mxConnectionHandler.prototype = new mxEventSource();
mxConnectionHandler.prototype.constructor = mxConnectionHandler;
mxConnectionHandler.prototype.graph = null;
mxConnectionHandler.prototype.factoryMethod = true;
mxConnectionHandler.prototype.moveIconFront = false;
mxConnectionHandler.prototype.moveIconBack = false;
mxConnectionHandler.prototype.connectImage = null;
mxConnectionHandler.prototype.targetConnectImage = false;
mxConnectionHandler.prototype.enabled = true;
mxConnectionHandler.prototype.select = true;
mxConnectionHandler.prototype.createTarget = false;
mxConnectionHandler.prototype.marker = null;
mxConnectionHandler.prototype.constraintHandler = null;
mxConnectionHandler.prototype.error = null;
mxConnectionHandler.prototype.waypointsEnabled = false;
mxConnectionHandler.prototype.tapAndHoldEnabled = true;
mxConnectionHandler.prototype.tapAndHoldDelay = 500;
mxConnectionHandler.prototype.tapAndHoldInProgress = false;
mxConnectionHandler.prototype.tapAndHoldValid = false;
mxConnectionHandler.prototype.tapAndHoldTolerance = 4;
mxConnectionHandler.prototype.initialTouchY = 0;
mxConnectionHandler.prototype.initialTouchY = 0;
mxConnectionHandler.prototype.ignoreMouseDown = false;
mxConnectionHandler.prototype.first = null;
mxConnectionHandler.prototype.connectIconOffset = new mxPoint(0, mxConstants.TOOLTIP_VERTICAL_OFFSET);
mxConnectionHandler.prototype.edgeState = null;
mxConnectionHandler.prototype.changeHandler = null;
mxConnectionHandler.prototype.drillHandler = null;
mxConnectionHandler.prototype.mouseDownCounter = 0;
mxConnectionHandler.prototype.movePreviewAway = mxClient.IS_IE;
mxConnectionHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxConnectionHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxConnectionHandler.prototype.isCreateTarget = function() {
	return this.createTarget
};
mxConnectionHandler.prototype.setCreateTarget = function(a) {
	this.createTarget = a
};
mxConnectionHandler.prototype.createShape = function() {
	var b = new mxPolyline([], mxConstants.INVALID_COLOR);
	b.isDashed = true;
	b.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	b.init(this.graph.getView().getOverlayPane());
	if (this.graph.dialect == mxConstants.DIALECT_SVG) {
		b.pipe.setAttribute("style", "pointer-events:none;");
		b.innerNode.setAttribute("style", "pointer-events:none;")
	} else {
		var a = mxUtils.bind(this,
		function(c) {
			var d = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(c), mxEvent.getClientY(c));
			return this.graph.view.getState(this.graph.getCellAt(d.x, d.y))
		});
		mxEvent.redirectMouseEvents(b.node, this.graph, a)
	}
	return b
};
mxConnectionHandler.prototype.init = function() {
	this.graph.addMouseListener(this);
	this.marker = this.createMarker();
	this.constraintHandler = new mxConstraintHandler(this.graph);
	this.changeHandler = mxUtils.bind(this,
	function(a) {
		if (this.iconState != null) {
			this.iconState = this.graph.getView().getState(this.iconState.cell)
		}
		if (this.iconState != null) {
			this.redrawIcons(this.icons, this.iconState)
		} else {
			this.destroyIcons(this.icons);
			this.previous = null
		}
		this.constraintHandler.reset()
	});
	this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.TRANSLATE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.changeHandler);
	this.drillHandler = mxUtils.bind(this,
	function(a) {
		this.destroyIcons(this.icons)
	});
	this.graph.addListener(mxEvent.START_EDITING, this.drillHandler);
	this.graph.getView().addListener(mxEvent.DOWN, this.drillHandler);
	this.graph.getView().addListener(mxEvent.UP, this.drillHandler)
};
mxConnectionHandler.prototype.isConnectableCell = function(a) {
	return true
};
mxConnectionHandler.prototype.createMarker = function() {
	var a = new mxCellMarker(this.graph);
	a.hotspotEnabled = true;
	a.getCell = mxUtils.bind(this,
	function(c, b) {
		var b = mxCellMarker.prototype.getCell.apply(a, arguments);
		this.error = null;
		if (!this.isConnectableCell(b)) {
			return null
		}
		if (b != null) {
			if (this.isConnecting()) {
				if (this.previous != null) {
					this.error = this.validateConnection(this.previous.cell, b);
					if (this.error != null && this.error.length == 0) {
						b = null;
						if (this.isCreateTarget()) {
							this.error = null
						}
					}
				}
			} else {
				if (!this.isValidSource(b)) {
					b = null
				}
			}
		} else {
			if (this.isConnecting() && !this.isCreateTarget() && !this.graph.allowDanglingEdges) {
				this.error = ""
			}
		}
		return b
	});
	a.isValidState = mxUtils.bind(this,
	function(b) {
		if (this.isConnecting()) {
			return this.error == null
		} else {
			return mxCellMarker.prototype.isValidState.apply(a, arguments)
		}
	});
	a.getMarkerColor = mxUtils.bind(this,
	function(b, c, d) {
		return (this.connectImage == null || this.isConnecting()) ? mxCellMarker.prototype.getMarkerColor.apply(a, arguments) : null
	});
	a.intersects = mxUtils.bind(this,
	function(c, b) {
		if (this.connectImage != null || this.isConnecting()) {
			return true
		}
		return mxCellMarker.prototype.intersects.apply(a, arguments)
	});
	return a
};
mxConnectionHandler.prototype.start = function(c, b, d, a) {
	this.previous = c;
	this.first = new mxPoint(b, d);
	this.edgeState = (a != null) ? a: this.createEdgeState(null);
	this.marker.currentColor = this.marker.validColor;
	this.marker.markedState = c;
	this.marker.mark()
};
mxConnectionHandler.prototype.isConnecting = function() {
	return this.first != null && this.shape != null
};
mxConnectionHandler.prototype.isValidSource = function(a) {
	return this.graph.isValidSource(a)
};
mxConnectionHandler.prototype.isValidTarget = function(a) {
	return true
};
mxConnectionHandler.prototype.validateConnection = function(a, b) {
	if (!this.isValidTarget(b)) {
		return ""
	}
	return this.graph.getEdgeValidationError(null, a, b)
};
mxConnectionHandler.prototype.getConnectImage = function(a) {
	return this.connectImage
};
mxConnectionHandler.prototype.isMoveIconToFrontForState = function(a) {
	if (a.text != null && a.text.node.parentNode == this.graph.container) {
		return true
	}
	return this.moveIconFront
};
mxConnectionHandler.prototype.createIcons = function(f) {
	var g = this.getConnectImage(f);
	if (g != null && f != null) {
		this.iconState = f;
		var c = [];
		var e = new mxRectangle(0, 0, g.width, g.height);
		var d = new mxImageShape(e, g.src);
		d.preserveImageAspect = false;
		if (this.isMoveIconToFrontForState(f)) {
			d.dialect = mxConstants.DIALECT_STRICTHTML;
			d.init(this.graph.container)
		} else {
			d.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
			d.init(this.graph.getView().getOverlayPane());
			if (this.moveIconBack && d.node.previousSibling != null) {
				d.node.parentNode.insertBefore(d.node, d.node.parentNode.firstChild)
			}
		}
		d.node.style.cursor = mxConstants.CURSOR_CONNECT;
		var b = mxUtils.bind(this,
		function() {
			return (this.currentState != null) ? this.currentState: f
		});
		var a = mxUtils.bind(this,
		function(h) {
			if (!mxEvent.isConsumed(h)) {
				this.icon = d;
				this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(h, b()))
			}
		});
		mxEvent.redirectMouseEvents(d.node, this.graph, b, a);
		c.push(d);
		this.redrawIcons(c, this.iconState);
		return c
	}
	return null
};
mxConnectionHandler.prototype.redrawIcons = function(a, b) {
	if (a != null && a[0] != null && b != null) {
		var c = this.getIconPosition(a[0], b);
		a[0].bounds.x = c.x;
		a[0].bounds.y = c.y;
		a[0].redraw()
	}
};
mxConnectionHandler.prototype.getIconPosition = function(c, d) {
	var e = this.graph.getView().scale;
	var a = d.getCenterX();
	var f = d.getCenterY();
	if (this.graph.isSwimlane(d.cell)) {
		var b = this.graph.getStartSize(d.cell);
		a = (b.width != 0) ? d.x + b.width * e / 2 : a;
		f = (b.height != 0) ? d.y + b.height * e / 2 : f
	}
	return new mxPoint(a - c.bounds.width / 2, f - c.bounds.height / 2)
};
mxConnectionHandler.prototype.destroyIcons = function(b) {
	if (b != null) {
		this.iconState = null;
		for (var a = 0; a < b.length; a++) {
			b[a].destroy()
		}
	}
};
mxConnectionHandler.prototype.isStartEvent = function(a) {
	return ! this.graph.isForceMarqueeEvent(a.getEvent()) && ((this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null) || (this.previous != null && this.error == null && (this.icons == null || (this.icons != null && this.icon != null))))
};
mxConnectionHandler.prototype.mouseDown = function(a, c) {
	this.mouseDownCounter++;
	if (this.isEnabled() && this.graph.isEnabled() && !c.isConsumed() && !this.isConnecting() && this.isStartEvent(c)) {
		if (this.constraintHandler.currentConstraint != null && this.constraintHandler.currentFocus != null && this.constraintHandler.currentPoint != null) {
			this.sourceConstraint = this.constraintHandler.currentConstraint;
			this.previous = this.constraintHandler.currentFocus;
			this.first = this.constraintHandler.currentPoint.clone()
		} else {
			this.first = new mxPoint(c.getGraphX(), c.getGraphY())
		}
		this.edgeState = this.createEdgeState(c);
		this.mouseDownCounter = 1;
		if (this.waypointsEnabled && this.shape == null) {
			this.waypoints = null;
			this.shape = this.createShape()
		}
		if (this.previous == null && this.edgeState != null) {
			var e = this.graph.getPointForEvent(c.getEvent());
			this.edgeState.cell.geometry.setTerminalPoint(e, true)
		}
		c.consume()
	} else {
		if (mxClient.IS_TOUCH && this.tapAndHoldEnabled && !this.tapAndHoldInProgress && this.isEnabled() && this.graph.isEnabled() && !this.isConnecting()) {
			this.tapAndHoldInProgress = true;
			this.initialTouchX = c.getX();
			this.initialTouchY = c.getY();
			var d = this.graph.view.getState(this.marker.getCell(c));
			var b = function() {
				if (this.tapAndHoldValid) {
					this.tapAndHold(c, d)
				}
				this.tapAndHoldInProgress = false;
				this.tapAndHoldValid = false
			};
			if (this.tapAndHoldThread) {
				window.clearTimeout(this.tapAndHoldThread)
			}
			this.tapAndHoldThread = window.setTimeout(mxUtils.bind(this, b), this.tapAndHoldDelay);
			this.tapAndHoldValid = true
		}
	}
	this.selectedIcon = this.icon;
	this.icon = null
};
mxConnectionHandler.prototype.tapAndHold = function(a, b) {
	if (b != null) {
		this.marker.currentColor = this.marker.validColor;
		this.marker.markedState = b;
		this.marker.mark();
		this.first = new mxPoint(a.getGraphX(), a.getGraphY());
		this.edgeState = this.createEdgeState(a);
		this.previous = b
	}
};
mxConnectionHandler.prototype.isImmediateConnectSource = function(a) {
	return ! this.graph.isCellMovable(a.cell)
};
mxConnectionHandler.prototype.createEdgeState = function(a) {
	return null
};
mxConnectionHandler.prototype.updateCurrentState = function(a) {
	var b = this.marker.process(a);
	this.constraintHandler.update(a, this.first == null);
	this.currentState = b
};
mxConnectionHandler.prototype.convertWaypoint = function(a) {
	var c = this.graph.getView().getScale();
	var b = this.graph.getView().getTranslate();
	a.x = a.x / c - b.x;
	a.y = a.y / c - b.y
};
mxConnectionHandler.prototype.mouseMove = function(b, x) {
	if (this.tapAndHoldValid) {
		this.tapAndHoldValid = Math.abs(this.initialTouchX - x.getX()) < this.tapAndHoldTolerance && Math.abs(this.initialTouchY - x.getY()) < this.tapAndHoldTolerance
	}
	if (!x.isConsumed() && (this.ignoreMouseDown || this.first != null || !this.graph.isMouseDown)) {
		if (this.first != null || (this.isEnabled() && this.graph.isEnabled())) {
			this.updateCurrentState(x)
		}
		if (this.first != null) {
			var n = this.graph.getView();
			var z = n.scale;
			var r = new mxPoint(this.graph.snap(x.getGraphX() / z) * z, this.graph.snap(x.getGraphY() / z) * z);
			var a = null;
			var q = r;
			if (this.constraintHandler.currentConstraint != null && this.constraintHandler.currentFocus != null && this.constraintHandler.currentPoint != null) {
				a = this.constraintHandler.currentConstraint;
				q = this.constraintHandler.currentPoint.clone()
			}
			var f = this.first;
			if (this.selectedIcon != null) {
				var l = this.selectedIcon.bounds.width;
				var u = this.selectedIcon.bounds.height;
				if (this.currentState != null && this.targetConnectImage) {
					var c = this.getIconPosition(this.selectedIcon, this.currentState);
					this.selectedIcon.bounds.x = c.x;
					this.selectedIcon.bounds.y = c.y
				} else {
					var d = new mxRectangle(x.getGraphX() + this.connectIconOffset.x, x.getGraphY() + this.connectIconOffset.y, l, u);
					this.selectedIcon.bounds = d
				}
				this.selectedIcon.redraw()
			}
			if (this.edgeState != null) {
				this.edgeState.absolutePoints = [null, (this.currentState != null) ? null: q];
				this.graph.view.updateFixedTerminalPoint(this.edgeState, this.previous, true, this.sourceConstraint);
				if (this.currentState != null) {
					if (a == null) {
						a = this.graph.getConnectionConstraint(this.edgeState, this.previous, false)
					}
					this.edgeState.setAbsoluteTerminalPoint(null, false);
					this.graph.view.updateFixedTerminalPoint(this.edgeState, this.currentState, false, a)
				}
				var e = null;
				if (this.waypoints != null) {
					e = [];
					for (var s = 0; s < this.waypoints.length; s++) {
						var p = this.waypoints[s].clone();
						this.convertWaypoint(p);
						e[s] = p
					}
				}
				this.graph.view.updatePoints(this.edgeState, e, this.previous, this.currentState);
				this.graph.view.updateFloatingTerminalPoints(this.edgeState, this.previous, this.currentState);
				q = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 1];
				f = this.edgeState.absolutePoints[0]
			} else {
				if (this.currentState != null) {
					if (this.constraintHandler.currentConstraint == null) {
						var v = this.getTargetPerimeterPoint(this.currentState, x);
						if (v != null) {
							q = v
						}
					}
				}
				if (this.sourceConstraint == null && this.previous != null) {
					var o = (this.waypoints != null && this.waypoints.length > 0) ? this.waypoints[0] : q;
					var v = this.getSourcePerimeterPoint(this.previous, o, x);
					if (v != null) {
						f = v
					}
				}
			}
			if (this.currentState == null && this.movePreviewAway) {
				var m = q.x - f.x;
				var k = q.y - f.y;
				var t = Math.sqrt(m * m + k * k);
				q.x -= m * 4 / t;
				q.y -= k * 4 / t
			}
			if (this.shape == null) {
				var m = Math.abs(r.x - this.first.x);
				var k = Math.abs(r.y - this.first.y);
				if (m > this.graph.tolerance || k > this.graph.tolerance) {
					this.shape = this.createShape()
				}
			}
			if (this.shape != null) {
				if (this.edgeState != null) {
					this.shape.points = this.edgeState.absolutePoints
				} else {
					var B = [f];
					if (this.waypoints != null) {
						B = B.concat(this.waypoints)
					}
					B.push(q);
					this.shape.points = B
				}
				this.drawPreview()
			}
			mxEvent.consume(x.getEvent());
			x.consume()
		} else {
			if (!this.isEnabled() || !this.graph.isEnabled()) {
				this.constraintHandler.reset()
			} else {
				if (this.previous != this.currentState && this.edgeState == null) {
					this.destroyIcons(this.icons);
					this.icons = null;
					if (this.currentState != null && this.error == null) {
						this.icons = this.createIcons(this.currentState);
						if (this.icons == null) {
							this.currentState.setCursor(mxConstants.CURSOR_CONNECT);
							x.consume()
						}
					}
					this.previous = this.currentState
				} else {
					if (this.previous == this.currentState && this.currentState != null && this.icons == null && !this.graph.isMouseDown) {
						x.consume()
					}
				}
			}
		}
		if (this.constraintHandler.currentConstraint != null) {
			this.marker.reset()
		}
		if (!this.graph.isMouseDown && this.currentState != null && this.icons != null) {
			var A = this.currentState.text != null && this.currentState.text.node.parentNode == this.graph.container;
			var g = false;
			var y = x.getSource();
			for (var s = 0; s < this.icons.length && !g; s++) {
				g = y == this.icons[s].node || y.parentNode == this.icons[s].node
			}
			if (!g) {
				this.updateIcons(this.currentState, this.icons, x)
			}
		}
	} else {
		this.constraintHandler.reset()
	}
};
mxConnectionHandler.prototype.getTargetPerimeterPoint = function(g, f) {
	var a = null;
	var b = g.view;
	var e = b.getPerimeterFunction(g);
	if (e != null) {
		var d = (this.waypoints != null && this.waypoints.length > 0) ? this.waypoints[this.waypoints.length - 1] : new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());
		var c = e(b.getPerimeterBounds(g), this.edgeState, d, false);
		if (c != null) {
			a = c
		}
	} else {
		a = new mxPoint(g.getCenterX(), g.getCenterY())
	}
	return a
};
mxConnectionHandler.prototype.getSourcePerimeterPoint = function(g, e, f) {
	var a = null;
	var b = g.view;
	var d = b.getPerimeterFunction(g);
	if (d != null) {
		var c = d(b.getPerimeterBounds(g), g, e, false);
		if (c != null) {
			a = c
		}
	} else {
		a = new mxPoint(g.getCenterX(), g.getCenterY())
	}
	return a
};
mxConnectionHandler.prototype.updateIcons = function(c, a, b) {};
mxConnectionHandler.prototype.isStopEvent = function(a) {
	return a.getState() != null
};
mxConnectionHandler.prototype.addWaypointForEvent = function(e) {
	var b = mxUtils.convertPoint(this.graph.container, e.getX(), e.getY());
	var d = Math.abs(b.x - this.first.x);
	var c = Math.abs(b.y - this.first.y);
	var a = this.waypoints != null || (this.mouseDownCounter > 1 && (d > this.graph.tolerance || c > this.graph.tolerance));
	if (a) {
		if (this.waypoints == null) {
			this.waypoints = []
		}
		var f = this.graph.view.scale;
		var b = new mxPoint(this.graph.snap(e.getGraphX() / f) * f, this.graph.snap(e.getGraphY() / f) * f);
		this.waypoints.push(b)
	}
};
mxConnectionHandler.prototype.mouseUp = function(a, b) {
	if (!b.isConsumed() && this.isConnecting()) {
		if (this.waypointsEnabled && !this.isStopEvent(b)) {
			this.addWaypointForEvent(b);
			b.consume();
			return
		}
		if (this.error == null) {
			var c = (this.previous != null) ? this.previous.cell: null;
			var d = null;
			if (this.constraintHandler.currentConstraint != null && this.constraintHandler.currentFocus != null) {
				d = this.constraintHandler.currentFocus.cell
			}
			if (d == null && this.marker.hasValidState()) {
				d = this.marker.validState.cell
			}
			this.connect(c, d, b.getEvent(), b.getCell())
		} else {
			if (this.previous != null && this.marker.validState != null && this.previous.cell == this.marker.validState.cell) {
				this.graph.selectCellForEvent(this.marker.source, evt)
			}
			if (this.error.length > 0) {
				this.graph.validationAlert(this.error)
			}
		}
		this.destroyIcons(this.icons);
		b.consume()
	}
	if (this.first != null) {
		this.reset()
	}
	this.tapAndHoldInProgress = false;
	this.tapAndHoldValid = false
};
mxConnectionHandler.prototype.reset = function() {
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null
	}
	this.destroyIcons(this.icons);
	this.icons = null;
	this.marker.reset();
	this.constraintHandler.reset();
	this.selectedIcon = null;
	this.edgeState = null;
	this.previous = null;
	this.error = null;
	this.sourceConstraint = null;
	this.mouseDownCounter = 0;
	this.first = null;
	this.icon = null
};
mxConnectionHandler.prototype.drawPreview = function() {
	var b = this.error == null;
	var a = this.getEdgeColor(b);
	if (this.shape.dialect == mxConstants.DIALECT_SVG) {
		this.shape.innerNode.setAttribute("stroke", a)
	} else {
		this.shape.node.strokecolor = a
	}
	this.shape.strokewidth = this.getEdgeWidth(b);
	this.shape.redraw();
	mxUtils.repaintGraph(this.graph, this.shape.points[1])
};
mxConnectionHandler.prototype.getEdgeColor = function(a) {
	return (a) ? mxConstants.VALID_COLOR: mxConstants.INVALID_COLOR
};
mxConnectionHandler.prototype.getEdgeWidth = function(a) {
	return (a) ? 3 : 1
};
mxConnectionHandler.prototype.connect = function(b, l, p, a) {
	if (l != null || this.isCreateTarget() || this.graph.allowDanglingEdges) {
		var k = this.graph.getModel();
		var d = null;
		k.beginUpdate();
		try {
			if (b != null && l == null && this.isCreateTarget()) {
				l = this.createTargetVertex(p, b);
				if (l != null) {
					a = this.graph.getDropTarget([l], p, a);
					if (a == null || !this.graph.getModel().isEdge(a)) {
						var g = this.graph.getView().getState(a);
						if (g != null) {
							var h = k.getGeometry(l);
							h.x -= g.origin.x;
							h.y -= g.origin.y
						}
					} else {
						a = this.graph.getDefaultParent()
					}
					this.graph.addCell(l, a)
				}
			}
			var o = this.graph.getDefaultParent();
			if (b != null && l != null && k.getParent(b) == k.getParent(l) && k.getParent(k.getParent(b)) != k.getRoot()) {
				o = k.getParent(b);
				if ((b.geometry != null && b.geometry.relative) && (l.geometry != null && l.geometry.relative)) {
					o = k.getParent(o)
				}
			}
			var n = null;
			var c = null;
			if (this.edgeState != null) {
				n = this.edgeState.cell.value;
				c = this.edgeState.cell.style
			}
			d = this.insertEdge(o, null, n, b, l, c);
			if (d != null) {
				this.graph.setConnectionConstraint(d, b, true, this.sourceConstraint);
				this.graph.setConnectionConstraint(d, l, false, this.constraintHandler.currentConstraint);
				if (this.edgeState != null) {
					k.setGeometry(d, this.edgeState.cell.geometry)
				}
				var f = k.getGeometry(d);
				if (f == null) {
					f = new mxGeometry();
					f.relative = true;
					k.setGeometry(d, f)
				}
				if (this.waypoints != null && this.waypoints.length > 0) {
					var r = this.graph.view.scale;
					var m = this.graph.view.translate;
					f.points = [];
					for (var e = 0; e < this.waypoints.length; e++) {
						var q = this.waypoints[e];
						f.points.push(new mxPoint(q.x / r - m.x, q.y / r - m.y))
					}
				}
				if (l == null) {
					var q = this.graph.getPointForEvent(p);
					f.setTerminalPoint(q, false)
				}
				this.fireEvent(new mxEventObject(mxEvent.CONNECT, "cell", d, "event", p, "target", a))
			}
		} finally {
			k.endUpdate()
		}
		if (this.select) {
			this.selectCells(d, l)
		}
	}
};
mxConnectionHandler.prototype.selectCells = function(a, b) {
	this.graph.setSelectionCell(a)
};
mxConnectionHandler.prototype.insertEdge = function(b, g, e, d, f, a) {
	if (this.factoryMethod == null) {
		return this.graph.insertEdge(b, g, e, d, f, a)
	} else {
		var c = this.createEdge(e, d, f, a);
		c = this.graph.addEdge(c, b, d, f);
		return c
	}
};
mxConnectionHandler.prototype.createTargetVertex = function(c, e) {
	var g = this.graph.cloneCells([e])[0];
	var f = this.graph.getModel().getGeometry(g);
	if (f != null) {
		var a = this.graph.getPointForEvent(c);
		f.x = this.graph.snap(a.x - f.width / 2);
		f.y = this.graph.snap(a.y - f.height / 2);
		if (this.first != null) {
			var d = this.graph.view.getState(e);
			if (d != null) {
				var b = this.getAlignmentTolerance();
				if (Math.abs(this.graph.snap(this.first.x) - this.graph.snap(a.x)) <= b) {
					f.x = d.x
				} else {
					if (Math.abs(this.graph.snap(this.first.y) - this.graph.snap(a.y)) <= b) {
						f.y = d.y
					}
				}
			}
		}
	}
	return g
};
mxConnectionHandler.prototype.getAlignmentTolerance = function() {
	return (this.graph.isGridEnabled()) ? this.graph.gridSize: this.graph.tolerance
};
mxConnectionHandler.prototype.createEdge = function(d, c, f, a) {
	var b = null;
	if (this.factoryMethod != null) {
		b = this.factoryMethod(c, f, a)
	}
	if (b == null) {
		b = new mxCell(d || "");
		b.setEdge(true);
		b.setStyle(a);
		var e = new mxGeometry();
		e.relative = true;
		b.setGeometry(e)
	}
	return b
};
mxConnectionHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null
	}
	if (this.marker != null) {
		this.marker.destroy();
		this.marker = null
	}
	if (this.constraintHandler != null) {
		this.constraintHandler.destroy();
		this.constraintHandler = null
	}
	if (this.changeHandler != null) {
		this.graph.getModel().removeListener(this.changeHandler);
		this.graph.getView().removeListener(this.changeHandler);
		this.changeHandler = null
	}
	if (this.drillHandler != null) {
		this.graph.removeListener(this.drillHandler);
		this.graph.getView().removeListener(this.drillHandler);
		this.drillHandler = null
	}
};
function mxConstraintHandler(a) {
	this.graph = a
}
mxConstraintHandler.prototype.pointImage = new mxImage(mxClient.imageBasePath + "/point.gif", 5, 5);
mxConstraintHandler.prototype.graph = null;
mxConstraintHandler.prototype.enabled = true;
mxConstraintHandler.prototype.highlightColor = mxConstants.DEFAULT_VALID_COLOR;
mxConstraintHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxConstraintHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxConstraintHandler.prototype.reset = function() {
	if (this.focusIcons != null) {
		for (var a = 0; a < this.focusIcons.length; a++) {
			this.focusIcons[a].destroy()
		}
		this.focusIcons = null
	}
	if (this.focusHighlight != null) {
		this.focusHighlight.destroy();
		this.focusHighlight = null
	}
	this.currentConstraint = null;
	this.currentFocusArea = null;
	this.currentPoint = null;
	this.currentFocus = null;
	this.focusPoints = null
};
mxConstraintHandler.prototype.getTolerance = function() {
	return this.graph.getTolerance()
};
mxConstraintHandler.prototype.getImageForConstraint = function(b, c, a) {
	return this.pointImage
};
mxConstraintHandler.prototype.update = function(n, c) {
	if (this.isEnabled()) {
		var p = this.getTolerance();
		var k = new mxRectangle(n.getGraphX() - p, n.getGraphY() - p, 2 * p, 2 * p);
		var h = (n.getCell() != null) ? this.graph.isCellConnectable(n.getCell()) : false;
		if ((this.currentFocusArea == null || (!mxUtils.intersects(this.currentFocusArea, k) || (n.getState() != null && this.currentFocus != null && h && this.graph.getModel().getParent(n.getCell()) == this.currentFocus.cell)))) {
			this.currentFocusArea = null;
			if (n.getState() != this.currentFocus) {
				this.currentFocus = null;
				this.constraints = (n.getState() != null && h) ? this.graph.getAllConnectionConstraints(n.getState(), c) : null;
				if (this.constraints != null) {
					this.currentFocus = n.getState();
					this.currentFocusArea = new mxRectangle(n.getState().x, n.getState().y, n.getState().width, n.getState().height);
					if (this.focusIcons != null) {
						for (var f = 0; f < this.focusIcons.length; f++) {
							this.focusIcons[f].destroy()
						}
						this.focusIcons = null;
						this.focusPoints = null
					}
					this.focusIcons = [];
					this.focusPoints = [];
					for (var f = 0; f < this.constraints.length; f++) {
						var m = this.graph.getConnectionPoint(n.getState(), this.constraints[f]);
						var g = this.getImageForConstraint(n.getState(), this.constraints[f], m);
						var b = g.src;
						var a = new mxRectangle(m.x - g.width / 2, m.y - g.height / 2, g.width, g.height);
						var o = new mxImageShape(a, b);
						o.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
						o.init(this.graph.getView().getOverlayPane());
						if (o.node.previousSibling != null) {
							o.node.parentNode.insertBefore(o.node, o.node.parentNode.firstChild)
						}
						var l = mxUtils.bind(this,
						function() {
							return (this.currentFocus != null) ? this.currentFocus: n.getState()
						});
						o.redraw();
						mxEvent.redirectMouseEvents(o.node, this.graph, l);
						this.currentFocusArea.add(o.bounds);
						this.focusIcons.push(o);
						this.focusPoints.push(m)
					}
					this.currentFocusArea.grow(p)
				} else {
					if (this.focusIcons != null) {
						if (this.focusHighlight != null) {
							this.focusHighlight.destroy();
							this.focusHighlight = null
						}
						for (var f = 0; f < this.focusIcons.length; f++) {
							this.focusIcons[f].destroy()
						}
						this.focusIcons = null;
						this.focusPoints = null
					}
				}
			}
		}
		this.currentConstraint = null;
		this.currentPoint = null;
		if (this.focusIcons != null && this.constraints != null && (n.getState() == null || this.currentFocus == n.getState())) {
			for (var f = 0; f < this.focusIcons.length; f++) {
				if (mxUtils.intersects(this.focusIcons[f].bounds, k)) {
					this.currentConstraint = this.constraints[f];
					this.currentPoint = this.focusPoints[f];
					var e = this.focusIcons[f].bounds.clone();
					e.grow((mxClient.IS_IE) ? 3 : 2);
					if (mxClient.IS_IE) {
						e.width -= 1;
						e.height -= 1
					}
					if (this.focusHighlight == null) {
						var d = new mxRectangleShape(e, null, this.highlightColor, 3);
						d.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
						d.init(this.graph.getView().getOverlayPane());
						this.focusHighlight = d;
						var l = mxUtils.bind(this,
						function() {
							return (this.currentFocus != null) ? this.currentFocus: n.getState()
						});
						mxEvent.redirectMouseEvents(d.node, this.graph, l)
					} else {
						this.focusHighlight.bounds = e;
						this.focusHighlight.redraw()
					}
					break
				}
			}
		}
		if (this.currentConstraint == null && this.focusHighlight != null) {
			this.focusHighlight.destroy();
			this.focusHighlight = null
		}
	}
};
mxConstraintHandler.prototype.destroy = function() {
	this.reset()
};
function mxRubberband(a) {
	if (a != null) {
		this.graph = a;
		this.graph.addMouseListener(this);
		if (mxClient.IS_IE) {
			mxEvent.addListener(window, "unload", mxUtils.bind(this,
			function() {
				this.destroy()
			}))
		}
	}
}
mxRubberband.prototype.defaultOpacity = 20;
mxRubberband.prototype.enabled = true;
mxRubberband.prototype.div = null;
mxRubberband.prototype.sharedDiv = null;
mxRubberband.prototype.isEnabled = function() {
	return this.enabled
};
mxRubberband.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxRubberband.prototype.mouseDown = function(b, c) {
	if (!c.isConsumed() && this.isEnabled() && this.graph.isEnabled() && (this.graph.isForceMarqueeEvent(c.getEvent()) || c.getState() == null)) {
		var d = mxUtils.getOffset(this.graph.container);
		var a = mxUtils.getScrollOrigin(this.graph.container);
		a.x -= d.x;
		a.y -= d.y;
		this.start(c.getX() + a.x, c.getY() + a.y);
		if (!mxClient.IS_IE) {
			this.dragHandler = mxUtils.bind(this,
			function(e) {
				this.mouseMove(this.graph, new mxMouseEvent(e))
			});
			this.dropHandler = mxUtils.bind(this,
			function(e) {
				this.mouseUp(this.graph, new mxMouseEvent(e))
			});
			mxEvent.addListener(document, "mousemove", this.dragHandler);
			mxEvent.addListener(document, "mouseup", this.dropHandler)
		}
		c.consume(false)
	}
};
mxRubberband.prototype.start = function(a, b) {
	this.first = new mxPoint(a, b)
};
mxRubberband.prototype.mouseMove = function(b, c) {
	if (!c.isConsumed() && this.first != null) {
		var f = mxUtils.getScrollOrigin(this.graph.container);
		var a = mxUtils.getOffset(this.graph.container);
		f.x -= a.x;
		f.y -= a.y;
		var e = c.getX() + f.x;
		var d = c.getY() + f.y;
		var i = this.first.x - e;
		var h = this.first.y - d;
		var g = this.graph.tolerance;
		if (this.div != null || Math.abs(i) > g || Math.abs(h) > g) {
			if (this.div == null) {
				this.div = this.createShape()
			}
			mxUtils.clearSelection();
			this.update(e, d);
			c.consume()
		}
	}
};
mxRubberband.prototype.createShape = function() {
	if (this.sharedDiv == null) {
		this.sharedDiv = document.createElement("div");
		this.sharedDiv.className = "mxRubberband";
		mxUtils.setOpacity(this.sharedDiv, this.defaultOpacity)
	}
	this.graph.container.appendChild(this.sharedDiv);
	return this.sharedDiv
};
mxRubberband.prototype.mouseUp = function(a, c) {
	var d = this.div != null;
	this.reset();
	if (d) {
		var b = new mxRectangle(this.x, this.y, this.width, this.height);
		this.graph.selectRegion(b, c.getEvent());
		c.consume()
	}
};
mxRubberband.prototype.reset = function() {
	if (this.div != null) {
		this.div.parentNode.removeChild(this.div)
	}
	if (this.dragHandler != null) {
		mxEvent.removeListener(document, "mousemove", this.dragHandler);
		this.dragHandler = null
	}
	if (this.dropHandler != null) {
		mxEvent.removeListener(document, "mouseup", this.dropHandler);
		this.dropHandler = null
	}
	this.first = null;
	this.div = null
};
mxRubberband.prototype.update = function(a, b) {
	this.x = Math.min(this.first.x, a);
	this.y = Math.min(this.first.y, b);
	this.width = Math.max(this.first.x, a) - this.x;
	this.height = Math.max(this.first.y, b) - this.y;
	this.div.style.left = this.x + "px";
	this.div.style.top = this.y + "px";
	this.div.style.width = Math.max(1, this.width) + "px";
	this.div.style.height = Math.max(1, this.height) + "px"
};
mxRubberband.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		this.graph.removeMouseListener(this);
		this.reset();
		if (this.sharedDiv != null) {
			this.sharedDiv = null
		}
	}
};
function mxVertexHandler(a) {
	if (a != null) {
		this.state = a;
		this.init()
	}
}
mxVertexHandler.prototype.graph = null;
mxVertexHandler.prototype.state = null;
mxVertexHandler.prototype.singleSizer = false;
mxVertexHandler.prototype.index = null;
mxVertexHandler.prototype.allowHandleBoundsCheck = true;
mxVertexHandler.prototype.crisp = true;
mxVertexHandler.prototype.handleImage = null;
mxVertexHandler.prototype.tolerance = 0;
mxVertexHandler.prototype.init = function() {
	this.graph = this.state.view.graph;
	this.bounds = this.getSelectionBounds(this.state);
	this.selectionBorder = this.createSelectionShape(this.bounds);
	this.selectionBorder.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.selectionBorder.init(this.graph.getView().getOverlayPane());
	if (this.selectionBorder.dialect == mxConstants.DIALECT_SVG) {
		this.selectionBorder.node.setAttribute("pointer-events", "none")
	} else {
		this.selectionBorder.node.style.background = ""
	}
	if (this.graph.isCellMovable(this.state.cell)) {
		this.selectionBorder.node.style.cursor = mxConstants.CURSOR_MOVABLE_VERTEX
	}
	mxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state);
	if (mxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells) {
		var b = this.graph.isCellResizable(this.state.cell);
		this.sizers = [];
		if (b || (this.graph.isLabelMovable(this.state.cell) && this.state.width >= 2 && this.state.height >= 2)) {
			var a = 0;
			if (b) {
				if (!this.singleSizer) {
					this.sizers.push(this.createSizer("nw-resize", a++));
					this.sizers.push(this.createSizer("n-resize", a++));
					this.sizers.push(this.createSizer("ne-resize", a++));
					this.sizers.push(this.createSizer("w-resize", a++));
					this.sizers.push(this.createSizer("e-resize", a++));
					this.sizers.push(this.createSizer("sw-resize", a++));
					this.sizers.push(this.createSizer("s-resize", a++))
				}
				this.sizers.push(this.createSizer("se-resize", a++))
			}
			var c = this.graph.model.getGeometry(this.state.cell);
			if (c != null && !c.relative && !this.graph.isSwimlane(this.state.cell) && this.graph.isLabelMovable(this.state.cell)) {
				this.labelShape = this.createSizer(mxConstants.CURSOR_LABEL_HANDLE, mxEvent.LABEL_HANDLE, mxConstants.LABEL_HANDLE_SIZE, mxConstants.LABEL_HANDLE_FILLCOLOR);
				this.sizers.push(this.labelShape)
			}
		} else {
			if (this.graph.isCellMovable(this.state.cell) && !this.graph.isCellResizable(this.state.cell) && this.state.width < 2 && this.state.height < 2) {
				this.labelShape = this.createSizer(mxConstants.CURSOR_MOVABLE_VERTEX, null, null, mxConstants.LABEL_HANDLE_FILLCOLOR);
				this.sizers.push(this.labelShape)
			}
		}
	}
	this.redraw()
};
mxVertexHandler.prototype.getSelectionBounds = function(a) {
	return new mxRectangle(a.x, a.y, a.width, a.height)
};
mxVertexHandler.prototype.createSelectionShape = function(b) {
	var a = new mxRectangleShape(b, null, this.getSelectionColor());
	a.strokewidth = this.getSelectionStrokeWidth();
	a.isDashed = this.isSelectionDashed();
	a.crisp = this.crisp;
	return a
};
mxVertexHandler.prototype.getSelectionColor = function() {
	return mxConstants.VERTEX_SELECTION_COLOR
};
mxVertexHandler.prototype.getSelectionStrokeWidth = function() {
	return mxConstants.VERTEX_SELECTION_STROKEWIDTH
};
mxVertexHandler.prototype.isSelectionDashed = function() {
	return mxConstants.VERTEX_SELECTION_DASHED
};
mxVertexHandler.prototype.createSizer = function(e, a, b, f) {
	b = b || mxConstants.HANDLE_SIZE;
	var c = new mxRectangle(0, 0, b, b);
	var d = this.createSizerShape(c, a, f);
	if (this.state.text != null && this.state.text.node.parentNode == this.graph.container) {
		d.bounds.height -= 1;
		d.bounds.width -= 1;
		d.dialect = mxConstants.DIALECT_STRICTHTML;
		d.init(this.graph.container)
	} else {
		d.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		d.init(this.graph.getView().getOverlayPane())
	}
	d.node.style.cursor = e;
	mxEvent.redirectMouseEvents(d.node, this.graph, this.state);
	if (!this.isSizerVisible(a)) {
		d.node.style.visibility = "hidden"
	}
	return d
};
mxVertexHandler.prototype.isSizerVisible = function(a) {
	return true
};
mxVertexHandler.prototype.createSizerShape = function(c, b, d) {
	if (true && this.handleImage != null) {
		c.width = this.handleImage.width;
		c.height = this.handleImage.height;
		return new mxImageShape(c, this.handleImage.src)
	} else {
		var a = new mxRectangleShape(c, d || mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
		a.crisp = this.crisp;
		return a
	}
};
mxVertexHandler.prototype.moveSizerTo = function(b, a, c) {
	if (b != null) {
		b.bounds.x = a - b.bounds.width / 2;
		b.bounds.y = c - b.bounds.height / 2;
		b.redraw()
	}
};
mxVertexHandler.prototype.getHandleForEvent = function(c) {
	if (c.isSource(this.labelShape)) {
		return mxEvent.LABEL_HANDLE
	}
	if (this.sizers != null) {
		var a = this.tolerance;
		var d = (this.allowHandleBoundsCheck && (mxClient.IS_IE || a > 0)) ? new mxRectangle(c.getGraphX() - a, c.getGraphY() - a, 2 * a, 2 * a) : null;
		for (var b = 0; b < this.sizers.length; b++) {
			if (c.isSource(this.sizers[b]) || (d != null && this.sizers[b].node.style.visibility != "hidden" && mxUtils.intersects(this.sizers[b].bounds, d))) {
				return b
			}
		}
	}
	return null
};
mxVertexHandler.prototype.mouseDown = function(a, b) {
	if (!b.isConsumed() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(b.getEvent()) && (this.tolerance > 0 || b.getState() == this.state)) {
		var c = this.getHandleForEvent(b);
		if (c != null) {
			this.start(b.getX(), b.getY(), c);
			b.consume()
		}
	}
};
mxVertexHandler.prototype.start = function(a, d, b) {
	var c = mxUtils.convertPoint(this.graph.container, a, d);
	this.startX = c.x;
	this.startY = c.y;
	this.index = b;
	this.selectionBorder.node.style.visibility = "hidden";
	this.preview = this.createSelectionShape(this.bounds);
	if (this.state.text != null && this.state.text.node.parentNode == this.graph.container) {
		this.preview.dialect = mxConstants.DIALECT_STRICTHTML;
		this.preview.init(this.graph.container)
	} else {
		this.preview.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		this.preview.init(this.graph.view.getOverlayPane())
	}
};
mxVertexHandler.prototype.mouseMove = function(d, e) {
	if (!e.isConsumed() && this.index != null) {
		var a = new mxPoint(e.getGraphX(), e.getGraphY());
		var g = this.graph.isGridEnabledEvent(e.getEvent());
		var h = this.graph.getView().scale;
		if (this.index == mxEvent.LABEL_HANDLE) {
			if (g) {
				a.x = this.graph.snap(a.x / h) * h;
				a.y = this.graph.snap(a.y / h) * h
			}
			this.moveSizerTo(this.sizers[this.sizers.length - 1], a.x, a.y);
			e.consume()
		} else {
			if (this.index != null) {
				var c = a.x - this.startX;
				var b = a.y - this.startY;
				var f = this.graph.view.translate;
				this.bounds = this.union(this.state, c, b, this.index, g, h, f);
				this.drawPreview();
				e.consume()
			}
		}
	} else {
		if (this.getHandleForEvent(e) != null) {
			e.consume(false)
		}
	}
};
mxVertexHandler.prototype.mouseUp = function(d, e) {
	if (!e.isConsumed() && this.index != null && this.state != null) {
		var a = new mxPoint(e.getGraphX(), e.getGraphY());
		var g = this.graph.getView().scale;
		var f = this.graph.isGridEnabledEvent(e.getEvent());
		var c = (a.x - this.startX) / g;
		var b = (a.y - this.startY) / g;
		this.resizeCell(this.state.cell, c, b, this.index, f);
		this.reset();
		e.consume()
	}
};
mxVertexHandler.prototype.reset = function() {
	this.index = null;
	if (this.preview != null) {
		this.preview.destroy();
		this.preview = null
	}
	this.selectionBorder.node.style.visibility = "visible";
	this.bounds = new mxRectangle(this.state.x, this.state.y, this.state.width, this.state.height);
	this.drawPreview()
};
mxVertexHandler.prototype.resizeCell = function(a, c, b, d, g) {
	var f = this.graph.model.getGeometry(a);
	if (d == mxEvent.LABEL_HANDLE) {
		var h = this.graph.view.scale;
		c = (this.labelShape.bounds.getCenterX() - this.startX) / h;
		b = (this.labelShape.bounds.getCenterY() - this.startY) / h;
		f = f.clone();
		if (f.offset == null) {
			f.offset = new mxPoint(c, b)
		} else {
			f.offset.x += c;
			f.offset.y += b
		}
		this.graph.model.setGeometry(a, f)
	} else {
		var e = this.union(f, c, b, d, g, 1, new mxPoint(0, 0));
		this.graph.resizeCell(a, e)
	}
};
mxVertexHandler.prototype.union = function(b, q, p, f, g, e, h) {
	if (this.singleSizer) {
		var m = b.x + b.width + q;
		var l = b.y + b.height + p;
		if (g) {
			m = this.graph.snap(m / e) * e;
			l = this.graph.snap(l / e) * e
		}
		var k = new mxRectangle(b.x, b.y, 0, 0);
		k.add(new mxRectangle(m, l, 0, 0));
		return k
	} else {
		var d = b.x - h.x * e;
		var n = d + b.width;
		var i = b.y - h.y * e;
		var a = i + b.height;
		if (f > 4) {
			a = a + p;
			if (g) {
				a = this.graph.snap(a / e) * e
			}
		} else {
			if (f < 3) {
				i = i + p;
				if (g) {
					i = this.graph.snap(i / e) * e
				}
			}
		}
		if (f == 0 || f == 3 || f == 5) {
			d += q;
			if (g) {
				d = this.graph.snap(d / e) * e
			}
		} else {
			if (f == 2 || f == 4 || f == 7) {
				n += q;
				if (g) {
					n = this.graph.snap(n / e) * e
				}
			}
		}
		var c = n - d;
		var o = a - i;
		if (c < 0) {
			d += c;
			c = Math.abs(c)
		}
		if (o < 0) {
			i += o;
			o = Math.abs(o)
		}
		return new mxRectangle(d + h.x * e, i + h.y * e, c, o)
	}
};
mxVertexHandler.prototype.redraw = function() {
	this.bounds = new mxRectangle(this.state.x, this.state.y, this.state.width, this.state.height);
	if (this.sizers != null) {
		var d = this.state;
		var e = d.x + d.width;
		var c = d.y + d.height;
		if (this.singleSizer) {
			this.moveSizerTo(this.sizers[0], e, c)
		} else {
			var a = d.x + d.width / 2;
			var f = d.y + d.height / 2;
			if (this.sizers.length > 1) {
				this.moveSizerTo(this.sizers[0], d.x, d.y);
				this.moveSizerTo(this.sizers[1], a, d.y);
				this.moveSizerTo(this.sizers[2], e, d.y);
				this.moveSizerTo(this.sizers[3], d.x, f);
				this.moveSizerTo(this.sizers[4], e, f);
				this.moveSizerTo(this.sizers[5], d.x, c);
				this.moveSizerTo(this.sizers[6], a, c);
				this.moveSizerTo(this.sizers[7], e, c);
				this.moveSizerTo(this.sizers[8], a + d.absoluteOffset.x, f + d.absoluteOffset.y)
			} else {
				if (this.state.width >= 2 && this.state.height >= 2) {
					this.moveSizerTo(this.sizers[0], a + d.absoluteOffset.x, f + d.absoluteOffset.y)
				} else {
					this.moveSizerTo(this.sizers[0], d.x, d.y)
				}
			}
		}
	}
	this.drawPreview()
};
mxVertexHandler.prototype.drawPreview = function() {
	if (this.preview != null) {
		this.preview.bounds = this.bounds;
		if (this.preview.node.parentNode == this.graph.container) {
			this.preview.bounds.width -= 1;
			this.preview.bounds.height -= 1
		}
		this.preview.redraw()
	}
	this.selectionBorder.bounds = this.bounds;
	this.selectionBorder.redraw()
};
mxVertexHandler.prototype.destroy = function() {
	if (this.preview != null) {
		this.preview.destroy();
		this.preview = null
	}
	this.selectionBorder.destroy();
	this.selectionBorder = null;
	this.labelShape = null;
	if (this.sizers != null) {
		for (var a = 0; a < this.sizers.length; a++) {
			this.sizers[a].destroy();
			this.sizers[a] = null
		}
	}
};
function mxEdgeHandler(a) {
	if (a != null) {
		this.state = a;
		this.init()
	}
}
mxEdgeHandler.prototype.graph = null;
mxEdgeHandler.prototype.state = null;
mxEdgeHandler.prototype.marker = null;
mxEdgeHandler.prototype.constraintHandler = null;
mxEdgeHandler.prototype.error = null;
mxEdgeHandler.prototype.shape = null;
mxEdgeHandler.prototype.bends = null;
mxEdgeHandler.prototype.labelShape = null;
mxEdgeHandler.prototype.cloneEnabled = true;
mxEdgeHandler.prototype.addEnabled = false;
mxEdgeHandler.prototype.removeEnabled = false;
mxEdgeHandler.prototype.preferHtml = false;
mxEdgeHandler.prototype.allowHandleBoundsCheck = true;
mxEdgeHandler.prototype.snapToTerminals = false;
mxEdgeHandler.prototype.crisp = true;
mxEdgeHandler.prototype.handleImage = null;
mxEdgeHandler.prototype.tolerance = 0;
mxEdgeHandler.prototype.init = function() {
	this.graph = this.state.view.graph;
	this.marker = this.createMarker();
	this.constraintHandler = new mxConstraintHandler(this.graph);
	this.points = [];
	this.abspoints = this.getSelectionPoints(this.state);
	this.shape = this.createSelectionShape(this.abspoints);
	this.shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.shape.init(this.graph.getView().getOverlayPane());
	this.shape.node.style.cursor = mxConstants.CURSOR_MOVABLE_EDGE;
	var d = (mxClient.IS_TOUCH) ? "touchstart": "mousedown";
	var e = (mxClient.IS_TOUCH) ? "touchmove": "mousemove";
	var a = (mxClient.IS_TOUCH) ? "touchend": "mouseup";
	mxEvent.addListener(this.shape.node, "dblclick", mxUtils.bind(this,
	function(f) {
		this.graph.dblClick(f, this.state.cell)
	}));
	mxEvent.addListener(this.shape.node, d, mxUtils.bind(this,
	function(f) {
		if (this.addEnabled && this.isAddPointEvent(f)) {
			this.addPoint(this.state, f)
		} else {
			this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(f, this.state))
		}
	}));
	mxEvent.addListener(this.shape.node, e, mxUtils.bind(this,
	function(g) {
		var f = this.state.cell;
		if (this.index != null) {
			var h = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(g), mxEvent.getClientY(g));
			f = this.graph.getCellAt(h.x, h.y);
			if (this.graph.isSwimlane(f) && this.graph.hitsSwimlaneContent(f, h.x, h.y)) {
				f = null
			}
		}
		this.graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(g, this.graph.getView().getState(f)))
	}));
	mxEvent.addListener(this.shape.node, a, mxUtils.bind(this,
	function(f) {
		this.graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(f, this.state))
	}));
	this.preferHtml = this.state.text != null && this.state.text.node.parentNode == this.graph.container;
	if (!this.preferHtml) {
		var b = this.graph.view.getState(this.graph.view.getVisibleTerminal(this.state.cell, true));
		if (b != null) {
			this.preferHtml = b.text != null && b.text.node.parentNode == this.graph.container
		}
		if (!this.preferHtml) {
			var c = this.graph.view.getState(this.graph.view.getVisibleTerminal(this.state.cell, false));
			if (c != null) {
				this.preferHtml = c.text != null && c.text.node.parentNode == this.graph.container
			}
		}
	}
	if (this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells || mxGraphHandler.prototype.maxCells <= 0) {
		this.bends = this.createBends()
	}
	this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
	this.labelShape = new mxRectangleShape(new mxRectangle(), mxConstants.LABEL_HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	this.initBend(this.labelShape);
	this.labelShape.node.style.cursor = mxConstants.CURSOR_LABEL_HANDLE;
	mxEvent.redirectMouseEvents(this.labelShape.node, this.graph, this.state);
	this.redraw()
};
mxEdgeHandler.prototype.isAddPointEvent = function(a) {
	return mxEvent.isShiftDown(a)
};
mxEdgeHandler.prototype.isRemovePointEvent = function(a) {
	return mxEvent.isShiftDown(a)
};
mxEdgeHandler.prototype.getSelectionPoints = function(a) {
	return a.absolutePoints
};
mxEdgeHandler.prototype.createSelectionShape = function(b) {
	var a = new mxPolyline(b, this.getSelectionColor());
	a.strokewidth = this.getSelectionStrokeWidth();
	a.isDashed = this.isSelectionDashed();
	return a
};
mxEdgeHandler.prototype.getSelectionColor = function() {
	return mxConstants.EDGE_SELECTION_COLOR
};
mxEdgeHandler.prototype.getSelectionStrokeWidth = function() {
	return mxConstants.EDGE_SELECTION_STROKEWIDTH
};
mxEdgeHandler.prototype.isSelectionDashed = function() {
	return mxConstants.EDGE_SELECTION_DASHED
};
mxEdgeHandler.prototype.isConnectableCell = function(a) {
	return true
};
mxEdgeHandler.prototype.createMarker = function() {
	var a = new mxCellMarker(this.graph);
	var b = this;
	a.getCell = function(e) {
		var c = mxCellMarker.prototype.getCell.apply(this, arguments);
		if (!b.isConnectableCell(c)) {
			return null
		}
		var d = b.graph.getModel();
		if (c == b.state.cell || (c != null && !b.graph.connectableEdges && d.isEdge(c))) {
			c = null
		}
		return c
	};
	a.isValidState = function(f) {
		var d = b.graph.getModel();
		var c = d.getTerminal(b.state.cell, !b.isSource);
		var e = (b.isSource) ? f.cell: c;
		var g = (b.isSource) ? c: f.cell;
		b.error = b.validateConnection(e, g);
		return b.error == null
	};
	return a
};
mxEdgeHandler.prototype.validateConnection = function(a, b) {
	return this.graph.getEdgeValidationError(this.state.cell, a, b)
};
mxEdgeHandler.prototype.createBends = function() {
	var a = this.state.cell;
	var f = [];
	for (var e = 0; e < this.abspoints.length; e++) {
		if (this.isHandleVisible(e)) {
			var g = e == 0;
			var h = e == this.abspoints.length - 1;
			var d = g || h;
			if (d || this.graph.isCellBendable(a)) {
				var c = this.createHandleShape(e);
				this.initBend(c);
				if (mxClient.IS_TOUCH) {
					c.node.setAttribute("pointer-events", "none")
				}
				if (this.isHandleEnabled(e)) {
					if (mxClient.IS_TOUCH) {
						var b = mxUtils.bind(this,
						function(i) {
							var k = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(i), mxEvent.getClientY(i));
							return this.graph.view.getState(this.graph.getCellAt(k.x, k.y))
						});
						mxEvent.redirectMouseEvents(c.node, this.graph, b)
					} else {
						c.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
						mxEvent.redirectMouseEvents(c.node, this.graph, this.state)
					}
				}
				f.push(c);
				if (!d) {
					this.points.push(new mxPoint(0, 0));
					c.node.style.visibility = "hidden"
				}
			}
		}
	}
	return f
};
mxEdgeHandler.prototype.isHandleEnabled = function(a) {
	return true
};
mxEdgeHandler.prototype.isHandleVisible = function(a) {
	return (this.abspoints[a] != null) ? !this.abspoints[a].isRouted: true
};
mxEdgeHandler.prototype.createHandleShape = function(a) {
	if (this.handleImage != null) {
		return new mxImageShape(new mxRectangle(0, 0, this.handleImage.width, this.handleImage.height), this.handleImage.src)
	} else {
		var b = mxConstants.HANDLE_SIZE;
		if (this.preferHtml) {
			b -= 1
		}
		return new mxRectangleShape(new mxRectangle(0, 0, b, b), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR)
	}
};
mxEdgeHandler.prototype.initBend = function(a) {
	a.crisp = this.crisp;
	if (this.preferHtml) {
		a.dialect = mxConstants.DIALECT_STRICTHTML;
		a.init(this.graph.container)
	} else {
		a.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		a.init(this.graph.getView().getOverlayPane())
	}
};
mxEdgeHandler.prototype.getHandleForEvent = function(c) {
	if (this.bends != null) {
		var a = this.tolerance;
		var d = (this.allowHandleBoundsCheck && (mxClient.IS_IE || a > 0)) ? new mxRectangle(c.getGraphX() - a, c.getGraphY() - a, 2 * a, 2 * a) : null;
		for (var b = 0; b < this.bends.length; b++) {
			if (c.isSource(this.bends[b]) || (d != null && this.bends[b].node.style.visibility != "hidden" && mxUtils.intersects(this.bends[b].bounds, d))) {
				return b
			}
		}
	}
	if (c.isSource(this.labelShape) || c.isSource(this.state.text)) {
		if ((!mxClient.IS_SF && !mxClient.IS_GC) || c.getSource().nodeName != "SELECT") {
			return mxEvent.LABEL_HANDLE
		}
	}
	return null
};
mxEdgeHandler.prototype.mouseDown = function(a, b) {
	var c = null;
	c = this.getHandleForEvent(b);
	if (c != null && !b.isConsumed() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(b.getEvent())) {
		if (this.removeEnabled && this.isRemovePointEvent(b.getEvent())) {
			this.removePoint(this.state, c)
		} else {
			if (c != mxEvent.LABEL_HANDLE || this.graph.isLabelMovable(b.getCell())) {
				this.start(b.getX(), b.getY(), c)
			}
		}
		b.consume()
	}
};
mxEdgeHandler.prototype.start = function(b, e, c) {
	this.startX = b;
	this.startY = e;
	this.isSource = (this.bends == null) ? false: c == 0;
	this.isTarget = (this.bends == null) ? false: c == this.bends.length - 1;
	this.isLabel = c == mxEvent.LABEL_HANDLE;
	if (this.isSource || this.isTarget) {
		var a = this.state.cell;
		var d = this.graph.model.getTerminal(a, this.isSource);
		if ((d == null && this.graph.isTerminalPointMovable(a, this.isSource)) || (d != null && this.graph.isCellDisconnectable(a, d, this.isSource))) {
			this.index = c
		}
	} else {
		this.index = c
	}
};
mxEdgeHandler.prototype.clonePreviewState = function(a, b) {
	return this.state.clone()
};
mxEdgeHandler.prototype.getSnapToTerminalTolerance = function() {
	return this.graph.gridSize * this.graph.view.scale / 2
};
mxEdgeHandler.prototype.getPointForEvent = function(f) {
	var h = new mxPoint(f.getGraphX(), f.getGraphY());
	var d = this.getSnapToTerminalTolerance();
	var g = this.graph.getView();
	var a = false;
	var i = false;
	if (this.snapToTerminals && d > 0) {
		function c(m, n) {
			if (m != null) {
				var o = this.state.absolutePoints;
				var l = (n) ? o[0] : o[o.length - 1];
				var k = g.getRoutingCenterX(m);
				if (Math.abs(h.x - k) < d) {
					h.x = k;
					a = true
				}
				if (l != null && l.x != k) {
					k = l.x;
					if (Math.abs(h.x - k) < d) {
						h.x = k;
						a = true
					}
				}
				var p = g.getRoutingCenterY(m);
				if (Math.abs(h.y - p) < d) {
					h.y = p;
					i = true
				}
				if (l != null && l.y != p) {
					p = l.y;
					if (Math.abs(h.y - p) < d) {
						h.y = p;
						i = true
					}
				}
			}
		}
		c.call(this, g.getState(g.getVisibleTerminal(this.state.cell, true)), true);
		c.call(this, g.getState(g.getVisibleTerminal(this.state.cell, false)), false)
	}
	if (this.graph.isGridEnabledEvent(f.getEvent())) {
		var b = g.scale;
		var e = g.translate;
		if (!a) {
			h.x = (this.graph.snap(h.x / b - e.x) + e.x) * b
		}
		if (!i) {
			h.y = (this.graph.snap(h.y / b - e.y) + e.y) * b
		}
	}
	return h
};
mxEdgeHandler.prototype.getPreviewTerminal = function(c) {
	this.constraintHandler.update(c, this.isSource);
	this.marker.process(c);
	var b = this.marker.getValidState();
	var a = null;
	if (this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null) {
		this.marker.reset()
	}
	if (b != null) {
		a = b.cell
	} else {
		if (this.constraintHandler.currentConstraint != null && this.constraintHandler.currentFocus != null) {
			a = this.constraintHandler.currentFocus.cell
		}
	}
	return a
};
mxEdgeHandler.prototype.getPreviewPoints = function(a) {
	var c = this.graph.getCellGeometry(this.state.cell);
	var b = c.points;
	if (!this.isSource && !this.isTarget) {
		this.convertPoint(a, false);
		if (b == null) {
			b = [a]
		} else {
			b = b.slice();
			b[this.index - 1] = a
		}
	} else {
		if (this.graph.resetEdgesOnConnect) {
			b = null
		}
	}
	return b
};
mxEdgeHandler.prototype.updatePreviewState = function(d, k, f) {
	var a = (this.isSource) ? f: d.view.getVisibleTerminal(this.state.cell, true);
	var h = (this.isTarget) ? f: d.view.getVisibleTerminal(this.state.cell, false);
	var b = d.view.getState(a);
	var i = d.view.getState(h);
	var g = this.graph.getConnectionConstraint(d, b, true);
	var e = this.graph.getConnectionConstraint(d, i, false);
	var c = this.constraintHandler.currentConstraint;
	if (c == null) {
		c = new mxConnectionConstraint()
	}
	if (this.isSource) {
		g = c
	} else {
		if (this.isTarget) {
			e = c
		}
	}
	if (!this.isSource || b != null) {
		d.view.updateFixedTerminalPoint(d, b, true, g)
	}
	if (!this.isTarget || i != null) {
		d.view.updateFixedTerminalPoint(d, i, false, e)
	}
	if ((this.isSource || this.isTarget) && f == null) {
		d.setAbsoluteTerminalPoint(k, this.isSource);
		if (this.marker.getMarkedState() == null) {
			this.error = (this.graph.allowDanglingEdges) ? null: ""
		}
	}
	d.view.updatePoints(d, this.points, b, i);
	d.view.updateFloatingTerminalPoints(d, b, i)
};
mxEdgeHandler.prototype.mouseMove = function(d, e) {
	if (this.index != null && this.marker != null) {
		var a = this.getPointForEvent(e);
		if (this.isLabel) {
			this.label.x = a.x;
			this.label.y = a.y
		} else {
			this.points = this.getPreviewPoints(a);
			var c = (this.isSource || this.isTarget) ? this.getPreviewTerminal(e) : null;
			var f = this.clonePreviewState(a, c);
			this.updatePreviewState(f, a, c);
			var b = (this.error == null) ? this.marker.validColor: this.marker.invalidColor;
			this.setPreviewColor(b);
			this.abspoints = f.absolutePoints;
			this.active = true
		}
		this.drawPreview();
		mxEvent.consume(e.getEvent());
		e.consume()
	} else {
		if (mxClient.IS_IE && this.getHandleForEvent(e) != null) {
			e.consume(false)
		}
	}
};
mxEdgeHandler.prototype.mouseUp = function(b, d) {
	if (this.index != null && this.marker != null) {
		var c = this.state.cell;
		if (d.getX() != this.startX || d.getY() != this.startY) {
			if (this.error != null) {
				if (this.error.length > 0) {
					this.graph.validationAlert(this.error)
				}
			} else {
				if (this.isLabel) {
					this.moveLabel(this.state, this.label.x, this.label.y)
				} else {
					if (this.isSource || this.isTarget) {
						var a = null;
						if (this.constraintHandler.currentConstraint != null && this.constraintHandler.currentFocus != null) {
							a = this.constraintHandler.currentFocus.cell
						}
						if (a == null && this.marker.hasValidState()) {
							a = this.marker.validState.cell
						}
						if (a != null) {
							var c = this.connect(c, a, this.isSource, this.graph.isCloneEvent(d.getEvent()) && this.cloneEnabled && this.graph.isCellsCloneable(), d)
						} else {
							if (this.graph.isAllowDanglingEdges()) {
								var f = this.graph.getPointForEvent(d.getEvent());
								var e = this.graph.getView().getState(this.graph.getModel().getParent(c));
								if (e != null) {
									f.x -= e.origin.x;
									f.y -= e.origin.y
								}
								this.changeTerminalPoint(c, f, this.isSource)
							}
						}
					} else {
						if (this.active) {
							this.changePoints(c, this.points)
						} else {
							this.graph.getView().invalidate(this.state.cell);
							this.graph.getView().revalidate(this.state.cell)
						}
					}
				}
			}
		}
		if (this.marker != null) {
			this.reset();
			if (c != this.state.cell) {
				this.graph.setSelectionCell(c)
			}
		}
		d.consume()
	}
};
mxEdgeHandler.prototype.reset = function() {
	this.error = null;
	this.index = null;
	this.label = null;
	this.points = null;
	this.active = false;
	this.isLabel = false;
	this.isSource = false;
	this.isTarget = false;
	this.marker.reset();
	this.constraintHandler.reset();
	this.setPreviewColor(mxConstants.EDGE_SELECTION_COLOR);
	this.redraw()
};
mxEdgeHandler.prototype.setPreviewColor = function(a) {
	if (this.shape != null && this.shape.node != null) {
		if (this.shape.dialect == mxConstants.DIALECT_SVG) {
			this.shape.innerNode.setAttribute("stroke", a)
		} else {
			this.shape.node.setAttribute("strokecolor", a)
		}
	}
};
mxEdgeHandler.prototype.convertPoint = function(a, d) {
	var e = this.graph.getView().getScale();
	var c = this.graph.getView().getTranslate();
	if (d) {
		a.x = this.graph.snap(a.x);
		a.y = this.graph.snap(a.y)
	}
	a.x = Math.round(a.x / e - c.x);
	a.y = Math.round(a.y / e - c.y);
	var b = this.graph.getView().getState(this.graph.getModel().getParent(this.state.cell));
	if (b != null) {
		a.x -= b.origin.x;
		a.y -= b.origin.y
	}
	return a
};
mxEdgeHandler.prototype.moveLabel = function(b, a, g) {
	var c = this.graph.getModel();
	var f = c.getGeometry(b.cell);
	if (f != null) {
		f = f.clone();
		var d = this.graph.getView().getRelativePoint(b, a, g);
		f.x = d.x;
		f.y = d.y;
		var e = this.graph.getView().scale;
		f.offset = new mxPoint(0, 0);
		var d = this.graph.view.getPoint(b, f);
		f.offset = new mxPoint((a - d.x) / e, (g - d.y) / e);
		c.setGeometry(b.cell, f)
	}
};
mxEdgeHandler.prototype.connect = function(b, d, g, f, i) {
	var c = this.graph.getModel();
	var k = c.getParent(b);
	c.beginUpdate();
	try {
		if (f) {
			var h = b.clone();
			c.add(k, h, c.getChildCount(k));
			var e = c.getTerminal(b, !g);
			this.graph.connectCell(h, e, !g);
			b = h
		}
		var a = this.constraintHandler.currentConstraint;
		if (a == null) {
			a = new mxConnectionConstraint()
		}
		this.graph.connectCell(b, d, g, a)
	} finally {
		c.endUpdate()
	}
	return b
};
mxEdgeHandler.prototype.changeTerminalPoint = function(d, a, c) {
	var b = this.graph.getModel();
	var e = b.getGeometry(d);
	if (e != null) {
		b.beginUpdate();
		try {
			e = e.clone();
			e.setTerminalPoint(a, c);
			b.setGeometry(d, e);
			this.graph.connectCell(d, null, c, new mxConnectionConstraint())
		} finally {
			b.endUpdate()
		}
	}
};
mxEdgeHandler.prototype.changePoints = function(c, b) {
	var a = this.graph.getModel();
	var d = a.getGeometry(c);
	if (d != null) {
		d = d.clone();
		d.points = b;
		a.setGeometry(c, d)
	}
};
mxEdgeHandler.prototype.addPoint = function(c, a) {
	var f = this.graph.getCellGeometry(c.cell);
	if (f != null) {
		f = f.clone();
		var e = mxUtils.convertPoint(this.graph.container, mxEvent.getClientX(a), mxEvent.getClientY(a));
		var b = mxUtils.findNearestSegment(c, e.x, e.y);
		var d = this.graph.isGridEnabledEvent(a);
		this.convertPoint(e, d);
		if (f.points == null) {
			f.points = [e]
		} else {
			f.points.splice(b, 0, e)
		}
		this.graph.getModel().setGeometry(c.cell, f);
		this.destroy();
		this.init();
		mxEvent.consume(a)
	}
};
mxEdgeHandler.prototype.removePoint = function(b, a) {
	if (a > 0 && a < this.abspoints.length - 1) {
		var c = this.graph.getCellGeometry(this.state.cell);
		if (c != null && c.points != null) {
			c = c.clone();
			c.points.splice(a - 1, 1);
			this.graph.getModel().setGeometry(b.cell, c);
			this.destroy();
			this.init()
		}
	}
};
mxEdgeHandler.prototype.getHandleFillColor = function(c) {
	var e = c == 0;
	var a = this.state.cell;
	var d = this.graph.getModel().getTerminal(a, e);
	var b = mxConstants.HANDLE_FILLCOLOR;
	if ((d != null && !this.graph.isCellDisconnectable(a, d, e)) || (d == null && !this.graph.isTerminalPointMovable(a, e))) {
		b = mxConstants.LOCKED_HANDLE_FILLCOLOR
	} else {
		if (d != null && this.graph.isCellDisconnectable(a, d, e)) {
			b = mxConstants.CONNECT_HANDLE_FILLCOLOR
		}
	}
	return b
};
mxEdgeHandler.prototype.redraw = function() {
	this.abspoints = this.state.absolutePoints.slice();
	var l = this.state.cell;
	var o = mxConstants.LABEL_HANDLE_SIZE;
	this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
	this.labelShape.bounds = new mxRectangle(this.label.x - o / 2, this.label.y - o / 2, o, o);
	this.labelShape.redraw();
	var g = this.graph.getLabel(l);
	if (g != null && g.length > 0 && this.graph.isLabelMovable(l)) {
		this.labelShape.node.style.visibility = "visible"
	} else {
		this.labelShape.node.style.visibility = "hidden"
	}
	if (this.bends != null && this.bends.length > 0) {
		var e = this.abspoints.length - 1;
		var m = this.abspoints[0];
		var d = this.abspoints[0].x;
		var k = this.abspoints[0].y;
		var i = this.bends[0].bounds;
		this.bends[0].bounds = new mxRectangle(d - i.width / 2, k - i.height / 2, i.width, i.height);
		this.bends[0].fill = this.getHandleFillColor(0);
		this.bends[0].reconfigure();
		this.bends[0].redraw();
		var h = this.abspoints[e];
		var f = this.abspoints[e].x;
		var c = this.abspoints[e].y;
		var a = this.bends.length - 1;
		i = this.bends[a].bounds;
		this.bends[a].bounds = new mxRectangle(f - i.width / 2, c - i.height / 2, i.width, i.height);
		this.bends[a].fill = this.getHandleFillColor(a);
		this.bends[a].reconfigure();
		this.bends[a].redraw();
		this.redrawInnerBends(m, h)
	}
	this.drawPreview()
};
mxEdgeHandler.prototype.redrawInnerBends = function(l, d) {
	var f = this.graph.getModel().getGeometry(this.state.cell);
	var h = f.points;
	if (h != null) {
		if (this.points == null) {
			this.points = []
		}
		for (var e = 1; e < this.bends.length - 1; e++) {
			if (this.abspoints[e] != null) {
				var c = this.abspoints[e].x;
				var k = this.abspoints[e].y;
				var a = this.bends[e].bounds;
				this.bends[e].node.style.visibility = "visible";
				this.bends[e].bounds = new mxRectangle(c - a.width / 2, k - a.height / 2, a.width, a.height);
				this.bends[e].redraw();
				this.points[e - 1] = h[e - 1]
			} else {
				if (this.bends[e] != null) {
					this.bends[e].destroy();
					this.bends[e] = null
				}
			}
		}
	}
};
mxEdgeHandler.prototype.drawPreview = function() {
	if (this.isLabel) {
		var a = mxConstants.LABEL_HANDLE_SIZE;
		var b = new mxRectangle(this.label.x - a / 2, this.label.y - a / 2, a, a);
		this.labelShape.bounds = b;
		this.labelShape.redraw()
	} else {
		this.shape.points = this.abspoints;
		this.shape.redraw()
	}
	mxUtils.repaintGraph(this.graph, this.shape.points[this.shape.points.length - 1])
};
mxEdgeHandler.prototype.destroy = function() {
	if (this.marker != null) {
		this.marker.destroy();
		this.marker = null
	}
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null
	}
	if (this.labelShape != null) {
		this.labelShape.destroy();
		this.labelShape = null
	}
	if (this.constraintHandler != null) {
		this.constraintHandler.destroy();
		this.constraintHandler = null
	}
	if (this.bends != null) {
		for (var a = 0; a < this.bends.length; a++) {
			if (this.bends[a] != null) {
				this.bends[a].destroy();
				this.bends[a] = null
			}
		}
	}
};
function mxElbowEdgeHandler(a) {
	if (a != null) {
		this.state = a;
		this.init()
	}
}
mxElbowEdgeHandler.prototype = new mxEdgeHandler();
mxElbowEdgeHandler.prototype.constructor = mxElbowEdgeHandler;
mxElbowEdgeHandler.prototype.flipEnabled = true;
mxElbowEdgeHandler.prototype.doubleClickOrientationResource = (mxClient.language != "none") ? "doubleClickOrientation": "";
mxElbowEdgeHandler.prototype.createBends = function() {
	var b = [];
	var a = this.createHandleShape(0);
	this.initBend(a);
	a.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(a.node, this.graph, this.state);
	b.push(a);
	if (mxClient.IS_TOUCH) {
		a.node.setAttribute("pointer-events", "none")
	}
	b.push(this.createVirtualBend());
	this.points.push(new mxPoint(0, 0));
	a = this.createHandleShape(2);
	this.initBend(a);
	a.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(a.node, this.graph, this.state);
	b.push(a);
	if (mxClient.IS_TOUCH) {
		a.node.setAttribute("pointer-events", "none")
	}
	return b
};
mxElbowEdgeHandler.prototype.createVirtualBend = function() {
	var c = this.createHandleShape();
	this.initBend(c);
	var a = this.getCursorForBend();
	c.node.style.cursor = a;
	var b = mxUtils.bind(this,
	function(d) {
		if (!mxEvent.isConsumed(d) && this.flipEnabled) {
			this.graph.flipEdge(this.state.cell, d);
			mxEvent.consume(d)
		}
	});
	mxEvent.redirectMouseEvents(c.node, this.graph, this.state, null, null, null, b);
	if (!this.graph.isCellBendable(this.state.cell)) {
		c.node.style.visibility = "hidden"
	}
	return c
};
mxElbowEdgeHandler.prototype.getCursorForBend = function() {
	return (this.state.style[mxConstants.STYLE_EDGE] == mxEdgeStyle.TopToBottom || this.state.style[mxConstants.STYLE_EDGE] == mxConstants.EDGESTYLE_TOPTOBOTTOM || ((this.state.style[mxConstants.STYLE_EDGE] == mxEdgeStyle.ElbowConnector || this.state.style[mxConstants.STYLE_EDGE] == mxConstants.EDGESTYLE_ELBOW) && this.state.style[mxConstants.STYLE_ELBOW] == mxConstants.ELBOW_VERTICAL)) ? "row-resize": "col-resize"
};
mxElbowEdgeHandler.prototype.getTooltipForNode = function(a) {
	var b = null;
	if (this.bends != null && this.bends[1] != null && (a == this.bends[1].node || a.parentNode == this.bends[1].node)) {
		b = this.doubleClickOrientationResource;
		b = mxResources.get(b) || b
	}
	return b
};
mxElbowEdgeHandler.prototype.convertPoint = function(a, d) {
	var e = this.graph.getView().getScale();
	var c = this.graph.getView().getTranslate();
	var b = this.state.origin;
	if (d) {
		a.x = this.graph.snap(a.x);
		a.y = this.graph.snap(a.y)
	}
	a.x = Math.round(a.x / e - c.x - b.x);
	a.y = Math.round(a.y / e - c.y - b.y)
};
mxElbowEdgeHandler.prototype.redrawInnerBends = function(k, e) {
	var d = this.graph.getModel().getGeometry(this.state.cell);
	var l = d.points;
	var m = (l != null) ? l[0] : null;
	if (m == null) {
		m = new mxPoint(k.x + (e.x - k.x) / 2, k.y + (e.y - k.y) / 2)
	} else {
		m = new mxPoint(this.graph.getView().scale * (m.x + this.graph.getView().translate.x + this.state.origin.x), this.graph.getView().scale * (m.y + this.graph.getView().translate.y + this.state.origin.y))
	}
	var f = this.bends[1].bounds;
	var i = f.width;
	var c = f.height;
	if (this.handleImage == null) {
		i = mxConstants.HANDLE_SIZE;
		c = mxConstants.HANDLE_SIZE
	}
	var a = new mxRectangle(m.x - i / 2, m.y - c / 2, i, c);
	if (this.handleImage == null && this.labelShape.node.style.visibility != "hidden" && mxUtils.intersects(a, this.labelShape.bounds)) {
		i += 3;
		c += 3;
		a = new mxRectangle(m.x - i / 2, m.y - c / 2, i, c)
	}
	this.bends[1].bounds = a;
	this.bends[1].reconfigure();
	this.bends[1].redraw()
};
function mxEdgeSegmentHandler(a) {
	if (a != null) {
		this.state = a;
		this.init()
	}
}
mxEdgeSegmentHandler.prototype = new mxElbowEdgeHandler();
mxEdgeSegmentHandler.prototype.constructor = mxEdgeSegmentHandler;
mxEdgeSegmentHandler.prototype.getPreviewPoints = function(e) {
	if (this.isSource || this.isTarget) {
		return mxElbowEdgeHandler.prototype.getPreviewPoints.apply(this, arguments)
	} else {
		this.convertPoint(e, false);
		var g = this.state.absolutePoints;
		var f = g[0].clone();
		this.convertPoint(f, false);
		var k = [];
		for (var b = 1; b < g.length; b++) {
			var h = g[b].clone();
			this.convertPoint(h, false);
			if (b == this.index) {
				if (f.x == h.x) {
					f.x = e.x;
					h.x = e.x
				} else {
					f.y = e.y;
					h.y = e.y
				}
			}
			if (b < g.length - 1) {
				k.push(h)
			}
			f = h
		}
		if (k.length == 1) {
			var d = this.state.view;
			var c = d.getState(d.getVisibleTerminal(this.state.cell, false));
			var a = d.getState(d.getVisibleTerminal(this.state.cell, true));
			if (c != null & a != null) {
				if (mxUtils.contains(c, k[0].x, k[0].y)) {
					if (g[1].y == g[2].y) {
						k[0].y = d.getRoutingCenterY(a)
					} else {
						k[0].x = d.getRoutingCenterX(a)
					}
				} else {
					if (mxUtils.contains(a, k[0].x, k[0].y)) {
						if (g[1].y == g[0].y) {
							k[0].y = d.getRoutingCenterY(c)
						} else {
							k[0].x = d.getRoutingCenterX(c)
						}
					}
				}
			}
		} else {
			if (k.length == 0) {
				k = [e]
			}
		}
		return k
	}
};
mxEdgeSegmentHandler.prototype.createBends = function() {
	var d = [];
	var c = this.createHandleShape(0);
	this.initBend(c);
	c.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(c.node, this.graph, this.state);
	d.push(c);
	if (mxClient.IS_TOUCH) {
		c.node.setAttribute("pointer-events", "none")
	}
	var e = this.state.absolutePoints;
	if (this.graph.isCellBendable(this.state.cell)) {
		for (var b = 0; b < e.length - 1; b++) {
			var c = this.createVirtualBend();
			d.push(c);
			var a = e[b].x - e[b + 1].x == 0;
			c.node.style.cursor = (a) ? "col-resize": "row-resize";
			this.points.push(new mxPoint(0, 0));
			if (mxClient.IS_TOUCH) {
				c.node.setAttribute("pointer-events", "none")
			}
		}
	}
	var c = this.createHandleShape(e.length);
	this.initBend(c);
	c.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(c.node, this.graph, this.state);
	d.push(c);
	if (mxClient.IS_TOUCH) {
		c.node.setAttribute("pointer-events", "none")
	}
	return d
};
mxEdgeSegmentHandler.prototype.redrawInnerBends = function(f, a) {
	if (this.graph.isCellBendable(this.state.cell)) {
		var c = mxConstants.HANDLE_SIZE;
		var e = this.state.absolutePoints;
		if (e != null && e.length > 1) {
			for (var b = 0; b < this.state.absolutePoints.length - 1; b++) {
				if (this.bends[b + 1] != null) {
					var f = e[b];
					var a = e[b + 1];
					var d = new mxPoint(f.x + (a.x - f.x) / 2, f.y + (a.y - f.y) / 2);
					this.bends[b + 1].bounds = new mxRectangle(d.x - c / 2, d.y - c / 2, c, c);
					this.bends[b + 1].reconfigure();
					this.bends[b + 1].redraw()
				}
			}
		}
	}
};
mxEdgeSegmentHandler.prototype.connect = function(e, c, b, a, d) {
	mxEdgeHandler.prototype.connect.apply(this, arguments);
	this.refresh()
};
mxEdgeSegmentHandler.prototype.changeTerminalPoint = function(c, a, b) {
	mxEdgeHandler.prototype.changeTerminalPoint.apply(this, arguments);
	this.refresh()
};
mxEdgeSegmentHandler.prototype.changePoints = function(c, b) {
	b = [];
	var f = this.abspoints;
	if (f.length > 1) {
		var g = f[0];
		var e = f[1];
		for (var a = 2; a < f.length; a++) {
			var d = f[a];
			if ((Math.round(g.x) != Math.round(e.x) || Math.round(e.x) != Math.round(d.x)) && (Math.round(g.y) != Math.round(e.y) || Math.round(e.y) != Math.round(d.y))) {
				g = e;
				e = e.clone();
				this.convertPoint(e, false);
				b.push(e)
			}
			e = d
		}
	}
	mxElbowEdgeHandler.prototype.changePoints.apply(this, arguments);
	this.refresh()
};
mxEdgeSegmentHandler.prototype.refresh = function() {
	this.destroy();
	this.init()
};
function mxKeyHandler(a, b) {
	if (a != null) {
		this.graph = a;
		this.target = b || document.documentElement;
		this.normalKeys = [];
		this.controlKeys = [];
		mxEvent.addListener(this.target, "keydown", mxUtils.bind(this,
		function(c) {
			this.keyDown(c)
		}));
		if (mxClient.IS_IE) {
			mxEvent.addListener(window, "unload", mxUtils.bind(this,
			function() {
				this.destroy()
			}))
		}
	}
}
mxKeyHandler.prototype.graph = null;
mxKeyHandler.prototype.target = null;
mxKeyHandler.prototype.normalKeys = null;
mxKeyHandler.prototype.controlKeys = null;
mxKeyHandler.prototype.enabled = true;
mxKeyHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxKeyHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxKeyHandler.prototype.bindKey = function(b, a) {
	this.normalKeys[b] = a
};
mxKeyHandler.prototype.bindControlKey = function(b, a) {
	this.controlKeys[b] = a
};
mxKeyHandler.prototype.getFunction = function(a) {
	if (a != null) {
		return (mxEvent.isControlDown(a)) ? this.controlKeys[a.keyCode] : this.normalKeys[a.keyCode]
	}
	return null
};
mxKeyHandler.prototype.isGraphEvent = function(a) {
	var c = mxEvent.getSource(a);
	if ((c == this.target || c.parentNode == this.target) || (this.graph.cellEditor != null && c == this.graph.cellEditor.textarea)) {
		return true
	}
	var b = c;
	while (b != null) {
		if (b == this.graph.container) {
			return true
		}
		b = b.parentNode
	}
	return false
};
mxKeyHandler.prototype.keyDown = function(a) {
	if (this.graph.isEnabled() && !mxEvent.isConsumed(a) && this.isGraphEvent(a) && this.isEnabled()) {
		if (a.keyCode == 27) {
			this.escape(a)
		} else {
			if (!this.graph.isEditing()) {
				var b = this.getFunction(a);
				if (b != null) {
					b(a);
					mxEvent.consume(a)
				}
			}
		}
	}
};
mxKeyHandler.prototype.escape = function(a) {
	if (this.graph.isEscapeEnabled()) {
		this.graph.escape(a)
	}
};
mxKeyHandler.prototype.destroy = function() {
	this.target = null
};
function mxTooltipHandler(b, a) {
	if (b != null) {
		this.graph = b;
		this.delay = a || 500;
		this.graph.addMouseListener(this)
	}
}
mxTooltipHandler.prototype.zIndex = 10005;
mxTooltipHandler.prototype.graph = null;
mxTooltipHandler.prototype.delay = null;
mxTooltipHandler.prototype.hideOnHover = false;
mxTooltipHandler.prototype.enabled = true;
mxTooltipHandler.prototype.isEnabled = function() {
	return this.enabled
};
mxTooltipHandler.prototype.setEnabled = function(a) {
	this.enabled = a
};
mxTooltipHandler.prototype.isHideOnHover = function() {
	return this.hideOnHover
};
mxTooltipHandler.prototype.setHideOnHover = function(a) {
	this.hideOnHover = a
};
mxTooltipHandler.prototype.init = function() {
	if (document.body != null) {
		this.div = document.createElement("div");
		this.div.className = "mxTooltip";
		this.div.style.visibility = "hidden";
		this.div.style.zIndex = this.zIndex;
		document.body.appendChild(this.div);
		mxEvent.addListener(this.div, "mousedown", mxUtils.bind(this,
		function(a) {
			this.hideTooltip()
		}))
	}
};
mxTooltipHandler.prototype.mouseDown = function(a, b) {
	this.reset(b, false);
	this.hideTooltip()
};
mxTooltipHandler.prototype.mouseMove = function(a, b) {
	if (b.getX() != this.lastX || b.getY() != this.lastY) {
		this.reset(b, true);
		if (this.isHideOnHover() || b.getState() != this.state || (b.getSource() != this.node && (!this.stateSource || (b.getState() != null && this.stateSource == (b.isSource(b.getState().shape) || !b.isSource(b.getState().text)))))) {
			this.hideTooltip()
		}
	}
	this.lastX = b.getX();
	this.lastY = b.getY()
};
mxTooltipHandler.prototype.mouseUp = function(a, b) {
	this.reset(b, true);
	this.hideTooltip()
};
mxTooltipHandler.prototype.resetTimer = function() {
	if (this.thread != null) {
		window.clearTimeout(this.thread);
		this.thread = null
	}
};
mxTooltipHandler.prototype.reset = function(d, b) {
	this.resetTimer();
	if (b && this.isEnabled() && d.getState() != null && (this.div == null || this.div.style.visibility == "hidden")) {
		var e = d.getState();
		var c = d.getSource();
		var a = d.getX();
		var g = d.getY();
		var f = d.isSource(e.shape) || d.isSource(e.text);
		this.thread = window.setTimeout(mxUtils.bind(this,
		function() {
			if (!this.graph.isEditing() && !this.graph.panningHandler.isMenuShowing()) {
				var h = this.graph.getTooltip(e, c, a, g);
				this.show(h, a, g);
				this.state = e;
				this.node = c;
				this.stateSource = f
			}
		}), this.delay)
	}
};
mxTooltipHandler.prototype.hide = function() {
	this.resetTimer();
	this.hideTooltip()
};
mxTooltipHandler.prototype.hideTooltip = function() {
	if (this.div != null) {
		this.div.style.visibility = "hidden"
	}
};
mxTooltipHandler.prototype.show = function(c, a, d) {
	if (c != null && c.length > 0) {
		if (this.div == null) {
			this.init()
		}
		var b = mxUtils.getScrollOrigin();
		this.div.style.left = (a + b.x) + "px";
		this.div.style.top = (d + mxConstants.TOOLTIP_VERTICAL_OFFSET + b.y) + "px";
		if (!mxUtils.isNode(c)) {
			this.div.innerHTML = c.replace(/\n/g, "<br>")
		} else {
			this.div.innerHTML = "";
			this.div.appendChild(c)
		}
		this.div.style.visibility = "";
		mxUtils.fit(this.div)
	}
};
mxTooltipHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	mxEvent.release(this.div);
	if (this.div != null && this.div.parentNode != null) {
		this.div.parentNode.removeChild(this.div)
	}
	this.div = null
};
function mxCellTracker(c, b, a) {
	mxCellMarker.call(this, c, b);
	this.graph.addMouseListener(this);
	if (a != null) {
		this.getCell = a
	}
	if (mxClient.IS_IE) {
		mxEvent.addListener(window, "unload", mxUtils.bind(this,
		function() {
			this.destroy()
		}))
	}
}
mxCellTracker.prototype = new mxCellMarker();
mxCellTracker.prototype.constructor = mxCellTracker;
mxCellTracker.prototype.mouseDown = function(a, b) {};
mxCellTracker.prototype.mouseMove = function(a, b) {
	if (this.isEnabled()) {
		this.process(b)
	}
};
mxCellTracker.prototype.mouseUp = function(a, b) {
	this.reset()
};
mxCellTracker.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		this.graph.removeMouseListener(this);
		mxCellMarker.prototype.destroy.apply(this)
	}
};
function mxCellHighlight(a, c, b) {
	if (a != null) {
		this.graph = a;
		this.highlightColor = (c != null) ? c: mxConstants.DEFAULT_VALID_COLOR;
		this.strokeWidth = (b != null) ? b: mxConstants.HIGHLIGHT_STROKEWIDTH;
		this.resetHandler = mxUtils.bind(this,
		function(d) {
			this.hide()
		});
		this.graph.getView().addListener(mxEvent.SCALE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.TRANSLATE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.DOWN, this.resetHandler);
		this.graph.getView().addListener(mxEvent.UP, this.resetHandler);
		this.graph.getModel().addListener(mxEvent.CHANGE, this.resetHandler)
	}
}
mxCellHighlight.prototype.keepOnTop = false;
mxCellHighlight.prototype.graph = true;
mxCellHighlight.prototype.state = null;
mxCellHighlight.prototype.spacing = 2;
mxCellHighlight.prototype.resetHandler = null;
mxCellHighlight.prototype.setHighlightColor = function(a) {
	this.highlightColor = a;
	if (this.shape != null) {
		if (this.shape.dialect == mxConstants.DIALECT_SVG) {
			this.shape.innerNode.setAttribute("stroke", a)
		} else {
			if (this.shape.dialect == mxConstants.DIALECT_VML) {
				this.shape.node.setAttribute("strokecolor", a)
			}
		}
	}
};
mxCellHighlight.prototype.drawHighlight = function(b) {
	var a = this.createShape(b);
	a.redraw();
	if (!this.keepOnTop && a.node.parentNode.firstChild != a.node) {
		a.node.parentNode.insertBefore(a.node, a.node.parentNode.firstChild)
	}
	if (this.graph.model.isEdge(b.cell)) {
		mxUtils.repaintGraph(this.graph, a.points[0])
	}
	return a
};
mxCellHighlight.prototype.createShape = function(b) {
	var a = null;
	if (this.graph.model.isEdge(b.cell)) {
		a = new mxPolyline(b.absolutePoints, this.highlightColor, this.strokeWidth)
	} else {
		a = new mxRectangleShape(new mxRectangle(b.x - this.spacing, b.y - this.spacing, b.width + 2 * this.spacing, b.height + 2 * this.spacing), null, this.highlightColor, this.strokeWidth)
	}
	a.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	a.init(this.graph.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(a.node, this.graph, b);
	if (a.dialect == mxConstants.DIALECT_SVG) {
		a.node.setAttribute("style", "pointer-events:none;")
	} else {
		a.node.style.background = ""
	}
	return a
};
mxCellHighlight.prototype.hide = function() {
	this.highlight(null)
};
mxCellHighlight.prototype.highlight = function(a) {
	if (this.state != a) {
		if (this.shape != null) {
			this.shape.destroy();
			this.shape = null
		}
		if (a != null) {
			this.shape = this.drawHighlight(a)
		}
		this.state = a
	}
};
mxCellHighlight.prototype.destroy = function() {
	this.graph.getView().removeListener(this.resetHandler);
	this.graph.getModel().removeListener(this.resetHandler);
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null
	}
};
function mxDefaultKeyHandler(b) {
	if (b != null) {
		this.editor = b;
		this.handler = new mxKeyHandler(b.graph);
		var a = this.handler.escape;
		this.handler.escape = function(c) {
			a.apply(this, arguments);
			b.hideProperties();
			b.fireEvent(new mxEventObject(mxEvent.ESCAPE, "event", c))
		}
	}
}
mxDefaultKeyHandler.prototype.editor = null;
mxDefaultKeyHandler.prototype.handler = null;
mxDefaultKeyHandler.prototype.bindAction = function(a, b, d) {
	var c = mxUtils.bind(this,
	function() {
		this.editor.execute(b)
	});
	if (d) {
		this.handler.bindControlKey(a, c)
	} else {
		this.handler.bindKey(a, c)
	}
};
mxDefaultKeyHandler.prototype.destroy = function() {
	this.handler.destroy();
	this.handler = null
};
function mxDefaultPopupMenu(a) {
	this.config = a
}
mxDefaultPopupMenu.prototype.imageBasePath = null;
mxDefaultPopupMenu.prototype.config = null;
mxDefaultPopupMenu.prototype.createMenu = function(c, f, a, b) {
	if (this.config != null) {
		var e = this.createConditions(c, a, b);
		var d = this.config.firstChild;
		this.addItems(c, f, a, b, e, d, null)
	}
};
mxDefaultPopupMenu.prototype.addItems = function(editor, menu, cell, evt, conditions, item, parent) {
	var addSeparator = false;
	while (item != null) {
		if (item.nodeName == "add") {
			var condition = item.getAttribute("if");
			if (condition == null || conditions[condition]) {
				var as = item.getAttribute("as");
				as = mxResources.get(as) || as;
				var funct = mxUtils.eval(mxUtils.getTextContent(item));
				var action = item.getAttribute("action");
				var icon = item.getAttribute("icon");
				var iconCls = item.getAttribute("iconCls");
				if (addSeparator) {
					menu.addSeparator(parent);
					addSeparator = false
				}
				if (icon != null && this.imageBasePath) {
					icon = this.imageBasePath + icon
				}
				var row = this.addAction(menu, editor, as, icon, funct, action, cell, parent, iconCls);
				this.addItems(editor, menu, cell, evt, conditions, item.firstChild, row)
			}
		} else {
			if (item.nodeName == "separator") {
				addSeparator = true
			}
		}
		item = item.nextSibling
	}
};
mxDefaultPopupMenu.prototype.addAction = function(b, e, d, g, a, c, i, h, k) {
	var f = function(l) {
		if (typeof(a) == "function") {
			a.call(e, e, i, l)
		}
		if (c != null) {
			e.execute(c, i, l)
		}
	};
	return b.addItem(d, g, f, h, k)
};
mxDefaultPopupMenu.prototype.createConditions = function(editor, cell, evt) {
	var model = editor.graph.getModel();
	var childCount = model.getChildCount(cell);
	var conditions = [];
	conditions.nocell = cell == null;
	conditions.ncells = editor.graph.getSelectionCount() > 1;
	conditions.notRoot = model.getRoot() != model.getParent(editor.graph.getDefaultParent());
	conditions.cell = cell != null;
	var isCell = cell != null && editor.graph.getSelectionCount() == 1;
	conditions.nonEmpty = isCell && childCount > 0;
	conditions.expandable = isCell && editor.graph.isCellFoldable(cell, false);
	conditions.collapsable = isCell && editor.graph.isCellFoldable(cell, true);
	conditions.validRoot = isCell && editor.graph.isValidRoot(cell);
	conditions.emptyValidRoot = conditions.validRoot && childCount == 0;
	conditions.swimlane = isCell && editor.graph.isSwimlane(cell);
	var condNodes = this.config.getElementsByTagName("condition");
	for (var i = 0; i < condNodes.length; i++) {
		var funct = mxUtils.eval(mxUtils.getTextContent(condNodes[i]));
		var name = condNodes[i].getAttribute("name");
		if (name != null && typeof(funct) == "function") {
			conditions[name] = funct(editor, cell, evt)
		}
	}
	return conditions
};
function mxDefaultToolbar(a, b) {
	this.editor = b;
	if (a != null && b != null) {
		this.init(a)
	}
}
mxDefaultToolbar.prototype.editor = null;
mxDefaultToolbar.prototype.toolbar = null;
mxDefaultToolbar.prototype.resetHandler = null;
mxDefaultToolbar.prototype.spacing = 4;
mxDefaultToolbar.prototype.connectOnDrop = false;
mxDefaultToolbar.prototype.init = function(a) {
	if (a != null) {
		this.toolbar = new mxToolbar(a);
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
mxDefaultToolbar.prototype.addItem = function(d, a, c, b) {
	var e = mxUtils.bind(this,
	function() {
		if (c != null && c.length > 0) {
			this.editor.execute(c)
		}
	});
	return this.toolbar.addItem(d, a, e, b)
};
mxDefaultToolbar.prototype.addSeparator = function(a) {
	a = a || mxClient.imageBasePath + "/separator.gif";
	this.toolbar.addSeparator(a)
};
mxDefaultToolbar.prototype.addCombo = function() {
	return this.toolbar.addCombo()
};
mxDefaultToolbar.prototype.addActionCombo = function(a) {
	return this.toolbar.addActionCombo(a)
};
mxDefaultToolbar.prototype.addActionOption = function(b, c, a) {
	var d = mxUtils.bind(this,
	function() {
		this.editor.execute(a)
	});
	this.addOption(b, c, d)
};
mxDefaultToolbar.prototype.addOption = function(b, c, a) {
	return this.toolbar.addOption(b, c, a)
};
mxDefaultToolbar.prototype.addMode = function(e, b, d, c, a) {
	var f = mxUtils.bind(this,
	function() {
		this.editor.setMode(d);
		if (a != null) {
			a(this.editor)
		}
	});
	return this.toolbar.addSwitchMode(e, b, f, c)
};
mxDefaultToolbar.prototype.addPrototype = function(g, f, i, b, h) {
	var c = function() {
		if (typeof(i) == "function") {
			return i()
		} else {
			if (i != null) {
				return i.clone()
			}
		}
		return null
	};
	var e = mxUtils.bind(this,
	function(l, k) {
		if (typeof(h) == "function") {
			h(this.editor, c(), l, k)
		} else {
			this.drop(c(), l, k)
		}
		this.toolbar.resetMode();
		mxEvent.consume(l)
	});
	var d = this.toolbar.addMode(g, f, e, b);
	var a = function(m, l, k) {
		e(l, k)
	};
	this.installDropHandler(d, a);
	return d
};
mxDefaultToolbar.prototype.drop = function(d, a, e) {
	var c = this.editor.graph;
	var b = c.getModel();
	if (e == null || b.isEdge(e) || !this.connectOnDrop || !c.isCellConnectable(e)) {
		while (e != null && !c.isValidDropTarget(e, [d], a)) {
			e = b.getParent(e)
		}
		this.insert(d, a, e)
	} else {
		this.connect(d, a, e)
	}
};
mxDefaultToolbar.prototype.insert = function(d, b, f) {
	var c = this.editor.graph;
	if (c.canImportCell(d)) {
		var a = mxEvent.getClientX(b);
		var g = mxEvent.getClientY(b);
		var e = mxUtils.convertPoint(c.container, a, g);
		if (c.isSplitEnabled() && c.isSplitTarget(f, [d], b)) {
			return c.splitEdge(f, [d], null, e.x, e.y)
		} else {
			return this.editor.addVertex(f, d, e.x, e.y)
		}
	}
	return null
};
mxDefaultToolbar.prototype.connect = function(f, m, a) {
	var n = this.editor.graph;
	var e = n.getModel();
	if (a != null && n.isCellConnectable(f) && n.isEdgeValid(null, a, f)) {
		var b = null;
		e.beginUpdate();
		try {
			var d = e.getGeometry(a);
			var h = e.getGeometry(f).clone();
			h.x = d.x + (d.width - h.width) / 2;
			h.y = d.y + (d.height - h.height) / 2;
			var c = this.spacing * n.gridSize;
			var i = e.getDirectedEdgeCount(a, true) * 20;
			if (this.editor.horizontalFlow) {
				h.x += (h.width + d.width) / 2 + c + i
			} else {
				h.y += (h.height + d.height) / 2 + c + i
			}
			f.setGeometry(h);
			var l = e.getParent(a);
			n.addCell(f, l);
			n.constrainChild(f);
			b = this.editor.createEdge(a, f);
			if (e.getGeometry(b) == null) {
				var k = new mxGeometry();
				k.relative = true;
				e.setGeometry(b, k)
			}
			n.addEdge(b, l, a, f)
		} finally {
			e.endUpdate()
		}
		n.setSelectionCells([f, b]);
		n.scrollCellToVisible(f)
	}
};
mxDefaultToolbar.prototype.installDropHandler = function(c, b) {
	var d = document.createElement("img");
	d.setAttribute("src", c.getAttribute("src"));
	var a = mxUtils.bind(this,
	function(e) {
		d.style.width = (2 * c.offsetWidth) + "px";
		d.style.height = (2 * c.offsetHeight) + "px";
		mxUtils.makeDraggable(c, this.editor.graph, b, d);
		mxEvent.removeListener(d, "load", a)
	});
	if (mxClient.IS_IE) {
		a()
	} else {
		mxEvent.addListener(d, "load", a)
	}
};
mxDefaultToolbar.prototype.destroy = function() {
	if (this.resetHandler != null) {
		this.editor.graph.removeListener("dblclick", this.resetHandler);
		this.editor.removeListener("escape", this.resetHandler);
		this.resetHandler = null
	}
	if (this.toolbar != null) {
		this.toolbar.destroy();
		this.toolbar = null
	}
};
function mxEditor(a) {
	this.actions = [];
	this.addActions();
	if (document.body != null) {
		this.cycleAttributeValues = [];
		this.popupHandler = new mxDefaultPopupMenu();
		this.undoManager = new mxUndoManager();
		this.graph = this.createGraph();
		this.toolbar = this.createToolbar();
		this.keyHandler = new mxDefaultKeyHandler(this);
		this.configure(a);
		this.graph.swimlaneIndicatorColorAttribute = this.cycleAttributeName;
		if (!mxClient.IS_LOCAL && this.urlInit != null) {
			this.createSession()
		}
		if (this.onInit != null) {
			this.onInit()
		}
		if (mxClient.IS_IE) {
			mxEvent.addListener(window, "unload", mxUtils.bind(this,
			function() {
				this.destroy()
			}))
		}
	}
}
if (mxLoadResources) {
	mxResources.add(mxClient.basePath + "/resources/editor")
}
mxEditor.prototype = new mxEventSource();
mxEditor.prototype.constructor = mxEditor;
mxEditor.prototype.askZoomResource = (mxClient.language != "none") ? "askZoom": "";
mxEditor.prototype.lastSavedResource = (mxClient.language != "none") ? "lastSaved": "";
mxEditor.prototype.currentFileResource = (mxClient.language != "none") ? "currentFile": "";
mxEditor.prototype.propertiesResource = (mxClient.language != "none") ? "properties": "";
mxEditor.prototype.tasksResource = (mxClient.language != "none") ? "tasks": "";
mxEditor.prototype.helpResource = (mxClient.language != "none") ? "help": "";
mxEditor.prototype.outlineResource = (mxClient.language != "none") ? "outline": "";
mxEditor.prototype.outline = null;
mxEditor.prototype.graph = null;
mxEditor.prototype.graphRenderHint = null;
mxEditor.prototype.toolbar = null;
mxEditor.prototype.status = null;
mxEditor.prototype.popupHandler = null;
mxEditor.prototype.undoManager = null;
mxEditor.prototype.keyHandler = null;
mxEditor.prototype.actions = null;
mxEditor.prototype.dblClickAction = "edit";
mxEditor.prototype.swimlaneRequired = false;
mxEditor.prototype.disableContextMenu = true;
mxEditor.prototype.insertFunction = null;
mxEditor.prototype.forcedInserting = false;
mxEditor.prototype.templates = null;
mxEditor.prototype.defaultEdge = null;
mxEditor.prototype.defaultEdgeStyle = null;
mxEditor.prototype.defaultGroup = null;
mxEditor.prototype.groupBorderSize = null;
mxEditor.prototype.filename = null;
mxEditor.prototype.linefeed = "&#xa;";
mxEditor.prototype.postParameterName = "xml";
mxEditor.prototype.escapePostData = true;
mxEditor.prototype.urlPost = null;
mxEditor.prototype.urlImage = null;
mxEditor.prototype.urlInit = null;
mxEditor.prototype.urlNotify = null;
mxEditor.prototype.urlPoll = null;
mxEditor.prototype.horizontalFlow = false;
mxEditor.prototype.layoutDiagram = false;
mxEditor.prototype.swimlaneSpacing = 0;
mxEditor.prototype.maintainSwimlanes = false;
mxEditor.prototype.layoutSwimlanes = false;
mxEditor.prototype.cycleAttributeValues = null;
mxEditor.prototype.cycleAttributeIndex = 0;
mxEditor.prototype.cycleAttributeName = "fillColor";
mxEditor.prototype.tasks = null;
mxEditor.prototype.tasksWindowImage = null;
mxEditor.prototype.tasksTop = 20;
mxEditor.prototype.help = null;
mxEditor.prototype.helpWindowImage = null;
mxEditor.prototype.urlHelp = null;
mxEditor.prototype.helpWidth = 300;
mxEditor.prototype.helpHeight = 260;
mxEditor.prototype.propertiesWidth = 240;
mxEditor.prototype.propertiesHeight = null;
mxEditor.prototype.movePropertiesDialog = false;
mxEditor.prototype.validating = false;
mxEditor.prototype.modified = false;
mxEditor.prototype.isModified = function() {
	return this.modified
};
mxEditor.prototype.setModified = function(a) {
	this.modified = a
};
mxEditor.prototype.addActions = function() {
	this.addAction("save",
	function(a) {
		a.save()
	});
	this.addAction("print",
	function(a) {
		var b = new mxPrintPreview(a.graph, 1);
		b.open()
	});
	this.addAction("show",
	function(a) {
		mxUtils.show(a.graph, null, 10, 10)
	});
	this.addAction("exportImage",
	function(c) {
		var b = c.getUrlImage();
		if (b == null || mxClient.IS_LOCAL) {
			c.execute("show")
		} else {
			var d = mxUtils.getViewXml(c.graph, 1);
			var a = mxUtils.getXml(d, "\n");
			mxUtils.submit(b, c.postParameterName + "=" + encodeURIComponent(a), document, "_blank")
		}
	});
	this.addAction("refresh",
	function(a) {
		a.graph.refresh()
	});
	this.addAction("cut",
	function(a) {
		if (a.graph.isEnabled()) {
			mxClipboard.cut(a.graph)
		}
	});
	this.addAction("copy",
	function(a) {
		if (a.graph.isEnabled()) {
			mxClipboard.copy(a.graph)
		}
	});
	this.addAction("paste",
	function(a) {
		if (a.graph.isEnabled()) {
			mxClipboard.paste(a.graph)
		}
	});
	this.addAction("delete",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.removeCells()
		}
	});
	this.addAction("group",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setSelectionCell(a.groupCells())
		}
	});
	this.addAction("ungroup",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setSelectionCells(a.graph.ungroupCells())
		}
	});
	this.addAction("removeFromParent",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.removeCellsFromParent()
		}
	});
	this.addAction("undo",
	function(a) {
		if (a.graph.isEnabled()) {
			a.undo()
		}
	});
	this.addAction("redo",
	function(a) {
		if (a.graph.isEnabled()) {
			a.redo()
		}
	});
	this.addAction("zoomIn",
	function(a) {
		a.graph.zoomIn()
	});
	this.addAction("zoomOut",
	function(a) {
		a.graph.zoomOut()
	});
	this.addAction("actualSize",
	function(a) {
		a.graph.zoomActual()
	});
	this.addAction("fit",
	function(a) {
		a.graph.fit()
	});
	this.addAction("showProperties",
	function(b, a) {
		b.showProperties(a)
	});
	this.addAction("selectAll",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectAll()
		}
	});
	this.addAction("selectNone",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.clearSelection()
		}
	});
	this.addAction("selectVertices",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectVertices()
		}
	});
	this.addAction("selectEdges",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectEdges()
		}
	});
	this.addAction("edit",
	function(b, a) {
		if (b.graph.isEnabled() && b.graph.isCellEditable(a)) {
			b.graph.startEditingAtCell(a)
		}
	});
	this.addAction("toBack",
	function(b, a) {
		if (b.graph.isEnabled()) {
			b.graph.orderCells(true)
		}
	});
	this.addAction("toFront",
	function(b, a) {
		if (b.graph.isEnabled()) {
			b.graph.orderCells(false)
		}
	});
	this.addAction("enterGroup",
	function(b, a) {
		b.graph.enterGroup(a)
	});
	this.addAction("exitGroup",
	function(a) {
		a.graph.exitGroup()
	});
	this.addAction("home",
	function(a) {
		a.graph.home()
	});
	this.addAction("selectPrevious",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectPreviousCell()
		}
	});
	this.addAction("selectNext",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectNextCell()
		}
	});
	this.addAction("selectParent",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectParentCell()
		}
	});
	this.addAction("selectChild",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.selectChildCell()
		}
	});
	this.addAction("collapse",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.foldCells(true)
		}
	});
	this.addAction("collapseAll",
	function(b) {
		if (b.graph.isEnabled()) {
			var a = b.graph.getChildVertices();
			b.graph.foldCells(true, false, a)
		}
	});
	this.addAction("expand",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.foldCells(false)
		}
	});
	this.addAction("expandAll",
	function(b) {
		if (b.graph.isEnabled()) {
			var a = b.graph.getChildVertices();
			b.graph.foldCells(false, false, a)
		}
	});
	this.addAction("bold",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD)
		}
	});
	this.addAction("italic",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC)
		}
	});
	this.addAction("underline",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE)
		}
	});
	this.addAction("shadow",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_SHADOW)
		}
	});
	this.addAction("alignCellsLeft",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_LEFT)
		}
	});
	this.addAction("alignCellsCenter",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_CENTER)
		}
	});
	this.addAction("alignCellsRight",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_RIGHT)
		}
	});
	this.addAction("alignCellsTop",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_TOP)
		}
	});
	this.addAction("alignCellsMiddle",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_MIDDLE)
		}
	});
	this.addAction("alignCellsBottom",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.alignCells(mxConstants.ALIGN_BOTTOM)
		}
	});
	this.addAction("alignFontLeft",
	function(a) {
		a.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT)
	});
	this.addAction("alignFontCenter",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER)
		}
	});
	this.addAction("alignFontRight",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT)
		}
	});
	this.addAction("alignFontTop",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP)
		}
	});
	this.addAction("alignFontMiddle",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE)
		}
	});
	this.addAction("alignFontBottom",
	function(a) {
		if (a.graph.isEnabled()) {
			a.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_BOTTOM)
		}
	});
	this.addAction("zoom",
	function(a) {
		var b = a.graph.getView().scale * 100;
		var c = parseFloat(mxUtils.prompt(mxResources.get(a.askZoomResource) || a.askZoomResource, b)) / 100;
		if (!isNaN(c)) {
			a.graph.getView().setScale(c)
		}
	});
	this.addAction("toggleTasks",
	function(a) {
		if (a.tasks != null) {
			a.tasks.setVisible(!a.tasks.isVisible())
		} else {
			a.showTasks()
		}
	});
	this.addAction("toggleHelp",
	function(a) {
		if (a.help != null) {
			a.help.setVisible(!a.help.isVisible())
		} else {
			a.showHelp()
		}
	});
	this.addAction("toggleOutline",
	function(a) {
		if (a.outline == null) {
			a.showOutline()
		} else {
			a.outline.setVisible(!a.outline.isVisible())
		}
	});
	this.addAction("toggleConsole",
	function(a) {
		mxLog.setVisible(!mxLog.isVisible())
	})
};
mxEditor.prototype.createSession = function() {
	var b = null;
	var a = mxUtils.bind(this,
	function(c) {
		this.fireEvent(new mxEventObject(mxEvent.SESSION, "session", c))
	});
	b = this.connect(this.urlInit, this.urlPoll, this.urlNotify, a)
};
mxEditor.prototype.configure = function(a) {
	if (a != null) {
		var b = new mxCodec(a.ownerDocument);
		b.decode(a, this);
		this.resetHistory()
	}
};
mxEditor.prototype.resetFirstTime = function() {
	document.cookie = "mxgraph=seen; expires=Fri, 27 Jul 2001 02:47:11 UTC; path=/"
};
mxEditor.prototype.resetHistory = function() {
	this.lastSnapshot = new Date().getTime();
	this.undoManager.clear();
	this.ignoredChanges = 0;
	this.setModified(false)
};
mxEditor.prototype.addAction = function(b, a) {
	this.actions[b] = a
};
mxEditor.prototype.execute = function(d, a, b) {
	var f = this.actions[d];
	if (f != null) {
		try {
			var c = arguments;
			c[0] = this;
			f.apply(this, c)
		} catch(g) {
			mxUtils.error("Cannot execute " + d + ": " + g.message, 280, true);
			throw g
		}
	} else {
		mxUtils.error("Cannot find action " + d, 280, true)
	}
};
mxEditor.prototype.addTemplate = function(a, b) {
	this.templates[a] = b
};
mxEditor.prototype.getTemplate = function(a) {
	return this.templates[a]
};
mxEditor.prototype.createGraph = function() {
	var a = new mxGraph(null, null, this.graphRenderHint);
	a.setTooltips(true);
	a.setPanning(true);
	this.installDblClickHandler(a);
	this.installUndoHandler(a);
	this.installDrillHandler(a);
	this.installChangeHandler(a);
	this.installInsertHandler(a);
	a.panningHandler.factoryMethod = mxUtils.bind(this,
	function(d, b, c) {
		return this.createPopupMenu(d, b, c)
	});
	a.connectionHandler.factoryMethod = mxUtils.bind(this,
	function(b, c) {
		return this.createEdge(b, c)
	});
	this.createSwimlaneManager(a);
	this.createLayoutManager(a);
	return a
};
mxEditor.prototype.createSwimlaneManager = function(b) {
	var a = new mxSwimlaneManager(b, false);
	a.isHorizontal = mxUtils.bind(this,
	function() {
		return this.horizontalFlow
	});
	a.isEnabled = mxUtils.bind(this,
	function() {
		return this.maintainSwimlanes
	});
	return a
};
mxEditor.prototype.createLayoutManager = function(c) {
	var b = new mxLayoutManager(c);
	var a = this;
	b.getLayout = function(d) {
		var f = null;
		var e = a.graph.getModel();
		if (e.getParent(d) != null) {
			if (a.layoutSwimlanes && c.isSwimlane(d)) {
				if (a.swimlaneLayout == null) {
					a.swimlaneLayout = a.createSwimlaneLayout()
				}
				f = a.swimlaneLayout
			} else {
				if (a.layoutDiagram && (c.isValidRoot(d) || e.getParent(e.getParent(d)) == null)) {
					if (a.diagramLayout == null) {
						a.diagramLayout = a.createDiagramLayout()
					}
					f = a.diagramLayout
				}
			}
		}
		return f
	};
	return b
};
mxEditor.prototype.setGraphContainer = function(a) {
	if (this.graph.container == null) {
		this.graph.init(a);
		this.rubberband = new mxRubberband(this.graph);
		if (this.disableContextMenu) {
			mxEvent.disableContextMenu(a)
		}
		if (mxClient.IS_IE) {
			new mxDivResizer(a)
		}
	}
};
mxEditor.prototype.installDblClickHandler = function(a) {
	a.addListener(mxEvent.DOUBLE_CLICK, mxUtils.bind(this,
	function(d, c) {
		var b = c.getProperty("cell");
		if (b != null && a.isEnabled() && this.dblClickAction != null) {
			this.execute(this.dblClickAction, b);
			c.consume()
		}
	}))
};
mxEditor.prototype.installUndoHandler = function(b) {
	var a = mxUtils.bind(this,
	function(e, d) {
		var f = d.getProperty("edit");
		this.undoManager.undoableEditHappened(f)
	});
	b.getModel().addListener(mxEvent.UNDO, a);
	b.getView().addListener(mxEvent.UNDO, a);
	var c = function(e, d) {
		var f = d.getProperty("edit").changes;
		b.setSelectionCells(b.getSelectionCellsForChanges(f))
	};
	this.undoManager.addListener(mxEvent.UNDO, c);
	this.undoManager.addListener(mxEvent.REDO, c)
};
mxEditor.prototype.installDrillHandler = function(b) {
	var a = mxUtils.bind(this,
	function(c) {
		this.fireEvent(new mxEventObject(mxEvent.ROOT))
	});
	b.getView().addListener(mxEvent.DOWN, a);
	b.getView().addListener(mxEvent.UP, a)
};
mxEditor.prototype.installChangeHandler = function(b) {
	var a = mxUtils.bind(this,
	function(e, c) {
		this.setModified(true);
		if (this.validating == true) {
			b.validateGraph()
		}
		var f = c.getProperty("edit").changes;
		for (var d = 0; d < f.length; d++) {
			var g = f[d];
			if (g instanceof mxRootChange || (g instanceof mxValueChange && g.cell == this.graph.model.root) || (g instanceof mxCellAttributeChange && g.cell == this.graph.model.root)) {
				this.fireEvent(new mxEventObject(mxEvent.ROOT));
				break
			}
		}
	});
	b.getModel().addListener(mxEvent.CHANGE, a)
};
mxEditor.prototype.installInsertHandler = function(b) {
	var a = this;
	var c = {
		mouseDown: function(d, e) {
			if (a.insertFunction != null && !e.isPopupTrigger() && (a.forcedInserting || e.getState() == null)) {
				a.graph.clearSelection();
				a.insertFunction(e.getEvent(), e.getCell());
				this.isActive = true;
				e.consume()
			}
		},
		mouseMove: function(d, e) {
			if (this.isActive) {
				e.consume()
			}
		},
		mouseUp: function(d, e) {
			if (this.isActive) {
				this.isActive = false;
				e.consume()
			}
		}
	};
	b.addMouseListener(c)
};
mxEditor.prototype.createDiagramLayout = function() {
	var a = this.graph.gridSize;
	var b = new mxStackLayout(this.graph, !this.horizontalFlow, this.swimlaneSpacing, 2 * a, 2 * a);
	b.isVertexIgnored = function(c) {
		return ! b.graph.isSwimlane(c)
	};
	return b
};
mxEditor.prototype.createSwimlaneLayout = function() {
	return new mxCompactTreeLayout(this.graph, this.horizontalFlow)
};
mxEditor.prototype.createToolbar = function() {
	return new mxDefaultToolbar(null, this)
};
mxEditor.prototype.setToolbarContainer = function(a) {
	this.toolbar.init(a);
	if (mxClient.IS_IE) {
		new mxDivResizer(a)
	}
};
mxEditor.prototype.setStatusContainer = function(a) {
	if (this.status == null) {
		this.status = a;
		this.addListener(mxEvent.SAVE, mxUtils.bind(this,
		function() {
			var b = new Date().toLocaleString();
			this.setStatus((mxResources.get(this.lastSavedResource) || this.lastSavedResource) + ": " + b)
		}));
		this.addListener(mxEvent.OPEN, mxUtils.bind(this,
		function() {
			this.setStatus((mxResources.get(this.currentFileResource) || this.currentFileResource) + ": " + this.filename)
		}));
		if (mxClient.IS_IE) {
			new mxDivResizer(a)
		}
	}
};
mxEditor.prototype.setStatus = function(a) {
	if (this.status != null && a != null) {
		this.status.innerHTML = a
	}
};
mxEditor.prototype.setTitleContainer = function(a) {
	this.addListener(mxEvent.ROOT, mxUtils.bind(this,
	function(b) {
		a.innerHTML = this.getTitle()
	}));
	if (mxClient.IS_IE) {
		new mxDivResizer(a)
	}
};
mxEditor.prototype.treeLayout = function(a, b) {
	if (a != null) {
		var c = new mxCompactTreeLayout(this.graph, b);
		c.execute(a)
	}
};
mxEditor.prototype.getTitle = function() {
	var d = "";
	var c = this.graph;
	var a = c.getCurrentRoot();
	while (a != null && c.getModel().getParent(c.getModel().getParent(a)) != null) {
		if (c.isValidRoot(a)) {
			d = " > " + c.convertValueToString(a) + d
		}
		a = c.getModel().getParent(a)
	}
	var b = this.getRootTitle();
	return b + d
};
mxEditor.prototype.getRootTitle = function() {
	var a = this.graph.getModel().getRoot();
	return this.graph.convertValueToString(a)
};
mxEditor.prototype.undo = function() {
	this.undoManager.undo()
};
mxEditor.prototype.redo = function() {
	this.undoManager.redo()
};
mxEditor.prototype.groupCells = function() {
	var a = (this.groupBorderSize != null) ? this.groupBorderSize: this.graph.gridSize;
	return this.graph.groupCells(this.createGroup(), a)
};
mxEditor.prototype.createGroup = function() {
	var a = this.graph.getModel();
	return a.cloneCell(this.defaultGroup)
};
mxEditor.prototype.open = function(a) {
	if (a != null) {
		var b = mxUtils.load(a).getXml();
		this.readGraphModel(b.documentElement);
		this.filename = a;
		this.fireEvent(new mxEventObject(mxEvent.OPEN, "filename", a))
	}
};
mxEditor.prototype.readGraphModel = function(a) {
	var b = new mxCodec(a.ownerDocument);
	b.decode(a, this.graph.getModel());
	this.resetHistory()
};
mxEditor.prototype.save = function(b, a) {
	b = b || this.getUrlPost();
	if (b != null && b.length > 0) {
		var c = this.writeGraphModel(a);
		this.postDiagram(b, c);
		this.setModified(false)
	}
	this.fireEvent(new mxEventObject(mxEvent.SAVE, "url", b))
};
mxEditor.prototype.postDiagram = function(a, b) {
	if (this.escapePostData) {
		b = encodeURIComponent(b)
	}
	mxUtils.post(a, this.postParameterName + "=" + b, mxUtils.bind(this,
	function(c) {
		this.fireEvent(new mxEventObject(mxEvent.POST, "request", c, "url", a, "data", b))
	}))
};
mxEditor.prototype.writeGraphModel = function(b) {
	b = (b != null) ? b: this.linefeed;
	var a = new mxCodec();
	var c = a.encode(this.graph.getModel());
	return mxUtils.getXml(c, b)
};
mxEditor.prototype.getUrlPost = function() {
	return this.urlPost
};
mxEditor.prototype.getUrlImage = function() {
	return this.urlImage
};
mxEditor.prototype.connect = function(c, b, e, a) {
	var d = null;
	if (!mxClient.IS_LOCAL) {
		var d = new mxSession(this.graph.getModel(), c, b, e);
		d.addListener(mxEvent.RECEIVE, mxUtils.bind(this,
		function(g, f) {
			var h = f.getProperty("node");
			if (h.getAttribute("namespace") != null) {
				this.resetHistory()
			}
		}));
		d.addListener(mxEvent.DISCONNECT, a);
		d.addListener(mxEvent.CONNECT, a);
		d.addListener(mxEvent.NOTIFY, a);
		d.addListener(mxEvent.GET, a);
		d.start()
	}
	return d
};
mxEditor.prototype.swapStyles = function(c, a) {
	var b = this.graph.getStylesheet().styles[a];
	this.graph.getView().getStylesheet().putCellStyle(a, this.graph.getStylesheet().styles[c]);
	this.graph.getStylesheet().putCellStyle(c, b);
	this.graph.refresh()
};
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
		var a = e.x + 10;
		var f = e.y;
		if (this.properties != null && !this.movePropertiesDialog) {
			a = this.properties.getX();
			f = this.properties.getY()
		} else {
			var d = this.graph.getCellBounds(b);
			if (d != null) {
				a += d.x + Math.min(200, d.width);
				f += d.y
			}
		}
		this.hideProperties();
		var c = this.createProperties(b);
		if (c != null) {
			this.properties = new mxWindow(mxResources.get(this.propertiesResource) || this.propertiesResource, c, a, f, this.propertiesWidth, this.propertiesHeight, false);
			this.properties.setVisible(true)
		}
	}
};
mxEditor.prototype.isPropertiesVisible = function() {
	return this.properties != null
};
mxEditor.prototype.createProperties = function(b) {
	var g = this.graph.getModel();
	var n = g.getValue(b);
	if (mxUtils.isNode(n)) {
		var c = new mxForm("properties");
		var k = c.addText("ID", b.getId());
		k.setAttribute("readonly", "true");
		var s = null;
		var h = null;
		var d = null;
		var f = null;
		var e = null;
		if (g.isVertex(b)) {
			s = g.getGeometry(b);
			if (s != null) {
				h = c.addText("top", s.y);
				d = c.addText("left", s.x);
				f = c.addText("width", s.width);
				e = c.addText("height", s.height)
			}
		}
		var q = g.getStyle(b);
		var p = c.addText("Style", q || "");
		var l = n.attributes;
		var a = [];
		for (var o = 0; o < l.length; o++) {
			var t = l[o].nodeValue;
			a[o] = c.addTextarea(l[o].nodeName, t, (l[o].nodeName == "label") ? 4 : 2)
		}
		var m = mxUtils.bind(this,
		function() {
			this.hideProperties();
			g.beginUpdate();
			try {
				if (s != null) {
					s = s.clone();
					s.x = parseFloat(d.value);
					s.y = parseFloat(h.value);
					s.width = parseFloat(f.value);
					s.height = parseFloat(e.value);
					g.setGeometry(b, s)
				}
				if (p.value.length > 0) {
					g.setStyle(b, p.value)
				} else {
					g.setStyle(b, null)
				}
				for (var u = 0; u < l.length; u++) {
					var v = new mxCellAttributeChange(b, l[u].nodeName, a[u].value);
					g.execute(v)
				}
				if (this.graph.isAutoSizeCell(b)) {
					this.graph.updateCellSize(b)
				}
			} finally {
				g.endUpdate()
			}
		});
		var r = mxUtils.bind(this,
		function() {
			this.hideProperties()
		});
		c.addButtons(m, r);
		return c.table
	}
	return null
};
mxEditor.prototype.hideProperties = function() {
	if (this.properties != null) {
		this.properties.destroy();
		this.properties = null
	}
};
mxEditor.prototype.showTasks = function() {
	if (this.tasks == null) {
		var d = document.createElement("div");
		d.style.padding = "4px";
		d.style.paddingLeft = "20px";
		var b = document.body.clientWidth;
		var c = new mxWindow(mxResources.get(this.tasksResource) || this.tasksResource, d, b - 220, this.tasksTop, 200);
		c.setClosable(true);
		c.destroyOnClose = false;
		var a = mxUtils.bind(this,
		function(e) {
			mxEvent.release(d);
			d.innerHTML = "";
			this.createTasks(d)
		});
		this.graph.getModel().addListener(mxEvent.CHANGE, a);
		this.graph.getSelectionModel().addListener(mxEvent.CHANGE, a);
		this.graph.addListener(mxEvent.ROOT, a);
		if (this.tasksWindowImage != null) {
			c.setImage(this.tasksWindowImage)
		}
		this.tasks = c;
		this.createTasks(d)
	}
	this.tasks.setVisible(true)
};
mxEditor.prototype.refreshTasks = function(a) {
	if (this.tasks != null) {
		var a = this.tasks.content;
		mxEvent.release(a);
		a.innerHTML = "";
		this.createTasks(a)
	}
};
mxEditor.prototype.createTasks = function(a) {};
mxEditor.prototype.showHelp = function(f) {
	if (this.help == null) {
		var e = document.createElement("iframe");
		e.setAttribute("src", mxResources.get("urlHelp") || this.urlHelp);
		e.setAttribute("height", "100%");
		e.setAttribute("width", "100%");
		e.setAttribute("frameborder", "0");
		e.style.backgroundColor = "white";
		var a = document.body.clientWidth;
		var c = (document.body.clientHeight || document.documentElement.clientHeight);
		var d = new mxWindow(mxResources.get(this.helpResource) || this.helpResource, e, (a - this.helpWidth) / 2, (c - this.helpHeight) / 3, this.helpWidth, this.helpHeight);
		d.setMaximizable(true);
		d.setClosable(true);
		d.destroyOnClose = false;
		d.setResizable(true);
		if (this.helpWindowImage != null) {
			d.setImage(this.helpWindowImage)
		}
		if (!mxClient.IS_IE) {
			var b = function(g) {
				var i = d.div.offsetHeight;
				e.setAttribute("height", (i - 26) + "px")
			};
			d.addListener(mxEvent.RESIZE_END, b);
			d.addListener(mxEvent.MAXIMIZE, b);
			d.addListener(mxEvent.NORMALIZE, b);
			d.addListener(mxEvent.SHOW, b)
		}
		this.help = d
	}
	this.help.setVisible(true)
};
mxEditor.prototype.showOutline = function() {
	var a = this.outline == null;
	if (a) {
		var d = document.createElement("div");
		d.style.overflow = "hidden";
		d.style.width = "100%";
		d.style.height = "100%";
		d.style.background = "white";
		d.style.cursor = "move";
		var c = new mxWindow(mxResources.get(this.outlineResource) || this.outlineResource, d, 600, 480, 200, 200, false);
		var b = new mxOutline(this.graph, d);
		c.setClosable(true);
		c.setResizable(true);
		c.destroyOnClose = false;
		c.addListener(mxEvent.RESIZE_END,
		function() {
			b.update()
		});
		this.outline = c;
		this.outline.outline = b
	}
	this.outline.setVisible(true);
	this.outline.outline.update(true)
};
mxEditor.prototype.setMode = function(a) {
	if (a == "select") {
		this.graph.panningHandler.useLeftButtonForPanning = false;
		this.graph.setConnectable(false)
	} else {
		if (a == "connect") {
			this.graph.panningHandler.useLeftButtonForPanning = false;
			this.graph.setConnectable(true)
		} else {
			if (a == "pan") {
				this.graph.panningHandler.useLeftButtonForPanning = true;
				this.graph.setConnectable(false)
			}
		}
	}
};
mxEditor.prototype.createPopupMenu = function(c, a, b) {
	this.popupHandler.createMenu(this, c, a, b)
};
mxEditor.prototype.createEdge = function(c, g) {
	var f = null;
	if (this.defaultEdge != null) {
		var a = this.graph.getModel();
		f = a.cloneCell(this.defaultEdge)
	} else {
		f = new mxCell("");
		f.setEdge(true);
		var d = new mxGeometry();
		d.relative = true;
		f.setGeometry(d)
	}
	var b = this.getEdgeStyle();
	if (b != null) {
		f.setStyle(b)
	}
	return f
};
mxEditor.prototype.getEdgeStyle = function() {
	return this.defaultEdgeStyle
};
mxEditor.prototype.consumeCycleAttribute = function(a) {
	return (this.cycleAttributeValues != null && this.cycleAttributeValues.length > 0 && this.graph.isSwimlane(a)) ? this.cycleAttributeValues[this.cycleAttributeIndex++%this.cycleAttributeValues.length] : null
};
mxEditor.prototype.cycleAttribute = function(a) {
	if (this.cycleAttributeName != null) {
		var b = this.consumeCycleAttribute(a);
		if (b != null) {
			a.setStyle(a.getStyle() + ";" + this.cycleAttributeName + "=" + b)
		}
	}
};
mxEditor.prototype.addVertex = function(l, h, k, i) {
	var g = this.graph.getModel();
	while (l != null && !this.graph.isValidDropTarget(l)) {
		l = g.getParent(l)
	}
	l = (l != null) ? l: this.graph.getSwimlaneAt(k, i);
	var d = this.graph.getView().scale;
	var f = g.getGeometry(h);
	var c = g.getGeometry(l);
	if (this.graph.isSwimlane(h) && !this.graph.swimlaneNesting) {
		l = null
	} else {
		if (l == null && this.swimlaneRequired) {
			return null
		} else {
			if (l != null && c != null) {
				var a = this.graph.getView().getState(l);
				if (a != null) {
					k -= a.origin.x * d;
					i -= a.origin.y * d;
					if (this.graph.isConstrainedMoving) {
						var b = f.width;
						var m = f.height;
						var e = a.x + a.width;
						if (k + b > e) {
							k -= k + b - e
						}
						e = a.y + a.height;
						if (i + m > e) {
							i -= i + m - e
						}
					}
				} else {
					if (c != null) {
						k -= c.x * d;
						i -= c.y * d
					}
				}
			}
		}
	}
	f = f.clone();
	f.x = this.graph.snap(k / d - this.graph.getView().translate.x - this.graph.gridSize / 2);
	f.y = this.graph.snap(i / d - this.graph.getView().translate.y - this.graph.gridSize / 2);
	h.setGeometry(f);
	if (l == null) {
		l = this.graph.getDefaultParent()
	}
	this.cycleAttribute(h);
	this.fireEvent(new mxEventObject(mxEvent.BEFORE_ADD_VERTEX, "vertex", h, "parent", l));
	g.beginUpdate();
	try {
		h = this.graph.addCell(h, l);
		if (h != null) {
			this.graph.constrainChild(h);
			this.fireEvent(new mxEventObject(mxEvent.ADD_VERTEX, "vertex", h))
		}
	} finally {
		g.endUpdate()
	}
	if (h != null) {
		this.graph.setSelectionCell(h);
		this.graph.scrollCellToVisible(h);
		this.fireEvent(new mxEventObject(mxEvent.AFTER_ADD_VERTEX, "vertex", h))
	}
	return h
};
mxEditor.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		if (this.tasks != null) {
			this.tasks.destroy()
		}
		if (this.outline != null) {
			this.outline.destroy()
		}
		if (this.properties != null) {
			this.properties.destroy()
		}
		if (this.keyHandler != null) {
			this.keyHandler.destroy()
		}
		if (this.rubberband != null) {
			this.rubberband.destroy()
		}
		if (this.toolbar != null) {
			this.toolbar.destroy()
		}
		if (this.graph != null) {
			this.graph.destroy()
		}
		this.status = null;
		this.templates = null
	}
};
var mxCodecRegistry = {
	codecs: [],
	aliases: [],
	register: function(b) {
		if (b != null) {
			var a = b.getName();
			mxCodecRegistry.codecs[a] = b;
			var c = mxUtils.getFunctionName(b.template.constructor);
			if (c != a) {
				mxCodecRegistry.addAlias(c, a)
			}
		}
		return b
	},
	addAlias: function(b, a) {
		mxCodecRegistry.aliases[b] = a
	},
	getCodec: function(c) {
		var d = null;
		if (c != null) {
			var a = mxUtils.getFunctionName(c);
			var b = mxCodecRegistry.aliases[a];
			if (b != null) {
				a = b
			}
			d = mxCodecRegistry.codecs[a];
			if (d == null) {
				try {
					d = new mxObjectCodec(new c());
					mxCodecRegistry.register(d)
				} catch(f) {}
			}
		}
		return d
	}
};
function mxCodec(a) {
	this.document = a || mxUtils.createXmlDocument();
	this.objects = []
}
mxCodec.prototype.document = null;
mxCodec.prototype.objects = null;
mxCodec.prototype.encodeDefaults = false;
mxCodec.prototype.putObject = function(b, a) {
	this.objects[b] = a;
	return a
};
mxCodec.prototype.getObject = function(c) {
	var b = null;
	if (c != null) {
		b = this.objects[c];
		if (b == null) {
			b = this.lookup(c);
			if (b == null) {
				var a = this.getElementById(c);
				if (a != null) {
					b = this.decode(a)
				}
			}
		}
	}
	return b
};
mxCodec.prototype.lookup = function(a) {
	return null
};
mxCodec.prototype.getElementById = function(b, a) {
	a = (a != null) ? a: "id";
	return mxUtils.findNodeByAttribute(this.document.documentElement, a, b)
};
mxCodec.prototype.getId = function(a) {
	var b = null;
	if (a != null) {
		b = this.reference(a);
		if (b == null && a instanceof mxCell) {
			b = a.getId();
			if (b == null) {
				b = mxCellPath.create(a);
				if (b.length == 0) {
					b = "root"
				}
			}
		}
	}
	return b
};
mxCodec.prototype.reference = function(a) {
	return null
};
mxCodec.prototype.encode = function(c) {
	var b = null;
	if (c != null && c.constructor != null) {
		var a = mxCodecRegistry.getCodec(c.constructor);
		if (a != null) {
			b = a.encode(this, c)
		} else {
			if (mxUtils.isNode(c)) {
				b = (mxClient.IS_IE) ? c.cloneNode(true) : this.document.importNode(c, true)
			} else {
				mxLog.warn("mxCodec.encode: No codec for " + mxUtils.getFunctionName(c.constructor))
			}
		}
	}
	return b
};
mxCodec.prototype.decode = function(node, into) {
	var obj = null;
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var ctor = null;
		try {
			ctor = eval(node.nodeName)
		} catch(err) {}
		try {
			var dec = mxCodecRegistry.getCodec(ctor);
			if (dec != null) {
				obj = dec.decode(this, node, into)
			} else {
				obj = node.cloneNode(true);
				obj.removeAttribute("as")
			}
		} catch(err) {
			mxLog.debug("Cannot decode " + node.nodeName + ": " + err.message)
		}
	}
	return obj
};
mxCodec.prototype.encodeCell = function(b, e, a) {
	e.appendChild(this.encode(b));
	if (a == null || a) {
		var c = b.getChildCount();
		for (var d = 0; d < c; d++) {
			this.encodeCell(b.getChildAt(d), e)
		}
	}
};
mxCodec.prototype.isCellCodec = function(a) {
	if (a != null && typeof(a.isCellCodec) == "function") {
		return a.isCellCodec()
	}
	return false
};
mxCodec.prototype.decodeCell = function(c, b) {
	b = (b != null) ? b: true;
	var a = null;
	if (c != null && c.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var e = mxCodecRegistry.getCodec(c.nodeName);
		if (!this.isCellCodec(e)) {
			var d = c.firstChild;
			while (d != null && !this.isCellCodec(e)) {
				e = mxCodecRegistry.getCodec(d.nodeName);
				d = d.nextSibling
			}
		}
		if (!this.isCellCodec(e)) {
			e = mxCodecRegistry.getCodec(mxCell)
		}
		a = e.decode(this, c);
		if (b) {
			this.insertIntoGraph(a)
		}
	}
	return a
};
mxCodec.prototype.insertIntoGraph = function(a) {
	var b = a.parent;
	var c = a.getTerminal(true);
	var d = a.getTerminal(false);
	a.setTerminal(null, false);
	a.setTerminal(null, true);
	a.parent = null;
	if (b != null) {
		b.insert(a)
	}
	if (c != null) {
		c.insertEdge(a, true)
	}
	if (d != null) {
		d.insertEdge(a, false)
	}
};
mxCodec.prototype.setAttribute = function(b, a, c) {
	if (a != null && c != null) {
		b.setAttribute(a, c)
	}
};
function mxObjectCodec(e, a, d, b) {
	this.template = e;
	this.exclude = (a != null) ? a: [];
	this.idrefs = (d != null) ? d: [];
	this.mapping = (b != null) ? b: [];
	this.reverse = new Object();
	for (var c in this.mapping) {
		this.reverse[this.mapping[c]] = c
	}
}
mxObjectCodec.prototype.template = null;
mxObjectCodec.prototype.exclude = null;
mxObjectCodec.prototype.idrefs = null;
mxObjectCodec.prototype.mapping = null;
mxObjectCodec.prototype.reverse = null;
mxObjectCodec.prototype.getName = function() {
	return mxUtils.getFunctionName(this.template.constructor)
};
mxObjectCodec.prototype.cloneTemplate = function() {
	return new this.template.constructor()
};
mxObjectCodec.prototype.getFieldName = function(b) {
	if (b != null) {
		var a = this.reverse[b];
		if (a != null) {
			b = a
		}
	}
	return b
};
mxObjectCodec.prototype.getAttributeName = function(b) {
	if (b != null) {
		var a = this.mapping[b];
		if (a != null) {
			b = a
		}
	}
	return b
};
mxObjectCodec.prototype.isExcluded = function(d, a, c, b) {
	return a == mxObjectIdentity.FIELD_NAME || mxUtils.indexOf(this.exclude, a) >= 0
};
mxObjectCodec.prototype.isReference = function(d, a, c, b) {
	return mxUtils.indexOf(this.idrefs, a) >= 0
};
mxObjectCodec.prototype.encode = function(a, c) {
	var b = a.document.createElement(this.getName());
	c = this.beforeEncode(a, c, b);
	this.encodeObject(a, c, b);
	return this.afterEncode(a, c, b)
};
mxObjectCodec.prototype.encodeObject = function(a, f, d) {
	a.setAttribute(d, "id", a.getId(f));
	for (var c in f) {
		var b = c;
		var e = f[b];
		if (e != null && !this.isExcluded(f, b, e, true)) {
			if (mxUtils.isNumeric(b)) {
				b = null
			}
			this.encodeValue(a, f, b, e, d)
		}
	}
};
mxObjectCodec.prototype.encodeValue = function(b, g, c, f, e) {
	if (f != null) {
		if (this.isReference(g, c, f, true)) {
			var d = b.getId(f);
			if (d == null) {
				mxLog.warn("mxObjectCodec.encode: No ID for " + this.getName() + "." + c + "=" + f);
				return
			}
			f = d
		}
		var a = this.template[c];
		if (c == null || b.encodeDefaults || a != f) {
			c = this.getAttributeName(c);
			this.writeAttribute(b, g, c, f, e)
		}
	}
};
mxObjectCodec.prototype.writeAttribute = function(b, e, a, d, c) {
	if (typeof(d) != "object") {
		this.writePrimitiveAttribute(b, e, a, d, c)
	} else {
		this.writeComplexAttribute(b, e, a, d, c)
	}
};
mxObjectCodec.prototype.writePrimitiveAttribute = function(b, e, a, d, c) {
	d = this.convertValueToXml(d);
	if (a == null) {
		var f = b.document.createElement("add");
		if (typeof(d) == "function") {
			f.appendChild(b.document.createTextNode(d))
		} else {
			b.setAttribute(f, "value", d)
		}
		c.appendChild(f)
	} else {
		if (typeof(d) != "function") {
			b.setAttribute(c, a, d)
		}
	}
};
mxObjectCodec.prototype.writeComplexAttribute = function(b, e, a, d, c) {
	var f = b.encode(d);
	if (f != null) {
		if (a != null) {
			f.setAttribute("as", a)
		}
		c.appendChild(f)
	} else {
		mxLog.warn("mxObjectCodec.encode: No node for " + this.getName() + "." + a + ": " + d)
	}
};
mxObjectCodec.prototype.convertValueToXml = function(a) {
	if (typeof(a.length) == "undefined" && (a == true || a == false)) {
		a = (a == true) ? "1": "0"
	}
	return a
};
mxObjectCodec.prototype.convertValueFromXml = function(a) {
	if (mxUtils.isNumeric(a)) {
		a = parseFloat(a)
	}
	return a
};
mxObjectCodec.prototype.beforeEncode = function(a, c, b) {
	return c
};
mxObjectCodec.prototype.afterEncode = function(a, c, b) {
	return b
};
mxObjectCodec.prototype.decode = function(e, b, a) {
	var d = b.getAttribute("id");
	var c = e.objects[d];
	if (c == null) {
		c = a || this.cloneTemplate();
		if (d != null) {
			e.putObject(d, c)
		}
	}
	b = this.beforeDecode(e, b, c);
	this.decodeNode(e, b, c);
	return this.afterDecode(e, b, c)
};
mxObjectCodec.prototype.decodeNode = function(c, a, b) {
	if (a != null) {
		this.decodeAttributes(c, a, b);
		this.decodeChildren(c, a, b)
	}
};
mxObjectCodec.prototype.decodeAttributes = function(e, c, d) {
	var a = c.attributes;
	if (a != null) {
		for (var b = 0; b < a.length; b++) {
			this.decodeAttribute(e, a[b], d)
		}
	}
};
mxObjectCodec.prototype.decodeAttribute = function(g, a, f) {
	var c = a.nodeName;
	if (c != "as" && c != "id") {
		var e = this.convertValueFromXml(a.nodeValue);
		var b = this.getFieldName(c);
		if (this.isReference(f, b, e, false)) {
			var d = g.getObject(e);
			if (d == null) {
				mxLog.warn("mxObjectCodec.decode: No object for " + this.getName() + "." + c + "=" + e);
				return
			}
			e = d
		}
		if (!this.isExcluded(f, c, e, false)) {
			f[c] = e
		}
	}
};
mxObjectCodec.prototype.decodeChildren = function(e, b, c) {
	var d = b.firstChild;
	while (d != null) {
		var a = d.nextSibling;
		if (d.nodeType == mxConstants.NODETYPE_ELEMENT && !this.processInclude(e, d, c)) {
			this.decodeChild(e, d, c)
		}
		d = a
	}
};
mxObjectCodec.prototype.decodeChild = function(dec, child, obj) {
	var fieldname = this.getFieldName(child.getAttribute("as"));
	if (fieldname == null || !this.isExcluded(obj, fieldname, child, false)) {
		var template = this.getFieldTemplate(obj, fieldname, child);
		var value = null;
		if (child.nodeName == "add") {
			value = child.getAttribute("value");
			if (value == null) {
				value = mxUtils.eval(mxUtils.getTextContent(child))
			}
		} else {
			value = dec.decode(child, template)
		}
		this.addObjectValue(obj, fieldname, value, template)
	}
};
mxObjectCodec.prototype.getFieldTemplate = function(c, a, d) {
	var b = c[a];
	if (b instanceof Array && b.length > 0) {
		b = null
	}
	return b
};
mxObjectCodec.prototype.addObjectValue = function(d, a, c, b) {
	if (c != null && c != b) {
		if (a != null && a.length > 0) {
			d[a] = c
		} else {
			d.push(c)
		}
	}
};
mxObjectCodec.prototype.processInclude = function(g, d, c) {
	if (d.nodeName == "include") {
		var b = d.getAttribute("name");
		if (b != null) {
			try {
				var a = mxUtils.load(b).getDocumentElement();
				if (a != null) {
					g.decode(a, c)
				}
			} catch(f) {}
		}
		return true
	}
	return false
};
mxObjectCodec.prototype.beforeDecode = function(c, a, b) {
	return a
};
mxObjectCodec.prototype.afterDecode = function(c, a, b) {
	return b
};
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxCell(), ["children", "edges", "overlays", "mxTransient"], ["parent", "source", "target"]);
	a.isCellCodec = function() {
		return true
	};
	a.isExcluded = function(e, b, d, c) {
		return mxObjectCodec.prototype.isExcluded.apply(this, arguments) || (c && b == "value" && d.nodeType == mxConstants.NODETYPE_ELEMENT)
	};
	a.afterEncode = function(b, e, d) {
		if (e.value != null && e.value.nodeType == mxConstants.NODETYPE_ELEMENT) {
			var c = d;
			d = (mxClient.IS_IE) ? e.value.cloneNode(true) : b.document.importNode(e.value, true);
			d.appendChild(c);
			var f = c.getAttribute("id");
			d.setAttribute("id", f);
			c.removeAttribute("id")
		}
		return d
	};
	a.beforeDecode = function(f, e, l) {
		var p = e;
		var g = this.getName();
		if (e.nodeName != g) {
			var m = e.getElementsByTagName(g)[0];
			if (m != null && m.parentNode == e) {
				mxUtils.removeWhitespace(m, true);
				mxUtils.removeWhitespace(m, false);
				m.parentNode.removeChild(m);
				p = m
			} else {
				p = null
			}
			l.value = e.cloneNode(true);
			var b = l.value.getAttribute("id");
			if (b != null) {
				l.setId(b);
				l.value.removeAttribute("id")
			}
		} else {
			l.setId(e.getAttribute("id"))
		}
		if (p != null) {
			for (var n = 0; n < this.idrefs.length; n++) {
				var o = this.idrefs[n];
				var c = p.getAttribute(o);
				if (c != null) {
					p.removeAttribute(o);
					var h = f.objects[c] || f.lookup(c);
					if (h == null) {
						var k = f.getElementById(c);
						if (k != null) {
							var d = mxCodecRegistry.codecs[k.nodeName] || this;
							h = d.decode(f, k)
						}
					}
					l[o] = h
				}
			}
		}
		return p
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxGraphModel());
	a.encodeObject = function(c, e, d) {
		var b = c.document.createElement("root");
		c.encodeCell(e.getRoot(), b);
		d.appendChild(b)
	};
	a.decodeChild = function(d, c, b) {
		if (c.nodeName == "root") {
			this.decodeRoot(d, c, b)
		} else {
			mxObjectCodec.prototype.decodeChild.apply(this, arguments)
		}
	};
	a.decodeRoot = function(g, c, d) {
		var f = null;
		var e = c.firstChild;
		while (e != null) {
			var b = g.decodeCell(e);
			if (b != null && b.getParent() == null) {
				f = b
			}
			e = e.nextSibling
		}
		if (f != null) {
			d.setRoot(f)
		}
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxRootChange(), ["model", "previous", "root"]);
	a.afterEncode = function(b, d, c) {
		b.encodeCell(d.root, c);
		return c
	};
	a.beforeDecode = function(f, d, e) {
		if (d.firstChild != null && d.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT) {
			d = d.cloneNode(true);
			var b = d.firstChild;
			e.root = f.decodeCell(b, false);
			var c = b.nextSibling;
			b.parentNode.removeChild(b);
			b = c;
			while (b != null) {
				c = b.nextSibling;
				f.decodeCell(b);
				b.parentNode.removeChild(b);
				b = c
			}
		}
		return d
	};
	a.afterDecode = function(d, b, c) {
		c.previous = c.root;
		return c
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxChildChange(), ["model", "child", "previousIndex"], ["parent", "previous"]);
	a.isReference = function(e, b, d, c) {
		if (b == "child" && (e.previous != null || !c)) {
			return true
		}
		return mxUtils.indexOf(this.idrefs, b) >= 0
	};
	a.afterEncode = function(b, d, c) {
		if (this.isReference(d, "child", d.child, true)) {
			c.setAttribute("child", b.getId(d.child))
		} else {
			b.encodeCell(d.child, c)
		}
		return c
	};
	a.beforeDecode = function(h, d, f) {
		if (d.firstChild != null && d.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT) {
			d = d.cloneNode(true);
			var b = d.firstChild;
			f.child = h.decodeCell(b, false);
			var c = b.nextSibling;
			b.parentNode.removeChild(b);
			b = c;
			while (b != null) {
				c = b.nextSibling;
				if (b.nodeType == mxConstants.NODETYPE_ELEMENT) {
					var g = b.getAttribute("id");
					if (h.lookup(g) == null) {
						h.decodeCell(b)
					}
				}
				b.parentNode.removeChild(b);
				b = c
			}
		} else {
			var e = d.getAttribute("child");
			f.child = h.getObject(e)
		}
		return d
	};
	a.afterDecode = function(d, b, c) {
		c.child.parent = c.previous;
		c.previous = c.parent;
		c.previousIndex = c.index;
		return c
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxTerminalChange(), ["model", "previous"], ["cell", "terminal"]);
	a.afterDecode = function(d, b, c) {
		c.previous = c.terminal;
		return c
	};
	return a
} ());
var mxGenericChangeCodec = function(c, a) {
	var b = new mxObjectCodec(c, ["model", "previous"], ["cell"]);
	b.afterDecode = function(f, d, e) {
		if (mxUtils.isNode(e.cell)) {
			e.cell = f.decodeCell(e.cell, false)
		}
		e.previous = e[a];
		return e
	};
	return b
};
mxCodecRegistry.register(mxGenericChangeCodec(new mxValueChange(), "value"));
mxCodecRegistry.register(mxGenericChangeCodec(new mxStyleChange(), "style"));
mxCodecRegistry.register(mxGenericChangeCodec(new mxGeometryChange(), "geometry"));
mxCodecRegistry.register(mxGenericChangeCodec(new mxCollapseChange(), "collapsed"));
mxCodecRegistry.register(mxGenericChangeCodec(new mxVisibleChange(), "visible"));
mxCodecRegistry.register(mxGenericChangeCodec(new mxCellAttributeChange(), "value"));
mxCodecRegistry.register(function() {
	return new mxObjectCodec(new mxGraph(), ["graphListeners", "eventListeners", "view", "container", "cellRenderer", "editor", "selection"])
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxGraphView());
	a.encode = function(c, b) {
		return this.encodeCell(c, b, b.graph.getModel().getRoot())
	};
	a.encodeCell = function(e, l, b) {
		var d = l.graph.getModel();
		var f = l.getState(b);
		var k = d.getParent(b);
		if (k == null || f != null) {
			var r = d.getChildCount(b);
			var t = l.graph.getCellGeometry(b);
			var u = null;
			if (k == d.getRoot()) {
				u = "layer"
			} else {
				if (k == null) {
					u = "graph"
				} else {
					if (d.isEdge(b)) {
						u = "edge"
					} else {
						if (r > 0 && t != null) {
							u = "group"
						} else {
							if (d.isVertex(b)) {
								u = "vertex"
							}
						}
					}
				}
			}
			if (u != null) {
				var p = e.document.createElement(u);
				var o = l.graph.getLabel(b);
				if (o != null) {
					p.setAttribute("label", l.graph.getLabel(b));
					if (l.graph.isHtmlLabel(b)) {
						p.setAttribute("html", true)
					}
				}
				if (k == null) {
					var h = l.getGraphBounds();
					if (h != null) {
						p.setAttribute("x", Math.round(h.x));
						p.setAttribute("y", Math.round(h.y));
						p.setAttribute("width", Math.round(h.width));
						p.setAttribute("height", Math.round(h.height))
					}
					p.setAttribute("scale", l.scale)
				} else {
					if (f != null && t != null) {
						for (var q in f.style) {
							var n = f.style[q];
							if (typeof(n) == "function" && typeof(n) == "object") {
								n = mxStyleRegistry.getName(n)
							}
							if (n != null && typeof(n) != "function" && typeof(n) != "object") {
								p.setAttribute(q, n)
							}
						}
						var m = f.absolutePoints;
						if (m != null && m.length > 0) {
							var s = Math.round(m[0].x) + "," + Math.round(m[0].y);
							for (var q = 1; q < m.length; q++) {
								s += " " + Math.round(m[q].x) + "," + Math.round(m[q].y)
							}
							p.setAttribute("points", s)
						} else {
							p.setAttribute("x", Math.round(f.x));
							p.setAttribute("y", Math.round(f.y));
							p.setAttribute("width", Math.round(f.width));
							p.setAttribute("height", Math.round(f.height))
						}
						var g = f.absoluteOffset;
						if (g != null) {
							if (g.x != 0) {
								p.setAttribute("dx", Math.round(g.x))
							}
							if (g.y != 0) {
								p.setAttribute("dy", Math.round(g.y))
							}
						}
					}
				}
				for (var q = 0; q < r; q++) {
					var c = this.encodeCell(e, l, d.getChildAt(b, q));
					if (c != null) {
						p.appendChild(c)
					}
				}
			}
		}
		return p
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxStylesheet());
	codec.encode = function(enc, obj) {
		var node = enc.document.createElement(this.getName());
		for (var i in obj.styles) {
			var style = obj.styles[i];
			var styleNode = enc.document.createElement("add");
			if (i != null) {
				styleNode.setAttribute("as", i);
				for (var j in style) {
					var value = this.getStringValue(j, style[j]);
					if (value != null) {
						var entry = enc.document.createElement("add");
						entry.setAttribute("value", value);
						entry.setAttribute("as", j);
						styleNode.appendChild(entry)
					}
				}
				if (styleNode.childNodes.length > 0) {
					node.appendChild(styleNode)
				}
			}
		}
		return node
	};
	codec.getStringValue = function(key, value) {
		var type = typeof(value);
		if (type == "function") {
			value = mxStyleRegistry.getName(style[j])
		} else {
			if (type == "object") {
				value = null
			}
		}
		return value
	};
	codec.decode = function(dec, node, into) {
		var obj = into || new this.template.constructor();
		var id = node.getAttribute("id");
		if (id != null) {
			dec.objects[id] = obj
		}
		node = node.firstChild;
		while (node != null) {
			if (!this.processInclude(dec, node, obj) && node.nodeName == "add") {
				var as = node.getAttribute("as");
				if (as != null) {
					var extend = node.getAttribute("extend");
					var style = (extend != null) ? mxUtils.clone(obj.styles[extend]) : null;
					if (style == null) {
						if (extend != null) {
							mxLog.warn("mxStylesheetCodec.decode: stylesheet " + extend + " not found to extend")
						}
						style = new Object()
					}
					var entry = node.firstChild;
					while (entry != null) {
						if (entry.nodeType == mxConstants.NODETYPE_ELEMENT) {
							var key = entry.getAttribute("as");
							if (entry.nodeName == "add") {
								var text = mxUtils.getTextContent(entry);
								var value = null;
								if (text != null && text.length > 0) {
									value = mxUtils.eval(text)
								} else {
									value = entry.getAttribute("value");
									if (mxUtils.isNumeric(value)) {
										value = parseFloat(value)
									}
								}
								if (value != null) {
									style[key] = value
								}
							} else {
								if (entry.nodeName == "remove") {
									delete style[key]
								}
							}
						}
						entry = entry.nextSibling
					}
					obj.putCellStyle(as, style)
				}
			}
			node = node.nextSibling
		}
		return obj
	};
	return codec
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxDefaultKeyHandler());
	a.encode = function(b, c) {
		return null
	};
	a.decode = function(h, e, c) {
		if (c != null) {
			var d = c.editor;
			e = e.firstChild;
			while (e != null) {
				if (!this.processInclude(h, e, c) && e.nodeName == "add") {
					var b = e.getAttribute("as");
					var f = e.getAttribute("action");
					var g = e.getAttribute("control");
					c.bindAction(b, f, g)
				}
				e = e.nextSibling
			}
		}
		return c
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var codec = new mxObjectCodec(new mxDefaultToolbar());
	codec.encode = function(enc, obj) {
		return null
	};
	codec.decode = function(dec, node, into) {
		if (into != null) {
			var editor = into.editor;
			var model = editor.graph.getModel();
			node = node.firstChild;
			while (node != null) {
				if (node.nodeType == mxConstants.NODETYPE_ELEMENT) {
					if (!this.processInclude(dec, node, into)) {
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
				}
				node = node.nextSibling
			}
		}
		return into
	};
	return codec
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxDefaultPopupMenu());
	a.encode = function(b, c) {
		return null
	};
	a.decode = function(e, c, b) {
		var d = c.getElementsByTagName("include")[0];
		if (d != null) {
			this.processInclude(e, d, b)
		} else {
			if (b != null) {
				b.config = c
			}
		}
		return b
	};
	return a
} ());
mxCodecRegistry.register(function() {
	var a = new mxObjectCodec(new mxEditor(), ["modified", "lastSnapshot", "ignoredChanges", "undoManager", "graphContainer", "toolbarContainer"]);
	a.afterDecode = function(f, d, e) {
		var b = d.getAttribute("defaultEdge");
		if (b != null) {
			d.removeAttribute("defaultEdge");
			e.defaultEdge = e.templates[b]
		}
		var c = d.getAttribute("defaultGroup");
		if (c != null) {
			d.removeAttribute("defaultGroup");
			e.defaultGroup = e.templates[c]
		}
		return e
	};
	a.decodeChild = function(e, d, b) {
		if (d.nodeName == "Array") {
			var c = d.getAttribute("as");
			if (c == "templates") {
				this.decodeTemplates(e, d, b);
				return
			}
		} else {
			if (d.nodeName == "ui") {
				this.decodeUi(e, d, b);
				return
			}
		}
		mxObjectCodec.prototype.decodeChild.apply(this, arguments)
	};
	a.decodeUi = function(g, e, l) {
		var i = e.firstChild;
		while (i != null) {
			if (i.nodeName == "add") {
				var f = i.getAttribute("as");
				var h = i.getAttribute("element");
				var b = i.getAttribute("style");
				var k = null;
				if (h != null) {
					k = document.getElementById(h);
					if (k != null && b != null) {
						k.style.cssText += ";" + b
					}
				} else {
					var n = parseInt(i.getAttribute("x"));
					var m = parseInt(i.getAttribute("y"));
					var c = i.getAttribute("width");
					var o = i.getAttribute("height");
					k = document.createElement("div");
					k.style.cssText = b;
					var d = new mxWindow(mxResources.get(f) || f, k, n, m, c, o, false, true);
					d.setVisible(true)
				}
				if (f == "graph") {
					l.setGraphContainer(k)
				} else {
					if (f == "toolbar") {
						l.setToolbarContainer(k)
					} else {
						if (f == "title") {
							l.setTitleContainer(k)
						} else {
							if (f == "status") {
								l.setStatusContainer(k)
							} else {
								if (f == "map") {
									l.setMapContainer(k)
								}
							}
						}
					}
				}
			} else {
				if (i.nodeName == "resource") {
					mxResources.add(i.getAttribute("basename"))
				} else {
					if (i.nodeName == "stylesheet") {
						mxClient.link("stylesheet", i.getAttribute("name"))
					}
				}
			}
			i = i.nextSibling
		}
	};
	a.decodeTemplates = function(h, f, e) {
		if (e.templates == null) {
			e.templates = []
		}
		var d = mxUtils.getChildNodes(f);
		for (var c = 0; c < d.length; c++) {
			var b = d[c].getAttribute("as");
			var g = d[c].firstChild;
			while (g != null && g.nodeType != 1) {
				g = g.nextSibling
			}
			if (g != null) {
				e.templates[b] = h.decodeCell(g)
			}
		}
	};
	return a
} ());