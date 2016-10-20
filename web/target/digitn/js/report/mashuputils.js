var digitnexus = digitnexus || {};
window.console = window.console || new function() {
    //for os that not support console as google and firefox.
    this.log = function(msg){
        
    };
    this.debug = function(msg){
        
    }; 
    this.info = function(msg){
        
    }; 
    this.warn = function(msg){
        
    }; 
    this.error = function(msg){
        
    };
}

if(!String.prototype.trim) {
    String.prototype.trim = function() {
        return this;
    }
}
 goog.require('goog.debug.reflect');
 goog.require('goog.positioning.Corner');
 goog.require('goog.object');
 goog.require('goog.ui.MenuItem');
 goog.require('goog.ui.PopupMenu');
 goog.require('goog.events');
 goog.require('goog.ui.Menu');
 goog.require('goog.ui.CheckBoxMenuItem');
 goog.require('goog.ui.FilteredMenu');
 goog.require('goog.ui.TriStateMenuItem');
 goog.require('goog.ui.FilterObservingMenuItem');
 goog.require('goog.ui.Button');
 
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
       return /^(\+|-)?\d+$/.test(value )
    },
    isFloat: function(value){         
       return /^(\+|-)?\d+($|\.\d+$)/.test(value )
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
    inherits : function(childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    },
    getWebContextPath : function() {
        var pathname = location.pathname
        pathname = pathname.substring(1,pathname.length);
        pathname = pathname.substring(0,pathname.indexOf('/')); 
        return '/'+pathname;
    },
    bind : function(scope, funct){
	return function(){
		return funct.apply(scope, arguments);
        };
   },
   removeAllChildren : function(container) {
        if(container) {
            for(var c = container.firstChild; c != null; c = container.firstChild ) {
                container.removeChild(c);
            }
        }
    },  
    startLoading : function(domHelper) {
        domHelper = domHelper || document;
        var center = domHelper.createElement('center');
        center.style.paddingTop = "300px";
        center.id='loading_'
        var img = domHelper.createElement('img');
        img.src = 'images/loading.gif';
        center.appendChild(img);
        domHelper.body.appendChild(center);
    },
    stopLoading : function(domHelper) {
        domHelper = domHelper || document;
        domHelper.body.removeChild(domHelper.getElementById('loading_'));
    },  
    /**
     * digitnexus.utils.Constants={
        IE6:'ie6',
        IE7:'ie7',
        IE8:'ie8',
        IE9:'ie9',
        IE10:'ie10',
        chrome:'chrome',
        firefox:'firefox',
        safari:'safari',
        opera:'opera'
       only IE to be support version checking
       }
     */
    isBroswer : function(browser) {
         return digitnexus.utils.browser[browser] != null;
    },
    version : function() {
        for(var b in digitnexus.utils.browser) {
            return digitnexus.utils.browser[b][1].split('.')[0];
        }
    },
    isIe : function() {
         return this.isBroswer(digitnexus.utils.Constants.IE9) || 
         this.isBroswer(digitnexus.utils.Constants.IE8) ||
         this.isBroswer(digitnexus.utils.Constants.IE7) ||
         this.isBroswer(digitnexus.utils.Constants.IE6)
    },
    encodeUrl: function(obj, temp, prefixDone) {
        var uristrings = [],
        prefix = '&',
        add = function(nextObj, i){
            var nextTemp = temp 
                ? (/\[\]$/.test(temp)) // prevent double-encoding
                   ? temp
                   : temp+'['+i+']'
                : i;
            if ((nextTemp != 'undefined') && (i != 'undefined')) {  
                uristrings.push(
                    (typeof nextObj === 'object') 
                        ? this.encodeUrl(nextObj, nextTemp, true)
                        : (Object.prototype.toString.call(nextObj) === '[object Function]')
                            ? encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj())
                            : encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj)                                                          
                );
            }
        }; 

    if (!prefixDone && temp) {
      prefix = (/\?/.test(temp)) ? (/\?$/.test(temp)) ? '' : '&' : '?';
      uristrings.push(temp);
      uristrings.push(this.encodeUrl(obj));
    } else if ((Object.prototype.toString.call(obj) === '[object Array]') && (typeof obj != 'undefined') ) {
        // we wont use a for-in-loop on an array (performance)
        for (var i = 0, len = obj.length; i < len; ++i){
            add(obj[i], i);
        }
    } else if ((typeof obj != 'undefined') && (obj !== null) && (typeof obj === "object")){
        // for anything else but a scalar, we will use for-in-loop
        for (var i in obj){
            add(obj[i], i);
        }
    } else {
        uristrings.push(encodeURIComponent(temp) + '=' + encodeURIComponent(obj));
    }
    return uristrings.join(prefix)
                     .replace(/^&/, '')
                     .replace(/%20/g, '+'); 
    },
    getUrl: function(url) {
            if(typeof WEB_CONTEXT == 'undefined') {
                WEB_CONTEXT = digitnexus.utils.getWebContextPath();
                if(!WEB_CONTEXT) {
                    throw 'fail to get web context path';
                }
            }
            return WEB_CONTEXT + url
        },
         getUrl : function(url) {
            if(typeof WEB_CONTEXT == 'undefined') {
                WEB_CONTEXT = digitnexus.utils.getWebContextPath();
                if(!WEB_CONTEXT) {
                    throw 'fail to get web context path';
                }
            }
            return WEB_CONTEXT + url
        }
}

