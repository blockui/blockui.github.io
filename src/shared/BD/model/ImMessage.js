import {_debug, _debugToast, diffObject, globalLoading, globalLoadingHide} from "shared/functions/common";
import {getAudiosPDb, getImagePDb, getVideosPDb} from "shared/functions/pdb";
import {setStoreState} from "components/core/App";
import ImSession from "./ImSession";
import BDAdr from "../BDAdr";
import ImUserFriend from "./ImUserFriend";
import {md5, rsaEncryptByPubKey} from "shared/functions/crypto";
import IApp from 'shared/BD/IApp'
import BDApp from "../BDApp";
import BDMsgServer from "../BDMsgServer";
import {onUploadBobToRemote} from "shared/functions/upload";
import {postRemote} from "shared/functions/network";
import StorageHelper from "../helper/StorageHelper";
import BadgeHelper from "../helper/BadgeHelper";
import BDAuth from "../BDAuth";
import BDServer from "../BDServer";
import {getCurrentTimeStamp, parseMsgExtraFromContent} from "shared/functions/utils";
import {getCache, getItemFromLocalStorage, setCache, setItemFromLocalStorage} from "shared/functions/cache";
import AesEncryption from "../../aes/AesEncryption";
import config from "config";
import BDConstant from "../BDConstant";

const namespace = "ImMessage"

class ImMessage {
  constructor({
                fromId,
                groupId,
                created,
                content,
                sessionKey,
                sessionType,
                msgType,
                extra,
                plain,
                msgId,
                toId,
                status,
                updated
              }) {
    if (!extra && content) {
      extra = parseMsgExtraFromContent(content)
    }

    this._id = ImMessage.getMsgDocId({sessionKey, created, msgType, extra, fromId});
    this.fromId = fromId;
    this.groupId = groupId;
    this.content = content;
    this.msgType = msgType;
    this.extra = extra;
    this.plain = plain !== undefined ? plain : "";
    this.msgId = msgId;
    this.toId = toId;
    this.status = status;
    this.sessionKey = sessionKey;
    this.sessionType = sessionType;
    this.created = created;
    this.updated = updated;
  }

  static async loadFromPdb(sessionKey) {
    const docIds = StorageHelper.loadIdRowsFromPdb({
      namespace,
      idPrefix: sessionKey
    })
    return Promise.resolve(docIds)
  }

  static initSessionMsg(sessionKey) {
    if (!ImMessage.rows[sessionKey]) {
      ImMessage.rows[sessionKey] = {
        rows: {},
        rowsUnDecrypt: {},
        rowsSrd: [],
        rowsCache: [],
        sorted: false,
        skip: 0,
        __docIds: [],
        __insIds: [],
      }
    }
  }

  static saveMessages(sessionKey, messages, skipSaveDb) {
    if (messages && messages.length > 0) {
      let rowsAddLength = 0
      messages.forEach(({_rev, ...message}) => {
        const messageObj = new ImMessage({...message})
        const _id = messageObj._id
        const {sessionKey} = messageObj
        const {rows} = ImMessage.getSessionMsgs(sessionKey)
        const msg = rows[_id] || null
        let isUpdated = false;
        if (!messageObj.plain && msg && msg.plain) {
          messageObj.plain = msg.plain
        }
        if (!messageObj.content && msg) {
          messageObj.content = msg.content
        }
        if (!messageObj.plain && messageObj.content) {
          messageObj.plain = ImMessage.decryptMsgContent(messageObj)
        }
        if (!msg) {
          rowsAddLength += 1;
        } else {
          const messageObjRow = new ImMessage({...msg})
          if (diffObject(messageObjRow, messageObj)) {
            isUpdated = true;
          } else {
            return;
          }
        }
        if (!skipSaveDb) {
          const saveRow = {
            ...messageObj,
            plain: "",
            content: ImMessage.encryptSaveMsg(messageObj.plain, messageObj.extra),
          };
          StorageHelper.saveRowToPdb(StorageHelper.getUserPdb(namespace), saveRow).catch(console.error)
        }
        ImMessage.rows[sessionKey].rows[_id] = messageObj
        if (isUpdated) {
          StorageHelper.notify(namespace, _id)
        }
      })

      if (rowsAddLength > 0) {
        ImMessage.sortMsgs(sessionKey)
        if (ImSession.currentSessionKey === sessionKey) {
          StorageHelper.notify("ImMessage")
        }
      }
    }
  }

