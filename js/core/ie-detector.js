+function ($) {

  var ieDetector = {

    /**
     * 获得IE浏览器的版本
     * @returns {number}
     */
    getVersion: function () {
      // Returns the version of Internet Explorer or a -1
      // (indicating the use of another browser).
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          rv = parseFloat(RegExp.$1);
      }
      return rv;
    },

    /**
     * 判断IE浏览器版本是否低于9（不包含9）
     * @returns {boolean}
     */
    isLowerThan9: function isLowerThan9() {
      var ver = this.getVersion();
      if (ver > -1) {
        if (ver < 9.0) {
          return true;
        }
      }
      return false;
    }

  };

  $.ieDetector = ieDetector;

}(jQuery);


