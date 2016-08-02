define([
  'collections/lessons',
  'views/popoverView',
  'common'
], function (lessons, PopoverView, common) {
  'use strict';

  var CardView = Backbone.View.extend({
    tagName: 'div',
    className: 'card-view',
    dragTemplate: _.template($('#card-drag-template').html()),
    template: _.template($('#card-template').html()),
    events: {
      'dragstart': "dragStart",
      'dragover': "dragOver",
      'resize': "resizeCard",
      'resizestart': "resizeCardStart",
      'resizestop': "resizeCardStop",
      'click': "cardClick"
    },
    initialize: function(options) {
      if (options) {
        this.timeTable = options.timeTable;
        this.eventBus = options.eventBus;
      }
    },
    render: function() {
      var _self = this;
      var lesson = lessons.get(this.model.get('lessonId'));

      this.$el.html(this.template(lesson.toJSON()));
      if (this.model) {
        this.$el.css("top", common.getHeightBetweenTimes(800, this.model.get('startTime')));
        this.$el.css("height", common.getHeightBetweenTimes(this.model.get('startTime'), this.model.get('endTime')));
      }

      this.$el.attr("draggable", "true");

      var units = this.timeTable.get('units');
      this.$el.resizable({
        handles: 's',
        grid: 5,
        minHeight: 50,
        maxHeight: common.getHeightBetweenTimes(_self.model.get('startTime'), units[units.length-1].endTime),
        preHeight: 0
      });

      this.delegateEvents();

      var popover = new PopoverView({
        eventBus: this.eventBus,
        card: this.model,
        parentEl: this.$el,
        lesson: lesson
      });

      return this;
    },
    renderTempCard: function(model) {
      this.el.style.top = "0px";
      this.el.style.left = "-125px";
      document.body.appendChild(this.el);
    },
    cardClick: function() {
      this.$el.popover('toggle');
      this.eventBus.trigger('lesson:selected', this.model);
      this.eventBus.trigger('arg:lesson');
    },
    dragStart: function(event) {
      common.tmp_card = this.model;
      event.originalEvent.dataTransfer.setData("drag-type", "card");
      event.originalEvent.dataTransfer.setData("old-week-column", this.model.get('weekday'));

      this.el.style.opacity = '0.4';
      event.originalEvent.dataTransfer.setDragImage(common.tmp_cardView.el, common.tmp_cardView.$el.outerWidth()/10, common.tmp_cardView.$el.outerHeight()/10);
    },
    dragOver: function() {
      this.eventBus.trigger('up:blankUnitZIndex');
    },
    resizeCardStart: function(event, ui) {
      this.eventBus.trigger("stop:windowClick", event);
    },
    resizeCard: function(event, ui) {
      var originalHeight = ui.originalSize.height;

      var units = this.timeTable.get('units');
      var startTime = this.model.get('startTime');
      var endTime = this.model.get('endTime');

      var height = ui.size.height + common.getHeightBetweenTimes(800, startTime);
      var preHeight = this.$el.resizable("option").preHeight;

      //得到当前小节
      var currentUnit = _.find(units, function(unit) {
        return (unit.startTime < endTime && unit.endTime >= endTime);
      });

      //得到下一小节和上一小节
      var nextUnit;
      var preUnit;
      if (currentUnit.endTime == endTime) {
        nextUnit = units[units.indexOf(currentUnit)+1];
        preUnit = units[units.indexOf(currentUnit)-1]
      } else {
        nextUnit = currentUnit;
        preUnit = currentUnit;
      }

      if (ui.size.height <= 50) {

      } else if(preHeight < height) {
        //拉伸
        if (nextUnit && height <= common.getHeightBetweenTimes(800, nextUnit.endTime) && height >= common.getHeightBetweenTimes(800, currentUnit.endTime)) {
          this.$el.css('height', common.getHeightBetweenTimes(startTime, nextUnit.endTime) + 'px');
          this.model.set('endTime', nextUnit.endTime);
          this.model.set('periods', this.model.get("periods") + 1 );
        } else {
          this.$el.css('height', common.getHeightBetweenTimes(startTime, currentUnit.endTime) + 'px');
        }
      } else {
        //收缩
        if (preUnit && height >= common.getHeightBetweenTimes(800, preUnit.endTime) && height <= common.getHeightBetweenTimes(800, currentUnit.endTime)-25) {
          this.$el.css('height', common.getHeightBetweenTimes(startTime, preUnit.endTime) + 'px');
          this.model.set('endTime', preUnit.endTime);
          this.model.set('periods', this.model.get("periods") - 1 );
        } else {
          this.$el.css('height', common.getHeightBetweenTimes(startTime, currentUnit.endTime) + 'px');
        }
      }

      this.$el.resizable("option", "preHeight", height);

    },
    resizeCardStop: function() {
      //重新渲染该cardView所在列
      this.eventBus.trigger('render:WeekdayColumn', this.model);
    },
    removeCard: function() {
      this.eventBus.trigger('destroy:popover');
      this.remove();
    }
  });

  return CardView;
});
