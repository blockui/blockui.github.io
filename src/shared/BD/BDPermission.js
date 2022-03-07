import {getCache, setCache} from "../functions/cache";
import {setStoreState} from "components/core/App";
import IApp from "./IApp";
import BDConstant from "./BDConstant";

class BDPermission {
  static async checkPermission(permission, options) {
    return new Promise((resolve, reject) => {
      IApp.checkPermission(permission, options).then(resolve).catch(reject)
    })
  }
  static handleAdrPermission(type, permissionResult) {
    const permission = type.replace("android.permission.", "")
    if (permissionResult === BDPermission.adrPermissionResult.DENY && BDPermission.callback[permission]) {
      BDPermission.callback[permission]()
      BDPermission.callback[permission] = null
    }
    if (permissionResult === BDPermission.adrPermissionResult.PERMISSION_GRANTED && BDPermission.callbackResolve[permission]) {
      BDPermission.callbackResolve[permission]()
      BDPermission.callbackResolve[permission] = null
    }

    BDPermission.setAdrPermissionCache(permission, permissionResult)
    setStoreState("permission", {
      [permission]: permissionResult
    })
  }

  static getAdrPermissionFromCache(permission) {
    const res = getCache("adr." + permission)
    if (res !== null) {
      return parseInt(res)
    } else {
      return -1
    }
  }

  static setAdrPermissionCache(permission, permissionResult) {
    const permissionCheckCacheSec = BDConstant.common("permissionCheckCacheSec")
    setCache("adr." + permission, permissionResult, permissionCheckCacheSec)
  }
}

BDPermission.adrPermissionResult = {
  PERMISSION_GRANTED: 0,
  DENY: -1,
  SIGNATURE_SECOND_NOT_SIGNED: -2,
}
BDPermission.callbackResolve = {}
BDPermission.callback = {}
BDPermission.permissionsAdr = {
  READ_EXTERNAL_STORAGE: "读取文件",
  WRITE_EXTERNAL_STORAGE: "写文件",
  RECORD_AUDIO: "录音",
  CAMERA: "相机",
  ACCESS_FINE_LOCATION: "定位",
  READ_CONTACTS: "联系人",
  READ_CALL_LOG: "通话记录",
  READ_CALENDAR: "日历",
  READ_PHONE_NUMBERS: "识别手机号码",
  READ_SMS: "短信",
}
export default BDPermission
