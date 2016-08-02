/*global define*/
define([
  'models/card',
  'common'
], function (Card, common) {
  'use strict';

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
      common.tmp_card = card;

      common.tmp_cardView.renderTempCard();
      common.tmp_cardView.$el.html(common.tmp_cardView.dragTemplate(this.model.toJSON()));

      event.originalEvent.dataTransfer.setData("drag-type", "lesson");
      event.originalEvent.dataTransfer.setDragImage(common.tmp_cardView.el, common.tmp_cardView.$el.outerWidth()/10, common.tmp_cardView.$el.outerHeight()/10);
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

  return LessonView;

});
