import {dispatchStore, getGlobalStore} from "components/core/App";

export default class BadgeHelper {

  static setBadgeDot(key, visible) {
    BadgeHelper.__setBadgeDot(key, visible)
    BadgeHelper.chekDots()
  }

  static __setBadgeDot(key, visible) {
    dispatchStore("badge", "setBadgeDot", {
      [key]: visible
    })
  }

  static check(key) {
    const {badgeDots} = getGlobalStore().getState().badge;
    return badgeDots[key] || false
  }


  static chekDots() {
    if (
      BadgeHelper.check("新朋友")
    ) {
      BadgeHelper.__setBadgeDot("联系人", true)
    } else {
      BadgeHelper.__setBadgeDot("联系人", false)
    }

    if (
      BadgeHelper.check("朋友圈")
    ) {
      BadgeHelper.__setBadgeDot("发现", true)
    } else {
      BadgeHelper.__setBadgeDot("发现", false)
    }
  }

}

