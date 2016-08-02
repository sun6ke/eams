/* ========================================================================
 * eams-ui: adaptive-height-iframe.js v0.0.1
 * ======================================================================== */
$(function() {

  // 自适应iframe高度
  if (window.frameElement) {

    var paddingPenalty = 60;
    var containerMinHeight = 1000;

    var $window = $(window);
    var $body = $(window.document.body);
    var $parentFrame = $(window.frameElement);
    var $parentFrameContainer = $parentFrame.parent();

    var parentFrameContainerOriginHeight = $parentFrameContainer.height();

    var parentFrameHeight = parentFrameContainerOriginHeight + paddingPenalty;

    // 自适应parent frame高度的function
    var resizeParentFrame = function(newHeight) {
      if ($parentFrame.is(':hidden')) {
        return;
      }
      if (parent.window.frameElement) {
        var $nestedParentFrame = $(parent.window.frameElement);
        var $nestedParentFrameContainer = $nestedParentFrame.parent();
        var nestedParentFrameHeight = $nestedParentFrameContainer.outerHeight();

        if ($nestedParentFrame.is(':hidden')) {
          return;
        }
        var tempHeight = newHeight;
        tempHeight += paddingPenalty;
        if (parentFrameHeight && (parentFrameHeight < nestedParentFrameHeight)) {
          $nestedParentFrameContainer.css('height', tempHeight <= parentFrameHeight ? parentFrameHeight : tempHeight);
        } else {
          $nestedParentFrameContainer.css('height', tempHeight <= nestedParentFrameHeight ? nestedParentFrameHeight : tempHeight);
        }
      }

      newHeight += paddingPenalty;
      $parentFrameContainer.css('height', newHeight <= containerMinHeight ? containerMinHeight : newHeight);
    }

    // iframe关闭的时候，取消iframe的高度
    $window.unload(function() {
      $parentFrameContainer.css('height', parentFrameContainerOriginHeight);
    });

    // 页面加载的完毕后，调整iframe高度
    //resizeParentFrame($body.height());
    resizeParentFrame(containerMinHeight);

    // 每隔500ms侦测body实际内容高度是否发生变化
    var checkBodyHeight = function(){
      var lastHeight = containerMinHeight, newHeight, timer;
      (function run(){

        if (!$parentFrame.is(':hidden')) {
          newHeight = $body.height();
          if (newHeight > parseInt($parentFrame.parent().css("height").replace("px", ""))) {
            $parentFrame.parent().css("height", newHeight);
          }
          if( newHeight > lastHeight ) {
            resizeParentFrame(newHeight);
          }
          lastHeight = newHeight + paddingPenalty;
        }

        timer = setTimeout(run, 200);

      })();
    }
    checkBodyHeight();

  }

});
