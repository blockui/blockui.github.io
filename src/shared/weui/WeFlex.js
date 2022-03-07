import React from 'react'
import cls from 'classnames'

const WeFlex = ({className, hide,children, ...props}) => {
  if(hide) return null;
  const classNames = cls(
    "weui-flex",
    className
  )
  return (
    <div className={classNames} {...props}>{children}</div>
  )
}

export default WeFlex;
