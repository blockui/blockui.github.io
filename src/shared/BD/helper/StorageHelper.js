import {
  diffObject,
  getAllDocFromPdbV1,
  getGlobalAuthUserId,
  getItemFromLocalStorage,
  setItemFromLocalStorage
} from "shared/functions/common";
import {deleteRemote, postRemote} from "shared/functions/network";
import {dispatchStore} from "components/core/App";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getCurrentTimeStamp} from "../../functions/utils";

export default class StorageHelper {
  /**
   * 删除 pdb 和 remote server 记录
   * @param url
   * @param namespace
   * @param deleteAction
   * @param _id
   * @param id
   * @returns {Promise<void>}
   */
  static async delete({url, namespace, deleteAction, _id, id}) {
    try {
      await deleteRemote(`api/${namespace}/${deleteAction}/${id}`).catch(console.error)
      try {
        const pdb = StorageHelper.getUserPdb(namespace)
        const doc = await pdb.get(_id)
        await pdb.remove(doc)
      } catch (e) {
        console.error(e)
      }
      StorageHelper.removeRow(namespace, id)
      return Promise.resolve()
    } catch (e) {
      console.error(e)
      return Promise.reject()
    }
  }

  static bindIdAndDocId(namespace, id, _id) {
    const pdb = StorageHelper.getUserPdb(namespace + ".id")
    pdb.get("p_" + id).catch(({status}) => {
      if (status === 404) {
        pdb.put({_id: "p_" + id, doc_id: _id}).catch(console.error)
      }
    })
  }

  static bindDocIdAndId(namespace, id, _id) {
    const pdb = StorageHelper.getUserPdb(namespace + "._id")
    pdb.get("p_" + _id).catch(({status}) => {
      if (status === 404) {
        pdb.put({_id: "p_" + _id, id: id}).catch(console.error)
      }
    })
  }

  static async getIdByDocId(namespace, _id) {
    const pdb = StorageHelper.getUserPdb(namespace + "._id")
    let id;
    try {
      const doc = await pdb.get("p_" + _id)
      id = doc.id;
    } catch (e) {
    }
    return Promise.resolve(id)
  }

  static async getDocIdById(namespace, id) {
    const pdb = StorageHelper.getUserPdb(namespace + ".id")
    let doc_id;
    try {
      const doc = await pdb.get("p_" + id)
      doc_id = doc.doc_id;
    } catch (e) {
    }
    return Promise.resolve(doc_id)
  }

  static async saveRowToPdb(pdb, {_id, _rev, ...row}) {
    if (!_id) {
      return Promise.reject({message: "_id is null"})
    }
    let doc;
    try {
      doc = await pdb.get(_id)
    } catch (e) {
      // _debug(_id, "not exists")
    }
    let res = {
      _id,
      ...row
    }
    if (doc) {
      const {_id, _rev, ...d_row} = doc
      if (diffObject(d_row, row)) {
        res = {
          ...doc,
          ...row,
          d_updated_at: row.updated_at || row.updated
        };
      } else {
        return Promise.resolve(doc)
      }
    }
    try {
      await pdb.put(res)
    } catch (e) {
      // _debug(res._id, e)
    }
    return Promise.resolve(res)
  }

  static async saveRowToRemote(namespace, data) {
    const {row} = await postRemote(`api/${namespace}`, data)
    return Promise.resolve(row)
  }

  static getMaxMinIdMaxUpdatedAt(namespace) {
    const {rowsSrd} = StorageHelper.getRowsFromCache(namespace)
    const maxUpdatedAt = StorageHelper.getMaxUpdatedAt(namespace)
    let maxId = 0, minId = 0;
    if (rowsSrd.length > 0) {
      maxId = rowsSrd[0];
      minId = rowsSrd[rowsSrd.length - 1];
    }
    return {
      maxId, minId, maxUpdatedAt
    }
  }

