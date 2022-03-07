import React, {Component} from "react";
import {connect} from "react-redux";
import WeCell from "shared/weui/WeCell";
import WeCells from "shared/weui/WeCells";
import {setStoreState} from "components/core/App";

class View extends Component {
  render() {
    if (!this.props.isPad) return null
    return (
      <div className={"side-bar"}>
        <div className="side-bar-inner">
          <WeCells className={"mt_0"}>
            <WeCell
              onClick={() => {
                setStoreState("global", {currentTabBarItemIndex: 0})
              }} to={"#Home/Index"} title={"Home"} active access/>

            <WeCell to={"#Chat"} title={"Chat"} active access/>

            <WeCell to={"#Contact"} title={"Contact"} active access/>

            <WeCell to={"#Me"} title={"Me"} active access/>
          </WeCells>
        </div>
      </div>
    );
  }
}

View.propTypes = {};

export default connect(({global, auth}) => {
  return {
    auth,
    snackbars: global.snackbars,
    snackbarsMaxNum: global.snackbarsMaxNum
  }
})(View);

