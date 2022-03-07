import {getVideosPDb} from "./pdb";
import {base64ToBlob, blobToObjectUrl, checkPdbMedia, getMediaSrcFromPdb} from "./common";
import {dataURItoBuffer, detectVerticalSquash, getOrientation, orientationHelper} from "../weui-js/uploader/image";
import {getMediaSrcFromServer} from "./upload";

/**
 * 压缩图片
 */
export function compressImage(blob, options) {
  const {maxWidth, quality, maxHeight} = options || {}
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const _options = {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 1
      }
      const img = new Image();
      img.onload = () => {
        const type = img.src.split(";")[0].split(":")[1]
        const maxW = maxWidth || _options.maxWidth;
        const maxH = maxHeight || _options.maxHeight;
        let w = img.width;
        let h = img.height;
        //png 压缩效果不明显
        if (!/image\/jpeg/.test(type) && !/image\/jpg/.test(type)) {
          if (!(w > maxW || h > maxH)) {//不超过最大宽高
            return resolve({blob, w, h});
          }
        }
        let dataURL;
        const ratio = detectVerticalSquash(img);
        const orientation = getOrientation(dataURItoBuffer(img.src));
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (w < h && h > maxH) {
          w = parseInt(maxH * img.width / img.height);
          h = maxH;
        } else if (w >= h && w > maxW) {
          h = parseInt(maxW * img.height / img.width);
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;

        if (orientation > 0) {
          orientationHelper(canvas, ctx, orientation);
        }
        ctx.drawImage(img, 0, 0, w, h / ratio);
        if (/image\/jpeg/.test(type) || /image\/jpg/.test(type)) {
          dataURL = canvas.toDataURL('image/jpeg', quality || _options.quality);
        } else {
          dataURL = canvas.toDataURL(type);
        }
        resolve({blob: base64ToBlob(dataURL, type), w, h});
      };
      img.src = evt.target.result;
    }
    reader.readAsDataURL(blob);
  })
}


export function getBlobImageWidthHeight(blob) {
  return getImageWidthHeight(blobToObjectUrl(blob))
}

export function getImageWidthHeight(imgSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      let w = img.width;
      let h = img.height;
      resolve({w, h})
    };
    img.src = imgSrc;
  })
}

export function getVideoFirstFrame({src, type, quality}) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      video.currentTime = 0
    }
    video.onseeked = () => {
      // delay the drawImage call, otherwise we get an empty canvas on iOS
      // see https://stackoverflow.com/questions/44145740/how-does-double-requestanimationframe-work
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          canvas.height = video.videoHeight
          canvas.width = video.videoWidth
          canvas
            .getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height)
          const src = canvas.toDataURL(type || 'image/jpeg', quality || 1)
          resolve(src)
        })
      })
    }

    video.onerror = () => {
      reject(video.error)
    }
    if (checkPdbMedia(src)) {
      const db = getVideosPDb()
      getMediaSrcFromPdb(db, src, (src) => {
        video.src = src
        video.load()
      }, () => {
        const _id = src;
        getMediaSrcFromServer(_id, (data) => {
          // const type = _id.split("_").reverse()[0];
          video.src = data.indexOf("base64,") > 1 ? data.split("base64,")[1] : data
          video.load()
        })
      })
    } else {
      video.src = src
      video.load()
    }
  })
}
export function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
  const {width,height} =crop
  return new Promise((resolve) => {
    canvas.toBlob(blob => {
      resolve({blob,width,height});
    }, 'image/jpeg', 1);
  });
}

