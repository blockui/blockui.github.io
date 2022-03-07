import React from "react"
import BasePage from "components/core/BasePage"

class PreviewPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Preview"}>
        <div className="pt_64 pl_0 pr_0">
          <div className="page__bd">
            <div className="weui-form-preview">
              <div className="weui-form-preview__hd">
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">付款金额</label>
                  <em className="weui-form-preview__value">¥2400.00</em>
                </div>
              </div>
              <div className="weui-form-preview__bd">
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">商品</label>
                  <span className="weui-form-preview__value">电动打蛋机</span>
                </div>
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">标题标题</label>
                  <span className="weui-form-preview__value">名字名字名字</span>
                </div>
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">标题标题</label>
                  <span
                    className="weui-form-preview__value">很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字</span>
                </div>
              </div>
              <div className="weui-form-preview__ft">
                <div className="weui-form-preview__btn weui-form-preview__btn_primary"
                >操作
                </div>
              </div>
            </div>
            <br/>
            <div className="weui-form-preview">
              <div className="weui-form-preview__hd">
                <label className="weui-form-preview__label">付款金额</label>
                <em className="weui-form-preview__value">¥2400.00</em>
              </div>
              <div className="weui-form-preview__bd">
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">商品</label>
                  <span className="weui-form-preview__value">电动打蛋机</span>
                </div>
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">标题标题</label>
                  <span className="weui-form-preview__value">名字名字名字</span>
                </div>
                <div className="weui-form-preview__item">
                  <label className="weui-form-preview__label">标题标题</label>
                  <span
                    className="weui-form-preview__value">很长很长的名字很长很长的名字很长很长的名字很长很长的名字很长很长的名字</span>
                </div>
              </div>
              <div className="weui-form-preview__ft">
                <div className="weui-form-preview__btn weui-form-preview__btn_default"
                >辅助操作
                </div>
                <div className="weui-form-preview__btn weui-form-preview__btn_primary"
                >操作
                </div>
              </div>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default PreviewPage
