var digitnexus = digitnexus || {};
digitnexus.re = digitnexus.re || {};

    goog.require('goog.dom');
    goog.require('goog.ui.tree.TreeControl');
    
(function() {
    digitnexus.re.DEBUG = true;
    digitnexus.re.TESTING = true;
	
    digitnexus.re.context = digitnexus.utils.getWebContextPath();
	
    digitnexus.re.Constants = {
        REPORT_FOR_BROWSER:0X01,
        REPORT_LIST_URL: "/rest/report/reportList/browser/",
        REPORT_GROUP_URL: "/rest/report/reportGroup/",
        MASHUP_URL: "/rest/mashup_a/data/"		
    };
    
    digitnexus.re.Parameter = function() {
        this.name = null;
        this.value = null;
        this.type = null;
    };

    digitnexus.re.Report = function() {
	this.name = null;
	this.id = null;
	this.type = null;
	this.descriptor = "";
	this.usersList = "";
	this.reportType = "";
	this.groupId = null;
    }
    
    
    digitnexus.re.Report.prototype.toString = function() {
        return this.name;     
    }
    digitnexus.re.Report.prototype.toLowerCase = function() {
        return this.name.toLowerCase();     
    }
    
    digitnexus.re.Report.prototype.indexOf = function(ss) {
        return this.name.indexOf(ss);  
    }
    
    digitnexus.re.Report.prototype.equals = function(r) {
        return r.id == this.id;     
    }
    
    
    digitnexus.re.MashupConext = function(mashupId) {
        this.mashupId = mashupId;
        this.parameters = new digitnexus.utils.HashMap();
        this.inputParameters = new digitnexus.utils.HashMap();
        this.outputParameters = new digitnexus.utils.HashMap();
        this.acParams = null;
    };

    digitnexus.re.MashupConext.prototype.clean = function() {
        this.parameters.removeAll();
        this.inputParameters.removeAll();
        this.outputParameters.removeAll();
    };

    /** ***************for output parameters****************** */
    digitnexus.re.MashupConext.prototype.setOutputParameters = function(parameters) {
        this.outputParameters = parameters;
    };
    digitnexus.re.MashupConext.prototype.getOutputParameters = function(parameters) {
        return this.outputParameters;
    };
    digitnexus.re.MashupConext.prototype.getOutputParameter = function(key) {
        if(key == null) {
            return null;
        }
        return this.getParameterFromNodes_(this.outputParameters,key);
    };
    digitnexus.re.MashupConext.prototype.putOutputParameter = function(key,
        value) {
        this.outputParameters.put(key, value);
    };

    digitnexus.re.MashupConext.prototype.addAllOutputParameter = function(parameters) {
        this.outputParameters.addAll(parameters);
    };

    digitnexus.re.MashupConext.prototype.removeOutputParameter = function(key) {
        return this.getParameterFromNodes_.get(this.inputParameters,key);;
    };

    digitnexus.re.MashupConext.prototype.removeOutputParameter = function(key) {
        this.outputParameters.remove(key);
    };

    digitnexus.re.MashupConext.prototype.cleanOutputParameter = function() {
        this.outputParameters.removeAll();
    };

    digitnexus.re.MashupConext.prototype.getParameterFromNodes_ = function(nodes,key) {
        if(nodes == null || nodes.length < 1 || key == null) {
            return;
        }
        var size =  nodes.size();
        for(var index = 0; index < size; index++) {
            var node = nodes.get(index);
            if(node == null) {
                continue;
            }
            var parameters = node.parameters;
            if(parameters == null || parameters.length < 1) {
                continue;
            }
            var len =  parameters.length;
            for(var index = 0; index < len; index++) {
                var p = parameters[index];
                if(p == null) {
                    continue;
                }
                if(p.name == key) {
                    return p.value;
                }
            }  
        }
        return null;
    }


    /** ***************for input parameters****************** */
    digitnexus.re.MashupConext.prototype.getInputParameter = function(key) {
        if(key == null) {
            return null;
        }
        return this.getParameterFromNodes_(this.inputParameters,key);
    };
        
        
    digitnexus.re.MashupConext.prototype.setInputParameters = function(parameters) {
        this.inputParameters = parameters;
    };
    
    
    digitnexus.re.MashupConext.prototype.getInputParameters = function() {
        return this.inputParameters;
    };
    

    digitnexus.re.MashupConext.prototype.putInputParameter = function(key,
        value) {
        inputParameters.put(key, value);
    };
    
    
    digitnexus.re.MashupConext.prototype.addAllInputParameter = function(
        parameters) {
        inputParameters.addAll(parameters);
    };
    

    digitnexus.re.MashupConext.prototype.removeInputParameter = function(key) {
        inputParameters.get(key);
    };
    

    digitnexus.re.MashupConext.prototype.removeInputParameter = function(key) {
        inputParameters.remove(key);
    };


    digitnexus.re.MashupConext.prototype.cleanInputParameter = function() {
        inputParameters.removeAll();
    };
    

    /** ***************for generic parameters****************** */
    digitnexus.re.MashupConext.prototype.putParameter = function(key, value) {
        this.parameters.put(key, value);
    };
    
    
    digitnexus.re.MashupConext.prototype.addAllParameter = function(parameters) {
        this.parameters.addAll(parameters);
    };
    
    
    digitnexus.re.MashupConext.prototype.getParameter = function(key) {
        return this.parameters.get(key);
    };


    digitnexus.re.MashupConext.prototype.removeParameter = function(key) {
        this.parameters.remove(key);
    };


    digitnexus.re.MashupConext.prototype.cleanParameter = function() {
        this.parameters.removeAll();
    };


    digitnexus.re.Mashup = function () {
        this.TAG = "Mashup ";
        this.header = null;
        this.nodeList = new Array();
        this.originalValue = null;

    };


    digitnexus.re.Mashup.prototype.toString = function(nodeId) {
        var str = "mashup: ";
        str = str + " header: " + this.header;
        str = str + " nodeList: " + this.nodeList;
        str = str + " originalValue: " + this.originalValue;
        return str;
    };


    digitnexus.re.Mashup.prototype.getNode = function (nodeId) {
        if (this.nodeList == null || this.nodeList.length <= 0) {
            return null;
        }
        for ( var index = 0; index < this.nodeList.length; index++) {
            if (null == this.nodeList[index]) {
                continue;
            }
            if (this.nodeList[index].nodeId == nodeId) {
                return this.nodeList[index];
            }
        }
    };

    digitnexus.re.Mashup.prototype.isExist = function (nodeId) {
        if (this.nodeList == null || this.nodeList.length <= 0) {
            return false;
        }
        return this.getNode(nodeId) != null;
    };

    digitnexus.re.Mashup.prototype.pushNode = function (mashupNode) {
        if (this.nodeList == null) {
            this.nodeList = new Array();
        }
        if (!this.isExist(mashupNode.nodeId)) {
            this.nodeList.push(mashupNode);
        }
    };

    digitnexus.re.MashupNode = function() {
        this.nodeId = -1;
        this.modelId = -1;
        this.parameters = new digitnexus.utils.Set();
        this.networkId = null;
		
        //only for operator		
        this.inputNodes = new digitnexus.utils.Set();
        this.outputNodes = new digitnexus.utils.Set();
        this.operator = null;

        //for data node stored in operator
        this.inputIds =  new digitnexus.utils.Set();
        this.outputIds =  new digitnexus.utils.Set();
        this.data = null;
    };
        
    digitnexus.re.MashupNode.prototype.getParameter = function(key) {
        if(null == key) {
            return null;
        }
        key = key.trim();
        var size = this.parameters.size();
        if(this.parameters == null || size < 1) {
            return null;
        }
        for(var index  = 0; index < size; index++) {
            var p = this.parameters.get(index);
            if(p == null) {
                continue;
            }
            if(key == p.name) {
                return p.value;
            }
        }
        return null;
    }
        
    digitnexus.re.MashupNode.prototype.getInputNodes = function() {
        return this.inputNodes;
    };

    digitnexus.re.MashupNode.prototype.setInputNodes = function(ins) {
        this.inputNodes = ins;
    };
    digitnexus.re.MashupNode.prototype.getOutputNodes = function() {
        return this.outputNodes;
    };

    digitnexus.re.MashupNode.prototype.setOutputNodes = function(ons) {
        this.outputNodes = ons;
    };

    digitnexus.re.MashupNode.prototype.getParameters = function() {
        return this.parameters;
    };

    digitnexus.re.MashupNode.prototype.setParameters = function(parameters) {
        this.parameters = parameters;
    };

    // mash-up cache manager used to cache history mash-up
    digitnexus.re.mashupCacheManager = new function() {
        this.TAG = "MashupCacheManager ";
        this.mashupList = new digitnexus.utils.HashMap();
        this.pushMashup = function (mashup) {
            if (null == mashup) {
                // need log info about this error for debug
                throw "can't push Null mash-up to mashup cache pool";
                return null;
            }
            if (null == this.mashupList) {
                this.mashupList = new digitnexus.utils.HashMap();
            }
            if (this.mashupList.contains(mashup.header.mashupId)) {
                // delete previous
                this.mashupList.remove(mashup.header.mashupId);
            }
            this.mashupList.put(mashup.header.mashupId, mashup);
        };
        this.getMashup = function (mashupId) {
            if (this.mashupList == null || this.mashupList.length <= 0) {
                return null;
            }

            return this.mashupList.get(mashupId);
        };
        this.deleteMashup = function (mashupId) {
            if (this.mashupList == null || this.mashupList.length <= 0) {
                return null;
            }
            this.mashupList.remove(mashupId);
        };
        this.isExist = function isExist(mashupId) {
            if (this.mashupList == null || this.mashupList.size() <= 0) {
                return false;
            }
            return this.mashupList.contains(mashupId);
        };
        return this;
    };

    digitnexus.re.resultCacheManager = function() {
        this.TAG = "ResultCacheManager ";
        // MapEntity list
        this.mashupResultList = new digitnexus.utils.HashMap();
        this.pushMashupResult = function (mashupId,
            mashupResult) {
            if (-1 == mashupId || null == mashupResult) {
                // need log info about this error for debug
                return null;
            }

            if (null == this.mashupResultList) {
                this.mashupResultList = new digitnexus.utils.HashMap();
            }
            if (this.mashupResultList.contains(mashupId)) {
                // delete previous
                this.mashupResultList.remove(mashupId);
            }
            this.mashupResultList.put(mashupId, mashupResult);
        };
        this.updateMashupResult = function (mashupId,
            mashupResult) {
            this.pushMashupResult(mashupId, mashupResult);
        };
        this.getMashupResult = function (mashupId) {
            if (this.mashupResultList == null
                || this.mashupResultList.size() <= 0) {
                return null;
            }
            return this.mashupResultList.get(mashupId);
        };
        this.deleteMashupResult = function (mashupId) {
            if (this.mashupResultList == null
                || this.mashupResultList.length <= 0) {
                return null;
            }
            this.mashupResultList.remove(mashupId);
        };
        this.isExist = function (nodeId) {
            if (this.mashupResultList == null
                || this.mashupResultList.length <= 0) {
                return false;
            }
            return this.mashupResultList.contains(nodeId);
        };
        return this;
    }();

    digitnexus.re.mashupParser = new function() {
        this.TAG = "MashupParser";
        this.parse = function (jsonMashup) {
            // console.log(this.TAG,"OS: " + jsonMashup);
            var mashupResponse = eval(jsonMashup);
            if (null == mashupResponse) {
                // need log info about this error for debug
                if (digitnexus.re.DEBUG) {
                    console.log(this.TAG, "eval(jsonMashup) return null: \n"
                        + jsonMashup);
                }
                return null;
            }
            return this.translateToMashupRequest_(mashupResponse);
        };
        this.translateToMashupRequest_ = function (
            mashupResponse) {
            // now we do nothing, just return the original value.
            // the id , modelId, inputNode, outputNodes must be set
            var mashup = new digitnexus.re.Mashup();
            mashup.originalValue = mashupResponse;
            // parse mash-up node list and associate to operator via Operator
            // Manager
            this.parseHeader_(mashupResponse.header, mashup);
            this.parseBody_(mashupResponse.body, mashup);
            return mashup;
        };
        this.parseHeader_ = function (header, mashup) {
            mashup.header = header;
        };
        this.parseBody_ = function (body, mashup) {
            var mashupResp = body.mashupSequence;
            for ( var index = 0; index < mashupResp.length; index++) {
                var node = mashupResp[index];
                var mashupNode = new digitnexus.re.MashupNode();
                mashupNode.nodeId = node.nodeId;
                mashupNode.modelId = node.modelId;
                mashupNode.networkId = node.networkId;
                mashupNode.name = node.key;
                mashupNode.setParameters(digitnexus.re.mashupManager.parseParameterAsSet_(node.parameters));
                mashupNode.setInputNodes(digitnexus.re.mashupManager.parseNodesAsSet_(node.inputNodes));
                mashupNode.setOutputNodes(digitnexus.re.mashupManager.parseNodesAsSet_(node.outputNodes));
                var operator = digitnexus.re.operatorManager.getOperator(mashupNode.modelId);
                if (null == operator) {
                    throw "Operator [" + mashupNode.modelId
                    + "] not found, stop this mashup node ID ["
                    + mashupNode.nodeId + "]";
                }
                mashupNode.operator = operator;
                mashup.pushNode(mashupNode);
            }
        };
        return this;
    };

    digitnexus.re.mashupRunner = new function() {
        this.TAG = "MashupRunner";
        this.run = function (mashup, canUseCache,params) {
            if (null == mashup) {
                if (digitnexus.re.DEBUG) {
                    console.log(this.TAG, "mashup is null, fail to run!");
                }
                return;
            }
            var mashupResult = null;
            if (canUseCache) {
                mashupResult = digitnexus.re.resultCacheManager
                .getMashupResult(mashupId);
            }
            if (null != mashupResult) {
                // log info for debug
                return mashupResult;
            }
            /** ************************************ */
            // do run the mash-up, pls implement
            mashupResult = this.doRun_(mashup,params);
            /** ************************************* */
            if (null != mashupResult) {
                // cache the result if not null
                digitnexus.re.resultCacheManager.updateMashupResult(mashupId,
                    mashupResult);
            }

            return mashupResult;
        };
        this.doRun_ = function(mashup,params) {
            var nodeList = mashup.nodeList;
            if (nodeList == null || nodeList.length <= 0) {
                return null;
            }
            var mashupConext = new digitnexus.re.MashupConext(
                mashup.header.mashupId);
            mashupConext.acParams = params;
            this.preRunMashup_(mashup, mashupConext);
            for ( var index = 0; index < nodeList.length; index++) {
                if (null == nodeList[index]) {
                    continue;
                }
                var mashupNode = nodeList[index];
                var previousNode = null;
                if (index > 0) {
                    previousNode = nodeList[index - 1];
                }
                this.preRunOperator_(previousNode, mashupNode, mashupConext);
                var operator = mashupNode.operator;
                operator.execute(mashupConext);
                var nextNode = null;
                if (index < nodeList.length - 1) {
                    nextNode = nodeList[index + 1];
                }
                this.afterRunOperator_(nextNode, mashupNode, mashupConext);

            }
            this.afterRunMashup_(mashup, mashupConext);
        };
        this.preRunOperator_ = function(previousNode, mashupNode, mashupConext) {
            var parameters = mashupNode.parameters;
            for ( var index = 0; index < parameters.size(); index++) {
                var entry = parameters.get(index);
                mashupConext.putParameter(entry.name, entry.value);
            }
            if (null != previousNode) {
                var selfInputNodes = mashupNode.getInputNodes();
                var preOutputNodes = mashupConext.getOutputParameters();
                for ( var i = 0; i < preOutputNodes.size(); i++) {
                    var	preNode = preOutputNodes.get(i);
                    if (preNode == null) {
                        continue;
                    }
                    for ( var index = 0; index < selfInputNodes.size(); index++) {
                        var selfNode = selfInputNodes.get(index);
                        if (selfNode == null) {
                            continue;
                        }
                        if (preNode.nodeId == selfNode.nodeId) {
                        //preNode.parameters.addAll(selfNode.parameters);
                        }
                    }
                }
                mashupConext.setInputParameters(preOutputNodes);
            } else {
                mashupConext.setInputParameters(mashupNode.getInputNodes());
            }
            mashupConext.setOutputParameters(mashupNode.getOutputNodes());
        };

        /**
		 * .Hide
		 */
        this.afterRunOperator_ = function(nextNode, mashupNode, mashupConext) {

        };
        /**
		 * .Hide
		 */
        this.preRunMashup_ = function(mashup, mashupConext) {

        };

        /**
		 * .Hide
		 */
        this.afterRunMashup_ = function(mashup, mashupConext) {

        };
        return this;
    };

    digitnexus.re.mashupManager = new function() {
        this.TAG = "MashupManager";
        this.mashupList = new Array();
        
        
        this.addMashup_ = function (jsonMashup) {
            var mashup = digitnexus.re.mashupParser.parse(jsonMashup);
            if (null == mashup) {
                // log info, this is an serious error
                if (DEBUG) {
                    console.log(this.TAG, "Fail to parse Mashup: \n"
                        + jsonMashup);
                }
                throw "Fail to parse Mashup: \n" + jsonMashup;
            }
            digitnexus.re.mashupCacheManager.pushMashup(mashup);
            return mashup;
        };
        
        
        this.executeMashup = function (mashupId, canUseCacheResult, params) {
            var mashup = digitnexus.re.mashupCacheManager.getMashup(mashupId);
            if (null == mashup) {
                // log info for debug
                if (DEBUG) {
                    console.log(this.TAG, "Fail to get Mashup from cache: "
                        + mashupId);
                }
                throw "Fail to get Mashup from cache: " + mashupId;
            }
          digitnexus.re.mashupRunner.run(mashup,canUseCacheResult,params); 
        }
        
        
         this.requestAndExecuteMashup = function (url, params) {
            digitnexus.re.networkManager.requestMashup(
                url,
                null,
                function(mashup) {
                    if(null!= mashup) {
                        //supose the container is place in the zero position
                        var container = document.getElementById(params[0]);
                        if(container) {
                            for(var c = container.firstChild; c != null; c = container.firstChild ) {
                                container.removeChild(c);
                            }
                        }
                        digitnexus.re.mashupManager.executeMashup(mashup.header.mashupId,false, params);
                    }
                } 
			
                );
        }
         
    this.parseParameterAsHashmap_ = function(parameters) {
        var map = new digitnexus.utils.HashMap();
        if (parameters == null || parameters.length < 0) {
            return map;
        }

        for ( var index = 0; index < parameters.length; index++) {
            var param = parameters[index];
            var p = new digitnexus.re.Parameter();
            p.name = param.name;
            p.value = param.value;
            p.type = param.type;
            map.put(p.name, p);
        }
        return map;
    };


    this.parseParameterAsSet_ = function(parameters) {
        var set = new digitnexus.utils.Set();
        if (parameters == null || parameters.length < 0) {
            return map;
        }

        for ( var index = 0; index < parameters.length; index++) {
            var param = parameters[index];
            var p = new digitnexus.re.Parameter();
            p.name = param.name;
            p.value = param.value;
            p.type = param.type;
            set.add(p);
        }
        return set;
    };
    

    this.parseNodesAsSet_ = function(nodes) {
        var set = new digitnexus.utils.Set();
        if (nodes == null || nodes.length < 0) {
            return nodes;
        }
        for ( var index = 0; index < nodes.length; index++) {
            var node = nodes[index];
            var mashupNode = new digitnexus.re.MashupNode();
            mashupNode.nodeId = node.id;
            mashupNode.modelId = node.modelId;
            mashupNode.setParameters(digitnexus.re.mashupManager.parseParameterAsSet_(node.parameters));
            mashupNode.name = node.key;
            mashupNode.inputIds = node.inputNodes;
            mashupNode.outputIds = node.outputNodes;
            mashupNode.networkId = node.networkId;
            mashupNode.data = node.data;
            set.add(node);
        }
        return set;
    };
        return this;
    };

    digitnexus.re.networkManager = new function() {
        this.TAG = "NetworkManager ";
        this.username = null;
        this.password = null;
        // indicate whether need to run the mash-up after parsing
        this.requestMashup = function(url, data,callback) {
            // not use the data arg now
            var request = new digitnexus.utils.HttpRequest(
                url, data, 'get', true, this.username, this.password);
            request.send(function (req) {
                var jsonString = '(' + req.getText() + ')';
                var mashup = digitnexus.re.mashupManager.addMashup_(jsonString);
                if (mashup == null) {
                    if (DEBUG) {
                        console.log(this.TAG, "Fail to add mash-up to cache");
                    }
                    return;
                }
                callback(mashup);
            },
            function (req) {
                console.log(this.TAG, "Fail to get Mashup: " + req.toString());
            });        
        };
        return this;
    };

    digitnexus.re.requestBuilder = new function() {
        this.TAG = "RequestBuilder ";
        this.createRequest = function () {
            return new MashupRequest();
        };
        return this;
    };

    digitnexus.re.operatorManager = new function() {
        this.TAG = "OperatorManager ";
        this.operatorList_ = new digitnexus.utils.HashMap();
        this.registerOperator = function(operator) {
            if (null == operator) {
                if (DEBUG) {
                    console.log(this.TAG + "can't register Null operator");
                }
                return;
            }
            if (this.operatorList_.contains(operator.id)) {
                if (DEBUG) {
                    console.log(this.TAG + "Operator [" + operator.id
                        + "] exist, delete it");
                }
                this.operatorList_.remove(operator.id);
            }
            this.operatorList_.put(operator.id, operator);
        };
        this.unregisterOperator = function (operatorId) {
            this.deleteOperator(operatorId);
        };
        this.deleteOperator = function(operatorId) {
            if (!this.operatorList_.contains(operatorId)) {
                return;
            }
            this.operatorList_.remove(operatorId);
        };
        this.getOperator = function (operatorId) {
            if (!this.operatorList_.contains(operatorId)) {
                return null;
            }
            return this.operatorList_.get(operatorId);
        };
        this.exist = function (operatorId) {
            if (null == this.operatorList_ || this.operatorList_.length <= 0) {
                return false;
            }
            return this.operatorList_.contains(operatorId);
        };
        return this;
    };
    
     digitnexus.re.reportManager = new function() {
         
        this.getReportList = function(groupId,callback) {
            if(digitnexus.re.context == null || digitnexus.re.context == '') {
                throw "context can't be null";
            }
            var url = digitnexus.re.context + digitnexus.re.Constants.REPORT_LIST_URL+groupId;
            var request = new digitnexus.utils.HttpRequest(
                url, null, 'get', true, null, null);
            request.send( function (req) {
                callback('(' + req.getText() + ')');
            },
             function (req) {
                console.log(this.TAG, "Fail to get report group: " + req.toString());
            });   
        };
    
	
        this.getReportGroup = function(reportFor,callback) {
            if(digitnexus.re.context == null || digitnexus.re.context == '') {
                throw "context can't be null";
            }
            var url = digitnexus.re.context + digitnexus.re.Constants.REPORT_GROUP_URL+reportFor;
            var request = new digitnexus.utils.HttpRequest(
                url, null, 'get', true, null, null);
            request.send(function (req) {
                callback('(' + req.getText() + ')');
            },
            function (req) {
                console.log(this.TAG, "Fail to get report group: " + req.toString());
            });     
            
        };
        
        this.getReportListSync = function(groupId) {
            if(digitnexus.re.context == null || digitnexus.re.context == '') {
                throw "context can't be null";
            }
            var url = digitnexus.re.context + digitnexus.re.Constants.REPORT_LIST_URL+groupId;
            var request = new digitnexus.utils.HttpRequest(
                url, null, 'get', false, null, null);
            request.send();
            if(request.getStatus() == 200) {
                return request.getText();
            }else {
                throw request.toString();
            }
        };
    
	
        this.getReportGroupSync = function(reportFor) {
            if(digitnexus.re.context == null || digitnexus.re.context == '') {
                throw "context can't be null";
            }
            var url = digitnexus.re.context + digitnexus.re.Constants.REPORT_GROUP_URL+reportFor;
            var request = new digitnexus.utils.HttpRequest(
                url, null, 'get', false, null, null);
            request.send();
            if(request.getStatus() == 200) {
                return request.getText();
            }else {
                throw request.toString();
            }
        };
        
        
        this.fillReportGroup = function(reportFor,containerId, onClick) {
            digitnexus.re.reportManager.getReportGroup(reportFor, function(jsonGroups) {
                if(null == jsonGroups) {
                    console.log("no report list found");
                    return;
                }
                var groups = eval('(' + jsonGroups+')');
                if(null == groups) {
                    console.log("no report list found");
                    return;
                }
                var container = document.getElementById(containerId);
                digitnexus.utils.removeAllChildren(container);
                for(var index = 0; index < groups.length; index++) {
                    var group = groups[index];
                    var l = document.createElement('a');
                    l.href = '#';
                    l.appendChild(document.createTextNode(group));
                    l.groupId = group;
                    l.onclick =  function(event) {
                        var groupId = event.srcElement.groupId;
                        onClick(groupId);
                        return false;
                    }
                    container.appendChild(l).appendChild(document.createElement('br'));
                } 
                if(groups && groups.length > 0 && onClick) {
                    onClick(groups[0]);
                }  
            });
        }
        
        
          /**
         * onClick(reportId url not include the context)
         */
         this.fillReportList = function(groupId,containerId, onClick) {
                this.getReportList(groupId,digitnexus.utils.bind(this,
                function(json) {
                var jsonObj = eval('(' + json+')');
		if(!jsonObj) {
			console.log("no report list found");
			return;
		}
		var rl = jsonObj.body.data;
		if(!rl) {
			console.log("no report list found");
			return;
		}
                var container = document.getElementById(containerId);
                digitnexus.utils.removeAllChildren(container);	
		for(var index = 0; index < rl.length; index += 1 ) {
			var rp = rl[index];
			var url =  digitnexus.re.context + digitnexus.re.Constants.MASHUP_URL + rp.id
                        var l = document.createElement('a');
                        l.href = url;
			l.appendChild(document.createTextNode(rp.name));
                        l.onclick =  function(event) {	
                          var url = event.srcElement.href;
                          onClick(url);
                          return false;
                        }
                       container.appendChild(l).appendChild(document.createElement('br'));
		}
                if(rl && rl.length > 0 && onClick) {
                   var url =  digitnexus.re.context + digitnexus.re.Constants.MASHUP_URL + rl[0].id
                         onClick(url);
                } 
                }))    
         }
         
        /**
         * onClick(reportId url not include the context)
         */
        this.fillReportGroupAndReportList = function(reportFor,containerId, onClick) {
             var container = containerId;
            if(typeof container == 'string') {
                container = document.getElementById(containerId);
            }
            
            var groupContainerId = 'groupContainerId';
            var groupContainer = document.createElement('div');
            groupContainer.id = groupContainerId;
            groupContainer.style.width='50%';
            groupContainer.style.height='100%';
            container.appendChild(groupContainer);
            
            var listContainerId = 'listContainerId';
            var listContainer = document.createElement('div');
            listContainer.id = listContainerId;
            listContainer.style.width='50%';
            listContainer.style.height='100%';
            container.appendChild(listContainer);
            
            this.fillReportGroup(reportFor,groupContainerId, 
            digitnexus.utils.bind(this,function(groupId){
                 this.fillReportList(groupId,listContainerId, onClick);
            })
            );
        }
        
        this.createListNavReport = function(reportFor,containerId) {
            var container = containerId;
            if(typeof container == 'string') {
                container = document.getElementById(containerId);
            }
            var groupContainerId = 'groupContainerId_';
            var groupContainer = document.createElement('div');
            groupContainer.id = groupContainerId;
            container.appendChild(groupContainer);
            
            var listContainerId = 'listContainerId_';
            var listContainer = document.createElement('div');
            listContainer.id = listContainerId;
            container.appendChild(listContainer);
            
            var reportContainerId = 'reportContainerId_';
            var reportContainer = document.createElement('div');
            reportContainer.id = reportContainerId;
            container.appendChild(reportContainer);
            
            //reportFor,containerId, onClick
            this.fillReportGroup(reportFor,groupContainerId,
               digitnexus.utils.bind(this, function(groupId) {
               this.fillReportList(groupId,listContainerId,function(url){
                  //digitnexus.re.mashupManager.requestAndExecuteMashup(url,['executeResultContainer']);
                  digitnexus.re.mashupManager.requestAndExecuteMashup(url,[reportContainerId]);
               });
            }));
        }
        
     this.createTreeData_ = function(tree, data) {
            tree.setHtml('report list');     
             for (var i = 0; i < data.length; i+=2) {
                 var groupName = data[i];
                 var rl = data[i+1];
                 var groupNode = tree.createNode(groupName);
                 for (var ri = 0; ri < rl.length; ri++) {
                     var r = rl[ri];
                     var childNode = tree.createNode(r.name);
                     childNode.setModel(r);
                     groupNode.addChild(childNode);
                 }
                tree.addChild(groupNode);
             }  
        }


        this.createTreeNav = function(reportFor,containerId,selectCallback) {
            var reportArray = [];
            var jsonGroups = this.getReportGroupSync(reportFor);
            if(null == jsonGroups) {
                console.log("no report list found");
                return;
            }
            var groups = eval('(' + jsonGroups+')');
            if(null == groups) {
                console.log("no report list found");
                return;
            }
            for(var groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                var group = groups[groupIndex];
                if(!group) {
                    continue;
                }  
                var json = this.getReportListSync(group) 
                if(!json) {
                    continue;
                }
                var jsonObj = eval('(' + json+')');
                if(!jsonObj) {
                    console.log("no report list found");
                    return;
                }
                var rl = jsonObj.body.data;
                if(!rl) {
                    console.log("no report list found");
                    return;
                }
                reportArray.push(group);
                var rpArray = [];
                reportArray.push(rpArray);
                for(var index = 0; index < rl.length; index += 1 ) {
                    var rp = rl[index];
                    var report = new digitnexus.re.Report();
                    report.id= rp.id;
                    report.name = rp.name;
                    rpArray.push(report);
                }
            }
            var container = containerId;
            if(typeof container == 'string') {
                container = document.getElementById(containerId);
            }
            var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
            treeConfig['cleardotPath'] = 'closure/goog/images/tree/cleardot.gif';
            var tree = new goog.ui.tree.TreeControl('root', treeConfig);
            this.createTreeData_(tree, reportArray);
            tree.render(container);
            tree.setShowRootNode(false);
            tree.setShowLines(true);
            tree.setShowRootLines(true);
            tree.setShowExpandIcons(true);
            goog.events.listen(tree, [goog.ui.Component.EventType.CHANGE], selectCallback);
        }     
        
         this.createTreeNavReport = function(reportFor,containerId) {
            var container = containerId;
            if(typeof container == 'string') {
                container = document.getElementById(containerId);
            }
            var treeReportListId = 'treeReportList_';
            var groupContainer = document.createElement('div');
            groupContainer.id = treeReportListId;
            container.appendChild(groupContainer);
            var treeReportContainerId = 'treeReportContainer_';
            var listContainer = document.createElement('div');
            listContainer.id = treeReportContainerId;
            container.appendChild(listContainer);
            
            this.createTreeNav(reportFor,treeReportListId,
            digitnexus.utils.bind(this, function(selectNode) {
                 var selectItem = selectNode.currentTarget.getSelectedItem();
                 var report = selectItem.getModel();
                 if(report instanceof digitnexus.re.Report) {
                      var url = digitnexus.re.context + digitnexus.re.Constants.MASHUP_URL + report.id;
                      digitnexus.re.mashupManager.requestAndExecuteMashup(url,[treeReportContainerId]);
                 } 
            }));
         }      
    }
  
}).call(digitnexus.re);
