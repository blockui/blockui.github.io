import ModelHelper from "../helper/ModelHelper";
import {_debug, getCurrentTimeStamp, getGlobalAuthUserId} from "../../functions/common";
import StorageHelper from "../helper/StorageHelper";
import GeoHelper from "../helper/GeoHelper";
import {postRemote} from "../../functions/network";

class BdMark {
  static getModel() {
    return ModelHelper.getInstance(BdMark.namespace, getGlobalAuthUserId())
  }

  static searchMark(name, {center, zoom, maxLat, minLat, maxLng, minLng}, cb) {
    if (name.length > 1) {
      BdMark.searchMarkFromRemote(name).then((rows) => {
        cb(BdMark.sortRowsByDistance(rows, center))
      }).catch((e) => {
        _debug(e)
      })
    }
  }

  static async searchMarkFromRemote(name) {
    BdMark.searchMarkFromRemoteName = name;
    if (BdMark.searchMarkFromRemoteLoading) {
      _debug("searchMarkFromRemoteLoading: ", BdMark.searchMarkFromRemoteLoading, BdMark.searchMarkFromRemoteName)
      return Promise.reject()
    }

    try {
      BdMark.searchMarkFromRemoteLoading = true;
      const {rows} = await postRemote("api/BdMark.rows.name", {
        name
      })

      if (rows.length > 0) {
        rows.forEach(row => {
          BdMark.saveRow(row)
        })
      }
      BdMark.searchMarkFromRemoteLoading = false;
      if (name !== BdMark.searchMarkFromRemoteName) {
        return BdMark.searchMarkFromRemote(BdMark.searchMarkFromRemoteName)
      }
      BdMark.searchMarkFromRemoteName = null
      return Promise.resolve(rows)
    } catch (e) {
      BdMark.searchMarkFromRemoteName = null
      BdMark.searchMarkFromRemoteLoading = false;
      return Promise.resolve([])
    }
  }

  static async getNearestMarksFromRemote({lat, lng}, radiusM, limit) {
    try {
      const {rows} = await postRemote("api/BdMark.rows.geo", {
        lat, lng, radiusM, limit
      })
      if (rows.length > 0) {
        rows.forEach(row => {
          BdMark.saveRow(row)
        })
      }
      return Promise.resolve(rows)
    } catch (e) {
      return Promise.resolve([])
    }
  }

  static async getNearestMarks({lat, lng}, radiusM) {
    const {maxLat, minLat, maxLng, minLng} = GeoHelper.getNearPoint(lat, lng, radiusM / 1000)
    const {rows} = BdMark.getModel().getRecordsFromCache()
    // _debug(rows)
    if (Object.keys(rows).length === 0) {
      await BdMark.getModel().loadIdRecordsFromPdb({})
    }
    const position = {lat, lng}
    const res = []
    // _debug(rows)
    if (Object.keys(rows).length > 0) {
      const docIds = Object.keys(rows)
      for (let i in docIds) {
        const _id = docIds[i]
        let row = rows[_id]
        const {updated_at} = row;
        if (!updated_at) {
          row = await BdMark.getModel().loadRecord(_id)
        }
        const {lat, lng} = row;
        if (lat && lng && row.updated_at) {
          if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
            const dist = GeoHelper.getDistance({lat, lng}, position)
            res.push({...row, _id, dist})
          }
        }
      }
    }
    res.sort((a, b) => a.dist - b.dist)
    // _debug("getNearestMark", {res})
    return Promise.resolve(res)
  }

  static sortRowsByDistance(rows, {lat, lng}) {
    const rows_ = []
    rows.forEach(row => {
      rows_.push({
        ...row,
        dist: GeoHelper.getDistance({lat, lng}, {lat: row.lat, lng: row.lng})
      })
    })
    rows_.sort((a, b) => a.dist - b.dist)
    return rows_;
  }

  static saveRow({id, ...row}) {
    row.user_id = getGlobalAuthUserId()
    if (!row.created_at) {
      row.created_at = getCurrentTimeStamp()
    }
    if (!row.updated_at) {
      row.updated_at = row.created_at
    }
    const _id = ModelHelper.formatDocId(BdMark.namespace, row);

    ModelHelper.getInstance(BdMark.namespace, getGlobalAuthUserId()).saveRecord({
      _id, ...row
    })

    if (id) {
      StorageHelper.bindIdAndDocId(BdMark.namespace, id, _id)
      StorageHelper.bindDocIdAndId(BdMark.namespace, id, _id)
    }
  }
}

BdMark.namespace = "BdMark"
BdMark.searchMarkFromRemoteLoading = false
BdMark.searchMarkFromRemoteName = null
export default BdMark
