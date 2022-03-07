import React from 'react'
import WeButton from "./WeButton";


export function WeFormButton({wrapClassNames, ...props}) {
  return (
    <div className={"weui-form__opr-area " + (wrapClassNames || "")}>
      <WeButton {...props}/>
    </div>
  )
}


export default WeFormButton;
