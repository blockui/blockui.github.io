import React from 'react';
import {TopAction} from "./index";
import GlobalPanel from "./GlobalPanel";
import {WeMsg} from "shared/weui/WeMsg";


class MsgView extends React.PureComponent {
  render() {
    const {title, desc, btnText, onClick} = this.props;
    return (
      <GlobalPanel>
        <TopAction icon={"close"} onClick={() => {
          this.onClose()
        }} left/>
        <WeMsg {...{title, desc, btnText, onClick}}/>
      </GlobalPanel>

    );
  }
}


export default MsgView
