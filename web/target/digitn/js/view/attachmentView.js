(function() {

    var mediaTypeToExt = {
        'IMAGE': ['art', 'bmp', 'gif', 'jfif', 'jpe', 'jpeg', 'jpg', 'pbm', 'png', 'pnm', 'ras', 'rgb', 'svg', 'tif', 'tiff', 'xbm', 'xpm', 'xpm'],
        'DOCUMENT': ['323', 'bas', 'doc', 'dot', 'pdf', 'pps', 'ppt', 'rtx', 'rtf', 'txt', 'xla', 'xlc', 'xlm', 'xls', 'xlt', 'xlw'],
        'VIDEO': ['asr', 'asf', 'asx', 'avi', 'avs', 'dv', 'lsf', 'lsx', 'mov', 'movie', 'mp2', 'mpa', 'mpe', 'mpeg', 'mpg', 'mpv2', 'qt'],
        'AUDIO': ['aif', 'aifc', 'aiff', 'au', 'm3u', 'mid', 'mp3', 'ra', 'ram', 'rmi', 'snd', 'wav'],
        'APK': ['apk']
    }

    window.getExtensionByMedia = function(mediaType) {
        if (mediaTypeToExt.hasOwnProperty(mediaType)) {
            return mediaTypeToExt[mediaType];
        }
        return null;
    }

})();
window.AttachmentSelectorView = Backbone.View.extend({
    tagName: "span",
    className: "toolbar-button",

    events: {
        'click': 'showUploader'
    },

    initialize: function() {
        this.editView = this.options.editView;
        var articleMeta = this.editView.options.articleEditMeta;
        this.articleName = articleMeta.name;
        this.articleIdPropertyName = articleMeta.idField.name;
        
        this.fieldId=this.options.fieldId;

        var fieldMetaData = this.options.fieldMetaData;
        this.attachmentFieldName = fieldMetaData.name;
        this.allowMultipleAttachments = fieldMetaData.allowMultipleAttachments;
        this.attachmentFormId = 'attach_' + this.editView.id + '_' + this.attachmentFieldName;
        this.attachmentTypes = fieldMetaData.attachmentType;
        this.readOnly = this.options.readOnly ? this.options.readOnly : false;
    },

    render: function() {
        this.$el.append("<img border='0' class='article_selector'>");
        this.attachmentView = new AttachmentView({
            formId: this.attachmentFormId,
            baseUrl: this.getAttachmentBaseUrl(),
            fieldId:this.fieldId,
            allowMultipleAttachments: this.allowMultipleAttachments,
            attachmentTypes: this.attachmentTypes,
            readOnly: this.readOnly
        });
        this.$el.after(this.attachmentView.render().el);
        return this;
    },

    getAttachmentBaseUrl: function() {
        return 'rest/edit/attachment/' + this.articleName + '?fieldName=' + this.attachmentFieldName + '&id=';
    },

    showUploader: function() {
        //Pass current article id
        this.attachmentView.showDialog(this.editView.model.get(this.articleIdPropertyName));
    }
});

