digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};

digitnexus.editor.NodeProperties = function() {
    this.propertiesChangeManager = new digitnexus.utils.PropertiesChangeManager();
    var lis = digitnexus.editor.me.getListener('chartTypeChange');
    if(lis == null) {
        digitnexus.editor.me.addListener('chartTypeChange',this.chartTypeListener_);
    }  
}
   
digitnexus.editor.NodeProperties.prototype.chartTypeListener_ = function(event) {
    if(!mxUtils.confirm('All advance parameters will be lost, are you sure to change the chartType')) {
        return;
    }
    var node = event.node;
    if(node == null) {
        return;
    }
    if(event.srcElement == null || event.srcElement.name != 'chartType') {
        return ;
    }

    var oldValue =   digitnexus.editor.me.getEditorParameter(node,digitnexus.editor.Constants.ED_SELECT_TEMPLATE);
    if(oldValue.value == event.srcElement.value) {
        return;
    }
    this.mergeValue(node,this.tbody.childNodes);
    digitnexus.editor.me.setEditorParameter(node,digitnexus.editor.Constants.ED_SELECT_TEMPLATE,event.srcElement.value);
    digitnexus.editor.me.mashupConfigManager.configNodeParameters(node, new digitnexus.editor.Parameter('chartType','string',event.srcElement.value) );
    var tableBody = event.container;
    var childend = tableBody.childNodes
    var lastRow = childend[childend.length-1];
    var size = childend.length-1
    while(tableBody.firstChild != null) {
        tableBody.removeChild(tableBody.firstChild);
    }
    this.createBaseProperties_(tableBody,node,false);
    tableBody.appendChild(lastRow);
};


digitnexus.editor.NodeProperties.prototype.createBaseProperties_ = function(tbody, node) {
    if(null == node) {
        return;
    }
    if(tbody == null) {
        return;
    }
    var parameters = node.parameters;
    if(null == parameters || parameters.size() < 1) {
        return;
    }
    var configNode = digitnexus.editor.me.mashupConfigManager.getConfigNode(node.modelId);
    if(null == configNode) {
        return;
    }
    var size = parameters.size();
    for(var i = 0; i < size ; i++) {
        var param = parameters.get(i);
        if(null == param) {
            continue;
        }
        this.appendRow_(tbody,param,configNode,node);         
    }  
}


digitnexus.editor.NodeProperties.prototype.appendRow_ = function(container, param, configNode,node) {
    if(null == configNode.neededParameter) {
        return null;
    } 
    var configParam =  digitnexus.editor.me.mashupConfigManager.getConfigParam(node,param.name);
    var selectTemplate = digitnexus.editor.me.getEditorParameter(node,digitnexus.editor.Constants.ED_SELECT_TEMPLATE);
    if(null == configParam && selectTemplate != null) {
        var pt = digitnexus.editor.me.mashupConfigManager.getParameterTemplate(selectTemplate.value)
        if(pt == null || pt.baseParameters == null || pt.baseParameters.size() <= 0) {
            console.log("fail to get config parameter from template: " + param.name);
            return;
        }
        configParam =  digitnexus.editor.me.getConfigParam(node,param.name);
        if(null == configParam) {
            console.log("fail to get config parameter: " + param.name);
            return;
        }
    }
    //create a td element and append regarding input element
    var inputTd = this.createNodeByUIType_(configParam,param,node,container);
    if(null == inputTd) {
        return null;
    }
    var ownerDoc = document;
    var row = ownerDoc.createElement('tr');
    if(configParam.uiType != 'hidden') {
        var labelBox = ownerDoc.createElement('td');
        var label = mxResources.get(param.name, null, param.name);
        if(this.isRequired_(configParam)) {
            label = '<font color="red">'+ '*'+ '</font>'+label;
        }
        var lc = ownerDoc.createElement('span');
        lc.innerHTML = label;
        labelBox.appendChild(lc);
        //mxUtils.write(labelBox, label);
        row.appendChild(labelBox); 
    }
    row.appendChild(inputTd);
    var errorBox = ownerDoc.createElement('td');
    errorBox.style.dispaly='none';
    errorBox.style.color = 'red';
    errorBox.id = configParam.name + 'Error';    
    row.appendChild(errorBox);
    container.appendChild(row);
}

