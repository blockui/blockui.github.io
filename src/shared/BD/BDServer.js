import {rsaEncryptByPubKey} from "../functions/crypto";
import BDConstant from "./BDConstant";

class BDServer {
  static async fetchPubKey() {
    // const {pub_key} = await postRemote("api/serverInfo")
    BDServer.__pub_key = BDConstant.server("pubKey")
    return Promise.resolve()
  }

  static getRsaPubKey() {
    return BDServer.__pub_key
  }

  static rsaEncrypt(message) {
    return rsaEncryptByPubKey(BDServer.getRsaPubKey(), message)
  }
}
BDServer.__pub_key = null
export default BDServer
