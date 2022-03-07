import BDAuth from "./BDAuth";
import {pubKeyStart} from "../functions/crypto";
import {initTest} from "shared/test.js"

test("BDAuth crypt", () => {
  const passphrase = "passphrase"
  const password = BDAuth.getStrHash(passphrase, 16)
  expect(password.length).toEqual(32)
  const rsa_key = BDAuth.createRsaKey(passphrase)
  BDAuth.setGlobalUser({
    rsa_key
  })
  const user = BDAuth.getGlobalUser()
  expect(!!user['rsaKey']).toEqual(true)
  const pubKey = BDAuth.getRsaPubKey()
  expect(pubKey.indexOf(pubKeyStart) > -1).toEqual(true)
  const fingerprint = BDAuth.getRsaFingerprint()
  expect(fingerprint.length).toEqual(32)
  const plainData = "plainData"
  const cipherData = BDAuth.rsaEncrypt(plainData)
  const plainData1 = BDAuth.rsaDecrypt(cipherData, password)
  expect(plainData).toEqual(plainData1)
  const message = "message"
  const signature = BDAuth.sign(message, password)
  const verifyRes = BDAuth.verifySign(message, signature)
  expect(verifyRes).toEqual(true)
})

test("BDAuth authUser", () => {
  const user = BDAuth.initUserInfo()
  const userKeys = Object.keys(user)
  expect(userKeys.indexOf("id") > -1).toEqual(true)
  expect(userKeys.indexOf("nickname") > -1).toEqual(true)
  expect(userKeys.indexOf("avatar") > -1).toEqual(true)
  expect(userKeys.indexOf("username") > -1).toEqual(true)
  expect(userKeys.indexOf("rsa_key") > -1).toEqual(true)
  expect(userKeys.indexOf("email") > -1).toEqual(true)
  expect(userKeys.indexOf("phone") > -1).toEqual(true)
  expect(userKeys.indexOf("avatar") > -1).toEqual(true)
  expect(userKeys.indexOf("sign_info") > -1).toEqual(true)
  expect(userKeys.indexOf("circle_banner") > -1).toEqual(true)
  expect(userKeys.indexOf("api_token") > -1).toEqual(true)

  BDAuth.cacheAuthPwd("pwd")
  expect("pwd").toEqual(BDAuth.getAuthPwd("test"))
})


test("BDAuth captcha", async () => {
  await initTest()
  const {password} = BDAuth.getGlobalUser()
  const {captcha} = await BDAuth.requestLoginCaptcha({password})
  expect(captcha.length > 0).toEqual(true)
})


test("BDAuth login", async () => {
  await initTest()
  const {password} = BDAuth.getGlobalUser()
  const user = await BDAuth.onLoginRemote(BDAuth.getGlobalUser(),password)
  expect(user.api_token.length > 0).toEqual(true)
})
