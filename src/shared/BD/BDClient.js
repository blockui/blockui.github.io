import {genRsaKey} from "../functions/crypto";
import {getCache, setCache} from "../functions/cache";
import {postRemote} from "../functions/network";
import ImUserFriend from "./model/ImUserFriend";
import ImSession from "./model/ImSession";
import StorageHelper from "./helper/StorageHelper";
import BDApp from "./BDApp";
import ImGroup from "./model/ImGroup";
import BdCircle from "./model/BdCircle";
import {setStoreState} from "../../components/core/App";
import ModelHelper from "./helper/ModelHelper";
import BDAuth from "./BDAuth";

class BDClient {
  static initRsaKey() {
    const rsa_key = getCache("client.rsa_key", null)
    if (!rsa_key) {
      BDClient.__rsa_key = genRsaKey(2048)
      setCache("client.rsa_key", BDClient.__rsa_key, 60 * 60 * 24, 1)
    } else {
      BDClient.__rsa_key = rsa_key
    }
  }

  static getRsaPubKey() {
    return BDClient.__rsa_key["pub"]
  }

  static getRsaPrvKey() {
    return BDClient.__rsa_key["pri"]
  }

  static async fetchServerData() {
    const user = BDAuth.getGlobalUser()
    if(!user.api_token){
      return Promise.resolve();
    }
    const {friends, groups, circles, sessions} = await postRemote("api/serverData", {
      friends: {
        updated: ImUserFriend.getLastUpdated()
      },
      sessions: {
        updated: ImSession.getLastUpdated()
      },
      groups: {
        limit: BDApp.getConstant().groups['defaultFetchLimitNum'],
        ...StorageHelper.getMaxMinIdMaxUpdatedAt(ImGroup.namespace)
      },
      circles: {
        limit: BDApp.getConstant().circle['defaultFetchLimitNum'],
        ...StorageHelper.getMaxMinIdMaxUpdatedAt(BdCircle.namespace)
      }
    })

    ImUserFriend.saveRows(friends.rows)

    if (sessions.unReadCntTotal > 0) {
      setStoreState("session", {
        unreadMessageCnt: sessions.unReadCntTotal
      })
    }
    ImSession.saveRows(sessions.rows)
    StorageHelper.notify(ImSession.namespace)
    ModelHelper.getInstance(ImGroup.namespace, BDAuth.getGlobalAuthUserId()).saveRecords({
      rows: groups.rows
    })

    ModelHelper.getInstance(BdCircle.namespace, BDAuth.getGlobalAuthUserId()).saveRecords({
      rows: circles.rows
    })
  }
}
BDClient.__rsa_key = null
export default BDClient
