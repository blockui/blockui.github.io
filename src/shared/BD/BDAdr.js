import IApp from 'shared/BD/IApp'
import {_debug} from 'shared/functions/common'
import BDApp from "./BDApp";

class BDAdr {
  static checkBridge() {
    return "IApp" in window
  }

  static isAdrDebug() {
    if (BDAdr.checkBridge()) {
      return window['IApp'].isDebug() === "true"
    } else {
      return false
    }
  }

  static ackReceiveMsg({msgId, fromId, toId, sessionKey}) {
    IApp.runOnce("ackReceiveMsg", {
      msgId, fromId, toId, sessionKey
    })
  }

  static openChannelNotificationSetting() {
    IApp.runOnce("openChannelNotificationSetting")
  }

  static checkNotificationEnabled() {
    return new Promise(resolve => {
      IApp.run("checkNotificationEnabled").then((res) => {
        resolve(res === 'true')
      })
    })
  }

  static showNotification({title, content, sessionKey, avatar, useVibrate}) {
    IApp.runOnce("showNotification", {
      ...{title, content, sessionKey, avatar, useVibrate}
    })
  }

  static setNetworkStatus(status) {
    BDAdr.__networkStatus = status
  }

  static getNetworkStatus() {
    return BDAdr.__networkStatus;
  }

  static getNetworkStatusFromAdr() {
    return IApp.runOnce("getNetworkStatus") === "true";
  }

  static getQueueFromIApp() {
    // try {
    //   while (1) {
    //     let list = IApp.runOnce("getQueue");
    //     if (list && list !== "null") {
    //       new BDQueue(list).process()
    //     } else {
    //       break
    //     }
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  }

  static ifAppPause() {
    return BDAdr.__appPaused;
  }

  static onAppPause(paused) {
    BDAdr.__appPaused = paused;
  }

  static callBack({type, action, data}) {
    _debug("BDAdr.callBack", type, action, data)
    BDApp.handleCallBack(type, action, data)
  }

  static initMsgServer() {
    IApp.runOnce("connectMsgServer")
  }

  static closeMsgServer() {
    IApp.runOnce("closeMsgServer")
  }

  static reconnectMsgServer() {
    IApp.runOnce("reconnectMsgServer")
  }

}

BDAdr.__appPaused = false
BDAdr.__networkStatus = true;

window.BDAdrCallBack = BDAdr.callBack
export default BDAdr
