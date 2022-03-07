import BDApp from "./BDApp";
import {setStoreState} from "../../components/core/App";
import {_debug, isMobileNoSsl, locationHashPost, showTopTips} from "../functions/common";
import BDIos from "./BDIos";
import IApp from "./IApp";
import BDPermission from "./BDPermission";

export default class BDUtils {
  static checkUploadPermission(accept){
    if(!BDApp.getAdrBridge()){
      return;
    }
    if(["*","image","video"].indexOf(accept.split("/")[0]) > -1){
      BDPermission.checkPermission("CAMERA").catch(()=>{
        console.error("CAMERA permission deny!")
      })
    }
  }
  static qrCodeScan() {
    if(BDApp.isAdrPlatform() || BDApp.getAdrBridge()){
      BDPermission.checkPermission("READ_EXTERNAL_STORAGE",{userCache:false}).then(() => {
        BDPermission.checkPermission("CAMERA",{userCache:false}).then(() => {
          IApp.runOnce("openQrScanner")
        })
      })

    }else if(!BDApp.isIosPlatform()){
      if(isMobileNoSsl()){
        showTopTips("浏览器不支持此功能")
      }else{
        return setStoreState("global", {
          qrCodeScanner: (qrcode) => {
            _debug(qrcode)
            BDUtils.onQrScanResult(qrcode)
          }
        })
      }
    } else {
      BDIos.openQrScanner()
    }
  }
  static onQrScanResult(qrcode){
    setTimeout(()=>{
      locationHashPost("QrCode/Index",{},{qrcode})
    },500)

  }
}
