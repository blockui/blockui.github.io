import React from "react"
import BasePage from "components/core/BasePage"

class FooterPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Footer"}>
        <div className="height_100p bg_2 pt_32">
          <div className="weui-footer">
            <p className="weui-footer__text">Copyright © 2008-2016 weui.io</p>
          </div>
          <br/>
          <br/>
          <div className="weui-footer">
            <p className="weui-footer__links">
              <span className="weui-footer__link">底部链接</span>
            </p>
            <p className="weui-footer__text">Copyright © 2008-2016 weui.io</p>
          </div>
          <br/>
          <br/>
          <div className="weui-footer">
            <p className="weui-footer__links">
              <span className="weui-footer__link">底部链接</span>
              <span className="weui-footer__link">底部链接</span>
            </p>
            <p className="weui-footer__text">Copyright © 2008-2016 weui.io</p>
          </div>
          <div className="weui-footer weui-footer_fixed-bottom">
            <p className="weui-footer__links">
              <span className="weui-footer__link">WeUI首页</span>
            </p>
            <p className="weui-footer__text">Copyright © 2008-2016 weui.io</p>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default FooterPage
