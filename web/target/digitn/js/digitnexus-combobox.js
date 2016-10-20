(function( $ ) {
		$.widget( "ui.combobox", {
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";
				var input = this.input = $( "<input id='ac_"+select.attr("id")+"' name='ac_"+select.attr("id")+"'>" )
					.insertAfter( select )
					.val( value )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                            response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) ){
                                   return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
                                }
							}) );
                            self.adjustPosition(self.input,select);
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
                            // configuration and callback function need to be provided
                            if(self.options.config && self.options.config.fnSelectCallback){
                                self.options.config.fnSelectCallback(self.options.config.metaData,self.options.config.properties,$(ui.item.option).val());
                            }
							self._trigger( "selected", event, {
								item: ui.item.option

							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
                                    var value =$(select).data("originalValue") != undefined ?  $(select).data("originalValue") :"";
                                    select.val( value );
                                    $( this ).val( select.children( ":selected" ).text() );
									input.data( "autocomplete" ).term = "";
									return false;
								}
							}
						}
					}).addClass( "ui-widget ui-widget-content ui-corner-left" );

				input.data( "autocomplete" )._renderItem = function( ul, item ) {
                    $(ul).attr('id',   'ul_' + select.attr("id"));
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button type='button'>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function(e) {
						// close if already visible
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}
                        $( this ).blur();

						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
						input.focus();
					});
			},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			},
            adjustPosition:function(inputObj,select){
                var autoComplete = $('#ul_'+ select.attr("id"));
                var offset = autoComplete.offset(),
                        heightMenu = autoComplete.outerHeight();
                var spaceAbove = undefined, spaceBelow = undefined;

                if (offset.top + heightMenu > window.innerHeight) {
                    // not enough room below component; check if above is better
                    spaceBelow = window.innerHeight - offset.top;
                    spaceAbove = inputObj.offset().top;

                    if (spaceAbove > spaceBelow) {
                        autoComplete.css('top', (spaceAbove - heightMenu) + 'px');
                    }
                }
            }
		});
	})( jQuery );
