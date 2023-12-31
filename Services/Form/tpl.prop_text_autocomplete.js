il.Util.addOnLoad(

	function() {

		$.widget( "custom.iladvancedautocomplete", $.ui.autocomplete, {
			more: false,
			_renderMenu: function(ul, items) {
				var that = this;
				$.each(items, function(index, item) {
					that._renderItemData(ul, item);
				});

				that.options.requestUrl = that.options.requestUrl.replace(/&fetchall=1/g, '');

				if (that.more) {
					ul.append("<li class='ui-menu-category ui-menu-more ui-state-disabled'><span>&raquo;{MORE_TXT}</span></li>");
					ul.find('li').last().on('click', function(e) {
						that.options.requestUrl += '&fetchall=1';
						that.close(e);
						that.search(null, e);
						e.preventDefault();
					});
				}
			}
		});

		<!-- BEGIN ac_multi -->ilMultiFormValues.addAutocomplete('{ID_AUTOCOMPLETE}', '{MURL_AUTOCOMPLETE}');<!-- END ac_multi -->

		<!-- BEGIN autocomplete_bl -->
		$('{SEL_AUTOCOMPLETE}').iladvancedautocomplete({
			requestUrl: "{URL_AUTOCOMPLETE}",
			source: function( request, response ) {
				var that = this;
				$.getJSON( that.options.requestUrl, {
					term: request.term
				}, function(data) {
					if (typeof data.items == "undefined") {
						response(data);
					} else {
						that.more = data.hasMoreResults;
						response(data.items);
					}
				});
			},
			minLength: 3
		});
		<!-- END autocomplete_bl -->

		<!-- BEGIN autocomplete_delimiter_bl -->
		function split( val ) {
			if(val !== undefined) {
				return val.split( /{AUTOCOMPLETE_DELIMITER}\s*/ );
			}
		}

		function extractLast( term ) {
			return split( term ).pop();
		}

		$('{SEL_AUTOCOMPLETE_DELIMITER}').iladvancedautocomplete({
			requestUrl: "{URL_AUTOCOMPLETE_DELIMITER}",
			source: function( request, response ) {
				var that = this;
				$.getJSON( that.options.requestUrl, {
					term: extractLast( request.term )
				}, function(data) {
					that.more = data.hasMoreResults;
					response(data.items);
				});
			},
			search: function() {
				// custom minLength
				var term = extractLast( this.value );
				if ( term.length < 3 ) {
					return false;
				}
			},
			focus: function() {
				// prevent value inserted on focus
				return false;
			},
			select: function( event, ui ) {
				var terms = split( this.value );
				// remove the current input
				terms.pop();
				// add the selected item
				terms.push( ui.item.value );
				// add placeholder to get the comma-and-space at the end
				terms.push( "" );
				this.value = terms.join( "{AUTOCOMPLETE_DELIMITER} " );
				return false;
			}
		});
		// don't navigate away from the field on tab when selecting an item
		$('{SEL_AUTOCOMPLETE_DELIMITER}').bind( "keydown", function( event ) {
			if ( event.keyCode === $.ui.keyCode.TAB &&
				$( this ).iladvancedautocomplete("widget").is(':visible') ) {
					event.preventDefault();
			}
		});
		<!-- END autocomplete_delimiter_bl -->
		<!-- BEGIN autocomplete_autosubmit -->
		$('{SEL_AUTOCOMPLETE_AUTOSUBMIT}').iladvancedautocomplete({
			requestUrl: "{URL_AUTOCOMPLETE_AUTOSUBMIT_REQ}",
			source: function( request, response ) {
				var that = this;
				$.getJSON( that.options.requestUrl, {
					term: request.term
				}, function(data) {
					if (typeof data.items == "undefined") {
						response(data);
					} else {
						that.more = data.hasMoreResults;
						response(data.items);
					}
				});
			},
			search: function() {
				// custom minLength
				var term = this.value;
				if ( term.length < 3 ) {
					return false;
				}
			},
			select: function( event, ui ) {
			
				var submitUrl =  "{URL_AUTOCOMPLETE_AUTOSUBMIT_RESP}";
				
				submitUrl += "&selected_id=";
				submitUrl += ui.item.id.toString();
				
				$(location).attr('href',submitUrl);
			}
		});
		<!-- END autocomplete_autosubmit -->
		
	}
);	
