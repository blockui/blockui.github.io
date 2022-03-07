import React from "react"
import BasePage from "components/core/BasePage"

class RadioPage extends React.Component {
  render() {
    return (
      <BasePage title={"单选框"} back>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">单选框样式展示</h2>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells weui-cells_radio">
                <label className="weui-cell weui-cell_active weui-check__label" htmlFor="x11">
                  <div className="weui-cell__bd">
                    <p>cell standard</p>
                  </div>
                  <div className="weui-cell__ft">
                    <input type="radio" className="weui-check" name="radio1" id="x11"/>
                    <span className="weui-icon-checked"/>
                  </div>
                </label>
                <label className="weui-cell weui-cell_active weui-check__label" htmlFor="x12">

                  <div className="weui-cell__bd">
                    <p>cell standard</p>
                  </div>
                  <div className="weui-cell__ft">
                    <input type="radio" name="radio1" className="weui-check" id="x12"
                           checked="checked"/>
                    <span className="weui-icon-checked"/>
                  </div>
                </label>
                <div className="weui-cell weui-cell_active weui-cell_link">
                  <div className="weui-cell__bd">添加更多</div>
                </div>
              </div>
            </div>
          </div>
          <div className="weui-form__opr-area">
            <button className="weui-btn weui-btn_primary" id="showTooltips">确定</button>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default RadioPage
