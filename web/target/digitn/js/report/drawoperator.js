digitnexus.re = digitnexus.re || {}
digitnexus.re.operators = digitnexus.re.operators || {};

digitnexus.re.operators.DrawOperator = function() {
    digitnexus.utils.MashupOperator.apply(this,arguments);
    this.TAG = "DrawOperator ";
    this.id = 501;
    this.type = 501;
    this.name = "DrawOperator";
    this.descript = "A test operator for testing";	
};
digitnexus.re.operators.DrawOperator.Constants = {
       CHART_TYPE: "chartType",
       REPORT_NAME : 'reportName',
       BO : '__bo__',
       CONDITION_CONSTRUCTOR: '__cn__',
       MAIN_MENU: '__mainmenu__',
       TABLEVIEW : 'tableView',
       SUPPORT_EXPORT_TYPE: ['pdf','docx','xls','pptx'],
       SUPPORT_CHART_TYPE: ['barChart','pieChart'],
       EXPORT_URL: '/rest/report/export'
} 
     
digitnexus.utils.inherits(digitnexus.re.operators.DrawOperator,digitnexus.utils.MashupOperator);        
digitnexus.re.operators.DrawOperator.prototype.execute = function(context) {
	var chartType = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);
    if(context.acParams == null) {
        throw "mush given an id to draw this report!";
    }
    var bo = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.BO);
    if(!bo) {
         bo = this.createBoFromContext(context);
         if(!bo) {
              throw "Fail to create Bo from context";
         }
         context.putParameter(digitnexus.re.operators.DrawOperator.Constants.BO,bo);
    }
    var doms = this.createDom_(context);
    if(!doms) {
        throw 'Fail to create dom for container ID: ' +context.acParams;
    }
    this.setTitle_(doms[0],context);
    this.setMenu_(bo,doms[1],context);
    var labels = bo.getLabels();
    if(labels == null) {
        throw "fail to labels from bo";
    }
    var data = bo.getData();
    if(data == null) {
        throw "fail to get data form bo";
    }
    if(chartType===digitnexus.re.operators.DrawOperator.Constants.TABLEVIEW){
    	this.drawTable(labels,data,doms[2]);
    }else{
        var graph = this.createGraph(context, data, doms[2].id);
        if(graph == null) {
            throw "fail to create graph";
        }
        this.setChartProperties_(context, graph);
         graph.Set('chart.labels', labels);
         
         /*
         var title = 'title';// this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.REPORT_NAME);
         if(title) {
             graph.Set('chart.title',title)
         }
         */
        
        if(!(bo instanceof digitnexus.utils.bo.SingleDimBoData)) {
              graph.Set('chart.key',bo.getKeys());
              graph.Set('chart.key.position','gutter');
              graph.Set('chart.key.position.y',5);
        }
        this.drawChart_(graph,context);
    }
}


digitnexus.re.operators.DrawOperator.prototype.drawTable = function(labels,data,container){
	var _header = labels;
    var _table = data;
	var drawTableEngine = {
		getPositionByName:function(name){
			for(var i = 0 ; i < _header.length; i ++){
				var header_ = _header[i];
				if(header_.name === name){
					return header_.position;
				}
			}
			return -1;
		},	
		drawTable:function(thead,tbody){
			this.drawTableHeader(thead);
			this.drawTableBody(tbody);
		},
		drawTableHeader:function(thead){
			var tr = document.createElement('tr');
			thead.appendChild(tr);
			if(_header.length>0){
				var th = document.createElement('th');
				th.setAttribute("width","50px");
				tr.appendChild(th);
				th.innerHTML=digitnexus.utils.i18n.get('label_reportManager_index');
			}
			for(var i = 0; i < _header.length; i ++){
				var th = document.createElement('th');
				tr.appendChild(th);
				th.innerHTML=_header[i].name;
			}
		},
		drawTableBody:function(tbody){
			for(var i = 0; i < _table.length; i ++){
				var tr = document.createElement('tr');
				tbody.appendChild(tr);
				tr.setAttribute("style","text-align:center;color:#000000;");
				if(_header.length>0){
					var tdi = document.createElement('td');
					tr.appendChild(tdi);
					tdi.innerHTML=i+1;
				}
				var rowData = _table[i].row;
				for(var j = 0; j <_header.length; j ++){
					var position = this.getPositionByName(_header[j].name);
					if(position!=-1){
						var td = document.createElement('td');
						tr.appendChild(td);
						td.innerHTML=rowData[position].data;
					}
				}
			}
		}
	};
	var table = document.createElement("table");
	table.className = 'table_1';
	table.setAttribute("style","table-layout:fixed;word-wrap:break-word;width:100%;color:#000000;");
	var thead = document.createElement("thead");
	table.appendChild(thead);
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	container.appendChild(table);
	drawTableEngine.drawTable(thead, tbody);
};


