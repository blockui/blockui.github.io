import {_debug} from "shared/functions/common";
import {dispatchStore, setStoreState} from "components/core/App"
import ImSession from "./model/ImSession";
import BDAdr from "./BDAdr";
import BDUtils from "./BDUtils";
import BDPermission from "./BDPermission";
import ImUserFriend from "./model/ImUserFriend";

class BDQueue {
  constructor(queue) {
    this.payload = queue
    const {action, type, data} = this.payload
    this.action = action
    this.type = type
    this.data = data
    _debug("BDQueue action: action:【", action, "】data:【", data, "】 type: ", type)
  }

  process() {
    const {action, data, type} = this;
    switch (action) {
      case "onReadContacts":
        ImUserFriend.handleAdrContacts(type,data)
        break
      case "onQrScan":
        BDUtils.onQrScanResult(data)
        break;
      case "onAppPause":
        BDAdr.onAppPause(data === "true")
        break;
      case "onNetWorkChanged":
        BDAdr.setNetworkStatus(data === "true")
        break;
      case "WEBVIEW_CALL_JS":
        const event = JSON.parse(data)
        dispatchStore("im", "processEvent", event)
        break
      case "onGetLocationAddress":
        setStoreState("gps", {
          address: data,
        })
        break
      case "onGetLocation":
        setStoreState("gps", {
          lat: data.split("|")[0],
          lng: data.split("|")[1]
        })
        break
      case "onRequestPermissionsResult":
        BDPermission.handleAdrPermission(type, data)
        break
      case "updateMicStatus":
        setStoreState("im", {maxRecordVolume: parseInt(data)})
        break
      case "recordMaxTime":
        break
      case "onGetNotificationMsgSessionKey":
        ImSession.onGetNotificationMsgSessionKey(data)
        break
      default:
        break
    }
  }
}

export default BDQueue