  static sortMsgs(sessionKey) {
    const {rows} = ImMessage.getSessionMsgs(sessionKey)
    const rowsSrd_ = []
    Object.keys(rows).forEach(_id => {
      const {created} = rows[_id]
      if (ImMessage.msgSortType === "desc") {
        rowsSrd_.unshift({_id, created})
      } else {
        rowsSrd_.push({_id, created})
      }
    })
    rowsSrd_.sort((a, b) => {
      if (ImMessage.msgSortType === "desc") {
        return -a.created + b.created
      } else {
        return a.created - b.created
      }
    })
    if (rowsSrd_.length > 0) {
      let msgLatest;
      if (ImMessage.msgSortType === "desc") {
        msgLatest = rowsSrd_[0]
      } else {
        msgLatest = rowsSrd_[rowsSrd_.length - 1]
      }
      setItemFromLocalStorage(`lastMsgDocId_${BDAuth.getGlobalAuthUserId()}.${sessionKey}`, msgLatest._id)
      ImMessage.rows[sessionKey].sorted = true
    }
    ImMessage.rows[sessionKey].rowsSrd = rowsSrd_
    StorageHelper.notify("ImSession", sessionKey)
  }

  static resetSkip(sessionKey) {
    const {rowsSrd, skip} = ImMessage.getSessionMsgs(sessionKey)
    const rowsSrdLength = rowsSrd.length
    if (rowsSrdLength - BDConstant.im("messageInitFetchNum") > skip) {
      ImMessage.setSkip(sessionKey, rowsSrdLength - BDConstant.im("messageInitFetchNum"))
    }
  }

  static getMsgDocId({sessionKey, created, msgType, extra, fromId}) {
    return `${sessionKey}_${msgType}_${extra}_${fromId}_${created}`
  }

  static parseMsgDocId(_id) {
    const t = _id.split("_")
    return {
      sessionType: parseInt(t[0]),
      peerId: parseInt(t[1]),
      msgType: parseInt(t[2]),
      extra: t[3],
      fromId: parseInt(t[4]),
      created: parseInt(t[5])
    }
  }

  static saveMessage(message) {
    ImMessage.saveMessages(message.sessionKey, [message])
  }


  static async getMsgByDocId(sessionKey, _id) {
    let msg = ImMessage.getMsgFromCacheByDocId(sessionKey, _id)
    if (!msg) {
      try {
        msg = await ImMessage.getMsgFromPdbByDocId({_id})
      } catch (e) {
      }
    }
    return Promise.resolve(msg)
  }

  static getMsgFromCacheByDocId(sessionKey, _id) {
    const {rows} = ImMessage.rows[sessionKey]
    return rows[_id] || null
  }

  static async rcvMsg(message) {
    let {fromId, sessionType, updated, msgType, groupId} = message;
    const friend = await ImUserFriend.getFriendInfo(fromId)
    if (!friend && fromId !== BDAuth.getGlobalAuthUserId()) {
      return Promise.reject("rcvMsgFromWs,fiend not found!!")
    }
    const plain = ImMessage.decryptMsgContent(message)

    if (!updated) {
      updated = Math.floor(getCurrentTimeStamp(true));
    }
    const sessionKey = `${sessionType}_${groupId ? groupId : fromId}`
    const messageObj = new ImMessage({
      status: config.constants.im.MSG_SEND_STATUS.SEND_OK,
      ...message,
      sessionKey,
      plain,
      updated
    })
    const {MSG_TYPE} = config.constants.im
    if (
      msgType === MSG_TYPE.MSG_TYPE_VIDEO_CALL ||
      msgType === MSG_TYPE.MSG_TYPE_AUDIO_CALL
    ) {
      ImMessage.handleCallMsg({...messageObj, plain})
    }
    ImMessage.saveMessage(messageObj)
    ImMessage.updateSession(messageObj)
  }

  static ackMsg(message) {
    const {sessionType, groupId, toId} = message
    const sessionKey = `${sessionType}_${groupId ? groupId : toId}`
    const messageObj = new ImMessage({...message, sessionKey})
    const {rows} = ImMessage.getSessionMsgs(sessionKey)
    const msg = rows[messageObj._id] || null
    if (!msg && messageObj.content) {
      messageObj.plain = ImMessage.decryptMsgContent(message)
    }
    if (!messageObj.updated) {
      messageObj.updated = Math.floor(getCurrentTimeStamp(true)) + 1;
    }
    ImMessage.saveMessage(messageObj)
    ImMessage.updateSession(messageObj)
  }

