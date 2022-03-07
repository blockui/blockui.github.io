import React from "react"
import BasePage from "components/core/BasePage"
import WeLoadMore from "shared/weui/WeLoadMore";

class LoadmorePage extends React.Component {
  render() {
    return (
      <BasePage back title={"Loadmore"}>
        <div className="pt_64">
          <WeLoadMore loading/>
          <WeLoadMore tips={""}/>
          <WeLoadMore tips={"加载更多"}/>
        </div>
      </BasePage>
    )
  }
}

export default LoadmorePage
