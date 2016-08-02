define([
  'views/scheduleView',
  'common'
], function (ScheduleView, common) {
  'use strict';

  var ScheduleArrangeView = Backbone.View.extend({
    events: {

    },
    initialize: function(options) {
      this.lesson = this.options.lesson;
      this.render();
    },
    render: function() {
      this.$el.find("modal-title").text('[' + this.lesson.get('code') + '] ' + this.lesson.get('course').nameZh);

      var teachers = [];
      var weekIndexes = [];
      _.each(this.model.get('arrangeList'), function(schedule) {
        if (weekIndexes.indexOf(schedule.weekIndex) == -1) {
          weekIndexes.push(schedule.weekIndex);
        }
      });
    }
  });

  return ScheduleArrangeView;

});