  static handleCallMsg(message) {
    const {MSG_TYPE} = config.constants.im
    if (message.msgType === MSG_TYPE.MSG_TYPE_AUDIO_CALL || message.msgType === MSG_TYPE.MSG_TYPE_VIDEO_CALL) {
      _debug("handleCallMsg", message)
      if (!ImMessage.calling) {
        ImMessage.calling = true;
        setStoreState("call", {message: new ImMessage(message)})
      }
    }
  }

  static rcvCallMsgFromWs(message) {
    if (ImMessage.calling && window.handleRcvCallMsg) {
      window['handleRcvCallMsg'](message)
    }
  }

  static rcvMsgFromWs(message) {
    // _debug("rcvMsgFromWs", {message})
    const {MSG_TYPE_NOTICE_FRIEND} = config.constants.im.MSG_TYPE
    switch (message.msgType) {
      case MSG_TYPE_NOTICE_FRIEND:
        let {content} = message;
        let plain = content;
        if (content.indexOf("1|") === 0) {
          plain = ImMessage.decryptMsgContent(message)
        }
        const [invite_type, fromId] = plain.split(".")
        if (invite_type === "FRIEND_INVITE") {
          BadgeHelper.setBadgeDot("新朋友", true)
          ImUserFriend.getFriendInfo(fromId).catch(console.error)
          StorageHelper.notify(ImUserFriend.namespace)
        } else {
          ImUserFriend.getFriendsFromRemote().then(() => {
            ImUserFriend.items = ImUserFriend.sortRow()
            StorageHelper.notify(ImUserFriend.namespace)
          }).catch(console.error)
        }
        break;
      default:
        ImMessage.rcvMsg(message).catch(console.error);
        break
    }
  }

  static ackMsgFromWs(message) {
    // _debug("ackMsgFromWs", message)
    const {MSG_TYPE_NOTICE_FRIEND} = config.constants.im.MSG_TYPE

    switch (message.msgType) {
      case MSG_TYPE_NOTICE_FRIEND:
        break;
      default:
        ImMessage.ackMsg({status: config.constants.im.MSG_SEND_STATUS.SEND_OK, ...message})
        break
    }
  }

  static ackMsgFromPb(action, message) {
    let status;
    const {MSG_SEND_STATUS} = config.constants.im
    switch (action) {
      case "ACK_SEND_MESSAGE_OK":
        status = MSG_SEND_STATUS.SEND_OK;
        break
      case "ACK_SEND_MESSAGE_FAILURE":
        status = MSG_SEND_STATUS.SEND_FAILURE
        break
      case "ACK_SEND_MESSAGE_TIME_OUT":
      default:
        status = MSG_SEND_STATUS.SEND_TIME_OUT;
        break
    }
    ImMessage.ackMsg({...message, status})
  }

  static rcvMsgFromPb(action, message) {
    const {sessionKey, msgId, fromId, toId} = message
    _debug("rcvMsgFromPb", {action, message})
    switch (action) {
      case "MSG_RECEIVED_MESSAGE":
        BDAdr.ackReceiveMsg({
          msgId, fromId, toId, sessionKey
        })
        ImMessage.rcvMsg(message).catch(console.error)
        break;
      default:
        _debugToast(JSON.stringify(message))
        break
    }
  }

  static onShowNotification({fromId, plain, msgType, sessionKey}, unReadCnt) {
    ImUserFriend.getFriendInfo(fromId).then(({nickname, avatar}) => {
      const t = plain ? (": " + plain) : ""
      let content = `${unReadCnt}条 ${t}`
      if (
        msgType === config.constants.im.MSG_TYPE.MSG_TYPE_AUDIO_CALL ||
        msgType === config.constants.im.MSG_TYPE.MSG_TYPE_VIDEO_CALL
      ) {
        content = `向您发起 ${msgType !== config.constants.im.MSG_TYPE.MSG_TYPE_AUDIO_CALL ? "视频" : "语音"} 通话`
      }
      _debug(content)
      _debug(BDApp.platform)
      if (BDApp.platform === "ADR" || BDApp.getAdrBridge()) {
        BDAdr.showNotification({
          title: nickname,
          content,
          avatar,
          useVibrate: false,
          sessionKey
        })
      } else {

      }

    }).catch(console.error)
  }

