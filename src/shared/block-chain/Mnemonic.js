import {
  entropyToMnemonic,
  generateMnemonic,
  mnemonicToEntropy,
  mnemonicToSeedSync,
  setDefaultWordlist,
  validateMnemonic
} from 'bip39'
import {unique} from "../functions/array";

export const LangEnum = {
  en: "english",
  zh_cn: "chinese_simplified"
};

export default class Mnemonic {
  constructor(options) {
    const {lang, mnemonic} = options || {}
    this.defaultLang = Mnemonic._getLang(lang)
    setDefaultWordlist(this.defaultLang)
    if (mnemonic) {
      this._mnemonic = mnemonic
    } else {

      this._mnemonic = this.genMnemonic()

    }
  }

  genMnemonic() {
    let r = generateMnemonic()
    if (unique(r.split(" ")).length !== r.split(" ").length) {
      return this.genMnemonic()
    } else {
      return r
    }
  }

  getMnemonic() {
    return this._mnemonic
  }

  checkMnemonic() {
    return validateMnemonic(this._mnemonic)
  }

  toSeed(password) {
    return mnemonicToSeedSync(this._mnemonic, password)
  }

  toEntropy() {
    return mnemonicToEntropy(this._mnemonic)
  }

  static _getLang(lang) {
    return LangEnum[lang || "zh_cn"]
  }

  static _setLang(lang) {
    setDefaultWordlist(Mnemonic._getLang(lang))
  }

  static fromEntropy({entropy, lang}) {
    Mnemonic._setLang(lang)
    return entropyToMnemonic(entropy)
  }
}
