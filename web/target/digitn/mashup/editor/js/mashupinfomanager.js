digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};

digitnexus.re.MashupNode.prototype.getAttribute = function(key) {
    if(key === digitnexus.editor.Constants.ED_ELEMENT_LABEL) {
        // console.log("MashupNode.prototype.getAttribute name " + this.name);
        var n = this.getParameter('reportName');
        if(n) {
            return n;
        }
        return this.name;
    }
    return digitnexus.editor.Constants[name];
};
var oldGetParameter = digitnexus.re.MashupNode.prototype.getParameter;
digitnexus.re.MashupNode.prototype.getParameter = function(key) {
    if(null == key) {
        return null;
    }
    key = key.trim();
    var baseParameter = oldGetParameter.apply(this,arguments);
    if(baseParameter) {
        return baseParameter;
    }
    if(!this.advanceParameters) {
        return;
    }
    var size = this.advanceParameters.size();
    if( size < 1) {
        return null;
    }
    for(var index  = 0; index < size; index++) {
        var p = this.advanceParameters.get(index);
        if(p == null) {
            continue;
        }
        if(key == p.name) {
            return p.value;
        }
    }
    return null;
}
   
digitnexus.editor.MashupInfo =  function()  {
    this.name = 'new mashup';
    this.id = -1;
    this.nodes = null;
    this.pureXml = '';
    this.template = false;
    //indecate whether is the current open mashup, only use for client, 
    //not persistence to server
    this.isOpen = false;
};

digitnexus.editor.MashupInfo.prototype.equals = function(elt) {
    if(!(elt instanceof digitnexus.editor.MashupInfo)){
        return false;
    }
    return this.id == elt.id;
}
digitnexus.editor.MashupInfo.prototype.toString = function() {
    return 'name=' + this.name+',id=' + this.id;
}

digitnexus.editor.MashupInfoManager = function() {
    this.mashupInfoList = new digitnexus.utils.Set();
    this.currentMashupInfo = null;
    this.isModified = false;
    this.definitionTemplates = new digitnexus.utils.Set();
}
    digitnexus.editor.MashupInfoManager.prototype.init = function() {
        
    }
digitnexus.editor.MashupInfoManager.prototype.getCurrentMashupInfoAsJson = function() {
    if(this.currentMashupInfo == null) {
        mxUtils.alert('no mashup definition need to save!');
        return;
    }
    var model = digitnexus.editor.me.mashupEditor.graph.getModel();
    if(model == null || model.getRoot() == null) {
        mxUtils.alert('not exist mash-up definition to save');
        return;
    }  
    var result = this.doValidate_(model.getRoot());
    if(result != null&& result.length > 0) {
       // mxUtils.alert('Fail to save by:\n ' + result);
        mxUtils.alert(mxResources.get('label_validate_required'));
        return;
    }      
    var nodeList =  this.mergeAllMashupNodes_(model.getRoot(),[]);
           
    if(this.currentMashupInfo.id == -1 ||this.currentMashupInfo.id == null) {
        this.currentMashupInfo.id = digitnexus.editor.me.requestId();
    }
    if(this.currentMashupInfo.id == -1 ||this.currentMashupInfo.id == null) {
        this.currentMashupInfo.id = digitnexus.editor.me.requestId();
    }
    if(this.currentMashupInfo.id == -1 ||this.currentMashupInfo.id == null) {
        throw 'fail to save mashup info since cannot get id from server';
    }
    var oldNodes =  this.currentMashupInfo.nodes;
    var isOpen =  this.currentMashupInfo.isOpen;
    this.currentMashupInfo.isOpen = null;
            
    this.currentMashupInfo.nodes = nodeList;  
    if(null !=  digitnexus.editor.me.mashupEditor){
        var values = this.beforeSerialize_(model.getRoot(),new digitnexus.utils.HashMap());
        var encoder = new mxCodec();
        var node = encoder.encode( digitnexus.editor.me.mashupEditor.getGraphXml());               
        this.currentMashupInfo.pureXml = mxUtils.getPrettyXml(node);
        this.afterSerialize_(model.getRoot(),values);
    }
    var jsonStr = JSON.stringify(this.currentMashupInfo);
    this.currentMashupInfo.nodes = oldNodes;
    this.currentMashupInfo.isOpen = isOpen;
    return jsonStr;
}


