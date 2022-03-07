import React from 'react'
import cls from 'classnames'
import PropTypes from "prop-types";

const WeProgress = ({percent, onCancel, style, className}) => {
  const classNames = cls(className, {"weui-progress": true})
  return (
    <div className={classNames} style={style}>
      <div className="weui-progress__bar">
        <div className="weui-progress__inner-bar js_progress" style={{width: `${percent || 0}%`}}/>
      </div>
      {
        onCancel &&
        <div className="weui-progress__opr">
          <i className="weui-icon-cancel" onClick={onCancel}/>
        </div>
      }
    </div>
  )
}

WeProgress.propType = {
  percent: PropTypes.number,
  onCancel: PropTypes.func,
  className: PropTypes.string,
  styles: PropTypes.object
}

export default WeProgress;