digitnexus.editor.NodeProperties.prototype.isRequired_ = function(configParam) {
    if(!configParam.validators || configParam.validators.trim() == '') {
        return false;
    }
    return configParam.validators.indexOf('required') != -1;
}

   
digitnexus.editor.NodeProperties.prototype.createNodeByUIType_ = function(configParam, param,node,container) {
    if(configParam == null ||configParam.uiType == null) {
        return;
    }
    var elt = null;
    switch(configParam.uiType) {
        case 'radio':
            elt = this.createRadio_(configParam,param,'radio');
            break;
        case 'text':
            elt = this.createText_(configParam,param,'text');
            break;
        case 'checkbox':
            elt = this.createCheckbox_(configParam,param,'checkbox');
            break; 
        case 'select':
            elt = this.createSelect_(configParam,param,'select');
            break;       
        case 'hidden':
            elt = this.createHidden_(configParam,param,'hidden');
            break;
        case 'file':
            elt = this.createFile_(configParam,param,'file');
            break;
        case 'image':
            elt = this.createImage_(configParam,param,'image');
            break;
        case 'password':
            elt = this.createPassword_(configParam,param,'password');
            break;
        case 'reset':
            elt = this.createReset_(configParam,param,'reset');
            break;
        case 'submit':
            elt = this.createSubmit_(configParam,param,'submit');
            break;
        case 'textarea':
            elt = this.createTextarea_(configParam,param,'textarea');
            break;
        default:
            elt = this.createText_(configParam,param,'text');
    }   
    if(configParam.trigger != null && configParam.trigger.trim() != ''){
        var listeners = digitnexus.editor.me.getListener(configParam.trigger);
        if(null != listeners) {
            mxEvent.addListener(elt,mxEvent.CHANGE,mxUtils.bind(this,function(event) {
                event.node = node;
                event.container = container;
                //this.onEvent(configParam.trigger, this, event)
                var size = listeners.size();
                for(var index = 0; index < size; index++) {
                    var func = listeners.get(index);
                    if(func == null) {
                        continue;
                    }
                    func.apply(this,arguments);
                }
            }));
        }
    }
    return elt;
}
    
digitnexus.editor.NodeProperties.prototype.createSubmit_ = function(configParam,param,type) {     
    return  this.createCommonInput_(configParam,param,type);
}


digitnexus.editor.NodeProperties.prototype.createReset_ = function(configParam,param,type) {     
    return  this.createCommonInput_(configParam,param,type);
}


digitnexus.editor.NodeProperties.prototype.createPassword_ = function(configParam,param,type) {  
    return  this.createCommonInput_(configParam,param,type);
}

digitnexus.editor.NodeProperties.prototype.createImage_ = function(configParam,param,type) {     
    return  this.createCommonInput_(configParam,param,type);
}
digitnexus.editor.NodeProperties.prototype.createFile_ = function(configParam,param,type) { 
    //<span class="qq-upload-button-l">选择文件</span>
    //<input type="file" name="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;">
    
    //float: left;
//display: block;
//background: url(../images/common/button/btn_6_bg_r.gif) right top no-repeat;
//padding: 0px 10px 0px 5px;
//color: black;

    var elt = this.getInput_(param.value,configParam);
    elt.type = type;
   
    if(digitnexus.utils.isIe()) {
         elt.style.filter='alpha(opacity=0)'
    }else {
         elt.style.opacity = 0;
    }
    elt.tempValue = param.value;
    elt.style.position='absolute';
    elt.style.left = '103px';
    elt.style.width='50px';
    elt.style.height='20px'
    elt.setAttribute('title', mxResources.get('currentSelect', null, 'current select: ') + param.value);
    
    var div = document.createElement('div');
    div.style.paddingBottom = 5+'px';
    div.className='fileSelectionDiv';
    
    var span = document.createElement('a');
    span.className='fileSelectBox';
    span.appendChild(document.createTextNode(mxResources.get('selectFile', null, 'Select File '),[param.value]));
    span.style.float='left';
    span.style.display='block';
    span.style.padding='0px 10px 0px 5px'
    span.style.color='black';
    
    div.appendChild(span);   
    div.appendChild(elt);
    div.type='file';
    var p = document.createElement('td');
    p.appendChild(div);
    return p;
}