digitnexus.editor.MashupInfoManager.prototype.saveMashupDefinition = function() {
    
    var jsonStr = this.getCurrentMashupInfoAsJson();      
    if(null == jsonStr || jsonStr == '' ) {
        throw 'fail to convert mash-up info to json format';
    }
    var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.SAVE_MASHUP_BASE_URL);
    if(url == null) {
        throw 'web context is null, Please set var WEB_CONTEXT first';
    }
    
     var request = new digitnexus.utils.HttpRequest(
        url, jsonStr, 'post', true);
    request.send(digitnexus.utils.bind(this, function (req) {
        alert(mxResources.get('label_save_mashup_success'));
    }),
    digitnexus.utils.bind(this, function (req) {
         alert(mxResources.get('label_save_mashup_fail'));
    }));
}

digitnexus.editor.MashupInfoManager.prototype.saveAsDefinitionTemplate = function() {
    this.currentMashupInfo.template = true;
    this.saveMashupDefinition();
    this.mashupInfoList.remove(this.currentMashupInfo);
    this.definitionTemplates.add(this.currentMashupInfo);
    this.newMashupDefinitionId = -1;
    this.mashupInfoListDialog = null;
}

digitnexus.editor.MashupInfoManager.prototype.openMashupDefinitionList = function(openListDialog) {
    var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_MASHUP_DEFINITION);
    if(url == null) {
        throw 'fail to get mashup definition list url';
    }
    
     var request = new digitnexus.utils.HttpRequest(url, null, 'get', true);
    request.send(digitnexus.utils.bind(this, function (req) {
        var text = req.getText();
        if(text == '()') {
            mxUtils.confirm('no mashup definition can be found currently!');
            return;
        }
        this.parseMashupInfoList(text);
        if(openListDialog == true) {
            this.doOpenMashupDefinitionList_( digitnexus.editor.me.mashupEditor);
        }
    }),
    digitnexus.utils.bind(this, function (req) {
        mxUtils.alert('error: ' + req.toString());
        throw req.toString();
    }));
}
         
digitnexus.editor.MashupInfoManager.prototype.parseMashupInfoList = function(jsonMashinfo) {
    var jsonMasshinfoList = eval(jsonMashinfo);
    if(!jsonMasshinfoList) {
        return;
    }
    if(this.mashupInfoList == null) {
        this.mashupInfoList = new digitnexus.utils.Set();
    }
    for(var index = 0; index < jsonMasshinfoList.length; index++) {
        var jmi = jsonMasshinfoList[index];
        var mi = new digitnexus.editor.MashupInfo();
        // mi.networkId = jmi.networkId;
        mi.id= jmi.id;
        mi.pureXml = jmi.pureXml;   
        mi.template = jmi.template;
        mi.name = jmi.name == null ? 'new mashup_'+ mi.id : jmi.name;
        if(jmi.nodes != null) {
            mi.nodes = this.getNodesForJsonMashupInfo_(jmi.nodes); 
        } 
        if(mi.template) {
            this.definitionTemplates.add(mi);
        }
        this.mashupInfoList.add(mi);
    } 
}

digitnexus.editor.MashupInfoManager.prototype.getDefinitionTemplates = function() {
    if(this.definitionTemplates == null || this.definitionTemplates.size() < 1) {
        this.openMashupDefinitionList(false);
    } else {
        return this.definitionTemplates;
    }
}

digitnexus.editor.MashupInfoManager.prototype.doOpenMashupDefinitionList_ = function() {	 
    if(this.mashupInfoList == null || this.mashupInfoList.size() < 1) {
        mxUtils.alert('not exist mashup definition');
        return null;
    }
    var table = new  digitnexus.utils.Table();
    var row = table.addRow();
    var title = table.addTd();
    mxUtils.writeln(title, mxResources.get('name',null,'name'));
    title = table.addTd();
    mxUtils.writeln(title, mxResources.get('open',null,'open'));
    title = table.addTd();
    mxUtils.writeln(title, mxResources.get('delete',null,'delete'));
    title = table.addTd();
    mxUtils.writeln(title, mxResources.get('template',null,'template'));
                 
    var size = this.mashupInfoList.size();
    for(var index = 0; index < size; index++) {
        var mashupinfo = this.mashupInfoList.get(index);
        if(mashupinfo == null) {
            continue;
        }
        row = table.addRow();
        row.setAttribute('mashupInfoId',mashupinfo.id);
        var mashupLabel = table.addTd();
        var name = mashupinfo.name.indexOf(mashupinfo.id+'') == -1 ? mashupinfo.name +'_'+mashupinfo.id : mashupinfo.name
        mxUtils.write(mashupLabel,name);
 
        var open = table.addTd();

      mxUtils.link(open,mxResources.get('open',null,'open'), function(){    	
    	var trNodes = this.parentNode.parentNode.parentNode.childNodes;
    	for(var i=0;i<trNodes.length;i++){
    		trNodes[i].firstChild.style.color = "black";
    	}
    	this.parentNode.parentNode.firstChild.style.color="blue";    	
        digitnexus.editor.me.mashupInfoManager.openMashupInfoInEditor(mashupinfo.id, digitnexus.editor.me.mashupEditor);
    });
        
        var deleteTd = table.addTd();
        mxUtils.link(deleteTd,mxResources.get('delete',null,'delete') , mxUtils.bind(mashupinfo,function(){
            if(confirm(mxResources.get('confirmtodelete',null,'confirm to delete the mashup?'))) {
                digitnexus.editor.me.mashupInfoManager.deleteMashupDefinition(this,table);
            }
        }));	
        var template = table.addTd();
        if(mashupinfo.template == true) {
            mxUtils.writeln(template, mxResources.get('yes',null,'Yes'))
        }else {
            mxUtils.writeln(template, mxResources.get('no',null,'No'))
        }
    }
    if (table.table != null){
        // Displays the contents in a window and stores a reference to the
        // window for later hiding of the window
        this.mashupInfoListDialog = new mxWindow( mxResources.get('mashupListTitle',null,'mash-up list'),  table.table, 200, 200, null, null, true,true,null,null);
        this.mashupInfoListDialog.setVisible(true);
    }
    return table.table;
}
         
