import queryString from "query-string"
import qs from "querystring";
import weui from "shared/weui-js"
import {dispatchStore, setStoreState} from "components/core/App"
import IApp, {onChangeStatusBarBgColor} from "shared/BD/IApp";
import {abToBuffer} from "./network";
import {getUploadFilePdbId} from "./upload";
import BDApp from "../BD/BDApp";
import {delCache, getCache, setCache} from "./cache";
import {compressImage, getVideoFirstFrame} from "./image";
import {dataURItoBlob} from "../weui-js/uploader/image";
import {getImagePDb} from "./pdb";
import config from "config";
import BDAuth from "../BD/BDAuth";

export const COUNTRY_CODE = ["加拿大(+1)", "北马里亚纳(+1)", "美国(+1)", "俄罗斯(+7)", "埃及(+20)", "南非(+27)", "希腊(+30)", "荷兰(+31)", "比利时(+32)", "法国(+33)", "西班牙(+34)", "匈牙利(+36)", "意大利(+39)", "罗马尼亚(+40)", "瑞士(+41)", "奥地利(+43)", "英国(+44)", "丹麦(+45)", "瑞典(+46)", "挪威(+47)", "斯瓦尔巴岛和扬马延岛(+47)", "波兰(+48)", "德国(+49)", "秘鲁(+51)", "墨西哥(+52)", "古巴(+53)", "阿根廷(+54)", "巴西(+55)", "智利(+56)", "哥伦比亚(+57)", "委内瑞拉(+58)", "马来西亚(+60)", "澳大利亚(+61)", "圣诞岛(+61)", "科科斯（基林）群岛(+61)", "印度尼西亚(+62)", "菲律宾(+63)", "新西兰(+64)", "新加坡(+65)", "泰国(+66)", "哈萨克斯坦(+73)", "日本(+81)", "韩国(+82)", "越南(+84)", "中国大陆(+86)", "土耳其(+90)", "印度(+91)", "巴基斯坦(+92)", "阿富汗(+93)", "斯里兰卡(+94)", "缅甸(+95)", "伊朗(+98)", "摩洛哥(+212)", "阿尔及利亚(+213)", "突尼斯(+216)", "利比亚(+218)", "冈比亚(+220)", "塞内加尔(+221)", "毛里塔尼亚(+222)", "马里(+223)", "几内亚(+224)", "科特迪瓦(+225)", "布基纳法索(+226)", "尼日尔(+227)", "多哥(+228)", "贝宁(+229)", "毛里求斯(+230)", "利比里亚(+231)", "塞拉利(+232)", "加纳(+233)", "尼日利亚(+234)", "乍得(+235)", "中非(+236)", "喀麦隆(+237)", "佛得角(+238)", "圣多美和普林西比(+239)", "赤道几内亚(+240)", "加蓬(+241)", "刚果（布）(+242)", "刚果（金）(+243)", "安哥拉(+244)", "几内亚比绍(+245)", "塞舌尔(+248)", "苏丹(+249)", "卢旺达(+250)", "埃塞俄比亚(+251)", "索马里(+252)", "吉布提(+253)", "肯尼亚(+254)", "坦桑尼亚(+255)", "乌干达(+256)", "布隆迪(+257)", "莫桑比克(+258)", "赞比亚(+260)", "马达加斯加(+261)", "留尼汪(+262)", "津巴布韦(+263)", "纳米尼亚(+264)", "马拉维(+265)", "莱索托(+266)", "博茨瓦纳(+267)", "斯威士兰(+268)", "科摩罗(+269)", "马约特(+269)", "圣赫勒拿(+290)", "厄立特里亚(+291)", "阿鲁巴(+297)", "法罗群岛(+298)", "格陵兰(+299)", "直布罗陀(+350)", "葡萄牙(+351)", "卢森堡(+352)", "爱尔兰(+353)", "冰岛(+354)", "阿尔巴尼亚(+355)", "马耳他(+356)", "塞浦路斯(+357)", "芬兰(+358)", "保加利亚(+359)", "立陶宛(+370)", "拉脱维亚(+371)", "爱沙尼亚(+372)", "摩尔多瓦(+373)", "亚美尼亚(+374)", "白俄罗斯(+375)", "安道尔(+376)", "摩纳哥(+377)", "圣马力诺(+378)", "梵蒂冈(+379)", "乌克兰(+380)", "塞尔维亚和黑山(+381)", "克罗地亚(+385)", "斯洛文尼亚(+386)", "波黑(+387)", "前南马其顿(+389)", "捷克(+420)", "斯洛伐克(+421)", "列支敦士登(+423)", "福克兰群岛（马尔维纳斯）(+500)", "伯利兹(+501)", "危地马拉(+502)", "萨尔瓦多(+503)", "洪都拉斯(+504)", "尼加拉瓜(+505)", "哥斯达黎加(+506)", "巴拿马(+507)", "圣皮埃尔和密克隆(+508)", "海地(+509)", "瓜德罗普(+590)", "玻利维亚(+591)", "圭亚那(+592)", "厄瓜多尔(+593)", "法属圭亚那(+594)", "巴拉圭(+595)", "马提尼克(+596)", "苏里南(+597)", "乌拉圭(+598)", "荷属安的列斯(+599)", "南极洲(+672)", "文莱(+673)", "瑙鲁(+674)", "巴布亚新几内亚(+675)", "汤加(+676)", "所罗门群岛(+677)", "瓦努阿图(+678)", "斐济(+679)", "帕劳(+680)", "瓦利斯和富图纳(+681)", "库克群岛(+682)", "纽埃(+683)", "美属萨摩亚(+684)", "萨摩亚(+685)", "基里巴斯(+686)", "新喀里多尼亚(+687)", "图瓦卢(+688)", "法属波利尼西亚(+689)", "托克劳(+690)", "密克罗尼西亚(+691)", "马绍尔群岛(+692)", "朝鲜(+850)", "香港(+852)", "澳门(+853)", "柬埔寨(+855)", "老挝(+856)", "孟加拉国(+880)", "台湾(+886)", "马尔代夫(+960)", "黎巴嫩(+961)", "约旦(+962)", "叙利亚(+963)", "伊拉克(+964)", "科威特(+965)", "沙特阿拉伯(+966)", "也门(+967)", "阿曼(+968)", "阿拉伯联合酋长国(+971)", "以色列(+972)", "巴林(+973)", "卡塔尔(+974)", "不丹(+975)", "蒙古(+976)", "尼泊尔(+977)", "塔吉克斯坦(+992)", "土库曼斯坦(+993)", "阿塞拜疆(+994)", "格鲁吉亚(+995)", "吉尔吉斯斯坦(+996)", "乌兹别克斯坦(+998)", "巴哈马(+1242)", "巴巴多斯(+1246)", "安圭拉(+1264)", "安提瓜和巴布达(+1268)", "英属维尔京群岛(+1284)", "美属维尔京群岛(+1340)", "开曼群岛(+1345)", "百慕大(+1441)", "格林纳达(+1473)", "根西岛(+1481)", "特克斯和凯科斯群岛(+1649)", "蒙特塞拉特(+1664)", "关岛(+1671)", "圣卢西亚(+1758)", "多米尼克(+1767)", "圣文森特和格林纳丁斯(+1784)", "多米尼加(+1809)", "波多黎各(+1809)", "特立尼达和多巴哥(+1868)", "圣基茨和尼维斯(+1869)", "牙买加(+1876)", "诺福克岛(+6723)"];