  /**
   * 获取最新的记录
   * @param namespace
   * @param userId
   * @param limit
   * @returns {Promise<array>}
   */
  static async loadLatestRows({namespace, userId, limit}) {
    const {
      maxId, minId, maxUpdatedAt
    } = StorageHelper.getMaxMinIdMaxUpdatedAt(namespace)
    if (maxUpdatedAt === 0) return Promise.resolve([])

    const {rows} = await postRemote(`api/${namespace}.rows`, {
      maxId,
      minId,
      maxUpdatedAt,
      userId,
      limit: limit,
    })
    return Promise.resolve(rows)
  }

  /**
   * 获取旧的记录
   * @param namespace
   * @param limit
   * @returns {Promise<array>}
   */
  static async loadOldRows({namespace, userId, limit}) {
    const {rowsSrd} = StorageHelper.getRowsFromCache(namespace)
    let minId = 0;
    if (rowsSrd.length > 0) {
      minId = rowsSrd[rowsSrd.length - 1];
    }
    const {rows} = await postRemote(`api/${namespace}.rows`, {
      minId: minId,
      orderKey: "id",
      userId,
      orderType: "desc",
      limit: limit,
    })
    return Promise.resolve(rows)
  }

  /**
   * 从pdb 获取所有记录 id
   * @param namespace
   * @param idPrefix
   * @param includeDocs
   * @returns {Promise<array>}
   */
  static async loadIdRowsFromPdb({namespace, idPrefix, includeDocs}) {
    const pdb = StorageHelper.getUserPdb(namespace)
    return getAllDocFromPdbV1({
      pdb, idPrefix,
      options: {
        include_docs: includeDocs || false,
      }
    })
  }

  /**
   * 初始化记录
   * @param namespace
   * @returns {*}
   */
  static initRows(namespace) {
    if (!StorageHelper.rows[namespace]) {
      StorageHelper.rows[namespace] = {
        rows: {},
        rowsSrd: [],
        maxUpdatedAt: 0,
      }
    }
  }

  /**
   * 从内存获取记录
   * @param namespace
   * @param id
   * @returns {Promise<any>}
   */
  static getRowFromCache(namespace, id) {
    StorageHelper.initRows(namespace)
    const {rows} = StorageHelper.rows[namespace]
    if (rows[id]) {
      return rows[id];
    } else {
      return null;
    }
  }

  static getRowFormPdb(namespace, _id) {
    const pdb = StorageHelper.getUserPdb(namespace)
    return pdb.get(_id)
  }

  static async getRowFromRemote(namespace, id) {
    const rowRemote = await postRemote(`api/${namespace}.row`, {
      id
    })
    return Promise.resolve(rowRemote)
  }

  static getPdbByNamespace(namespace) {
    if (StorageHelper.pDbs[namespace]) {
      return StorageHelper.pDbs[namespace];
    } else {
      const db = new window.PouchDB(namespace)
      StorageHelper.pDbs[namespace] = db
      return db
    }
  }

  static getUserPdb(namespace) {
    const userId = getGlobalAuthUserId();
    if (!userId) {
      throw Error("auth user_id is null")
    }
    return StorageHelper.getPdbByNamespace(`${userId}_${namespace}`)
  }

  /**
   * 获取内存中的记录
   *
   * @param namespace
   * @returns {*}
   */
  static getRowsFromCache(namespace) {
    StorageHelper.initRows(namespace)
    return StorageHelper.rows[namespace]
  }

  /**
   * 删除内存中的记录
   * @param namespace
   * @param id
   */
  static removeRow(namespace, id) {
    StorageHelper.initRows(namespace)
    const {rows} = StorageHelper.rows[namespace]
    delete rows[id]
    let {rowsSrd} = StorageHelper.rows[namespace]
    rowsSrd = rowsSrd.filter(row => row.id !== id)
    StorageHelper.rows[namespace].rowsSrd = rowsSrd
    StorageHelper.notify(namespace)
  }

  static notify(namespace, id, data) {
    let key = namespace
    if (id) {
      key = `${namespace}.${id}`
    }
    const updatedAt = getCurrentTimeStamp()
    dispatchStore("notify", "message", {
      [key]: data ? data : updatedAt,
      updatedAt
    })
  }