  static updateSession(message) {
    const {fromId, sessionKey, sessionType} = message
    const session = ImSession.getSession(sessionKey)
    let unReadCnt = 0
    if (session && session.unReadCnt) {
      unReadCnt = session.unReadCnt
    }

    if (BDApp.isWebPlatform() && BDAuth.getGlobalAuthUserId() !== fromId) {
      ImMessage.setTitleNotice("有新消息")
    }
    if (
      ImSession.currentSessionKey !== sessionKey &&
      BDAuth.getGlobalAuthUserId() !== fromId
    ) {
      unReadCnt += 1
      if (BDApp.isAdrPlatform() || BDApp.getAdrBridge()) {
        if (ImSession.currentSessionKey !== sessionKey || BDAdr.ifAppPause()) {
          ImMessage.onShowNotification(message, unReadCnt)
        }
      } else {
        if (ImSession.currentSessionKey !== sessionKey) {
          ImMessage.onShowNotification(message, unReadCnt)
        }
      }
    }

    const {peerId} = ImSession.parseSessionKey(sessionKey)
    const row = {
      ...session,
      peerId,
      sessionType,
      unReadCnt,
      updated: Math.floor(getCurrentTimeStamp(true)),
    };
    ImSession.saveRows([row])
  }


  static getLastMsgFromCache(sessionKey) {
    let _id = ImMessage.getLastDocId(sessionKey);
    if (!_id) {
      _id = ImMessage.getLastDocIdFromLocalStorage(sessionKey)
    }
    if (_id) {
      let msg = ImMessage.getMsgFromCacheByDocId(sessionKey, _id)
      if ((msg && !msg.updated) || !msg) {
        return null
      }
      return msg
    } else {
      return null;
    }
  }

  static async getLastMsg(sessionKey) {
    let msg = ImMessage.getLastMsgFromCache(sessionKey)
    if (!msg) {
      let _id = ImMessage.getLastDocId(sessionKey);
      if (!_id) {
        _id = ImMessage.getLastDocIdFromLocalStorage(sessionKey)
      }
      if (_id) {
        try {
          msg = await ImMessage.getMsgFromPdbByDocId({_id})
        } catch (e) {
          console.error(e)
        }
        if (!msg) {
          msg = null
        }
      }
    }
    return Promise.resolve(msg)
  }

  static getSrdLastMsg(sessionKey) {
    const {rowsSrd} = ImMessage.getSessionMsgs(sessionKey)
    if (rowsSrd.length > 0) {
      return rowsSrd[rowsSrd.length - 1]
    } else {
      return null;
    }
  }

  static getLastDocIdFromLocalStorage(sessionKey) {
    const key = `lastMsgDocId_${BDAuth.getGlobalAuthUserId()}.${sessionKey}`
    return getItemFromLocalStorage(key, false, null)
  }

  static getLastDocId(sessionKey) {
    const msg = ImMessage.getSrdLastMsg(sessionKey)
    if (msg) {
      return msg._id
    } else {
      return null;
    }
  }

  static async getLastMsgId(sessionKey) {
    const msg = await this.getLastMsg(sessionKey)
    if (!msg) {
      return Promise.resolve(0)
    } else {
      const {msgId} = msg
      return Promise.resolve(msgId)
    }
  }

  static async getMsgFromPdbByDocId({_id}) {
    const pdb = StorageHelper.getUserPdb(namespace)
    const message = await pdb.get(_id)
    const {extra} = ImMessage.parseMsgDocId(_id)
    return Promise.resolve({extra, ...message})
  }

  static getSessionMsgs(sessionKey) {
    ImMessage.initSessionMsg(sessionKey)
    return ImMessage.rows[sessionKey];
  }

  static getSkip(sessionKey) {
    ImMessage.initSessionMsg(sessionKey)
    return ImMessage.rows[sessionKey].skip
  }

  static setSkip(sessionKey, skip) {
    ImMessage.initSessionMsg(sessionKey)
    ImMessage.rows[sessionKey].skip = skip < 0 ? 0 : skip
  }

  static formatSendMsgContent({encType, data, extra = "0000000"}) {
    return `${encType}|${extra}${data}`
  }

