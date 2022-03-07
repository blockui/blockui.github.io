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

import $ from '../util/util';
import {disableHistoryBackAction} from "shared/functions/common";

const tpl = `<div class="<%= className %>">
    <% if(useMask){ %>
    <div class="weui-mask_transparent"></div>
    <% } %>
    <div class="weui-toast <%= textMoreClassName%> <%= textOnlyClassname%>">
        <% if(!hideIcon){ %>
           <i class="weui-icon_toast <%= iconClassName%>"></i>
        <% } %>
        <p class="weui-toast__content"><%=content%></p>
    </div>
</div>
`
let _sington;

/* eslint-disable */
/**
 * toast 一般用于操作成功时的提示场景
 * @param {string} content toast的文字
 * @param {Object|function=} options 配置项或回调
 * @param {number=} [options.duration=2000] 多少毫秒后关闭toast
 * @param {string=} [options.type=success] Icon类型 success ｜ warn
 * @param {boolean=} [options.hideIcon=false] Icon是否显示
 * @param {function=} options.callback 关闭后的回调
 * @param {string=} options.className 自定义类名
 *
 * @example
 * weui.toast('操作成功', 3000);
 * weui.toast('操作成功', {
 *     duration: 2000,
 *     className: 'custom-classname',
 *     callback: function(){ console.log('close') }
 * });
 */
function toast(content = '', options = {}) {
  if (_sington) return _sington;

  if (typeof options === 'number') {
    options = {
      duration: options
    };
  }

  if (typeof options === 'function') {
    options = {
      callback: options
    };
  }

  const defaultType = "success"

  const icons = {
    success: "weui-icon-success-no-circle",
    warn: "weui-icon-warn"
  }

  options = $.extend({
    content: content,
    duration: 1000,
    useMask: true,
    callback: $.noop,
    className: '',
    hideIcon: false,
    textOnlyClassname: options['hideIcon'] ? "weui-toast_text" : "",
    textMoreClassName: content.length > 5 ? "weui-toast_text-more" : "",
    iconClassName: icons[options['type'] || defaultType]
  }, options);

  const $toastWrap = $($.render(tpl, options));
  const $toast = $toastWrap.find('.weui-toast');
  disableHistoryBackAction(true)
  $('body').append($toastWrap);
  let $mask;
  if (options['useMask']) {
    $mask = $toastWrap.find('.weui-mask');
    $mask.addClass('weui-animate-fade-in');
  }
  $toast.addClass('weui-animate-fade-in');
  setTimeout(() => {
    if (options['useMask']) {
      $mask.addClass('weui-animate-fade-out');
    }
    $toast
      .addClass('weui-animate-fade-out')
      .on('animationend webkitAnimationEnd', function () {
        $toastWrap.remove();
        _sington = false;
        disableHistoryBackAction(false)
        options.callback();
      });
  }, options.duration);

  _sington = $toastWrap[0];
  return $toastWrap[0];
}

export default toast;
