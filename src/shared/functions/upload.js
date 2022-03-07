import upload from "../weui-js/uploader/upload";
import {_debug,  blobToBase64, blobToObjectUrl, readUploadFile, saveMediaToPdb} from "./common";
import {md5} from "shared/functions/crypto";
import {compressImage, getVideoFirstFrame} from "./image";
import axios from "axios";
import BDConstant from "../BD/BDConstant";
import {getAudiosPDb, getImagePDb, getVideosPDb} from "./pdb";
import {dataURItoBlob} from "../weui-js/uploader/image";
import BDAuth from "../BD/BDAuth";
import BDClient from "../BD/BDClient";

let __upload_id = 0;

export function getUploadFilePdbId(options) {
  let {name, type, duration, width, height, size} = options
  if(width){
    width = Math.floor(width)
  }else{
    width=""
  }
  if(height){
    height = Math.floor(height)
  }else{
    height=""
  }

  if(duration){
    duration = Math.floor(duration * 1000)
  }else{
    duration=""
  }

  const [fileType, fileSuffix] = type.split("/")
  return `m_${fileType}_${md5(name + size + type)}_${size}_${width}_${height}_${duration}_${fileSuffix}`
}

export function parseMediaUrlByPdbId(doc_id) {
  const t = doc_id.split("_")
  return {
    cat: t[1],
    id: t[2],
    size: t[3] ? parseInt(t[3]) : 0,
    width: t[4] ? parseInt(t[4]) : 0,
    height: t[5] ? parseInt(t[5]) : 0,
    duration: t[6] ? parseInt(t[6]) : 0,
    type: t[7],
  }
}

export function getMediaUploadApi() {
  return BDConstant.server("upload")['upload_api']
}

export function getMediaUrlByPdbId(doc_id) {
  // const {common} = getConstant()
  //${common.upload.upload_url}/
  const d0 = doc_id.split("_")[1]
  const t = doc_id.split("_")[2]
  const suffix = doc_id.split("_")[3]
  const d1 = t.substring(0, 1)
  const d2 = t.substring(1, 3)
  const d3 = t.substring(3, 6)
  return `${d0}/${d1}/${d2}/${d3}/${doc_id.replace("_" + suffix, "")}.${suffix}`
}

export function getMediaSrcFromServer(_id, cb, err) {
  axios.post(BDConstant.server("upload")['media_fetch_api'], {data: {doc_id: _id}}, {
    responseType: "blob",
  }).then(({data}) => {
    if (data.type === "text/html") {
      // _debugToast("404")
      err && err({message: "404"})
    } else {
      cb && cb(data)
    }
  }).catch((error) => {
    console.error(error)
    err && err(error)
  })
}

export function noop() {
}

export function onUploadFile({url, files, ..._options}) {
  return new Promise((resolve, reject) => {
    // if (!BDMsgServer.isConnected()) {
    //   return reject({code: 500, message: "not connect server"})
    // }
    const clearFileStatus = (file) => {
      // _debug("clearFileStatus", file.id)
    }

    function setUploadFile(file) {
      // _debug("setUploadFile", file.id)
      if (file.blob) {
        file.url = URL.createObjectURL(file.blob);
      }

      file.status = 'ready';
      file.upload = function () {
        upload({
          file: file,
          ...options
        });
      };
      file.stop = function () {
        this.xhr.abort();
      };
      options.onQueued(file);
      if (options.auto) file.upload();
    }

    const options = {
      url: url || getMediaUploadApi(),
      auto: true,
      type: 'file',
      fileVal: 'file',
      xhrFields: {},
      params: {},
      onBeforeQueued: noop,
      onQueued: noop,
      onBeforeSend: noop,
      onSuccess: noop,
      onProgress: noop,
      onError: noop,
      ..._options
    };
    if (options.compress !== false) {
      options.compress = {
        width: 1600,
        height: 1600,
        quality: .9,
        ...(typeof options.compress === 'object' ? options.compress : {})
      }
    }
    if (options.onBeforeQueued) {
      const onBeforeQueued = options.onBeforeQueued;
      options.onBeforeQueued = function (file, files) {
        const ret = onBeforeQueued.call(file, files);
        if (ret === false) {
          return false;
        }
        if (ret === true) {
          return true;
        }
      };
    }
    if (options.onQueued) {
      const onQueued = options.onQueued;
      options.onQueued = function (file) {
        // _debug("onQueued", file.id)
        if (!onQueued.call(file)) {
          if (!options.auto) {
            clearFileStatus(file);
          }
        }
      };
    }

    if (options.onBeforeSend) {
      const onBeforeSend = options.onBeforeSend;
      options.onBeforeSend = function (file, data, headers) {
        // _debug("onBeforeSend", file.id, headers)
        const ret = onBeforeSend.call(file, data, headers);
        if (ret === false) {
          return false;
        }
      };
    }
    if (options.onSuccess) {
      const onSuccess = options.onSuccess;
      options.onSuccess = function (file, ret) {
        file.status = 'success';
        if (!onSuccess.call(file, ret)) {
          clearFileStatus(file);
          // _debug("onSuccess", file.id)
        }
        resolve(ret)
      };
    }
    if (options.onProgress) {
      const onProgress = options.onProgress;
      options.onProgress = function (file, percent) {
        if (!onProgress.call(file, percent)) {
          // _debug("_onProgress", file.id, percent)
        }
      };
    }
    if (options.onError) {
      const onError = options.onError;
      options.onError = function (file, err) {
        file.status = 'fail';
        if (!onError.call(file, err)) {
          _debug("onError", file.id, err)
        }
        reject(err)
      };
    }

    if (options.compress === false) {
      // 以原文件方式上传
      Array.prototype.forEach.call(files, (file) => {
        file.id = ++__upload_id;
        if (options.onBeforeQueued(file, files) === false) return;
        setUploadFile(file);
      });
    } else {
      // base64上传 和 压缩上传
      Array.prototype.forEach.call(files, (file) => {
        file.id = ++__upload_id;
        if (options.onBeforeQueued(file, files) === false) return;
        if (file.type.indexOf("image") === 0 && /image\/jpeg/.test(file.type) && /image\/jpg/.test(file.type)) {
          compressImage(file, options).then(({blob}) => {
            blob.id = file.id;
            blob.name = file.name;
            blob.lastModified = file.lastModified;
            blob.lastModifiedDate = file.lastModifiedDate;
            setUploadFile(blob);
          });
        } else {
          setUploadFile(file);
        }
      });
    }
  })
}

