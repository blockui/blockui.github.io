import {getConstant} from "./common";
import {getCurrentTimeStamp} from "./utils";
import {delCache, getCache, setCache} from "./cache";
import config from "config";


export function setCallStatus(status) {
  window.__call_status = status
}

export function getCallStatus() {
  return window.__call_status
}

export function setCallRoomId(roomId) {
  window.__call_room_id = roomId
}

export function getCallRoomId() {
  return window.__call_room_id
}

export function setCallOpenTime(roomId) {
  setCache("call_open_time_" + roomId, getCurrentTimeStamp(), 60 * 3, false)
}


export function removeCallOpenTime(roomId) {
  delCache("call_open_time_" + roomId)
}

export function getCallOpenTime(roomId) {
  const time = getCache("call_open_time_" + roomId, null)
  return time ? parseInt(time) : null
}

export function getCallStatusLabel(status, created) {
  const {MSG_SEND_STATUS} = config.constants.im
  switch (status) {
    case MSG_SEND_STATUS.CALL_END:
      return "通话结束"
    case MSG_SEND_STATUS.CALL_NOT_CONNECT:
      return "未接通"
    default:
      const {webrtc} = getConstant()
      const {maxCallWaitingConfirmTimeSec, maxCallWaitingConnectTimeSec} = webrtc
      if (getCurrentTimeStamp() - created > 1000 * Math.min(maxCallWaitingConfirmTimeSec, maxCallWaitingConnectTimeSec)) {
        return "未接通"
      } else {
        return "等待接听"
      }
  }
}


export function formatSessionMsgContent(latestMsgPlain, latestMsgType) {
  const {MSG_TYPE} = config.constants.im
  switch (parseInt(latestMsgType)) {
    case MSG_TYPE.MSG_TYPE_IMAGE:
      return "[图片]";
    case MSG_TYPE.MSG_TYPE_AUDIO:
      return "[语音]";
    case MSG_TYPE.MSG_TYPE_VIDEO:
      return "[视频]";
    case MSG_TYPE.MSG_TYPE_VIDEO_CALL:
      return "[视频通话]";
    case MSG_TYPE.MSG_TYPE_AUDIO_CALL:
      return "[语音通话]";
    default:
      return latestMsgPlain ? latestMsgPlain.substring(0, getConstant().im['sessionContentMaxLen']) : "";
  }
}
