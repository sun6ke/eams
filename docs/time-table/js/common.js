/*global define*/
'use strict';
define([], function (CardView) {
  return {
    getTimeText : function(time) {
      return parseInt(time/100) + ':' + (time%100 == 0 ? '00' : ''+time%100);
    },

    //根据时间差得到宽度
    getHeightBetweenTimes : function(startTime, endTime) {
      return endTime - startTime - 40*(parseInt(endTime / 100)-parseInt(startTime / 100));
    },

    //用于拖拽的临时Card
    tmp_card : null,

    //创建用于拖拽的临时cardView
    tmp_cardView: null
  };
});
