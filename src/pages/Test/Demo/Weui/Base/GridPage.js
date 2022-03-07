import React from "react"
import BasePage from "components/core/BasePage"

class GridPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Grid"}>

        <div className={"bg_2 pt_16 height_100p"}>
          <div className="weui-grids">
            <div className="weui-grid">
              <div className="weui-grid__icon"/>
              <p className="weui-grid__label">Grid</p>
            </div>
            <div className="weui-grid">
              <div className="weui-grid__icon"/>
              <p className="weui-grid__label">Grid</p>
            </div>
            <div className="weui-grid">
              <div className="weui-grid__icon"/>
              <p className="weui-grid__label">Grid</p>
            </div>
            <div className="weui-grid">
              <div className="weui-grid__icon"/>
              <p className="weui-grid__label">Grid</p>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default GridPage
