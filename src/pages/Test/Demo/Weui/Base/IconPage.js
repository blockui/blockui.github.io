import React from "react"
import BasePage from "components/core/BasePage";
import "./Icon.less"

class IconPage extends React.Component {
  render() {
    return (
      <BasePage title={"Icon"} back>
        <div className="mt_16 pr_8 pl_8 text_align_left">
          <div className="icon-box">
            <i className="weui-icon-success weui-icon_msg"/>
            <div className="icon-box__ctn">
              <h3 className="icon-box__title">成功</h3>
              <p className="icon-box__desc">用于表示操作顺利达成</p>
            </div>
          </div>
          <div className="icon-box">
            <i className="weui-icon-info weui-icon_msg"/>
            <div className="icon-box__ctn">
              <h3 className="icon-box__title">提示</h3>
              <p className="icon-box__desc">用于表示信息提示；也常用于缺乏条件的操作拦截，提示用户所需信息</p>
            </div>
          </div>
          <div className="icon-box">
            <i className="weui-icon-warn weui-icon_msg-primary"/>
            <div className="icon-box__ctn">
              <h3 className="icon-box__title">普通警告</h3>
              <p className="icon-box__desc">用于表示操作后将引起一定后果的情况</p>
            </div>
          </div>
          <div className="icon-box">
            <i className="weui-icon-warn weui-icon_msg"/>
            <div className="icon-box__ctn">
              <h3 className="icon-box__title">强烈警告</h3>
              <p className="icon-box__desc">用于表示操作后将引起严重的不可挽回的后果的情况</p>
            </div>
          </div>
          <div className="icon-box">
            <i className="weui-icon-waiting weui-icon_msg"/>
            <div className="icon-box__ctn">
              <h3 className="icon-box__title">等待</h3>
              <p className="icon-box__desc">用于表示等待</p>
            </div>
          </div>

          <div className="icon_sp_area mt_16">
            <i className="weui-icon-circle"/>
            <i className="weui-icon-success"/>
            <i className="weui-icon-success-circle"/>
            <i className="weui-icon-success-no-circle"/>
            <i className="weui-icon-success-no-circle-thin"/>
            <i className="weui-icon-warn"/>
            <i className="weui-icon-info-circle"/>
            <i className="weui-icon-waiting-circle"/>
            <i className="weui-icon-download"/>
            <i className="weui-icon-search"/>
            <i className="weui-icon-cancel"/>
            <i className="weui-icon-clear"/>
            <i className="weui-icon-arrow-bold"/>
            <i className="weui-icon-arrow"/>
            <i className="weui-icon-close"/>
            <i className="weui-icon-close-thin"/>
            <i className="weui-icon-back-arrow"/>
            <i className="weui-icon-back-arrow-thin"/>
            <i className="weui-icon-back"/>
            <i className="weui-icon-back-circle"/>
          </div>

        </div>
      </BasePage>
    )
  }
}

export default IconPage
