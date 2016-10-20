var asyn = {
            formSubmit: function (args, action, func) {
                this.clearContext();
                this.callBack = null;

　　　　　  this.loadHack = true;
                var subArr = [];
                var subArrT = [];
                if (b$.type.isArray(args)) {
                    subArr = args;
                } else {
                    var tag = args.tagName.toLowerCase();
                    if (tag == "form") { 
                        for (var i = 0, num = args.childNodes.length; i < num; i++) {
                            subArr.push(args.childNodes[i]);
                        } 
                    }else { 
                        subArr = [args]; }
                }
                //create asyn form and ifroma
                var objForm = document.createElement("form");
                objForm.action = action;
                objForm.target = "bBankAsynFormSubmit_iframe_1b";
                objForm.encoding = "multipart/form-data";
                objForm.method = "post";
                objForm.id = "bBankAsynFormSubmit_form_1b";
                objForm.style.display = "none";
                
                var objIframe = b$.parseDom('<iframe id="bBankAsynFormSubmit_iframe_1b" name="bBankAsynFormSubmit_iframe_1b" \n\
src="about:blank" style="display:none;" onload="asyn.complete()"></iframe>')[0];
                
                //add submit value in form
                for (var i = 0, num = subArr.length; i < num; i++) {
                    if (!subArr[i].name && subArr[i].nodeType == 1 && subArr[i].tagName.toLowerCase() == "input") 
                        subArr[i].name = "bBankAsynFormSubmit_input_1b_" + i;
                    var input = subArr[i].cloneNode(true);
                    subArrT.push(input);
                    subArr[i].parentNode.replaceChild(input, subArr[i]);
                    objForm.appendChild(subArr[i]);
                }
                //submit
                document.body.appendChild(objIframe);
                document.body.appendChild(objForm);
                objForm.submit();
                //dispose
                for (var i = 0, num = subArrT.length; i < num; i++) { 
                    subArrT[i].parentNode.replaceChild(subArr[i], subArrT[i]); 
                }
                if (func) this.callBack = func;
            },
            complete: function () {

　　　　if (this.loadHack && !b$.browser.isIE()) {
                this.loadHack = false;

　　　　　  if (b$.browser.isFF()) setTimeout('asyn.complete()', 100);
                return;
            }


                var responseText = "";
                try {
                    var objIframe = document.getElementById("bBankAsynFormSubmit_iframe_1b");
                    if (objIframe.contentWindow) { responseText = objIframe.contentWindow.document.body.innerHTML; }
                    else { responseText = objIframe.contentDocument.document.body.innerHTML; }
                } catch (err) { }

                this.clearContext();
                if (this.callBack) this.callBack(responseText);
            },
            clearContext: function () {
                if (b$('#bBankAsynFormSubmit_form_1b')) b$('#bBankAsynFormSubmit_form_1b').removeSelf();
                if (b$('#bBankAsynFormSubmit_iframe_1b')) b$('#bBankAsynFormSubmit_iframe_1b').removeSelf();
            },
            callBack: null,

　　　　loadHack: true
        };