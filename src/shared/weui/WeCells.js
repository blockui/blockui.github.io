import React from 'react'
import cls from 'classnames'

const WeCells = ({className, hide, children, ...props}) => {
  if (hide) return null
  const classNames = cls(
    "weui-cells",
    className
  )
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

export default WeCells;
