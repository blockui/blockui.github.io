import axios from "axios";
import {

  addOrUpdateRowToPdb,
  check_val,
  getPdbAllDocStartOptions,
  globalLoading,
  globalLoadingHide,
  historyBack,
  loadRowsFromPdb
} from "shared/functions/common";
import {dispatchStore, setStoreState} from "components/core/App";
import weui from "shared/weui-js";


export function onSave({namespace, db, id_prefix, user_id, row, fields}) {
  const {area} = row;
  const saveObj = {}
  try {
    Object.keys(fields).filter(name => !fields[name].ignore_dpl).sort((a, b) => {
      return fields[a].i - fields[b].i
    }).forEach(name => {
      const field = fields[name];
      check_val(row[name], {
        name, ...field
      })
      saveObj[name] = row[name]
    })
    if (row.id) {
      db.get(row.doc_id).then((doc) => {
        saveRow({
          namespace, row: {
            ...saveObj,
            doc_id: doc._id,
            doc_rev: doc._rev,
            id: row.id,
            user_id,
            area
          }
        }).then(({row}) => {
          const {doc_id, doc_rev, ...other} = row
          return db.put({
            ...other,
            _id: doc_id,
            _rev: doc_rev
          }).then(() => {
            setStoreState("global", {input: {}})
            dispatchStore(namespace, "updateRows", {
              row: {doc_id, doc_rev, ...other}
            })
            weui.toast("保存成功")
          }).catch(console.error)
        }).catch(console.error)
      }).catch(console.error)
    } else {
      let doc;
      doc = {
        ...saveObj,
        user_id,
        area,
        _id: `${id_prefix}_${+(new Date())}`,
      }
      db.put(doc).then(({id, rev}) => {
        saveRow({
          namespace,
          row: {
            area,
            doc_id: id,
            doc_rev: rev,
            user_id,
            ...saveObj
          },
        }).then(({row}) => {
          const {doc_id, doc_rev, ...other} = row
          db.put({
            ...other,
            _id: doc_id,
            _rev: doc_rev
          }).then(() => {
            setStoreState("global", {input: {}})
            dispatchStore(namespace, "addRow", {
              row: {...other, doc_id, doc_rev}
            })
            weui.toast("保存成功")
            setTimeout(() => {
              weui.confirm("继续添加？", () => {
                setStoreState(namespace, {row: {}})
              }, () => {
                historyBack()
              })
            }, 200)
          })
        }).catch(console.error)
      }).catch(console.error)

    }
  } catch (e) {
    console.error(e)
  }
}

export function onRemove({namespace, db, doc_id}) {
  db.get(doc_id).then((doc) => {
    if (doc.id) {
      removeRow({
        action: "delete",
        row_id: doc.id,
        namespace
      }).then(() => {
        db.remove(doc).then(() => {
          historyBack()
          dispatchStore(namespace, "removeRow", {doc_id})
          weui.toast("删除成功");
        }).catch(console.error)
      })
    } else {
      db.remove(doc).then(() => {
        historyBack()
        dispatchStore(namespace, "removeRow", {doc_id})
        weui.toast("删除成功");
      }).catch(console.error)
    }

  }).catch(console.error)

}

export function onLoadRows({namespace, isPublic, id_prefix, user_id, db}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const options = {
        ...getPdbAllDocStartOptions(id_prefix),
      };
      loadRowsFromPdb({
        db,
        options
      }).then(({rows}) => {
        if (rows.length === 0) {
          globalLoading()
          fetchRows({isPublic, namespace}).then(({rows}) => {
            if (rows.length > 0) {
              setStoreState(namespace, {
                rows: rows.map(({doc_id, doc_rev, ...row}) => {
                  let row_id = doc_id;
                  let item;
                  if (user_id) {
                    row_id = doc_id.substring(("" + user_id).length + 1)
                    item = {
                      ...row,
                      _id: doc_id,
                      _rev: doc_rev,
                    }
                  } else {
                    item = {
                      ...row,
                      _id: `${id_prefix}_${row_id}`,
                    }
                  }
                  addOrUpdateRowToPdb(db, id_prefix, row_id, item)
                  return {
                    doc_id: item._id,
                    doc_rev,
                    ...row
                  }
                })
              })
            }
            setTimeout(() => globalLoadingHide(), 100)
            resolve({rows})
          })
        } else {
          setStoreState(namespace, {
            rows:
              rows
                .sort((a, b) => {
                  return -a.updated + b.updated
                })
                .map(({_id, _rev, ...row}) => {
                  return {
                    ...row,
                    doc_id: _id,
                    doc_rev: _rev
                  }
                })
          })
          globalLoadingHide()
          resolve({rows})
        }
      }).catch(console.error)
    }, 10)
  })
}

export function fetchRows({namespace, isPublic}) {
  return new Promise((resolve) => {
    let url = `/${namespace}/rows`;
    if (!isPublic) {
      url = `/my/${namespace}/rows`;
    }
    axios.get(url, {})
      .then(({data}) => {
        if (data.code === 200) {
          const {body} = data;
          resolve(body)
        } else {
          console.error(data)
        }
      }).catch(console.error)
  })
}

export function saveRow({namespace, row}) {
  return new Promise((resolve) => {
    axios.post(`/${namespace}`, {data: row})
      .then(({data}) => {
        if (data.code === 200) {
          const {body} = data;
          resolve(body)
        } else {
          console.error(data)
        }
      }).catch(console.error)
  })
}

function removeRow({namespace, action, row_id}) {
  return new Promise((resolve) => {
    axios.delete(`/${namespace}/${row_id}/${action}`, {})
      .then(({data}) => {
        if (data.code === 200) {
          const {body} = data;
          resolve(body)
        } else {
          console.error(data)
        }
      }).catch(console.error)
  })
}
