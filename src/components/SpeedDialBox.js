import React from "react";
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@material-ui/core";
import {locationHash} from "shared/functions/common";
import {Icons} from "./Icons";
import {bindEvent, bindEventTouch, getEventClientPosition, unBindEvent, unBindEventTouch} from "shared/functions/event";
import BDApp from "shared/BD/BDApp";
import BDUtils from "shared/BD/BDUtils";
import BDAuth from "../shared/BD/BDAuth";

class SpeedDialBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.dom = React.createRef()
  }

  onTouchStart(e) {
    const {currentTarget} = e

    bindEvent(currentTarget, "touchmove", this.onTouchMove.bind(this))
    const {clientX, clientY} = getEventClientPosition(e)
    this.clientX = clientX
    this.clientY = clientY
  }

  onTouchMove(e) {
    const {clientX, clientY} = getEventClientPosition(e)
    this.clientX1 = clientX
    this.clientY1 = clientY
  }

  onTouchEnd(e) {
    const {currentTarget} = e
    const {bottom, left} = getComputedStyle(this.dom.current, null);
    // _debug(bottom,this.clientY1,this.clientY,this.clientY1 - this.clientY)
    if (Math.abs(this.clientY - this.clientY1) > 30 || Math.abs(this.clientX - this.clientX1) > 30) {
      this.dom.current.style.bottom = (parseInt(bottom) + (this.clientY - this.clientY1)) + "px";
      this.dom.current.style.left = (parseInt(left) + (-this.clientX + this.clientX1)) + "px";
    }
    unBindEvent(currentTarget, "touchmove", this.onTouchMove.bind(this))
  }

  unBindEvent() {
    unBindEventTouch(this.dom.current, this.onTouchStart.bind(this), this.onTouchEnd.bind(this))
  }

  bindEvent() {
    bindEventTouch(this.dom.current, this.onTouchStart.bind(this), this.onTouchEnd.bind(this))
  }

  componentWillUnmount() {
    // this.unBindEvent()
  }

  componentDidMount() {
    // this.bindEvent();
  }

  setOpen(open) {
    this.setState({
      open
    })
  }

  render() {
    const {open} = this.state;
    const {items} = this.props;
    const handleOpen = () => {
      this.setOpen(true);
    };
    const handleClose = () => {
      this.setOpen(false);
    };
    const {index} = BDApp.getConstant()
    const quickDials = index['quickDials']
    const actions = [...quickDials,...items || []].map(row => {
      return {
        ...row,
        icon: Icons[row.icon]
      }
    })
    if (BDApp.isDebug()) {
      actions.push({icon: Icons['ImLab'], name: 'Test', hash: "Test/Index"})
    }
    const onClick = (name) => {
      switch (name) {
        case "扫一扫":
          BDUtils.qrCodeScan()
          break
        case "收藏":
          locationHash("Chat/Message/ChatMessage?sessionName=" + encodeURIComponent("收藏") +
            "&sessionKey=1_" + BDAuth.getGlobalAuthUserId())
          break
        default:
          actions.forEach(action => {
            if (action.name === name && action.hash) {
              locationHash(action.hash)
            }
          })
          break
      }
    }
    return (
      <SpeedDial
        ref={this.dom}
        ariaLabel="SpeedDial"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
        }}
        className={"speed-dial-box"}
        icon={<SpeedDialIcon icon={Icons['menu']} openIcon={Icons['close']}/>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              onClick(action.name)
            }}
            title={action.name}/>
        ))}
      </SpeedDial>
    );
  }
}

export default SpeedDialBox
