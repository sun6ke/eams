/* ========================================================================
 * eams-ui 首页侧边菜单初始化
 * ======================================================================== */
$(function () {

  if ($('body.e-home').length == 0) {
    return;
  }

  //
  // bs tooltip
  // ------------------------------------------------
  $('[data-toggle="tooltip"]').tooltip();

  //
  // 侧边菜单搜索
  // ------------------------------------------------
  var sidebar_menu_collapse_status = {};
  var $sidebar_menu_search = $('#e-sidebar-menu-search input');
  var quick_search_status = false;
  $sidebar_menu_search.quicksearch('#e-sidebar-menu li', {

    onBefore: function () {
      if ($sidebar_menu_search.val() == "") {
        return;
      }
      // 用户输入东西搜索前，记住每个下拉菜单原来的下拉状态
      // 如果原来已经记录过状态，那么就什么都不做
      if ($.isEmptyObject(sidebar_menu_collapse_status)) {
        $('#e-sidebar-menu ul.collapse').each(function (index, ul) {
          sidebar_menu_collapse_status['#' + ul.id] = $(ul).is('.in');
        });
      }
    },

    onAfter: function () {
      // 清除了搜索条件
      if ($sidebar_menu_search.val() == "") {
        // 恢复搜索前的状态
        $.each(sidebar_menu_collapse_status, function (key, value) {
          if (value) {
            $(key).collapse('show')
          } else {
            $(key).collapse('hide')
          }
        });
        sidebar_menu_collapse_status = {};
        return;
      }
      // 要将找到的菜单展开
      quick_search_status = true;
      $('#e-sidebar-menu li:not(:hidden) a[data-toggle]').each(function () {
        $($(this).attr("href")).collapse('show');
      });
      quick_search_status = false;
    }
  });

  //
  // 点击菜单的时候，收缩同级别的其他菜单
  // ------------------------------------------------
  var $sidebar = $('#e-sidebar-menu');
  $('#e-sidebar-menu ul.collapse').on('show.bs.collapse', function (event) {
    if (quick_search_status) {
      return;
    }
    var $this = $(event.currentTarget);

    var $ul = $this.parent().parent();
    if ($ul.is('ul.collapse')) {
      // 二级菜单
      var $siblings = $ul.find('ul.collapse').not($this);
      $siblings.collapse('hide');
      return;
    }

    // 一级菜单
    var $siblings = $sidebar.find('> ul > li > ul').not($this);
    $siblings.collapse('hide');

  });

  //
  // 侧边栏收缩
  // ------------------------------------------------
  var $sidebar_menu_toggle = $('#e-sidebar-menu-toggle');
  $sidebar_menu_toggle.click(function () {

    $('body').toggleClass('e-sidebar-collapse');
    $('#e-sidebar-menu a').toggleClass('tooltipster-disable');

    if ($('body').hasClass('e-sidebar-collapse')) {
      $('#e-sidebar-menu a').tooltipster('enable');
    } else {
      $('#e-sidebar-menu a').tooltipster('disable');
    }

  });

  //
  // 侧边栏收缩后的tooltip显示
  // ------------------------------------------------
  $('#e-sidebar-menu a').addClass('tooltipster-disable');
  $('#e-sidebar-menu a').tooltipster({
    position: 'right',
    animation: 'slide',
    theme: '.tooltipster-dark',
    delay: 1,
    offsetX: '-12px',
    onlyOne: true
  });
  $('#e-sidebar-menu a').tooltipster('disable');

});
