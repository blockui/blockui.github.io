import React, {Fragment} from 'react'
import cls from 'classnames'
import {locationHash} from "../functions/common";

const View = ({
                className,
                component,
                primary,
                width,
                hide,
                icon,
                style,
                onClick,
                mini,
                warn,
                disabled,
                to,
                loading,
                children,
                ...props
              }) => {
  if (hide) return null;
  const classNames = cls(
    "weui-btn",
    className,
    {
      "weui-btn_primary": primary === undefined ? true : primary,
      "weui-btn_warn": warn,
      "weui-btn_mini": mini,
      "weui-btn_loading": loading,
      "weui-btn_icon": icon,
      "weui-btn_disabled": disabled,
      "weui-btn_default": !(primary === undefined || primary || warn),
    }
  )
  const href = component === "a" ? (to || "") : undefined
  const _onClick = (e) => {
    if(disabled) return
    //todo event prevent default
    onClick && onClick(e)
    if (to) {
      if (to.indexOf("#") === 0) {
        locationHash(to.substring(1))
      } else {
        window.location["href"] = to
      }
    }
  }
  return React.createElement(component || "button", {
    style: {...style, width: width === undefined ? "auto" : width},
    className: classNames, ...props,
    href,
    onClick: _onClick
  }, (
    <Fragment>
      {
        loading &&
        <span className="weui-primary-loading weui-primary-loading_transparent">
            <i className="weui-primary-loading__dot"/>
        </span>
      }
      {icon && icon}
      {children}
    </Fragment>
  ))
}

export default View;