  static decryptMsgContent({content}) {
    let encType = 0;
    let encryptData = content
    if (content.indexOf("|") === 1) {
      encType = parseInt(content.substring(0, 1))
      encryptData = content.substring(9)
    }

    const {ENC_TYPE} = config.constants.im
    if (encType === ENC_TYPE.NO_ENCRYPT) {
      return encryptData.substring(3)
    }
    let data = "";
    switch (encType) {
      case ENC_TYPE.S_RSA:
        const password = BDAuth.getAuthPwd()
        if (password) {
          data = BDAuth.rsaDecrypt(encryptData.substring(3), password)
        } else {
          data = ""
        }
        break;
      case 2:
        const aes = new AesEncryption("cbc", 256)
        const {api_token} = BDAuth.getGlobalUser()
        const token = api_token.split("_")[1]
        data = aes.decrypt(encryptData.substring(3), token)
        break;
      default:
        break
    }
    return data
  }

  static async encryptMessageContentData({data}) {
    const {ENC_TYPE} = config.constants.im
    let encryptData = data
    const {im} = BDApp.getConstant();
    const {encType} = im;
    if (encType === ENC_TYPE.NO_ENCRYPT) {
      return Promise.resolve({encType, encryptData: "Aaa" + encryptData})
    }
    const serverPubKey = BDServer.getRsaPubKey();
    const serverFingerprint = md5(BDServer.getRsaPubKey());

    switch (encType) {
      case ENC_TYPE.S_RSA:
        encryptData = serverFingerprint.substring(0, 3) + rsaEncryptByPubKey(serverPubKey, data)
        break;
      case 2:
        const aes = new AesEncryption("cbc", 256)
        const {api_token} = BDAuth.getGlobalUser()
        const token = api_token.split("_")[1]
        encryptData = token.substring(0, 3) + aes.encrypt(data, token)
        break;
      default:
        break
    }
    return Promise.resolve({encType, encryptData})
  }


  static async sendMsg(msg) {
    let {msgType, data, peerId, sessionType, sessionKey, extra} = msg
    if (!msgType) {
      msgType = config.constants.im.MSG_TYPE.MSG_TYPE_TEXT
    }
    // const {im} = BDApp.getConstant();
    // if (data.length > im['maxSendTxtLen'] && msgType === config.constants.im.MSG_TYPE.MSG_TYPE_TEXT) {
    //   showTopTips("发送信息长度不能超过 " + im['maxSendTxtLen'])
    //   return Promise.reject()
    // }
    if (!sessionType) {
      sessionType = config.constants.im.SESSION_TYPE.SESSION_TYPE_SINGLE
    }
    if (sessionKey) {
      const parseRes = ImSession.parseSessionKey(sessionKey)
      peerId = parseRes.peerId
      sessionType = parseRes.sessionType
    } else {
      sessionKey = ImSession.getSessionKey({sessionType, peerId})
    }
    const {
      encType, encryptData
    } = await ImMessage.encryptMessageContentData({
      data
    })
    if (!extra) {
      extra = "0".repeat(7)
    }
    const content = ImMessage.formatSendMsgContent({
      encType, data: encryptData, extra
    })
    let groupId;
    if (sessionType === config.constants.im.SESSION_TYPE.SESSION_TYPE_GROUP) {
      groupId = peerId
    }
    const created = Math.floor(getCurrentTimeStamp(true));
    const message = {
      content,
      msgType,
      plain: data,
      groupId,
      fromId: BDAuth.getGlobalAuthUserId(),
      toId: peerId,
      msgId: 0,
      created,
      updated: created,
      sessionKey,
      sessionType,
      extra,
      status: config.constants.im.MSG_SEND_STATUS.SENDING
    }
    ImMessage.saveMessage({
      ...message
    })
    if (!ImMessage.isMediaMsg(msgType)) {
      ImMessage.sendMsgToServer(message)
    }
    return Promise.resolve(message)
  }

  static encryptSaveMsg(data, extra) {
    if (!data) data = ""
    const locationEncType = ImMessage.getLocationEncType();
    return locationEncType !== 0 ? `1|${extra}Aaa` + BDAuth.rsaEncrypt(data) : `0|${extra}Aaa${data}`
  }

  static getLocationEncType() {
    return parseInt(getCache("im.locationEncType", 0))
  }

  static setLocationEncType(type) {
    return setCache("im.locationEncType", parseInt(type), 0, true)
  }

