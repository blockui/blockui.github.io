import React from "react"
import BasePage from "components/core/BasePage"

class ProgressPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Progress"}>
        <div className={"bg_2 pt_16 pr_16 pl_16 pb_16"}>
          <div className="weui-progress">
            <div className="weui-progress__bar">
              <div className="weui-progress__inner-bar js_progress width_0"/>
            </div>
            <div className="weui-progress__opr">
              <i className="weui-icon-cancel"/>
            </div>
          </div>
          <br/>
          <div className="weui-progress">
            <div className="weui-progress__bar">
              <div className="weui-progress__inner-bar js_progress width_50p"/>
            </div>
            <div className="weui-progress__opr">
              <i className="weui-icon-cancel"/>
            </div>
          </div>
          <br/>
          <div className="weui-progress">
            <div className="weui-progress__bar">
              <div className="weui-progress__inner-bar js_progress width_80p"/>
            </div>
            <div className="weui-progress__opr">
              <i className="weui-icon-cancel"/>
            </div>
          </div>
          <div className="weui-btn-area">
            <button className="weui-btn weui-btn_primary" id="btnUpload">
              上传
            </button>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default ProgressPage
