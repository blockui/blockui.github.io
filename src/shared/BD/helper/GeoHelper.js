import IApp from "../IApp";
import {getGlobalStore, setStoreState} from "components/core/App";
import {_debug, getConstant, getCurrentTimeStamp, globalLoading, globalLoadingHide} from "shared/functions/common";
import BDApp from "../BDApp";
import {postRemote} from "../../functions/network";
import BDios from "../BDIos";
import BDPermission from "../BDPermission";

const {cos} = Math;

class GeoHelper {
  static onGetMyLocation(options) {
    if (GeoHelper.loading) return;
    GeoHelper.loading = true;
    if (BDApp.isAdrPlatform()) {
      return GeoHelper.getAdrLocation(options)
    } else if (BDApp.isIosPlatform()) {
      return GeoHelper.getIosLocation(options)
    } else {
      return GeoHelper.getHtml5Location(options)
    }
  }

  static getAdrLocation(options) {
    return new Promise((resolve, reject) => {
      BDPermission.checkPermission("ACCESS_FINE_LOCATION").then(() => {
        setStoreState("gps", {
          lat: null, lng: null
        })
        const {map} = getConstant()
        IApp.run("getMyLocation", {
          enableAddress: false,
          minTimeMs: 1000,
          minDistanceM: 10,
          ...map['currentLocationOption']
        }).then(() => {
          (options && options['showLoading']) && globalLoading("获取位置中...")
          const startTime = getCurrentTimeStamp()
          const checkLocation = () => {
            _debug("checkLocation")
            const store = getGlobalStore();
            const {lat, lng} = store.getState().gps;
            if (!lat || !lng) {
              if (getCurrentTimeStamp() - startTime <= 1000 * map['currentLocationOption']['timeout']) {
                setTimeout(() => {
                  checkLocation()
                }, 1000)
              } else {
                GeoHelper.loading = false
                // showToastText("没有获取到位置信息")
                reject({codeStr: "TIMEOUT", message: "没有获取到位置信息"})
              }
            } else {
              postRemote("api/user", {t: "a", lat, lng}).catch(_debug)
              globalLoadingHide()
              resolve({lat, lng})
              IApp.run("stopGetMyLocation")
              GeoHelper.loading = false
            }
          }
          setTimeout(() => {
            checkLocation()
          }, 1000)
        }).finally(() => {
          GeoHelper.loading = false
        })
      }).finally(() => {
        GeoHelper.loading = false
      })
    })
  }

  static getIosLocation(options) {
    return new Promise((resolve, reject) => {
      setStoreState("gps", {
        lat: null, lng: null, gpsError: null
      })
      const {map} = getConstant();
      (options && options['showLoading']) && globalLoading("获取位置中...")
      BDios.getMyLocation({
        enableAddress: false,
        minTimeMs: 1000,
        minDistanceM: 10,
        ...map['currentLocationOption']
      })
      const startTime = getCurrentTimeStamp()
      const checkLocation = () => {
        _debug("checkLocation")
        const store = getGlobalStore();
        const {lat, lng, gpsError} = store.getState().gps;
        if (!lat || !lng) {
          if (gpsError) {
            GeoHelper.loading = false
            reject({codeStr: "UNKNOWN_ERROR", message: "获取位置失败"})
          } else {
            if (getCurrentTimeStamp() - startTime <= 1000 * map['currentLocationOption']['timeout']) {
              setTimeout(() => {
                checkLocation()
              }, 1000)
            } else {
              GeoHelper.loading = false
              // showToastText("没有获取到位置信息")
              reject({codeStr: "TIMEOUT", message: "没有获取到位置信息"})
            }
          }

        } else {
          GeoHelper.loading = false
          postRemote("api/user", {t: "a", lat, lng}).catch(_debug)
          globalLoadingHide()
          resolve({lat, lng})
        }
      }
      setTimeout(() => {
        checkLocation()
      }, 1000)
    })
  }

  static getHtml5Location(options) {
    return new Promise((resolve, reject) => {
      if (window.navigator.geolocation) {
        (options && options['showLoading']) && globalLoading("获取位置中...")
        const {currentLocationOption} = getConstant().map
        window.navigator.geolocation.getCurrentPosition((position) => {
          globalLoadingHide()
          GeoHelper.loading = false
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          postRemote("api/user", {t: "h", lat, lng}).catch(_debug)
          resolve({
            lat,
            lng,
            position
          })
        }, (error) => {
          GeoHelper.loading = false
          globalLoadingHide()
          let codeStr;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              codeStr = "PERMISSION_DENIED"
              break;
            case error.POSITION_UNAVAILABLE:
              codeStr = "POSITION_UNAVAILABLE"
              break;
            case error.TIMEOUT:
              codeStr = "TIMEOUT"
              break;
            case error.UNKNOWN_ERROR:
            default:
              codeStr = "UNKNOWN_ERROR"
              break;
          }
          reject({
            code: error.code,
            message: error.message,
            codeStr
          })
        }, currentLocationOption);
      } else {
        reject({message: "浏览器不支持获取地理位置"})
      }
    })
  }

  static rad2deg(x) {
    // _debug("rad2deg:", x, 180 * x / Math.PI);
    return (180 * x / Math.PI);
  }

  //// 经纬度转换成三角函数中度分表形式。
  static deg2rad(x) {
    // _debug("deg2rad:", x, x * Math.PI / 180);
    return (x * Math.PI / 180);
  }

  /**
   *
   * @param $lat
   * @param $lng
   * @param $rad km
   */
  static getNearPoint($lat, $lng, $rad) {
    const $R = 6371;  // earth's radius, km
    // first-cut bounding box (in degrees)
    const maxLat = $lat + GeoHelper.rad2deg($rad / $R);
    const minLat = $lat - GeoHelper.rad2deg($rad / $R);
    // compensate for degrees lngitude getting smaller with increasing latitude
    const maxLng = $lng + GeoHelper.rad2deg($rad / $R / cos(GeoHelper.deg2rad($lat)));
    const minLng = $lng - GeoHelper.rad2deg($rad / $R / cos(GeoHelper.deg2rad($lat)));
    // convert origin of filter circle to radians
    // $lat = GeoHelper.deg2rad($lat);
    // $lng = GeoHelper.deg2rad($lng);
    // _debug("Debug4", $lat, $lng);
    // _debug({maxLat,minLat,maxLng,minLng})
    return {
      maxLat, minLat, maxLng, minLng
    }
  }

  static getDistance(position1, position2) {
    const lat1 = position1.lat;
    const lng1 = position1.lng;

    const lat2 = position2.lat;
    const lng2 = position2.lng;

    const radLat1 = GeoHelper.deg2rad(lat1);
    const radLat2 = GeoHelper.deg2rad(lat2);
    const a = radLat1 - radLat2;
    const b = GeoHelper.deg2rad(lng1) - GeoHelper.deg2rad(lng2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10; //输出为m
    return s;
  }
}

GeoHelper.loading = false

export default GeoHelper;
