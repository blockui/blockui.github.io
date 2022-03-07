import StorageHelper from "../helper/StorageHelper";
import { getGlobalAuthUserId} from "../../functions/common";
import ModelHelper from "../helper/ModelHelper";
import BadgeHelper from "../helper/BadgeHelper";

class BdCircle {
  static async getRowFromRemote(id) {
    const {namespace} = BdCircle;
    let {row} = await StorageHelper.getRowFromRemote(namespace, id)
    if (row) {
      BdCircle.saveRow(row)
      return Promise.resolve(row)
    }
    return Promise.resolve(null)
  }

  static saveRow(row) {
    const {namespace} = BdCircle;
    StorageHelper.saveRow(namespace, row.id, row)
    const pdb = StorageHelper.getUserPdb(namespace)
    StorageHelper.saveRowToPdb(pdb, {
      ...row,
      _id: ModelHelper.formatDocId(namespace, row)
    }).catch(console.error)
  }

  static loadRecord(recordId) {
    return ModelHelper.getInstance(BdCircle.namespace, getGlobalAuthUserId()).loadRecord(recordId)
  }

  static handleNotice({circle_id}) {
    BadgeHelper.setBadgeDot("朋友圈", true)
    const {namespace} = BdCircle
    const isAdd = !StorageHelper.getRowFromCache(namespace, circle_id)
    BdCircle.getRowFromRemote(circle_id).then((row) => {
      StorageHelper.sortRows({
        namespace
      })
      if (isAdd) {
        StorageHelper.notify(namespace)
      } else {
        StorageHelper.notify(namespace, row.id)
      }
    }).catch(console.error)
  }

}

BdCircle.namespace = "BdCircle"

export default BdCircle
