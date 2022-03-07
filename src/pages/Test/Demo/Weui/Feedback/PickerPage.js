import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

class PickerPage extends React.Component {

  render() {
    return (
      <BasePage back title={"Picker"}>
        <div className="mt_64">
          <button onClick={() => weui.picker([
            {
              label: '飞机票',
              value: 0,
              disabled: true // 不可用
            },
            {
              label: '火车票',
              value: 1
            },
            {
              label: '汽车票',
              value: 3
            },
            {
              label: '公车票',
              value: 4,
            }
          ], {
            className: 'custom-classname',
            container: 'body',
            defaultValue: [3],
            onChange: function (result) {
              console.log(result)
            },
            onConfirm: function (result) {
              console.log(result)
            },
            id: 'singleLinePicker'
          })} className="weui-btn weui-btn_default" id="showPicker">单列选择器
          </button>
          <button onClick={() => weui.datePicker({
            start: 1990,
            end: 2000,
            defaultValue: [1991, 6, 9],
            onChange: function (result) {
              console.log(result);
            },
            onConfirm: function (result) {
              console.log(result);
            },
            id: 'datePicker'
          })} className="weui-btn weui-btn_default" id="showDatePicker">日期选择器
          </button>
        </div>
      </BasePage>
    )
  }
}

export default PickerPage
