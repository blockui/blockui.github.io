import {
  parseBdRsaKeysContent,
  parseRsaKeys,
  rsaDecryptByPrvKey,
  rsaEncryptByPubKey,
  verifyPrvKeys,
  verifyPubKeys
} from "./crypto";
import {getWeui} from "./common";


export function rsaEncryptOrDecryptData({encrypt, rsaKeys, data}) {
  return new Promise((resolve, reject) => {
    rsaKeys = rsaKeys.trim()
    data = data.trim()
    if (!rsaKeys) {
      return reject({message: "密钥不能为空！"})
    }
    if (encrypt && !verifyPubKeys(rsaKeys)) {
      return reject({message: "公钥解析失败！"})
    }
    if (!encrypt && !verifyPrvKeys(rsaKeys)) {
      return reject({message: "私钥钥解析失败！"})
    }
    if (!data) {
      return reject({message: "加解密文本不能为空！"})
    }
    let result;
    let {pubKey, keyEncrypt, prvKey} = parseBdRsaKeysContent(rsaKeys)

    if (encrypt) {

      result = rsaEncryptByPubKey(pubKey, data)
      if (!result) {
        return reject({message: "加密失败！"})
      }
      resolve(result)
    } else {
      const decryptData = (prvKey, data) => {
        result = rsaDecryptByPrvKey(prvKey, data)
        if (!result) {
          return reject({message: " 解密失败！"})
        }
        resolve(result)
      }
      if (keyEncrypt) {
        getWeui().prompt({
          title: "输入密码",
          useInput: true
        }).then(({value}) => {
          if (!value) {
            return reject({message: "密码不能为空"})
          } else {
            const {prvKey} = parseRsaKeys(rsaKeys, value)
            if (!prvKey) {
              return reject({message: "私钥钥解密失败"})
            } else {
              decryptData(prvKey, data)
            }
          }
        })
      } else {
        if (!prvKey) {
          return reject({message: "私钥解析失败"})
        }
        decryptData(prvKey, data)
      }
    }
  })
}
