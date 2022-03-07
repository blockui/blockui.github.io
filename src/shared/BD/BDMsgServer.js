import {} from "../functions/common";
import BDWebSocket from "./BDWebSocket";
import BDApp from "./BDApp";
import BDAdr from "./BDAdr";
import {setStoreState} from "components/core/App";
import IApp from "shared/BD/IApp";
import {requestAuthKey} from "../functions/auth-utils";
import BDAuth from "./BDAuth";
import BDClient from "./BDClient";
import config from "../../config";


class BDMsgServer {
  static getWebSock() {
    return BDMsgServer.webSock;
  }

  static isWebSock() {
    return 1 || !BDApp.isAdrPlatform()
  }

  static init() {
    const authUser = BDAuth.getGlobalUser();
    //_log("BDMsgServer.init", authUser.username)
    BDMsgServer.loginId = authUser.id
    BDMsgServer.setLogout(false)
    if (BDMsgServer.isWebSock()) {
      BDMsgServer.webSock = new BDWebSocket(authUser.id)
    } else {
      BDAdr.initMsgServer()
    }
  }

  static doLogout() {
    if (BDMsgServer.isWebSock()) {
      BDMsgServer.webSock && BDMsgServer.webSock.logout()
    } else {
      IApp.runOnce("logout")
    }
    BDMsgServer.setLogout(true)
  }

  static isImOnline() {
    return BDMsgServer.__imOnline
  }

  static isLogining() {
    return BDMsgServer.__logining;
  }

  static isConnected() {
    return BDMsgServer.__connected
  }

  static isReConnecting() {
    return BDMsgServer.__recconnect
  }

  static setConnected(connected) {
    BDMsgServer.__connected = connected
    // _debug("setConnected", connected)
    if (connected) {
      BDMsgServer.setReconnectingCounter(false)
      // _debug("setConnected isLogining", BDMsgServer.isLogining())
      // _debug("isLogout", BDMsgServer.isLogout(getGlobalAuthUserId()))
      if (BDMsgServer.isLogining()) {
        return;
      }
      if (!BDMsgServer.isLogout(BDAuth.getGlobalAuthUserId())) {
        // debugger
        //先看是否登录过api 然后登录MsgServer
        BDMsgServer.setLogining(true)
        BDApp.loginServer().catch(console.error)
      }

    } else {
      BDMsgServer.setImOnline(false)
    }
  }

  static setReconnecting(reconnecting) {
    BDMsgServer.setReconnectingCounter(reconnecting)
  }

  static setReconnectingCounter(counter) {
    if (counter) {
      BDMsgServer.__recconnect_counter += 1
    } else {
      BDMsgServer.__recconnect_counter = 0
    }
  }

  static doReconnect() {
    BDMsgServer.setReconnectingCounter(true)
    let showConnectInfoRetryCount = 2;
    if (BDApp.getConstant()) {
      showConnectInfoRetryCount = BDApp.getConstant().im.showConnectInfoRetryCount
    }
    let timeout = 1000;
    if (BDMsgServer.__recconnect > 2) {
      timeout = timeout * (BDMsgServer.__recconnect % 10)
    } else {
      if(!BDMsgServer.__recconnect){
        BDMsgServer.__recconnect = 1
      }
      timeout = timeout * BDMsgServer.__recconnect
    }
    setTimeout(() => {
      if (BDMsgServer.__recconnect_counter > showConnectInfoRetryCount) {
        setStoreState("im", {
          showNoNetworkView: "网络连接断开,点击重新连接...",
          showReconnectingProgressBar: true
        })
      } else {
        setStoreState("im", {
          showReconnectingProgressBar: true
        })
      }
      if (!BDMsgServer.isWebSock()) {
        BDAdr.reconnectMsgServer()
      } else {
        if (BDMsgServer.getWebSock()) {
          BDMsgServer.getWebSock().reconnect()
        }
      }
    }, timeout)
  }

  static setImOnline(imOnline) {
    BDMsgServer.setLogining(false)
    BDMsgServer.__imOnline = imOnline
  }

  static setLogining(logining) {
    BDMsgServer.__logining = logining
  }

  static setLogout(logout) {
    BDMsgServer.__logout = logout
  }

  static isLogout() {
    return BDMsgServer.__logout
  }

  // static heartBeat() {
  //   if (BDMsgServer.isWebSock()) {
  //     const data = {
  //       commandID: config.constants.im.OtherCmdID.CID_OTHER_HEARTBEAT,
  //       serviceID: config.constants.im.ServiceID.SID_OTHER,
  //     }
  //     setTimeout(() => {
  //       BDMsgServer.getWebSock().sendData(data)
  //       BDMsgServer.heartBeat()
  //     }, 60 * 4 * 1000)
  //   }
  // }

  static async login() {
    // _log("BDMsgServer login")
    let authUser = BDAuth.getGlobalUser();
    authUser = await requestAuthKey(authUser)
    const {id, avatar} = authUser;
    const token = BDAuth.encryptApiToken()
    if(!token){
      console.error("token is null")
      return Promise.reject()
    }
    const sign = ""
    BDApp.handleCallBack("LoginEvent", "LOGINING")
    if (BDMsgServer.isWebSock()) {
      const data = {
        commandID: config.constants.im.LoginCmdID.CID_LOGIN_REQ_USERLOGIN,
        user_id: id,
        pub_key: BDAuth.getRsaPubKey(),
        token,
        sign: ""
      }
      BDMsgServer.getWebSock().sendData(data)
    } else {
      IApp.login({app_id: BDApp.getConstant()["appId"], id, avatar, api_token: token, pub_key: BDAuth.getRsaPubKey(), sign})
    }
  }

  static loginOk() {
    // if (BDMsgServer.isWebSock()) {
    //   BDMsgServer.heartBeat()
    // }
    BDClient.fetchServerData().catch(console.error)
  }

  static logoutOk() {

  }

  static checkLogin() {
    if (BDMsgServer.isLogining()) {
      BDMsgServer.setLogining(false)
    }
    if (!BDMsgServer.isImOnline() && BDMsgServer.isConnected()) {
      if (!BDApp.isDebug()) {
        BDMsgServer.close()
      }
    }
  }

  static close() {
    if (BDMsgServer.isWebSock()) {
      BDMsgServer.webSock.close()
    } else {
      BDAdr.closeMsgServer()
    }
  }
}


BDMsgServer.loginId = null;
BDMsgServer.webSock = null;
BDMsgServer.__imOnline = false
BDMsgServer.__connected = false
BDMsgServer.__recconnect_counter = 0
BDMsgServer.__recconnect = 0
BDMsgServer.__logining = false
BDMsgServer.__logout = false

export default BDMsgServer
