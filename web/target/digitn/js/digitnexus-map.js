/**
 * about the report function file
 * @author Bill_huang
 * @Date : 2011-11-25
 */
digitnexus = (typeof digitnexus == 'undefined') ? {} : digitnexus;



OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5; 
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28; 
OpenLayers.ImgPath="skins/common/images/map/img/";
 

var style= new OpenLayers.Style({
	  strokeColor: "#FF00FF",
	  strokeWidth:2,
	  fillColor:'white',
	  fillOpacity:.3,
	  strokeOpacity:.8,
	  pointRadius:5
});

var editstyle= new OpenLayers.Style({
	  strokeColor: "#0000FF",
	  strokeWidth:2,
	  fillColor:'white',
	  fillOpacity:.3,
	  strokeOpacity:.8,
	  pointRadius:5
});



var curstyle = {
		strokeColor: '#00FFFF',  
        strokeWidth: 3
};
var optionstyle = {
		strokeColor: '#FF9500',  
        strokeWidth: 3, 
        fillOpacity:.1,
        fillColor:'white',
        pointRadius:20
};
var alarmtyle = {
		strokeColor: '#ff00ff',  
        strokeWidth: 1, 
        fillOpacity:.0,
        fillColor:'white',
        pointRadius:8
};

var hisstyle = {
		strokeColor: '#FFE100',  
        strokeWidth: 3,
        strokeDashstyle:"dash", 
        fillOpacity:.1,
        fillColor:'white',
        pointRadius:30 
};

function $$(id){
	return document.getElementById(id);
};

function setimeoutDN(fun,time,obj,paras) { 
	if (obj) {
		return setTimeout(function() {
			fun.apply(obj,paras);
		}, time);
	} 
};


function Label(id,position,left,top,width,height,text){
	var label=document.createElement("label");
	label.id=id;
	label.style.position=position?position:"";
	text=text?text:"";
	if(left){
	 label.style.left=left+"px";
	}
	if(top){
	    label.style.top=top+"px";
	}
	if(width){
	    label.style.width=width+"px";
	} 
	if(height){
	   label.style.height=height+"px";
	}
	var labeltext = document.createTextNode(text);
	label.appendChild(labeltext);
	return label;
}


function Font(id,position,left,top,width,height,text){
	var label=document.createElement("font");
	label.id=id;
	label.style.position=position?position:"";
	text=text?text:"";
	if(left){
	 label.style.left=left+"px";
	}
	if(top){
	    label.style.top=top+"px";
	}
	if(width){
	    label.style.width=width+"px";
	} 
	if(height){
	   label.style.height=height+"px";
	}
	var labeltext = document.createTextNode(text);
	label.appendChild(labeltext);
	return label;
}
function Button(id,position,left,top,width,height,text){
	var button=document.createElement("input");
	button.type="input";
	button.id=id;
	button.style.position=position?position:"";
	if(left){
		button.style.left=left+"px";
		}
		if(top){
			button.style.top=top+"px";
		}
		if(width){
			button.style.width=width+"px";
		}
		if(height){
			button.style.height=height+"px";
		}
    button.value=text;
	return button;
}

function ImageButton(id,position,left,top,width,height,src){
	var button=document.createElement("img"); 
	button.id=id;
	button.style.position=position?position:"";
	if(left){
		button.style.left=left+"px";
		}
		if(top){
			button.style.top=top+"px";
		}
		if(width){
			button.style.width=width+"px";
		}
		if(height){
			button.style.height=height+"px";
		}
	if(src){
        button.src=src;
	}
	return button;
}

function InputText(id,position,left,top,width,height){
	var text=document.createElement("input");
	text.type="text";
	text.id=id;
	text.style.position=position?position:"";
	if(left){
		text.style.left=left+"px";
		}
		if(top){
			text.style.top=top+"px";
		}
		if(width){
			text.style.width=width+"px";
		}
		if(height){
			text.style.height=height+"px";
		}
	return text;
}



function Select(id,position,left,top,width,height){
	var text=document.createElement("select"); 
	text.id=id;
	text.style.position=position?position:"";
	if(left){
		text.style.left=left+"px";
		}
		if(top){
			text.style.top=top+"px";
		}
		if(width){
			text.style.width=width+"px";
		}
		if(height){
			text.style.height=height+"px";
		}
	return text;
}


function Div(id,position,left,top,width,height){
	var div=document.createElement("div"); 
	div.id=id;
	div.style.position=position?position:"";
	if(left){
		div.style.left=left+"px";
		}
		if(top){
			div.style.top=top+"px";
		}
		if(width){
			div.style.width=width+"px";
		}
		if(height){
			div.style.height=height+"px";
		}
   
	return div;
}

function Span(id,position,left,top,width,height){
	var span=document.createElement("span"); 
	span.id=id;
	span.style.position=position?position:"";
	if(left){
		span.style.left=left+"px";
		}
		if(top){
			span.style.top=top+"px";
		}
		if(width){
			span.style.width=width+"px";
		}
		if(height){
			span.style.height=height+"px";
		}
   
	return span;
}



function MyImage($0q, top, $0y) {
	this.img = new Image();
	this.style = this.img.style;
	if ($0q) {
		this.style.left = $0q+"px";
	}
	if (top) {
		this.style.top = top+"px";
	}
	if ($0y) {
		this.img.src = $0y;
	}
	 
	this.style.visibility = "inherit"; 
		return this.img; 
}


OpenLayers.Layer.BaiduTile = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    url: 'http://q5.baidu.com/it/',
    tileOrigin: new OpenLayers.LonLat(-20037726.37, 12474104.17),
    //tileOrigin: new OpenLayers.LonLat(0, 0),
    tileSize: new OpenLayers.Size(256, 256),
    type: 'png',
    useScales: false,
    overrideDPI: false,

    initialize: function (name, url, options) {
        var resloution = 16384;
        this.resolutions = [];
        for (var i = 0; i < 19; i++) {
            this.resolutions[i] = resloution;
            resloution /= 2;
        }
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);

        if (this.resolutions) {
            this.serverResolutions = this.resolutions;
            this.maxExtent = this.getMaxExtentForResolution(this.resolutions[0]);
        }

        // this block steps through translating the values from the server layer JSON 
        // capabilities object into values that we can use.  This is also a helpful
        // reference when configuring this layer directly.
        if (this.layerInfo) {
            // alias the object
            var info = this.layerInfo;

            // build our extents
            var startingTileExtent = new OpenLayers.Bounds(
                info.fullExtent.xmin,
                info.fullExtent.ymin,
                info.fullExtent.xmax,
                info.fullExtent.ymax
            );

            // set our projection based on the given spatial reference.
            // esri uses slightly different IDs, so this may not be comprehensive
            this.projection = 'EPSG:' + info.spatialReference.wkid;
            this.sphericalMercator = (info.spatialReference.wkid == 102100);

            // convert esri units into openlayers units (basic feet or meters only)
            this.units = (info.units == "esriFeet") ? 'ft' : 'm';

            // optional extended section based on whether or not the server returned
            // specific tile information
            if (!!info.tileInfo) {
                // either set the tiles based on rows/columns, or specific width/height
                this.tileSize = new OpenLayers.Size(
                    info.tileInfo.width || info.tileInfo.cols,
                    info.tileInfo.height || info.tileInfo.rows
                );

                // this must be set when manually configuring this layer
                this.tileOrigin = new OpenLayers.LonLat(
                    info.tileInfo.origin.x,
                    info.tileInfo.origin.y
                );

                var upperLeft = new OpenLayers.Geometry.Point(
                    startingTileExtent.left,
                    startingTileExtent.top
                );

                var bottomRight = new OpenLayers.Geometry.Point(
                    startingTileExtent.right,
                    startingTileExtent.bottom
                );

                if (this.useScales) {
                    this.scales = [];
                } else {
                    this.resolutions = [];
                }

                this.lods = [];
                for (var key in info.tileInfo.lods) {
                    if (info.tileInfo.lods.hasOwnProperty(key)) {
                        var lod = info.tileInfo.lods[key];
                        if (this.useScales) {
                            this.scales.push(lod.scale);
                        } else {
                            this.resolutions.push(lod.resolution);
                        }

                        var start = this.getContainingTileCoords(upperLeft, lod.resolution);
                        lod.startTileCol = start.x;
                        lod.startTileRow = start.y;

                        var end = this.getContainingTileCoords(bottomRight, lod.resolution);
                        lod.endTileCol = end.x;
                        lod.endTileRow = end.y;
                        this.lods.push(lod);
                    }
                }

                this.maxExtent = this.calculateMaxExtentWithLOD(this.lods[0]);
                this.serverResolutions = this.resolutions;
                if (this.overrideDPI && info.tileInfo.dpi) {
                    // see comment above for 'overrideDPI'
                    OpenLayers.DOTS_PER_INCH = info.tileInfo.dpi;
                }
            }
        }
    },

    getContainingTileCoords: function (point, res) {
        //        return new OpenLayers.Pixel(
        //           Math.max(Math.floor((point.x - this.tileOrigin.lon) / (this.tileSize.w * res)), 0),
        //           Math.max(Math.floor((this.tileOrigin.lat - point.y) / (this.tileSize.h * res)), 0)
        //        );

        return new OpenLayers.Pixel(
            Math.floor((point.x - this.tileOrigin.lon) / (this.tileSize.w * res)),
            Math.floor((point.y - this.tileOrigin.lat) / (this.tileSize.h * res))
        );
    },

    calculateMaxExtentWithLOD: function (lod) {
        // the max extent we're provided with just overlaps some tiles
        // our real extent is the bounds of all the tiles we touch

        var numTileCols = (lod.endTileCol - lod.startTileCol) + 1;
        var numTileRows = (lod.endTileRow - lod.startTileRow) + 1;
        var minX = this.tileOrigin.lon + (lod.startTileCol * this.tileSize.w * lod.resolution);
        var maxX = minX + (numTileCols * this.tileSize.w * lod.resolution);
        var maxY = this.tileOrigin.lat - (lod.startTileRow * this.tileSize.h * lod.resolution);
        var minY = maxY - (numTileRows * this.tileSize.h * lod.resolution);
        return new OpenLayers.Bounds(minX, minY, maxX, maxY);
    },

    calculateMaxExtentWithExtent: function (extent, res) {
        var upperLeft = new OpenLayers.Geometry.Point(extent.left, extent.top);
        var bottomRight = new OpenLayers.Geometry.Point(extent.right, extent.bottom);
        var start = this.getContainingTileCoords(upperLeft, res);
        var end = this.getContainingTileCoords(bottomRight, res);
        var lod = {
            resolution: res,
            startTileCol: start.x,
            startTileRow: start.y,
            endTileCol: end.x,
            endTileRow: end.y
        };
        return this.calculateMaxExtentWithLOD(lod);
    },

    getUpperLeftTileCoord: function (res) {
        var upperLeft = new OpenLayers.Geometry.Point(
            this.maxExtent.left,
            this.maxExtent.top);
        return this.getContainingTileCoords(upperLeft, res);
    },

    getLowerRightTileCoord: function (res) {
        var bottomRight = new OpenLayers.Geometry.Point(
            this.maxExtent.right,
            this.maxExtent.bottom);
        return this.getContainingTileCoords(bottomRight, res);
    },

    getMaxExtentForResolution: function (res) {
        var start = this.getUpperLeftTileCoord(res);
        var end = this.getLowerRightTileCoord(res);

        var numTileCols = (end.x - start.x) + 1;
        //var numTileRows = (end.y - start.y) + 1;
        var numTileRows = (start.y - end.y) + 1;

        var minX = this.tileOrigin.lon + (start.x * this.tileSize.w * res);
        var maxX = minX + (numTileCols * this.tileSize.w * res);
        //var maxY = this.tileOrigin.lat - (start.y * this.tileSize.h * res);
        var maxY = this.tileOrigin.lat + (start.y * this.tileSize.h * res);
        var minY = maxY - (numTileRows * this.tileSize.h * res);
        return new OpenLayers.Bounds(minX, minY, maxX, maxY);
    },

    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.BaiduTile(this.name, this.url, this.options);
        }
        return OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
    },

    getMaxExtent: function () {
        var resolution = this.map.getResolution();
        return this.maxExtent = this.getMaxExtentForResolution(resolution);
    },

    getTileOrigin: function () {
        var extent = this.getMaxExtent();
        return new OpenLayers.LonLat(extent.left, extent.bottom);
    },

    getURL: function (bounds) {
        var res = this.getResolution();

        // tile center
        var originTileX = (this.tileOrigin.lon + (res * this.tileSize.w / 2));
        //var originTileY = (this.tileOrigin.lat - (res * this.tileSize.h / 2));
        var originTileY = (this.tileOrigin.lat + (res * this.tileSize.h / 2));
        originTileX = 0;
        originTileY = 0;

        var center = bounds.getCenterLonLat();
        var point = { x: center.lon, y: center.lat };
        //var x = (Math.round(Math.abs((center.lon - originTileX) / (res * this.tileSize.w))));
        var x = (Math.round((center.lon - originTileX) / (res * this.tileSize.w)));
        //var y = (Math.round(Math.abs((originTileY - center.lat) / (res * this.tileSize.h))));
        var y = (Math.round((center.lat - originTileY) / (res * this.tileSize.h)));
        var z = this.map.getZoom();

        // this prevents us from getting pink tiles (non-existant tiles)
        if (this.lods) {
            var lod = this.lods[this.map.getZoom()];
            if ((x < lod.startTileCol || x > lod.endTileCol)
                || (y < lod.startTileRow || y > lod.endTileRow)) {
                return null;
            }
        }
        else {
            var start = this.getUpperLeftTileCoord(res);
            var end = this.getLowerRightTileCoord(res);
            //            if ((x < start.x || x >= end.x)
            //                || (y < start.y || y >= end.y)) {
            //                return null;
            //            }
            if ((x < start.x || x >= end.x) || (y >= start.y || y < end.y)) {
                //return null;
            }
        }

        // Construct the url string
        var url = this.url;
        var s = '' + x + y + z;

        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(s, url);
        }

        var x_str = '${x}'; var y_str = '${y}';
        if (x < 0)
            x_str = 'M${x}';
        if (y < 0)
            y_str = 'M${y}';
        url = url + '/u=x=' + x_str + ';y=' + y_str + ';z=${z};v=014;type=web&fm=44';

        // Write the values into our formatted url
        url = OpenLayers.String.format(url, { 'x': Math.abs(x), 'y': Math.abs(y), 'z': z+3 });
        return url;
    },

    zeroPad: function (num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    },

    CLASS_NAME: 'OpenLayers.Layer.BaiduTile'
}); 

OpenLayers.Layer.Mapabc = OpenLayers.Class(
	    OpenLayers.Layer.EventPane,
	    OpenLayers.Layer.FixedZoomLevels, {
	    MIN_ZOOM_LEVEL: 3,
	    MAX_ZOOM_LEVEL: 17,
	    RESOLUTIONS: [
			1.40625, 
	        0.703125, 
	        0.3515625, 
	        0.17578125, 
	        0.087890625, 
	        0.0439453125,
	        0.02197265625, 
	        0.010986328125, 
	        0.0054931640625, 
	        0.00274658203125,
	        0.001373291015625, 
	        0.0006866455078125, 
	        0.00034332275390625, 
	        0.000171661376953125, 
	        0.0000858306884765625, 
	        0.00004291534423828125,
	        0.00002145767211914062, 
	        0.00001072883605957031,
	        0.00000536441802978515
			],
	    type: null,
	    wrapDateLine: true,
	    sphericalMercator: false,
	    initialize: function(name, options) {
	        OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
	        OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this, 
	                                                                    arguments);
	        if(this.sphericalMercator) {
	            OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
	            this.initMercatorParameters();
	        }
	    },
	    loadMapObject:function() {

	        var mabcDiv = OpenLayers.Util.createDiv(this.name); // create mapabc div
	        
			var sz = this.map.getSize();
	        mabcDiv.style.width = sz.w + "px";
	        mabcDiv.style.height = sz.h + "px";
	        this.div.appendChild(mabcDiv);

	        try { 
	            this.mapObject = new MMap(this.name);
	        } 
			catch (e) { 
				alert('failed in creating mapObject!'); 
			}

	        /*if (this.mapObject != null) {
	            try {
	                this.mapObject.LoadMap(null, null, this.type, true);
					alert('s');
	                this.mapObject.AttachEvent("onmousedown", OpenLayers.Function.True);

	            } 
				catch (e) { 
					alert('failed in attaching events!'); 
				}
					//this.mapObject.HideDashboard();
	            if(typeof this.mapObject.SetAnimationEnabled == "function") {
	                this.mapObject.SetAnimationEnabled(this.animationEnabled);
	            }
	        }
			*/
			this.mapObject.setCurrentMouseTool(PAN_WHEELZOOM); 
			this.mapObject.setContinuousZoom(true);
			this.mapObject.setDragEnabled(true);
			this.mapObject.setZoomEnabled(true);
	    },

		// room function
	    getOLZoomFromMapObjectZoom: function(moZoom) {
	        var zoom = null;
	        if (moZoom != null) {
	            zoom = OpenLayers.Layer.FixedZoomLevels.prototype.getOLZoomFromMapObjectZoom.apply(this, [moZoom]);
	            //zoom = 18 - zoom;
	        }
	        return zoom;
	    },
	    
	    getMapObjectZoomFromOLZoom: function(olZoom) {
	        var zoom = null; 
	        if (olZoom != null) {
	            zoom = OpenLayers.Layer.FixedZoomLevels.prototype.getMapObjectZoomFromOLZoom.apply(this, [olZoom]);
	            //zoom = 18 - zoom;
	        }
	        return zoom;
	    },
	   
	    setMapObjectCenter: function(center, zoom) {
			this.mapObject.setZoomAndCenter(zoom, center);
	    },
	   
	    getMapObjectCenter: function() {
			return this.mapObject.getCenter();
	    },
		
	    dragPanMapObject: function(dX, dY) {
	        alert('s');
			//this.mapObject.panTo(dX, dY);
			this.mapObject.panBy(new MSize(dX, dY), 10, SLIDING_LINEAR);
	    },
	    
	    getMapObjectZoom: function() {
	        return this.mapObject.getZoomLevel();
	    },

	    getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
	        return this.mapObject.fromContainerPixelToLngLat(moPixel);
	    },
		
	    getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
	        return this.mapObject.fromLngLatToContainerPixel(moLonLat);
	    },

	    getLongitudeFromMapObjectLonLat: function(moLonLat) {
	        return this.sphericalMercator ? 
	            this.forwardMercator(moLonLat.lngX, moLonLat.latY).lon :
	            moLonLat.lngX;
	    },

	    getLatitudeFromMapObjectLonLat: function(moLonLat) {
	        return this.sphericalMercator ? 
	            this.forwardMercator(moLonLat.lngX, moLonLat.latY).lat :
	            moLonLat.latY;
	    },
		
	    getMapObjectLonLatFromLonLat: function(lon, lat) {
	        var mLatLong;
	        if(this.sphericalMercator) {
	            var lonlat = this.inverseMercator(lon, lat);
	            mLatLong = new MLngLat(lonlat.lat, lonlat.lon);
	        } else {
	            mLatLong = new MLngLat(lat, lon);
	        }
	        return mLatLong;
	    },
		
	    getXFromMapObjectPixel: function(moPixel) {
	        return moPixel.x;
	    },

	    getYFromMapObjectPixel: function(moPixel) {
	        return moPixel.y;
	    },

	    getMapObjectPixelFromXY: function(x, y) {
	        return new MPoint(x, y);
	    },
	    
	    getMapObjectSizeFromOLSize: function(olSize) {
	        return new MSize(olSize.w, olSize.h);
	    },
	    CLASS_NAME: "OpenLayers.Layer.Mapabc"
	});

