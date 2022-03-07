import {
  formatBdRsaKeys,
  formatRsaPrvKey,
  genRsaKey,
  md5,
  parseBdRsaKeysContent,
  prvEncryptKeyEnd,
  prvEncryptKeyStart,
  rsaDecryptByPrvKey,
  rsaEncryptByPubKey,
  signByPriKey,
  verifyByPubKey
} from "../functions/crypto";
import {getCache, setCache} from "../functions/cache";
import {getCurrentTimeStamp} from "../functions/utils";
import {postRemote} from "../functions/network";
import BDServer from "./BDServer";
import {requestAuthKey} from "../functions/auth-utils";
import {globalLoading, globalLoadingHide, showToast} from "../functions/common";
import config from "config";
import {setStoreState} from "components/core/App";
import AesEncryption from "../aes/AesEncryption";
import BDApp from "./BDApp";
import {base64Decode, base64Encode} from "../functions/base64";

class BDAuth {
  static createRsaKey(passphrase, keySize = 2048, keyIterations = 20000) {
    const passwd = BDAuth.getStrHash(passphrase, config.common.hashSlice1)
    const rsa = genRsaKey(keySize)
    return formatBdRsaKeys({
      keySize,
      passwd,
      pubKey: rsa.pub,
      prvKey: rsa.pri,
      keyEncrypt: true,
      base64EncodePubKey: false,
      keyIterations
    })
  }

  static initUserInfo(user) {
    return {
      id: "",
      fingerprint: "",
      password: "",
      username: "",
      nickname: "",
      rsa_key: "",
      email: "",
      phone: "",
      avatar: "",
      sign_info: "",
      circle_banner: "",
      api_token: "",
      last_login: "",
      geo_on: "",
      ...user,
    }
  }

  static __getStorageHandler() {
    if (window["BD"] && window["BD"]['debug'] && !BDApp.getAdrBridge()) {
      return window.sessionStorage
    } else {
      return window.localStorage
    }
  }

  static clearUserAuthPwd(fingerprint, password) {
    const key = "user.auth1." + fingerprint;
    if (window["BD"] && window["BD"]['debug']) {
      setCache(key, password, 0, true)
    } else {
      BDAuth.__pwds[key] = password
    }
  }

  static clearAuthPwd(password) {
    const fingerprint = "user.auth1." + BDAuth.getRsaFingerprint();
    BDAuth.clearUserAuthPwd(fingerprint, password)
  }

  static cacheAuthPwd(password) {
    const key = "user.auth1." + BDAuth.getRsaFingerprint();
    if (window["BD"] && window["BD"]['debug']) {
      setCache(key, password, 0, true)
    } else {
      BDAuth.__pwds[key] = password
    }
  }

  static getAuthPwd() {
    if (!BDAuth.getGlobalUser()) return null;
    const key = "user.auth1." + BDAuth.getRsaFingerprint();
    if (window["BD"] && window["BD"]['debug']) {
      return getCache(key)
    } else {
      return BDAuth.__pwds[key] || null
    }
  }

  static setGlobalUser(user) {
    BDAuth.__globalAuthUser = user
    BDAuth.__getStorageHandler().setItem("auth.10", "^" + base64Encode(JSON.stringify(user)))
  }

  static removeGlobalAuthUser() {
    BDAuth.__globalAuthUser = null;
    BDAuth.__getStorageHandler().removeItem("auth.10")
  }

  static getGlobalAuthUserId() {
    const authUser = BDAuth.getGlobalUser()
    if (authUser) {
      return authUser.id;
    } else {
      return null
    }
  }

  static getGlobalUser() {
    const {__globalAuthUser} = BDAuth;
    let user;
    if (!__globalAuthUser) {
      user = BDAuth.__getStorageHandler().getItem("auth.10")
      if (user) {
        if (user.indexOf("^") === 0) {
          user = user.substring(1)
          user = base64Decode(user)
        }
        user = JSON.parse(user)
      }
    } else {
      user = __globalAuthUser
    }
    return user
  }

  static getUserRsaFingerprint(rsa_key) {
    const {fingerprint} = parseBdRsaKeysContent(rsa_key)
    return fingerprint;
  }

  static getRsaFingerprint() {
    const {rsa_key} = BDAuth.getGlobalUser()
    return BDAuth.getUserRsaFingerprint(rsa_key);
  }

  static getRsaPubKey() {
    const {rsa_key} = BDAuth.getGlobalUser()
    const {pubKey} = parseBdRsaKeysContent(rsa_key)
    return pubKey;
  }

  static getRsaKeySize() {
    const {rsa_key} = BDAuth.getGlobalUser()
    const {keySize} = parseBdRsaKeysContent(rsa_key)
    return keySize;
  }

  static __getRsaPrvKey(passwd) {
    const user = BDAuth.getGlobalUser()
    const {rsa_key, fingerprint} = user
    if (!BDAuth.__prvKeys[fingerprint]) {
      let {prvKey, keyIterations} = parseBdRsaKeysContent(rsa_key)
      const prvKeyEncrypted = prvKey.split(prvEncryptKeyStart + "\n")[1].split("\n" + prvEncryptKeyEnd)[0].replace(/\n/g, "")
      const aes = new AesEncryption("cbc", 256, keyIterations)
      const prvKeyDecrypt = aes.decrypt(prvKeyEncrypted, passwd)
      if (prvKeyDecrypt) {
        prvKey = formatRsaPrvKey(prvKeyDecrypt, false)
        BDAuth.__prvKeys[fingerprint] = prvKey
        return prvKey;
      } else {
        return null;
      }
    } else {
      return BDAuth.__prvKeys[fingerprint];
    }
  }

  static getLoginSignMessage({fingerprint, captcha}) {
    return `${fingerprint}_${captcha}_${getCurrentTimeStamp(1)}`
  }

