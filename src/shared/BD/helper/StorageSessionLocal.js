const {sessionStorage} = window;
export default class StorageSessionLocal {
  static set(key, val) {
    sessionStorage.setItem(key, val);
  }

  static del(key) {
    sessionStorage.removeItem(key);
  }


  static get(key, defaultVal = null) {
    const res = sessionStorage.getItem(key);
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