OpenLayers.Layer.TiandituLayer = OpenLayers.Class(OpenLayers.Layer.Grid, {


	mapType: null,
	mirrorUrls: null,
	topLevel: null,
	bottomLevel: null,


	topLevelIndex: 0,
	bottomLevelIndex: 20,
	topTileFromX: -180,
	topTileFromY: 90,
	topTileToX: 180,
	topTileToY: -270,


	isBaseLayer: true,


	initialize: function (name, url, options) {


	options.topLevel = options.topLevel ? options.topLevel : this.topLevelIndex;
	options.bottomLevel = options.bottomLevel ? options.bottomLevel : this.bottomLevelIndex;
	options.maxResolution = this.getResolutionForLevel(options.topLevel);
	options.minResolution = this.getResolutionForLevel(options.bottomLevel);


	var newArguments = [name, url, {},
	options];
	OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
	},


	clone: function (obj) {


	if (obj == null) {
	obj = new OpenLayers.Layer.TiandituLayer(this.name, this.url, this.options);
	}


	obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);


	return obj;
	},


	getURL: function (bounds) {
	var level = this.getLevelForResolution(this.map.getResolution());
	var coef = 360 / Math.pow(2, level);
	var x_num = this.topTileFromX < this.topTileToX ? Math.round((bounds.left - this.topTileFromX) / coef) : Math.round((this.topTileFromX - bounds.right) / coef);
	var y_num = this.topTileFromY < this.topTileToY ? Math.round((bounds.bottom - this.topTileFromY) / coef) : Math.round((this.topTileFromY - bounds.top) / coef);


	var type = this.mapType;
	if (type == "EMap") {
	if (level >= 1 && level <= 10) {
	type = "A0512_EMap";
	} else if (level == 11 || level == 12) {
	type = "B0627_EMap1112";
	} else if (level >= 13 && level <= 18) {
	type = "siwei0608";
	}
	}
	if (type == "ESatellite") {
	if (level >= 1 && level <= 10) {
	type = "sbsm0210";
	} else if (level == 11 || level == 12 ||level == 13) {
	type = "e"+level;
	}else if (level == 14){
	type = "eastdawnall";
	}else if (level >= 15 && level <= 18) {
	type = "sbsm1518";
	}
	}
	//以下2个已经失效
	if(type == "EDEM"){
	type = "J07098";
	}
	if(type == "EAddress"){
	type = "wfs";
	}
	var url = this.url;
	if (this.mirrorUrls != null) {
	url = this.selectUrl(x_num, this.mirrorUrls);
	}
	return this.getFullRequestString({
	T: type,
	X: x_num,
	Y: y_num,
	L: level
	}, url);
	},
	selectUrl: function (a, b) {
	return b[a % b.length]
	},
	getLevelForResolution: function (res) {
	var ratio = this.getMaxResolution() / res;
	if (ratio < 1) return 0;
	for (var level = 0; ratio / 2 >= 1;) {
	level++;
	ratio /= 2;
	}
	return level;
	},
	getResolutionForLevel: function (level) {
	return 360 / 256 / Math.pow(2, level);
	},
	getMaxResolution: function () {
	return this.getResolutionForLevel(this.topLevelIndex)
	},
	getMinResolution: function () {
	return this.getResolutionForLevel(this.bottomLevelIndex)
	},
	addTile: function (bounds, position) {
	var url = this.getURL(bounds);
	return new OpenLayers.Tile.Image(this, position, bounds, url, this.tileSize);
	},


	CLASS_NAME: "OpenLayers.Layer.TiandituLayer"
	});

OpenLayers.Layer.SoGou = OpenLayers.Class(OpenLayers.Layer.TileCache, {
    initialize: function (name, url, options) {
        var tempoptions = OpenLayers.Util.extend({
            'format': 'image/png',
            isBaseLayer: true
        }, options);
        OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [name, url, {},
        tempoptions]);
        this.extension = this.format.split('/')[1].toLowerCase();
        this.extension = (this.extension == 'jpg') ? 'jpeg' : this.extension;
        this.transitionEffect = "resize";
        this.buffer = 0;
    },
    /**
     * 按地图引擎切图规则实现的拼接方式
     */
    getURL: function (bounds) {
        var tilez=this.map.zoom-1;
  var offsetX = Math.pow(2,tilez); 
  var offsetY = offsetX - 1; 
   var res = this.map.getResolution();
        var bbox = this.map.getMaxExtent();
   var size = this.tileSize;
     var bx = Math.round((bounds.left - bbox.left) / (res * size.w));
        var by = Math.round((bbox.top - bounds.top) / (res * size.h));
  var numX = bx - offsetX; 
        var numY = (-by) + offsetY; 
  tilez = tilez + 1; 
  var zoomLevel = 729 - tilez;
  if (zoomLevel == 710) zoomLevel = 792;
  var blo = Math.floor(numX / 200); 
        var bla = Math.floor(numY / 200); 
        var blos,blas; 
            if (blo < 0)  
                blos = "M" + ( - blo); 
            else 
                blos = "" + blo; 
            if (bla < 0)  
                blas = "M" + ( - bla); 
            else 
                blas = "" + bla; 
        var x = numX.toString().replace("-","M");  
        var y = numY.toString().replace("-","M"); 
  var urlsNum = parseInt((bx + by) % this.url.length); 
  var strURL = ""; 
            strURL = this.url[urlsNum] + zoomLevel + "/" + blos + "/" + blas + "/" + x + "_" + y + ".GIF";
  return strURL;
    },
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.SoGou(this.name, this.url, this.options);
        }
        obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this, [obj]);
        return obj;
    },
    CLASS_NAME: "OpenLayers.Layer.SoGou"
});
OpenLayers.Layer.QQMap = OpenLayers.Class(OpenLayers.Layer.TileCache, {
	sateTiles:false,
	initialize: function (name, url, options) {
	var tempoptions = OpenLayers.Util.extend({
	'format': 'image/png',
	isBaseLayer: true
	}, options);
	OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [name, url, {},
	tempoptions]);
	this.extension = this.format.split('/')[1].toLowerCase();
	this.extension = (this.extension == 'jpg') ? 'jpeg' : this.extension;
	this.transitionEffect = "resize";
	this.buffer = 0;
	},
	/**
	* 按地圖引擎切圖規則實現的拼接方式
	*/
	getURL: function (bounds) {
	var res = this.map.getResolution();
	var bbox = this.map.getMaxExtent();
	var size = this.tileSize;
	var tileZ = this.map.zoom;
	//計算列號 
	var tileX = Math.round((bounds.left - bbox.left) / (res * size.w));
	//計算行號
	var tileY = Math.round((bbox.top - bounds.top) / (res * size.h));
	var scope =new Array(0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 7, 0, 7, 0, 15, 0, 15, 0, 31, 0, 31, 0, 63, 4, 59, 0, 127, 12, 115, 0, 225, 28, 227, 356, 455, 150, 259, 720, 899, 320, 469, 1440, 1799, 650, 929, 2880, 3589, 1200, 2069, 5760, 7179, 2550, 3709, 11520, 14349, 5100, 7999, 23060, 28689, 10710, 15429, 46120, 57369, 20290, 29849, 89990, 124729, 41430, 60689, 184228, 229827, 84169, 128886);
	var f=tileZ*4;
	var i = scope[f++];
	var j = scope[f++];
	var l = scope[f++];
	var scope = scope[f];
	var imgformat=this.sateTiles ? ".jpg" : ".png";
	if (tileX >= i && tileX <= j && tileY >= l && tileY <= scope) {
	tileY = Math.pow(2, tileZ) - 1 - tileY;
	var tileNo = tileZ + "/" + Math.floor(tileX / 16) + "/" + Math.floor(tileY / 16)+ "/" + tileX + "_" + tileY + imgformat;
	}

	var Surl=this.url;
	if (OpenLayers.Util.isArray(Surl))
	Surl = this.selectUrl(tileNo, Surl);
	return Surl+tileNo;
	},

	clone: function (obj) {
	if (obj == null) {
	obj = new OpenLayers.Layer.QQMap(this.name, this.url, this.options);
	}
	obj = OpenLayers.Layer.TileCache.prototype.clone.apply(this, [obj]);
	return obj;
	},
	CLASS_NAME: "OpenLayers.Layer.QQMap"
});

OpenLayers.Layer.ScaleMarkers = OpenLayers.Class(OpenLayers.Layer.Markers, {
	maxLeveL:10,
	minLevel:0,
	drawMarker: function(marker) {
		var zoom=this.map.getZoom();
		if(zoom>=this.minLevel&&zoom<this.maxLevel){
	        var px = this.map.getLayerPxFromLonLat(marker.lonlat);
	        if (px == null) {
	            marker.display(false);
	        } else {
	        	 marker.display(true);
	            if (!marker.isDrawn()) {
	                var markerImg = marker.draw(px);
	                this.div.appendChild(markerImg);
	            } else if(marker.icon) {
	                marker.icon.moveTo(px);
	            }
	        }
		}else{
			  marker.display(false);
		}
    }
});



OpenLayers.Control.TextControl = OpenLayers.Class(OpenLayers.Control, {
	 
	draw: function (px) {
        if (this.div == null) {
            this.div = OpenLayers.Util.createDiv(this.id); 
            this.div.className=this.displayClass;
            var labeltext=document.createElement("label");
            labeltext.innerHTML=this.title;
            labeltext.style.color="#222222";
            
            this.div.appendChild(labeltext); 
        }
        if (px != null) {
            this.position = px.clone();
        }
        this.moveTo(this.position);
        var self=this;
        this.div.onclick=function(){
        	 self.parentControl.activate();
        	 self.otherControl.deactivate();
        };
        return this.div; 
    }  
});
OpenLayers.Layer.Google.v3.repositionMapElements=function(){
	 // This is the first time any Google layer in this mapObject has been
   // made visible.  The mapObject needs to know the container size.
   google.maps.event.trigger(this.mapObject, "resize");
   
   var div = this.mapObject.getDiv().firstChild;
   if (!div || div.childNodes.length < 3) {
       this.repositionTimer = window.setTimeout(
           OpenLayers.Function.bind(this.repositionMapElements, this),
           250
       );
       return false;
   }

   var cache = OpenLayers.Layer.Google.cache[this.map.id];
   var container = this.map.viewPortDiv;
   
   // move the ToS and branding stuff up to the container div
   // depends on value of zIndex, which is not robust
   for (var i=div.children.length-1; i>=0; --i) {
       if (div.children[i].style.zIndex == 1000001) {
           var termsOfUse = div.children[i];
           container.appendChild(termsOfUse);
           termsOfUse.style.zIndex = "1100";
           termsOfUse.style.bottom = "";
           termsOfUse.className = "olLayerGoogleCopyright olLayerGoogleV3";
           termsOfUse.style.display = "";
           cache.termsOfUse = termsOfUse;
       }
       if (div.children[i].style.zIndex == 1000000) {
           var poweredBy = div.children[i];
           container.appendChild(poweredBy);
           poweredBy.style.zIndex = "1100";
           poweredBy.style.bottom = "";
           poweredBy.className = "olLayerGooglePoweredBy olLayerGoogleV3 gmnoprint";
           poweredBy.style.display = "";
           cache.poweredBy = poweredBy;
       }
       if (div.children[i].style.zIndex == 10000002) {
           container.appendChild(div.children[i]);
       }
   }

   this.setGMapVisibility(this.visibility);
};

OpenLayers.Geometry.Point.prototype.toLonLat=function(){
	return new OpenLayers.LonLat(this.x,this.y);
};

OpenLayers.Map.prototype.addControlToMap= function (control, px) {
    // If a control doesn't have a div at this point, it belongs in the
    // viewport.
    control.outsideViewport = (control.div != null);
    
    // If the map has a displayProjection, and the control doesn't, set 
    // the display projection.
    if (this.displayProjection && !control.displayProjection) {
        control.displayProjection = this.displayProjection;
    }    
    
    control.setMap(this);
    var div = control.draw(px);
    if (div) {
        if(!control.outsideViewport) {
        	if(!div.style.zIndex){
            div.style.zIndex = this.Z_INDEX_BASE['Control'] +
                                this.controls.length;
        	}
            this.viewPortDiv.appendChild( div );
        }
    }
    if(control.autoActivate) {
        control.activate();
    }
};
OpenLayers.Map.prototype.clearAllMarkers=function(){
	 for(var i=0;i<this.layers.length;i++){		 
		 var layer=this.layers[i];
	//	 console.log(layer);
		 if(!layer.displayInLayerSwitcher){  
			 if(layer.removeFromButton){
				 continue;
			 } 
			 if(layer instanceof OpenLayers.Layer.Markers){  
				 layer.clearMarkers();
			 }else if(layer instanceof OpenLayers.Layer.Vector){ 
				 layer.removeAllFeatures();
			 }
		 }
	 }
	 if(oldPop){
		 oldPop.hide();
	 }
};


 
 
OpenLayers.Marker.InfoMarker = OpenLayers.Class(OpenLayers.Marker, { 
    label:null, 
    span:null, 
    div:null,    
    
    initialize: function(point, label,icon) { 
        this.lonlat=point; 
        this.label=label;
        this.div    = OpenLayers.Util.createDiv();
        this.div.style.border="1px solid #E5B85C";
        this.div.style.backgroundColor ="#FFFFD9";
        this.div.style.overflow = 'hidden';
        this.span=document.createElement("span");
        this.div.style.width=this.label.length*10+"px";
        this.span.innerHTML=this.label;
        this.div.appendChild(this.span);
        this.events = new OpenLayers.Events(this, this.div, null); 
    },

    /**
     * Method: destroy 
     */    
    destroy: function() {
         this.erase();
        this.span=null;
        this.div = null; 
        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
        
    },
    
    draw: function(px, sz) {
    	 
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz); 
        return this.div;
    }, 
    
    erase: function() {
    	if (this.span != null && this.span.parentNode != null) {
            OpenLayers.Element.remove(this.span);
         } 
         
          if (this.div != null && this.div.parentNode != null) {
            OpenLayers.Element.remove(this.div);
          } 
    }, 
    setLonLat:function(lonlat){
    	this.lonlat=lonlat;
    },
    setLabel:function(label){
    	this.label=label;
    	 this.span.style.width=this.label.length*17+"px";
         this.span.innerHTML=this.label;
    },
    
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.InfoMarker"
});

var oldPop;
 
 
OpenLayers.Marker.InfoIconMarker = OpenLayers.Class(OpenLayers.Marker, { 
    label:null, 
    span:null, 
    div:null,    
    img:null,
    imgurl:null,
    showText:true,
    binfo:null,
    initialize: function(point,label,img,showText,binfo) { 
        this.lonlat=point; 
        this.label=label||"";
        this.div    = OpenLayers.Util.createDiv();
  //      this.div.style.border="1px solid blue";
   //     this.div.style.backgroundColor ="#ff00ff";
   //     this.div.style.overflow = 'hidden';
        this.showText=showText;
        this.imgurl=img||OpenLayers.ImgPath+"/marker.png"; 
        this.binfo=binfo;
        this.events = new OpenLayers.Events(this, this.div, null); 
    },

    /**
     * Method: destroy 
     */    
    destroy: function() {
         this.erase();
        this.span=null;
        this.div = null; 
        this.img=null;
        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },
    
    draw: function(px, sz) {
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz); 
        if(!this.img){
        	 this.img=document.createElement("img");
             this.img.root=this;
           
             this.img.src=this.imgurl;
             this.img.style.position="absolute";
             this.img.style.top="-10px";
             this.img.style.left="-10px";
             this.div.appendChild(this.img);
              this.span=document.createElement("div");
              
             this.div.style.width=this.label.length*17+"px";
             this.span.innerHTML=this.label;
			 this.span.className="layer_text1";
			 this.span.style.left="20px";
             this.div.appendChild(this.span);
             
             this.popup = new OpenLayers.Popup("test1",
                     this.lonlat,
                     null,
                     this.label,
                     true);
             this.popup.hide();
             this.map.addPopup(this.popup);
             if(this.binfo){
            	 this.binfoDiv=document.createElement("div");
                 this.binfoDiv.innerHTML=this.binfo;                 
                 this.binfoDiv.style.backgroundColor="white";
                 this.binfoDiv.style.position="absolute";
                 this.binfoDiv.style.left="10px";
                 this.binfoDiv.style.top="10px";
                 this.binfoDiv.style.border="1px solid blue";
                 this.binfoDiv.style.width="100px";
                 this.binfoDiv.style.display="none";
                 this.div.appendChild(this.binfoDiv);
                 
                 
             }
            
             this.img.onmouseover=function(){
            	 this.src="skins/common/images/map/marker.png";
//            	 if(this.root.binfoDiv){
//            	   this.root.binfoDiv.style.display="";
//            	 }
            	
             };
             this.img.onclick=function(){
            	 if(oldPop){
            		 oldPop.hide();
            	 }
            	 if(this.root.popup){            		 
            		 this.root.popup.show();
            		 oldPop=this.root.popup;
            	 }
             };
             this.img.onmouseout=function(){
            	this.src=this.root.imgurl; 
//            	if(this.root.binfoDiv){
//           		 this.root.binfoDiv.style.display="none";
//                }
//            	if(this.root.popup){
//	           		 this.root.popup.hide();
//	           	 }
             };
        }
        return this.div;
    }, 
    
    erase: function() {
    	if (this.span != null && this.span.parentNode != null) {
            OpenLayers.Element.remove(this.span);
         } 
         
          if (this.div != null && this.div.parentNode != null) {
            OpenLayers.Element.remove(this.div);
          } 
    }, 
    setLonLat:function(lonlat){
    	this.lonlat=lonlat;
    },
    setLabel:function(label){
    	this.label=label;
    	 this.span.style.width=this.label.length*17+"px";
         this.span.innerHTML=this.label;
    },
    
    highImg:function(url){ 
    	if(this.popup){
    		this.popup.show();
    		 oldPop=this.popup;
    	}
    	if(this.img){
    	 this.img.src=url;
    	}
    },
    setImg:function(){
    	if(this.popup){
    		this.popup.hide();
    	}
    	this.img.src=this.imgurl;
    },    
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.InfoIconMarker"
});


OpenLayers.Marker.VedioMarker = OpenLayers.Class(OpenLayers.Marker, { 
     
   
    div:null,    
    img:null,
    imgurl:null,
    flash:null,
    flashdiv:null, 
    initFlash:false,
    initialize: function(point,img,flash) { 
        this.lonlat=point;  
        this.div = OpenLayers.Util.createDiv(); 
      //  this.div.style.overflow = 'hidden'; 
        this.imgurl=img||OpenLayers.ImgPath+"/camera.png";
        this.flash=flash;
       
        this.events = new OpenLayers.Events(this, this.div, null); 
        
    },

    /**
     * Method: destroy 
     */    
    destroy: function() {
         this.erase(); 
        this.div.innerHTML = "";
        this.div=null;
        this.img=null;
        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },
    
    draw: function(px, sz) { 
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz); 
        if(!this.img){ 
        	 this.img=document.createElement("img"); 
             this.img.src=this.imgurl; 
             this.div.appendChild(this.img); 
             OpenLayers.Event.observe(this.img, 'click', 
                     OpenLayers.Function.bindAsEventListener(this.showFlash,
                                                             this)); 
             this.flashParen=OpenLayers.Util.createDiv();
             this.flashParen.style.position="absolute";
             this.flashParen.style.display="none";
             this.flashParen.style.width="410px";
             this.flashParen.style.width="410px";
             this.flashParen.style.height="330px";
             this.flashParen.style.backgroundColor="#dddfe3";
             var colseImg=document.createElement("img"); 
             colseImg.src="skins/common/images/map/close.gif"; 
             colseImg.style.position="relative";
             colseImg.style.left="395px";
           
             var imgevents = new OpenLayers.Events(this, colseImg, null); 
             
             imgevents.register("click",colseImg,   OpenLayers.Function.bindAsEventListener(this.hideFlash,
                     this));
             this.flashdiv=OpenLayers.Util.createDiv();
             this.flashdiv.style.position="relative";
             this.flashdiv.style.left="20px";
             this.flashdiv.style.top="35px";
             this.flashdiv.style.width="400px";
             this.flashdiv.style.height="300px";
             
              this.flashParen.appendChild(colseImg); 
             this.flashParen.appendChild(this.flashdiv); 
             this.div.appendChild(this.flashParen); 
        }
        
        return this.div;
    }, 
    
    erase: function() { 
          if (this.div != null && this.div.parentNode != null) {
            OpenLayers.Element.remove(this.div);
          } 
    }, 
    setLonLat:function(lonlat){
    	this.lonlat=lonlat;
    },
    
     showFlash:function(){
    	
    	 if(this.flashParen.style.display=="none"){
    		 
	    	 this.flashParen.style.display="";
	    	 
	    	 if(!this.initFlash){ 
	    		 this.initFlash=true;
			    	 jwplayer(this.flashdiv).setup({
			 			flashplayer: "mediaplayer/player.swf",
			 			file: this.flash,
			 			image: "mediaplayer/preview.jpg"
			 		});
	    	 }
    	 }
    },
    
    hideFlash:function(){  
   	 this.flashParen.style.display="none" ;  
    },
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.VedioMarker"
});