  static async sendRawMsg({msgType, data, sessionType, peerId}) {
    const created = Math.floor(getCurrentTimeStamp(true));
    const message = {
      content: data,
      msgType,
      fromId: BDAuth.getGlobalAuthUserId(),
      toId: peerId,
      msgId: 0,
      created,
      updated: created,
      sessionType: sessionType || config.constants.im.SESSION_TYPE.SESSION_TYPE_SINGLE,
      status: config.constants.im.MSG_SEND_STATUS.SENDING
    }
    _debug("sendMsg", message)
    ImMessage.sendMsgToServer(message)
    return Promise.resolve(message)
  }

  static async sendMediaMsg(message, other) {
    let {blob, thumbBlob} = other
    const {plain, msgType} = message;
    const {MSG_TYPE} = config.constants.im;
    const isVideo = msgType === MSG_TYPE.MSG_TYPE_VIDEO;
    let doc_id = plain
    let thumb_doc_id;
    if (isVideo) {
      doc_id = plain.split("|")[0]
      thumb_doc_id = plain.split("|")[1]
    }
    if (blob) {
      globalLoading("上传中...")
      await onUploadBobToRemote({blob, doc_id})
      if (isVideo) {
        await onUploadBobToRemote({blob: thumbBlob, doc_id: thumb_doc_id})
        ImMessage.sendMsgToServer(message)
      } else {
        ImMessage.sendMsgToServer(message)
      }
      globalLoadingHide()
    } else {
      let db;
      switch (msgType) {
        case MSG_TYPE.MSG_TYPE_IMAGE:
          db = getImagePDb()
          break;
        case MSG_TYPE.MSG_TYPE_AUDIO:
          db = getAudiosPDb();
          break
        case MSG_TYPE.MSG_TYPE_VIDEO:
        default:
          db = getVideosPDb();
          break
      }
      blob = await db.getAttachment(doc_id, "attachment")
      if (isVideo) {
        thumbBlob = await getImagePDb().getAttachment(thumb_doc_id, "attachment")
        ImMessage.sendMediaMsg(message, {blob, thumbBlob}).catch(console.error)
      } else {
        ImMessage.sendMediaMsg(message, {blob, thumbBlob}).catch(console.error)
      }
    }
  }

  static isMediaMsg(msgType) {
    const {MSG_TYPE_VIDEO, MSG_TYPE_AUDIO, MSG_TYPE_IMAGE} = config.constants.im.MSG_TYPE
    return [
      MSG_TYPE_VIDEO, MSG_TYPE_AUDIO, MSG_TYPE_IMAGE
    ].indexOf(msgType) > -1
  }

  static reSendMsg(sessionKey, _id, status) {
    const message = ImMessage.getMsgFromCacheByDocId(sessionKey, _id)
    if (message) {
      const msg = {
        ...message,
        status,
        updated: Math.floor(getCurrentTimeStamp(true))
      };

      ImMessage.rows[sessionKey].rows[_id] = msg
      ImMessage.saveMessage(msg)
      if (ImMessage.isMediaMsg(message.msgType)) {
        ImMessage.sendMediaMsg(message, {}).catch(console.error)
      } else {
        ImMessage.sendMsgToServer(msg)
      }
    }
  }

  static sendMsgToServer(message) {
    if (BDMsgServer.isWebSock()) {
      BDMsgServer.getWebSock().sendMsgToServer(message)
    } else {
      IApp.runOnce("sendMsgToServer", message)
    }
  }

  static setMsgStatus(_id, sessionKey, status) {
    const message = ImMessage.getMsgFromCacheByDocId(sessionKey, _id)
    if (message) {
      const msg = {
        ...message,
        updated: Math.floor(getCurrentTimeStamp(true)),
        status
      }
      ImMessage.saveMessage(msg)
    }
  }

  static handleDbIds(sessionKey, docIds) {
    if (docIds.length > 0) {
      ImMessage.rows[sessionKey].rowsCache = docIds
      docIds.forEach(_id => {
        const {fromId, msgType, sessionType, extra, created} = ImMessage.parseMsgDocId(_id)
        const {rows} = ImMessage.getSessionMsgs(sessionKey)
        const msg = rows[_id] || {};
        ImMessage.rows[sessionKey].rows[_id] = {
          ...msg,
          _id,
          sessionType,
          extra,
          fromId,
          created,
          msgType
        }
      })
      ImMessage.setSkip(sessionKey, docIds.length - 20 < 0 ? 0 : docIds.length - 20)
      ImMessage.sortMsgs(sessionKey)
    }
  }

  static isImOnline() {
    return BDMsgServer.isImOnline()
  }

