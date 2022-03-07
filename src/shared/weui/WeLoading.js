import React from 'react'
import cls from 'classnames'
import PropTypes from "prop-types";

const WeLoading = ({className, primary, brand, transparent, style, ...props}) => {

  if (primary) {
    const classNames = cls(
      "weui-primary-loading",
      className,
      {
        "weui-primary-loading_brand": brand,
        "weui-primary-loading_transparent": transparent
      }
    )
    return (
      <span className={classNames}>
        <span className="weui-primary-loading__dot"/>
      </span>
    )
  } else {
    const classNames = cls(
      "weui-loading",
      className,
    )
    return (
      <i className={classNames} style={style} {...props} />
    )
  }

}

WeLoading.propTypes = {
  primary: PropTypes.bool,
  brand: PropTypes.bool,
  transparent: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
}

export default WeLoading;
