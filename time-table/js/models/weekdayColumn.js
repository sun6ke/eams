define([], function () {
  'use strict';

  var WeekdayColumnModel = Backbone.Model.extend({
    defaults : function () {
      return {
        weekday: null,
        weekdayColumnView: null,
        cardViewList: []
      }
    }
  });

  return WeekdayColumnModel;
});
