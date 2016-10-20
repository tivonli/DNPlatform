digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};
    
digitnexus.editor.ConfigParameter =  function()  {
    this.name = null;
    this.type = null;
    this.defaultValue = null;
    this.uiType = null;
    this.availableValue = null;
    this.trigger = null;
};
    
digitnexus.editor.ConfigParameter.prototype.equals = function(node) {
    if(!(node instanceof digitnexus.editor.ConfigParameter)) {
        return false;
    }
    return this.name === node.name;
};
digitnexus.editor.ConfigParameter.prototype.toString = function() {
    return 'name=' + this.name+',type=' + this.type+',uiType='+ this.uiType;
};

digitnexus.editor.ConfigNode =  function()  {
    this.id = -1;
    this.type = -1; 
    this.groupId = -1;
    this.artifactId = -1;
    this.name = null;
    this.desc= '';
    this.parametersTemplates = [];
        
    this.executeBy = digitnexus.editor.Constants.EXECUTE_BY_SERVER;
    this.allowableInput = new digitnexus.utils.Set();
    this.availableOutput =  new digitnexus.utils.Set();
    this.neededParameter =  new digitnexus.utils.Set();
    this.editorProperties = new digitnexus.utils.HashMap();
    this.editorProperties.put(digitnexus.editor.Constants.ED_ELEMENT_WIDTH,
        digitnexus.editor.Constants.ED_ELEMENT_DEFAULT_WIDTH);
    this.editorProperties.put(digitnexus.editor.Constants.ED_ELEMENT_HEIGHT,
        digitnexus.editor.Constants.ED_ELEMENT_DEFAULT_HEIGHT);
    this.editorProperties.put(digitnexus.editor.Constants.ED_PALLETE_GROUP,
        digitnexus.editor.Constants.ED_PALLETE_DEFAULT_GROUP);  
    this.editorProperties.put(digitnexus.editor.Constants.ED_NODE_STYLE,
        digitnexus.editor.Constants.ED_NODE_DEFAULT_STYPE);   
};

digitnexus.editor.ConfigNode.prototype.equals = function(node) {
    if(!(node instanceof digitnexus.editor.ConfigNode)) {
        return false;
    }
    return this.id == node.id;
};
digitnexus.editor.ConfigNode.prototype.getAttribute = function(name) {
    if(name === digitnexus.editor.Constants.ED_ELEMENT_LABEL) {
        //console.log("MashupNode.prototype.getAttribute name " + this.name);
        return this.name;
    }
    return digitnexus.editor.Constants[name];
};
    
digitnexus.editor.ConfigNode.prototype.toString = function() {
    return 'id=' + this.id+',type=' + this.type+',name='+ this.name+', desc' +  this.desc;
};
    
digitnexus.editor.MashupConfigManager = function() {
    this.configNodesMap = new digitnexus.utils.HashMap();
    this.templatesParameter = new digitnexus.utils.Set();    
}

digitnexus.editor.MashupConfigManager.prototype.init = function() {
    
}
digitnexus.editor.MashupConfigManager.prototype.getConfigNode = function(modelId) {
    var keys = this.configNodesMap.keySet();
    if(keys == null || keys.length < 1) {
        return null;
    }
           
    for(var index = 0; index < keys.size(); index++) {
        var configNodes = this.configNodesMap.get(keys.get(index));
        if(configNodes == null || configNodes.size() < 1) {
            continue;
        }
        for(var i = 0; i < configNodes.size(); i++) {
            var cn = configNodes.get(i);
            if(cn == null) {
                continue;
            }
            if(cn.id == modelId) {
                return cn
            }
        }
    }
    return null;
}
        
