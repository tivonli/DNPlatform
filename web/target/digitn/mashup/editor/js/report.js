digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};

digitnexus.editor.Report =  function() {
  this.report = null;    
}
digitnexus.editor.Report.TEST_REPORT_URL = "/rest/mashupeditor/test/";

digitnexus.editor.Report.TEST_FILE_EXPORT_URL = "/rest/report/printing/test";

digitnexus.editor.Report.FILE_EXPORT_MODEL_ID = 1002;

digitnexus.editor.Report.prototype.getInstance = function() {
    if(!this.report) {
        this.report = new digitnexus.editor.Report();
    }
    return this.report;
}

digitnexus.editor.Report.prototype.testReport = function() {
    var cell = digitnexus.editor.me.mashupEditor.graph.getSelectionCell();
    if(!cell) {
        alert('you mush select a report node first');
        return;
    }
    if(!cell.value) {
        alert('you select a invalid node');
        return;
    }
    var json = digitnexus.editor.me.mashupInfoManager.getCurrentMashupInfoAsJson();
    if(!json) {
        alert('current mashup infor is not a valid report');
        return;
    }
    //check whether it is printing node
    //if not, take it as chart node currently
    if(this.isSpecifyType(cell.value,digitnexus.editor.Report.FILE_EXPORT_MODEL_ID)) {
        this.getPrintFile_(json,cell.value.nodeId);
    } else { 
        var reportRunner = mxUtils.bind(this, function(mashupJson) {
            if(!mashupJson) {
                alert('current mashup infor is not a valid report');
            }
            this.rennderReport_(mashupJson);
        });
        this.getReportFromServer_(json,cell.value.nodeId,reportRunner); 
    }
   
}

digitnexus.editor.Report.prototype.getPrintFile_ = function(json,nodeId) {
    var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Report.TEST_FILE_EXPORT_URL);
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
    
    var nodeIdInput = document.createElement('input');
    nodeIdInput.type = 'text';
    nodeIdInput.name = 'nodeId';
    nodeIdInput.value = nodeId;
    objForm.appendChild(nodeIdInput);
    
    var jsonInput = document.createElement('input');
    jsonInput.type = 'text';
    jsonInput.name = 'mashupInfo';
    jsonInput.value = json;
    objForm.appendChild(jsonInput);
    
    objForm.onload = function(d){
        console.log(d);
    }
    objForm.submit();
}

digitnexus.editor.Report.prototype.getPrintFile__ = function(json,nodeId) {
    var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Report.TEST_FILE_EXPORT_URL);
    if(url == null) {
        throw 'web context is null, Please set var WEB_CONTEXT first';
    }
    url = url+nodeId;   
      var request = new digitnexus.utils.HttpRequest(url, json, 'post', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                     callback('('+text+')');
                }),
                digitnexus.utils.bind(this, function (req) {
                    mxUtils.alert('error: ');
                    throw req.toString();
       }));
}

digitnexus.editor.Report.prototype.getReportFromServer_ = function(jsonMashupInfo,nodeId,callback) {
     var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Report.TEST_REPORT_URL);
     if(url == null) {
        throw 'web context is null, Please set var WEB_CONTEXT first';
     }
     url = url+nodeId;   
      var request = new digitnexus.utils.HttpRequest(url, jsonMashupInfo, 'post', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                     callback('('+text+')');
                }),
                digitnexus.utils.bind(this, function (req) {
                    mxUtils.alert('error: ');
                    throw req.toString();
       }));
}

digitnexus.editor.Report.prototype.rennderReport_ = function(mashupJson) {
    var mashup = digitnexus.re.mashupParser.parse(mashupJson);
    if(!mashup) {
        alert('current mashup infor is not a valid report');
        return;
    }
    var reportContainer = this.createReportWidget_();
    if(!reportContainer) {
        alert('no UI can be created for the report!');
        return;
    }
    // modal, closable, onClose
    digitnexus.editor.me.mashupEditor.editorUi.hideDialog();
    digitnexus.editor.me.mashupEditor.editorUi.showDialog(reportContainer, 430,
    350, false, true,mxUtils.bind(this,function() {
       //preferencePage.destroy();
                
    }));

    digitnexus.re.mashupRunner.run(mashup,false,[reportContainer.id]);
    
}

digitnexus.editor.Report.prototype.createReportWidget_ = function() {
    var reportContainer = document.createElement('div');
    reportContainer.id = 'mainReportWindow';
    reportContainer.style.width =430+'px';
    reportContainer.style.height =350+'px';
    return reportContainer;
}

digitnexus.editor.Report.prototype.openReportPage = function() {
    digitnexus.editor.me.mashupEditor.editorUi.hideDialog();
    var reportContainer = document.createElement('div');
    reportContainer.id = 'reportPage';
    reportContainer.style.width = 800+'px';
    reportContainer.style.height = 600+'px';
    digitnexus.editor.me.mashupEditor.editorUi.showDialog(reportContainer, 800,
    600, true, true,mxUtils.bind(this,function() {
       //preferencePage.destroy();      
    }));
    digitnexus.re.reportManager.createTreeNavReport('browser',reportContainer);
}

digitnexus.editor.Report.prototype.isSpecifyType = function(nodeValue,modelId) {
    return nodeValue.modelId == modelId;
}