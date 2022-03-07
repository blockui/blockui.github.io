import React, {Fragment} from 'react'
import cls from "classnames"
import PropTypes from "prop-types";

const WeFormSelect = (props) => {
  const {
    onChange,
    label,
    hide,
    value,
    textAlign,
    items
  } = props;
  if (hide) return null
  const className = cls({
    "weui-cell": true,
    "weui-cell_active": false,
    "weui-cell_access": true,
    "weui-cell_select": true,
  })
  return (
    <Fragment>
      <div className={className}>
        <div className="weui-cell__hd">
          <label className="weui-label">
            {label}
          </label>
        </div>
        <div className="weui-cell__bd">
          <select
            style={{textAlign: textAlign || "right"}}
            value={value || ""}
            onChange={(e) => {
              onChange && onChange(e)
            }} className="weui-select">
            {
              items &&
              items.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>
              })
            }
          </select>
        </div>
        <div className="weui-cell__ft">

        </div>
      </div>
    </Fragment>
  )

}

WeFormSelect.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  hide: PropTypes.bool,
  checked: PropTypes.bool,
}

export default WeFormSelect;