digitnexus.editor.MashupInfoManager.prototype.deleteMashupDefinition = function(mashupinfo,table) {
    //digitnexus.editor.me.openMashupInfoInEditor(this.id,editor);
    var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_MASHUP_DELETE);
    if(null == url) {
        mxUtils.alert('delete falure since fail to get server url');
        return;
    }
    url = url + mashupinfo.id;
    var request = new digitnexus.utils.HttpRequest(url, null, 'get', true);
    request.send(digitnexus.utils.bind(this, function (req) {
       var data = req.getText();
       var deleteTable = function(id) {
                var childNodes = table.getAllRows();
                if(childNodes == null || childNodes.length <= 0) {
                    return;
                }
                var size = childNodes.length;
                for(var index = 1; index < size; index++) {
                    var child = childNodes[index];
                    if(child == null) {
                        continue;
                    }
                    var mashupInfoId = child.getAttribute('mashupInfoId');
                    if(mashupInfoId == id) {
                        table.removeRow(child); 
                        break;
                    }
                }
            }
            var success = false;
            if(data!= null && data.indexOf('deletesuccess') != -1) {
                //success to delete the mashup from mashuplist and update the dialog
                if(this.currentMashupInfo != null && mashupinfo.id == this.currentMashupInfo.id) {
                    this.currentMashupInfo = null; 
                }
                success = true;
            }else if(data!= null && data.indexOf('notfound') != -1) {
                if( this.newMashupDefinitionId == mashupinfo.id ) {
                    //the mashup is new created and not save to server, so the server deletion  will fail
                    data = 'deletesuccess';
                    success = true;
                    this.createNewMashupDefinition(false,false); 
                }
            }
            if(success == true) {
                deleteTable(mashupinfo.id);
                this.definitionTemplates.remove(mashupinfo);
                this.mashupInfoList.remove(mashupinfo);
            }
            mxUtils.alert(mxResources.get(data,null,data));
    }),
    digitnexus.utils.bind(this, function (req) {
        mxUtils.alert('error: ' + req.toString());
        throw req.toString();
    }));
}
digitnexus.editor.MashupInfoManager.prototype.setUserProfile_ = function(moduleName,name,value,type) {
    if(null == moduleName || null == name) {
        return;
    }
    digitnexus.editor.me.preferenceManager.userProfile.put(moduleName,new digitnexus.editor.EditorSettingValue(name,value,type));
}    
/**
 * user confirm wehter need to save current mashup, return true indicate no 
 * need to save, false need to save 
 */
digitnexus.editor.MashupInfoManager.prototype.notifyToSave = function() {
    if(this.currentMashupInfo != null && this.isModified) {
        return mxUtils.confirm(mxResources.get('noticeToSave',null,'cancel to save current content or discard it to create new mashup?'));
    }
    return true;
}


