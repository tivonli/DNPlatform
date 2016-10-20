/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var dititnexus = dititnexus || {};

dititnexus.asynformupload = {
        isIE: function () { return ! -[1, ]; },
        isFF: function () { return window.navigator.userAgent.indexOf("Firefox") !== -1; },
        isArray: function (obj) { return this.isType(obj, "Array"); },
        isType: function (obj, type) { return Object.prototype.toString.call(obj) === "[object " + type + "]"; },
        isNodeList: function (obj) { return this.isType(obj, "NodeList");},
        parseDom : function (arg) { var objE = document.createElement("div"); objE.innerHTML = arg; return objE.childNodes; },
       hiddenForm_ : 'hiddenForm_',
       hiddenIframe_ :'hiddenIframe_',
       formSubmit: function (args, action, func) {
            this.clearContext();
            this.callBack = null;
            this.loadHack = true;
            var subArr = [];
            var subArrT = [];
            if (dititnexus.asynformupload.isArray(args)) {
                subArr = args;
            } else if(dititnexus.asynformupload.isNodeList(args)) {
                for(var index = 0 ; index < args.length; index++) {
                    subArr.push(args[index]);
                }
            }else {
                var tag = args.tagName.toLowerCase();
                if (tag == "form") { 
                    for (var i = 0, num = args.childNodes.length; i < num; i++) {
                        subArr.push(args.childNodes[i]); 
                    }
                }
                else { subArr = [args]; }
            }
            //create asynformupload form and ifroma
            var objForm = document.createElement("form");
            objForm.action = action;
            objForm.target = this.hiddenIframe_;
            objForm.encoding = "multipart/form-data";
            objForm.method = "post";
            objForm.id = this.hiddenForm_;
            objForm.style.display = "none";
            var objIframe = dititnexus.asynformupload.parseDom('<iframe id="hiddenIframe_" name="hiddenIframe_" src="about:blank" style="display:none;" onload="dititnexus.asynformupload.complete()"></iframe>')[0];
            //add submit value in form
            for (var i = 0, num = subArr.length; i < num; i++) {
                if (!subArr[i].name && subArr[i].nodeType == 1 && subArr[i].tagName.toLowerCase() == "input") subArr[i].name = "inputid_" + i;
                var input = subArr[i].cloneNode(true);
                subArrT.push(input);
                if(subArr[i].parentNode) {
                    subArr[i].parentNode.replaceChild(input, subArr[i]);
                }
                objForm.appendChild(subArr[i]);
            }
            //submit
            document.body.appendChild(objIframe);
            document.body.appendChild(objForm);
            objForm.submit();
            //dispose
            for (var i = 0, num = subArrT.length; i < num; i++) { 
                if(subArrT[i].parentNode) {
                     subArrT[i].parentNode.replaceChild(subArr[i], subArrT[i]);
                } 
            }
            if (func) this.callBack = func;
        },
        complete: function () {
            //check load hack, opera & chrome & safari will load twice for onece add body other is loaded
            if (this.loadHack && !dititnexus.asynformupload.isIE()) {
                this.loadHack = false;
                if (dititnexus.asynformupload.isFF()) setTimeout('dititnexus.asynformupload.complete()', 100);
                return;
            }

            var responseText = "";
            try {
                responseText = fn(this.hiddenIframe_).contentHtml.document.body.innerHTML;
            } catch (err) { }

            this.clearContext();
            if (this.callBack) this.callBack(responseText);
        },
        
        clearContext: function () {
            var node = document.getElementById( this.hiddenForm_)
            if(node) {
                  var pE = node.parentNode; 
                  if (pE) pE.removeChild(node); 
            }
            node = document.getElementById(this.hiddenIframe_)
             if(node) {
                  pE = node.parentNode; 
            if (pE) pE.removeChild(node); 
             }
        },
        callBack: null,
        loadHack: true
    };