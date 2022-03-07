import React from "react"
import BasePage from "components/core/BasePage"

class SelectPage extends React.Component {
  render() {
    return (
      <BasePage title={"原生选择框"} back>
        <div className="page__bd page__bd_spacing">

          <div className="weui-form">
            <div className="weui-form__text-area">
              <h2 className="weui-form__title">原生选择框</h2>
            </div>
            <div className="weui-form__control-area">
              <div className="weui-cells__group weui-cells__group_form">
                <div className="weui-cells">
                  <div className="weui-cell weui-cell_active weui-cell_select">
                    <div className="weui-cell__bd">
                      <select className="weui-select" name="select1">
                        <option selected="" value="1">微信号</option>
                        <option value="2">QQ号</option>
                        <option value="3">Email</option>
                      </select>
                    </div>
                  </div>
                  <div className="weui-cell weui-cell_active weui-cell_select">
                    <div className="weui-cell__bd">
                      <select multiple={true} className="weui-select" name="select1">
                        <option selected="" value="1">微信号</option>
                        <option value="2">QQ号</option>
                        <option value="3">Email</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="weui-cell weui-cell_active weui-cell_select weui-cell_select-before">
                    <div className="weui-cell__hd">
                      <select className="weui-select" name="select2">
                        <option value="1">+86</option>
                        <option value="2">+80</option>
                        <option value="3">+84</option>
                        <option value="4">+87</option>
                      </select>
                    </div>
                    <div className="weui-cell__bd">
                      <input className="weui-input" type="number" pattern="[0-9]*"
                             placeholder="请输入号码" value="12345678907"/>
                    </div>
                  </div>
                  <div className="weui-cell weui-cell_active weui-cell_select weui-cell_select-after">
                    <div className="weui-cell__hd">
                      <label htmlFor="" className="weui-label">国家</label>
                    </div>
                    <div className="weui-cell__bd">
                      <select className="weui-select" name="select2">
                        <option value="1">中国</option>
                        <option value="2">美国</option>
                        <option value="3">英国</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="weui-form__opr-area">
              <button className="weui-btn weui-btn_primary" id="showTooltips">确定</button>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default SelectPage