  static getCaptchaSignMessage({fingerprint}) {
    return `${fingerprint}_${getCurrentTimeStamp(1)}`
  }

  static sign(message, password) {
    const prvKey = BDAuth.__getRsaPrvKey(password)
    return signByPriKey(prvKey, message)
  }

  static verifySign(message, signature) {
    const pubKey = BDAuth.getRsaPubKey()
    return verifyByPubKey(pubKey, message, signature)
  }

  static rsaEncrypt(plainData) {
    const pubKey = BDAuth.getRsaPubKey()
    return rsaEncryptByPubKey(pubKey, plainData)
  }

  static rsaDecrypt(cipherData, passwd) {
    const prvKey = BDAuth.__getRsaPrvKey(passwd)
    return rsaDecryptByPrvKey(prvKey, cipherData)
  }

  static getStrHash(str, sliceLen = 16) {
    if (sliceLen > 32) sliceLen = 32
    return md5(md5(str) + md5(str.split("").slice(0, sliceLen).reverse().join("")))
  }

  static requestLoginCaptcha({password}) {
    return new Promise((resolve, reject) => {
      const fingerprint = BDAuth.getRsaFingerprint()
      const message = BDAuth.getCaptchaSignMessage({fingerprint})
      const sign = BDAuth.sign(message, password)
      if (sign) {
        postRemote("api/auth/random/captcha", {
          sign,
          message,
          auth_pub_key: BDAuth.getRsaPubKey()
        }).then(({captcha, expire_at}) => {
          resolve({captcha, expire_at})
        }).catch(e => {
          reject(e)
        })
      } else {
        reject({message: "requestLoginCaptcha gen sign error"})
      }
    })
  }

  static requestQrLoginCaptcha({pubKey, prvKey}) {
    return new Promise((resolve, reject) => {
      const fingerprint = md5(pubKey)
      const message = BDAuth.getCaptchaSignMessage({fingerprint})
      const sign = signByPriKey(prvKey, message)
      if (sign) {
        postRemote("api/auth/random/captcha", {
          sign,
          message,
          auth_pub_key: pubKey
        }).then(({captcha, expire_at}) => {
          resolve({captcha, expire_at})
        }).catch(e => {
          reject(e)
        })
      } else {
        reject({message: "requestLoginCaptcha gen sign error"})
      }
    })
  }

  static handleLoginResUser(user, rsa_key, password) {
    const {cipher, ...authUser} = user
    const cipherRes = BDAuth.rsaDecrypt(cipher, password)
    const t = cipherRes.split("|");
    const api_token = t[0];
    if (t.length > 0) {
      rsa_key = cipherRes.substring(api_token.length + 1)
    }
    return {rsa_key, api_token, ...authUser}
  }

  static async _onLoginRemote(authUser, password, qr_auth_pub_key, qr_code_captcha, qr_code_fingerprint) {
    let {
      username,
      nickname,
      rsa_key
    } = authUser
    const {captcha} = await BDAuth.requestLoginCaptcha({password})
    const fingerprint = BDAuth.getRsaFingerprint()
    const message = BDAuth.getLoginSignMessage({fingerprint, captcha})
    const sign = BDAuth.sign(message, password)
    const cipher = BDServer.rsaEncrypt(password + "|" + rsa_key);
    let qr_code;
    if (qr_auth_pub_key) {
      qr_code = {
        qr_auth_pub_key, qr_code_captcha, qr_code_fingerprint
      }
    }
    const {user} = await postRemote("api/auth/login", {
      sign,
      message,
      username,
      nickname,
      fingerprint,
      cipher,
      auth_pub_key: BDAuth.getRsaPubKey(),
      qr_code
    })
    return Promise.resolve(user)
  }

  static async onLoginRemote(authUser, password) {
    let {
      rsa_key
    } = authUser
    const user = await BDAuth._onLoginRemote(authUser, password)
    const imUser = BDAuth.handleLoginResUser(user, rsa_key, password)
    BDAuth.setGlobalUser(imUser)
    setStoreState("auth", {user: imUser})
    return Promise.resolve(imUser)
  }

  static requestQrCodeLogin({pubKey, prvKey, captcha}) {
    return new Promise((resolve, reject) => {
      const fingerprint = md5(pubKey)
      const message = BDAuth.getLoginSignMessage({fingerprint, captcha})
      const sign = signByPriKey(prvKey, message)
      if (sign) {
        postRemote("api/auth/qrcode/login", {
          sign,
          message,
          fingerprint,
          auth_pub_key: pubKey,
        }).then((body) => {
          resolve(body)
        }).catch(e => {
          reject(e)
        })
      } else {
        reject({message: "requestQrCodeLogin gen sign error"})
      }
    })
  }

  static async qrCodeLoginConfirm({captcha, pubKey, fingerprint}) {
    const authUser = BDAuth.getGlobalUser()
    try {
      globalLoading("授权中...")
      await requestAuthKey(authUser)
      const password = BDAuth.getAuthPwd()
      await BDAuth._onLoginRemote(authUser, password, pubKey, captcha, fingerprint)
      globalLoadingHide()
      showToast("授权成功！")
    } catch (e) {
      globalLoadingHide()
      showToast("授权失败！")
    }
  }

  static encryptApiToken() {
    const {api_token, id} = BDAuth.getGlobalUser()
    const message = api_token + "." + getCurrentTimeStamp(true) + "." + id
    return BDServer.rsaEncrypt(message)
  }

  static isInitUsername(username) {
    return username.indexOf("0x_") === 0 && username.length >= 35;
  }
}

BDAuth.__prvKeys = {};
BDAuth.__pwds = {};
BDAuth.__globalAuthUser = null;
export default BDAuth
