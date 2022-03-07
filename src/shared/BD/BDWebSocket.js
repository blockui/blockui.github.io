import {_debug,  _log,} from "../functions/common";
import ImMessage from "./model/ImMessage";
import BDApp from "./BDApp";
import BDMsgServer from "./BDMsgServer";
import ImGroup from "./model/ImGroup";
import BdCircle from "./model/BdCircle";
import BDConstant from "./BDConstant";
import config from "../../config";
import BDAuth from "./BDAuth";


class BDWebSocket {
  constructor(loginId) {
    this.loginId = loginId
    this.retrySend = 0
    this.retrySendMax = 20
    this.constant = config.constants.im
    this.init()
  }

  init() {
    try {
      // _log("ws init", this.loginId)
      let {ip, ws_port, ws_schema} = BDConstant.server("ws");

      BDApp.handleCallBack("SocketEvent", "CONNECTING_MSG_SERVER")

      if(ws_port === 80 || ws_port === 443){
        ws_port = ""
      }else{
        if(BDAuth.getGlobalAuthUserId() === 80000001){
          ws_port = parseInt(ws_port) + 1
        }
        ws_port = ":" + ws_port
      }

      const imWs = new WebSocket(`${ws_schema}://${ip}${ws_port}`);

      imWs.onopen = this.onOpen.bind(this)
      imWs.onmessage = this.onMessage.bind(this)
      imWs.onclose = this.onClose.bind(this)
      imWs.onerror = this.onError.bind(this)
      this.imWs = imWs
    } catch (e) {
      _log("ws init error", e)
      _debug(e)
      BDApp.handleCallBack("SocketEvent", "CONNECT_MSG_SERVER_FAILED")
    }
  }

  reconnect() {
    if (this.imWs) {
      this.close()
    } else {
      this.init()
    }
  }

  onOpen() {
    // _log("ws opened", this.loginId)
    // _log("ws heart addLooper")
    BDApp.handleCallBack("SocketEvent", "CONNECT_MSG_SERVER_SUCCESS")
  }

  onMessage(e) {
    //_log("ws rcv msg")
    //_debug("ws onmessage", e.data)
    const messageJson = JSON.parse(e.data)
    const {commandID, message, serviceID, code} = messageJson
    if (code !== -1) {
      const {ServiceID, LoginCmdID, GroupCmdID, OtherCmdID, MessageCmdID} = this.constant
      switch (serviceID) {
        case ServiceID.SID_LOGIN:
          switch (commandID) {
            case LoginCmdID.CID_LOGIN_RES_LOGINOUT:
              BDApp.handleCallBack("LoginEvent", "LOGIN_OUT")
              break;
            case LoginCmdID.CID_LOGIN_RES_USERLOGIN:
              // debugger
              if (code === 1) {
                _log("===> ws login ok！", this.loginId)
                this.loginOk()
              } else {//password fail
                if("密码错误!" === message){
                  setTimeout(()=>{
                    this.onClose()
                  },10000)
                }else{
                  this.onClose()
                }
                console.error("login error!", {code, message})
              }
              break;
            case LoginCmdID.CID_LOGIN_KICK_USER:
              this.kickOut()
              _log("kicked by server,reason: " + message)
              break;
            default:
              break
          }
          break;
        case ServiceID.SID_MSG:
          switch (commandID) {
            case MessageCmdID.CID_MSG_CALL_RES:
              ImMessage.rcvCallMsgFromWs(messageJson)
              break;
            case MessageCmdID.CID_MSG_DATA:
              ImMessage.rcvMsgFromWs(messageJson)
              break;
            case MessageCmdID.CID_MSG_DATA_ACK:
              ImMessage.ackMsgFromWs(messageJson)
              break;
            default:
              break
          }
          break;
        case ServiceID.SID_GROUP:
          switch (commandID) {
            case GroupCmdID.CID_GROUP_CHANGE_MEMBER_NOTIFY:
              ImGroup.handleNotify(messageJson['groupId'])
              break;
            default:
              break
          }
          break;
        case ServiceID.SID_OTHER:
          switch (commandID) {
            case OtherCmdID.CID_OTHER_PUSH_NOTICE:
              switch (parseInt(messageJson['noticeAction'])) {
                case 1:
                  BdCircle.handleNotice(JSON.parse(messageJson['noticeData']))
                  break;
                default:
                  break
              }
              break;
            default:
              break
          }
          break;
        default:
          break
      }
    }
  }

  onClose(e) {
    this.imWs = null;
    // _log("ws onClose")
    // _debug("ws onClose", e)
    BDApp.handleCallBack("SocketEvent", "MSG_SERVER_DISCONNECTED")
  }

  onError(e) {
    //_log("ws onError")
    // _debug("ws onError", e)
  }

  kickOut() {
    BDApp.handleCallBack("LoginEvent", "SAME_CLIENT_KICK_OUT")
    _log("ws kickOut")
    this.close()
  }

  close() {
    // _log("ws close")
    if (this.imWs) {
      this.imWs.close()
      this.imWs = null;
    } else {
      BDApp.handleCallBack("SocketEvent", "MSG_SERVER_DISCONNECTED")
    }
  }

  logout() {
    _log("ws logout")
    this.sendData({
      commandID: config.constants.im.LoginCmdID.CID_LOGIN_REQ_LOGINOUT,
      serviceID: config.constants.im.ServiceID.SID_LOGIN
    })
  }

  isReady() {
    return BDMsgServer.isConnected() && this.imWs && this.imWs.readyState === WebSocket.OPEN
  }

  /**
   * todo handle send list
   * @param data
   */
  sendData(data) {
    if (this.isReady()) {
      this.imWs.send(JSON.stringify(data))
    } else {
      setTimeout(() => {
        if (this.retrySend < this.retrySendMax) {
          this.retrySend += 1
          this.sendData(data)
        }
      }, 1000 * (this.retrySend % 5 + 1))
    }
  }

  sendMsgToServer({content, created, msgType, sessionType, toId, fromId}) {
    const data = {
      commandID: this.constant.MessageCmdID.CID_MSG_DATA,
      msgType,
      created,
      sessionType,
      fromId,
      toId,
      content
    }
    this.sendData(data)
  }

  loginOk() {
    BDApp.handleCallBack("LoginEvent", "LOGIN_OK")
  }
}

export default BDWebSocket
