import {
  _debug,
  _debugToast,
  _log,
  checkIsLocalDev,
  genNickname,
  getWeui,
  globalLoading,
  globalLoadingHide,
  locationHash,
  removeGlobalAuthUser,
  showPageGlobalLoading,
  showToast,
  showTopTips
} from "../functions/common";
import {dispatchStore, setStoreState} from "components/core/App";
import {clearUsersHistory, initPageStack, initStore, onLocalLogin, requestAuthKey} from "../functions/auth-utils";
import IApp, {onResetStatusBarBgColor} from "shared/BD/IApp";
import ImUserFriend from "./model/ImUserFriend";
import ImSession from "./model/ImSession";
import ImMessage from "./model/ImMessage";
import {clearExpiredCache} from "../functions/cache";
import BDMsgServer from "./BDMsgServer";
import {postRemote} from "../functions/network";
import BDAuth from "./BDAuth";
import BDConstant from "./BDConstant";
import {compareVersion} from "../functions/utils";
import {PageManager} from "../../components/core/PageManager";
import {base64Decode, base64Encode} from "../functions/base64";
import BaWebSocket from "../block-chain/api/BaWebSocket";
import {KLine} from "../block-chain/api/BaApi";
import config from "config";
import BDQueue from "./BDQueue";

class BDApp {
  static looper() {
    try {
      setTimeout(() => clearExpiredCache())
      Object.keys(BDApp.__loopers).forEach(looperId => {
        if (BDApp.__loopers[looperId]) {
          setTimeout(() => BDApp.__loopers[looperId] && BDApp.__loopers[looperId]())
        } else {
          delete BDApp.__loopers[looperId]
        }
      })
    } catch (e) {
      console.error(e)
    }
    setTimeout(() => {
      BDApp.looper()
    }, 1000)
  }

  static imServerIsConnected() {
    return BDMsgServer.isConnected()
  }

  static isImOnline() {
    return BDMsgServer.isImOnline()
  }

  static beforeLoadApp() {
    // _log("beforeLoadApp")
    BDApp.initData()
    if (BDApp.isAdrPlatform()) {
      IApp.bindChangeStatusBarBgColor()
      // BDApp.addLooper("getQueueFromIApp", BDAdr.getQueueFromIApp)
    }
  }

  static afterRequestAuthKey() {
    dispatchStore("message", "counter")
    dispatchStore("session", "counter")
  }

  static checkUserInfo(authUser) {
    let flag = false
    if (authUser.nickname === genNickname(authUser.username) && authUser.username.length === 35) {
      flag = true;
      locationHash("Me/Profile/Field/NickName", {initUser: true, disableBack: true, fullWidth: true})
    }
    if (!authUser.avatar && !flag) {
      flag = true;
      locationHash("Me/Profile/Avatar", {initUser: true, disableBack: true, fullWidth: true})
    }
    return flag
  }

  static async localLogin(authUser) {
    // _log("localLogin")
    await BDApp.loadLocalData()
    BDApp.checkUserInfo(authUser)
    onLocalLogin(authUser)
    requestAuthKey(authUser).then(() => {
      BDMsgServer.init()
    }).catch(console.error)
  }

  static loadApp(cb) {
    cb && cb()
  }

  static afterLoadApp() {
    _log("afterLoadApp")
    if(config.blockChain.enableBiAnWs){
      new BaWebSocket({
        onReady:(ws)=>{
          ws.subscribe(config.blockChain.biAnWsInitStream)
        }
      })
    }
    BDApp.hideSpinner()
  }

  static checkPermissions(permissionApplyWhenLoadApp) {
    if (BDApp.getAdrBridge() && permissionApplyWhenLoadApp && permissionApplyWhenLoadApp.length > 0) {
      IApp.run("applyPermission", {permission: permissionApplyWhenLoadApp.join(",")}).catch(console.error)
    }
  }

  static initData() {
    // _log("initData")
    initStore()
    ImUserFriend.rows = {}
    ImUserFriend.items = []
    ImSession.rows = {}
    ImMessage.rows = {}
  }

  static async initImLogin() {
    await BDApp.loadRemoteData()
  }

  static get constantKey() {
    return window['BD'].constantKey
  }

