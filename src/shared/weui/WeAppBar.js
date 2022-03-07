import React, {Fragment} from 'react'
import cls from 'classnames'
import {Icons} from "components/Icons";
import WeButton from "./WeButton";
import weui from "../weui-js";
import {historyBack} from "../functions/common";

const Buttons = ({items, right}) => {
  return (
    <Fragment>
      {(items && items.length > 0) && items.map(({onClick, actions, button, hide, to, text, icon}, i) => {
        if (hide) return false;
        return (
          <div key={i}
               className={right ? "top-icon right" : "top-icon left"}
               onClick={(e) => {
                 if (to) {
                   return window.location.hash = to
                 }
                 if (onClick) {
                   onClick(e)
                 } else {
                   if (icon === "back") {
                     historyBack()
                   }
                   if (actions) {
                     weui.actionSheet(actions, []);
                   }
                 }
               }}>
            {
              Icons[icon] || icon
            }
            {
              text && (<span>{text}</span>)
            }
            {
              button && (<WeButton primary>{button}</WeButton>)
            }
          </div>
        )
      })
      }
    </Fragment>
  )
}
const TitleBar = ({title}) => {
  if (!title) return null;
  if (typeof title === "string") {
    return (
      <h2>
        {title}
      </h2>
    )
  } else {
    return (
      <Fragment>
        {title}
      </Fragment>
    )
  }
}
const WeAppBar = ({title, left, right, subHeader, style, className, component, ...props}) => {
  const classNames = cls(
    "weui-app-bar",
    className
  )
  return (
    <header {...props} style={style} className={classNames}>
      {
        component ?
          component :
          <div className={"header-inner"}>
            <Buttons items={left}/>
            <TitleBar title={title}/>
            <Buttons items={[...right || []]} right/>
          </div>

      }
      {subHeader}
    </header>
  )
}

export default WeAppBar
