import StorageHelper from "./StorageHelper";
import {_debug} from "shared/functions/common";
import BDApp from "../BDApp";
import config from "config";
import BDAuth from "../BDAuth";


class ModelHelper {
  constructor(namespace, user_id) {
    this.namespace = namespace
    this.user_id = user_id;
    this.updateKey = this.getUpdatedKey(namespace)
    this.createKey = this.getCreatedKey(namespace)

  }

  /**
   *
   * @param namespace
   * @param user_id
   * @returns {ModelHelper}
   */
  static getInstance(namespace, user_id) {
    if (ModelHelper.__instances[namespace]) {
      return ModelHelper.__instances[namespace];
    } else {
      ModelHelper.__instances[namespace] = new ModelHelper(namespace, user_id)
      return ModelHelper.__instances[namespace];
    }
  }

  getTotalRecordsLen() {
    const {namespace} = this;
    const {rowsSrd} = StorageHelper.getRowsFromCache(namespace)
    return rowsSrd.length
  }

  saveRecords({rows, skipSavePdb}) {
    const {namespace} = this;
    if (rows === null || rows.length === 0) {
      return {totalRowsLen: this.getTotalRecordsLen()};
    }
    let pdb;
    if (this.user_id) {
      pdb = StorageHelper.getUserPdb(namespace)
    } else {
      pdb = StorageHelper.getPdbByNamespace(namespace)
    }
    for (let i in rows) {
      const row = rows[i]
      if (row.id) {
        StorageHelper.saveRow(namespace, row.id, row)
        if (!skipSavePdb) {
          const _id = ModelHelper.formatDocId(namespace, row);
          StorageHelper.saveRowToPdb(pdb, {
            _id,
            ...row
          }).catch(console.error)
          StorageHelper.bindIdAndDocId(namespace, row.id, _id)
        }
      }
    }
    StorageHelper.sortRows({namespace})
    return {totalRecordsLen: this.getTotalRecordsLen()};
  }

  saveRecord({_id, id, _rev, ...record}) {
    const {namespace} = this;
    // debugger
    StorageHelper.saveRow(namespace, id || _id, {id, ...record})
    let pdb;
    if (this.user_id) {
      pdb = StorageHelper.getUserPdb(namespace)
    } else {
      pdb = StorageHelper.getPdbByNamespace(namespace)
    }
    StorageHelper.saveRowToPdb(
      pdb,
      {
        _id,
        ...record
      }).catch(console.error)
    if (id) {
      StorageHelper.bindIdAndDocId(namespace, id, _id)
    }
    let orderField = "id";
    if (!orderField && record[this.createKey]) {
      orderField = this.createKey
    }
    StorageHelper.sortRows({namespace, orderField})
  }

  getIdByDocId(docId) {
    return StorageHelper.getIdByDocId(this.namespace, docId)
  }

  async loadRecord(recordId) {
    const {namespace} = this;
    recordId = "" + recordId
    let id = recordId
    if ((recordId).indexOf("_") === -1) {
      id = parseInt(id)
    }
    let row = StorageHelper.getRowFromCache(namespace, id)
    if (!row || !row[this.updateKey]) {
      try {
        let _id = id
        if (recordId.indexOf("_") === -1) {
          _id = ModelHelper.formatDocId(namespace, row)
        }
        row = await StorageHelper.getRowFormPdb(namespace, _id)
      } catch (e) {
      }
      if (row) {
        StorageHelper.saveRow(namespace, id, row)
      } else {
        try {
          row = await StorageHelper.getRowFromRemote(namespace, id)
          if (row) {
            StorageHelper.saveRow(namespace, id, row)
            const pdb = StorageHelper.getUserPdb(namespace)
            await StorageHelper.saveRowToPdb(pdb, {
              ...row,
              _id: ModelHelper.formatDocId(namespace, row)
            })
          }
        } catch (e) {
        }
      }

    }
    return Promise.resolve(row)
  }

