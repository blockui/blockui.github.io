import React from 'react'
import cls from 'classnames'

export const WeMsg = ({title, desc, className, btnText, onClick, ...props}) => {
  const classNames = cls(className,
    {
      "weui-msg": true
    },
  )
  return (
    <div className={classNames} {...props}>
      <div className="weui-msg__text-area">
        <h2 className="weui-msg__title">{title}</h2>
        <p className="weui-msg__desc">{desc}</p>
      </div>
      <div className="weui-msg__opr-area">
        <p className="weui-btn-area">
          <span onClick={onClick} className="weui-btn weui-btn_primary">{btnText}</span>
        </p>
      </div>
    </div>
  )
}