digitnexus.editor.MashupInfoManager.prototype.createNewMashupDefinition = function(useWardezar) {
    if(!digitnexus.editor.me.mashupInfoManager.notifyToSave()) {
        return;
    }
    
    if(useWardezar == false) {
        this.currentMashupInfo = new digitnexus.editor.MashupInfo();
        this.currentMashupInfo.id = digitnexus.editor.me.requestId();
        this.currentMashupInfo.name = this.currentMashupInfo.name +'_'+ this.currentMashupInfo.id 
        this.mashupInfoList.add(this.currentMashupInfo);
        if( digitnexus.editor.me.mashupEditor != null) {
            this.openMashupInfoInEditor(this.currentMashupInfo.id);
        } 
        this.isModified = false; 
        return;
    }
            
    if(digitnexus.editor.me.mashupEditor == null) {
        mxUtils.alert('mashup editor is NULL');
        return;
    }
    var okProcess = mxUtils.bind(this,function(table) {   
        var inputList = table.inputlist;
        var description  = inputList.get('description');
        description = description == null ?'':description.value;
        var name  = inputList.get('name');
        name = name == null ?'':name.value;
        var templateId  = inputList.get('template');
        templateId = templateId == null ?'':templateId.value;
        var templateInfo = null;
        var templates =  this.getDefinitionTemplates();
        if(null != templates) {
            var size = templates.size();
            for(var index = 0 ;index < size; index++) {
                var t = templates.get(index);
                if(t == null) {
                    continue;
                }
                if(t.id == templateId) {
                    templateInfo = t;  
                    break;
                }
            }
        }
        if(templateInfo != null) {
            this.currentMashupInfo = this.cloneMashupInfo_(templateInfo);
            this.currentMashupInfo.template = false;
        }else {
            this.currentMashupInfo = new digitnexus.editor.MashupInfo();
            this.currentMashupInfo.id = digitnexus.editor.me.requestId();
        }
        this.newMashupDefinitionId = this.currentMashupInfo.id;
        if(null != description || '' != description.trim() ) {
            this.currentMashupInfo.description = description;
        }
        if(null != name || '' != name.trim() ) {
            this.currentMashupInfo.name = name;
        }else {
            this.currentMashupInfo.name = this.currentMashupInfo.name +'_'+ this.currentMashupInfo.id 
        }
        //this.currentMashupInfo.networkId = this.requestId();
        this.mashupInfoList.add(this.currentMashupInfo);
        if( digitnexus.editor.me.mashupEditor != null) {
            this.openMashupInfoInEditor(this.currentMashupInfo.id);
        }
        this.isModified = false; 
        digitnexus.editor.me.mashupEditor.editorUi.hideDialog();
    });
    var cancellProcess =  mxUtils.bind(this, function(table) {
        digitnexus.editor.me.mashupEditor.editorUi.hideDialog();
    });
    var container = new CreateMashupDefinitionDialog(okProcess,cancellProcess).container;
    digitnexus.editor.me.mashupEditor.editorUi.showDialog(container, 320, 280, true, true);
}
        
digitnexus.editor.MashupInfoManager.prototype.cloneMashupInfo_ =  function(from) {
    if(null == from) {
        return null;
    }
    var tempNodeIdMap = new digitnexus.utils.HashMap();
    var mashupInfo = mxUtils.clone(from);
    mashupInfo.id = digitnexus.editor.me.requestId();
    var nodeList = mashupInfo.nodes;
            
    if(nodeList != null && nodeList.size() > 0) {
        var size1 = nodeList.size();
        for(var index = 0; index < size1; index++) {
            var node = nodeList.get(index);
            if(node == null) {
                continue;
            }
            tempNodeIdMap.put(node.nodeId,node);
            node.nodeId = digitnexus.editor.me.requestId();
            node.networkId =  mashupInfo.id;
            if(node.editorParameters != null && node.editorParameters.length > 0) {
                var size2 = node.editorParameters.length;
                for(var ii = 0; ii < size2; ii++) {
                    var p = node.editorParameters[ii];
                    if(null == p) {
                        continue;
                    }
                    p.id = null;
                }
            }
            if(node.parameters != null && node.parameters.size() > 0) {
                var size3 = node.parameters.size();
                for(var ii = 0; ii < size3; ii++) {
                    var p = node.parameters.get(ii);
                    if(null == p) {
                        continue;
                    }
                    p.id = null;
                }
            }
                    
            if(node.advanceParameters != null && node.advanceParameters.size()> 0) {
                var size4 = node.advanceParameters.size();
                for(var ii = 0; ii < size4; ii++) {
                    var p = node.advanceParameters.get(ii);
                    if(null == p) {
                        continue;
                    }
                    p.id = null;
                } 
            }   
        }
        var size5 = nodeList.size();
        for(var index = 0; index < size5; index++) {
            var node = nodeList.get(index);
            if(node == null) {
                continue;
            }
            if(node.inputIds != null && node.inputIds.size() > 0) {
                var set = new digitnexus.utils.Set();
                var sizeinputIds = node.inputIds.size();
                for(var ii = 0; ii < sizeinputIds; ii++) {
                    var oldId = node.inputIds.get(ii);
                    if(null == oldId) {
                        throw 'OldId cannot be NULL';
                    }
                    var oldNode = tempNodeIdMap.get(oldId);
                    if(null == oldNode) {
                        throw 'outout node is NULL for oldID: ' + oldId;
                    }
                    set.add(oldNode.nodeId);
                }
                node.inputIds.removeAll();
                node.inputIds.addAll(set);
                set.removeAll();
            }
            if(node.outputIds != null && node.outputIds.size() > 0) {
                var set = new digitnexus.utils.Set();
                var sizeoutputIds = node.outputIds.size();
                for(var ii = 0; ii < sizeoutputIds; ii++) {
                    var oldId = node.outputIds.get(ii);
                    if(null == oldId) {
                        throw 'OldId cannot be NULL for outout node';
                    }
                    var oldNode = tempNodeIdMap.get(oldId);
                    if(null == oldNode) {
                        throw 'outout node is NULL for oldID: ' + oldId;
                    }
                    set.add(oldNode.nodeId);
                }
                node.outputIds.removeAll();
                node.outputIds.addAll(set);
                set.removeAll();
            }
        }
    }
    var graphModel = new mxGraphModel();
    var doc = mxUtils.parseXml(mashupInfo.pureXml); 
    var dec = new mxCodec(doc.documentElement);
    dec.decode(doc.documentElement, graphModel);
    this.iterateCellTree(graphModel.getRoot(),mxUtils.bind(this, function(cell){
        if(cell.nodeId == null || cell.nodeId <= 0) {
            return;
        }
        var oldNode = tempNodeIdMap.get(cell.nodeId);
        if(oldNode != null) {
            cell.nodeId = oldNode.nodeId;
        //cell.value = oldNode;
        }
    }));
    var encoder = new mxCodec();
    var encodeNode = encoder.encode(graphModel);               
    mashupInfo.pureXml = mxUtils.getPrettyXml(encodeNode);
    return mashupInfo;
}
        
