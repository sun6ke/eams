define([
  'models/card'
], function (Card) {
  'use strict';

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

  return CardList;
});