digitnexus.editor.NodeProperties.prototype.createHidden_ = function(configParam,param,type) {
    var elt = this.getInput_(param.value,configParam);
    elt.type = type;
    var p = document.createElement('td');
    p.colspan = 2;
    p.appendChild(elt);       
    return p;
}

        
digitnexus.editor.NodeProperties.prototype.createHidden_ = function(configParam,param,type) {
    var elt = this.getInput_(param.value,configParam);
    elt.type = type;
    var p = document.createElement('td');
    p.colspan = 2;
    p.appendChild(elt);       
    return p;
}
    
    
digitnexus.editor.NodeProperties.prototype.createTextarea_ = function(configParam,param,type) {  
    var name = configParam.name;
    var value = param.value == null ? '': param.value;
    var elt = digitnexus.utils.formFactory.createTextarea(name,value,10,40);
    var p = document.createElement('td');
    p.appendChild(elt); 
            
    if(configParam != null) {
        this.addValidator_(elt,configParam);
    }
    return p;
}


digitnexus.editor.NodeProperties.prototype.createText_ = function(configParam,param,type) {  
    var name = configParam.name;
    var value = param.value == null ? '': param.value;
    var elt = digitnexus.utils.formFactory.createTextbox(name,value);
    var p = document.createElement('td');
    p.appendChild(elt); 
             
    if(configParam != null) {
        this.addValidator_(elt,configParam);
    }
    return p;
}

        
digitnexus.editor.NodeProperties.prototype.createRadio_ = function(configParam,param,type) {
    var values =  this.parseAvaiableValue_(configParam.availableValue);
    if(null == values || values.length < 1) {
        return;
    }
    var p = document.createElement('td');
    for(var i = 0; i< values.length; i++) {
        var elt = this.getInput_(values[i],configParam);
        elt.type = 'radio';  
        if(param.value == values[i]) {
            elt.checked='checked';
        }
        p.appendChild(elt);
        mxUtils.write(p, mxResources.get(values[i], null, values[i]));
    }
    return p;
}


digitnexus.editor.NodeProperties.prototype.createCheckbox_ = function(configParam,param,type) {
    var values =  this.parseAvaiableValue_(configParam.availableValue);
    if(null == values || values.length < 1) {
        return;
    }
    var p = document.createElement('td');
    for(var i = 0; i< values.length; i++) {
        var elt = document.createElement('input');
        elt.value = values[i];
        elt.id = elt.name = param.name;
        if(configParam != null) {
            this.addValidator_(elt,configParam);
        }
        elt.type = 'checkbox';
        for(var ii = 0; ii < param.value.length; ii++) {
            if(param.value[ii] == values[i]) {
                elt.checked='checked';
                break;
            }
        }
        p.appendChild(elt);
        mxUtils.write(p, mxResources.get(values[i], null, values[i]));
    }
    return p;
}

        
digitnexus.editor.NodeProperties.prototype.createSelect_ = function(configParam,param,type) {
    var values =  this.parseAvaiableValue_(configParam.availableValue);
    if(null == values || values.length < 1) {
        values = [];
    }
    var td = document.createElement('td');
    var selection = document.createElement('select');
    selection.name = configParam.name;
    selection.type = 'select';
    for(var i = 0; i< values.length; i++) {
        var elt = document.createElement('option');
        elt.name = configParam.name;
        elt.value = values[i];
        if(values[i] == param.value) {
            elt.selected = true;
        }
        mxUtils.write(elt, mxResources.get(values[i], null, values[i]));
        selection.appendChild(elt);
    }
    td.appendChild(selection);
    return td;
}


digitnexus.editor.NodeProperties.prototype.createTdAndAppendElt_ = function(elt) {     
    var p = document.createElement('td');
    p.appendChild(elt);       
    return p;
}
digitnexus.editor.NodeProperties.prototype.createCommonInput_ = function(configParam,param,type) {     
    var elt = this.getInput_(param.value,configParam);
    elt.type = type;
    return this.createTdAndAppendElt_(elt);
}