digitnexus.editor.MashupInfoManager.prototype.createMashupDefinitionContent =  function(mashupInfoTable) {   
    mashupInfoTable.addTextRow(mxResources.get('name', null, 'name'),'name', '');
    mashupInfoTable.addTextarea(mxResources.get('description',null,'description'),'description','', 5,18);
    //name, isMultiSelect, size, labels, values, selectValues
    var templates =  this.getDefinitionTemplates();
    var labels = [];
    var values = [];
    var selectTemplate = null;
    if(null != templates) {
        var size = templates.size();
        if(templates != null && size > 0){
            for(var index = 0 ;index < size; index++) {
                var t = templates.get(index);
                if(t == null) {
                    continue;
                }
                labels.push(t.name);
                values.push(t.id);
            }
            if(values.length > 0) {
                selectTemplate = values[0];
            }
        }
    }
    //name, isMultiSelect, size, labels, values, selectValues
    mashupInfoTable.addComboboxRow(mxResources.get('template'),'template',false, 5,labels,values,selectTemplate);
}

digitnexus.editor.MashupInfoManager.prototype.openMashupInfoInEditor = function(mashupinfoId) {
    if(null != this.currentMashupInfo && this.currentMashupInfo.id == mashupinfoId && this.currentMashupInfo.isOpen) {
        mxUtils.alert(mxResources.get('mashupHaveOpened',null,'The mashup have been opened!'));
        return;
    }     
    if(!digitnexus.editor.me.mashupInfoManager.notifyToSave()) {
       return;            
    }     
    var mashupinfo = this.getMashupInfoById(mashupinfoId);
    if(null == mashupinfo) {
        mxUtils.alert(mxResources.get('failGetMashupById',null,'cannot get mashupinfo by id: ') + mashupinfoId);
        return;
    }
    digitnexus.editor.me.mashupEditor.graph.getModel().beginUpdate();
    try{
        if(mashupinfo == null || mashupinfo.pureXml == null || mashupinfo.pureXml == '') {
            //this.mashupEditor.setGraphXml(null);
            var root =  digitnexus.editor.me.mashupEditor.graph.getModel().getRoot();
            if(root != null && root.getChildCount() > 0) {
                var cell = root.getChildAt(0);
                if(cell != null && cell.getChildCount() > 0) {
                    var size = cell.getChildCount();
                    var cells = [];
                    for(var i = 0; i < size; i++) {
                        cells.push(cell.getChildAt(i));
                    }
                    digitnexus.editor.me.mashupEditor.graph.removeCells(cells,true);
                }
            }
        } else {
            var doc = mxUtils.parseXml(mashupinfo.pureXml); 
            digitnexus.editor.me.mashupEditor.graph.stopEditing(false);
            digitnexus.editor.me.mashupEditor.setGraphXml(doc.documentElement);
            this.setCellValues_( digitnexus.editor.me.mashupEditor.graph.getModel().getRoot(),mashupinfo);
            var addOverlayForModel = mxUtils.bind(this,function(subCell) {
                if(subCell == null || subCell.isEdge()) {
                    return;
                }
                digitnexus.editor.me.addOverlay(subCell);
            })
            this.iterateCellTree( digitnexus.editor.me.mashupEditor.graph.getModel().getRoot(),addOverlayForModel); 
            digitnexus.editor.me.mashupEditor.modified = false;
            digitnexus.editor.me.mashupEditor.undoManager.clear();					
            if (mashupinfo.name != null){
                digitnexus.editor.me.mashupEditor.filename = mashupinfo.name;
            }
                           
        }
        if(mashupinfo!= null) {
            if(this.currentMashupInfo != null) {
                this.currentMashupInfo.isOpen = false;
            }
            this.currentMashupInfo = mashupinfo;
            this.currentMashupInfo.isOpen = true;
            digitnexus.editor.me.preferenceManager.userProfile.lastAccessReport = mashupinfoId.id;
        }
    } finally{
        digitnexus.editor.me.mashupEditor.graph.getModel().endUpdate();
    }
    this.setUserProfile_(digitnexus.editor.Constants.USER_PROFILE_OTHERS,'lastViewDefinition',mashupinfoId);
}
         
