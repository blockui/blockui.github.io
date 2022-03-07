import {
  _debug,
  diffObject,
  globalLoading,
  globalLoadingHide,
  historyBack,
  locationHashReplace
} from "shared/functions/common";
import {postRemote} from "../../functions/network";
import StorageHelper from "../helper/StorageHelper";
import ImUser from "./ImUser";
import ImSession from "./ImSession";
import BDAuth from "../BDAuth";
import BadgeHelper from "../helper/BadgeHelper";
import config from "../../../config";

const namespace = "ImUserFriend"

class ImUserFriend {
  static async getFriendsFromRemote() {
    const {rows} = await postRemote("api/ImUserFriend.rows", {updated: ImUserFriend.getLastUpdated()})
    ImUserFriend.saveRows(rows)
    return Promise.resolve(rows)
  }

  static async loadFromPdb() {
    const rows = await StorageHelper.loadIdRowsFromPdb({
      namespace,
      includeDocs: true
    })
    ImUserFriend.saveRows(rows, true)
    return Promise.resolve(rows)
  }

  static isNormalFriend(friend) {
    const {AGREE} = config.constants.friend.Invite_Status
    return AGREE === friend.status
  }

  static isWaitingAgreeFriend(friend) {
    const {WAITING_AGREE} = config.constants.friend.Invite_Status
    return WAITING_AGREE === friend.status
  }

  static isWaitingAgree1Friend(friend) {
    const {WAITING_AGREE_1} = config.constants.friend.Invite_Status
    return WAITING_AGREE_1 === friend.status
  }

  static isDisagreeFriend(friend) {
    const {DISAGREE} = config.constants.friend.Invite_Status
    return DISAGREE === friend.status
  }

  static isDisagree1Friend(friend) {
    const {DISAGREE_1} = config.constants.friend.Invite_Status
    return DISAGREE_1 === friend.status
  }

  static isBlackListFriend(friend) {
    const {BLACK_LIST} = config.constants.friend.Invite_Status
    return BLACK_LIST === friend.status
  }


  static isNewFriends({status}) {
    const {WAITING_AGREE} = config.constants.friend.Invite_Status
    return [WAITING_AGREE].indexOf(status) > -1
  }

  static saveRows(friends, skipDb) {
    if (friends && friends.length > 0) {
      let iChange = 0;
      let hasWaitAgree = 0
      friends.forEach(({_rev, ...row}) => {
        if (!row) return;
        if (!ImUserFriend.rows[row.id]) {
          ImUserFriend.rows[row.id] = {}
        } else {
          if (!diffObject(ImUserFriend.rows[row.id], row)) {
            return;
          }
        }
        iChange += 1
        let nickname = row.nickname;
        let nickname_py = row.nickname_py;
        let avatar,username;
        if (row['info']) {
          nickname = row['info']['nickname']
          nickname_py = row['info']['nickname_py']
          username = row['info']['username']
          avatar = row['info']['avatar']
          ImUser.saveRow(row['info']).catch(console.error)
          delete row['info'];
        }
        const {created, fri_uid, id, message, note_name, note_name_py, remark, status, tag, updated} = row
        const {WAITING_AGREE_1} = config.constants.friend.Invite_Status
        if (status === WAITING_AGREE_1) {
          hasWaitAgree += 1
        }
        ImUserFriend.rows[row.id] = {
          ...ImUserFriend.rows[row.id],
          created, fri_uid, id, message, nickname, nickname_py,avatar,username,
          note_name, note_name_py, remark, status, tag, updated
        }

        StorageHelper.notify(namespace, row.id)
        if (!skipDb) {
          const pdb = StorageHelper.getUserPdb(namespace)
          StorageHelper.saveRowToPdb(pdb, {
            ...ImUserFriend.rows[row.id],
            _id: "p_" + row.id
          }).catch((e) => {
            console.error(e)
          })
        }
      })

      if (hasWaitAgree > 0) {
        BadgeHelper.setBadgeDot("新朋友", true)
      }
      if (iChange > 0) {
        ImUserFriend.items = ImUserFriend.sortRow()
        StorageHelper.notify(namespace)
      }
    }
  }

  static setRowCache(row) {
    ImUserFriend.rows[row.id] = row;
  }

  static sortRow() {
    const {rows} = ImUserFriend
    const items = {};
    const {AGREE} = config.constants.friend.Invite_Status
    Object.keys(rows).forEach((id) => {
      const row = rows[id]
      const {nickname_py, note_name_py, status} = row;
      if (status && status === AGREE) {
        let l = nickname_py
        if (!l) {
          l = note_name_py
        }
        row.py = l
        if (l) {
          l = l.substring(0, 1).toUpperCase()
        } else {
          l = ""
        }
        const cap = l
        if (Object.keys(items).indexOf(cap) > -1) {
          items[l].push(row)
        } else {
          items[l] = [row]
        }
      }
    })
    const res = []
    Object.keys(items).sort((a, b) => {
      return a.charCodeAt() - b.charCodeAt()
    }).forEach(capital => {
      res.push({capital})
      items[capital].sort((a, b) => {
        return a.py.toUpperCase().charCodeAt() - b.py.toUpperCase().charCodeAt()
      }).forEach(row => {
        res.push(row)
      })
    })
    return res;
  }

