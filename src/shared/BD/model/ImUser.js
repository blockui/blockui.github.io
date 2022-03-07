import {diffObject} from "shared/functions/common";
import {postRemote} from "../../functions/network";
import StorageHelper from "../helper/StorageHelper";
import BDAuth from "../BDAuth";

class ImUser {
  constructor({
                id,
                rsa_key,
                nickname,
                api_token,
                fingerprint,
                last_login,
                phone,
                geo_on,
                sex,
                email,
                avatar,
                sign_info,
                circle_banner,
                username,
                nickname_py
              }) {
    this.id = id;
    this.nickname = nickname;
    this.rsa_key = rsa_key
    this.api_token = api_token
    this.fingerprint = fingerprint
    this.last_login = last_login
    this.phone = phone
    this.geo_on = geo_on
    this.sex = sex
    this.email = email
    this.avatar = avatar
    this.sign_info = sign_info
    this.circle_banner = circle_banner
    this.username = username
    this.nickname_py = nickname_py
  }

  static formatDocId(userId) {
    return "p_" + userId
  }

  static parseDocId(_id) {
    return parseInt(_id.split("_")[1])
  }

  static getUserInfoFromCache(id) {
    const userId = parseInt(id)
    if (userId === BDAuth.getGlobalAuthUserId()) {
      return BDAuth.getGlobalUser()
    }
    return ImUser.rows[userId] || null
  }

  static async getUserInfo(id) {
    const userId = parseInt(id)
    const user = ImUser.getUserInfoFromCache(userId)
    if (user) {
      return Promise.resolve(user)
    }else{
      try {
        const pdb = StorageHelper.getPdbByNamespace(ImUser.namespace);
        const user = await pdb.get(ImUser.formatDocId(userId))
        ImUser.rows[user.id] = user
        return Promise.resolve(user)
      } catch (e) {
        try {
          if (ImUser.rowFetching[userId]) {
            setTimeout(() => {
              return ImUser.getUserInfo(userId)
            }, 500)
          } else {
            let {row} = await postRemote("api/user/info", {userId})
            await ImUser.saveRow(row)
            delete ImUser.rowFetching[userId]
            return Promise.resolve(row)
          }
        } catch (e) {
          console.error(e)
          delete ImUser.rowFetching[userId]
          return Promise.resolve(null)
        }
      }
    }
  }

  static async saveRow({...row}) {
    if (!ImUser.rows[row.id]) {
      ImUser.rows[row.id] = {}
    }

    ImUser.rows[row.id] = {...ImUser.rows[row.id], ...row}
    const pdb = StorageHelper.getPdbByNamespace(ImUser.namespace);
    try {
      const {_id, _rev, ...doc} = await pdb.get(ImUser.formatDocId(row.id))
      if (diffObject(doc, row)) {
        pdb.put({
          ...doc,
          ...row,
          _rev,
          _id
        })
      }
    } catch (e) {
      await pdb.put({
        ...row,
        _id: ImUser.formatDocId(row.id)
      })
    }
  }

}

ImUser.namespace = "ImUser"
ImUser.rows = {}
ImUser.rowFetching = {}
export default ImUser
