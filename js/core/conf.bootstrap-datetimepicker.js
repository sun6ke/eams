/*
 * Bootstrap Datetimepicker
 */
(function () {

  if ($.ieDetector.isLowerThan9()) {
    $.fn.datetimepicker.defaults.debug = true;
  }

  $.fn.datetimepicker.defaults.keepOpen = true;
  $.fn.datetimepicker.defaults.showClose = true;
  $.fn.datetimepicker.defaults.dayViewHeaderFormat = 'YYYY MMMM';
  $.fn.datetimepicker.defaults.sideBySide = true;
  $.fn.datetimepicker.defaults.format = 'YYYY-MM-DD';
  $.fn.datetimepicker.defaults.showClear = true;
  $.fn.datetimepicker.defaults.showTodayButton = true;

})();
