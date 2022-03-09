import config from 'config'
import {getCurrentTimeStamp} from "../../functions/utils";
let currentInstance = null

class BaWebSocket {
  constructor({onReady, onMsg}) {
    this.retrySend = 0
    this.retrySendMax = 20
    this.api = config.blockChain.biAnWsApi
    this.ws = null
    this.onReady = onReady
    this.onMsg = onMsg
    this.init()
  }

  init() {
    if(currentInstance){
      return;
    }
    try {
      const ws = new WebSocket(`${this.api}/stream`);
      ws.onopen = this.onOpen.bind(this)
      ws.onmessage = this.onMessage.bind(this)
      ws.onclose = this.onClose.bind(this)
      ws.onerror = this.onError.bind(this)
      this.ws = ws
      currentInstance = this;
    } catch (e) {
      console.error(e)
    }
  }

  close() {
    console.log("ws close")
  }

  reconnect() {
    if (this.ws) {
      this.close()
    } else {
      currentInstance = null
      this.init()
    }
  }

  onOpen() {
    console.log("ws onOpen")
    this.onReady && this.onReady(this)
  }

  onMessage({data}) {
    data = JSON.parse(data)
    // console.log("ws onMessage", data)
    this.onMsg && this.onMsg(data)
    BaWebSocket.handleStreamMsg(data)
  }

  onClose(e) {
    this.ws = null;
    currentInstance = null;
    console.log("ws onClose", e)
  }

  onError(e) {
    console.log("ws onError", e)
  }

  isReady() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * @param dataJsonObj
   */
  sendData(dataJsonObj) {
    if (this.isReady()) {
      this.ws.send(JSON.stringify(dataJsonObj))
    } else {
      setTimeout(() => {
        if (this.retrySend < this.retrySendMax) {
          this.retrySend += 1
          this.sendData(dataJsonObj)
        }
      }, 1000 * (this.retrySend % 5 + 1))
    }
  }

  subscribe(params) {
    this.sendData({
      "method": "SUBSCRIBE",
      params,
      "id": getCurrentTimeStamp()
    })
  }

  unSubscribe(params) {
    this.sendData({
      "method": "UNSUBSCRIBE",
      params,
      "id": getCurrentTimeStamp()
    })
  }

  listSubscribes() {
    this.sendData({
      "method": "LIST_SUBSCRIPTIONS",
      "id": getCurrentTimeStamp()
    })
  }

  static handleStreamMsg({data, stream}) {
    const handlers = Object.keys(BaWebSocket.streamHandler)
    for (let i = 0; i < handlers.length; i++) {
      if(BaWebSocket.streamHandler[handlers[i]]){
        BaWebSocket.streamHandler[handlers[i]]({data, stream})
      }else{
        console.log("handleStreamMsg",stream)
      }
    }
  }

  static regStreamHandler(id, handler) {
    if (handler) {
      BaWebSocket.streamHandler[id] = handler
    } else {
      delete BaWebSocket.streamHandler[id]
    }
  }
  static getInstance(){
    return currentInstance
  }
}

BaWebSocket.streamHandler = {}

export default BaWebSocket
