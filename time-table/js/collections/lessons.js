define([
  'models/lesson'
], function (LessonModel) {
  'use strict';

  var Lessons = Backbone.Collection.extend({
    model: LessonModel
  });

  return new Lessons();
});
