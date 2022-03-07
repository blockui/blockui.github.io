import React from "react"
import BasePage from "components/core/BasePage"

class SwitchPage extends React.Component {
  render() {
    return (
      <BasePage back title={"开关"}>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">开关样式展示</h2>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells weui-cells_form">
                <div className="weui-cell weui-cell_active weui-cell_switch">
                  <div className="weui-cell__bd">标题文字</div>
                  <div className="weui-cell__ft">
                    <input className="weui-switch" type="checkbox"/>
                  </div>
                </div>
                <div className="weui-cell weui-cell_active weui-cell_switch">
                  <div className="weui-cell__bd">兼容IE Edge的版本</div>
                  <div className="weui-cell__ft">
                    <label htmlFor="switchCP" className="weui-switch-cp">
                      <input id="switchCP" className="weui-switch-cp__input" type="checkbox"
                             checked="checked"/>
                      <div className="weui-switch-cp__box"></div>
                    </label>
                  </div>
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

export default SwitchPage
