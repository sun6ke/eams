/* ========================================================================
 * eams-ui 菜单
 * ======================================================================== */
+function ($) {
  'use strict';

  //
  // 首页Tab式浏览
  //-----------------------------------
  var $body = $("body");
  var tabCloseFont = 'fa fa-times-circle';
  var tabCloseClass = 'pull-right e-tab-close-icon';
  var tabAnchor = 'a[target]:not(.e-tab-close-icon)';
  var tabAnchorActive = 'a.active[target]:not(.e-tab-close-icon)';

  var $pageHeaderText = $('#e-op-area .e-page-header h2 span');
  var $iframeContainer = $('#e-op-area .e-op-area-iframe-container');
  var $tabCurrentClose = $('#e-home-tab-close-current');
  var $tabCloseAll = $('#e-home-tab-close-all');
  var iframeHomeName = "e-home-iframe";

  var $tabList = $('#e-home-tab-list');
  var $tabCount = $('#e-home-tab-count div');

  var iframeId = 0;

  var tabCount = 0;

  var $container = $("#e-top-menu");

  var tabClick = function($anchor) {

    /*
     * 变更 $pageHeader 标题
     * hide原来可见的iframe(如果将iframe移动到别的地方会发生reload)
     * show关联的iframe
     * 将tab item设为激活
     */
    var $span = $anchor.find('span');

    var iframeName = $anchor.attr('target');

    $iframeContainer.find('iframe').hide();
    $iframeContainer.find('iframe[name=' + iframeName + ']').show();

    if (iframeName === iframeHomeName) {
      $tabCurrentClose.hide();
    }else {
      $tabCurrentClose.show();
    }

    _setPageTitle($span.text())
    _activateTab($anchor);

    //更新top菜单
    $container.find("li.children").remove();
    $container.navigation('updateMenu', $container.find("a[target=" + iframeName +"]"));
    $container.navigation('disabledMenu', $container.find("a[target=" + iframeName +"]"));

    _scrollTop();
  }

  var _activateTab = function($anchor) {
    $tabList.find(tabAnchor).removeClass('active');
    $anchor.addClass('active');
  }

  var _setPageTitle = function(text) {
    $pageHeaderText.text(text);
  };

  var _scrollTop = function() {
    $body.scrollTop(0);
  }

  var _incrementTabCount = function() {
    tabCount++;
    $tabCount.text(tabCount);
    if (tabCount) {
      $tabCurrentClose.show();
    }
  }

  /*
   * 点击page标题叉叉后发生的事件
   *
   * 同[点击 tab item 的叉叉后发生的事件]
   */
  var pageClose = function() {
    tabClose($tabList.find(tabAnchorActive));
  }

  $tabCurrentClose.click(function(event) {
    event.preventDefault();
    pageClose();
  })

  /*
   * 关闭tab
   */
  var tabClose = function($closeAnchor) {
    /*
     * 删除page区域里的iframe
     * 删除#e-home-tab-list 区域里的条目
     * 显示下一个tab item
     * 更新tab数量
     */
    var $li = $closeAnchor.closest('li');
    var $anchor = $li.find(tabAnchor);


    if ($anchor.is('.active')) {
      var $nextTab = $li.next();
      if(!$nextTab.length) {
        $nextTab = $li.prev();
      }
      tabClick($nextTab.find(tabAnchor));
    }

    var iframeName = $anchor.attr('target');
    $iframeContainer.find('iframe[name=' + iframeName + ']').remove();
    $li.remove();

    _decrementTabCount();
  }

  var _decrementTabCount = function() {
    tabCount--;
    $tabCount.text(tabCount);
    if(tabCount == 0) {
      $tabCount.empty();
      $tabCurrentClose.hide();
    }
  }

  $tabCloseAll.click(function(event) {
    event.preventDefault();
    $tabList.find(tabAnchor).filter(':not(#e-home-tab-home)').parent().remove();
    $iframeContainer.find('iframe:not(#e-home-iframe)').remove();
    tabClick($tabList.find(tabAnchor));

    tabCount = 0;
    $tabCount.empty();
    $tabCurrentClose.hide();

  });

  $tabList.find('a:not([data-toggle])').click(function(event) {
    event.preventDefault();
    tabClick($(this));
  });

  $('a[data-open="tab-view"]').click(function(event) {
    event.preventDefault();
    $container.navigation('menuClick', $(this));
  });

  // Navigation CLASS DEFINITION
  // ======================

  var Navigation = function (element, options) {

    this.options = options;

    this.$container = $(element);

  }

  Navigation.VERSION = '0.0.1';


  Navigation.prototype.initMenu = function(menus, initParentId) {

    var $iframeHome = $iframeContainer.find('iframe[name=' + iframeHomeName + ']');
    var home_src = $iframeHome.attr("src");

    var $home_li = $("<li class='dropdown home dropdown-hover'></li>");
    var $home_a = $("<a></a>").addClass("dropdown-toggle")
      .attr("role", "button").attr("data-toggle", "dropdown")
      .attr("aria-haspopup", true).attr("aria-expanded", false)
      .attr("href", "#");

    var $home_ul = $("<ul></ul>").addClass("dropdown-menu").attr('aria-labelledby', 'drop_0');

    function getMenus(parentID) {
      return menus.filter(function(node){
        return ( node.parentId === parentID ) ;
      }).map(function(node){
        var exists = menus.some(function(childNode){
          return childNode.parentId === node.id;
        });

        var $ul = $("<ul></ul>").addClass("dropdown-menu").attr('aria-labelledby', "drop_" + node.id);
        var subMenu = (exists) ? $ul.append(getMenus(node.id)) : "";
        var $li = $("<li></li>");
        var $a = $("<a></a>");
        $a.attr("id", "drop_" + node.id);
        $a.attr("href", node.href);
        $a.text(node.title);

        //如果是home页面设置target为e-home-iframe
        if (node.href === home_src) {
          $a.attr("target", "e-home-iframe");
          $home_a.text(node.title);
        }
        if (node.parentId) {
          $a.attr("parentId", "drop_" + node.parentId);
        }
        $a.attr('appendDivider', node.appendDivider);
        if (subMenu != "") {
          $li.addClass("dropdown-submenu");
        }
        return $li.append($a).append(subMenu);
      });
    }

    var allMenus =getMenus(initParentId);
    if (allMenus && allMenus.length != 0) {
      $.each(allMenus, function(i, menu) {
        $home_ul.append(menu);
      });
      $home_li.append($home_a.append("<span class='caret'></span>")).append($home_ul);
      $home_li.find("[appendDivider=true]").each(function() {
        $(this).closest('li').after("<li class='divider'></li>");
      });
      this.$container.append($home_li);
    }
  }

  Navigation.prototype.updateMenu = function($anchor) {
    var drop_parentId = $anchor.attr("parentId");

    var $menu_list = this.$container.find("ul[aria-labelledby='" + drop_parentId + "']").removeAttr("style");
    if ($menu_list.length != 0) {
      var $new_li = $("<li></li>").addClass("dropdown children dropdown-hover");
      var $new_a = $("<a></a>").addClass("dropdown-toggle")
        .attr("role", "button").attr("data-toggle", "dropdown")
        .attr("aria-haspopup", true).attr("aria-expanded", false)
        .text($anchor.text());

      $new_li.append($new_a)

      if ($menu_list.find("li").length > 1) {
        $new_a.append("<span class='caret'></span>");
        $new_li.append($menu_list.clone(true));
      }

      this.$container.find("li:first").after($new_li);


      //查找上一级菜单
      var $parent_anchor = this.$container.find("a[id='"+drop_parentId+"']");
      this.updateMenu($parent_anchor);
    } else {
      this.$container.find("li a:first").text($anchor.text()).append("<span class='caret'></span>");
    }

    $(".dropdown-hover a[class='dropdown-toggle']").dropdownHover();
  }

  Navigation.prototype.menuClick = function($anchor) {
    var src = $anchor.attr('href');

    // 变更 $pageHeader 标题
    _setPageTitle($anchor.text());

    var $existIframe = $iframeContainer.find('iframe[src="' + src + '"]');

    /*
     * 如果存在相同url的iframe
     *   将anchor的target指向新的那个iframe
     *   将那个iframe显示出来
     *   激活对应的tab
     */
    if ($existIframe.length > 0) {

      $iframeContainer.find('iframe:not(:hidden)').hide();
      $existIframe.show();
      $existIframe.attr('src', src);

      var $tabAnchor = $tabList.find(tabAnchor).filter("[target='" + $existIframe.attr('name') + "']");
      _activateTab($tabAnchor);

      if ($existIframe.attr("id") === iframeHomeName) {
        $tabCurrentClose.hide();
      }else {
        $tabCurrentClose.show();
      }

      //不保留之前的页面
      $($existIframe[0].contentDocument).find('.index').remove();
      return;

    }

    iframeId++;
    var iframeName  = 'e-home-iframe-' + iframeId;
    /*
     * 否则
     *   生成新的iframe id
     *   创建一个新的iframe
     *   将anchor的target指向新的iframe
     *   hide原来可见的iframe(如果将iframe移动到别的地方会发生reload)
     *   新的iframe append到$iframeContainer
     */
    $iframeContainer.find('iframe:not(:hidden)').hide();
    $('<iframe></iframe>')
      .addClass('embed-responsive-item')
      .attr('name', iframeName)
      .attr('src', $anchor.attr('href'))
      .attr('frameBorder','0')
      .appendTo($iframeContainer);

    $anchor.attr('target', iframeName);
    this.$container.find("a[id='" + $anchor.attr("id") + "']").attr('target', iframeName);

    /*
     $ 在 $tabList 追加一个tab item
     * 将tab item设为激活
     * 更新tab count的数字
     */
    var $tabAnchor = $('<a></a>').attr('href', '#').attr('target', iframeName).append(
      $('<span></span>').text($anchor.text())
    ).click(function(event) {
        event.preventDefault();
        tabClick($(this))
      });

    var $tabCloseAnchor =  $('<a></a>').attr('href', '#').attr('target', iframeName).attr('class', tabCloseClass).append(
      $('<i></i>').attr('class', tabCloseFont)
    ).click(function(event) {
        event.preventDefault();
        tabClose($(this));
      });

    _activateTab($tabAnchor);

    $('<li></li>')
      .append($tabAnchor)
      .append($tabCloseAnchor)
      .appendTo($tabList);

    _incrementTabCount();

    _scrollTop();
  }

  Navigation.prototype.disabledMenu = function($anchor) {
    this.$container.find("li").removeClass("disabled");
    $anchor.closest("li").addClass("disabled");
  }

  /** 得到最终菜单 */
  Navigation.prototype.generateMenus = function(menus, initParentId) {

    this.initMenu(menus, initParentId);

    var self = this;

    $("#e-top-menu a").on("click", function(e) {
      if (!$(this).attr('href') || $(this).attr('href') == '#') {
        this.style.backgroundColor = 'transparent';
        return false;
      }

      e.preventDefault();
      self.$container.find("li.children").remove();
      self.updateMenu($(this));

      $body.find(".dropdown-toggle-hover").removeClass("dropdown-toggle-hover");
      self.menuClick($(this));

      //disabled当前菜单
      self.disabledMenu($container.find("a[id='"+$(this).attr("id") + "']"));
    });

    $(".dropdown-hover a:first").dropdownHover();
  }

  Navigation.prototype.closeAll = function() {
    $tabList.find(tabAnchor).filter(':not(#e-home-tab-home)').parent().remove();
    $iframeContainer.find('iframe:not(#e-home-iframe)').remove();
    tabClick($tabList.find(tabAnchor));

    tabCount = 0;
    $tabCount.empty();
    $tabCurrentClose.hide();
  }

  // Navigation PLUGIN DEFINITION
  // =======================

  function Plugin(option) {

    var args = arguments;
    var ret;
    this.each(function () {
      var $this = $(this);
      var data = $this.data('navigation');

      if (!data) {
        var options = $.extend(true, {}, $.fn.navigation.defaults, typeof option == 'object' && option);
        $this.data('navigation', (data = new Navigation(this, options)))
      }

      if (typeof option == 'string') {
        if (args.length == 1) {
          var _ret = data[option].call(data);
          if (typeof _ret != 'undefined') {
            ret = _ret;
          }
        } else {
          var _ret = data[option].apply(data, Array.prototype.slice.call(args, 1));
          if (typeof _ret != 'undefined') {
            ret = _ret;
          }
        }
      }
    })

    if (typeof ret != 'undefined') {
      return ret;
    }
    return this;

  }

  var old = $.fn.navigation

  $.fn.navigation = Plugin
  $.fn.navigation.Constructor = Navigation
  $.fn.navigation.defaults = {

  }

  $.fn.navigation.locales = {}

  // Navigation NO CONFLICT
  // =================
  $.fn.navigation.noConflict = function () {

    $.fn.navigation = old;
    return this;

  }

}(jQuery);
