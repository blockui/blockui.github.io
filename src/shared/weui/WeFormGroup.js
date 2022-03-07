import React from 'react'

export function WeFormGroup({title, hide, style, className, titleClassName, desc, children}) {
  if (hide) return null
  return (
    <div className={`weui-cells__group weui-cells__group_form ${className || ""}`} style={style}>
      {
        title &&
        <div className={"weui-cells__title " + (titleClassName || "") + ((desc && desc.length) ? "" : " pb_0")}>
          {title}
          {
            desc && desc.length > 0 &&
            <div className="weui-cells__title_desc">
              {desc}
            </div>
          }
        </div>
      }
      <div className="weui-cells weui-cells_form">
        {children}
      </div>

    </div>
  )
}

export default WeFormGroup;