digitnexus.editor.MashupInfoManager.prototype.getMashupInfoById = function(mashupinfoId) {
    var size = this.mashupInfoList.size();
    if(this.mashupInfoList == null || size< 1) {
        return null;
    }
    for(var index = 0; index < size; index++) {
        var mashupinfo = this.mashupInfoList.get(index);
        if(mashupinfo == null) {
            continue;
        }
        if(mashupinfo.id == mashupinfoId) {
            return mashupinfo;
        }
    }
    return null;
}

digitnexus.editor.MashupInfoManager.prototype.setCellValues_ = function(cell,mashupinfo) {
    if(cell == null ||  mashupinfo == null) {
        return ;
    }
    var process = function(subCell) {
        if(subCell == null || subCell.isEdge()) {
            return;
        }
        if(subCell.nodeId != null && mashupinfo.nodes != null && mashupinfo.nodes.size() > 0) {  
            var count = mashupinfo.nodes.size()
            for(var i = 0; i< count; i++) {
                var node = mashupinfo.nodes.get(i);  
                if(node == null) {
                    continue;
                }
                if(node.nodeId == subCell.nodeId) {
                    subCell.setValue(node);
                    break;
                }  
            }
        }
    }
    this.iterateCellTree(cell,process);         
}
         
digitnexus.editor.MashupInfoManager.prototype.iterateCellTree = function(cell, callback) {
    if(cell == null || callback == null) {
        return;
    }
    callback(cell);
    var childCount = cell.getChildCount(cell);
    if(childCount < 1) {
        return ;
    }
    for(var i = 0; i< childCount; i++) {
        var child = cell.getChildAt(i);  
        if(child == null || child.isEdge()) {
            continue;
        }
        this.iterateCellTree(child,callback);
    }
    return;
}

digitnexus.editor.MashupInfoManager.prototype.mergeAllMashupNodes_ = function(cell,nodeList) {
    if(cell == null) {
        return nodeList;
    }
    if(nodeList == null) {
        nodeList = [];
    }
    if(cell.value != null && cell.value instanceof digitnexus.re.MashupNode) {
        var node = this.createOneMashupNode_();            
        if(cell.value.nodeId == -1 || cell.value.nodeId == null) {
            cell.value.nodeId = digitnexus.editor.me.requestId();
        }

        node.nodeId = cell.value.nodeId;
        node.networkId =  this.currentMashupInfo.id;
        node.modelId = cell.value.modelId;
        node.parameters = cell.value.parameters == null? null: cell.value.parameters.data;
        node.editorParameters = cell.value.editorParameters;
        node.advanceParameters =  cell.value.advanceParameters == null? null: cell.value.advanceParameters.data;
        node.name = cell.value.name;
        //node.inputNodes = cell.value.inputNodes == null? null: cell.value.inputNodes.data;
        //node.outputNodes = cell.value.outputNodes == null? null: cell.value.outputNodes.data;
        node.operator = cell.value.operator;
        node.inputIds = cell.value.inputIds == null? null: cell.value.inputIds.data;
        node.outputIds = cell.value.outputIds == null ? null: cell.value.outputIds.data;
        node.data = cell.value.data;
        nodeList.push(node);
    }
    var childCount = cell.getChildCount(cell);
    if(childCount < 1) {
        return nodeList;
    }
    for(var i = 0; i< childCount; i++) {
        var child = cell.getChildAt(i); 
        if(child == null || child.isEdge()) {
            continue;
        }
        this.mergeAllMashupNodes_(child,nodeList);  
    }
    return nodeList;
}

digitnexus.editor.MashupInfoManager.prototype.beforeSerialize_ = function(cell,nodeMap){
    if(cell == null) {
        return nodeList;
    }
    if(cell.isEdge()) {
        cell.ouputNodeId = null;
        cell.inputNodeId = null;
    }
    if(nodeMap == null) {
        nodeMap = new digitnexus.utils.HashMap();
    }
    if(cell.value != null && cell.value instanceof digitnexus.re.MashupNode) {              
        if(cell.value.nodeId == -1 || cell.value.nodeId == null) {
            cell.nodeId = node.nodeId = cell.value.nodeId = digitnexus.editor.me.requestId();
        }
        if(cell.value.nodeId != cell.nodeId) {
            throw 'id error when serialize graph model';
        }
        cell.nodeId = cell.value.nodeId;
        nodeMap.put(cell.value.nodeId,cell.value);
        cell.value = null;// cell.value.nodeId;
    }
    var childCount = cell.getChildCount(cell);
    if(childCount < 1) {
        return nodeMap;
    }
    for(var i = 0; i< childCount; i++) {
        var child = cell.getChildAt(i);  
        if(child == null || child.isEdge()) {
            continue;
        }
        this.beforeSerialize_(child,nodeMap);  
    }
    return nodeMap;
}
    
digitnexus.editor.MashupInfoManager.prototype.afterSerialize_ = function(cell,nodeMap){
    if(cell == null || nodeMap == null || nodeMap.size() < 1) {
        return ;
    }  
    if(cell.nodeId != null && cell.nodeId != -1) {              
        var value = nodeMap.get(cell.nodeId);
        ;
        if(value == null) {
            throw 'value cannot be found when _afterSerialize';
        }
        cell.value = value;
    }
    var childCount = cell.getChildCount(cell);
    if(childCount < 1) {
        return ;
    }
    for(var i = 0; i< childCount; i++) {
        var child = cell.getChildAt(i);  
        if(child == null || child.isEdge()) {
            continue;
        }
        this.afterSerialize_(child,nodeMap);  
    }
    return;
}

digitnexus.editor.MashupInfoManager.prototype.doValidate_ = function(cell,result) {
    if(cell == null) {
        return result;
    }
    if(result == null) {
        result = [];
    }
    if(cell.value != null && cell.value instanceof digitnexus.re.MashupNode) {
        var node = cell.value;            
        if(node.nodeId == -1 || node.nodeId == null) {
            result.push(digitnexus.editor.me.createMessage(digitnexus.utils.Constants.ERROR,'node ID not init '),node.nodeId);
            //serious error, no need to do next validatation
            return;
        }
        this.validateParams_(node.parameters,cell.value,result);
        this.validateParams_(node.advanceParameters,cell.value,result);
    }   

             
    var childCount = cell.getChildCount(cell);
    if(childCount < 1) {
        return result;
    }
    for(var i = 0; i< childCount; i++) {
        var child = cell.getChildAt(i); 
        if(child == null || child.isEdge()) {
            continue;
        }
        this.doValidate_(child,result);  
        if(result.length > 10) {
            return result;
        }
    }
    return result;
}

digitnexus.editor.MashupInfoManager.prototype.isNeedSaveCurrentMashup = function(){
    return this.isModifie;
}
 
digitnexus.editor.MashupInfoManager.prototype.validateParams_ = function(parameters,node,result){
    if(parameters != null && parameters.size() > 0) {
        var size = parameters.size();
        for(var index = 0; index < size; index++) {
            var param = parameters.get(index);
            if(param == null) {
                continue;
            }
            var configParam = digitnexus.editor.me.mashupConfigManager.getConfigParam(node,param.name);
            if(configParam == null) {
                result.push(digitnexus.editor.me.createMessage(digitnexus.utils.Constants.INFO,'config param not found for Param: ' + param),node.nodeId);      
                if(result.length > 10) {
                    return result;
                }
                continue;
            }
            digitnexus.editor.me.validateOneParam(param,configParam,result,node);
            if(result.length > 10) {
                return result;
            }
        }
    }
}

