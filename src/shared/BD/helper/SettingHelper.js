import {getItemFromLocalStorage, setItemFromLocalStorage} from "../../functions/cache";

export default class SettingHelper {
  static getUserLoginIfGPwd(userId) {
    const res = getItemFromLocalStorage("userLoginGPwd." + userId, false)
    return res && res === "true";
  }

  static setUserLoginIfGPwd(userId, val) {
    setItemFromLocalStorage("userLoginGPwd." + userId, val ? "true" : "false")
  }
}

