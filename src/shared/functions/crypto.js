import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import SHA256 from "crypto-js/sha256";
import AesEncryption from "../aes/AesEncryption";

export const numberSet = '0123456789';
export const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const hexSet = "0123456789abcdef"
export const specialSet = '~!@#$%^&*()_+=-|/|><.,~?';


export const pubKeyStart = "-----BEGIN PUBLIC KEY-----"
export const pubKeyEnd = "-----END PUBLIC KEY-----"

export const prvKeyStart = "-----BEGIN RSA PRIVATE KEY-----"
export const prvKeyEnd = "-----END RSA PRIVATE KEY-----"

export const prvEncryptKeyStart = "-----BEGIN ENCRYPT RSA PRIVATE KEY-----"
export const prvEncryptKeyEnd = "-----END ENCRYPT RSA PRIVATE KEY-----"



export function md5(message) {
  const hash = CryptoJS.MD5(message)
  return CryptoJS.enc.Hex.stringify(hash);
}

export function sha1(message) {
  const hash = CryptoJS.SHA1(message)
  return CryptoJS.enc.Hex.stringify(hash);
}

/**
 *
 * @param message
 * @param outputLength one of 224, 256, 384, or 512 bits. The default is 512 bits
 * @returns {*}
 */
export function sha3(message, outputLength = 512) {
  const hash = CryptoJS.SHA3(message, {outputLength})
  return CryptoJS.enc.Hex.stringify(hash);
}

export function sha256(message) {
  const hash = CryptoJS.SHA256(message)
  return CryptoJS.enc.Hex.stringify(hash);
}

export function sha512(message) {
  const hash = CryptoJS.SHA512(message)
  return CryptoJS.enc.Hex.stringify(hash);
}

/**
 *
 * @param message
 * @param key %8 == 0
 * @param iv  %8 == 0
 * @returns {string}
 */
export function aesEncryptWithIv(message, key, iv) {
  if (("" + key).length % 8 !== 0) throw Error("invalid key")
  if (("" + iv).length % 8 !== 0) throw Error("invalid iv")
  const res = CryptoJS.AES.encrypt(
    message,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    })
  return res.toString()
}

/**
 *
 * @param message
 * @param key %8 == 0
 * @param iv  %8 == 0
 * @returns {string}
 */
