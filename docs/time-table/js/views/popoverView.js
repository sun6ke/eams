define([
  'common',
  'views/scheduleArrangeView'
], function (common, ScheduleArrangeView) {
  'use strict';

  var PopoverView = Backbone.View.extend({
    tagName: 'div',
    className: '',
    template: _.template($('#card-popover-content').html()),
    events: {
      "click .adjustment": "adjustment",
      "click .delete": "deleteCard"
    },
    initialize: function(options) {
      this.options = options;
      this.eventBus = options.eventBus;
      this.card = options.card;
      this.parentEl = options.parentEl;
      this.lesson = options.lesson;

      this.listenTo(this.eventBus, 'destroy:popover', this.remove);

      this.render();
    },
    render: function() {
      var _self = this;

      var arrangeList = this.card.get('arrangeList');
      var teachers = [];
      var teacherIds = [];
      _.each(arrangeList, function(arrange) {
        var roomInfo = {
          roomId: arrange.roomId,
          roomName: arrange.roomName,
          buildingName: arrange.buildingName,
          campusName: arrange.campusName,
          weekIndex: arrange.weekIndex
        };
        if (teacherIds.indexOf(arrange.teacherId) == -1) {
          teacherIds.push(arrange.teacherId);
          var new_teacher = {};
          new_teacher['id'] = arrange.teacherId;
          new_teacher['personId'] = arrange.personId;
          new_teacher['personName'] = arrange.personName;
          new_teacher['periods'] = arrange.periods;
          new_teacher['arranges'] = [roomInfo];
          teachers.push(new_teacher);
        } else {
          var teacher = _.find(teachers, function(tea) {return tea.id == arrange.teacherId});
          teacher.arranges.push(roomInfo);
        }
      });

      this.$el.html(this.template({'teachers': teachers}));

      var popoverEl = this.parentEl.popover({
        html: true,
        title: '[' + _self.lesson.get('code') + '] ' + _self.lesson.get('course').nameZh,
        content: function() {
          return _self.$el;
        },
        trigger: 'manual'
      });

      this.parentEl.delegate('.adjustment', 'click', _.bind(this.adjustment, this));
      this.parentEl.delegate('.delete', 'click', _.bind(this.adjustment, this));

      return this;
    },
    adjustment: function() {
      var _self = this;
      this.parentEl.popover('hide');
      $("#schedule").modal('show');
      new ScheduleArrangeView({
        el: $("#schedule"),
        model: _self.card,
        lesson: _self.lesson
      });
    },
    deleteCard: function(event) {
      this.remove();
    },
    remove: function() {
      this.parentEl.popover('hide');
    }
  });

  return PopoverView;
});