digitnexus.re.operators.DrawOperator.prototype.setTitle_ = function(titleContaier,context) {
    if(titleContaier.firstChild) {
        titleContaier.removeChild(titleContaier.firstChild);
    }
    var title = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.REPORT_NAME);
    title = title || 'Not Name Report';
    titleContaier.appendChild(document.createTextNode(title));
}


/**
 *
 */
digitnexus.re.operators.DrawOperator.prototype.setMenu_ = function(bo,menuContaier,context) {
    
    var mm = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.MAIN_MENU);
    if(mm) {
        //mm.rendder(menuContaier);
        return;
    }
    mm = new digitnexus.utils.MainMenu();
    context.putParameter(digitnexus.re.operators.DrawOperator.Constants.MAIN_MENU,mm);
    
    var conditions = bo.getFilterConditions();
    if(conditions && conditions.length > 0) {
        var cc = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.CONDITION_CONSTRUCTOR);
        var handler = digitnexus.utils.bind(this,function(item) {
            if(bo.changeCondition(item.getData(),item.isSelected())) {
                cc.updateMenuItemState();
                this.execute(context);
            }
        });
         if(!cc) {
                cc = new digitnexus.utils.ConditionConstructor(bo,menuContaier,handler);
                context.putParameter(digitnexus.re.operators.DrawOperator.Constants.CONDITION_CONSTRUCTOR,cc);
                cc.setHandler(handler);
                cc.rennder(mm);
         }
    }
    if(this.isSupportExportAsFile(context)) {
        this.renderExportMenu_(mm,context);
    }
    mm.rendder(menuContaier);
}

digitnexus.re.operators.DrawOperator.prototype.isSupportExportAsFile = function(context) {
   var chartType = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);
   if(!chartType) {
       return false;
   }
   chartType = chartType.trim();
   for(var t in digitnexus.re.operators.DrawOperator.Constants.SUPPORT_CHART_TYPE) {
       if(digitnexus.re.operators.DrawOperator.Constants.SUPPORT_CHART_TYPE[t] == chartType) {
           return true;
       }
   }
   return false;
}

digitnexus.re.operators.DrawOperator.prototype.renderExportMenu_ = function(mm,context) {
     var spt = digitnexus.re.operators.DrawOperator.Constants.SUPPORT_EXPORT_TYPE;
     var mainMenu = new digitnexus.utils.Menu('export');
     for(var key in spt) {
         var i = new digitnexus.utils.Menu.Item(spt[key]);
         mainMenu.addItem(i);
         i.setData(spt[key]);
     }
     mainMenu.setAction(digitnexus.utils.bind(this, function(item) {
        this.exportAsFile_(item.getData(),context);
        
    }));
    mm.addMenu(mainMenu);
}

digitnexus.re.operators.DrawOperator.prototype.exportAsFile_ = function(docType,context) {
    var data = {}
    
    data.chartType = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);
    data.docType = docType;
    var bo = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.BO);
    data.labels = bo.getLabels();
    var ds = bo.getData();
    var t = ds[0] instanceof Array;
    t = ds instanceof Array
    if(ds[0] instanceof Array) {
        data.data = ds;
    }else {
        data.data = [ds];
    }
    data.data = bo.getData();
    data.title = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.REPORT_NAME);
    data.keys = bo.getKeys();
    
    var url = digitnexus.utils.getUrl(digitnexus.re.operators.DrawOperator.Constants.EXPORT_URL);
    if(url == null) {
        throw 'web context is null, Please set var WEB_CONTEXT first';
    }  
    
    //create asynformupload form and ifroma
    var objForm = document.createElement("form");
    objForm.action = url;
    objForm.target = '_blank';
    objForm.encoding = "application/x-www-form-urlencoded";
    objForm.method = "post";
    objForm.id = 'hiddenForm';
    objForm.style.display = "none";
    
    var jsonInput = document.createElement('input');
    jsonInput.type = 'text';
    jsonInput.name = 'exportData';
    jsonInput.value = JSON.stringify(data);
    objForm.appendChild(jsonInput);
    
    objForm.onload = function(d){
        console.log(d);
    }
    objForm.submit();
}


/**
 *<div id="reportContainer" class="reportWindow">
 *      <div class="reportTitle">report</div>
 *    <div class="reportMenu">menu</div>
 *    <div class="reportBody">menu</div>
 * </div>
 */