const {$, localStorage, location} = window;


export function locationReload() {
  if (checkIsLocalDev() && getIApp()) {
    return;
  }
  window.location.reload()
}


export function getConstant() {
  return BDApp.getConstant()
}

export function getIApp() {
  return IApp
}

/**
 * @deprecated
 * @return {number}
 */
export function getCurrentTimeStamp() {
  return +(new Date());
}


export function genNickname(username) {
  const t = username.split("")
  return t.slice(0, 3).join("") + t.slice(6, 10).join("")
}

export function maskUserName(username) {
  if (username.indexOf("0x") === 0) {
    const t = username.split("")
    return t.slice(0, 6).join("") + "****" + t.reverse().slice(0, 4).reverse().join("")
  } else {
    return username
  }
}

export const getParamsFromCurrentUrl = () => {
  const {href} = location
  if (href.indexOf("?") === -1) return {}
  const params = queryString.parse(href.split("?")[1])
  return params || {}
}

export function check_val(val, options) {
  const _val = val === undefined ? "" : val
  const {name, required, min, max, label, ignore_dpl} = options
  if (ignore_dpl) return;
  if (required && ("" + _val).length === 0) {
    throw Error(`${label || name} 不能为空`)
  }
  if (min !== undefined && ("" + _val).length < min) {
    throw Error(`${label || name} 至少 ${min} 位`)
  }
  if (max !== undefined && ("" + _val).length > max) {
    throw Error(`${label || name}  最多 ${max} 位`)
  }
}

/**
 * @deprecated
 * @param key
 * @param isJson
 * @param defaultVal
 * @return {any|string|null}
 */
export function getItemFromSessionStorage(key, isJson = true, defaultVal = null) {
  const item = window.sessionStorage.getItem(key)
  return item ?
    (isJson ? JSON.parse(item) : item) :
    defaultVal
}

/**
 * @deprecated
 * @param key
 */
export function removeItemFromSessionStorage(key) {
  return window.sessionStorage.removeItem(key)
}

