import {checkSupportTouch} from "./common";

export function getEventClientPosition(e) {
  const {targetTouches} = e
  const {clientY, clientX} = (targetTouches && targetTouches.length > 0) ? targetTouches[0] : e
  return {clientY, clientX}
}

export function getTouchRelName(event_name) {
  let e_name;
  switch (event_name) {
    case "touchstart":
      e_name = "mousedown";
      break;
    case "touchend":
      e_name = "mouseup";
      break;
    case "touchmove":
    default:
      e_name = "mousemove";
      break;
  }
  return e_name
}

export function bindEvent(dom, event_name, event) {
  if (checkSupportTouch()) {
    dom.addEventListener(event_name, event, false)
  } else {
    dom.addEventListener(getTouchRelName(event_name), event, false)
  }
}

export function unBindEvent(dom, event_name, event) {
  if (checkSupportTouch()) {
    dom.removeEventListener(event_name, event)
  } else {
    dom.removeEventListener(getTouchRelName(event_name), event)
  }
}

export function bindEventTouch(dom, eventStart, eventEnd) {
  bindEvent(dom, "touchstart", eventStart)
  bindEvent(dom, "touchend", eventEnd)
}

export function unBindEventTouch(dom, eventStart, eventEnd) {
  unBindEvent(dom, "touchstart", eventStart)
  unBindEvent(dom, "touchend", eventEnd)
}
