define([], function () {
  'use strict';

  var TimeTableModel = Backbone.Model.extend({
    defaults : function () {
      return {
        timeSegments: [{
          startTime: 0,
          endTime: 0
        }],
        units: [{
          nameZh: "",
          indexno: 0,
          startTime: 0,
          endTime: 0,
          color: null,
          dayPart: ""
        }]
      }
    }
  });

  return TimeTableModel;
});