/**
 * @deprecated
 * @param key
 * @param value
 */
export function setItemFromSessionStorage(key, value) {
  return window.sessionStorage.setItem(key, value)
}

/**
 * @deprecated
 * @param key
 * @param isJson
 * @param defaultVal
 * @return {any|string|null}
 */
export function getItemFromLocalStorage(key, isJson = true, defaultVal = null) {
  const item = window.localStorage.getItem(key)
  return item ?
    (isJson ? JSON.parse(item) : item) :
    defaultVal
}

/**
 * @deprecated
 * @param key
 */
export function removeItemFromLocalStorage(key) {
  return localStorage.removeItem(key)
}

/**
 * @deprecated
 * @param key
 * @param value
 */
export function setItemFromLocalStorage(key, value) {
  return localStorage.setItem(key, value)
}

export function historyBackAction(historyBackActionFunc) {
  window.__historyBackActionFunc = historyBackActionFunc
}

export function disableHistoryBackAction(disabled) {
  window._disableHistoryBackAction = disabled
}

export function confirmEndActivity(historyBackActionFunc) {
  weui.confirm("确定要退出么？", () => {
    IApp.finish()
  })
}

export function getCurrentDeviceLocation(cb) {
  console.log("getCurrentDeviceLocation ing...")
  if (navigator.geolocation) {
    const loading = weui.loading("获取位置中...")
    navigator.geolocation.getCurrentPosition((position) => {
      loading.hide()
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log("getCurrentDeviceLocation position: ", {lat, lng})
      cb && cb({lat, lng})
    }, (e) => {
      loading.hide()
      console.log("getCurrentDeviceLocation error: ", e)
      cb && cb(null, {error_code: 2, msg: "getCurrentDeviceLocation error"})
    }, {
      timeout: 5000
    });
  } else {
    console.log("navigator.geolocation is null")
    cb && cb(null, {error_code: 1, msg: "navigator.geolocation is null"})
  }
}

export const base64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteArrays = base64ToBuffer(b64Data, sliceSize);
  return bufferToBlob(byteArrays, contentType);
}

export const base64ToBuffer = (b64Data, sliceSize = 512) => {
  const byteCharacters = atob(b64Data.indexOf(",") > 0 ? b64Data.split(',')[1] : b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  if(byteCharacters.length < 512){
    return byteArrays[0]
  }else{
    return byteArrays
  }
}

export function bufferToBlob(byteArrays, type) {
  return new Blob(byteArrays, {type})
}

export function blobToObjectUrl(blob) {
  return URL.createObjectURL(blob)
}

export function blobToBuffer(blob) {
  return new Promise((resolve) => {
    blob.arrayBuffer().then(ab => {
      resolve(abToBuffer(ab))
    })
  })
}

export function blobToBase64(blob, callback) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      callback && callback(dataUrl);
      resolve(dataUrl)
    };
    reader.readAsDataURL(blob);
  })
}

export function setBodyOverflowHidden() {
  document.body.style.overflow = "hidden"
}

export function clearBodyOverflowHidden() {
  document.body.style.overflow = ""
}

export function checkScrolledBottom() {
  return $(window).scrollTop() + document.body.clientHeight === $(".section_page").height()
}

export function diffObject(obj1, obj2, keys) {
  if (!obj1 && !obj2) return false;
  if (obj1 && !obj2) return true;
  if (!obj1 && obj2) return true;
  if (keys) {
    for (let i in keys) {
      const key = keys[i]
      if (key === "_rev") continue
      if (obj1[key] === undefined || obj2[key] === undefined) {
        return key;
      }
      if (typeof obj1[key] === "object") {
        if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          return key;
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          return key
        }
      }
    }
  } else {
    return diffObject(obj1, obj2, Object.keys(obj2))
  }
  return false;
}

export function locationHash(hash, params) {
  if(hash.indexOf("#") === 0){
    hash = hash.substring(1)
  }
  window.location.hash = "#" + hash + getHashParamsStr(params)
}

function getHashParamsStr(params) {
  if (params && Object.keys(params).length > 0) {
    return `?${qs.stringify(params)}`
  } else {
    return ""
  }
}

export function locationHashPost(hash, params, postData) {
  setCache("_locationHashPost.postData_" + hash + getHashParamsStr(params), {postData}, 10)
  locationHash(hash, params || {})
}


export function pageJump(hash,{ params, postData,style}) {
  setCache("_locationHashPost.postData_" + hash + getHashParamsStr(params), {postData,style}, 10)
  locationHash(hash, params || {})
}

export function getLocationHashData(hash) {
  const k = "_locationHashPost.postData_" + hash.replace("#", "")
  const d = getCache(k, null)
  delCache(k)
  return d;
}


