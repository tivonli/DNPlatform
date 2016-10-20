(function(){
    digitnexus = digitnexus || {};
    digitnexus.editor = digitnexus.editor || {};

    digitnexus.editor.Constants = {
        IS_DEBUG: true,
        VERSION: '0.9.0',
        EXECUTE_BY_CLIENT: "client",
        EXECUTE_BY_SERVER: "server",
        ED_ELEMENT_WIDTH:"elementWith",
        ED_ELEMENT_HEIGHT:"elementHeight",
        ED_ELEMENT_DEFAULT_WIDTH:30,
        ED_ELEMENT_DEFAULT_HEIGHT:50,
        ED_ELEMENT_LABEL: "label",
        ED_ELEMENT_ICON: "icon",
        ED_PALLETE_GROUP: "group",
        ED_PALLETE_DEFAULTROUP: "general",
        ED_NODE_DEFAULT_STYPE: "rectangle",
        ED_NODE_STYLE: "style",
        SAVE_MASHUP_BASE_URL: "/rest/mashupeditor/save",
        REQUEST_MASHUP_ID_URL: "/rest/mashupeditor/nodeid/",
        REQUEST_MASHUP_DEFINITION: "/rest/mashupeditor/operator/allinfor",
        REQUEST_MASHUP_DELETE: "/rest/mashupeditor/delete/",
        REQUEST_GET_USERPROFILE: "/rest/mashup_a/data/getprofile",
        REQUEST_SAVE_USERPROFILE: "/rest/mashup_a/data/saveprofile",
        REQUEST_FILE_UPLOAD: "/rest/mashupeditor/upload/",
        EQUEST_HEART_BEAT: "/rest/mashupeditor/heartbeat",
         
        ED_ACTION_SAVE_MASHUP: "saveMashup",
        ED_ACTION_OPEN_MASHUP: "openMashup",
        ED_ACTION_RUN_MASHUP: "runMashup",
        ED_ACTION_OPEN_REPORTS:'openReportPage',
        ED_ACTION_NEW_MASHUP: "newMashup",
        ED_ACTION_SAVE_AS_TEMPLATE:'saveAsTemplate',
        
        ED_SELECT_TEMPLATE :'selectTemplate',
        
        SETTING_DEFAULT_MODULE :'_DEFAULT_MODULE_NAME',
        
        USER_PROFILE_OTHERS :'others'
    };
   
    digitnexus.editor.utils = {
    
        bind: function(scope, funct){
            return function(){
                return funct.apply(scope, arguments);
            };
        } ,
        getUrl: function(url) {
            if(typeof WEB_CONTEXT == 'undefined') {
                WEB_CONTEXT = digitnexus.utils.getWebContextPath();
                if(!WEB_CONTEXT) {
                    throw 'fail to get web context path';
                }
            }
            return WEB_CONTEXT + url
        }
    };	   

    digitnexus.editor.ParametersTemplate =  function()  {
        this.name = null;
        this.desc= '';
        this.advanceParameters = new digitnexus.utils.Set();
        this.baseParameters =  new digitnexus.utils.Set();      
    };
    digitnexus.editor.ParametersTemplate.prototype.equals = function(elt) {
        if(!(elt instanceof digitnexus.editor.ParametersTemplate)){
            return false;
        }
        return this.name === elt.name;
    }
    digitnexus.editor.ParametersTemplate.prototype.toString = function() {
        return 'name=' + this.name+',desc=' + this.desc;
    }

    digitnexus.editor.Parameter =  function(name,type,value,id)  {
        this.name = name;
        this.type = type; 
        this.value = value;
        this.id = id;
    };
    digitnexus.editor.Parameter.prototype.equals = function(node) {
        if(!(node instanceof digitnexus.editor.Parameter)) {
            return false;
        }
        return this.name === node.name;
    };
    
    digitnexus.editor.Parameter.prototype.toString = function() {
        return 'name=' + this.name+',value=' + this.value+',type='+ this.type;
    };

    digitnexus.editor.idManager = new function()  {
        this.cacheIds = new digitnexus.utils.Set(); 
        this.idNum = 30;
        this.heartBeatChecker = null;
        this.url =  digitnexus.utils.getUrl(digitnexus.editor.Constants.REQUEST_MASHUP_ID_URL);
        if(this.url == null) {
            throw 'fail to get id url';
        }
        this.url = this.url + this.idNum;
        this.requestId = function(callback) { 
            var size = this.cacheIds.size();
            if(size < 1) {
                this.getIdFromServer_();
            }
            size = this.cacheIds.size();
            if(size < 1) {
                console.log('fail to get one id');
                return -1;
            }
            var id = -1;
            for(var i = 0; i< size; i++) {
                id = this.cacheIds.get(i);
                if(id != null) {
                    break;
                }
            }
            if(id != null) {
                this.cacheIds.remove(id);
            }
            return id;
        };
        
        this.getIdFromServer_ = function(callback) {   
            if(this.url == null) {
                 throw 'id url is null, canot get id from server';
            } 
            var async = false;
            if(callback) {
                async = true;
            }
            var request = new digitnexus.utils.HttpRequest(this.url, null, 'get', async);
             if(async) {
                  request.send(digitnexus.utils.bind(this, function (req) {
                    this.parseIds(req.getText());
                    if(callback != null) {
                        callback(true);
                    }
                    }),
                digitnexus.utils.bind(this, function (req) {
                    throw req.toString();
                }));
             } else {
                  request.send();
                 if(req.getStatus() == 200) {
                     this.parseIds(req.getText());
                     return true;
                 }else {
                     throw req.toString();
                 } 
             } 
        }
        this.parseIds = function(json) {
                var ids = eval('('+json+')');
                console.log('get id list: '+ json);
                if(ids == null || ids.length < 1) {
                    throw 'fail to request id';
                }
                for(var i = 0 ; i < ids.length; i++) {
                    this.cacheIds.add(ids[i]); 
                }
        }	
    }

    digitnexus.editor.me = new function() {
    
        this.mashupEditor = null;
        this.preferenceManager = new digitnexus.editor.PreferenceManager();
        this.mashupInfoManager = new digitnexus.editor.MashupInfoManager();
        this.mashupConfigManager = new digitnexus.editor.MashupConfigManager();
        //monitor all the event regarding to the mash-up editor
        this.editorListeners =  new digitnexus.utils.HashMap();
        this.addListener = function(name, func) {
            if(name == null) {
                console.log('listener cannot be NULL');
                return;
            }
            if(func == null) {
                console.log('func cannot be NULL');
                return;
            }
            var lis = this.getListener(name);
            if( null == lis) {
                lis = new digitnexus.utils.List();
                this.editorListeners.put(name,lis);
            }
            lis.add(func);
        }
        this.removeListener = function(name,func) {
            var lis = this.getListener(name);
            if( null == lis || null == func) {
                return;
            }
            var size = lis.size();
            for(var index = 0; index < size; index++) {
                var f = lis.get(index);
                if(null == f) {
                    continue;
                }
                if(f === func) {
                    lis.remove(f);
                }
            }
        }
        this.getListener = function(name) {
            if(null == name) {
                return null;
            }
            return this.editorListeners.get(name.trim());
        }
         
        this.init = function(finishCallback) {
            digitnexus.utils.i18n.init('zh','/js/report/resources');
            WEB_CONTEXT = digitnexus.re.context = digitnexus.utils.getWebContextPath();
            if(!WEB_CONTEXT) {
                throw 'fail to get web context';
            }
            var requestMashupInfo = mxUtils.bind(this, function(){
                var mashupInfoUrl = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_MASHUP_DEFINITION);
                if(mashupInfoUrl == null) {
                    throw 'fail to get mashup definition list url';
                }
                
                var request = new digitnexus.utils.HttpRequest(mashupInfoUrl, null, 'get', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                    if(text != '()') {
                        this.mashupInfoManager.parseMashupInfoList(text);
                    }
                    finishCallback();
                }),
                digitnexus.utils.bind(this, function (req) {
                    throw req.toString();
                }));
            });
            var requestUserProfile = mxUtils.bind(this, function() {
                var userProfileUrl = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_GET_USERPROFILE);
                if(userProfileUrl == null) {
                    throw 'web context is null, Please set var WEB_CONTEXT first';
                }
                var request = new digitnexus.utils.HttpRequest(userProfileUrl, null, 'get', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                    this.preferenceManager.parseUserprofile(text);
                    requestMashupInfo();
                }),
                digitnexus.utils.bind(this, function (req) {
                    throw req.toString();
                }));
            });
            
            var requestConfig = mxUtils.bind(this, function(){
                var cnofigUrl = digitnexus.editor.utils.getUrl('/rest/mashupeditor/operator/allconfig');
                if(cnofigUrl == null) {
                    throw 'web context is null, Please set var WEB_CONTEXT first';
                }
                    
                var request = new digitnexus.utils.HttpRequest(cnofigUrl, null, 'get', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                    digitnexus.editor.me.mashupConfigManager.parseConfig(text);
                    requestUserProfile();
                }),
                digitnexus.utils.bind(this, function (req) {
                    throw req.toString();
                }));
            });
            var requestID = mxUtils.bind(this, function() {
                var idUrl =  digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_MASHUP_ID_URL);
                if(idUrl == null) {
                    throw 'id url cannot be null';
                }
                idUrl = idUrl+20;
                var request = new digitnexus.utils.HttpRequest(idUrl, null, 'get', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                    var text = req.getText();
                    digitnexus.editor.idManager.parseIds(text);
                    requestConfig();
                }),
                digitnexus.utils.bind(this, function (req) {
                    throw req.toString();
                }));
            });
            requestID();
            
        }
        
        this.afterInit = function() {
            var hs = function(req) {
                
            };
            var he= function(req) {
                alert(digitnexus.utils.i18n.get('serverExceptionDisconnect',null,'Connection have been interrupted'));
                if(this.heartBeatChecker) {
                    clearInterval(this.heartBeatChecker);
                }
            };
            this.heartBeatChecker = setInterval(mxUtils.bind(this, function(){
                var idUrl =  digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.EQUEST_HEART_BEAT);
                var request = new digitnexus.utils.HttpRequest(idUrl, null, 'get', true);
                request.send(hs,he);
            }),60000);
            
            var nv = this.preferenceManager.userProfile.get(digitnexus.editor.Constants.USER_PROFILE_OTHERS,"lastViewDefinition")
            var mashupId = -1;
            if(nv != null) {
                 mashupId = parseFloat(nv.value);
            }
            if(nv != null && mashupId > 0) {
                if(null != this.mashupInfoManager.getMashupInfoById(mashupId)) {
                     this.mashupInfoManager.openMashupInfoInEditor(mashupId);
                     return;
                }
            } 
            this.mashupInfoManager.createNewMashupDefinition(false);
            this.mashupInfoManager.init();
            this.preferenceManager.init();
            this.mashupConfigManager.init();
      }
        
        this.requestId = function() {
            var id = digitnexus.editor.idManager.requestId();
            return id;
        };

        this.addEditableLisneter = function(model) {
            model.addListener(mxEvent.SELECT, function(event){
                console.log(event);
            });
        }

        this.onEvent = function(eventName,context,args) {
            if(null == eventName) {
                console.log('event name cannot be NULL');
                return;
            }
            var listeners = digitnexus.editor.me.getListener(eventName);
            if(null != listeners) {
                var size = listeners.size();
                for(var index = 0 ; index < size; index++) {
                    var func = listeners.get(index);
                    if(func == null) {
                        continue;
                    }
                    if(context != null) {
                        func.apply(context,args)
                    }else {
                        func(args);
                    }
                     
                }
            }
        }
        this.addListener("exit", mxUtils.bind(this, function() {
            var beforeUploadDialog = new BeforeUploadDialog(this.mashupEditor.editorUi);
            this.mashupEditor.editorUi.showDialog(beforeUploadDialog.container, 100, 40, true, true,mxUtils.bind(this,function() {
                var result = beforeUploadDialog.getResult();
                beforeUploadDialog.closeDialog();
                return result;
            }));
        }));
        
        this.getNodeParameter_ = function(node, paramName) {  
        	
            if(null == paramName || '' == paramName) {
                console.log('editor param name is null');
                return;
            }
            if(node.parameters != null || node.parameters.size() > 0) {
                var size = node.parameters.size();
                for(var i = 0; i< size; i++) {
                    var p = node.parameters.get(i);
                    if(p == null) {
                        continue;
                    }
                    if(p.name == paramName) {
                        return p;
                    }
                }
            }
            if(node.advanceParameters != null || node.advanceParameters.size() > 0) {
                var size = node.parameters.size();
                for(var i = 0; i< size; i++) {
                    var p = node.advanceParameters.get(i);
                    if(p == null) {
                        continue;
                    }
                    if(p.name == paramName) {
                        return p;
                    }
                }
            }
            return null;
        }
         
        this.getEditorParameter = function(node, paramName) {
            if(node.editorParameters == null || node.editorParameters.length < 1) {
                //console.log('editor parameters is null for param name: ' + paramName);
                return;
            }
            if(null == paramName || '' == paramName) {
                console.log('editor param name is null');
                return;
            }
            for(var i = 0; i< node.editorParameters.length; i++) {
                if(node.editorParameters[i] == null) {
                    continue;
                }
                if(node.editorParameters[i].name == paramName) {
                    return node.editorParameters[i];
                }
            }
            return null;
        }
        this.setEditorParameter = function(node, paramName,value) {
            if(null == node) {
                return;
            }
            if(node.editorParameters == null || node.editorParameters.length < 1) {
                node.editorParameters = [];
            }
            var index = -1;
            for(var i = 0; i< node.editorParameters.length; i++) {
                if(node.editorParameters[i] == null) {
                    continue;
                }
                if(node.editorParameters[i].name == paramName) {
                    index = i;
                    break;
                }
            }
            var pt = new digitnexus.editor.Parameter(paramName,'string',value);
            if(index != -1) {
                node.editorParameters[index] = pt;
            } else {
                node.editorParameters.push(pt);
            }
        }

        this.openPreferences = function() {
            console.log('open preference');
            var preferencePage = new PreferencesDialog(this.mashupEditor.editorUi);
            this.mashupEditor.editorUi.showDialog(preferencePage.container, 400, 280, true, false,mxUtils.bind(this,function() {
                preferencePage.destroy();
            }));
        }
        
        this.beforeExit = function() {
           var obj = new Object();
           obj.name="51js";
           if(!digitnexus.utils.isIe()) {
               window.showModalDialog(null,obj,"dialogWidth=200px;dialogHeight=100px");
           } 
        }
        
        /************************************add cell overlay for navigation********************/  
        digitnexus.editor.Constants.OVERLAY_WIDTH = 18;
        digitnexus.editor.Constants.OVERLAY_HEIGHT = 18;
        digitnexus.editor.Constants.OVERLAY_PADDING = 1;
        this.addOverlay = function(cell,sourceConfig) {
            if(cell == null || cell.value == null || cell.value.modelId == null || cell.value.modelId < 1) {
                return;
            }
            var configNode =  this.mashupConfigManager.getConfigNode(cell.value.modelId);
            if(configNode == null || configNode.availableOutput == null || configNode.availableOutput.size() < 1) {
                return;
            }
            var node = cell.value;
            var outputs = configNode.availableOutput;
            var size = outputs.size();
            for(var index = 0; index < size; index++) {
                var outputConfigNode =  this.mashupConfigManager.getConfigNode(outputs.get(index));
                if(outputConfigNode == null) {
                    continue;
                }
                if(!this.canBeConnected(cell,outputConfigNode)) {
                    continue;
                }
                var overlay = new mxCellOverlay(new mxImage('images/touch-connector.png', digitnexus.editor.Constants.OVERLAY_WIDTH,
                    digitnexus.editor.Constants.OVERLAY_HEIGHT), 'Add one ' + outputConfigNode.name);
                overlay.cursor = 'hand';
                overlay.index = index;
                overlay.modelId = outputs.get(index);
                //overlay.align = mxConstants.ALIGN_CENTER;
                overlay.addListener(mxEvent.CLICK, mxUtils.bind(this, function(sender, evt){
                    this.addNode_(sender, evt);
                }));
                this.mashupEditor.graph.addCellOverlay(cell, overlay);
            }     
        }
        /**
         * Operator only can work in server or client, but datasource can be used
         * in both server and client. 
         * If the node is an operator, we can judge it by itself by executeBy property;
         * If the node is an datasoure and it can be used in both server and client, we
         * need judge by is input node(mush be a operator node);
         * Return 1 if yes, and 0 if no, and -1 if exception; 
         */
        this.isClientNode = function(cell) {
              var flag = -1;
              if(!cell || !cell.value) {
                  return flag;
              }
              var configNode =  this.mashupConfigManager.getConfigNode(cell.value.modelId);
              if(!configNode) {
                  return flag;
              }
              if(configNode.isOperator) {
                  return configNode.executeBy.trim() === digitnexus.editor.Constants.EXECUTE_BY_CLIENT ? 1 : 0;
              }
              var scs = configNode.executeBy.split(',');
              if(!scs || scs.length < 1) {
                  return flag
              }
              if(scs.length == 1 ) {
                  return scs[0].trim() === digitnexus.editor.Constants.EXECUTE_BY_CLIENT ? 1 : 0;
              }
              if(!cell.edges || !cell.edges[0] || !cell.edges[0].source || !cell.edges[0].source.value) {
                  //The first node to be drag to editor
                  return -1;
              }
              configNode =  this.mashupConfigManager.getConfigNode(cell.edges[0].source.value.modelId);
              if(!configNode) {
                  return flag;
              }
               if(configNode.isOperator) {
                  return configNode.executeBy.trim() === digitnexus.editor.Constants.EXECUTE_BY_CLIENT ? 1 : 0;
              }
              return -1;
        }
        
        this.canBeConnected = function(cell,outputConfigNode) {
             if(outputConfigNode.executeBy != null && outputConfigNode.executeBy.split(',').length == 2) {
                return true;
            }
            var result = this.isClientNode(cell);
            if(1 != result) {
                return true;
            }
            var executeBy = outputConfigNode.executeBy.trim();
            if(1 == result) {
                return executeBy === digitnexus.editor.Constants.EXECUTE_BY_CLIENT;
            }
        }
        
        
        this.addNode_ = function(sender, evt) {
            var source = evt.getProperty('cell');
            var overlay = sender;
            var outputConfigNode =  this.mashupConfigManager.getConfigNode(overlay.modelId);
            if(null == outputConfigNode){
                return;
            }
            var node = this.mashupInfoManager.createNode(outputConfigNode);
            if(null == node) {
                return;
            }
                
            var nameWidth = digitnexus.utils.getStringWidthAsPix(outputConfigNode.name)+45;
            var nameHeight = outputConfigNode.editorProperties.get(digitnexus.editor.Constants.ED_ELEMENT_HEIGHT);
            var style = outputConfigNode.editorProperties.get(digitnexus.editor.Constants.ED_NODE_STYLE);
            if(null == style) {
                style = digitnexus.editor.Constants.ED_NODE_DEFAULT_STYPE;
            }
            var sourceOpututConfig =  this.mashupConfigManager.getConfigNode(source.value.modelId);
            var sourceOpututIds = sourceOpututConfig.availableOutput;
            var size = sourceOpututIds.size();
            var index = 0;
            for(; index < size; index++) {
                if(sourceOpututIds.get(index) === node.modelId) {
                    break;
                }
            }
            var geo =  source.getGeometry();
            var x = geo.getCenterX();
            var y = geo.getCenterY();
            var centerIndex = Math.floor(size/2);
            if(index < centerIndex) {
                index = -index;
            }
            x = x + geo.width * index;
            y = y + geo.height*2;
                
            var vertex =  this.mashupEditor.graph.insertVertex(source.getParent(), null, node,x,y,nameWidth,nameHeight,style);
            vertex.nodeId = node.nodeId;
             var edge = this.mashupEditor.graph.insertEdge(source.getParent(), null, '', source, vertex);
            edge.geometry.x = 1;
            edge.geometry.y = 0;
            edge.geometry.offset = new mxPoint(0, -20);  
            this.addOverlay(vertex,sourceOpututConfig); 
        }
        var originGetBounds = mxCellOverlay.prototype.getBounds;
        mxCellOverlay.prototype.getBounds = function(state){
            var rect = originGetBounds.apply(this,arguments);
            var cell = state.cell;
            var w = this.image.width;
            var h = this.image.height;
            rect.x = rect.x - this.index*(w+digitnexus.editor.Constants.OVERLAY_PADDING)
            return rect;
        }
    /****************************************************************************************/
    
    this.validateOneParam = function(param,configParam,result){
                  if(null == result) {
                      result = [];
                  }
                  var type = configParam.type.trim();
                  var value = param.value;
                  var msg = null;
                  var validators =  configParam.validators;
                  if(null != validators) {
                       validators = validators.split(',');
                  }
                  if(validators == null) {
                      validators = [];
                  }
                  validators.push(type);
                  
                 for(var i = 0; i< validators.length; i++) {
                     if(validators[i] == null) {
                         continue;
                     }
                     if((value == null || value == '') && validators[i] != 'required') {
                          continue;
                       }
                    switch(validators[i]) {
                        case 'int':
                        case 'integer':
                        case 'Integer':
                            if(!digitnexus.utils.isIngeger(value)) {
                                result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                'invalid integer for Parameter: ' + param));
                            }
                            break;
                        case 'float':
                        case 'double':
                        case 'real':
                            if(!digitnexus.utils.isFloat(value)) {
                                result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                'invalid float for Parameter: ' + param));
                            }
                            break;
                        case 'url':
                              if(!digitnexus.utils.checkUrl(value)) {
                                result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                'invalid  url for Parameter: ' + param));
                            }
                            break;
                        case 'email':
                               if(!digitnexus.utils.checkEmail(value)) {
                                   result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                   'invalid  email for Parameter: ' + param));
                            }
                            break;
                        case 'ip':
                               if(!digitnexus.utils.checkIP(value)) {
                                    result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                    'invalid  IP for Parameter: ' + param));
                            }
                            break;
                         case 'sql':
                            break;
                        case 'required':
                            if(value == null || value.trim() == '') {
                                result.push(this.createMessage(digitnexus.utils.Constants.INFO,
                                'required Parameter: ' + param));
                            }
                            break;
                        default:
                            break;
                  }
                 }
                 return result;
           }
           
           this.createMessage = function(level,message,nodeId){
               if(level == null) {
                   level = digitnexus.utils.Constants.INFO;
               }
               var msg = new digitnexus.utils.DebugMessage()
               msg.level = level;
               if(message != null) {
                   msg.msg = message;
               }
               if(nodeId != null) {
                   msg.nodeId = nodeId;
               }
               return msg;
           }
    };
})(); 