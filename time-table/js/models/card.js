/*global define*/
define([], function () {
  'use strict';

  var Card = Backbone.Model.extend({
    defaults: function () {
      return {
        arrangeList: [{
          roomId: null,
          roomName: '',
          buildingName: '',
          campusName: '',
          teacherId: null,
          personId: null,
          personName: '',
          weekIndex: ""
        }],
        startTime: 0,
        endTime: 0,
        weekday: null,
        lessonId: null,
        cardGroupId: null,
        periods: 0
      }
    }
  });

  return Card;
});