export function locationHashReplace(hash, params, replacePage) {
  if (params && Object.keys(params).length > 0) {
    window.__locationHashReplace(`#${hash}?${qs.stringify(params)}`, replacePage)
  } else {
    window.__locationHashReplace("#" + hash, replacePage)
  }
}

export function historyBack(counter) {
  if (window.__historyBack) {
    window.__historyBack(counter)
  } else {
    if (counter && counter > 1) {
      window.history.go(-counter)
    } else {
      window.history.back()
    }
  }
}

export function checkIsLocalDev() {
  return window.location.host.indexOf("3007") > 0
}

export function getPdbAttachNameFromId(_id) {
  return _id.split("_")[1];
}


export function getMediaTypeFromPdbId(_id) {
  const prefix = _id.split("_")[1]
  const suffix = _id.split("_").reverse()[0];
  return `${prefix}/${suffix}`;
}

export function getMediaSrcFromPdb(db, _id, cb, err) {
  db.getAttachment(_id, "attachment").then((blob) => {
    cb && cb(blobToObjectUrl(blob))
  }).catch((e) => {
    err && err(e)
  })
}

export function getMediaSrcFromPdbV1(db, _id) {
  return db.getAttachment(_id, "attachment")
}


export function checkPdbMedia(src) {
  return src && src.indexOf("m_") === 0
}

export function getUploadOptions(type) {
  const constant = getConstant()
  let options;
  if (type.indexOf("audio") === 0) {
    options = constant.common.upload.audio;
  } else if (type.indexOf("video") === 0) {
    options = constant.common.upload.video;
  } else {
    options = constant.common.upload
  }
  let {maxUploadLengthM, allowTypes} = options
  return {
    maxUploadLengthM: maxUploadLengthM,
    allowTypes: allowTypes
  }
}

export function getPermissionFromAccept(accept) {
  if (accept) {
    switch (accept.split("/")[0]) {
      case "audio":
        return "RECORD_AUDIO";
      case "image":
      case "video":
        return "CAMERA";
      default:
        return null
    }
  } else {
    return null
  }
}

export function readUploadFile(file, readerType) {
  return new Promise(((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = ({target}) => {
      let result;
      if (readerType === "readAsDataURL") {
        result = reader.result
      } else {
        result = target.result
      }
      resolve(result)
    };
    switch (readerType) {
      case "readAsDataURL":
        reader.readAsDataURL(file);
        break
      case "readAsArrayBuffer":
        reader.readAsArrayBuffer(file);
        break
      case "readAsText":
        reader.readAsText(file, "UTF-8");
        break
      default:
        reject()
        break
    }
  }))
}

export function beforeUploadRawFile({selector}) {
  return new Promise((resolve) => {
    $(selector).val("").off("change").on("change", ({target}) => {
      const {files} = target;
      resolve(files)
    })
  })
}

