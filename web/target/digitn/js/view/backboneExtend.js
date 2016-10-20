/**
 *Adding static methods to backbone views to add static methods for registering custom views, post render listeners
 *
 */

(function(Backbone) {
    var DigitNexusView = {
        
        extend: function(protoProps, classProps) {
            var view = Backbone.View.extend(protoProps, classProps);

            view.rendererRegistry = {};

            view.registerRenderer = function(key, renderer) {
                this.rendererRegistry[key] = renderer;
            };

            /**
             * 
             * parentView: Parent backbone view
             * options:options that should be passed to constructor
             * el: dom element on which other elements should be added
             * return null if there is no view registered
             */
            view.getView = function(key, options, parentView) {
                var renderer = this.rendererRegistry[key];
                if (renderer) {
                    if (parentView) {
                        return renderer.call(parentView, options);
                    } else {
                        return renderer.call(null, options);
                    }

                }
                return null
            }
            return view;
        }
    };

    Backbone.DigitNexusView = DigitNexusView;
 })(Backbone);