OpenLayers.Marker.GPSMarker = OpenLayers.Class(OpenLayers.Marker, {

    /** 
     * Property: bounds 
     * {<OpenLayers.Bounds>} 
     */
    
    
    carnum:null,
    gpstime:null,
    rotate:null, 
    image:null, 
    alarm:null,
    /** 
     * Property: div 
     * {DOMElement} 
     */
    div: null,
   
    id:null,
    lonlat:null,
    
    /** 
     * Constructor: OpenLayers.Marker.Box
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     * borderColor - {String} 
     * borderWidth - {int} 
     */
    initialize: function(point, img, carnum,gpstime,rotate,id,alarm) {
        this.id=id;
        this.lonlat=point;
        this.image=img;
        this.carnum=carnum;
        this.gpstime=gpstime;
        this.rotate= Math.PI *rotate/ 180;
        this.alarm=alarm;
        this.div    = OpenLayers.Util.createDiv();
     //   this.div.style.overflow = 'hidden';
        this.events = new OpenLayers.Events(this, this.div, null);
        
    },

    /**
     * Method: destroy 
     */    
    destroy: function() {  
       this.erase();
        this.div.innerHTML="";
        this.div = null;
        
        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },
    
    erase: function() {
    	 if (this.div != null && this.div.parentNode != null) {
    	        
             OpenLayers.Element.remove(this.div);
           }
    }, 
    
    
    
    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker磗 icon set at the 
    *         location passed-in
    */
    draw: function(px, sz) {
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz);
       if(!this.carLabel){
		     this.carLabel = new Label(null,null,5, 0,null,null, this.carnum);
			  this.carLabel.style.background ="#066FC6";    //  "#8BC8FF";
			  this.carLabel.style.color = "white";
			 
		//	 this.div.appendChild( this.carLabel);
			 
			
		     this.events.register("mouseover", this.div,   OpenLayers.Function.bindAsEventListener(this.mouseover,
	                 this));
		       this.events.register("mouseout", this.div, OpenLayers.Function.bindAsEventListener(this.mouseout,
		                 this));
		     var imgDiv = new Div(null,"absolute",-18, -15, 24, 31); 
			  this.div.appendChild(imgDiv);
		  
			  this.imgDiv=imgDiv; 
		    
				    this.img = new MyImage(0, 0, this.image); 
					imgDiv.appendChild(this.img); 
					
				  this.timeLabel = new Label(null,"absolute",-18, 15,null,null, this.gpstime);
				  this.timeLabel.style.background ="#066FC6";    //  "#8BC8FF";
				  this.timeLabel.style.color = "white";
				  this.timeLabel.style.zIndex = 1000;
				  this.timeLabel.style.width=this.gpstime.length*7+"px";
				  this.timeLabel.style.display="none";
			      this.timeLabel.className="gpscarmarkerlabel";
				 this.div.appendChild( this.timeLabel);
				 
				 if(this.alarm){
					 this.alarmLabel = new Label(null,"absolute",-15, 20,90,null, this.alarm);
					  this.alarmLabel.style.background ="white" ;   //  "#8BC8FF";
					  this.alarmLabel.style.color = "red";
					  this.alarmLabel.style.border="1px solid red";
					  this.alarmLabel.style.padding="4px";
					 
					 this.div.appendChild( this.alarmLabel);
					 
				 }
			}else{
				 this.img.src =this.image;
			} 
		 
        return this.div;
    }, 
    mouseover:function(){
      this.timeLabel.style.display="";
    },
     mouseout:function(){
      this.timeLabel.style.display="none";
    },
    
    /**
     * Method: onScreen
     * 
     * Rreturn:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds. containsLonLat(this.lonlat, true);
        }    
       
        return onScreen;
    },
    
    /**
     * Method: display
     * Hide or show the icon
     * 
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.GPSMarker"
});


OpenLayers.Marker.GPSMarkerLine = OpenLayers.Class(OpenLayers.Marker, {

    /** 
     * Property: bounds 
     * {<OpenLayers.Bounds>} 
     */
    
    
    markers:null,
    curmarker:null,
    polyline:null,
    lonlat:null,
    layer:null,
    vlayer:null,
    id:null,
    alarm:null,
    /** 
     * Constructor: OpenLayers.Marker.Box
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     * borderColor - {String} 
     * borderWidth - {int} 
     */
    initialize: function(point, img, carnum,gpstime,rotate,id,layer,vlayer,alarm) {
    	this.markers=[];
    	curmarker=new OpenLayers.Marker.GPSMarker(point, img, carnum,gpstime,rotate,id+"_marker",alarm);
    	 this.id=id;
    	this.lonlat=point;
    	 this.div    = OpenLayers.Util.createDiv();
         this.div.style.overflow = 'hidden';
         this.layer=layer;
         this.vlayer=vlayer;
         this.alarm=alarm;
    },

    /**
     * Method: destroy 
     */    
    destroy: function() { 
       if (this.div != null && this.div.parentNode != null) {
             OpenLayers.Element.remove(this.div);
           }
       
       this.div.innerHTML="";
       if(this.polyline){
          vlayer.removeFeatures([this.polyline]);
        }
        this.div = null; 
        
        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
        for(var marker in this.markers){
        	this.markers[marker].destroy();
        }
        
    },
    
    erase: function() {
   	 if (this.div != null && this.div.parentNode != null) { 
            OpenLayers.Element.remove(this.div);
          }
    }, 
   
   updateInfo:function(marker){ 
       if(this.polyline){
         var newPoint = new OpenLayers.Geometry.Point(marker.lonlat.lon,marker.lonlat.lat); 
	      this.polyline.geometry.addComponent(newPoint);
	      this.vlayer.drawFeature(this.polyline);
	    }else{ 
	      var pointList=[];
	      var  newPoint = new OpenLayers.Geometry.Point(this.lonlat.lon,this.lonlat.lat); 
	      pointList.push(newPoint);
	      newPoint = new OpenLayers.Geometry.Point(marker.lonlat.lon,marker.lonlat.lat); 
	      pointList.push(newPoint);
  
	      this.polyline = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList)); 
		 this.vlayer.addFeatures([this.polyline]);     
	    }
       var len=this.markers.length;
         if(len>0){
        	 var lastMarker=this.markers[len-1];
        	 if(lastMarker.image.indexOf("alarm")<0){
        		 lastMarker.image=lastMarker.image.substring(0,lastMarker.image.length-4)+"_track.png";
        	 }
         }
         this.lonlat=marker.lonlat;  
         marker.id=marker.id+"_markers";
         curmarker=marker; 
         this.layer.drawMarker(this);
   },

    
    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker磗 icon set at the 
    *         location passed-in
    */
    draw: function(px, sz) {
    	 
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz); 
        for(var i=0;i<this.markers.length;i++){ 
        	this.layer.drawMarker(this.markers[i]);
        }
        if(curmarker){
        	this.layer.addMarker(curmarker);
        	this.markers.push(curmarker);
        	curmarker=null;
        }
        return this.div;
    }, 
    

    /**
     * Method: onScreen
     * 
     * Rreturn:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds. containsLonLat(this.lonlat, true);
        }    
       
        return onScreen;
    },
    
    /**
     * Method: display
     * Hide or show the icon
     * 
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.GPSMarkerLine"
});
 

OpenLayers.Marker.RuleMarker = OpenLayers.Class(OpenLayers.Marker, {

    /** 
     * Property: bounds 
     * {<OpenLayers.Bounds>} 
     */
    
    
	markers:null, 
    polyline:null,
    lonlat:null,
    layer:null,
    vlayer:null,
    
    
     displaySystem: 'metric', 
     geodesic: false,
    displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },
   
    /** 
     * Constructor: OpenLayers.Marker.Box
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} 
     * borderColor - {String} 
     * borderWidth - {int} 
     */
    initialize: function(geometry,layer,vlayer,ruletype) {
    	 
    	 this.polyline = new OpenLayers.Feature.Vector(geometry.clone());
    	
    	 var len=geometry.getVertices().length;
    	 this.layer=layer;
         this.vlayer=vlayer;
         this.markers=[];
         var rulelen=0;
        
         var curGeometry=null;
         var points=[];
         var add=false;
    	 for(var i=0;i<len;i++){
    		 if(i==0){
    			 var infoMarker =new OpenLayers.Marker.InfoMarker(geometry.getVertices()[i].toLonLat(),map_rule_res_start); 
    			 this.markers.push(infoMarker);
    			 this.layer.addMarker(infoMarker); 
    			
    			 if(ruletype){
    			    points.push(geometry.getVertices()[i]);
    			 }else{
    				 curGeometry=new  OpenLayers.Geometry.LineString(geometry.getVertices()[i]);
    			 }
    		 }else{
    			 if(ruletype){
    				 
	    			 if(add){
	    				 points.pop();	 
	    			 }
	    				 points.push(geometry.getVertices()[i]);
	    				 points.push(geometry.getVertices()[0]);
	    				 add=true;
	    			 
	    		//	 console.log(points.length);
	    			 var linear_ring = new OpenLayers.Geometry.LinearRing(points);
    				 rulelen=this.getBestArea(new OpenLayers.Geometry.Polygon([linear_ring]),layer.map);
    			 }else{
    			    curGeometry.addPoint(geometry.getVertices()[i]);
    			    rulelen=this.getBestLength(curGeometry,layer.map);    
    			 }
    			// console.log(curGeometry); 
    			  
    			 var infoMarker =new OpenLayers.Marker.InfoMarker(geometry.getVertices()[i].toLonLat(),rulelen); 
    			 this.markers.push(infoMarker);
    			 this.layer.addMarker(infoMarker);
    		 }
    	 }
    	 var size = new OpenLayers.Size(12,12);
    	 var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    	 var icon = new OpenLayers.Icon('skins/common/images/map/close.png', size, offset);
    //	 markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));
    	  
		 var infoMarker =new OpenLayers.Marker(geometry.getVertices()[len-1].toLonLat(),icon); 
		 var self=this;
		// infoMarker.events.register("mousedown", infoMarker, function() { console.log("click");self.destroy()});
		 infoMarker.events.register("click", infoMarker, function(e){ 
			 self.destroy();
	      }); 
		 this.markers.push(infoMarker);
		 this.layer.addMarker(infoMarker);
    	 this.lonlat=geometry.getVertices()[0];
    	 this.div    = OpenLayers.Util.createDiv();
         this.div.style.overflow = 'hidden';
         this.vlayer.addFeatures(this.polyline);
         
    },
    
    getBestArea: function(geometry,map) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit,map);
            if(area > 1) {
                break;
            }
        }
        return area+" "+unit+"<sup>2</sup>";
    },
    
    /**
     * Method: getArea
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * units - {String} Unit abbreviation
     *
     * Returns:
     * {Float} The geometry area in the given units.
     */
    getArea: function(geometry, units,map) {
        var area, geomUnits;
        if(this.geodesic) {
            area = geometry.getGeodesicArea(map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area.toFixed(3);;
    },
    
    getBestLength: function(geometry,map) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit,map);
            if(length > 1) {
                break;
            }
        }
        return length+" "+unit;
    },

    /**
     * Method: getLength
     *
     * Parameters:
     * geometry - {<OpenLayers.Geometry>}
     * units - {String} Unit abbreviation
     *
     * Returns:
     * {Float} The geometry length in the given units.
     */
    getLength: function(geometry, units,map) {
        var length, geomUnits;
        if(this.geodesic) {
            length = geometry.getGeodesicLength(map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length.toFixed(3);
    },
    /**
     * Method: destroy 
     */    
    destroy: function() { 
    	this.erase();
       if (this.div != null && this.div.parentNode != null) {
             OpenLayers.Element.remove(this.div);
             this.div.innerHTML="";
           }
       
     //  this.div.innerHTML="";
     //  console.log(this.polyline);
     //  console.log(this.vlayer);
       if(this.polyline){
    	   this.polyline.destroy();
       //  this.vlayer.removeFeatures(this.polyline); 
      //   console.log(this.vlayer);
        }
        this.div = null; 
        
      //  OpenLayers.Marker.prototype.destroy.apply(this, arguments);
        for(var marker in this.markers){ 
        	this.layer.removeMarker(this.markers[marker]);
        	this.markers[marker].destroy();
        }
        this.markers=[];
        this.layer.removeMarker(this);
    },
    
    erase: function() {
   	 if (this.div != null && this.div.parentNode != null) { 
            OpenLayers.Element.remove(this.div);
        }
   	 for(var marker in this.markers){ 
     	this.markers[marker].erase();
     }
    
    }, 
   
   
    
    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker磗 icon set at the 
    *         location passed-in
    */
    draw: function(px, sz) { 
    	 
        OpenLayers.Util.modifyDOMElement(this.div, null, px, sz); 
        for(var i=0;i<this.markers.length;i++){ 
        	this.layer.drawMarker(this.markers[i]);
        }
        this.vlayer.drawFeature(this.polyline);
        return this.div;
    }, 
    

    /**
     * Method: onScreen
     * 
     * Rreturn:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen:function() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds. containsLonLat(this.lonlat, true);
        }    
       
        return onScreen;
    },
    
    /**
     * Method: display
     * Hide or show the icon
     * 
     * Parameters:
     * display - {Boolean} 
     */
    display: function(display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "OpenLayers.Marker.RuleMarker"
});

OpenLayers.Control.POIFindPanel = OpenLayers.Class(OpenLayers.Control, {  
	 markerlayer:null,
	 rowcount:null,
	 pagecount:null,
	 rowperpage:10,
	 curpage:null,
	 name:null,
	 mapname:null,
	 allowSelection:true,
	 markers:[],
	 lastMarker:null,
	  initialize: function(options) { 
	        OpenLayers.Control.prototype.initialize.apply(this, [options]);
	         
	        this.markerlayer = new OpenLayers.Layer.Markers( "POI Marker",{
	        	displayInLayerSwitcher:false
	        } );
	  },
	  
	  createButton:function(left,top){
		var a=document.createElement("a");
		a.href="#";
		a.className="btn_1";
		a.style.position="absolute";
		a.style.left=left;
		a.style.top=top;
		var  span = document.createElement("span");
		var div=document.createElement("div");
		div.className="btn_icon3 icon_search2";
		span.appendChild(div);
		var label=document.createElement("label");
		label.innerHTML=label_search;
		span.appendChild(label);
		a.appendChild(span);
		return a;
	  },
	  draw: function() {
	    	OpenLayers.Control.prototype.draw.apply(this, arguments);  
	        this.map.addLayer(this.markerlayer);
	        var div=this.div;
	        
	        div.style.backgroundColor="white"; 
	        if(div.style.filter){
	        	div.style.filter = "alpha(opacity=90)";
	        }else{
	        	div.style.opacity  = "0.9";
	        }
	       
	        var titleDiv=OpenLayers.Util.createAlphaImageDiv("poi_title");
	        titleDiv.innerHTML="<strong>"+map_tool_poiTitle+"</strong>";
	      
	        this.divwidth=parseInt(this.div.style.width);
	        this.divheight=parseInt(this.div.style.height);
	      //  console.log(this.divwidth+" "+this.divheight);
	        var label=new Label("poilabel","absolute",10,34,40,20,map_tool_poiLabel); 
	        var text=new InputText("poifindtext");
	        this.text=text;
	        label.setAttribute("for",text);
	        var btn=this.createButton("190px","30px");    //new ImageButton("poibtn","absolute",180,31);
	       
	       //  var btn2=new ImageButton("poibtn","absolute",210,31);
	        var show=new ImageButton("poifinding","absolute",260,30,null,null,"skins/common/images/map/loading.gif");
	        show.style.display="none";
	        
	        var resultdiv=new Div("poiResultDiv","absolute",9,58,this.divwidth-36,this.divheight-116);
	        //resultdiv.style.border="1px solid blue";
	        this.resultdiv=resultdiv;
	        
	        
	        var pagediv=new Div("poiPageDiv","absolute",10,this.divheight-34,this.divwidth-20,20);
	        pagediv.style.display="none";
	       // pagediv.style.border="1px solid blue";
	        
	        var span=new Span("resultSpan",null,10,0);
	        pagediv.appendChild(span);
	        
	        
	        var imgfirst=new ImageButton("firstbtn","absolute",10,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/first.png");
	        pagediv.appendChild(imgfirst);
	        imgfirst.events = new OpenLayers.Events(this, imgfirst, null, true);
	        imgfirst.events.on({ 
	            "click": this.first,
	            scope: this
	        });
	        
	        var imgpre=new ImageButton("prebtn","absolute",40,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/prev.png");
	        pagediv.appendChild(imgpre);
	        
	        imgpre.events = new OpenLayers.Events(this, imgpre, null, true);
	        imgpre.events.on({ 
	            "click": this.pre,
	            scope: this
	        });
	        
	        var labelPage=new Span("pagelabel","absolute",90,0,20,20); 
	        labelPage.innerHTML="Page";
	        pagediv.appendChild(labelPage);
	        
	        var page=new InputText("pagetext","absolute",120,0,20,12);
	        pagediv.appendChild(page);
	        var self=this;
	        page.onkeydown=function(e){
	        	if(e){
	        		if(e.keyCode==13){
	        		 
	        		     self.page();
	        		}
	        	}else{
	        		if(event.keyCode==13){
	        			 self.page();
	        		}
	        	}
	        };
	        var pagespan=new Span("pageSpan","absolute",150,0);
	        pagespan.innerHTML="OF 111";
	        pagediv.appendChild(pagespan);
	        
	        
	        var imgnext=new ImageButton("nexttbtn","absolute",200,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/next.png");
	        pagediv.appendChild(imgnext);
	        
	        imgnext.events = new OpenLayers.Events(this, imgnext, null, true);
	        imgnext.events.on({ 
	            "click": this.next,
	            scope: this
	        });
	        
	        var imglast=new ImageButton("lastbtn","absolute",250,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/last.png");
	        pagediv.appendChild(imglast);
	        
	        imglast.events = new OpenLayers.Events(this, imglast, null, true);
	        imglast.events.on({ 
	            "click": this.last,
	            scope: this
	        });
	        
	        btn.events = new OpenLayers.Events(this, btn, null, true);
	        btn.events.on({ 
	            "click": this.findPOI,
	            scope: this
	        });
//	        
//	         btn2.events = new OpenLayers.Events(this, btn2, null, true);
//	        btn2.events.on({ 
//	            "click": this.findPOI2,
//	            scope: this
//	        });
	         
	        div.appendChild(titleDiv);
	       
	        div.appendChild(label);
	        div.appendChild(text);
	        div.appendChild(btn);
//	         div.appendChild(btn2);
	        div.appendChild(show);
	        div.appendChild(resultdiv);
	        div.appendChild(pagediv);
	        return div;
	  },
	  activate:function(){
		  this.markerlayer.clearMarkers();
		  OpenLayers.Control.prototype.activate.apply(this, arguments);  
		  this.div.style.display="";
	  },
	  deactivate: function () {
		  this.markerlayer.clearMarkers();
		  OpenLayers.Control.prototype.deactivate.apply(this, arguments);  
		  this.div.style.display="none";
	  }, 
	  first:function(){
		  this.curpage=0;
		  this.findPage();
	  },
	  pre:function(){
		  if(this.curpage>0){
			  this.curpage--;
		  }
		  this.findPage();
	  },
	  last:function(){
		  this.curpage=this.pagecount-1;
		  this.findPage();
	  },
	  next:function(){
		  if(this.curpage<this.pagecount-1){
			  this.curpage++;
		  }
		  this.findPage();
	  },
	  page:function(){ 
		    var page=parseInt($$("pagetext").value)-1;
		    if(page<0){
		    	page=0;
		    }
		    if(page>this.pagecount-1){
		    	page=this.pagecount-1;
		    }
		   
		    this.curpage=page;
		    this.findPage();
		   
	  },
	  
	  findPage:function(){ 
		  document.getElementById("poifinding").style.display="";
		  $$("pagetext").value=this.curpage+1;
		  this.markerlayer.clearMarkers();
		  var self=this;
		  this.markers=[];
		  digitnexus.ajaxRequest('/rest/poi/data/page/' + this.mapname+"/"+this.name,
                  {start:this.curpage*this.rowperpage,count:this.rowperpage},
                  function(response) {
			            var div=self.resultdiv;
			            div.innerHTML="";
			          if(response.length>0){ 
			        	  for(var i=0;i<response.length;i++){ 
			        		  var point=response[i];
			        		  var name=point["name"];
			        		  var loc=point["loc"];
			        		  
			        		  var a=document.createElement("a"); 
			        		  a.href="javascript:void(0);";
			        		  a.innerHTML=(i+1)+"."+name;
			        		  a.points=loc;
			        		  a.id=i+"_marker";
			        		 
			        		  div.appendChild(a);
			        		  
			        		  var h=document.createElement("br");
			        		  div.appendChild(h);
			        		
//			        			var icon = new OpenLayers.Icon("skins/common/images/map/marker"+(i+1)+".png" );
//		     					var marker=new OpenLayers.Marker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
//		     					        new OpenLayers.Projection("EPSG:4326"),
//		     					        self.map.getProjectionObject()
//		     					    ),icon);
//		     					 
		     					var marker=new OpenLayers.Marker.InfoIconMarker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
		     					        new OpenLayers.Projection("EPSG:4326"),
		     					        self.map.getProjectionObject()
		     					    ),"","skins/common/images/map/marker"+(i+1)+".png" ,true,name);
		     					self.markers[a.id]=marker;
		     					 
		     					 a.onclick=function(){ 
					      	           	self.setCenter.call(self,this.points,this.id);
					      	       };
		     					self.markerlayer.addMarker(marker);
			        	  } 
			          }else{
			        	  document.getElementById("resultSpan").innerHTML="<font color='red'>"+map_tool_poiResult+"</font>"; 
	                       setimeoutDN(self.clearContent,1000,self,["resultSpan"]);
			          }
			          document.getElementById("poifinding").style.display="none";
                  },
                  function(xhr, status, exception) { 
                  	document.getElementById("poifinding").style.display="none";
                  	document.getElementById("resultSpan").innerHTML="<font color='red'>"+map_tool_poiError+"</font>";
                  	setimeoutDN(self.clearContent,1000,self,["resultSpan"]);
                  });
	  },
//	   findPOI2:function(){  
//		          var data='{"num":2,"imei":1111,"items":[{"longitude":22,"latitude":22,"accuracy":1,"time_stamp":"2012-10-10 10:10:10"},{"longitude":25,"latitude":25,"accuracy":1,"time_stamp":"2012-11-11 10:11:11"}]}';
//		        	  digitnexus.ajaxPost('/rest/location/mobile/upload' ,
//		        			  data,
//	                    function(response) { 
//		        		  
//	                    },
//	                    function(xhr, status, exception) {  
//	                    }); 
//	  },
	  
	  findPOI:function(){
		   
		  this.rowcount=0;
		  this.pagecount=0;			
		  this.curpage=0;
		  var name=this.text.value;
		  this.name=name;
		  this.mapname=this.map.baseLayer.name;
		  
		  if(name){
			  this.markerlayer.clearMarkers();
			  document.getElementById("poifinding").style.display="";
			  var self=this; 
			      digitnexus.ajaxRequest('/rest/poi/data/count/' +this.mapname+"/"+ name,
	                   null,
	                    function(response) {
			    	    
				             if(response){
				            	 self.rowcount=response;
				            	  
				            	 self.pagecount=parseInt(self.rowcount/self.rowperpage);
				            	 
				            	 if(self.rowcount%self.rowperpage){
				            		 self.pagecount+=1;
				            	 }
				            	 $$("poiPageDiv").style.display="";
				            	 $$("pagetext").value=self.curpage+1;
				            	 $$("pageSpan").innerHTML="OF "+self.pagecount; 
							     self.findPage(); 
				             }else{
				            	 document.getElementById("resultSpan").innerHTML="<font color='red'>"+map_tool_poiResult+"</font>"; 
			                       setimeoutDN(self.clearContent,1000,self,["resultSpan"]); 
					              document.getElementById("poifinding").style.display="none";
				             }
				             
	                    },
	                    function(xhr, status, exception) {   
	                    	document.getElementById("resultSpan").innerHTML="<font color='red'>"+map_tool_poiError+"</font>";
	                    	setimeoutDN(self.clearContent,1000,self,["resultSpan"]);
	                    });
			      
			     
		  }
		  
	  },
	  clearContent:function(span){
		  document.getElementById(span).innerHTML="";
	  },
	  setCenter:function(loc,marker){
		  if(this.lastMarker){
			  this.lastMarker.setImg();
		  }
		   
		  if(marker){
		 
			 this.markers[marker].highImg("skins/common/images/map/marker.png");
			this.lastMarker=this.markers[marker];  
		  }
		 
		  this.map.setCenter(  new OpenLayers.LonLat(loc[0],loc[1]).transform(
			        new OpenLayers.Projection("EPSG:4326"),
			        this.map.getProjectionObject()
			    ));  
	  }
	  
});

 
OpenLayers.Control.GEOMFindPanel = OpenLayers.Class(OpenLayers.Control, { 
	 markerlayer:null,
	 
	 rowcount:null,
	 pagecount:null,
	 rowperpage:10,
	 curpage:null,
	 geo:null,
	 distance:null,
	 name:null,
	 showNear:false,
	 mapname:null,
	 allowSelection:true,
	 vlayer:null,
	 
	 markers:null,
	 lastMarker:null,
	  initialize: function(options) { 
	        OpenLayers.Control.prototype.initialize.apply(this, [options]);
	         
	        this.markerlayer = new OpenLayers.Layer.Markers( "GEOM Marker",{
	        	displayInLayerSwitcher:false
	        } );
	        
	       
	  },
	  createButton:function(left,top){
			var a=document.createElement("a");
			a.href="#";
			a.className="btn_1";
			a.style.position="absolute";
			a.style.left=left;
			a.style.top=top;
			var  span = document.createElement("span");
			var div=document.createElement("div");
			div.className="btn_icon3 icon_search2";
			span.appendChild(div);
			var label=document.createElement("label");
			label.innerHTML=label_search;
			span.appendChild(label);
			a.appendChild(span);
			return a;
		  },
	  draw: function() {
	    	OpenLayers.Control.prototype.draw.apply(this, arguments);  
	        this.map.addLayer(this.markerlayer);
	        var div=this.div;
	         
	        this.divwidth=parseInt(div.style.width);
	       	this.divheight=parseInt(div.style.height);  
	        
	        div.style.backgroundColor="white";
	       
	        if(div.style.filter){
	        	div.style.filter = "alpha(opacity=90)";
	        }else{
	        	div.style.opacity  = "0.9";
	        }
	       
	        var titleDiv=OpenLayers.Util.createAlphaImageDiv("geo_title");
	        titleDiv.innerHTML="<strong>"+map_tool_geoTitle+"</strong>";
	        this.titleDiv=titleDiv;
	        
	        var nearDiv=new Div("geoneardiv","absolute",1,30);
	        nearDiv.style.display="none";
	        var label=new Label("nearlabel","absolute",8,0,30,20,map_tool_nearnSearchLabel);
	        
	        var sel=document.createElement("select");
	        sel.id="nearselect";
	        sel.style.position="absolute";
	        sel.style.left="58px";
	        sel.style.width="100px";
	        var option=new Option("100M","100");
	        sel.options.add(option);
	        
	          option=new Option("200M",200);
	        sel.options.add(option);
	        
	          option=new Option("500M",500);
	        sel.options.add(option);
	        
	          option=new Option("1000M",1000);
	          sel.options.add(option);
	        
	          var label2=new Label("nearlabel","absolute",8,30,40,20,map_tool_poiLabel); 
		        var text=new InputText("nearfindtext","absolute",58,30,100);
		      
		      var btn=this.createButton("170px","28px");  //new ImageButton("nearbtn","absolute",198,0);
		      btn.style.width="100px";
		      btn.events = new OpenLayers.Events(this, btn, null, true);
		        btn.events.on({ 
		            "click": this.findPOI,
		            scope: this
		        });
		        
		        var checkbox=document.createElement("input");		        
		        checkbox.id="fromgoogle";
		        checkbox.type="checkbox";
		        checkbox.style.position="absolute";
		        checkbox.style.left="263px";
		        checkbox.text="GMAP";
		      nearDiv.appendChild(label);
		      nearDiv.appendChild(sel);
		      nearDiv.appendChild(label2);
		      nearDiv.appendChild(text);
		      nearDiv.appendChild(btn);
		    //  nearDiv.appendChild(checkbox);
		      
	        var show=new ImageButton("geofinding","absolute",260,30,null,null,"skins/common/images/map/loading.gif");
	        show.style.display="none";
	        
	        var resultdiv=new Div("georesultDiv","absolute",9,85,this.divwidth-36,this.divheight-141);
	        //resultdiv.style.border="1px solid blue";
	        this.resultdiv=resultdiv;
	        
	        
	        var pagediv=new Div("geoPageDiv","absolute",10,this.divheight-34,this.divwidth-20,20);
	        pagediv.style.display="none";
	       // pagediv.style.border="1px solid blue";
	        
	        var span=new Span("georesultSpan",null,10,0);
	        pagediv.appendChild(span);
	        
	        
	        var imgfirst=new ImageButton("geofirstbtn","absolute",10,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/first.png");
	        pagediv.appendChild(imgfirst);
	        imgfirst.events = new OpenLayers.Events(this, imgfirst, null, true);
	        imgfirst.events.on({ 
	            "click": this.first,
	            scope: this
	        });
	        
	        var imgpre=new ImageButton("geoprebtn","absolute",40,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/prev.png");
	        pagediv.appendChild(imgpre);
	        
	        imgpre.events = new OpenLayers.Events(this, imgpre, null, true);
	        imgpre.events.on({ 
	            "click": this.pre,
	            scope: this
	        });
	        
	        var labelPage=new Span("geopagelabel","absolute",90,0,20,20); 
	        labelPage.innerHTML="Page";
	        pagediv.appendChild(labelPage);
	        
	        var page=new InputText("geopagetext","absolute",120,0,20,12);
	        pagediv.appendChild(page);
	        var self=this;
	        page.onkeydown=function(e){
	        	if(e){
	        		if(e.keyCode==13){
	        		 
	        		     self.page();
	        		}
	        	}else{
	        		if(event.keyCode==13){
	        			 self.page();
	        		}
	        	}
	        };
	        var pagespan=new Span("geopageSpan","absolute",150,0);
	        pagespan.innerHTML="OF 111";
	        pagediv.appendChild(pagespan);
	        
	        
	        var imgnext=new ImageButton("geonexttbtn","absolute",200,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/next.png");
	        pagediv.appendChild(imgnext);
	        
	        imgnext.events = new OpenLayers.Events(this, imgnext, null, true);
	        imgnext.events.on({ 
	            "click": this.next,
	            scope: this
	        });
	        
	        var imglast=new ImageButton("geolastbtn","absolute",250,0,null,null,"skins/"+CURRENT_SKIN_DIR+"/images/common/page/last.png");
	        pagediv.appendChild(imglast);
	        
	        imglast.events = new OpenLayers.Events(this, imglast, null, true);
	        imglast.events.on({ 
	            "click": this.last,
	            scope: this
	        });
	        
	        
	        div.appendChild(titleDiv);
	       
	        div.appendChild(nearDiv);
	        div.appendChild(show);
	        div.appendChild(resultdiv);
	        div.appendChild(pagediv);
	        return div;
	  },
	   
	  activate:function(){
		  this.markerlayer.clearMarkers();
		 
		  OpenLayers.Control.prototype.activate.apply(this, arguments);  
		  this.div.style.display="";
		  if(this.showNear){
			  $$("geoneardiv").style.display="";
			  this.resultdiv.style.top="85px";
			  this.titleDiv.innerHTML="<strong>"+map_tool_nearTitle+"</strong>";
		  }else{
			  $$("geoneardiv").style.display="none";
			  this.resultdiv.style.top="55px";
			  this.titleDiv.innerHTML="<strong>"+map_tool_geoTitle+"</strong>";
		  }
	  },
	  deactivate: function () {
		  this.markerlayer.clearMarkers();
		  this.vlayer.removeAllFeatures();
		  OpenLayers.Control.prototype.deactivate.apply(this, arguments);  
		  this.div.style.display="none";
	  }, 
	  first:function(){
		  this.curpage=0;
		  this.findPage();
	  },
	  pre:function(){
		  if(this.curpage>0){
			  this.curpage--;
		  }
		  this.findPage();
	  },
	  last:function(){
		  this.curpage=this.pagecount-1;
		  this.findPage();
	  },
	  next:function(){
		  if(this.curpage<this.pagecount-1){
			  this.curpage++;
		  }
		  this.findPage();
	  },
	  page:function(){ 
		    var page=parseInt($$("geopagetext").value)-1;
		    if(page<0){
		    	page=0;
		    }
		    if(page>this.pagecount-1){
		    	page=this.pagecount-1;
		    }
		   
		    this.curpage=page;
		    this.findPage();
		   
	  },
	  
	  findPage:function(){
		  document.getElementById("geofinding").style.display="";
		  $$("geopagetext").value=this.curpage+1;
		  this.markerlayer.clearMarkers();
		  var self=this;
		  var data=null;
		  this.markers=[];
		     if(this.showNear){
		    	 var dis=$$("nearselect").options[$$("nearselect").selectedIndex].value;
		    	 var name=$$("nearfindtext").value;
		    	 var fg=0;
		    	//  var fg=$$("fromgoogle").checked?1:0;
		    	 data={start:this.curpage*this.rowperpage,count:this.rowperpage,dis:dis,name:name,fromgoogle:fg};
		     }else{
		    	 data={start:this.curpage*this.rowperpage,count:this.rowperpage};
		     }
		  digitnexus.ajaxRequest('/rest/poi/geo/page/' +this.mapname+"/"+ this.geo,
                data,
                 function(response) {
			            var div= document.getElementById("georesultDiv");
			            div.innerHTML="";
			          if(response.length>0){ 
			        	  for(var i=0;i<response.length;i++){ 
			        		  var point=response[i];
			        		  var name=point["name"];
			        		  var loc=point["loc"];
			        		  
			        		  var a=document.createElement("a"); 
			        		  a.href="javascript:void(0);";
			        		  a.innerHTML=(i+1)+"."+name;
			        		  a.points=loc;
			        		  a.id=i+"_marker";
			        		  a.onclick=function(){ 
				      	           	self.setCenter.call(self,this.points,this.id);
				      	       };
			        		  div.appendChild(a);
			        		  
			        		  var h=document.createElement("br");
			        		  div.appendChild(h);
			        		  
//			        			var icon = new OpenLayers.Icon("skins/common/images/map/marker"+(i+1)+".png" );
//		     					var marker=new OpenLayers.Marker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
//		     					        new OpenLayers.Projection("EPSG:4326"),
//		     					        self.map.getProjectionObject()
//		     					    ),icon);
//		     					 
		     					var marker=new OpenLayers.Marker.InfoIconMarker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
		     					        new OpenLayers.Projection("EPSG:4326"),
		     					        self.map.getProjectionObject()
		     					    ),"","skins/common/images/map/marker"+(i+1)+".png" ,true,name);
		     					self.markers[a.id]=marker;
		     					self.markerlayer.addMarker(marker);
			        	  } 
			          }else{
			        	  document.getElementById("georesultSpan").innerHTML="<font color='red'>"+map_tool_poiResult+"</font>"; 
	                       setimeoutDN(self.clearContent,1000,self,["georesultSpan"]);
			          }
			          document.getElementById("geofinding").style.display="none";
                 },
                 function(xhr, status, exception) { 
                 	document.getElementById("geofinding").style.display="none";
                 	document.getElementById("georesultSpan").innerHTML="<font color='red'>"+map_tool_poiError+"</font>";
                 	setimeoutDN(self.clearContent,1000,self,["georesultSpan"]);
                 });
	  },
	  
	  findPOI:function(){
		 
		  this.rowcount=0;
		  this.pagecount=0;			
		  this.curpage=0;
		  this.mapname=this.map.baseLayer.name;
		  
		  if(this.geo){
			  this.markerlayer.clearMarkers();
			  document.getElementById("geofinding").style.display="";
			  var self=this;
			  var data=null;
			     if(this.showNear){
			    	 var dis=$$("nearselect").options[$$("nearselect").selectedIndex].value;
			    	 var name=$$("nearfindtext").value;
			    	// var fg=$$("fromgoogle").checked?1:0;
			    	 var fg=0;
			    	 data={dis:dis,name:name,fromgoogle:fg}; 
			     }
			     
			      digitnexus.ajaxRequest('/rest/poi/geo/count/' + self.mapname+"/"+this.geo,
			    		  data,
	                    function(response) {
			    	    
				             if(response){
				            	 self.rowcount=response;
				            	  
				            	 self.pagecount=parseInt(self.rowcount/self.rowperpage);
				            	 
				            	 if(self.rowcount%self.rowperpage){
				            		 self.pagecount+=1;
				            	 }
				            	 $$("geoPageDiv").style.display="";
				            	 $$("geopagetext").value=self.curpage+1;
				            	 $$("geopageSpan").innerHTML="OF "+self.pagecount; 
							     self.findPage(); 
				             }else{
				            	 document.getElementById("georesultSpan").innerHTML="<font color='red'>"+map_tool_poiResult+"</font>"; 
			                       setimeoutDN(self.clearContent,1000,self,["georesultSpan"]); 
					              document.getElementById("geofinding").style.display="none";
				             }
				             
	                    },
	                    function(xhr, status, exception) {   
	                    	document.getElementById("georesultSpan").innerHTML="<font color='red'>"+map_tool_poiError+"</font>";
	                    	setimeoutDN(self.clearContent,1000,self,["georesultSpan"]);
	                    });
			      
			     
		  }
		  
	  },
	  clearContent:function(span){
		  document.getElementById(span).innerHTML="";
	  },
	  setCenter:function(loc,marker){ 
		  
		  if(this.lastMarker){
			  this.lastMarker.setImg();
		  }
		   
		  if(marker){ 
			 this.markers[marker].highImg("skins/common/images/map/marker.png");
			this.lastMarker=this.markers[marker];  
		  }
		 
		  this.map.setCenter(  new OpenLayers.LonLat(loc[0],loc[1]).transform(
			        new OpenLayers.Projection("EPSG:4326"),
			        this.map.getProjectionObject()
			    ));  
	  }
	  
});




OpenLayers.Control.NAVFindPanel = OpenLayers.Class(OpenLayers.Control, { 
	 
	 markerlayer:null,
	 
	 lineLayer:null,
	 
	 startpoint:null,
	 endpoint:null,
	 mapname:null,
	 allowSelection:true,
	 markers:null,
	 lastMarker:null,
	 
	 
	  initialize: function(options) { 
	        OpenLayers.Control.prototype.initialize.apply(this, [options]);
	        
	        var style= new OpenLayers.Style({
				  strokeColor: "#FF00FF",
				  strokeWidth:2,
				  fillColor:'white',
				  fillOpacity:.3,
				  strokeOpacity:.8 
			});
	      
	        this.lineLayer = new OpenLayers.Layer.Vector("Line Layer",{
	        	displayInLayerSwitcher:false,
          		styleMap:new OpenLayers.StyleMap({
         			 "default": style
         		})}); 
	        this.markerlayer = new OpenLayers.Layer.Markers( "GEOM Marker", {
	        	displayInLayerSwitcher:false
	        });
	        
	        
	  },
	  createButton:function(left,top,label_text){
			var a=document.createElement("a");
			a.href="#";
			a.className="btn_1";
			a.style.position="absolute";
			a.style.left=left;
			a.style.top=top;
			var  span = document.createElement("span");
			var div=document.createElement("div");
			div.className="btn_icon3 icon_search2";
			span.appendChild(div);
			var label=document.createElement("label");
			label.innerHTML=label_text;
			span.appendChild(label);
			a.appendChild(span);
			return a;
		  },
		  
		  
	  draw: function() {
	    	OpenLayers.Control.prototype.draw.apply(this, arguments);  
	    	 
		        
		        this.map.addLayer(this.lineLayer);
	            this.map.addLayer(this.markerlayer);
	         
	        var div=this.div;
	        
	        	this.divwidth=parseInt(div.style.width); 
	        
	        	this.divheight=parseInt(div.style.height);  
	        
	        div.style.backgroundColor="white";
	       
	        if(div.style.filter){
	        	div.style.filter = "alpha(opacity=90)";
	        }else{
	        	div.style.opacity  = "0.9";
	        }
	       
	        var titleDiv=OpenLayers.Util.createAlphaImageDiv("nav_title");
	        titleDiv.innerHTML="<strong>"+map_tool_navFindTitle+"</strong>";
	        
	        
	        var pointDiv=new Div("navpointdiv","absolute",1,30);
	        var navlineDiv=new Div("navlinediv","absolute",1,30,this.divwidth-20,this.divheight-30);
	        navlineDiv.style.display="none";
	        var navlineDivCon=new Div("navlinedivcon","absolute",1,1,this.divwidth-20,this.divheight-70);
	        navlineDivCon.style.overflowY="auto";
	       
	        var nearDiv=new Div("navdiv","absolute",1,1);
	       
	        var label=new Label("navstartlabel","absolute",10,0,60,20,map_tool_navStartPoint);
	        var text=new InputText("navstarttext","absolute",70,1,100); 
	        
	          var label2=new Label("navendlabel","absolute",10,30,60,20,map_tool_navEndPoint); 
		        var text2=new InputText("navendtext","absolute",70,30,100);
		      
		      var btn=this.createButton("180px","30px",label_search);     //new ImageButton("nearbtn","absolute",180,30);
		      btn.style.width="100px";
		      btn.events = new OpenLayers.Events(this, btn, null, true);
		        btn.events.on({ 
		            "click": this.findPOI,
		            scope: this
		        });
		        
		       
		      nearDiv.appendChild(label);
		      nearDiv.appendChild(text);
		      nearDiv.appendChild(label2);
		      nearDiv.appendChild(text2);
		      nearDiv.appendChild(btn);
		       
		      pointDiv.appendChild(nearDiv);
	        var show=new ImageButton("navfinding","absolute",200,0,null,null,"skins/common/images/map/loading.gif");
	        show.style.display="none";
	        pointDiv.appendChild(show);
	        
	        var h=(this.divheight-160)/2;
	        
	        var labelstart=new Label("navstart","absolute",8,60,70,20,map_tool_navStartPoint);
	        var resultdiv=new Div("navstartresultDiv","absolute",8,81,this.divwidth-36,h-26);
	        //resultdiv.style.border="1px solid blue";
	        resultdiv.style.overflowX="auto";
	        var labelend=new Label("navend","absolute",8,h+75,70,20,map_tool_navEndPoint);
	        var resultdiv2=new Div("navendresultDiv","absolute",8,h+96,this.divwidth-36,h-26);
	        //resultdiv2.style.border="1px solid blue";
	        resultdiv2.style.overflowY="auto";
	        
	        
	        var btn2=this.createButton(this.divwidth-100+"px",this.divheight-68+"px",label_nav);        //new ImageButton("navbtn","absolute",this.divwidth-71,this.divheight-68);
	        btn2.style.width="100px";
	        btn2.events = new OpenLayers.Events(this, btn2, null, true);
	        btn2.events.on({ 
		            "click": this.findNAV,
		            scope: this
		        });
		       
	        var btn3=new ImageButton("prebtn","absolute",this.divwidth-31,this.divheight-70,null,null,"skins/common/images/map/arrow-left.png");
	        btn3.events = new OpenLayers.Events(this, btn3, null, true);
	        btn3.events.on({ 
		            "click": this.showPoint,
		            scope: this
		      });
		        
	        navlineDiv.appendChild(btn3);
	        navlineDiv.appendChild(navlineDivCon);
	        pointDiv.appendChild(resultdiv); 
	        pointDiv.appendChild(resultdiv2); 
	        pointDiv.appendChild(labelstart); 
	        pointDiv.appendChild(labelend); 
	        pointDiv.appendChild(btn2); 
		       
	        div.appendChild(titleDiv);
	       
	        div.appendChild(pointDiv);
	        div.appendChild(navlineDiv);
	        
	        return div;
	  },
	   
	  activate:function(){
		  this.lineLayer.removeAllFeatures();
		  this.markerlayer.clearMarkers();
		  OpenLayers.Control.prototype.activate.apply(this, arguments);  
		  this.div.style.display="";
		  
	  },
	  deactivate: function () {
		  this.lineLayer.removeAllFeatures();
		  this.markerlayer.clearMarkers();
		  OpenLayers.Control.prototype.deactivate.apply(this, arguments);  
		  this.div.style.display="none";
	  }, 
	   
	  showPoint:function(){
		  this.startpoint=null,
			 this.endpoint=null,
		  document.getElementById("navlinediv").style.display="none";
		  document.getElementById("navpointdiv").style.display="";
	  },
	  findNAV:function(){ 
		   
		  if(!this.startpoint||!this.endpoint){ 
			  return ;
		  }
		 
		  var endpoints=[];
		  for(var i=0;i<this.endpoint.length;i++){
			  endpoints.push(this.endpoint[i][0]);
			  endpoints.push(this.endpoint[i][1]);
			  endpoints.push("0");
		  }
		  var self=this;
		  digitnexus.ajaxRequest('/rest/route/'+this.mapname+"/"+this.startpoint[0]+","+this.startpoint[1]+",0,"+endpoints.join(",") ,
	                {reorder:1,toll:1,multi:1,fromlocal:1},
	                 function(response) {
	                	   
	                    	 $$("navpointdiv").style.display="none"; 
				            var div= document.getElementById("navlinediv");
				            div.style.display="";
				            div= document.getElementById("navlinedivcon"); 
				            div.innerHTML="";
				            var html=[];
				            self.lineLayer.removeAllFeatures();
				            if(!response||response.length==0){
				            	   html.push("没有数据"); 
				            }
				           for(var i=0;i<response.length;i++){
				        	   var route=response[i]; 
				        	   if(!route||route.length==0){
				        		   html.push("没有数据"); 
				        		   div.innerHTML=html.join(" ");
							          document.getElementById("navfinding").style.display="none";
				                 return;
				        	   }else{
				        	   var sum=route.summary;
				        	   var bound=route.boundstr;
				        	   var legs=route.legs;
				        	//   console.log(route);
				        	   html.push("<a href='javascript:void(0)' >"+sum+"</a><br/>"); 
				        	   for(var j=0;j<legs.length;j++){
				        		   var leg=legs[j];
				        		   var distance=leg.distanceStr;
				        		   var duration=leg.durationStr;
				        		   var start_add=leg.start_address;
				        		   var  end_add=leg.end_address;
				        		   var steps=leg.steps;
				        		   html.push("<a href='javascript:void(0)' > distance:"+distance+" duration:"+duration+"<br/> start_address:"+start_add+" end_address"+end_add+"</a><br/>");
				        		  for(var k=0;k<steps.length;k++){
				        			  var step=steps[k];
				        			  var road=step.road;
				        			  var points=step.points;
				        			  html.push("<a href='javascript:void(0)' >"+road+"</a><br/>");
				        			  var pointa=points.split(";");
				        			  var lonlats=[];
				        			  
				        			  for(var m=0;m<pointa.length;m++){
				        				  var point=pointa[m].split(","); 
				        				 var lonlat= new OpenLayers.LonLat(point[0],point[1]).transform(
					     					        new OpenLayers.Projection("EPSG:4326"),
					     					        self.map.getProjectionObject()
					     					    );
				        				 lonlats.push(new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat));
				        			  }
				        			  var linear_string = new OpenLayers.Geometry.LineString(lonlats);
				        		//	  console.log(linear_string);
				        			   var  polylineFeature = new OpenLayers.Feature.Vector(  linear_string);
				        			    self.lineLayer.addFeatures([polylineFeature]);
				        		  } 
				        	   }
				        	   }
				           }
				           div.innerHTML=html.join(" ");
				          document.getElementById("navfinding").style.display="none";
	                 },
	                 function(xhr, status, exception) { 
	                 	document.getElementById("navfinding").style.display="none"; 
	                 });
			  
		  
	  },
	  findPOI:function(){ 
		  this.startpoint=null;
		  this.endpoint=null;
		  document.getElementById("navfinding").style.display="";
		  this.lineLayer.removeAllFeatures();
		  this.markerlayer.clearMarkers();
		  var self=this;
		  if(!$$("navstarttext").value||!$$("navendtext").value){
			  return ;
		  }
		  this.markers=[];
		    	var data={start:0,count:100};
		    	this.mapname=this.map.baseLayer.mapname;
		  digitnexus.ajaxRequest('/rest/poi/data/page/'+this.mapname+"/"+ $$("navstarttext").value,
                data,
                 function(response) {
			            var div= document.getElementById("navstartresultDiv");
			            div.innerHTML="";
			          if(response.length>0){ 
			        	  for(var i=0;i<response.length;i++){ 
			        		  var point=response[i];
			        		  var name=point["name"];
			        		  var loc=point["loc"];
			        		  
			        		  var a=document.createElement("a"); 
			        		  a.href="javascript:void(0);";
			        		  a.innerHTML=(i+1)+"."+name;
			        		  a.points=loc;
			        		  a.id=i+"_stratmarker";
			        		  a.onclick=function(){ 
				      	           	self.setCenter.call(self,this.points,this.id);
				      	       };
			        		  div.appendChild(a);
			        		  
			        		  var h=document.createElement("br");
			        		  div.appendChild(h);
			        		  
//			        			var icon = new OpenLayers.Icon("skins/common/images/map/marker.png" );
//		     					var marker=new OpenLayers.Marker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
//		     					        new OpenLayers.Projection("EPSG:4326"),
//		     					        self.map.getProjectionObject()
//		     					    ),icon);
		     					 
			        		  var marker=new OpenLayers.Marker.InfoIconMarker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
		     					        new OpenLayers.Projection("EPSG:4326"),
		     					        self.map.getProjectionObject()
		     					    ),"","skins/common/images/map/marker"+(i+1)+".png" ,true,name);
			        		 self.markers[a.id]=marker;
		     					self.markerlayer.addMarker(marker);
			        	  } 
			          } 
			          document.getElementById("navfinding").style.display="none";
                 },
                 function(xhr, status, exception) { 
                 	document.getElementById("navfinding").style.display="none";
                  
                 });
		  
		  digitnexus.ajaxRequest('/rest/poi/data/page/' +this.mapname+"/"+ $$("navendtext").value,
	                data,
	                 function(response) {
				            var div= document.getElementById("navendresultDiv");
				            div.innerHTML="";
				          if(response.length>0){ 
				        	  for(var i=0;i<response.length;i++){ 
				        		  var point=response[i];
				        		  var name=point["name"];
				        		  var loc=point["loc"];
				        		  
				        		  var a=document.createElement("a"); 
				        		  a.href="javascript:void(0);";
				        		  a.innerHTML=(i+1)+"."+name;
				        		  a.points=loc;
				        		  a.id=i+"_endmarker";
				        		  a.onclick=function(){ 
					      	           	self.setCenter.call(self,this.points,this.id,true);
					      	       };
				        		  div.appendChild(a);
				        		  
				        		  var h=document.createElement("br");
				        		  div.appendChild(h);
				        		  
//				        			var icon = new OpenLayers.Icon("skins/common/images/map/marker"+(i+1)+".png" );
//			     					var marker=new OpenLayers.Marker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
//			     					        new OpenLayers.Projection("EPSG:4326"),
//			     					        self.map.getProjectionObject()
//			     					    ),icon);
			     					
			     					 var marker=new OpenLayers.Marker.InfoIconMarker(new OpenLayers.LonLat(loc[0],loc[1]).transform(
				     					        new OpenLayers.Projection("EPSG:4326"),
				     					        self.map.getProjectionObject()
				     					    ),"","skins/common/images/map/marker"+(i+1)+".png" ,true,name);
			     					 self.markers[a.id]=marker;
			     					self.markerlayer.addMarker(marker);
				        	  } 
				          } 
				          document.getElementById("navfinding").style.display="none";
	                 },
	                 function(xhr, status, exception) { 
	                 	document.getElementById("navfinding").style.display="none";
	                  
	                 });
	  },
	  
	 
	  clearContent:function(span){
		  document.getElementById(span).innerHTML="";
	  },
	  setCenter:function(loc,marker,b){ 
		  if(b){ 
			  if(!this.endpoint){
				  this.endpoint=[];
				  this.endpoint.push(loc);
			  }else{
				  for(var i=0;i<this.endpoint.length;i++){
					 if(this.endpoint[i]==loc){
						 return ;
					 }
				  }
				  this.endpoint.push(loc);
			  } 
			  if(marker){
				  this.markers[marker].highImg("skins/common/images/map/marker.png");
			  }
		  }else{ 
			  if(this.lastMarker){
				  this.lastMarker.setImg();
			  }
			  if(marker){
				  this.markers[marker].highImg("skins/common/images/map/marker.png");
				  this.lastMarker=this.markers[marker];
			  }
			  this.startpoint=loc;
		  }
		  
		  this.map.setCenter(  new OpenLayers.LonLat(loc[0],loc[1]).transform(
			        new OpenLayers.Projection("EPSG:4326"),
			        this.map.getProjectionObject()
			    ));  
	  }
	  
});
 
OpenLayers.Control.MapToolbar = OpenLayers.Class(OpenLayers.Control, {

    divleft:null,
    divtop:null, 
    controls:null,
    makerLayer:null,  
    ruleMLayer:null,
    showTool:true,
    showFind:false,
    showEdit:true,
    showLayerSwitch:true,
    vlayer:null,
    ruleVLayer:null,
    buttons:null,
    
    initialize: function(options) { 
    	 
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        this.controls={};
        
      
        if(this.showTool){ 
	        	this.editlayer=new OpenLayers.Layer.Vector("edit layer",{ 
	        		displayInLayerSwitcher:false,
	        		styleMap:new OpenLayers.StyleMap({
	        			 "default": style
	        		})
	        	}); 
	        this.controls["pan"]=new OpenLayers.Control.Navigation();
	        this.controls["zoomin"]=new OpenLayers.Control.ZoomBox();
	        this.controls["zoomout"]=new OpenLayers.Control.ZoomBox({
	        	out:true
	        }); 
	        this.controls["rule"]= new OpenLayers.Control.Measure(
				    OpenLayers.Handler.Path, {
					persist: true,
					handlerOptions:{
						displayInLayerSwitcher:false,
						layerOptions:{
							styleMap: editstyle 
						}
					}
				    }
				); 
	        
	       
	        this.controls["rule"].events.on({
			    "measure": this.handleRuleEnd,
			    "measurepartial": this.handleRule,
			    scope:this
			});
	        
	        this.controls["area"]= new OpenLayers.Control.Measure(
				    OpenLayers.Handler.Polygon, {
					persist: true,
					handlerOptions:{
						displayInLayerSwitcher:false,
						layerOptions:{
							styleMap: editstyle
						}
					}
				    }
				);
	       
	        
	       
	        this.controls["area"].events.on({
			    "measure": this.handleAreaEnd,
			    "measurepartial": this.handleArea,
			    scope:this
			});
	         
        }
        
        if(this.showFind){
        	  if(!this.vlayer){
        		  this.vlayer=new OpenLayers.Layer.Vector("find layer",{
        			  displayInLayerSwitcher:false,
              		styleMap:new OpenLayers.StyleMap({
              			 "default": style
              		})
              	});
        	  }
        	//  this.controls["poi"]=new OpenLayers.Control.POIFindPanel(); 
        	   this.controls["rectsearch"]= new OpenLayers.Control.DrawFeature(this.vlayer,
      			    OpenLayers.Handler.RegularPolygon ,{handlerOptions: {
      			    	displayInLayerSwitcher:false,
      			    	layerOptions:{
							styleMap: editstyle
						},
      			    	sides: 4,irregular: true}}
      		  ); 
        	  this.controls["rectsearch"].events.on({
      		    "featureadded": this.handleRectSearch, 
      		    "deactivate":this.hideGeoControl,
      		    scope:this
      		});
        	  this.controls["circlesearch"]= new OpenLayers.Control.DrawFeature(this.vlayer,
        			  OpenLayers.Handler.RegularPolygon,{handlerOptions: {
        				  displayInLayerSwitcher:false,
        				  layerOptions:{
  							styleMap: editstyle
     						},
        				  sides: 40}} 
        		  ); 
          	  this.controls["circlesearch"].events.on({
        		    "featureadded": this.handleRectSearch, 
        		    "deactivate":this.hideGeoControl,
        		    scope:this
        		}); 
          	  this.controls["polygonsearch"]= new OpenLayers.Control.DrawFeature(this.vlayer,
          			  OpenLayers.Handler.Polygon ,{handlerOptions: {
        				  displayInLayerSwitcher:false,
        				  layerOptions:{
  							styleMap: editstyle
  						} }} 
        		  ); 
          	  this.controls["polygonsearch"].events.on({
        		    "featureadded": this.handleRectSearch, 
        		    "deactivate":this.hideGeoControl,
        		    scope:this
        		});
          	  
          	 this.controls["nearsearch"]= new OpenLayers.Control.DrawFeature(this.vlayer,
         			  OpenLayers.Handler.Point ,{handlerOptions: {
        				  displayInLayerSwitcher:false,
        				  layerOptions:{
  							styleMap: editstyle
  						} }} 
       		  ); 
         	  this.controls["nearsearch"].events.on({
       		    "featureadded": this.handleRectSearch, 
       		    "deactivate":this.hideGeoControl,
       		    scope:this
       		});
         	  
       //  	 this.controls["navfind"]=new OpenLayers.Control.NAVFindPanel(); 
      		 
        }
        if(this.showEdit){
        	if(!this.editlayer){
	        	this.editlayer=new OpenLayers.Layer.Vector("edit layer",{ 
	        		displayInLayerSwitcher:false,
	        		styleMap:new OpenLayers.StyleMap({
	        			 "default": style
	        		})
	        	});
        	}
             this.controls["point"]= new OpenLayers.Control.DrawFeature(this.editlayer,OpenLayers.Handler.Point); 
            
             this.controls["point"].events.on({
     		    "featureadded": this.handleAddGeometryEnd, 
     		    scope:this
     		});
             
             this.controls["path"]= new OpenLayers.Control.DrawFeature(this.editlayer,
      			    OpenLayers.Handler.Path  ,{handlerOptions: {
      			    	layerOptions:{
      			    	displayInLayerSwitcher:false, 
							styleMap: editstyle 
      			    	} }}
      			); 
             
              this.controls["path"].events.on({
      		    "featureadded": this.handleAddGeometryEnd, 
      		    scope:this
      		});
              
              this.controls["polygon"]= new OpenLayers.Control.DrawFeature(this.editlayer,
       			    OpenLayers.Handler.Polygon  ,{handlerOptions: {
      			    	layerOptions:{
          			    	displayInLayerSwitcher:false, 
    							styleMap: editstyle 
          			    	} }}
       			); 
              
               this.controls["polygon"].events.on({
       		    "featureadded": this.handleAddGeometryEnd, 
       		    scope:this
       		});
               
               
               this.controls["circle"]= new OpenLayers.Control.DrawFeature(this.editlayer,
          			    OpenLayers.Handler.RegularPolygon,{handlerOptions: { sides: 40,
          			    	layerOptions:{
              			    	displayInLayerSwitcher:false, 
        							styleMap: editstyle 
              			    	} }} 
          			); 
                 
                  this.controls["circle"].events.on({
          		    "featureadded": this.handleAddGeometryEnd, 
          		    scope:this
          		});
               
                  this.controls["rect"]= new OpenLayers.Control.DrawFeature(this.editlayer,
            			    OpenLayers.Handler.RegularPolygon ,{handlerOptions: { sides: 4,irregular: true,
            			    	layerOptions:{
                  			    	displayInLayerSwitcher:false, 
            							styleMap: editstyle 
                  			    	} }}
            			); 
                   
                    this.controls["rect"].events.on({
            		    "featureadded": this.handleAddGeometryEnd, 
            		    scope:this
            		});
                  
             
        }
        this.makerLayer=new OpenLayers.Layer.Markers("merr",{
        	displayInLayerSwitcher:false
        });
        
        this.ruleVLayer=new OpenLayers.Layer.Vector("edit layer",{ 
    		displayInLayerSwitcher:false,
    		styleMap:new OpenLayers.StyleMap({
    			 "default": style
    		})
    	});
        
        this.ruleMLayer=new OpenLayers.Layer.Markers("merr",{
        	displayInLayerSwitcher:false
        });
    },
    
     
    showUL:function(){
    	this.ui.style.display="";
    },
    hideUL:function(){
    	this.ui.style.display="none";
    },
    hideUL2:function(event){
    	var location=OpenLayers.Util.pagePosition(this.div);
    	var left=location[0]+5;
    	var top=location[1]+5;
    	var width=this.div.offsetWidth-10;
    	 
    	 
    	var x=event.clientX;
    	var y=event.clientY;
    	 
    	if(x<left||x>left+width||y<top){
    		this.ui.style.display="none";
    	}
    	
    },
    draw: function() {
    	OpenLayers.Control.prototype.draw.apply(this, arguments);  
        this.buttons = {};
        var div=this.div; 
        div.className="map_toolbar"; 
        div.style.zIndex=1100;
        
        if(this.showLayerSwitch){
	    	   
	    	   this.map.events.on({
	               "addlayer": this.drawLayerContron,
	               "changelayer": this.drawLayerContron,
	               "removelayer": this.drawLayerContron,
	               "changebaselayer": this.drawLayerContron,
	               scope: this
	           });
	    	   
	    		var layersDiv=this._addDiv("layersDiv","map_toolbar_right map_toolbar_item","",this.div);
	            var layersDivIcon=this._addDiv("layersDivIcon","map_toolbar_icon layer","",layersDiv);
	      	     
	       	    var layersDivText=this._addDiv("layersDivText","map_toolbar_text",map_tool_layerTitle,layersDiv);
	       	    var layersDivExendDiv=this._addDiv("layersDivExendDiv","map_toolbar_expand","",layersDiv);
	       	    var layersDivDropDiv=this._addDiv("layersDivDropDiv","map_toolbar_dropdownBox layer_control_dropdown","",layersDiv);
	       	    this.ul=document.createElement("ul");
	    	    layersDivDropDiv.appendChild(this.ul); 
	    	    this.ul.style.display="none";
	    	    var context = {
	                    'ui': this.ul,
	                    'div':layersDiv
	                };
	                OpenLayers.Event.observe(layersDiv, "mouseover", 
	                    OpenLayers.Function.bindAsEventListener(this.showUL,
	                                                            context)
	                ); 
	                OpenLayers.Event.observe(layersDiv, "mouseout", 
	                        OpenLayers.Function.bindAsEventListener(this.hideUL2,
	                                                                context)
	                    ); 
	   	           OpenLayers.Event.observe(this.ul, "mouseout",  
	   	    		 OpenLayers.Function.bindAsEventListener(this.hideUL,
	                    context));
	       }
	     
        
        var toolbarDiv=this._addDiv("toolBar","map_toolbar_right map_toolbar_item","",this.div);
       
        var toolbarDivIcon=this._addDiv("toolbarDivIcon","map_toolbar_icon tool","",toolbarDiv);
  	     
   	    var toolbarDivText=this._addDiv("toolbarDivText","map_toolbar_text",map_tool_toolTitle,toolbarDiv);
   	    var toolbarDivExendDiv=this._addDiv("toolbarDivExendDiv","map_toolbar_expand","",toolbarDiv);
   	    var toolbarDivDropDiv=this._addDiv("toolbarDivDropDiv","map_toolbar_dropdownBox tool_dropdown","",toolbarDiv);
   	    var ul=document.createElement("ul");
   	    ul.id="toolBarChildUL";
	     toolbarDivDropDiv.appendChild(ul);
	     ul.style.display="none";
	     
	     
	      var context = {
                 'ui': ul,
                 'div':toolbarDiv
             };
             OpenLayers.Event.observe(toolbarDiv, "mouseover", 
                 OpenLayers.Function.bindAsEventListener(this.showUL,
                                                         context)
             ); 
             OpenLayers.Event.observe(toolbarDiv, "mouseout", 
                     OpenLayers.Function.bindAsEventListener(this.hideUL2,
                                                             context)
                 ); 
	     OpenLayers.Event.observe(ul, "mouseout",  
	    		 OpenLayers.Function.bindAsEventListener(this.hideUL,
                 context));
	     
	    
       if(this.showTool){  
    	 if(this.vlayer!=null){
    	   this.map.addLayer(this.vlayer);
    	 }
   	     var li=document.createElement("li");
   	    ul.appendChild(li);
   	    
   	    var panDiv=this._addButton("pan","","",li);
   	    var panDivIcon=this._addDiv("panDivIcon","map_toolbar_dropdownBox_icon pan","",panDiv);
   	    var panDivText=this._addDiv("panDivIcon","map_toolbar_dropdownBox_text", map_tool_panTitle,panDiv);
   	    
   	     
   	   li=document.createElement("li");
	    ul.appendChild(li); 
	    var zoomInDiv=this._addButton("zoomin","","",li);
	    var zoomInDivIcon=this._addDiv("zoomInDivIcon","map_toolbar_dropdownBox_icon zoom_in","",zoomInDiv);
	    var zoomInDivText=this._addDiv("zoomInDivText","map_toolbar_dropdownBox_text", map_tool_zoomInTitle,zoomInDiv);
	    
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var zoomOutDiv=this._addButton("zoomout","","",li);
	    var zoomOutDivIcon=this._addDiv("zoomOutDivIcon","map_toolbar_dropdownBox_icon zoom_in","",zoomOutDiv);
	    var zoomOutDivText=this._addDiv("zoomOutDivText","map_toolbar_dropdownBox_text", map_tool_zoomOutTitle,zoomOutDiv);
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var ruleDiv=this._addButton("rule","","",li);
	    var ruleDivIcon=this._addDiv("ruleDivIcon","map_toolbar_dropdownBox_icon measure","",ruleDiv);
	    var ruleDivText=this._addDiv("ruleDivIcon","map_toolbar_dropdownBox_text", map_tool_ruleTitle,ruleDiv);
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var areaDiv=this._addButton("area","","",li);
	    var areaDivIcon=this._addDiv("areaDivIcon","map_toolbar_dropdownBox_icon measure_area","",areaDiv);
	    var areaDivText=this._addDiv("areaDivIcon","map_toolbar_dropdownBox_text", map_tool_areaTitle,areaDiv);
	    
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var clearDiv=this._addDiv("clearDiv","","",li);
	    OpenLayers.Event.observe(clearDiv, "click",  
  	    		 OpenLayers.Function.bindAsEventListener(this.clearMarkers,
                   this));
	    var clearDivIcon=this._addDiv("clearDivIcon","map_toolbar_dropdownBox_icon clearMarker","",clearDiv);
	    var clearDivText=this._addDiv("clearDivText","map_toolbar_dropdownBox_text", map_tool_clearMarkers,clearDiv);
    	   /*
	        this._addButton("pan", "skins/common/images/map/pan1.png", "skins/common/images/map/pan1.jpg", centered, sz, map_tool_panTitle);
	        centered = centered.add(sz.w,0);
	        
	        this._addButton("zoomin", "skins/common/images/map/zoomin1.png", "skins/common/images/map/zoomin1.jpg", centered, sz, map_tool_zoomInTitle);
	        
	        centered = centered.add(sz.w,0);
	        this._addButton("zoomout", "skins/common/images/map/zoomout1.png", "skins/common/images/map/zoomout1.jpg", centered, sz, map_tool_zoomOutTitle);
	        
	        centered = centered.add(sz.w,0);
	        this._addButton("rule", "skins/common/images/map/biaochi.png", "skins/common/images/map/biaochi.png", centered, sz, map_tool_ruleTitle);
	         
	        centered = centered.add(sz.w,0);
	        this._addButton("area", "skins/common/images/map/center.png", "skins/common/images/map/center.png", centered, sz, map_tool_areaTitle);
	        */
       }
       if(this.showEdit){
       	
      	 this.map.addLayer(this.editlayer);
      	 li=document.createElement("li");
 	    ul.appendChild(li); 
 	    var pointDiv=this._addButton("point","","",li);
 	    var pointDivIcon=this._addDiv("pointDivIcon","map_toolbar_dropdownBox_icon add_point","",pointDiv);
 	    var pointDivText=this._addDiv("pointDivIcon","map_toolbar_dropdownBox_text", map_tool_pointTitle,pointDiv);
 	    
 	    
 	   li=document.createElement("li");
	    ul.appendChild(li); 
	    var pathDiv=this._addButton("path","","",li);
	    var pathDivIcon=this._addDiv("pathDivIcon","map_toolbar_dropdownBox_icon add_path","",pathDiv);
	    var pathDivText=this._addDiv("pathDivIcon","map_toolbar_dropdownBox_text", map_tool_pathTitle,pathDiv);
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var polygonDiv=this._addButton("polygon","","",li);
	    var polygonDivIcon=this._addDiv("polygonDivIcon","map_toolbar_dropdownBox_icon add_polygon","",polygonDiv);
	    var polygonDivText=this._addDiv("polygonDivIcon","map_toolbar_dropdownBox_text", map_tool_polygonTitle,polygonDiv);
	    
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var circleDiv=this._addButton("circle","","",li);
	    var circleDivIcon=this._addDiv("circleDivIcon","map_toolbar_dropdownBox_icon add_circle","",circleDiv);
	    var circleDivText=this._addDiv("circleDivIcon","map_toolbar_dropdownBox_text", map_tool_circleTitle,circleDiv);
	    
	    li=document.createElement("li");
	    ul.appendChild(li); 
	    var rectDiv=this._addButton("rect","","",li);
	    var rectDivIcon=this._addDiv("rectDivIcon","map_toolbar_dropdownBox_icon add_rectangle","",rectDiv);
	    var rectDivText=this._addDiv("rectDivIcon","map_toolbar_dropdownBox_text", map_tool_rectTitle,rectDiv);
	    
      
      }
       if(this.showFind){ 
//    	    var searchDiv=this._addDiv("poi_search","map_toolbar_left map_search","",this.div);
//    	    var searchTextDiv=this._addDiv("poi_search_text_div","map_search_input","",searchDiv);
//    	 
//    	    var searchDivButton=this._addButton("poi","map_button","",searchDiv);
//    	    var searchDivButtonIcon=this._addDiv("poi_search_button_icon","map_button_icon map_icon_search","",searchDivButton);
//    	    var searchDivButtonText=this._addDiv("poi_search_button_text","map_button_text", map_tool_poiTitle,searchDivButton);
//    	   
    	    var geoDiv=this._addDiv("geo_search","map_toolbar_left map_toolbar_item","",this.div);
    	    var geotDivIcon=this._addDiv("geo_search_div","map_toolbar_icon rect_search","",geoDiv);
    	    var geoDivText=this._addDiv("geo_search_div_text","map_toolbar_text",map_tool_geoTitle,geoDiv);
    	    var geoSearchExendDiv=this._addDiv("geoSearchExendDiv","map_toolbar_expand","",geoDiv);
    	    var geoSearchDropDiv=this._addDiv("geoSearchDropDiv","map_toolbar_dropdownBox rect_search_dropdown","",geoDiv);
    	    var ul=document.createElement("ul");
    	    geoSearchDropDiv.appendChild(ul);
    	    ul.style.display="none";
    	    var context = {
                    'ui': ul,
                    'div':geoDiv
                };
                OpenLayers.Event.observe(geoDiv, "mouseover", 
                    OpenLayers.Function.bindAsEventListener(this.showUL,
                                                            context)
                ); 
                OpenLayers.Event.observe(geoDiv, "mouseout", 
                        OpenLayers.Function.bindAsEventListener(this.hideUL2,
                                                                context)
                    ); 
              
   	     OpenLayers.Event.observe(ul, "mouseout",  
   	    		 OpenLayers.Function.bindAsEventListener(this.hideUL,
                    context));
    	    var li=document.createElement("li");
    	    ul.appendChild(li);
    	    
    	    var geoSearchRectDiv=this._addButton("rectsearch","","",li);
    	    var geoSearchRectDivIcon=this._addDiv("geoSearchRectDivIcon","map_toolbar_dropdownBox_icon rectangle_search","",geoSearchRectDiv);
    	    var geoSearchRectDivText=this._addDiv("geoSearchRectDivText","map_toolbar_dropdownBox_text", map_tool_rectSearchTitle,geoSearchRectDiv);
    	    
    	       li=document.createElement("li");
    	    ul.appendChild(li); 
    	    var geoSearchCircleDiv=this._addButton("circlesearch","","",li);
    	    var geoSearchCircleDivIcon=this._addDiv("geoSearchCircleDivIcon","map_toolbar_dropdownBox_icon circle_search","",geoSearchCircleDiv);
    	    var geoSearchCircleDivText=this._addDiv("geoSearchCircleDivText","map_toolbar_dropdownBox_text", map_tool_circleSearchTitle,geoSearchCircleDiv);
    	    
    	    
    	    li=document.createElement("li");
    	    ul.appendChild(li); 
    	    var geoSearchPolygonDiv=this._addButton("polygonsearch","","",li);
    	    var geoSearchPolygonDivIcon=this._addDiv("geoSearchPolygonDivIcon","map_toolbar_dropdownBox_icon polygon_search","",geoSearchPolygonDiv);
    	    var geoSearchPolygonDivText=this._addDiv("geoSearchPolygonDivText","map_toolbar_dropdownBox_text", map_tool_polygonSearchTitle,geoSearchPolygonDiv);
    	    
    	    
    	    
    	    li=document.createElement("li");
    	    ul.appendChild(li); 
    	    var geoNearDiv=this._addButton("nearsearch","","",li);
    	   
    	    var geoSearchNearDivIcon=this._addDiv("geoSearchNearDivIcon","map_toolbar_dropdownBox_icon near_search","",geoNearDiv);
    	    var geoSearchNearDivText=this._addDiv("geoSearchNearDivText","map_toolbar_dropdownBox_text", map_tool_nearnSearchTitle,geoNearDiv);
    	    
    	    var navFindDiv=this._addButton("navfind","map_toolbar_left map_toolbar_item","",this.div);
     	   
    	    var navFindDivIcon=this._addDiv("navFindDivDivIcon","map_toolbar_icon navigation","",navFindDiv);
    	    var navFindDivDivText=this._addDiv("navFindDivDivText","map_toolbar_text", map_tool_navFindTitle,navFindDiv);
    	    
    	   
    	    
       } 
       for(var control in this.controls){
    	   this.map.addControl(this.controls[control]);
       }
       this.map.addLayer(this.ruleVLayer);
       this.map.addLayer(this.ruleMLayer);
       this.map.addLayer(this.makerLayer);
         this.switchModeTo("pan"); 
        return div;
    }, 
    
    clearMarkers:function(){
    	this.map.clearAllMarkers();
    },
    changeLayerIndex:function(layer){
    	
    	if(layer.CLASS_NAME=="OpenLayers.Layer.Vector"){ 
    		this.map.raiseLayer(layer,-5);
    	}
    },
    drawLayerContron:function(ee){
     
    	if(ee.type=="addlayer"){
    		this.changeLayerIndex(ee.layer);
    	}
        this.ul.innerHTML="";
   	     var li=document.createElement("li");
   	    this.ul.appendChild(li); 
   	    var baseLayerIcon=this._addDiv("baseLayerIcon","map_toolbar_dropdownBox_icon base_layer","",li);
   	    var baseLayerText=this._addDiv("baseLayerText","map_toolbar_dropdownBox_text", map_tool_layerBaseTitle,li);
   	  var layers = this.map.layers.slice();
   	   
   	    for(var i=0;i< layers.length;i++){ 
   	    	var layer=layers[i]; 
   	    	if(layer.isBaseLayer&&layer.displayInLayerSwitcher){ 
   	    		  
   	    		var isCur=(layer==this.map.baseLayer);
   	    		 var id=layer.id;
		      	     li=document.createElement("li");
		      	     li.className="map_toolbar_dropdownBox_subItem";
		    	    this.ul.appendChild(li);  
		    	    var baseLayerIcon=this._addDiv("baseLayerIcon"+id,"map_toolbar_dropdownBox_checkbox","",li);
		    	    var radio=document.createElement("input");
		    	    radio.type="radio";
		    	    radio.name="baseLayerRadio";
		    	    radio.value=id;
		    	    radio.checked=isCur;
		    	    baseLayerIcon.appendChild(radio);
		    	    var baseLayerText=this._addDiv("baseLayerText"+id,"map_toolbar_dropdownBox_text", layer.name,li);
		    	    var context = {
		                    'inputElem': radio,
		                    'layer': layer,
		                    'layerSwitcher': this
		                };
		                OpenLayers.Event.observe(radio, "mouseup", 
		                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
		                                                            context)
		                );
   	    	}
   	    }
   	   li=document.createElement("li");
 	    this.ul.appendChild(li); 
 	    var dynLayerIcon=this._addDiv("dynLayerIcon","map_toolbar_dropdownBox_icon overlays","",li);
 	    var dynLayerText=this._addDiv("dynLayerIcon","map_toolbar_dropdownBox_text", map_tool_bynLayerTitle,li);
 	    for(var i=0;i< layers.length;i++){ 
   	    	var layer=layers[i];
   	    	
   	    	if(!layer.isBaseLayer&&layer.displayInLayerSwitcher){ 
   	    	 
   	    		var isVis=layer.visibility;
   	    		 var id=layer.id;
		      	     li=document.createElement("li");
		      	     li.className="map_toolbar_dropdownBox_subItem";
		    	    this.ul.appendChild(li);  
		    	    var baseLayerIcon=this._addDiv("baseLayerIcon"+id,"map_toolbar_dropdownBox_checkbox","",li);
		    	    var radio=document.createElement("input");
		    	    radio.type="checkbox";
		    	    
		    	    radio.value=id;
		    	    radio.checked=isVis;
		    	    baseLayerIcon.appendChild(radio);
		    	    var baseLayerText=this._addDiv("baseLayerText"+id,"map_toolbar_dropdownBox_text", layer.name,li);
		    	    var context = {
		                    'inputElem': radio,
		                    'layer': layer,
		                    'layerSwitcher': this
		                };
		                OpenLayers.Event.observe(radio, "mouseup", 
		                    OpenLayers.Function.bindAsEventListener(this.onInputClick,
		                                                            context)
		                );
   	    	}
   	    }
    },
    onInputClick: function(e) { 
        if (!this.inputElem.disabled) {
            if (this.inputElem.type == "radio") {
                this.inputElem.checked = true;
                this.layer.map.setBaseLayer(this.layer);
            } else {
                this.inputElem.checked = !this.inputElem.checked;
                this.layer.setVisibility(this.inputElem.checked);
            }
        }
        OpenLayers.Event.stop(e);
    },
    
    
    addTool:function(id,control,icon,label){
    	this.controls[id]=control;
    	 this.map.addControl(this.controls[id]);
    	 var toolDiv=this._addButton(id,"map_toolbar_left map_toolbar_item","",this.div);
    	 
 	    var toolDivIcon=this._addDiv("tool"+id+"DivIcon","map_toolbar_icon "+icon,"",toolDiv);
 	    var toolDivText=this._addDiv("tool"+id+"DivText","map_toolbar_text", label,toolDiv);
 	   this.switchModeTo("pan"); 
    },
    
    _addButton:function(id, className, title,parentDiv) {
       
        var btn =document.createElement("div");
        btn.id= "OpenLayers_Control_MouseToolbar_" + id;
        btn.className=className;
        //we want to add the outer div
        parentDiv.appendChild(btn);
       
        btn.events = new OpenLayers.Events(this, btn, null, true);
        btn.events.on({
            "mousedown": this.buttonDown,
            "mouseup": this.buttonUp,
            "dblclick": OpenLayers.Event.stop,
            scope: this
        });
        btn.action = id;
        btn.title = title;
        btn.alt = title;
        btn.map = this.map;

        //we want to remember/reference the outer div
        this.buttons[id] = btn;
        return btn;
    }, 
    
    _addDiv:function(id, className, title,parentDiv) {
        
        var btn =document.createElement("div");
        btn.id= "OpenLayers_Control_MouseToolbar_" + id;
        //we want to add the outer div
        btn.innerHTML=title;
        btn.className=className;
       
        parentDiv.appendChild(btn); 
        return btn;
    }, 
    
    _addText:function(id, className, title,parentDiv) {
        
        var btn =document.createElement("input");
        btn.type="text";
        btn.id= "OpenLayers_Control_MouseToolbar_" + id;
        btn.className=className;
        //we want to add the outer div
        parentDiv.appendChild(btn); 
        return btn;
    }, 
    
    buttonDown: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        this.buttonClicked = evt.element.action;
        OpenLayers.Event.stop(evt);
    },

    /**
     * Method: buttonUp
     *
     * Parameters:
     * evt - {Event} 
     */
    buttonUp: function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        if (this.buttonClicked != null) {
            if (this.buttonClicked == evt.element.action) {
                this.switchModeTo(evt.element.action);  
            }
            OpenLayers.Event.stop(evt);
            this.buttonClicked = null;
        }
    },
    
    switchModeTo:function(action){
    	 
    	  this.action=action;
    	 
    	for(var control in this.controls){
    	 
    		if(control==action){  
    			this.controls[control].activate();
    		}else{ 
    			this.controls[control].deactivate();
    		}
    	} 
    	
    	if(action=="poi"){
    		  
    		 if(this.navControl){
    			 this.navControl.deactivate();
    			 this.navControl=null;
    		 }
    		this.map.parentMap.getControlDiv();
    		this.map.parentMap.controlView.$el.empty();
    		var mapView=this.map.parentMap.parentView.parentView;
    		if(mapView.layout){
    			mapView.layout.open("east");
    		}else{
    			mapView.initilizeLayoutSetting();
    		}	
    		 
    		this.poiControl=new OpenLayers.Control.POIFindPanel({
    			div:this.map.parentMap.controlDiv
    		}); 
    		this.map.addControl(this.poiControl);
    		this.poiControl.activate();
    		
//    		$$("poifindtext").value=$$("OpenLayers_Control_MouseToolbar_poi_text").value;
//    		this.controls[action].findPOI();
    	}else if(action=="navfind"){
    		 if(this.poiControl){
    			 this.poiControl.deactivate();
    			 this.poiControl=null;
    		 }
    		this.map.parentMap.getControlDiv();
    		this.map.parentMap.controlView.$el.empty();
    		var mapView=this.map.parentMap.parentView.parentView;
    		if(mapView.layout){
    			mapView.layout.open("east");
    		}else{
    			mapView.initilizeLayoutSetting();
    		}	
    		 
           this.navControl=new OpenLayers.Control.NAVFindPanel({
    			div:this.map.parentMap.controlDiv
    		}); 
    		this.map.addControl(this.navControl);  
    		this.navControl.activate();
    	}  
    },
    hideGeoControl:function(){ 
    	 	
    },
    
    handleRectSearch:function(event){  
    	 
    		this.map.parentMap.getControlDiv();
    		this.map.parentMap.controlView.$el.empty();
    		var mapView=this.map.parentMap.parentView.parentView;
    		if(mapView.layout){
    			mapView.layout.open("east");
    		}else{
    			mapView.initilizeLayoutSetting();
    		}	 
    		this.geoControl=new OpenLayers.Control.GEOMFindPanel({
    			div:this.map.parentMap.controlDiv
    		});
    		this.geoControl.vlayer=this.vlayer;
    		this.map.addControl(this.geoControl); 
    	 
    	this.geoControl.clearContent("georesultDiv");
    	this.vlayer.removeAllFeatures();
    	this.vlayer.addFeatures([event.feature]);
    	 
    	if(this.action=="rectsearch"){
	    	var bounds=event.feature.geometry.getBounds();
	    	var lefttop=new OpenLayers.LonLat(bounds.left,bounds.top).transform(			    
					        this.map.getProjectionObject(),
					        new OpenLayers.Projection("EPSG:4326")
					    );
	    	var rightbottom=new OpenLayers.LonLat(bounds.right,bounds.bottom).transform(			    
			        this.map.getProjectionObject(),
			        new OpenLayers.Projection("EPSG:4326")
			    );
	    	this.geoControl.geo=lefttop.lon+","+rightbottom.lat+","+rightbottom.lon+","+lefttop.lat;
    	}else if(this.action=="circlesearch"){
    		var bounds=event.feature.geometry.getBounds();
	    	var lefttop=new OpenLayers.LonLat(bounds.left,bounds.top).transform(			    
					        this.map.getProjectionObject(),
					        new OpenLayers.Projection("EPSG:4326")
					    );
	    	var rightbottom=new OpenLayers.LonLat(bounds.right,bounds.bottom).transform(			    
			        this.map.getProjectionObject(),
			        new OpenLayers.Projection("EPSG:4326")
			    );
	    	this.geoControl.geo=(lefttop.lon+rightbottom.lon)/2+","+(rightbottom.lat+lefttop.lat)/2+","+(rightbottom.lon-lefttop.lon)/2;
    	}else if(this.action=="polygonsearch") {
    		var points=event.feature.geometry.getVertices();
    		var point=[];
    		for(var i=0;i<points.length;i++){
    			var lonlat=new OpenLayers.LonLat(points[i].x,points[i].y).transform(			    
    			        this.map.getProjectionObject(),
    			        new OpenLayers.Projection("EPSG:4326"));
    			point.push(lonlat.lon+","+lonlat.lat);
    		}
    		this.geoControl.geo=point.join(",");
    	}else if(this.action=="nearsearch") {
    		this.geoControl.showNear=true;
    		var points=event.feature.geometry.getVertices()[0]; 
    		var lonlat=new OpenLayers.LonLat(points.x,points.y).transform(			    
    			        this.map.getProjectionObject(),
    			        new OpenLayers.Projection("EPSG:4326")); 
    		this.geoControl.geo=lonlat.lon+","+lonlat.lat;
    		this.geoControl.activate();
    		return;
    	}
    	this.geoControl.activate();
		this.geoControl.findPOI();
    },
        
    handleAddGeometryEnd:function(event){  
    //	this.vlayer.removeAllFeatures();
    },
    
    handleRuleEnd: function (event) {
	    var geometry = event.geometry;
	    
	    this.makerLayer.clearMarkers(); 
	    this.curmarker=null;
	    this.controls["rule"].handler.layer.removeAllFeatures();
	    var marker=new OpenLayers.Marker.RuleMarker(geometry,this.ruleMLayer,this.ruleVLayer);
	    this.ruleMLayer.addMarker(marker);
	    geometry.destroy(); 
	    this.switchModeTo("pan"); 
	},
	
	handleRule:function (event) {
	    var geometry = event.geometry;
	    var units = event.units; 
	    var measure = event.measure;  
	    if(measure){
	    	var marker=new OpenLayers.Marker.InfoMarker(geometry.getVertices()[geometry.getVertices().length-1].toLonLat(),measure.toFixed(3)+units); 
	    	this.makerLayer.addMarker(marker); 
	    }else{  
	    	var marker =new OpenLayers.Marker.InfoMarker(geometry.getVertices()[0].toLonLat(),map_rule_start);
	    	this.makerLayer.addMarker(marker);
	    }
	    geometry.destroy(); 
	},
	
	
	 handleAreaEnd: function (event) {
		    var geometry = event.geometry;
		    
		    this.makerLayer.clearMarkers(); 
		    this.curmarker=null;
		    this.controls["area"].handler.layer.removeAllFeatures();
		    var marker=new OpenLayers.Marker.RuleMarker(geometry,this.ruleMLayer,this.ruleVLayer,true);
		    this.ruleMLayer.addMarker(marker);
		    geometry.destroy(); 
		    this.switchModeTo("pan"); 
		},
		
		handleArea:function (event) { 
			 
		    var geometry = event.geometry;
		    var units = event.units+"<sup>2</sup>"; 
		    var measure = event.measure;  
		    if(measure){
		    	var marker=new OpenLayers.Marker.InfoMarker(geometry.getVertices()[geometry.getVertices().length-1].toLonLat(),measure.toFixed(3)+units); 
		    	this.makerLayer.addMarker(marker); 
		    }else{  
		    	var marker =new OpenLayers.Marker.InfoMarker(geometry.getVertices()[0].toLonLat(),map_rule_start);
		    	this.makerLayer.addMarker(marker);
		    }
		    geometry.destroy(); 
		},
    
    CLASS_NAME: "OpenLayers.Control.MapToolbar"
});
  
 
/*
 * Map Object contains openlayers map
 * 
 */