export function beforeUploadFile({selector, db, options}) {
  return new Promise((resolve, reject) => {
    const doUpload = () => {
      const {
        maxImageWidth,
        maxImageHeight,
        maxThumbImageHeight,
        maxThumbImageWidth,
        maxUploadLengthM,
        allowTypes,
        maxUploadFile,
        fileUploadedNum,
        thumbImageQuality,
        imageQuality
      } = options || {
        thumbImageQuality: 0.6,
        imageQuality: 0.8,
        maxImageWidth: 1600,
        maxImageHeight: 1600,
        maxThumbImageHeight: 600,
        maxThumbImageWidth: 1600,
      };
      $(selector).val("").off("change").on("change", ({target}) => {
        const {files} = target;
        for (let i = 0, len = files.length; i < len; ++i) {
          if (fileUploadedNum && maxUploadFile <= fileUploadedNum()) {
            return weui.topTips("超过最大上传数量限制")
          }
          const file = files[i];
          if (file.size > 1024 * 1024 * maxUploadLengthM) {
            return weui.topTips(`文件大小超过最大上传限制: ${maxUploadLengthM}m`)
          }
          let flag = false
          for (let i in allowTypes) {
            const allowType = allowTypes[i]
            if (allowType.split("/")[1] === "*") {
              flag = true;
              if (allowType.split("/")[0] !== file.type.split("/")[0]) {
                return weui.topTips(`文件类型有误`)
              }
              break;
            }
          }
          if (!flag) {
            if (allowTypes.indexOf(file.type) === -1) {
              return weui.topTips(`文件类型有误`)
            }
          }
          const type = file.type
          let reader = new FileReader();
          globalLoading("Loading...")
          reader.onload = ({target}) => {
            const {result} = target
            let blob = new Blob([new Uint8Array(result)], {type});
            if (file.type.indexOf("image") === 0) {
              compressImage(blob, {
                quality: imageQuality,
                maxWidth: maxImageWidth,
                maxHeight: maxImageHeight
              }).then(({blob, w, h}) => {
                const doc_id = getUploadFilePdbId({
                  name: file.name,
                  type: file.type,
                  size: blob.size,
                  width: w,
                  height: h
                })
                saveMediaToPdb(db, doc_id, blob, type).then(() => {
                  resolve({doc_id, blob, file})
                }).catch(reject)
              })
            } else if (file.type.indexOf("video") === 0) {
              const blobVideo = blob
              getVideoFirstFrame({
                src: blobToObjectUrl(blobVideo)
              }).then((dataUri) => {
                compressImage(dataURItoBlob(dataUri), {
                  quality: thumbImageQuality,
                  maxWidth: maxThumbImageWidth,
                  maxHeight: maxThumbImageHeight
                }).then(({blob, w, h}) => {
                  const thumbBlob = blob
                  const video_doc_id = getUploadFilePdbId({
                    name: file.name,
                    size: blobVideo.size,
                    type: file.type,
                    width: w,
                    height: h
                  })
                  const video_thumb_doc_id = getUploadFilePdbId({
                    name: file.name,
                    size: thumbBlob.size,
                    type: thumbBlob.type,
                    width: w,
                    height: h
                  })
                  saveMediaToPdb(db, video_doc_id, blobVideo, file.type).then(() => {
                    saveMediaToPdb(getImagePDb(), video_thumb_doc_id, thumbBlob, thumbBlob.type).then(() => {
                      resolve({
                        doc_id: video_doc_id,
                        blob: blobVideo,
                        thumb_doc_id: video_thumb_doc_id,
                        thumb_blob: thumbBlob,
                        file
                      })
                    }).catch(reject)
                  }).catch(reject)
                })
              })
            } else {
              const doc_id = getUploadFilePdbId(file)
              saveMediaToPdb(db, doc_id, blob, type).then(() => {
                resolve({doc_id, blob, file})
              }).catch(reject)
            }
          };
          reader.readAsArrayBuffer(file);
        }
      })
    }

    if ($(selector).attr("capture") && IApp.checkIApp()) {
      const permission = getPermissionFromAccept($(selector).attr("accept"))
      if (permission) {
        IApp.checkPermission(permission).then(() => {
          doUpload()
        })
      } else {
        doUpload()
      }
    } else {
      doUpload()
    }
  })
}

export function saveMediaToPdb(db, doc_id, blob, type) {
  return new Promise((resolve, reject) => {
    db.get(doc_id).then((doc) => {
      // _debug("saveMediaToPdb1", doc)
      resolve({
        doc_id,
        doc_rev: doc.rev || doc._rev,
      })
    }).catch((err) => {
      const {status} = err;
      if (status && status === 404) {
        db.put({
          _id: doc_id,
          timestamp: Date.now(),
        }).then((doc) => {
          return db.putAttachment(
            doc_id,
            "attachment",
            doc.rev,
            blob,
            type
          );
        }).then((doc) => {
          resolve({
            doc_id,
            doc_rev: doc.rev || doc._rev,
          })
        }).catch((err) => {
          console.error(err)
        })
      } else {
        reject(err)
      }
    })
  })
}

export function notifyMsg(message, {duration}) {
  dispatchStore("global", "addSnackbar", {
    message, duration
  })
}

export function insertDom(container_tag, tag, path, content) {
  //console.log(content)
  const type = tag === "script" ? 'text/javascript' : "text/css"
  const obj = document.createElement(tag);
  obj.type = type;
  if (tag === "link") {
    obj.rel = "stylesheet";
    if (path) obj.href = path;
  }
  if (tag === "script" && path) {
    obj.src = path
    obj.async = true
  }

  if (content) {
    obj.innerHTML = content;
  }
  document[container_tag].appendChild(obj);
}


export function calcHeight(offsetHeight) {
  return `calc(100vh - ${offsetHeight}px)`
}

export function calcWidth(offsetHeight) {
  return `calc(100vw - ${offsetHeight}px)`
}

export function getAppStatusBarHeight() {
  return IApp.checkNotIApp() ? 0 : config.ui.AppStatusBarHeight;
}

export function getSubCatsViewHeight() {
  return config.ui.SubCatsViewHeight;
}

export function getAppBarHeight() {
  return config.ui.WeAppBarHeight;
}

export function getChatStatusBarHeight() {
  return config.ui.ChatStatusBarHeight;
}

export function getTabAppBarHeight() {
  if (0 && document.body.clientWidth >= config.ui.AppMaxWidth) {
    return 0;
  } else {
    return config.ui.HomeTabBarHeight;
  }
}

export function getHomeTabBarHeight() {
  return config.ui.HomeTabBarHeight;
}

