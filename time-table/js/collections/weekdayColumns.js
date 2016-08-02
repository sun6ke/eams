define([
  'models/weekdayColumn'
], function (WeekdayColumnModel) {
  'use strict';

  var WeekdayColumnList = Backbone.Collection.extend({
    model: WeekdayColumnModel
  });

  return new WeekdayColumnList();
});
