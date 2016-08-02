/* ========================================================================
 * eams-ui: closable.js v0.0.1
 * ======================================================================== */


+function ($) {
  'use strict';

  // CLOSABLE CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="closable"]'
  var Closable   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Closable.VERSION = '3.3.4'

  Closable.TRANSITION_DURATION = 150

  Closable.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.closable')
    }

    $parent.trigger(e = $.Event('close.bs.closable'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.closable').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Closable.TRANSITION_DURATION) :
      removeElement()
  }


  // CLOSABLE PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.closable')

      if (!data) $this.data('bs.closable', (data = new Closable(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.closable

  $.fn.closable             = Plugin
  $.fn.closable.Constructor = Closable


  // CLOSABLE NO CONFLICT
  // =================

  $.fn.closable.noConflict = function () {
    $.fn.closable = old
    return this
  }


  // CLOSABLE DATA-API
  // ==============

  $(document).on('click.bs.closable.data-api', dismiss, Closable.prototype.close)

}(jQuery);
