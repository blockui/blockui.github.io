import React from 'react'
import cls from 'classnames'

const View = ({title, className, children, ...props}) => {
  const classNames = cls(
    "weui-cells__title",
    className
  )
  return (
    <div className={classNames} {...props}>{children}</div>
  )
}

export default View
