import React from 'react'

export function WeFormTips({children}) {
  return (
    <div className="weui-form__tips-area">
      <p className="weui-form__tips">
        {children}
      </p>
    </div>
  )
}

export default WeFormTips;
