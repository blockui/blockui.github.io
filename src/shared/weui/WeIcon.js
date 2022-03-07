import React from 'react'
import cls from 'classnames'
import PropTypes from "prop-types";
import {Icons} from "../../components/Icons";

const WeIcon = ({
                  onClick,
                  className,
                  style,
                  circle,
                  success,
                  successCircle,
                  successNoCircle,
                  successNoCircleThin,
                  warn,
                  waitingCircle,
                  download,
                  search,
                  clear,
                  arrowBold,
                  arrow,
                  close,
                  closeThin,
                  backArrow,
                  backArrowThin,
                  back,
                  backCircle,
                  cancel,
                  icon,
                  color,
                  inline,
                  ...props
                }) => {
  const classNames = cls(
    "weui-icon",
    className,
    {
      "weui-inline": inline,
      "weui-icon-circle": circle,
      "weui-icon-success": success,
      "weui-icon-success-circle": successCircle,
      "weui-icon-success-no-circle": successNoCircle,
      "weui-icon-success-no-circle-thin": successNoCircleThin,
      "weui-icon-warn": warn,
      "weui-icon-waiting-circle": waitingCircle,
      "weui-icon-download": download,
      "weui-icon-search": search,
      "weui-icon-cancel": cancel,
      "weui-icon-clear": clear,
      "weui-icon-arrow-bold": arrowBold,
      "weui-icon-arrow": arrow,
      "weui-icon-close": close,
      "weui-icon-close-thin": closeThin,
      "weui-icon-back-arrow": backArrow,
      "weui-icon-back": back,
      "weui-icon-back-circle": backCircle,
    }
  )
  if (Icons[icon]) {
    return <i className={classNames} style={style} {...props}>{Icons[icon]}</i>
  }

  return (
    <i onClick={onClick} className={classNames} style={style} {...props} />
  )
}

WeIcon.propTypes = {
  circle: PropTypes.bool,
  success: PropTypes.bool,
  successCircle: PropTypes.bool,
  successNoCircle: PropTypes.bool,
  successNoCircleThin: PropTypes.bool,
  warn: PropTypes.bool,
  waitingCircle: PropTypes.bool,
  download: PropTypes.bool,
  search: PropTypes.bool,
  clear: PropTypes.bool,
  arrowBold: PropTypes.bool,
  arrow: PropTypes.bool,
  close: PropTypes.bool,
  closeThin: PropTypes.bool,
  backArrow: PropTypes.bool,
  backArrowThin: PropTypes.bool,
  back: PropTypes.bool,
  backCircle: PropTypes.bool,
  cancel: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  color: PropTypes.string,
  inline: PropTypes.bool,
  icon: PropTypes.string,
}

export default WeIcon;