export async function onHandleUploadFile(file){
  const {size, type, name} = file
  const {maxUploadLengthM} = BDConstant.common("upload")
  if (size > 1024 * 1024 * maxUploadLengthM) {
    return Promise.reject({message: `文件大小超过最大上传限制: ${maxUploadLengthM}m`})
  }
  try {
    const result = await readUploadFile(file, "readAsArrayBuffer")
    let blobOrigin = new Blob([new Uint8Array(result)], {type});
    let db;
    const fileCat = type.split("/")[0]
    const options = {
      thumbImageQuality: 0.6,
      imageQuality: 0.8,
      maxImageWidth: 1600,
      maxImageHeight: 1600,
      maxThumbImageHeight: 600,
      maxThumbImageWidth: 1600,
    }
    let doc_id, blob, thumb_doc_id, thumbBlob,width,height;
    switch (fileCat) {
      case "image":
        const compressFile = await compressImage(blobOrigin, {
          quality: options.imageQuality,
          maxWidth: options.maxImageWidth,
          maxHeight: options.maxImageHeight
        })
        width = compressFile.w
        height = compressFile.h
        blob = compressFile.blob;
        doc_id = getUploadFilePdbId({
          name,
          type,
          width,
          height,
          size: blob.size,
        })

        db = getImagePDb();
        break;
      case "audio":
        blob = blobOrigin
        db = getAudiosPDb();
        doc_id = getUploadFilePdbId(file)
        break;
      case "video":
        blob = blobOrigin
        const dataUri = await getVideoFirstFrame({
          src: blobToObjectUrl(blobOrigin)
        })
        const compressVideoFirstImageFile = await compressImage(dataURItoBlob(dataUri), {
          quality: options.thumbImageQuality,
          maxWidth: options.maxThumbImageWidth,
          maxHeight: options.maxThumbImageHeight
        })

        width = compressVideoFirstImageFile.w
        height = compressVideoFirstImageFile.h
        thumbBlob = compressVideoFirstImageFile.blob
        doc_id = getUploadFilePdbId({
          name: name,
          size: blobOrigin.size,
          type: type,
          width,
          height
        })
        thumb_doc_id = getUploadFilePdbId({
          name: file.name,
          size: thumbBlob.size,
          type: thumbBlob.type,
          width: compressVideoFirstImageFile.w,
          height: compressVideoFirstImageFile.h
        })
        try {
          await saveMediaToPdb(getImagePDb(), thumb_doc_id, thumbBlob, thumbBlob.type)
        } catch (e) {
          console.error(e)
          return Promise.reject({message: "保存视频缩略图失败！"})
        }
        db = getVideosPDb();
        break
      default:
        return Promise.reject({message: "上传错误"})
    }
    try {
      await saveMediaToPdb(db, doc_id, blob, type)
    } catch (e) {
      console.error(e)
      return Promise.reject({message: "保存失败"})
    }
    return Promise.resolve({blob, thumbBlob, doc_id, thumb_doc_id,width,height})
  } catch (e) {
    return Promise.reject({message: `上传失败`})
  }
}

export async function onUploadBobToRemote({doc_id, blob, compress}) {
  const base64 = await blobToBase64(blob)
  await onUploadFile({
    compress: compress || false,
    params: {
      doc_id,
      user_id: BDAuth.getGlobalAuthUserId(),
      pub_key:BDClient.getRsaPubKey()
    },
    files: [
      {
        name: doc_id,
        size: blob.size,
        type: blob.type,
        base64,
      }
    ]
  })
}
