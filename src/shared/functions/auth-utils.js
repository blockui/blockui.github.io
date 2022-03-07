import {md5, rsaEncryptByPubKey} from "shared/functions/crypto";
import {
  genNickname,
  getConstant,
  getCurrentTimeStamp,
  getItemFromLocalStorage,
  globalLoadingHide,
  locationHash,
  removeItemFromLocalStorage,
  setItemFromLocalStorage,
  showTopTips
} from "./common";
import {dispatchStore, setStoreState} from "components/core/App";
import {getCache, setCache} from "./cache";
import BDApp from "../BD/BDApp";
import BDAuth from "../BD/BDAuth";
import config from "../../config";
import {PASSWORD_REGX} from "./string";
import {PageManager} from "../../components/core/PageManager";
import {base64Decode} from "./base64";

/**
 * @deprecated
 * @param token
 * @param user_id
 * @return {string|*|boolean}
 */
export function encApiToken(token, user_id) {
  const {im} = BDApp.getConstant()
  const {server} = im
  return rsaEncryptByPubKey(
    server.pubKey,
    token + "." + Math.floor(getCurrentTimeStamp() / 1000) + "." + user_id
  )
}

/**
 * @deprecated
 * @param str
 * @param l
 * @return {*}
 */
export function getStrHash(str, l) {
  return md5(md5(str) + md5(str.split("").slice(0, l).reverse().join("")))
}

/**
 * @deprecated
 * @param username
 * @param rsaKey
 * @return {{bdVersion: *, rsaKey, phone: string, bdPlatform: *, api_token: string, circle_banner: string, id: string, avatar: string, sign_info: string, email: string, username}}
 */
export function initAuthUser({username, fingerprint,rsa_key}) {
  let authUser = {
    ...BDAuth.initUserInfo({username,fingerprint, rsa_key})
  }
  const userHistory = getUsersHistory()
  let user_;
  if (userHistory.length > 0) {
    userHistory.forEach(user => {
      if (user.fingerprint === authUser.fingerprint) {
        user_ = user
      }
    })
  }
  if (!user_) {
    authUser.nickname = genNickname(username)
    authUser.avatar = username
  } else {
    authUser.nickname = user_.nickname;
    authUser.avatar = user_.avatar;
  }
  return authUser;

}

export function getIsFirstLogin() {
  const res = getItemFromLocalStorage("auth.isFirstLogin", false, true)
  if (res === "false") {
    return false
  } else {
    return !!res
  }
}

export function clearUsersHistory() {
  return removeItemFromLocalStorage("auth.h")
}

export function getUsersHistory() {
  let res = getItemFromLocalStorage("auth.h", false, null)
  if(res){
    if(res.indexOf("^") === 0){
      res = res.substring(1)
      res = base64Decode(res)
    }
    res = JSON.parse(res)
  }else{
    res = []
  }
  return res;
}

export function setLastLoginUserName(username) {
  return setItemFromLocalStorage("auth.lastLoginUserName", username)
}

export function getLastLoginUserName() {
  return getItemFromLocalStorage("auth.lastLoginUserName", false, null)
}

export function getSignMessage({fingerprint, captcha}) {
  return `${fingerprint}_${captcha}_${getCurrentTimeStamp() / 1000}`
}

export function getCaptchaSignMessage({authFingerprint}) {
  return `${authFingerprint}`
}

export function setCacheAuthPrvKey(authFingerprint, val) {
  const {common} = getConstant()
  setCache("user.authPrvKey." + authFingerprint, val, common['authKeyExpireSec'], true)
}

export function getCacheAuthPrvKey(authFingerprint) {
  return getCache("user.authPrvKey." + authFingerprint)
}

export function requestAuthKey(user) {
  return new Promise((resolve) => {
    // _log("requestAuthKey", user.username)
    const authPwd = BDAuth.getAuthPwd()
    if (authPwd) {
      //_log("requestAuthKey from cache!", user.username)
      BDAuth.cacheAuthPwd(authPwd)
      resolve({...user})
    } else {
      //_log("requestAuthKeying...", user.username)
      setStoreState("global", {
        passwordInputHandler: {
          user,
          callback: ({password}) => {
            BDAuth.cacheAuthPwd(password)
            BDAuth.onLoginRemote(user, password).then((authUser) => {
              setStoreState("auth", {user: authUser})
            }).finally(() => {
              BDApp.afterRequestAuthKey()
              resolve({...user})
            })
          }
        }
      })
    }
  })
}

export function genLoginCaptchaStr(captcha, pubKey, fingerprint) {
  const {common} = getConstant()
  const {qrCodePrefix} = common
  return `${qrCodePrefix}login/${captcha}|${BDApp.platform}|${BDApp.version}|${fingerprint}|${pubKey}`
}

export function parseLoginCaptchaStr(str) {
  const t = str.substring("login/".length).split("|")
  return {
    captcha: t[0],
    bdVersion: t[1],
    bdPlatform: t[2],
    fingerprint: t[3],
    pubKey: t[4],
  }
}

export function onLocalLogin(user) {
  // _log("onLocalLogin", user.id)
  if (BDApp.isDebug()) {
    document.title = BDApp.getConstant().title + "@" + user.id + " >> " + user.nickname
  }
  BDAuth.setGlobalUser(user)
  setLastLoginUserName(user.username)
  setStoreState("global", {
    showLoginView: false,
  })
  setStoreState("auth", {
    user,
    lastLoginUserName: user.username,
    isFirstLogin: false
  })
  globalLoadingHide()
}

export function initStore() {
  // _log("initStore")
  dispatchStore("im", "init")
  dispatchStore("badge", "init")
  dispatchStore("friend", "init")
  dispatchStore("message", "init")
  dispatchStore("session", "init")
  dispatchStore("favor", "init")
  dispatchStore("address", "init")
  dispatchStore("ui", "init")
}

export function initPageStack() {
  locationHash(PageManager.defaultIndexPageName)
}

export function checkInputPassword(password) {
  if (!PASSWORD_REGX.test(password.trim())) {
    showTopTips("密码最少八个字符，需字母和数字的组合")
    return false
  }
  return true;
}

export function checkSeedPwd(passphrase) {
  if (passphrase.length === 0) {
    showTopTips("密码不能为空！")
    return false
  }
  const password = BDAuth.getStrHash(passphrase, config.common['hashSlice1']);
  try {
    const res = BDAuth.__getRsaPrvKey(password)
    if (!res) {
      showTopTips("密码不正确！")
      return false
    }
  } catch (e) {
    showTopTips("密码不正确！")
    return false
  }

  return {password}
}

