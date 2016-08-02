var getTimeText = function(time) {
  return parseInt(time/100) + ':' + (time%100 == 0 ? '00' : ''+time%100);
}

//根据时间差得到宽度
var getHeightBetweenTimes = function(startTime, endTime) {
  return endTime - startTime - 40*(parseInt(endTime / 100)-parseInt(startTime / 100));
}

var LessonModel = Backbone.Model.extend({
  defaults: function() {
    return {
      id: null,
      code: '',
      course: {},
      courseType: {},
      requiredPeriodInfo: {},
      actualPeriods: 0,
      teachers: [],
      startWeek: 0
    };
  }
});

var Lessons = Backbone.Collection.extend({
  model: LessonModel
});
var lessons = new Lessons();

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

var Card = Backbone.Model.extend({
  defaults: function() {
    return {
      arrangeList: [{
        room: {campus:"",  building: "", room: ""},
        teacher: {nameZh: '', nameEn: ''},
        person: {nameZh: '', nameEn: ''},
        weekIndex: ""
      }],
      startTime: 0,
      endTime: 0,
      weekday: null,
      lessonId: null,
      cardGroupId: null,
      periods: 0
    }
  }
});
var CardList = Backbone.Collection.extend({
  model: Card,

  comparator: function(card1, card2) {
    if (card1.get('startTime') < card2.get('startTime')) return -1;
    if (card1.get('startTime') > card2.get('startTime')) return 1;
    if (card1.get('endTime') < card2.get('endTime')) return -1;
    if (card1.get('endTime') > card2.get('endTime')) return 1;
    return 0;
  }
});

//用于拖拽的临时Card
var tmp_card = null;

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
    this.$el.html(this.template(lessons.get(this.model.get('lessonId')).toJSON()));
    if (this.model) {
      this.$el.css("top", getHeightBetweenTimes(800, this.model.get('startTime')));
      this.$el.css("height", getHeightBetweenTimes(this.model.get('startTime'), this.model.get('endTime')));
    }

    this.$el.attr("draggable", "true");

    var units = this.timeTable.get('units');
    this.$el.resizable({
      handles: 's',
      grid: 5,
      minHeight: 50,
      maxHeight: getHeightBetweenTimes(_self.model.get('startTime'), units[units.length-1].endTime),
      preHeight: 0
    });

    this.delegateEvents();
    return this;
  },
  renderTempCard: function(model) {
    this.el.style.top = "0px";
    this.el.style.left = "-125px";
    document.body.appendChild(this.el);
  },
  cardClick: function() {
    this.eventBus.trigger('lesson:selected', this.model);
    this.eventBus.trigger('arg:lesson');
  },
  dragStart: function(event) {
    tmp_card = this.model;
    event.originalEvent.dataTransfer.setData("drag-type", "card");
    event.originalEvent.dataTransfer.setData("old-week-column", this.model.get('weekday'));

    this.el.style.opacity = '0.4';
    event.originalEvent.dataTransfer.setDragImage(tmp_cardView.el, tmp_cardView.$el.outerWidth()/2, tmp_cardView.$el.outerHeight()/2);
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

    var height = ui.size.height + getHeightBetweenTimes(800, startTime);
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
      if (nextUnit && height <= getHeightBetweenTimes(800, nextUnit.endTime) && height >= getHeightBetweenTimes(800, currentUnit.endTime)) {
        this.$el.css('height', getHeightBetweenTimes(startTime, nextUnit.endTime) + 'px');
        this.model.set('endTime', nextUnit.endTime);
        this.model.set('periods', this.model.get("periods") + 1 );
      } else {
        this.$el.css('height', getHeightBetweenTimes(startTime, currentUnit.endTime) + 'px');
      }
    } else {
      //收缩
      if (preUnit && height >= getHeightBetweenTimes(800, preUnit.endTime) && height <= getHeightBetweenTimes(800, currentUnit.endTime)-25) {
        this.$el.css('height', getHeightBetweenTimes(startTime, preUnit.endTime) + 'px');
        this.model.set('endTime', preUnit.endTime);
        this.model.set('periods', this.model.get("periods") - 1 );
      } else {
        this.$el.css('height', getHeightBetweenTimes(startTime, currentUnit.endTime) + 'px');
      }
    }

    this.$el.resizable("option", "preHeight", height);

  },
  resizeCardStop: function() {
    //重新渲染该cardView所在列
    this.eventBus.trigger('render:WeekdayColumn', this.model);
  }
});