digitnexus.re.operators.DrawOperator.prototype.createDom_ = function(context,opt_doc) {
	var chartType = this.getParameter(context,digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);
    var containerId = context.acParams[0]
    var doc = opt_doc || document;
    if(!containerId) {
        throw 'Report container is NULL';
    }
    var rc = doc.getElementById(containerId.trim());
    if(!rc) {
        throw 'Report container is NULL';
    }
    var rcTitle, rcMenu, rcBody, reportContainer, rcBody;
    var childNodes = rc.childNodes;
    for(var index = 0; index < childNodes.length; index++ ){
        if(!childNodes[index]) {
            continue;
        }
        switch(childNodes[index].id) {
            case 'reportBodyId':
                rcBody = childNodes[index];
                rcBody.removeChild(childNodes[index].firstChild);
                break;
            case 'reportTitleId':
                rcTitle = childNodes[index];
                break;
            case 'reportMenuId':
                rcMenu = childNodes[index];
                break;
        }
    }
     var parentWidth = rc.clientWidth;
     var parentHeight = rc.clientHeight;
    if(!rcBody) {
        rc.className = 'reportWindow'
        rc.style.width = parentWidth + 'px';
        rc.style.height = parentHeight + 'px';

        rcTitle = doc.createElement('div');
        rcTitle.id = 'reportTitleId';
        rcTitle.className = 'reportTitle';
        rcTitle.style.width =  rc.style.width;
        rc.appendChild(rcTitle);

        rcMenu = doc.createElement('div');
        rcMenu.id = 'reportMenuId';
        rcMenu.className = 'reportMenu';
        rcMenu.style.width =  rc.style.width;
        rc.appendChild(rcMenu);

        rcBody = doc.createElement('div');
        rcBody.id = 'reportBodyId';
        rcBody.className = 'reportBody';
        rcBody.style.width =  rc.style.width;
        rcBody.style.height = (parentHeight - 20- 25) +'px';
        //rcBody.style.top = (rcMenu.clientHeight + rcMenu.clientTop) + 'px';
        rc.appendChild(rcBody);
    }
    if(chartType===digitnexus.re.operators.DrawOperator.Constants.TABLEVIEW){
    	reportContainer = doc.createElement('div');
    	reportContainer.style.width = rcBody.clientWidth + 'px';
        reportContainer.style.height = rcBody.clientHeight + 'px';
    }else{
    	reportContainer = doc.createElement('canvas');
    	reportContainer.width = rcBody.clientWidth ;
        reportContainer.height = rcBody.clientHeight;
    }
    reportContainer.id = 'reportContainer';
    rcBody.appendChild(reportContainer); 
    //return the three parts as array
    return [rcTitle,rcMenu,reportContainer];
}

 digitnexus.re.operators.DrawOperator.prototype.drawChart_ = function(graph,
   context) {
      var chartType = context.getOutputParameter(
      digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);
       if(null === chartType) {
        throw "chart type can't be null, fail to create graph!";
    }
    chartType = chartType.trim();
       if('' === chartType) {
        throw "chart type can't be null, fail to create graph!";
    }
    switch(chartType) {
     case  'pieChart' : 
         graph.Draw();//RGraph.isOld() ? graph.Draw() : RGraph.Effects.Pie.RoundRobin(graph);
         //RGraph.isOld() ? chart.Draw() : RGraph.Effects.Pie.Implode(chart, {'duration': 1500});  
       break;
      case 'lineChart': 
        graph.Draw();//RGraph.isOld() ? graph.Draw() : RGraph.Effects.Line.UnfoldFromCenter(graph);
        break;
      case 'barChart': 
          graph.Draw() ;
          //RGraph.isOld() ? graph.Draw() : RGraph.Effects.Bar.Wave(graph);
       break;
     case  'barLineChart': 
          
       break;
      case 'stackChart': 
          
       break;
      case 'donutChart': 
         graph.Draw();//RGraph.isOld() ? graph.Draw(): RGraph.Effects.Pie.RoundRobin(graph, {'radius': false});
       break;
       case 'funnelChart': 
         graph.Draw();
       break;
       case 'horizontalBarChart': 
         graph.Draw();//RGraph.isOld() ? graph.Draw() : RGraph.Effects.HBar.Grow(graph);
       break;
       case 'horizontalProgressBars': 
           graph.Draw();
       break;
       case 'radarChart': 
           graph.Draw();
       break;
        case 'roseChart': 
           graph.Draw();
       break;
        case 'scatterChart': 
           graph.Draw();
       break;
       

    }
    
 }

