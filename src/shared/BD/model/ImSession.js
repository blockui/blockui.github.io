import {setStoreState} from "components/core/App";
import {_debug, diffObject, locationHash} from "../../functions/common";
import IApp from 'shared/BD/IApp';
import {postRemote} from "../../functions/network";
import qs from "querystring";
import BDApp from "../BDApp";
import config from "config";
import StorageHelper from "../helper/StorageHelper";
import {delCache, getCache, setCache} from "../../functions/cache";

const namespace = "ImSession"

class ImSession {
  static async getRecentSessionFromRemote() {
    try {
      const {rows, unReadCntTotal} = await postRemote("api/ImSession.rows", {
        updated: ImSession.getLastUpdated()
      })

      if (unReadCntTotal > 0) {
        setStoreState("session", {
          unreadMessageCnt: unReadCntTotal
        })
      }
      ImSession.saveRows(rows)
      return Promise.resolve({rows, unReadCntTotal})
    } catch (e) {
      console.error(e)
      return Promise.resolve({rows: []})
    }
  }

  static saveRows(sessions, skipSavePdb) {
    if (sessions && sessions.length > 0) {
      let i = 0
      let i_add = 0
      sessions.forEach(({_rev, ...session}) => {
        const sessionKey = `${session.sessionType}_${session.peerId}`
        let cacheSession = ImSession.getSession(sessionKey)
        if (cacheSession && !diffObject(cacheSession, session)) {
          return;
        }
        if (!cacheSession) {
          i_add += 1
        }
        i += 1
        ImSession.rows[sessionKey] = {
          ...cacheSession,
          ...session
        }
        StorageHelper.notify(namespace, sessionKey)
        if (!skipSavePdb) {
          const pdb = StorageHelper.getUserPdb(namespace)
          StorageHelper.saveRowToPdb(pdb, {
            ...ImSession.rows[sessionKey],
            _id: sessionKey
          }).catch(console.error)
        }
      })
      if (i_add > 0) {
        StorageHelper.notify(namespace)
      }
      if (i > 0 || i_add > 0) {
        ImSession.handleTotalUnRead()
      }
    }
  }

  static removeSession(sessionKey) {
    if (ImSession.rows[sessionKey]) {
      delete ImSession.rows[sessionKey];
      const pdb = StorageHelper.getUserPdb(namespace)
      pdb.get(sessionKey).then((doc)=>{
        pdb.remove(doc).catch(console.error)
      })
      postRemote("api/ImSession.remove", ImSession.parseSessionKey(sessionKey)).catch(console.error)
      StorageHelper.notify(namespace)
    }
  }

  static getSessionKey({sessionType, peerId}) {
    return `${sessionType}_${peerId}`
  }

  static isGroupSession(sessionKey) {
    const {sessionType} = ImSession.parseSessionKey(sessionKey)
    return ImSession.getSessionType().SESSION_TYPE_GROUP === sessionType
  }

  static parseSessionKey(sessionKey) {
    const t = sessionKey.split("_")
    return {
      sessionType: parseInt(t[0]),
      peerId: parseInt(t[1]),
    }
  }

  static handleRepUnreadMsg(sessions) {
    const sessionKeys = Object.keys(sessions)
    if (sessionKeys.length > 0) {
      const rows = []
      sessionKeys.forEach(sessionKey => {
        const {
          unReadCnt,
          updated,
          peerId,
          sessionType,
          latestMsgData,
          latestMsgId,
          latestMsgType
        } = sessions[sessionKey]
        if (latestMsgId) {
          ImSession.latestRows[sessionKey] = {latestMsgData, latestMsgId, latestMsgType}
        }
        rows.push({
          ...ImSession.getSession(sessionKey),
          unReadCnt, updated, peerId, sessionType
        })
      })
      ImSession.saveRows(rows)
    }
  }

  static onReadMessage(sessionKey) {
    if (BDApp.isAdrPlatform()) {
      IApp.call("onOpenChat", {sessionKey})
      if (ImSession.latestRows[sessionKey] && ImSession.rows[sessionKey].latestMsgId) {
        IApp.call("onAskReadMsg", {
          sessionKey,
          lastMsgId: ImSession.latestRows[sessionKey].latestMsgId
        })
      }
    } else {
      postRemote("api/ImMessage.readMsg", {peerId: parseInt(sessionKey.split("_")[1])}).catch(console.error)
    }
  }

  static handleTotalUnRead() {
    const sessionKeys = Object.keys(ImSession.rows)
    let unreadMessageCnt = 0;
    if (sessionKeys.length > 0) {
      sessionKeys.forEach(sessionKey => {
        const session = ImSession.rows[sessionKey]
        unreadMessageCnt += session.unReadCnt
      })
    }
    setStoreState("session", {
      unreadMessageCnt
    })
  }

  static async loadFromPdb() {
    const rows = await StorageHelper.loadIdRowsFromPdb({
      namespace,
      includeDocs: true
    })
    ImSession.saveRows(rows, true)
    return Promise.resolve(rows)
  }

  static getSession(sessionKey) {
    return ImSession.rows[sessionKey] || null
  }

  static getSessionLatestData(sessionKey) {
    return ImSession.latestRows[sessionKey] || null
  }

  /**
   * todo
   * @return {Promise<void>}
   */
  static async onOpenNotificationMsg() {
    const sessionKey = getCache("__notificationMsgSessionKey")
    _debug("sessionKey", sessionKey)
    if (!sessionKey) {
      return
    }
    delCache("__notificationMsgSessionKey")
    const {peerId} = ImSession.parseSessionKey(sessionKey)
    _debug("onOpenNotificationMsg peerId", peerId)
    setTimeout(() => {
      _debug("onOpenNotificationMsg open Message", peerId)
      locationHash(`Chat/Message/ChatMessage?${qs.stringify({
        sessionKey
      })}`)
    }, 500)
    setStoreState("global", {
      currentTabBarItemIndex: 1
    })
  }

  static onGetNotificationMsgSessionKey(sessionKey) {
    setCache("__notificationMsgSessionKey", sessionKey)
  }


  static setLastUpdated(lastUpdated) {
    ImSession.__lastUpdated = lastUpdated
  }

  static getLastUpdated() {
    const {rows} = ImSession
    if (Object.keys(rows).length === 0) {
      ImSession.__lastUpdated = 0
    } else {
      Object.keys(rows).forEach(sessionKey => {
        const {updated} = rows[sessionKey]
        if (updated > ImSession.__lastUpdated) {
          ImSession.__lastUpdated = updated
        }
      })
    }
    return ImSession.__lastUpdated
  }

  static getSessionType() {
    return config.constants.im.SESSION_TYPE;
  }
}

ImSession.__notificationMsgSessionKey = null
ImSession.rows = {}
ImSession.latestRows = {}
ImSession.__lastUpdated = 0
ImSession.namespace = namespace
ImSession.currentSessionKey = null
export default ImSession