export function checkSupportTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0
}

export function getAppMaxWidth() {
  return config.ui.AppMaxWidth;
}

export function checkInPad() {
  return config.ui.AppMaxWidth <= document.body.clientWidth
}


export function getMsgFooterBarHeight() {
  return config.ui.MsgFooterBarHeight;
}

export function getPageFooterHeight() {
  return config.ui.PageFooterHeight;
}

export function getMessageExtensionPanelHeight() {
  return config.ui.MessageExtensionPanelHeight;
}

export function getAllDocFromPdb(pdb, id_prefix, cb, err) {
  const options = {
    include_docs: true,
    ...getPdbAllDocStartOptions(id_prefix)
  }
  pdb.allDocs(options).then(({rows, total_rows, offset}) => {
    _debug("getAllDocFromPdb ok", {id_prefix, total_rows, offset})
    cb && cb(rows.map(row => row.doc))
  }).catch(console.error)
}

export function getPdbAllDocStartOptions(idPrefix) {
  if (!idPrefix) return {};
  return {
    startkey: `${idPrefix}_`,
    endkey: `${idPrefix}_\ufff0`
  }
}

export function getPdbAllDocStartOptionsV1({startKey, includeDocs, ...options}) {
  return {
    startkey: `${startKey}_`,
    endkey: `${startKey}_\ufff0`,
    include_docs: !!includeDocs,
    ...options
  }
}


export function getAllDocFromPdbV1({pdb, idPrefix, options}) {
  return new Promise((resolve, reject) => {
    const options_ = {
      include_docs: true,
      ...getPdbAllDocStartOptions(idPrefix),
      ...options
    }
    pdb['allDocs'](options_).then(({rows}) => {
      if (options_.include_docs) {
        resolve(rows.map(row => row.doc))
      } else {
        resolve(rows.map(row => row.id))
      }
    }).catch(reject)
  })
}

export function loadRowsFromPdb({db, options}) {
  return new Promise((resolve, reject) => {
    db.allDocs({
      include_docs: true,
      ...options
    }).then(({rows, total_rows, offset}) => {
      resolve({
        rows: rows.map(row => row.doc),
        total_rows,
        offset
      })
    }).catch(reject)
  })
}

export function getPdbId({id_prefix, row_id}) {
  return `${id_prefix}_${row_id}`;
}

export function pdbRemove(pdb, id_prefix, row_id) {
  const _id = getPdbId({id_prefix, row_id});
  return pdb.get(_id).then((doc) => {
    return pdb.remove(doc)
  })
}

export function addOrUpdateRowToPdb(pdb, id_prefix, row_id, row, cb, err) {
  const _id = getPdbId({id_prefix, row_id});
  const debug = "";
  pdb.get(_id).then((doc) => {
    const diffKey = diffObject(row, doc, Object.keys(row))
    if (diffKey) {
      const updateDoc = {
        ...doc,
        ...row,
        _id,
      }
      //_debug("addOrUpdateRowToPdb update is diff,", debug, "diffKey:", diffKey,"origin doc:", doc,"update doc:", updateDoc)
      return pdb.put(updateDoc)
    } else {
      //_debug("addOrUpdateRowToPdb update is not diff,", debug, doc, row)
      return doc
    }
  }).then((doc) => {
    cb && cb(doc)
  }).catch((error) => {
    const {status} = error
    if (status === 404) {
      //_debug("addOrUpdateRowToPdb add ", debug, row)
      const {_rev, ...other} = row
      pdb.put({
        ...other,
        _id,
      }).then((doc) => {
        //_debug("addOrUpdateRowToPdb add ok", debug, doc)
        //console.log("add ok",doc)
        cb && cb(doc)
      }).catch((error) => {
        if (error.status === 409 && error.error) {
          setTimeout(() => {
            const i = parseInt(getCache(_id, 1))
            if (i < 5) {
              setCache(_id, i + 1, 10)
              addOrUpdateRowToPdb(pdb, id_prefix, row_id, row, cb, err)
            }
          }, 200)
        } else {
          console.error(error, debug, "addOrUpdateRowToPdb add error", id_prefix, row_id, row)
          err && err(error)
        }
      })
    } else {
      console.error(error, debug, "addOrUpdateRowToPdb update error", id_prefix, row_id, row)
    }

  })
}

export function setGlobalAuthUser(user) {
  BDAuth.setGlobalUser(user)
}

export function removeGlobalAuthUser() {
  BDAuth.removeGlobalAuthUser()
}

/**
 * @deprecated
 * @return {null|*}
 */
export function getGlobalAuthUserId() {
  return BDAuth.getGlobalAuthUserId()
}

export const showPageGlobalLoading = (visible) => {
  const dom = document.querySelector(".bd_loading");
  if (dom) document.querySelector(".bd_loading").style.display = visible ? "block" : "none"
}

