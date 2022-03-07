import {combineReducers} from "redux";

import global from "./store/global"
import constant from "./store/constant"
import auth from "./store/auth"
import ui from "./store/ui"
import queue from "./store/queue"
import img from "./store/img"
import notify from "./store/notify"


export default combineReducers({
  global,
  constant,
  auth,
  notify,
  queue,
  img,
  ui,
});
