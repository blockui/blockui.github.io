import React from 'react'
import {Icons} from "./Icons";
import cls from 'classnames'
import {historyBack} from "shared/functions/common";

export const TopAction = ({onClick, className, style, left, right, bottom, hide, icon, iconWhite}) => {
  if (hide) return null;
  const classNames = cls("top-action btn_active", className, {
    "left": left,
    "right": right,
    "bottom": bottom,
    "top": !bottom,
    "icon-white": iconWhite
  })
  return (
    <div className={classNames}
         style={style}
         onClick={() => {
           if (onClick) {
             onClick()
           } else {
             if (icon === "back") {
               historyBack()
             }
           }
         }}>
      {Icons[icon || "back"]}
    </div>
  )
}

export const EmptyView = ({tips}) => {
  return (
    <div className={"page-full-notice"}>
      <div className={"big-icon"}>
        {
          Icons['freeBreakfast']
        }
      </div>
      <div className="notice-tips">{tips || "暂无内容"}</div>
    </div>
  )
}
