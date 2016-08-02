define([
  'collections/schedules',
  'models/schedule',
  'common'
], function (Schedules, ScheduleModel, common) {
  'use strict';

  var ScheduleView = Backbone.View.extend({
    tagName: 'div',
    className: 'column',
    template: _.template($('#schedule-template').html()),

    events: {},
    initialize: function(options) {

    },
    render: function() {

    }
  });

});
