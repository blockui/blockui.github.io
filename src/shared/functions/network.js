import axios from "axios";
import BDAuth from "../BD/BDAuth";
import BDApp from "../BD/BDApp";
import {aesDecryptCbc256, aesEncryptCbc256, md5} from "./crypto";
import {getCurrentTimeStamp} from "./utils";

export function abToBuffer(ab) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

export function abToBlob(ab, type) {
  return new Blob([new Uint8Array(ab, 0, ab.byteLength)], {type});
}

export function bufferToAb(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export const xhrGet = (url, opt) => {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === this.HEADERS_RECEIVED) {
        console.log("Response Headers", this.HEADERS_RECEIVED, "\n", xhr.getAllResponseHeaders());
      }
      if (xhr.readyState === 4) {
        console.log("xhr.readyState", xhr.readyState, "xhr.status:", xhr.status)
        if (xhr.status === 200 || xhr.status === 206) {
          try {
            resolve(xhr);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error('XMLHttpRequest onreadystatechange error '));
        }
      }
    };
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round(100 * e.loaded / e.total);

        console.log(percent)
        if (opt.onProgress) {
          opt.onProgress({
            percent,
            loaded: e.loaded,
            total: e.total,
          })
        } else {
          console.log("percent " + percent + '%');
        }
      } else {
        console.log("Unable to compute progress information since the total size is unknown");
      }
    };

    xhr.open('GET', url, true);
    xhr.timeout = 60000;
    xhr.ontimeout = function (e) {
      console.error("xhr_get Timeout!!")
      reject(e)
    }
    if (opt.headers) {
      Object.keys(opt.headers).forEach((key) => {
        xhr.setRequestHeader(key, opt.headers[key]);
      })
    }
    if (opt.blob) {
      xhr.responseType = "blob";
    }
    if (opt.arrayBuffer) {
      xhr.responseType = "arraybuffer";
    }
    xhr.send();
  })
}

export function getHttpResHeaders(url) {
  return new Promise(function (resolve, reject) {
    fetch(url, {
      method: "GET", //请求方式
      // mode: 'cors',
      headers: { //请求头
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        "Cache-Control": "no-cache",
        // Connection: "keep-alive",
        Pragma: "no-cache",
        Range: "bytes=0-1"
      }
    }).then(r => {
      let h = {};
      r.headers.forEach(function (v, i, a) {
        h[i.toLowerCase()] = v;
      });
      return resolve(h);
    }).catch(reject);
  });
}

export function downloadBlock(url, {
  headers, onProgress
}) {
  let headers_ = {
    'Content-Type': 'application/octet-stream',
    "Cache-Control": "no-cache",
    // Connection: "keep-alive",
    Pragma: "no-cache"
  };
  if (typeof headers == "string") {
    headers_["Range"] = "bytes=" + headers;
  } else if (typeof headers == "object") {
    headers_ = Object.assign(headers_, headers);
  }
  return xhrGet(url, {
    headers: headers_,
    arrayBuffer: true,
    onProgress
  }).then(({response}) => {
    return abToBuffer(response)
  });

}

//切割大小
function cutSize(contentLength, blockSize) {
  //向后取整
  let blockLen = Math.ceil(contentLength / blockSize);
  let blist = [];
  for (let i = 0, strat, end; i < blockLen; i++) {
    strat = i * blockSize;
    end = (i + 1) * blockSize - 1;
    end = end > contentLength ? contentLength : end;
    blist.push({start: strat, end: end});
  }
  return blist;
}

export function downloadFileByRange({url, threads, onProgress}) {
  console.log("downloadFileByRange", url)
  return new Promise(function (resolve, reject) {
    getHttpResHeaders(url).then(h => {
      if (!h["content-range"]) {
        return reject("getHttpResHeaders can not found content-range")
      }
      let contentRange = h["content-range"];
      let etag = h.etag || null;
      let contentType = h["content-type"];
      console.log(("downLoadFile", url, etag, {contentType, contentRange}))
      let contentLength = 0;
      let blockSize;
      let bList
      contentLength = Number(contentRange.split("/").reverse()[0]);
      if (!threads || threads === 1) {
        bList = [{start: 0, end: contentLength}]
      } else {
        blockSize = Math.floor(contentLength / (threads))
        if (contentLength >= blockSize) {
          bList = cutSize(contentLength, blockSize);
        }
      }
      let res = []
      bList.forEach((row, i) => {
        downloadBlock(url, {
          headers: {
            etag: etag,
            'Content-Type': contentType,
            "Range": "bytes=" + row.start + "-" + row.end
          },
          onProgress: ({percent, ...res}) => {
            if (onProgress) {
              onProgress({...res, percent, i})
            } else {
              console.log(i, "percent:", percent, "%")
            }
          }
        }).then((buffer) => {
          res.push({i, b: buffer})
          if (res.length === bList.length) {
            const finalBuff = new Uint8Array(contentLength);
            let i = 0
            res.sort((a, b) => a.i - b.i).forEach(({b}) => {
              for (let j = 0; j < b.length; ++j) {
                finalBuff[i] = b[j];
                i += 1;
              }
            })
            console.log("download ok: ")
            resolve({buffer: finalBuff, type: contentType, size: contentLength})
          }
        })
      })
    })
  })
}

const handleUrl = (url) => {
  let url_ = url;
  if (url.indexOf("api/") === 0) {
    url_ = url_.substring(3)
  }
  return url_;
}


export function postRemote(url, data) {
  const postData = {
    data
  }
  const user = BDAuth.getGlobalUser()
  if (user && user.api_token && data) {
    const token = user.api_token.split("_")[1]
    // let startTime = getCurrentTimeStamp()
    postData.iv = md5(getCurrentTimeStamp(true) + token)
    // console.debug(getCurrentTimeStamp() - startTime)
    postData.data = aesEncryptCbc256(JSON.stringify(postData.data), token, postData.iv)
    // startTime = getCurrentTimeStamp()
    // console.debug(getCurrentTimeStamp() - startTime)
  }

  return new Promise((resolve, reject) => {
    axios.post(handleUrl(url), postData).then((res) => {
      let {code, iv, body, msg, message} = res.data;
      if (iv && user && user.api_token) {
        const token = user.api_token.split("_")[1]
        try {
          body = aesDecryptCbc256(body, token, iv)
          if (body) {
            body = JSON.parse(body)
          }
        } catch (e) {
          console.error(e, url)
          reject({code, message: "decrypt error"})
        }
      }
      if (code === 200) {
        resolve(body)
      } else {
        reject({code, message: msg || message})
      }
    }).catch(reject)
  })
}

export function deleteRemote(url) {
  return new Promise((resolve, reject) => {
    let url_ = url;
    if (url.indexOf("api/") === 0) {
      url_ = url_.substring(3)
    }
    axios.delete(url_).then((res) => {
      const {code, body, msg, message} = res.data;
      if (code === 200) {
        resolve(body)
      } else {
        reject({message: msg || message})
      }
    }).catch(reject)
  })
}


export const getClientInfo = ()=>{
  return {
    platform: BDApp.platform,
    agent: window['BD'] ? window['BD']['agent'] : "",
    version: window['BD'] ? window['BD']['version'] : "",
    versionAssets: window['BD'] ? window['BD']['versionAssets'] : "",
    lang: navigator.language,
    user_id: BDAuth.getGlobalAuthUserId()
  }
}

export const handleRequest = (request)=>{
  if(request.method === "post"){
    if(!request.data){
      request.data = {}
    }
    request.data['__client'] = getClientInfo()
  }
  return request
}
