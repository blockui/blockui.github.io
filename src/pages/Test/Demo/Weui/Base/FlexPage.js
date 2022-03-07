import React from "react"
import BasePage from "components/core/BasePage"
import "../style.scss"

class FlexPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Flex"}>
        <div className="height_100p bg_2">
          <div className="weui-flex">
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
          </div>
          <div className="weui-flex">
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
          </div>
          <div className="weui-flex">
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
          </div>
          <div className="weui-flex">
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
          </div>
          <div className="weui-flex">
            <div>
              <div className="placeholder">weui</div>
            </div>
            <div className="weui-flex__item">
              <div className="placeholder">weui</div>
            </div>
            <div>
              <div className="placeholder">weui</div>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default FlexPage
