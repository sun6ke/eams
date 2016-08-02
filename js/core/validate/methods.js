// 这里放所有定制的validate方法
$.validator.addMethod("assert", function(value, element, param) {
  if (_.isFunction(param)) {
    return param(value, element);
  }
  return param;
}, 'Assertion failed');

$.validator.addMethod("posInteger", function(value, element) {
  return this.optional(element) || ( /^\d+$/.test(value) && parseInt(value, 10) > 0 );
}, "A positive non-decimal number please");

$.validator.addMethod("posNumber", function(value, element) {
  return this.optional(element) || ( /^(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) && parseFloat(value) > 0 );
}, "A positive decimal number please");


$.validator.addMethod("zeroOrPosInteger", function(value, element) {
  return this.optional(element) || /^\d+$/.test(value);
}, "Zero or positive non-decimal number please");

$.validator.addMethod("zeroOrPosNumber", function(value, element) {
  return this.optional(element) || /^(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}, "Zero or positive decimal number please");

