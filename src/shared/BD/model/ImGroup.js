import StorageHelper from "../helper/StorageHelper";
import {postRemote} from "../../functions/network";
import ModelHelper from "../helper/ModelHelper";
import {unique_array} from "../../functions/array";
import ImUser from "./ImUser";
import BDAuth from "../BDAuth";
import config from "config";

class ImGroup {
  static getTmpGroupType() {
    return config.constants.group.GroupType.GROUP_TYPE_TMP
  }

  static getFixGroupType() {
    return config.constants.group.GroupType.GROUP_TYPE_NORMAL
  }

  static async getGroupAvatar(group) {
    let avatar = []
    //临时
    if (group.type === 2 && group.members.length > 0) {
      for (let i in group.members) {
        if (i > 3) {
          break
        }
        const {userId, status} = group.members[i]
        if (status === 0) {
          const friend = await ImUser.getUserInfo(userId)
          avatar.push({
            avatar: friend.avatar,
            username: friend.username
          })
        }

      }

    } else {
      avatar.push({
        avatar: group.avatar,
        username: group.name
      })
    }
    return avatar;
  }

  static getGroupName({name,type, members}) {
    let groupName = name;
    if(type !== ImGroup.getFixGroupType()){
      groupName += ` (${members.filter(member => member.status !== 1).length})`
    }
    return groupName;
  }

  static async createGroup({members, groupName, groupType, groupAvatar, lat, lng}) {
    const {row} = await postRemote("api/ImGroup.create", {
      members,
      groupName,
      groupType,
      groupAvatar,
      lat, lng
    })
    // debugger
    ModelHelper.getInstance(ImGroup.namespace, BDAuth.getGlobalAuthUserId())
      .saveRecord({
        _id: ImGroup.getDocId(row),
        ...row
      })
    return Promise.resolve(row)
  }

  static async modify(groupId, {name, avatar}) {
    const data = {
      groupId: parseInt(groupId),
      name, avatar
    };
    const {row} = await postRemote("api/ImGroup.modify", data)
    ModelHelper.getInstance(ImGroup.namespace, BDAuth.getGlobalAuthUserId())
      .saveRecord({
        _id: ImGroup.getDocId(row),
        ...row
      })
    StorageHelper.notify(ImGroup.namespace, row.id)
    return Promise.resolve(row)
  }

  static async changeMember(groupId, members, isAdd) {
    const {GROUP_MODIFY_TYPE_DEL, GROUP_MODIFY_TYPE_ADD} = config.constants.group.GroupModifyType
    const data = {
      members: unique_array(members).map(i => parseInt(i)),
      groupId: parseInt(groupId),
      modifyType: isAdd ? GROUP_MODIFY_TYPE_ADD : GROUP_MODIFY_TYPE_DEL,
      isAdd: false
    };
    const {row} = await postRemote("api/ImGroup.changeMembers", data)
    ModelHelper.getInstance(ImGroup.namespace, BDAuth.getGlobalAuthUserId())
      .saveRecord({
        _id: ImGroup.getDocId(row),
        ...row
      })
    StorageHelper.notify(ImGroup.namespace, row.id)
    return Promise.resolve(row)
  }

  static getDocId(row) {
    return ModelHelper.formatDocId(ImGroup.namespace, row)
  }

  static parseDocId(docId) {
    return ModelHelper.parseDocId(ImGroup.namespace, docId)
  }

  static getGroupFromCache(id) {
    return StorageHelper.getRowFromCache(ImGroup.namespace, id)
  }

  static async getGroupInfoFromRemote(groupId) {
    let row;
    try {
      let res = await postRemote("api/ImGroup.row", {groupId})
      if (res && res.row) {
        row = res.row;
        ModelHelper.getInstance(ImGroup.namespace, BDAuth.getGlobalAuthUserId()).saveRecord({
          _id: ImGroup.getDocId(row),
          ...row
        })
      }
    } catch (e) {
      console.error(e)
    }
    return Promise.resolve(row)
  }

  static async getGroupInfo(id) {
    const groupId = parseInt(id)
    let row = ImGroup.getGroupFromCache(groupId)
    if (row && row['updated']) {
      return Promise.resolve(row)
    }
    if (!row || !row['updated']) {
      const _id = await StorageHelper.getDocIdById(ImGroup.namespace, groupId)
      if (_id) {
        try {
          row = await StorageHelper.getRowFormPdb(ImGroup.namespace, _id);
          StorageHelper.saveRow(ImGroup.namespace, id, row)
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (!row) {
      try {
        row = await ImGroup.getGroupInfoFromRemote(groupId)
        await StorageHelper.bindIdAndDocId(ImGroup.namespace, row['id'], ImGroup.getDocId(row))
        StorageHelper.saveRow(ImGroup.namespace, id, row)
      } catch (e) {
        console.error(e)
      }
    }
    return Promise.resolve(row)
  }

  static handleNotify(groupId) {
    ImGroup.getGroupInfoFromRemote(groupId).then((row) => {
      StorageHelper.notify(ImGroup.namespace, row.id)
    }).catch(console.error)
  }

  static hasMember(group, userId) {
    let hasMember = false;
    group.members.forEach(member => {
      if (member.userId === userId && member.status === 0) {
        hasMember = true;
      }
    })
    return hasMember;
  }
}

ImGroup.__lastUpdated = 0
ImGroup.rows = {}
ImGroup.items = []
ImGroup.namespace = "ImGroup"

export default ImGroup
