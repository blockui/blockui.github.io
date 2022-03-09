const {localStorage} = window;
export default class StorageLocal {
  static set(key, val) {
    localStorage.setItem(key, val);
  }

  static del(key) {
    localStorage.removeItem(key);
  }


  static get(key, defaultVal = null) {
    const res = localStorage.getItem(key);
    if (res) {
      return res;
    } else {
      if (defaultVal !== null) {
        return defaultVal;
      } else {
        return null;
      }
    }
  }

  static use(key) {
    return StorageLocal.get(key) === "1";
  }
}