digitnexus.editor.MashupConfigManager.prototype.configNodeParameters = function(node, currentParam) {

    var selectTemplate = digitnexus.editor.me.getEditorParameter(node,digitnexus.editor.Constants.ED_SELECT_TEMPLATE);
    if(selectTemplate == null || selectTemplate.value == null) {
        return;
    }
           
    var pt =  this.getParameterTemplate(selectTemplate.value);
    if(pt != null) {
        //node.parameters.removeAll();
        node.advanceParameters.removeAll();
        if(currentParam) {
            var index = node.parameters.indexOf(currentParam);
            if(-1 != index) {
                var valueP = node.parameters.get(index);
                valueP.value = currentParam.value;
            }else {
               var conf = this.getConfigParam(node,currentParam.name);
               if(conf) {
                    node.parameters.add(new digitnexus.editor.Parameter(conf.name,conf.type,currentParam.value));
               } else {
                   throw 'config param not found for Parameter: ' + currentParam;
               }
            }
        }else if(pt.baseParameters != null && pt.baseParameters.size() >0) {
            var size = pt.baseParameters.size();
            for(var i = 0 ; i < size ; i++) {
                var conf = pt.baseParameters.get(i);
                if(null == conf) {
                    continue;
                }
                var defaultValue = conf.defaultValue;
               
                if(conf.type == 'array' || conf.type == 'list') {
                    defaultValue = conf.defaultValue.split(',');
                }
                 node.parameters.add(new digitnexus.editor.Parameter(conf.name,conf.type,defaultValue));
            }
        }
       
        if(pt.advanceParameters != null && pt.advanceParameters.size() >0) {
            var size = pt.advanceParameters.size();
            for(var i = 0 ; i < size ; i++) {
                var conf = pt.advanceParameters.get(i);
                if(null == conf) {
                    continue;
                }
                var defaultValue = conf.defaultValue;
                /*
                if(conf.type == 'array' || conf.type == 'list') {
                    defaultValue = conf.defaultValue.split(',');
                }
                */
                node.advanceParameters.add(new digitnexus.editor.Parameter(conf.name,conf.type,defaultValue)); 
            }
        }   
    }
}
        
digitnexus.editor.MashupConfigManager.prototype.getConfigParam = function(node,paramName) {
    if(node == null || node.modelId == null || node.modelId < 1) {
        return null;
    }
    var configNode = this.getConfigNode(node.modelId);
    if(configNode == null) {
        return null;
    } 
    var p = this.getConfigParamWithps_(configNode.neededParameter,paramName);
    if(p != null) {
        return p;
    }
    var selectTemplate = digitnexus.editor.me.getEditorParameter(node, digitnexus.editor.Constants.ED_SELECT_TEMPLATE);
    if(selectTemplate == null) {
        return null;
    }
    var template = this.getParameterTemplate(selectTemplate.value);
    if(template == null) {
        return null;
    }
    p = this.getConfigParamWithps_(template.baseParameters,paramName);
    if(p != null) {
        return p;
    }
    p = this.getConfigParamWithps_(template.advanceParameters,paramName);
    if(p != null) {
        return p;
    }
    return null;     
}
        
digitnexus.editor.MashupConfigManager.prototype.getConfigParamWithps_ = function(parameters,paramName) {
    if(null == parameters || parameters.size() < 1) {
        return null;
    }
    var size = parameters.size();
    for(var i = 0; i < size; i++) {
        var cp = parameters.get(i);
        if(null == cp) {
            continue;
        }
        if(cp.name === paramName) {
            return cp;
        } 
    }
    return null;
}
        
        
digitnexus.editor.MashupConfigManager.prototype.getConfigNodes = function(key) {
    return  this.configNodesMap.get(key);
}
        
digitnexus.editor.MashupConfigManager.prototype.getConfigNodesKeySet = function() {
    return  this.configNodesMap.keySet();
}
        