//创建用于拖拽的临时cardView
var tmp_cardView = new CardView();
tmp_cardView.renderTempCard();

var LessonView = Backbone.View.extend({
  tagName: 'div',
  className: 'card',
  template: _.template($('#lesson-template').html()),
  events: {
    'dragstart': "dragStart",
    'click': "lessonClick"
  },
  initialize: function(options) {
    this.eventBus = options.eventBus;
    this.listenTo(this.eventBus, 'lesson:selected', this.lessonSelected);
    var $cards = $(".cards");
    $cards.append(this.render().el);
  },
  render: function() {
    var _self = this;
    this.$el.attr("draggable", "true");
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  dragStart: function(event) {
    this.highlight();
    this.eventBus.trigger('up:blankUnitZIndex');

    var card = new Card();
    card.set('lessonId', this.model.get('id'));
    card.set('periods', this.model.get('requiredPeriodInfo').periodsPerWeek);
    tmp_card = card;

    tmp_cardView.$el.html(tmp_cardView.dragTemplate(this.model.toJSON()));

    event.originalEvent.dataTransfer.setData("drag-type", "lesson");
    event.originalEvent.dataTransfer.setDragImage(tmp_cardView.el, tmp_cardView.$el.outerWidth()/2, tmp_cardView.$el.outerHeight()/2);
  },
  lessonClick: function() {
    this.eventBus.trigger('arg:lesson');
    this.lessonSelected();
  },
  lessonSelected: function(card) {
    if (card && card.get('lessonId') != this.model.get('id')) {
      return false
    }
    if (!card && this.$el.hasClass('selected')) {
      this.unhighlight();
    } else {
      this.highlight();
    }
  },
  highlight: function() {
    $(".card").removeClass('selected');
    this.$el.addClass('selected');
  },
  unhighlight: function() {
    this.$el.removeClass('selected');
  }
});

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
    this.listenTo(this.eventBus, 'render:WeekdayColumn', this.renderColumn);
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
    this.$el.height(getHeightBetweenTimes(units[0].startTime, units[units.length-1].endTime));
    return this;
  },
  dragOver: function(event) {
    //列监听dragover事件
    this.eventBus.trigger('up:highlightZIndex');
    event.preventDefault();
  },
  drop: function(event) {
    //列监听drop事件
    if (!tmp_card) {
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
    var unit_num = tmp_card.get("periods");
    if ($blankUnit.nextAll('.blank-unit:eq('+ (unit_num-2) +')').length == 0) {
      endTime = 1800;
      tmp_card.set("periods", $blankUnit.nextAll('.blank-unit').length + 1);
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

    tmp_card.set('weekday', currentColumnModel.get('weekday'));
    tmp_card.set('startTime', unitStartTime);
    tmp_card.set('endTime', endTime);
    if (!cardList.get(tmp_card.cid)) {
      var cardView = this.newCardView(tmp_card);
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
          return view.model.cid != tmp_card.cid;
        });
        oldColumnModel.set('cardViewList', oldCardViews);

        this.renderCardList(oldColumnModel);
      }
    } else {
      var newCardView = this.newCardView(tmp_card);
      var removed = _.filter(currentColumnCardViews, function(view) {
        return view.model.cid != tmp_card.cid;
      });
      removed.push(newCardView);
      currentColumnModel.set('cardViewList', removed);
      this.renderCardList(currentColumnModel);
    }

    tmp_card = null;
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
  renderColumn: function(card) {
    var columnModel = weekdayColumns.findWhere({weekday: card.get('weekday')});
    this.removeCardList(columnModel);
    this.renderCardList(columnModel);
    this.eventBus.trigger("restart:windowClick");
  },
  removeCardList: function(weekdayColumnModel) {
    var cardViewList = weekdayColumnModel.get('cardViewList');
    _.each(cardViewList, function(view) {
      view.remove();
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
        bubble.$el.css( 'left', (i / n)*100 + 1 + '%' );
        bubble.$el.css( 'width', block_width/n - 1 + '%');
        $weekdayColumn.prepend(bubble.render().$el);
      }
    }
  },
  renderColumn: function(card) {
    var currentColumnModel = weekdayColumns.findWhere({weekday: card.get('weekday')});
    this.removeCardList(currentColumnModel);
    this.renderCardList(currentColumnModel);
    this.eventBus.trigger("restart:windowClick");
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

    $hightLight.css('top', getHeightBetweenTimes(800, unitStartTime) + 'px');
    $hightLight.css('height', getHeightBetweenTimes(unitStartTime, endTime) + 'px');
    this.$el.append($hightLight);
    return $hightLight;
  },
  hideHighlightArea: function() {

  }
});
var WeekdayColumnModel = Backbone.Model.extend({
  defaults : function () {
    return {
      weekday: null,
      weekdayColumnView: null,
      cardViewList: []
    }
  }
});
var WeekdayColumnList = Backbone.Collection.extend({
  model: WeekdayColumnModel
});
var weekdayColumns = new WeekdayColumnList();