digitnexus.re.operators.DrawOperator.prototype.setChartProperties_ = function(context,graph) {
    var reportNode = context.getOutputParameters().get(0);
    if(reportNode == null) {
        throw "output nodes is null";
    }
    var parameters = reportNode.parameters;
    if(parameters == null || parameters.length <= 0) {
        return;
    }
    for(var index = 0; index < parameters.length; index++) {
        var param = parameters[index];
        if(null == param) {
            continue;
        }
        var key = param.name;
        var value = param.value;			
        if(key == null || key == ''||  value == '' ||  value == null ||
        key.indexOf('chart.') == -1) {
            continue;
        }
        var value = value.toString().trim();
        var type = param.type;
        if(type == null || type == "") {
            continue;
        }
        switch(type){
            case "int":
            case "integer":
            case "byte":
                value = parseInt(value);
                break;
            case "double":
            case "float":
                value = parseFloat(value);
                break;
            case "string":
                
                break;
            case "boolean":
                value = 'true' === value;
                break;
            case "color":
                value = value;
                break;
            case 'array': {
                value =  value.split(",");
                 break;
            }
             case 'colors': {
                value =  value.split(",");
                break;
            }
            default: 
                			
        }
        graph.Set(key,value);
    }	
};
digitnexus.re.operators.DrawOperator.prototype.handlerStringStyleArray_ = function(value) {
    var val = value.trim();
    if(typeof val === 'string'){
        var _data = null;
        var startIndex = val.indexOf("[");
        var endIndex = val.indexOf("]");
        if(startIndex == 0 && endIndex == val.length -1) {
            if(startIndex != -1){
                val = val.substr(parseInt(startIndex+1),val.length);
            }
            if(endIndex != -1){
                val = val.substr(0,(endIndex-1));
            }
        }
        _data = val.split(",");
        for(var index = 0 ; index < _data.length; index++) {
            if(_data[index] == null) {
                continue;
            }
            _data[index] = _data[index].trim();
        }
        value = _data;
    }
    return value;
}
digitnexus.re.operators.DrawOperator.prototype.setTestProperties_ = function(context,graph) {
    graph.Set("chart.title.vpos",0.5);
    graph.Set("chart.title.xaxis.pos",0.1);
    graph.Set("chart.title.yaxis.pos","0.1");
    graph.Set("chart.colors",['yellow', 'green', 'orange', 'blue', 'red']);
    graph.Set("chart.gutter.left",60);
    graph.Set("chart.gutter.right",40);
    graph.Set("chart.gutter.top",70);
    graph.Set("chart.gutter.bottom",95);
    graph.Set("chart.shadow",true);
    graph.Set("chart.shadow.color","#aaa");
    graph.Set("chart.background.barcolor1","white");
    graph.Set("chart.background.barcolor2","white");
    graph.Set("chart.background.grid.hsize",5);
    graph.Set("chart.background.grid.vsize",5);
    graph.Set("chart.grouping","stacked");
    graph.Set("chart.labels.above",false);
    graph.Set("chart.labels.above.decimals",2);
    graph.Set("chart.text.angle",30);
    graph.Set("chart.key.background","rgba(255,255,255,0.7)");
    graph.Set("chart.key.position","gutter");
    graph.Set("chart.key.position.gutter.boxed",false);
    graph.Set("chart.key.position.y",65);
    graph.Set("chart.background.grid.width",0.3);
    graph.Set("chart.noyaxis",false);
    graph.Set("chart.strokestyle","black");
    graph.Set("chart.tooltips.event","onmousemove");
};