window.AttachmentView = Backbone.View.extend({
    initialize: function() {
        this.$el.attr('style', 'width:auto;height;auto');
        this.formId = this.options.formId;
        this.baseUrl = this.options.baseUrl;
        this.fieldId=this.options.fieldId;
       
        //Values for template
        this.templateData = {
            formId: this.formId,
            action: '',
            labels: {
                add: label_add_files,
                start: label_start,
                cancel: label_cancel,
                deleteFile: label_delete
            }
        };

        this.errorMap = {
            maxFileSize: error_maxFileSize,
            minFileSize: error_minFileSize,
            acceptFileTypes: error_acceptFileTypes,
            maxNumberOfFiles: error_maxNumberOfFiles,
            uploadedBytes: error_uploadedBytes,
            emptyResult: error_emptyResult
        };

        var self = this;
        this.uploadOptions = {
            sequentialUploads: true,
            uploadTemplateId: null,
            downloadTemplateId: null,
            allowMultipleAttachments: this.options.allowMultipleAttachments,
            uploadTemplate: function(o) {
                var rows = $();
                $.each(o.files, function(index, file) {
                    var row = $('<tr class="template-upload fade">' + '<td class="name"></td>' + '<td class="size"></td>' + (file.error ? '<td class="error" colspan="2"></td>' : '<td><div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' + '<div class="bar" style="width:0%;"></div></div></td>' + '<td class="start"><button class="btn btn-primary"><i class="icon-upload icon-white"></i>' + label_start + '</button></td>') + '<td class="cancel"><button class="btn btn-warning"><i class="icon-ban-circle icon-white"></i>' + label_cancel + '</button></td></tr>');
                    row.find('.name').text(file.name); 
                    
                  
                    row.find('.size').text(o.formatFileSize(file.size));
                    if (file.error) {
                        row.find('.error').text(self.errorMap[file.error] || file.error);
                    }
                    rows = rows.add(row);
                });
                return rows;
            },

            downloadTemplate: function(o) {
                //Clean download template if it is not multiple file upload
                if (!o.options.allowMultipleAttachments) {
                    $(self.attachmentForm.find('.template-download ')).remove();
                }

                var rows = $();
                $.each(o.files, function(index, file) {
                    //No need to show delete and checkbox if it is readOnly scenario
                    var deleteHtml='';
                    if(!self.options.readOnly){
                       deleteHtml='<td class="delete"><button class="btn btn-danger"><i class="icon-trash icon-white"></i>' + label_delete + '</button> ' + '<input type="checkbox" name="delete" value="1"></td>'; 
                    }
                    var row = $('<tr class="template-download fade">' + (file.error ? '<td></td><td class="name"></td>' + '<td class="size"></td><td class="error" colspan="2"></td>' : '<td class="name"><a></a></td>' + '<td class="size"></td><td colspan="2"></td>') + deleteHtml+'</tr>');
                    row.find('.size').text(o.formatFileSize(parseInt(file.size)));
                    if (file.error) {
                        row.find('.name').text(file.name);
                        row.find('.error').text(self.errorMap[file.error] || file.error);
                    } else {
                        row.find('.name a').text(file.name);
                        $("#"+self.fieldId).val(file.id);
                        $("#"+self.fieldId).change();
                        if (file.thumbnail_url) {
                            row.find('.preview').append('<a><img></a>').find('img').prop('src', file.thumbnail_url);
                            row.find('a').prop('rel', 'gallery');
                        }
                        row.find('a').prop('href', file.url);
                        row.find('.delete button').attr('data-type', file.delete_type).attr('data-url', file.delete_url);
                    }
                    rows = rows.add(row);
                });
                return rows;
            }
        };

        var acceptFileTypesRegex = '';
        if (this.options.attachmentTypes.length > 0) {
            for (var i = 0; i < this.options.attachmentTypes.length; i++) {
                var attachmentType = this.options.attachmentTypes[i];
                if (attachmentType == 'ANY') {
                    break;
                }

                var fileExtByMedia = getExtensionByMedia(attachmentType);
                if (fileExtByMedia && fileExtByMedia.length > 0) {
                    if (!fileExtByMedia) {
                        fileExtByMedia += '|';
                    }
                    acceptFileTypesRegex += fileExtByMedia.join('|');
                }
            }

            if (acceptFileTypesRegex) {
                acceptFileTypesRegex = '(' + acceptFileTypesRegex + ')';
                this.uploadOptions.acceptFileTypes = new RegExp('(\\.|\\/)' + acceptFileTypesRegex + '$', 'i');
            }
        }

    },

    render: function() {
        this.$el.dialog({
            autoOpen: false,
            modal: true,
            resizable: true,
            width: 'auto'
        });

        return this;
    },

    showDialog: function(articleId) {

        this.templateData.action = this.baseUrl + articleId;
        if (this.attachmentForm) {
            //Clean up form for another article
            this.attachmentForm.fileupload('destroy');
        }

        this.$el.empty();
        this.attachmentForm = ich.attachmentForm(this.templateData);
        this.$el.append(this.attachmentForm);
        if (!this.allowMultipleAttachments) {
            $(this.attachmentForm.find('input[name="file"]')[0]).removeAttr('multiple');
        }
        this.uploadify();

        this.loadExistingFiles();

        this.$el.dialog("open");
    },

    loadExistingFiles: function() {
        var self = this;
        this.attachmentForm.each(function() {
            var that = this;
            //Hacked form action url to get attachment 'get url'
            $.getJSON(this.action.replace("edit/attachment/", "attachment/detail/"), function(result) {
                if (result && result.length) {
                    $(that).fileupload('option', 'done').call(that, null, {
                        result: result
                    });
                }
                
                //Buttons are generated after loading files. So handling read only scenario here
                if (self.options.readOnly) {
                    self.attachmentForm.find('.ui-button').hide();
                    self.attachmentForm.find('input[type=checkbox]').hide();
                }
            });
        });
    },

    uploadify: function() {
        this.attachmentForm.fileupload(this.uploadOptions);

        var self = this;
        this.attachmentForm.bind('fileuploadstarted', function(e, data) {
            self.attachmentForm.find('.btn-warning').hide();
        }).bind('fileuploadcompleted', function(e, data) {
            //We will be here when loading existing files or file upload is complete.
            //In case of readOnly cancel button should always be hidden
            if(!self.options.readOnly){
               self.attachmentForm.find('.btn-warning').show();
            }
        }).bind('fileuploadfailed', function(e, data) {
            self.attachmentForm.find('.btn-warning').show();
        });
    }
});