window.viewCreator = new Backbone.View;
//Used to for dom id generation
window.uniqueID = function() {
        var id = 1; // initial value
        return function() {
            return id++;
        }; // NOTE: return value is a function reference
    }();

var AppView = Backbone.View.extend({

    buttonBlocker: {
        buttons: new Array(),
        /*Pass jQuery wrapped dom element  */
        block: function(button) {
            button.addClass('gray');
            this.buttons.push(button);
        },

        unblock: function() {
            if (this.buttons.length > 0) {
            	//remove all lock buttons
            	for(var i=0;i<this.buttons.length;i++){
            		this.buttons.pop().removeClass('gray');
            	}
            }
        }

    },

    initialize: function() {
        this.initializeSprinner();
        this.tabs = new Tabs();
        this.initializeI18N();
        //Set date and time defaults
        var currentLocale = CookieUtil.currentLocale;
        var locale = currentLocale.replace(/\_/g, '-');
        // locale formatted as language-country, if exit in js array, set as default, if not, try language part only
        // if also doesn't exit, use default datepicker
        if ($.datepicker.regional[locale]) {
            $.datepicker.setDefaults($.datepicker.regional[locale]);
            $.timepicker.setDefaults($.timepicker.regional[locale]);
        } else {
            var lan = locale.substring(0, locale.indexOf('-'));
            if ($.datepicker.regional[lan]) {
                $.datepicker.setDefaults($.datepicker.regional[lan]);
                $.timepicker.setDefaults($.timepicker.regional[lan]);
            }
        }

        this.mainJqueryObj = $(".web");

        //Allow applications to listen to platform events
        if (typeof registerPlatformListeners !== 'undefined') {
            registerPlatformListeners(this.mainJqueryObj);
        }


    },

    initializeSprinner: function() {
        $(document).ajaxStart(function() {
//            $.blockUI({
//                message: '<h1><img src="images/default/main/Spinner.gif" />' + label_wait + '</h1>',
//                css: {
//                    border: 'none',
//                    padding: '15px',
//                    backgroundColor: '#000',
//                    '-webkit-border-radius': '10px',
//                    '-moz-border-radius': '10px',
//                    opacity: .5,
//                    color: '#fff'
//                }
//            });

        }).ajaxStop(function() {
        	//release block buttons
        	appView.buttonBlocker.unblock();
           // $.unblockUI();
        });

    },

    /*
     *To overide any plugin i18n
     */
    initializeI18N: function() {
        $.i18n.extendValidatePluginMessages();

        $.extend($.ui.multiselect, {
            locale: {
                addAll: label_add_all,
                removeAll: label_remove_all,
                itemsCount: label_items_selected
            }
        });
    },

    render: function() {
        this.tabs.fetch({

            success: function(data) {

                new TabsView({
                    model: data.toJSON()
                }).render();
                //init the user profile some information.
                if(UserProfile){
                	UserProfile.init();
                }
                //init the util menu
                digitnexus.util.initMenu();
                //init the simulator
                digitnexus.simulator.init();
            }
        });
    },

    adjustPortalLayout: function() {
        //height of the toolbar and other components of the browser
        var unusableHeight = digitnexus.unusableHeight;
        //if the unusable height is more than 180 then we might end up in too small viewport. so we adjust this
        //to 180 then. 180 is a random number that I derived at by trial and error
        if (unusableHeight > 180) {
            unusableHeight = 180;
        }
        //so effective size of the screen..
        var portalHeight = digitnexus.screenHeight - unusableHeight;
        var heightOfTopContent = $(".top_content").height();
        var heightOfBottomContent = $(".bottom_content").height();
        var heightOfTopMenu = $("#tab_menu").height();
        $(".web").height(portalHeight - heightOfBottomContent);
        //this is - 4 mean the class .ui-tabs-panel div was be contain with the tab_content div.. so ..
        //4px is the GAP's height between the .ui-tabs-panel div and the #tab_content div
        $("#tab_content").children().height(portalHeight - heightOfTopContent - heightOfBottomContent - heightOfTopMenu - 4);

        //set the web and bottom content's width , can support resize the window size..etc
        $(".web").width(digitnexus.screenWidth);
        $(".bottom_content").width(digitnexus.screenWidth);
    },

    triggerEvent: function(event) {
        this.mainJqueryObj.trigger(event);
    }

});

AppView._showErrors = function(response) {
    var notyText = '';
    try {
        var errors = eval('(' + response.responseText + ')');
        var validationError = {};
        for (var fieldName in errors) {
            if (fieldName === 'all') {
                notyText = errors[fieldName].join("\n");
            }
        }
    } catch (e) {
        notyText = response.statusText;
    }

    if (notyText !== '') {
        noty({
            "text": notyText,
            "layout": "top",
            "type": "error",
            "animateOpen": {
                "height": "toggle"
            },
            "animateClose": {
                "height": "toggle"
            },
            "speed": 500,
            "timeout": 5000,
            "closeButton": true,
            "closeOnSelfClick": true,
            "closeOnSelfOver": false
        });
    }
};

//Refer http://needim.github.com/noty/#creator for message type
AppView._showMessage = function(message, messageType) {
    noty({
        "text": message,
        "layout": "top",
        "type": messageType,
        "animateOpen": {
            "height": "toggle"
        },
        "animateClose": {
            "height": "toggle"
        },
        "speed": 500,
        "timeout": 5000,
        "closeButton": true,
        "closeOnSelfClick": true,
        "closeOnSelfOver": false
    });
};


/**
 *Factory to to get template el element
 */

window.TemplateFactory = {
    make: function(templateName, data) {
        return ich[templateName](data ? data : {});
    }
};


//Optional parameter includeMargin is used when calculating outer dimensions
(function($) {
$.fn.getHiddenDimensions = function(includeMargin) {
    var $item = this,
        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
        dim = { width:0, height:0, innerWidth: 0, innerHeight: 0,outerWidth: 0,outerHeight: 0 },
        $hiddenParents = $item.parents().andSelf().not(':visible'),
        includeMargin = (includeMargin == null)? false : includeMargin;

    var oldProps = [];
    $hiddenParents.each(function() {
        var old = {};

        for ( var name in props ) {
            old[ name ] = this.style[ name ];
            this.style[ name ] = props[ name ];
        }

        oldProps.push(old);
    });

    dim.width = $item.width();
    dim.outerWidth = $item.outerWidth(includeMargin);
    dim.innerWidth = $item.innerWidth();
    dim.height = $item.height();
    dim.innerHeight = $item.innerHeight();
    dim.outerHeight = $item.outerHeight(includeMargin);

    $hiddenParents.each(function(i) {
        var old = oldProps[i];
        for ( var name in props ) {
            this.style[ name ] = old[ name ];
        }
    });

    return dim;
}
}(jQuery));

// Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

 // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };