import React from "react"
import BasePage from "components/core/BasePage"

class CaptchaPage extends React.Component {
  render() {
    return (
      <BasePage title={"验证码"} back>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">验证码</h2>
            <div className="weui-form__desc">验证手机号样式</div>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells weui-cells_form">
                <div className="weui-cell weui-cell_active">
                  <div className="weui-cell__hd"><label className="weui-label">手机号</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" type="number" pattern="[0-9]*"
                           placeholder="请输入手机号" value="12345678907"/>
                  </div>
                  <div className="weui-cell__ft">
                    <button className="weui-btn_reset weui-btn_icon">
                      <i id="showIOSDialog1" className="weui-icon-info-circle"/>
                    </button>
                  </div>
                </div>
                <div className="weui-cell weui-cell_active weui-cell_vcode">
                  <div className="weui-cell__hd"><label className="weui-label">验证码</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" type="text" pattern="[0-9]*"
                           id="js_input" placeholder="输入验证码" maxLength="6"/>
                  </div>
                  <div className="weui-cell__ft">
                    <button className="weui-btn weui-btn_default weui-vcode-btn">获取验证码</button>
                  </div>
                </div>
              </div>
              <div className="weui-cells__tips">
                <span className="weui-link">收不到验证码</span>
              </div>
            </div>
          </div>
          <div className="weui-form__tips-area">
            <label id="weuiAgree" htmlFor="weuiAgreeCheckbox" className="weui-agree">
              <input id="weuiAgreeCheckbox" type="checkbox" className="weui-agree__checkbox"/><span
              className="weui-agree__text">阅读并同意<span className={"a"}>《相关条款》</span>
                                </span>
            </label>
          </div>
          <div className="weui-form__opr-area">
            <button className="weui-btn weui-btn_primary weui-btn_disabled"
                    id="showTooltips">确定
            </button>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default CaptchaPage