digitnexus.editor.MashupConfigManager.prototype.parseConfig  = function(json){
    if(null == json) {
        return null;
    }
    var configArray =  eval('(' + json + ')');
    if(null == configArray) {
        if(digitnexus.editor.Constants.IS_DEBUG) {
            console.log("eval json error : "  + json);
        }
        return null;
    }
    var configNodes = new digitnexus.utils.HashMap();
    var pts = new digitnexus.utils.Set();
        
    for(var index = 0; index < configArray.length; index++) {
        var e = configArray[index];
        if(e != null &&  e.id != null && e.id != -1) {
            var cn = new digitnexus.editor.ConfigNode();
            cn.id = e.id == null ? -1: e.id;
            cn.type = e.type == null ? -1: e.type;
            cn.groupId = e.groupId == null ? -1: e.groupId;
            cn.artifactId = e.artifactId == null ? -1: e.artifactId;
            cn.name = e.name == null ? null : e.name;
            cn.desc= e.desc == null ? "": e.desc;
            cn.parametersTemplates = e.parametersTemplates;             
            cn.defaultTemplate = e.parametersTemplates == null? null:e.parametersTemplates[0];
            cn.isOperator = e.isOperator;
            cn.executeBy = e.executeBy == null ? digitnexus.editor.Constants.EXECUTE_BY_SERVER : e.executeBy;
                
            if(e.allowableInput != null &&  e.allowableInput.length > 0) {
                for(var i = 0; i < e.allowableInput.length; i++){
                    cn.allowableInput.add(e.allowableInput[i]); 
                }  
            }
            if(e.availableOutput != null &&  e.availableOutput.length > 0) {
                for(var i = 0; i < e.availableOutput.length; i++){
                    cn.availableOutput.add(e.availableOutput[i]); 
                }  
            }
            if(e.editorProperties != null) {
                for(var key in e.editorProperties){
                    cn.editorProperties.put(key,e.editorProperties[key]); 
                }  
            }
            var pconfig = this.parseParameters(e.neededParameter);
            if(null != pconfig) {
                cn.neededParameter.addAll(pconfig);
            }
            var group = cn.editorProperties.get(digitnexus.editor.Constants.ED_PALLETE_GROUP);
            if(group  == null) {
                //digitnexus.editor.Constants.ED_PALLETE_GROUP,
                cn.editorProperties.put(digitnexus.editor.Constants.ED_PALLETE_GROUP,digitnexus.editor.Constants.ED_PALLETE_DEFAULT_GROUP);
                group = digitnexus.editor.Constants.ED_PALLETE_DEFAULT_GROUP;
            }  
            var set = configNodes.get(group);
            if(null == set) {
                set =  new digitnexus.utils.Set();
                configNodes.put(group,set);
            }
            set.add(cn);
        } else if(e.name != null && e.baseParameters != null) {
            if(e.name == null) {
                continue;
            }
            var pt = new digitnexus.editor.ParametersTemplate();
            pt.name = e.name;
            var pconfig = this.parseParameters(e.baseParameters);
            if(null != pconfig) {
                pt.baseParameters.addAll(pconfig);
                pconfig = null;
            }
            pconfig = this.parseParameters(e.advanceParameter);
            if(null != pconfig) {
                pt.advanceParameters.addAll(pconfig);
            }
            pts.add(pt);
        } 
    }
    this.configNodesMap.addAll(configNodes);
    this.templatesParameter.addAll(pts);
}

digitnexus.editor.MashupConfigManager.prototype.parseParameters = function(parameters) {
        if(parameters == null || parameters.length < 1) {
            return null;
        }
        var pts = new digitnexus.utils.Set();
        for(key in parameters){
            var conf = parameters[key];
            var confNode = new digitnexus.editor.ConfigParameter();
            confNode.name = conf.name;
            confNode.type = conf.type;
            confNode.defaultValue = conf.defaultValue;
            confNode.uiType = conf.uiType;
            confNode.availableValue = conf.availableValue;
            confNode.validators = conf.validators;
            confNode.trigger = conf.trigger;
            pts.add(confNode);
        }   
        return pts;
    }
    
    digitnexus.editor.MashupConfigManager.prototype.getParameterTemplate = function(tempName) {
            if( this.templatesParameter == null ||  this.templatesParameter.size() <1) {
                return null;
            }
            tempName = !tempName ? '': tempName.trim();
            var size =  this.templatesParameter.size();
            for(var index = 0; index < size; index++){
                var tp = this.templatesParameter.get(index);
                if(tp == null) {
                    continue;
                }
                if(tp.name == tempName) {
                    return tp;
                }
            }
        }