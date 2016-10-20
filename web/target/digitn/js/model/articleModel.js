function MetaModel(baseUrl) {
    this.baseUrl = baseUrl;

    this.cache = {};

    this.getMeta = function(articleName) {
        var meta = this.cache[articleName];
        if (!meta) {
            var self=this;
            digitnexus.syncGet(baseUrl+articleName, null, function(response) {
                self.cache[articleName] = response;
                meta=response;
                return;
            }, function(xhr, status, exception) {
                AppView._showErrors(xhr);
            });
        }
        
        return meta;
    };
    
    this.getMetaWidthParentArticle = function(propertyName,parentArticleName){
    	var meta = this.cache[propertyName+"_"+parentArticleName];
    	if(!meta){
    		var self = this;
    		digitnexus.syncGet(baseUrl+propertyName+"?parentArticleName="+parentArticleName, null, function(response) {
                self.cache[propertyName+"_"+parentArticleName] = response;
                meta=response;
                return;
            }, function(xhr, status, exception) {
                AppView._showErrors(xhr);
            });
    	}
    	return meta;
    };

}


var ArticleListMeta=new MetaModel('/article/list/meta/');

var ArticleEditMeta=new MetaModel('/article/edit/meta/');

var ArticleSearchMeta=new MetaModel('/article/search/meta/');

window.ArticleSearchModel = Backbone.Model.extend({});

window.ArticleData = Backbone.DeepModel.extend({
    urlRoot: './article/edit/data',

    initialize: function(attributes, options) {
        if (options) {
            this.remark = options.remark;
            if (options.add) {
                this.add = options.add;
            }
        }
    },

    url: function() {
        if (this.remark) {
            return this.urlRoot + '/' + this.remark;
        } else {
            return this.urlRoot + '/' + this.id;
        }
    },

    isNew: function() {
        return (this.add !== undefined && this.add) || this.id === undefined || this.id === null;
    }
});