digitnexus.editor.NodeProperties.prototype.getInput_ = function(value,configParam) {     
    var elt = document.createElement('input');
    elt.value = value == null ? '': value;
    elt.id = elt.name = configParam.name;
    if(configParam != null) {
    //this.addValidator_(elt,configParam);
    }
    return elt;
}

        
digitnexus.editor.NodeProperties.prototype.parseAvaiableValue_ = function(availableValue){
    if(availableValue == null ||  availableValue == '') {
        return;
    }
    var values =  availableValue.split(',');
    if(null == values || values.length < 1) {
        return;
    }
    return values;
}

         
digitnexus.editor.NodeProperties.prototype.mergeValue = function(node, row) {
    if(node == null || row == null || row.length < 1) {
        return;
    }
             
    if((node.parameters == null || node.parameters.size() < 1)&&
        (node.advanceParameters == null || node.advanceParameters.size() < 1)){
        return;
    }
    var parameters = node.parameters;
    var advanceParameters = node.advanceParameters;
             
    for(var i = 0; i< row.length; i ++) {
        var td = row[i].childNodes[1];
        if(td == null) {
            continue;
        }
        var inputs = td.childNodes;
        if(inputs == null) {
            continue;
        }
        var nv = this.getInputNameValue_(inputs,node);
        if(!nv || nv.length != 2) {
            continue;
        }
        var param = null;
        for(var ii = 0; ii < parameters.size(); ii ++) {
            var p = parameters.get(ii);
            if(p == null) {
                continue;
            }
            if(p.name === nv[0]) {
                param = p;
                break;
            }
        }
        if(param == null) {
            for(var ii = 0; ii < advanceParameters.size(); ii ++) {
                var p = advanceParameters.get(ii);
                if(p == null) {
                    continue;
                }
                if(p.name === nv[0]) {
                    param = p;
                    break;
                }
            }
        }
        if(param != null && param.value != nv[1]) {
            param.value = nv[1];
            digitnexus.editor.me.mashupInfoManager.isModified = true;
        }
    }
}

         
digitnexus.editor.NodeProperties.prototype.getInputNameValue_ = function(inputs,node) {
    if(inputs == null || inputs.length < 1) {
        return;
    }
    var uitype = inputs[0].type;
    if(uitype == null || uitype=='') {
        return null;
    }
    if(uitype.indexOf('select-') >= 0) {
        uitype = 'select';
    }
    var name = null; 
    var value = null;
             
    switch(uitype) {
        case 'text': 
        case 'password':
        case 'hidden':
        case 'textarea':
            name = inputs[0].name;
            value =  inputs[0].value;
            break; 
        case 'radio':
            for(var i = 0; i<inputs.length; i++) {
                if(inputs[i].checked) {
                    value = inputs[i].value;
                    name = inputs[i].name;
                    break;
                }
            }
            break;
        case 'checkbox':
            value = [];
            name = inputs[0].name;
            for(var i = 0; i<inputs.length; i++) {
                if(inputs[i].checked) {
                    value.push(inputs[i].value);
                }
            }
            break;
        case 'select':
            inputs = inputs[0].childNodes;
            for(var i = 0; i<inputs.length; i++) {
                if(inputs[i].selected) {
                    value = inputs[i].value;
                    name = inputs[i].name;
                    break;
                }
            }
            break;       
        case 'image':
                    
            break;
        case 'reset':
                    
            break;
        case 'submit':
 
            break;
        case 'file':
            var input = inputs[0].childNodes[1];
            name = input.name;          
            var file = null;
            if(digitnexus.utils.isIe()) {
                file = input.all.item(0);
            }else {
                file = input.files[0];
            }
            if(!file) {
                 alert('you must select a file')
                 value = input.tempValue;
                 if(!value) {
                  throw 'file select error';
                 }
                 break;
            }
            value =  file.name;
            this.handleFileInput_(file,node);
        default:
                   
    }
    return [name,value];
}


