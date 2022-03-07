import Mnemonic from "./Mnemonic";
import {hdkey as HDKey} from "ethereumjs-wallet"


const RootKeyPrefixPath = "m/44'/60'/0'"

export default class Wallet {
  constructor(options) {
    const {network} = options || {}
    this.network = network || "eth"
  }

  static getPubKeyFromXPubKey(xPubKey_key) {
    return xPubKey_key.getWallet().publicKey
  }

  static keyFromExtendedKey(key) {
    return HDKey.fromExtendedKey(key);

  }

  static getMasterKeyFromMasterSeed(seed) {
    return HDKey.fromMasterSeed(seed);
  }

  static parsePath(path) {
    return path.trim("/").split("/")
  }

  static getKeyFromPath(masterKey, path) {
    return masterKey.derivePath(path)
  }

  static getRootKeysFromPath(masterKey) {
    const p = Wallet.parsePath(RootKeyPrefixPath)
    if (p[0] !== "m") {
      throw new Error("root_key must be a master key if 'm' is the first element of the path.")
    }
    const p1 = p.slice(1)
    let keys = [masterKey]
    let pp = "m"
    p1.forEach(row => {
      pp += "/" + row
      keys.push(masterKey.derivePath(pp))
    })
    return keys
  }

  getRootKeyPath() {
    return this.rootKeyPrefixPath + "/0/0"
  }

  getChildKeyPath(index) {
    return this.rootKeyPrefixPath + "/0/" + index
  }

  getMastarKey({mnemonic, password, lang}) {
    const mnemonic_ = new Mnemonic({mnemonic, lang})
    const seed = mnemonic_.toSeed(password || "")
    return Wallet.getMasterKeyFromMasterSeed(seed)
  }

  createWallet({mnemonic, password, lang, children}) {
    const mnemonic_ = new Mnemonic({
      mnemonic: mnemonic instanceof Mnemonic ? mnemonic.getMnemonic() : mnemonic,
      lang
    })
    const seed = mnemonic_.toSeed(password)
    const masterKey = Wallet.getMasterKeyFromMasterSeed(seed);
    const wallet = {
      "coin": "ETH",
      "entropySeed": mnemonic_.toEntropy(),
      "privateKey": "",
      "publicKey": "",
      "xPrvKey": "",
      "xPubKey": "",
      "address": "",
      "wif": "",
      "children": [],
      "auth": [],
      "username": ""
    }
    const rootKeys = Wallet.getRootKeysFromPath(masterKey)
    const acctKey = rootKeys[3]
    wallet["xPrvKey"] = acctKey.privateExtendedKey()
    wallet["xPubKey"] = acctKey.publicExtendedKey()
    wallet["username"] = "0x_" + acctKey.getWallet().getAddress().toString("hex")

    const primeKey = rootKeys[0].derivePath(RootKeyPrefixPath + "/0/0")
    const primeWallet = primeKey.getWallet()
    wallet["address"] = "0x" + primeWallet.getAddress().toString("hex")
    wallet["xPubKeyPrime"] = primeKey.publicExtendedKey()

    for (let i = 0; i < children; i++) {
      const childKey = rootKeys[0].derivePath(RootKeyPrefixPath + "/0/" + i)
      const childWallet = childKey.getWallet()
      wallet.children.push({
        address: "0x" + childWallet.getAddress().toString("hex"),
        xPubKey: childKey.publicExtendedKey(),
        path: "m/0/" + i,
        bip32Path: RootKeyPrefixPath + "/0/" + i,
      })
    }
    // _debug(wallet)
    return wallet
  }
}