/**
 * @deprecated
 * @return {any | null | string}
 */
export function getGlobalUser() {
  return BDAuth.getGlobalUser();
}

export function globalLoading(text) {
  if (window.__globalLoading) {
    $(".weui-toast__content").html(text)
  } else {
    window.__globalLoading = weui.loading(text || "加载中...", {
      statusBarNotChangeColor: true
    })
  }
  if (window.__timeoutId) {
    clearTimeout(window.__timeoutId)
  }
  window.__timeoutId = setTimeout(() => {
    globalLoadingHide()
  }, 1000 * 220)
}

export function globalLoadingHide() {
  if (window.__globalLoading) {
    window.__globalLoading.hide();
    window.__globalLoading = null
  }
}

export function getAppConfig() {
  return config;
}

export function showToast(msg, options) {
  weui.toast(msg, options)
}


export function _debugToast(msg, options) {
  _debug(msg)
  if (BDApp.isDebug()) {
    if (IApp.checkNotIApp()) {
      weui.toast(msg, {
        ...options,
        useMask: false,
        hideIcon: true
      })
    } else {
      IApp.toast(msg)
    }
  }
}

export function updateApp() {
  globalLoading("更新中...")
  BDApp.checkUpdate(() => {
  })
}

export function isStrContainChinese(str) {
  return /.*[\u4e00-\u9fa5]+.*/.test(str);
}

export function showToastText(msg, options) {
  const {debug, ..._options} = options || {}
  if (IApp.isDebug() && debug) {
    _debugToast(msg + " " + debug)
  } else {
    weui.toast(msg, {
      ..._options,
      useMask: false,
      hideIcon: true
    })
  }
}


export function showDialog(content) {
  weui.dialog({
    content
  })
}

export function showTopTips(msg, options) {
  const {detail, ...options_} = options || {};
  setStoreState("global", {
    sysError: {
      msg, detail: detail
    },
  })
  globalLoadingHide()
  weui.topTips(msg, options_)
}

export function showImagePreview(src) {
  setStoreState("global", {
    showImagePreview: src
  })
  disableHistoryBackAction(true)
  setBodyOverflowHidden()
  onChangeStatusBarBgColor();
}

export function showVidePreview(src) {
  setStoreState("global", {
    showVideoPreview: src
  })
  disableHistoryBackAction(true)
  setBodyOverflowHidden()
  onChangeStatusBarBgColor();
}


export function showGallery(src) {
  disableHistoryBackAction(true)
  window.$(".galleryImg").attr("style", "background-image:url('" + src + "')");
  setBodyOverflowHidden()
  onChangeStatusBarBgColor();
  window.$(".weui-gallery").fadeIn(100);
}

export const sortObjectList = (rows, key, desc) => {
  return rows.sort((a, b) => {
    if (desc) {
      return b[key] - a[key]
    } else {
      return a[key] - b[key]
    }
  })
}

export function getWeui() {
  return weui;
}

function getLogStackTrace() {
  const obj = {};
  const res = ""
  try {
    Error.captureStackTrace(obj, getLogStackTrace);
    if (obj && obj.stack) {
      const lines = obj.stack.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.trim() !== "Error" && line.trim().indexOf("at _debug") === -1) {
          return line.trim().split(" (")[0]
        }
      }
    }
  } catch (e) {
  }
  return res;
}

export const _trace = function () {
  if (IApp.isDebug()) {
    console.trace(`=>  ${new Date().Format("hh:mm:ss")}【app】trace : `, ...arguments)
  }
}
export const _debug = function () {
  if (IApp.isDebug()) {
    let args;
    if (IApp.checkIApp()) {
      args = [];
      if (arguments.length > 0) {
        [...arguments].forEach(r => {
          if (typeof r === "object") {
            try{
              args.push(JSON.stringify(r))
            }catch (e){

            }
          } else {
            args.push(r)
          }
        })
      }
      // if(args.length > 0) args = JSON.stringify(args)
    } else {
      args = arguments
    }
    console.log(
      `📘=>> ${new Date().Format("hh:mm:ss")}【app】debug : 【 `, ...args, " 】 ",
      getLogStackTrace()
    )
  }
}
export const _log = function () {
  console.log(`📗=>>> ${new Date().Format("hh:mm:ss")}【app】info : `, ...arguments)
}