digitnexus.editor.NodeProperties.prototype.handleFileInput_ = function(file,node) {
    /*
        dititnexus.asynformupload.formSubmit(inputs, 
            digitnexus.editor.utils.getUrl(actionUrl),  function(d){
            //alert('success' + d);
            });
    */
  
   var url = digitnexus.editor.Constants.REQUEST_FILE_UPLOAD + '?nodeId=' + node.nodeId+'&qqfile='+encodeURIComponent(file.name);
   digitnexus.utils.fileManager.upload(file,digitnexus.editor.utils.getUrl(url),function(req){
       console.log('upload successfull');
   },function(e){
       
   });
}


digitnexus.editor.NodeProperties.prototype.removeError_ = function(configParam) {
    var errorBox = document.getElementById(configParam.name+"Error");
    if(errorBox == null) {
        return;
    }
    var children = errorBox.childNodes;
    for(var i=0;i<children.length;i++){
        errorBox.removeChild(children[i]);
    }
    //errorBox.style.visibility = 'hidden';
    errorBox.style.dispaly = 'none';
}


digitnexus.editor.NodeProperties.prototype.showError_ = function(configParam,msg) {
    var errorBox = document.getElementById(configParam.name+"Error");
    if(errorBox == null) {
        return;
    }
    mxUtils.write(errorBox, msg);
    //errorBox.style.visibility = '';
    errorBox.style.dispaly = 'none';
}


digitnexus.editor.NodeProperties.prototype.addValidator_ = function(elt, configParam) {
    if((configParam.type == null || configParam.type == '')&&
        (configParam.validators == null)) {
        return;
    }
    mxEvent.addListener(elt, 'focus', mxUtils.bind(this, function() {
        //console.log('onfocus');      
        }));
              
    mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function() {
        var result = [];
        digitnexus.editor.me.validateOneParam(new digitnexus.editor.Parameter(elt.name,configParam.type,elt.value),configParam,result);
        this.removeError_(configParam);
        if(result == null || result.length < 1) {
            this.showError_(configParam,result); 
        }
    }));
              
}


digitnexus.editor.NodeProperties.prototype.hiddenAdvanceProperties = function(tbody,node) {
    var as = this.getAdvanceSeperator_(tbody);
    if(as == -1) {
        return;
    }
    var childend = tbody.childNodes
    for(var i = as ; i < childend.length-1; i++) {
        var ch = childend[i];
        if(ch == null) {
            continue;
        }
        this.hiddenElement_(ch);
    }
};


digitnexus.editor.NodeProperties.prototype.getAdvanceSeperator_ = function(tbody) {
    if(tbody == null) {
        return -1;
    }
    var childend = tbody.childNodes
    if(null == childend || childend.length < 1) {
        return -1;
    }
    var as = -1;
    for(var i = 0 ; i< childend.length; i++) {
        var ch = childend[i];
        if(ch == null) {
            continue;
        }
        if('advanceSeperator' == ch.id) {
            as =  i;
            break;
        }
    }
    return as;
}

          
digitnexus.editor.NodeProperties.prototype.hiddenElement_ = function(elt) {
    if(null == elt) {
        return;
    }
    elt.style.display= "none "; 
  
}


