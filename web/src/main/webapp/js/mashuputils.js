(function(){
    if (typeof digitnexus == 'undefined') {
        digitnexus = {};
    }
    
    if (typeof digitnexus.utils == 'undefined') {
        digitnexus.utils  = {
            getStringWidthAsPix : function(str) {
                var span = document.getElementById("widthTester");
                if(span == null) {
                    span = document.createElement('span');
                }
                span.style = "font-size:10pt";
                document.body.appendChild(span);
                var oldWidth = span.offsetWidth;
                span.innerText= str; 
                oldWidth = span.offsetWidth-oldWidth; 
                span.innerHTML='';
                if(null != span) {
                    document.body.removeChild(span);  
                }
                return oldWidth;
            },
        
            getTimeAsMills: function() {
                return new Date().getTime();
            },
        
            strByteLength:  function(str)  {  
                var i;  
                var len;  
                len = 0;  
                for (i=0;i<str.length;i++)  {  
                    if (str.charCodeAt(i)>255) len+=2; else len++;  
                }  
                return len;  
            },
            isIngeger: function (value)  {      
                if (/^(\+|-)?\d+$/.test(value )){  
                    return true;  
                }else { 
                    return false;  
                }  
            },
            isFloat: function(value){         
                if (/^(\+|-)?\d+($|\.\d+$)/.test(value )){  
                    return true;  
                }else{  
                    return false;  
                }  
            } ,
            checkUrl: function (value){    
                var myReg = /^((http:[/][/])?\w+([.]\w+|[/]\w*)*)?$/;   
                return myReg.test( value ); 
            },
            checkEmail: function (value){    
                var myReg = /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;   
                return myReg.test(value);  
            },
            checkIP:   function (value)   {   
                var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;  
                if(re.test( value ))  {
                    if( RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) 
                        return true;  
                }
                return false;   
            },
            
         getAsync : function(url, data,callback) {
        	  if(callback == null) {
        		  throw 'callback handler cannot be null';
        	  }
			  this.__ajax(url,data,'GET',true,
			  function (jsonStr, status, xhr) {
				  callback('(' + jsonStr + ')');
			  }, 
			  function(jsonStr, status, xhr){
				  if(jsonStr.status == 200) {
					  callback('(' + jsonStr.responseText + ')');
				  }else {
					  //console.log('error: ' + status);
					  callback(null);
				  }
			  });
         },
         getSync : function(url, data,callback) {
			  this.__ajax(url,data,'GET',false,
			  function (jsonStr, status, xhr) {
                                  if(callback != null) {
                                      callback('(' + jsonStr + ')');
                                  }
			  }, 
			  function(jsonStr, status, xhr){
				  if(jsonStr.status == 200) {
					  callback('(' + jsonStr.responseText + ')');
				  } else {
					  //console.log('error: ' + status);
					  callback(null);
				  }
			  });
         },
         postSync : function(url, data,successhandler, errorHandler) { 
			  this.__ajax(url,data,'POST',false,successhandler,errorHandler);
         },
         postAsync : function(url, data,successhandler, errorHandler) {
			  this.__ajax(url,data,'POST',true,successhandler,errorHandler);
         },
         __ajax : function(url, postData, menthod, async, successHandler, errorHandler) {
        	 if(successHandler == null) {
       		     throw 'success handler cannot be null';
       	     }
        	 //handler format : function(data, textStatus, jqXHR)
		     $.ajax({
		    	         'url': url,
		 		 'type': menthod,
		 		 'data': postData,
		 		 'contentType': 'application/json',
		 		 'dataType': 'application/json',
		 		 'success': successHandler,
		 		 'error': errorHandler,
		 		 'async': async
		       });
          },
          extend: function(ctor, superCtor){
      		var f = function() {};
      		f.prototype = superCtor.prototype;	
      		ctor.prototype = new f();
      		ctor.prototype.constructor = ctor;
      	  }
          
        }
        digitnexus.utils.Constants={
            // debug level
             INFO:'INFO',
             DEBUG:'DEBUG',
             ERROR:'ERROR',
             FINAL:'FINAL',
             DEFAULT:'DEFAULT'
        }
        digitnexus.utils.DebugMessage = function() {
            //info
            this.level = digitnexus.utils.Constants.INFO;
            this.msg = null;
            this.timeStamp = new Date();
            this.nodeId = -1;
        };
         digitnexus.utils.DebugMessage.prototype.toString = function() {
             var timeStr= ''+ this.timeStamp.getFullYear()+',' + this.timeStamp.getMonth()+ ',' + this.timeStamp.getDate()
                          + ' ' + this.timeStamp.getHours() +':'+ this.timeStamp.getMinutes()+':' +this.timeStamp.getSeconds();
             return timeStr +" [" + this.level+ "] Node ID[" + this.nodeId +'] '+ this.msg;
         }
        digitnexus.utils.List = function() {
            this.data = [];
        }
        digitnexus.utils.List.prototype.size = function() {
            if (null == this.data) {
                return 0;
            }
            return this.data.length;
        };
        digitnexus.utils.List.prototype.removeAll = function() {
             this.data.splice(0,this.data.length);
        } 
        digitnexus.utils.List.prototype.add = function (element) {
            if (null == this.data) {
                return this.data = Array();
            }
            for(var i = 0; i< this.data.length; i++) {
            	if(this.data[i] == null) {
            		this.data[i] = element;
            		return;
            	}
            }
            this.data.push(element);
        };

        digitnexus.utils.List.prototype.get = function (index) {
            if (null == this.data) {
                return null;
            }
            if (index >= this.size()) {
                return null;
            }
            return this.data[index];
        };

        digitnexus.utils.List.prototype.remove = function (element) {
            if (null == this.data) {
                return;
            }
            var index = this._getIndex(element);
            if (index == -1) {
                return;
            }
            this.data.splice(index,1)
        };

        digitnexus.utils.List.prototype.contains = function (element) {
            if (null == this.data) {
                return false;
            }
            var index = this._getIndex(element);
            if (index == -1) {
                return false;
            }
            return true;
        };
        digitnexus.utils.List.prototype.removeAll = function () {
            if (null == this.data) {
                return;
            }
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                this.data.splice(index,1)
            }
        };
	
        digitnexus.utils.List.prototype.addAll = function (elements) {
            if (null == elements || elements.size() < 0) {
                return;
            }
            if(null == this.data) {
                this.data = new Array();
            }
            for ( var index = 0; index < this.elements.length; index++) {
                if (null == this.elements[index]) {
                    continue;
                }
                this.data.push(this.elements[index]);
            }
        };
        /**
	 * .Hide
	 */
        digitnexus.utils.List.prototype._getIndex = function(element) {
            if (null == this.data) {
                return -1;
            }
            var result = -1;
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                if (this.data[index].equals(element)) {
                    result = index;
                    break;
                }
            }
            return result;
        };
        
        /**
	 * ***************************Set class similar to java.util.Set
	 * interface**********************
	 */
        /**
	 * This implementation is very strange that set inherit from List. just work
	 * well for me! will be modified if any problem occurs.
	 */
        digitnexus.utils.Set = function() {
            digitnexus.utils.List.apply(this, arguments);
        };
        
        digitnexus.utils.Set.prototype = new  digitnexus.utils.List();
        digitnexus.utils.Set.prototype.constructor = digitnexus.utils.Set;
       
        /**
	 * Overwrite this method to guarantee every element is unique in the set. If
	 * the added element is exist, delete the old element before adding. Must
	 * overwrite the equals() method of the element if need
	 */
        digitnexus.utils.Set.prototype.add = function(element) {
            if (null == this.data) {
                return this.data = Array();
            }
            if (this.contains(element)) {
                this.remove(element);
            }
            this.data.push(element);
        };

        digitnexus.utils.Set.prototype.contains = function (element) {
            if (null == this.data) {
                return false;
            }
            var index = this._getIndex(element);
            if (index == -1) {
                return false;
            }
            return true;
        };

        digitnexus.utils.Set.prototype.remove = function (element) {
            if (null == this.data) {
                return;
            }
            var index = this._getIndex(element);
            if (index == -1) {
                return;
            }
            this.data.splice(index,1)
        };

        digitnexus.utils.Set.prototype.addAll = function (elements) {
            if (null == elements || elements.size() < 0) {
                return;
            }
            if(null == this.data) {
                this.data = new Array();
            }
            for ( var index = 0; index < elements.size(); index++) {
                var e = elements.get(index);
                if (null == e) {
                    continue;
                }
                this.add(e);
            }
        };
        
        digitnexus.utils.Set.prototype._getIndex = function (element) {
            if (null == this.data) {
                return -1;
            }
            var result = -1;
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                if((this.data[index].equals != null) && (this.data[index].equals(element))) {
                	result = index;
                }else if (this.data[index] === element) {
                    result = index;
                    
                }
                if(result != -1) {
                	break;
                }
            }
            return result;
        };

        digitnexus.utils.Set.prototype.size = function () {
            if (null == this.data) {
                return 0;
            }
            return this.data.length;
        };

        digitnexus.utils.Set.prototype.get = function (index) {
            if (null == this.data) {
                return null;
            }
            if (index >= this.size()) {
                return null;
            }
            return this.data[index];
        };
        
        digitnexus.utils.MapEntity = function(key, value) {
		this.key = key;
		this.value = value;
	};
        digitnexus.utils.HashMap = function() {
            this.data = new Array();
        };

        digitnexus.utils.HashMap.prototype.put = function(key, value) {
            if (null == this.data) {
                this.data = new Array();
                this.data.push(new digitnexus.utils.MapEntity(key, value));
                return;
            }
            if (null == key) {
                throw "key can't be null";
            }
            if (this.contains(key)) {
                this.remove(key);
            }
            this.data.push(new digitnexus.utils.MapEntity(key, value));
        };

        digitnexus.utils.HashMap.prototype.keySet = function() {
            if (null == this.data || this.data.length <= 0) {
                return null;
            }
            var ks = new digitnexus.utils.Set();
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                ks.add(this.data[index].key);
            }
            return ks;
        };

        digitnexus.utils.HashMap.prototype.addAll = function(parameters) {
            var size = parameters.size();
            if (null == parameters || size <= 0) {
                return;
            }
            if (null == this.data) {
                this.data = new Array();
            }
            size = -1;
            var ks = parameters.keySet();
            size = ks.size();
            for ( var index = 0; index < size; index++) {
                var key = ks.get(index);
                if (null == key) {
                    continue;
                }
                var value = parameters.get(key);
                this.put(key, value);
            }
        };

        digitnexus.utils.HashMap.prototype.get = function(key) {
            if (null == this.data || null == key) {
                return null;
            }
            var index = this._getIndex(key);
            if (-1 == index) {
                return null;
            }
            return this.data[index].value;
        };

        digitnexus.utils.HashMap.prototype.contains = function(key) {
            if (null == this.data || null == key) {
                return false;
            }
            var index = this._getIndex(key);
            if (-1 == index) {
                return false;
            }
            return true;
        };

        digitnexus.utils.HashMap.prototype.remove = function(key) {
            if (null == this.data || null == key) {
                return;
            }
            var index = -1;
            index = this._getIndex(key);
            if (-1 != index) {
            	 this.data.splice(index,1)
            }
        };

        digitnexus.utils.HashMap.prototype.removeAll = function() {
            if (null == this.data) {
                return;
            }
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                this.data.splice(index,1)
            }
        };

        digitnexus.utils.HashMap.prototype.size = function() {
            if (null == this.data) {
                return 0;
            }
            var count = 0;
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                count++;
            }
            return count;
        };

        /**
	 * .Hide
	 */
        digitnexus.utils.HashMap.prototype._getIndex = function(key) {
            if (null == this.data || null == key) {
                return -1;
            }
            var result = -1;
            for ( var index = 0; index < this.data.length; index++) {
                if (null == this.data[index]) {
                    continue;
                }
                if (this.data[index].key == key) {
                    result = index;
                    break;
                }
            }
            return result;
        }
        
        /******************************HTML table********************************/
        digitnexus.utils.Table = function(style) {
        	this.init(style);
        };
        
        digitnexus.utils.Table.prototype.init = function(style) {
        	this.table = document.createElement('table');
        	if(style != null) {
        		this.table.className = style;
        	}
                this.table.style.border = 2;
        	this.table.style.width = '100%';
        	this.table.style.height = '100%';
        	this._tbody = document.createElement('tbody')
        	this.table.appendChild(this._tbody);
                this.inputlist = new digitnexus.utils.HashMap();
        }
        
        digitnexus.utils.Table.prototype.addRow = function(style) {
        	this.__currentRow = document.createElement('tr');
                if(style != null) {
                    this.__currentRow.className = style;
                }
        	this._tbody.appendChild(this.__currentRow);
        	return this.__currentRow;
        }
        digitnexus.utils.Table.prototype.addTd = function(elt,style) {
        	var td = document.createElement('td');
                if(null!= style) {
                    td.className = style;
                }
        	if(null != this.__currentRow) {
        		this.__currentRow.appendChild(td);
        	}
        	if(elt != null) {
                    if(typeof(elt) == 'string') {
        		mxUtils.write(td, elt);
                    }else if(typeof(elt) == 'object'){
                        td.appendChild(elt);
                    }
                    if(elt.nodeName == 'INPUT' || elt.nodeName == 'DIV' || elt.nodeName == 'P' || elt.nodeName == 'TEXTAREA') {
                         this.inputlist.put(elt.name,elt);
                    }
        	}
        	return td;
        }
        // utils for form
        digitnexus.utils.Table.prototype.addTextRow = function(label,name,value) {
                this.addRow();
                this.addTd(mxResources.get(label,null,label)); 
                var input = digitnexus.utils.formFactory.createTextbox(name,value);
                this.inputlist.put(name,input);
        	this.addTd(input);
        }
        
        digitnexus.utils.Table.prototype.addTextarea = function(label,name,value,rows,cols) {
                this.addRow();
                this.addTd(label); 
                 var input = digitnexus.utils.formFactory.createTextarea(name,value,rows,cols)
                this.inputlist.put(name,input);
        	this.addTd(input);
        }
        
        digitnexus.utils.Table.prototype.addLabel = function(label) {
             this.addTd(label);
        }
        digitnexus.utils.Table.prototype.addRadioRow = function(label,name,value,defaultValue) {
                            this.addRow();
             this.addTd(label); 
               var input = digitnexus.utils.formFactory.createRadiobox(name,value,defaultValue);
                this.inputlist.put(name,input);
        	this.addTd(input);
        }
        
        digitnexus.utils.Table.prototype.addCheckboxRow= function(label,name,values,checkValues) {
                            this.addRow();
                this.addTd(label); 
                    this.addTd(label); 
               var input = digitnexus.utils.formFactory.createCheckbox(name,values,checkValues);
                this.inputlist.put(name,input);
        	this.addTd(input);
        }
        digitnexus.utils.Table.prototype.addCheckboxRow= function(label,name,values,checkValues) {
                            this.addRow();
                this.addTd(label); 
                  var input = digitnexus.utils.formFactory.createCheckbox(name,values,checkValues);
                this.inputlist.put(name,input);
        	this.addTd(input);   
        }
        //name, isMultiSelect, size, labels, values, selectValues
         digitnexus.utils.Table.prototype.addComboboxRow= function(label,name,isMultiSelect, size, labels, values, selectValues) {
                this.addRow();
                this.addTd(label); 
                var input = digitnexus.utils.formFactory.createCombobox(name, isMultiSelect, size, labels, values, selectValues);
                this.inputlist.put(name,input);
        	this.addTd(input);   
        }
        digitnexus.utils.Table.prototype.addButton= function() {
             
        }
        
        digitnexus.utils.Table.prototype.removeRow = function(row) {
        	if(row != null) {
        		this._tbody.removeChild(row);
                        return true;
        	}
                return false;
        }
        
        digitnexus.utils.Table.prototype.getAllRows = function() {
        	return this._tbody.childNodes;
        }
        digitnexus.utils.Table.prototype.removeAllRows = function() {
        	if(this._tbody.childNodes == null) {
        		return;
        	}
               var children = this._tbody.childNodes;
               for(var index = 0; index < children.length;) {     
                   if(!this.removeRow(children[index])) {
                       index++
                   }
               }
        }
        
        digitnexus.utils.Table.prototype.hiddenAllRows = function(rows) {
               this._setInputDisplay(rows,'none');
        }
        
        digitnexus.utils.Table.prototype.showAllRows = function(rows) {
              this._setInputDisplay(rows,'');
        }
          digitnexus.utils.Table.prototype._setInputDisplay = function(rows,display) {
               if(rows == null) {
        		return;
        	}
               var size = rows.size();
               for(var index = 0; index < size; index++) {
                   var input = rows.get(index);
                   if(input == null) {
                       continue;
                   }
                  input.style.display= display; 
               }
        }
        /******************************End HTML table****************************/
        
    }
    
    /*********************************Form Factory*******************************/
    if(digitnexus.utils.formFactory == null || digitnexus.utils.formFactory == 'undefined') {
         digitnexus.utils._FormFactory = function() {
         
         }
         digitnexus.utils._FormFactory.prototype.createTextbox =  function(name,value) {
            return this.createInput(name,value,'text');  
         }
          digitnexus.utils._FormFactory.prototype.createPassword = function(name,value) {     
               return this.createInput(name,value,'password');  
          }
          digitnexus.utils._FormFactory.prototype.createHidden = function(name,value) {     
               return this.createInput(name,value,'hidden');  
          }
          digitnexus.utils._FormFactory.prototype.createFile = function(name,value) {     
               return this.createInput(name,value,'file');  
          }
          
          digitnexus.utils._FormFactory.prototype.createSubmit= function(name,value) {     
               return this.createInput(name,value,'submit');  
          }
          digitnexus.utils._FormFactory.prototype.createReset= function(name,value) {     
               return this.createInput(name,value,'reset');  
          }
          digitnexus.utils._FormFactory.prototype.createImage= function(name,imageFile) {
               var image = this.createInput(name,value,'image'); 
               image.src = imageFile;
               return image;  
          }
         digitnexus.utils._FormFactory.prototype.createRadiobox =  function(name,values,defaultValue) {
             var radios = document.createElement('div');
              radios.name = name;
             //default is array
             var valuesArray = values;
             if(typeof(values) == 'string') {
                 valuesArray =  this.__parseAvaiableValue(values,',');
             }
             if(null != valuesArray && valuesArray.length > 0) {
                 for(var i = 0; i< valuesArray.length; i++) {
                    var elt = this.createInput(name,valuesArray[i],'radio');
                     if(defaultValue != null && defaultValue == valuesArray[i]) {
                         elt.checked='checked';
                     }
                     mxUtils.write(radios, valuesArray[i]);
                     radios.appendChild(elt);
                 }
             }
             return radios;
         }
         
         digitnexus.utils._FormFactory.prototype.createCheckbox =  function(name,values,checkedValues) {
             var radios = document.createElement('div');
             radios.name = name;
             var valuesArray = values;
             if(typeof(values) == 'string') {
                 valuesArray =  this.__parseAvaiableValue(values,',');
             }
             var defaultValues = checkedValues;
             if(typeof(checkedValues) == 'string') {
                 defaultValues =  this.__parseAvaiableValue(checkedValues,',');
             }
             if(null != valuesArray && valuesArray.length > 0) {
                 for(var i = 0; i< valuesArray.length; i++) {
                    var elt = this.createInput(name,valuesArray[i],'checkbox');
                    if(defaultValues != null && defaultValues != 'undefined') {
                         for(var ii = 0; ii< defaultValues.length; ii++) {
                         if(valuesArray[i] == defaultValues[ii]) {
                            elt.checked='checked';
                          }
                     }
                    }
                     mxUtils.write(radios, valuesArray[i]);
                     radios.appendChild(elt);
                 }
             }
             return radios; 
         }
         
        digitnexus.utils._FormFactory.prototype.createTextarea = function(name, value, rows, cols){
            var input = document.createElement('textarea');
            if (mxClient.IS_NS){
                rows--;
            }
            input.setAttribute('rows', rows || 5);
            input.setAttribute('cols', cols || 40);
            input.value = value;
            input.name = name;
            return input;
        };
         
         digitnexus.utils._FormFactory.prototype.createCombobox =  function(name, isMultiSelect, size, labels, values, selectValues) {
            var select = document.createElement('select');
            select.style.width = 150+'px';
            select.name = name;
            if (size != null){
                select.setAttribute('size', size);
            }
            if (isMultiSelect){
                select.setAttribute('multiple', 'true');
            }
             if(null != labels && typeof(labels) == 'string') {
                 labels =  this.__parseAvaiableValue(labels,',');
             }
             if(null != values && typeof(values) == 'string') {
                 values =  this.__parseAvaiableValue(values,',');
             }
              var selectValues = selectValues;
             if(null != selectValues && typeof(selectValues) == 'string') {
                 selectValues =  this.__parseAvaiableValue(selectValues,',');
             }
              if(null != values && values.length > 0) {
                 for(var i = 0; i< values.length; i++) {
                    var option = document.createElement('option');
                    mxUtils.writeln(option, labels[i]);
                    option.setAttribute('value', values[i]);
                    if(selectValues != null && selectValues != 'undefined') {
                        for(var ii = 0; ii< selectValues.length; ii++) {
                            if(values[i] == selectValues[ii]) {
                               option.setAttribute('selected', true);
                             }
                        }
                    }
                     select.appendChild(option);
                 }
             }
             return select;
        }
        
          digitnexus.utils._FormFactory.prototype.createInput = function(name,value,type) {     
             var input = document.createElement('input');
             input.value = value == null ? '': value;
             input.name = name == null? '': name;
             input.type = type == null? '': type;
             return input;
        }
         digitnexus.utils._FormFactory.prototype.__parseAvaiableValue = function(availableValue,seperator){
             if(availableValue == null ||  availableValue == '') {
                 return;
             }
             if(seperator == null) {
                 seperator = ',';
             }
             var values =  availableValue.split(seperator);
             if(null == values || values.length < 1) {
                 return;
             }
             return values;
         }
         
         digitnexus.utils._FormFactory.prototype.getNodeValue = function(node){
             var nodeName = node.nodeName;
             if(node == null) {
                 return null;
             }
             if(nodeName=="INPUT") {
                 if(node.type =='radio' || node.type =='checkbox') {
                     if( node.checked ) {
                          return node.value;
                     }else {
                         return null;
                     }  
                 }
                 return node.value;
             } else if(nodeName=="OPTION") {
                 if(node.selected){
                      return node.value;
                 }
             } else if(nodeName == "TEXTAREA") {
                  return node.value;
             }
             if(nodeName!="DIV" && nodeName != 'P') {
                 return null;
             } 
             var subNodes = node.childNodes;
             if(null == subNodes || subNodes.length < 1) {
                 return null;
             }
             var value = null;
             for(var index = 0 ; index < subNodes.length; index++) {
                 var subNode = subNodes[index];
                 if(subNode == null) {
                     continue;
                 }
                 
                var v = this.getNodeValue(subNode);
                if(v != null && value != null) {
                    value = value +','+ v;
                }else if(v != null) {
                     value = v;
                }
             }
             return value;
         }
         digitnexus.utils.formFactory = new digitnexus.utils._FormFactory();
    }
     /******************************End HTML Form Factory****************************/
    
      /******************************Tree view****************************/
       /*
        * TreeModel requre below:
        * hasChildren(): whether exist child
        * getChildren() : return all the children, the type must a Set or List
        * getParent(): get parent
        * getLabel(); return the name of the node;
        */
       digitnexus.utils._SettingModel = function(key,value) { 
           if(value == null || key == null) {
               throw 'model key and value cannot be NULL';
           }
           this.value = value;
           this.key = key;
       }
        digitnexus.utils._SettingModel.prototype.getChildren = function(){
            return null;
        }
        digitnexus.utils._SettingModel.prototype.getLabel = function(){
            return this.key;
        }
        
       digitnexus.utils.SettingsTreeModelAdapter = function(origalObj,fromRoot) {   
           this.setModel(origalObj,fromRoot);
       }
       digitnexus.utils.SettingsTreeModelAdapter.prototype.setModel = function(origalObj,fromRoot){
             if(origalObj == null) {
               throw 'origal object cannot be null when create TreeModelAdapter';
           }
           this.origalObj = origalObj;
         }
       
       digitnexus.utils.SettingsTreeModelAdapter.prototype.hasChildren = function(node){
            if(node == null) {
                return false;
            }  
            if(node.getChildrend == 'undefined' || typeof(node.getChildrend) != 'function') {
                return false;
            }
            var children = node.getChildrend();
            if(children == 'undefined' || typeof(children.size) != 'function') {
                return false;
            }
            var size = children.size();
             if(size == 'undefined' || size < 1) {
                return false;
            }
            return true;  
       }
       digitnexus.utils.SettingsTreeModelAdapter.prototype.getChildren = function(){
           if(this.origalObj == null) {
               return null;
           }
          var nameList = this.origalObj.keySet();
               if(nameList == null) {
                   return null;
               }
               var size = nameList.size();
               var array = [];
               for(var index = 0 ; index < size; index++ ) {
                   var key = nameList.get(index);
                   if(key == null) {
                       continue;
                   }
                   var obj =  this.origalObj.get(key);
                   if(obj == null || obj.size() < 1) {
                       continue;
                   }
                   array.push(new digitnexus.utils._SettingModel(key,obj));
               }
            return  array
       }   
       digitnexus.utils.SettingsTreeModelAdapter.prototype.getLabel = function(){
           return null;
       } 
       
       digitnexus.utils.SettingsTreeModelAdapter.prototype.getParent = function(){
             
         }
       
      digitnexus.utils.TreeView = function(container, clickCallback) {	
          //instance of digitnexus.utils.TreeModel
          if(null == container ) {
              throw 'Tree view must get one container';
          }
          if(null == clickCallback ) {
              throw 'clickCallback cannot be NULL';
          }
          this.container = container;
          this.clickCallback = clickCallback;
          this.root = null;
      };
      
      digitnexus.utils.TreeView.prototype.setRootModel = function(root) {	
          //instance of digitnexus.utils.TreeModel
         if(null == root ) {
              //console.log( 'model is null');
          }
          this.root = root;
          this.updateTree();
      };
        digitnexus.utils.TreeView.prototype.checkNode = function(node){
            if(node == null) {
                return false;
            }  
            if(node.getChildrend == 'undefined' || typeof(node.getChildrend) != 'function') {
                return false;
            }
            var children = node.getChildrend();
            if(children == 'undefined' || typeof(children.size) != 'function') {
                return false;
            }
            var size = children.size();
             if(size == 'undefined' || size < 1) {
                return false;
            }
        }
      digitnexus.utils.TreeView.prototype.remove = function(treeNode){
          if(null == treeNode) {
              return;
          }
          if(treeNode.children != null) {
              var children = treeNode.children;
              for(var index = 0; index < children.length; index++) {
                  this.remove(children[index]);
              }
          }
          if(treeNode.parent != null && treeNode.parent != this.container) {
               treeNode.parent.removeChild(treeNode);
          }
      }
      
      digitnexus.utils.TreeView.prototype.createTreeViewNode = function(node,ulContainer){
          if(node == null) {
              return;
          }
          if(null == ulContainer) {
              throw 'container is NULL';
          }
          var nodeName = null;
          if(node.getLabel != null && typeof(node.getLabel) == 'function') {
              nodeName = node.getLabel();
          }else if(node.getAttribute != null && typeof(node.getAttribute) == 'function') {
               nodeName = node.getAttribute('name');
          }else if(node.toString != null && typeof(node.toString) == 'function') {
               nodeName = node.toString();
          } else {
              throw 'tree node must be one of menthod: getAttribute, getLabel or toString';
          }
          var uiNode = null;
          if(node.getChildren != null && typeof(node.getChildren) == 'function') {
               var children = node.getChildren();
               if(children != null && children.length > 0) {
                   uiNode = this._createOneUINode('ul',nodeName); 
                   ulContainer.appendChild(uiNode);
                   for(var index = 0 ; index < children.length; index++) {
                       this.createTreeViewNode(children[index],uiNode);
                   }
               } else {
               uiNode = this._createOneUINode('li',nodeName);   
               ulContainer.appendChild(uiNode);
               }  
          } else {
               uiNode = this._createOneUINode('li',nodeName);   
               ulContainer.appendChild(uiNode);
          }
      }
      
      digitnexus.utils.TreeView.prototype._createOneUINode = function(nodeType,name){
          if(nodeType == null || nodeType.trim() == '') {
              throw 'node type cannot be null';
          }
          var uiNode = document.createElement(nodeType);
          if(name != null && name.trim() != '') {
              mxEvent.addListener(uiNode,'click',this.clickCallback);
              mxUtils.write(uiNode, mxResources.get(name, null,name) );
          }
          return uiNode;
      }
      
      digitnexus.utils.TreeView.prototype.updateTree = function(){
         if(this.checkNode(this.root)) {
             return;
         }
         this.remove(this.container);
         this.createTreeViewNode(this.root,this.container);
      }
      /******************************End Tree view****************************/
      
       /******************************End List view****************************/
       digitnexus.utils.ListView = function(container, clickCallback,model) {	
           if(container == null) {
               return;
           }
           this.container = container;
           this.clickCallback = clickCallback; 
           this.model = null;
           if(model != null) {
               this.model = model;
           }
       }
       digitnexus.utils.ListView.prototype.LIST_STYLE='ListStyle';
       
       digitnexus.utils.ListView.prototype.setModel = function(model) {
           if(null == model) {
               return;
           }
           this.model = model;
           this.onModelChange();
       }
       
       digitnexus.utils.ListView.prototype.onModelChange = function() {
           this.remove();
           if(this.model == null || this.model.getList == 'undefined' || typeof(this.model.getList) != 'function') {
               return;
           }
           var list = this.model.getList();
           if(list == null || list.length < 1) {
               return;
           }
           var ulContainer = this.createUINode(null,'ul','listViewUlStyle');
           this.container.appendChild(ulContainer);
           for(var index = 0 ; index < list.length; index++) {
               var val = list[index];
               if(val == null) {
                   continue;
               }
               var uiNode = this.createUINode(val,'li','listViewLiStyle');
               if(uiNode != null) {
                   ulContainer.appendChild(uiNode);
               }
           }
       }
        
       digitnexus.utils.ListView.prototype._getLabel = function(node) {
           if(node == null) {
               return '';
           }
           var nodeName = null;
          if(node.getLabel != null && typeof(node.getLabel) == 'function') {
              nodeName = node.getLabel();
          }else if(node.getAttribute != null && typeof(node.getAttribute) == 'function') {
               nodeName = node.getAttribute('name');
          }else if(node.toString != null && typeof(node.toString) == 'function') {
               nodeName = node.toString();
          } else {
              throw 'tree node must be one of menthod: getAttribute, getLabel or toString';
          }
          return nodeName;
       }
       
       digitnexus.utils.ListView.prototype.createUINode = function(val,nodeType,style) {
           var label = this._getLabel(val);
           if(nodeType == null || nodeType.trim() == '') {
              throw 'node type cannot be null';
          }
          var uiNode = document.createElement(nodeType);
          if(style == null) {
              style = this.LIST_STYLE;
          }
          uiNode.name = uiNode.id = label;
          uiNode.className = style;
          if(label != null && label.trim() != '') {
              if(this.clickCallback != null) {
                   mxEvent.addListener(uiNode,'click',this.clickCallback);
              }
              mxUtils.write(uiNode, mxResources.get(label.trim(), null, label));
          }
          return uiNode;
       }
       
       digitnexus.utils.ListView.prototype.remove = function(){
          if(null == this.container) {
              return;
          }
          if( this.container.children != null) {
              var children =  this.container.children;
              for(var index = 0; index < children.length; index++) {
                  this.container.remove(children[index]);
              }
          }
      }
      /******************************End List view****************************/
      /**********************Properties listener*****************************/

      digitnexus.utils.PropertiesChangeManager= function(){
           var listeners_ = new  digitnexus.utils.List();
      }
      
      /**
       *
       */
      digitnexus.utils.PropertiesChangeManager.PropertiesListener = function(propertyName,listenerName) {
          if(listenerName || propertyName) {
              throw new Error('listenerName ='+listenerName +',propertyName=' + propertyName);
          }
          this.propertyName = propertyName;
          this.listenerName = listenerName;
      }
      
      digitnexus.utils.PropertiesChangeManager.PropertiesListener.prototype.propertyChange = function(event){
          throw new Error('not support');
      }
      
      digitnexus.utils.PropertiesChangeManager.Event = function(src,propertyName, newValue,oldValue) {
          this.src = src;
          this.propertyName = propertyName;
          this.newValue = newValue;
          this.oldValue = oldValue;
      }
      
      digitnexus.utils.PropertiesChangeManager.prototype.addListener = function(listener){
         if(!listener || typeof listener !== 'function' || !listener.listenerName || !listener.propertyName) {
             return;
         }
         this.listeners_.add(listener);
      }
      
      digitnexus.utils.PropertiesChangeManager.prototype.removeListener = function(listenerName){
         if(this.listeners_ == null || this.listeners_.size < 1) {
             return;
         }
          var size = this.listeners_.size();
          for(var index = 0; index < size; index++) {
              var lis = this.listeners_.get(index);
              if(!lis && lis.listenerName === listenerName) {
                  this.listeners_.remove(lis);
                  return;
              }
          }
      }
      
      digitnexus.utils.PropertiesChangeManager.prototype.propertyChange = function(event){
           if(!event || !event.propertyName) {
               return;
           }
           if(typeof event.propertyName === 'string') {
               event.propertyName = event.propertyName.trim();
           }
          if(!this.listeners_) {
              return;
          }
          var size = this.listeners_.size();
          for(var index = 0; index < size; index++) {
              var lis = this.listeners_.get(index);
              if(lis && lis.propertyName && lis.propertyName == event.propertyName) {
                  lis.propertyChange(event);
              }
          }
      }
      /***********************************************/
})();