export const _error = function (...args) {
  globalLoadingHide()
  let err;
  if (args.length > 1) {
    if (typeof args[0] === "function") {
      args[0]();
      args.shift()
    }
  }
  err = args.shift()
  let data = ""

  if (typeof err === 'object') {
    const {message, msg, showMsg, ...e} = err
    if (showMsg) {
      if (message) showTopTips(message)
      if (msg) showTopTips(msg)
    }
    if (message !== undefined) {
      data += " " + message + ","
    }
    if (msg !== undefined) {
      data += " " + msg + ","
    }
    if (e && Object.keys(e).length > 0) {
      data += " " + JSON.stringify(e)
    }
  } else {
    data = err
  }
  let _args = []
  if (IApp.checkIApp()) {
    if (args.length > 0) {
      [...args].forEach(r => {
        if (typeof r === "object") {
          _args.push(JSON.stringify(r))
        } else {
          _args.push(r)
        }
      })
    }
  } else {
    _args = args
  }
  console.log(args.stack)
  console.error(`📕=>>>> ${new Date().Format("hh:mm:ss")}【app】error : >>> ` + data, ..._args, ' <<<');
}

export function setAfterWindowResize(id, func) {
  if (!window.__afterWindowResize)
    window.__afterWindowResize = {}
  window.__afterWindowResize[id] = func
}

function onWindowResize() {
  const clientHeight = document.body.clientHeight;
  const clientWidth = document.body.clientWidth;
  setStoreState("global", {
    clientHeight,
    clientWidth,
    isPad: false//document.body.clientWidth >= getAppMaxWidth()
  })
  setTimeout(() => {
    runAfterWindowResize({clientHeight,clientWidth})
  }, 100)
}

export function unRegOnWindowResize() {
  window.__afterWindowResize = {}
  window.removeEventListener("resize", onWindowResize)
}

export function regOnWindowResize() {
  window.__afterWindowResize = {}
  window.addEventListener("resize", onWindowResize);
}

export function runAfterWindowResize(options) {
  if (window.__afterWindowResize) {
    Object.keys(window.__afterWindowResize).forEach(((key) => {
      if (window.__afterWindowResize[key]) {
        window.__afterWindowResize[key](options)
      }
    }))
  }
}

export function parseGeo(value) {
  if (value && value.length > 0 && value.indexOf(",") > 0) {
    const [lat, lng] = value.split(",")
    window.__cache_geo_input_page = {lat, lng, zoom: 16}
    return window.__cache_geo_input_page
  } else {
    if (window.__cache_geo_input_page) {
      return window.__cache_geo_input_page
    } else {
      const {map} = getConstant();
      const {area} = map;
      const {x, y, z} = area['default'].c
      return {zoom: z, lat: y, lng: x}
    }
  }
}

export function getFieldValue(row, field_name, children) {
  if (children) {
    const f = children.split(",")
    try {
      let val0 = row[f[0]];
      let val1 = row[f[1]];
      let val = "";
      if (val0) {
        val = val0
      }
      if (val0 && val1) {
        val = `${val0},${val1}`
      }
      return val;
    } catch (e) {
      return ""
    }
  } else {
    return row[field_name] || ""
  }
}

export function getCategoryVal(doc) {
  let geo = null;
  if (doc.cat && doc.subCat) {
    geo = `${doc.cat},${doc.subCat}`
  }
  return geo;
}

export function getGeoVal(doc) {
  let geo = null;
  if (doc.lat && doc.lng) {
    geo = `${doc.lat},${doc.lng}`
  }
  return geo;
}

export function mapFlyTo({map, lng, lat, marker}) {
  map.flyTo([lat, lng]);
  if (marker) {
    marker.setLatLng({lat, lng})
  }
}

//downloadFileToHard("hello.txt","This is the content of my file :)");
/**
 *
 * downloadFileToHard
 *
 downloadFileToHard("hello.txt",{
    type:"text",
    content:"This is the content of my file :)"
});

 * @param filename
 * @param content
 * @param url
 * @param type
 */
export function downloadFileToHard(filename, {content, type, url}) {
  var element = document.createElement('a');
  let href = url
  if (type === 'text') {
    href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  }
  element.setAttribute('href', href);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  element._target = "_blank"
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function bufferToHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).toUpperCase().slice(-2);
  }).join('')
}

// Parse the supplied JSON, or return null if parsing fails.
export function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Error parsing json: ' + json);
  }
  return null;
}


export function onChangeInput(obj, key, {target}) {
  this.setState({
    [key]: target.value ? target.value.trim() : ""
  })
}

export function getAudioDuration(src) {
  let audio = document.createElement('audio') //生成一个audio元素
  audio.src = src //音乐的路径
  audio.addEventListener("canplay", function () {
    console.log(parseInt(audio.duration));
  });
}


export function isMediaType(type) {
  return type && ["image", 'audio', "video"].indexOf(type.split("/")[0]) > -1
}
export function isMobileNoSsl(){
  return window.location.protocol.indexOf("http:") === 0 && navigator.userAgent.toLowerCase().indexOf("mobile") > -1
}
