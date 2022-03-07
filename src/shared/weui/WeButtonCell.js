import React from 'react'
import cls from 'classnames'
import {Icons} from "components/Icons";

const WeButtonCell = ({
                        className,
                        icon,
                        iconColor,
                        hide,
                        img,
                        primary,
                        warn,
                        disabled,
                        to,
                        loading,
                        children,
                        ...props
                      }) => {
  if (hide) return null
  const classNames = cls(
    "weui-btn_cell",
    className,
    {
      "weui-btn_cell-primary": primary,
      "weui-btn_cell-warn": warn,
      "weui-btn_cell-loading": loading,
      "weui-btn_cell-disabled": disabled,
      "weui-btn_cell-default": !(primary || warn),
    }
  )
  return (
    <div className={classNames} {...props}>
      {
        loading &&
        <span className="weui-primary-loading weui-primary-loading_transparent">
                    <i className="weui-primary-loading__dot"/>
                </span>
      }
      {
        img &&
        <img alt={""} className={"weui-btn_cell__icon " + (img.className || "")} src={img.src || ""}/>
      }

      {
        icon &&
        <div className="weui-btn_cell__icon" style={{color: iconColor}}>
          {Icons[icon]}
        </div>
      }
      {children}
    </div>
  )
}


export default WeButtonCell
