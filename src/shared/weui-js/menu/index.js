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
import $, {afterHideMask, preShowMask} from '../util/util';
import {disableHistoryBackAction} from "shared/functions/common";

const tpl = `<div class="weui-menu-wrap <% if(isAndroid){ %>weui-skin_android <% } %><%= className %>">
    <div class="weui-mask_transparent"></div>
    <div class="weui-menu" style="<%= style %>">
        <div class="weui-actionsheet__menu">
            <% for(var i = 0; i < menus.length; i++){ %>
            <div class="btn_active weui-actionsheet__cell"><%= menus[i].label %></div>
            <% } %>
        </div>
    </div>
</div>
`
let _sington;

/**
 * menu 菜单
 * @param {array} menus 上层的选项
 * @param {string} menus[].label 选项的文字
 * @param {function} menus[].onClick 选项点击时的回调
 *
 * @param {object=} options 配置项
 * @param {string=} options.title actionSheet的title，如果isAndroid=true，则不会显示
 * @param {string=} options.className 自定义类名
 * @param {function=} [options.onClose] actionSheet关闭后的回调
 *
 * @example
 * weui.actionSheet([
 *     {
 *         label: '拍照',
 *         onClick: function () {
 *             console.log('拍照');
 *         }
 *     }, {
 *         label: '从相册选择',
 *         onClick: function () {
 *             console.log('从相册选择');
 *         }
 *     }, {
 *         label: '其他',
 *         onClick: function () {
 *             console.log('其他');
 *         }
 *     }
 * ], {
 *     className: 'custom-classname',
 *     onClose: function(){
 *         console.log('关闭');
 *     }
 * });
 */
function index(menus = [], options = {}, e) {
  if (_sington) return _sington;
  const isAndroid = $.os.android;
  options = $.extend({
    menus: menus,
    title: '',
    className: '',
    isAndroid: isAndroid,
    onClose: $.noop
  }, options);

  const {currentTarget} = e
  const {clientWidth, offsetWidth, offsetHeight} = currentTarget
  const right = offsetWidth - clientWidth;
  const style = `position:fixed;top:${offsetHeight + 4}px;right:${right + 8}px`
  //debugger
  const $actionSheetWrap = $($.render(tpl, {...options, style}));
  const $actionSheet = $actionSheetWrap.find('.weui-menu');
  const $actionSheetMask = $actionSheetWrap.find(".weui-mask_transparent");

  function _hide(callback) {
    _hide = $.noop; // 防止二次调用导致报错
    afterHideMask()
    disableHistoryBackAction(false)
    $actionSheet.addClass('weui-animate-fade-out');
    $actionSheetMask
      .addClass('weui-animate-fade-out')
      .on('animationend webkitAnimationEnd', function () {
        $actionSheetWrap.remove();
        _sington = false;
        options.onClose();

        callback && callback();
      });
  }

  function hide(callback) {
    _hide(callback);
  }

  disableHistoryBackAction(true)
  preShowMask()
  $('body').append($actionSheetWrap);

  // 这里获取一下计算后的样式，强制触发渲染. fix IOS10下闪现的问题
  $.getStyle($actionSheet[0], 'transform');

  $actionSheet.addClass('weui-animate-fade-in');
  $actionSheetMask
    .addClass('weui-animate-fade-in')
    .on('click', function () {
      hide();
    });
  $actionSheetWrap.find('.weui-actionsheet__menu').on('click', '.weui-actionsheet__cell', function (evt) {
    const index = $(this).index();
    menus[index].onClick.call(this, evt);
    setTimeout(() => {
      hide();
    }, 1000)
  });

  _sington = $actionSheetWrap[0];
  _sington.hide = hide;
  return _sington;
}

export default index;
