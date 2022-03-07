const checkMobile = {
  mobile: function () {
    return navigator.userAgent.match(/Mobile/i);
  },
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  }
};

class AppUpdater {
  constructor(zipUrl, version) {
    this.db = this.getDb()
    this.zipUrl = zipUrl
    this.version = version
  }

  getDb() {
    return BD.getAssetPdb("assets_" + this.version);
  }

  saveFileToDb(_id, blob, type) {
    return new Promise(((resolve, reject) => {
      this.db['putAttachment'](_id, "data", blob, type).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    }))
  }

  process() {
    return new Promise((resolve, reject) => {
      console.log("AppUpdater process url: ", this.zipUrl)
      window.JSZipUtils.getBinaryContent(this.zipUrl, (err, data) => {
        if (err) reject(err);
        console.log("JSZip loadAsync data...");
        window.JSZip.loadAsync(data).then((zip) => {
          console.log("JSZip parsing asset-manifest.json ");
          zip.file("asset-manifest.json").async("string").then((data) => {
            const assetsManifest = JSON.parse(data)
            console.log("JSZip assetsManifest from zip: ", assetsManifest)
            const {files} = assetsManifest;
            const links_length = Object.keys(files).length - 1
            let i = 0;
            let hasErr = false
            console.log("JSZip extract files total: ", links_length)
            this.db.destroy().then(() => {
              this.db = this.getDb()
            }).finally(() => {
              Object.keys(files).forEach(fileKey => {
                if (fileKey === "asset-manifest.json") {
                  return;
                }
                const t = files[fileKey].substr(0, 1)
                const asset_url = t === "/" ? files[fileKey].substr(1) : files[fileKey]
                console.log("JSZip extract... ", fileKey)
                zip.file(asset_url).async("string").then((data) => {
                  const type = asset_url.indexOf(".css") > 0 ? "text/css" : "text/plain"
                  const attachment = new Blob([data], {type});
                  this.saveFileToDb(asset_url, attachment, type).catch((e) => {
                    console.error(e)
                  }).finally(() => {
                    i += 1
                    if (i === links_length) {
                      console.log("JSZip load finish")
                      if (hasErr) {
                        reject({message: "save assets file to db error"})
                      } else {
                        resolve(assetsManifest)
                      }
                    }
                  })
                }).catch((e) => {
                  console.error(e)
                });
              })
            })
          });
        });
      });
    })
  }
}

class BD {
  static setOptions(options) {
    if (options.platform) {
      BD.platform = options.platform;
    }
    if (options.initZipUrl) {
      BD.initZipUrl = options.initZipUrl;
    }
    if (options.versionAssets) {
      BD.versionAssets = options.versionAssets;
    }

    if (options.localInitAssetsEnable) {
      BD.localInitAssetsEnable = options.localInitAssetsEnable;
    }

    if (options.versionAssets) {
      BD.localAssetsEnable = options.localAssetsEnable;
    }

    if (checkMobile.iOS()) {
      BD.agent = "ios"
    } else if (checkMobile.Android()) {
      BD.agent = "adr"
    } else if (checkMobile.Windows()) {
      BD.agent = "win"
    } else {
      BD.agent = "web"
    }

  }

  static saveInitConstant(constant) {
    BD.baseApi = constant.server.baseApi;
    BD.debug = constant.debug;
    BD.__constant = constant
    BD.version = constant.version;
    BD.versionAssets = constant.assets.version;
    console.log("saveInitConstant,version: ", BD.version)
    console.log("saveInitConstant,versionAssets: ", constant.assets.version)
  }

  static init() {
    console.log("BD init")
    if (window.location.host.indexOf("3007") === -1) {
      BD.initApp()
    }
  }

  static isWebPlatform() {
    return BD.platform === 'WEB'
  }

  static getAssetPdb(key) {
    return new PouchDB(`${BD.pdbKey}-${key}`);
  }

  static isIosBrowser() {
    return checkMobile.iOS();
  }

  static initApp() {
    const assetsJson = BD.getAssetsJson();
    if (assetsJson) {
      console.log("BD initApp from assetsJson")
      BD.loadAssetsJson(assetsJson)
    } else {
      console.log("BD initApp loadInitFiles")
      BD.loadInitFiles()
    }
  }
  static saveAssetsJson(assets, version) {
    localStorage.setItem(BD.assetsKey + version, JSON.stringify(assets))
  }

