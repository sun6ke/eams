define([], function () {
  'use strict';

  var ScheduleModel = Backbone.Model.extend({
    defaults: function() {
      return {
        roomId: null,
        roomName: '',
        buildingName: '',
        campusName: '',
        teacherId: null,
        personId: null,
        personName: '',
        weekIndex: ""
      };
    }
  });

  return ScheduleModel;

});
