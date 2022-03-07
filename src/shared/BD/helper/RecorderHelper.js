import {_debug,  showTopTips} from "../../functions/common";

export default class RecorderHelper {
  constructor() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      _debug('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      console.error('No web audio support in this browser!');
      showTopTips("浏览器不支持获取麦克风")
    }
  }

  async getRecorder({onStateChanged, ...options}) {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
    const recorder = new window.RecordRTCPromisesHandler(stream, {
      type: 'audio',
      disableLogs: false,
      numChannels: 2,
      numberOfAudioChannels: 2,
      desiredSampRate: 16000,
      recorderType: window.StereoAudioRecorder,
      ...options
    });
    recorder.microphone = stream;

    this.recorder = recorder
    return Promise.resolve(recorder)
  }

  async start() {
    return this.recorder.startRecording();
  }

  pause() {
    return this.recorder.pauseRecording();
  }

  destroy() {
    return this.recorder.destroy();
  }

  resume() {
    return this.recorder.resumeRecording();
  }

  reset() {
    return this.recorder.reset();
  }

  getBlob() {
    return this.recorder.getBlob();
  }

  toURL() {
    return this.recorder.toURL();
  }

  async stop() {
    await this.recorder.stopRecording();
    let blob = await this.recorder.getBlob();
    return Promise.resolve(blob)
  }
}