  static loadInitFiles() {
    if (BD.platform === 'WEB' && BD.localInitAssetsEnable) {
      const {initZipUrl} = BD
      new AppUpdater(initZipUrl, BD.versionAssets).process().then((assetsManifest) => {
        BD.saveAssetsJson(assetsManifest, BD.versionAssets);
        BD.setVersionAssets(BD.versionAssets)
        BD.initApp()
      }).catch(() => {
        alert("系统出错！")
      })
    } else {
      BD.insertDom("head", "link", "static/css/main.css?v=" + BD.versionAssets)
      BD.insertDom("head", "script", "static/js/bundle.js?v=" + BD.versionAssets)
    }
  }

  static loadAssetsUrlFromDb(db, files) {
    return new Promise(((resolve, reject) => {
      let i = 0
      const urls = {}
      let hasErr = false
      files.forEach(file => {
        db.getAttachment(file, "data").then((blob) => {
          urls[file] = URL.createObjectURL(blob)
        }).catch((e) => {
          hasErr = true;
        }).finally(() => {
          i += 1;
          if (i === files.length) {
            if (!hasErr) {
              resolve(urls)
            } else {
              reject({message: "loadAssetsUrlFromDb error"})
            }
          }
        })
      })
    }))
  }

  static getVersionAssets() {
    return window.localStorage.getItem("versionAssets")
  }

  static setVersionAssets(version) {
    window.localStorage.setItem("versionAssets", version)
  }

  static loadAssetsJson(assetsManifest) {
    const db = BD.getAssetPdb("assets_" + BD.getVersionAssets())
    const {entrypoints, plugins} = assetsManifest
    const files = plugins.concat(entrypoints)
    BD.loadAssetsUrlFromDb(db, files).then(urls => {
      Object.keys(urls).forEach(file => {
        if (file.indexOf(".css") > 0) {
          BD.insertDom("head", "link", urls[file])
        }
        if (file.indexOf(".js") > 0) {
          BD.insertDom("head", "script", urls[file])
        }
      })
    }).catch((e) => {
      console.error("loadAssetsJson error", e.message, e)
      BD.loadInitFiles()
    })
  }

  static getAssetsJson() {
    const versionAssets = BD.getVersionAssets()
    console.log("getAssetsJson,versionAssets: ", versionAssets)
    if (!versionAssets) {
      return null
    }
    const assetsJsonStr = window.localStorage.getItem(BD.assetsKey + versionAssets)
    if (assetsJsonStr) {
      return JSON.parse(assetsJsonStr)
    } else {
      return null
    }
  }

  static insertDom(container_tag, tag, path, content) {
    console.log("insertDom...")
    console.log(JSON.stringify([container_tag, tag, path]))
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

  static callJs(message) {
    console.log("app call js: " + message)
    switch (message) {
      case "KEYCODE_BACK":
        if (window.location.hash.indexOf("disableBack=true") > -1) {
          break
        }
        if (window._disableHistoryBackAction) {
          break;
        }
        if (window.__historyBackActionFunc) {
          window.__historyBackActionFunc()
        } else {
          if (window.__historyBack) {
            window.__historyBack()
          } else {
            window.history.back()
          }
        }
        break;
      case "KEYCODE_BACK_END_ACTIVITY":
        if (window['confirmEndActivity']) {
          window['confirmEndActivity']()
        }
        break;
      default:
        break
    }
  }

  static reOpenApp() {
    if (window['IApp']) {
      return window['IApp'].call("finish", "{}")
    }
    switch (BD.platform) {
      case "IOS":
        window.webkit.messageHandlers.finish.postMessage();
        break;
      case "CHR":
        window.location.reload()
        break;
    }
  }
}

BD.agent = ""
BD.constantKey = `constant-main.json`;
BD.assetsKey = `assets-main.json`;
BD.localInitAssetsEnable = false;
BD.localAssetsEnable = false;
BD.pdbKey = `pdb-main`;
BD.baseApi = null;
BD.platform = "WEB";
BD.version = null;
BD.versionAssets = null;
BD.debug = false;
BD.__constant = null;
BD.initZipUrl = null


window.onerror = function (msg, url, lineNo, columnNo, error) {
  const lastVersion = window.localStorage.getItem("lastVersion")
  window.localStorage.removeItem("lastVersion")
  if (!BD.isWebPlatform() && lastVersion) {
    window.localStorage.removeItem("versionAssets")
    if (BD.__constant.assets.version !== lastVersion) {
      window.localStorage.setItem("versionAssets", lastVersion)
    }
    BD.reOpenApp()
  }
  console.error("💥 window.onerror", msg, url, lineNo, columnNo, error)
  return false;
};


window.BD = BD;
window.AppUpdater = AppUpdater;
window.checkMobile = checkMobile;

