define([], function () {
  'use strict';

  var LessonModel = Backbone.Model.extend({
    defaults: function() {
      return {
        id: null,
        code: '',
        course: {},
        courseType: {},
        requiredPeriodInfo: {},
        actualPeriods: 0,
        teachers: [],
        startWeek: 0
      };
    }
  });

  return LessonModel;

});
