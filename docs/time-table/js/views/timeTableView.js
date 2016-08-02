define([
  'collections/weekdayColumns',
  'views/weekdayColumnListView',
  'common'
], function (weekdayColumns, WeekdayColumnListView, common) {
  'use strict';

  var weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  var TimeTableView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#time-table").html()),
    initialize: function(options) {
      this.options = options;
      this.eventBus = options.eventBus;

      this.$el.html(this.template());
      $("#arrange-schedule .container-fluid").append(this.$el);
    },
    render: function() {
      var $title = this.$el.find(".time-table-title");
      var self = this;

      //渲染weekdayList
      $.each(this.options.weekdayList, function() {
        var $weekday_title = $("<div class='weekday-title'>" + weekdays[this - 1] + "</div>");
        $weekday_title.css('width', (92/self.options.weekdayList.length)+'%');
        $title.append($weekday_title);
      });

      //渲染列View
      this.renderWeekColumns();

      //渲染timeLayout
      this.renderTimeLayout();

      //渲染blank unit
      this.renderBlankUnit();
    },
    renderWeekColumns: function() {
      new WeekdayColumnListView(this.options);
    },
    renderTimeLayout: function() {
      //渲染timeSegmentList
      var $segmentLayout = this.$el.find(".time-table-body .time-segment");

      $.each(this.options.timeTable.get('timeSegments'), function() {
        var $segment = $("<div></div>");
        $segment.css('height', (this.endTime - this.startTime) * 0.6 + 'px');
        $segment.append("<span>" + common.getTimeText(this.startTime) + "<br/>~<br/>" + common.getTimeText(this.endTime) + "</span>");
        $segmentLayout.append($segment);
      });

      //渲染unitList
      var $unitLayout = this.$el.find(".time-table-body .unit");
      var units = this.options.timeTable.get('units');
      for (var i=0; i< units.length; i++) {

        //渲染休息时间
        if (i > 0) {
          var preEndTime = units[i-1].endTime;
          var currentStartTime = units[i].startTime;
          if (currentStartTime > preEndTime) {
            var $rest = $("<div class='rest-time'></div>");
            var restTime =  common.getHeightBetweenTimes(preEndTime, currentStartTime);
            $rest.css('height', restTime + 'px');
            $rest.css('line-height', restTime + 'px');
            $rest.append("<i class='fa fa-coffee'></i>");
            $unitLayout.append($rest);
          }
        }

        var $unit = $("<div></div>");
        var height = common.getHeightBetweenTimes(units[i].startTime, units[i].endTime);
        $unit.css('height', height + 'px');
        $unit.css('line-height', height + 'px');
        $unit.append("<span>" + units[i].nameZh + "</span>");
        $unitLayout.append($unit);

      }
    },
    renderBlankUnit: function() {
      var units = this.options.timeTable.get('units');
      for (var i=0; i< units.length; i++) {

        //渲染休息时间
        if (i > 0) {
          var preEndTime = units[i-1].endTime;
          var currentStartTime = units[i].startTime;
          if (currentStartTime > preEndTime) {
            var $rest = $("<div class='rest-time'></div>");
            var restTime =  common.getHeightBetweenTimes(preEndTime, currentStartTime);

            $.each(weekdayColumns.models, function() {
              var $blank_rest = $("<div class='rest-time'></div>");
              $blank_rest.css('height', restTime + 'px');
              $blank_rest.css('line-height', restTime + 'px');
              this.get('weekdayColumnView').$el.append($blank_rest);
            });
          }
        }

        var blankHeight = common.getHeightBetweenTimes(units[i].startTime, units[i].endTime);
        $.each(weekdayColumns.models, function() {
          var $line = $("<div class='blank-unit-line'></div>");
          $line.css('height', blankHeight + 'px');
          $line.css('line-height', blankHeight + 'px');


          var $blank = $("<div class='blank-unit'></div>");
          $blank.css('height', blankHeight + 'px');
          $blank.css('line-height', blankHeight + 'px');
          $blank.attr('start-time', units[i].startTime);
          $blank.attr('end-time', units[i].endTime);
          $blank.attr('draggable', false);
          this.get('weekdayColumnView').$el.append($blank);

          this.get('weekdayColumnView').$el.append($line);

          var weekdayColumn = this;
          var tempHighlight;

          //unit监听dragenter事件
          $blank[0].addEventListener('dragenter', function(event) {
            if (!common.tmp_card) {
              return false;
            }
            var $blankUnit = $(event.target);

            tempHighlight = weekdayColumn.get('weekdayColumnView').showHighlightArea($blankUnit, common.tmp_card.get("periods"));

          }, false);

          //unit监听dragleave事件
          $blank[0].addEventListener('dragleave', function(event) {
            if (!common.tmp_card) {
              return false;
            }
            tempHighlight.remove();
          }, false);
        });
      }
    }
  });

  return TimeTableView;
});
