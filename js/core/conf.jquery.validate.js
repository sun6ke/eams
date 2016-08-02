/*
 jquery validation plugin 配置
 */
$.validator.setDefaults({

  // error message class
  errorClass: 'text-danger',
  // only ignore .ignore element, default is :hidden
  ignore: ".ignore",
  // title is not considered in error message
  ignoreTitle: true,

  onfocusout: false,
  onkeyup: false,
  onclick: false,

  errorPlacement: function(error, element) {
    var $element = $(element);
    var $form = $element.closest('form');
    var $elementContainer = $element.closest('.form-group');

    if ($elementContainer.length > 0) {
      // bs form

      if ($form.is('.form-horizontal')) {
        // horizontal form

        if (element.is(':checkbox') || element.is(':radio')) {

          error.appendTo($element.parent().parent().parent());

        } else {

          if ($element.parent().is('.input-group')) {
            error.insertAfter($element.parent());
          } else {
            error.appendTo($element.parent());
          }

        }

      } else if ($form.is('.form-inline')) {
        // inline form

        if (element.is(':checkbox') || element.is(':radio')) {

          error.appendTo($element.parent().parent().parent());

        } else {
          if ($element.parent().is('.input-group')) {
            error.insertAfter($element.parent());
          } else {
            error.insertAfter($element);
          }
        }

      } else {

        // default bs form
        error.addClass('pull-right').insertAfter($elementContainer.find('label.control-label'));

      }

      return;

    }

    // common form
    error.insertAfter(element);
  },

  highlight: function(element) {
    $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
  },

  unhighlight: function(element) {
    $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
  }

});
