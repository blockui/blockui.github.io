import React, {Fragment} from 'react'
import cls from 'classnames'
import {Icons} from "components/Icons";
import PropTypes from "prop-types";
import {locationHash} from "../functions/common";

const WeCell = (props) => {
  const {
    title,
    badgeDot,
    img,
    children,
    head,
    footTips,
    footStyle,
    className,
    foot,
    icon,
    iconColor,
    placeholder,
    hide,
    active,
    desc,
    selected,
    access,
    primary,
    component,
    subCell,
    checkBox,
    checked,
    to,
    ...other
  } = props;
  if (hide) return null
  const classNames = cls(
    "weui-cell " + (className || ""),
    {
      "weui-cell_seelcted": selected,
      "weui-cell_active": active,
      "weui-cell_access": access
    }
  )
  const className_hd = cls(
    "weui-cell__hd",
  )
  const className_bd = cls(
    "weui-cell__bd",
    {
      "weui-cell_primary": primary,
      "flex_collum": desc,
    }
  )
  const className_ft = cls("weui-cell__ft", {
    "weui-cell_ft_show_text": foot && ("" + foot).length > 0,
    "weui-cells_checkbox": checkBox,
  })

  const href = component === "a" ? to : undefined

  const onClick = (e) => {
    props.onClick && props.onClick(e)
    if (to) {
      if (to.indexOf("#") === 0) {
        locationHash(to.substring(1))
      } else {
        window.location["href"] = to
      }
    }
  }
  const Foot = ({placeholder, footTips, foot}) => {
    if (foot && typeof foot === 'string' && foot.length > 0) {
      return (
        <span className={footTips ? "ft-tips" : undefined}>{foot}</span>
      )
    } else if (foot && typeof foot === 'object') {
      return foot
    } else {
      return (
        <span className={footTips ? "ft-tips" : undefined}>{placeholder}</span>
      )
    }
  }
  return (
    <Fragment>
      {
        React.createElement(component || "div", {className: classNames, ...other, href, onClick}, (
          <Fragment>
            <div className={className_hd}>
              {
                img &&
                <div className="icon">
                  {img}
                </div>
              }
              {
                icon &&
                <div className="icon" style={{color: iconColor}}>{Icons[icon]}</div>
              }

            </div>
            <div className={className_bd}>
              {children}
              {title && <span>{title}</span>}
              {
                desc &&
                <span className="desc">{desc}</span>
              }
            </div>
            <div className={className_ft} style={footStyle}>
              {
                checkBox &&
                (
                  <Fragment>
                    <input type="checkbox" onChange={() => {
                    }} className="weui-check" checked={checked ? "checked" : ""}/>
                    <i className="weui-icon-checked"/>
                  </Fragment>
                )
              }

              <Foot foot={foot} footTips={footTips} placeholder={placeholder}/>
              {
                (access && badgeDot && badgeDot(title)) &&
                <span className="weui-badge weui-badge_dot"/>
              }
            </div>
          </Fragment>
        ))
      }
      {
        subCell &&
        <div className={"sub-cell"}>
          {
            subCell
          }
        </div>
      }
    </Fragment>
  )
}
WeCell.propType = {
  title: PropTypes.string,
  badgeDot: PropTypes.func,
  img: PropTypes.element,
  head: PropTypes.string,
  className: PropTypes.string,
  desc: PropTypes.string,
  foot: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  placeholder: PropTypes.string,
  hide: PropTypes.bool,
  active: PropTypes.bool,
  selected: PropTypes.bool,
  access: PropTypes.bool,
  primary: PropTypes.bool,
  component: PropTypes.string,
  subCell: PropTypes.element,
  to: PropTypes.string,
}

export default WeCell;
