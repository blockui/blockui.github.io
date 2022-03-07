import React from 'react'
import cls from 'classnames'

const WeFlexItem = ({className, hide, children, ...props}) => {
  if (hide) return null;
  const classNames = cls(
    "weui-flex__item",
    className
  )
  return (
    <div className={classNames} {...props}>{children}</div>
  )
}

export default WeFlexItem;
