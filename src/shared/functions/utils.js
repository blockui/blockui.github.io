
export const appBridge = () => {
  if (checkAppBridge()) return window.IApp
  else throw new Error("can not invoke bridge object: IApp")
}

export function isMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

export const checkAppBridge = () => {
  return window['IApp'] !== undefined
}

export function getCurrentTimeStamp(sec) {
  if (sec) {
    return Math.floor(+(new Date()) / 1000);
  } else {
    return +(new Date());
  }
}

export function getImageExtraData({width, height}) {
  let extra;
  let proportion;
  let proportionType
  if (width < height) {
    proportionType = 0
    proportion = zeroFill(Math.round(100 * width / height), 2)
    extra = zeroFill(width, 4) + "" + proportionType + "" + proportion
  } else {
    proportionType = 1
    proportion = zeroFill(Math.round(100 * height / width), 2)
    if (proportion === "100") {
      proportion = "00"
    }
    extra = zeroFill(width, 4) + "" + proportionType + "" + proportion
  }
  return extra;
}


export function parseImageExtraFromMsgContent(msgContent) {
  return msgContent.substring(2, 9)
}

export function parseImageExtraData(extra) {
  const width = parseInt(extra.substring(0, 4))
  let height;
  const proportionType = parseInt(extra.substring(4, 5))
  const proportion = parseInt(extra.substring(5)) / 100
  if (proportion === 0) {
    height = width
  } else {
    if (proportionType === 1) {
      height = Math.round(width * proportion)
    } else {
      height = Math.round(width / proportion)
    }
  }

  return {
    width, height, proportion, proportionType
  }
}


export function zeroFill(str, len) {
  str = "" + str
  if (str.length < len) {
    str = "0".repeat(len - str.length) + str
  }
  return str
}

export function parseMsgImageWidthHeight(extra,{appMaxWidth,clientWidth,clientHeight}){
  let {width, height,proportionType,proportion} = parseImageExtraData(extra)

  const clientWidth_ = (clientWidth > appMaxWidth ? appMaxWidth : clientWidth)
  const maxWidth = clientWidth_ * 0.7 - 24;
  if (width > maxWidth) {
    height = height * (maxWidth / width)
    width = maxWidth
  }
  if(clientHeight * 0.6 < height){
    height = clientHeight * 0.6
    if (proportionType === 1) {
      width = Math.round(height / proportion)
    } else {
      width = Math.round(height * proportion)
    }
  }
  return {width, height}
}

export function parseMsgExtraFromContent(content) {
  return content.substring(2, 9)
}

export function compareVersion(beforeVersion, laterVersion) {
  const b = beforeVersion.split(".")
  const l = laterVersion.split(".")
  if (parseInt(b[0]) < parseInt(l[0])) {
    return true;
  }
  if (parseInt(b[1]) < parseInt(l[1])) {
    return true;
  }
  return parseInt(b[2]) < parseInt(l[2]);
}
