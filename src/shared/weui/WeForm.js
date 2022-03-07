import React from 'react'
import cls from 'classnames'

export WeFormInput from './WeFormInput'
export WeFormGroup from './WeFormGroup'
export WeFormTips from './WeFormTips'
export WeFormFooter from './WeFormFooter'
export WeFormTextArea from './WeFormTextArea'
export WeFormButton from './WeFormButton'

const WeForm = ({className, classNameControl, hide, title, desc, children, ...props}) => {
  if (hide) return null
  const classNames = cls(
    "weui-form",
    className
  )
  const classNamesControl = cls(
    "weui-form__control-area",
    classNameControl
  )
  return (
    <div className={classNames} {...props}>
      {
        title &&
        <div className="weui-form__text-area">
          <h2 className="weui-form__title">{title}</h2>
          {
            desc &&
            <div className="weui-form__desc">{desc}</div>
          }
        </div>
      }
      <div className={classNamesControl}>
        {children}
      </div>
    </div>
  )
}

export default WeForm;