digitnexus.Map = function(div,options){ 
	this.div=div;
	var map=null;
	this.map=null;
	this.width=parseInt(this.div.style.width);
	this.height=parseInt(this.div.style.height);
	
	this.showZoomPan=true;
	this.showZoomCellPan=false;
	this.showLayerControl=true;
	this.showEgleMap=false;
	this.showGoogleMap=true;
	this.showMicroMap=false;
	this.showYahooMap=false;
	this.showQQMap=false;
	this.showSGMap=false;
	this.showTDMap=false;
	this.showBDMap=false;
	this.showABCMap=false;
	
	this.showMousePosition=false;
	this.showScaleLine=false;
	this.showMapToolBar=false;
	this.saveLast=false;
	
	this.mapToolBarShowFind=true;
	this.mapToolBarShowEdit=true;
	this.parentView=null;
	this.controlView=null;
    this.controlDiv=null;	 
    
	this.initOptions=function(){
		for(var key in options){ 
			this[key]=options[key];
		}
	};
	
	
	this.getControlDiv=function(){
		if(!this.controlDiv){
			this.controlView=this.parentView.parentView.mapEastView;
			this.controlDiv=this.controlView.$el[0];
		} 
		this.map.clearAllMarkers();
	}; 
	/**
	 * fill some url to the collection..
	 * 
	 * */
	this.initMap = function(){  
		var mapoptions={
				controls: [] 
		};
		
		map = new OpenLayers.Map(this.div.id,mapoptions); 
		if(this.saveLast){
		   OpenLayers.Event.observe(window, 'beforeunload', OpenLayers.Function.bindAsEventListener(this.saveMap,
                   this) );
		}
		
//		  OpenLayers.Event.observe(map, 'zoomend', OpenLayers.Function.bindAsEventListener(this.changeVector,
//                  this) );
		this.map=map;
		this.map.parentMap=this;
		 
	 //   map.addControl(new OpenLayers.Control.LayerSwitcher()); 
	  
	    if(this.showGoogleMap&&typeof(google)!="undefined"&&typeof(google.maps)!="undefined"){
		    var gphy = new OpenLayers.Layer.Google(
		    		map_google_terrain,
		        {type: google.maps.MapTypeId.TERRAIN}
		    );
		    var gmap = new OpenLayers.Layer.Google(
		    		map_google_vector, // the default
		        {numZoomLevels: 20}
		    );
		    var ghyb = new OpenLayers.Layer.Google(
		    		map_google_hybrid,
		        {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
		    );
		    var gsat = new OpenLayers.Layer.Google(
		    		map_google_satellite,
		        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
		    );
		    
		    map.addLayers([gmap,gphy, ghyb, gsat]);
		    
		    // Google.v3 uses EPSG:900913 as projection, so we have to
		    // transform our coordinates
		    map.setCenter(new OpenLayers.LonLat(114.3, 22.9).transform(
		        new OpenLayers.Projection("EPSG:4326"),
		        map.getProjectionObject()
		    ), 10);
	    }
	    if(this.showMicroMap){
	    	 var shaded = new OpenLayers.Layer.VirtualEarth("Shaded", {
	                type: VEMapStyle.Shaded
	            });
	            var hybrid = new OpenLayers.Layer.VirtualEarth("Hybrid", {
	                type: VEMapStyle.Hybrid
	            });
	            var aerial = new OpenLayers.Layer.VirtualEarth("Aerial", {
	                type: VEMapStyle.Aerial
	            });

	            map.addLayers([shaded, hybrid, aerial]);
	    }
	    
	    if(this.showYahooMap){
	    	   yahooLayer = new OpenLayers.Layer.Yahoo( "Yahoo"); 
	            map.addLayer(yahooLayer);
	    }
	    if(this.showQQMap){
	        var qq=new OpenLayers.Layer.QQMap("QQ地图",
	    		["http://p0.map.qq.com/maptiles/", "http://p1.map.qq.com/maptiles/", "http://p2.map.qq.com/maptiles/", "http://p3.map.qq.com/maptiles/"], 
	    		{sateTiles: false}  
	    		);
	         var qqsatellite=new OpenLayers.Layer.QQMap("QQ卫星图",
	    		["http://p0.map.soso.com/sateTiles/", "http://p1.map.soso.com/sateTiles/", "http://p2.map.soso.com/sateTiles/", "http://p3.map.soso.com/sateTiles/"],
	    		{sateTiles: true}
	    		);
	    		var qqsatellitetran=new OpenLayers.Layer.QQMap("QQ卫星图标注",
	    		["http://p0.map.soso.com/sateTranTiles/", "http://p1.map.soso.com/sateTranTiles/", "http://p2.map.soso.com/sateTranTiles/", "http://p3.map.soso.com/sateTranTiles/"],
	    		{isBaseLayer: false}
	    		);
	    		 map.addLayers([qq, qqsatellite, qqsatellitetran]);
	    }	
	    
	    if(this.showSGMap){
	    	var soGou=new OpenLayers.Layer.SoGou("SoGou地图",
                    [ "http://p0.go2map.com/seamless1/0/174/",  "http://p1.go2map.com/seamless1/0/174/",    "http://p2.go2map.com/seamless1/0/174/", "http://p3.go2map.com/seamless1/0/174/"], 
                    {sateTiles: false}  
                    );
	         var soGou2=new OpenLayers.Layer.QQMap("SoGou卫星图",
	    		["http://p0.map.soso.com/sateTiles/", "http://p1.map.soso.com/sateTiles/", "http://p2.map.soso.com/sateTiles/", "http://p3.map.soso.com/sateTiles/"],
	    		{sateTiles: true}
	    		); 
	    		 map.addLayers([soGou, soGou2]);
	    }	
	    
	    
	     if(this.showTDMap){
	    	 var tianditulayer = new OpenLayers.Layer.TiandituLayer("A0512_EMap",
	    			 "http://tile1.tianditu.com/DataServer",{ 
	    			 mapType:'EMap',
	    			 topLevel: 1,
	    			 bottomLevel: 18,
	    			 maxExtent: (new OpenLayers.Bounds(-180, -90, 180, 90)).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()),
	    			 mirrorUrls:["http://tile0.tianditu.com/DataServer","http://tile1.tianditu.com/DataServer","http://tile2.tianditu.com/DataServer","http://tile3.tianditu.com/DataServer","http://tile4.tianditu.com/DataServer","http://tile5.tianditu.com/DataServer","http://tile6.tianditu.com/DataServer"]
	    			 });
	    			 map.addLayer(tianditulayer);
	     }
	    if(this.showABCMap){	
	     var mapabc=OpenLayers.Layer.Mapabc ("mapabc");
	     map.addLayer(mapabc);
	    }
	     
	     if(this.showBDMap){
	    	 var proj = 'EPSG:26915';
		     var streetLayer = new OpenLayers.Layer.BaiduTile('Baidu Street', "", {
	             sphericalMercator: true,
	             //maxExtent: mapExtent,
	             isBaseLayer: true,
	             projection: proj
	         });
		     map.addLayers([streetLayer]);
	     }
	    if(this.showEgleMap){
	    	map.addControl(new OpenLayers.Control.OverviewMap()); 
	    }
	    if(this.showZoomCellPan){
	    	map.addControl(new OpenLayers.Control.PanZoomBar({
    			zoomWorldIcon:true
    	}),new OpenLayers.Pixel(5,20)); 
	    }else if(this.showZoomPan){
	    	map.addControl(new OpenLayers.Control.PanZoom({
	    			zoomWorldIcon:false}),new OpenLayers.Pixel(5,20)); 
	    } 
	    map.addControl(new OpenLayers.Control.Navigation()); 
	    if(this.showScaleLine){
	        map.addControl(new OpenLayers.Control.ScaleLine());
	    }
       if(this.showMousePosition){
           map.addControl(new OpenLayers.Control.MousePosition());
       }
       
       map.events.register('changebaselayer', map, function (e) {
    	   map.zoomToMaxExtent();
       });
       var self=this;
       
       map.events.register('moveend', map, function(evt) {
    	   
    	   if(oldPop){
		    	oldPop.hide();
		    	oldPop=null;
		    }
    	   
    	});
       map.events.register('zoomend', map, function (e) { 
    	   if(oldPop){
		    	oldPop.hide();
		    	oldPop=null;
		    }
    	   self.changeVector();
       });
       
       
       if(this.showMapToolBar){
          this.addTooBar();
       }
      
	} ;	 
	
	this.changeVector=function(){
		 var layers = this.map.layers.slice(); 
	   	    for(var i=0;i< layers.length;i++){ 
	   	    	var layer=layers[i]; 
	   	    	if(layer.CLASS_NAME="OpenLayers.Layer.Vector"){ 
	   	    		if(layer.minLevel&&layer.maxLevel){
	   	    			if((this.map.getZoom()>layer.maxLevel||this.map.getZoom()<layer.minLevel)){
	   	    				if(layer.getVisibility()){
	   	    					layer.setHideFromScale=true;
	   	    			       layer.setVisibility(false);
	   	    				}
	   	    			}else{
	   	    				if(!layer.getVisibility()&&layer.setHideFromScale){
	   	    					 layer.setHideFromScale=false;
	   	    			          layer.setVisibility(true);
	   	    				}
	   	    			}
	   	    		}
	   	    	}
	   	    }
	};
	
	this.saveMap=function(){
	 
	 	 var zoom=this.map.getZoom();
		  var center=this.map.getCenter();
	 	 var layerName=this.map.baseLayer.name;
	  
	 	digitnexus.syncGet('/rest/mapinfo/saveMap/'+layerName+'/'+zoom+'/'+center.lon+'/'+center.lat+'/0' ,
	                null,
	                function(response) { 
	 		          
	                },
	               function(xhr, status, exception) { 
	                 
	               });
	  
	 	 //SecurityUtil.java user
	 	// console.log(layerName);
	 	// alert("unload");
	};
	
	this.addLayers=function(layers){
		map.addLayers(layers); 
	};
	this.setCenter=function(lonlat,zoom){
		map.setCenter(lonlat,zoom);
	};
	
	this.zoomToMaxExtent=function(){
		map.zoomToMaxExtent();
	};
	
	this.setBaseLayer=function(layer){
		map.setBaseLayer(layer);
	};
	this.addTooBar=function(left,top){ 
		this.toolBar=new OpenLayers.Control.MapToolbar({ 
			showEdit:this.mapToolBarShowEdit ,
			showFind:this.mapToolBarShowFind
		}); 
		map.addControl(this.toolBar);
	};
	
	this.addTool=function(id,control,icon,label){
		if(this.toolBar){
			this.toolBar.addTool(id,control,icon,label);
		}
	};
	this.resize=function(width,height){ 
		this.div.style.width=width+"px";
		this.div.style.height=height+"px";
		this.width=width;
		this.hegiht=height; 
		map.updateSize();
	 
	};
	this.initOptions();
	this.initMap();
	 
};