digitnexus.editor.NodeProperties.prototype.showElement_ = function(elt) {
    if(null == elt) {
        return;
    }
    elt.style.display='';
}

          
digitnexus.editor.NodeProperties.prototype.showAdvanceProperties_ = function(tbody,node) {
    var as =   this.getAdvanceSeperator_(tbody);
    if(as != -1) {
        var childend = tbody.childNodes
        for(var i = as ; i < childend.length-1; i++) {
            var ch = childend[i];
            if(ch == null) {
                continue;
            }
            this.showElement_(ch);
        }
        return;
    }
    if(null == node) {
        return;
    }
    if(tbody == null) {
        return;
    }
    var configNode = digitnexus.editor.me.mashupConfigManager.getConfigNode(node.modelId);
    if(null == configNode || configNode.parametersTemplates == null ||  configNode.parametersTemplates.length < 1) {
        return;
    }
          
    if(node.advanceParameters == null || node.advanceParameters.size() < 1) {
        return;
    }
          
    var parameters = node.advanceParameters;
    if(null == parameters || parameters.size() < 1) {
        return;
    }
            
    var row = document.createElement('tr');
    row.id='advanceSeperator';
    row.style.display='none';
    tbody.insertBefore(row,tbody.lastChild);
          
    var size = parameters.size();
    for(var i = 0; i < size ; i++) {
        var param = parameters.get(i);
        if(null == param) {
            continue;
        }
        this.appendRowAdvanceProperties_(tbody,param,configNode,node,row);         
    }
}

        
digitnexus.editor.NodeProperties.prototype.appendRowAdvanceProperties_ = function(container, param, configNode,node) {
    var selectTemplate = digitnexus.editor.me.getEditorParameter(node,digitnexus.editor.Constants.ED_SELECT_TEMPLATE);
    if(selectTemplate == null) {
        console.log('fail to append advance properties since select template not found: ' + param);
        return;
    }
    var   pt =   digitnexus.editor.me.mashupConfigManager.getParameterTemplate(selectTemplate.value);
    if(null == pt) {
        console.log('fail to append advance properties since paremeter template not found: param.name='
            + param+' paremeter template= ' + selectTemplate);
        return;
    }
    var configParam =  digitnexus.editor.me.mashupConfigManager.getConfigParam(node, param.name);
    if(null == configParam) {
        console.log('config parameter is null param: ' + param + ', selectTemplate:'+ selectTemplate);
        return;
    }
    var inputTd = this.createNodeByUIType_(configParam,param,node,container);
    if(null == inputTd) {
        console.log('fail to create UI td configParam: ' + configParam +" param: " + param);
        return null;
    }       
              
    var row = document.createElement('tr');
    if(configParam.uiType != 'hidden') {
        var labelBox = document.createElement('td');
        mxUtils.write(labelBox, param.name);
        row.appendChild(labelBox); 
    }
    row.appendChild(inputTd); 
              
    var errorBox = document.createElement('td');
    errorBox.style.dispaly='none';
    errorBox.style.color = 'red';
    errorBox.id = configParam.name + 'Error';    
    row.appendChild(errorBox);      
    container.insertBefore(row,container.lastChild);
}


digitnexus.editor.NodeProperties.prototype.createProperties = function(cell) {

    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.height = '100%';
       
    this.tbody = document.createElement('tbody'); 
    this.createBaseProperties_(this.tbody, cell.value,false);
        
    var row = document.createElement('tr');
    var td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.align = 'right';
    td.appendChild(mxUtils.button(mxResources.get('ok',null,"Ok"), mxUtils.bind(this,function()
    {
        this.mergeValue(cell.value,this.tbody.childNodes);
        digitnexus.editor.me.mashupEditor.graph.cellLabelChanged(cell,cell.value,false);
        digitnexus.editor.me.mashupEditor.hideProperties()
    })));
        
    row.appendChild(td);
        
    td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.align = 'right';  
    td.appendChild(mxUtils.button(mxResources.get('cancel',null,"Cancel"), mxUtils.bind(this, function()
    {
        digitnexus.editor.me.mashupEditor.hideProperties(); 
    })));
        
    row.appendChild(td);
        
    td = document.createElement('td');
    td.style.fontSize = '10pt';
    td.style.align = 'left';  
    var advance = mxResources.get('advance',null,"Advance");
    var showAdvance = mxResources.get('showAdvance',null,"Show Advance");
    var hiddenAdvance = mxResources.get('hiddenAdvance',null,"Hidden Advance");
    var advanceButton = mxUtils.button(advance, mxUtils.bind(this, function(){
        if(advanceButton == null) {
            return;
        }
        advanceButton.removeChild(advanceButton.firstChild);
        if(advanceButton.value == 'hidden') {
            advanceButton.value = 'visible';
            mxUtils.write(advanceButton,hiddenAdvance )
            this.showAdvanceProperties_(this.tbody, cell.value);
        //digitnexus.editor.me.showAdvanceProperties(tbody, cell.value);
        } else {
            advanceButton.value = 'hidden';
            mxUtils.write(advanceButton,showAdvance );
            /*
                    if(null == this.properties) {
                    return null;
                  }*/
            this.hiddenAdvanceProperties(this.tbody, cell.value);
        }
            
            
    }));
    if(advanceButton != null) {
        advanceButton.value = 'hidden';
    }
    td.appendChild(advanceButton);
        
    row.appendChild(td);
    this.tbody.appendChild(row);
    table.appendChild(this.tbody); 
    return table;
}
        
         