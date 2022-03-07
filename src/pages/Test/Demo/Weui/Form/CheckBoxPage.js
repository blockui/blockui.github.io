import React from "react"
import BasePage from "components/core/BasePage"

class CheckBoxPage extends React.Component {
  render() {
    return (
      <BasePage title={"复选框"} back>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">复选框样式展示</h2>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells weui-cells_checkbox">
                <label className="weui-cell weui-cell_active weui-check__label" htmlFor="s11">
                  <div className="weui-cell__hd">
                    <input type="checkbox" className="weui-check" name="checkbox1" id="s11"
                           checked="checked"/>
                    <i className="weui-icon-checked"/>
                  </div>
                  <div className="weui-cell__bd">
                    <p>standard is dealt for u.</p>
                  </div>
                </label>
                <label className="weui-cell weui-cell_active weui-check__label" htmlFor="s12">
                  <div className="weui-cell__hd">
                    <input type="checkbox" name="checkbox1" className="weui-check" id="s12"/>
                    <i className="weui-icon-checked"/>
                  </div>
                  <div className="weui-cell__bd">
                    <p>standard is dealicient for u.</p>
                  </div>
                </label>
                <div className="weui-cell weui-cell_active weui-cell_link">
                  <div className="weui-cell__bd">添加更多</div>
                </div>
              </div>
            </div>
          </div>
          <div className="weui-form__opr-area">
            <button className="weui-btn weui-btn_primary" id="showTooltips">下一步</button>
          </div>
          <div className="weui-form__tips-area">
            <p className="weui-form__tips">
              点击下一步即表示<span className={"a"}>同意用户协议</span>
            </p>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default CheckBoxPage
