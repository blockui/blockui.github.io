window.pDbs = {};
export default class PdbHelper {

  constructor(dbName) {
    this.dbName = dbName;
  }

  /**
   *
   * @param dbName
   * @returns {PouchDB}
   */
  static db(dbName) {
    if (window.pDbs[dbName]) {
      return window.pDbs[dbName];
    } else {
      return new window.PouchDB(dbName);
    }
  }

  async updateOrAdd({doc_id, ...row}) {
    const db = PdbHelper.db(this.dbName);
    try {
      const {_rev} = await db.get(doc_id);
      // debugger
      await db.put({
        ...row,
        _rev: _rev,
        _id: doc_id
      });
    } catch (e) {
      const {status, message} = e;
      if (status === 404) {
        await db.put({
          ...row,
          _id: doc_id
        });
      } else if (status === 409) {
        await this.updateOrAdd({doc_id, ...row});
      } else {
        console.error("save pdb error,", {status, message}, row);
        throw new Error(e);
      }
    }

  }

  async get(doc_id, defaultVal = null) {
    try {
      return await PdbHelper.db(this.dbName).get(doc_id);
    } catch (e) {
      return defaultVal;
    }
  }

  async add({doc_id, ...row}) {
    await PdbHelper.db(this.dbName).put({
      ...row,
      _id: doc_id
    });
  }

  async listIndex() {
    return await PdbHelper.db(this.dbName).getIndexes();
  }

  async createIndex({fields, name, type}) {
    const res = await PdbHelper.db(this.dbName).createIndex({
      index: {
        fields, name, type
      }
    });
    console.log("createIndex", res);
  }

  async allDocsStartWith({includeDocs, startKey}) {
    const rows = await this.all({
      include_docs: !!includeDocs,
      startkey: `${startKey}_`, endkey: `${startKey}_\ufff0`
    });
    return rows
  }

  async all(include_docs, startkey, endkey) {
    return await PdbHelper.db(this.dbName).allDocs({
      include_docs: !!include_docs,
      startkey, endkey
    });
  }

  async find({selector, fields, sort, limit, skip, ...request}, isExplain) {
    let res;
    if (isExplain) {
      res = await PdbHelper.db(this.dbName).explain({selector, fields, sort, limit, skip, ...request});
    } else {
      res = await PdbHelper.db(this.dbName).find({selector, fields, sort, limit, skip, ...request});
    }
    return res;
  }
}