  static get assetsKey() {
    return window['BD'].assetsKey
  }

  static get version() {
    return window['BD'].version
  }

  static get platform() {
    return window['BD'].platform
  }

  static get baseApi() {
    return window['BD'].baseApi
  }

  static isAdrPlatform() {
    return BDApp.platform === 'ADR'
  }

  static isIosPlatform() {
    return BDApp.platform === 'IOS'
  }

  static isWebPlatform() {
    return BDApp.platform === 'WEB'
  }


  static isChrPlatform() {
    return BDApp.platform === 'CHR'
  }

  static isDebug() {
    return checkIsLocalDev() || window["BD"]['debug']
  }

  static hideSpinner() {
    if (window['IApp']) {
      return IApp.runOnce("showProgressBar", {visible: "false"})
    }
    if ("webkit" in window && window.BD.isIosBrowser()) {
      return window.webkit.messageHandlers.showProgressBar.postMessage({"visible": "false"});
    }
    switch (BDApp.platform) {
      case "WEB":
      default:
        globalLoadingHide()
        showPageGlobalLoading(false)
        break
    }
  }

  static __checkUpdate(remoteConstant, cb) {
    const localConstant = BDApp.getConstant();
    const {assets, version, updateStatus} = remoteConstant
    if (BDApp.isIosPlatform() && updateStatus && updateStatus === -1) {
      globalLoadingHide()
      cb && cb()
      return;
    }
    const remote_constant_version = version
    const remote_zip_version = assets.version

    const local_constant_version = localConstant.version
    const local_zip_version = localConstant.assets.version || ""
    console.log("version", {remote_constant_version, remote_zip_version, local_constant_version, local_zip_version})
    if (window['BD']['localAssetsEnable'] && compareVersion(local_zip_version, remote_zip_version)) {
      if (BDApp.isChrPlatform()) {
        //todo
        globalLoadingHide()
      } else {
        if (!checkIsLocalDev()) {
          getWeui().confirm("有新版本需要更新,点击确定更新", () => {
            const assetsServer = BDConstant.server("assetsServer")
            let {zipUrl} = assets;
            if (zipUrl.indexOf("/") === 0) {
              zipUrl = zipUrl.substring(1)
            }
            globalLoading("更新中...")
            new window['AppUpdater'](assetsServer + "/" + zipUrl).process().then((assetsManifest) => {
              // _debug(assetsManifest)
              globalLoadingHide()
              BDApp.saveConstant(remoteConstant)
              window['BD']['saveAssetsJson'](assetsManifest, remote_zip_version);
              window['BD']['setVersionAssets'](remote_zip_version)
              window.localStorage.setItem("lastVersion", local_zip_version)
              if (BDApp.isWebPlatform()) {
                window.location.reload()
              } else {
                getWeui().alert("更新完毕, 请重启App", () => {
                  if (BDApp.isAdrPlatform() || BDApp.isIosPlatform()) {
                    window.BD['reOpenApp']()
                  }
                })
              }
            }).catch(() => {
              globalLoadingHide()
              showTopTips("更新失败，请重启App再试")
            })
          })
        } else {
          BDApp.saveConstant(remoteConstant)
          BDApp.handleConstant(remoteConstant)
          globalLoadingHide()
        }
      }
    } else if (compareVersion(local_constant_version, remote_constant_version)) {
      BDApp.saveConstant(remoteConstant)
      BDApp.handleConstant(remoteConstant)
      setStoreState("constant", remoteConstant)
      globalLoadingHide()
      setTimeout(() => {
        showToast("更新完毕")
        initPageStack()
        onResetStatusBarBgColor()
        cb && cb()
        globalLoadingHide()
      }, 1000)
    } else {
      BDApp.saveConstant(remoteConstant)
      BDApp.handleConstant(remoteConstant)
      cb && cb()
      globalLoadingHide()
    }
  }

  static checkUpdate(cb) {
    _log("checkUpdate...")
    const user = BDAuth.getGlobalUser()
    if (!user || !user.api_token) return;
    if (cb) globalLoading("更新中")
    postRemote("api/constant", {version: BDApp.version}).then((remoteConstant) => {
      BDApp.__checkUpdate(remoteConstant, cb)
    }).catch(console.error).finally(() => {
      globalLoadingHide()
    })
  }

