import React from "react"
import BasePage from "components/core/BasePage"

class AccessPage extends React.Component {
  render() {
    return (
      <BasePage title={"跳转列表项"} back>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">跳转列表项</h2>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells">
                <div className="weui-cell weui-cell_access">
                  <div className="weui-cell__bd"><p>cell standard</p></div>
                  <div className="weui-cell__ft"></div>
                </div>
                <div className="weui-cell weui-cell_access">
                  <div className="weui-cell__bd"><p>cell standard</p></div>
                  <div className="weui-cell__ft"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default AccessPage
