import React from "react"
import BasePage from "components/core/BasePage"
import "../style.scss"
import WeLoading from "shared/weui/WeLoading";

class LoadingPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Loading"}>

        <div className="page__bd mt_16" style={{paddingTop: 64}}>
          <div className="loading_demo">
            <WeLoading />
            <WeLoading primary/>
            <WeLoading primary brand/>
            <WeLoading primary transparent/>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default LoadingPage
