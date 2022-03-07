import React from 'react'
import cls from 'classnames'
import PropType from 'prop-types'

const WeUploadBox = ({id, onChange, onClick, className, hide, multiple, capture, accept}) => {
  const classNames = cls(
    "weui-uploader__input-box",
    className
  )
  const props = {
    id,
    accept: "image/*"
  }
  if (accept) {
    props['accept'] = accept
  }
  if (capture) {
    props['capture'] = "capture"
  }
  if (multiple) {
    props['multiple'] = "multiple"
  }
  return (
    <div style={{display: hide ? "none" : undefined}} className={classNames}>
      <input onClick={(e) => {
        onClick && onClick()
      }} onChange={(e) => {
        onChange && onChange(e)
      }} className="uploaderInput weui-uploader__input"
             type="file"
             {
               ...props
             }
      />
    </div>
  )
}

WeUploadBox.propType = {
  onClick: PropType.func,
  onChange: PropType.func,
  id: PropType.string,
  className: PropType.string,
  hide: PropType.bool,
  multiple: PropType.bool,
  capture: PropType.bool,
  accept: PropType.string,
}

export default WeUploadBox;
