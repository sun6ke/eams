define([
  'collections/weekdayColumns',
  'models/weekdayColumn',
  'views/weekdayColumnView'
], function (weekdayColumns, WeekdayColumnModel, WeekdayColumnView) {
  'use strict';

  var WeekdayColumnListView = Backbone.View.extend({

    initialize: function(options) {
      this.options = options;
      this.eventBus = options.eventBus;

      this.listenTo(this.eventBus, 'render:WeekdayColumn', this.renderWeekdayColumn);
      this.render();
    },
    render: function() {
      var _self = this;

      var units = this.options.timeTable.get('units');
      _.each(this.options.weekdayList, function(weekday) {
        var currentColumnModel = weekdayColumns.findWhere({weekday: weekday});
        if (!currentColumnModel) {
          var weekdayColumnModel = new WeekdayColumnModel();
          weekdayColumnModel.set('weekday', weekday);
          weekdayColumnModel.set('weekdayColumnView',
            new WeekdayColumnView({
              eventBus: _self.eventBus,
              timeTable: _self.options.timeTable,
              columnWidth: (92/_self.options.weekdayList.length)+'%'
            }));

          weekdayColumnModel.get('weekdayColumnView').render();

          weekdayColumns.add(weekdayColumnModel);

        } else {
          currentColumnModel.get('weekdayColumnView').remove();
          currentColumnModel.set('weekdayColumnView',
            new WeekdayColumnView({
              eventBus: _self.eventBus,
              timeTable: _self.options.timeTable,
              columnWidth: (92/_self.options.weekdayList.length)+'%'
            }));

          currentColumnModel.get('weekdayColumnView').render();

          currentColumnModel.get('weekdayColumnView').renderCardList(currentColumnModel);
        }
      });
    },
    renderWeekdayColumn: function(card) {
      var columnModel = weekdayColumns.findWhere({weekday: card.get('weekday')});
      columnModel.get('weekdayColumnView').removeCardList(columnModel);
      columnModel.get('weekdayColumnView').renderCardList(columnModel);
      this.eventBus.trigger("restart:windowClick");
    }
  });

  return WeekdayColumnListView;
});
