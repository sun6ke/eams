define([
  'models/lesson',
  'collections/lessons',
  'views/lessonView',
  'views/timeTableView',
  'views/cardView',
  'common'
], function (LessonModel, lessonList, LessonView, TimeTableView, CardView, common) {
  'use strict';

  var WindowView = Backbone.View.extend({
    events: {
      "click": "cancelCardSelected",
      "click .hide-weekend": "hideWeekend"
    },
    initialize: function(options) {
      common.tmp_cardView = new CardView();
      this.options = options;
      this.eventBus = _.extend({}, Backbone.Events);
      this.listenTo(this.eventBus, 'up:blankUnitZIndex', this.upBlankUnitZIndex);
      this.listenTo(this.eventBus, 'down:blankUnitZIndex', this.downBlankUnitZIndex);
      this.listenTo(this.eventBus, 'up:highlightZIndex', this.upHighlightZIndex);
      this.listenTo(this.eventBus, 'down:highlightZIndex', this.downHighlightZIndex);
      this.listenTo(this.eventBus, 'stop:windowClick', this.stopClick);
      this.listenTo(this.eventBus, 'restart:windowClick', this.restartClick);

      this.renderLesson();
      this.timeTable = this.renderTimeTable();

      var self = this;
      this.$el[0].addEventListener('dragend', function(event) {
        $(this).find(".card-view").css('opacity', '1');
        self.downBlankUnitZIndex();
        common.tmp_card = null;
      });
    },
    stopClick: function(event) {
      this.undelegateEvents();
    },
    restartClick: function() {
      this.delegateEvents();
    },
    cancelCardSelected: function(event) {
      if ($(event.target).hasClass('card-view') || $(event.target).parents('.card-view').length > 0
        || $(event.target).hasClass('popover-content') || $(event.target).parents('.popover-content').length > 0) {
        return false;
      } else if ($(event.target).hasClass('card') || $(event.target).parents('.card').length > 0) {
        event.stopPropagation();
      } else {
        this.$el.find('.card').removeClass('selected');
      }

      if (!$(event.target).hasClass('card-view') && $(event.target).parents('.card-view').length == 0
        && !$(event.target).parents().is('.popover')) {
        this.$el.find('.card-view').popover('hide');
      }
    },
    renderLesson: function() {
      var _self = this;
      $.each(this.options.lessons, function() {
        var lessonModel = new LessonModel(this);
        lessonList.add(lessonModel);
        var lessonView = new LessonView({
          model: lessonModel,
          eventBus: _self.eventBus
        });
      });
    },
    renderTimeTable: function() {
      var _self = this;
      var timeTable = new TimeTableView({
        eventBus: _self.eventBus,
        timeTable: _self.options.timeTable,
        weekdayList: _self.options.weekdayList
      });
      timeTable.render();
      return timeTable;
    },
    upBlankUnitZIndex: function() {
      this.$el.find(".blank-unit").css('zIndex', 4);
    },
    downBlankUnitZIndex: function() {
      this.$el.find(".blank-unit").css('zIndex', 1);
    },
    upHighlightZIndex: function() {
      this.$el.find(".highlight-unit").css('zIndex', 3);
    },
    downHighlightZIndex: function() {
      this.$el.find(".highlight-unit").css('zIndex', 1);
    },
    hideWeekend: function() {
      var _self = this;
      var newWeekdayList = _.filter(this.options.weekdayList, function(weekday) {
        return weekday != 6 && weekday !=7;
      });
      this.timeTable.remove();

      new TimeTableView({
        eventBus: _self.eventBus,
        timeTable: _self.options.timeTable,
        weekdayList: newWeekdayList,
        initCards: _self.options.initCards
      }).render();
    }
  });

  return WindowView;
});