digitnexus.utils.Constants={
    // debug level
    INFO:'INFO',
    DEBUG:'DEBUG',
    ERROR:'ERROR',
    FINAL:'FINAL',
    DEFAULT:'DEFAULT',
    IE:'ie',
    IE6:'ie6',
    IE7:'ie7',
    IE8:'ie8',
    IE9:'ie9',
    IE10:'ie10',
    chrome:'chrome',
    firefox:'firefox',
    safari:'safari',
    opera:'opera'
}

if(!digitnexus.utils.sys) {
    var ua = navigator.userAgent.toLowerCase();
    var s = null;
    var key = null;
    var bv = null;
    if(s = ua.match(/msie ([\d.]+)/)) {
        key = digitnexus.utils.Constants.IE;
        key = key + s[1].split('.')[0];
    }else if(s = ua.match(/firefox\/([\d.]+)/)) {
        key = digitnexus.utils.Constants.firefox
    }else if(s = ua.match(/chrome\/([\d.]+)/)) {
        key = digitnexus.utils.Constants.chrome;
    }else if(s = ua.match(/opera.([\d.]+)/)) {
        key = digitnexus.utils.Constants.opera;
    }else if(s = ua.match(/version\/([\d.]+).*safari/)) {
        key = digitnexus.utils.Constants.safari;
    }
    digitnexus.utils.browser = {};
    if(s != null) { 
       digitnexus.utils.browser[key] = [];
       digitnexus.utils.browser[key][0] = s[0].trim();
       digitnexus.utils.browser[key][1] = s[1].trim();
    }
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
    var index = this.getIndex_(element);
    if (index == -1) {
        return;
    }
    this.data.splice(index,1)
};

