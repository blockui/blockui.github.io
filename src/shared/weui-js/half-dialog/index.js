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

const tpl = `<div class="<%=className%>" >
    <div class="weui-mask"></div>
    <div class="weui-half-screen-dialog weui-half-screen-dialog_show">
        <div class="weui-half-screen-dialog__hd">
            <div class="weui-half-screen-dialog__hd__side">
                <button class="weui-icon-btn">关闭<i class="weui-icon-close-thin"></i></button>
            </div>
            <div class="weui-half-screen-dialog__hd__main">
                <strong class="weui-half-screen-dialog__title"><%=title%></strong>
            </div>
        </div>
        <div class="weui-half-screen-dialog__bd" id="<%=id%>" />
    </div>
</div>`
let _sington;

/**
 * dialog，弹窗，alert和confirm的父类
 *
 * @param {object=} options 配置项
 * @param {string=} options.id content Id
 * @param {string=} options.title 弹窗的标题
 * @param {string=} options.className 弹窗的自定义类名
 *
 *
 * @example
 * weui.halfDialog({
 *     title: 'dialog标题',
 *     id: 'content_id',
 *     className: 'custom-classname']
 * });
 *
 * // 主动关闭
 * var $dialog = weui.halfDialog({...});
 * $dialog.hide(function(){
 *      console.log('`halfDialog` has been hidden');
 * });
 */
function index(options = {}) {
  if (_sington) return _sington;
  options = $.extend({
    title: null,
    id: '',
    className: '',
    onClose: $.noop,
  }, options);
  const {onClose} = options

  const $dialogWrap = $($.render(tpl, options));
  const $dialog = $dialogWrap.find('.weui-half-screen-dialog');
  const $mask = $dialogWrap.find('.weui-mask');

  function _hide(callback) {
    _hide = $.noop; // 防止二次调用导致报错

    $mask.addClass('weui-animate-fade-out');
    $dialog
      .addClass('weui-animate-fade-out')
      .on('animationend webkitAnimationEnd', function () {
        onClose && onClose()
        $dialogWrap.remove();
        _sington = false;
        callback && callback();
      });
  }

  function hide(callback) {
    _hide(callback);
  }

  $('body').append($dialogWrap);
  // 不能直接把.weui-animate-fade-in加到$dialog，会导致mask的z-index有问题
  $mask.addClass('weui-animate-fade-in');
  $dialog.addClass('weui-animate-fade-in');

  $dialogWrap.find(".weui-icon-btn")
    .on('click', function (evt) {
      hide();
    });

  $mask
    .on('click', function (evt) {
      hide();
    });

  _sington = $dialogWrap[0];
  _sington.hide = hide;
  return _sington;
}

export default index;
