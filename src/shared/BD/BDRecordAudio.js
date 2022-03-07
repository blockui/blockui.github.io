import {
  _debug,
  base64ToBlob,
  checkSupportTouch,
  getCurrentTimeStamp,
  getGlobalAuthUserId,
  getMsgFooterBarHeight,
  saveMediaToPdb,
  showToastText,
  showTopTips
} from "../functions/common";
import {setStoreState} from "components/core/App";
import IApp from "shared/BD/IApp";
import {getUploadFilePdbId} from "../functions/upload";
import {getAudiosPDb} from "../functions/pdb";
import ImMessage from "./model/ImMessage";
import BDApp from "./BDApp";
import config from "config";
import BDIos from "./BDIos";
import BDPermission from "./BDPermission";

class BDRecordAudio {
  static async startRecord(onStopRecord, e) {
    if (BDRecordAudio.recording) {
      return;
    }
    const {targetTouches} = e
    const {clientX} = (targetTouches && targetTouches.length > 0) ? targetTouches[0] : e
    BDRecordAudio.cancelOffsetX = 0
    BDRecordAudio.startClientX = clientX
    BDRecordAudio.recorderData = {}
    BDRecordAudio.cancelRecord = false
    BDRecordAudio.recording = true
    setStoreState("im", {
      cancelRecord: false,
      recording: true,
    })
    if (BDApp.isAdrPlatform()) {
      await BDPermission.checkPermission("RECORD_AUDIO")
      IApp.call("startRecord")
    } else if (BDApp.isIosPlatform()) {
      BDIos.startRecord()
    } else {
      window.Recorder.getPermission().then(() => {
        BDRecordAudio.webRecorder = new window.Recorder({
          sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
          sampleRate: 48000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
          numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
        });
        BDRecordAudio.webRecorder.start().catch(console.error);
        BDRecordAudio.webRecorder.onprogress = ({duration, fileSize, vol}) => {
          // _debug("vol",BDRecordAudio.recorderData.vol)
          BDRecordAudio.recorderData = {
            duration, fileSize, vol
          }
        }
      }, (error) => {
        showTopTips(error.message)
      });
    }
    window.addEventListener(
      checkSupportTouch() ? "touchend" : "mouseup",
      onStopRecord,
      null
    )
    window.addEventListener(
      checkSupportTouch() ? "touchmove" : "mousemove",
      BDRecordAudio.onRecordBoxTouchMove,
      null
    )
  }

  static async stopRecord(sessionKey) {
    _debug("stopRecord")
    BDRecordAudio.removeTouchMove();
    setStoreState("im", {
      cancelRecord: true,
      recording: false
    })
    const file = await BDRecordAudio.onStopRecord()
    _debug("onStopRecord res", file)
    if (BDApp.isIosPlatform()) {
      return Promise.resolve()
    }
    if (!file) return Promise.reject("stopRecord file is null")
    const {blob, type, audioTime} = file
    const doc_id = getUploadFilePdbId({
      name: `record_${getGlobalAuthUserId()}_${getCurrentTimeStamp()}`,
      type,
      duration: audioTime,
      size: blob.size
    })
    const db = getAudiosPDb()
    await saveMediaToPdb(db, doc_id, blob, type)
    const {MSG_TYPE} = config.constants.im
    if (!BDRecordAudio.cancelRecord) {
      // _debug("stopRecord",BDRecordAudio.cancelRecord)
      let message;
      message = await ImMessage.sendMsg({
        sessionKey,
        msgType: MSG_TYPE.MSG_TYPE_AUDIO,
        data: doc_id
      })
      ImMessage.sendMediaMsg(message, {blob}).catch(console.error);
    }
  }

  static onRecordBoxTouchMove(e) {
    // console.log("onRecordBoxTouchMove",
    //     BDRecordAudio.recording,
    //     BDRecordAudio.cancelRecord,
    // )
    if (!BDRecordAudio.recording || BDRecordAudio.cancelRecord) {
      BDRecordAudio.removeTouchMove();
    }
    const {targetTouches} = e
    const {clientY, clientX} = (targetTouches && targetTouches.length > 0) ? targetTouches[0] : e
    BDRecordAudio.cancelOffsetX = clientX - BDRecordAudio.startClientX
    if (clientY > document.body.clientHeight - getMsgFooterBarHeight() && clientX > 100) {
      if (!BDRecordAudio.cancelRecord) {
        _debug("stopRecord", BDRecordAudio.cancelRecord)
        BDRecordAudio.cancelRecord = true
        setStoreState("im", {
          cancelRecord: true
        })
      }
    } else {
      if (BDRecordAudio.cancelRecord) {
        _debug("stopRecord", BDRecordAudio.cancelRecord)
        BDRecordAudio.cancelRecord = false
        setStoreState("im", {
          cancelRecord: false
        })
      }
    }
  }

  static removeTouchMove() {
    window.removeEventListener(
      checkSupportTouch() ? "touchmove" : "mousemove",
      BDRecordAudio.onRecordBoxTouchMove
    )
  }

  static async onStopRecord() {
    if (!BDRecordAudio.recording) return Promise.reject("not recording");
    BDRecordAudio.recording = false;
    const constant = BDApp.getConstant();
    let file = null
    if (BDApp.isAdrPlatform()) {
      const record = await IApp.run("stopRecord", null)
      if (!record || record.length === 0) {
        return Promise.reject("record result is null");
      }
      const path = record.split("|")[1]
      const audioTime = record.split("|")[0]
      if (parseInt(audioTime) < constant.common.upload.audio['minRecordTime']) {
        _debug("record is to short")
        showToastText("说话太短了")
        return Promise.reject("speak to short");
      }
      const base64 = await IApp.run("getFileBase64Content", {path})
      const src = "data:audio/aac;base64," + base64;
      const type = "audio/aac";
      const blob = base64ToBlob(base64, type)
      file = {
        name: path.split("/").reverse()[0],
        type,
        blob,
        audioTime,
        size: blob.size,
        base64: src,
      }
    } else if (BDApp.isIosPlatform()) {
      BDIos.stopRecord()
    } else {
      const blob = BDRecordAudio.webRecorder.getWAVBlob()
      const {duration} = BDRecordAudio.webRecorder
      if (parseInt(duration) < constant.common.upload.audio['minRecordTime']) {
        _debug("record is to short")
        showToastText("说话太短了")
        return Promise.reject("speak to short");
      }
      const {type} = blob;
      file = {
        name: `audio.aac`,
        type,
        blob,
        audioTime: duration,
        size: blob.size
      }
    }
    return Promise.resolve(file)
  }
}


BDRecordAudio.cancelOffsetX = 0
BDRecordAudio.startClientX = 0
BDRecordAudio.recorderData = {}
BDRecordAudio.recording = false;
BDRecordAudio.recording = false;
BDRecordAudio.cancelRecord = false;
BDRecordAudio.__record_time_id = null;

export default BDRecordAudio
