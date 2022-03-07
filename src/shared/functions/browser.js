import {appBridge, checkAppBridge} from "./utils";
import {getConstant} from "./common";

const constant = getConstant();

export const browser = (url) => {
  const app_main = constant.url.protocol.app_main;
  if (checkAppBridge() && url.substring(0, app_main.length) === app_main) {
    appBridge().browser(url.replace(app_main, ""))
  } else {
    window.location.href = url
  }
}
