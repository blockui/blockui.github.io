import React from 'react'


export function WeFormFooter({link, text}) {
  return (
    <div className="weui-form__extra-area">
      <div className="weui-footer">
        <p className="weui-footer__links">
          <span className="weui-footer__link">{link}</span>
        </p>
        <p className="weui-footer__text">{text}</p>
      </div>
    </div>
  )
}


export default WeFormFooter;
