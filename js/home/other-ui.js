/* ========================================================================
 * eams-home 其他ui
 * ======================================================================== */
$(function() {

  // date ticker
  var $dateTicker = $('#date-ticker');
  (function refreshDate() {

    var date = moment();
    $dateTicker.text(date.format('YYYY-MM-DD'));

    setTimeout(refreshDate, 1000 * 60);

  })();

  //
  // clock ticker
  // ------------------------------------------------
  var $hour = $('#clock-ticker .hour');
  var $minute = $('#clock-ticker .minute');
  var $second = $('#clock-ticker .second');

  (function refreshClock() {

    var date = moment();
    $hour.text(date.format('HH'));
    $minute.text(date.format('mm'));
    $second.text(date.format('ss'));

    setTimeout(refreshClock, 1000);

  })();

});