  /**
   * 保存记录到内存
   * @param namespace
   * @param rowId
   * @param row
   */
  static saveRow(namespace, rowId, row) {
    StorageHelper.initRows(namespace)
    const {rows} = StorageHelper.rows[namespace]
    if (row.updated_at) {
      StorageHelper.setMaxUpdatedAt(namespace, row.updated_at)
    }
    if (row.updated) {
      StorageHelper.setMaxUpdatedAt(namespace, row.updated)
    }
    StorageHelper.rows[namespace].rows[rowId] = {
      ...(rows[rowId] || {}),
      ...row,
    }
  }

  static setMaxUpdatedAt(namespace, updatedAt) {
    if (updatedAt > StorageHelper.getMaxUpdatedAt(namespace)) {
      const user_id = getGlobalAuthUserId()
      setItemFromLocalStorage(user_id + "_" + namespace, updatedAt)
    }
  }

  static getMaxUpdatedAt(namespace) {
    const user_id = getGlobalAuthUserId()
    return parseInt(getItemFromLocalStorage(user_id + "_" + namespace, false, 0))
  }

  static _sortRows({rows, orderField, asc}) {
    let rowsSrd = []
    const docIds = Object.keys(rows)
    docIds.forEach(id => {
      if (id > 0) {
        const row = rows[id]
        rowsSrd.push({
          id: parseInt(id),
          [orderField]: row[orderField]
        })
      }
    })
    rowsSrd.sort((a, b) => {
      if (asc) {
        return a[orderField] - b[orderField]
      } else {
        return b[orderField] - a[orderField]
      }
    })
    return rowsSrd.map(row => row.id)
  }

  /**
   * 对内存中的记录排序
   * @param namespace
   * @param docIdParser
   * @param asc
   */
  static sortRows({namespace, orderField, asc}) {
    const {rows} = StorageHelper.rows[namespace]
    // _debug(rows)
    StorageHelper.rows[namespace].rowsSrd = StorageHelper._sortRows({
      rows, orderField: orderField || "id", asc
    })
  }

  static reduxConnect(mapState, component, mapAction) {
    return connect(mapState, mapAction)(component)
  }

  /**
   *
   * @returns {{InferType: InferType, instanceOf<T>(expectedClass: {new(...args: any[]): T}): Requireable<T>, node: Requireable<ReactNodeLike>, RequiredKeys: RequiredKeys, elementType: Requireable<ReactComponentLike>, OptionalKeys: OptionalKeys, oneOf<T>(types: ReadonlyArray<T>): Requireable<T>, objectOf<T>(type: Validator<T>): Requireable<{[p: string]: T}>, element: Requireable<ReactElementLike>, shape<P extends ValidationMap<any>>(type: P): Requireable<InferProps<P>>, resetWarningCache(): void, InferProps: InferProps, any: Requireable<any>, IsOptional: IsOptional, arrayOf<T>(type: Validator<T>): Requireable<T[]>, ReactComponentLike: ReactComponentLike, Requireable: Requireable, string: Requireable<string>, Validator: Validator, exact<P extends ValidationMap<any>>(type: P): Requireable<Required<InferProps<P>>>, nominalTypeHack: typeof nominalTypeHack, array: Requireable<any[]>, ReactNodeLike: ReactNodeLike, InferPropsInner: InferPropsInner, ReactNodeArray: ReactNodeArray, ReactElementLike: ReactElementLike, checkPropTypes(typeSpecs: any, values: any, location: string, componentName: string, getStack?: () => any): void, object: Requireable<object>, bool: Requireable<boolean>, oneOfType<T extends Validator<any>>(types: T[]): Requireable<NonNullable<InferType<T>>>, ValidationMap: ValidationMap, number: Requireable<number>, symbol: Requireable<symbol>, func: Requireable<(...args: any[]) => any>}}
   */
  static getPropTypes() {
    return PropTypes
  }
}

StorageHelper.rows = {}
StorageHelper.pDbs = {}