var WeekdayColumnListView = Backbone.View.extend({

  initialize: function(options) {
    this.options = options;
    this.eventBus = options.eventBus;

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
  }
});


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
      $segment.append("<span>" + getTimeText(this.startTime) + "<br/>~<br/>" + getTimeText(this.endTime) + "</span>");
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
          var restTime =  getHeightBetweenTimes(preEndTime, currentStartTime);
          $rest.css('height', restTime + 'px');
          $rest.css('line-height', restTime + 'px');
          $rest.append("<i class='fa fa-coffee'></i>");
          $unitLayout.append($rest);
        }
      }

      var $unit = $("<div></div>");
      var height = getHeightBetweenTimes(units[i].startTime, units[i].endTime);
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
          var restTime =  getHeightBetweenTimes(preEndTime, currentStartTime);

          $.each(weekdayColumns.models, function() {
            var $blank_rest = $("<div class='rest-time'></div>");
            $blank_rest.css('height', restTime + 'px');
            $blank_rest.css('line-height', restTime + 'px');
            this.get('weekdayColumnView').$el.append($blank_rest);
          });
        }
      }

      var blankHeight = getHeightBetweenTimes(units[i].startTime, units[i].endTime);
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
          if (!tmp_card) {
            return false;
          }
          var $blankUnit = $(event.target);

          tempHighlight = weekdayColumn.get('weekdayColumnView').showHighlightArea($blankUnit, tmp_card.get("periods"));

        }, false);

        //unit监听dragleave事件
        $blank[0].addEventListener('dragleave', function(event) {
          if (!tmp_card) {
            return false;
          }
          tempHighlight.remove();
        }, false);
      });
    }
  }
});

var WindowView = Backbone.View.extend({
  events: {
    "click": "cancelCardSelected",
    "click .hide-weekend": "hideWeekend"
  },
  initialize: function(options) {
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
      tmp_card = null;
    });
  },
  stopClick: function(event) {
    this.undelegateEvents();
  },
  restartClick: function() {
    this.delegateEvents();
  },
  cancelCardSelected: function(event) {
    if ($(event.target).hasClass('card-view') || $(event.target).parents('.card-view').length > 0) {
      return false;
    } else if ($(event.target).hasClass('card') || $(event.target).parents('.card').length > 0) {
      event.stopPropagation();
    } else {
      this.$el.find('.card').removeClass('selected');
    }
  },
  renderLesson: function() {
    var _self = this;
    $.each(this.options.lessons, function() {
      var lessonModel = new LessonModel(this);
      lessons.add(lessonModel);
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
