import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

const {$} = window

class TopTipsPage extends React.Component {
  componentDidMount() {
    $("#showTopTips").click(() => {
      window.__topTips = weui.topTips('长文案提示长文案提示', 30000);
    })

    $("#hideTopTips").click(() => {
      window.__topTips.hide()
    })
  }

  render() {
    return (
      <BasePage back title={"TopTips"}>
        <div className="mt_64">
          <button className="weui-btn weui-btn_default" id="showTopTips">显示提示条</button>
          <button className="weui-btn weui-btn_default" id="hideTopTips">隐藏提示条</button>
        </div>
      </BasePage>
    )
  }
}

export default TopTipsPage