digitnexus.utils.List.prototype.contains = function (element) {
    if (null == this.data) {
        return false;
    }
    var index = this.getIndex_(element);
    if (index == -1) {
        return false;
    }
    return true;
};
digitnexus.utils.List.prototype.removeAll = function () {
    if (null == this.data) {
        return;
    }
    this.data.splice(0,this.data.length);
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
digitnexus.utils.List.prototype.indexOf = function (elements) {
    return this.getIndex_(elements);
}
/**
* .Hide
*/
digitnexus.utils.List.prototype.getIndex_ = function(element) {
    if (null == this.data) {
        return -1;
    }
    var result = -1;
    for ( var index = 0; index < this.data.length; index++) {
        if (null == this.data[index]) {
            continue;
        }
        if(!this.data[index].equals) {
            throw 'Must implement equals method for list element';
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
digitnexus.utils.inherits(digitnexus.utils.Set, digitnexus.utils.List);
//digitnexus.utils.Set.prototype = new  digitnexus.utils.List();
//digitnexus.utils.Set.prototype.constructor = digitnexus.utils.Set;
       
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
    var index = this.getIndex_(element);
    if (index == -1) {
        return false;
    }
    return true;
};

digitnexus.utils.Set.prototype.remove = function (element) {
    if (null == this.data) {
        return;
    }
    var index = this.getIndex_(element);
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
        
digitnexus.utils.Set.prototype.getIndex_ = function (element) {
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
    var index = this.getIndex_(key);
    if (-1 == index) {
        return null;
    }
    return this.data[index].value;
};

digitnexus.utils.HashMap.prototype.contains = function(key) {
    if (null == this.data || null == key) {
        return false;
    }
    var index = this.getIndex_(key);
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
    index = this.getIndex_(key);
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
digitnexus.utils.HashMap.prototype.getIndex_ = function(key) {
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
    this.setInputDisplay_(rows,'none');
}
        
digitnexus.utils.Table.prototype.showAllRows = function(rows) {
    this.setInputDisplay_(rows,'');
}
digitnexus.utils.Table.prototype.setInputDisplay_ = function(rows,display) {
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
    
/*********************************Form Factory*******************************/

if(digitnexus.utils.formFactory == null || digitnexus.utils.formFactory == 'undefined') {
    digitnexus.utils.FormFactory_ = function() {
         
        }
    digitnexus.utils.FormFactory_.prototype.createTextbox =  function(name,value) {
        return this.createInput(name,value,'text');  
    }
    digitnexus.utils.FormFactory_.prototype.createPassword = function(name,value) {     
        return this.createInput(name,value,'password');  
    }
    digitnexus.utils.FormFactory_.prototype.createHidden = function(name,value) {     
        return this.createInput(name,value,'hidden');  
    }
    digitnexus.utils.FormFactory_.prototype.createFile = function(name,value) {     
        return this.createInput(name,value,'file');  
    }
          
    digitnexus.utils.FormFactory_.prototype.createSubmit= function(name,value) {     
        return this.createInput(name,value,'submit');  
    }
    digitnexus.utils.FormFactory_.prototype.createReset= function(name,value) {     
        return this.createInput(name,value,'reset');  
    }
    digitnexus.utils.FormFactory_.prototype.createImage= function(name,imageFile) {
        var image = this.createInput(name,value,'image'); 
        image.src = imageFile;
        return image;  
    }
    digitnexus.utils.FormFactory_.prototype.createRadiobox =  function(name,values,defaultValue) {
        var radios = document.createElement('div');
        radios.name = name;
        //default is array
        var valuesArray = values;
        if(typeof(values) == 'string') {
            valuesArray =  this.parseAvaiableValue_(values,',');
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
         
    digitnexus.utils.FormFactory_.prototype.createCheckbox =  function(name,values,checkedValues) {
        var radios = document.createElement('div');
        radios.name = name;
        var valuesArray = values;
        if(typeof(values) == 'string') {
            valuesArray =  this.parseAvaiableValue_(values,',');
        }
        var defaultValues = checkedValues;
        if(typeof(checkedValues) == 'string') {
            defaultValues =  this.parseAvaiableValue_(checkedValues,',');
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
         
    digitnexus.utils.FormFactory_.prototype.createTextarea = function(name, value, rows, cols){
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
         
    digitnexus.utils.FormFactory_.prototype.createCombobox =  function(name, isMultiSelect, size, labels, values, selectValues) {
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
            labels =  this.parseAvaiableValue_(labels,',');
        }
        if(null != values && typeof(values) == 'string') {
            values =  this.parseAvaiableValue_(values,',');
        }
        var selectValues = selectValues;
        if(null != selectValues && typeof(selectValues) == 'string') {
            selectValues =  this.parseAvaiableValue_(selectValues,',');
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
        
    digitnexus.utils.FormFactory_.prototype.createInput = function(name,value,type) {     
        var input = document.createElement('input');
        input.value = value == null ? '': value;
        input.name = name == null? '': name;
        input.type = type == null? '': type;
        return input;
    }
    digitnexus.utils.FormFactory_.prototype.parseAvaiableValue_ = function(availableValue,seperator){
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
         
    digitnexus.utils.FormFactory_.prototype.getNodeValue = function(node){
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
    digitnexus.utils.formFactory = new digitnexus.utils.FormFactory_();
};
/******************************End HTML Form Factory****************************/
    
/******************************Tree view****************************/
/*
* TreeModel requre below:
* hasChildren(): whether exist child
* getChildren() : return all the children, the type must a Set or List
* getParent(): get parent
* getLabel(); return the name of the node;
*/
digitnexus.utils.SettingModel_ = function(key,value) { 
    if(value == null || key == null) {
        throw 'model key and value cannot be NULL';
    }
    this.value = value;
    this.key = key;
}
digitnexus.utils.SettingModel_.prototype.getChildren = function(){
    return null;
}
digitnexus.utils.SettingModel_.prototype.getLabel = function(){
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
        array.push(new digitnexus.utils.SettingModel_(key,obj));
    }
    return  array;
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
        console.log( 'model is null');
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
            uiNode = this.createOneUINode_('ul',nodeName); 
            ulContainer.appendChild(uiNode);
            for(var index = 0 ; index < children.length; index++) {
                this.createTreeViewNode(children[index],uiNode);
            }
        } else {
            uiNode = this.createOneUINode_('li',nodeName);   
            ulContainer.appendChild(uiNode);
        }  
    } else {
        uiNode = this.createOneUINode_('li',nodeName);   
        ulContainer.appendChild(uiNode);
    }
}
      
digitnexus.utils.TreeView.prototype.createOneUINode_ = function(nodeType,name){
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
        
digitnexus.utils.ListView.prototype.getLabel_ = function(node) {
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
    var label = this.getLabel_(val);
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
/**
 * parseArgs ={
 * coordinate:coordinateValueStr,
 * labelName: labelNameStr,
 * valueName:valueNameStr
 * radioCheck: true or false
 * }
 */
digitnexus.utils.bo = digitnexus.utils.bo || {};
digitnexus.utils.bo.BoTable = function(jsonBo,parseArgs) {
    if(!jsonBo) {
        throw 'Bo cannot be NULL';
    }
    if(!parseArgs) {
        throw 'context instance cannot be NULL';
    }
    //never use these two field directly
    this.jsonBo_ = jsonBo;
    this.parseArgs_ = parseArgs;
    
    this.headers_ = this.jsonBo_.data.headers || [];
    this.table_ = this.jsonBo_.data.table || [];
    
    this.coordinate_ = this.parseArgs_.coordinate ? 
        this.parseArgs_.coordinate.trim() : '';              
    if (this.coordinate_  == '') {
        throw "coordinate can't be null, fail to draw this graph.";
    }
     
    this.labelName_ = this.parseArgs_.labelName? this.parseArgs_.labelName.trim() : '';
    this.valueName_ = this.parseArgs_.valueName? this.parseArgs_.valueName.trim() : '';
    this.filterConditions_ = null;
    this.init_();
}


digitnexus.utils.bo.BoTable.Constants = {
    COORDINATE : "coordinate",
    LABEL : "label",
    LABEL_HEADER : "header",
    VALUE : "value",
    VALUE_ROW : "row",
    ROW : "row",
    COLUMN: "column" 
}


digitnexus.utils.bo.FilterCondition = function(header,selected) {
    this.header = header;
    this.selected = selected;
}


digitnexus.utils.bo.BoTable.prototype.init_ = function() {
    this.filterConditions_ = [];
    if(digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_) {
        for (var index = 0; index < this.headers_.length; index++) {
            if(this.headers_[index] && !this.isLabelColumn_(this.headers_[index])){
                this.filterConditions_.push(new digitnexus.utils.bo.FilterCondition(
                this.headers_[index],false));
            }
        }
    } else if (digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_) {
        
    }
    if(this.filterConditions_.length > 0) {
        this.filterConditions_[0].selected = true;
    }
}

digitnexus.utils.bo.BoTable.prototype.getKeys = function() {
    var keys = [];
    for(var fc in this.filterConditions_) {
       if(this.filterConditions_[fc].selected) {
           keys.push(this.filterConditions_[fc].header.name);
       }
    }
    return keys;
}

digitnexus.utils.bo.BoTable.prototype.isLabelColumn_ = function(header) {
    var flag = false;
    if(digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_) {
        var values = this.getColumnValues_(header);
        if(!values || values.length < 1) {
            return true;
        }
        for(var v =0; v < values.length; v++) {
            if(isNaN(values[v])) {
                flag = true;
                break;
            }
        }
    } else {
        
    }
    return flag;
}

/**
 * ONLY Support column coordinate BO
 */
digitnexus.utils.bo.BoTable.prototype.getFilterConditions = function() {
   return this.filterConditions_;
}

digitnexus.utils.bo.BoTable.prototype.changeCondition = function(name,selected) {
        var isRadioCheck = this.parseArgs_.isRadioCheck ? 
        this.parseArgs_.isRadioCheck : false; 
   if(isRadioCheck) {
       var flag = false;
       for(var fc = 0;fc <  this.filterConditions_.length; fc++ ) {
       if(this.filterConditions_[fc].header.name == name) {
           if(this.filterConditions_[fc].selected != selected) {
                this.filterConditions_[fc].selected = selected;
                flag = true;
           }
       } else {
           if(this.filterConditions_[fc].selected) {
               this.filterConditions_[fc].selected = false;
                flag = true;
           }
       }
      }
      return flag;
   } else {
      for(var fc = 0;fc <  this.filterConditions_.length; fc++ ) {
       if(this.filterConditions_[fc].header.name == name) {
           if(this.filterConditions_[fc].selected != selected) {
                this.filterConditions_[fc].selected = selected;
                return true;
           }else {
               return false;
           } 
       }
   }  
   }
  
   return false;
}


digitnexus.utils.bo.BoTable.prototype.getLabels = function() {
    var labels = [];// new digitnexus.utils.List();  
    if ("" === this.labelName_) {
        throw "label name can't be found!";
    }
    if (digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_) {
        for ( var index = 0; index < this.headers_.length; index++) {
            var h =  this.headers_[index];
            labels.push(h.name);
        }
    } else if (digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_) {
        labels = this.getColumnValues_(this.labelName_);
    } else {
        throw "coordinate value invalide" + this.coordinate_;
    }
    return labels;
}


/**
 * Only for column coordination
 * Get the position of the column by the column name
 */
digitnexus.utils.bo.BoTable.prototype.getColumnPositionByName_ = function(headerName) {
    var valueIndex = -1;
    headerName = headerName ? headerName.trim() : ''
    for (var index = 0; index < this.headers_.length; index++) {
        var h = this.headers_[index];
        if (headerName == h.name) {
            valueIndex = h.position;
            break;
        }
    }
    return valueIndex;
}


/**
 * Only for column coordination
 * Get specfify column values by the column position;
 * Mock polymorphism method as Java or C++:
 * if the type of the argument:
 *   Number: It's the position of the header;
 *   String: It's the name of the header;
 *   Object: It's the herder of json, which mean there is  header.name,
 *            key.position
 */
digitnexus.utils.bo.BoTable.prototype.getColumnValues_ = function(key) {
    if(!key) {
        return [];
    }
    //get values by header position
    var getValuesByPosition = function(position) {
        var nvs = [];
        for ( var index = 0; index < this.table_.length; index++) {
        	nvs[index] = this.table_[index].row[position].data;
                if(digitnexus.utils.isIngeger(nvs[index])) {
                     nvs[index]  = parseInt(nvs[index])
                }else if(digitnexus.utils.isFloat(nvs[index])){
        	   nvs[index]  = parseFloat(nvs[index])
                }
        }
        return nvs;
    }
    if(typeof key == 'number') {
        return getValuesByPosition.call(this,key);	
    }
   if(typeof key == 'string') {
       var index = this.getColumnPositionByName_(key.trim());
       if(index > -1) {
            return getValuesByPosition.call(this,index);
       }
   }
   if(typeof key == 'object' && key.name && (key.position != null)) {
        return getValuesByPosition.call(this,key.position);
   }
   return [];
}

digitnexus.utils.bo.BoTable.prototype.getData = function() {
    if ("" === this.valueName_) {
        throw "label name can't be found!";
    }	
    var values = [];
    if (digitnexus.utils.bo.BoTable.Constants.ROW === this.coordinate_) {
        if( !this.table_[0] || !this.table_[0].row ) {
            return values;
        }
        for (var index = 0; index < this.table_.length; index++) {
            var row = this.table_[index].row ;
            var vs = [];
            for ( var ri = 0; ri < row.length; ri++) {
                var v = parseInt(row[ri].data);
                vs[ri] = parseInt(new Number(v).toPrecision());
            }
            values[index] = vs;
        }
    } else if (digitnexus.utils.bo.BoTable.Constants.COLUMN === this.coordinate_) {
        for(var con =0; con < this.filterConditions_.length; con++) {
            if(!this.filterConditions_[con].selected) {
                continue;
            }
           values.push(this.getColumnValues_(this.filterConditions_[con].header));
        }	
    } else {
        throw "coordinate value invalide" + this.coordinate_;
    }
    return values;
};


digitnexus.utils.ConditionConstructor = function(bo) {
    this.bo = bo;
    this.menu_ = null;
}


digitnexus.utils.ConditionConstructor.prototype.setHandler = function(handler) {
    if(!handler) {
        throw 'Handler cannot be NULL for condition';
    }
    this.handler = handler;
}

digitnexus.utils.ConditionConstructor.prototype.isVisible = function() {
    return this.menu_.isVisible();
}

digitnexus.utils.ConditionConstructor.prototype.setVisible = function(flag) {
  this.menu_.setVisible(flag);
}


digitnexus.utils.ConditionConstructor.prototype.updateMenuItemState = function() {
     var conditions = this.bo.getFilterConditions();
    if(!conditions || conditions.length <= 0) {
        return;
    }
   for(var con = 0; con < conditions.length; con++) {
        var name = conditions[con].header.name;
        var item = this.group.getItem(name);
        if(item) {
            item.setStatu(conditions[con].selected ? digitnexus.utils.Menu.Item.StatusType.CHECKED:
                digitnexus.utils.Menu.Item.StatusType.UNCHECKED );
        }  
    }
}


digitnexus.utils.ConditionConstructor.prototype.rennder = function(mm,opt_doc) {
     if(!this.handler) {
        throw 'Handler cannot be NULL for condition';
    }
    if(!mm) {
        throw 'container cannot be NULL';
    }
    var conditions = this.bo.getFilterConditions();
    if(!conditions || conditions.length <= 0) {
        return;
    }
    
    var mainMenu = new digitnexus.utils.Menu('filter');
    this.group = new digitnexus.utils.Menu.ItemGroup(digitnexus.utils.Menu.Item.Type.CHECK,'filter',this.handler);
    
    for(var con = 0; con < conditions.length; con++) {
        var name = conditions[con].header.name;
        var item = new digitnexus.utils.Menu.Item(name);
        this.group.addItem(item);
        item.setStatu(conditions[con].selected ? digitnexus.utils.Menu.Item.StatusType.CHECKED:
            digitnexus.utils.Menu.Item.StatusType.UNCHECKED );
        item.setData(name); 
    }
     mainMenu.addItem(this.group);
     mm.addMenu(mainMenu);
}

digitnexus.utils.MashupOperator = function() {
    this.TAG = "MashupOperator ";
    this.id = -1;
    this.type = -1;
    this.name = "";
    this.descript = "";
};


digitnexus.utils.MashupOperator.prototype.execute = function(context) {
    if (digitnexus.re.DEBUG) {
        console.log(this.TAG + "Default NULL implementation");
    }
    throw "not support this method, need overwrite this method!";
}


/**
   * search from parameters, inputParameters, outputParameters, 
  */
digitnexus.utils.MashupOperator.prototype.getParameter = function(context,name) {
    var value = context.getParameter(name);
    if(value == null) {
        value = context.getInputParameter(name);
    }
    if(value == null) {
        value = context.getOutputParameter(name);  
    }
    return value;
}; 


digitnexus.utils.HttpRequest = function(url, params, method, async, username, password){
    	this.username = username;
	this.password = password;
	this.url = url;
	this.params = params;
	this.method = method || 'post';
	this.async = (async != null) ? async : true;
};


digitnexus.utils.HttpRequest.prototype.isBinary = function(){
	return this.binary;
};


digitnexus.utils.HttpRequest.prototype.setBinary = function(value){
	this.binary = value;
};


digitnexus.utils.HttpRequest.prototype.getText = function(){
	return this.request.responseText;
};


digitnexus.utils.HttpRequest.prototype.isReady = function(){
	return this.request.readyState == 4;
};


digitnexus.utils.HttpRequest.prototype.getXml = function(){
	return this.request.responseXML;
};


digitnexus.utils.HttpRequest.prototype.getText = function(){
	return this.request.responseText;
};


digitnexus.utils.HttpRequest.prototype.getStatus = function(){
	return this.request.status;
};


digitnexus.utils.HttpRequest.prototype.toString = function(){
	return 'Status: ' + this.getStatus() + 'Text: ' + this.getText();
};


digitnexus.utils.HttpRequest.prototype.createRequest_ = function(){
	if (window.XMLHttpRequest){
		return new XMLHttpRequest();	
	}else if (typeof(ActiveXObject) != "undefined"){
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
};


digitnexus.utils.HttpRequest.prototype.send = function(onload, onerror){
	this.request = this.createRequest_();
        var handlerResponse = digitnexus.utils.bind(this, function() {
            if (this.isReady()){
                var status = this.getStatus();
                if(status == 200) {
                    onload(this);
                } else{
                    if(onerror) {
                        onerror(this);
                    } 
                }
                this.request.onreadystatechange = null;
            }
        });
        
	if (this.request){
		if (onload && this.async){
			this.request.onreadystatechange = handlerResponse;
		}
		this.request.open(this.method, this.url, this.async,
			this.username, this.password);
		this.setRequestHeaders(this.request, this.params);
		this.request.send(this.params);
	}
};


digitnexus.utils.HttpRequest.prototype.setRequestHeaders = function(request, params){
	if (params){
		request.setRequestHeader('Content-Type',
			'application/x-www-form-urlencoded');
	}
};

/**
 * take the i18n.propertis as the default language
 */
digitnexus.utils.i18n = new function() {
    //resource name is : i18n_zh.properties
    this.resources_ = new digitnexus.utils.HashMap();
    //take the i18n.propertis as the default language
    this.defaultLanguage_ = '';
    this.defaultResDir_ = '/js/report/resources';
    this.resPrefix_ = 'i18n';
    
    this.get = function(key,params,defaultValue) {
        if(!defaultValue) {
            defaultValue = '';
        }
        if(key == null ) {
            return defaultValue;
        }
        var v = this.resources_.get(key.trim());
        if(!v) {
            return defaultValue
        }
        if(!params) {
            return v;
        }
        var result = [];
        var index = null;		
        for (var i = 0; i < v.length; i++){
            var ch = v.charAt(i);
            if (ch == '{') {
                index = '';
            } else if (index != null && ch == '}') {
                index = parseInt(index);				
                if (index >= 0 && index < params.length){
                    result.push(params[index]);
                }			
                index = null;
            } else if (index != null) {
                index += ch;
            } else  {
                result.push(ch);
            }
        }		
        v = result.join('');
        return v;
    }
    
    
    this.set = function(key,value) {
        if(!key) {
            return;
        }
       this.resources_.put(key.trim(),value);
    }
    
    
    this.getFromServer_ = function(url) {
            var request = new digitnexus.utils.HttpRequest(
                url, null, 'get', false, null, null);
            request.send();
            if(request.getStatus() == 200) {
                return request.getText();
            } else {
                console.log( 'fail to get: '+url);
                return null;
            }
    }
    
    this.parse_ = function(text) {
        if(!text) {
            return;
        }
        var lines = text.split('\n');		
        for (var i = 0; i < lines.length; i++){
            var index = lines[i].indexOf('=');	
            if(index < 0) {
                continue;
            }
            var key = lines[i].substring(0, index);
            var idx = lines[i].length;			
            if (lines[i].charCodeAt(idx - 1) == 13){
                idx--;
            }
            var value = lines[i].substring(index + 1, idx);
            //strip the invalid utf8 chart
            value = value.replace(/\\(?=u[a-fA-F\d]{4})/g,"%");
            this.set(key,unescape(value));
        }
    }
    
    
    this.load_ = function(lan){
        var path = this.defaultResDir_ + '/' +this.resPrefix_;
        if(lan != null && lan.trim() != '') {
            path =  path + '_' + lan;
        }
          path = path + '.properties';
         var url = digitnexus.re.context + path;
         var text = this.getFromServer_(url);
         if(!text) {return false};
         this.parse_(text);
         return true;
    }

    this.getLocal_ = function() {
        return navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
    }

    this.init = function(specailLanguage,defaultResDir) {

        if(defaultResDir) {
            this.defaultResDir_ = defaultResDir;
        }
        if(this.defaultLanguage_ == null) {
            this.defaultLanguage_ = this.getLocal_();
        }
        this.defaultLanguage_ = this.getLan(this.defaultLanguage_);
        if(!this.load_(this.defaultLanguage_)) {
            //load i18n.properties
            if(!this.load_('')) {
                console.log('fail to load default language resource');
            }
        }
        specailLanguage = this.getLan(specailLanguage);  
        if(specailLanguage && specailLanguage != this.defaultLanguage_) {
            this.load_(specailLanguage);
        }
    }
    
     this.getLan = function(lan) {
         if(!lan) {
             return '';
         }
         var index = lan.indexOf('_');
         if(index < 0){
             index = lan.indexOf('-');
            if(index < 0){
                 return lan;
            }
         }
         return lan.substring(0,index);
     }
     
    this.setDefaultLang = function(lan) {
         this.defaultLanguage_ = lan;
    }
    
    this.setDefaultResDir = function(dir) {
         this.defaultResDir_ = dir;
    }
    
    this.setResPrefix = function(prefix) {
         this.resPrefix_ = prefix;
    }
    
    this.getDefaultLang = function() {
         return this.defaultLanguage_;
    }
    
    this.getDefaultResDir = function() {
         return this.defaultResDir_;
    }
    
    this.getResPrefix = function() {
         return this.resPrefix_;
    }
}

digitnexus.utils.localStorage = new function() {
    this.updateBrowser_ = digitnexus.utils.i18n.get('update_your_browser');
    this.set = function(key,value) {
        if(!this.isSupport()) {
            alert(this.updateBrowser_);
            return;
        }
        localStorage.setItem(key,value);
    }
    
    this.remove = function(key) {
         if(!this.isSupport()) {
            alert(this.updateBrowser_);
            return;
        }
        localStorage.removeItem(key);
    }
    
    this.get = function(key) {
         if(!this.isSupport()) {
            alert(this.updateBrowser_);
            return;
        }
        return localStorage.getItem(key);
    }
    
    this.clear = function() {
         if(!this.isSupport()) {
            alert(this.updateBrowser_);
            return;
        }
        if(confirm('this operation will clear all local storage data?')) {
            localStorage.clear();
        }
    }
    
    this.supportLocalstorage = function() {
        try {
            return window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }
    
    this.isSupport = function() {
        if(digitnexus.utils.isIe() && digitnexus.utils.version() < 8) {
           return false;
        }else {
            return true;
        }       
    }
}

digitnexus.utils.sessionStorage = new function() {
    this.updateBrowser_ = digitnexus.utils.i18n.get('update_your_browser');
    this.set = function(key,value) {
        if(!this.supportLocalstorage()) {
            alert(this.updateBrowser_);
            return;
        }
        sessionStorage.setItem(key,value);
    }
    
    this.remove = function(key) {
         if(!this.supportLocalstorage()) {
            alert(this.updateBrowser_);
            return;
        }
        sessionStorage.removeItem(key);
    }
    
    this.get = function(key) {
         if(!this.supportLocalstorage()) {
            alert(this.updateBrowser_);
            return;
        }
        return sessionStorage.getItem(key);
    }
    
    this.clear = function() {
         if(!this.supportLocalstorage()) {
            alert(this.updateBrowser_);
            return;
        }
        if(confirm('this operation will clear all local storage data?')) {
            sessionStorage.clear();
        }
    }
    
    this.supportLocalstorage = function() {
        try {
            return window.sessionStorage !== null;
        } catch (e) {
            return false;
        }
    }
}

digitnexus.utils.fileManager = new function() {
    this.upload = function(file,url,onComplete,onError) {
        var xhr = new XMLHttpRequest();
        /*
        params = params || {};
        params['qqfile'] = name;
        var queryString = qq.obj2url(params, this._options.action);
        */
         xhr.onreadystatechange = function(){            
            if (xhr.readyState == 4){
               	onComplete(xhr);
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(file);
    }
}


digitnexus.utils.fillMenu = function(keys,onselect){
        var ml = document.createElement('ul');
        ml.className = 'menuList';
        for(var key in keys) {
            var li = document.createElement('li');
            li.className = 'menuListItem';
            var span = document.createElement('span');
            span.className = 'menuListItem';
            span.appendChild(document.createTextNode(digitnexus.utils.i18n.get(keys[key],null,keys[key])));
            li.appendChild(span);
            span.et = keys[key];
            span.onclick = digitnexus.utils.bind(this, function(e) {
                onselect(e.srcElement.et);
            });
            ml.appendChild(li);
        }
        return ml;
}

digitnexus.utils.MainMenu = function(mcOpt){
    this.menus = [];
    if(mcOpt) {
        this.elt = mcOpt;
    }else {
        this.elt = document.createElement('div');
        this.elt.className='mainMenu';
    }
}

digitnexus.utils.MainMenu.prototype.onActiveMouseOver = function(menu){
    this.deselectother_(menu);
}

digitnexus.utils.MainMenu.prototype.onclick = function(menu){
    this.deselectother_(menu);
}

digitnexus.utils.MainMenu.prototype.deselectother_ = function(menu){
    for(var i = 0 ; i < this.menus.length; i++) {
        if(this.menus[i] && this.menus[i] != menu && this.menus[i].isShow) {
            this.menus[i].hidden();
        }
    }
}

digitnexus.utils.MainMenu.prototype.addMenu = function(menu){
    menu.mainMenu = this;
    this.menus.push(menu);
    menu.rendder(this.elt);
}

digitnexus.utils.MainMenu.prototype.removeMenu = function(menu){
    for(var i = 0; i < this.menus.length; i++) {
        if(menu == this.menus[i]) {
            this.elt.removeChild(this.menus[i].activeElt.elt);
            menu.mainMenu = null;
            this.menus.splice(i,1);
        }
    }
}

digitnexus.utils.MainMenu.prototype.rendder = function(mc){
    mc.appendChild(this.elt);
}


digitnexus.utils.Menu = function(key){
     this.elt = document.createElement('ul');
     this.elt.className='menuList';
     this.elt.style.position = 'absolute';
     this.items_ = [];
     this.action_ = null;
     this.key = key;
     this.isShow = false;
     this.activeElt = new digitnexus.utils.Menu.Activator(this,digitnexus.utils.bind(this, function(evt){
         if(this.mainMenu) {
             this.mainMenu.onclick(this);
         }
         if(this.isShow) {
             this.hidden();
         } else {
             this.show(evt.srcElement);
         }
    }));
}

digitnexus.utils.Menu.prototype.hidden = function() {
   this.elt.style.display='none';
   this.isShow = false;
}

digitnexus.utils.Menu.prototype.show = function(actElt) {
    if(!actElt) {
        actElt = this.activeElt.elt;
    }
    this.elt.style.position = 'absolute';
    this.elt.style.left = actElt.offsetLeft + 'px';
    this.elt.style.top = (actElt.offsetTop + actElt.offsetHeight) + 'px';
    this.elt.style.display='block';
    this.isShow = true;
}

digitnexus.utils.Menu.prototype.rendder = function(pannel) {
   this.elt.style.display='none';
   pannel.appendChild(this.activeElt.elt);
   pannel.appendChild(this.elt);
}

digitnexus.utils.Menu.prototype.addItem = function(item) {
    this.items_.push(item);
    this.elt.appendChild(item.elt);
    item.parentMenu = this;
}

digitnexus.utils.Menu.prototype.removeItem = function(item) {
    for(var i = 0; i < this.items_.length; i++) {
        if(item == this.items_[i]) {
            this.elt.removeChild(this.items_[i].elt);
            item.parentMenu = null;
            this.items_.splice(i,1);
        }
    }
}

digitnexus.utils.Menu.prototype.setAction = function(action) {
    this.action_ = action;
}

digitnexus.utils.Menu.prototype.onSelect = function(item) {
  this.hidden();
  if(!item) {
      alert('select invalid item')
      return;
  }
  if(item.group && item.group.getAction()) {
      item.group.getAction()(item);
  }
  if(this.action_) {
      this.action_(item);
  }
  if(item.getAction()) {
      item.getAction()(item);
  }
}



digitnexus.utils.Menu.Activator = function(menu,callback) {
    if(callback == null) {
        throw 'menu activator cannot be NULL';
    }
    this.elt = document.createElement('span');
    this.elt.className='menuActivator'
    var l = digitnexus.utils.i18n.get(menu.key,null,menu.key);
    this.elt.appendChild(document.createTextNode(l));
    var onaction = digitnexus.utils.bind(this, function(e){
        callback(e);
    });
    this.elt.onclick = onaction;
    this.elt.onmouseover = onaction;
}


digitnexus.utils.Menu.Seperator = function() {
    this.elt = document.createElement('hr');
    this.elt.className='menuSeperator'
    this.elt.style.width = '100%';
    this.elt.style.height = '2x';
    this.elt.style.color='gray';
}

digitnexus.utils.Menu.Item = function(key,action) {
    if(!key || key.trim() == '') {
        throw 'menu item key cannot be NULL';
    }
    this.elt = document.createElement('li');
    this.elt.className = 'menuListItem';
    this.key_ = key;
    var l = digitnexus.utils.i18n.get(key,null,key);
    this.elt.appendChild(document.createTextNode(l));
    this.elt.style.paddingLeft='20px';
    
    this.parentMenu = null;
    this.action_ = action;
    
    this.group = null;

    this.checkImage = digitnexus.utils.getUrl('/js/report/images/check.png');
    this.checkImage = 'url(' +  this.checkImage + ')';
    this.elt.onclick = digitnexus.utils.bind(this, function(e) {
         this.onSelect_(e);
    });
}

digitnexus.utils.Menu.Item.prototype.setData = function(data) {
    this.data = data;
}

digitnexus.utils.Menu.Item.prototype.getData = function() {
    return this.data;
}

digitnexus.utils.Menu.Item.prototype.isSelected = function() {
    return this.status_ == digitnexus.utils.Menu.Item.StatusType.CHECKED
}

digitnexus.utils.Menu.Item.prototype.setStatu = function(statu) {
    if(!this.group || !this.group.type|| this.status_ == statu || this.group.type == digitnexus.utils.Menu.Item.Type.NORMAL) {
        return;
    }
     this.status_ = statu;
    if(this.status_ == digitnexus.utils.Menu.Item.StatusType.CHECKED) {
            this.elt.style.listStyleType = 'image';
            this.elt.style.listStylePosition =  'inside';
            this.elt.style.listStyleImage = this.checkImage;
             this.elt.style.paddingLeft='0px';
       }else {
            this.elt.style.listStyleType = 'none';
            this.elt.style.listStylePosition =  'inside';
            this.elt.style.listStyleImage = null;
            this.elt.style.paddingLeft='20px';
     }   
}

digitnexus.utils.Menu.Item.prototype.getAction = function() {
    return this.action_;
}

digitnexus.utils.Menu.Item.prototype.setAction = function(action) {
    this.action_ = action;
}

digitnexus.utils.Menu.Item.prototype.onSelect_ = function(e) {
    if(this.isSelected()) {
        this.setStatu(digitnexus.utils.Menu.Item.StatusType.UNCHECKED);
    }else {
        this.setStatu(digitnexus.utils.Menu.Item.StatusType.CHECKED);
    }
    if(this.group) {
        this.group.onSelect(this);
    }else if(this.parentMenu) {
        this.parentMenu.onSelect(this);
    }
}

digitnexus.utils.Menu.Item.prototype.getKey = function() {
    return this.key_;
}

digitnexus.utils.Menu.Item.StatusType ={
    CHECKED: 'checked',
    UNCHECKED: 'notchecked'
}

digitnexus.utils.Menu.Item.Type = {
    RADIO: 'radio',
    CHECK: 'check',
    NORMAL: 'normal'
}

digitnexus.utils.Menu.ItemGroup = function(type,key,action) {
    this.elt = document.createElement('ul');
    this.elt.className = 'menuItemGroup';
    this.items_ = [];
    this.parentMenu = null;
    this.key_ = key;
    this.action_ = action;
    this.type = type;
    this.headerSeperator = new digitnexus.utils.Menu.Seperator();
    this.elt.appendChild(this.headerSeperator.elt);
    this.tailSeperator =new digitnexus.utils.Menu.Seperator();
    this.elt.appendChild(this.tailSeperator.elt);
}

digitnexus.utils.Menu.ItemGroup.prototype.onSelect = function(item) {
    if(this.type == digitnexus.utils.Menu.Item.Type.RADIO) {
       for(var i = 0; i < this.items_.length; i++) {
           if(this.items_[i] != item && this.items_[i].isSelected()) {
               this.items_[i].setStatu(digitnexus.utils.Menu.Item.StatusType.UNCHECKED);
           }
       }
    }
    if(this.parentMenu) {
        this.parentMenu.onSelect(item);
    }
}

digitnexus.utils.Menu.ItemGroup.prototype.getSelection = function() {
    var is = [];
    for(var i = 0 ; i < this.items_.length; i++) {
        if(this.items_[i] && this.items_[i].isSelected()) {
            is.push(this.items_[i]);
        }
    }
    if(digitnexus.utils.Menu.Item.Type.NORMAL) {
        return null;
    }else if(digitnexus.utils.Menu.Item.Type.CHECK) {
        return is;
    } else if(digitnexus.utils.Menu.Item.Type.RADIO) {
        return is.length > 0 ? is[0]: is;
    }
    return null;
}

digitnexus.utils.Menu.ItemGroup.prototype.getItems = function() {
    return this.items_;
}

digitnexus.utils.Menu.ItemGroup.prototype.getItem = function(key) {
    for(var i = 0; i < this.items_.length; i++) {
        if(key == this.items_[i].key_) {
            return this.items_[i];
        }
    }
    return null;
}

digitnexus.utils.Menu.ItemGroup.prototype.addItem = function(item) {
    this.items_.push(item);
    this.elt.insertBefore(item.elt,this.tailSeperator.elt);
    item.group = this;
}

digitnexus.utils.Menu.ItemGroup.prototype.removeItem = function(item) {
    for(var i = 0; i < this.items_.length; i++) {
        if(item == this.items_[i]) {
            this.elt.removeChild(this.items_[i].elt);
            this.items_.splice(i,1);
        }
    }
     item.group = null;
}

digitnexus.utils.Menu.ItemGroup.prototype.getAction = function() {
    return this.action_;
}

digitnexus.utils.Menu.ItemGroup.prototype.setAction = function(action) {
    this.action_ = action;
}