  static async loadRemoteData() {
    return Promise.resolve()
  }

  static async loadLocalData() {
    if (BDAuth.getGlobalAuthUserId()) {
      // _log("loadLocalData loadFromPdb")
      await ImUserFriend.loadFromPdb()
      // _log("loadLocalData loadFromPdb")
      await ImSession.loadFromPdb()
    }
    return Promise.resolve()
  }

  static addLooper(id, func) {
    BDApp.__loopers[id] = func
  }

  static handleCallBack(type, action, data) {
    // _log("BDApp.handleCallBack", type, action)
    if (data) _debug(data)
    switch (type) {
      case "PriorityEvent":
        switch (action) {
          case "OTHER":
            _debug("PriorityEvent", type, action, typeof data, data)
            const queue = new BDQueue(data)
            queue.process()
            break;
          case "MSG_RECEIVED_MESSAGE":
            ImMessage.rcvMsgFromPb(action, data)
            break;
          default:
            ImMessage.rcvMsgFromPb(action, data)
            break;
        }
        break;
      case "MessageEvent":
        switch (action) {
          case "ACK_SEND_MESSAGE_OK":
          case "ACK_SEND_MESSAGE_FAILURE":
          case "ACK_SEND_MESSAGE_TIME_OUT":
            ImMessage.ackMsgFromPb(action, data)
            break;
          default:
            break;
        }
        break;
      case "LoginEvent":
        setStoreState("im", {
          LoginEvent: action,
        })
        if (action === "LOGIN_OK") {
          setStoreState("im", {
            imOnline: true
          })
          BDMsgServer.setImOnline(true)
        } else {
          setStoreState("im", {
            imOnline: false
          })
          BDMsgServer.setImOnline(false)
        }
        switch (action) {
          case "LOGINING":
            BDMsgServer.setLogining(true)
            break
          case "LOGIN_OK":
            BDMsgServer.setLogout(false)
            BDMsgServer.loginOk()
            //_debugToast("登录成功!")
            break
          case "LOGIN_DISCONNECT":
            _debugToast("断开登录!")
            break
          case "SAME_CLIENT_KICK_OUT":
            setStoreState("im", {
              showNoNetworkView: "您在其他设备登录,点击踢掉其他设备",
            })
            BDMsgServer.setLogout(true)
            _debugToast("相同设备登录!")
            break
          case "LOGIN_OUT":
            setStoreState("im", {
              showNoNetworkView: "已退出,点击重新登录",
            })
            BDMsgServer.setLogout(true)
            _debugToast("退出登录!")
            break
          default:
            break
        }
        break;
      case "SocketEvent":
        if (action === "CONNECTING_MSG_SERVER") {
          BDMsgServer.setReconnecting(true)
          setStoreState("im", {
            SocketEvent: action,
          })
        } else if (action === "CONNECT_MSG_SERVER_SUCCESS") {
          BDMsgServer.setConnected(true)
          BDMsgServer.setReconnecting(false)
          setStoreState("im", {
            SocketEvent: action,
            showNoNetworkView: false,
            showReconnectingProgressBar: false
          })
        } else {
          setStoreState("im", {
            SocketEvent: action,
            LoginEvent: "LOGIN_DISCONNECT"
          })
          BDMsgServer.setConnected(false)
          BDMsgServer.setReconnecting(false)
          if (!BDMsgServer.isLogout()) {
            // _debug("BDMsgServer.isLogout", BDMsgServer.isLogout())
            BDMsgServer.doReconnect()
          }
        }
        switch (action) {
          case "CONNECTING_MSG_SERVER":
            break
          case "CONNECT_MSG_SERVER_SUCCESS":
            //_debugToast("连接成功!")
            break
          case "CLOSE_MSG_SERVER":
            //_debugToast("连接主动断开!")
            break;
          case "MSG_SERVER_DISCONNECTED":
            // _debugToast("连接断开!")
            break;
          case "CONNECT_MSG_SERVER_FAILED":
            // _debugToast("连接失败!")
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  static async loginServer() {
    let authUser = BDAuth.__getStorageHandler().getItem("auth.10")
    if (authUser) {
      if (authUser.indexOf("^") === 0) {
        authUser = authUser.substring(1)
        authUser = base64Decode(authUser)
      }
      authUser = JSON.parse(authUser);
      let password = BDAuth.getAuthPwd()
      if (!password) {
        authUser = await requestAuthKey(authUser)
        password = BDAuth.getAuthPwd()
      }
      if (authUser && !authUser.api_token && authUser) {
        authUser = await BDAuth.onLoginRemote(authUser, password).catch((e) => {
          console.error(e)
        })
      }
      if (authUser && authUser.api_token) {
        await this.loadRemoteData()
        await BDMsgServer.login().catch(console.error)
        setTimeout(() => {
          BDMsgServer.checkLogin()
        }, 5000)
      }
    }
  }

  static clearLoginUsers() {
    BDApp.logout(BDAuth.getRsaFingerprint())
    setStoreState("auth", {
      usersHistory: []
    })
    clearUsersHistory()
  }

  static logout(clearLoginFingerprint) {
    _log("BDApp logout")
    BDMsgServer.doLogout()
    globalLoading("正在退出...")
    BDAuth.setGlobalUser(null)
    BDApp.initData()
    setStoreState("global", {
      showLoginView: true,
    })
    setStoreState("auth", {
      user: null,
      showLoginView: true,
      clearLoginFingerprint
    })
    globalLoadingHide()
    removeGlobalAuthUser()
    setTimeout(() => {
      locationHash(PageManager.defaultIndexPageName)
    }, 200)
  }

  static getAdrBridge() {
    return window['IApp']
  }

  static getConstantFromAdrStore() {
    return BDApp.getAdrBridge().getConstant(BDApp.constantKey)
  }

  static getConstantFromLocal() {
    let constant = null
    constant = window.localStorage.getItem(BDApp.constantKey)
    if (constant) {
      if (constant.indexOf("^") === 0) {
        constant = base64Decode(constant.substring(1))
      }
      constant = JSON.parse(constant);
      BDApp.__constant = constant
    } else {
      constant = window['BD']['__constant']
      if (constant) {
        BDApp.saveConstant(constant)
      }
    }
    return constant
  }

  static getConstantFromRemote() {
    return postRemote(BDApp.getConstantApiAdr())
  }

  static getConstantApiAdr() {
    return BDApp.baseApi + `/api/constant`
  }

  static saveConstant(constant) {
    BDApp.__constant = constant
    window.localStorage.setItem(BDApp.constantKey, "^" + base64Encode(JSON.stringify(constant)))
  }

  static handleConstant(constant) {
    if (!window['BD']) {
      window['BD'] = {}
    }
    window['BD'].version = constant.version
    window['BD'].versionAssets = constant.assets.version
  }

  static loadAppConstant() {
    return new Promise(((resolve, reject) => {
      console.log("BD loadAppConstant", "version:", BDApp.version, "platform:", BDApp.platform, "api:", BDApp.baseApi)
      const constant = BDApp.getConstant();
      if (!constant || BDApp.isDebug() || constant['autoUpdateConstant']) {
        BDApp.getConstantFromRemote().then((body) => {
          if (constant['autoUpdateConstant']) {
            BDApp.__checkUpdate(body, () => {
              resolve(body)
            })
          } else {
            BDApp.handleConstant(body)
            BDApp.saveConstant(body)
            resolve(body)
          }
        }).catch((e) => {
          console.error(e)
          reject({message: e.message})
        })
      } else {
        BDApp.handleConstant(constant)
        resolve(constant)
      }
    }))
  }

  static getConstant() {
    if (BDApp.__constant) {
      return BDApp.__constant;
    }
    return BDApp.getConstantFromLocal()
  }

  static clearAssetsJson(version) {
    window.localStorage.removeItem(BDApp.assetsKey + version)
  }

  static saveAssetsJson(assets, version) {
    localStorage.setItem(BDApp.assetsKey + version, JSON.stringify(assets))
  }
}

BDApp.__loginImServing = false;
BDApp.__loopers = {};
BDApp.__constant = null
export default BDApp