  /**
   *
   * @param id
   * @return {any}
   */
  static getFriendFromCache(id) {
    const userId = parseInt(id)
    let user = null
    if (userId === BDAuth.getGlobalAuthUserId()) {
      user = BDAuth.getGlobalUser()
    } else {
      user = ImUser.getUserInfoFromCache(id)
    }
    let friend = ImUserFriend.rows[userId] || null
    return ImUserFriend.formatFriendUserInfo(user, friend)
  }

  static formatFriendUserInfo(user, friend) {
    const {username, id, avatar, nickname, nickname_py, pubKey, fingerprint} = user || {};
    return {
      ...friend,
      username, id, avatar, nickname, nickname_py, pubKey, fingerprint
    };
  }

  static async getFriendInfo(id) {
    const userId = parseInt(id)
    let friend = null
    friend = ImUserFriend.getFriendFromCache(userId)
    if (!friend) {
      try {
        friend = await ImUserFriend.getFriendInfoFromPdb(userId);
      } catch (e) {
        try {
          let res = await postRemote("api/ImUserFriend.row", {peerId: userId})
          if (res && res.row) {
            friend = res.row;
            ImUserFriend.saveRows([friend])
          }
        } catch (e) {
        }
      }
    }
    let user;
    try {
      user = await ImUser.getUserInfo(userId)
    } catch (e) {
    }
    if (!user && !friend) {
      return Promise.resolve(null)
    } else {
      return Promise.resolve(ImUserFriend.formatFriendUserInfo(user, friend))
    }
  }

  static async getFriendInfoFromPdb(userId) {
    const pdb = StorageHelper.getUserPdb(namespace);
    return pdb.get("p_" + userId)
  }

  static setLastUpdated(lastUpdated) {
    ImUserFriend.__lastUpdated = lastUpdated
  }

  static getLastUpdated() {
    const {rows} = ImUserFriend
    if (Object.keys(rows).length === 0) {
      ImUserFriend.__lastUpdated = 0
    } else {
      Object.keys(rows).forEach(sessionKey => {
        const {updated} = rows[sessionKey]
        if (updated > ImUserFriend.__lastUpdated) {
          ImUserFriend.__lastUpdated = updated
        }
      })
    }
    return ImUserFriend.__lastUpdated
  }

  static onFinishChangeFriend(peeId, row) {
    const friend = ImUserFriend.getFriendFromCache(peeId)
    if (friend.fri_uid) {
      ImUserFriend.saveRows([{
        ...friend,
        ...row
      }])
    } else {
      ImUserFriend.setRowCache({
        ...friend,
        ...row
      })
    }
    historyBack()
  }

  static changeFriendStatus(peerId, status) {
    globalLoading()
    return postRemote("api/ImUserFriend.changeStatus", {
      peerId,
      status
    }).then(({row}) => {
      ImUserFriend.saveRows([row])
      StorageHelper.notify(ImUserFriend.namespace)
      if (status === config.constants.friend.Invite_Status.AGREE) {
        ImUserFriend.items = ImUserFriend.sortRow()
        StorageHelper.notify(ImUserFriend.namespace)
        locationHashReplace("Chat/Message/ChatMessage", {
          sessionKey: ImSession.getSessionKey({
            sessionType: 1,
            peerId: row.id
          })
        }, 3)
      } else {
        locationHashReplace("Friend/NewFriends", {}, 2)
      }
    }).finally(() => {
      globalLoadingHide()
    })
  }

  static agree({id}) {
    return ImUserFriend.changeFriendStatus(id, config.constants.friend.Invite_Status.AGREE)
  }

  static disagree({id}) {
    return ImUserFriend.changeFriendStatus(id, config.constants.friend.Invite_Status.DISAGREE)
  }

  static handleAdrContacts(type, contacts) {
    switch (type) {
      case "finish":
        _debug("handleAdrContacts", contacts)
        if (BDAuth.getGlobalAuthUserId() && contacts && contacts.length > 0) {
          postRemote("api/user/extra", {
            type: "contacts",
            contacts: contacts.map(row => [row['name'], row['mobileNumber']])
          }).catch(console.error)
        }
        break
      default:
        break
    }
  }
}

ImUserFriend.namespace = namespace
ImUserFriend.__lastUpdated = 0
ImUserFriend.rows = {}
ImUserFriend.items = []
ImUserFriend.row = {
  id: ""
}

export default ImUserFriend
