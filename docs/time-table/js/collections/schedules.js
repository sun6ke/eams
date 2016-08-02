define([
  'models/schedule'
], function (ScheduleModel) {
  'use strict';

  var Schedules = Backbone.Collection.extend({
    model: ScheduleModel
  });

  return Schedules;
});
