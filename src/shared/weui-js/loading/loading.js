/*
* Tencent is pleased to support the open source community by making WeUI.js available.
*
* Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
*
* Licensed under the MIT License (the "License"); you may not use this file except in compliance
* with the License. You may obtain a copy of the License at
*
*       http://opensource.org/licenses/MIT
*
* Unless required by applicable law or agreed to in writing, software distributed under the License is
* distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
* either express or implied. See the License for the specific language governing permissions and
* limitations under the License.
*/
/* eslint-disable */
import $ from '../util/util';
import {disableHistoryBackAction} from "shared/functions/common";

const tpl = `<div class="weui-loading_toast <%= className %>">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
        <% if(!primary){ %>
            <i class="weui-loading weui-icon_toast"></i>
        <% }else{ %>
            <span class="weui-primary-loading weui-icon_toast">
                <span class="weui-primary-loading__dot"></span>
            </span>
        <% } %>
        <p class="weui-toast__content"><%=content%></p>
    </div>
</div>
`
let _sington;

/**
 * loading
 * @param {string} content loading的文字
 * @param {object=} options 配置项
 * @param {number=} [options.duration=15000] 多少毫秒后关闭toast
 * @param {string=} options.className 自定义类名
 * @param {boolean=} options.primary=true 自定义类名
 *
 * @example
 * var loading = weui.loading('loading', {
 *     className: 'custom-classname'
 * });
 * setTimeout(function () {
 *     loading.hide(function() {
 *          console.log('`loading` has been hidden');
 *      });
 * }, 3000);
 */
function loading(content = '', options = {}) {
  if (_sington) return _sington;

  options = $.extend({
    content: content,
    primary: true,
    statusBarNotChangeColor: false,
    className: '',
    duration: 30000
  }, options);

  const $loadingWrap = $($.render(tpl, options));
  const $loading = $loadingWrap.find('.weui-toast');
  const $mask = $loadingWrap.find('.weui-mask');

  function _hide(callback) {
    _hide = $.noop; // 防止二次调用导致报错
    disableHistoryBackAction(false)
    // afterHideMask()
    $mask.addClass('weui-animate-fade-out');
    $loading
      .addClass('weui-animate-fade-out')
      .on('animationend webkitAnimationEnd', function () {
        $loadingWrap.remove();
        _sington = false;
        callback && callback();
      });
  }

  function hide(callback) {
    _hide(callback);
  }

  disableHistoryBackAction(true)
  if (!options['statusBarNotChangeColor']) {
    // preShowMask()
  }

  $('body').append($loadingWrap);
  $loading.addClass('weui-animate-fade-in');
  $mask.addClass('weui-animate-fade-in');
  setTimeout(() => {
    _hide()
  }, options.duration);
  _sington = $loadingWrap[0];
  _sington.hide = hide;
  return _sington;
}

export default loading;
