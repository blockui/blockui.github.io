const {$} = window;

export function fastClick() {
  var supportTouch = function () {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }();
  var _old$On = $.fn.on;

  $.fn.on = function () {
    if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // åªæ‰©å±•æ”¯æŒtouchçš„å½“å‰å…ƒç´ çš„clickäº‹ä»¶
      var touchStartY, callback = arguments[1];
      _old$On.apply(this, ['touchstart', function (e) {
        touchStartY = e.changedTouches[0].clientY;
      }]);
      _old$On.apply(this, ['touchend', function (e) {
        if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

        e.preventDefault();
        callback.apply(this, [e]);
      }]);
    } else {
      _old$On.apply(this, arguments);
    }
    return this;
  };
}

export function androidInputBugFix() {
  // .container è®¾ç½®äº† overflow å±žæ€§, å¯¼è‡´ Android æ‰‹æœºä¸‹è¾“å…¥æ¡†èŽ·å–ç„¦ç‚¹æ—¶, è¾“å…¥æ³•æŒ¡ä½è¾“å…¥æ¡†çš„ bug
  // ç›¸å…³ issue: https://github.com/weui/weui/issues/15
  // è§£å†³æ–¹æ³•:
  // 0. .container åŽ»æŽ‰ overflow å±žæ€§, ä½†æ­¤ demo ä¸‹ä¼šå¼•å‘åˆ«çš„é—®é¢˜
  // 1. å‚è€ƒ http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
  //    Android æ‰‹æœºä¸‹, input æˆ– textarea å…ƒç´ èšç„¦æ—¶, ä¸»åŠ¨æ»šä¸€æŠŠ
  if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    })
  }
}
