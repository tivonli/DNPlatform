/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */

(function($) {

 	var menu, shadow, trigger, content, hash, currentTarget;
  var defaults = {
    menuStyleName:'dropdownMenu1',
    itemStyleName:'dropdownMenu1_item',
    itemHoverStyleName:'dropdownMenu1_item_hover',
    eventPosX: 'pageX',
    eventPosY: 'pageY',
    shadow : true,
    onContextMenu: null,
    onClick: null,
    onShowMenu: null
 	};

  $.fn.contextMenu = function(id, options) {
    if (!menu) {                                      // Create singleton menu
      menu = $('<div id="jqContextMenu"></div>')
               .hide()
               .css({position:'absolute', zIndex:'500'})
               .appendTo('body');
      			//binding the click forbin event
               //.bind('click', function(e) {
               //  e.stopPropagation();
               //});
    }
    if (!shadow) {
      shadow = $('<div></div>')
                 .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                 .appendTo('body')
                 .hide();
    }
    hash = hash || [];
    hash.push({
      id : id,
      menuStyleName: defaults.menuStyleName != null ? defaults.menuStyleName : options.menuStyleName,
      itemStyleName: defaults.itemStyleName != null ? defaults.itemStyleName : options.itemStyleName,
      itemHoverStyleName: defaults.itemHoverStyleName != null ? defaults.itemHoverStyleName : options.itemHoverStyleName,
      bindings: options.bindings || {},
      shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
      onContextMenu: options.onContextMenu || defaults.onContextMenu,
      onClick: options.onClick || defaults.onClick,
      onShowMenu: options.onShowMenu || defaults.onShowMenu,
      eventPosX: options.eventPosX || defaults.eventPosX,
      eventPosY: options.eventPosY || defaults.eventPosY
    });

    var index = hash.length - 1;
    $(this).bind('click',function(e){
    	var bShowClick = (!!hash[index].onClick) ? hash[index].onClick(e) : true;
    	if(bShowClick){
    		display(index, this, e, options);
    	}
    	return false;
    });
    $(this).bind('contextmenu', function(e) {
      // Check if onContextMenu() defined
      var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
      if (bShowContext) display(index, this, e, options);
      return false;
    });
    return this;
  };

  function display(index, trigger, e, options) {
    var cur = hash[index];
    content = $('#'+cur.id).find('ul:first').clone(true);
    content.attr('class', cur.menuStyleName.toString()).find('li').attr('class', cur.itemStyleName.toString()).hover(
    	function() {
        $(this).attr('class', cur.itemHoverStyleName.toString());
      },
      function(){
        $(this).attr('class', cur.itemStyleName.toString());
      }	
    ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});
    
    // Send the content to the menu
    menu.html(content);

    // if there's an onShowMenu, run it now -- must run after content has been added
		// if you try to alter the content variable before the menu.html(), IE6 has issues
		// updating the content
    if (!!cur.onShowMenu) menu = cur.onShowMenu(e, menu);

    $.each(cur.bindings, function(id, func) {
      $('#'+id, menu).bind('click', function(e) {
        hide();
        func(trigger, currentTarget);
      });
    });
    //here is let the menu panel can display under the bottom.(fixed position)
    //menu.css({'left':e[cur.eventPosX],'top':e[cur.eventPosY]}).show();
    var menuLeft = parseInt(e.currentTarget.offsetLeft);
    var menuTop = parseInt(e.currentTarget.offsetTop + e.currentTarget.offsetHeight);
    menu.css({'left':menuLeft,'top':menuTop}).show();
    //if (cur.shadow) shadow.css({width:menu.width(),height:menu.height(),left:e.pageX+2,top:e.pageY+2}).show();
    if (cur.shadow) shadow.css({width:menu.width(),height:menu.height(),left:menuLeft,top:menuTop}).show();
    $(document).one('click', hide);
  }

  function hide() {
    menu.hide();
    shadow.hide();
  }

  // Apply defaults
  $.contextMenu = {
    defaults : function(userDefaults) {
      $.each(userDefaults, function(i, val) {
        if (typeof val == 'object' && defaults[i]) {
          $.extend(defaults[i], val);
        }
        else defaults[i] = val;
      });
    }
  };

})(jQuery);

$(function() {
  $('div.contextMenu').hide();
});