export function aesDecryptWithIv(message, key, iv) {
  if (("" + key).length % 8 !== 0) throw Error("invalid key")
  if (("" + iv).length % 8 !== 0) throw Error("invalid iv")

  const decrypt = CryptoJS.AES.decrypt(
    message,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * AES ECB 加密
 * @param data 待加密字段
 * @param aesKey 加密 key
 * @returns {String} 返回加密字段
 */
export function aesEncrypt(data, aesKey) {
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  data = parseToString(data);
  const srcs = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * AES ECB 解密
 * @param data 待解密数据
 * @param aesKey 解密 key
 * @returns {String} 返回解密字符串
 */
export function aesDecrypt(data, aesKey) {
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const decrypt = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * 生成 AESKEY
 * @returns {String} 返回生成的 32位 AESKEY
 */
export function createAesKey() {
  return createString(32);
}

/**
 * 生成 AES IV
 * @returns {String} 返回生成的 16位 AES IV
 */
export function createAesIv() {
  return createString(16);
}

/**
 * 转换为字符串
 * @param {*} data
 * @returns {String}
 */
function parseToString(data) {
  let d = '';
  switch (typeof data) {
    case 'string':
      d = data;
      break;
    case 'object':
      d = JSON.stringify(data);
      break;
    default:
      d = data.toString();
  }
  return d;
}

export function desEncrypt(message, passwd) {
  try {
    const keyHex = CryptoJS.enc.Utf8.parse(passwd);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
  } catch (e) {
    return ""
  }
}

export function desDecrypt(message, passwd) {
  const keyHex = CryptoJS.enc.Utf8.parse(passwd);
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(message)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 生成指定位数字符
 * @param length
 * @returns {String} 返回生成的指定位数字符
 */
function createString(length) {
  const expect = length;
  let str = Math.random().toString(36).substr(2);
  while (str.length < expect) {
    str += Math.random().toString(36).substr(2);
  }
  str = str.substr(0, length);
  return str;
}

export function randomString(strLength, type) {
  const result = [];
  strLength = strLength || 5;

  const characterAndNumberSetSet = numberSet + characterSet
  const numberAndSpecialSet = numberSet + specialSet
  const characterAndNumberAndSpecialSet = numberSet + characterSet + specialSet
  let charSet;
  switch (type) {
    case 1:
      charSet = characterSet;
      break
    case 2:
      charSet = specialSet;
      break
    case 3:
      charSet = characterAndNumberSetSet;
      break
    case 4:
      charSet = numberAndSpecialSet;
      break
    case 5:
      charSet = characterAndNumberAndSpecialSet;
      break
    case 6:
      charSet = hexSet;
      break
    default:
      charSet = numberSet;
      break
  }
  while (strLength--) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }
  return result.join('');
}


export function aesEncryptCbc256(plainStr, key, iv) {
  if (!iv) {
    iv = CryptoJS.enc.Utf8.parse(sha256(key).substring(0, 16));
  } else {
    iv = CryptoJS.enc.Utf8.parse(sha256(iv).substring(0, 16));
  }
  const encryptedCP = CryptoJS.AES.encrypt(
    plainStr,
    CryptoJS.enc.Utf8.parse(sha512(key).substring(0, 32)),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  return encryptedCP.toString();
}


export function aesDecryptCbc256(cipherStr, key, iv) {
  if (!iv) {
    iv = CryptoJS.enc.Utf8.parse(sha256(key).substring(0, 16));
  } else {
    iv = CryptoJS.enc.Utf8.parse(sha256(iv).substring(0, 16));
  }
  const decryptedWA = CryptoJS.AES.decrypt(
    cipherStr,
    CryptoJS.enc.Utf8.parse(sha512(key).substring(0, 32)),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  return decryptedWA.toString(CryptoJS.enc.Utf8);
}

export function b64ToHex(b64Str) {
  const words = CryptoJS.enc.Base64.parse(b64Str);
  return CryptoJS.enc.Hex.stringify(words)
}

export function hexToB64(hexStr) {
  const words = CryptoJS.enc.Hex.parse(hexStr);
  return CryptoJS.enc.Base64.stringify(words)
}


// Convert a byte array to a hex string
export function bytesToHex(bytes) {
  const hex = []
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xf).toString(16))
  }
  return hex.join('')
}


// Convert a hex string to a byte array
export function hexToBytes(hex) {
  // eslint-disable-next-line prefer-const
  let bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return bytes
}


export function genRsaKey(size = 2048, log = false) {
  if (window['IApp']) {
    const rsaKey = window['IApp'].call("genRsa", JSON.stringify({size}))
    const pub64 = rsaKey.split("@")[0]
    const pri64 = rsaKey.split("@")[1]
    return {
      pub: formatRsaPubKey(pub64), pub64, pri: formatRsaPrvKey(pri64), pri64
    }
  } else {
    const crypt = new JSEncrypt({
      log,
      default_key_size: size
    });
    crypt.getKey();
    const pri = crypt.getPrivateKey()
    const pri64 = crypt.getPrivateKeyB64()
    const pub = crypt.getPublicKey()
    const pub64 = crypt.getPublicKeyB64()
    return {
      pub, pub64, pri, pri64
    }
  }
}

export async function genRsaKeyAsync(size = 2048, log = false) {
  const rsa = genRsaKey(size,log)
  return Promise.resolve(rsa)
}

export const rsaEncryptByPubKey = (pubKey, content) => {
  if (!pubKey || !content) {
    return ''
  }
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(pubKey)
  const k = encryptor.getKey()
  try {
    let ct = ''
    // RSA每次加密
    //  1024 / 8 - 11 = 117 bytes
    //  2048 / 8 - 11 = 254 bytes
    // ，需要辅助方法判断字符串截取位置
    // 1.获取字符串截取点
    const bytes = []
    bytes.push(0)
    let byteNo = 0
    let c
    const len = content.length
    let temp = 0
    for (let i = 0; i < len; i++) {
      c = content.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10ffff) {
        // 特殊字符，如Ř，Ţ
        byteNo += 4
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        // 中文以及标点符号
        byteNo += 3
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        // 特殊字符，如È，Ò
        byteNo += 2
      } else {
        // 英文以及标点符号
        byteNo += 1
      }
      if (byteNo % 117 >= 114 || byteNo % 117 === 0) {
        if (byteNo - temp >= 114) {
          bytes.push(i)
          temp = byteNo
        }
      }
    }
    // 2.截取字符串并分段加密
    if (bytes.length > 1) {
      for (let i = 0; i < bytes.length - 1; i++) {
        let str
        if (i === 0) {
          str = content.substring(0, bytes[i + 1] + 1)
        } else {
          str = content.substring(bytes[i] + 1, bytes[i + 1] + 1)
        }
        const t1 = k.encrypt(str)
        ct += t1
      }
      if (bytes[bytes.length - 1] !== content.length - 1) {
        const lastStr = content.substring(bytes[bytes.length - 1] + 1)
        const t = k.encrypt(lastStr)
        ct += t
      }
      return hexToB64(ct)
    }
    const t = k.encrypt(content)
    return hexToB64(t)
  } catch (ex) {
    console.error(ex)
    return false
  }
}

/**
 *
 * @param priKey
 * @param content {b64}
 * @returns {string|boolean}
 */
export const rsaDecryptByPrvKey = (priKey, content) => {
  if (!priKey || !content) {
    return ''
  }
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(priKey)
  const k = encryptor.getKey()
  let maxLength = (k.n.bitLength() + 7) >> 3
  maxLength = maxLength * 2
  try {
    const str = b64ToHex(content)
    let ct = ''
    if (str.length > maxLength) {
      const lt = str.match(RegExp(`.{1,${maxLength}}`,'g')) || ''
      lt.forEach(function (entry) {
        const t1 = k.decrypt(entry)
        ct += t1 !== null ? t1 : ""
      })
      return ct
    }
    const d = k.decrypt(str)
    return d !== null ? d : ""
  } catch (ex) {
    return false
  }
}

export function rsaEncryptByPubKeyToBytes(pubKey,plainStr) {
  if (!pubKey || !plainStr) {
    return ''
  }
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(pubKey)
  const k = encryptor.getKey()
  // eslint-disable-next-line no-bitwise
  const maxLength = ((k.n.bitLength() + 7) >> 3) - 11
  try {
    let lt = ''
    let ct = ''

    if (plainStr.length > maxLength) {
      lt = plainStr.match(/.{1,117}/g) || ''
      // eslint-disable-next-line func-names
      lt.forEach(function (entry) {
        const t1 = k.encrypt(entry)
        ct += t1
      })
      return hexToBytes(ct)
    }
    const t = k.encrypt(plainStr)
    return hexToBytes(t)
  } catch (ex) {
    return false
  }
}

export function verifyRsaKeys(rsaKeys) {
  return (rsaKeys.indexOf(pubKeyStart) > -1 && rsaKeys.indexOf(pubKeyEnd) > -1) ||
    (rsaKeys.indexOf(prvKeyStart) > -1 && rsaKeys.indexOf(prvKeyEnd) > -1)
}


export function verifyPrvKeys(rsaKeys) {
  return (rsaKeys.indexOf(prvEncryptKeyStart) > -1 && rsaKeys.indexOf(prvEncryptKeyEnd) > -1) ||
    (rsaKeys.indexOf(prvKeyStart) > -1 && rsaKeys.indexOf(prvKeyEnd) > -1)
}

export function verifyPubKeys(rsaKeys) {
  return rsaKeys.indexOf(pubKeyStart) > -1 && rsaKeys.indexOf(pubKeyEnd) > -1
}

export function signByPriKey(priKey, message) {
  const sign = new JSEncrypt();
  sign.setPrivateKey(priKey);
  return sign.sign(message, SHA256, "sha256");
}

export function verifyByPubKey(pubKey, message, signature) {
  const verify = new JSEncrypt();
  verify.setPublicKey(pubKey);
  // debugger
  return verify.verify(message, signature, SHA256);
}


export function formatRsaPubKey(dataStr) {
  const rows = dataStr.match(RegExp(`.{1,${64}}`, 'g'))
  let res = pubKeyStart + "\n"
  rows.forEach(row => {
    res += row + "\n"
  })
  res += pubKeyEnd
  return res;
}

export function formatRsaPrvKey(dataStr, keyEncrypt) {
  const rows = dataStr.match(RegExp(`.{1,${64}}`, 'g'))
  let res = keyEncrypt ? prvEncryptKeyStart + "\n" : prvKeyStart + "\n"
  rows.forEach(row => {
    res += row + "\n"
  })
  res += keyEncrypt ? prvEncryptKeyEnd : prvKeyEnd
  return res;
}


export function parseBdRsaKeysContent(data) {
  const content = data.trim() + "\n"
  let fingerprint, prvKey, pubKey, keySize, keyEncrypt, keyIterations = 20000;
  keyEncrypt = false;

  try {
    if (content.indexOf(pubKeyStart) > -1 && content.indexOf(pubKeyStart) > -1) {
      pubKey = content.substring(content.indexOf(pubKeyStart), content.indexOf(pubKeyEnd)) + pubKeyEnd
      pubKey = pubKey.trim()
    }

    if (content.indexOf(prvKeyStart) > -1 && content.indexOf(prvKeyEnd) > -1) {
      prvKey = content.substring(content.indexOf(prvKeyStart), content.indexOf(prvKeyEnd)) + prvKeyEnd
      prvKey = prvKey.trim()
    }

    if (content.indexOf(prvEncryptKeyStart) > -1 && content.indexOf(prvEncryptKeyEnd) > -1) {
      prvKey = content.substring(content.indexOf(prvEncryptKeyStart), content.indexOf(prvEncryptKeyEnd)) + prvEncryptKeyEnd
      prvKey = prvKey.trim()
      keyEncrypt = true;
    }

    if (content.indexOf("KeySize:") > -1) {
      keySize = content.split("KeySize:")[1].substring(0, content.split("KeySize:")[1].indexOf("\n"))
      keySize = parseInt(keySize.trim())
    }

    if (content.indexOf("keyIterations:") > -1) {
      keyIterations = content.split("keyIterations:")[1].substring(0, content.split("keyIterations:")[1].indexOf("\n"))
      keyIterations = parseInt(keyIterations.trim())
    }

    if (content.indexOf("Fingerprint[md5(pubKey)]:") > -1) {
      fingerprint = content.split("Fingerprint[md5(pubKey)]:")[1]
      fingerprint = fingerprint.trim()
    }
  } catch (e) {
    console.error(e)
  }
  return {
    fingerprint, prvKey, pubKey, keySize, keyEncrypt,keyIterations
  }
}


export function parseRsaKeys(content, password) {
  try {
    let {
      fingerprint,
      prvKey,
      pubKey,
      keySize,
      keyIterations,
      keyEncrypt
    } = parseBdRsaKeysContent(content)

    if (keyEncrypt > 0 && (!password || password.length < 6)) {
      console.error("密码不能为空")
      return {}
    }
    if (keyEncrypt) {
      const prvKeyEncrypted = prvKey.split(prvEncryptKeyStart + "\n")[1].split("\n" + prvEncryptKeyEnd)[0].replace(/\n/g, "")
      const aes = new AesEncryption("cbc", 256, keyIterations)
      const prvKeyDecrypt = aes.decrypt(prvKeyEncrypted, password)
      prvKey = formatRsaPrvKey(prvKeyDecrypt, false)
    }
    return {prvKey, pubKey, fingerprint, keyIterations,keySize}
  } catch (e) {
    console.error(e)
    return {}
  }
}

export function formatBdRsaKeys({pubKey, prvKey, keySize, keyEncrypt, passwd, base64EncodePubKey, keyIterations}) {
  if (!keyIterations) {
    keyIterations = 20000
  }
  let fingerprint = md5(pubKey)
  let pubKeyFormatted = pubKey
  let prvKeyFormatted = prvKey
  if (pubKey.indexOf(pubKeyStart) === -1) {
    pubKeyFormatted = formatRsaPubKey(pubKey)
  }
  if (keyEncrypt) {
    const aes = new AesEncryption("cbc", 256, keyIterations)
    let prvKey1;
    if (prvKey.indexOf(prvEncryptKeyStart) === 0) {
      prvKey1 = prvKey.split(prvEncryptKeyStart + "\n")[1].split("\n" + prvEncryptKeyEnd)[0].replace(/\n/g, "")
    } else if (prvKey.indexOf(prvKeyStart) === 0) {
      prvKey1 = prvKey.split(prvKeyStart + "\n")[1].split("\n" + prvKeyEnd)[0].replace(/\n/g, "")
    } else {
      prvKey1 = prvKey
    }
    const prvKeyEncrypted = aes.encrypt(prvKey1, passwd)
    prvKeyFormatted = formatRsaPrvKey(prvKeyEncrypted, true)
  } else {
    if (prvKey.indexOf(prvKeyStart) === -1) {
      prvKeyFormatted = formatRsaPrvKey(prvKey, false)
    }
  }
  let base64PubKey = ""
  if(base64EncodePubKey){
    base64PubKey = `PubKeyBase64:${window.btoa(pubKeyFormatted)}\n`
  }
  return `${pubKeyFormatted}\n${prvKeyFormatted}\n${base64PubKey}` +
    `KeySize:${keySize}\n` +
    `keyIterations:${keyIterations}\n` +
    `Fingerprint[md5(pubKey)]:${fingerprint}\n`
}
