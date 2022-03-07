function getCurrentTimeStamp() {
  return +(new Date());
}

export function getItemFromSessionStorage(key, isJson = true, defaultVal = null) {
  const item = window.sessionStorage.getItem(key)
  return item ?
    (isJson ? JSON.parse(item) : item) :
    defaultVal
}

export function removeItemFromSessionStorage(key) {
  return window.sessionStorage.removeItem(key)
}

export function setItemFromSessionStorage(key, value) {
  return window.sessionStorage.setItem(key, value)
}

export function getItemFromLocalStorage(key, isJson = true, defaultVal = null) {
  const item = window.localStorage.getItem(key)
  return item ?
    (isJson ? JSON.parse(item) : item) :
    defaultVal
}

export function removeItemFromLocalStorage(key) {
  return window.localStorage.removeItem(key)
}

export function setItemFromLocalStorage(key, value) {
  return window.localStorage.setItem(key, value)
}

window.__cache_object = {}

export function setCache(key, value, timeoutSec, persist) {
  clearExpiredCache()
  window.__cache_object[key] = {
    value,
    expire: timeoutSec ? (getCurrentTimeStamp() + (timeoutSec * 1000)) : null
  }
  if (persist) {
    setItemFromLocalStorage(key, JSON.stringify(window.__cache_object[key]))
  }
}


export function delCache(key) {
  clearExpiredCache()
  delete window.__cache_object[key];
  removeItemFromLocalStorage(key)
}

export function clearExpiredCache() {
  const d = window.__cache_object;
  Object.keys(d).forEach((key) => {
    const {expire} = window.__cache_object[key];
    if (expire && getCurrentTimeStamp() >= expire) {
      delete window.__cache_object[key]
      removeItemFromLocalStorage(key)
    }
  })
}

export function getCacheExpiredTime(key) {
  clearExpiredCache()
  if (window.__cache_object[key]) {
    const {expire} = window.__cache_object[key];
    return expire
  } else {
    return 0;
  }
}

function getLocalStore(key, defaultVal = null) {
  const v = getItemFromLocalStorage(key, true, null);
  if (v !== null) {
    const {value, expire} = v;
    if (!expire || getCurrentTimeStamp() < expire) {
      window.__cache_object[key] = v;
      return value;
    } else {
      return defaultVal
    }
  } else {
    return defaultVal
  }
}

export function getCache(key, defaultVal = null) {
  clearExpiredCache()
  if (window.__cache_object[key]) {
    const {value, expire} = window.__cache_object[key];
    if (!expire || getCurrentTimeStamp() < expire) {
      return value;
    } else {
      return getLocalStore(key, defaultVal)
    }
  } else {
    return getLocalStore(key, defaultVal)
  }
}