  static decryptMessages() {
    if (ImSession.currentSessionKey) {
      const {rowsUnDecrypt} = ImMessage.getSessionMsgs(ImSession.currentSessionKey)
      const rowsUnDecryptKeys = Object.keys(rowsUnDecrypt)
      if (rowsUnDecryptKeys.length > 0) {
        if (ImMessage.unDecrypting) return;
        ImMessage.unDecrypting = true;
        const rows = []
        rowsUnDecryptKeys.forEach(_id => {
          if (rowsUnDecrypt[_id]) {
            const {created} = ImMessage.parseMsgDocId(_id)
            rows.push({_id, created})
          }
        })
        rows.sort((a, b) => -a.created + b.created)
        const tasks = []
        let unDecryptTaskNum = BDApp.getConstant().im["unDecryptTaskNum"]
        if (rows.length < unDecryptTaskNum) {
          unDecryptTaskNum = rows.length
        }
        for (let i = 0; i < unDecryptTaskNum; i++) {
          const {_id} = rows[i]
          tasks.push(Promise.resolve(ImMessage.decryptMsg(ImSession.currentSessionKey, _id)))
        }
        Promise.all(tasks).then((res) => {
        }).catch((e) => {
          console.error(e)
        }).finally(() => {
          setTimeout(() => {
            ImMessage.unDecrypting = false;
            ImMessage.decryptMessages()
          }, 50)
        })
      }
    }

  }

  static async decryptMsg(sessionKey, _id) {
    let message = ImMessage.getMsgFromCacheByDocId(sessionKey, _id)
    if (!message || !message.updated) {
      message = await ImMessage.getMsgFromPdbByDocId({_id})
      if (!message) {
        delete ImMessage.rows[sessionKey].rowsUnDecrypt[_id]
        return Promise.resolve("")
      }
    }
    if (message.plain) {
      delete ImMessage.rows[sessionKey].rowsUnDecrypt[_id]
      return Promise.resolve(message.plain)
    }
    const plain = ImMessage.decryptMsgContent(message)
    if (!plain) {
      delete ImMessage.rows[sessionKey].rowsUnDecrypt[_id]
      return Promise.reject({message: "decrypt msg content error"})
    }
    ImMessage.rows[sessionKey].rows[_id] = {
      ...message, plain
    }
    delete ImMessage.rows[sessionKey].rowsUnDecrypt[_id]
    StorageHelper.notify(namespace, _id)
    return Promise.resolve(ImMessage.rows[sessionKey].rows[_id].plain)
  }

  static removeUnDecrypt(sessionKey, _id) {
    ImMessage.initSessionMsg(sessionKey)
    if (ImMessage.rows[sessionKey].rowsUnDecrypt[_id]) {
      delete ImMessage.rows[sessionKey].rowsUnDecrypt[_id]
    }
  }

  static setUnDecrypt(sessionKey, _id, isInspecting) {
    ImMessage.initSessionMsg(sessionKey)
    ImMessage.rows[sessionKey].rowsUnDecrypt[_id] = isInspecting
    // window._tmp = ImMessage.rows[sessionKey].rowsUnDecrypt
    ImMessage.decryptMessages()
  }

  static changeMsgStatus({peerId, status, msgId}) {
    postRemote("api/ImMessage.changeStatus", {peerId, status, msgId}).catch(console.error)
  }


  static getMsgFromId(sessionKey, index) {
    ImMessage.initSessionMsg(sessionKey)
    const {fromIds} = ImMessage.getSessionMsgs(sessionKey)
    return fromIds[index] ? fromIds[index] : null
  }

  static setTitleNotice(notice) {
    let {title} = document;
    if (title.indexOf(":") > 0) {
      title = title.split(":")[0]
    }
    if (notice) {
      document.title = `${title}:【${notice}】`
    } else {
      document.title = `${title}`
    }
  }

  static fixMsgIds(msgIds) {
    const rows = msgIds
    let pre = rows[0];
    const res = []
    rows.forEach((row, i) => {
      if (pre !== row - 1 && i > 1) {
        let j = 1
        while (1) {
          if (row - j > pre) {
            res.push(row - j)
            j += 1
          } else {
            break
          }
        }
      }
      pre = row
    })
    if (res.length > 0) {
      res.sort()
    }
    return res
  }
}

ImMessage.calling = false;
ImMessage.rows = {}
ImMessage.msgSortType = "asc"
export default ImMessage
