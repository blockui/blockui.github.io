import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";
import WeCellSelect from "shared/weui/WeCellSelect";

const {$} = window;

class SelectModalPage extends React.Component {
  componentDidMount() {

    $('#showPhone').on('click', function () {
      weui.picker([{
        label: '+86',
        value: 0
      }, {
        label: '+80',
        value: 1
      }, {
        label: '+84',
        value: 2
      }, {
        label: '+87',
        value: 3
      }], {
        onChange: function (result) {
          console.log(result);
        },
        onConfirm: function (result) {
          console.log(result);
        },
        title: '单列选择器'
      });
    });
    $('#showPicker').on('click', function () {
      weui.picker([{
        label: '飞机票',
        value: 0
      }, {
        label: '火车票',
        value: 1
      }, {
        label: '的士票',
        value: 2
      }, {
        label: '公交票 (disabled)',
        disabled: true,
        value: 3
      }, {
        label: '其他',
        value: 4
      }], {
        onChange: function (result) {
          console.log(result);
        },
        onConfirm: function (result) {
          console.log(result);
        },
        title: '单列选择器'
      });
    });
    $('#showDatePicker').on('click', function () {
      weui.datePicker({
        start: 1990,
        end: new Date().getFullYear(),
        onChange: function (result) {
          console.log(result);
        },
        onConfirm: function (result) {
          console.log(result);
        },
        title: '多列选择器'
      });
    });
  }

  render() {
    return (
      <BasePage back title={"模拟选择框"}>
        <div className="">

          <div className="weui-form">
            <div className="weui-form__text-area">
              <h2 className="weui-form__title">模拟选择框</h2>
              <div className="weui-form__desc">用于丰富原生选择框结构，使其更具有扩展性</div>
            </div>
            <div className="weui-form__control-area">
              <div className="weui-cells__group weui-cells__group_form">
                <div className="weui-cells">
                  <div className="weui-cell weui-cell_active weui-cell_access" id="showDatePicker">
                    <div className="weui-cell__bd">日期</div>
                    <div className="weui-cell__ft"></div>
                  </div>
                  <div
                    className="weui-cell weui-cell_active weui-cell_access weui-cell_select weui-cell_select-before">
                    <div className="weui-cell__hd" id="showPhone"><label
                      className="weui-label">+86</label></div>
                    <div className="weui-cell__bd">
                      <input className="weui-input" type="number" pattern="[0-9]*"
                             placeholder="请输入号码" value="12345678907"/>
                    </div>
                  </div>
                  <WeCellSelect label={"票种"} value={"的士票"}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default SelectModalPage
