define([
  'collections/weekdayColumns',
  'views/cardView',
  'collections/cards',
  'common'
], function (weekdayColumns, CardView, CardList, common) {
  'use strict';

  var WeekdayColumnView = Backbone.View.extend({
    tagName: 'div',
    className: 'columns weekday',
    template: _.template($('#weekday-column').html()),
    events: {
      'dragover': "dragOver",
      'drop': "drop"
    },
    initialize: function(options) {
      this.timeTable = options.timeTable;
      this.eventBus = options.eventBus;
      this.columnWidth = options.columnWidth
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    getCardListByCardViewList: function(cardViewList) {
      var cardList = new CardList;
      _.each(cardViewList, function(cardView) {
        cardList.add(cardView.model);
      });
      return cardList;
    },
    render: function() {
      var units = this.timeTable.get('units');

      this.$el.css('width', this.columnWidth);
      var $timeTableBody = $(".time-table-body");
      $timeTableBody.append(this.$el);
      this.$el.height(common.getHeightBetweenTimes(units[0].startTime, units[units.length-1].endTime));
      return this;
    },
    dragOver: function(event) {
      //列监听dragover事件
      this.eventBus.trigger('up:highlightZIndex');
      event.preventDefault();
    },
    drop: function(event) {
      //列监听drop事件
      if (!common.tmp_card) {
        return false;
      }
      var $blankUnit = $(event.target);
      this.eventBus.trigger('down:blankUnitZIndex');
      if (!$blankUnit.hasClass("blank-unit")) {
        return false;
      }

      $('.highlight-unit').remove();
      var unitStartTime = parseInt($blankUnit.attr("start-time"));
      var endTime;
      var unit_num = common.tmp_card.get("periods");
      if ($blankUnit.nextAll('.blank-unit:eq('+ (unit_num-2) +')').length == 0) {
        endTime = 1800;
        common.tmp_card.set("periods", $blankUnit.nextAll('.blank-unit').length + 1);
      } else if (unit_num < 2) {
        endTime = parseInt($blankUnit.attr("end-time"));
      } else {
        endTime = parseInt($blankUnit.nextAll('.blank-unit:eq(' + (unit_num-2) + ')').attr("end-time"));
      }

      var currentColumnModel = weekdayColumns.findWhere({weekdayColumnView: this});

      //查看weekdayColumn的cardList中是否已经有该card
      var currentColumnCardViews = currentColumnModel.get('cardViewList');
      var cardList = this.getCardListByCardViewList(currentColumnCardViews);

      //删掉column中所有card
      this.removeCardList(currentColumnModel);

      var dragType = event.originalEvent.dataTransfer.getData("drag-type");
      var oldWeekColumn = parseInt(event.originalEvent.dataTransfer.getData("old-week-column"));

      common.tmp_card.set('weekday', currentColumnModel.get('weekday'));
      common.tmp_card.set('startTime', unitStartTime);
      common.tmp_card.set('endTime', endTime);
      if (!cardList.get(common.tmp_card.cid)) {
        var cardView = this.newCardView(common.tmp_card);
        currentColumnCardViews.push(cardView);

        currentColumnModel.set('cardViewList', currentColumnCardViews);
        this.renderCardList(currentColumnModel);

        if (dragType == "card") {
          var oldColumnModel = weekdayColumns.findWhere({weekday: oldWeekColumn});
          this.removeCardList(oldColumnModel);
          if (!oldColumnModel || !oldColumnModel.get('cardViewList')) {
            return;
          }

          var oldCardViews = _.filter(oldColumnModel.get('cardViewList'), function(view) {
            return view.model.cid != common.tmp_card.cid;
          });
          oldColumnModel.set('cardViewList', oldCardViews);

          this.renderCardList(oldColumnModel);
        }
      } else {
        var newCardView = this.newCardView(common.tmp_card);
        var removed = _.filter(currentColumnCardViews, function(view) {
          return view.model.cid != common.tmp_card.cid;
        });
        removed.push(newCardView);
        currentColumnModel.set('cardViewList', removed);
        this.renderCardList(currentColumnModel);
      }

      common.tmp_card = null;
    },
    newCardView: function(card) {
      var _self = this;
      var cardView = new CardView({
        model: card,
        eventBus : this.eventBus,
        timeTable: _self.timeTable
      });
      return cardView;
    },
    removeCardList: function(weekdayColumnModel) {
      var cardViewList = weekdayColumnModel.get('cardViewList');
      _.each(cardViewList, function(view) {
        view.removeCard();
      });
    },
    renderCardList: function(weekdayColumnModel) {
      var $weekdayColumn = weekdayColumnModel.get('weekdayColumnView').$el;
      var cardViewList = weekdayColumnModel.get('cardViewList');

      var _self = this;
      var block_width = 100;
      var columns = [];
      var lastEventEnding = null;

      // 根据开始和结束时间排序
      cardViewList.sort(function(view1, view2) {
        if (view1.model.get('startTime') < view2.model.get('startTime')) return -1;
        if (view1.model.get('startTime') > view2.model.get('startTime')) return 1;
        if (view1.model.get('endTime') < view2.model.get('endTime')) return -1;
        if (view1.model.get('endTime') > view2.model.get('endTime')) return 1;
        return 0;
      });

      // Iterate over the sorted array
      _.each(cardViewList, function(view, index) {
        if (lastEventEnding !== null && view.model.get('startTime') >= lastEventEnding) {
          _self.packViews(columns, block_width, $weekdayColumn);
          columns = [];
          lastEventEnding = null;
        }

        var placed = false;

        for (var i = 0; i < columns.length; i++) {
          var col = columns[ i ];
          if (!_self.collidesWith(col[col.length-1].model, view.model)) {
            col.push(view);
            placed = true;
            break;
          }
        }

        if (!placed) {
          columns.push([view]);
        }

        if (lastEventEnding === null || view.model.get('endTime') > lastEventEnding) {
          lastEventEnding = view.model.get('endTime');
        }
      });

      if (columns.length > 0) {
        _self.packViews(columns, block_width, $weekdayColumn);
      }
    },
    collidesWith: function(card1, card2) {
      return card1.get('endTime') > card2.get('startTime') && card1.get('startTime') < card2.get('endTime');
    },
    packViews: function(columns, block_width, $weekdayColumn) {
      var n = columns.length;
      for (var i = 0; i < n; i++) {

        var col = columns[ i ];
        for (var j = 0; j < col.length; j++) {
          var bubble = col[j];
          var width = block_width/n;
          var colSpan = this.expandEvent(bubble, i, columns);

          bubble.$el.css( 'left', (i / n)*100 + 1 + '%' );
          bubble.$el.css('width', width*colSpan-1 + '%');
          $weekdayColumn.prepend(bubble.render().$el);
        }
      }
    },
    expandEvent: function(view, iColumn, columns) {
      var colSpan = 1;

      for (var i = iColumn + 1; i < columns.length; i++) {
        var col = columns[i];
        for (var j = 0; j < col.length; j++) {
          var view1 = col[j];
          if (this.collidesWith(view.model, view1.model))
          {
            return colSpan;
          }
        }
        colSpan++;
      }
      return colSpan;
    },
    showHighlightArea: function($blankUnit, unit_num) {
      var $hightLight = $("<div class='time-table-highlight highlight-unit'></div>");
      var unitStartTime = parseInt($blankUnit.attr("start-time"));
      var endTime;
      if ($blankUnit.nextAll('.blank-unit:eq('+ (unit_num-2) +')').length == 0) {
        endTime = 1800;
      } else if (unit_num < 2) {
        endTime = parseInt($blankUnit.attr("end-time"));
      } else {
        endTime = parseInt($blankUnit.nextAll('.blank-unit:eq('+ (unit_num-2) +')').attr("end-time"));
      }

      $hightLight.css('top', common.getHeightBetweenTimes(800, unitStartTime) + 'px');
      $hightLight.css('height', common.getHeightBetweenTimes(unitStartTime, endTime) + 'px');
      this.$el.append($hightLight);
      return $hightLight;
    },
    hideHighlightArea: function() {

    }
  });

  return WeekdayColumnView;
});