digitnexus.re.operators.DrawOperator.prototype.createGraph = function(context,data, container) {
    //var chartType = this.__getParameter(context,digitnexus.re.Constants.CHART_TYPE); 
    var chartType = context.getOutputParameter(digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);          
    if(!chartType) {
        throw "chart type can't be null, fail to create graph!";
    }
    chartType = chartType.trim();
    if('' === chartType) {
        throw "chart type can't be null, fail to create graph!";
    }
    var chart = null;
    switch(chartType) {
     case  'pieChart' : 
        chart = new RGraph.Pie(container,data);   
       break;
      case 'lineChart': 
        chart = new RGraph.Line(container,data);
        var grad = chart.context.createLinearGradient(0,0,0,150);
        grad.addColorStop(0,'rgba(255,255,255,0.5)');
        grad.addColorStop(1,'rgba(0,0,0,0)');
        break;
      case 'barChart': 
          chart = new RGraph.Bar(container,data);
       break;
     case  'barLineChart': 
          
       break;
      case 'stackChart': 
          
       break;
      case 'donutChart': 
       chart =  new RGraph.Pie(container,data);
       chart.Set('chart.variant', 'donut');
       chart.Set('chart.centerx', chart.canvas.width / 2);
       break;
       case 'funnelChart': 
          chart = new RGraph.Funnel(container, data);
            if (!RGraph.isOld()) {
                var grad = chart.context.createLinearGradient(chart.Get(
                'chart.gutter.left'),0,chart.canvas.width - chart.Get('chart.gutter.right'),0);
                grad.addColorStop(1, 'white');
                grad.addColorStop(0, 'rgba(255,255,255,0)');
                chart.Set('chart.tooltips.effect', 'fade');
                chart.Set('chart.highlight.fill', grad);
                chart.Set('chart.zoom.hdir', 'center');
                chart.Set('chart.zoom.vdir', 'up');
                chart.Set('chart.contextmenu', [['Zoom in', RGraph.Zoom]]);
            }
           
       break;
       case 'horizontalBarChart': 
          chart = new RGraph.HBar(container, data);
       break;
       case 'horizontalProgressBars': 
          chart = new RGraph.HProgress(container,data[0], 10);
       break;
       case 'radarChart': 
          chart = new RGraph.Radar(container,data[0],data[1],data[2]);
       break;
        case 'roseChart': 
          chart =  new RGraph.Rose(container, data);
       break;
       case 'scatterChart': 
         chart =  new RGraph.Rscatter(container, data);
       break;
    }
    return chart;
};

digitnexus.re.operators.DrawOperator.prototype.createBoFromContext = function(context) {
    if(!context) {
        console.log('context is NULL');
        return null;
    }
    var jsonBo = context.getInputParameters().get(0);
    if (jsonBo == null) {
        throw "can't get BO data form input parameters list";
    }
    var coordinate = this.getParameter(context,digitnexus.utils.bo.BoTable.Constants.COORDINATE);
     if (coordinate == null || coordinate == "") {
        throw "coordinate can't be null, fail to draw this graph.";
    }
    var valueName = this.getParameter(context,digitnexus.utils.bo.BoTable.Constants.VALUE);
    if (null == valueName || "" === valueName) {
        throw "label name can't be found!";
    }
    var labelName = this.getParameter(context,digitnexus.utils.bo.BoTable.Constants.LABEL);
    if (null == labelName || "" === labelName) {
        throw "label name can't be found!";
    }
    var chartType = context.getOutputParameter(digitnexus.re.operators.DrawOperator.Constants.CHART_TYPE);          
    if(!chartType) {
        throw "chart type can't be null, fail to create graph!";
    }
    chartType = chartType.trim();
     var bo = null;
     var args = {
        'coordinate': coordinate,
        'valueName': valueName,
        'labelName': labelName
        };
    switch(chartType) {
     case  'pieChart' : 
        args.isRadioCheck = true
        bo = new digitnexus.utils.bo.SingleDimBoData(jsonBo,args);
        
       break;
      case 'lineChart': 
      bo = new digitnexus.utils.bo.LineChartBoData(jsonBo,args);
        break;
      case 'barChart': 
          bo = new digitnexus.utils.bo.MultipleDimBoData(jsonBo,args);
       break;
     case  'barLineChart': 
          bo = new digitnexus.utils.bo.BoTable(jsonBo,args);
       break;
      case 'stackChart': 
          bo = new digitnexus.utils.bo.BoTable(jsonBo,args);
       break;
      case 'donutChart':
         args.isRadioCheck = true
         bo = new digitnexus.utils.bo.SingleDimBoData(jsonBo,args);
       break;
       case 'funnelChart': 
         args.isRadioCheck = true;
         bo = new digitnexus.utils.bo.SingleDimBoData(jsonBo,args);
       break;
       case 'horizontalBarChart': 
         args.isRadioCheck = true
         bo = new digitnexus.utils.bo.MultipleDimBoData(jsonBo,args);
       break;
       case 'horizontalProgressBars': 
           args.isRadioCheck = true
         bo = new digitnexus.utils.bo.SingleDimBoData(jsonBo,args);//new digitnexus.utils.bo.MultipleDimBoData(jsonBo,args);
       break;
       case 'radarChart': 
          bo = new digitnexus.utils.bo.RadarChartBoData(jsonBo,args);
       break;
        case 'roseChart': 
         bo = new digitnexus.utils.bo.BoTable(jsonBo,args);
       break;
       case 'scatterChart': 
        bo = new digitnexus.utils.bo.BoTable(jsonBo,args);
       break;
       case 'tableView':
    	bo = new digitnexus.utils.bo.MultipleTableBoData(jsonBo,args);    
       break;
    }
     return bo;
}

 digitnexus.re.operatorManager.registerOperator(new digitnexus.re.operators.DrawOperator());