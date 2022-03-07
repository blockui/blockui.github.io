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
import dialog from '../dialog/dialog';

/**
 * 输入弹窗
 * @param {object=} options 配置项
 * @param {string=} options.title 弹窗的标题
 * @param {string=} options.content 弹窗的说明
 * @param {string=} options.className 自定义类名
 *
 */
function prompt({title, content, checkField, inputVal, inputType, className, useInput, ...opt}) {
  return new Promise((resolve) => {
    const options = $.extend({
      title,
      content,
      useInput,
      inputType,
      className,
      inputVal,
      buttons: [{
        label: '取消',
        type: 'default'
      }, {
        label: '确定',
        type: 'primary',
        onClick: (e, value, hide) => {
          if (checkField) {
            const res = checkField(value);
            if (checkField && !checkField(value)) {
              return false;
            }
            resolve({value: res, hide})
          } else {
            resolve({value, hide})
          }
        }
      }]
    }, opt);
    return dialog(options);
  })

}

export default prompt;
