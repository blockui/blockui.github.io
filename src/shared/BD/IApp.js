import {
  _debug,

  checkIsLocalDev,
  getConstant,
  getItemFromLocalStorage,
  setItemFromLocalStorage,
  showToastText,
  showTopTips
} from "shared/functions/common";
import {genRsaKey, rsaDecryptByPrvKey, rsaEncryptByPubKey, signByPriKey, verifyByPubKey} from "../functions/crypto";
import BDApp from "./BDApp";
import BDPermission from "./BDPermission";

export function onChangeStatusBarBgColor() {
  window.changeStatusBarBgColor && window.changeStatusBarBgColor("bgMask")
}

export function onResetStatusBarBgColor() {
  window.changeStatusBarBgColor && window.changeStatusBarBgColor("bg0")
}

const rsa_store_key = "rsa.json"
const IApp = class {
  constructor() {
    this.key = "IApp"
    this.app = BDApp.getAdrBridge()
    this.rsaKeys = null
  }

  checkIApp() {
    return this.app
  }

  checkNotIApp() {
    return !this.app
  }

  stopSwipeRefresh() {

  }

  changeStatusBarBgColor(color) {
    if (this.checkNotIApp()) return;
    this.call("changeStatusBarColor", {color})
  }

  bindChangeStatusBarBgColor() {
    window.changeStatusBarBgColor = this.changeStatusBarBgColor.bind(this)
  }

  browser(url) {
    if (this.checkNotIApp()) return;
    this.app.call("browser", JSON.stringify({url}));
  }

  finish() {
    if (this.checkNotIApp()) return;
    this.app.call("finish");
  }

  isDebug() {
    return checkIsLocalDev() || BDApp.isDebug()
  }

  onGetChatMessages(sessionKey, latestMsgId, limit) {
    if (this.checkNotIApp()) return;
    this.app.onGetChatMessages(sessionKey, latestMsgId, limit)
  }

  login(user) {
    if (this.checkNotIApp()) return;
    this.run("login", user).then(() => {
      // _debugToast("login request ok")
    }).catch(console.error);
  }

  toast(message) {
    if (this.checkNotIApp()) return;
    this.app.call("toast", JSON.stringify({message}));
  }

  runOnce(action, params) {
    if (this.checkNotIApp()){
      // console.error({message: "not in IApp, action:"+action})
      return
    }
    try {
      const params_ = JSON.stringify(params || {});
      return this.app.call(action, params_);
    } catch (e) {
      console.error("call IApp error:", e)
    }
  }

  run(action, params) {
    return new Promise((resolve, reject) => {
      if (this.checkNotIApp()) return reject({message: "not in IApp"});
      try {
        setTimeout(() => {
          const params_ = JSON.stringify(params || {});
          _debug("=> call IApp", action, params_)
          const res = this.app.call(action, params_);
          if (res.indexOf("err:") === 0) {
            console.error("=> call IApp error", res)
            if (this.isDebug()) {
              showTopTips(res, {detail: {action, params}},)
            } else {
              showTopTips("系统调用出错，0x003", {})
            }
            reject({message: res.substring(4)})
          } else {
            resolve(res)
          }
        }, 10)
      } catch (e) {
        console.error("call IApp error:", e)
        reject(e)
      }
    })
  }

  applyPermission(permission) {
    return this.run("applyPermission", {permission})
  }

  /**
   *
   * @param permission
   * @param options
   * @return {Promise<unknown>}
   */
  checkPermission(permission, options) {
    const {tips, silent,useCache} = options || {useCache:true}
    return new Promise((resolve, reject) => {
      const permission_cache = BDPermission.getAdrPermissionFromCache(permission)
      if (this.checkNotIApp()) {
        resolve()
      } else if (useCache && permission_cache === BDPermission.adrPermissionResult.PERMISSION_GRANTED) {
        resolve()
      } else {
        let permissionName;
        if (BDPermission.permissionsAdr[permission]) {
          permissionName = BDPermission.permissionsAdr[permission]
        } else {
          showToastText("不合法的权限")
          reject()
        }
        if (permissionName) {
          this.run("checkPermission", {permission}).then((res) => {
            if (res === 'false') {
              if (silent) resolve()
              else {
                this.applyPermission(permission)
                BDPermission.callback[permission] = () => {
                  window.weui
                    .dialog(
                      {
                        title: "权限申请",
                        content: tips ? tips : `系统检测到没有开启使用 "${permissionName}" 权限,您可以点击 "设置"，进入 "权限管理" 开启权限。`,
                        buttons: [{
                          label: '返回',
                          type: 'default',
                          onClick: () => {
                            reject()
                          }
                        }, {
                          label: '设置',
                          type: 'primary',
                          onClick: () => {
                            this.run(
                              "openAppDetailsSettings"
                            )
                          }
                        }]
                      })
                }
                BDPermission.callbackResolve[permission] = () => {
                  resolve()
                }
              }
            } else {
              BDPermission.setAdrPermissionCache(permission, BDPermission.adrPermissionResult.PERMISSION_GRANTED)
              resolve()
            }
          }).catch(reject)
        }
      }
    })

  }

  checkPermission_READ_CONTACTS() {
    return this.run("checkPermission", {permission: "READ_CONTACTS"})
  }

  checkPermission_CAMERA() {
    return this.run("checkPermission", {permission: "CAMERA"})
  }

  checkPermission_ACCESS_FINE_LOCATION() {
    return this.run("checkPermission", {permission: "ACCESS_FINE_LOCATION"})
  }

  checkPermission_RECORD_AUDIO() {
    return this.run("checkPermission", {permission: "RECORD_AUDIO"})
  }


  call(action, params, cb, err) {
    if (this.checkNotIApp()) return;
    try {
      setTimeout(() => {
        const params_ = JSON.stringify(params || {});
        console.log("=> call IApp", action, params_)
        const res = this.app.call(action, params_);
        if (res.indexOf("err:") === 0) {
          console.error("=> call IApp error", res)
          if (this.isDebug()) {
            showTopTips(res, {detail: {action, params}},)
          } else {
            showTopTips("系统调用出错，0x003", {})
          }
          err && err({message: res.substring(4)})
        } else {
          cb && cb(res)
        }
      }, 10)
    } catch (e) {
      console.error(e)
      err && err(e)
    }
  }

  onOpenChat(sessionKey) {
    if (this.checkNotIApp()) return;
    this.app.onOpenChat(sessionKey)
  }

  getMapVersion() {
    const {map} = getConstant()
    const {version} = map
    return {
      version
    }
  }

  getConstantVersion() {
    const {version} = getConstant()
    return {
      version
    }
  }

  getUiVersion() {
    const {assets} = getConstant()
    const {zipUrl,version} = assets
    const t = zipUrl.split('-')
    return {
      version: version,
      updatedAt: t[t.length - 1].replace(".zip")
    }
  }

  getRsaKeys(defaultRsaSize) {
    if (this.rsaKeys) {
      return this.rsaKeys;
    } else {
      return this.getRsaKeysFromStorage(defaultRsaSize)
    }
  }

  getRsaKeysFromStorage(defaultRsaSize) {
    let keys = getItemFromLocalStorage(rsa_store_key, true)
    if (!keys) {
      keys = genRsaKey(defaultRsaSize || 1024)
      this.rsaKeys = keys;
      setItemFromLocalStorage(rsa_store_key, JSON.stringify(keys))
    }
    return keys;
  }

  processRsaKey(defaultRsaSize) {
    let keys = getItemFromLocalStorage(rsa_store_key, true)
    if (!keys) {
      keys = genRsaKey(defaultRsaSize)
      setItemFromLocalStorage(rsa_store_key, JSON.stringify(keys))
    }
    this.rsaKeys = keys;
  }

  getRsaPubKey() {
    return this.rsaKeys['pub64']
  }

  encryptDataByPubKey(pub, data) {
    return rsaEncryptByPubKey(pub, data)
  }

  decryptDataByPriKey(data) {
    const {pri} = this.rsaKeys
    return rsaDecryptByPrvKey(pri, data)
  }

  signByPriKey(str) {
    const {pri} = this.rsaKeys
    return signByPriKey(pri, str)
  }

  verifyByPubKey(pubKey, str, signature) {
    return verifyByPubKey(pubKey, str, signature)
  }

  playRing() {
    this.runOnce("playRing")
  }

  stopRing() {
    this.runOnce("stopRing")
  }
}

export default new IApp();
