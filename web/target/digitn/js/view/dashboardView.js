/**
 * 
 */
window.dashboardView = Backbone.View.extend({
	tagName : 'div',
	className : 'reportView main-content-panel2',
	initialize : function(){
		this.parentView = this.options.parentView;
		this.dialogVolume = this.options.dialogVolume;
		this.width = this.dialogVolume.width-50;
		this.height = this.dialogVolume.height-100;
		//here is json definiton data need from back-end mash-up
		this.definition = {"data":[{"id":"001","name":"Bill1","sex":"Man","location":["22.510019650257966","113.92478942871094"],"bugs":"34"},
		              {"id":"002","name":"Bill2","sex":"Man","location":["22.541732599409258","114.01130676269531"],"bugs":"56"}],
		        "itemsDefinition":[{"control":true,"type":"table","title":"All Group Person Case","definition":{"layout":"Horizontal"}},
		                           {"control":false,"type":"detail","title":"'s Detail Case","definition":{"layout":"Vertical"}},
		                           {"control":false,"type":"map","title":"'s Map Case","definition":""}, 
		                           {"control":false,"type":"chart","title":"'s Bugs Number Case","definition":{"parameter":[
		                                   {"key":"chart.units.post","value":"N","type":"string"},
		                                   {"key":"chart.red.start","value":"65","type":"int"},
		                                   {"key":"chart.red.end","value":"100","type":"int"},
		                                   {"key":"chart.yellow.start","value":"35","type":"int"},
		                                   {"key":"chart.yellow.end","value":"65","type":"int"},
		                                   {"key":"chart.green.start","value":"0","type":"int"},
		                                   {"key":"chart.green.end","value":"35","type":"int"}],"type":"Meter"}}]};
		this.len = 2;
		//up to get the int number
		this.step = Math.ceil(this.definition.itemsDefinition.length);
		this.slaveItem = new Array();
	},
	render : function(){
		this.$el.width(this.width);
		this.$el.height(this.height);
		for(var i = 0; i < this.step; i ++){
			var singleChartDiv = viewCreator.make("div",{"id":"_dashboard_chart_parent_"+i+"_","style":"float:left;","class":"frame3"});
			this.$el.append(singleChartDiv);
			var graphDiv = $(viewCreator.make("div",{"id":"_dashboard_chart_graph_"+i+"_","class":"frame3-content"}));
			var titleDiv = $(viewCreator.make("div",{"id":"_dashboard_chart_title_"+i+"_","class":"frame3-title"},"<div class='frame3-title-icon'></div>"));
			$(singleChartDiv).append(titleDiv).append(graphDiv);
		}
		return this;
	},
	dashboardItemDraw : function(titleDiv,graphDiv,itemDefinition,data){
		if(itemDefinition == null || typeof(itemDefinition) == "undefined"){
			throw "itemDefinition can't be null";
		}
		if(!$.isPlainObject(itemDefinition)){
			itemDefinition = jQuery.parseJSON(itemDefinition);
		}
		if(!$.isPlainObject(data)){
			data = jQuery.parseJSON(data);
		}
		if(titleDiv !== null && titleDiv !== ""){
			titleDiv.empty();
			if(itemDefinition.control){
				titleDiv.append(itemDefinition.title);
			}else{
				titleDiv.append(data.name + " " +itemDefinition.title);
			}
			
			var bCollapse = $(viewCreator.make("b",{"class":"actionMin","title":"Collapse"},'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
			var bExpand = $(viewCreator.make("b",{"class":"actionMax","title":"Expand"},'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
			titleDiv.append(bCollapse).append(bExpand);
			bCollapse.click({mutualObj:bExpand,targetObj:graphDiv},function(event){
				var $target = $(event.target);
				$target.hide();
				var $mutualTarget = $(event.data.mutualObj);
				$mutualTarget.show();
				$(event.data.targetObj).hide();
			});
			bExpand.click({mutualObj:bCollapse,targetObj:graphDiv},function(event){
				var $target = $(event.target);
				$target.hide();
				var $mutualTarget = $(event.data.mutualObj);
				$mutualTarget.show();
				$(event.data.targetObj).show();
			});
		}
		switch(itemDefinition.type.toLowerCase()){
			case "map":
				graphDiv.attr("lang",JSON.stringify(itemDefinition));
		        dashboard.drawMapItem(graphDiv[0],data.location[0],data.location[1]);
				break;
			case "table":
				var keys = new Array();
				for(var p in data){
					keys.push(p);
				}
				graphDiv.attr("lang",JSON.stringify(itemDefinition));
				if(itemDefinition.control){
					graphDiv.append(dashboard.drawTableItem(this.definition.data,keys,itemDefinition.definition.layout));
				}else{
					graphDiv.append(dashboard.drawTableItem(data,keys,itemDefinition.definition.layout));
				}
				break;
			case "detail":
				var keys = new Array();
				for(var p in data){
					keys.push(p);
				}
				graphDiv.attr("lang",JSON.stringify(itemDefinition));
				graphDiv.append(dashboard.drawDetailItem(data,keys,itemDefinition.definition.layout));
				break;
			case "chart":
				graphDiv.attr("lang",JSON.stringify(itemDefinition));
				var canvasId = graphDiv.attr("id")+"_canvas";
				var canvasPanel = $(viewCreator.make("canvas",{"id":canvasId,"class":"report_canvas"},'[No canvas support]'));
				canvasPanel.width(graphDiv.width()).height(graphDiv.height());
				graphDiv.append(canvasPanel);
				var chartDefinition = {id:canvasId,data:data.bugs,definition:itemDefinition.definition};
				dashboard.drawChartItem(chartDefinition);
				break;
		}
	},
	dashboardItemListener : function(titleDiv,graphDiv,itemDefinition){
		var self = this;
		var control = itemDefinition.control;
		if(control&&Boolean(control)===true){
			graphDiv.bind('click',{slaveTarget:this.slaveItem,thisTarget:self},function(event) {
				var $target = $(event.target);
				var name = $target.context.nodeName;
				if(name==='TD'){
					var _d = $target.parent().attr('lang');
					//console.log(_d);
					for(var i = 0; i < event.data.slaveTarget.length; i ++){
						var slaveTargetItem = event.data.slaveTarget[i];
						slaveTargetItem.graph.empty();
						event.data.thisTarget.dashboardItemDraw(slaveTargetItem.title,slaveTargetItem.graph,slaveTargetItem.graph.attr('lang'),_d);
					}
				}
			});
		}else{
			this.slaveItem.push({title:titleDiv,graph:graphDiv});
		}
	},
	resize : function(){
		for(var i = 0; i < this.step; i ++){
			var itemDefinition = this.definition.itemsDefinition[i];
			var parentDiv = $("div#_dashboard_chart_parent_"+i+"_").width(parseInt(this.width/this.len)-5).height(parseInt(this.height/this.len))
			var graphDiv = $("div#_dashboard_chart_graph_"+i+"_").width(parseInt(this.width/this.len)-10).height(parseInt(this.height/this.len-30));
			var titleDiv = $("div#_dashboard_chart_title_"+i+"_").width(parseInt(this.width/this.len)-10).height(30);
			this.dashboardItemDraw(titleDiv,graphDiv,itemDefinition,this.definition.data[0]);
			this.dashboardItemListener(titleDiv,graphDiv,itemDefinition);
			var alseResizeArray = new Array();
			alseResizeArray.push(titleDiv);
			alseResizeArray.push(graphDiv);
			parentDiv.resizable({
				alsoResize: '#_dashboard_chart_title_'+i+'_,#_dashboard_chart_graph_'+i+'_'
			});
		}
		this.$el.sortable().disableSelection();
	}
});

var dashboard = {};
(function(){
	dashboard.drawMapItem = function(mapDiv,lon,lat){
		var map = new digitnexus.Map(mapDiv, {
             showGoogleMap: true
         });
         var layers=[];
         if(typeof(getCustomLayer)!="undefined"){
         	layers= getCustomLayer();
    	 }
		 if(layers.length>0){ 
             for (var i = 0; i < layers.length; i++) {
                 map.addLayers([layers[i].clone()]);
             }
             var lonlat = layers[0].maxExtent.getCenterLonLat();
             var lat = lonlat.lat + layers[0].maxExtent.getWidth() / 4;
             map.setCenter(new OpenLayers.LonLat(lonlat.lon, lat), parseInt(layers[0].numZoomLevels / 2));
         }
        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map.map.addLayer(markers);
        var size = new OpenLayers.Size(21,25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat),icon));
        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lon,lat),icon.clone()));
	};
	dashboard.drawTableItem = function(data,keys,layout){
		var tableHtml = "<div style='margin-top:10px;'>";
		tableHtml += "<table id='childTableId' style='table-layout: fixed;word-wrap:break-word;' width='100%' class='table_2'><thead>";
		tableHtml += dashboard.drawTableEngine.generateTableHeader(keys,layout);
		tableHtml += "</thead><tbody>";
		tableHtml += dashboard.drawTableEngine.generateTableBody(keys,data,layout);
		tableHtml += "</tbody></table>";
		tableHtml += "</div>";
		return tableHtml;
	};
	dashboard.drawChartItem = function(chartDefinition){
		var container = chartDefinition.id;
		var data = chartDefinition.data;
		var definition = chartDefinition.definition;
		var param = definition.parameter;
		var type = definition.type;
		
		var chart = null;
		if(type === 'Meter'){
			chart = new RGraph.Meter(container, 0, 100, parseInt(data));
		}else if(type === 'Bar'){
			chart = new RGraph.Bar(container, data);
		}else if(type === 'Line'){
			chart = new RGraph.Line(container,data);
		}else if(type === 'Pie'){
			chart = new RGraph.Pie(container, data);
		}
		dashboard.setGraphPropertiesValue(chart, param);
		chart.Draw();
	};
	dashboard.drawDetailItem = function(data,keys,layout){
		var tableHtml = "<div style='margin-top:10px;'>";
		tableHtml += "<table id='childTableId' style='table-layout: fixed;word-wrap:break-word;' width='100%' class='table_2'><thead>";
		tableHtml += dashboard.drawTableEngine.generateTableHeader(keys,layout);
		tableHtml += "</thead><tbody>";
		tableHtml += dashboard.drawTableEngine.generateTableBody(keys,data,layout);
		tableHtml += "</tbody></table>";
		tableHtml += "</div>";
		return tableHtml;
	};
	dashboard.drawTableEngine = {
		generateTableHeader : function(headers,layout){
			if(layout === 'Vertical'){
				return "";
			}else if(layout === 'Horizontal'){
				var _dataTableHtml = "<tr>";
				if(!digitnexus.util.isEmpty(headers)){
					$(headers).each(function(){
						_dataTableHtml += "<th id="+this+">"+this+"</th>";
					});
				}
				_dataTableHtml += "</tr>";
				return _dataTableHtml;
			}
		},
		generateTableBody : function(headers, tableData,layout){
			if(layout === 'Vertical'){
				var _vDataTableHtml = "";
				if(!digitnexus.util.isEmpty(tableData)){
					$(tableData).each(function(){
						var _rowData = this;
						$(headers).each(function(){
							_vDataTableHtml += "<tr>";
							_vDataTableHtml += "<td>"+this+"</td><td>"+_rowData[this]+"</td>";
							_vDataTableHtml += "</tr>";
						});
					});
				}
				return _vDataTableHtml;
			}else if(layout === 'Horizontal'){
				var _dataTableHtml = "";
				if(!digitnexus.util.isEmpty(tableData)){
					$(tableData).each(function(){
						_dataTableHtml += "<tr lang='"+JSON.stringify(this)+"'>";
						var _rowData = this;
						$(headers).each(function(){
							_dataTableHtml += ("<td>" + _rowData[this]  + "</td>");
						});
						_dataTableHtml += "</tr>";
					});
				}
				return _dataTableHtml;
			}
		}
	};
	dashboard._handleArrayPropertiesValue = function(value){
		var val = value;
		if(typeof val === 'object'){
			return val;
		}else if(typeof val === 'string'){
			var _data = null;
			if(val.indexOf(',') != -1){
				var startIndex = val.indexOf("[");
				var endIndex = val.indexOf("]");
				if(startIndex != -1){
					val = val.substr(parseInt(startIndex+1),val.length);
				}
				if(endIndex != -1){
					val = val.substr(0,(endIndex-1));
				}
				_data = val.split(",");
			}
			return _data;
		}
	};
	dashboard.setGraphPropertiesValue = function(graph,propertiesValue){
		if(graph === null || typeof(graph) === "undefined"){
			throw "graph object can't be null !";
		}
		for(var i = 0; i < propertiesValue.length;i ++ ){
			var _item = propertiesValue[i];
			var key = _item.key;
			var value = _item.value;
			switch(_item.type.toLowerCase()){
				case "array":
					value = dashboard._handleArrayPropertiesValue(value);
					break;
				case "int":
					value = parseInt(value);
					break;
				case "float":
					value = parseFloat(value);
					break;
				case "boolean":
					value = Boolean(value);
					break;
				case "string":
					value = value;
					break;
			}
			graph.Set(key,value);
		}
	};
})();