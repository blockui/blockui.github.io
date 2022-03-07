import axios from "axios";

import { getCurrentTimeStamp, getGlobalAuthUserId, globalLoadingHide} from "shared/functions/common";
import {getFavorsPDb} from "shared/functions/pdb";
import {dispatchStore} from "components/core/App";
import {postRemote} from "shared/functions/network";
import BDAuth from "../shared/BD/BDAuth";


export function getUserUnReadMessage({friend_id, end_msg_id, count}) {
  return new Promise((resolve, reject) => {
    const data = {
      friend_id,
      count,
      end_msg_id,
      auth_pub_key:BDAuth.getRsaPubKey()
    }
    postRemote("api/ImMessage.rows", data).then(({rows}) => {
      resolve(rows)
    }).catch(reject)
  })
}

export function getUserMessagesByRange({peerId, sessionType, minId, maxId, count}) {
  return new Promise((resolve, reject) => {
    const data = {
      sessionType,
      peerId,
      minId,
      maxId:maxId || null,
      count,
      auth_pub_key:BDAuth.getRsaPubKey()
    }
    // _debug(data)
    postRemote("api/ImMessage.rows", data).then(({rows,total}) => {
      resolve({rows,total})
    }).catch(reject)
  })
}

export function parseFavorId({doc_id, type, user_id}) {
  return doc_id.substring(`${user_id}_${type}_`.length)
}

export function getFavorId({type, created}) {
  const user_id = getGlobalAuthUserId()
  return `${type}_${user_id}_${created}`
}

export function checkFavor({type, doc_id}) {
  return new Promise((resolve) => {
    getFavorsPDb().get(getFavorId({type, doc_id})).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    })
  })
}

export function onFavor({title, data, doc_id, type}) {
  const namespace = "favor"
  const db = getFavorsPDb();
  const user_id = getGlobalAuthUserId()
  return new Promise((resolve) => {
    const _id = getFavorId({type, doc_id});
    db.get(_id).then((doc) => {
      db.remove(doc)
      if (doc.id) {
        axios.delete(`/${namespace}/${doc.id}/delete`)
          .then(({data}) => {
            if (data.code === 200) {
              dispatchStore(namespace, "removeRow", {doc_id: doc._id})
              globalLoadingHide()
              resolve(false)
            } else {
              console.error(data)
            }
          }).catch(console.error)
      } else {
        globalLoadingHide()
        resolve(false)
        dispatchStore(namespace, "removeRow", {doc_id: doc._id})
      }

    }).catch(() => {
      saveFavor({data, namespace, user_id, doc_id, type, title})
        .then(() => resolve(true)).catch(resolve)
    })
  })
}

export async function saveFavor({db, namespace, title, data, user_id, doc_id, type}) {
  const postData = {
    data: data ? JSON.stringify(data) : null,
    title,
    type,
    user_id,
  }
  const doc = await db.put({
    ...postData,
    updated: Math.floor(getCurrentTimeStamp() / 1000),
    _id: doc_id
  })

  const body = await postRemote(`api/my/${namespace}`, {
    ...postData,
    doc_id: doc_id,
    doc_rev: doc.rev,
  })
  globalLoadingHide()
  const {doc_rev, ...row} = body.row
  await db.put({
    ...row,
    _id: doc_id,
    _rev: doc.rev
  })
  dispatchStore(namespace, "addRow", {row})
  return Promise.resolve(true)
}
