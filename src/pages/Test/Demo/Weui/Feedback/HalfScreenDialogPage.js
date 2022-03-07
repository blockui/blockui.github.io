import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

class HalfScreenDialogPage extends React.Component {
  render() {
    return (
      <BasePage back title={"HalfScreenDialog"}>
        <div className="mt_64">
          <button onClick={() => weui.halfDialog({
            title: "halfDialog",
          })} className="weui-btn weui-btn_default" id="showHalfDialog">
            Android
            Dialog样式二
          </button>
        </div>
      </BasePage>
    )
  }
}

export default HalfScreenDialogPage
