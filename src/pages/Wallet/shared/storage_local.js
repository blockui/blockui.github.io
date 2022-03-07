const {localStorage} = window
export default class StorageLocal {
  static set(key, val) {
    localStorage.setItem(key, val)
  }

  static get(key, defaultVal = null) {
    const res = localStorage.getItem(key)
    if (res) {
      return res
    } else {
      if (defaultVal) {
        return defaultVal
      } else {
        return null
      }
    }
  }
}
