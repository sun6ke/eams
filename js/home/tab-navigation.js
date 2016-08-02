/* ========================================================================
 * eams-ui 标签页式浏览
 * ======================================================================== */
$(function() {

  if($('body.e-home').length == 0) {
    return;
  }
  //
  // 首页Tab式浏览
  //-----------------------------------
  var $body = $("body");
  var tabCloseFont = 'fa fa-times-circle';
  var tabCloseClass = 'pull-right e-tab-close-icon';
  var tabAnchor = 'a[target]:not(.e-tab-close-icon)';
  var tabAnchorActive = 'a.active[target]:not(.e-tab-close-icon)';

  var $pageHeaderIcon = $('#e-op-area .e-page-header h2 i');
  var $pageHeaderText = $('#e-op-area .e-page-header h2 span');
  var $iframeContainer = $('#e-op-area .e-op-area-iframe-container');
  var $tabCurrentClose = $('#e-home-tab-close-current');
  var $tabCloseAll = $('#e-home-tab-close-all');

  var $tabList = $('#e-home-tab-list');
  var $tabCount = $('#e-home-tab-count div');

  var iframeId = 0;

  var tabCount = 0;

  var menuClick = function($anchor) {


    var src         = $anchor.attr('href');
    var $i          = $anchor.find('i');
    var $span       = $anchor.find('span');

    // 变更 $pageHeader 标题
    _setPageTitle($i.attr('class'), $span.text());

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
      .appendTo($iframeContainer);
    $anchor.attr('target', iframeName);

    /*
     $ 在 $tabList 追加一个tab item
     * 将tab item设为激活
     * 更新tab count的数字
     */
    var $tabAnchor = $('<a></a>').attr('href', '#').attr('target', iframeName).append(
      $('<i></i>').attr('class', $i.attr('class'))
    ).append(
      $('<span></span>').text($span.text())
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
  };

  var _scrollTop = function() {
    $body.scrollTop(0);
    //$body.animate({ scrollTop: 0 }, "fast");
  }

  /*
   * 点击tab item后发生的事件
   *
   */
  var tabClick = function($anchor) {

    /*
     * 变更 $pageHeader 标题
     * hide原来可见的iframe(如果将iframe移动到别的地方会发生reload)
     * show关联的iframe
     * 将tab item设为激活
     */
    var $span = $anchor.find('span');
    var $i = $anchor.find('i');

    var iframeName = $anchor.attr('target');

    $iframeContainer.find('iframe').hide();
    $iframeContainer.find('iframe[name=' + iframeName + ']').show();


    _setPageTitle($i.attr('class'), $span.text())
    _activateTab($anchor);

    _scrollTop();
  }

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

  /*
   * 点击page标题叉叉后发生的事件
   *
   * 同[点击 tab item 的叉叉后发生的事件]
   */
  var pageClose = function() {
    tabClose($tabList.find(tabAnchorActive));
  };

  /**
   * 激活tab item的状态
   * @param $anchor
   * @private
   */
  var _activateTab = function($anchor) {
    $tabList.find(tabAnchor).removeClass('active');
    $anchor.addClass('active');
  }

  /**
   * tab count++
   * @private
   */
  var _incrementTabCount = function() {
    tabCount++;
    $tabCount.text(tabCount);
    if (tabCount) {
      $tabCurrentClose.show();
    }
  };

  /**
   * tab count--
   * @private
   */
  var _decrementTabCount = function() {
    tabCount--;
    $tabCount.text(tabCount);
    if(tabCount == 0) {
      $tabCount.empty();
      $tabCurrentClose.hide();
    }
  };

  /**
   * 更新page标题
   * @param text
   * @private
   */
  var _setPageTitle = function(iconClass, text) {
    $pageHeaderIcon.removeClass();
    $pageHeaderIcon.addClass(iconClass);
    $pageHeaderText.text(text);
  };

  $('a[data-open="tab-view"]').click(function(event) {
    event.preventDefault();
    menuClick($(this));
  });

  $tabList.find('a:not([data-toggle])').click(function(event) {
    event.preventDefault();
    tabClick($(this));
  });

  $tabCurrentClose.click(function(event) {
    event.preventDefault();
    pageClose();
  });

  $tabCloseAll.click(function(event) {

    event.preventDefault();
    $tabList.find(tabAnchor).filter(':not(#e-home-tab-home)').parent().remove();
    $iframeContainer.find('iframe:not(#e-home-iframe)').remove();
    tabClick($tabList.find(tabAnchor));

    tabCount = 0;
    $tabCount.empty();
    $tabCurrentClose.hide();

  });

});
