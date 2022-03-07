import React, {Fragment} from 'react'
import cls from "classnames"
import PropTypes from "prop-types";

const WeFormSwitch = (props) => {
  const {
    onChange,
    label,
    labelWidth,
    hide,
    checked
  } = props;
  if (hide) return null
  const _onChange = (e) => {
    onChange && onChange(e.target.checked, e)
  }
  const className = cls({
    "weui-cell": true,
    "weui-cell_active": true,
    "weui-cell_switch": true,
  })

  return (
    <Fragment>
      <div className={className}>
        <div className="weui-cell__bd">
          <label className="weui-label" style={{width:labelWidth}} >
            {label}
          </label>
        </div>
        <div className="weui-cell__ft">
          <input checked={!!checked} onChange={_onChange} className="weui-switch"
                 type="checkbox"/>
        </div>
      </div>
    </Fragment>
  )

}

WeFormSwitch.propTypes = {
  onChange: PropTypes.func,
  labelWidth:PropTypes.number,
  label: PropTypes.string,
  hide: PropTypes.bool,
  checked: PropTypes.bool,
}

export default WeFormSwitch;
