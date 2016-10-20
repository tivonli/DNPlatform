
digitnexus = digitnexus || {};
digitnexus.editor = digitnexus.editor || {};
      
    digitnexus.editor.EditorSettingValue =  function(name,value,type){
        this.name = name == null? null: name;
        this.value =  value == null? null: value;
        this.type = type == null? 'string': type;
    }
     digitnexus.editor.EditorSettingValue.prototype.copyFrom =  function(src){
          this.value = src.value;
          /*
          this.name = src.name;
          this.type = src.type;
          this.defaultValue = src.defaultValue;
          this.availableValue = src.availableValue;
          this.uiType = src.uiType;
          this.validators = src.validators;
          this.jsValidators = src.jsValidators;
          this.trigger = src.trigger; 
          this.readOnly = src.readOnly;
          */
     }
     digitnexus.editor.EditorSettingValue.prototype.equals =  function(sv){
         if(null == sv) {
             return false;
         }
         if(typeof(sv.name) == 'undefined' || sv.name == null) {
             return false;
         }
         return sv.name.trim() === this.name;
     }
     
      digitnexus.editor.EditorSettingValue.prototype.toString =  function(sv){
          return 'name: ' + this.name + ',valeue: ' + this.value + ',type: ' + this.type;
      }
     
     digitnexus.editor.UserProfile =  function()  {
        this.module;
	this.type;
	this.userName;
	this.id;     
        this.settings = new digitnexus.utils.HashMap();
        this.listeners = new digitnexus.utils.HashMap();        
        //this.settings.put(digitnexus.editor.Constants.SETTING_DEFAULT_MODULE, new digitnexus.utils.Set())
    }
   
     digitnexus.editor.UserProfile.prototype.getListenerList = function(name) {
         if(null == name || ''== name) {
             console.log('lintener name cannot be NULL');
             return ;
         }
         this.listeners.get(name);   
     }
     
      digitnexus.editor.UserProfile.prototype.addListener = function(name,func) {
        if(!_check(name,func)) {
            return;
        }
        var lis = this.getListenerList(name);
        if(lis == null) {
            lis = new digitnexus.utils.List();
            this.listeners.put(name,lis);
        }       
        this.lis.add(func);
     }
      digitnexus.editor.UserProfile.prototype.removeListener = function(name,func) {
         if(null == name || ''== name) {
            return;
         }
        var lis = this.getListenerList(name);
        if(lis == null) {
           console.log('listener list is NULL for name:  '+ name);
           return;
        }     
        this.lis.remove(func);
      }
      digitnexus.editor.UserProfile.prototype._check = function(name,func) {
         if(null == name) {
             console.log('lintener name cannot be NULL');
             return false;
         }
          if(null == func) {
             console.log('lintener function name cannot be NULL');
             return false;
         }
         if(typeof(func) != 'function') {
             console.log('lintener not a Function instance');
             return false;
         }
         return true;   
     }
    digitnexus.editor.UserProfile.prototype._onChange = function(newNameValue,oldNameValue) {
        var listeners = this.getListenerList(newNameValue.name);
        if(listeners == null || listeners.size() < 1) {
            return;
        }
        var size =  listeners.size();
        for(var index = 0 ; index < size; index++) {
            var func = listeners.get(index);
            if(func == null) {
                continue;
            }
            func(newNameValue,oldNameValue);
        }
    }
    digitnexus.editor.UserProfile.prototype.getModelNameList = function() {
         return this.settings.keySet();  
     }
      digitnexus.editor.UserProfile.prototype.getModelList = function(moduleName) {
         if(null == moduleName || '' === moduleName.trim()) {
              moduleName = digitnexus.editor.Constants.SETTING_DEFAULT_MODULE;
         }
         return this.settings.get(moduleName.trim());
      }
    digitnexus.editor.UserProfile.prototype.get = function(moduleName,valueName) {
         if(null == valueName) {
             return null;
         }
         var list = this.getModelList(moduleName.trim());
         if(list == null) {
             return null;
         }
         var size = list.size();
         if(size < 1) {
             return null;
         }
         var value = null;
         valueName = valueName.trim();
         for(var index = 0; index < size; index++) {
             var nv = list.get(index);
             if(null == nv) {
                 continue;
             }
             if(valueName == nv.name) {
                 value = nv;
                 break;
             }
         }
         return value;
    }
    
    digitnexus.editor.UserProfile.prototype.put = function(moduleName,settingNameValue) {
         if(null == settingNameValue || moduleName == null) {
             return;
         }
         moduleName = moduleName.trim();
          var settings =  this.getModelList(moduleName);
          if(null == settings) {
               settings =  new digitnexus.utils.Set();
               this.settings.put(moduleName,settings);
          }
          
          var oldValue = this.get(moduleName,settingNameValue.name);// settings.get(settingNameValue);
          if(oldValue != null && oldValue.value === settingNameValue.value) {
              return;
          }
          var clone = oldValue == null? null: mxUtils.clone(oldValue)
          if(null == oldValue) {
             settings.add(settingNameValue);
          }else {
              oldValue.copyFrom(settingNameValue);
          }
          digitnexus.editor.me.preferenceManager.saveUserProfile();
          this._onChange(settingNameValue,clone);
    }
     digitnexus.editor.UserProfile.prototype.remove = function(nameValue,moduleName) {
         if(null == moduleName || null == nameValue) {
             return;
         }
         var nv = this.get(moduleName,nameValue.name);
          if(null == nv) {
             return;
          }
          var list = getModelList(moduleName.trim());
          if(list == null) {
              return;
          }
          list.remove(nv);
          return;
    }
    
    digitnexus.editor.PreferenceManager = function() {
        this.userProfile = new digitnexus.editor.UserProfile();
    }
    
   digitnexus.editor.PreferenceManager.prototype.init = function() {
        
    }
    
    
    digitnexus.editor.PreferenceManager.prototype._getSettings = function(settings) {
             if(settings == null) {
                 return null;
             }
             var size = settings.size();
             if(size < 1) {
                 return null;
             }
             var keyset = settings.keySet();
             if(keyset == null) {
                 return null;
             }
              var ss = new Object();
             for(var index = 0; index < size; index++) {
                 var key = keyset.get(index);
                 if(null == key) {
                     continue;
                 }
                 var l = settings.get(key);
                 if(l == null) {
                     return;
                 }
                 ss[key] = l.data;
             }
             return ss;
         }
     digitnexus.editor.PreferenceManager.prototype.parseUserprofile = function(json) {
              if(json == null || json.trim() == '') {
                  console.log('fail to get user profile');
                  return null;
              }
              var up = eval('('+ json +')');
              var userProfile =  this.userProfile;
              userProfile.id = up.id;
              userProfile.username = up.username;
              userProfile.module = up.module;
              userProfile.type =up.type;
              var settings = up.settings;
              for(var index in settings){
                  if(index == null || settings[index] == null) {
                      continue;
                  }
                  var list = userProfile.get(index)
                  if(list == null) {
                      list = new digitnexus.utils.Set();
                      userProfile.settings.put(index,list);
                  }
                  var v = settings[index];
                  for(var i = 0 ; i < v.length; i++ ) {
                      if(v[i] == null) {
                          continue;
                      }
                      var value = new digitnexus.editor.EditorSettingValue();
                       value.name = v[i].name;
                       value.type = v[i].type;
                       value.value = v[i].value;
                       value.defaultValue = v[i].defaultValue;
                       value.availableValue = v[i].availableValue;
                       value.uiType = v[i].uiType;
                       value.validators = v[i].validators;
                       value.jsValidators = v[i].jsValidators;
                       value.trigger = v[i].trigger; 
                       value.readOnly = v[i].readOnly;
                       list.add(value);
                  }
              } 
              this._addUserProfile(userProfile);
         }
         digitnexus.editor.PreferenceManager.prototype._addUserProfile = function(userProfile) {
             var othersSettings = userProfile.settings.get(digitnexus.editor.Constants.USER_PROFILE_OTHERS);
              if(null == othersSettings) {
                   othersSettings = new digitnexus.utils.Set();
                   this.userProfile.settings.put(digitnexus.editor.Constants.USER_PROFILE_OTHERS,othersSettings);
              }
              var getNamedValue = function(name,othersSettings){
                  if(null == name || othersSettings == null || typeof(name) != 'string') {
                      return null;
                  }
                  name = name.trim();
                  var size = othersSettings.size();
                  for(var index = 0 ; index < size; index++) {
                      var value = othersSettings.get(index);
                      if(null == value) {
                          continue;
                      }
                      if(value.name == name) {
                          return value;
                      }
                  }
                  return null;
              }
               var value = getNamedValue('textBoxtvalue',othersSettings);
               if(null == value) {
                   var value = new digitnexus.editor.EditorSettingValue();
                    value.name = 'textBoxtvalue';
                    value.type = 'string';
                    value.value = 'test value';
                    value.defaultValue = 'test value';
                    value.availableValue = 'test value';
                    value.uiType = 'textarea';
                    value.validators = null;
                    value.jsValidators = null;
                    value.trigger = null; 
                    value.readOnly = false;
                   othersSettings.add(value);
               }    
     }
    
    digitnexus.editor.PreferenceManager.prototype.saveUserProfile = function() {   
            var listeners = this.userProfile.listeners;
            this.userProfile.listeners = null;
            var up = mxUtils.clone(this.userProfile);
            this.userProfile.listeners = listeners;
             
            up.settings = this._getSettings(up.settings);
            var jsonStr = JSON.stringify(up);
            if(null == jsonStr || jsonStr == '' ) {
           	    throw 'fail to convert mash-up info to json format';
            }
           
            var url = digitnexus.editor.utils.getUrl(digitnexus.editor.Constants.REQUEST_SAVE_USERPROFILE);
     	    if(url == null) {
     		  throw 'web context is null, Please set var WEB_CONTEXT first';
     	    }
            
            var request = new digitnexus.utils.HttpRequest(url, jsonStr, 'post', true);
                request.send(digitnexus.utils.bind(this, function (req) {
                }),
                digitnexus.utils.bind(this, function (req) {
                     mxUtils.alert('error: ' + req.toString());
                    throw req.toString();
                }));  
          }
