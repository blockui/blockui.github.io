import StorageHelper from "../BD/helper/StorageHelper";

window.pDbs = {}
//
// const cleanUnUseDb = () => {
//
// }
/**
 *
 * @param key
 * @returns {PouchDB}
 */
export const getPDb = (key) => {
  if (window.pDbs[key]) {
    return window.pDbs[key];
  } else {
    return new window.PouchDB(key)
  }
}

export const getFriendsPDb = () => {
  return StorageHelper.getPdbByNamespace("friend")
}

export const getSessionsPDb = () => {
  return StorageHelper.getPdbByNamespace("session")
}

export const getMessagesPDb = () => {
  return StorageHelper.getPdbByNamespace("message")
}

export const getGroupsPDb = () => {
  return StorageHelper.getPdbByNamespace("group")
}

export const getShopsPDb = () => {
  return StorageHelper.getPdbByNamespace("show")
}

export const getMarksPDb = () => {
  return StorageHelper.getPdbByNamespace("mark")
}

export const getFavorsPDb = () => {
  return StorageHelper.getPdbByNamespace("favor")
}

export const getAddressesPDb = () => {
  return StorageHelper.getPdbByNamespace("address")
}

export const getChancesPDb = () => {
  return StorageHelper.getPdbByNamespace("change")
}

export const getImagePDb = () => {
  return StorageHelper.getPdbByNamespace("image")
}

export const getAudiosPDb = () => {
  return StorageHelper.getPdbByNamespace("audio")
}

export const getVideosPDb = () => {
  return StorageHelper.getPdbByNamespace("video")
}
