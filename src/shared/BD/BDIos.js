import {
  _debug,

  base64ToBlob,
  getCurrentTimeStamp,
  getGlobalAuthUserId,
  saveMediaToPdb,
  showToastText
} from "../functions/common";
import {getUploadFilePdbId} from "../functions/upload";
import {getAudiosPDb, getImagePDb} from "../functions/pdb";
import ImMessage from "./model/ImMessage";
import ImSession from "./model/ImSession";
import BDRecordAudio from "./BDRecordAudio";
import BDApp from "./BDApp";
import config from "config";
import {setStoreState} from "../../components/core/App";

export default class BDIos {
  static getHandler() {
    return window.webkit.messageHandlers
  }

  static startRecord() {
    BDIos.getHandler().startRecord.postMessage({});
  }

  static stopRecord() {
    BDIos.getHandler().stopRecord.postMessage({});
  }

  static showProgressBar(visible) {
    BDIos.getHandler().showProgressBar.postMessage({"visible": visible ? "true" : "false"});
  }

  static async onGetVoiceVol({averagePower, peakPower, lowPass}) {
    _debug({averagePower, peakPower, lowPass})
  }

  static async onGetRecordData({duration, b64Data}) {
    _debug("onGetRecordData", {duration}, "cancelRecord:", BDRecordAudio.cancelRecord)
    if (BDRecordAudio.cancelRecord) {
      return;
    }
    const constant = BDApp.getConstant();
    if (parseInt(duration) < constant.common.upload.audio['minRecordTime']) {
      showToastText("说话太短了")
      return;
    }
    const audioData = decodeURIComponent(b64Data)
    const type = audioData.split(";base64")[0].split("data:")[1]
    const blob = base64ToBlob(audioData, type)
    const doc_id = getUploadFilePdbId({
      name: `iso_audio_${getGlobalAuthUserId()}_${getCurrentTimeStamp()}`,
      type,
      duration,
      size: blob.size
    })
    const db = getAudiosPDb()
    await saveMediaToPdb(db, doc_id, blob, type)
    _debug("onGetRecordData saveMediaToPdb", doc_id)
    const {MSG_TYPE} = config.constants.im
    let message;
    message = await ImMessage.sendMsg({
      sessionKey: ImSession.currentSessionKey,
      msgType: MSG_TYPE.MSG_TYPE_AUDIO,
      data: doc_id
    })
    ImMessage.sendMediaMsg(message, {blob}).catch(console.error);
  }

  static async onUploadResponse({width, height, b64Data}) {
    const imageData = decodeURIComponent(b64Data)
    const type = imageData.split(";base64")[0].split("data:")[1]
    const blob = base64ToBlob(imageData, type)
    const doc_id = getUploadFilePdbId({
      name: `iso_img_${getGlobalAuthUserId()}_${getCurrentTimeStamp()}`,
      type,
      width,
      height,
      size: blob.size
    })
    _debug("onUploadResponse", doc_id, width, height, type, ImSession.currentSessionKey, blob.size)
    const db = getImagePDb()
    await saveMediaToPdb(db, doc_id, blob, type)
    const {MSG_TYPE} = config.constants.im
    let message;
    message = await ImMessage.sendMsg({
      sessionKey: ImSession.currentSessionKey,
      msgType: MSG_TYPE.MSG_TYPE_IMAGE,
      data: doc_id
    })
    ImMessage.sendMediaMsg(message, {blob}).catch(console.error);
  }

  static callBack(action, result, err) {
    if (err) {
      return console.error(err)
    }
    _debug("callBack", action)
    switch (action) {
      case "onGetMyLocation":
        BDIos.onGetMyLocation(result, err)
        break
      case "onUploadResponse":
        BDIos.onUploadResponse(result).catch(console.error)
        break
      case "onStopAudio":
        BDIos.onStopAudio(result).catch(console.error)
        break
      case "onPauseAudio":
        BDIos.onPauseAudio(result).catch(console.error)
        break
      case "onStartAudio":
        BDIos.onStartAudio(result).catch(console.error)
        break
      case "onGetRecordData":
        BDIos.onGetRecordData(result).catch(console.error)
        break
      case "onGetVoiceVol":
      default:
        BDIos.onGetVoiceVol(result).catch(console.error)
        break
    }
  }

  static onGetMyLocation({lat, lng}, error) {
    if (error) {
      console.error(error)
      setStoreState("gps", {
        gpsError: error
      })
    } else {
      setStoreState("gps", {
        lat, lng
      })
    }
  }

  static getMyLocation(options) {
    BDIos.getHandler().getMyLocation.postMessage({
      enableAddress: false,
      minTimeMs: 1000,
      minDistanceM: 10,
      ...options
    });
  }

  static openQrScanner() {
    BDIos.getHandler().openQrScanner.postMessage({});
  }

  /**
   * @param type 1: camera | photo gallery
   */
  static openImageGallery(type) {
    BDIos.getHandler().openImageGallery.postMessage({type});
  }

  static jumpToSystemPrivacySetting() {
    BDIos.getHandler().jumpToSystemPrivacySetting.postMessage({});
  }

  static openVideoRecorder() {
    BDIos.getHandler().openVideoRecorder.postMessage({});
  }

  static playAudio({audioId, b64Data}) {
    BDIos.getHandler().playAudio.postMessage({audioId, b64Data});
  }

  static stopAudio({audioId}) {
    BDIos.getHandler().stopAudio.postMessage({audioId});
  }

  static async onStopAudio({audioId}) {
    _debug("onStopAudio", audioId)
  }

  static async onPauseAudio({audioId}) {
    _debug("onPauseAudio", audioId)
  }

  static async onStartAudio({audioId}) {
    _debug("onStartAudio", audioId)
  }
}

window.BDIosCallBack = BDIos.callBack
