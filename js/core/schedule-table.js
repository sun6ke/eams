+function ($) {
  'use strict';

  var Activity = Backbone.Model.extend({
    defaults: function() {
      return {
        activityId: null,
        weekdayIndex: 0,
        startTime: null,
        endTime: null,
        weeks: [],
        content: ""
      };
    }
  });

  var Activities = Backbone.Collection.extend({
    model : Activity,

    getActivity: function(id) {
      return this.where({activityId:id})[0];
    },
    contains: function(id) {
      return this.where({activityId:id}).length != 0;
    }
  });

  var activities = new Activities;

  var TableView = Backbone.View.extend({
    events: {
      "click td.enable" : "clickTd",
      "mouseover td.enable" : "hoverTd"
    },
    initialize: function(options) {
      this.options = options;
      this.listenTo(activities, 'add', this.addOne);
      this.clickCallback = this.options.clickCallback;
      this.hoverCallback = this.options.hoverCallback;
      this.render();
      $.each(this.options.activities, function() {
        var activity = new Activity();
        activity.set('activityId', this.id);
        activity.set('weekdayIndex', this.weekdayIndex);
        activity.set('startTime', this.startTime);
        activity.set('endTime', this.endTime);
        activity.set('weeks', this.weeks);
        activity.set('content', this.content);
        activities.add(activity);
      });
    },
    render: function() {

      if (this.$el.find("tbody").length == 0) {
        this.$el.append($('<tbody></tbody>'));
      }

      var self = this;
      var rows = self.options.units;
      var columns = self.options.weekdays;
      if (self.options.invert) {
        rows = self.options.weekdays;
        columns = self.options.units;
      }

      var $tbody = this.$el.find("tbody");
      $tbody.append('<tr><td></td></tr>');

      //渲染列标题
      $.each(columns, function(i, column) {
        $tbody.find("tr:first").append("<td>" + column.title + "</td>");
      });

      //渲染表格
      $.each(rows, function(rindex, row) {
        $tbody.append('<tr></tr>');
        var $tr = $tbody.find("tr:eq("+(rindex+1)+")");
        $tr.append('<td>' + row.title + '</td>');
        $.each(columns, function(cindex, column) {
          var width = Math.round((100-10)/columns.length);
          var $td = $('<td width=' + width + '%></td>');
          var rowid = rindex + 1;
          var columnid = cindex + 1;
          $td.attr({"data-rowid":rowid, "data-columnid": columnid});
          $td.data("highlight", false);
          if (rowid != 0 && columnid != 0) {
            $td.addClass("enable");
          }
          $tr.append($td);
        });
      });

      //渲染禁用disabled的格子
      $.each(self.options.disabled, function() {
        var $disabledTd = $(self.$el.find('[data-rowid='+this.rowid+']')[this.columnid-1]);
        $disabledTd.removeClass("enable");
        $disabledTd.addClass("active");
        $disabledTd.addClass("disable");
      });

      //插入休息时间
      $.each(self.options.restUnits, function() {
        var restUnit = this;
        var $titleTd = $("<td class='active'></td>");
        $titleTd.html(restUnit.title);
        if (self.options.invert) {
          var firstRow = $tbody.find("tr:eq(0)");
          firstRow.find("td:eq(" + restUnit.afterUnit + ")").after($titleTd);
          $tbody.find("tr:eq(1)")
            .find("td:eq(" + restUnit.afterUnit + ")")
            .after("<td class='active' rowspan='" + columns.length + "'></td>");
        } else {
          var $restUnit = $("<tr class='active'></tr>");
          $restUnit.append($titleTd);
          $restUnit.append("<td colspan='" + columns.length + "'></td>");
          $tbody.find("tr:eq(" + restUnit.afterUnit + ")").after($restUnit);
        }
      });
      return this;
    },
    addOne: function(activity) {
      var self = this;
      var unitIds = [];
      $.each(self.options.units, function(index, unit) {
        if ((activity.get('startTime') >= unit.startTime && activity.get('startTime') < unit.endTime) ||
          (activity.get('endTime') > unit.startTime && activity.get('endTime') <= unit.endTime) ||
          (activity.get('startTime') <= unit.startTime && activity.get('endTime') >= unit.endTime)) {
          unitIds.push(index+1);
        }
      });
      $.each(unitIds, function() {
        var trDom = self.$el.find('[data-rowid='+this+']');
        if (self.options.invert) {
          trDom = self.$el.find('[data-columnid='+this+']');
        }
        var activityDom = trDom[activity.get('weekdayIndex')-1];

        var content = $(activityDom).html();
        var isCollision = false;
        var id = activity.get('activityId');
        if (!$(activityDom).hasClass("disable")) {
          if ($(activityDom).data("id")) {
            var ids = $(activityDom).attr("data-id").split(',');
            $.each(ids, function(index, id) {
              var old_activity = activities.getActivity(parseInt(id));
              var weeks = activity.get('weeks');
              $.each(old_activity.get('weeks'), function(i, week) {
                if (weeks.indexOf(this) != -1) {
                  isCollision = true;
                }
              });
            });
            id += "," + $(activityDom).data("id");
          }
          $(activityDom).attr("data-id", id);
          $(activityDom).addClass("schedule-table-activity");
          if (isCollision) {
            $(activityDom).removeClass("schedule-table-activity");
            $(activityDom).addClass("schedule-table-collision");
          }
          content += activity.get('content') + "<br/>";
          $(activityDom).html(content);
        }
      });
    },
    highlight: function(columnid, rowid) {
      var $td = $(this.$el.find('[data-rowid='+rowid+']')[columnid-1]);
      $td.removeClass("schedule-table-collision").removeClass("schedule-table-activity").addClass("schedule-table-highlight");
    },
    unhighlight: function(columnid, rowid) {
      var $td = $(this.$el.find('[data-rowid='+rowid+']')[columnid-1]);

      $td.removeClass("schedule-table-highlight")
      var tdIds = $td.attr("data-id");
      if (tdIds) {
        var isCollision = tdIds.split(",").length > 1;
        if (isCollision) {
          $td.addClass("schedule-table-collision");
        } else {
          $td.addClass("schedule-table-activity");
        }
      }
    },
    highlightList: function() {
      return this.$el.find("td.schedule-table-highlight");
    },
    addActivity: function(new_activity) {
      var activity = new Activity();
      activity.set('activityId', new_activity.id);
      activity.set('weekdayIndex', new_activity.weekdayIndex);
      activity.set('startTime', new_activity.startTime);
      activity.set('endTime', new_activity.endTime);
      activity.set('weeks', new_activity.weeks);
      activity.set('content', new_activity.content);
      activities.add(activity);
    },
    getActivity: function(id) {
      return activities.getActivity(id);
    },
    getActivities: function() {
      return JSON.stringify(activities);
    },
    removeActivity: function(id) {
      var self = this;
      var activity = activities.getActivity(id);
      if (activity) {
        activity.destroy();
        this.destroy();
        activities.each(function(activity, i) {
          self.addOne(activity)
        });
      }
    },
    invert: function() {
      var self = this;
      this.options.invert = !(this.options.invert);
      this.destroy();
      activities.each(function(activity, i) {
        self.addOne(activity)
      });
    },
    destroy: function() {
      this.$el.empty();
      this.render();
    },
    clickTd: function(event) {
      if (this.clickCallback) {
        this.clickCallback(event);
      }
    },
    hoverTd: function(event) {
      if (this.hoverCallback) {
        this.hoverCallback(event);
      }
    }
  });

  var ScheduleTable = function (element, options) {

    this.options = options;

    this.$table = $(element);

    this.initTable();

  }

  ScheduleTable.VERSION = '0.0.1'

  ScheduleTable.prototype.initTable = function() {

    var self = this;

    this.tableView = new TableView({
      el : jQuery(self.$table),
      units : self.options.units,
      weekdays : self.options.weekdays,
      activities: self.options.activities,
      clickCallback: self.options.clickCallback,
      hoverCallback: self.options.hoverCallback,
      invert: self.options.invert,
      disabled: self.options.disabled,
      restUnits: self.options.restUnits
    });
  }

  /** 得到Activity */
  ScheduleTable.prototype.getActivity = function(activityId) {
    var activity = this.tableView.getActivity(activityId);
    return JSON.stringify(activity);
  }

  /** 添加activity */
  ScheduleTable.prototype.addActivity = function(activityJson) {
    this.tableView.addActivity(activityJson);
  }

  /** 删除activity */
  ScheduleTable.prototype.removeActivity = function(activityId) {
    this.tableView.removeActivity(activityId);
  }

  /** 根据rowid和columnid删除activities */
  ScheduleTable.prototype.removeActivities = function(columnid, rowid) {
    var self = this;
    var $unit = $(this.$table.find('[data-rowid='+rowid+']')[columnid-1]);
    var ids = $unit.attr('data-id');
    if (ids && ids.split(',').length != 0) {
      $.each(ids.split(','), function() {
        self.tableView.removeActivity(parseInt(this));
      });
    }
  }

  /** 得到Activities的json字符串 */
  ScheduleTable.prototype.getActivities = function() {
    return this.tableView.getActivities();
  }

  /** 高亮 */
  ScheduleTable.prototype.highlight = function (columnid, rowid) {
    this.tableView.highlight(columnid, rowid);
  }

  /** 取消高亮 */
  ScheduleTable.prototype.unhighlight = function (columnid, rowid) {
    this.tableView.unhighlight(columnid, rowid);
  }

  ScheduleTable.prototype.toogleHighlight = function(columnid, rowid) {
    var $td = $(this.$table.find('[data-rowid='+rowid+']')[columnid-1]);
    if ($td.hasClass('schedule-table-highlight')) {
      $("#table").scheduleTable('unhighlight', columnid, rowid);
    } else {
      $("#table").scheduleTable('highlight', columnid, rowid);
    }
  }

  /** 找到所有高亮的td */
  ScheduleTable.prototype.highlightList = function () {
    return this.tableView.highlightList();
  }

  /** 取消所有的高亮 */
  ScheduleTable.prototype.CancelAllHighlight = function() {
    var self = this;
    var $tds = this.highlightList();
    $.each($tds, function() {
      self.unhighlight($(this).data('columnid'), $(this).data('rowid'));
    });
  }

  /** 倒置 */
  ScheduleTable.prototype.invert = function() {
    this.tableView.invert(this.options);
    this.options.invert = !(this.options.invert);
  }

  // PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    var args = arguments;
    var ret;
    this.each(function () {
      var $this = $(this)
      var data  = $this.data('scheduleTable')
      if (!data) {
        var options = $.extend(true, {}, $.fn.scheduleTable.defaults, typeof option == 'object' && option);
        $this.data('scheduleTable', (data = new ScheduleTable(this, options)));
      }

      if (typeof option == 'string') {
        if (args.length == 1) {
          var _ret = data[option].call(data);
          if (typeof _ret != 'undefined') {
            ret = _ret;
          }
        } else {
          var _ret = data[option].apply(data, Array.prototype.slice.call(args, 1));
          if (typeof _ret != 'undefined') {
            ret = _ret;
          }
        }
      }
    })

    if (typeof ret != 'undefined') {
      return ret;
    }
    return this;
  }

  var old = $.fn.scheduleTable

  $.fn.scheduleTable             = Plugin
  $.fn.scheduleTable.Constructor = ScheduleTable
  $.fn.scheduleTable.defaults = {

    locale: 'zh-CN',

    weekdays: [],

    units: [],

    activities: [],

    disabled:[],

    restUnits: [],

    invert: false,

    clickCallback: null,

    hoverCallback: null
  }

  $.fn.scheduleTable.locales = {}

  // =================

  $.fn.scheduleTable.noConflict = function () {
    $.fn.scheduleTable = old;
    return this;
  }

}(jQuery);

+function ($) {

  $.fn.scheduleTable.locales['en-US'] = {

    weekdays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    units: 'unit'

  }

}(jQuery);

+function ($) {

  $.fn.scheduleTable.locales['zh-CN'] = {

    weekdays: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    units: '小节'

  }

}(jQuery);