  updateCounter(id) {
    const {namespace} = this;
    if (id) {
      StorageHelper.notify(namespace, id)
    } else {
      StorageHelper.notify(namespace)
    }
  }

  async loadOldRecords({limit, ...params}) {
    const {namespace} = this;
    const rows = await StorageHelper.loadOldRows({
      namespace,
      limit: limit || BDApp.getConstant().circle['defaultFetchLimitNum'],
      ...params
    })
    return Promise.resolve(rows)
  }

  async loadLatestRecords({limit, ...params}) {
    const {namespace} = this;
    let rows = []
    try {
      rows = await StorageHelper.loadLatestRows({
        namespace,
        limit: limit || BDApp.getConstant().groups['defaultFetchLimitNum'],
        ...params
      })
    } catch (e) {
      console.error(e)
    }
    return Promise.resolve(rows)
  }

  async initPdbRecords({idPrefix, ...options}) {
    if (this.cacheHasRows()) {
      return Promise.resolve([])
    }
    const rows = await this.loadIdRecordsFromPdb({idPrefix, ...options})
    return Promise.resolve(rows);
  }

  async loadIdRecordsFromPdb({idPrefix, options}) {
    const {namespace} = this;
    const docIds = await StorageHelper
      .loadIdRowsFromPdb({
        namespace,
        idPrefix,
        ...options
      })
    // _debug(docIds)
    const rows = []
    if (docIds.length > 0) {
      docIds.forEach(docId => {
        const row = ModelHelper.parseDocId(namespace, docId)
        rows.push(row)
        StorageHelper.saveRow(namespace, row.id || docId, row)
      })
    }
    // _debug(rows)
    return Promise.resolve(rows);
  }

  getRecordsFromCache() {
    const {namespace} = this;
    return StorageHelper.getRowsFromCache(namespace)
  }

  cacheHasRows() {
    const {namespace} = this;
    const {rowsSrd} = StorageHelper.getRowsFromCache(namespace)
    _debug(rowsSrd)
    return rowsSrd.length > 0
  }

  static formatDocId(namespace, row) {
    switch (namespace) {
      case "BdCircle":
        const user_id = BDAuth.getGlobalAuthUserId()
        const {Image, Video, Audio} = config.constants.circle.Circle_Type
        let m = "t";
        if ([Image, Video].indexOf(row.type) > -1) {
          m = "i"
        }
        if ([Audio].indexOf(row.type) > -1) {
          m = "a"
        }
        return `${user_id}_${m}_${row.type}_${row.created_at}_${row.id}`
      case "ImGroup":
        return `${row.user_id}_${row.type}_${row.created}_${row.id}`
      case "BdMark":
        return `${row.user_id}_${row.created_at}`
      default:
        return `p_${row.id}`
    }
  }

  static parseDocId(namespace, _id) {
    const t = _id.split("_")
    switch (namespace) {
      case "BdCircle":
        return {
          user_id: parseInt(t[0]),
          m: t[1],
          type: parseInt(t[2]),
          created_at: parseInt(t[3]),
          id: parseInt(t[4])
        }
      case "ImGroup":
        return {
          user_id: parseInt(t[0]),
          type: parseInt(t[1]),
          created: parseInt(t[2]),
          id: parseInt(t[3])
        }
      case "BdMark":
        return {
          user_id: parseInt(t[0]),
          created_at: parseInt(t[1]),
        }
      default:
        return {
          id: parseInt(t[1])
        }
    }
  }

  getUpdatedKey(namespace) {
    switch (namespace) {
      case "BdCircle":
        return "updated_at"
      case "ImGroup":
        return "updated"
      case "BdMark":
        return "updated_at"
      default:
        return "updated"
    }
  }

  getCreatedKey(namespace) {
    switch (namespace) {
      case "BdCircle":
        return "created_at"
      case "ImGroup":
        return "created"
      case "BdMark":
        return "created_at"
      default:
        return "created"
    }
  }

}
ModelHelper.__instances = {}

export default ModelHelper;