digitnexus.editor.MashupInfoManager.prototype.getNodesForJsonMashupInfo_ = function(nodes) {
    var nodeList = new digitnexus.utils.Set();
    for(var index = 0; index < nodes.length; index++) {
        var jsonNode = nodes[index];
        var node =  this.createOneMashupNode_();
        node.nodeId = jsonNode.nodeId;
        node.modelId = jsonNode.modelId;  
        var createParam = function(jp) {
            return new digitnexus.editor.Parameter(jp.name,jp.type,jp.value,jp.id)
        }
        if(jsonNode.editorParameters != null) {
            for(var ii = 0; ii < jsonNode.editorParameters.length; ii++) {
                node.editorParameters.push(createParam(jsonNode.editorParameters[ii]));
            }
        }
        if(jsonNode.parameters != null && jsonNode.parameters.length > 0) {
            for(var ii = 0; ii < jsonNode.parameters.length; ii++) {
                node.parameters.add(createParam(jsonNode.parameters[ii]));
            }
        }
        if(jsonNode.advanceParameters != null && jsonNode.advanceParameters.length > 0) {
            for(var ii = 0; ii < jsonNode.advanceParameters.length; ii++) {
                node.advanceParameters.add(createParam(jsonNode.advanceParameters[ii]));
            } 
        }
        if(jsonNode.name == null || jsonNode.name == '') {
            var configNode = digitnexus.editor.me.mashupConfigManager.getConfigNode(jsonNode.modelId);
            if(configNode != null) {
                node.name = configNode.name;
            }else {
                throw 'node name not found nodeID: ' + node.id+',modelId: ' + jsonNode.modelId;
            }     
        } else {
            node.name = jsonNode.name;
        }
        node.networkId =  jsonNode.networkId;
        //only for operator		
        //private   inputNodes = null;
        //private   outputNodes = null;
        //private long operator = -1;
        //for data node stored in operator
        if(jsonNode.inputIds != null && jsonNode.inputIds.length > 0) {
            for(var ii = 0; ii < jsonNode.inputIds.length; ii++) {
                node.inputIds.add(jsonNode.inputIds[ii]);
            }
        }
        if(jsonNode.outputIds != null && jsonNode.outputIds.length > 0) {
            for(var ii = 0; ii < jsonNode.outputIds.length; ii++) {
                node.outputIds.add(jsonNode.outputIds[ii]);
            } 
        }
        nodeList.add(node);
    }
    return nodeList;
}
        
digitnexus.editor.MashupInfoManager.prototype.createNode = function(configNode) {   
    if(configNode == null || configNode.name == null) {
        console.log("config name is null when create MashupNode instance");
        return;
    }
    var node = this.createOneMashupNode_();
    if(this.currentMashupInfo == null) {
        this.createNewMashupDefinition(false,false);
    }
    this.isModified = true;
    node.nodeId =  digitnexus.editor.me.requestId();
    node.modelId = configNode.id;
    node.networkId = this.currentMashupInfo.id;
    node.name = configNode.name;
    node.editorParameters = [];
            
    //only for operator		
    this.inputNodes = null;// new digitnexus.re.utils.Set();
    this.outputNodes = null;// new digitnexus.re.utils.Set();
    //this.operator = null;
    //for data node stored in operator
    //node.inputIds = configNode.allowableInput;
    //node.outputIds = configNode.availableOutput;
           
    //this.data = null
    if(configNode.neededParameter != null) {
        var size = configNode.neededParameter.size();
        for(var index = 0; index < size; index++){
            var conf = configNode.neededParameter.get(index);
            var defaultValue = conf.defaultValue;
            if(conf.type == 'array' || conf.type == 'list') {
                defaultValue = conf.defaultValue.split(',');
            }
            node.parameters.add(new digitnexus.editor.Parameter(conf.name,conf.type,defaultValue)); 
        } 
    }  
    if(configNode.parametersTemplates != null && configNode.parametersTemplates.length > 0) {
        var selectTemplate = null;
        for(var i = 0 ; i < configNode.parametersTemplates.length; i++) {
            if(configNode.parametersTemplates[i] != null && configNode.parametersTemplates[i] != '') {
                node.editorParameters.push(new digitnexus.editor.Parameter(digitnexus.editor.Constants.ED_SELECT_TEMPLATE,
                    'string', configNode.parametersTemplates[i]))
                selectTemplate = configNode.parametersTemplates[i];
                break;
            }
        }
                
        if(null != selectTemplate && selectTemplate != '') {
            //node.selectTemplate = selectTemplate;
            digitnexus.editor.me.setEditorParameter(node, digitnexus.editor.Constants.ED_SELECT_TEMPLATE, selectTemplate);
            digitnexus.editor.me.mashupConfigManager.configNodeParameters(node,null);
        }else {
            console.log('select parameter is NULL for config node name ' + configNode.name);
        }
    }

    return node;
}
        
digitnexus.editor.MashupInfoManager.prototype.createOneMashupNode_ = function() {
    var node = new digitnexus.re.MashupNode();
    node.editorParameters = [];
    node.advanceParameters = new digitnexus.utils.Set();
    return node;
}
          